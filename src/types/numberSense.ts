import type { CampaignGrade } from './campaign';

export type PlaceValueUnit = 'thousands' | 'hundreds' | 'tens' | 'ones';

export interface PlaceValueBlockCount {
  thousands: number; // Hàng nghìn (Lớp 3)
  hundreds: number; // Hàng trăm
  tens: number; // Hàng chục
  ones: number; // Hàng đơn vị
}

export interface PlaceValueTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  targetNumber: number;
  promptVi: string;
  expectedBlocks: PlaceValueBlockCount;
  explanationVi: string;
  hintVi: string;
}

export type MentalStrategyType =
  | 'make_ten' // Tách số tạo số 10 hoặc số tròn chục
  | 'compensation' // Làm tròn số rồi bù trừ
  | 'decompose_place_value' // Tách theo giá trị hàng chục/đơn vị
  | 'distributive_mult' // Tách thừa số trong phép nhân
  | 'fact_family_inverse'; // Quan hệ nhân chia đảo

export interface MentalStrategyStep {
  stepIndex: number;
  titleVi: string;
  expressionDisplay: string;
  explanationVi: string;
}

export interface MentalStrategyExample {
  id: string;
  strategy: MentalStrategyType;
  titleVi: string;
  gradeLevel: 'grade-2' | 'grade-3' | 'both';
  originalProblem: string;
  finalAnswer: number;
  steps: MentalStrategyStep[];
  interactivePractice: {
    promptVi: string;
    targetProblem: string;
    options: number[];
    correctAnswer: number;
    tipVi: string;
  };
}

export interface NumberPatternItem {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  titleVi: string;
  sequence: (number | null)[]; // e.g. [5, 10, 15, null, 25]
  missingIndex: number;
  correctAnswer: number;
  stepRuleVi: string; // e.g. "Cộng thêm 5 vào mỗi số liền trước (+5)"
  ruleType: 'add' | 'subtract' | 'multiply';
  stepValue: number;
  explanationVi: string;
  hintVi: string;
}

export type NumberSenseErrorType =
  | 'NONE'
  | 'PLACE_VALUE_MISUNDERSTANDING' // Nhầm lẫn giá trị hàng
  | 'DECOMPOSITION_ERROR' // Tách số sai
  | 'ROUNDING_COMPENSATION_ERROR' // Làm tròn bù trừ sai
  | 'PATTERN_RULE_MISUNDERSTANDING' // Nhầm quy luật bước nhảy
  | 'ARITHMETIC_CALCULATION_MISTAKE'; // Lỗi cộng trừ nhẩm cơ bản

export interface NumberSenseSkillBreakdown {
  numberRecognitionScore: number; // 0 - 100%
  placeValueScore: number;
  numberComparisonScore: number;
  numberCompositionScore: number;
  numberDecompositionScore: number;
  numberRelationshipsScore: number;
  mentalAdditionScore: number;
  mentalSubtractionScore: number;
  mentalMultiplicationScore: number;
  numberPatternsScore: number;
}

export interface NumberSenseAttemptRecord {
  id: string;
  taskId: string;
  category: 'place_value' | 'strategy' | 'pattern' | 'arena' | 'puzzle';
  timestamp: string;
  gradeLevel: 'grade-2' | 'grade-3';
  isSuccess: boolean;
  errorType: NumberSenseErrorType;
  strategyUsed?: MentalStrategyType;
  timeSpentSeconds: number;
  details?: string;
}

export interface NumberSenseAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rewardXp: number;
  rewardGold: number;
  progress: number;
  maxProgress: number;
}

export interface NumberSenseKingdomProgress {
  playerId: string;
  campaignId: CampaignGrade;
  currentZone: 'castle' | 'tower' | 'garden' | 'strategy' | 'forest' | 'arena';
  solvedPlaceValueIds: string[];
  masteredStrategyIds: string[];
  solvedPatternIds: string[];
  solvedPuzzleIds: string[];
  arenaHighestStreak: number;
  attempts: NumberSenseAttemptRecord[];
  achievements: NumberSenseAchievement[];
  totalExpEarned: number;
  totalGoldEarned: number;
  lastUpdated: string;
}
