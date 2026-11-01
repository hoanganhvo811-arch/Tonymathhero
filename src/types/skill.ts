import type { CampaignId } from './campaign';

export type SkillCategory = 'attack' | 'magic' | 'defense' | 'heal';

export interface HeroSkill {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  iconName: string;
  levelRequirement: number;
  mpCost: number;
  cooldownTurns: number;
  damageMultiplier: number; // e.g. 1.0, 1.6, 2.2
  healingAmount?: number;
  defenseBuffPercent?: number;
  unlockCondition: string;
  skillType: SkillCategory;
  isUnlocked?: boolean;
  campaignId?: CampaignId;
}
