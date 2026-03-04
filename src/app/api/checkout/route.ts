import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { tier } = await req.json();
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Determine price dynamically based on tier selection
    let unitAmount = 0;
    let description = '';

    if (tier === 'Professional') {
      unitAmount = 14900; // €149.00
      description = 'Unlimited AI matching, Document Insights (LLM), and daily alerts.';
    } else if (tier === 'Business') {
      unitAmount = 39900; // €399.00
      description = 'Win Probability Score, Price Recommendation Engine, and multi-market access.';
    } else if (tier === 'Enterprise') {
      unitAmount = 99900; // €999.00
      description = 'API Access, custom LLM training, and dedicated support.';
    } else {
      // Free / Explorer tier - should probably not hit checkout
      return new NextResponse('Bad Request: Explorer tier is free.', { status: 400 });
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Winly AI -  Plan`,
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
    console.error('Stripe Checkout Detailed Error:', {
        message: err.message,
        type: err.type,
        code: err.code,
        stack: err.stack
    });
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
  }
}