import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia', // using latest stable or fallback
  appInfo: {
    name: 'Digital Heroes',
    version: '0.1.0',
  },
});
