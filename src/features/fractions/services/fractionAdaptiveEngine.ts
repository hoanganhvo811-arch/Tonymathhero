import type {
  FractionTask,
  FractionErrorType,
  FractionSkillBreakdown,
  FractionAttemptRecord,
  FractionSkillId,
} from '@/types/fractions';

export interface FractionDiagnosticResult {
  errorType: FractionErrorType;
  remediationAdviceVi: string;
  recommendedZone: 'builder' | 'recognition' | 'comparison' | 'fair_sharing';
}

export class FractionAdaptiveEngine {
  /**
   * Chẩn đoán lỗi tư duy phân số của người chơi
   */
  public static diagnoseError(
    task: FractionTask | { taskType?: string; options?: string[]; targetSkill?: FractionSkillId },
    selectedOption: string,
    correctOption: string
  ): FractionDiagnosticResult {
    const sel = selectedOption.trim().toLowerCase();
    const cor = correctOption.trim().toLowerCase();

    // 1. Nhầm lẫn chia đều và không đều
    if (
      task.targetSkill === 'equal_vs_unequal' ||
      sel.includes('có, vì có') ||
      sel.includes('kích thước thế nào')
    ) {
      return {
        errorType: 'UNEQUAL_PARTS_CONFUSION',
        remediationAdviceVi:
          'Tony hãy nhớ: Bản chất cốt lõi của phân số là tổng thể PHẢI ĐƯỢC CHIA THÀNH CÁC PHẦN BẰNG NHAU. Các phần to nhỏ khác nhau không biểu diễn phân số.',
        recommendedZone: 'builder',
      };
    }

    // 2. Đảo ngược tử số và mẫu số (vd: chọn 4/1 thay vì 1/4, 4/3 thay vì 3/4)
    if (
      (cor.includes('1/2') && sel.includes('2/1')) ||
      (cor.includes('1/3') && sel.includes('3/1')) ||
      (cor.includes('1/4') && sel.includes('4/1')) ||
      (cor.includes('1/5') && sel.includes('5/1')) ||
      (cor.includes('3/4') && sel.includes('4/3')) ||
      (cor.includes('2/5') && sel.includes('5/2'))
    ) {
      return {
        errorType: 'NUMERATOR_DENOMINATOR_SWAP',
        remediationAdviceVi:
          'Tony đang đảo ngược vị trí! Tử số (ở trên) là số phần lấy đi, Mẫu số (ở dưới) là tổng tất cả các phần bằng nhau.',
        recommendedZone: 'builder',
      };
    }

    // 3. So sánh nghịch đảo sai (nghĩ 1/4 > 1/2 vì 4 > 2)
    if (sel.includes('4 > 2') || (sel.includes('>') && cor.includes('<'))) {
      return {
        errorType: 'INVERSE_COMPARISON_ERROR',
        remediationAdviceVi:
          'Quy tắc đặc biệt của phân số: Cùng một chiếc bánh, nếu chia làm càng nhiều phần thì mỗi phần lại CÀNG BÉ! Vì vậy 1/2 (nửa cái bánh) lớn hơn 1/4.',
        recommendedZone: 'comparison',
      };
    }

    // 4. Nhầm phần đã tô với phần chưa tô
    if (
      (cor.includes('3/4') && sel.includes('1/4')) ||
      (cor.includes('4/6') && sel.includes('2/6')) ||
      (cor.includes('2/5') && sel.includes('3/5'))
    ) {
      return {
        errorType: 'UNSHADED_COUNT_ERROR',
        remediationAdviceVi:
          'Tony hãy chú ý câu hỏi: Đề bài yêu cầu đếm số phần ĐÃ TÔ MÀU hay số phần CHƯA TÔ MÀU nhé!',
        recommendedZone: 'recognition',
      };
    }

    // Mặc định
    return {
      errorType: 'NONE',
      remediationAdviceVi:
        'Hãy quan sát kỹ hình vẽ, đếm tổng số phần bằng nhau ở mẫu số và đếm số phần được chọn ở tử số.',
      recommendedZone: 'recognition',
    };
  }

