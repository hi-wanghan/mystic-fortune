import { getDominant } from './calculator';

export function generateInterpretation(
  astrology: any,
  elements: any,
  gender: string,
  birthDate: string,
  birthTime: string,
  city: string
) {
  const sunSign = astrology.year.heavenlyStem;
  const risingSign = astrology.month.heavenlyStem;
  const moonSign = astrology.day.heavenlyStem;
  const element = astrology.year.earthlyBranch;

  // 免费版摘要（静态模板）
  const summary = `Welcome! Your cosmic blueprint reveals a powerful ${sunSign} Sun with ${risingSign} Rising and Moon in ${moonSign}. Born in ${city}, your ${element} element gives you unique strengths in leadership and creativity. Your birth time of ${birthTime} indicates strong intuitive abilities. This is just a glimpse—unlock your complete reading to discover your life purpose, career path, love compatibility, wealth timing, and personalized guidance for the year ahead! ✨`;

  // 付费版完整解读（静态模板）
  const fullAnalysis = {
    personality: `As a ${sunSign} with ${risingSign} Rising, you possess a rare combination of ${getPersonalityTrait(sunSign)} and ${getRisingTrait(risingSign)}. Your Moon in ${moonSign} adds ${getMoonTrait(moonSign)}. Born under the ${element} element in ${city}, you naturally excel in ${getElementStrength(element)}. Your birth time of ${birthTime} reveals you are at peak energy during ${getPeakTime(birthTime)}. People often describe you as charismatic, insightful, and surprisingly intuitive. Your greatest strength is your ability to inspire others and take decisive action, while your growth area involves balancing ambition with patience.`,
    
    career: `Your ${sunSign} Sun indicates exceptional talent in ${getCareerFields(sunSign)}. The ${risingSign} Rising suggests you will find greatest success in roles involving ${getCareerStyle(risingSign)}. Best career timing for ${city}: The next 6-12 months show strong opportunities, particularly in Spring (March-May) and Fall (September-November). Your ${element} element indicates you should focus on building strategic networks and showcasing your expertise. Favorable months for major career moves: March, June, September, and December 2024.`,
    
    relationships: `In love, your ${moonSign} Moon seeks ${getRelationshipNeed(moonSign)}. Best compatibility: You harmonize beautifully with ${getCompatibleSigns(sunSign)}. Your ${element} nature makes you ${getRelationshipStyle(element)} in partnerships. Timing for love in ${city}: Spring and early Fall 2024 show heightened romantic energy and opportunities to meet significant people. What you need in a partner: emotional intelligence, shared ambition, and someone who appreciates your authentic, ${sunSign} nature.`,
    
    health: `Your ${element} constitution suggests focusing on ${getHealthFocus(element)}. Key areas to monitor: ${getHealthAreas(element)}. Best wellness practices for your chart: ${getWellnessPractices(element)}. Your birth time of ${birthTime} indicates your body's natural rhythm peaks during ${getPeakTime(birthTime)}. Recommendations: Morning meditation, physical activity in ${getExerciseTiming(element)}, adequate hydration, and maintaining work-life balance. Consider outdoor exercises in ${city}'s parks or nature areas.`,
    
    wealth: `Financial potential: STRONG. Your ${sunSign} Sun with ${risingSign} Rising creates excellent earning capacity through ${getWealthStrategy(sunSign)}. Best wealth-building periods: Q2 (April-June) and Q4 (October-December) 2024 show the strongest financial opportunities. Investment style for your chart: ${getInvestmentStyle(element)}. Lucky money days: Tuesdays, Thursdays, and the 8th of each month. Career moves or investments initiated during these times in ${city} have historically higher success rates. Wealth affirmation: "I attract abundance effortlessly through my natural ${sunSign} talents."`,
    
    recommendations: [
      `Wear ${getColorRecommendation(element)} to enhance your ${element} energy and attract opportunities`,
      `Best productivity hours for you: ${getPeakTime(birthTime)} - schedule important tasks then`,
      `Place a citrine or pyrite crystal in your ${city} workspace for abundance manifestation`,
      `Practice morning gratitude meditation to align with cosmic flow`,
      `Connect with nature regularly - ${element} signs especially benefit from ${getNatureActivity(element)}`,
      `Trust your ${moonSign} Moon intuition - your birth chart shows strong psychic sensitivity`
    ]
  };

  return { summary, fullAnalysis };
}

