import type { Kingdom } from './kingdom';

export type CampaignId = 'grade-2' | 'grade-3';
export type CampaignGrade = 2 | 3 | 'grade-2' | 'grade-3';

export interface CampaignTheme {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  backgroundGradient: string;
  bannerGradient: string;
  badgeBg: string;
  cardBorder: string;
}

export interface DifficultyConfig {
  baseHeroHp: number;
  baseMonsterHp: number;
  timeLimitPerQuestionSeconds: number;
  expMultiplier: number;
  goldMultiplier: number;
}

export interface Campaign {
  id: CampaignId;
  title: string;
  subtitle: string;
  heroTitle: string;
  grade: CampaignGrade;
  description: string;
  lore: string;
  heroDescription: string;
  heroBadge: string;
  theme: CampaignTheme;
  mathScope: string[];
  kingdoms: Kingdom[];
  difficultyConfig: DifficultyConfig;
  unlockRequirement: {
    minLevel: number;
    recommendedAge: string;
  };
}
