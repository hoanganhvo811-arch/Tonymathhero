import { create } from 'zustand';
import type { CampaignId, PlayerProgress } from '@/types';
import { createDefaultProgress, persistenceService } from '../../services/persistence/persistenceService';

interface ProgressState {
  currentProgress: PlayerProgress | null;
  grade2Progress: PlayerProgress | null;
  grade3Progress: PlayerProgress | null;
  isLoading: boolean;

  // Actions
  loadAllCampaignsProgress: (playerId: string) => Promise<void>;
  loadProgressForCampaign: (playerId: string, campaignId: CampaignId) => Promise<PlayerProgress>;
  saveCurrentProgress: () => Promise<void>;
  addExp: (amount: number) => Promise<{ leveledUp: boolean; newLevel: number }>;
  addGold: (amount: number) => Promise<void>;
  unlockKingdom: (kingdomId: string) => Promise<void>;
  rescueKingdom: (kingdomId: string, gemId?: string) => Promise<void>;
  completeQuest: (questId: string, expReward: number, goldReward: number) => Promise<void>;
  setCurrentKingdom: (kingdomId: string) => Promise<void>;
  resetCampaignProgress: (playerId: string, campaignId: CampaignId) => Promise<PlayerProgress>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  currentProgress: null,
  grade2Progress: null,
  grade3Progress: null,
  isLoading: false,

  loadAllCampaignsProgress: async (playerId: string) => {
    set({ isLoading: true });
    try {
      let g2 = await persistenceService.getCampaignProgress(playerId, 'grade-2');
      if (!g2) {
        g2 = createDefaultProgress(playerId, 'grade-2');
        await persistenceService.saveCampaignProgress(g2);
      }

      let g3 = await persistenceService.getCampaignProgress(playerId, 'grade-3');
      if (!g3) {
        g3 = createDefaultProgress(playerId, 'grade-3');
        await persistenceService.saveCampaignProgress(g3);
      }

      set({
        grade2Progress: g2,
        grade3Progress: g3,
        isLoading: false,
      });
    } catch (e) {
      console.error('Failed to load campaigns progress:', e);
      set({ isLoading: false });
    }
  },

  loadProgressForCampaign: async (playerId: string, campaignId: CampaignId) => {
    set({ isLoading: true });
    try {
      let progress = await persistenceService.getCampaignProgress(playerId, campaignId);
      if (!progress) {
        progress = createDefaultProgress(playerId, campaignId);
        await persistenceService.saveCampaignProgress(progress);
      }

      const updates: Partial<ProgressState> = {
        currentProgress: progress,
        isLoading: false,
      };

      if (campaignId === 'grade-2') {
        updates.grade2Progress = progress;
      } else {
        updates.grade3Progress = progress;
      }

      set(updates as ProgressState);
      return progress;
    } catch (e) {
      console.error(`Failed to load progress for ${campaignId}:`, e);
      const fallback = createDefaultProgress(playerId, campaignId);
      set({ currentProgress: fallback, isLoading: false });
      return fallback;
    }
  },

  saveCurrentProgress: async () => {
    const { currentProgress } = get();
    if (!currentProgress) return;
    await persistenceService.saveCampaignProgress(currentProgress);
  },

  addExp: async (amount: number) => {
    const { currentProgress } = get();
    if (!currentProgress) return { leveledUp: false, newLevel: 1 };

    let currentExp = currentProgress.currentExp + amount;
    let heroLevel = currentProgress.heroLevel;
    let nextLevelExp = currentProgress.nextLevelExp;
    let leveledUp = false;

    while (currentExp >= nextLevelExp) {
      currentExp -= nextLevelExp;
      heroLevel += 1;
      nextLevelExp = Math.round(nextLevelExp * 1.35);
      leveledUp = true;
    }

    const updated: PlayerProgress = {
      ...currentProgress,
      heroLevel,
      currentExp,
      nextLevelExp,
    };

    const updates: Partial<ProgressState> = { currentProgress: updated };
    if (updated.campaignId === 'grade-2') {
      updates.grade2Progress = updated;
    } else {
      updates.grade3Progress = updated;
    }

    set(updates as ProgressState);
    await persistenceService.saveCampaignProgress(updated);

    return { leveledUp, newLevel: heroLevel };
  },

