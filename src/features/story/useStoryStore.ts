import { create } from 'zustand';
import type { StoryChapterId, StoryCutscene, CampaignEndingSummary } from '../../types/story';
import type { CampaignId } from '../../types/campaign';
import { STORY_CUTSCENES } from './data/mainStoryConfig';

interface StoryState {
  currentChapter: StoryChapterId;
  seenCutsceneIds: string[];
  activeCutscene: StoryCutscene | null;
  activeSlideIndex: number;
  isAutoPlay: boolean;
  endingSummary: CampaignEndingSummary | null;

  // Actions
  playCutscene: (cutsceneIdOrCutscene: string | StoryCutscene, force?: boolean) => boolean;
  nextSlide: () => boolean; // returns true if cutscene continues, false if finished
  prevSlide: () => void;
  skipCutscene: () => void;
  toggleAutoPlay: () => void;
  advanceChapter: (chapterId: StoryChapterId) => void;
  isCutsceneSeen: (cutsceneId: string) => boolean;
  setEndingSummary: (summary: CampaignEndingSummary) => void;
  clearEndingSummary: () => void;
  resetStoryForCampaign: (campaignId: CampaignId) => void;
}

const STORAGE_PREFIX = 'tmh_story_seen_';

const getInitialSeenIds = (): string[] => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(`${STORAGE_PREFIX}global`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return [];
};

export const useStoryStore = create<StoryState>((set, get) => ({
  currentChapter: 'prologue',
  seenCutsceneIds: getInitialSeenIds(),
  activeCutscene: null,
  activeSlideIndex: 0,
  isAutoPlay: false,
  endingSummary: null,

  playCutscene: (cutsceneIdOrCutscene: string | StoryCutscene, force = false) => {
    let cutscene: StoryCutscene | undefined;
    if (typeof cutsceneIdOrCutscene === 'string') {
      cutscene = STORY_CUTSCENES[cutsceneIdOrCutscene];
    } else {
      cutscene = cutsceneIdOrCutscene;
    }

    if (!cutscene) return false;

    // Check if already seen and not forced
    const { seenCutsceneIds } = get();
    if (!force && seenCutsceneIds.includes(cutscene.id)) {
      return false; // Skip if already seen
    }

    const updatedSeen = Array.from(new Set([...seenCutsceneIds, cutscene.id]));
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(`${STORAGE_PREFIX}global`, JSON.stringify(updatedSeen));
      } catch {}
    }

    set({
      activeCutscene: cutscene,
      activeSlideIndex: 0,
      seenCutsceneIds: updatedSeen,
      isAutoPlay: false,
    });
    return true;
  },

  nextSlide: () => {
    const { activeCutscene, activeSlideIndex } = get();
    if (!activeCutscene) return false;

    if (activeSlideIndex < activeCutscene.slides.length - 1) {
      set({ activeSlideIndex: activeSlideIndex + 1 });
      return true;
    } else {
      // Finished all slides
      set({ activeCutscene: null, activeSlideIndex: 0, isAutoPlay: false });
      return false;
    }
  },

  prevSlide: () => {
    const { activeSlideIndex } = get();
    if (activeSlideIndex > 0) {
      set({ activeSlideIndex: activeSlideIndex - 1 });
    }
  },

  skipCutscene: () => {
    set({ activeCutscene: null, activeSlideIndex: 0, isAutoPlay: false });
  },

  toggleAutoPlay: () => {
    set((state) => ({ isAutoPlay: !state.isAutoPlay }));
  },

  advanceChapter: (chapterId: StoryChapterId) => {
    set({ currentChapter: chapterId });
  },

  isCutsceneSeen: (cutsceneId: string) => {
    return get().seenCutsceneIds.includes(cutsceneId);
  },

  setEndingSummary: (summary: CampaignEndingSummary) => {
    set({ endingSummary: summary });
  },

  clearEndingSummary: () => {
    set({ endingSummary: null });
  },

  resetStoryForCampaign: (campaignId: CampaignId) => {
    set({
      currentChapter: 'prologue',
      activeCutscene: null,
      activeSlideIndex: 0,
      endingSummary: null,
    });
  },
}));
