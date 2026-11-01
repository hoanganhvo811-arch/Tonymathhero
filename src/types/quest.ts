import type { CampaignId } from './campaign';

export type QuestType = 'main_story' | 'side_challenge' | 'boss_trial';

export type QuestCategory =
  | 'main_quest'
  | 'side_quest'
  | 'rescue_quest'
  | 'collection_quest'
  | 'boss_quest';

export type QuestStatus = 'locked' | 'available' | 'active' | 'in_progress' | 'completed';

export interface QuestObjective {
  id: string;
  description: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  type:
    | 'talk_npc'
    | 'visit_area'
    | 'collect_item'
    | 'rescue_villagers'
    | 'defeat_monsters'
    | 'interact_object'
    | 'defeat_boss'
    | 'collect_crystal'
    | 'restore_kingdom'
    | 'complete_campaign';
  targetId?: string;
}

export interface Quest {
  id: string;
  campaignId: CampaignId;
  kingdomId: string;
  title: string;
  chapter: number;
  category?: QuestCategory;
  questType?: QuestType;
  giverNpcId?: string;
  giverNpcName?: string;
  storyIntro: string;
  objectiveSummary: string;
  objectives?: QuestObjective[];
  requiredCorrectQuestions?: number;
  rewardExp: number;
  rewardGold: number;
  rewardGemId?: string;
  rewardItemIds?: string[];
  rewardItemNames?: string[];
  status: QuestStatus;
  prerequisiteQuestId?: string;
}
