import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const { tenderId, documentUrl } = payload;

    if (!tenderId) return NextResponse.json({ error: 'Missing tenderId' }, { status: 400 });

    const supabase = createAdminClient();

    // 1. Fetch Tender Details
    const { data: tender, error: fetchError } = await supabase
      .from('tenders')
      .select('tender_id, procedure_documents_url, document_urls, title, insights, description')
      .eq('tender_uuid', tenderId)
      .single();

    if (fetchError || !tender) return NextResponse.json({ error: 'Tender not found' }, { status: 404 });

    // 2. Collect and Prioritize URLs
    const rawUrls: string[] = [];
    if (documentUrl?.startsWith('http')) rawUrls.push(documentUrl);
    
    [tender.procedure_documents_url, tender.document_urls].forEach(field => {
      if (field) field.split(',').forEach((u: string) => {
        const t = u.trim();
        if (t.startsWith('http') && !rawUrls.includes(t)) rawUrls.push(t);
      });
    });

    const urlsToTry = [
      ...rawUrls.filter(u => u.includes('donwloadProcedurePiece') || u.toLowerCase().endsWith('.zip')),
      ...rawUrls.filter(u => u.toLowerCase().endsWith('.pdf') || u.includes('diariodarepublica.pt')),
      ...rawUrls.filter(u => !u.toLowerCase().endsWith('.pdf') && !u.includes('diariodarepublica.pt') && !u.toLowerCase().endsWith('.zip'))
    ];

    let extractedFile: Blob | null = null;
    let fetchedFrom = '';
    let fileName = '';

    for (const url of urlsToTry) {
      try {
        console.log(`[AnalyzeAPI] Fetching: ${url}`);
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' });
        if (!res.ok) continue;

        const buffer = await res.arrayBuffer();
        if (buffer.byteLength < 500) continue;
        
        extractedFile = new Blob([buffer]);
        fetchedFrom = url;
        
        const contentDisposition = res.headers.get('content-disposition');
        if (contentDisposition && contentDisposition.includes('filename=')) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match) fileName = match[1];
        }
        
        if (!fileName) {
          if (url.toLowerCase().endsWith('.zip')) fileName = 'document.zip';
          else if (url.toLowerCase().endsWith('.pdf')) fileName = 'document.pdf';
          else fileName = 'document.bin';
        }
        break;
      } catch (e) {
        console.warn(`Error with ${url}`);
      }
    }

    // DB Fallback
    if (!extractedFile && (tender.description?.length || 0) > 500) {
      extractedFile = new Blob([tender.description], { type: 'text/plain' });
      fetchedFrom = 'database_description';
      fileName = 'description.txt';
    }

    if (!extractedFile) return NextResponse.json({ error: 'Inaccessible documents.' }, { status: 422 });

    // 3. AI Generation via Microservice
    const analyticsApiUrl = process.env.DOCUMENT_ANALYTICS_API_URL || 'http://localhost:8000';
    
    const formData = new FormData();
    formData.append('file', extractedFile, fileName);

    const analyticsResponse = await fetch(`${analyticsApiUrl}/api/v1/tender/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!analyticsResponse.ok) {
      const errText = await analyticsResponse.text();
      console.error('[AnalyzeAPI] Microservice error:', errText);
      return NextResponse.json({ error: 'Document analytics microservice failed' }, { status: 502 });
    }

    const insights = await analyticsResponse.json();

    // Remove raw_text or session_id to only store structured fields
    const { session_id, raw_text, ...cleanInsights } = insights;

    await supabase.from('tenders').update({ insights: cleanInsights }).eq('tender_uuid', tenderId);
    return NextResponse.json({ success: true, insights: cleanInsights, fetchedFrom });

  } catch (err: any) {
    console.error('[AnalyzeAPI] Fatal:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
