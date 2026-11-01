import type { MathLearningStats, MathQuestion } from '../../types/math';
import type { CampaignId } from '../../types/campaign';
import { LearningAnalyticsService } from '../learning/services/learningAnalyticsService';
import { AdaptiveDifficultyEngine } from '../adaptive/services/adaptiveDifficultyEngine';
import { MistakeAnalysisService } from '../adaptive/services/mistakeAnalysisService';
import { LearningRewardService } from '../adaptive/services/learningRewardService';

const STATS_STORAGE_KEY_PREFIX = 'tony_math_hero_learning_stats_';

export interface AnswerEvaluationResult {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  stepByStepSolution?: string[];
  expBonus: number;
  goldBonus: number;
}

export class MathEngineService {
  /**
   * Evaluate a user's answer (either by option index or direct string)
   */
  public static evaluateAnswer(question: MathQuestion, chosenAnswer: number | string): AnswerEvaluationResult {
    let isCorrect = false;
    let userAnswer = '';
    const correctAnswer = question.options[question.correctOptionIndex] || question.correctAnswerText || '';

    if (typeof chosenAnswer === 'number') {
      isCorrect = chosenAnswer === question.correctOptionIndex;
      userAnswer = question.options[chosenAnswer] || `${chosenAnswer}`;
    } else {
      // Direct string comparison
      const cleanUser = chosenAnswer.trim().toLowerCase();
      const cleanCorrect = (question.correctAnswerText || correctAnswer).trim().toLowerCase();
      isCorrect = cleanUser === cleanCorrect;
      userAnswer = chosenAnswer;
    }

    const expBonus = isCorrect ? question.expReward : Math.floor(question.expReward * 0.2);
    const goldBonus = isCorrect ? question.goldReward : 0;

    return {
      isCorrect,
      userAnswer,
      correctAnswer,
      explanation: question.explanation,
      stepByStepSolution: question.stepByStepSolution,
      expBonus,
      goldBonus,
    };
  }

  /**
   * Record learning result to maintain educational analytics
   */
  public static recordResult(
    playerId: string,
    campaignId: CampaignId,
    question: MathQuestion,
    isCorrect: boolean,
    userAnswer?: string | number,
    timeSpentSeconds?: number,
    numberOfAttempts?: number
  ): MathLearningStats {
    const stats = this.getLearningStats(playerId, campaignId);

    stats.totalAnswered += 1;
    if (isCorrect) {
      stats.correctCount += 1;
    } else {
      stats.incorrectCount += 1;
    }

    stats.accuracyRate = Math.round((stats.correctCount / stats.totalAnswered) * 100);

    // Topic mastery
    const topicKey = question.topic;
    if (!stats.topicMastery[topicKey]) {
      stats.topicMastery[topicKey] = {
        correct: 0,
        total: 0,
        topicNameVi: question.topicNameVi || question.topic,
      };
    }

    stats.topicMastery[topicKey].total += 1;
    if (isCorrect) {
      stats.topicMastery[topicKey].correct += 1;
    }

    // Identify topics needing reinforcement (accuracy < 60% and at least 2 attempts)
    const weakTopics: string[] = [];
    for (const [key, val] of Object.entries(stats.topicMastery)) {
      if (val.total >= 2) {
        const rate = (val.correct / val.total) * 100;
        if (rate < 60) {
          weakTopics.push(key);
        }
      }
    }
    stats.needsReinforcement = weakTopics;
    stats.lastUpdated = new Date().toISOString();

    // Persist to local storage
    if (typeof window !== 'undefined' && window.localStorage) {
      const storageKey = `${STATS_STORAGE_KEY_PREFIX}${playerId}_${campaignId}`;
      localStorage.setItem(storageKey, JSON.stringify(stats));
    }

    // Synchronously / Asynchronously record to Phase 8 Learning Analytics
    const answerDisplay =
      userAnswer !== undefined
        ? `${userAnswer}`
        : isCorrect
        ? question.options[question.correctOptionIndex] || question.correctAnswerText || 'Đúng'
        : 'Chưa chính xác';

    LearningAnalyticsService.recordQuestionAttempt({
      studentId: playerId,
      campaignId,
      questionId: question.id,
      questionText: question.questionText,
      topic: question.topic,
      topicNameVi: question.topicNameVi || question.topic,
      difficulty: question.difficulty,
      questionType: question.questionType || 'multiple_choice',
      firstAnswer: answerDisplay,
      finalAnswer: answerDisplay,
      correctAnswer: question.options[question.correctOptionIndex] || question.correctAnswerText || '',
      options: question.options || [],
      firstAttemptResult: isCorrect && (numberOfAttempts === undefined || numberOfAttempts <= 1),
      finalResult: isCorrect,
      numberOfAttempts: numberOfAttempts || 1,
      timeSpentSeconds: timeSpentSeconds || 15,
      explanation: question.explanation || '',
      stepByStepSolution: question.stepByStepSolution || [],
    })
      .then(async (recorded) => {
        // Module 2: Process Adaptive Difficulty
        await AdaptiveDifficultyEngine.processAttempt(playerId, campaignId, recorded);

        // Module 5: Diagnose & Record Mistake Pattern if wrong
        if (!isCorrect) {
          const diag = MistakeAnalysisService.diagnoseMistake(question, answerDisplay);
          await MistakeAnalysisService.recordMistakeCategory(playerId, campaignId, question.topic, diag.category);
        }

        // Module 9: Evaluate Learning Badges
        await LearningRewardService.evaluateBadges(playerId, campaignId, recorded);
      })
      .catch(() => {});

    return stats;
  }

  /**
   * Load existing learning stats or initialize defaults
   */
  public static getLearningStats(playerId: string, campaignId: CampaignId): MathLearningStats {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storageKey = `${STATS_STORAGE_KEY_PREFIX}${playerId}_${campaignId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback to initial
        }
      }
    }

    return {
      totalAnswered: 0,
      correctCount: 0,
      incorrectCount: 0,
      accuracyRate: 100,
      streakRecord: 0,
      topicMastery: {},
      needsReinforcement: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}
