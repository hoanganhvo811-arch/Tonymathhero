import { create } from 'zustand';
import {
  CampaignId,
  FinalCampaignStage,
  FinalCampaignProgress,
  LordZeroBossPhaseIndex,
} from '../../types';
import { FINAL_INTRO_CINEMATIC, FINAL_OUTRO_CINEMATIC } from './data/cinematicsCatalog';
import { FINAL_MATH_TRIALS } from './data/finalTrialsCatalog';
import { LORD_ZERO_PHASES_CONFIG, LORD_ZERO_SPELLS } from './data/lordZeroBossCatalog';
import { BOSS_REMATCH_CONFIGS, MASTERY_MISSIONS_CONFIG, SECRET_QUESTS_CONFIG } from './data/endgameCatalog';
import { FINAL_ACHIEVEMENTS_CATALOG } from './data/finalAchievementsCatalog';
import { FinalAdaptiveEngine } from './services/finalAdaptiveEngine';
import { persistenceService } from '../../services/persistence/persistenceService';

const PERSISTENCE_KEY = 'final_campaign_progress_v1';

export interface FinalCampaignState {
  currentGrade: CampaignId;
  stage: FinalCampaignStage;
  setGrade: (grade: CampaignId) => void;
  setStage: (stage: FinalCampaignStage) => void;

  // Cinematic Player
  activeCinematicType: 'intro' | 'outro';
  slideIndex: number;
  nextSlide: () => boolean;
  prevSlide: () => void;
  skipCinematic: () => void;

  // Dark Kingdom Trials
  activeTrialIndex: number;
  clearedTrialIds: string[];
  trialFeedback: {
    isCorrect?: boolean;
    message: string;
    explanation?: string;
  } | null;
  answerTrial: (optionIndex: number) => boolean;
  nextTrial: () => void;
  enterBossArena: () => void;

  // 5-Phase Lord Zero Boss Battle
  bossPhaseIndex: LordZeroBossPhaseIndex;
  bossCurrentHp: number;
  bossMaxHp: number;
  playerHp: number;
  crystalShieldsRemaining: number;
  bossSpellIndex: number;
  bossBattleStatus: 'fighting' | 'phase_cleared' | 'victory' | 'defeated';
  bossFeedback: {
    isCorrect?: boolean;
    message: string;
    damageDealt?: number;
    shieldUsed?: boolean;
  } | null;
  answerBossSpell: (optionIndex: number) => boolean;
  nextBossPhase: () => void;
  resetBossBattle: () => void;

  // Endgame & Rematch
  activeRematchBossId: string | null;
  activeRematchDifficulty: 'normal' | 'heroic' | 'nightmare';
  startRematch: (bossId: string, diff: 'normal' | 'heroic' | 'nightmare') => void;
  completeMasteryMission: (missionId: string) => void;
  unlockSecretQuest: (questId: string) => void;

  // Persistent Progress
  progress: FinalCampaignProgress;
  saveProgress: () => void;
}

const initialProgress: FinalCampaignProgress = {
  campaignId: 'grade-2',
  isIntroCinematicSeen: false,
  clearedTrialIds: [],
  currentTrialIndex: 0,
  defeatedBossPhases: [],
  isLordZeroDefeated: false,
  isEndingCinematicSeen: false,
  crystalsRestoredCount: 7,
  titleAwarded: 'Math Hero – Huyền Thoại Bảy Vương Quốc',
  endgameRematchesWon: 0,
  clearedMasteryMissionIds: [],
  clearedSecretQuestIds: [],
};

