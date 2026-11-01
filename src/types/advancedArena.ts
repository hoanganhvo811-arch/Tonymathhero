export type ArenaZone =
  | 'mixed_challenge'
  | 'multi_step'
  | 'strategy'
  | 'marathon'
  | 'tower'
  | 'grand_boss'
  | 'analytics';

export type ArenaTopicId =
  | 'arithmetic_place_value' // Số học & Cấu tạo số
  | 'addition_subtraction' // Cộng, trừ & Quan hệ nghịch đảo
  | 'multiplication_division' // Nhân, chia & Bảng cửu chương
  | 'mental_math' // Tính nhẩm & Cảm giác số
  | 'word_problems' // Bài toán có lời văn
  | 'geometry_measurement' // Hình học & Đo lường
  | 'time_calendar' // Thời gian & Lịch
  | 'money_shopping' // Tiền tệ & Mua sắm
  | 'fractions'; // Phân số cơ bản

export type ArenaDifficulty = 'easy' | 'normal' | 'challenging' | 'advanced';

export type ArenaQuestionType =
  | 'multiple_choice'
  | 'multi_step_sequence'
  | 'strategy_selection'
  | 'fill_in';

export interface ArenaQuestionStep {
  stepIndex: number;
  promptVi: string;
  expectedResult: string;
  explanationVi: string;
}

export interface ArenaAlternativeStrategy {
  strategyNameVi: string;
  descriptionVi: string;
  stepsSummaryVi: string;
}

export interface ArenaQuestion {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  topicId: ArenaTopicId;
  subSkillVi: string;
  difficulty: ArenaDifficulty;
  questionType: ArenaQuestionType;
  titleVi: string;
  promptVi: string;
  storyContextVi?: string;
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  steps?: ArenaQuestionStep[];
  alternativeStrategies?: ArenaAlternativeStrategy[];
}

export interface TowerFloorConfig {
  floorNumber: number;
  nameVi: string;
  themeVi: string;
  descriptionVi: string;
  requiredQuestions: number;
  difficulty: ArenaDifficulty;
  focusTopics: ArenaTopicId[];
  rewardXp: number;
  rewardGold: number;
  badgeIcon: string;
}

export interface MarathonCheckpoint {
  checkpointIndex: number;
  questionThreshold: number;
  rewardGold: number;
  rewardXp: number;
  titleVi: string;
}

export interface GrandBossPhase {
  phaseIndex: number;
  phaseNameVi: string;
  bossNameVi: string;
  maxHp: number;
  themeVi: string;
  focusTopicsVi: string;
  descriptionVi: string;
}

export interface GrandBossSpellQuestion {
  id: string;
  phaseIndex: number;
  gradeLevel: 'grade-2' | 'grade-3';
  spellNameVi: string;
  bossDialogueVi: string;
  challengeTextVi: string;
  options: string[];
  correctIndex: number;
  explanationVi: string;
  damage: number;
  topicId: ArenaTopicId;
}

export interface ArenaAchievement {
  id: string;
  titleVi: string;
  descriptionVi: string;
  icon: string;
  goldReward: number;
  xpReward: number;
}

export interface ArenaAttemptRecord {
  id: string;
  questionId: string;
  topicId: ArenaTopicId;
  difficulty: ArenaDifficulty;
  isSuccess: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  timeTakenSeconds?: number;
  errorType?: string;
  timestamp: number;
}

export interface ArenaTopicMastery {
  topicId: ArenaTopicId;
  nameVi: string;
  attempts: number;
  correct: number;
  score: number;
  status: 'mastered' | 'learning' | 'struggling';
}

export interface ArenaProgress {
  completedChallengesCount: number;
  highestTowerFloorCleared: number;
  marathonHighCheckpoint: number;
  marathonMaxStreak: number;
  bossDefeatedPhases: number[];
  unlockedAchievements: string[];
  topicMasteryMap: Record<ArenaTopicId, { attempts: number; correct: number }>;
}
