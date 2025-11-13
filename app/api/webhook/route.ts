import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const rid = session.metadata?.readingId;
      if (rid) {
        const supabase = getServiceSupabase();
        await supabase.from('readings').update({is_paid:true, payment_id:session.payment_intent}).eq('id',rid);
      }
    }
    return NextResponse.json({received:true});
  } catch(e) {
    return NextResponse.json({error:'Webhook error'}, {status:400});
  }
}