import { create } from 'zustand';
import type { Campaign, CampaignId } from '@/types';
import { Grade2Config } from '@/campaigns/grade-2/config';
import { Grade3Config } from '@/campaigns/grade-3/config';
import { persistenceService } from '@/services/persistence/persistenceService';

interface CampaignState {
  activeCampaignId: CampaignId;
  campaigns: Record<CampaignId, Campaign>;
  selectCampaign: (id: CampaignId, playerId?: string) => Promise<void>;
  getActiveCampaign: () => Campaign;
  setCampaignIdQuietly: (id: CampaignId) => void;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  activeCampaignId: 'grade-2',
  campaigns: {
    'grade-2': Grade2Config,
    'grade-3': Grade3Config,
  },

  selectCampaign: async (id: CampaignId, playerId?: string) => {
    set({ activeCampaignId: id });
    if (playerId) {
      await persistenceService.saveActiveSession({
        playerId,
        activeCampaignId: id,
      });
    }
  },

  getActiveCampaign: () => {
    const { activeCampaignId, campaigns } = get();
    return campaigns[activeCampaignId];
  },

  setCampaignIdQuietly: (id: CampaignId) => {
    set({ activeCampaignId: id });
  },
}));