  /**
   * Tính toán điểm năng lực cho 9 kỹ năng phân số
   */
  public static calculateSkillBreakdown(attempts: FractionAttemptRecord[]): FractionSkillBreakdown {
    const scores: Record<FractionSkillId, { correct: number; total: number }> = {
      half_recognition: { correct: 0, total: 0 },
      third_recognition: { correct: 0, total: 0 },
      fourth_recognition: { correct: 0, total: 0 },
      fifth_recognition: { correct: 0, total: 0 },
      equal_vs_unequal: { correct: 0, total: 0 },
      numerator_denominator: { correct: 0, total: 0 },
      visual_comparison: { correct: 0, total: 0 },
      fraction_of_a_set: { correct: 0, total: 0 },
      real_life_sharing: { correct: 0, total: 0 },
    };

    attempts.forEach((a) => {
      // Map category/task to skill
      if (a.category === 'comparison') {
        scores.visual_comparison.total++;
        if (a.isSuccess) scores.visual_comparison.correct++;
      } else if (a.category === 'fair_sharing') {
        scores.real_life_sharing.total++;
        if (a.isSuccess) scores.real_life_sharing.correct++;
      } else if (a.category === 'builder') {
        scores.equal_vs_unequal.total++;
        if (a.isSuccess) scores.equal_vs_unequal.correct++;
      } else {
        // recognition / arena
        if (a.taskId.includes('half')) {
          scores.half_recognition.total++;
          if (a.isSuccess) scores.half_recognition.correct++;
        } else if (a.taskId.includes('third')) {
          scores.third_recognition.total++;
          if (a.isSuccess) scores.third_recognition.correct++;
        } else if (a.taskId.includes('fourth')) {
          scores.fourth_recognition.total++;
          if (a.isSuccess) scores.fourth_recognition.correct++;
        } else if (a.taskId.includes('fifth')) {
          scores.fifth_recognition.total++;
          if (a.isSuccess) scores.fifth_recognition.correct++;
        } else if (a.taskId.includes('equal')) {
          scores.equal_vs_unequal.total++;
          if (a.isSuccess) scores.equal_vs_unequal.correct++;
        } else if (a.taskId.includes('set') || a.taskId.includes('group')) {
          scores.fraction_of_a_set.total++;
          if (a.isSuccess) scores.fraction_of_a_set.correct++;
        } else {
          scores.numerator_denominator.total++;
          if (a.isSuccess) scores.numerator_denominator.correct++;
        }
      }
    });

    const calc = (s: { correct: number; total: number }, fallback = 85) =>
      s.total === 0 ? fallback : Math.round((s.correct / s.total) * 100);

    return {
      halfRecognitionScore: calc(scores.half_recognition, 90),
      thirdRecognitionScore: calc(scores.third_recognition, 85),
      fourthRecognitionScore: calc(scores.fourth_recognition, 85),
      fifthRecognitionScore: calc(scores.fifth_recognition, 80),
      equalVsUnequalScore: calc(scores.equal_vs_unequal, 85),
      numeratorDenominatorScore: calc(scores.numerator_denominator, 80),
      visualComparisonScore: calc(scores.visual_comparison, 75),
      fractionOfSetScore: calc(scores.fraction_of_a_set, 80),
      realLifeSharingScore: calc(scores.real_life_sharing, 85),
    };
  }

  /**
   * Đề xuất bài học tiếp theo dựa trên năng lực thực tế
   */
  public static getRecommendedFocus(skills: FractionSkillBreakdown): {
    skillNameVi: string;
    targetZone: 'builder' | 'recognition' | 'comparison' | 'fair_sharing';
    adviceVi: string;
  } {
    if (skills.equalVsUnequalScore < 75) {
      return {
        skillNameVi: 'Phân Biệt Chia Đều',
        targetZone: 'builder',
        adviceVi: 'Tony cần củng cố khái niệm các phần bằng nhau trước khi thực hành các phép chia phức tạp.',
      };
    }
    if (skills.visualComparisonScore < 75) {
      return {
        skillNameVi: 'So Sánh Phân Số Trực Quan',
        targetZone: 'comparison',
        adviceVi: 'Tony hãy vào Đấu Trường So Sánh để trực tiếp quan sát kích thước của 1/2 so với 1/4.',
      };
    }
    if (skills.numeratorDenominatorScore < 75) {
      return {
        skillNameVi: 'Tử Số và Mẫu Số',
        targetZone: 'recognition',
        adviceVi: 'Luyện tập đếm số phần tô màu (tử số) và tổng số phần bằng nhau (mẫu số).',
      };
    }
    return {
      skillNameVi: 'Chia Phần Công Bằng Trong Cuộc Sống',
      targetZone: 'fair_sharing',
      adviceVi: 'Tony đã nắm rất tốt! Hãy tiếp tục chia sẻ tài nguyên cùng dân làng và chuẩn bị quyết đấu Boss!',
    };
  }
}