  addGold: async (amount: number) => {
    const { currentProgress } = get();
    if (!currentProgress) return;
    const updated: PlayerProgress = {
      ...currentProgress,
      goldCoins: (currentProgress.goldCoins || 0) + amount,
    };
    const updates: Partial<ProgressState> = { currentProgress: updated };
    if (updated.campaignId === 'grade-2') {
      updates.grade2Progress = updated;
    } else {
      updates.grade3Progress = updated;
    }
    set(updates as ProgressState);
    await persistenceService.saveCampaignProgress(updated);
  },

  unlockKingdom: async (kingdomId: string) => {
    const { currentProgress } = get();
    if (!currentProgress) return;
    if (currentProgress.unlockedKingdomIds.includes(kingdomId)) return;

    const updated: PlayerProgress = {
      ...currentProgress,
      unlockedKingdomIds: [...currentProgress.unlockedKingdomIds, kingdomId],
    };

    const updates: Partial<ProgressState> = { currentProgress: updated };
    if (updated.campaignId === 'grade-2') {
      updates.grade2Progress = updated;
    } else {
      updates.grade3Progress = updated;
    }

    set(updates as ProgressState);
    await persistenceService.saveCampaignProgress(updated);
  },

  rescueKingdom: async (kingdomId: string, gemId?: string) => {
    const { currentProgress } = get();
    if (!currentProgress) return;

    const rescued = currentProgress.rescuedKingdomIds.includes(kingdomId)
      ? currentProgress.rescuedKingdomIds
      : [...currentProgress.rescuedKingdomIds, kingdomId];

    const gems =
      gemId && !currentProgress.collectedGemIds.includes(gemId)
        ? [...currentProgress.collectedGemIds, gemId]
        : currentProgress.collectedGemIds;

    const updated: PlayerProgress = {
      ...currentProgress,
      rescuedKingdomIds: rescued,
      collectedGemIds: gems,
      totalStars: currentProgress.totalStars + 3,
    };

    const updates: Partial<ProgressState> = { currentProgress: updated };
    if (updated.campaignId === 'grade-2') {
      updates.grade2Progress = updated;
    } else {
      updates.grade3Progress = updated;
    }

    set(updates as ProgressState);
    await persistenceService.saveCampaignProgress(updated);
  },

  completeQuest: async (questId: string, expReward: number, goldReward: number) => {
    const { currentProgress, addExp } = get();
    if (!currentProgress) return;

    const isAlreadyCompleted = currentProgress.completedQuestIds.includes(questId);
    const updatedCompleted = isAlreadyCompleted
      ? currentProgress.completedQuestIds
      : [...currentProgress.completedQuestIds, questId];

    const updated: PlayerProgress = {
      ...currentProgress,
      completedQuestIds: updatedCompleted,
      goldCoins: currentProgress.goldCoins + goldReward,
    };

    const updates: Partial<ProgressState> = { currentProgress: updated };
    if (updated.campaignId === 'grade-2') {
      updates.grade2Progress = updated;
    } else {
      updates.grade3Progress = updated;
    }

    set(updates as ProgressState);
    await persistenceService.saveCampaignProgress(updated);

    if (expReward > 0) {
      await addExp(expReward);
    }
  },

  setCurrentKingdom: async (kingdomId: string) => {
    const { currentProgress } = get();
    if (!currentProgress) return;

    const updated: PlayerProgress = {
      ...currentProgress,
      currentKingdomId: kingdomId,
    };

    const updates: Partial<ProgressState> = { currentProgress: updated };
    if (updated.campaignId === 'grade-2') {
      updates.grade2Progress = updated;
    } else {
      updates.grade3Progress = updated;
    }

    set(updates as ProgressState);
    await persistenceService.saveCampaignProgress(updated);
  },

  resetCampaignProgress: async (playerId: string, campaignId: CampaignId) => {
    const newProgress = await persistenceService.resetCampaignProgress(playerId, campaignId);
    const updates: Partial<ProgressState> = {};
    if (campaignId === 'grade-2') {
      updates.grade2Progress = newProgress;
    } else {
      updates.grade3Progress = newProgress;
    }
    const { currentProgress } = get();
    if (currentProgress?.campaignId === campaignId) {
      updates.currentProgress = newProgress;
    }
    set(updates as ProgressState);
    return newProgress;
  },
}));
