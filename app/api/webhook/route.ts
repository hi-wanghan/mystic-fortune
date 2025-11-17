import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ✅ 简化：不写 apiVersion，默认 'auto'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 验证 Stripe 签名（防止恶意请求）
async function verifyStripeSignature(req: NextRequest) {
  const signature = headers().get('Stripe-Signature');
  if (!signature) throw new Error('Stripe signature missing');

  const body = await req.text();
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}

export async function POST(req: NextRequest) {
  try {
    const event = await verifyStripeSignature(req);

    // 仅处理支付成功事件
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const readingId = session.metadata?.readingId;
      const paymentIntent = session.payment_intent as string;

      if (!readingId || !paymentIntent) {
        throw new Error('Missing readingId or payment_intent in metadata');
      }

      // 更新数据库支付状态（适配 is_paid 字段）
      const { error } = await supabase
        .from('readings')
        .update({
          is_paid: true,
          payment_id: paymentIntent,
          paid_at: new Date().toISOString()
        })
        .eq('id', readingId);

      if (error) throw new Error(`Supabase update failed: ${error.message}`);
      console.log(`Payment updated: readingId=${readingId}, paymentIntent=${paymentIntent}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}