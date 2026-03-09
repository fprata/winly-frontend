import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { getServerUser } from '@/utils/dev-auth';

export async function POST(req: Request) {
  try {
    const { tier } = await req.json();
    const supabase = await createClient();

    const { user } = await getServerUser(supabase);

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Prices in euro cents — configure via environment variables to avoid code deploys for pricing changes
    const TIER_CONFIG: Record<string, { cents: number; description: string; envKey: string }> = {
      Starter: {
        cents: Number(process.env.STRIPE_PRICE_STARTER_CENTS) || 14900,
        envKey: 'STRIPE_PRICE_STARTER_CENTS',
        description: 'Up to 50 matches/month, basic search algorithms, daily email digest, 1 seat, PT & ES markets.',
      },
      Professional: {
        cents: Number(process.env.STRIPE_PRICE_PRO_CENTS) || 39900,
        envKey: 'STRIPE_PRICE_PRO_CENTS',
        description: 'Unlimited matches, full V3 AI algorithm, real-time updates, win probability, price recommendations, competitor intelligence, 5 seats.',
      },
      Enterprise: {
        cents: Number(process.env.STRIPE_PRICE_ENTERPRISE_CENTS) || 99900,
        envKey: 'STRIPE_PRICE_ENTERPRISE_CENTS',
        description: 'Everything in Professional, Bid/No-Bid assistant, team collaboration, pipeline CRM, API access & integrations, unlimited seats, white-label options.',
      },
    };

    const tierConfig = TIER_CONFIG[tier];
    if (!tierConfig) {
      return new NextResponse('Bad Request: Invalid tier.', { status: 400 });
    }

    const unitAmount = tierConfig.cents;
    const description = tierConfig.description;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Winly AI - ${tier} Plan`,
              description: description,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: 'month',
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
        tier: tier,
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
