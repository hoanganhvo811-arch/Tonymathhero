import { create } from 'zustand';
import type {
  FractionZone,
  FractionShape,
  FractionTask,
  FractionComparisonTask,
  FairSharingTask,
  FractionKingdomProgress,
  FractionAchievement,
  FractionAttemptRecord,
} from '@/types/fractions';
import type { CampaignId } from '@/types/campaign';
import { FRACTION_BUILDER_PRESETS, type FractionBuilderPreset } from './data/fractionBuilderPresets';
import { FRACTION_RECOGNITION_TASKS } from './data/fractionRecognitionCatalog';
import { FRACTION_COMPARISON_TASKS } from './data/fractionComparisonCatalog';
import { FAIR_SHARING_TASKS } from './data/fairSharingCatalog';
import { FRACTION_ACHIEVEMENTS } from './data/fractionAchievementsCatalog';
import {
  FRACTION_BOSS_PHASES,
  FRACTION_BOSS_SPELLS,
  type FractionBossSpellQuestion,
} from './data/fractionBossCatalog';
import { FractionAdaptiveEngine } from './services/fractionAdaptiveEngine';
import { persistenceService } from '@/services/persistence/persistenceService';

export interface FractionState {
  activeZone: FractionZone | 'hub';
  campaignId: CampaignId;
  setActiveZone: (zone: FractionZone | 'hub') => void;
  setCampaignId: (campaignId: CampaignId) => void;

  // Builder State
  activePreset: FractionBuilderPreset;
  currentShape: FractionShape;
  totalPartitions: number;
  shadedIndices: number[];
  builderFeedback: { isSuccess?: boolean; message: string } | null;
  setShape: (shape: FractionShape) => void;
  setPartitions: (n: number) => void;
  toggleShadedIndex: (idx: number) => void;
  clearShaded: () => void;
  selectPreset: (presetId: string) => void;
  checkBuilderMatch: () => boolean;

  // Recognition State
  recognitionIndex: number;
  currentRecognitionTask: FractionTask;
  recognitionFeedback: { isCorrect: boolean; message: string } | null;
  answerRecognition: (selectedIdx: number) => boolean;
  nextRecognitionTask: () => void;

  // Comparison State
  comparisonIndex: number;
  currentComparisonTask: FractionComparisonTask;
  comparisonFeedback: { isCorrect: boolean; message: string } | null;
  answerComparison: (sign: '<' | '=' | '>') => boolean;
  nextComparisonTask: () => void;

  // Fair Sharing State
  sharingIndex: number;
  currentSharingTask: FairSharingTask;
  sharingFeedback: { isCorrect: boolean; message: string } | null;
  answerSharing: (answer: number) => boolean;
  nextSharingTask: () => void;

  // Boss Battle State
  currentPhaseIndex: number;
  bossHp: number;
  bossMaxHp: number;
  tonyHp: number;
  tonyMaxHp: number;
  battleStreak: number;
  currentBossSpell: FractionBossSpellQuestion;
  battleLogs: string[];
  isBossDefeated: boolean;
  answerBossSpell: (selectedOption: string) => boolean;
  resetBossArena: () => void;

  // Progress & Analytics
  progress: FractionKingdomProgress;
  solvedTaskIds: string[];
  loadProgress: () => Promise<void>;
  saveProgress: () => Promise<void>;
  recordAttempt: (record: Omit<FractionAttemptRecord, 'id' | 'timestamp'>) => void;
}

const getTasksForGrade = <T extends { gradeLevel: 'grade-2' | 'grade-3' }>(
  tasks: T[],
  grade: CampaignId
): T[] => {
  return tasks.filter((t) => t.gradeLevel === grade);
};

