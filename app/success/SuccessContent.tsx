'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const readingId = searchParams.get('reading_id');
  const [showFullCTA, setShowFullCTA] = useState(false);

  useEffect(() => {
    // 3秒后显示完整购买提示
    const timer = setTimeout(() => setShowFullCTA(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* ✅ 成功提示 */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          表单已成功提交！🎉
        </h1>
        <p className="text-gray-300 text-lg">
          你的八字信息已记录，下面是你的初步分析预览...
        </p>
      </div>

      {readingId && (
        <>
          {/* 📋 部分 1: 性格分析（显示 50%） */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 lg:p-8">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">✨ 你的性格密码</h3>
            <p className="text-gray-300 leading-relaxed text-base lg:text-lg line-clamp-3">
              根据你的八字信息，你天生具有领导气质和深厚的直觉能力。你的月柱信息显示你拥有情感的深度和敏感性，这使你在人际关系中能够更好地理解他人的需求和...
            </p>
            <div className="mt-4 text-sm text-purple-400 font-medium">
              [更多内容已隐藏 - 购买完整版本即可查看]
            </div>
          </div>

          {/* 🔮 部分 2: 关键词提示 */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 lg:p-8">
            <h3 className="text-lg lg:text-xl font-bold text-white mb-6">
              🔮 完整报告还包含：
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                '💝 缘分与爱情运势',
                '💼 事业发展方向',
                '🧭 最近幸运方位',
                '💰 财富增长时机',
                '📅 全年12月运势预测',
                '🙏 精神成长建议'
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
                ⚠️ <span className="font-semibold">上面的内容仅为预览</span>，完整版包含 <span className="font-bold">3000+ 字</span>的深度八字分析
              </p>
            </div>
          </div>

          {/* 🎯 部分 3: 立即购买按钮 */}
          {showFullCTA && (
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 lg:p-8 text-center shadow-2xl">
              <div className="inline-block mb-4">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  🎁 60% 折扣进行中
                </span>
              </div>
              
              <p className="text-white/90 text-base lg:text-lg mb-4">
                解锁完整的八字分析报告
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-2xl text-white/60 line-through">$49</span>
                <span className="text-4xl lg:text-5xl font-bold text-white">$19</span>
              </div>

              <button
                onClick={() => window.location.href = `/checkout?reading_id=${readingId}`}
                className="w-full px-6 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg 
                         hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105
                         active:scale-95 mb-4"
              >
                🔓 立即查看完整报告
              </button>

              <p className="text-white/70 text-sm">
                <span className="inline-flex items-center gap-1">
                  <span>✓ 即时获取</span>
                  <span>•</span>
                  <span>✓ 30天退款保证</span>
                  <span>•</span>
                  <span>✓ 100%隐私保护</span>
                </span>
              </p>
            </div>
          )}

          {/* 返回结果页链接（备选） */}
          <div className="text-center pt-4">
            <a 
              href={`/result/${readingId}`}
              className="text-gray-400 hover:text-white transition text-sm"
            >
              或返回你的分析结果 →
            </a>
          </div>
        </>
      )}

      {/* 无 readingId 时的备选文案 */}
      {!readingId && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
          <p className="text-gray-300 mb-4">
            你的八字分析报告已生成
          </p>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                     text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            返回首页
          </a>
        </div>
      )}
    </div>
  );
}