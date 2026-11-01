import type { CampaignId } from './campaign';

export type MultiplicationTableNumber = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type MultiplicationMasteryLevel = 'NOT_STARTED' | 'LEARNING' | 'DEVELOPING' | 'MASTERED';

export type PracticeQuestionType =
  | 'multiple_choice'
  | 'fill_result'
  | 'fill_factor'
  | 'matching'
  | 'number_series'
  | 'word_problem';

export interface VisualGroupItem {
  groupCount: number;
  itemsPerGroup: number;
  itemType: 'apple' | 'gem' | 'star' | 'coin' | 'candy' | 'shield';
  itemNameVi: string;
}

export interface MultiplicationFact {
  id: string; // e.g. '3x4'
  factor1: number;
  factor2: number;
  product: number;
  table: MultiplicationTableNumber;
  grade: 'grade-2' | 'grade-3';
  vietnameseRead: string; // e.g. 'Ba nhân bốn bằng mười hai'
  visualGroup: VisualGroupItem;
  tipVi?: string;
  commutativeFactId?: string; // e.g. '4x3'
}

export interface MultiplicationFactProgress {
  factId: string;
  factor1: number;
  factor2: number;
  product: number;
  attemptsCount: number;
  correctCount: number;
  incorrectCount: number;
  firstAttemptCorrectCount: number;
  totalResponseTimeMs: number;
  hintCount: number;
  lastPracticed: string;
  masteryLevel: MultiplicationMasteryLevel;
  streak: number;
}

export interface PracticeQuestion {
  id: string;
  type: PracticeQuestionType;
  table: number;
  factId: string;
  promptVi: string;
  subPromptVi?: string;
  visualPrompt?: string;
  options?: Array<{ id: string; text: string; value: number | string }>;
  correctAnswer: number | string;
  explanationVi: string;
  hintVi: string;
  matchingPairs?: Array<{ id: string; left: string; right: string; product: number }>;
  seriesData?: {
    sequence: (number | null)[];
    blankIndex: number;
    step: number;
    fullSequence: number[];
  };
}

export interface MultiplicationChallengeConfig {
  mode: 'quick' | 'standard' | 'hero';
  tables: number[];
  useTimer: boolean;
  timeLimitSeconds?: number;
  onlyWeakFacts: boolean;
}

export interface MultiplicationChallengeResult {
  id: string;
  mode: 'quick' | 'standard' | 'hero';
  tables: number[];
  totalQuestions: number;
  correctCount: number;
  accuracyPercent: number;
  durationSeconds: number;
  rewardExp: number;
  rewardGold: number;
  weakFacts: string[];
  completedAt: string;
}

export interface MultiplicationAchievement {
  id: string;
  titleVi: string;
  descVi: string;
  badgeCode: string;
  iconName: string;
  rewardGold: number;
  rewardExp: number;
  unlocked: boolean;
  unlockedAt?: string;
  progressPercent: number;
}

export interface MultiplicationKingdomProgress {
  playerId: string;
  campaignId: CampaignId;
  factsProgress: Record<string, MultiplicationFactProgress>;
  challengesHistory: MultiplicationChallengeResult[];
  achievements: MultiplicationAchievement[];
  bossDefeatedCount: number;
  totalMultiplicationQuestionsAnswered: number;
  lastUpdated: string;
}