export const useFinalCampaignStore = create<FinalCampaignState>((set, get) => {
  let loadedProgress = initialProgress;
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(`tmh_${PERSISTENCE_KEY}`);
      if (raw) loadedProgress = { ...initialProgress, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }

  const initialPhase = LORD_ZERO_PHASES_CONFIG[0];

  return {
    currentGrade: loadedProgress.campaignId || 'grade-2',
    stage: loadedProgress.isIntroCinematicSeen ? 'dark_kingdom_trials' : 'cinematic_intro',
    progress: loadedProgress,
    setGrade: (grade) => {
      set({
        currentGrade: grade,
        activeTrialIndex: 0,
        bossPhaseIndex: 1,
        bossCurrentHp: LORD_ZERO_PHASES_CONFIG[0].maxHp,
        bossMaxHp: LORD_ZERO_PHASES_CONFIG[0].maxHp,
        trialFeedback: null,
        bossFeedback: null,
      });
      get().saveProgress();
    },
    setStage: (stage) => set({ stage }),

    // Cinematic Player
    activeCinematicType: 'intro',
    slideIndex: 0,
    nextSlide: () => {
      const { activeCinematicType, slideIndex } = get();
      const cinematic =
        activeCinematicType === 'intro' ? FINAL_INTRO_CINEMATIC : FINAL_OUTRO_CINEMATIC;

      if (slideIndex + 1 < cinematic.slides.length) {
        set({ slideIndex: slideIndex + 1 });
        return true;
      }

      // Cinematic finished
      if (activeCinematicType === 'intro') {
        const prog = { ...get().progress, isIntroCinematicSeen: true };
        set({
          progress: prog,
          slideIndex: 0,
          stage: 'dark_kingdom_trials',
        });
        get().saveProgress();
      } else {
        const prog = {
          ...get().progress,
          isEndingCinematicSeen: true,
          isLordZeroDefeated: true,
        };
        set({
          progress: prog,
          slideIndex: 0,
          stage: 'campaign_completed_fanfare',
        });
        get().saveProgress();
      }
      return false;
    },

    prevSlide: () => {
      set((state) => ({ slideIndex: Math.max(0, state.slideIndex - 1) }));
    },

    skipCinematic: () => {
      const { activeCinematicType } = get();
      if (activeCinematicType === 'intro') {
        const prog = { ...get().progress, isIntroCinematicSeen: true };
        set({
          progress: prog,
          slideIndex: 0,
          stage: 'dark_kingdom_trials',
        });
        get().saveProgress();
      } else {
        const prog = {
          ...get().progress,
          isEndingCinematicSeen: true,
          isLordZeroDefeated: true,
        };
        set({
          progress: prog,
          slideIndex: 0,
          stage: 'campaign_completed_fanfare',
        });
        get().saveProgress();
      }
    },

    // Dark Kingdom Trials
    activeTrialIndex: 0,
    clearedTrialIds: loadedProgress.clearedTrialIds || [],
    trialFeedback: null,

    answerTrial: (optionIndex) => {
      const { currentGrade, activeTrialIndex, clearedTrialIds, progress } = get();
      const trials = FINAL_MATH_TRIALS.filter((t) => t.gradeLevel === currentGrade);
      const active = trials[activeTrialIndex % trials.length];
      if (!active) return false;

      const isSuccess = optionIndex === active.correctIndex;
      const nextCleared =
        isSuccess && !clearedTrialIds.includes(active.id)
          ? [...clearedTrialIds, active.id]
          : clearedTrialIds;

      const nextProg = {
        ...progress,
        clearedTrialIds: nextCleared,
      };

      set({
        clearedTrialIds: nextCleared,
        progress: nextProg,
        trialFeedback: {
          isCorrect: isSuccess,
          message: isSuccess
            ? '🎉 CHÍNH XÁC! Cạm bẫy Dark Kingdom đã bị phá vỡ!'
            : '💡 Chưa chính xác! Năng lượng hắc ám vẫn còn, Tony hãy xem gợi ý và thử lại nhé!',
          explanation: active.explanationVi,
        },
      });

      get().saveProgress();
      return isSuccess;
    },

    nextTrial: () => {
      const { currentGrade } = get();
      const trials = FINAL_MATH_TRIALS.filter((t) => t.gradeLevel === currentGrade);
      set((state) => ({
        activeTrialIndex: (state.activeTrialIndex + 1) % trials.length,
        trialFeedback: null,
      }));
    },

    enterBossArena: () => {
      set({
        stage: 'boss_battle',
        bossPhaseIndex: 1,
        bossCurrentHp: LORD_ZERO_PHASES_CONFIG[0].maxHp,
        bossMaxHp: LORD_ZERO_PHASES_CONFIG[0].maxHp,
        playerHp: 100,
        crystalShieldsRemaining: 7,
        bossSpellIndex: 0,
        bossBattleStatus: 'fighting',
        bossFeedback: null,
      });
    },

    // Lord Zero Boss Battle (5 Phases)
    bossPhaseIndex: 1,
    bossCurrentHp: initialPhase.maxHp,
    bossMaxHp: initialPhase.maxHp,
    playerHp: 100,
    crystalShieldsRemaining: 7,
    bossSpellIndex: 0,
    bossBattleStatus: 'fighting',
    bossFeedback: null,

    answerBossSpell: (optionIndex) => {
      const {
        currentGrade,
        bossPhaseIndex,
        bossCurrentHp,
        bossSpellIndex,
        playerHp,
        crystalShieldsRemaining,
        progress,
      } = get();

      const phaseSpells = LORD_ZERO_SPELLS.filter(
        (s) => s.phaseIndex === bossPhaseIndex && s.gradeLevel === currentGrade
      );
      const spells =
        phaseSpells.length > 0
          ? phaseSpells
          : LORD_ZERO_SPELLS.filter((s) => s.phaseIndex === bossPhaseIndex);

      const spell = spells[bossSpellIndex % spells.length];
      if (!spell) return false;

      const isSuccess = optionIndex === spell.correctIndex;
      let newBossHp = bossCurrentHp;
      let newPlayerHp = playerHp;
      let newShields = crystalShieldsRemaining;
      let shieldActivated = false;

      if (isSuccess) {
        newBossHp = Math.max(0, bossCurrentHp - spell.damage);
      } else {
        if (newShields > 0) {
          newShields -= 1;
          shieldActivated = true;
        } else {
          newPlayerHp = Math.max(20, playerHp - 25);
        }
      }

      const isPhaseCleared = newBossHp <= 0;
      let newStatus: 'fighting' | 'phase_cleared' | 'victory' | 'defeated' = 'fighting';

      const nextDefeated = [...progress.defeatedBossPhases];
      if (isPhaseCleared) {
        if (!nextDefeated.includes(bossPhaseIndex)) {
          nextDefeated.push(bossPhaseIndex);
        }
        if (bossPhaseIndex >= 5) {
          newStatus = 'victory';
        } else {
          newStatus = 'phase_cleared';
        }
      }

      const nextProg = {
        ...progress,
        defeatedBossPhases: nextDefeated,
        isLordZeroDefeated: newStatus === 'victory',
      };

      set({
        bossCurrentHp: newBossHp,
        playerHp: newPlayerHp,
        crystalShieldsRemaining: newShields,
        bossBattleStatus: newStatus,
        bossSpellIndex: bossSpellIndex + 1,
        progress: nextProg,
        bossFeedback: {
          isCorrect: isSuccess,
          damageDealt: isSuccess ? spell.damage : 0,
          shieldUsed: shieldActivated,
          message: isSuccess
            ? `💥 ĐÒN ĐÁNH TRI THỨC CHÍNH XÁC! Gây ${spell.damage} sát thương lên Lord Zero!`
            : shieldActivated
            ? `🛡️ LÁ CHẮN NGỌC TRI THỨC KÍCH HOẠT! Hấp thụ toàn bộ sát thương! Lời giải: ${spell.explanationVi}`
            : `⚠️ Đòn đánh trượt! Hãy chú ý: ${spell.explanationVi}`,
        },
      });

      get().saveProgress();
      return isSuccess;
    },

    nextBossPhase: () => {
      const nextIdx = (Math.min(5, get().bossPhaseIndex + 1)) as LordZeroBossPhaseIndex;
      const nextCfg = LORD_ZERO_PHASES_CONFIG[nextIdx - 1] || LORD_ZERO_PHASES_CONFIG[0];

      set({
        bossPhaseIndex: nextIdx,
        bossCurrentHp: nextCfg.maxHp,
        bossMaxHp: nextCfg.maxHp,
        bossSpellIndex: 0,
        bossBattleStatus: 'fighting',
        bossFeedback: null,
      });
    },

    resetBossBattle: () => {
      const cfg = LORD_ZERO_PHASES_CONFIG[0];
      set({
        bossPhaseIndex: 1,
        bossCurrentHp: cfg.maxHp,
        bossMaxHp: cfg.maxHp,
        playerHp: 100,
        crystalShieldsRemaining: 7,
        bossSpellIndex: 0,
        bossBattleStatus: 'fighting',
        bossFeedback: null,
      });
    },

    // Rematch & Endgame
    activeRematchBossId: null,
    activeRematchDifficulty: 'normal',

    startRematch: (bossId, diff) => {
      set({
        activeRematchBossId: bossId,
        activeRematchDifficulty: diff,
        stage: 'boss_battle',
        bossPhaseIndex: 1,
        bossBattleStatus: 'fighting',
        bossFeedback: null,
      });
    },

    completeMasteryMission: (missionId) => {
      const { progress } = get();
      if (!progress.clearedMasteryMissionIds.includes(missionId)) {
        const next = {
          ...progress,
          clearedMasteryMissionIds: [...progress.clearedMasteryMissionIds, missionId],
        };
        set({ progress: next });
        get().saveProgress();
      }
    },

    unlockSecretQuest: (questId) => {
      const { progress } = get();
      if (!progress.clearedSecretQuestIds.includes(questId)) {
        const next = {
          ...progress,
          clearedSecretQuestIds: [...progress.clearedSecretQuestIds, questId],
        };
        set({ progress: next });
        get().saveProgress();
      }
    },

    saveProgress: () => {
      const { progress } = get();
      try {
        persistenceService.saveCustomData(PERSISTENCE_KEY, progress);
      } catch {
        // ignore
      }
    },
  };
});
