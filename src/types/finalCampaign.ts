import type { CampaignId } from './campaign';
import type { MathTopic } from './story';

export type FinalCampaignStage =
  | 'cinematic_intro'
  | 'dark_kingdom_trials'
  | 'boss_battle'
  | 'cinematic_outro'
  | 'campaign_completed_fanfare'
  | 'hero_journey'
  | 'endgame_hub';

export type FinalTrialType =
  | 'number_gate' // Phá giải cổng số học
  | 'crystal_bridge' // Tái tạo cầu đo lường & hình học
  | 'mystery_barrier' // Giải mã rào chắn quy luật & logic
  | 'spatial_hall' // Vượt hành lang không gian & mê cung
  | 'mentor_rescue'; // Giải bài toán thực tế cứu nguy đại sư phụ

export interface FinalMathTrial {
  id: string;
  gradeLevel: CampaignId;
  trialType: FinalTrialType;
  titleVi: string;
  storyVi: string;
  gameplayObjectiveVi: string;
  mathDomainVi: string;
  questionVi: string;
  visualData?: {
    type?: 'number_grid' | 'balance_scale' | 'bridge_measure' | 'pattern_sequence' | 'mentor_card';
    items?: string[];
    values?: (string | number)[];
    targetValue?: number | string;
  };
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  rewardExp: number;
  rewardGold: number;
}

export type LordZeroBossPhaseIndex = 1 | 2 | 3 | 4 | 5;

export interface LordZeroPhaseConfig {
  phaseIndex: LordZeroBossPhaseIndex;
  titleVi: string;
  bossTitleVi: string;
  avatarMood: 'menacing' | 'enraged' | 'shadow' | 'cosmic' | 'final_form';
  maxHp: number;
  themeVi: string;
  curriculumDomainVi: string;
  descriptionVi: string;
  dialogueIntroVi: string;
  defeatDialogueVi: string;
}

export interface LordZeroSpellQuestion {
  id: string;
  phaseIndex: LordZeroBossPhaseIndex;
  gradeLevel: CampaignId;
  spellNameVi: string;
  bossSpeechVi: string;
  challengeTextVi: string;
  options: string[];
  correctIndex: number;
  explanationVi: string;
  damage: number;
  domain: string;
  hintVi: string;
}

export interface FinalCampaignProgress {
  campaignId: CampaignId;
  isIntroCinematicSeen: boolean;
  clearedTrialIds: string[];
  currentTrialIndex: number;
  defeatedBossPhases: number[];
  isLordZeroDefeated: boolean;
  isEndingCinematicSeen: boolean;
  crystalsRestoredCount: number;
  titleAwarded: string;
  completionTimestamp?: number;
  endgameRematchesWon: number;
  clearedMasteryMissionIds: string[];
  clearedSecretQuestIds: string[];
}

export interface HeroJourneyMilestone {
  id: string;
  titleVi: string;
  dateAchievedVi: string;
  descriptionVi: string;
  icon: string;
}

export interface HeroJourneyStats {
  playerName: string;
  heroTitle: string;
  campaignId: CampaignId;
  heroLevel: number;
  totalQuestsCompleted: number;
  totalBattlesWon: number;
  totalBossesDefeated: number;
  rescuedKingdomsCount: number;
  knowledgeCrystalsCount: number;
  totalQuestionsAnswered: number;
  mathAccuracyPercent: number;
  masteredSkillsCount: number;
  unlockedAchievementsCount: number;
  milestones: HeroJourneyMilestone[];
}

export interface BossRematchConfig {
  id: string;
  bossNameVi: string;
  kingdomNameVi: string;
  icon: string;
  recommendedGrade: CampaignId;
  difficulties: {
    normal: { hp: number; exp: number; gold: number };
    heroic: { hp: number; exp: number; gold: number };
    nightmare: { hp: number; exp: number; gold: number };
  };
}

export interface MasteryMission {
  id: string;
  titleVi: string;
  topicVi: string;
  descriptionVi: string;
  targetCount: number;
  icon: string;
  rewardExp: number;
  rewardGold: number;
}

export interface SecretQuest {
  id: string;
  codeNameVi: string;
  titleVi: string;
  loreVi: string;
  clueVi: string;
  isUnlocked: boolean;
  rewardTitleVi: string;
  rewardGold: number;
  rewardExp: number;
}
