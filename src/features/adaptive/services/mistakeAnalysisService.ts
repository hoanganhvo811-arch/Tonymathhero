import type { MathQuestion, MistakeCategory, SmartHint, CampaignId } from '../../../types';
import { MISTAKE_CATEGORY_INFO } from '../adaptiveLearningConfig';
import { AdaptiveDifficultyEngine } from './adaptiveDifficultyEngine';

export class MistakeAnalysisService {
  /**
   * Automatically diagnose error category based on question context, student's answer, and correct answer
   */
  public static diagnoseMistake(
    question: MathQuestion,
    chosenAnswer: string | number
  ): { category: MistakeCategory; categoryVi: string; advice: string } {
    const topic = question.topic.toLowerCase();
    const qText = question.questionText.toLowerCase();
    const correctVal = question.options[question.correctOptionIndex] || question.correctAnswerText || '';
    const userVal = typeof chosenAnswer === 'number' ? question.options[chosenAnswer] || `${chosenAnswer}` : chosenAnswer;

    let category: MistakeCategory = 'calculation_error';

    // 1. Word Problem Operation Selection
    if (topic.includes('word_problem') || qText.includes('hỏi') || qText.includes('có tất cả') || qText.includes('còn lại')) {
      if (qText.includes('nhiều hơn') || qText.includes('ít hơn') || qText.includes('còn lại') || qText.includes('gấp')) {
        category = 'operation_selection_error';
      } else {
        category = 'missing_data_reading';
      }
    }
    // 2. Multiplication / Division Tables
    else if (topic.includes('multiplication') || topic.includes('division') || qText.includes('x') || qText.includes('×') || qText.includes(':') || qText.includes('chia')) {
      category = 'multiplication_table_confusion';
    }
    // 3. Measurements & Units
    else if (topic.includes('measur') || qText.includes('cm') || qText.includes('dm') || qText.includes('kg') || qText.includes('lít') || qText.includes('km') || qText.includes('g') || qText.includes('ml')) {
      category = 'unit_conversion_error';
    }
    // 4. Time Reading
    else if (topic.includes('time') || topic.includes('clock') || qText.includes('giờ') || qText.includes('phút') || qText.includes('đồng hồ') || qText.includes('ngày')) {
      category = 'time_reading_error';
    }
    // 5. Geometry concepts
    else if (topic.includes('geo') || qText.includes('chu vi') || qText.includes('diện tích') || qText.includes('đoạn thẳng')) {
      category = 'conceptual_misunderstanding';
    }
    // 6. Arithmetic Calculation
    else {
      // Check if off by 10 (likely regrouping error)
      const numUser = parseInt(userVal, 10);
      const numCorrect = parseInt(correctVal, 10);
      if (!isNaN(numUser) && !isNaN(numCorrect) && Math.abs(numUser - numCorrect) === 10) {
        category = 'calculation_error';
      } else {
        category = 'calculation_error';
      }
    }

    const info = MISTAKE_CATEGORY_INFO[category];

    return {
      category,
      categoryVi: info.nameVi,
      advice: info.pedagogicalAdvice,
    };
  }

