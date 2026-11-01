import type { CampaignId } from './campaign';
import type { QuestionDifficulty } from './math';

export type MasteryLevel = 'NOT_STARTED' | 'LEARNING' | 'DEVELOPING' | 'MASTERED';

export interface StudentPreferences {
  soundEnabled?: boolean;
  autoReadExplanation?: boolean;
  preferredSessionMinutes?: number;
}

export interface StudentProfile {
  id: string;
  displayName: string;
  avatar: string;
  grade: CampaignId;
  createdAt: string;
  lastActive: string;
  preferences?: StudentPreferences;
}

export interface QuestionAttemptRecord {
  attemptId: string;
  studentId: string;
  campaignId: CampaignId;
  questionId: string;
  questionText: string;
  topic: string;
  topicNameVi: string;
  difficulty: QuestionDifficulty;
  questionType: string;
  firstAnswer: string | number;
  finalAnswer: string | number;
  correctAnswer: string;
  options: string[];
  firstAttemptResult: boolean;
  finalResult: boolean;
  numberOfAttempts: number;
  timeSpentSeconds: number;
  explanation: string;
  stepByStepSolution?: string[];
  timestamp: string; // ISO string
  battleId?: string;
}

export interface TopicAnalyticsData {
  topicId: string;
  topicNameVi: string;
  campaignId: CampaignId;
  totalQuestions: number; // unique questions attempted
  firstAttemptCorrect: number;
  firstAttemptIncorrect: number;
  firstAttemptAccuracy: number; // percentage 0 - 100
  finalAccuracy: number; // percentage 0 - 100
  averageTimeSeconds: number;
  masteryLevel: MasteryLevel;
  completedDifficulties: QuestionDifficulty[];
  trend: 'improving' | 'stable' | 'needs_practice';
  lastAttemptDate?: string;
}

export interface DailyActivityPoint {
  date: string; // YYYY-MM-DD
  questionsCount: number;
  correctCount: number;
  accuracy: number;
}

export interface LearningDashboardSummary {
  studentId: string;
  studentName: string;
  campaignId: CampaignId;
  totalQuestions: number;
  firstAttemptCorrect: number;
  firstAttemptIncorrect: number;
  firstAttemptAccuracy: number;
  finalAccuracy: number;
  totalLearningTimeMinutes: number;
  topicsPracticed: number;
  totalTopics: number;
  topicsMastered: number;
  learningStreakDays: number;
  completedQuestsCount: number;
  kingdomsRestoredCount: number;
  strengths: TopicAnalyticsData[];
  needsPractice: TopicAnalyticsData[];
  topicBreakdown: Record<string, TopicAnalyticsData>;
  dailyActivity: DailyActivityPoint[];
}

export interface HistoryFilterOptions {
  campaignId?: CampaignId;
  topic?: string;
  difficulty?: QuestionDifficulty | 'all';
  result?: 'all' | 'correct' | 'incorrect';
  timeRange?: '7_days' | '30_days' | 'all';
  searchQuery?: string;
}

export interface RecommendedPracticeItem {
  topicId: string;
  topicNameVi: string;
  campaignId: CampaignId;
  reason: string;
  currentAccuracy: number;
  recommendedDifficulty: QuestionDifficulty;
  suggestedQuestionsCount: number;
}
