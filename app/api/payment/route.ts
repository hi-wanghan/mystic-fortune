import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_USD } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const {readingId, email} = await req.json();
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:[{price_data:{currency:'usd', product_data:{name:'BaZi Full Reading'}, unit_amount:Math.round(PRICE_USD*100)}, quantity:1}],
      mode:'payment',
      success_url:\/success?reading_id=\,
      cancel_url:\/result/\,
      customer_email:email,
      metadata:{readingId}
    });
    return NextResponse.json({sessionId:session.id});
  } catch(e) {
    return NextResponse.json({error:'Failed'}, {status:500});
  }
}