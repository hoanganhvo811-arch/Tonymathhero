import { create } from 'zustand';
import type {
  CampaignGrade,
  WordProblem,
  WordProblemAdventureProgress,
  OperationType,
} from '../../types';
import {
  WORD_PROBLEMS_CATALOG,
  INITIAL_WORD_PROBLEM_ACHIEVEMENTS,
} from './data/wordProblemsCatalog';
import { WordProblemAdaptiveEngine } from './services/wordProblemAdaptiveEngine';
import { persistenceService } from '../../services/persistence/persistenceService';
import { useProgressStore } from '../../game/state/useProgressStore';

export type WordProblemTab =
  | 'world'
  | 'solve'
  | 'catalog'
  | 'visual_story'
  | 'analytics'
  | 'achievements';

export type SolvingStage = 'reading' | 'analyzing' | 'step_by_step' | 'completed';

interface WordProblemState {
  activeTab: WordProblemTab;
  selectedProblemId: string;
  progress: WordProblemAdventureProgress | null;

  // Solving Session State
  solvingStage: SolvingStage;
  selectedGivenIds: string[];
  isQuestionIdentified: boolean;

  step1Operation: OperationType | null;
  step1Value: string;
  step1Passed: boolean;

  step2Operation: OperationType | null;
  step2Value: string;
  step2Passed: boolean;

  currentHintLevel: number; // 0, 1, 2, 3
  feedbackMessage: string | null;
  feedbackType: 'success' | 'error' | 'info' | null;
  startTime: number;

  // Actions
  setActiveTab: (tab: WordProblemTab) => void;
  initWordProblemAdventure: (playerId: string, campaignId: CampaignGrade) => Promise<void>;
  selectProblem: (problemId: string) => void;

  toggleGiven: (givenId: string) => void;
  identifyQuestion: () => void;
  proceedToAnalyzing: () => void;
  proceedToStepSolving: () => void;

  setStep1Operation: (op: OperationType) => void;
  setStep1Value: (val: string) => void;
  verifyStep1: () => boolean;

  setStep2Operation: (op: OperationType) => void;
  setStep2Value: (val: string) => void;
  verifyStep2: () => boolean;

  requestNextHint: () => void;
  speakText: (text: string) => void;
  resetSolvingSession: () => void;
}

