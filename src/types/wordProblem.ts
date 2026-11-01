import type { CampaignGrade } from './campaign';

export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type WordProblemCategory =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'two_step_mixed';

export type WordProblemStoryContext =
  | 'village'
  | 'market'
  | 'farm'
  | 'treasure'
  | 'construction'
  | 'forest';

export type WordProblemErrorType =
  | 'NONE'
  | 'READING_MISUNDERSTANDING'
  | 'OPERATION_MISMATCH' // Tư duy chọn sai phép tính (không phải lỗi tính toán)
  | 'CALCULATION_MISTAKE' // Chọn đúng phép tính nhưng tính nhẩm sai
  | 'STEP2_INTEGRATION_ERROR'; // Đúng bước 1 nhưng chưa biết dùng kết quả cho bước 2

export interface WordProblemStep {
  stepIndex: number; // 1 or 2
  subGoal: string; // e.g. "Tìm số bánh dâu trong 4 hộp"
  correctOperation: OperationType;
  operands: number[]; // e.g. [5, 4]
  correctValue: number; // e.g. 20
  unit: string; // e.g. "chiếc bánh"
  formulaDisplay: string; // e.g. "5 × 4 = 20"
}

export interface WordProblemGiven {
  id: string;
  text: string; // e.g. "Có 4 hộp bánh"
  value: number;
  unit: string;
}

export interface WordProblemVisualContext {
  itemEmoji: string;
  containerEmoji?: string;
  initialItems?: number;
  addedItems?: number;
  removedItems?: number;
  groups?: number;
  itemsPerGroup?: number;
  description: string;
}

export interface WordProblemHints {
  tier1_nudge: string; // Gợi ý định hướng
  tier2_guidance: string; // Phân tích dữ kiện và mối quan hệ
  tier3_walkthrough: string; // Hướng dẫn từng bước giải
}

export interface WordProblem {
  id: string;
  title: string;
  gradeLevel: 'grade-2' | 'grade-3' | 'both';
  category: WordProblemCategory;
  storyContext: WordProblemStoryContext;
  prompt: string; // Toàn bộ đề bài
  question: string; // Bài toán hỏi gì?
  givens: WordProblemGiven[]; // Các dữ kiện đúng
  distractorGivens?: string[]; // Dữ kiện nhiễu
  steps: WordProblemStep[]; // 1 bước hoặc 2 bước
  finalAnswer: number;
  finalUnit: string;
  fullSolutionMarkdown: string; // Lời giải mẫu chi tiết
  visualContext: WordProblemVisualContext;
  hints: WordProblemHints;
}

export interface WordProblemSkillBreakdown {
  readingComprehensionScore: number; // 0 - 100%
  givenIdentificationScore: number;
  questionIdentificationScore: number;
  operationSelectionScore: number;
  calculationAccuracyScore: number;
  twoStepReasoningScore: number;
}

export interface WordProblemAttemptRecord {
  problemId: string;
  timestamp: string;
  isSuccess: boolean;
  selectedGivenIds: string[];
  selectedOperations: OperationType[];
  calculatedValues: number[];
  errorType: WordProblemErrorType;
  hintLevelUsed: number; // 0, 1, 2, 3
  timeSpentSeconds: number;
}

export interface WordProblemAchievement {
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

export interface WordProblemAdventureProgress {
  playerId: string;
  campaignId: CampaignGrade;
  solvedProblemIds: string[];
  attempts: WordProblemAttemptRecord[];
  achievements: WordProblemAchievement[];
  totalXpEarned: number;
  totalGoldEarned: number;
  updatedAt: string;
}
