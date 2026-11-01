import { create } from 'zustand';
import type {
  CampaignGrade,
  DivisionFact,
  DivisionKingdomProgress,
  DivisionQuestion,
  DivisionChallengeConfig,
  DivisionChallengeResult,
  VisualSharingPuzzle,
} from '../../types';
import {
  DIVISION_FACTS,
  DIVISION_PUZZLES,
  INITIAL_DIVISION_ACHIEVEMENTS,
  GRADE_2_DIVISION_TABLES,
  GRADE_3_DIVISION_TABLES,
} from './data/divisionCatalog';
import { generateDivisionQuestion, generateDivisionQuestionsBatch } from './services/divisionQuestionGenerator';
import { DivisionAdaptiveEngine } from './services/divisionAdaptiveEngine';
import { persistenceService } from '../../services/persistence/persistenceService';
import { useProgressStore } from '../../game/state/useProgressStore';
import { usePlayerStore } from '../../game/state/usePlayerStore';

export type DivisionTab =
  | 'hub'
  | 'understand'
  | 'tables'
  | 'relationship'
  | 'practice'
  | 'puzzles'
  | 'battle'
  | 'challenge'
  | 'achievements';

interface DivisionState {
  activeTab: DivisionTab;
  selectedTable: number;
  hideAnswers: boolean;
  progress: DivisionKingdomProgress | null;

  // Practice state
  currentQuestion: DivisionQuestion | null;
  isHintActive: boolean;
  isAnswered: boolean;
  isLastAnswerCorrect: boolean | null;
  questionStartTime: number;

  // Challenge state
  challengeActive: boolean;
  challengeConfig: DivisionChallengeConfig | null;
  challengeQuestions: DivisionQuestion[];
  challengeIndex: number;
  challengeCorrectCount: number;
  challengeWrongCount: number;
  challengeTimeRemaining: number;
  challengeResult: DivisionChallengeResult | null;
  challengeWeakFactIds: string[];

  // Battle state (Cự Thạch Ma Vương Phép Chia)
  battleActive: boolean;
  bossHp: number;
  bossMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  battleQuestion: DivisionQuestion | null;
  battleVictory: boolean;
  battleDefeat: boolean;

  // Visual Puzzle state
  selectedPuzzleId: string;
  puzzlePlacedItems: number[]; // items in each bucket
  puzzleUnassigned: number;
  puzzleCompleted: boolean;
  puzzleFeedback: string | null;

  // Actions
  setActiveTab: (tab: DivisionTab) => void;
  setSelectedTable: (table: number) => void;
  toggleHideAnswers: () => void;
  initDivisionKingdom: (playerId: string, campaignId: CampaignGrade) => Promise<void>;

  // Practice Actions
  loadPracticeQuestion: (table?: number) => void;
  submitPracticeAnswer: (answer: string | number) => boolean;
  nextPracticeQuestion: () => void;
  toggleHint: () => void;

  // Challenge Actions
  startChallenge: (config: DivisionChallengeConfig) => void;
  submitChallengeAnswer: (answer: string | number) => void;
  tickChallengeTimer: () => void;
  finishChallenge: () => void;
  closeChallengeSummary: () => void;

  // Battle Actions
  startBattle: () => void;
  submitBattleAnswer: (answer: string | number) => boolean;
  resetBattle: () => void;

  // Puzzle Actions
  selectPuzzle: (puzzleId: string) => void;
  addItemToGroup: (groupIndex: number) => void;
  removeItemFromGroup: (groupIndex: number) => void;
  resetCurrentPuzzle: () => void;
  checkPuzzleSolution: () => boolean;

  // Audio Reading Action
  speakDivisionVi: (text: string) => void;
}

