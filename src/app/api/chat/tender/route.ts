import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getServerUser, getDataClient } from '@/utils/dev-auth';
import { getCloudRunAuthHeader } from '@/lib/gcp-auth';
import { checkRateLimit } from '@/lib/rate-limit';

// 20 chat messages per user per minute
const CHAT_LIMIT = 20;
const CHAT_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { user } = await getServerUser(supabase);
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const rl = checkRateLimit(`chat:${user.id}`, CHAT_LIMIT, CHAT_WINDOW_MS);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const db = await getDataClient(supabase);

    // Check tier
    const { data: profile } = await db
      .from('clients')
      .select('id, tier, name, services, tech_stack')
      .eq('email', user.email)
      .single();

    if (!profile || profile.tier === 'free') {
      return NextResponse.json({ error: 'Pro plan required' }, { status: 403 });
    }

    const { tenderId, question, conversationHistory, locale } = await request.json();
    if (!tenderId || !question) {
      return NextResponse.json({ error: 'Missing tenderId or question' }, { status: 400 });
    }

    // Fetch ALL tender data for rich context
    const { data: tender, error } = await db
      .from('tenders')
      .select('tender_id, title, buyer_name, description, insights, estimated_value, currency, country, cpv_code, cpv_description, submission_deadline, procedure_type, is_active')
      .eq('tender_uuid', tenderId)
      .single();

    if (error || !tender) return NextResponse.json({ error: 'Tender not found' }, { status: 404 });

    // Fetch match data
    const { data: matchData } = await db
      .from('tender_matches')
      .select('match_score, match_reasons, win_probability')
      .eq('tender_uuid', tenderId)
      .eq('client_id', profile.id)
      .maybeSingle();

    // Fetch buyer intel
    const { data: buyerIntel } = await db
      .from('intel_buyers')
      .select('persona_name, avg_discount, avg_bidder_count, top_winners')
      .eq('name', tender.buyer_name)
      .single();

    const analyticsApiUrl = process.env.DOCUMENT_ANALYTICS_API_URL || 'http://localhost:8000';

    const context = {
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
    };

    const authHeader = await getCloudRunAuthHeader(analyticsApiUrl);

    // Try Cloud Run microservice first
    try {
      const res = await fetch(`${analyticsApiUrl}/api/v1/tender/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        signal: AbortSignal.timeout(30_000),
        body: JSON.stringify({
          question,
          conversation_history: conversationHistory || [],
          context,
          locale: locale || 'en',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }

      console.warn('[ChatAPI] Microservice returned', res.status, '- falling back to context-based response');
    } catch (fetchErr) {
      console.warn('[ChatAPI] Microservice unreachable - falling back to context-based response');
    }

    // Fallback: generate a context-based response from the data we already have
    const fallbackResponse = generateFallbackResponse(question, context, locale || 'en');
    return NextResponse.json({ response: fallbackResponse });
  } catch (err: any) {
    console.error('[ChatAPI] Fatal:', err);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}

function fmtCurrency(val: number, currency?: string, locale?: string): string {
  return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-IE', {
    style: 'currency',
    currency: currency || 'EUR',
    maximumFractionDigits: 0,
  }).format(val);
}

function fmtDate(dateStr: string, locale?: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

const labels: Record<string, Record<string, string>> = {
  en: {
    riskLevel: 'Risk Level',
    overallScore: 'Overall Score',
    keyRiskFactors: 'Key risk factors',
    noRiskData: 'No risk assessment data available yet.\n\nGenerate insights from the **AI Insights** tab to extract risk factors from the tender documents.',
    likelyCompetitors: 'Likely competitors',
    pastWins: 'past wins with this buyer',
    buyerPersona: 'Buyer persona',
    avgBidders: 'Avg. bidders per tender',
    noCompetitorData: 'No historical competitor data available for this buyer.\n\nThis could mean the buyer is new or operates in a fragmented market.',
    incumbentsMentioned: 'Incumbents mentioned in docs',
    pricingAnalysis: 'Pricing Analysis',
    estimatedValue: 'Estimated value',
    budgetFromDocs: 'Budget from docs',
    recommendation: 'Recommendation',
    buyerDiscount: 'This buyer awards at an avg. discount of',
    suggestedBid: 'Suggested bid target',
    evalWeights: 'Evaluation weights',
    price: 'Price',
    quality: 'Quality',
    noPricingData: 'No pricing data available for this tender yet.',
    keyRequirements: 'Key Requirements',
    mandatoryCerts: 'Mandatory certifications',
    evalCriteria: 'Evaluation criteria',
    priceWeight: 'Price weight',
    qualityWeight: 'Quality weight',
    timeline: 'Timeline',
    contractDuration: 'Contract duration',
    months: 'months',
    submissionDeadline: 'Submission deadline',
    demoRequired: 'Demo required',
    yes: 'Yes',
    no: 'No',
    lockinRisks: 'Lock-in risks',
    generateInsights: 'Generate AI insights from the **AI Insights** tab to extract detailed requirements from the tender documents.',
    buyer: 'Buyer',
    market: 'Market',
    value: 'Value',
    deadline: 'Deadline',
    procedure: 'Procedure',
    matchScore: 'Match score',
    winProbability: 'Win probability',
    summary: 'Summary',
    askMore: 'Try asking about **risks**, **competitors**, **pricing**, or **requirements** for deeper analysis.',
  },
  pt: {
    riskLevel: 'Nível de Risco',
    overallScore: 'Pontuação Geral',
    keyRiskFactors: 'Principais fatores de risco',
    noRiskData: 'Dados de avaliação de risco não disponíveis.\n\nGere insights a partir do separador **Insights IA** para extrair fatores de risco dos documentos do concurso.',
    likelyCompetitors: 'Concorrentes prováveis',
    pastWins: 'vitórias anteriores com este comprador',
    buyerPersona: 'Persona do comprador',
    avgBidders: 'Média de licitadores por concurso',
    noCompetitorData: 'Sem dados históricos de concorrentes para este comprador.\n\nIsto pode significar que o comprador é novo ou opera num mercado fragmentado.',
    incumbentsMentioned: 'Incumbentes mencionados nos documentos',
    pricingAnalysis: 'Análise de Preço',
    estimatedValue: 'Valor estimado',
    budgetFromDocs: 'Orçamento dos documentos',
    recommendation: 'Recomendação',
    buyerDiscount: 'Este comprador adjudica com um desconto médio de',
    suggestedBid: 'Valor alvo de licitação',
    evalWeights: 'Pesos de avaliação',
    price: 'Preço',
    quality: 'Qualidade',
    noPricingData: 'Dados de preço não disponíveis para este concurso.',
    keyRequirements: 'Requisitos Principais',
    mandatoryCerts: 'Certificações obrigatórias',
    evalCriteria: 'Critérios de avaliação',
    priceWeight: 'Peso do preço',
    qualityWeight: 'Peso da qualidade',
    timeline: 'Cronograma',
    contractDuration: 'Duração do contrato',
    months: 'meses',
    submissionDeadline: 'Prazo de submissão',
    demoRequired: 'Demonstração necessária',
    yes: 'Sim',
    no: 'Não',
    lockinRisks: 'Riscos de dependência',
    generateInsights: 'Gere insights IA a partir do separador **Insights IA** para extrair requisitos detalhados dos documentos do concurso.',
    buyer: 'Comprador',
    market: 'Mercado',
    value: 'Valor',
    deadline: 'Prazo',
    procedure: 'Procedimento',
    matchScore: 'Pontuação de correspondência',
    winProbability: 'Probabilidade de vitória',
    summary: 'Resumo',
    askMore: 'Experimente perguntar sobre **riscos**, **concorrentes**, **preços** ou **requisitos** para uma análise mais profunda.',
  },
};

function generateFallbackResponse(question: string, context: any, locale: string): string {
  const q = question.toLowerCase();
  const { tender, insights, match, buyer } = context;
  const curr = tender.currency || 'EUR';
  const l = labels[locale] || labels.en;

  // Risk-related questions
  if (q.includes('risk') || q.includes('risco')) {
    if (insights?.risk_assessment) {
      const ra = insights.risk_assessment;
      const lines = [
        `**${l.riskLevel}: ${(ra.risk_level || 'Unknown').toUpperCase()}**`,
        `**${l.overallScore}:** ${ra.overall_risk_score}/10`,
        '',
      ];

      const factors = Array.isArray(ra.key_risk_factors)
        ? ra.key_risk_factors
        : typeof ra.key_risk_factors === 'string'
          ? ra.key_risk_factors.split('\n').filter(Boolean)
          : [];

      if (factors.length > 0) {
        lines.push(`**${l.keyRiskFactors}:**`);
        factors.forEach((f: string) => lines.push(`- ${f}`));
      }
      return lines.join('\n');
    }
    return l.noRiskData;
  }

  // Competitor-related questions
  if (q.includes('competitor') || q.includes('rival') || q.includes('concorr') || q.includes('who') || q.includes('quem')) {
    const lines: string[] = [];

    if (buyer?.top_competitors?.length > 0) {
      lines.push(`**${l.likelyCompetitors}** — ${tender.buyer_name}:\n`);
      buyer.top_competitors.slice(0, 5).forEach((c: any) => {
        lines.push(`- **${c.winner_name}** — ${c.wins} ${l.pastWins}`);
      });
      if (buyer.persona) {
        lines.push('', `**${l.buyerPersona}:** ${buyer.persona}`);
      }
      if (buyer.avg_bidders) {
        lines.push(`**${l.avgBidders}:** ${Number(buyer.avg_bidders).toFixed(1)}`);
      }
    } else {
      lines.push(l.noCompetitorData);
    }

    if (insights?.strategic_intelligence?.incumbent_vendor_mentions?.length > 0) {
      lines.push('', `**${l.incumbentsMentioned}:**`);
      insights.strategic_intelligence.incumbent_vendor_mentions.forEach((v: string) => {
        lines.push(`- ${v}`);
      });
    }

    return lines.join('\n');
  }

  // Price-related questions
  if (q.includes('price') || q.includes('bid') || q.includes('cost') || q.includes('budget') || q.includes('preço') || q.includes('valor') || q.includes('licita')) {
    const lines: string[] = [];

    lines.push(`**${l.pricingAnalysis}**\n`);

    if (tender.estimated_value) {
      lines.push(`**${l.estimatedValue}:** ${fmtCurrency(tender.estimated_value, curr, locale)}`);
    }

    if (insights?.financials?.base_budget_value) {
      lines.push(`**${l.budgetFromDocs}:** ${fmtCurrency(insights.financials.base_budget_value, insights.financials.base_budget_currency || curr, locale)}`);
    }

    if (buyer?.avg_discount) {
      const discount = Math.abs(buyer.avg_discount);
      lines.push('', `**${l.recommendation}:**`);
      lines.push(`- ${l.buyerDiscount} **${discount.toFixed(1)}%**`);

      if (tender.estimated_value) {
        const target = Math.round(tender.estimated_value * (1 - discount / 100));
        lines.push(`- ${l.suggestedBid}: **${fmtCurrency(target, curr, locale)}**`);
      }
    }

    if (insights?.evaluation_criteria) {
      lines.push('', `**${l.evalWeights}:**`);
      lines.push(`- ${l.price}: **${insights.evaluation_criteria.price_weight_percent}%**`);
      lines.push(`- ${l.quality}: **${insights.evaluation_criteria.quality_weight_percent}%**`);
    }

    return lines.length > 2 ? lines.join('\n') : l.noPricingData;
  }

  // Requirements-related questions
  if (q.includes('require') || q.includes('certification') || q.includes('qualification') || q.includes('need') || q.includes('requisito') || q.includes('certifica')) {
    const lines: string[] = [];
    lines.push(`**${l.keyRequirements}**\n`);

    if (insights?.mandatory_certifications_and_licenses) {
      const certs = Array.isArray(insights.mandatory_certifications_and_licenses)
        ? insights.mandatory_certifications_and_licenses
        : [insights.mandatory_certifications_and_licenses];
      lines.push(`**${l.mandatoryCerts}:**`);
      certs.forEach((c: string) => lines.push(`- ${c}`));
    }

    if (insights?.evaluation_criteria) {
      lines.push('', `**${l.evalCriteria}:**`);
      lines.push(`- ${l.priceWeight}: **${insights.evaluation_criteria.price_weight_percent}%**`);
      lines.push(`- ${l.qualityWeight}: **${insights.evaluation_criteria.quality_weight_percent}%**`);
    }

    if (insights?.proposal_timeline) {
      lines.push('', `**${l.timeline}:**`);
      if (insights.proposal_timeline.contract_duration_months) {
        lines.push(`- ${l.contractDuration}: **${insights.proposal_timeline.contract_duration_months} ${l.months}**`);
      }
      if (insights.proposal_timeline.submission_deadline_iso) {
        lines.push(`- ${l.submissionDeadline}: **${fmtDate(insights.proposal_timeline.submission_deadline_iso, locale)}**`);
      }
      lines.push(`- ${l.demoRequired}: **${insights.proposal_timeline.is_demo_required ? l.yes : l.no}**`);
    }

    if (insights?.strategic_intelligence?.proprietary_lockin_risks?.length > 0) {
      lines.push('', `**${l.lockinRisks}:**`);
      insights.strategic_intelligence.proprietary_lockin_risks.forEach((r: string) => {
        lines.push(`- ${r}`);
      });
    }

    return lines.length > 2 ? lines.join('\n') : l.generateInsights;
  }

  // Default: provide a rich summary
  const lines: string[] = [];
  lines.push(`**${tender.title}**\n`);
  lines.push(`- **${l.buyer}:** ${tender.buyer_name}`);
  lines.push(`- **${l.market}:** ${tender.country}`);
  if (tender.estimated_value) lines.push(`- **${l.value}:** ${fmtCurrency(tender.estimated_value, curr, locale)}`);
  if (tender.submission_deadline) lines.push(`- **${l.deadline}:** ${fmtDate(tender.submission_deadline, locale)}`);
  if (tender.procedure_type) lines.push(`- **${l.procedure}:** ${tender.procedure_type}`);
  if (match?.score) lines.push(`- **${l.matchScore}:** ${match.score}%`);
  if (match?.win_probability) lines.push(`- **${l.winProbability}:** ${match.win_probability}%`);

  if (insights?.project_summary) {
    lines.push('', `**${l.summary}:** ${insights.project_summary.substring(0, 250)}...`);
  }

  lines.push('', l.askMore);

  return lines.join('\n');
}
