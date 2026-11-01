import { create } from 'zustand';
import type {
  NumberSenseKingdomProgress,
  NumberSenseAchievement,
  NumberSenseAttemptRecord,
  NumberSenseErrorType,
  PlaceValueTask,
  PlaceValueBlockCount,
  MentalStrategyExample,
  NumberPatternItem,
} from '../../types/numberSense';
import type { CampaignGrade } from '../../types/campaign';
import { PLACE_VALUE_TASKS } from './data/placeValueCatalog';
import { MENTAL_STRATEGIES_CATALOG } from './data/mentalStrategiesCatalog';
import { NUMBER_PATTERNS_CATALOG } from './data/numberPatternsCatalog';
import { NUMBER_SENSE_PUZZLES_CATALOG, type NumberSensePuzzle } from './data/numberSensePuzzlesCatalog';
import { INITIAL_NUMBER_SENSE_ACHIEVEMENTS } from './data/numberSenseAchievementsCatalog';
import { NumberSenseAdaptiveEngine } from './services/numberSenseAdaptiveEngine';
import { persistenceService } from '../../services/persistence/persistenceService';

export type NumberKingdomZone = 'castle' | 'tower' | 'garden' | 'strategy' | 'forest' | 'arena' | 'analytics';

interface NumberSenseState {
  activeZone: NumberKingdomZone;
  campaignId: CampaignGrade;
  playerId: string;
  setActiveZone: (zone: NumberKingdomZone) => void;
  setCampaignId: (grade: CampaignGrade) => void;

  // Place Value Tower State
  activePlaceValueTask: PlaceValueTask;
  placedBlocks: PlaceValueBlockCount;
  placeValueFeedback: { message: string; isSuccess?: boolean } | null;
  selectPlaceValueTask: (taskId: string) => void;
  addBlock: (unit: 'thousands' | 'hundreds' | 'tens' | 'ones') => void;
  removeBlock: (unit: 'thousands' | 'hundreds' | 'tens' | 'ones') => void;
  resetBlocks: () => void;
  submitPlaceValueCheck: () => boolean;

  // Mental Strategy Lab State
  activeStrategy: MentalStrategyExample;
  strategyFeedback: { message: string; isSuccess?: boolean } | null;
  selectStrategy: (stratId: string) => void;
  submitStrategyPractice: (userAnswer: number) => boolean;

  // Number Patterns Forest State
  activePattern: NumberPatternItem;
  patternFeedback: { message: string; isSuccess?: boolean } | null;
  selectPattern: (patId: string) => void;
  submitPatternAnswer: (userAnswer: number) => boolean;

  // Mental Math Arena State
  bossHp: number;
  bossMaxHp: number;
  tonyHp: number;
  tonyMaxHp: number;
  currentStreak: number;
  highestStreak: number;
  battleLog: string[];
  isBattleVictory: boolean;
  attackArenaBoss: (isSuccess: boolean, moveNameVi: string) => void;
  resetArenaBattle: () => void;

  // Puzzles
  currentPuzzle: NumberSensePuzzle;
  solvedPuzzleIds: string[];
  solvedPlaceValueIds: string[];
  solvedPatternIds: string[];
  masteredStrategyIds: string[];
  nextAdaptivePuzzle: () => void;
  submitPuzzleAnswer: (answer: string) => boolean;

  // Analytics & History
  attempts: NumberSenseAttemptRecord[];
  achievements: NumberSenseAchievement[];
  totalExp: number;
  totalGold: number;

  loadProgress: (playerId: string, campaignId: CampaignGrade) => Promise<void>;
  saveProgress: () => Promise<void>;
}

