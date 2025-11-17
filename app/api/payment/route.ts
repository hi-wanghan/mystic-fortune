import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const PRICE_USD = parseFloat(process.env.NEXT_PUBLIC_PRICE_USD || '2.99');
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export async function POST(req: NextRequest) {
  try {
    // 适配表单提交的 form-data 格式
    const formData = await req.formData();
    const readingId = formData.get('readingId') as string;

    if (!readingId) {
      return NextResponse.json({ error: 'Reading ID missing' }, { status: 400 });
    }

    // 验证 reading 存在
    const { data: reading } = await supabase
      .from('readings')
      .select('id')
      .eq('id', readingId)
      .single();
    if (!reading) {
      return NextResponse.json({ error: 'Reading not found' }, { status: 404 });
    }

    // 创建 Stripe 支付会话
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'BaZi Full Reading' },
          unit_amount: Math.round(PRICE_USD * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${SITE_URL}/success?reading_id=${readingId}`,
      cancel_url: `${SITE_URL}/result/${readingId}`,
      metadata: { readingId },
    });

    // 直接重定向到支付页面（服务端重定向，CSP 无限制）
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (error: any) {
    console.error('Payment error:', error.message);
    // 重定向到错误页面，避免 JS 触发
    return NextResponse.redirect(`${SITE_URL}/payment-error?msg=${encodeURIComponent(error.message)}`, { status: 303 });
  }
}