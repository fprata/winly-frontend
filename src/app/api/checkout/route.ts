import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { priceId, tier } = await req.json();
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Determine price dynamically based on tier selection
    // In a real app, you would use real Stripe Price IDs
    const unitAmount = tier === 'Pro' ? 4900 : 0; 
    
    // For Enterprise, we might want to just contact sales, but let's assume a placeholder price
    // or handle it differently. Here we handle "Pro" subscription.
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Winly AI - ${tier} Plan`,
              description: tier === 'Pro' ? 'Advanced matching and priority support.' : 'Enterprise Plan',
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
