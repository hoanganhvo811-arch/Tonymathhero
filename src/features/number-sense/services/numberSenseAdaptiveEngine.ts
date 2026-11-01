import type {
  NumberSenseAttemptRecord,
  NumberSenseErrorType,
  NumberSenseSkillBreakdown,
  PlaceValueBlockCount,
} from '../../../types/numberSense';
import { NUMBER_SENSE_PUZZLES_CATALOG, type NumberSensePuzzle } from '../data/numberSensePuzzlesCatalog';

export class NumberSenseAdaptiveEngine {
  /**
   * Diagnose place value block builder attempt
   */
  public static diagnosePlaceValueAttempt(
    expected: PlaceValueBlockCount,
    submitted: PlaceValueBlockCount
  ): { isSuccess: boolean; errorType: NumberSenseErrorType; feedbackVi: string } {
    const isSuccess =
      expected.thousands === submitted.thousands &&
      expected.hundreds === submitted.hundreds &&
      expected.tens === submitted.tens &&
      expected.ones === submitted.ones;

    if (isSuccess) {
      return {
        isSuccess: true,
        errorType: 'NONE',
        feedbackVi: 'Chính xác hoàn hảo! Tony đã phân tích đúng từng giá trị hàng của con số!',
      };
    }

    // Check if user swapped tens and hundreds
    if (expected.hundreds === submitted.tens && expected.tens === submitted.hundreds) {
      return {
        isSuccess: false,
        errorType: 'PLACE_VALUE_MISUNDERSTANDING',
        feedbackVi: 'Tony đã nhầm lẫn giữa hàng chục và hàng trăm rồi! Hãy chú ý: Khối vuông phẳng lớn là HÀNG TRĂM, còn thanh dài là HÀNG CHỤC nhé!',
      };
    }

    return {
      isSuccess: false,
      errorType: 'PLACE_VALUE_MISUNDERSTANDING',
      feedbackVi: `Số khối chưa khớp với số mục tiêu. Hãy kiểm tra lại số lượng khối ở từng hàng: nghìn (${expected.thousands}), trăm (${expected.hundreds}), chục (${expected.tens}), đơn vị (${expected.ones}).`,
    };
  }

  /**
   * Diagnose mental strategy practice attempt
   */
  public static diagnoseStrategyAttempt(
    correctAnswer: number,
    submittedAnswer: number,
    strategyType: string
  ): { isSuccess: boolean; errorType: NumberSenseErrorType; feedbackVi: string } {
    if (submittedAnswer === correctAnswer) {
      return {
        isSuccess: true,
        errorType: 'NONE',
        feedbackVi: 'Xuất sắc! Tony đã áp dụng chiến lược tính nhẩm rất thông minh và chính xác!',
      };
    }

    if (strategyType === 'compensation' && Math.abs(submittedAnswer - correctAnswer) <= 2) {
      return {
        isSuccess: false,
        errorType: 'ROUNDING_COMPENSATION_ERROR',
        feedbackVi: 'Tony gần đúng rồi! Khi làm tròn số trừ lên hàng tròn chục, hãy chú ý bước cộng bù lại đơn vị đã trừ bớt lố nhé!',
      };
    }

    if (strategyType === 'make_ten') {
      return {
        isSuccess: false,
        errorType: 'DECOMPOSITION_ERROR',
        feedbackVi: 'Hãy nhớ bước tách số: tách số nhỏ thành phần bù tạo số tròn chục trước, rồi cộng phần còn lại.',
      };
    }

    return {
      isSuccess: false,
      errorType: 'ARITHMETIC_CALCULATION_MISTAKE',
      feedbackVi: `Kết quả tính nhẩm ${submittedAnswer} chưa chính xác. Đáp án đúng là ${correctAnswer}. Hãy nhẩm lại từng bước nhé!`,
    };
  }

