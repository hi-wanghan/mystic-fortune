// app/api/calculate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 环境变量校验（启动时检查）
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('❌ 缺少 Supabase 环境变量，请检查 .env.local 配置');
}

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 类型定义 - 增强类型安全
type ZodiacSign = 'Capricorn' | 'Aquarius' | 'Pisces' | 'Aries' | 'Taurus' | 'Gemini' | 
                 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius';

type Element = 'Air' | 'Fire' | 'Water' | 'Earth';

type Planet = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 
             'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

interface AstroData {
  year: {
    zodiac: ZodiacSign;
    heavenlyStem: ZodiacSign;
    earthlyBranch: Element;
  };
  month: {
    heavenlyStem: ZodiacSign;
    earthlyBranch: Element;
  };
  day: {
    heavenlyStem: ZodiacSign;
    earthlyBranch: Element;
  };
  hour: {
    heavenlyStem: Planet;
    earthlyBranch: 'Planetary';
  };
}

interface Elements {
  Air: number;
  Fire: number;
  Water: number;
  Earth: number;
  Total: number;
}

interface RequestBody {
  date: string;
  time: string;
  timezone?: string;
  gender: string;
}

// 常量定义 - 集中管理配置
const ZODIAC_MAP: { sign: ZodiacSign; element: Element }[] = [
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

const PLANET_MAP: Planet[] = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

const YEAR_CONSTRAINTS = {
  min: 1939,
  max: 2020
};

/**
 * 生成占星数据
 * @param birthDate 出生日期字符串 (YYYY-MM-DD)
 * @param gender 性别
 * @returns 结构化的占星数据
 */
function generateDefaultAstroData(birthDate: string): AstroData {
  const date = new Date(birthDate);
  
  // 处理无效日期
  if (isNaN(date.getTime())) {
    throw new Error('Invalid birth date format. Please use YYYY-MM-DD');
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从 1 开始
  const day = date.getDate();
  const hours = date.getHours();

  // 计算星座索引（确保在 0-11 范围内）
  const getZodiacIndex = (value: number) => ((value % 12) + 12) % 12;
  
  const yearZodiac = ZODIAC_MAP[getZodiacIndex(year)];
  const monthZodiac = ZODIAC_MAP[getZodiacIndex(month - 1)];
  const dayZodiac = ZODIAC_MAP[getZodiacIndex(year + month + day)];
  const hourPlanet = PLANET_MAP[((hours % PLANET_MAP.length) + PLANET_MAP.length) % PLANET_MAP.length];

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

/**
 * 生成元素分布数据
 * @param astroData 占星数据
 * @returns 元素统计结果
 */
function generateDefaultElements(astroData: AstroData): Elements {
  const elements: Elements = {
    Air: 0,
    Fire: 0,
    Water: 0,
    Earth: 0,
    Total: 0,
  };

  const elementList: Element[] = [
    astroData.year.earthlyBranch,
    astroData.month.earthlyBranch,
    astroData.day.earthlyBranch,
  ];

  elementList.forEach(el => {
    if (elements.hasOwnProperty(el)) {
      elements[el]++;
      elements.Total++;
    }
  });

  return elements;
}

/**
 * 生成占星摘要
 * @param astroData 占星数据
 * @param gender 性别
 * @returns 摘要文本
 */
function generateDefaultSummary(astroData: AstroData, gender: string): string {
  const { year, month, day } = astroData;
  return `Based on your birth details (${year.zodiac} year, ${month.heavenlyStem} month, ${day.heavenlyStem} day), you have a balanced mix of ${year.earthlyBranch}, ${month.earthlyBranch}, and ${day.earthlyBranch} elements. Your unique astrological chart reveals insights into your personality, relationships, and life path. Get the full report to unlock detailed analysis.`;
}

export async function POST(req: NextRequest) {
  try {
    // 解析请求体并验证结构
    let requestBody: RequestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    const { date, time, timezone, gender } = requestBody;

    // 验证必填字段
    if (!date || !time || !gender) {
      return NextResponse.json(
        { message: 'Missing required fields: date, time and gender are required' },
        { status: 400 }
      );
    }

    // 验证日期格式
    const birthDate = new Date(`${date}T${time}`);
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { message: 'Invalid date or time format. Please use YYYY-MM-DD for date and HH:MM for time' },
        { status: 400 }
      );
    }

    // 验证年份范围
    const birthYear = birthDate.getFullYear();
    if (birthYear < YEAR_CONSTRAINTS.min || birthYear > YEAR_CONSTRAINTS.max) {
      return NextResponse.json(
        { 
          message: `Birth year must be between ${YEAR_CONSTRAINTS.min} and ${YEAR_CONSTRAINTS.max}`,
          receivedYear: birthYear
        },
        { status: 400 }
      );
    }

    // 生成数据
    const astroData = generateDefaultAstroData(date);
    const elements = generateDefaultElements(astroData);
    const summary = generateDefaultSummary(astroData, gender);

    // 准备插入数据
    const insertData = {
      birth_date: date,
      birth_time: time,
      timezone: timezone || 'UTC', // 提供默认时区
      gender: gender.trim(), // 去除前后空格
      is_paid: false,
      astro_data: astroData,
      elements: elements,
      summary: summary,
    };

    console.log('📥 Inserting data to Supabase:', insertData);

    // 插入数据库
    const { data, error } = await supabase
      .from('readings')
      .insert([insertData])
      .select('id')
      .single();

    if (error) {
      console.error('❌ Supabase insertion error:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      return NextResponse.json(
        { 
          message: 'Failed to save birth information', 
          error: error.message 
        },
        { status: 500 }
      );
    }

    console.log('✅ Data saved successfully. ID:', data.id);
    return NextResponse.json({ id: data.id }, { status: 201 }); // 201 表示资源创建成功

  } catch (err: any) {
    console.error('❌ API error:', err.stack);
    return NextResponse.json(
      { message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined },
      { status: 500 }
    );
  }
}