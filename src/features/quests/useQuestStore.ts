import { create } from 'zustand';
import type { Quest, QuestObjective } from '@/types/quest';
import type { SubZoneId } from '@/types/exploration';
import { getQuestsForKingdom } from './data/sevenKingdomsQuestChains';
import { useProgressStore } from '../../game/state/useProgressStore';
import { usePlayerStore } from '../../game/state/usePlayerStore';
import { useKingdomProgressionStore } from '../kingdom-progression/useKingdomProgressionStore';

export interface CompletedQuestRewardNotification {
  quest: Quest;
  expGained: number;
  goldGained: number;
  itemNames: string[];
}

interface QuestState {
  quests: Quest[];
  activeQuestId: string | null;
  collectedObjectIds: string[];
  unlockedSubZoneIds: SubZoneId[];
  recentRewardNotification: CompletedQuestRewardNotification | null;

  // Actions
  initQuests: (campaignId: string, kingdomId: string) => void;
  acceptQuest: (questId: string) => void;
  advanceObjective: (objectiveType: string, targetId?: string, count?: number) => void;
  completeQuest: (questId: string) => Promise<void>;
  collectObject: (objectId: string) => void;
  isObjectCollected: (objectId: string) => boolean;
  clearRewardNotification: () => void;
  setActiveQuestId: (questId: string | null) => void;
  getActiveQuest: () => Quest | null;
}