export const useWordProblemStore = create<WordProblemState>((set, get) => ({
  activeTab: 'world',
  selectedProblemId: WORD_PROBLEMS_CATALOG[0].id,
  progress: null,

  solvingStage: 'reading',
  selectedGivenIds: [],
  isQuestionIdentified: false,

  step1Operation: null,
  step1Value: '',
  step1Passed: false,

  step2Operation: null,
  step2Value: '',
  step2Passed: false,

  currentHintLevel: 0,
  feedbackMessage: null,
  feedbackType: null,
  startTime: Date.now(),

  setActiveTab: (tab) => set({ activeTab: tab }),

  initWordProblemAdventure: async (playerId: string, campaignId: CampaignGrade) => {
    const cId = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
    let saved = await persistenceService.getWordProblemProgress(playerId, cId);
    if (!saved) {
      saved = {
        playerId,
        campaignId: cId,
        solvedProblemIds: [],
        attempts: [],
        achievements: INITIAL_WORD_PROBLEM_ACHIEVEMENTS,
        totalXpEarned: 0,
        totalGoldEarned: 0,
        updatedAt: new Date().toISOString(),
      };
      await persistenceService.saveWordProblemProgress(saved);
    }

    const defaultProblem =
      WORD_PROBLEMS_CATALOG.find((p) => cId === 'grade-3' ? p.gradeLevel === 'grade-3' : p.gradeLevel === 'grade-2') ||
      WORD_PROBLEMS_CATALOG[0];

    set({
      progress: saved,
      selectedProblemId: defaultProblem.id,
    });
    get().resetSolvingSession();
  },

  selectProblem: (problemId: string) => {
    set({
      selectedProblemId: problemId,
      activeTab: 'solve',
    });
    get().resetSolvingSession();
  },

  toggleGiven: (givenId: string) => {
    const { selectedGivenIds } = get();
    const next = selectedGivenIds.includes(givenId)
      ? selectedGivenIds.filter((id) => id !== givenId)
      : [...selectedGivenIds, givenId];
    set({ selectedGivenIds: next, feedbackMessage: null });
  },

  identifyQuestion: () => {
    set({ isQuestionIdentified: true, feedbackMessage: '✓ Tony đã xác định rõ câu hỏi của bài toán!' });
  },

  proceedToAnalyzing: () => {
    const { selectedGivenIds, isQuestionIdentified } = get();
    if (selectedGivenIds.length === 0 || !isQuestionIdentified) {
      set({
        feedbackMessage: 'Tony hãy đánh dấu ít nhất 1 dữ kiện và bấm chọn câu hỏi bài toán trước nhé!',
        feedbackType: 'error',
      });
      return;
    }
    set({
      solvingStage: 'analyzing',
      feedbackMessage: null,
      feedbackType: null,
    });
  },

  proceedToStepSolving: () => {
    set({
      solvingStage: 'step_by_step',
      feedbackMessage: null,
      feedbackType: null,
    });
  },

  setStep1Operation: (op: OperationType) => set({ step1Operation: op, feedbackMessage: null }),
  setStep1Value: (val: string) => set({ step1Value: val, feedbackMessage: null }),

  verifyStep1: () => {
    const { selectedProblemId, step1Operation, step1Value, progress, currentHintLevel, startTime } = get();
    const problem = WORD_PROBLEMS_CATALOG.find((p) => p.id === selectedProblemId) || WORD_PROBLEMS_CATALOG[0];
    const step1 = problem.steps[0];
    const numVal = parseInt(step1Value.trim(), 10);

    const diagnosis = WordProblemAdaptiveEngine.diagnoseAttempt(
      problem,
      [step1Operation || 'addition'],
      [numVal],
      get().selectedGivenIds.length
    );

    if (step1Operation === step1.correctOperation && numVal === step1.correctValue) {
      set({
        step1Passed: true,
        feedbackMessage: `Chính xác! Bước 1: ${step1.formulaDisplay}`,
        feedbackType: 'success',
      });

      // If problem is only 1 step, complete it!
      if (problem.steps.length === 1) {
        set({ solvingStage: 'completed' });

        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        useProgressStore.getState().addExp?.(100);
        useProgressStore.getState().addGold?.(60);

        if (progress) {
          if (!progress.solvedProblemIds.includes(problem.id)) {
            progress.solvedProblemIds.push(problem.id);
          }
          progress.attempts.push({
            problemId: problem.id,
            timestamp: new Date().toISOString(),
            isSuccess: true,
            selectedGivenIds: get().selectedGivenIds,
            selectedOperations: [step1Operation],
            calculatedValues: [numVal],
            errorType: 'NONE',
            hintLevelUsed: currentHintLevel,
            timeSpentSeconds: timeSpent,
          });

          // Check achievements
          const apprentice = progress.achievements.find((a) => a.id === 'word_problem_apprentice');
          if (apprentice && !apprentice.unlocked) {
            apprentice.unlocked = true;
            apprentice.progress = 1;
          }

          persistenceService.saveWordProblemProgress(progress);
        }
      }
      return true;
    } else {
      set({
        feedbackMessage: diagnosis.feedbackVi,
        feedbackType: 'error',
      });
      return false;
    }
  },

  setStep2Operation: (op: OperationType) => set({ step2Operation: op, feedbackMessage: null }),
  setStep2Value: (val: string) => set({ step2Value: val, feedbackMessage: null }),

  verifyStep2: () => {
    const { selectedProblemId, step1Operation, step1Value, step2Operation, step2Value, progress, currentHintLevel, startTime } = get();
    const problem = WORD_PROBLEMS_CATALOG.find((p) => p.id === selectedProblemId) || WORD_PROBLEMS_CATALOG[0];
    if (problem.steps.length < 2) return true;

    const step2 = problem.steps[1];
    const numVal1 = parseInt(step1Value.trim(), 10);
    const numVal2 = parseInt(step2Value.trim(), 10);

    const diagnosis = WordProblemAdaptiveEngine.diagnoseAttempt(
      problem,
      [step1Operation || 'addition', step2Operation || 'addition'],
      [numVal1, numVal2],
      get().selectedGivenIds.length
    );

    if (step2Operation === step2.correctOperation && numVal2 === step2.correctValue) {
      set({
        step2Passed: true,
        solvingStage: 'completed',
        feedbackMessage: `Xuất sắc! Lời giải hoàn thiện: ${step2.formulaDisplay}. Đáp số: ${problem.finalAnswer} ${problem.finalUnit}!`,
        feedbackType: 'success',
      });

      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      useProgressStore.getState().addExp?.(180);
      useProgressStore.getState().addGold?.(120);

      if (progress) {
        if (!progress.solvedProblemIds.includes(problem.id)) {
          progress.solvedProblemIds.push(problem.id);
        }
        progress.attempts.push({
          problemId: problem.id,
          timestamp: new Date().toISOString(),
          isSuccess: true,
          selectedGivenIds: get().selectedGivenIds,
          selectedOperations: [step1Operation!, step2Operation],
          calculatedValues: [numVal1, numVal2],
          errorType: 'NONE',
          hintLevelUsed: currentHintLevel,
          timeSpentSeconds: timeSpent,
        });

        // Check 2-step hero achievement
        const heroAch = progress.achievements.find((a) => a.id === 'two_step_hero');
        if (heroAch) {
          heroAch.progress = Math.min(heroAch.maxProgress, heroAch.progress + 1);
          if (heroAch.progress >= heroAch.maxProgress) heroAch.unlocked = true;
        }

        persistenceService.saveWordProblemProgress(progress);
      }
      return true;
    } else {
      set({
        feedbackMessage: diagnosis.feedbackVi,
        feedbackType: 'error',
      });
      return false;
    }
  },

  requestNextHint: () => {
    const { currentHintLevel } = get();
    if (currentHintLevel < 3) {
      set({ currentHintLevel: currentHintLevel + 1 });
    }
  },

  speakText: (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback
      }
    }
  },

  resetSolvingSession: () => {
    set({
      solvingStage: 'reading',
      selectedGivenIds: [],
      isQuestionIdentified: false,
      step1Operation: null,
      step1Value: '',
      step1Passed: false,
      step2Operation: null,
      step2Value: '',
      step2Passed: false,
      currentHintLevel: 0,
      feedbackMessage: null,
      feedbackType: null,
      startTime: Date.now(),
    });
  },
}));
