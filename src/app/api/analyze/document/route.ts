import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getServerUser, getDataClient } from '@/utils/dev-auth';
import { createAdminClient } from '@/utils/supabase/admin';
import { getCloudRunAuthHeader } from '@/lib/gcp-auth';
import { isSafeUrl } from '@/lib/security';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_DOC_BYTES = 50 * 1024 * 1024; // 50 MB
const ALLOWED_CONTENT_TYPES = new Set(['application/pdf', 'application/zip', 'application/octet-stream', 'text/plain', 'application/x-zip-compressed']);

// Enterprise: 10 analyses per hour. Pro: 5 per month. Free: blocked.
const ENTERPRISE_ANALYZE_LIMIT = 10;
const ENTERPRISE_ANALYZE_WINDOW_MS = 60 * 60_000;
const PRO_ANALYZE_LIMIT = 5;
const PRO_ANALYZE_WINDOW_MS = 30 * 24 * 60 * 60_000;

const ENTERPRISE_TIERS = new Set(['Enterprise', 'Professional']); // Professional is legacy Enterprise
const PRO_TIERS = new Set(['Pro', 'Starter']);                     // Starter is legacy Pro

export async function POST(request: Request) {
  try {
    const sessionClient = await createClient();
    const { user } = await getServerUser(sessionClient);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Determine user tier
    const db = await getDataClient(sessionClient);
    const { data: profile } = await db.from('clients').select('tier').eq('email', user.email).single();
    const tier = profile?.tier || 'free';
    const isEnterprise = ENTERPRISE_TIERS.has(tier);
    const isPro = PRO_TIERS.has(tier);

    if (isEnterprise) {
      // Enterprise users: 10 per hour (unlimited for practical purposes)
      const rl = checkRateLimit(`analyze:${user.id}`, ENTERPRISE_ANALYZE_LIMIT, ENTERPRISE_ANALYZE_WINDOW_MS);
      if (!rl.allowed) {
        return NextResponse.json(
          { error: 'Rate limit reached. You can analyse up to 10 documents per hour.' },
          { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
        );
      }
    } else if (isPro) {
      // Pro users: 5 per month
      const rl = checkRateLimit(`analyze-pro:${user.id}`, PRO_ANALYZE_LIMIT, PRO_ANALYZE_WINDOW_MS);
      if (!rl.allowed) {
        return NextResponse.json(
          { error: 'Pro plan limit reached (5/month). Upgrade to Enterprise for unlimited AI analysis.', code: 'PRO_LIMIT', remaining: rl.remaining, resetAt: rl.resetAt },
          { status: 403 }
        );
      }
    } else {
      // Free users: blocked
      return NextResponse.json(
        { error: 'AI document analysis requires a Pro or Enterprise plan.', code: 'FREE_LIMIT' },
        { status: 403 }
      );
    }

    const payload = await request.json().catch(() => ({}));
    const { tenderId, documentUrl } = payload;

    if (!tenderId) return NextResponse.json({ error: 'Missing tenderId' }, { status: 400 });

    // Validate user-supplied documentUrl to prevent SSRF
    if (documentUrl && !isSafeUrl(documentUrl)) {
      return NextResponse.json({ error: 'Invalid document URL' }, { status: 400 });
    }

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
    // documentUrl already validated above; DB URLs are trusted
    if (documentUrl && isSafeUrl(documentUrl)) rawUrls.push(documentUrl);
    
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
        console.debug(`[AnalyzeAPI] Fetching: ${url}`);
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Winly/1.0' },
          cache: 'no-store',
          signal: AbortSignal.timeout(20_000),
        });
        if (!res.ok) continue;

        // Validate content type
        const ct = res.headers.get('content-type')?.split(';')[0].trim() || '';
        const isAllowedType = ALLOWED_CONTENT_TYPES.has(ct) || ct.includes('pdf') || ct.includes('zip') || ct.includes('octet');
        if (!isAllowedType) { console.warn(`[AnalyzeAPI] Blocked content-type: ${ct}`); continue; }

        const buffer = await res.arrayBuffer();
        if (buffer.byteLength < 500) continue;
        if (buffer.byteLength > MAX_DOC_BYTES) { console.warn(`[AnalyzeAPI] File too large: ${buffer.byteLength}`); continue; }
        
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
    const authHeader = await getCloudRunAuthHeader(analyticsApiUrl);

    const formData = new FormData();
    formData.append('file', extractedFile, fileName);

    const analyticsResponse = await fetch(`${analyticsApiUrl}/api/v1/tender/upload`, {
      method: 'POST',
      headers: authHeader ? { Authorization: authHeader } : {},
      body: formData,
      signal: AbortSignal.timeout(120_000), // 2 min for AI processing
    });

    if (!analyticsResponse.ok) {
      const errText = await analyticsResponse.text();
      console.error('[AnalyzeAPI] Microservice error:', errText);
      return NextResponse.json({ error: 'Document analytics microservice failed' }, { status: 502 });
    }

    const insights = await analyticsResponse.json();

    // Guard against error responses returned with 200 status
    if (insights.error && !insights['pt-PT']) {
      console.error('[AnalyzeAPI] Microservice returned error:', insights.error);
      return NextResponse.json({ error: insights.error }, { status: 502 });
    }

    // Store both locale keys + category; strip session_id and raw_text
    const { session_id, raw_text, ...cleanInsights } = insights;

    await supabase.from('tenders').update({ insights: cleanInsights }).eq('tender_uuid', tenderId);
    return NextResponse.json({ success: true, insights: cleanInsights, fetchedFrom, session_id });

  } catch (err: any) {
    console.error('[AnalyzeAPI] Fatal:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
