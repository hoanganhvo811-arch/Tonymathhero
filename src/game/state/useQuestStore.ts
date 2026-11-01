import { create } from 'zustand';
import type { Quest } from '@/types';
import { GRADE_2_SAMPLE_QUESTS } from '@/campaigns/grade-2/quests/sampleQuests';
import { GRADE_3_SAMPLE_QUESTS } from '@/campaigns/grade-3/quests/sampleQuests';

interface QuestStoreState {
  quests: Quest[];
  activeQuest: Quest | null;
  setActiveQuest: (quest: Quest | null) => void;
  loadQuestsForKingdom: (campaignId: string, kingdomId: string) => Quest[];
}

export const useQuestStore = create<QuestStoreState>((set) => ({
  quests: [...GRADE_2_SAMPLE_QUESTS, ...GRADE_3_SAMPLE_QUESTS],
  activeQuest: null,
  setActiveQuest: (quest) => set({ activeQuest: quest }),
  loadQuestsForKingdom: (campaignId, kingdomId) => {
    const all = campaignId === 'grade-2' ? GRADE_2_SAMPLE_QUESTS : GRADE_3_SAMPLE_QUESTS;
    return all.filter((q) => q.kingdomId === kingdomId);
  },
}));