const DEFAULT_QUESTS = getQuestsForKingdom('g2-k1-arithmia', 'grade-2');

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: DEFAULT_QUESTS,
  activeQuestId: 'ef-quest-01',
  collectedObjectIds: [],
  unlockedSubZoneIds: ['village', 'green_forest'],
  recentRewardNotification: null,

  initQuests: (campaignId: string, kingdomId: string) => {
    const kingdomQuests = getQuestsForKingdom(kingdomId, campaignId as any);

    if (typeof window !== 'undefined' && window.localStorage) {
      const storageKey = `tmh_quests_${campaignId}_${kingdomId}`;
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          set({
            quests: parsed.quests || kingdomQuests,
            activeQuestId: parsed.activeQuestId || kingdomQuests[0]?.id || null,
            collectedObjectIds: parsed.collectedObjectIds || [],
            unlockedSubZoneIds: parsed.unlockedSubZoneIds || ['village', 'green_forest'],
          });
          return;
        }
      } catch (e) {
        console.warn('Failed to parse saved quests:', e);
      }
    }

    set({
      quests: kingdomQuests,
      activeQuestId: kingdomQuests[0]?.id || null,
      collectedObjectIds: [],
      unlockedSubZoneIds: ['village', 'green_forest'],
    });
  },

  acceptQuest: (questId: string) => {
    const { quests } = get();
    const updated = quests.map((q) => {
      if (q.id === questId) {
        return {
          ...q,
          status: 'active' as const,
        };
      }
      return q;
    });

    set({ quests: updated, activeQuestId: questId });
    saveQuestProgress(updated, questId, get().collectedObjectIds, get().unlockedSubZoneIds);
  },

  advanceObjective: async (objectiveType: string, targetId?: string, count: number = 1) => {
    const { quests, activeQuestId } = get();
    let hasChanged = false;
    let completedQuestCandidate: Quest | null = null;

    const updatedQuests = quests.map((quest) => {
      // Only advance objectives for active quests (or currently tracked quest)
      if (quest.status !== 'active' && quest.id !== activeQuestId) {
        return quest;
      }

      if (!quest.objectives) return quest;

      let questAllDone = true;
      const updatedObjectives = quest.objectives.map((obj) => {
        if (!obj.isCompleted && obj.type === objectiveType) {
          if (!targetId || obj.targetId === targetId) {
            const newCount = Math.min(obj.targetCount, obj.currentCount + count);
            const isDone = newCount >= obj.targetCount;
            hasChanged = true;
            return {
              ...obj,
              currentCount: newCount,
              isCompleted: isDone,
            };
          }
        }
        if (!obj.isCompleted) questAllDone = false;
        return obj;
      });

      // Check if all objectives are completed
      const allCompleted = updatedObjectives.every((o) => o.isCompleted);
      if (allCompleted && quest.status === 'active') {
        completedQuestCandidate = quest;
      }

      return {
        ...quest,
        objectives: updatedObjectives,
      };
    });

    if (hasChanged) {
      set({ quests: updatedQuests });
      saveQuestProgress(updatedQuests, activeQuestId, get().collectedObjectIds, get().unlockedSubZoneIds);

      // If quest objectives are all satisfied, automatically complete and reward
      if (completedQuestCandidate) {
        await get().completeQuest((completedQuestCandidate as Quest).id);
      }
    }
  },

  completeQuest: async (questId: string) => {
    const { quests, unlockedSubZoneIds, collectedObjectIds } = get();
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest || targetQuest.status === 'completed') return;

    // Distribute rewards through useProgressStore
    const progressStore = useProgressStore.getState();
    await progressStore.completeQuest(questId, targetQuest.rewardExp, targetQuest.rewardGold);

    // Update quest statuses: mark current as completed and unlock next
    let nextActiveId: string | null = null;
    const newUnlockedZones = [...unlockedSubZoneIds];

    if (questId === 'ef-quest-01') {
      if (!newUnlockedZones.includes('monster_camp')) newUnlockedZones.push('monster_camp');
    } else if (questId === 'ef-quest-02') {
      if (!newUnlockedZones.includes('crystal_lake')) newUnlockedZones.push('crystal_lake');
      if (!newUnlockedZones.includes('ancient_ruins')) newUnlockedZones.push('ancient_ruins');
    } else if (questId === 'ef-quest-03' || questId === 'ef-quest-04') {
      if (!newUnlockedZones.includes('kingdom_castle')) newUnlockedZones.push('kingdom_castle');
    }

    // Auto restore kingdom if this was a kingdom restoration quest
    if (targetQuest.category === 'boss_quest' || targetQuest.rewardGemId) {
      const gemId = targetQuest.rewardGemId || 'crystal-emerald';
      useKingdomProgressionStore.getState().claimKnowledgeCrystal(targetQuest.kingdomId, gemId).catch(() => {});
    }

    const updatedQuests = quests.map((q) => {
      if (q.id === questId) {
        return { ...q, status: 'completed' as const };
      }
      if (q.prerequisiteQuestId === questId) {
        nextActiveId = q.id;
        return { ...q, status: 'active' as const };
      }
      return q;
    });

    set({
      quests: updatedQuests,
      activeQuestId: nextActiveId,
      unlockedSubZoneIds: newUnlockedZones,
      recentRewardNotification: {
        quest: targetQuest,
        expGained: targetQuest.rewardExp,
        goldGained: targetQuest.rewardGold,
        itemNames: targetQuest.rewardItemNames || [],
      },
    });

    saveQuestProgress(updatedQuests, nextActiveId, collectedObjectIds, newUnlockedZones);
  },

  collectObject: (objectId: string) => {
    const { collectedObjectIds, quests, activeQuestId, unlockedSubZoneIds } = get();
    if (collectedObjectIds.includes(objectId)) return;

    const updatedCollected = [...collectedObjectIds, objectId];
    set({ collectedObjectIds: updatedCollected });
    saveQuestProgress(quests, activeQuestId, updatedCollected, unlockedSubZoneIds);
  },

  isObjectCollected: (objectId: string) => {
    return get().collectedObjectIds.includes(objectId);
  },

  clearRewardNotification: () => {
    set({ recentRewardNotification: null });
  },

  setActiveQuestId: (questId: string | null) => {
    set({ activeQuestId: questId });
  },

  getActiveQuest: () => {
    const { quests, activeQuestId } = get();
    return quests.find((q) => q.id === activeQuestId) || quests.find((q) => q.status === 'active') || null;
  },
}));

function saveQuestProgress(
  quests: Quest[],
  activeQuestId: string | null,
  collectedObjectIds: string[],
  unlockedSubZoneIds: SubZoneId[]
) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const campaignId = useProgressStore.getState().currentProgress?.campaignId || 'grade-2';
    const storageKey = `tmh_quests_${campaignId}_g2-k1-arithmia`;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        quests,
        activeQuestId,
        collectedObjectIds,
        unlockedSubZoneIds,
      })
    );
  } catch (e) {
    console.warn('Failed to save quest progress:', e);
  }
}
