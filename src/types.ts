export type MeasureData = Record<string, number | string>;

export interface DemographicsData {
  callSign: string;
  email: string;
  age: string;
  gender: string;
  role: string;
  status: string;
  years: string;
  leadership: string;
  military: string;
  setting: string;
}

export interface AppState {
  demographics: DemographicsData;
  springer: MeasureData;
}

export interface ScoringTier {
  min: number;
  max: number;
  label: string;
  category: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  bgLight: string;
  description: string;
}
