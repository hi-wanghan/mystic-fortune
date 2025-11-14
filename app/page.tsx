'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0118]">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mystic Fortune
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a href="#how" className="text-gray-300 hover:text-white transition">How It Works</a>
              <a href="#reviews" className="text-gray-300 hover:text-white transition">Reviews</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - FULL WIDTH VERTICAL */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Top Section: Birth Form FIRST */}
          <div className="mb-8">
            <div id="birth-form" className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 p-3 text-center">
                <p className="text-white font-bold">No credit card required 100% secure & confidential</p>
              </div>
              
              <div className="p-6 lg:p-8">
                <div className="text-center mb-6">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Discover Your
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"> Cosmic Destiny</span>
                  </h1>
                </div>

                <BirthForm />
              </div>
            </div>
          </div>

          {/* Bottom Section: Pricing & Features */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-purple-500/30 overflow-hidden">

            
            <div className="p-6 lg:p-8">
              {/* Trust Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">

                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left: Price */}
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                    Complete Astrology Reading
                  </h2>

                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                    <span className="text-3xl text-gray-400 line-through">$49</span>
                    <span className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ${process.env.NEXT_PUBLIC_PRICE_USD || '19'}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 mb-4">One-time payment • Instant access</p>

                  {/* Reviews */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-400">4.9/5</span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => document.getElementById('birth-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full lg:w-auto px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500
                             text-white rounded-lg font-bold text-lg shadow-xl hover:shadow-purple-500/50
                             hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                  >
                    <span>Get Started</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>

                  <p className="text-xs text-gray-500 mt-3">↑ Fill the form above to start</p>
                </div>

                {/* Right: Features */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white mb-4">What You'll Receive:</h3>
                  
                  <FeatureItem text="Complete natal chart analysis" />
                  <FeatureItem text="Deep personality insights (3000+ words)" />
                  <FeatureItem text="Career path & life purpose guidance" />
                  <FeatureItem text="Love compatibility & relationship insights" />
                  <FeatureItem text="Wealth timing & abundance opportunities" />
                  <FeatureItem text="12-month cosmic forecast with dates" />
                  <FeatureItem text="Spiritual guidance & karmic lessons" />
                  <FeatureItem text="Personalized remedies & action steps" />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No credit card needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Instant results</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% confidential</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-y border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <StatItem number="50,000+" label="Happy Clients" />
            <StatItem number="4.9/5" label="Average Rating" />
            <StatItem number="95%" label="Accuracy Rate" />
            <StatItem number="24/7" label="Instant Access" />
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section id="how" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Your Complete Cosmic Blueprint
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover the secrets hidden in your birth chart
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              title="Life Purpose & Destiny"
              description="Uncover your soul's mission and the unique path you're meant to walk in this lifetime."
              gradient="from-blue-500/10 to-cyan-500/10"
              border="border-blue-500/20"
            />
            <FeatureCard
              title="Wealth & Abundance"
              description="Learn when the stars align for financial opportunities and how to attract prosperity."
              gradient="from-yellow-500/10 to-orange-500/10"
              border="border-yellow-500/20"
            />
            <FeatureCard
              title="Love & Soulmates"
              description="Discover your romantic destiny, compatibility patterns, and when love will find you."
              gradient="from-pink-500/10 to-rose-500/10"
              border="border-pink-500/20"
            />
            <FeatureCard
              title="Personality & Gifts"
              description="Reveal your hidden talents, strengths, and the unique gifts the universe gave you."
              gradient="from-purple-500/10 to-indigo-500/10"
              border="border-purple-500/20"
            />
            <FeatureCard
              title="Spiritual Path"
              description="Connect with your higher self and understand your spiritual journey and karmic lessons."
              gradient="from-green-500/10 to-emerald-500/10"
              border="border-green-500/20"
            />
            <FeatureCard
              title="Year Ahead Forecast"
              description="See what the cosmos has planned for you in the next 12 months with exact dates."
              gradient="from-violet-500/10 to-purple-500/10"
              border="border-violet-500/20"
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-16 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              What People Are Saying
            </h2>
            <p className="text-lg text-gray-400">
              Real experiences from verified users
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <ReviewCard
              name="Jennifer Martinez"
              role="Marketing Director"
              location="New York, USA"
              text="This reading changed my life! The career predictions were so accurate - I got my dream job exactly when it said I would."
              rating={5}
            />
            <ReviewCard
              name="David Chen"
              role="Entrepreneur"
              location="Singapore"
              text="I was skeptical about astrology, but this reading blew my mind. The wealth forecast helped me time my investments perfectly."
              rating={5}
            />
            <ReviewCard
              name="Sarah Johnson"
              role="Wellness Coach"
              location="London, UK"
              text="The love section was incredibly insightful. I finally understood my patterns and met my soulmate 3 months later!"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 mb-4">
            <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-red-400 font-medium">60% OFF ends in 48 hours</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Ready to Unlock Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Cosmic Blueprint?
            </span>
          </h2>

          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 50,000+ people who've discovered their destiny
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <div className="text-center">
              <div className="text-xl text-gray-400 line-through">$49</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ${process.env.NEXT_PUBLIC_PRICE_USD || '19'}
              </div>
            </div>

            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-bold text-lg shadow-xl hover:shadow-purple-500/50 transition-all hover:scale-105"
            >
              Get My Reading Now
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span>✓ Instant Access</span>
            <span>✓ 30-Day Guarantee</span>
            <span>✓ 100% Confidential</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-gray-500 text-sm">
              © 2024 Mystic Fortune. All rights reserved.
            </div>
            <div className="flex gap-4 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300 transition">Privacy</a>
              <a href="#" className="hover:text-gray-300 transition">Terms</a>
              <a href="#" className="hover:text-gray-300 transition">Refund</a>
              <a href="#" className="hover:text-gray-300 transition">Contact</a>
            </div>
          </div>
          <div className="text-center text-xs text-gray-600 mt-3">
            For entertainment purposes. Results may vary.
          </div>
        </div>
      </footer>
    </main>
  );
}

// Components
function BirthForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '12:00',
    city: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    gender: 'male' as 'male' | 'female'
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.id) router.push(`/result/${data.id}`);
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Name <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500
                     focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Birth City <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g., New York, London, Tokyo"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500
                     focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Birth Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            required
            max={new Date().toISOString().split('T')[0]}
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 
                     focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Birth Time <span className="text-red-400">*</span>
          </label>
          <input
            type="time"
            required
            value={form.time}
            onChange={e => setForm({ ...form, time: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-100 
                     focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gender <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['male', 'female'].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => setForm({ ...form, gender: gender as 'male' | 'female' })}
                className={`py-3 px-4 rounded-lg font-medium transition-all capitalize
                  ${form.gender === gender
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/50'
                  }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500
                 text-white py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-purple-500/50
                 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-300"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Reading the Stars...
          </span>
        ) : (
          'Get My Free Preview →'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        50,000+ readings delivered • 4.9/5 rating (12,847 reviews)
      </p>
    </form>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-gray-300">{text}</span>
    </div>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
        {number}
      </div>
      <div className="text-gray-400 text-xs">{label}</div>
    </div>
  );
}

function FeatureCard({ title, description, gradient, border }: {
  title: string;
  description: string;
  gradient: string;
  border: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} border ${border} rounded-xl p-5 hover:scale-105 transition-all`}>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function ReviewCard({ name, role, location, text, rating }: {
  name: string;
  role: string;
  location: string;
  text: string;
  rating: number;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(rating)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      
      <p className="text-gray-300 leading-relaxed text-sm mb-4 italic">"{text}"</p>
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
        <div>
          <div className="font-bold text-white text-sm">{name}</div>
          <div className="text-xs text-gray-400">{role} • {location}</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="text-xs text-gray-500">✓ Verified Purchase</div>
      </div>
    </div>
  );
}