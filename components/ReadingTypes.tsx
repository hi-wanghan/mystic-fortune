export default function ReadingTypes() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          What Your Reading Covers
        </h2>
        <p className="text-xl text-gray-400">
          Comprehensive insights into every area of your life
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReadingCard
          icon="💝"
          title="Love & Relationships"
          description="Your romantic compatibility, relationship patterns, and ideal partner characteristics."
          color="from-pink-500 to-rose-500"
        />
        <ReadingCard
          icon="💼"
          title="Career & Success"
          description="Your natural talents, ideal career paths, and timing for major decisions."
          color="from-blue-500 to-cyan-500"
        />
        <ReadingCard
          icon="💰"
          title="Wealth & Finance"
          description="Your money-making potential, investment timing, and financial opportunities."
          color="from-yellow-500 to-orange-500"
        />
        <ReadingCard
          icon="🌟"
          title="Personality"
          description="Deep insights into your character, strengths, challenges, and life purpose."
          color="from-purple-500 to-pink-500"
        />
        <ReadingCard
          icon="🌿"
          title="Health & Wellness"
          description="Your physical constitution, health tendencies, and wellness recommendations."
          color="from-green-500 to-emerald-500"
        />
        <ReadingCard
          icon="🔮"
          title="Annual Forecast"
          description="Your lucky and challenging periods for the next 12 months."
          color="from-indigo-500 to-purple-500"
        />
      </div>
    </div>
  );
}

function ReadingCard({ icon, title, description, color }: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="glass rounded-2xl p-6 hover:scale-105 transition-all group cursor-pointer">
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}