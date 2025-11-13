import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { generateFullAstrology } from '@/lib/ai/astrology-generator';

export async function POST(req: NextRequest) {
  try {
    const { readingId } = await req.json();
    
    const supabase = getServiceSupabase();
    
    // 获取阅读记录
    const { data: reading, error } = await supabase
      .from('readings')
      .select('*')
      .eq('id', readingId)
      .eq('is_paid', true)  // 确保已付费
      .single();

    if (error || !reading) {
      return NextResponse.json({ error: 'Reading not found or not paid' }, { status: 404 });
    }

    // 如果已经有完整解读，直接返回
    if (reading.full_analysis) {
      return NextResponse.json({ analysis: reading.full_analysis });
    }

    // 生成完整解读
    const fullAnalysis = await generateFullAstrology({
      sunSign: reading.bazi_data.year.heavenlyStem,
      risingSign: reading.bazi_data.month.heavenlyStem,
      moonSign: reading.bazi_data.day.heavenlyStem,
      element: reading.bazi_data.year.earthlyBranch,
      gender: reading.gender,
      birthDate: reading.birth_date,
      birthTime: reading.birth_time,
    });

    // 保存到数据库
    await supabase
      .from('readings')
      .update({ full_analysis: fullAnalysis })
      .eq('id', readingId);

    return NextResponse.json({ analysis: fullAnalysis });
  } catch (error: any) {
    console.error('Unlock error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}