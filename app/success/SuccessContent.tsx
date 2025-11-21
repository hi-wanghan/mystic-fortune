// /app/success/SuccessContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase-client';

// 定义查询结果的类型接口
interface ReadingPaymentStatus {
  is_paid: boolean;
}

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const readingId = searchParams.get('reading_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!readingId) {
      window.location.href = '/';
      return;
    }

    const checkPayment = async () => {
      try {
        const supabase = getSupabase();
        // 在查询时指定返回类型为 ReadingPaymentStatus
        const { data, error } = await supabase
          .from('readings')
          .select('is_paid')
          .eq('id', readingId)
          .single<ReadingPaymentStatus>(); // 关键：指定类型

        if (error) throw error;

        // 已支付 → 原生跳转完整报告
        if (data.is_paid) { // 现在 TypeScript 能识别 is_paid 了
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

  // 剩余代码保持不变...
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
        <form action="/api/payment" method="POST" className="max-w-md mx-auto">
          <input 
            type="hidden" 
            name="readingId" 
            value={readingId || ''}
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