import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/utils/supabase/server';
import { getServerUser, getDataClient } from '@/utils/dev-auth';
import { hasAccess } from '@/lib/tier-config';

export async function GET(request: NextRequest) {
  const sessionClient = await createClient();
  const { user } = await getServerUser(sessionClient);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Tier check — buyer tenders requires Pro+
  const db = await getDataClient(sessionClient);
  const { data: profile } = await db
    .from('clients')
    .select('tier')
    .eq('email', user.email)
    .single();

  if (!hasAccess(profile?.tier, 'buyerIntel')) {
    return NextResponse.json(
      { error: 'Pro plan required for intelligence features.' },
      { status: 403 },
    );
  }

  const { searchParams } = request.nextUrl;
  const buyerName = searchParams.get('buyer_name');

  if (!buyerName) {
    return NextResponse.json({ error: 'buyer_name is required' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tenders')
    .select('tender_id, tender_uuid, title, cpv_code, estimated_value, final_contract_value, winners_list, publication_date, submission_deadline, is_active, procedure_type')
    .eq('buyer_name', buyerName)
    .order('publication_date', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Buyer tender lists change only on daily sync — cache at CDN for 5 min, stale for 30 min
  return NextResponse.json({ data: data || [] }, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800' },
  });
}
