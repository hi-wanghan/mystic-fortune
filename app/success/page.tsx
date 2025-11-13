'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const rid = params.get('reading_id');
  
  useEffect(() => { 
    setTimeout(() => { 
      if(rid) router.push(`/result/${rid}`); 
    }, 2000); 
  }, [rid, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl p-12 text-center">
        <h1 className="text-2xl font-bold">Processing...</h1>
      </div>
    </div>
  );
}