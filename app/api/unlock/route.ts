import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// 静态完整解读模板
const generateFullAstrologyStatic = (data: any) => {
  return {
    personality: `Based on your birth chart (${data.sunSign} ${data.element}), you are a natural-born leader with deep intuitive abilities. Your ${data.moonSign} moon sign adds emotional depth and sensitivity to your personality.`,
    
    careerPath: `Your career destiny is aligned with leadership and creative pursuits. The stars indicate success in fields that allow you to express your natural charisma and innovative thinking. Best years: 2025-2027.`,
    
    loveLife: `Your romantic destiny shows a pattern of deep, meaningful connections. You seek partners who understand your emotional complexity. A significant relationship is indicated in the coming 12 months.`,
    
    wealth: `Financial abundance flows to you through your natural talents. Expected wealth increase: 2025 Q2-Q3. Focus on strategic investments and multiple income streams.`,
    
    spiritualPath: `Your spiritual journey involves understanding the balance between material and spiritual worlds. Meditation and self-reflection will unlock your highest potential.`,
    
    yearAhead: {
      q1_2025: "New beginnings and opportunities. Focus on planning and groundwork.",
      q2_2025: "Peak energy period. Launch new projects and take bold action.",
      q3_2025: "Financial gains and recognition. Harvest your efforts.",
      q4_2025: "Reflection and integration. Prepare for next cycle."
    },
    
    remedies: [
      "Wear purple or pink crystals to enhance spiritual energy",
      "Practice daily meditation for 20 minutes",
      "Avoid major decisions on Mondays",
      "Embrace changes coming in spring 2025"
    ]
  };
};

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

    // 生成完整解读（使用静态模板）
    const fullAnalysis = generateFullAstrologyStatic({
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




/*  With AI capability
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