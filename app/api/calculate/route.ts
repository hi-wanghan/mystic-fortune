import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { calculateBazi } from '@/lib/bazi/calculator';

export async function POST(req: NextRequest) {
  console.log('🔮 Calculate API called');
  
  try {
    const body = await req.json();
    console.log('📝 Received data:', { ...body, name: body.name || 'anonymous' });
    
    // 验证必填字段
    if (!body.date || !body.time || !body.city || !body.gender) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: date, time, city, gender' },
        { status: 400 }
      );
    }

    // 计算占星
    console.log('🌟 Calculating astrology...');
    const result = await calculateBazi(body);
    console.log('✅ Calculation complete');

    // 保存到数据库
    console.log('💾 Saving to Supabase...');
    const supabase = getServiceSupabase();
    
    const insertData = {
      birth_date: body.date,
      birth_time: body.time,
      timezone: body.timezone,
      gender: body.gender,
      location_name: body.city,
      bazi_data: result.bazi,
      elements: result.elements,
      summary: result.summary,
      full_analysis: result.fullAnalysis,
      is_paid: false,
    };
    
    console.log('📊 Insert data:', insertData);
    
    const { data, error } = await supabase
      .from('readings')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ Saved to database, ID:', data.id);

    return NextResponse.json({
      id: data.id,
      summary: result.summary,
      bazi: result.bazi,
      elements: result.elements
    });
    
  } catch (error: any) {
    console.error('❌ Calculate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate' },
      { status: 500 }
    );
  }
}