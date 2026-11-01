import { create } from 'zustand';
import type { KingdomRestorationStatus } from '../../types/story';
import type { CampaignId } from '../../types/campaign';
import { useProgressStore } from '../../game/state/useProgressStore';
import { SEVEN_KINGDOMS_3D_CONFIGS } from '../../data/kingdoms/sevenKingdoms3dConfig';

export interface KingdomProgressState {
  order: number;
  kingdomId: string;
  status: KingdomRestorationStatus;
  bossDefeated: boolean;
  crystalClaimed: boolean;
  completionPercentage: number;
}

interface ProgressionStoreState {
  campaignId: CampaignId;
  kingdomStates: Record<string, KingdomProgressState>;

  // Actions
  initProgression: (campaignId: CampaignId) => void;
  getKingdomStatus: (kingdomId: string) => KingdomRestorationStatus;
  canEnterKingdom: (kingdomId: string) => { allowed: boolean; reason?: string };
  canChallengeBoss: (kingdomId: string) => { allowed: boolean; reason?: string };
  markBossDefeated: (kingdomId: string) => void;
  claimKnowledgeCrystal: (kingdomId: string, crystalId: string) => Promise<{ success: boolean; message: string }>;
  restoreKingdom: (kingdomId: string) => Promise<boolean>;
  unlockNextKingdom: (currentKingdomId: string) => Promise<{ unlockedKingdomId?: string; message: string }>;
}

const KINGDOM_ORDER_MAP: Record<string, number> = {
  'g2-k1-arithmia': 1,
  'g2-k2-chronos': 2,
  'g2-k3-multiplex': 3,
  'g2-k4-divisia': 4,
  'g2-k5-geometria': 5,
  'g2-k6-fractions': 6,
  'g2-k7-apex': 7,

  'g3-k1-arithmia': 1,
  'g3-k2-chronos': 2,
  'g3-k3-multiplex': 3,
  'g3-k4-divisia': 4,
  'g3-k5-geometria': 5,
  'g3-k6-fractions': 6,
  'g3-k7-apex': 7,
};

