import {
  lemonSqueezySetup,
  createCheckout,
  getCustomer,
  listCustomers,
} from '@lemonsqueezy/lemonsqueezy.js';

export function initLemonSqueezy() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error(
      'LEMONSQUEEZY_API_KEY is missing. Please add it to your .env.local file.'
    );
  }
  lemonSqueezySetup({ apiKey });
}

export { createCheckout, getCustomer, listCustomers };
