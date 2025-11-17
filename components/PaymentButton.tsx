'use client';

import { useState, useRef } from 'react';

export default function PaymentButton({ readingId }: { readingId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const PRICE_USD = process.env.NEXT_PUBLIC_PRICE_USD || '2.99';
  // 隐藏的 a 标签引用，用于触发跳转
  const paymentLinkRef = useRef<HTMLAnchorElement>(null);

  const handlePay = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readingId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get payment link');

      // 拿到支付链接后，通过 a 标签触发跳转
      if (data.url && paymentLinkRef.current) {
        paymentLinkRef.current.href = data.url;
        paymentLinkRef.current.click(); // 模拟点击 a 标签
      } else {
        throw new Error('Payment link is invalid');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Payment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* 隐藏的 a 标签，用于触发跳转（CSP 允许） */}
      <a ref={paymentLinkRef} target="_top" className="hidden" />

      {/* 支付按钮 */}
      <button
        onClick={handlePay}
        disabled={isLoading}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : `Unlock Full Reading ($${PRICE_USD})`}
      </button>

      {/* 错误提示 */}
      {error && (
        <p className="mt-2 text-red-400 text-sm text-center">{error}</p>
      )}
    </div>
  );
}