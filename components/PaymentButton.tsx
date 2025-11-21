import React from 'react';

interface PaymentButtonProps {
  readingId: string;
}

export default function PaymentButton({ readingId }: PaymentButtonProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.submit(); // 原生表单提交，避免CSP问题
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      action="/api/payment" 
      method="POST"
      className="mt-6"
    >
      <input 
        type="hidden" 
        name="readingId" 
        value={readingId} 
      />
      <button 
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        Unlock Full Reading
      </button>
    </form>
  );
}