export default function HowItWorks() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          How It Works
        </h2>
        <p className="text-xl text-gray-400">
          Get your personalized reading in 3 simple steps
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <StepCard
          number="1"
          title="Enter Your Details"
          description="Provide your birth date, time, and gender. Takes less than 60 seconds."
          icon="📝"
        />
        <StepCard
          number="2"
          title="AI Analyzes Your Chart"
          description="Our advanced AI processes your unique BaZi chart using ancient wisdom."
          icon="🤖"
        />
        <StepCard
          number="3"
          title="Receive Your Reading"
          description="Get instant access to your comprehensive, personalized analysis."
          icon="✨"
        />
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
          <span className="text-green-400">⚡</span>
          <span>Average completion time: 2 minutes</span>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, description, icon }: {
  number: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="relative">
      <div className="glass rounded-2xl p-8 text-center">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
          {number}
        </div>
        <div className="text-6xl mb-6 mt-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}