// Helper functions
function getPersonalityTrait(sign: string): string {
  const traits: Record<string, string> = {
    'Aries': 'bold courage and pioneering drive',
    'Taurus': 'steadfast determination and practical wisdom',
    'Gemini': 'quick wit and versatile communication',
    'Cancer': 'deep empathy and nurturing instincts',
    'Leo': 'natural leadership and creative brilliance',
    'Virgo': 'analytical precision and helpful service',
    'Libra': 'diplomatic grace and aesthetic refinement',
    'Scorpio': 'intense passion and transformative power',
    'Sagittarius': 'adventurous optimism and philosophical depth',
    'Capricorn': 'ambitious discipline and strategic mastery',
    'Aquarius': 'innovative genius and humanitarian vision',
    'Pisces': 'mystical intuition and artistic sensitivity'
  };
  return traits[sign] || 'unique charisma';
}

function getRisingTrait(sign: string): string {
  return getPersonalityTrait(sign);
}

function getMoonTrait(sign: string): string {
  const traits: Record<string, string> = {
    'Aries': 'emotional courage and direct expression',
    'Taurus': 'emotional stability and sensory appreciation',
    'Gemini': 'emotional versatility and need for mental stimulation',
    'Cancer': 'deep emotional sensitivity and protective instincts',
    'Leo': 'emotional warmth and need for recognition',
    'Virgo': 'emotional pragmatism and analytical processing',
    'Libra': 'emotional balance and desire for harmony',
    'Scorpio': 'emotional intensity and transformative depth',
    'Sagittarius': 'emotional freedom and philosophical outlook',
    'Capricorn': 'emotional reserve and structured feelings',
    'Aquarius': 'emotional detachment and humanitarian feelings',
    'Pisces': 'emotional empathy and spiritual connection'
  };
  return traits[sign] || 'emotional depth';
}

function getElementStrength(element: string): string {
  const strengths: Record<string, string> = {
    'Fire': 'leadership roles, creative ventures, and inspiring others',
    'Earth': 'building lasting structures, financial management, and practical problem-solving',
    'Air': 'communication, networking, and innovative thinking',
    'Water': 'emotional intelligence, healing work, and intuitive guidance'
  };
  return strengths[element] || 'versatile pursuits';
}

function getPeakTime(time: string): string {
  const hour = parseInt(time.split(':')[0]);
  if (hour < 6) return 'late night to early morning (11pm-6am)';
  if (hour < 12) return 'morning hours (6am-12pm)';
  if (hour < 18) return 'afternoon (12pm-6pm)';
  return 'evening and night (6pm-11pm)';
}

function getCareerFields(sign: string): string {
  const fields: Record<string, string> = {
    'Aries': 'entrepreneurship, sports, emergency services, and leadership',
    'Taurus': 'finance, real estate, agriculture, luxury goods, and arts',
    'Gemini': 'journalism, teaching, sales, technology, and communications',
    'Cancer': 'healthcare, hospitality, social work, and family services',
    'Leo': 'entertainment, management, politics, and creative arts',
    'Virgo': 'healthcare, analysis, editing, quality control, and administration',
    'Libra': 'law, diplomacy, design, counseling, and partnerships',
    'Scorpio': 'research, psychology, investigation, finance, and transformation work',
    'Sagittarius': 'travel, education, philosophy, international business, and publishing',
    'Capricorn': 'business management, engineering, government, and architecture',
    'Aquarius': 'technology, science, humanitarian work, and innovation',
    'Pisces': 'arts, healing professions, charity work, and spiritual services'
  };
  return fields[sign] || 'creative and strategic fields';
}

function getCareerStyle(sign: string): string {
  const styles: Record<string, string> = {
    'Aries': 'independent action and pioneering initiatives',
    'Taurus': 'steady building and tangible results',
    'Gemini': 'communication and variety',
    'Cancer': 'nurturing and emotional connection',
    'Leo': 'leadership and public recognition',
    'Virgo': 'service and perfection',
    'Libra': 'collaboration and aesthetic refinement',
    'Scorpio': 'deep research and transformation',
    'Sagittarius': 'exploration and teaching',
    'Capricorn': 'structure and achievement',
    'Aquarius': 'innovation and social impact',
    'Pisces': 'creativity and compassion'
  };
  return styles[sign] || 'leadership and innovation';
}

function getRelationshipNeed(sign: string): string {
  return 'deep emotional connection, intellectual stimulation, and mutual respect';
}

