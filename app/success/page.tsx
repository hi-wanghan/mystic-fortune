'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// 原生 Supabase 初始化（避免 Next.js 客户端封装触发 CSP）
const initSupabase = () => {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const readingId = searchParams.get('reading_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 原生 JS 实现，无 Next.js 路由依赖
    if (!readingId) {
      window.location.href = '/';
      return;
    }

    const checkPayment = async () => {
      try {
        const supabase = initSupabase();
        // 原生查询，避免封装触发 CSP
        const { data, error } = await supabase
          .from('readings')
          .select('is_paid')
          .eq('id', readingId)
          .single();

        if (error) throw error;

        // 已支付 → 原生跳转完整报告
        if (data.is_paid) {
          window.location.href = `/result/${readingId}`;
        } else {
          setLoading(false);
        }
      } catch (err: any) {
        setError('Payment verification failed. Please try again.');
        setLoading(false);
        console.error(err);
      }
    };

    checkPayment();
  }, [readingId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0118] flex flex-col items-center justify-center">
        <div className="inline-block">
          <svg className="animate-spin h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-300 mt-6 text-lg">Verifying your payment...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0118] py-12">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-8">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}
        <h1 className="text-3xl font-bold text-white mb-4">Payment Pending</h1>
        <p className="text-gray-300 text-lg mb-8">
          We haven't received your payment yet. Click below to complete your purchase.
        </p>
        {/* 原生表单提交，重试支付 */}
        <form action="/api/payment" method="POST" className="max-w-md mx-auto">
          <input 
  type="hidden" 
  name="readingId" 
  value={readingId || ''} // 当 readingId 为 null 时，赋值为空字符串
/>
          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Retry Payment
          </button>
        </form>
        <a
          href="/"
          className="inline-block mt-6 text-gray-400 hover:text-white transition text-sm"
        >
          Return to Home Page
        </a>
      </div>
    </main>
  );
}