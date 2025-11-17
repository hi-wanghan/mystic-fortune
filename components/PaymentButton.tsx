'use client';

export default function PaymentButton({ readingId }: { readingId: string }) {
  const PRICE_USD = process.env.NEXT_PUBLIC_PRICE_USD || '2.99';

  // 原生表单提交，无 JS 动态跳转，CSP 完全允许
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.submit(); // 原生表单提交，无 CSP 限制
  };

  return (
    <form
      onSubmit={handleSubmit}
      action="/api/payment"
      method="POST"
      className="w-full"
    >
      {/* 传递 readingId（隐藏字段） */}
      <input
        type="hidden"
        name="readingId"
        value={readingId}
      />
      {/* 支付按钮 */}
      <button
        type="submit"
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        Unlock Full Reading ($${PRICE_USD})
      </button>
    </form>
  );
}