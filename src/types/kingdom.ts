import type { CampaignId } from './campaign';

export interface KnowledgeGem {
  id: string;
  name: string;
  element: 'sapphire' | 'emerald' | 'amber' | 'ruby' | 'amethyst' | 'topaz' | 'infinity' | 'cosmic';
  color: string;
  glowColor: string;
  description: string;
  powerGranted: string;
}

export type BiomeType =
  | 'emerald_forest'
  | 'golden_desert'
  | 'ocean_kingdom'
  | 'frozen_kingdom'
  | 'stone_mountain'
  | 'sweet_valley'
  | 'dark_kingdom';

export type LandmarkType =
  | 'quest_point'
  | 'monster_camp'
  | 'treasure'
  | 'boss_gate'
  | 'kingdom_castle';

export interface KingdomLandmark {
  id: string;
  type: LandmarkType;
  name: string;
  vietnameseName: string;
  description: string;
  position: [number, number, number]; // [x, y, z] relative or absolute world coordinates
  status?: 'available' | 'locked' | 'completed';
  rewardSummary?: string;
  levelRequirement?: number;
}

export interface KingdomCoordinates {
  x: number; // percentage 0 - 100 for responsive world map
  y: number; // percentage 0 - 100
}

export interface Kingdom {
  id: string;
  campaignId: CampaignId;
  order: number;
  name: string;
  vietnameseName: string;
  tagline: string;
  lore: string;
  regionType: 'plains' | 'forest' | 'citadel' | 'mountains' | 'river' | 'sanctuary' | 'spire';
  biomeType?: BiomeType;
  worldPosition?: [number, number, number]; // 3D coordinates in the Seven Kingdoms world
  landmarks?: KingdomLandmark[];
  mathTopic: string;
  mathTopicShort: string;
  conceptSummary: string;
  guardianMonsterId: string;
  gem: KnowledgeGem;
  coordinates: KingdomCoordinates;
  requiredHeroLevel: number;
  isUnlockedByDefault: boolean;
  bgAtmosphere: {
    skyColor: string;
    fogDensity: number;
    ambientLight: string;
    themeGradient: string;
  };
}
