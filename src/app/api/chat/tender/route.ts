import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    // Check tier
    const { data: profile } = await supabase
      .from('clients')
      .select('tier, name, services, tech_stack')
      .eq('email', user.email)
      .single();

    if (!profile || profile.tier === 'free') {
      return NextResponse.json({ error: 'Pro plan required' }, { status: 403 });
    }

    const { tenderId, question, conversationHistory } = await request.json();
    if (!tenderId || !question) {
      return NextResponse.json({ error: 'Missing tenderId or question' }, { status: 400 });
    }

    // Fetch ALL tender data for rich context
    const { data: tender, error } = await supabase
      .from('tenders')
      .select('tender_id, title, buyer_name, description, insights, estimated_value, currency, country, cpv_code, cpv_description, submission_deadline, procedure_type, is_active')
      .eq('tender_uuid', tenderId)
      .single();

    if (error || !tender) return NextResponse.json({ error: 'Tender not found' }, { status: 404 });

    // Fetch match data
    const { data: matchData } = await supabase
      .from('tender_matches')
      .select('match_score, match_reasons, win_probability')
      .eq('tender_uuid', tenderId)
      .eq('client_id', profile.name)
      .maybeSingle();

    // Fetch buyer intel
    const { data: buyerIntel } = await supabase
      .from('intel_buyers')
      .select('persona_name, avg_discount, avg_bidder_count, top_winners')
      .eq('name', tender.buyer_name)
      .single();

    const analyticsApiUrl = process.env.DOCUMENT_ANALYTICS_API_URL || 'http://localhost:8000';

    const res = await fetch(`${analyticsApiUrl}/api/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        conversation_history: conversationHistory || [],
        context: {
          tender: {
            title: tender.title,
            buyer_name: tender.buyer_name,
            description: tender.description?.substring(0, 3000),
            estimated_value: tender.estimated_value,
            currency: tender.currency,
            country: tender.country,
            cpv_code: tender.cpv_code,
            cpv_description: tender.cpv_description,
            submission_deadline: tender.submission_deadline,
            procedure_type: tender.procedure_type,
          },
          insights: tender.insights,
          match: matchData ? {
            score: matchData.match_score,
            reasons: matchData.match_reasons,
            win_probability: matchData.win_probability,
          } : null,
          buyer: buyerIntel ? {
            persona: buyerIntel.persona_name,
            avg_discount: buyerIntel.avg_discount,
            avg_bidders: buyerIntel.avg_bidder_count,
            top_competitors: buyerIntel.top_winners?.slice(0, 5),
          } : null,
          company: {
            name: profile.name,
            services: profile.services,
            tech_stack: profile.tech_stack,
          },
        },
      }),
    });

    if (!res.ok) {
      console.error('[ChatAPI] Microservice error:', await res.text());
      return NextResponse.json({ error: 'Chat service unavailable' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[ChatAPI] Fatal:', err);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
