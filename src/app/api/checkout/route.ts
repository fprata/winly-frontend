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

    // Determine price dynamically based on tier selection
    let unitAmount = 0;
    let description = '';

    if (tier === 'Starter') {
      unitAmount = 14900; // €149.00
      description = 'Up to 50 matches/month, basic search algorithms, daily email digest, 1 seat, PT & ES markets.';
    } else if (tier === 'Professional') {
      unitAmount = 39900; // €399.00
      description = 'Unlimited matches, full V3 AI algorithm, real-time updates, win probability, price recommendations, competitor intelligence, 5 seats.';
    } else if (tier === 'Enterprise') {
      unitAmount = 99900; // €999.00
      description = 'Everything in Professional, Bid/No-Bid assistant, team collaboration, pipeline CRM, API access & integrations, unlimited seats, white-label options.';
    } else {
      return new NextResponse('Bad Request: Invalid tier.', { status: 400 });
    }

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
