import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/utils/supabase/server';
import { getServerUser } from '@/utils/dev-auth';

const ALLOWED_TYPES = new Set(['buyers', 'competitors']);

export async function GET(request: NextRequest) {
  const sessionClient = await createClient();
  const { user } = await getServerUser(sessionClient);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'buyers';

  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  if (!q || q.length < 3) {
    return NextResponse.json({ data: [] });
  }

  if (q.length > 200) {
    return NextResponse.json({ error: 'Query too long' }, { status: 400 });
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
