import type {
  MoneyErrorType,
  MoneySkillBreakdown,
  MoneyAttemptRecord,
  MoneySkillId,
  MoneyZone,
} from '@/types/moneyShopping';

export interface MoneyDiagnosticResult {
  errorType: MoneyErrorType;
  remediationAdviceVi: string;
  recommendedZone: MoneyZone;
}

export class MoneyAdaptiveEngine {
  /**
   * Chẩn đoán lỗi tư duy tiền tệ, tính nhẩm hóa đơn và quản lý ngân sách
   */
  public static diagnoseError(
    selectedOption: string,
    correctOption: string,
    targetSkill?: MoneySkillId
  ): MoneyDiagnosticResult {
    const sel = selectedOption.trim().toLowerCase();
    const cor = correctOption.trim().toLowerCase();

    // 1. Nhầm lẫn mệnh giá (đặc biệt 2.000đ vs 20.000đ, 1.000đ vs 10.000đ, 10.000đ vs 100.000đ)
    if (
      targetSkill === 'denomination_recognition' ||
      (cor.includes('20.000') && sel.includes('2.000')) ||
      (cor.includes('2.000') && sel.includes('20.000')) ||
      (cor.includes('10.000') && sel.includes('1.000')) ||
      (cor.includes('1.000') && sel.includes('10.000')) ||
      (cor.includes('100.000') && sel.includes('10.000')) ||
      (cor.includes('10.000') && sel.includes('100.000'))
    ) {
      return {
        errorType: 'DENOMINATION_CONFUSION',
        remediationAdviceVi:
          'Tony hãy đếm kỹ số lượng chữ số 0 và nhìn màu sắc/chất liệu của tờ tiền: Tờ polymer (từ 10k trở lên) có cửa sổ trong suốt, tờ cotton (từ 5k trở xuống) làm bằng giấy.',
        recommendedZone: 'recognition',
      };
    }

    // 2. Trừ sai tiền thừa (Change Calculation)
    if (
      targetSkill === 'change_calculation' ||
      sel.includes('tiền thừa') ||
      sel.includes('thối')
    ) {
      return {
        errorType: 'CHANGE_CALCULATION_MISTAKE',
        remediationAdviceVi:
          'Quy tắc tính tiền thối: Tiền trả lại = Tiền khách đưa - Tổng tiền hóa đơn. Hãy thực hiện phép trừ tròn nghìn cẩn thận.',
        recommendedZone: 'interactive_shop',
      };
    }

    // 3. Vượt quá ngân sách (Budget Exceeded)
    if (
      targetSkill === 'budget_management' ||
      sel.includes('vượt ngân sách') ||
      sel.includes('thiếu') ||
      sel.includes('ngân sách')
    ) {
      return {
        errorType: 'BUDGET_EXCEEDED_ERROR',
        remediationAdviceVi:
          'Quy tắc ngân sách: Tổng tiền các món đồ muốn mua không được lớn hơn số tiền mang theo. Nếu Tổng tiền > Ngân sách thì sẽ bị thiếu tiền.',
        recommendedZone: 'budget_challenge',
      };
    }

    // 4. Chọn sai tổ hợp tiền (Wrong combination)
    if (
      targetSkill === 'money_combination' ||
      targetSkill === 'smart_pricing_evaluation' ||
      sel.includes('tờ') ||
      sel.includes('đổi')
    ) {
      return {
        errorType: 'WRONG_COMBINATION',
        remediationAdviceVi:
          'Để ghép đủ số tiền: Hãy bắt đầu từ tờ tiền có mệnh giá lớn nhất có thể, sau đó thêm các tờ tiền nhỏ hơn để vừa khít số tiền cần tìm.',
        recommendedZone: 'counting',
      };
    }

    // 5. Cộng sai tổng giá trị tiền / Đếm sai (Counting Error)
    if (
      targetSkill === 'money_counting' ||
      targetSkill === 'total_cost_calculation' ||
      targetSkill === 'money_comparison'
    ) {
      return {
        errorType: 'COUNTING_CALCULATION_ERROR',
        remediationAdviceVi:
          'Khi đếm hoặc tính tổng hóa đơn: Hãy nhóm các tờ cùng mệnh giá lại trước (ví dụ 3 tờ 2k là 6k), sau đó cộng dồn lại từng bước.',
        recommendedZone: 'counting',
      };
    }

    return {
      errorType: 'NONE',
      remediationAdviceVi:
        'Hãy quan sát kỹ mệnh giá và đọc kỹ yêu cầu bài toán trước khi đưa ra quyết định mua sắm nhé!',
      recommendedZone: 'recognition',
    };
  }

