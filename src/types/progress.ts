import type { CampaignId } from './campaign';

export interface UnlockedAchievement {
  id: string;
  code: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: string;
}

export interface PlayerProgress {
  id: string; // composite key: `${playerId}_${campaignId}`
  playerId: string;
  campaignId: CampaignId;
  heroLevel: number;
  currentExp: number;
  nextLevelExp: number;
  currentKingdomId: string;
  unlockedKingdomIds: string[];
  rescuedKingdomIds: string[];
  completedQuestIds: string[];
  collectedGemIds: string[];
  totalStars: number;
  goldCoins: number;
  achievements: UnlockedAchievement[];
  playTimeMinutes: number;
  lastPlayedAt: string;
}
