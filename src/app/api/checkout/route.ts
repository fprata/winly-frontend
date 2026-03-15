import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { getServerUser } from '@/utils/dev-auth';

const TIER_CONFIG: Record<string, { monthly: number; annual: number; description: string }> = {
  Pro: {
    monthly: Number(process.env.STRIPE_PRICE_PRO_MONTHLY_CENTS) || 9900,     // €99/month
    annual: Number(process.env.STRIPE_PRICE_PRO_ANNUAL_CENTS) || 94800,      // €948/year (€79/mo)
    description: 'Unlimited matches, 5 AI document analyses/month, full buyer & competitor intelligence.',
  },
  Enterprise: {
    monthly: Number(process.env.STRIPE_PRICE_ENT_MONTHLY_CENTS) || 19900,    // €199/month
    annual: Number(process.env.STRIPE_PRICE_ENT_ANNUAL_CENTS) || 190800,     // €1,908/year (€159/mo)
    description: 'Unlimited matches, unlimited AI document analysis, tender chatbot, PDF/Excel export, full intelligence.',
  },
};

export async function POST(req: Request) {
  try {
    const { tier, billingInterval = 'month' } = await req.json();
    const supabase = await createClient();

    const { user } = await getServerUser(supabase);

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const config = TIER_CONFIG[tier];
    if (!config) {
      return new NextResponse('Bad Request: Invalid tier.', { status: 400 });
    }

    if (billingInterval !== 'month' && billingInterval !== 'year') {
      return new NextResponse('Bad Request: Invalid billing interval.', { status: 400 });
    }

    const isAnnual = billingInterval === 'year';
    const unitAmount = isAnnual ? config.annual : config.monthly;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Winly ${tier}${isAnnual ? ' (Annual)' : ''}`,
              description: config.description,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: billingInterval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile?payment=cancelled`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        tier,
        billingInterval,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', {
      message: err.message,
      type: err.type,
      code: err.code,
    });
    return NextResponse.json({ error: 'Checkout session creation failed' }, { status: 500 });
  }
}
