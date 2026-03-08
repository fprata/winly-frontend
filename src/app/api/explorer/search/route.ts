import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q') || '';
  const country = searchParams.get('country') || 'All';
  const cpv = searchParams.get('cpv') || 'All';
  const minValue = searchParams.get('minValue');
  const maxValue = searchParams.get('maxValue');
  const status = searchParams.get('status') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '0');
  const pageSize = 15;

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
