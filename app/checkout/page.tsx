'use client';

import { Suspense } from 'react';
import CheckoutContent from './CheckoutContent';

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0118] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}