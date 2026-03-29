import { NextResponse } from 'next/server';
import { initLemonSqueezy, listCustomers } from '@/lib/lemonsqueezy';
import { createClient } from '@/utils/supabase/server';
import { getServerUser } from '@/utils/dev-auth';

export async function POST() {
  try {
    const supabase = await createClient();
    const { user } = await getServerUser(supabase);
    if (!user?.email) return new NextResponse('Unauthorized', { status: 401 });

    initLemonSqueezy();

    const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

    // Find the Lemon Squeezy customer by email
    const { data, error } = await listCustomers({
      filter: { storeId, email: user.email },
    });

    if (error || !data?.data.length) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 });
    }

    const customerPortalUrl =
      data.data[0].attributes.urls.customer_portal;

    if (!customerPortalUrl) {
      return NextResponse.json({ error: 'Customer portal not available' }, { status: 404 });
    }

    return NextResponse.json({ url: customerPortalUrl });
  } catch (err) {
    console.error('[BillingPortal] Failed to get portal URL:', err);
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 });
  }
}
