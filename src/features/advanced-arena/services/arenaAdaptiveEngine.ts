import type {
  ArenaTopicId,
  ArenaDifficulty,
  ArenaQuestion,
  ArenaAttemptRecord,
  ArenaTopicMastery,
  ArenaProgress,
} from '@/types/advancedArena';

export type AdaptiveChallengeMode =
  | 'recommended'
  | 'weakness_training'
  | 'mixed_review'
  | 'master_challenge';

export interface ArenaDiagnosticResult {
  errorType: string;
  remediationAdviceVi: string;
  suggestedTopic: ArenaTopicId;
}

export class ArenaAdaptiveEngine {
  /**
   * Chẩn đoán lỗi tư duy toán học tổng hợp
   */
  public static diagnoseError(
    selectedOption: string,
    correctOption: string,
    question: ArenaQuestion
  ): ArenaDiagnosticResult {
    const sel = selectedOption.trim().toLowerCase();
    const cor = correctOption.trim().toLowerCase();

    // 1. Lỗi bỏ sót bước trong bài toán nhiều bước (Multi-step overlook)
    if (question.questionType === 'multi_step_sequence' || question.steps) {
      return {
        errorType: 'MULTI_STEP_OVERLOOK',
        remediationAdviceVi:
          'Tony chú ý: Đây là bài toán cần từ 2 bước tính trở lên! Hãy đọc kỹ từng câu hỏi nhỏ: sau khi tính xong bước 1, hãy lấy kết quả đó để làm tiếp bước 2.',
        suggestedTopic: question.topicId,
      };
    }

    // 2. Lỗi nhầm lẫn khái niệm hình học / đơn vị đo (Concept confusion)
    if (
      question.topicId === 'geometry_measurement' ||
      sel.includes('cm') ||
      sel.includes('m') ||
      sel.includes('dm') ||
      sel.includes('chu vi') ||
      sel.includes('diện tích')
    ) {
      return {
        errorType: 'CONCEPT_CONFUSION',
        remediationAdviceVi:
          'Phân biệt công thức: Chu vi là độ dài đường bao quanh (cộng các cạnh); Diện tích là bề mặt bên trong (cạnh nhân cạnh hoặc dài nhân rộng). Hãy để ý kỹ đơn vị đo!',
        suggestedTopic: 'geometry_measurement',
      };
    }

    // 3. Lỗi nhầm thời gian hoặc tiền tệ
    if (question.topicId === 'time_calendar' || question.topicId === 'money_shopping') {
      return {
        errorType: 'CONCEPT_CONFUSION',
        remediationAdviceVi:
          'Đối với thời gian: 1 giờ = 60 phút. Đối với tiền tệ: Tiền thừa = Tiền đưa - Tổng tiền hàng. Hãy quan sát kỹ các số 0 và đơn vị.',
        suggestedTopic: question.topicId,
      };
    }

    // 4. Lỗi chọn chiến lược chưa tối ưu
    if (question.questionType === 'strategy_selection') {
      return {
        errorType: 'STRATEGY_SUBOPTIMAL',
        remediationAdviceVi:
          'Một bài toán có thể có nhiều cách giải đúng! Hãy ưu tiên chiến lược giúp đưa về số tròn chục hoặc tận dụng quan hệ nghịch đảo để tính nhẩm nhanh hơn.',
        suggestedTopic: 'mental_math',
      };
    }

    // 5. Lỗi tính toán đơn thuần (Calculation error)
    return {
      errorType: 'CALCULATION_ERROR',
      remediationAdviceVi:
        'Tony hãy kiểm tra lại phép cộng trừ có nhớ hoặc bảng nhân chia. Đặt tính nhẩm từng bước cẩn thận nhé!',
      suggestedTopic: question.topicId,
    };
  }

  /**
   * Tính toán độ thành thạo cho cả 9 chủ đề
   */
  public static calculateTopicMastery(
    attempts: ArenaAttemptRecord[]
  ): Record<ArenaTopicId, ArenaTopicMastery> {
    const topics: Record<ArenaTopicId, { nameVi: string; attempts: number; correct: number }> = {
      arithmetic_place_value: { nameVi: 'Số học & Cấu tạo số', attempts: 0, correct: 0 },
      addition_subtraction: { nameVi: 'Phép cộng & Phép trừ', attempts: 0, correct: 0 },
      multiplication_division: { nameVi: 'Nhân chia & Bảng cửu chương', attempts: 0, correct: 0 },
      mental_math: { nameVi: 'Tính nhẩm & Cảm giác số', attempts: 0, correct: 0 },
      word_problems: { nameVi: 'Bài toán có lời văn', attempts: 0, correct: 0 },
      geometry_measurement: { nameVi: 'Hình học & Đo lường', attempts: 0, correct: 0 },
      time_calendar: { nameVi: 'Thời gian & Lịch', attempts: 0, correct: 0 },
      money_shopping: { nameVi: 'Tiền tệ & Mua sắm', attempts: 0, correct: 0 },
      fractions: { nameVi: 'Phân số cơ bản', attempts: 0, correct: 0 },
    };

    attempts.forEach((a) => {
      const t = topics[a.topicId];
      if (t) {
        t.attempts++;
        if (a.isSuccess) t.correct++;
      }
    });

    const result = {} as Record<ArenaTopicId, ArenaTopicMastery>;
    (Object.keys(topics) as ArenaTopicId[]).forEach((topicId) => {
      const data = topics[topicId];
      const score = data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) : 0;
      let status: 'mastered' | 'learning' | 'struggling' = 'learning';
      if (data.attempts >= 3 && score >= 80) status = 'mastered';
      else if (data.attempts >= 2 && score < 50) status = 'struggling';

      result[topicId] = {
        topicId,
        nameVi: data.nameVi,
        attempts: data.attempts,
        correct: data.correct,
        score,
        status,
      };
    });

    return result;
  }

  /**
   * Lọc và sắp xếp câu hỏi thông minh theo chế độ Adaptive
   */
  public static getAdaptiveQuestionPool(
    campaignId: 'grade-2' | 'grade-3',
    mode: AdaptiveChallengeMode,
    allQuestions: ArenaQuestion[],
    attempts: ArenaAttemptRecord[]
  ): ArenaQuestion[] {
    const gradeQuestions = allQuestions.filter((q) => q.gradeLevel === campaignId);
    if (gradeQuestions.length === 0) return allQuestions;

    const mastery = this.calculateTopicMastery(attempts);

    if (mode === 'weakness_training') {
      const weakTopics = (Object.keys(mastery) as ArenaTopicId[]).filter(
        (tid) => mastery[tid].status === 'struggling' || (mastery[tid].attempts > 0 && mastery[tid].score < 60)
      );
      if (weakTopics.length > 0) {
        const filtered = gradeQuestions.filter((q) => weakTopics.includes(q.topicId));
        if (filtered.length >= 5) return filtered;
      }
    }

    if (mode === 'master_challenge') {
      const hardList = gradeQuestions.filter(
        (q) => q.difficulty === 'challenging' || q.difficulty === 'advanced' || q.questionType === 'multi_step_sequence'
      );
      if (hardList.length >= 5) return hardList;
    }

    if (mode === 'recommended') {
      // Prioritize topics with fewer attempts or struggling
      return [...gradeQuestions].sort((a, b) => {
        const scoreA = mastery[a.topicId]?.score ?? 50;
        const scoreB = mastery[b.topicId]?.score ?? 50;
        return scoreA - scoreB;
      });
    }

    // Default mixed_review: shuffle all questions
    return [...gradeQuestions].sort(() => 0.5 - Math.random());
  }
}
