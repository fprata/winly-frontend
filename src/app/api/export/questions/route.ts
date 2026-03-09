import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getServerUser, getDataClient } from '@/utils/dev-auth';
import { getCloudRunAuthHeader } from '@/lib/gcp-auth';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { user } = await getServerUser(supabase);
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const db = await getDataClient(supabase);

    // Check tier
    const { data: profile } = await db
      .from('clients')
      .select('tier')
      .eq('email', user.email)
      .single();

    if (!profile || profile.tier === 'free') {
      return NextResponse.json({ error: 'Pro plan required' }, { status: 403 });
    }

    const { tenderId } = await request.json();
    if (!tenderId) return NextResponse.json({ error: 'Missing tenderId' }, { status: 400 });

    // Fetch tender + insights
    const { data: tender, error } = await db
      .from('tenders')
      .select('tender_id, title, buyer_name, insights, description, estimated_value, currency')
      .eq('tender_uuid', tenderId)
      .single();

    if (error || !tender) return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
    if (!tender.insights) return NextResponse.json({ error: 'No insights available' }, { status: 422 });

    const analyticsApiUrl = process.env.DOCUMENT_ANALYTICS_API_URL || 'http://localhost:8000';
    const authHeader = await getCloudRunAuthHeader(analyticsApiUrl);

    const res = await fetch(`${analyticsApiUrl}/api/v1/tender/export-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      signal: AbortSignal.timeout(60_000),
      body: JSON.stringify({
        tender_id: tender.tender_id,
        title: tender.title,
        buyer_name: tender.buyer_name,
        insights: tender.insights,
        description: tender.description,
        estimated_value: tender.estimated_value,
        currency: tender.currency,
      }),
    });

    if (!res.ok) {
      console.error('[ExportQuestions] Microservice error:', await res.text());
      return NextResponse.json({ error: 'Questions export failed' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[ExportQuestions] Fatal:', err);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
