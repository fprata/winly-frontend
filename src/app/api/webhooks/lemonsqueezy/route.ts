import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('X-Signature') as string;

  if (!signature || !process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    return new NextResponse('Missing signature or webhook secret', { status: 400 });
  }

  const isValid = verifyWebhookSignature(
    body,
    signature,
    process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  );

  if (!isValid) {
    console.error('Webhook signature verification failed');
    return new NextResponse('Webhook signature verification failed', { status: 400 });
  }

  const event = JSON.parse(body);
  const eventName: string = event.meta?.event_name;

  console.debug(`[LemonSqueezy] Received event: ${eventName}`);

  if (eventName === 'order_created') {
    const customData = event.meta?.custom_data;
    const tier = customData?.tier;
    const email = event.data?.attributes?.user_email;

    console.debug(`[LemonSqueezy] Processing order for tier: ${tier}`);

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
            getAll() { return []; },
            setAll() {},
          },
        }
      );

      const { error } = await supabase
        .from('clients')
        .update({ tier })
        .eq('email', email);

      if (error) {
        console.error('Supabase update failed:', error);
        return new NextResponse('Database Update Failed', { status: 500 });
      }

      console.debug(`[LemonSqueezy] User upgraded to ${tier}`);
    } else {
      console.warn('Missing custom_data (tier) or email in event.');
    }
  }

  if (eventName === 'subscription_expired' || eventName === 'subscription_cancelled') {
    const email = event.data?.attributes?.user_email;

    if (email) {
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is missing.');
        return new NextResponse('Server Configuration Error', { status: 500 });
      }

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            getAll() { return []; },
            setAll() {},
          },
        }
      );

      const { error } = await supabase
        .from('clients')
        .update({ tier: 'free' })
        .eq('email', email);

      if (error) {
        console.error('Supabase downgrade failed:', error);
        return new NextResponse('Database Update Failed', { status: 500 });
      }

      console.debug(`[LemonSqueezy] User downgraded to free`);
    }
  }

  return new NextResponse(null, { status: 200 });
}
