export type FractionShape = 'circle_pizza' | 'rectangle_chocolate' | 'bar_cake' | 'gem_grid';

export type FractionZone =
  | 'builder'
  | 'recognition'
  | 'comparison'
  | 'fair_sharing'
  | 'boss_arena'
  | 'analytics';

export type FractionSkillId =
  | 'half_recognition' // Nhận biết một nửa (1/2)
  | 'third_recognition' // Nhận biết một phần ba (1/3)
  | 'fourth_recognition' // Nhận biết một phần tư (1/4)
  | 'fifth_recognition' // Nhận biết một phần năm (1/5)
  | 'equal_vs_unequal' // Phân biệt chia đều và chia không đều
  | 'numerator_denominator' // Hiểu khái niệm tử số (phần lấy) và mẫu số (tổng phần)
  | 'visual_comparison' // So sánh phân số trực quan
  | 'fraction_of_a_set' // Phân số của một tập hợp đồ vật
  | 'real_life_sharing'; // Chia phần công bằng trong cuộc sống

export type FractionErrorType =
  | 'NONE'
  | 'UNEQUAL_PARTS_CONFUSION' // Nhầm hình chia không đều là phân số
  | 'NUMERATOR_DENOMINATOR_SWAP' // Đảo ngược tử số và mẫu số
  | 'UNSHADED_COUNT_ERROR' // Đếm số phần chưa tô thay vì số phần đã tô
  | 'DENOMINATOR_AS_REMAINDER' // Coi mẫu số là phần còn lại thay vì tổng số phần
  | 'INVERSE_COMPARISON_ERROR' // So sánh ngược (cho rằng mẫu lớn hơn thì phân số lớn hơn)
  | 'GROUP_SHARING_ERROR'; // Chia sai số lượng trong tập hợp

export interface FractionTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  taskType: 'identify_fraction' | 'identify_equal_parts' | 'shaded_count' | 'total_parts' | 'visual_matching';
  titleVi: string;
  shape: FractionShape;
  totalParts: number;
  shadedParts: number;
  isEqualDivision: boolean;
  questionTextVi: string;
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  targetSkill: FractionSkillId;
}

export interface FractionComparisonTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  titleVi: string;
  shape: FractionShape;
  leftFraction: {
    numerator: number;
    denominator: number;
    label: string;
  };
  rightFraction: {
    numerator: number;
    denominator: number;
    label: string;
  };
  correctSign: '<' | '=' | '>';
  explanationVi: string;
  hintVi: string;
}

export interface FairSharingTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  titleVi: string;
  totalItems: number;
  recipientCount: number;
  fractionLabel: string;
  itemIcon: string;
  itemNameVi: string;
  storyContextVi: string;
  options: number[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
}

export interface FractionBossPhase {
  phaseIndex: number;
  phaseNameVi: string;
  phaseDescVi: string;
  bossHp: number;
  maxHp: number;
  spellTypes: ('partition_unseal' | 'fraction_shield' | 'truth_ray')[];
}

export interface FractionSkillBreakdown {
  halfRecognitionScore: number; // 0 - 100%
  thirdRecognitionScore: number;
  fourthRecognitionScore: number;
  fifthRecognitionScore: number;
  equalVsUnequalScore: number;
  numeratorDenominatorScore: number;
  visualComparisonScore: number;
  fractionOfSetScore: number;
  realLifeSharingScore: number;
}

export interface FractionAttemptRecord {
  id: string;
  taskId: string;
  category: 'builder' | 'recognition' | 'comparison' | 'fair_sharing' | 'boss_arena';
  gradeLevel: 'grade-2' | 'grade-3';
  timestamp: string;
  isSuccess: boolean;
  errorType: FractionErrorType;
  timeSpentSeconds: number;
  details?: string;
}

export interface FractionAchievement {
  id: string;
  nameVi: string;
  descVi: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  progress: number;
}

export interface FractionKingdomProgress {
  campaignId: string;
  builderTasksCompleted: number;
  recognitionTasksCompleted: number;
  comparisonTasksCompleted: number;
  fairSharingCompleted: number;
  bossDefeated: boolean;
  knowledgeCrystalObtained: boolean;
  totalAttempts: number;
  successCount: number;
  accuracyPercentage: number;
  skillBreakdown: FractionSkillBreakdown;
  achievements: FractionAchievement[];
  attemptHistory: FractionAttemptRecord[];
}