export const useFractionStore = create<FractionState>((set, get) => {
  const initialGrade: CampaignId = 'grade-2';
  const g2Presets = getTasksForGrade(FRACTION_BUILDER_PRESETS, initialGrade);
  const g2Recog = getTasksForGrade(FRACTION_RECOGNITION_TASKS, initialGrade);
  const g2Comp = getTasksForGrade(FRACTION_COMPARISON_TASKS, initialGrade);
  const g2Sharing = getTasksForGrade(FAIR_SHARING_TASKS, initialGrade);
  const g2Spells = getTasksForGrade(FRACTION_BOSS_SPELLS, initialGrade);

  const initialProgress: FractionKingdomProgress = {
    campaignId: initialGrade,
    builderTasksCompleted: 0,
    recognitionTasksCompleted: 0,
    comparisonTasksCompleted: 0,
    fairSharingCompleted: 0,
    bossDefeated: false,
    knowledgeCrystalObtained: false,
    totalAttempts: 0,
    successCount: 0,
    accuracyPercentage: 100,
    skillBreakdown: FractionAdaptiveEngine.calculateSkillBreakdown([]),
    achievements: [...FRACTION_ACHIEVEMENTS],
    attemptHistory: [],
  };

  return {
    activeZone: 'hub',
    campaignId: initialGrade,
    setActiveZone: (zone) => set({ activeZone: zone }),
    setCampaignId: (grade) => {
      const presets = getTasksForGrade(FRACTION_BUILDER_PRESETS, grade);
      const recog = getTasksForGrade(FRACTION_RECOGNITION_TASKS, grade);
      const comp = getTasksForGrade(FRACTION_COMPARISON_TASKS, grade);
      const sharing = getTasksForGrade(FAIR_SHARING_TASKS, grade);
      const spells = getTasksForGrade(FRACTION_BOSS_SPELLS, grade);

      set({
        campaignId: grade,
        activePreset: presets[0] || FRACTION_BUILDER_PRESETS[0],
        currentShape: presets[0]?.shape || 'circle_pizza',
        totalPartitions: presets[0]?.targetDenominator || 2,
        shadedIndices: [],
        builderFeedback: null,
        recognitionIndex: 0,
        currentRecognitionTask: recog[0] || FRACTION_RECOGNITION_TASKS[0],
        recognitionFeedback: null,
        comparisonIndex: 0,
        currentComparisonTask: comp[0] || FRACTION_COMPARISON_TASKS[0],
        comparisonFeedback: null,
        sharingIndex: 0,
        currentSharingTask: sharing[0] || FAIR_SHARING_TASKS[0],
        sharingFeedback: null,
        currentBossSpell: spells[0] || FRACTION_BOSS_SPELLS[0],
      });
      get().loadProgress();
    },

    // Builder Initial
    activePreset: g2Presets[0] || FRACTION_BUILDER_PRESETS[0],
    currentShape: g2Presets[0]?.shape || 'circle_pizza',
    totalPartitions: g2Presets[0]?.targetDenominator || 2,
    shadedIndices: [],
    builderFeedback: null,

    setShape: (shape) => set({ currentShape: shape }),
    setPartitions: (n) =>
      set({
        totalPartitions: n,
        shadedIndices: get().shadedIndices.filter((idx) => idx < n),
        builderFeedback: null,
      }),
    toggleShadedIndex: (idx) => {
      const current = get().shadedIndices;
      const next = current.includes(idx) ? current.filter((i) => i !== idx) : [...current, idx];
      set({ shadedIndices: next, builderFeedback: null });
    },
    clearShaded: () => set({ shadedIndices: [], builderFeedback: null }),
    selectPreset: (presetId) => {
      const preset = FRACTION_BUILDER_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        set({
          activePreset: preset,
          currentShape: preset.shape,
          totalPartitions: preset.targetDenominator,
          shadedIndices: [],
          builderFeedback: null,
        });
      }
    },
    checkBuilderMatch: () => {
      const { activePreset, totalPartitions, shadedIndices } = get();
      const isTargetParts = totalPartitions === activePreset.targetDenominator;
      const isTargetShaded = shadedIndices.length === activePreset.targetNumerator;
      const isSuccess = isTargetParts && isTargetShaded;

      const record: Omit<FractionAttemptRecord, 'id' | 'timestamp'> = {
        taskId: activePreset.id,
        category: 'builder',
        gradeLevel: get().campaignId === 'grade-3' ? 'grade-3' : 'grade-2',
        isSuccess,
        errorType: isSuccess
          ? 'NONE'
          : !isTargetParts
          ? 'UNEQUAL_PARTS_CONFUSION'
          : 'NUMERATOR_DENOMINATOR_SWAP',
        timeSpentSeconds: 5,
        details: `Built ${shadedIndices.length}/${totalPartitions}, expected ${activePreset.targetNumerator}/${activePreset.targetDenominator}`,
      };
      get().recordAttempt(record);

      if (isSuccess) {
        set((state) => ({
          builderFeedback: {
            isSuccess: true,
            message: `🎉 TUYỆT VỜI! Bạn đã tạo ra đúng phân số ${activePreset.targetNumerator}/${activePreset.targetDenominator}!`,
          },
          progress: {
            ...state.progress,
            builderTasksCompleted: state.progress.builderTasksCompleted + 1,
          },
        }));
      } else {
        set({
          builderFeedback: {
            isSuccess: false,
            message: !isTargetParts
              ? `Số phần chia chưa đúng! Hãy chỉnh thanh chia về ${activePreset.targetDenominator} phần.`
              : `Số phần tô màu chưa đúng! Cần tô ${activePreset.targetNumerator} phần (đang tô ${shadedIndices.length}).`,
          },
        });
      }
      get().saveProgress();
      return isSuccess;
    },

    // Recognition
    recognitionIndex: 0,
    currentRecognitionTask: g2Recog[0] || FRACTION_RECOGNITION_TASKS[0],
    recognitionFeedback: null,
    answerRecognition: (selectedIdx) => {
      const { currentRecognitionTask, campaignId } = get();
      const isCorrect = selectedIdx === currentRecognitionTask.correctIndex;
      const selectedOption = currentRecognitionTask.options[selectedIdx] || '';
      const correctOption =
        currentRecognitionTask.options[currentRecognitionTask.correctIndex] || '';

      const diag = FractionAdaptiveEngine.diagnoseError(
        currentRecognitionTask,
        selectedOption,
        correctOption
      );

      get().recordAttempt({
        taskId: currentRecognitionTask.id,
        category: 'recognition',
        gradeLevel: campaignId === 'grade-3' ? 'grade-3' : 'grade-2',
        isSuccess: isCorrect,
        errorType: diag.errorType,
        timeSpentSeconds: 6,
        details: isCorrect
          ? 'Correct recognition'
          : `Selected ${selectedOption}, expected ${correctOption}`,
      });

      if (isCorrect) {
        set((state) => ({
          recognitionFeedback: {
            isCorrect: true,
            message: `✨ CHÍNH XÁC! ${currentRecognitionTask.explanationVi}`,
          },
          progress: {
            ...state.progress,
            recognitionTasksCompleted: state.progress.recognitionTasksCompleted + 1,
          },
        }));
      } else {
        set({
          recognitionFeedback: {
            isCorrect: false,
            message: `❌ Chưa chính xác. ${diag.remediationAdviceVi}`,
          },
        });
      }
      get().saveProgress();
      return isCorrect;
    },
    nextRecognitionTask: () => {
      const tasks = getTasksForGrade(FRACTION_RECOGNITION_TASKS, get().campaignId);
      const nextIdx = (get().recognitionIndex + 1) % tasks.length;
      set({
        recognitionIndex: nextIdx,
        currentRecognitionTask: tasks[nextIdx],
        recognitionFeedback: null,
      });
    },

    // Comparison
    comparisonIndex: 0,
    currentComparisonTask: g2Comp[0] || FRACTION_COMPARISON_TASKS[0],
    comparisonFeedback: null,
    answerComparison: (sign) => {
      const { currentComparisonTask, campaignId } = get();
      const isCorrect = sign === currentComparisonTask.correctSign;

      get().recordAttempt({
        taskId: currentComparisonTask.id,
        category: 'comparison',
        gradeLevel: campaignId === 'grade-3' ? 'grade-3' : 'grade-2',
        isSuccess: isCorrect,
        errorType: isCorrect ? 'NONE' : 'INVERSE_COMPARISON_ERROR',
        timeSpentSeconds: 5,
        details: `Selected ${sign}, correct is ${currentComparisonTask.correctSign}`,
      });

      if (isCorrect) {
        set((state) => ({
          comparisonFeedback: {
            isCorrect: true,
            message: `⭐ CHÍNH XÁC! ${currentComparisonTask.explanationVi}`,
          },
          progress: {
            ...state.progress,
            comparisonTasksCompleted: state.progress.comparisonTasksCompleted + 1,
          },
        }));
      } else {
        set({
          comparisonFeedback: {
            isCorrect: false,
            message: `❌ Chưa đúng! ${currentComparisonTask.explanationVi}`,
          },
        });
      }
      get().saveProgress();
      return isCorrect;
    },
    nextComparisonTask: () => {
      const tasks = getTasksForGrade(FRACTION_COMPARISON_TASKS, get().campaignId);
      const nextIdx = (get().comparisonIndex + 1) % tasks.length;
      set({
        comparisonIndex: nextIdx,
        currentComparisonTask: tasks[nextIdx],
        comparisonFeedback: null,
      });
    },

    // Fair Sharing
    sharingIndex: 0,
    currentSharingTask: g2Sharing[0] || FAIR_SHARING_TASKS[0],
    sharingFeedback: null,
    answerSharing: (answer) => {
      const { currentSharingTask, campaignId } = get();
      const correctAnswer = currentSharingTask.options[currentSharingTask.correctIndex];
      const isCorrect = answer === correctAnswer;

      get().recordAttempt({
        taskId: currentSharingTask.id,
        category: 'fair_sharing',
        gradeLevel: campaignId === 'grade-3' ? 'grade-3' : 'grade-2',
        isSuccess: isCorrect,
        errorType: isCorrect ? 'NONE' : 'GROUP_SHARING_ERROR',
        timeSpentSeconds: 6,
        details: `Selected ${answer}, expected ${correctAnswer}`,
      });

      if (isCorrect) {
        set((state) => ({
          sharingFeedback: {
            isCorrect: true,
            message: `🎉 CHIA ĐỀU THÀNH CÔNG! ${currentSharingTask.explanationVi}`,
          },
          progress: {
            ...state.progress,
            fairSharingCompleted: state.progress.fairSharingCompleted + 1,
          },
        }));
      } else {
        set({
          sharingFeedback: {
            isCorrect: false,
            message: `❌ Chia chưa công bằng rồi! Gợi ý: ${currentSharingTask.hintVi}`,
          },
        });
      }
      get().saveProgress();
      return isCorrect;
    },
    nextSharingTask: () => {
      const tasks = getTasksForGrade(FAIR_SHARING_TASKS, get().campaignId);
      const nextIdx = (get().sharingIndex + 1) % tasks.length;
      set({
        sharingIndex: nextIdx,
        currentSharingTask: tasks[nextIdx],
        sharingFeedback: null,
      });
    },

    // Boss Battle
    currentPhaseIndex: 1,
    bossHp: FRACTION_BOSS_PHASES[0].bossHp,
    bossMaxHp: FRACTION_BOSS_PHASES[0].maxHp,
    tonyHp: 100,
    tonyMaxHp: 100,
    battleStreak: 0,
    currentBossSpell: g2Spells[0] || FRACTION_BOSS_SPELLS[0],
    battleLogs: [
      '⚔️ Lord Chaos Partition xuất hiện và phong ấn Knowledge Crystal của Vương Quốc Phân Số!',
    ],
    isBossDefeated: false,
    answerBossSpell: (selectedOption) => {
      const { currentBossSpell, bossHp, tonyHp, battleStreak, currentPhaseIndex, campaignId } = get();
      const isCorrect = selectedOption.trim() === currentBossSpell.correctAnswer.trim();
      const grade = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';

      get().recordAttempt({
        taskId: currentBossSpell.id,
        category: 'boss_arena',
        gradeLevel: grade,
        isSuccess: isCorrect,
        errorType: isCorrect ? 'NONE' : 'NUMERATOR_DENOMINATOR_SWAP',
        timeSpentSeconds: 7,
        details: `Boss spell ${currentBossSpell.spellNameVi}: ${isCorrect ? 'PASS' : 'FAIL'}`,
      });

      const nextStreak = isCorrect ? battleStreak + 1 : 0;
      const logs = [...get().battleLogs];

      if (isCorrect) {
        const comboMultiplier = nextStreak >= 3 ? 1.5 : 1.0;
        const damageDealt = Math.round(currentBossSpell.damage * comboMultiplier);
        const nextBossHp = Math.max(0, bossHp - damageDealt);
        logs.unshift(
          `⚡ Tony thi triển Pháp Thuật Phân Số chính xác! Gây ${damageDealt} sát thương (Combo x${comboMultiplier})!`
        );

        if (nextBossHp <= 0) {
          if (currentPhaseIndex < 3) {
            // Next Phase
            const nextPhase = currentPhaseIndex + 1;
            const phaseConfig = FRACTION_BOSS_PHASES[nextPhase - 1];
            const spells = FRACTION_BOSS_SPELLS.filter(
              (s) => s.phaseIndex === nextPhase && s.gradeLevel === grade
            );
            logs.unshift(
              `💥 ĐÁNH BẠI GIAI ĐOẠN ${currentPhaseIndex}! Ma Vương tiến vào ${phaseConfig.phaseNameVi}!`
            );
            set({
              currentPhaseIndex: nextPhase,
              bossHp: phaseConfig.bossHp,
              bossMaxHp: phaseConfig.maxHp,
              currentBossSpell: spells[0] || currentBossSpell,
              battleStreak: nextStreak,
              battleLogs: logs,
            });
            return true;
          } else {
            // Boss Defeated!
            logs.unshift(
              `🏆 CHIẾN THẮNG VANG DỘI! Lord Chaos Partition đã bị thanh tẩy! Knowledge Crystal Phân Số đã được giải thoát!`
            );
            set((state) => ({
              bossHp: 0,
              isBossDefeated: true,
              battleLogs: logs,
              progress: {
                ...state.progress,
                bossDefeated: true,
                knowledgeCrystalObtained: true,
              },
            }));
            get().saveProgress();
            return true;
          }
        } else {
          // Select next spell in same phase
          const spells = FRACTION_BOSS_SPELLS.filter(
            (s) => s.phaseIndex === currentPhaseIndex && s.gradeLevel === grade
          );
          const randomSpell = spells[Math.floor(Math.random() * spells.length)] || currentBossSpell;
          set({
            bossHp: nextBossHp,
            currentBossSpell: randomSpell,
            battleStreak: nextStreak,
            battleLogs: logs,
          });
          return true;
        }
      } else {
        // Incorrect
        const bossDamage = 20;
        const nextTonyHp = Math.max(10, tonyHp - bossDamage);
        logs.unshift(
          `💔 Câu trả lời chưa chính xác! Ma Vương phản kích bằng ${currentBossSpell.spellNameVi}, Tony mất ${bossDamage} HP!`
        );
        set({
          tonyHp: nextTonyHp,
          battleStreak: 0,
          battleLogs: logs,
        });
        return false;
      }
    },
    resetBossArena: () => {
      const grade = get().campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
      const spells = FRACTION_BOSS_SPELLS.filter((s) => s.phaseIndex === 1 && s.gradeLevel === grade);
      set({
        currentPhaseIndex: 1,
        bossHp: FRACTION_BOSS_PHASES[0].bossHp,
        bossMaxHp: FRACTION_BOSS_PHASES[0].maxHp,
        tonyHp: 100,
        tonyMaxHp: 100,
        battleStreak: 0,
        currentBossSpell: spells[0] || FRACTION_BOSS_SPELLS[0],
        isBossDefeated: false,
        battleLogs: ['⚔️ Trận chiến bắt đầu lại! Phá giải phong ấn của Ma Vương!'],
      });
    },

    // Progress
    progress: initialProgress,
    solvedTaskIds: [],
    loadProgress: async () => {
      try {
        const saved = await persistenceService.getFractionProgress(get().campaignId);
        if (saved) {
          set({ progress: saved });
        }
      } catch (err) {
        console.warn('Could not load fraction progress:', err);
      }
    },
    saveProgress: async () => {
      try {
        await persistenceService.saveFractionProgress(get().progress);
      } catch (err) {
        console.warn('Could not save fraction progress:', err);
      }
    },
    recordAttempt: (record) => {
      const fullRecord: FractionAttemptRecord = {
        ...record,
        id: `frac_att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
      };
      set((state) => {
        const history = [...state.progress.attemptHistory, fullRecord];
        const successCount = history.filter((h) => h.isSuccess).length;
        const total = history.length;
        const accuracyPercentage = total > 0 ? Math.round((successCount / total) * 100) : 100;
        const skillBreakdown = FractionAdaptiveEngine.calculateSkillBreakdown(history);

        // Update achievements progress
        const achievements = state.progress.achievements.map((ach) => {
          let progress = ach.progress;
          let unlocked = ach.unlocked;

          if (ach.id === 'frac_equal_splitter' && state.progress.recognitionTasksCompleted >= 3) {
            unlocked = true;
            progress = 100;
          } else if (ach.id === 'frac_pizza_master' && state.progress.builderTasksCompleted >= 2) {
            unlocked = true;
            progress = 100;
          } else if (ach.id === 'frac_comparator' && state.progress.comparisonTasksCompleted >= 3) {
            unlocked = true;
            progress = 100;
          } else if (ach.id === 'frac_fair_sharer' && state.progress.fairSharingCompleted >= 3) {
            unlocked = true;
            progress = 100;
          } else if (ach.id === 'frac_boss_slayer' && state.progress.bossDefeated) {
            unlocked = true;
            progress = 100;
          } else if (
            ach.id === 'frac_crystal_guardian' &&
            state.progress.bossDefeated &&
            accuracyPercentage >= 80
          ) {
            unlocked = true;
            progress = 100;
          }

          return { ...ach, unlocked, progress };
        });

        return {
          progress: {
            ...state.progress,
            totalAttempts: total,
            successCount,
            accuracyPercentage,
            skillBreakdown,
            achievements,
            attemptHistory: history,
          },
        };
      });
    },
  };
});
