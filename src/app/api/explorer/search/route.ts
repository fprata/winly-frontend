import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/utils/supabase/server';
import { getServerUser } from '@/utils/dev-auth';

const ALLOWED_SORTS = new Set(['newest', 'valueDesc', 'valueAsc', 'matchScore']);
const ALLOWED_STATUSES = new Set(['All', 'active', 'inactive', 'awarded']);

export async function GET(request: NextRequest) {
  const sessionClient = await createClient();
  const { user } = await getServerUser(sessionClient);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const q = (searchParams.get('q') || '').slice(0, 500); // cap query length
  const country = searchParams.get('country') || 'All';
  const cpv = searchParams.get('cpv') || 'All';
  const minValue = searchParams.get('minValue');
  const maxValue = searchParams.get('maxValue');
  const rawStatus = searchParams.get('status') || 'All';
  const rawSort = searchParams.get('sort') || 'newest';
  const page = Math.max(0, parseInt(searchParams.get('page') || '0'));
  const pageSize = 15;

  // Whitelist enum-like params to prevent unexpected filter injection
  const status = ALLOWED_STATUSES.has(rawStatus) ? rawStatus : 'All';
  const sort = ALLOWED_SORTS.has(rawSort) ? rawSort : 'newest';

  const supabase = createAdminClient();

  const COLUMNS = 'tender_id, tender_uuid, title, buyer_name, estimated_value, final_contract_value, currency, publication_date, submission_deadline, country, cpv_code, is_active, tender_matches(match_score)';

  let query = supabase
    .from('tenders')
    .select(COLUMNS, { count: 'estimated' });

  if (q) {
    query = query.textSearch('search_vector', q, { type: 'websearch', config: 'public.portuguese_unaccent' });
  }
  if (country !== 'All') query = query.eq('country', country);
  if (cpv !== 'All') query = query.ilike('cpv_code', `${cpv}%`);
  if (minValue) query = query.gte('estimated_value', parseFloat(minValue));
  if (maxValue) query = query.lte('estimated_value', parseFloat(maxValue));
  if (status === 'active') query = query.eq('is_active', true);
  else if (status === 'inactive') query = query.eq('is_active', false);
  else if (status === 'awarded') query = query.not('final_contract_value', 'is', null);

  if (sort === 'valueDesc') query = query.order('estimated_value', { ascending: false, nullsFirst: false });
  else if (sort === 'valueAsc') query = query.order('estimated_value', { ascending: true, nullsFirst: false });
  else query = query.order('publication_date', { ascending: false });

  const { data, count, error } = await query.range(page * pageSize, (page + 1) * pageSize - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [], count: count || 0 });
}
