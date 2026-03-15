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

    const ENTERPRISE_TIERS = new Set(['Enterprise', 'Professional']);
    if (!profile || !ENTERPRISE_TIERS.has(profile.tier)) {
      return NextResponse.json({ error: 'Enterprise plan required for PDF export.' }, { status: 403 });
    }

    const { tenderId } = await request.json();
    if (!tenderId) return NextResponse.json({ error: 'Missing tenderId' }, { status: 400 });

    // Fetch tender + insights
    const { data: tender, error } = await db
      .from('tenders')
      .select('tender_id, title, buyer_name, insights, estimated_value, currency, country, cpv_code')
      .eq('tender_uuid', tenderId)
      .single();

    if (error || !tender) return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
    if (!tender.insights) return NextResponse.json({ error: 'No insights available' }, { status: 422 });

    const analyticsApiUrl = process.env.DOCUMENT_ANALYTICS_API_URL || 'http://localhost:8000';
    const authHeader = await getCloudRunAuthHeader(analyticsApiUrl);

    const res = await fetch(`${analyticsApiUrl}/api/v1/tender/export-pdf`, {
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
        estimated_value: tender.estimated_value,
        currency: tender.currency,
        country: tender.country,
      }),
    });

    if (!res.ok) {
      console.error('[ExportPDF] Microservice error:', await res.text());
      return NextResponse.json({ error: 'PDF export failed' }, { status: 502 });
    }

    const pdfBuffer = await res.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="tender-insights-${tenderId}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error('[ExportPDF] Fatal:', err);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
