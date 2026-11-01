import type {
  CampaignId,
  MathQuestion,
  AdaptiveDifficultyLevel,
} from '../../../types';
import { ADAPTIVE_CONFIG } from '../adaptiveLearningConfig';
import { AdaptiveDifficultyEngine } from './adaptiveDifficultyEngine';
import { GRADE_2_TOPICS } from '../../math-engine/data/grade2Curriculum';
import { GRADE_3_TOPICS } from '../../math-engine/data/grade3Curriculum';

export class SmartQuestionSelector {
  // In-memory anti-repetition buffer (per student & campaign)
  private static recentQuestionIdsBuffer: Record<string, string[]> = {};

  /**
   * Helper to get / set buffer
   */
  private static getBuffer(studentId: string, campaignId: CampaignId): string[] {
    const key = `${studentId}_${campaignId}`;
    if (!this.recentQuestionIdsBuffer[key]) {
      this.recentQuestionIdsBuffer[key] = [];
    }
    return this.recentQuestionIdsBuffer[key];
  }

  private static pushToBuffer(studentId: string, campaignId: CampaignId, questionId: string): void {
    const buf = this.getBuffer(studentId, campaignId);
    buf.push(questionId);
    if (buf.length > ADAPTIVE_CONFIG.ANTI_REPETITION_BUFFER_SIZE) {
      buf.shift();
    }
  }

  /**
   * Select the next single tailored question for Tony
   */
  public static async selectNextQuestion(
    studentId: string,
    campaignId: CampaignId,
    options?: {
      kingdomId?: string;
      topicOverride?: string;
      targetDifficulty?: AdaptiveDifficultyLevel;
      isBoss?: boolean;
    }
  ): Promise<MathQuestion> {
    const states = await AdaptiveDifficultyEngine.getTopicStates(studentId, campaignId);
    const curriculum = campaignId === 'grade-2' ? GRADE_2_TOPICS : GRADE_3_TOPICS;
    const availableTopicIds = Object.keys(curriculum);

    let chosenTopicId = options?.topicOverride;

    if (!chosenTopicId) {
      // Apply 50/30/20 Distribution
      const roll = Math.random();

      // 1. Reinforcement (50%): Pick topic with lowest accuracy or recent mistakes
      if (roll < ADAPTIVE_CONFIG.SELECTION_RATIOS.REINFORCEMENT) {
        const reinforcementCandidates = Object.values(states)
          .filter((s) => s.recentAttempts.length > 0 && s.masteryLevel !== 'MASTERED')
          .sort((a, b) => {
            const accA = a.recentAttempts.filter(Boolean).length / Math.max(1, a.recentAttempts.length);
            const accB = b.recentAttempts.filter(Boolean).length / Math.max(1, b.recentAttempts.length);
            return accA - accB;
          });

        if (reinforcementCandidates.length > 0) {
          chosenTopicId = reinforcementCandidates[0].topicId;
        }
      }
      // 2. Spaced Review (20%): Pick topic flagged for spaced review
      else if (roll >= 1 - ADAPTIVE_CONFIG.SELECTION_RATIOS.SPACED_REVIEW) {
        const reviewCandidates = Object.values(states).filter((s) => s.needsReview);
        if (reviewCandidates.length > 0) {
          chosenTopicId = reviewCandidates[Math.floor(Math.random() * reviewCandidates.length)].topicId;
        }
      }

      // 3. Progression (30% or fallback): Pick next developing / not started topic
      if (!chosenTopicId) {
        const progressionCandidates = Object.values(states).filter(
          (s) => s.masteryLevel === 'LEARNING' || s.masteryLevel === 'DEVELOPING' || s.masteryLevel === 'NOT_STARTED'
        );
        if (progressionCandidates.length > 0) {
          chosenTopicId = progressionCandidates[0].topicId;
        } else {
          // All mastered! Pick random from curriculum
          chosenTopicId = availableTopicIds[Math.floor(Math.random() * availableTopicIds.length)];
        }
      }
    }

    // Ensure valid topic
    if (!curriculum[chosenTopicId]) {
      chosenTopicId = availableTopicIds[0];
    }

    // Determine target difficulty level
    const topicState = states[chosenTopicId];
    const targetLevel = options?.targetDifficulty || topicState?.currentDifficulty || 'LEVEL_2_NORMAL';
    const mappedDiff = AdaptiveDifficultyEngine.mapLevelToDifficulty(targetLevel);

    // Generate question with anti-repetition check
    const recentBuffer = this.getBuffer(studentId, campaignId);
    let attempts = 0;
    let selectedQ: MathQuestion;

    do {
      selectedQ = curriculum[chosenTopicId].generate();
      selectedQ.difficulty = options?.isBoss ? 'boss' : mappedDiff;
      selectedQ.campaignId = campaignId;
      if (options?.kingdomId) selectedQ.kingdomId = options.kingdomId;
      attempts++;
    } while (recentBuffer.includes(selectedQ.id) && attempts < 5);

    // Push to buffer
    this.pushToBuffer(studentId, campaignId, selectedQ.id);

    return selectedQ;
  }

  /**
   * Select a batch of questions (e.g. for a custom training session or Daily Challenge)
   */
  public static async selectQuestionBatch(
    studentId: string,
    campaignId: CampaignId,
    count: number,
    options?: { targetDifficulty?: AdaptiveDifficultyLevel }
  ): Promise<MathQuestion[]> {
    const questions: MathQuestion[] = [];
    for (let i = 0; i < count; i++) {
      const q = await this.selectNextQuestion(studentId, campaignId, options);
      questions.push(q);
    }
    return questions;
  }
}
