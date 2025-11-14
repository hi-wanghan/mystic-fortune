// app/success/SuccessContent.tsx
'use client'; // Required for client-side hooks like useSearchParams

import { useSearchParams } from 'next/navigation';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const readingId = searchParams.get('reading_id'); // Extract reading_id from URL

  return (
    <div>
      <h1>Payment Successful!</h1>
      {readingId ? (
        <p>Your BaZi Full Reading ID: {readingId} — Complete report generated successfully!</p>
      ) : (
        <p>Your BaZi Full Reading report is ready. You can return to view it now.</p>
      )}
      {/* Optional: Add a button to navigate back to the result page */}
      {readingId && (
        <a 
          href={`/result/${readingId}`} 
          style={{ 
            display: 'inline-block', 
            marginTop: '1rem', 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '0.375rem' 
          }}
        >
          View My Reading Report
        </a>
      )}
    </div>
  );
}