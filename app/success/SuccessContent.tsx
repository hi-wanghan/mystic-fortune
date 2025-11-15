'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const readingId = searchParams.get('reading_id');
  const [showFullCTA, setShowFullCTA] = useState(false);

  useEffect(() => {
    // Show full CTA after 3 seconds
    const timer = setTimeout(() => setShowFullCTA(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const checkoutUrl = readingId ? `/checkout?reading_id=${readingId}` : '/';

  return (
    <div className="space-y-8">
      {/* ✅ Success Notification */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          Form Submitted Successfully! 🎉
        </h1>
        <p className="text-gray-300 text-lg">
          Your Bazi information has been recorded. Here's a preview of your analysis...
        </p>
      </div>

      {readingId && (
        <>
          {/* 📋 Section 1: Personality Analysis (50% visible) */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 lg:p-8">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">✨ Your Personality Code</h3>
            <p className="text-gray-300 leading-relaxed text-base lg:text-lg line-clamp-3">
              Based on your Bazi information, you are naturally endowed with leadership qualities and deep intuition. Your monthly pillar shows you have emotional depth and sensitivity, allowing you to better understand the needs of others in relationships and...
            </p>
            <div className="mt-4 text-sm text-purple-400 font-medium">
              <a href={checkoutUrl} className="hover:underline">
                [More content hidden - purchase full version to view]
              </a>
            </div>
          </div>

          {/* 🎯 Section 3: Purchase Button */}
          {showFullCTA && (
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 lg:p-8 text-center shadow-2xl">
              <div className="inline-block mb-4">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  🎁 Special 90% Discount
                </span>
              </div>
              
              <p className="text-white/90 text-base lg:text-lg mb-4">
                Unlock your complete Bazi analysis report
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-2xl text-white/60 line-through">$29</span>
                <span className="text-4xl lg:text-5xl font-bold text-white">$2.99</span>
              </div>

              <button
                onClick={() => window.location.href = checkoutUrl}
                className="w-full px-6 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg 
                         hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105
                         active:scale-95 mb-4"
              >
                🔓 View Complete Report Now
              </button>

              <p className="text-white/70 text-sm">
                <span className="inline-flex items-center gap-1">
                  <span>✓ Instant Access</span>
                  <span>•</span>
                  <span>✓ 30-Day Money-Back Guarantee</span>
                  <span>•</span>
                  <span>✓ 100% Privacy Protected</span>
                </span>
              </p>
            </div>
          )}

          {/* 🔮 Section 2: Key Points Preview */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 lg:p-8">
            <h3 className="text-lg lg:text-xl font-bold text-white mb-6">
              🔮 The complete report also includes:
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                '💝 Relationship & love fortune',
                '💼 Career development direction',
                '🧭 Recent lucky directions',
                '💰 Wealth growth opportunities',
                '📅 12-month fortune forecast',
                '🙏 Spiritual growth advice'
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <span className="text-purple-400 text-xl">✓</span>
                  <span className="text-gray-300 line-through opacity-60">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                ⚠️ <span className="font-semibold">The content above is just a preview</span>. The full version contains <span className="font-bold">3000+ words</span> of in-depth Bazi analysis
              </p>
            </div>
          </div>

          {/* Alternative link to results page */}
          <div className="text-center pt-4">
            <a 
              href={`/result/${readingId}`}
              className="text-gray-400 hover:text-white transition text-sm"
            >
              Or return to your analysis results →
            </a>
          </div>
        </>
      )}

      {/* Fallback content when no readingId */}
      {!readingId && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
          <p className="text-gray-300 mb-4">
            Your Bazi analysis report has been generated
          </p>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                     text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Return to Home Page
          </a>
        </div>
      )}
    </div>
  );
}