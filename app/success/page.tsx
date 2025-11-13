'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const rid = params.get('reading_id');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (rid) {
        router.push(`/result/${rid}`);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [rid, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white rounded-2xl p-12 text-center shadow-xl">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-800">Generating...</h1>
      </div>
    </div>
  );
}