export const useDivisionStore = create<DivisionState>((set, get) => ({
  activeTab: 'hub',
  selectedTable: 2,
  hideAnswers: false,
  progress: null,

  currentQuestion: null,
  isHintActive: false,
  isAnswered: false,
  isLastAnswerCorrect: null,
  questionStartTime: Date.now(),

  challengeActive: false,
  challengeConfig: null,
  challengeQuestions: [],
  challengeIndex: 0,
  challengeCorrectCount: 0,
  challengeWrongCount: 0,
  challengeTimeRemaining: 0,
  challengeResult: null,
  challengeWeakFactIds: [],

  battleActive: false,
  bossHp: 250,
  bossMaxHp: 250,
  playerHp: 100,
  playerMaxHp: 100,
  battleQuestion: null,
  battleVictory: false,
  battleDefeat: false,

  selectedPuzzleId: 'puzzle_candies_3',
  puzzlePlacedItems: [0, 0, 0],
  puzzleUnassigned: 12,
  puzzleCompleted: false,
  puzzleFeedback: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedTable: (table) => {
    set({ selectedTable: table });
    get().loadPracticeQuestion(table);
  },
  toggleHideAnswers: () => set((state) => ({ hideAnswers: !state.hideAnswers })),

  initDivisionKingdom: async (playerId: string, campaignId: CampaignGrade) => {
    const cId = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
    let saved = await persistenceService.getDivisionProgress(playerId, cId);
    if (!saved) {
      const allowedTables = cId === 'grade-2' ? GRADE_2_DIVISION_TABLES : GRADE_3_DIVISION_TABLES;
      saved = {
        playerId,
        campaignId: cId,
        factsProgress: {},
        unlockedTables: allowedTables,
        completedPuzzles: [],
        achievements: INITIAL_DIVISION_ACHIEVEMENTS,
        bossDefeated: false,
        totalQuestionsAnswered: 0,
        totalCorrect: 0,
        updatedAt: new Date().toISOString(),
      };
      await persistenceService.saveDivisionProgress(saved);
    }
    set({
      progress: saved,
      selectedTable: saved.unlockedTables[0] || 2,
    });
    get().loadPracticeQuestion(saved.unlockedTables[0] || 2);
    get().selectPuzzle('puzzle_candies_3');
  },

  loadPracticeQuestion: (tableNumber?: number) => {
    const { selectedTable, progress } = get();
    const table = tableNumber || selectedTable;
    const tableFacts = DIVISION_FACTS.filter((f) => f.tableNumber === table);
    if (tableFacts.length === 0) return;

    // Use adaptive selection
    const selectedFacts = DivisionAdaptiveEngine.selectSmartFacts(
      tableFacts,
      progress?.factsProgress || {},
      1
    );
    const fact = selectedFacts[0] || tableFacts[0];
    const question = generateDivisionQuestion(fact);

    set({
      currentQuestion: question,
      isHintActive: false,
      isAnswered: false,
      isLastAnswerCorrect: null,
      questionStartTime: Date.now(),
    });
  },

  submitPracticeAnswer: (answer: string | number) => {
    const { currentQuestion, progress, questionStartTime } = get();
    if (!currentQuestion || !progress) return false;

    const responseTimeMs = Date.now() - questionStartTime;
    const isCorrect = String(answer).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();

    // Record attempt in adaptive engine
    const updatedFactProgress = DivisionAdaptiveEngine.recordAttempt(
      progress.factsProgress[currentQuestion.factId],
      currentQuestion.factId,
      isCorrect,
      true,
      responseTimeMs,
      get().isHintActive
    );

    const updatedFactsProgress = {
      ...progress.factsProgress,
      [currentQuestion.factId]: updatedFactProgress,
    };

    const newTotalAnswered = progress.totalQuestionsAnswered + 1;
    const newTotalCorrect = progress.totalCorrect + (isCorrect ? 1 : 0);

    // Check achievement progress
    const updatedAchievements = progress.achievements.map((ach) => {
      if (ach.id === 'division_beginner' && !ach.unlocked && isCorrect) {
        return { ...ach, progress: 1, unlocked: true };
      }
      if (ach.id === 'inverse_master' && currentQuestion.type === 'INVERSE_MULTIPLICATION' && isCorrect) {
        const nextProg = ach.progress + 1;
        return {
          ...ach,
          progress: nextProg,
          unlocked: nextProg >= ach.maxProgress,
        };
      }
      return ach;
    });

    const updatedKingdomProgress: DivisionKingdomProgress = {
      ...progress,
      factsProgress: updatedFactsProgress,
      achievements: updatedAchievements,
      totalQuestionsAnswered: newTotalAnswered,
      totalCorrect: newTotalCorrect,
      updatedAt: new Date().toISOString(),
    };

    set({
      isAnswered: true,
      isLastAnswerCorrect: isCorrect,
      progress: updatedKingdomProgress,
    });

    persistenceService.saveDivisionProgress(updatedKingdomProgress);

    // Reward XP and Gold if correct
    if (isCorrect) {
      useProgressStore.getState().addExp?.(15);
      useProgressStore.getState().addGold?.(10);
    }

    return isCorrect;
  },

  nextPracticeQuestion: () => {
    get().loadPracticeQuestion();
  },

  toggleHint: () => {
    set((state) => ({ isHintActive: !state.isHintActive }));
  },

  startChallenge: (config: DivisionChallengeConfig) => {
    const { progress } = get();
    const candidateFacts = DIVISION_FACTS.filter((f) => config.selectedTables.includes(f.tableNumber));
    const selectedFacts = config.onlyWeakFacts
      ? DivisionAdaptiveEngine.getWeakFacts(candidateFacts, progress?.factsProgress || {})
      : candidateFacts;

    const questions = generateDivisionQuestionsBatch(
      selectedFacts.length > 0 ? selectedFacts : candidateFacts,
      config.questionCount,
      {
        includeInverse: config.includeMultiplicationRelationship,
        includeWordProblems: true,
      }
    );

    set({
      challengeActive: true,
      challengeConfig: config,
      challengeQuestions: questions,
      challengeIndex: 0,
      challengeCorrectCount: 0,
      challengeWrongCount: 0,
      challengeTimeRemaining: config.timeLimitSeconds,
      challengeResult: null,
      challengeWeakFactIds: [],
    });
  },

  submitChallengeAnswer: (answer: string | number) => {
    const {
      challengeQuestions,
      challengeIndex,
      challengeCorrectCount,
      challengeWrongCount,
      challengeWeakFactIds,
      progress,
    } = get();
    if (challengeIndex >= challengeQuestions.length) return;

    const question = challengeQuestions[challengeIndex];
    const isCorrect = String(answer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();

    const newCorrect = challengeCorrectCount + (isCorrect ? 1 : 0);
    const newWrong = challengeWrongCount + (isCorrect ? 0 : 1);
    const newWeakIds = isCorrect ? challengeWeakFactIds : [...challengeWeakFactIds, question.factId];

    // Record attempt
    if (progress) {
      const updatedFact = DivisionAdaptiveEngine.recordAttempt(
        progress.factsProgress[question.factId],
        question.factId,
        isCorrect,
        true,
        2500,
        false
      );
      progress.factsProgress[question.factId] = updatedFact;
      progress.totalQuestionsAnswered += 1;
      progress.totalCorrect += isCorrect ? 1 : 0;
      persistenceService.saveDivisionProgress(progress);
    }

    const nextIndex = challengeIndex + 1;
    if (nextIndex >= challengeQuestions.length) {
      set({
        challengeIndex: nextIndex,
        challengeCorrectCount: newCorrect,
        challengeWrongCount: newWrong,
        challengeWeakFactIds: newWeakIds,
      });
      get().finishChallenge();
    } else {
      set({
        challengeIndex: nextIndex,
        challengeCorrectCount: newCorrect,
        challengeWrongCount: newWrong,
        challengeWeakFactIds: newWeakIds,
      });
    }
  },

  tickChallengeTimer: () => {
    const { challengeTimeRemaining, challengeActive } = get();
    if (!challengeActive) return;
    if (challengeTimeRemaining <= 1) {
      get().finishChallenge();
    } else {
      set({ challengeTimeRemaining: challengeTimeRemaining - 1 });
    }
  },

  finishChallenge: () => {
    const {
      challengeConfig,
      challengeQuestions,
      challengeCorrectCount,
      challengeWrongCount,
      challengeWeakFactIds,
      progress,
    } = get();
    if (!challengeConfig) return;

    const total = challengeQuestions.length;
    const accuracy = total > 0 ? Math.round((challengeCorrectCount / total) * 100) : 0;
    const xp = challengeCorrectCount * 12 + (accuracy >= 90 ? 50 : 20);
    const gold = challengeCorrectCount * 8 + (accuracy >= 90 ? 40 : 15);

    const result: DivisionChallengeResult = {
      mode: challengeConfig.mode,
      totalQuestions: total,
      correctCount: challengeCorrectCount,
      wrongCount: challengeWrongCount,
      accuracyPercent: accuracy,
      timeSpentSeconds: challengeConfig.timeLimitSeconds > 0
        ? challengeConfig.timeLimitSeconds - get().challengeTimeRemaining
        : 0,
      weakFactsIdentified: Array.from(new Set(challengeWeakFactIds)),
      xpEarned: xp,
      goldEarned: gold,
      completedAt: new Date().toISOString(),
    };

    // Reward player
    useProgressStore.getState().addExp?.(xp);
    useProgressStore.getState().addGold?.(gold);

    // Hero achievement
    if (progress && challengeConfig.mode === 'hero' && accuracy >= 90) {
      const heroAch = progress.achievements.find((a) => a.id === 'division_hero');
      if (heroAch && !heroAch.unlocked) {
        heroAch.unlocked = true;
        heroAch.progress = 1;
        persistenceService.saveDivisionProgress(progress);
      }
    }

    set({
      challengeActive: false,
      challengeResult: result,
    });
  },

  closeChallengeSummary: () => set({ challengeResult: null }),

  startBattle: () => {
    const { selectedTable } = get();
    const tableFacts = DIVISION_FACTS.filter((f) => f.tableNumber === selectedTable);
    const fact = tableFacts[Math.floor(Math.random() * tableFacts.length)] || DIVISION_FACTS[0];
    const q = generateDivisionQuestion(fact);

    set({
      battleActive: true,
      bossHp: 250,
      bossMaxHp: 250,
      playerHp: 100,
      playerMaxHp: 100,
      battleQuestion: q,
      battleVictory: false,
      battleDefeat: false,
    });
  },

  submitBattleAnswer: (answer: string | number) => {
    const { battleQuestion, bossHp, playerHp, progress, selectedTable } = get();
    if (!battleQuestion) return false;

    const isCorrect = String(answer).trim().toLowerCase() === String(battleQuestion.correctAnswer).trim().toLowerCase();

    if (isCorrect) {
      const damage = 50 + Math.floor(Math.random() * 20);
      const newBossHp = Math.max(0, bossHp - damage);

      if (newBossHp === 0) {
        // Victory!
        useProgressStore.getState().addExp?.(200);
        useProgressStore.getState().addGold?.(150);

        if (progress) {
          progress.bossDefeated = true;
          const bossAch = progress.achievements.find((a) => a.id === 'division_boss_slayer');
          if (bossAch && !bossAch.unlocked) {
            bossAch.unlocked = true;
            bossAch.progress = 1;
          }
          persistenceService.saveDivisionProgress(progress);
        }

        set({
          bossHp: 0,
          battleVictory: true,
        });
      } else {
        // Next question
        const tableFacts = DIVISION_FACTS.filter((f) => f.tableNumber === selectedTable);
        const nextFact = tableFacts[Math.floor(Math.random() * tableFacts.length)];
        set({
          bossHp: newBossHp,
          battleQuestion: generateDivisionQuestion(nextFact),
        });
      }
      return true;
    } else {
      // Monster counterattacks
      const newPlayerHp = Math.max(0, playerHp - 25);
      if (newPlayerHp === 0) {
        set({
          playerHp: 0,
          battleDefeat: true,
        });
      } else {
        set({ playerHp: newPlayerHp });
      }
      return false;
    }
  },

  resetBattle: () => {
    set({
      battleActive: false,
      battleVictory: false,
      battleDefeat: false,
      battleQuestion: null,
    });
  },

  selectPuzzle: (puzzleId: string) => {
    const puzzle = DIVISION_PUZZLES.find((p) => p.id === puzzleId) || DIVISION_PUZZLES[0];
    const initialGroups = Array(puzzle.targetGroups).fill(0);
    set({
      selectedPuzzleId: puzzle.id,
      puzzlePlacedItems: initialGroups,
      puzzleUnassigned: puzzle.totalItems,
      puzzleCompleted: false,
      puzzleFeedback: null,
    });
  },

  addItemToGroup: (groupIndex: number) => {
    const { puzzlePlacedItems, puzzleUnassigned } = get();
    if (puzzleUnassigned <= 0) return;
    const nextPlaced = [...puzzlePlacedItems];
    nextPlaced[groupIndex] += 1;
    set({
      puzzlePlacedItems: nextPlaced,
      puzzleUnassigned: puzzleUnassigned - 1,
      puzzleFeedback: null,
    });
  },

  removeItemFromGroup: (groupIndex: number) => {
    const { puzzlePlacedItems, puzzleUnassigned } = get();
    if (puzzlePlacedItems[groupIndex] <= 0) return;
    const nextPlaced = [...puzzlePlacedItems];
    nextPlaced[groupIndex] -= 1;
    set({
      puzzlePlacedItems: nextPlaced,
      puzzleUnassigned: puzzleUnassigned + 1,
      puzzleFeedback: null,
    });
  },

  resetCurrentPuzzle: () => {
    const { selectedPuzzleId } = get();
    get().selectPuzzle(selectedPuzzleId);
  },

  checkPuzzleSolution: () => {
    const { selectedPuzzleId, puzzlePlacedItems, puzzleUnassigned, progress } = get();
    const puzzle = DIVISION_PUZZLES.find((p) => p.id === selectedPuzzleId) || DIVISION_PUZZLES[0];

    if (puzzleUnassigned > 0) {
      set({ puzzleFeedback: `Tony vẫn còn ${puzzleUnassigned} vật phẩm chưa chia hết!` });
      return false;
    }

    const allEqual = puzzlePlacedItems.every((count) => count === puzzle.itemsPerGroup);
    if (allEqual) {
      set({
        puzzleCompleted: true,
        puzzleFeedback: `Xuất sắc! ${puzzle.totalItems} chia cho ${puzzle.targetGroups} nhóm, mỗi nhóm nhận đúng ${puzzle.itemsPerGroup} vật phẩm (${puzzle.totalItems} ÷ ${puzzle.targetGroups} = ${puzzle.itemsPerGroup})! 🎉`,
      });

      useProgressStore.getState().addExp?.(puzzle.rewardExp);
      useProgressStore.getState().addGold?.(puzzle.rewardGold);

      if (progress && !progress.completedPuzzles.includes(puzzle.id)) {
        progress.completedPuzzles.push(puzzle.id);
        const ach = progress.achievements.find((a) => a.id === 'equal_sharing_expert');
        if (ach) {
          ach.progress = Math.min(ach.maxProgress, ach.progress + 1);
          if (ach.progress >= ach.maxProgress) ach.unlocked = true;
        }
        persistenceService.saveDivisionProgress(progress);
      }
      return true;
    } else {
      set({
        puzzleFeedback: `Chưa đều rồi! Các nhóm phải có số lượng bằng nhau (${puzzle.itemsPerGroup} vật phẩm mỗi nhóm). Tony hãy thử xếp lại nhé!`,
      });
      return false;
    }
  },

  speakDivisionVi: (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback silently if audio speech synthesis is restricted
      }
    }
  },
}));
