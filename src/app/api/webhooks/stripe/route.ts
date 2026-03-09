import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// NOTE: We need a Service Role client to bypass RLS and update user profiles via webhook
// Since this runs on the server, we can use a simpler approach or just use the standard client 
// if RLS allows updating based on email (which it might not for public access).
// For simplicity/security in this demo, I will use the standard server client but acknowledge 
// that in production you'd use a SUPABASE_SERVICE_ROLE_KEY for admin tasks.

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new NextResponse('Webhook signature verification failed', { status: 400 });
  }

  const session = event.data.object as any;
  console.debug(`[Stripe] Received event: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const tier = session.metadata?.tier;
    const email = session.customer_email;

    console.debug(`[Stripe] Processing checkout for tier: ${tier}`);

    if (tier && email) {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('SUPABASE_SERVICE_ROLE_KEY is missing. Cannot update database.');
            return new NextResponse('Server Configuration Error', { status: 500 });
        }

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!, 
            {
                cookies: {
                    getAll() { return [] },
                    setAll() {}
                }
            }
        );

        const { error } = await supabase
            .from('clients')
            .update({ tier: tier })
            .eq('email', email);
        
        if (error) {
            console.error('Supabase update failed:', error);
            return new NextResponse('Database Update Failed', { status: 500 });
        }
            
        console.debug(`[Stripe] User upgraded to ${tier}`);
    } else {
        console.warn('Missing metadata (tier) or email in session object.');
    }
  }

  return new NextResponse(null, { status: 200 });
}
