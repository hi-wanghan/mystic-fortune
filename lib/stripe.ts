import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
let stripePromise: any;
export const getStripe = () => {
  if (!stripePromise) stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  return stripePromise;
};
export const PRICE_USD = parseFloat(process.env.NEXT_PUBLIC_PRICE_USD || '9.99');
