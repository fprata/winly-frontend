import { NextResponse } from 'next/server';
import { initLemonSqueezy, createCheckout } from '@/lib/lemonsqueezy';
import { createClient } from '@/utils/supabase/server';
import { getServerUser } from '@/utils/dev-auth';

const VARIANT_IDS: Record<string, { monthly: string; annual: string }> = {
  Pro: {
    monthly: process.env.LEMONSQUEEZY_VARIANT_PRO_MONTHLY!,
    annual: process.env.LEMONSQUEEZY_VARIANT_PRO_ANNUAL!,
  },
  Enterprise: {
    monthly: process.env.LEMONSQUEEZY_VARIANT_ENT_MONTHLY!,
    annual: process.env.LEMONSQUEEZY_VARIANT_ENT_ANNUAL!,
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

    const variants = VARIANT_IDS[tier];
    if (!variants) {
      return new NextResponse('Bad Request: Invalid tier.', { status: 400 });
    }

    if (billingInterval !== 'month' && billingInterval !== 'year') {
      return new NextResponse('Bad Request: Invalid billing interval.', { status: 400 });
    }

    const variantId = billingInterval === 'year' ? variants.annual : variants.monthly;

    if (!variantId) {
      console.error(`Missing variant ID for ${tier} ${billingInterval}`);
      return NextResponse.json({ error: 'Checkout configuration error' }, { status: 500 });
    }

    initLemonSqueezy();

    const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

    const { data, error } = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: user.email ?? undefined,
        custom: {
          user_id: user.id,
          tier,
          billing_interval: billingInterval,
        },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      },
    });

    if (error) {
      console.error('Lemon Squeezy Checkout Error:', error);
      return NextResponse.json({ error: 'Checkout session creation failed' }, { status: 500 });
    }

    return NextResponse.json({ url: data?.data.attributes.url });
  } catch (err: any) {
    console.error('Checkout Error:', { message: err.message });
    return NextResponse.json({ error: 'Checkout session creation failed' }, { status: 500 });
  }
}
