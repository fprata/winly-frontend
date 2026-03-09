import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { getServerUser } from '@/utils/dev-auth';

export async function POST() {
  try {
    const supabase = await createClient();
    const { user } = await getServerUser(supabase);
    if (!user?.email) return new NextResponse('Unauthorized', { status: 401 });

    // Find the Stripe customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[BillingPortal] Failed to create portal session:', err);
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 });
  }
}
