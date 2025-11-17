'use client';

import { useState } from 'react';

// 不需要 Stripe SDK，直接用接口返回的 url 跳转（更简单可靠）
export default function PaymentButton({ readingId }: { readingId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const PRICE_USD = process.env.NEXT_PUBLIC_PRICE_USD || '2.99';

  const handlePay = async () => {
    setIsLoading(true);
    try {
      console.log('发起支付，readingId：', readingId);
      
      // 调用后端接口获取支付链接
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readingId }),
      });

      const data = await res.json();
      console.log('接口返回数据：', data); // 打印返回的 url，验证是否拿到

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create payment session');
      }

      // ✅ redirect after receiving the url
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Payment URL not found');
      }
    } catch (error: any) {
      console.error('支付失败：', error.message);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={isLoading}
      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Processing...' : `Unlock Full Reading ($${PRICE_USD})`}
    </button>
  );
}