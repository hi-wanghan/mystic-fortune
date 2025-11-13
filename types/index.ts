export interface BirthInfo {
  name?: string;
  date: string;
  time: string;
  city: string;
  timezone: string;
  gender: 'male' | 'female';
}

export interface BaziPillar {
  heavenlyStem: string;
  earthlyBranch: string;
  zodiac?: string;
}

export interface BaziChart {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
}

export interface Elements {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface BaziResult {
  id: string;
  birthInfo: BirthInfo;
  bazi: BaziChart;
  elements: Elements;
  summary: string;
  fullAnalysis: FullAnalysis | null;
  isPaid: boolean;
  createdAt: string;
}

export interface FullAnalysis {
  personality: string;
  career: string;
  relationships: string;
  health: string;
  wealth: string;
  recommendations: string[];
}