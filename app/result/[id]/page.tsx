'use client';

import { useEffect, useState } from 'react';

// 原生 Supabase 初始化
const initSupabase = () => {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export default function ResultPage() {
  const readingId = window.location.pathname.split('/').pop() || '';
  const [reading, setReading] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const PRICE_USD = process.env.NEXT_PUBLIC_PRICE_USD || '2.99';

  useEffect(() => {
    if (!readingId) {
      window.location.href = '/';
      return;
    }

    const fetchReading = async () => {
      try {
        const supabase = initSupabase();
        const { data, error } = await supabase
          .from('readings')
          .select('*')
          .eq('id', readingId)
          .single();

        if (error) throw error;
        setReading(data);
      } catch (err: any) {
        setError('Failed to load your report');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [readingId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0118] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-purple-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-300 mt-6 text-lg">Loading your Bazi analysis...</p>
        </div>
      </main>
    );
  }

  if (error || !reading) {
    return (
      <main className="min-h-screen bg-[#0a0118] flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-4">{error || 'Report Not Found'}</h2>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Generate New Report
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0118] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Bazi Destiny Report
          </h1>
          <p className="text-gray-300 text-lg">
            Based on your birth information: {reading.birth_date} • {reading.gender}
          </p>
        </div>

        {/* 八字命盘预览 */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 lg:p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Your Bazi Chart</h3>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {reading.bazi?.map((pillar: any, idx: number) => (
              <div key={idx} className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">{['Year', 'Month', 'Day', 'Hour'][idx]}</p>
                <p className="text-2xl font-bold text-white mt-1">{pillar.stem}{pillar.branch}</p>
                <p className="text-purple-400 text-sm mt-2">{pillar.zodiac}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Five Elements Distribution</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(reading.elements || {}).map(([element, count]) => (
                <span key={element} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  {element}: {String(count)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 完整报告/支付引导 */}
        {reading.is_paid ? (
          <div className="space-y-8">
            <div className="bg-white/5 rounded-xl p-6 lg:p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Personality Analysis</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                {reading.full_report?.personality || 
                 "Based on your Bazi chart, you possess a unique blend of confidence and empathy. Your Day Stem reveals a natural leader with strong decision-making skills, while your Month Branch adds emotional depth that allows you to connect with others authentically..."}
              </p>
              <p className="text-gray-300 leading-relaxed">
                You thrive in environments that balance structure and creativity. Your Five Elements indicate a need to nurture your {reading.elements?.wood ? 'Wood' : 'Water'} element to enhance growth and harmony in your life...
              </p>
            </div>

            {/* 其他报告章节... */}
            <div className="text-center">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-all"
              >
                Download Full Report (PDF)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 rounded-xl p-6 lg:p-8 text-center">
            <div className="inline-block mb-6">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                🎁 Special 94% Discount
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Unlock Your Complete Bazi Report</h3>
            <p className="text-gray-300 text-lg mb-6 max-w-md mx-auto">
              Get 3000+ words of in-depth analysis on your personality, career, wealth, relationships, and life path.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-2xl text-white/60 line-through">$49</span>
              <span className="text-4xl font-bold text-white">${PRICE_USD}</span>
            </div>
            {/* 原生表单支付 */}
            <form action="/api/payment" method="POST">
              <input type="hidden" name="readingId" value={readingId} />
              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
              >
                Unlock Full Reading Now
              </button>
            </form>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1">✓ Instant Access</span>
              <span className="flex items-center gap-1">✓ 30-Day Money-Back Guarantee</span>
              <span className="flex items-center gap-1">✓ 100% Privacy Protected</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}