import Stripe from 'stripe';

let stripeInstance: Stripe | undefined;

export const getStripe = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Environment Check - Available Keys:', Object.keys(process.env));
      throw new Error('STRIPE_SECRET_KEY is missing. Please add it to your .env.local file.');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }
  return stripeInstance;
};

// Backwards compatibility if needed, but preferred to use getStripe()
export const stripe = new Proxy({} as Stripe, {
  get: (_target, prop) => {
    const instance = getStripe();
    return (instance as any)[prop];
  },
});
