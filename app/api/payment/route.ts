import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ✅ 简化：不写 apiVersion，默认使用 'auto' 动态版本
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const PRICE_USD = parseFloat(process.env.NEXT_PUBLIC_PRICE_USD || '2.99');
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const readingId = formData.get('readingId') as string;

    if (!readingId) {
      return NextResponse.redirect(`${SITE_URL}/payment-error?msg=Reading+ID+missing`, { status: 303 });
    }

    // 验证 reading 存在（可选，增强安全性）
    const { data: reading } = await supabase
      .from('readings')
      .select('id')
      .eq('id', readingId)
      .single();
    if (!reading) {
      return NextResponse.redirect(`${SITE_URL}/payment-error?msg=Report+not+found`, { status: 303 });
    }

    // 创建 Stripe 支付会话
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'BaZi Full Destiny Report',
            description: '3000+ words of in-depth Bazi analysis (personality, career, wealth, relationships)',
          },
          unit_amount: Math.round(PRICE_USD * 100), // 转换为分
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${SITE_URL}/success?reading_id=${readingId}`,
      cancel_url: `${SITE_URL}/result/${readingId}`,
      metadata: { readingId }, // 存入 readingId，供 Webhook 回调使用
    });

    // 服务端重定向到 Stripe 支付页面（无 CSP 限制）
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (error: any) {
    console.error('Payment API error:', error.message);
    return NextResponse.redirect(`${SITE_URL}/payment-error?msg=${encodeURIComponent(error.message)}`, { status: 303 });
  }
}