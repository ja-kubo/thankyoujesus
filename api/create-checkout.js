// api/create-checkout.js — Vercel Serverless Function for Stripe Checkout
// Required env vars:
//   STRIPE_SECRET_KEY=sk_live_... (or sk_test_...)
//   STRIPE_PRICE_MONTHLY=price_... (your monthly price ID from Stripe dashboard)
//   STRIPE_PRICE_YEARLY=price_...  (your yearly price ID from Stripe dashboard)
//   NEXT_PUBLIC_APP_URL=https://your-domain.com

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(500).json({ error: 'Stripe not configured', url: null });
  }

  const { plan } = req.body;
  const priceId = plan === 'yearly'
    ? process.env.STRIPE_PRICE_YEARLY
    : process.env.STRIPE_PRICE_MONTHLY;

  if (!priceId) {
    return res.status(500).json({ error: 'Price ID not configured', url: null });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://thankyoujesus.app';

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${appUrl}?premium=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}?premium=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: { app: 'thankyoujesus', plan },
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: 'Payment error', url: null });
  }
}
