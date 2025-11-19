// app/api/calculate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase（用你项目的环境变量）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // 1. 接收表单提交的基础数据
    const { date, time, timezone, gender } = await req.json();

    // 2. 验证必填字段
    if (!date || !time || !gender) {
      return NextResponse.json(
        { message: 'Missing required fields: date/time/gender' },
        { status: 400 }
      );
    }

    // 3. 年份限制（1939-2020，后端双重校验）
    const selectedYear = new Date(date).getFullYear();
    const MIN_YEAR = 1939;
    const MAX_YEAR = 2020;
    if (selectedYear < MIN_YEAR || selectedYear > MAX_YEAR) {
      return NextResponse.json(
        { message: `Birth year must be between ${MIN_YEAR} and ${MAX_YEAR}` },
        { status: 400 }
      );
    }

    // 4. 保存到 Supabase（只存基础信息，不存报告内容）
    const { data, error } = await supabase
      .from('readings')
      .insert([
        {
          birth_date: date,
          birth_time: time,
          timezone: timezone,
          gender: gender,
          is_paid: false, // 初始未付费
          // 其他字段（payment_id、paid_at）留空，后续支付后更新
        }
      ])
      .select('id') // 关键：插入后返回生成的 readingId
      .single();

    // 5. 处理 Supabase 错误（比如表不存在、权限问题）
    if (error) {
      console.error('Supabase insert error:', error.message, error.code);
      return NextResponse.json(
        { message: 'Failed to save your birth information', error: error.message },
        { status: 500 }
      );
    }

    // 6. 成功返回 id（表单需要这个 id 跳转结果页）
    return NextResponse.json({ id: data.id }, { status: 200 });

  } catch (err: any) {
    console.error('Calculate API error:', err.message);
    return NextResponse.json(
      { message: 'Internal server error', error: err.message },
      { status: 500 }
    );
  }
}