import type { CampaignGrade, CampaignId } from './campaign';

export type QuestionDifficulty = 'apprentice' | 'warrior' | 'champion' | 'boss' | 'easy' | 'normal' | 'hard';

export type QuestionType =
  | 'multiple_choice'
  | 'fill_in_the_blank'
  | 'compare'
  | 'word_problem'
  | 'geometry'
  | 'measurement'
  | 'clock';

export interface MathQuestion {
  id: string;
  campaignId: CampaignId;
  kingdomId: string;
  grade: CampaignGrade;
  topic: string;
  topicNameVi?: string;
  subtopic: string;
  difficulty: QuestionDifficulty;
  questionType?: QuestionType;
  questionText: string;
  visualPrompt?: string; // Optional visual representation, SVG, clock or ASCII diagram
  options: string[];
  correctOptionIndex: number;
  correctAnswerText?: string;
  hint: string;
  explanation: string;
  stepByStepSolution?: string[];
  expReward: number;
  goldReward: number;
  timeLimitSeconds?: number;
}

export interface MathLearningStats {
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number; // 0 - 100
  streakRecord: number;
  topicMastery: Record<string, { correct: number; total: number; topicNameVi: string }>;
  needsReinforcement: string[]; // List of topics with < 60% accuracy
  lastUpdated: string;
}