export const useNumberSenseStore = create<NumberSenseState>((set, get) => ({
  activeZone: 'tower',
  campaignId: 'grade-2',
  playerId: 'student_tony_hero',

  setActiveZone: (zone) => {
    set({ activeZone: zone, placeValueFeedback: null, strategyFeedback: null, patternFeedback: null });
    get().saveProgress();
  },

  setCampaignId: (grade) => {
    set({ campaignId: grade });
    get().loadProgress(get().playerId, grade);
  },

  // Place Value Tower
  activePlaceValueTask: PLACE_VALUE_TASKS[0],
  placedBlocks: { thousands: 0, hundreds: 0, tens: 0, ones: 0 },
  placeValueFeedback: null,

  selectPlaceValueTask: (taskId) => {
    const task = PLACE_VALUE_TASKS.find((t) => t.id === taskId) || PLACE_VALUE_TASKS[0];
    set({
      activePlaceValueTask: task,
      placedBlocks: { thousands: 0, hundreds: 0, tens: 0, ones: 0 },
      placeValueFeedback: null,
    });
  },

  addBlock: (unit) =>
    set((state) => ({
      placedBlocks: {
        ...state.placedBlocks,
        [unit]: state.placedBlocks[unit] + 1,
      },
    })),

  removeBlock: (unit) =>
    set((state) => ({
      placedBlocks: {
        ...state.placedBlocks,
        [unit]: Math.max(0, state.placedBlocks[unit] - 1),
      },
    })),

  resetBlocks: () =>
    set({
      placedBlocks: { thousands: 0, hundreds: 0, tens: 0, ones: 0 },
      placeValueFeedback: null,
    }),

  submitPlaceValueCheck: () => {
    const state = get();
    const task = state.activePlaceValueTask;
    const diag = NumberSenseAdaptiveEngine.diagnosePlaceValueAttempt(
      task.expectedBlocks,
      state.placedBlocks
    );

    const record: NumberSenseAttemptRecord = {
      id: `att_${Date.now()}`,
      taskId: task.id,
      category: 'place_value',
      timestamp: new Date().toISOString(),
      gradeLevel: task.gradeLevel,
      isSuccess: diag.isSuccess,
      errorType: diag.errorType,
      timeSpentSeconds: 15,
      details: diag.feedbackVi,
    };

    set((s) => {
      const isSuccess = diag.isSuccess;
      const newAttempts = [...s.attempts, record];
      const newSolved = isSuccess && !s.solvedPlaceValueIds.includes(task.id)
        ? [...s.solvedPlaceValueIds, task.id]
        : s.solvedPlaceValueIds;

      const newExp = isSuccess ? s.totalExp + 45 : s.totalExp;
      const newGold = isSuccess ? s.totalGold + 25 : s.totalGold;

      // Update architect achievement
      const ach = s.achievements.map((a) => {
        if (a.id === 'ns_place_value_architect' && isSuccess) {
          const p = Math.min(a.maxProgress, newSolved.length);
          return { ...a, progress: p, unlocked: p >= a.maxProgress };
        }
        return a;
      });

      return {
        attempts: newAttempts,
        solvedPlaceValueIds: newSolved,
        totalExp: newExp,
        totalGold: newGold,
        achievements: ach,
        placeValueFeedback: { message: diag.feedbackVi, isSuccess },
      };
    });

    get().saveProgress();
    return diag.isSuccess;
  },

  // Mental Strategy Lab
  activeStrategy: MENTAL_STRATEGIES_CATALOG[0],
  strategyFeedback: null,

  selectStrategy: (stratId) => {
    const st = MENTAL_STRATEGIES_CATALOG.find((item) => item.id === stratId) || MENTAL_STRATEGIES_CATALOG[0];
    set({ activeStrategy: st, strategyFeedback: null });
  },

  submitStrategyPractice: (userAnswer) => {
    const state = get();
    const st = state.activeStrategy;
    const diag = NumberSenseAdaptiveEngine.diagnoseStrategyAttempt(
      st.interactivePractice.correctAnswer,
      userAnswer,
      st.strategy
    );

    const record: NumberSenseAttemptRecord = {
      id: `strat_att_${Date.now()}`,
      taskId: st.id,
      category: 'strategy',
      timestamp: new Date().toISOString(),
      gradeLevel: st.gradeLevel === 'grade-3' ? 'grade-3' : 'grade-2',
      isSuccess: diag.isSuccess,
      errorType: diag.errorType,
      strategyUsed: st.strategy,
      timeSpentSeconds: 12,
      details: diag.feedbackVi,
    };

    set((s) => {
      const isSuccess = diag.isSuccess;
      const newAttempts = [...s.attempts, record];
      const newMastered = isSuccess && !s.masteredStrategyIds.includes(st.id)
        ? [...s.masteredStrategyIds, st.id]
        : s.masteredStrategyIds;

      // Update strategy virtuoso achievement
      const ach = s.achievements.map((a) => {
        if (a.id === 'ns_strategy_virtuoso' && isSuccess) {
          const p = Math.min(a.maxProgress, newMastered.length);
          return { ...a, progress: p, unlocked: p >= a.maxProgress };
        }
        return a;
      });

      return {
        attempts: newAttempts,
        masteredStrategyIds: newMastered,
        totalExp: isSuccess ? s.totalExp + 50 : s.totalExp,
        totalGold: isSuccess ? s.totalGold + 25 : s.totalGold,
        achievements: ach,
        strategyFeedback: { message: diag.feedbackVi, isSuccess },
      };
    });

    get().saveProgress();
    return diag.isSuccess;
  },

  // Number Patterns Forest
  activePattern: NUMBER_PATTERNS_CATALOG[0],
  patternFeedback: null,

  selectPattern: (patId) => {
    const p = NUMBER_PATTERNS_CATALOG.find((item) => item.id === patId) || NUMBER_PATTERNS_CATALOG[0];
    set({ activePattern: p, patternFeedback: null });
  },

  submitPatternAnswer: (userAnswer) => {
    const state = get();
    const pat = state.activePattern;
    const diag = NumberSenseAdaptiveEngine.diagnosePatternAttempt(
      pat.correctAnswer,
      userAnswer,
      pat.stepRuleVi
    );

    const record: NumberSenseAttemptRecord = {
      id: `pat_att_${Date.now()}`,
      taskId: pat.id,
      category: 'pattern',
      timestamp: new Date().toISOString(),
      gradeLevel: pat.gradeLevel,
      isSuccess: diag.isSuccess,
      errorType: diag.errorType,
      timeSpentSeconds: 10,
      details: diag.feedbackVi,
    };

    set((s) => {
      const isSuccess = diag.isSuccess;
      const newAttempts = [...s.attempts, record];
      const newSolved = isSuccess && !s.solvedPatternIds.includes(pat.id)
        ? [...s.solvedPatternIds, pat.id]
        : s.solvedPatternIds;

      // Update pattern detective achievement
      const ach = s.achievements.map((a) => {
        if (a.id === 'ns_pattern_detective' && isSuccess) {
          const p = Math.min(a.maxProgress, newSolved.length);
          return { ...a, progress: p, unlocked: p >= a.maxProgress };
        }
        return a;
      });

      return {
        attempts: newAttempts,
        solvedPatternIds: newSolved,
        totalExp: isSuccess ? s.totalExp + 40 : s.totalExp,
        totalGold: isSuccess ? s.totalGold + 20 : s.totalGold,
        achievements: ach,
        patternFeedback: { message: diag.feedbackVi, isSuccess },
      };
    });

    get().saveProgress();
    return diag.isSuccess;
  },

  // Mental Math Arena vs Shadow Numeror
  bossHp: 300,
  bossMaxHp: 300,
  tonyHp: 100,
  tonyMaxHp: 100,
  currentStreak: 0,
  highestStreak: 0,
  battleLog: ['⚔️ Bóng Ma Số Học Numeror xuất hiện với làn sương mù tính toán!'],
  isBattleVictory: false,

  attackArenaBoss: (isSuccess, moveNameVi) => {
    set((state) => {
      if (isSuccess) {
        const nextStreak = state.currentStreak + 1;
        const bestStreak = Math.max(state.highestStreak, nextStreak);
        const damage = 60 + nextStreak * 10;
        const newBossHp = Math.max(0, state.bossHp - damage);
        const victory = newBossHp === 0;

        const logs = [
          ...state.battleLog,
          `⚡ Tính nhẩm chuẩn xác! Tony tung [${moveNameVi}] (Combo x${nextStreak}) gây ${damage} sát thương!`,
        ];

        let achievements = state.achievements;
        if (nextStreak >= 5) {
          achievements = achievements.map((a) =>
            a.id === 'ns_mental_speedster' ? { ...a, progress: 5, unlocked: true } : a
          );
        }

        if (victory) {
          logs.push('🏆 TOÀN THẮNG VANG DỘI! Bóng Ma Số Học đã tan biến trong luồng sáng tri thức!');
          achievements = achievements.map((a) =>
            a.id === 'ns_number_arena_champion' ? { ...a, progress: 1, unlocked: true } : a
          );
        }

        return {
          bossHp: newBossHp,
          currentStreak: nextStreak,
          highestStreak: bestStreak,
          isBattleVictory: victory,
          battleLog: logs,
          totalExp: victory ? state.totalExp + 250 : state.totalExp + 30,
          totalGold: victory ? state.totalGold + 120 : state.totalGold + 15,
          achievements,
        };
      } else {
        const bossDmg = 15;
        const newTonyHp = Math.max(10, state.tonyHp - bossDmg);
        return {
          tonyHp: newTonyHp,
          currentStreak: 0,
          battleLog: [
            ...state.battleLog,
            `⚠️ Phép tính nhẩm bị trượt! Numeror phản kích gây ${bossDmg} sát thương! Hãy nhẩm cẩn thận!`,
          ],
        };
      }
    });

    get().saveProgress();
  },

  resetArenaBattle: () => {
    set({
      bossHp: 300,
      tonyHp: 100,
      currentStreak: 0,
      battleLog: ['⚔️ Đấu Trường Tính Nhẩm sẵn sàng cho trận quyết đấu mới!'],
      isBattleVictory: false,
    });
  },

  // Puzzles
  currentPuzzle: NUMBER_SENSE_PUZZLES_CATALOG[0],
  solvedPuzzleIds: [],
  solvedPlaceValueIds: [],
  solvedPatternIds: [],
  masteredStrategyIds: [],

  nextAdaptivePuzzle: () => {
    const state = get();
    const grade = state.campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
    const nextP = NumberSenseAdaptiveEngine.selectAdaptivePuzzle(
      NUMBER_SENSE_PUZZLES_CATALOG,
      state.solvedPuzzleIds,
      grade
    );
    set({ currentPuzzle: nextP });
  },

  submitPuzzleAnswer: (answer) => {
    const state = get();
    const p = state.currentPuzzle;
    const isCorrect = answer === p.correctAnswer;

    const record: NumberSenseAttemptRecord = {
      id: `puzzle_att_${Date.now()}`,
      taskId: p.id,
      category: 'puzzle',
      timestamp: new Date().toISOString(),
      gradeLevel: p.gradeLevel,
      isSuccess: isCorrect,
      errorType: isCorrect ? 'NONE' : 'ARITHMETIC_CALCULATION_MISTAKE',
      timeSpentSeconds: 15,
      details: isCorrect ? 'Đúng' : `Chọn sai: ${answer}`,
    };

    set((s) => {
      const newAttempts = [...s.attempts, record];
      const newSolved = isCorrect && !s.solvedPuzzleIds.includes(p.id)
        ? [...s.solvedPuzzleIds, p.id]
        : s.solvedPuzzleIds;

      return {
        attempts: newAttempts,
        solvedPuzzleIds: newSolved,
        totalExp: isCorrect ? s.totalExp + 25 : s.totalExp,
        totalGold: isCorrect ? s.totalGold + 15 : s.totalGold,
      };
    });

    get().saveProgress();
    return isCorrect;
  },

  // Analytics & History
  attempts: [],
  achievements: INITIAL_NUMBER_SENSE_ACHIEVEMENTS,
  totalExp: 0,
  totalGold: 0,

  loadProgress: async (playerId, campaignId) => {
    try {
      const saved = await persistenceService.getNumberSenseProgress(
        playerId,
        campaignId === 'grade-3' ? 'grade-3' : 'grade-2'
      );
      if (saved) {
        set({
          activeZone: saved.currentZone || 'tower',
          solvedPlaceValueIds: saved.solvedPlaceValueIds || [],
          masteredStrategyIds: saved.masteredStrategyIds || [],
          solvedPatternIds: saved.solvedPatternIds || [],
          solvedPuzzleIds: saved.solvedPuzzleIds || [],
          highestStreak: saved.arenaHighestStreak || 0,
          attempts: saved.attempts || [],
          achievements: saved.achievements && saved.achievements.length > 0 ? saved.achievements : INITIAL_NUMBER_SENSE_ACHIEVEMENTS,
          totalExp: saved.totalExpEarned || 0,
          totalGold: saved.totalGoldEarned || 0,
        });
      }
    } catch (e) {
      console.warn('Failed to load Number Sense progress:', e);
    }
  },

  saveProgress: async () => {
    const state = get();
    const progressData: NumberSenseKingdomProgress = {
      playerId: state.playerId,
      campaignId: state.campaignId === 'grade-3' ? 'grade-3' : 'grade-2',
      currentZone: state.activeZone === 'analytics' ? 'tower' : state.activeZone,
      solvedPlaceValueIds: state.solvedPlaceValueIds,
      masteredStrategyIds: state.masteredStrategyIds,
      solvedPatternIds: state.solvedPatternIds,
      solvedPuzzleIds: state.solvedPuzzleIds,
      arenaHighestStreak: state.highestStreak,
      attempts: state.attempts,
      achievements: state.achievements,
      totalExpEarned: state.totalExp,
      totalGoldEarned: state.totalGold,
      lastUpdated: new Date().toISOString(),
    };
    try {
      await persistenceService.saveNumberSenseProgress(progressData);
    } catch (e) {
      console.warn('Failed to save Number Sense progress:', e);
    }
  },
}));
