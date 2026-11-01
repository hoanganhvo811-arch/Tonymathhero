import type {
  CampaignId,
  AdaptiveDifficultyLevel,
  TopicLearningState,
  QuestionAttemptRecord,
  QuestionDifficulty,
} from '../../../types';
import { ADAPTIVE_CONFIG } from '../adaptiveLearningConfig';
import {
  GRADE_2_TOPIC_REGISTRY,
  GRADE_3_TOPIC_REGISTRY,
} from '../../learning/services/learningAnalyticsService';

const LS_ADAPTIVE_PREFIX = 'tmh_adaptive_state_';

export class AdaptiveDifficultyEngine {
  private static getLS(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return null;
  }

  private static setLS(key: string, val: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, val);
      } catch {
        // ignore
      }
    }
  }

  /**
   * Map from adaptive level to QuestionDifficulty format
   */
  public static mapLevelToDifficulty(level: AdaptiveDifficultyLevel): QuestionDifficulty {
    switch (level) {
      case 'LEVEL_1_EASY':
        return 'easy';
      case 'LEVEL_2_NORMAL':
        return 'normal';
      case 'LEVEL_3_CHALLENGING':
        return 'hard';
      case 'LEVEL_4_ADVANCED':
        return 'boss';
    }
  }

  /**
   * Map QuestionDifficulty to AdaptiveDifficultyLevel
   */
  public static mapDifficultyToLevel(difficulty: QuestionDifficulty): AdaptiveDifficultyLevel {
    switch (difficulty) {
      case 'apprentice':
      case 'easy':
        return 'LEVEL_1_EASY';
      case 'warrior':
      case 'normal':
        return 'LEVEL_2_NORMAL';
      case 'champion':
      case 'hard':
        return 'LEVEL_3_CHALLENGING';
      case 'boss':
        return 'LEVEL_4_ADVANCED';
      default:
        return 'LEVEL_2_NORMAL';
    }
  }

  /**
   * Get all topic learning states for a student and campaign
   */
  public static async getTopicStates(
    studentId: string,
    campaignId: CampaignId
  ): Promise<Record<string, TopicLearningState>> {
    const key = `${LS_ADAPTIVE_PREFIX}${studentId}_${campaignId}`;
    const raw = this.getLS(key);
    let states: Record<string, TopicLearningState> = {};

    if (raw) {
      try {
        states = JSON.parse(raw);
      } catch {
        states = {};
      }
    }

    const registry = campaignId === 'grade-2' ? GRADE_2_TOPIC_REGISTRY : GRADE_3_TOPIC_REGISTRY;
    const now = new Date();

    // Ensure all curriculum topics exist in state
    for (const [id, meta] of Object.entries(registry)) {
      if (!states[id]) {
        states[id] = {
          topicId: id,
          topicNameVi: meta.nameVi,
          campaignId,
          currentDifficulty: 'LEVEL_2_NORMAL',
          consecutiveCorrect: 0,
          consecutiveIncorrect: 0,
          recentAttempts: [],
          recentTimeSpent: [],
          averageTimeSeconds: 15,
          masteryLevel: 'NOT_STARTED',
          mistakePatternCounts: {
            calculation_error: 0,
            conceptual_misunderstanding: 0,
            multiplication_table_confusion: 0,
            missing_data_reading: 0,
            operation_selection_error: 0,
            unit_conversion_error: 0,
            time_reading_error: 0,
          },
          lastAttemptDate: '',
          daysSinceLastPractice: 999,
          needsReview: false,
          unlocked: true,
        };
      } else {
        // Calculate days since last practice
        if (states[id].lastAttemptDate) {
          const lastDate = new Date(states[id].lastAttemptDate);
          const diffDays = Math.floor(
            (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          states[id].daysSinceLastPractice = diffDays;
          states[id].needsReview =
            diffDays >= ADAPTIVE_CONFIG.SPACED_REPETITION_DAYS &&
            states[id].recentAttempts.length > 0;
        }
      }
    }

    return states;
  }

  /**
   * Save topic states
   */
  public static async saveTopicStates(
    studentId: string,
    campaignId: CampaignId,
    states: Record<string, TopicLearningState>
  ): Promise<void> {
    const key = `${LS_ADAPTIVE_PREFIX}${studentId}_${campaignId}`;
    this.setLS(key, JSON.stringify(states));
  }

  /**
   * Record attempt and adjust difficulty based on sliding window & fluency
   */
  public static async processAttempt(
    studentId: string,
    campaignId: CampaignId,
    attempt: QuestionAttemptRecord
  ): Promise<{
    previousDifficulty: AdaptiveDifficultyLevel;
    newDifficulty: AdaptiveDifficultyLevel;
    promoted: boolean;
    demoted: boolean;
    fluencyPending: boolean;
  }> {
    const states = await this.getTopicStates(studentId, campaignId);
    const topicId = attempt.topic;

    if (!states[topicId]) {
      const registry = campaignId === 'grade-2' ? GRADE_2_TOPIC_REGISTRY : GRADE_3_TOPIC_REGISTRY;
      const meta = registry[topicId];
      states[topicId] = {
        topicId,
        topicNameVi: meta ? meta.nameVi : attempt.topicNameVi,
        campaignId,
        currentDifficulty: 'LEVEL_2_NORMAL',
        consecutiveCorrect: 0,
        consecutiveIncorrect: 0,
        recentAttempts: [],
        recentTimeSpent: [],
        averageTimeSeconds: 15,
        masteryLevel: 'LEARNING',
        mistakePatternCounts: {
          calculation_error: 0,
          conceptual_misunderstanding: 0,
          multiplication_table_confusion: 0,
          missing_data_reading: 0,
          operation_selection_error: 0,
          unit_conversion_error: 0,
          time_reading_error: 0,
        },
        lastAttemptDate: attempt.timestamp,
        daysSinceLastPractice: 0,
        needsReview: false,
        unlocked: true,
      };
    }

    const state = states[topicId];
    const prevDifficulty = state.currentDifficulty;
    const isCorrect = attempt.firstAttemptResult;
    const timeSpent = attempt.timeSpentSeconds || 15;

    // Update consecutive counters
    if (isCorrect) {
      state.consecutiveCorrect += 1;
      state.consecutiveIncorrect = 0;
    } else {
      state.consecutiveIncorrect += 1;
      state.consecutiveCorrect = 0;
    }

    // Update sliding window (recent attempts)
    state.recentAttempts.push(isCorrect);
    if (state.recentAttempts.length > ADAPTIVE_CONFIG.WINDOW_SIZE) {
      state.recentAttempts.shift();
    }

    state.recentTimeSpent.push(timeSpent);
    if (state.recentTimeSpent.length > ADAPTIVE_CONFIG.WINDOW_SIZE) {
      state.recentTimeSpent.shift();
    }

    // Calculate rolling stats
    const totalRecent = state.recentAttempts.length;
    const correctRecent = state.recentAttempts.filter(Boolean).length;
    const rollingAccuracy = Math.round((correctRecent / totalRecent) * 100);
    const rollingAvgTime = Math.round(
      state.recentTimeSpent.reduce((sum, t) => sum + t, 0) / state.recentTimeSpent.length
    );
    state.averageTimeSeconds = rollingAvgTime;
    state.lastAttemptDate = attempt.timestamp;
    state.daysSinceLastPractice = 0;
    state.needsReview = false;

    // Evaluate promotion / demotion rules
    let promoted = false;
    let demoted = false;
    let fluencyPending = false;

    // PROMOTION RULE:
    // Requires consecutive correct >= 3 AND window accuracy >= 80%
    if (
      state.consecutiveCorrect >= ADAPTIVE_CONFIG.PROMOTION.CONSECUTIVE_CORRECT_REQUIRED &&
      rollingAccuracy >= ADAPTIVE_CONFIG.PROMOTION.ACCURACY_THRESHOLD_PERCENT
    ) {
      // Fluency check: if taking too long, do NOT promote yet; require more practice
      if (rollingAvgTime > ADAPTIVE_CONFIG.FLUENCY_TIME_LIMIT_SECONDS) {
        fluencyPending = true;
      } else {
        if (state.currentDifficulty === 'LEVEL_1_EASY') {
          state.currentDifficulty = 'LEVEL_2_NORMAL';
          promoted = true;
          state.consecutiveCorrect = 0; // reset counter after level change
        } else if (state.currentDifficulty === 'LEVEL_2_NORMAL') {
          state.currentDifficulty = 'LEVEL_3_CHALLENGING';
          promoted = true;
          state.consecutiveCorrect = 0;
        } else if (state.currentDifficulty === 'LEVEL_3_CHALLENGING') {
          state.currentDifficulty = 'LEVEL_4_ADVANCED';
          promoted = true;
          state.consecutiveCorrect = 0;
        }
      }
    }

    // DEMOTION RULE:
    // Requires consecutive mistakes >= 2 OR rolling accuracy < 50% with at least 3 attempts
    if (
      !promoted &&
      (state.consecutiveIncorrect >= ADAPTIVE_CONFIG.DEMOTION.CONSECUTIVE_INCORRECT_REQUIRED ||
        (totalRecent >= 3 && rollingAccuracy < ADAPTIVE_CONFIG.DEMOTION.ACCURACY_THRESHOLD_PERCENT))
    ) {
      if (state.currentDifficulty === 'LEVEL_4_ADVANCED') {
        state.currentDifficulty = 'LEVEL_3_CHALLENGING';
        demoted = true;
        state.consecutiveIncorrect = 0;
      } else if (state.currentDifficulty === 'LEVEL_3_CHALLENGING') {
        state.currentDifficulty = 'LEVEL_2_NORMAL';
        demoted = true;
        state.consecutiveIncorrect = 0;
      } else if (state.currentDifficulty === 'LEVEL_2_NORMAL') {
        state.currentDifficulty = 'LEVEL_1_EASY';
        demoted = true;
        state.consecutiveIncorrect = 0;
      }
    }

    // Update mastery status based on performance
    if (correctRecent >= 5 && rollingAccuracy >= 85 && state.currentDifficulty !== 'LEVEL_1_EASY') {
      state.masteryLevel = 'MASTERED';
    } else if (rollingAccuracy >= 60) {
      state.masteryLevel = 'DEVELOPING';
    } else {
      state.masteryLevel = 'LEARNING';
    }

    await this.saveTopicStates(studentId, campaignId, states);

    return {
      previousDifficulty: prevDifficulty,
      newDifficulty: state.currentDifficulty,
      promoted,
      demoted,
      fluencyPending,
    };
  }

  /**
   * Get Tony's overall weighted adaptive difficulty level across all topics
   */
  public static async getOverallDifficulty(
    studentId: string,
    campaignId: CampaignId
  ): Promise<AdaptiveDifficultyLevel> {
    const states = await this.getTopicStates(studentId, campaignId);
    const list = Object.values(states).filter((s) => s.recentAttempts.length > 0);

    if (list.length === 0) return 'LEVEL_2_NORMAL';

    const levelScores: Record<AdaptiveDifficultyLevel, number> = {
      LEVEL_1_EASY: 1,
      LEVEL_2_NORMAL: 2,
      LEVEL_3_CHALLENGING: 3,
      LEVEL_4_ADVANCED: 4,
    };

    const sum = list.reduce((acc, s) => acc + levelScores[s.currentDifficulty], 0);
    const avg = sum / list.length;

    if (avg < 1.7) return 'LEVEL_1_EASY';
    if (avg < 2.6) return 'LEVEL_2_NORMAL';
    if (avg < 3.5) return 'LEVEL_3_CHALLENGING';
    return 'LEVEL_4_ADVANCED';
  }

  /**
   * Get list of topics needing spaced repetition review
   */
  public static async getTopicsNeedingReview(
    studentId: string,
    campaignId: CampaignId
  ): Promise<TopicLearningState[]> {
    const states = await this.getTopicStates(studentId, campaignId);
    return Object.values(states).filter((s) => s.needsReview);
  }
}
