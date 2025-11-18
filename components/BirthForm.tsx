'use client';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function BirthForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: '',
    time: '12:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    gender: 'male' as 'male' | 'female'
  });
  const [error, setError] = useState('');

  // ✅ 年份限制配置
  const MIN_YEAR = 1939;
  const MAX_YEAR = 2020;
  // 计算 min/max 日期（格式：YYYY-MM-DD）
  const minDate = `${MIN_YEAR}-01-01`;
  const maxDate = `${MAX_YEAR}-12-31`;
  // 默认最大日期取 2020-12-31 和当前日期的较小值（避免选未来日期）
  const finalMaxDate = new Date(maxDate) < new Date() 
    ? maxDate 
    : new Date().toISOString().split('T')[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ 额外校验年份（防止用户手动修改输入框绕过限制）
      const selectedYear = new Date(form.date).getFullYear();
      if (selectedYear < MIN_YEAR || selectedYear > MAX_YEAR) {
        throw new Error(`Birth year must be between ${MIN_YEAR} and ${MAX_YEAR}`);
      }

      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log('API 返回数据：', data);

      if (data.id && typeof data.id === 'string') {
        window.location.href = `/result/${data.id}`;
      } else {
        throw new Error('API 未返回有效的报告 ID');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate your preview. Please try again.');
      console.error('提交失败：', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="glass-gold rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-center">
          <p className="text-white font-bold">🎁 Special Offer: ${process.env.NEXT_PUBLIC_PRICE_USD} (Save 60%!)</p>
        </div>
        
        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Get Your Free Preview
            </h3>
            <p className="text-gray-400 text-sm">
              See your BaZi chart + basic insights instantly (1939-2020)
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Birth Date (1939-2020)
              </label>
              <input
                type="date"
                required
                min={minDate} // ✅ 限制最小日期：1939-01-01
                max={finalMaxDate} // ✅ 限制最大日期：2020-12-31（或当前日期）
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg 
                         text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 
                         focus:outline-none transition-all"
                placeholder="Select birth date"
              />
              <p className="mt-1 text-xs text-gray-500">
                Valid years: {MIN_YEAR} - {MAX_YEAR}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Birth Time
              </label>
              <input
                type="time"
                required
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg 
                         text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 
                         focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gender: 'male' })}
                  className={`py-3 px-4 rounded-lg font-medium transition-all
                    ${form.gender === 'male'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-900/50 text-gray-400 border border-purple-500/20 hover:border-purple-500/50'
                    }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, gender: 'female' })}
                  className={`py-3 px-4 rounded-lg font-medium transition-all
                    ${form.gender === 'female'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-900/50 text-gray-400 border border-purple-500/20 hover:border-purple-500/50'
                    }`}
                >
                  Female
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600
                       text-white py-4 rounded-lg font-bold text-lg 
                       shadow-lg hover:shadow-xl
                       hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <LoadingSpinner />
                  <span>Calculating...</span>
                </span>
              ) : (
                'Get My Free Preview →'
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">
              🔒 Your information is 100% secure and confidential
            </p>
            <p className="text-xs text-gray-400">
              <span className="text-green-400">✓</span> No credit card required for preview
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}