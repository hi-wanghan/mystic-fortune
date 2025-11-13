'use client';
import { useState } from 'react';

export default function PaymentButton({ readingId }: { readingId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readingId })
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (error) {
      alert('The cosmic forces are unclear. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 
               text-gray-900 py-6 rounded-xl font-bold text-xl 
               shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70
               hover:scale-[1.02] active:scale-[0.98]
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <span className="relative flex items-center justify-center gap-3">
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
            <span>Opening the Portal...</span>
          </>
        ) : (
          <>
            <span>🔮</span>
            <span>Unlock Full Reading</span>
            <span>✨</span>
          </>
        )}
      </span>
    </button>
  );
}