  /**
   * Generate Progressive 3-Tier Hints:
   * Tier 1: Nudge (hướng suy nghĩ, không lộ kết quả)
   * Tier 2: Guidance (chia nhỏ bước làm)
   * Tier 3: Full Explanation + Analogous Example (lời giải chi tiết + ví dụ tương tự)
   */
  public static generate3TierHint(
    question: MathQuestion,
    diagnosedCategory?: MistakeCategory
  ): SmartHint {
    const qText = question.questionText;
    const category = diagnosedCategory || this.diagnoseMistake(question, '').category;

    // Default basic hints from question
    let tier1 = question.hint || 'Hãy đọc kỹ đề bài và xác định đại lượng cần tìm.';
    let tier2 = '';
    let tier3 = question.explanation || '';
    let analogous = '';

    // Specialized tailoring based on category
    switch (category) {
      case 'calculation_error':
        tier1 = '💡 Thử tách số lớn thành hàng chục tròn trịa và hàng đơn vị để tính nhẩm dễ hơn nhé!';
        tier2 = '🔢 Bước 1: Tính nhẩm với phần chục trước. Bước 2: Cộng hoặc trừ tiếp phần đơn vị và nhớ cộng số nhớ (nếu có).';
        tier3 = question.explanation;
        analogous = '⭐ Ví dụ tương tự: 28 + 15 = (28 + 10) + 5 = 38 + 5 = 43.';
        break;

      case 'multiplication_table_confusion':
        tier1 = '⚡ Nhớ lại bước nhảy của bảng cửu chương này. Hãy đếm từ mốc gần nhất mà bé nhớ!';
        tier2 = '🔢 Nếu chưa nhớ ngay, hãy lấy mốc nhân 5 (ví dụ: 7 x 5 = 35) rồi cộng hoặc trừ thêm số đơn vị tương ứng.';
        tier3 = question.explanation;
        analogous = '⭐ Ví dụ tương tự: 7 x 6 = (7 x 5) + 7 = 35 + 7 = 42.';
        break;

      case 'operation_selection_error':
        tier1 = '📝 Hãy chú ý từ khóa trong câu hỏi: đề bài đang hỏi "còn lại", "tất cả", hay "gấp lên bao nhiêu lần"?';
        tier2 = '🔢 Bước 1: Xác định bài toán cho gì và hỏi gì. Bước 2: Nếu tìm phần còn lại ta làm phép trừ; nếu gộp lại ta làm phép cộng.';
        tier3 = question.explanation;
        analogous = '⭐ Ví dụ tương tự: Có 25 quả cam, đem bán 10 quả -> Còn lại: 25 - 10 = 15 quả.';
        break;

      case 'unit_conversion_error':
        tier1 = '📏 Chú ý đơn vị đo lường! Các số liệu đã cùng một đơn vị đo chưa?';
        tier2 = '🔢 Bước 1: Đổi các số liệu về cùng đơn vị (1m = 10dm = 100cm; 1kg = 1000g). Bước 2: Thực hiện phép tính.';
        tier3 = question.explanation;
        analogous = '⭐ Ví dụ tương tự: 1m + 20cm = 100cm + 20cm = 120cm.';
        break;

      case 'time_reading_error':
        tier1 = '⏰ Kim ngắn chỉ giờ, kim dài chỉ phút. Hãy quan sát kim ngắn đang ở qua số mấy!';
        tier2 = '🔢 Đếm số phút bằng cách nhân số trên mặt đồng hồ với 5 (ví dụ: kim dài chỉ số 3 là 15 phút, số 6 là 30 phút).';
        tier3 = question.explanation;
        analogous = '⭐ Ví dụ tương tự: Kim ngắn ở giữa số 2 và 3, kim dài chỉ số 6 -> 2 giờ 30 phút (hoặc 2 giờ rưỡi).';
        break;

      case 'missing_data_reading':
      case 'conceptual_misunderstanding':
      default:
        tier1 = question.hint || 'Hãy phân tích từng đại lượng và liên hệ với các bài học trước đó.';
        tier2 =
          question.stepByStepSolution && question.stepByStepSolution.length > 0
            ? `Các bước gợi ý: ${question.stepByStepSolution[0]}`
            : 'Chia nhỏ bài toán thành 2 bước tính trung gian.';
        tier3 = question.explanation;
        analogous = '⭐ Hãy bình tĩnh đọc lại từng câu, gạch chân dữ liệu đã cho và câu hỏi chính.';
        break;
    }

    return {
      tier1Nudge: tier1,
      tier2Guidance: tier2 || (question.stepByStepSolution ? question.stepByStepSolution.join(' ➔ ') : tier1),
      tier3Explanation: tier3,
      analogousExample: analogous,
    };
  }

  /**
   * Record a mistake into Tony's adaptive topic state
   */
  public static async recordMistakeCategory(
    studentId: string,
    campaignId: CampaignId,
    topicId: string,
    category: MistakeCategory
  ): Promise<void> {
    const states = await AdaptiveDifficultyEngine.getTopicStates(studentId, campaignId);
    if (states[topicId]) {
      states[topicId].mistakePatternCounts[category] =
        (states[topicId].mistakePatternCounts[category] || 0) + 1;
      await AdaptiveDifficultyEngine.saveTopicStates(studentId, campaignId, states);
    }
  }

  /**
   * Get mistake statistics & patterns for student
   */
  public static async getMistakeInsights(
    studentId: string,
    campaignId: CampaignId
  ): Promise<
    {
      category: MistakeCategory;
      count: number;
      nameVi: string;
      descriptionVi: string;
      advice: string;
      icon: string;
    }[]
  > {
    const states = await AdaptiveDifficultyEngine.getTopicStates(studentId, campaignId);
    const totals: Record<MistakeCategory, number> = {
      calculation_error: 0,
      conceptual_misunderstanding: 0,
      multiplication_table_confusion: 0,
      missing_data_reading: 0,
      operation_selection_error: 0,
      unit_conversion_error: 0,
      time_reading_error: 0,
    };

    for (const state of Object.values(states)) {
      for (const [cat, cnt] of Object.entries(state.mistakePatternCounts)) {
        totals[cat as MistakeCategory] += cnt;
      }
    }

    return Object.entries(totals)
      .map(([cat, count]) => {
        const info = MISTAKE_CATEGORY_INFO[cat as MistakeCategory];
        return {
          category: cat as MistakeCategory,
          count,
          nameVi: info.nameVi,
          descriptionVi: info.descriptionVi,
          advice: info.pedagogicalAdvice,
          icon: info.icon,
        };
      })
      .sort((a, b) => b.count - a.count);
  }
}
