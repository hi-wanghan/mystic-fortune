'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import PaymentButton from '@/components/PaymentButton';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResultPage() {
  const { readingId } = useParams();
  const [reading, setReading] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!readingId) return;

    // 从数据库获取该 reading 的信息（包含 paid 状态）
    const fetchReading = async () => {
      try {
        const { data, error } = await supabase
          .from('readings')
          .select('*')
          .eq('id', readingId)
          .single();

        if (error) throw error;
        setReading(data);
      } catch (err: any) {
        setError('Failed to load your reading');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [readingId]);

  if (loading) return <div className="text-center text-white py-10">Loading your report...</div>;
  if (error) return <div className="text-center text-red-400 py-10">{error}</div>;
  if (!reading) return <div className="text-center text-white py-10">Report not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Your Bazi Full Report
      </h1>

      {/* 基础信息预览（免费部分） */}
      <div className="bg-white/5 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
        <p className="text-gray-300 mb-2">Birth Date: {reading.birth_date}</p>
        <p className="text-gray-300">Bazi Chart: {reading.bazi?.map((pillar: any) => pillar.stem + pillar.branch).join(' ')}</p>
      </div>

      {/* 完整报告（付费后显示） */}
      {reading.paid ? (
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Comprehensive Analysis</h3>
          <p className="text-gray-300 leading-relaxed">{reading.full_report || 'Full report content here...'}</p>
          {/* 这里可以渲染完整的 3000+ 字报告 */}
        </div>
      ) : (
        // 未付费，显示支付引导
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-4">Unlock Full Report</h3>
          <p className="text-gray-300 mb-6">Get access to 3000+ words of in-depth Bazi analysis</p>
          <PaymentButton readingId={readingId as string} />
        </div>
      )}
    </div>
  );
}