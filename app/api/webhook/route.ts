import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// 初始化 Stripe 和 Supabase（服务端密钥，有权限更新数据库）
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // 稳定版本，避免兼容问题
});
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 必须用服务端密钥，客户端密钥无更新权限
);

// 验证 Stripe 签名（防止恶意请求）
async function verifyStripeSignature(req: NextRequest) {
  const signature = headers().get('Stripe-Signature');
  if (!signature) {
    throw new Error('Stripe signature missing');
  }

  const body = await req.text();
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}

export async function POST(req: NextRequest) {
  try {
    // 1. 验证 Stripe 事件的真实性
    const event = await verifyStripeSignature(req);
    console.log('收到 Stripe 事件：', event.type);

    // 2. 只处理支付成功事件（checkout.session.completed）
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { readingId } = session.metadata; // 取后端存入的 readingId
      const paymentIntent = session.payment_intent as string; // 支付 ID

      console.log('支付成功，更新 readingId：', readingId);

      // 3. 检查 readingId 是否存在
      if (!readingId) {
        throw new Error('metadata 中缺少 readingId');
      }

      // 4. 更新 Supabase 的 readings 表：将 paid 设为 true，记录 payment_id
      const { error } = await supabase
        .from('readings')
        .update({
          paid: true,
          payment_id: paymentIntent,
          paid_at: new Date().toISOString() // 记录支付时间（可选）
        })
        .eq('id', readingId); // 按 readingId 精准更新

      if (error) {
        throw new Error(`数据库更新失败：${error.message}`);
      }

      console.log('数据库更新成功，readingId：', readingId);
    }

    // 5. 返回成功响应（Stripe 需要收到 200 才停止重试）
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook 错误：', error.message);
    // 返回 400 让 Stripe 知道请求无效，避免重复发送
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}