import type { CampaignId } from './campaign';

export type MathTopic = string;

export type StoryChapterId =
  | 'prologue'
  | 'chapter-1-emerald'
  | 'chapter-2-desert'
  | 'chapter-3-ocean'
  | 'chapter-4-frozen'
  | 'chapter-5-mountain'
  | 'chapter-6-sweet'
  | 'chapter-7-dark'
  | 'epilogue';

export type KingdomRestorationStatus =
  | 'LOCKED'
  | 'CORRUPTED'
  | 'IN_PROGRESS'
  | 'BOSS_DEFEATED'
  | 'RESTORED';

export type BossBattlePhase = 'normal' | 'enraged' | 'final_challenge';

export interface CutsceneSlide {
  id: string;
  speaker: string;
  speakerTitle?: string;
  speakerAvatar?: string;
  avatarSide?: 'left' | 'right' | 'center';
  dialogue: string;
  bgImageUrl?: string;
  mood?: 'normal' | 'dramatic' | 'heroic' | 'dark' | 'celebrate';
  highlightWord?: string;
}

export interface StoryCutscene {
  id: string;
  title: string;
  chapterId: StoryChapterId;
  kingdomId?: string;
  slides: CutsceneSlide[];
  autoPlayDurationMs?: number;
  triggerEvent?: 'game_start' | 'enter_kingdom' | 'boss_encounter' | 'boss_defeat' | 'crystal_recovered' | 'portal_unlocked' | 'game_victory';
}

export interface BossData {
  bossId: string;
  kingdomId: string;
  name: string;
  titleVi: string;
  description: string;
  avatarUrl?: string;
  level: number;
  maxHp: number;
  attackPower: number;
  defense: number;
  enragedHpThresholdPercent: number; // e.g. 50%
  finalChallengeHpThresholdPercent: number; // e.g. 20%
  allowedMathTopics: MathTopic[];
  phasesDialogue: {
    normalIntro: string;
    enragedAura: string;
    finalChallengePrompt: string;
    defeatSpeech: string;
  };
  rewardExp: number;
  rewardGold: number;
  rewardCrystalId: string;
  rewardItemName: string;
  defeatedStatus: boolean;
  requiredStreakForFinish: number; // e.g. 2 or 3
}

export interface KnowledgeCrystalItem {
  id: string;
  order: number;
  kingdomId: string;
  name: string;
  vietnameseName: string;
  element: 'sapphire' | 'emerald' | 'amber' | 'ruby' | 'amethyst' | 'topaz' | 'infinity' | 'cosmic';
  color: string;
  glowColor: string;
  description: string;
  lore: string;
  powerGranted: string;
  iconName: string;
}

export interface CampaignEndingSummary {
  playerId: string;
  campaignId: CampaignId;
  campaignTitle: string;
  rescuedKingdomsCount: number;
  totalKingdomsCount: number;
  defeatedBossesCount: number;
  totalBossesCount: number;
  crystalsCollectedCount: number;
  totalCrystalsCount: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  accuracyPercentage: number;
  questsCompletedCount: number;
  totalExpGained: number;
  heroFinalLevel: number;
  heroTitleAwarded: string;
  completedAt: string;
}
