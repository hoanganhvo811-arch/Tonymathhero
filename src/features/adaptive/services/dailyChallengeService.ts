import type { DailyMathChallenge, CampaignId } from '../../../types';
import { ADAPTIVE_CONFIG } from '../adaptiveLearningConfig';
import { SmartQuestionSelector } from './smartQuestionSelector';
import { AdaptiveDifficultyEngine } from './adaptiveDifficultyEngine';
import { useProgressStore } from '../../../game/state/useProgressStore';

const LS_DAILY_PREFIX = 'tmh_daily_challenge_';

export class DailyChallengeService {
  private static getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

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
   * Get or generate today's Daily Math Challenge
   */
  public static async getTodayChallenge(
    studentId: string,
    campaignId: CampaignId
  ): Promise<DailyMathChallenge> {
    const today = this.getTodayDateString();
    const key = `${LS_DAILY_PREFIX}${studentId}_${campaignId}_${today}`;
    const raw = this.getLS(key);

    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // regenerate if invalid
      }
    }

    // Generate new Daily Challenge with 3 Warm-up, 5 Practice, 2 Challenge
    const warmupQuestions = await SmartQuestionSelector.selectQuestionBatch(
      studentId,
      campaignId,
      ADAPTIVE_CONFIG.DAILY_CHALLENGE.WARMUP_COUNT,
      { targetDifficulty: 'LEVEL_1_EASY' }
    );

    const practiceQuestions = await SmartQuestionSelector.selectQuestionBatch(
      studentId,
      campaignId,
      ADAPTIVE_CONFIG.DAILY_CHALLENGE.PRACTICE_COUNT,
      { targetDifficulty: 'LEVEL_2_NORMAL' }
    );

    const challengeQuestions = await SmartQuestionSelector.selectQuestionBatch(
      studentId,
      campaignId,
      ADAPTIVE_CONFIG.DAILY_CHALLENGE.CHALLENGE_COUNT,
      { targetDifficulty: 'LEVEL_3_CHALLENGING' }
    );

    const challenge: DailyMathChallenge = {
      id: `daily_${today}_${studentId}_${campaignId}`,
      date: today,
      studentId,
      campaignId,
      warmupQuestions,
      practiceQuestions,
      challengeQuestions,
      completedQuestionIds: [],
      isCompleted: false,
      score: 0,
      totalQuestions: ADAPTIVE_CONFIG.DAILY_CHALLENGE.TOTAL_COUNT,
      rewards: {
        exp: ADAPTIVE_CONFIG.DAILY_CHALLENGE.BASE_EXP_REWARD,
        gold: ADAPTIVE_CONFIG.DAILY_CHALLENGE.BASE_GOLD_REWARD,
        knowledgeShardVi: 'Mảnh Tinh Thể Tri Thức Nhật Thường',
        isClaimed: false,
      },
    };

    this.setLS(key, JSON.stringify(challenge));
    return challenge;
  }

  /**
   * Record answer for Daily Challenge
   */
  public static async recordChallengeAnswer(
    studentId: string,
    campaignId: CampaignId,
    questionId: string,
    isCorrect: boolean
  ): Promise<{ challenge: DailyMathChallenge; justCompleted: boolean }> {
    const challenge = await this.getTodayChallenge(studentId, campaignId);
    let justCompleted = false;

    if (!challenge.completedQuestionIds.includes(questionId)) {
      challenge.completedQuestionIds.push(questionId);
      if (isCorrect) {
        challenge.score += 1;
      }

      if (challenge.completedQuestionIds.length >= challenge.totalQuestions && !challenge.isCompleted) {
        challenge.isCompleted = true;
        justCompleted = true;

        // Automatically credit rewards into Progress Store
        try {
          const progressStore = useProgressStore.getState();
          progressStore.addExp(challenge.rewards.exp);
          progressStore.addGold(challenge.rewards.gold);
          challenge.rewards.isClaimed = true;
        } catch {
          // ignore in tests
        }
      }

      const key = `${LS_DAILY_PREFIX}${studentId}_${campaignId}_${challenge.date}`;
      this.setLS(key, JSON.stringify(challenge));
    }

    return { challenge, justCompleted };
  }
}
