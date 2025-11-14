// app/success/page.tsx
import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

// Server Component (no 'use client' needed)
export default function SuccessPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Suspense boundary: Shows fallback during client-side loading */}
      <Suspense fallback={<div>Loading your success page...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}