export const useKingdomProgressionStore = create<ProgressionStoreState>((set, get) => ({
  campaignId: 'grade-2',
  kingdomStates: {},

  initProgression: (campaignId: CampaignId) => {
    const progressStore = useProgressStore.getState();
    const progress = progressStore.currentProgress;

    const unlocked = progress?.unlockedKingdomIds || [campaignId === 'grade-3' ? 'g3-k1-arithmia' : 'g2-k1-arithmia'];
    const rescued = progress?.rescuedKingdomIds || [];
    const collectedGems = progress?.collectedGemIds || [];

    const states: Record<string, KingdomProgressState> = {};
    const prefix = campaignId === 'grade-3' ? 'g3-k' : 'g2-k';
    const keys = [
      `${prefix}1-arithmia`,
      `${prefix}2-chronos`,
      `${prefix}3-multiplex`,
      `${prefix}4-divisia`,
      `${prefix}5-geometria`,
      `${prefix}6-fractions`,
      `${prefix}7-apex`,
    ];

    keys.forEach((kId, idx) => {
      const order = idx + 1;
      const isRescued = rescued.includes(kId);
      const isUnlocked = unlocked.includes(kId);
      const hasCrystal = collectedGems.some((g) => g.includes(kId) || g.includes(`crystal-`));

      let status: KingdomRestorationStatus = 'LOCKED';
      if (isRescued) {
        status = 'RESTORED';
      } else if (isUnlocked) {
        status = 'IN_PROGRESS';
      }

      states[kId] = {
        order,
        kingdomId: kId,
        status,
        bossDefeated: isRescued,
        crystalClaimed: isRescued,
        completionPercentage: isRescued ? 100 : isUnlocked ? 50 : 0,
      };
    });

    set({ campaignId, kingdomStates: states });
  },

  getKingdomStatus: (kingdomId: string) => {
    const state = get().kingdomStates[kingdomId];
    if (state) return state.status;

    // Fallback lookup via progress store
    const progress = useProgressStore.getState().currentProgress;
    if (progress?.rescuedKingdomIds.includes(kingdomId)) return 'RESTORED';
    if (progress?.unlockedKingdomIds.includes(kingdomId)) return 'IN_PROGRESS';
    return 'LOCKED';
  },

  canEnterKingdom: (kingdomId: string) => {
    const progress = useProgressStore.getState().currentProgress;
    const unlocked = progress?.unlockedKingdomIds || [];

    if (!unlocked.includes(kingdomId)) {
      // Check if it's Kingdom 1
      const order = KINGDOM_ORDER_MAP[kingdomId] || 1;
      if (order === 1) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: `Vương quốc này chưa được giải trừ phong ấn. Bạn cần hoàn thành giải cứu vương quốc trước đó!`,
      };
    }

    // Special check for Dark Kingdom (order 7): require 6 prior crystals
    const order = KINGDOM_ORDER_MAP[kingdomId];
    if (order === 7) {
      const collectedCount = progress?.collectedGemIds.length || 0;
      if (collectedCount < 6) {
        return {
          allowed: false,
          reason: `Pháo Đài Hắc Ám của Lord Zero yêu cầu đủ 6 Viên Ngọc Tri Thức để phá hủy kết giới (Hiện có: ${collectedCount}/6).`,
        };
      }
    }

    return { allowed: true };
  },

  canChallengeBoss: (kingdomId: string) => {
    const status = get().getKingdomStatus(kingdomId);
    if (status === 'LOCKED') {
      return { allowed: false, reason: 'Vương quốc đang bị khóa!' };
    }
    return { allowed: true };
  },

  markBossDefeated: (kingdomId: string) => {
    const { kingdomStates } = get();
    const existing = kingdomStates[kingdomId];
    if (!existing) return;

    set({
      kingdomStates: {
        ...kingdomStates,
        [kingdomId]: {
          ...existing,
          bossDefeated: true,
          status: 'BOSS_DEFEATED',
        },
      },
    });
  },

  claimKnowledgeCrystal: async (kingdomId: string, crystalId: string) => {
    const progressStore = useProgressStore.getState();
    const progress = progressStore.currentProgress;
    if (!progress) return { success: false, message: 'Chưa tải tiến trình người chơi.' };

    if (progress.collectedGemIds.includes(crystalId)) {
      return { success: false, message: 'Viên ngọc này đã được thu hồi trước đó.' };
    }

    // Add crystal to player progress
    await progressStore.rescueKingdom(kingdomId, crystalId);

    // Update local state
    const { kingdomStates } = get();
    const existing = kingdomStates[kingdomId];
    if (existing) {
      set({
        kingdomStates: {
          ...kingdomStates,
          [kingdomId]: {
            ...existing,
            crystalClaimed: true,
            status: 'RESTORED',
            completionPercentage: 100,
          },
        },
      });
    }

    // Try auto-unlocking next kingdom
    const nextResult = await get().unlockNextKingdom(kingdomId);

    return {
      success: true,
      message: `✨ Đã thu hồi thành công [${crystalId}]! ${nextResult.message}`,
    };
  },

  restoreKingdom: async (kingdomId: string) => {
    const { kingdomStates } = get();
    const existing = kingdomStates[kingdomId];
    if (!existing) return false;

    set({
      kingdomStates: {
        ...kingdomStates,
        [kingdomId]: {
          ...existing,
          status: 'RESTORED',
          completionPercentage: 100,
        },
      },
    });

    const progressStore = useProgressStore.getState();
    await progressStore.rescueKingdom(kingdomId);
    return true;
  },

  unlockNextKingdom: async (currentKingdomId: string) => {
    const order = KINGDOM_ORDER_MAP[currentKingdomId] || 1;
    const nextOrder = order + 1;
    if (nextOrder > 7) {
      return { message: 'Bạn đã hoàn thành giải cứu toàn bộ Bảy Vương Quốc!' };
    }

    const { campaignId, kingdomStates } = get();
    const prefix = campaignId === 'grade-3' ? 'g3-k' : 'g2-k';
    const nextKeys: Record<number, string> = {
      2: `${prefix}2-chronos`,
      3: `${prefix}3-multiplex`,
      4: `${prefix}4-divisia`,
      5: `${prefix}5-geometria`,
      6: `${prefix}6-fractions`,
      7: `${prefix}7-apex`,
    };

    const nextKingdomId = nextKeys[nextOrder];
    if (!nextKingdomId) {
      return { message: '' };
    }

    // For Dark Kingdom (order 7), verify 6 crystals
    if (nextOrder === 7) {
      const collectedCount = useProgressStore.getState().currentProgress?.collectedGemIds.length || 0;
      if (collectedCount < 6) {
        return {
          message: `Cần thu thập đủ 6 Viên Ngọc Tri Thức để phá hủy kết giới Pháo Đài Hắc Ám (${collectedCount}/6).`,
        };
      }
    }

    // Unlock in progress store
    await useProgressStore.getState().unlockKingdom(nextKingdomId);

    // Update kingdom states
    const existingNext = kingdomStates[nextKingdomId];
    if (existingNext) {
      set({
        kingdomStates: {
          ...kingdomStates,
          [nextKingdomId]: {
            ...existingNext,
            status: 'IN_PROGRESS',
          },
        },
      });
    }

    const nextConfig = SEVEN_KINGDOMS_3D_CONFIGS[nextOrder];
    const nameVi = nextConfig ? nextConfig.titleVi : `Vương quốc ${nextOrder}`;

    return {
      unlockedKingdomId: nextKingdomId,
      message: `🎉 Đã mở khóa thành công vương quốc tiếp theo: [${nameVi}]!`,
    };
  },
}));
