import { notFound } from 'next/navigation';
import { getServiceSupabase } from '@/lib/supabase';

export default async function ResultPage({ params }: { params: { id: string } }) {
  const supabase = getServiceSupabase();
  
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0118]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-2xl">
            <span className="text-4xl">✨</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
            Your Cosmic Reading
          </h1>
          <p className="text-gray-400">
            {data.bazi_data.year.heavenlyStem} Sun · {data.bazi_data.month.heavenlyStem} Rising · {data.bazi_data.day.heavenlyStem} Moon
          </p>
        </div>

        {/* Free Summary */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Your Preview</h2>
          <p className="text-gray-200 leading-relaxed text-lg">
            {data.summary}
          </p>
        </div>

        {/* Unlock CTA */}
        {!data.is_paid && (
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 text-center">
              <p className="text-white font-bold">🎁 Limited Time: 60% OFF</p>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Unlock Your Complete Reading
                </h2>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-2xl text-gray-400 line-through">$49</span>
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ${process.env.NEXT_PUBLIC_PRICE_USD || '19'}
                  </span>
                </div>
                <p className="text-gray-400">One-time payment • Instant access</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  '✨ Deep Personality Analysis (3000+ words)',
                  '💼 Career Path & Life Purpose',
                  '💕 Love & Relationship Compatibility',
                  '💰 Wealth Timing & Opportunities',
                  '🌿 Health & Wellness Guidance',
                  '🔮 12-Month Cosmic Forecast'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-200">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500
                         text-white py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-purple-500/50
                         hover:scale-105 transition-all"
              >
                Unlock Full Reading Now
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure payment • ⚡ Instant access • 💯 30-day guarantee
              </p>
            </div>
          </div>
        )}

        {/* Full Analysis (if paid) */}
        {data.is_paid && data.full_analysis && (
          <div className="space-y-6">
            {Object.entries(data.full_analysis).map(([key, value]) => {
              if (key === 'recommendations') return null;
              
              const icons: Record<string, string> = {
                personality: '🌟',
                career: '💼',
                relationships: '💕',
                health: '🌿',
                wealth: '💰'
              };

              return (
                <div key={key} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-3xl">{icons[key]}</span>
                    <span className="capitalize">{key}</span>
                  </h3>
                  <p className="text-gray-200 leading-relaxed text-lg">
                    {value as string}
                  </p>
                </div>
              );
            })}

            {data.full_analysis.recommendations && (
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  <span>Your Personalized Guidance</span>
                </h3>
                <ul className="space-y-3">
                  {data.full_analysis.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-200">
                      <span className="text-purple-400 text-xl mt-1">✦</span>
                      <span className="flex-1">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}