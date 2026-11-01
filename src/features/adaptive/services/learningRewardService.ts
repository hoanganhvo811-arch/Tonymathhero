import type { LearningBadge, CampaignId, QuestionAttemptRecord } from '../../../types';
import { AdaptiveDifficultyEngine } from './adaptiveDifficultyEngine';
import { LearningAnalyticsService } from '../../learning/services/learningAnalyticsService';

const LS_BADGES_PREFIX = 'tmh_learning_badges_';

export const INITIAL_LEARNING_BADGES: LearningBadge[] = [
  {
    id: 'first_perfect_calc',
    title: 'Phát Kiếm Đầu Tiên Chuẩn Xác',
    description: 'Trả lời đúng ngay lần thử đầu tiên trong một trận chiến Toán học',
    icon: '🎯',
    category: 'accuracy',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardExp: 50,
    rewardGold: 25,
  },
  {
    id: 'never_give_up',
    title: 'Ý Chí Hiệp Sĩ Kiên Cường',
    description: 'Tự sửa đúng câu hỏi sau khi đọc kỹ gợi ý của Bé Tiên',
    icon: '🛡️',
    category: 'persistence',
    isUnlocked: false,
    progress: 0,
    maxProgress: 3,
    rewardExp: 75,
    rewardGold: 40,
  },
  {
    id: 'addition_master',
    title: 'Bậc Thầy Phép Cộng',
    description: 'Đạt độ chính xác >= 85% trong chuyên đề phép cộng',
    icon: '➕',
    category: 'mastery',
    isUnlocked: false,
    progress: 0,
    maxProgress: 10,
    rewardExp: 100,
    rewardGold: 50,
  },
  {
    id: 'multiplication_explorer',
    title: 'Nhà Thám Hiểm Cửu Chương',
    description: 'Thành thạo bảng nhân với ít nhất 10 câu trả lời đúng',
    icon: '⚡',
    category: 'mastery',
    isUnlocked: false,
    progress: 0,
    maxProgress: 10,
    rewardExp: 120,
    rewardGold: 60,
  },
  {
    id: 'problem_solver',
    title: 'Chuyên Gia Toán Lời Văn',
    description: 'Giải chính xác 5 bài toán có lời văn phức tạp',
    icon: '📜',
    category: 'growth',
    isUnlocked: false,
    progress: 0,
    maxProgress: 5,
    rewardExp: 150,
    rewardGold: 75,
  },
  {
    id: 'math_champion',
    title: 'Nhà Vô Địch Thử Thách Ngày',
    description: 'Hoàn thành trọn vẹn 10 câu hỏi của Thử Thách Toán Mỗi Ngày',
    icon: '👑',
    category: 'streak',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardExp: 200,
    rewardGold: 100,
  },
];

export class LearningRewardService {
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
   * Get all learning badges for student
   */
  public static async getBadges(studentId: string, campaignId: CampaignId): Promise<LearningBadge[]> {
    const key = `${LS_BADGES_PREFIX}${studentId}_${campaignId}`;
    const raw = this.getLS(key);

    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }

    const initial = [...INITIAL_LEARNING_BADGES];
    this.setLS(key, JSON.stringify(initial));
    return initial;
  }

  /**
   * Save badges
   */
  public static async saveBadges(
    studentId: string,
    campaignId: CampaignId,
    badges: LearningBadge[]
  ): Promise<void> {
    const key = `${LS_BADGES_PREFIX}${studentId}_${campaignId}`;
    this.setLS(key, JSON.stringify(badges));
  }

  /**
   * Evaluate and unlock badges based on attempt and current progress
   */
  public static async evaluateBadges(
    studentId: string,
    campaignId: CampaignId,
    latestAttempt?: QuestionAttemptRecord
  ): Promise<{ badges: LearningBadge[]; newlyUnlocked: LearningBadge[] }> {
    const badges = await this.getBadges(studentId, campaignId);
    const newlyUnlocked: LearningBadge[] = [];

    const attempts = await LearningAnalyticsService.getAttempts(studentId, campaignId);
    const topicStates = await AdaptiveDifficultyEngine.getTopicStates(studentId, campaignId);

    for (const b of badges) {
      if (b.isUnlocked) continue;

      let shouldUnlock = false;

      switch (b.id) {
        case 'first_perfect_calc':
          const perfectCount = attempts.filter((a) => a.firstAttemptResult).length;
          b.progress = Math.min(b.maxProgress, perfectCount);
          if (b.progress >= b.maxProgress) shouldUnlock = true;
          break;

        case 'never_give_up':
          // Answered wrong first, but final result was correct
          const retryCount = attempts.filter((a) => !a.firstAttemptResult && a.finalResult).length;
          b.progress = Math.min(b.maxProgress, retryCount);
          if (b.progress >= b.maxProgress) shouldUnlock = true;
          break;

        case 'addition_master':
          const additionState = Object.values(topicStates).find(
            (s) => s.topicId.includes('addition') && s.masteryLevel === 'MASTERED'
          );
          if (additionState) {
            b.progress = b.maxProgress;
            shouldUnlock = true;
          }
          break;

        case 'multiplication_explorer':
          const multAttempts = attempts.filter(
            (a) => a.topic.includes('multiplication') && a.firstAttemptResult
          ).length;
          b.progress = Math.min(b.maxProgress, multAttempts);
          if (b.progress >= b.maxProgress) shouldUnlock = true;
          break;

        case 'problem_solver':
          const wordProbAttempts = attempts.filter(
            (a) => a.topic.includes('word_problem') && a.firstAttemptResult
          ).length;
          b.progress = Math.min(b.maxProgress, wordProbAttempts);
          if (b.progress >= b.maxProgress) shouldUnlock = true;
          break;
      }

      if (shouldUnlock && !b.isUnlocked) {
        b.isUnlocked = true;
        b.unlockedAt = new Date().toISOString();
        newlyUnlocked.push(b);
      }
    }

    await this.saveBadges(studentId, campaignId, badges);
    return { badges, newlyUnlocked };
  }
}
