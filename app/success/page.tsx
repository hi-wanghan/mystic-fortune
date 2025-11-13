'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const rid = params.get('reading_id');
  useEffect(() => { setTimeout(() => { if(rid) router.push(/result/\); }, 2000); }, [rid, router]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">?/div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}