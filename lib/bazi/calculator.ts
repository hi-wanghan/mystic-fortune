import { BirthInfo, BaziResult } from '@/types';
import { ZODIAC_SIGNS, ZODIAC_DATES, ELEMENT_MAP } from './data';
import { generateInterpretation } from './interpretation';

export async function calculateBazi(info: BirthInfo): Promise<Omit<BaziResult, 'id' | 'isPaid' | 'createdAt'>> {
  const birthDate = new Date(`${info.date}T${info.time}:00`);
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const hour = birthDate.getHours();

  const sunSign = getSunSign(month, day);
  const risingSign = getRisingSign(hour);
  const moonSign = getMoonSign(day);
  const dominantPlanet = getDominantPlanet(hour);

  const astrology = {
    year: { heavenlyStem: sunSign, earthlyBranch: ELEMENT_MAP[sunSign], zodiac: sunSign },
    month: { heavenlyStem: risingSign, earthlyBranch: ELEMENT_MAP[risingSign] },
    day: { heavenlyStem: moonSign, earthlyBranch: ELEMENT_MAP[moonSign] },
    hour: { heavenlyStem: dominantPlanet, earthlyBranch: 'Planetary' }
  };

  const elements = calculateElements(astrology);
  
  // 调用解读生成（传入城市）
  const interpretation = generateInterpretation(
    astrology,
    elements,
    info.gender,
    info.date,
    info.time,
    info.city
  );

  return {
    birthInfo: info,
    bazi: astrology,
    elements,
    summary: interpretation.summary,
    fullAnalysis: interpretation.fullAnalysis
  };
}

function getSunSign(month: number, day: number): string {
  for (const zodiac of ZODIAC_DATES) {
    const [startMonth, startDay] = zodiac.start;
    const [endMonth, endDay] = zodiac.end;
    
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (startMonth > endMonth && (month === startMonth || month === endMonth))
    ) {
      return zodiac.sign;
    }
  }
  return 'Aries';
}

function getRisingSign(hour: number): string {
  const index = Math.floor(hour / 2) % 12;
  return ZODIAC_SIGNS[index];
}

function getMoonSign(day: number): string {
  const index = (day - 1) % 12;
  return ZODIAC_SIGNS[index];
}

function getDominantPlanet(hour: number): string {
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  return planets[hour % 7];
}

function calculateElements(astrology: any) {
  const elements = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
  
  const elementMapping: Record<string, keyof typeof elements> = {
    'Fire': 'fire',
    'Earth': 'earth',
    'Air': 'metal',
    'Water': 'water'
  };

  [astrology.year, astrology.month, astrology.day].forEach(pillar => {
    const element = pillar.earthlyBranch;
    const mappedElement = elementMapping[element] || 'wood';
    elements[mappedElement] += 1.5;
  });

  return elements;
}

export function getDominant(elements: any): string {
  return Object.entries(elements).reduce((a, b) => 
    elements[a[0]] > elements[b[0]] ? a : b
  )[0];
}