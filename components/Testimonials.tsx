export default function Testimonials() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          What Our Clients Say
        </h2>
        <p className="text-xl text-gray-400">
          Real experiences from real people
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <TestimonialCard
          name="Jennifer L."
          location="New York, USA"
          avatar="https://i.pravatar.cc/150?img=1"
          text="I was skeptical at first, but this reading was incredibly accurate. It helped me understand why I've been struggling in my career and gave me actionable advice. Within 3 months, I got the promotion I'd been waiting for!"
          rating={5}
          verified={true}
        />
        <TestimonialCard
          name="Michael Chen"
          location="Singapore"
          avatar="https://i.pravatar.cc/150?img=33"
          text="The wealth timing predictions were spot-on. I made an investment during my 'favorable period' and saw amazing returns. This is now my go-to tool for important financial decisions."
          rating={5}
          verified={true}
        />
        <TestimonialCard
          name="Sarah Williams"
          location="London, UK"
          avatar="https://i.pravatar.cc/150?img=5"
          text="The relationship insights were life-changing. Understanding my compatibility patterns helped me recognize red flags early and ultimately find a partner who truly complements my energy. Thank you!"
          rating={5}
          verified={true}
        />
      </div>

      <div className="mt-12 text-center">
        <button className="text-purple-400 hover:text-purple-300 font-semibold">
          Read 12,847 more reviews →
        </button>
      </div>
    </div>
  );
}

function TestimonialCard({ name, location, avatar, text, rating, verified }: {
  name: string;
  location: string;
  avatar: string;
  text: string;
  rating: number;
  verified: boolean;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <img 
          src={avatar} 
          alt={name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-bold text-white">{name}</div>
            {verified && (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                ✓
              </div>
            )}
          </div>
          <div className="text-sm text-gray-400">{location}</div>
        </div>
      </div>
      
      <div className="mb-3">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
      </div>
      
      <p className="text-gray-300 leading-relaxed italic">"{text}"</p>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          ✓ Verified Purchase
        </div>
      </div>
    </div>
  );
}