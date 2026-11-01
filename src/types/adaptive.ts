import type { CampaignId } from './campaign';
import type { QuestionDifficulty, MathQuestion } from './math';
import type { MasteryLevel } from './learning';

export type AdaptiveDifficultyLevel = 'LEVEL_1_EASY' | 'LEVEL_2_NORMAL' | 'LEVEL_3_CHALLENGING' | 'LEVEL_4_ADVANCED';

export type MistakeCategory =
  | 'calculation_error'
  | 'conceptual_misunderstanding'
  | 'multiplication_table_confusion'
  | 'missing_data_reading'
  | 'operation_selection_error'
  | 'unit_conversion_error'
  | 'time_reading_error';

export interface SmartHint {
  tier1Nudge: string;
  tier2Guidance: string;
  tier3Explanation: string;
  analogousExample?: string;
  visualAid?: string;
}

export interface TopicLearningState {
  topicId: string;
  topicNameVi: string;
  campaignId: CampaignId;
  currentDifficulty: AdaptiveDifficultyLevel;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  recentAttempts: boolean[]; // Sliding window (last 5-10 attempts)
  recentTimeSpent: number[]; // Seconds spent
  averageTimeSeconds: number;
  masteryLevel: MasteryLevel;
  mistakePatternCounts: Record<MistakeCategory, number>;
  lastAttemptDate: string;
  daysSinceLastPractice: number;
  needsReview: boolean;
  unlocked: boolean;
}

export interface LearningPathNode {
  topicId: string;
  topicNameVi: string;
  descriptionVi: string;
  prerequisites: string[]; // Topic IDs that must be completed or developing
  recommendedDifficulty: AdaptiveDifficultyLevel;
  orderIndex: number;
  category: 'arithmetic' | 'geometry' | 'measurement' | 'word_problem' | 'logic';
  status: MasteryLevel;
  accuracy: number;
  completedQuestionsCount: number;
}

export interface DailyMathChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  campaignId: CampaignId;
  warmupQuestions: MathQuestion[]; // 3 questions (Level 1)
  practiceQuestions: MathQuestion[]; // 5 questions (Level 2/3 tailored to needs)
  challengeQuestions: MathQuestion[]; // 2 questions (Level 3/4)
  completedQuestionIds: string[];
  isCompleted: boolean;
  score: number;
  totalQuestions: number;
  rewards: {
    exp: number;
    gold: number;
    knowledgeShardVi: string;
    isClaimed: boolean;
  };
}

export interface LearningBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'accuracy' | 'persistence' | 'mastery' | 'streak' | 'growth';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  rewardExp: number;
  rewardGold: number;
}