  /**
   * Tính toán điểm năng lực cho 9 kỹ năng tiền tệ & mua sắm
   */
  public static calculateSkillBreakdown(attempts: MoneyAttemptRecord[]): Record<MoneySkillId, MoneySkillBreakdown> {
    const skills: Record<MoneySkillId, { nameVi: string; correct: number; total: number }> = {
      denomination_recognition: { nameVi: 'Nhận biết mệnh giá tiền', correct: 0, total: 0 },
      money_counting: { nameVi: 'Đếm tổng giá trị tiền', correct: 0, total: 0 },
      money_combination: { nameVi: 'Phối hợp đổi mệnh giá', correct: 0, total: 0 },
      money_comparison: { nameVi: 'So sánh các số tiền', correct: 0, total: 0 },
      total_cost_calculation: { nameVi: 'Tính tổng hóa đơn mua hàng', correct: 0, total: 0 },
      change_calculation: { nameVi: 'Tính tiền thừa trả lại', correct: 0, total: 0 },
      budget_management: { nameVi: 'Quản lý ngân sách chi tiêu', correct: 0, total: 0 },
      shopping_word_problem: { nameVi: 'Giải bài toán mua bán thực tế', correct: 0, total: 0 },
      smart_pricing_evaluation: { nameVi: 'Đánh giá tiêu dùng thông thái', correct: 0, total: 0 },
    };

    attempts.forEach((a) => {
      const skill = skills[a.targetSkill];
      if (skill) {
        skill.total++;
        if (a.isSuccess) {
          skill.correct++;
        }
      }
    });

    const result = {} as Record<MoneySkillId, MoneySkillBreakdown>;
    (Object.keys(skills) as MoneySkillId[]).forEach((skillId) => {
      const data = skills[skillId];
      const score = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      let status: 'mastered' | 'learning' | 'struggling' = 'learning';
      if (data.total >= 3 && score >= 80) status = 'mastered';
      else if (data.total >= 2 && score < 50) status = 'struggling';

      result[skillId] = {
        skillId,
        nameVi: data.nameVi,
        score,
        attempts: data.total,
        correct: data.correct,
        status,
      };
    });

    return result;
  }

  /**
   * Đề xuất khu vực học tập trọng tâm dựa trên các kỹ năng còn yếu
   */
  public static getRecommendedFocus(attempts: MoneyAttemptRecord[]): {
    zone: MoneyZone;
    reasonVi: string;
    skillId: MoneySkillId;
  } {
    if (attempts.length === 0) {
      return {
        zone: 'recognition',
        reasonVi: 'Bắt đầu làm quen với các mệnh giá tiền Việt Nam!',
        skillId: 'denomination_recognition',
      };
    }

    const breakdown = this.calculateSkillBreakdown(attempts);
    const struggling = Object.values(breakdown).find((b) => b.status === 'struggling');

    if (struggling) {
      if (struggling.skillId === 'denomination_recognition') {
        return {
          zone: 'recognition',
          reasonVi: 'Tony cần ôn luyện thêm về phân biệt mệnh giá các tờ tiền.',
          skillId: struggling.skillId,
        };
      }
      if (struggling.skillId === 'money_counting' || struggling.skillId === 'money_combination') {
        return {
          zone: 'counting',
          reasonVi: 'Luyện tập đếm và phối hợp các tờ tiền trên bàn tính.',
          skillId: struggling.skillId,
        };
      }
      if (struggling.skillId === 'total_cost_calculation' || struggling.skillId === 'change_calculation') {
        return {
          zone: 'interactive_shop',
          reasonVi: 'Thực hành tính tổng hóa đơn và tiền thừa tại quầy thu ngân.',
          skillId: struggling.skillId,
        };
      }
      if (struggling.skillId === 'budget_management' || struggling.skillId === 'smart_pricing_evaluation') {
        return {
          zone: 'budget_challenge',
          reasonVi: 'Rèn luyện khả năng cân đối chi tiêu không vượt ngân sách.',
          skillId: struggling.skillId,
        };
      }
    }

    // Default advancement
    return {
      zone: 'boss_arena',
      reasonVi: 'Phong độ rất tốt! Tony sẵn sàng thách thức Chúa Tể Gian Thương Malakor.',
      skillId: 'total_cost_calculation',
    };
  }
}
