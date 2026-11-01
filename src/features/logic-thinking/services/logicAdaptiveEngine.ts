import {
  LogicSkillId,
  LogicErrorType,
  LogicAttemptRecord,
  LogicSkillBreakdown,
} from '../../../types';

export const LOGIC_SKILL_META: Record<LogicSkillId, { nameVi: string; descriptionVi: string; icon: string }> = {
  pattern_recognition: {
    nameVi: 'Nhận Diện Quy Luật',
    descriptionVi: 'Phát hiện quy luật dãy số tăng giảm, chuỗi hình học và phần tử khác biệt.',
    icon: '🔮',
  },
  number_logic: {
    nameVi: 'Logic Số Học & Ma Trận',
    descriptionVi: 'Giải ma trận số, tam giác toán học và giải bài toán cân thăng bằng.',
    icon: '⚖️',
  },
  shape_logic: {
    nameVi: 'Logic Hình Học Không Gian',
    descriptionVi: 'Nhận diện hình khối, phép xoay hình 90°/180° và tìm mảnh ghép còn thiếu.',
    icon: '🧩',
  },
  spatial_reasoning: {
    nameVi: 'Tư Duy Mê Cung & Không Gian',
    descriptionVi: 'Định hướng lộ trình di chuyển, thu thập chìa khóa và thoát mê cung.',
    icon: '🧭',
  },
  deductive_reasoning: {
    nameVi: 'Tư Duy Suy Luận Thám Tử',
    descriptionVi: 'Tổng hợp dữ kiện, phân tích quan hệ logic để tìm ra đáp án chính xác.',
    icon: '🔍',
  },
  elimination_strategy: {
    nameVi: 'Chiến Lược Loại Trừ',
    descriptionVi: 'Gạt bỏ các phương án sai từng bước để chỉ còn lại kết quả đúng duy nhất.',
    icon: '✂️',
  },
  multi_step_problem_solving: {
    nameVi: 'Giải Quyết Vấn Đề Đa Bước',
    descriptionVi: 'Phối hợp nhiều phép tính, manh mối mã số và chiến thuật tổng hợp.',
    icon: '🎯',
  },
};

export class LogicAdaptiveEngine {
  /**
   * Chẩn đoán lỗi tư duy dựa trên thể loại và câu trả lời được chọn
   */
  public static diagnoseError(
    category: LogicAttemptRecord['category'],
    targetSkill: LogicSkillId,
    selectedAnswer: string,
    correctAnswer: string
  ): LogicErrorType {
    if (selectedAnswer === correctAnswer) {
      return 'NONE';
    }

    // Kiểm tra nhầm thứ tự đảo số (ví dụ chọn 74 thay vì 47)
    if (
      selectedAnswer.length > 1 &&
      correctAnswer.length > 1 &&
      selectedAnswer.split('').reverse().join('') === correctAnswer
    ) {
      return 'ORDER_CONFUSION';
    }

    if (category === 'pattern') {
      return 'PATTERN_MISINTERPRETATION';
    }

    if (category === 'maze' || category === 'shape_logic') {
      return 'SPATIAL_ORIENTATION_ERROR';
    }

    if (category === 'deductive') {
      return 'PREMISE_OVERLOOKED';
    }

    if (category === 'number_code') {
      return 'INVALID_DEDUCTION';
    }

    return 'INVALID_DEDUCTION';
  }

  /**
   * Tính toán báo cáo chi tiết năng lực 7 kỹ năng tư duy
   */
  public static computeSkillBreakdowns(records: LogicAttemptRecord[]): LogicSkillBreakdown[] {
    const skills: LogicSkillId[] = [
      'pattern_recognition',
      'number_logic',
      'shape_logic',
      'spatial_reasoning',
      'deductive_reasoning',
      'elimination_strategy',
      'multi_step_problem_solving',
    ];

    return skills.map((skillId) => {
      const skillRecords = records.filter((r) => r.targetSkill === skillId);
      const attempts = skillRecords.length;
      const correct = skillRecords.filter((r) => r.isSuccess).length;

      let score = 0;
      let status: 'mastered' | 'learning' | 'struggling' = 'learning';

      if (attempts === 0) {
        score = 0;
        status = 'learning';
      } else {
        score = Math.round((correct / attempts) * 100);
        if (score >= 80 && attempts >= 2) {
          status = 'mastered';
        } else if (score < 50 && attempts >= 2) {
          status = 'struggling';
        } else {
          status = 'learning';
        }
      }

      return {
        skillId,
        nameVi: LOGIC_SKILL_META[skillId].nameVi,
        score,
        attempts,
        correct,
        status,
      };
    });
  }

  /**
   * Đưa ra lời khuyên cá nhân hóa cho Tony
   */
  public static generateAdvice(breakdowns: LogicSkillBreakdown[]): string[] {
    const advice: string[] = [];
    const struggling = breakdowns.filter((b) => b.status === 'struggling');
    const mastered = breakdowns.filter((b) => b.status === 'mastered');

    if (struggling.length > 0) {
      struggling.forEach((s) => {
        if (s.skillId === 'pattern_recognition') {
          advice.push('Tony hãy lấy nháp viết ra hiệu số giữa hai số liền nhau để tìm khoảng tăng/giảm quy luật nhé!');
        } else if (s.skillId === 'spatial_reasoning' || s.skillId === 'shape_logic') {
          advice.push('Khi xoay hình, Tony hãy tưởng tượng chiếc kim đồng hồ quay từ vị trí 12h sang 3h (90 độ) hoặc 6h (180 độ)!');
        } else if (s.skillId === 'deductive_reasoning' || s.skillId === 'elimination_strategy') {
          advice.push('Với các vụ án thám tử, Tony hãy gạch bỏ những bạn hoặc chiếc rương không thỏa mãn điều kiện trước!');
        } else {
          advice.push(`Hãy luyện thêm về "${s.nameVi}" để củng cố tư duy vững chắc hơn!`);
        }
      });
    }

    if (mastered.length > 0) {
      advice.push(`Tuyệt vời! Tony đã làm chủ rất tốt kỹ năng: ${mastered.map((m) => m.nameVi).join(', ')}.`);
    }

    if (advice.length === 0) {
      advice.push('Tony đang khởi đầu rất tốt! Hãy thử thách với các câu đố ở các phân khu Trí Tuệ nhé!');
    }

    return advice;
  }
}
