import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'buyers'; // 'buyers' or 'competitors'

  if (!q || q.length < 3) {
    return NextResponse.json({ data: [] });
  }

  const supabase = createAdminClient();

  // Cache search results for 60 s at the CDN edge; serve stale for up to 5 min while revalidating
  const cacheHeaders = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  };

  if (type === 'competitors') {
    const { data, error } = await supabase
      .from('intel_competitors')
      .select('name, country, total_wins, competitor_id, total_revenue, avg_discount_pct')
      .ilike('name', `%${q}%`)
      .limit(10);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data || [] }, { headers: cacheHeaders });
  }

  // Default: buyers
  const { data, error } = await supabase
    .from('intel_buyers')
    .select('name, country, total_contracts, buyer_company_id, total_spend, avg_discount, avg_bidder_count')
    .ilike('name', `%${q}%`)
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [] }, { headers: cacheHeaders });
}
