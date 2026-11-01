import type {
  WordProblem,
  WordProblemAttemptRecord,
  WordProblemErrorType,
  WordProblemSkillBreakdown,
  OperationType,
} from '../../../types/wordProblem';

export class WordProblemAdaptiveEngine {
  /**
   * Diagnose the exact error type from player's submitted steps
   */
  public static diagnoseAttempt(
    problem: WordProblem,
    selectedOperations: OperationType[],
    calculatedValues: number[],
    identifiedGivensCount: number
  ): { isSuccess: boolean; errorType: WordProblemErrorType; feedbackVi: string } {
    // 1. Check if reading comprehension/givens were severely missed
    if (identifiedGivensCount < Math.min(2, problem.givens.length)) {
      return {
        isSuccess: false,
        errorType: 'READING_MISUNDERSTANDING',
        feedbackVi: 'Tony hãy đọc kỹ lại đề bài và chú ý các con số dữ kiện quan trọng trước khi giải nhé!',
      };
    }

    // 2. Check Step 1
    const step1 = problem.steps[0];
    const op1 = selectedOperations[0];
    const val1 = calculatedValues[0];

    if (op1 !== step1.correctOperation) {
      return {
        isSuccess: false,
        errorType: 'OPERATION_MISMATCH',
        feedbackVi: `Ở bước 1, tình huống này là "${step1.subGoal}". Lựa chọn phép tính ${op1} chưa phù hợp với bản chất bài toán. Tony hãy suy nghĩ xem đồ vật đang được gộp lại, bớt đi, lặp lại nhiều lần hay chia đều nhé!`,
      };
    }

    if (val1 !== step1.correctValue) {
      return {
        isSuccess: false,
        errorType: 'CALCULATION_MISTAKE',
        feedbackVi: `Tony đã chọn đúng phép tính (${op1}), nhưng kết quả tính nhẩm chưa chính xác. Hãy tính lại thật cẩn thận nhé!`,
      };
    }

    // 3. If there is Step 2 (two-step problem)
    if (problem.steps.length > 1) {
      const step2 = problem.steps[1];
      const op2 = selectedOperations[1];
      const val2 = calculatedValues[1];

      if (op2 !== step2.correctOperation) {
        return {
          isSuccess: false,
          errorType: 'OPERATION_MISMATCH',
          feedbackVi: `Tony đã làm xuất sắc bước 1! Nhưng ở bước 2 (${step2.subGoal}), phép tính ${op2} chưa đúng với yêu cầu.`,
        };
      }

      if (val2 !== step2.correctValue) {
        return {
          isSuccess: false,
          errorType: 'STEP2_INTEGRATION_ERROR',
          feedbackVi: `Bước 1 đã ra kết quả ${step1.correctValue}. Nhưng khi lấy ${step1.correctValue} kết hợp với dữ kiện tiếp theo thì kết quả bước 2 chưa đúng. Hãy kiểm tra lại phép tính ${step2.formulaDisplay}.`,
        };
      }
    }

    // All steps passed!
    return {
      isSuccess: true,
      errorType: 'NONE',
      feedbackVi: 'Tuyệt vời! Tony đã giải quyết bài toán hoàn hảo từng bước một!',
    };
  }

  /**
   * Compute comprehensive skill breakdown (0-100%) from attempt records
   */
  public static calculateSkillBreakdown(
    attempts: WordProblemAttemptRecord[]
  ): WordProblemSkillBreakdown {
    if (attempts.length === 0) {
      return {
        readingComprehensionScore: 100,
        givenIdentificationScore: 100,
        questionIdentificationScore: 100,
        operationSelectionScore: 100,
        calculationAccuracyScore: 100,
        twoStepReasoningScore: 100,
      };
    }

    const total = attempts.length;
    let readingErrors = 0;
    let operationErrors = 0;
    let calcErrors = 0;
    let step2Errors = 0;

    for (const a of attempts) {
      if (a.errorType === 'READING_MISUNDERSTANDING') readingErrors++;
      else if (a.errorType === 'OPERATION_MISMATCH') operationErrors++;
      else if (a.errorType === 'CALCULATION_MISTAKE') calcErrors++;
      else if (a.errorType === 'STEP2_INTEGRATION_ERROR') step2Errors++;
    }

    const readingScore = Math.max(0, Math.round(((total - readingErrors) / total) * 100));
    const operationScore = Math.max(0, Math.round(((total - operationErrors) / total) * 100));
    const calcScore = Math.max(0, Math.round(((total - calcErrors) / total) * 100));
    const step2Score = Math.max(0, Math.round(((total - step2Errors) / total) * 100));

    return {
      readingComprehensionScore: readingScore,
      givenIdentificationScore: readingScore,
      questionIdentificationScore: readingScore,
      operationSelectionScore: operationScore,
      calculationAccuracyScore: calcScore,
      twoStepReasoningScore: step2Score,
    };
  }

  /**
   * Suggest next target problem based on diagnosed weaknesses
   */
  public static selectAdaptiveProblem(
    catalog: WordProblem[],
    solvedIds: string[],
    attempts: WordProblemAttemptRecord[],
    grade: 'grade-2' | 'grade-3'
  ): WordProblem {
    const applicable = catalog.filter((p) => grade === 'grade-3' || p.gradeLevel === 'grade-2' || p.gradeLevel === 'both');
    const unsolved = applicable.filter((p) => !solvedIds.includes(p.id));

    // If there are unsolved problems, pick from them
    if (unsolved.length > 0) {
      return unsolved[0];
    }

    // Otherwise, find a problem that had mistakes
    const mistakeProblemIds = Array.from(new Set(attempts.filter((a) => !a.isSuccess).map((a) => a.problemId)));
    const retryProblem = applicable.find((p) => mistakeProblemIds.includes(p.id));
    if (retryProblem) return retryProblem;

    return applicable[Math.floor(Math.random() * applicable.length)];
  }
}
