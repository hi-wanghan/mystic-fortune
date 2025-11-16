'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const readingId = searchParams.get('reading_id');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleCheckout = async () => {
    if (!email || !readingId) {
      alert('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readingId, email })
      });

      const data = await res.json();
      
      if (data.sessionId) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        await stripe?.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        alert('Failed to create checkout session');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0118] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-purple-500/30 p-8">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Unlock Your Full Reading
          </h1>
          
          <p className="text-gray-300 text-center mb-6">
            Get instant access to your complete 3000+ word astrology report
          </p>

          {/* Price */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 mb-6 text-center">
            <div className="text-gray-400 line-through mb-2">$49</div>
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ${process.env.NEXT_PUBLIC_PRICE_USD || '19'}
            </div>
            <p className="text-gray-400 text-sm mt-2">One-time payment</p>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-6">
            <FeatureItem text="Complete personality analysis" />
            <FeatureItem text="Career & life purpose guidance" />
            <FeatureItem text="Love & relationship insights" />
            <FeatureItem text="Wealth opportunities & timing" />
            <FeatureItem text="12-month cosmic forecast" />
            <FeatureItem text="Spiritual growth recommendations" />
          </div>

          {/* Email input */}
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500
                     focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all mb-4"
          />

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            disabled={loading || !email}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500
                     text-white py-4 rounded-lg font-bold text-lg shadow-xl
                     hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mt-6">
            <span>🔒 Secure payment</span>
            <span>✓ 30-day guarantee</span>
            <span>✓ Instant access</span>
          </div>

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="w-full mt-4 text-gray-400 hover:text-white transition text-sm"
          >
            ← Back
          </button>
        </div>
      </div>
    </main>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span>{text}</span>
    </div>
  );
}