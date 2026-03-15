import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { getServerUser } from '@/utils/dev-auth';

export async function POST(req: Request) {
  try {
    const { tier, billingInterval = 'month' } = await req.json();
    const supabase = await createClient();

    const { user } = await getServerUser(supabase);

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (tier !== 'Pro') {
      return new NextResponse('Bad Request: Invalid tier.', { status: 400 });
    }

    if (billingInterval !== 'month' && billingInterval !== 'year') {
      return new NextResponse('Bad Request: Invalid billing interval.', { status: 400 });
    }

    // Prices in euro cents — configure via environment variables
    const isAnnual = billingInterval === 'year';
    const unitAmount = isAnnual
      ? Number(process.env.STRIPE_PRICE_PRO_ANNUAL_CENTS) || 94800   // €948/year (€79/mo)
      : Number(process.env.STRIPE_PRICE_PRO_MONTHLY_CENTS) || 9900;  // €99/month

    const description = isAnnual
      ? 'Winly Pro — Annual. Unlimited matches, AI document analysis, tender chat, PDF/Excel export, full intelligence.'
      : 'Winly Pro — Monthly. Unlimited matches, AI document analysis, tender chat, PDF/Excel export, full intelligence.';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Winly Pro${isAnnual ? ' (Annual)' : ''}`,
              description,
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
        tier: 'Pro',
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
