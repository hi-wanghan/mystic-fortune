const fs = require('fs');

console.log('Generating remaining files...\n');

const files = {
  'lib/bazi/calculator.ts': `import { BirthInfo, BaziResult } from '@/types';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, STEM_ELEMENTS, BRANCH_ELEMENTS, ZODIAC_ANIMALS } from './data';
import { generateInterpretation } from './interpretation';

export function calculateBazi(info: BirthInfo): Omit<BaziResult, 'id'|'isPaid'|'createdAt'> {
  const d = new Date(\\T\:00\);
  const y = d.getFullYear(), m = d.getMonth()+1, day = d.getDate(), h = d.getHours();
  const yp = getYearPillar(y), mp = getMonthPillar(y,m), dp = getDayPillar(y,m,day), hp = getHourPillar(dp.heavenlyStem,h);
  const bazi = {year:yp, month:mp, day:dp, hour:hp};
  const elements = calcElements(bazi);
  const interp = generateInterpretation(bazi, elements, info.gender);
  return {birthInfo:info, bazi, elements, summary:interp.summary, fullAnalysis:interp.fullAnalysis};
}

function getYearPillar(y: number) {
  const o = y-1900;
  return {heavenlyStem:HEAVENLY_STEMS[(o+6)%10], earthlyBranch:EARTHLY_BRANCHES[o%12], zodiac:ZODIAC_ANIMALS[o%12]};
}

function getMonthPillar(y: number, m: number) {
  const si = HEAVENLY_STEMS.indexOf(getYearPillar(y).heavenlyStem);
  return {heavenlyStem:HEAVENLY_STEMS[((si%5)*2+m+1)%10], earthlyBranch:EARTHLY_BRANCHES[(m+1)%12]};
}

function getDayPillar(y: number, m: number, d: number) {
  const base = new Date(1900,0,1), curr = new Date(y,m-1,d);
  const diff = Math.floor((curr.getTime()-base.getTime())/86400000);
  return {heavenlyStem:HEAVENLY_STEMS[(diff+6)%10], earthlyBranch:EARTHLY_BRANCHES[(diff+2)%12]};
}

function getHourPillar(ds: string, h: number) {
  const dsi = HEAVENLY_STEMS.indexOf(ds), hbi = Math.floor((h+1)/2)%12;
  return {heavenlyStem:HEAVENLY_STEMS[((dsi%5)*2+hbi)%10], earthlyBranch:EARTHLY_BRANCHES[hbi]};
}

function calcElements(bazi: any) {
  const e = {metal:0, wood:0, water:0, fire:0, earth:0};
  [bazi.year,bazi.month,bazi.day,bazi.hour].forEach(p => {
    const se = STEM_ELEMENTS[p.heavenlyStem] as keyof typeof e;
    const be = BRANCH_ELEMENTS[p.earthlyBranch] as keyof typeof e;
    e[se]+=1.5; e[be]+=1;
  });
  return e;
}

export function getDominant(e: any): string {
  return Object.entries(e).reduce((a,b)=>e[a[0]]>e[b[0]]?a:b)[0];
}`,

  'lib/bazi/interpretation.ts': `import { getDominant } from './calculator';

export function generateInterpretation(bazi: any, elements: any, gender: string) {
  const dom = getDominant(elements);
  const zod = bazi.year.zodiac;
  const summary = \Born in the Year of the \, your dominant element is \. You have natural talents and great potential. Unlock your full reading! 馃専\;
  const fullAnalysis = {
    personality: \Your \ energy makes you naturally talented. You have strong abilities.\,
    career: \Best careers: leadership, creative fields. Your skills shine in dynamic environments.\,
    relationships: \You value deep connections. Communication is key.\,
    health: \Focus on balance and exercise.\,
    wealth: \Strong wealth potential. Focus on long-term investments.\,
    recommendations: ['Wear resonant colors', 'Practice mindfulness', 'Stay positive', 'Trust instincts']
  };
  return {summary, fullAnalysis};
}`,

  'supabase/migrations/001_init.sql': `CREATE TABLE readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  timezone TEXT NOT NULL,
  gender TEXT NOT NULL,
  bazi_data JSONB NOT NULL,
  elements JSONB NOT NULL,
  summary TEXT NOT NULL,
  full_analysis JSONB,
  is_paid BOOLEAN DEFAULT FALSE,
  payment_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID REFERENCES readings(id),
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  customer_email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`,

  'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.animate-fade-in { animation: fadeIn 0.5s; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`,

  'app/layout.tsx': `import './globals.css'
export const metadata = { title: 'BaZi Fortune', description: 'Discover your destiny' }
export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>
}`,

  'components/LoadingSpinner.tsx': `export default function LoadingSpinner() {
  return <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>;
}`,

  'components/BirthForm.tsx': `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

export default function BirthForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({date:'', time:'12:00', timezone:Intl.DateTimeFormat().resolvedOptions().timeZone, gender:'male' as 'male'|'female'});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/calculate', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)});
      const data = await res.json();
      if (data.id) router.push(\/result/\\);
    } catch(err) {
      alert('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8"> BaZi Fortune</h1>
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
          <input type="date" required max={new Date().toISOString().split('T')[0]} value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="w-full px-4 py-3 border rounded-lg text-gray-800"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Birth Time</label>
          <input type="time" required value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="w-full px-4 py-3 border rounded-lg text-gray-800"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={()=>setForm({...form,gender:'male'})} className={\py-3 rounded-lg border-2 \\}>Male</button>
            <button type="button" onClick={()=>setForm({...form,gender:'female'})} className={\py-3 rounded-lg border-2 \\}> Female</button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-semibold">
          {loading ? <LoadingSpinner/> : 'Reveal My Destiny'}
        </button>
      </form>
    </div>
  );
}`,

  'app/page.tsx': `import BirthForm from '@/components/BirthForm';
export default function Home() {
  return <div className="min-h-screen flex items-center justify-center px-4 py-12"><BirthForm/></div>;
}`,

  'app/api/calculate/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { calculateBazi } from '@/lib/bazi/calculator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = calculateBazi(body);
    const supabase = getServiceSupabase();
    const {data,error} = await supabase.from('readings').insert({
      birth_date:body.date, birth_time:body.time, timezone:body.timezone, gender:body.gender,
      bazi_data:result.bazi, elements:result.elements, summary:result.summary, full_analysis:result.fullAnalysis, is_paid:false
    }).select().single();
    if (error) throw error;
    return NextResponse.json({id:data.id, summary:result.summary, bazi:result.bazi, elements:result.elements});
  } catch(e) {
    return NextResponse.json({error:'Failed'}, {status:500});
  }
}`,

  'app/api/payment/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_USD } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const {readingId, email} = await req.json();
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:[{price_data:{currency:'usd', product_data:{name:'BaZi Full Reading'}, unit_amount:Math.round(PRICE_USD*100)}, quantity:1}],
      mode:'payment',
      success_url:\\/success?reading_id=\\,
      cancel_url:\\/result/\\,
      customer_email:email,
      metadata:{readingId}
    });
    return NextResponse.json({sessionId:session.id});
  } catch(e) {
    return NextResponse.json({error:'Failed'}, {status:500});
  }
}`,

  'app/api/webhook/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const rid = session.metadata?.readingId;
      if (rid) {
        const supabase = getServiceSupabase();
        await supabase.from('readings').update({is_paid:true, payment_id:session.payment_intent}).eq('id',rid);
      }
    }
    return NextResponse.json({received:true});
  } catch(e) {
    return NextResponse.json({error:'Webhook error'}, {status:400});
  }
}`,

  'app/result/[id]/page.tsx': `import { getServiceSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function ResultPage({params}: {params:{id:string}}) {
  const supabase = getServiceSupabase();
  const {data} = await supabase.from('readings').select('*').eq('id',params.id).single();
  if (!data) notFound();

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6"> Your BaZi Reading</h1>
        <p className="text-gray-700 mb-8">{data.summary}</p>
        {!data.is_paid && (
          <div className="p-6 bg-purple-50 rounded-lg">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Unlock Full Reading - \$\{process.env.NEXT_PUBLIC_PRICE_USD}</h2>
            <p className="text-purple-700 mb-4">Get detailed insights!</p>
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700">Unlock Now</button>
          </div>
        )}
        {data.is_paid && data.full_analysis && (
          <div className="space-y-6">
            <div><h2 className="text-2xl font-bold mb-2">Personality</h2><p className="text-gray-700">{data.full_analysis.personality}</p></div>
            <div><h2 className="text-2xl font-bold mb-2">Career</h2><p className="text-gray-700">{data.full_analysis.career}</p></div>
            <div><h2 className="text-2xl font-bold mb-2">Relationships</h2><p className="text-gray-700">{data.full_analysis.relationships}</p></div>
          </div>
        )}
      </div>
    </div>
  );
}`,

  'app/success/page.tsx': `'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const rid = params.get('reading_id');
  useEffect(() => { setTimeout(() => { if(rid) router.push(\/result/\\); }, 2000); }, [rid, router]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">?/div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}`,

  'README.md': `#  BaZi Fortune

## Quick Start
\\\bash
npm install
copy .env.local.example .env.local
npm run dev
\\\

Visit http://localhost:3000`
};

Object.entries(files).forEach(([path, content]) => {
  fs.writeFileSync(path, content);
  console.log(path);
});

console.log('\nAll files generated!\n');
console.log('Next steps:');
console.log('1. npm install');
console.log('2. copy .env.local.example .env.local');
console.log('3. Edit .env.local with your API keys');
console.log('4. npm run dev\n');
