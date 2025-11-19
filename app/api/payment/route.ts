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

// 新增辅助函数：生成 elements 数据（五行/元素分布，匹配非空约束）
function generateDefaultElements(astroData: any) {
  // 从 astro_data 中提取元素，统计分布（和你之前的逻辑一致）
  const elements = [
    astroData.year.earthlyBranch,
    astroData.month.earthlyBranch,
    astroData.day.earthlyBranch,
    // hour 的 earthlyBranch 是 Planetary，不算传统元素，跳过
  ];

  // 统计各元素出现次数
  return {
    Air: elements.filter(el => el === 'Air').length,
    Fire: elements.filter(el => el === 'Fire').length,
    Water: elements.filter(el => el === 'Water').length,
    Earth: elements.filter(el => el === 'Earth').length,
    Total: elements.length,
  };
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

    // 生成占星数据和元素数据
    const astro_data = generateDefaultAstroData(date, gender);
    const elements = generateDefaultElements(astro_data); // 👉 新增：生成 elements 数据

    // 插入数据（包含 astro_data 和 elements，满足所有非空约束）
    const insertData = {
      birth_date: date,
      birth_time: time,
      timezone: timezone,
      gender: gender,
      is_paid: false,
      astro_data: astro_data,
      elements: elements, // 👉 关键：添加 elements 字段
    };
    console.log('📥 插入 Supabase 的数据：', insertData);

    const { data, error } = await supabase
      .from('readings')
      .insert([insertData])
      .select('id')
      .single();

    if (error) {
      console.error('❌ Supabase 插入失败：', {
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

    console.log('✅ 插入成功，返回 id：', data.id);
    return NextResponse.json({ id: data.id }, { status: 200 });

  } catch (err: any) {
    console.error('❌ Calculate API 整体错误：', err.message, err.stack);
    return NextResponse.json(
      { message: 'Internal server error', error: err.message },
      { status: 500 }
    );
  }
}