function getCompatibleSigns(sign: string): string {
  const compatible: Record<string, string> = {
    'Aries': 'Leo, Sagittarius, Gemini, and Aquarius',
    'Taurus': 'Virgo, Capricorn, Cancer, and Pisces',
    'Gemini': 'Libra, Aquarius, Aries, and Leo',
    'Cancer': 'Scorpio, Pisces, Taurus, and Virgo',
    'Leo': 'Aries, Sagittarius, Gemini, and Libra',
    'Virgo': 'Taurus, Capricorn, Cancer, and Scorpio',
    'Libra': 'Gemini, Aquarius, Leo, and Sagittarius',
    'Scorpio': 'Cancer, Pisces, Virgo, and Capricorn',
    'Sagittarius': 'Aries, Leo, Libra, and Aquarius',
    'Capricorn': 'Taurus, Virgo, Scorpio, and Pisces',
    'Aquarius': 'Gemini, Libra, Aries, and Sagittarius',
    'Pisces': 'Cancer, Scorpio, Taurus, and Capricorn'
  };
  return compatible[sign] || 'compatible water and earth signs';
}

function getRelationshipStyle(element: string): string {
  const styles: Record<string, string> = {
    'Fire': 'passionate, direct, and enthusiastic',
    'Earth': 'loyal, stable, and nurturing',
    'Air': 'communicative, intellectual, and social',
    'Water': 'intuitive, empathetic, and deeply caring'
  };
  return styles[element] || 'devoted and authentic';
}

function getHealthFocus(element: string): string {
  const focus: Record<string, string> = {
    'Fire': 'cardiovascular health, stress management, and maintaining steady energy',
    'Earth': 'digestive health, physical activity, and avoiding sedentary habits',
    'Air': 'respiratory health, mental clarity, and nervous system balance',
    'Water': 'kidney health, emotional wellness, and fluid balance'
  };
  return focus[element] || 'overall wellness and balance';
}

function getHealthAreas(element: string): string {
  const areas: Record<string, string> = {
    'Fire': 'heart, blood pressure, and adrenal system',
    'Earth': 'digestion, bones, and muscular system',
    'Air': 'lungs, nervous system, and circulation',
    'Water': 'kidneys, reproductive system, and lymphatic system'
  };
  return areas[element] || 'general vitality';
}

function getWellnessPractices(element: string): string {
  const practices: Record<string, string> = {
    'Fire': 'yoga, swimming (cooling), meditation, and adequate rest',
    'Earth': 'hiking, weight training, grounding exercises, and regular meals',
    'Air': 'breathing exercises, tai chi, journaling, and social activities',
    'Water': 'swimming, hydrotherapy, emotional release work, and adequate sleep'
  };
  return practices[element] || 'balanced exercise and mindfulness';
}

function getExerciseTiming(element: string): string {
  const timing: Record<string, string> = {
    'Fire': 'early morning or evening (avoid midday heat)',
    'Earth': 'any time, especially afternoon',
    'Air': 'morning or late afternoon',
    'Water': 'evening or near water bodies'
  };
  return timing[element] || 'morning or early evening';
}

function getWealthStrategy(sign: string): string {
  const strategies: Record<string, string> = {
    'Leo': 'creative ventures, personal branding, and leveraging your natural charisma',
    'Virgo': 'detailed planning, service-based businesses, and efficiency optimization',
    'Scorpio': 'strategic investments, research-based decisions, and transformation industries',
    'Sagittarius': 'international ventures, education, and philosophical enterprises'
  };
  return strategies[sign] || 'combining creativity with strategic planning';
}

function getInvestmentStyle(element: string): string {
  const styles: Record<string, string> = {
    'Fire': 'growth stocks, startup investments, and entrepreneurial ventures',
    'Earth': 'real estate, stable dividend stocks, and tangible assets',
    'Air': 'technology stocks, diverse portfolio, and innovative sectors',
    'Water': 'intuitive picks, healthcare, and adaptive strategies'
  };
  return styles[element] || 'balanced portfolio with growth focus';
}

function getColorRecommendation(element: string): string {
  const colors: Record<string, string> = {
    'Fire': 'red, orange, gold, and bright yellow',
    'Earth': 'brown, beige, yellow, and earth tones',
    'Air': 'white, light blue, silver, and pastels',
    'Water': 'blue, purple, sea green, and black'
  };
  return colors[element] || 'purple, gold, or deep blue';
}

function getNatureActivity(element: string): string {
  const activities: Record<string, string> = {
    'Fire': 'sunlight, mountain hiking, or open fire meditation',
    'Earth': 'forest walks, gardening, or grounding barefoot',
    'Air': 'open spaces, wind activities, or high-altitude areas',
    'Water': 'beach visits, river walks, or water meditation'
  };
  return activities[element] || 'outdoor activities near water or mountains';
}