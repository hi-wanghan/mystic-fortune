import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// 保持原始初始化方式
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

    // 增强：查询时获取 summary 字段（用于支付描述）
    const { data: reading, error: fetchError } = await supabase
      .from('readings')
      .select('id, summary') // 新增 summary 字段查询
      .eq('id', readingId)
      .single();
    
    // 保持原始错误处理逻辑，但明确错误来源
    if (fetchError || !reading) {
      return NextResponse.redirect(`${SITE_URL}/payment-error?msg=Report+not+found`, { status: 303 });
    }

    // 创建 Stripe 支付会话（优化描述信息）
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Full Destiny Report',
            // 优化：使用 summary 作为描述（截断过长内容）
            description: reading.summary 
              ? `${reading.summary.substring(0, 100)}...` 
              : '3000+ words of in-depth Bazi analysis (personality, career, wealth, relationships)',
          },
          unit_amount: Math.round(PRICE_USD * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${SITE_URL}/success?reading_id=${readingId}`,
      cancel_url: `${SITE_URL}/result/${readingId}`,
      metadata: { readingId },
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (error: any) {
    console.error('Payment API error:', error.message);
    return NextResponse.redirect(`${SITE_URL}/payment-error?msg=${encodeURIComponent(error.message)}`, { status: 303 });
  }
}