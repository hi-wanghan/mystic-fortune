// app/api/calculate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 环境变量校验
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Supabase 环境变量未配置！请检查 .env.local');
}

// 初始化 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 辅助函数：生成占星数据（astro_data）
function generateDefaultAstroData(birthDate: string, gender: string) {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const zodiacMap = [
    { sign: 'Capricorn', element: 'Earth' },
    { sign: 'Aquarius', element: 'Air' },
    { sign: 'Pisces', element: 'Water' },
    { sign: 'Aries', element: 'Fire' },
    { sign: 'Taurus', element: 'Earth' },
    { sign: 'Gemini', element: 'Air' },
    { sign: 'Cancer', element: 'Water' },
    { sign: 'Leo', element: 'Fire' },
    { sign: 'Virgo', element: 'Earth' },
    { sign: 'Libra', element: 'Air' },
    { sign: 'Scorpio', element: 'Water' },
    { sign: 'Sagittarius', element: 'Fire' },
  ];

  const yearZodiac = zodiacMap[year % 12];
  const monthZodiac = zodiacMap[month - 1];
  const dayZodiac = zodiacMap[(year + month + date.getDate()) % 12];
  const hourZodiac = zodiacMap[(date.getHours() + month) % 12];

  const planetMap = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
  ];
  const hourPlanet = planetMap[date.getHours() % planetMap.length];

  return {
    year: {
      zodiac: yearZodiac.sign,
      heavenlyStem: yearZodiac.sign,
      earthlyBranch: yearZodiac.element,
    },
    month: {
      heavenlyStem: monthZodiac.sign,
      earthlyBranch: monthZodiac.element,
    },
    day: {
      heavenlyStem: dayZodiac.sign,
      earthlyBranch: dayZodiac.element,
    },
    hour: {
      heavenlyStem: hourPlanet,
      earthlyBranch: 'Planetary',
    },
  };
}

// 辅助函数：生成 elements 数据
function generateDefaultElements(astroData: any) {
  const elements = {
    Air: 0,
    Fire: 0,
    Water: 0,
    Earth: 0,
    Total: 0,
  };

  const elementList = [
    astroData.year.earthlyBranch,
    astroData.month.earthlyBranch,
    astroData.day.earthlyBranch,
  ];

  elementList.forEach(el => {
    if (el === 'Air') elements.Air++;
    if (el === 'Fire') elements.Fire++;
    if (el === 'Water') elements.Water++;
    if (el === 'Earth') elements.Earth++;
    elements.Total++;
  });

  return elements;
}

// 新增辅助函数：生成 summary 字段默认值（占星摘要，满足非空约束）
function generateDefaultSummary(astroData: any, gender: string) {
  const { year, month, day } = astroData;
  return `Based on your birth details (${year.zodiac} year, ${month.heavenlyStem} month, ${day.heavenlyStem} day), you have a balanced mix of ${year.earthlyBranch}, ${month.earthlyBranch}, and ${day.earthlyBranch} elements. Your unique astrological chart reveals insights into your personality, relationships, and life path. Get the full report to unlock detailed analysis.`;
}

export async function POST(req: NextRequest) {
  try {
    const { date, time, timezone, gender } = await req.json();

    // 验证必填字段
    if (!date || !time || !gender) {
      return NextResponse.json(
        { message: 'Missing required fields: date/time/gender' },
        { status: 400 }
      );
    }

    // 年份限制
    const selectedYear = new Date(date).getFullYear();
    const MIN_YEAR = 1939;
    const MAX_YEAR = 2020;
    if (selectedYear < MIN_YEAR || selectedYear > MAX_YEAR) {
      return NextResponse.json(
        { message: `Birth year must be between ${MIN_YEAR} and ${MAX_YEAR}` },
        { status: 400 }
      );
    }

    // 生成所有非空字段数据
    const astro_data = generateDefaultAstroData(date, gender);
    const elements = generateDefaultElements(astro_data);
    const summary = generateDefaultSummary(astro_data, gender); // 👉 新增：生成 summary

    // 插入数据（补全所有非空字段）
    const insertData = {
      birth_date: date,
      birth_time: time,
      timezone: timezone,
      gender: gender,
      is_paid: false,
      astro_data: astro_data,
      elements: elements,
      summary: summary, // 👉 关键：添加 summary 字段
    };
    console.log('📥 插入 Supabase 的完整数据：', insertData);

    const { data, error } = await supabase
      .from('readings')
      .insert([insertData])
      .select('id')
      .single();

    if (error) {
      console.error('❌ Supabase 插入失败详情：', {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      return NextResponse.json(
        { 
          message: 'Failed to save your birth information', 
          error: error.message,
          details: error.details || 'No additional details'
        },
        { status: 500 }
      );
    }

    console.log('✅ 插入成功，返回 ID：', data.id);
    return NextResponse.json({ id: data.id }, { status: 200 });

  } catch (err: any) {
    console.error('❌ API 全局错误：', err.message, err.stack);
    return NextResponse.json(
      { message: 'Internal server error', error: err.message },
      { status: 500 }
    );
  }
}