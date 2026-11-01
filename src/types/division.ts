import type { CampaignGrade } from './campaign';

export type DivisionMasteryLevel = 'NOT_STARTED' | 'LEARNING' | 'DEVELOPING' | 'MASTERED';

export type DivisionQuestionType =
  | 'MULTIPLE_CHOICE'
  | 'FILL_QUOTIENT'
  | 'FILL_MISSING'
  | 'FIND_EQUATION'
  | 'MATCHING'
  | 'INVERSE_MULTIPLICATION'
  | 'WORD_PROBLEM'
  | 'REAL_WORLD';

export interface DivisionFact {
  id: string; // e.g. "div_2_1" (2 / 2 = 1) or "div_6_3" (18 / 6 = 3)
  dividend: number; // Số bị chia
  divisor: number; // Số chia
  quotient: number; // Thương
  tableNumber: number; // Bảng chia (2 to 9)
  remainder: number; // 0 for exact division
  multiplicationFactId: string; // Liên kết bảng nhân tương ứng (e.g. "fact_2_1")
  promptVi: string; // e.g. "Mười tám chia sáu bằng ba"
  spellingVi: string; // e.g. "18 : 6 = 3"
  gradeLevel: 'grade-2' | 'grade-3' | 'both';
  tipVi?: string;
}

export interface DivisionFactProgress {
  factId: string;
  attempts: number;
  correct: number;
  firstAttemptCorrect: number;
  lastPracticed: string;
  masteryLevel: DivisionMasteryLevel;
  consecutiveCorrect: number;
  avgResponseTimeMs: number;
  hintCount: number;
  linkedMultiplicationMistakes: number;
}

export interface DivisionQuestion {
  id: string;
  type: DivisionQuestionType;
  factId: string;
  prompt: string;
  options?: (number | string)[]; // 4 distinct options for multiple choice
  correctAnswer: number | string;
  explanation: string;
  hint: string;
  formulaDisplay: string;
  visualContext?: {
    totalItems: number;
    groups: number;
    itemsPerGroup: number;
    itemIcon: string;
    label: string;
  };
  relatedMultiplicationFact?: {
    factorA: number;
    factorB: number;
    product: number;
    formula: string;
  };
}

export interface DivisionChallengeConfig {
  mode: 'quick' | 'standard' | 'hero';
  questionCount: number; // 10, 20, 30
  selectedTables: number[]; // e.g. [2, 5] or [2, 3, 4, 5, 6, 7, 8, 9]
  includeMultiplicationRelationship: boolean;
  onlyWeakFacts: boolean;
  timeLimitSeconds: number; // 0 = no limit, or e.g. 60, 120, 180
}

export interface DivisionChallengeResult {
  mode: 'quick' | 'standard' | 'hero';
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracyPercent: number;
  timeSpentSeconds: number;
  weakFactsIdentified: string[];
  xpEarned: number;
  goldEarned: number;
  completedAt: string;
}

export interface VisualSharingPuzzle {
  id: string;
  title: string;
  description: string;
  totalItems: number;
  targetGroups: number;
  itemsPerGroup: number;
  itemType: 'candies' | 'coins' | 'gems' | 'apples';
  itemIcon: string;
  containerIcon: string;
  containerName: string;
  rewardGold: number;
  rewardExp: number;
}

export interface DivisionAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rewardXp: number;
  rewardGold: number;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

export interface DivisionKingdomProgress {
  playerId: string;
  campaignId: CampaignGrade;
  factsProgress: Record<string, DivisionFactProgress>;
  unlockedTables: number[];
  completedPuzzles: string[];
  achievements: DivisionAchievement[];
  bossDefeated: boolean;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  updatedAt: string;
}