  /**
   * Diagnose pattern sequence attempt
   */
  public static diagnosePatternAttempt(
    correctAnswer: number,
    submittedAnswer: number,
    stepRuleVi: string
  ): { isSuccess: boolean; errorType: NumberSenseErrorType; feedbackVi: string } {
    if (submittedAnswer === correctAnswer) {
      return {
        isSuccess: true,
        errorType: 'NONE',
        feedbackVi: 'Rất nhạy bén! Tony đã nhận diện đúng quy luật biến thiên của dãy số!',
      };
    }

    return {
      isSuccess: false,
      errorType: 'PATTERN_RULE_MISUNDERSTANDING',
      feedbackVi: `Chưa đúng rồi Tony! Quy luật của dãy số này là: "${stepRuleVi}". Hãy nhìn vào bước nhảy giữa các số liền kề nhé!`,
    };
  }

  /**
   * Calculate all 10 core number sense competencies (0-100%)
   */
  public static calculateSkillBreakdown(
    attempts: NumberSenseAttemptRecord[]
  ): NumberSenseSkillBreakdown {
    if (attempts.length === 0) {
      return {
        numberRecognitionScore: 100,
        placeValueScore: 100,
        numberComparisonScore: 100,
        numberCompositionScore: 100,
        numberDecompositionScore: 100,
        numberRelationshipsScore: 100,
        mentalAdditionScore: 100,
        mentalSubtractionScore: 100,
        mentalMultiplicationScore: 100,
        numberPatternsScore: 100,
      };
    }

    const calcSubsetScore = (filterFn: (a: NumberSenseAttemptRecord) => boolean) => {
      const subset = attempts.filter(filterFn);
      if (subset.length === 0) return 100;
      const successes = subset.filter((a) => a.isSuccess).length;
      return Math.round((successes / subset.length) * 100);
    };

    return {
      numberRecognitionScore: calcSubsetScore(
        (a) => a.category === 'puzzle' || a.category === 'place_value'
      ),
      placeValueScore: calcSubsetScore(
        (a) => a.category === 'place_value' || a.errorType === 'PLACE_VALUE_MISUNDERSTANDING'
      ),
      numberComparisonScore: calcSubsetScore(
        (a) => a.taskId.includes('compare') || a.taskId.includes('largest') || a.taskId.includes('smallest')
      ),
      numberCompositionScore: calcSubsetScore(
        (a) => a.category === 'place_value' || a.taskId.includes('compose')
      ),
      numberDecompositionScore: calcSubsetScore(
        (a) => a.errorType === 'DECOMPOSITION_ERROR' || a.taskId.includes('decomp')
      ),
      numberRelationshipsScore: calcSubsetScore(
        (a) => a.taskId.includes('predecessor') || a.taskId.includes('successor') || a.taskId.includes('pair')
      ),
      mentalAdditionScore: calcSubsetScore(
        (a) => a.strategyUsed === 'make_ten' || a.taskId.includes('add')
      ),
      mentalSubtractionScore: calcSubsetScore(
        (a) => a.strategyUsed === 'compensation' || a.taskId.includes('sub')
      ),
      mentalMultiplicationScore: calcSubsetScore(
        (a) => a.strategyUsed === 'distributive_mult' || a.taskId.includes('mult') || a.taskId.includes('div')
      ),
      numberPatternsScore: calcSubsetScore(
        (a) => a.category === 'pattern' || a.errorType === 'PATTERN_RULE_MISUNDERSTANDING'
      ),
    };
  }

  /**
   * Select next adaptive puzzle
   */
  public static selectAdaptivePuzzle(
    catalog: NumberSensePuzzle[],
    solvedPuzzleIds: string[],
    grade: 'grade-2' | 'grade-3'
  ): NumberSensePuzzle {
    const gradePuzzles = catalog.filter((p) => p.gradeLevel === grade);
    const unsolved = gradePuzzles.filter((p) => !solvedPuzzleIds.includes(p.id));

    if (unsolved.length > 0) {
      return unsolved[0];
    }

    return gradePuzzles[Math.floor(Math.random() * gradePuzzles.length)];
  }
}
