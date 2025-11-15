import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// key, don't manually write version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const PRICE_USD = parseFloat(process.env.NEXT_PUBLIC_PRICE_USD || '2.99');

export async function POST(req: NextRequest) {
  try {
    const { readingId, email } = await req.json();
    
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'BaZi Full Reading' },
          unit_amount: Math.round(PRICE_USD * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?reading_id=${readingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/result/${readingId}`,
      customer_email: email,
      metadata: { readingId }
    });

    await supabase.from('readings').update({ stripe_session_id: session.id }).eq('id', readingId);
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}