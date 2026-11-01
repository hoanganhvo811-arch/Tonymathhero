import type {
  GeometryAttemptRecord,
  GeometryErrorType,
  GeometrySkillBreakdown,
} from '../../../types/geometryMeasurement';
import { GEOMETRY_PUZZLES_CATALOG, type GeometryPuzzle } from '../data/geometryPuzzlesCatalog';

export class GeometryAdaptiveEngine {
  /**
   * Diagnose measurement ruler attempt
   */
  public static diagnoseRulerAttempt(
    targetLengthCm: number,
    startOffsetCm: number,
    measuredValueCm: number
  ): { isSuccess: boolean; errorType: GeometryErrorType; feedbackVi: string } {
    // Check if user aligned to 0
    if (startOffsetCm !== 0 && measuredValueCm === targetLengthCm + startOffsetCm) {
      return {
        isSuccess: false,
        errorType: 'RULER_ALIGNMENT_ERROR',
        feedbackVi: `Tony lưu ý: Đầu vật phẩm đang đặt ở vạch ${startOffsetCm} cm chứ không phải vạch 0! Để đo chính xác, hãy lấy vạch cuối trừ đi vạch đầu (${measuredValueCm} - ${startOffsetCm} = ${targetLengthCm} cm), hoặc dịch chuyển thước để vạch 0 trùng với đầu vật nhé!`,
      };
    }

    if (Math.abs(measuredValueCm - targetLengthCm) > 0.1) {
      return {
        isSuccess: false,
        errorType: 'RULER_READING_ERROR',
        feedbackVi: `Kết quả đo ${measuredValueCm} cm chưa chính xác. Độ dài thực tế của vật là ${targetLengthCm} cm. Hãy nhìn kỹ vạch chia trên thước nhé!`,
      };
    }

    return {
      isSuccess: true,
      errorType: 'NONE',
      feedbackVi: 'Tuyệt vời! Tony đã đặt thước chuẩn từ vạch 0 và đọc độ dài chính xác!',
    };
  }

  /**
   * Diagnose balance scale attempt
   */
  public static diagnoseScaleAttempt(
    targetWeightGrams: number,
    placedWeightsGrams: number
  ): { isSuccess: boolean; errorType: GeometryErrorType; feedbackVi: string } {
    if (placedWeightsGrams !== targetWeightGrams) {
      return {
        isSuccess: false,
        errorType: 'SCALE_UNBALANCED',
        feedbackVi: `Cân chưa thăng bằng! Khối lượng quả cân hiện tại là ${placedWeightsGrams} g, trong khi vật nặng ${targetWeightGrams} g. Hãy thêm hoặc bớt quả cân để kim chỉ chính giữa nhé!`,
      };
    }

    return {
      isSuccess: true,
      errorType: 'NONE',
      feedbackVi: 'Xuất sắc! Hai đĩa cân đã thăng bằng hoàn hảo!',
    };
  }

  /**
   * Diagnose beaker volume attempt
   */
  public static diagnoseBeakerAttempt(
    targetVolumeMl: number,
    currentVolumeMl: number
  ): { isSuccess: boolean; errorType: GeometryErrorType; feedbackVi: string } {
    if (currentVolumeMl !== targetVolumeMl) {
      return {
        isSuccess: false,
        errorType: 'BEAKER_OVERFLOW_OR_UNDER',
        feedbackVi: `Mực chất lỏng đang ở mức ${currentVolumeMl} ml, mục tiêu là ${targetVolumeMl} ml. Hãy đong cẩn thận từng ca nhé!`,
      };
    }

    return {
      isSuccess: true,
      errorType: 'NONE',
      feedbackVi: 'Chính xác! Lượng dung dịch đã đạt đúng vạch chia mục tiêu!',
    };
  }

  /**
   * Diagnose clock reading attempt
   */
  public static diagnoseClockAttempt(
    targetHour: number,
    targetMinute: number,
    inputHour: number,
    inputMinute: number
  ): { isSuccess: boolean; errorType: GeometryErrorType; feedbackVi: string } {
    // Check if user confused hour and minute hands
    if (inputHour === targetMinute && inputMinute === targetHour) {
      return {
        isSuccess: false,
        errorType: 'CLOCK_HAND_CONFUSION',
        feedbackVi: 'Tony đã nhầm lẫn giữa kim giờ và kim phút rồi! Hãy nhớ: Kim NGẮN chỉ GIỜ, còn Kim DÀI chỉ PHÚT.',
      };
    }

    if (inputHour !== targetHour || inputMinute !== targetMinute) {
      return {
        isSuccess: false,
        errorType: 'CLOCK_READING_ERROR',
        feedbackVi: `Thời gian chưa đúng. Đồng hồ đang chỉ ${targetHour} giờ ${targetMinute.toString().padStart(2, '0')} phút.`,
      };
    }

    return {
      isSuccess: true,
      errorType: 'NONE',
      feedbackVi: 'Rất giỏi! Tony đã đọc và chỉnh đồng hồ hoàn toàn chính xác!',
    };
  }

  /**
   * Calculate complete skill breakdown (0-100%)
   */
  public static calculateSkillBreakdown(
    attempts: GeometryAttemptRecord[]
  ): GeometrySkillBreakdown {
    if (attempts.length === 0) {
      return {
        shapeRecognitionScore: 100,
        shapePropertiesScore: 100,
        spatialOrientationScore: 100,
        lengthMeasurementScore: 100,
        massMeasurementScore: 100,
        capacityMeasurementScore: 100,
        timeReadingScore: 100,
        wordProblemReasoningScore: 100,
      };
    }

    const calcCategoryScore = (filterFn: (a: GeometryAttemptRecord) => boolean) => {
      const subset = attempts.filter(filterFn);
      if (subset.length === 0) return 100;
      const successes = subset.filter((a) => a.isSuccess).length;
      return Math.round((successes / subset.length) * 100);
    };

    return {
      shapeRecognitionScore: calcCategoryScore(
        (a) => a.category === 'shape' || a.errorType === 'WRONG_SHAPE_IDENTIFIED'
      ),
      shapePropertiesScore: calcCategoryScore(
        (a) => a.errorType === 'WRONG_PROPERTY_COUNT' || (a.category === 'puzzle' && a.taskId.includes('property'))
      ),
      spatialOrientationScore: calcCategoryScore(
        (a) => a.category === 'spatial' || a.errorType === 'SPATIAL_DIRECTION_MISMATCH'
      ),
      lengthMeasurementScore: calcCategoryScore(
        (a) => a.errorType === 'RULER_ALIGNMENT_ERROR' || a.errorType === 'RULER_READING_ERROR' || a.taskId.includes('ruler')
      ),
      massMeasurementScore: calcCategoryScore(
        (a) => a.errorType === 'SCALE_UNBALANCED' || a.taskId.includes('scale')
      ),
      capacityMeasurementScore: calcCategoryScore(
        (a) => a.errorType === 'BEAKER_OVERFLOW_OR_UNDER' || a.taskId.includes('beaker')
      ),
      timeReadingScore: calcCategoryScore(
        (a) => a.errorType === 'CLOCK_HAND_CONFUSION' || a.errorType === 'CLOCK_READING_ERROR' || a.taskId.includes('clock')
      ),
      wordProblemReasoningScore: calcCategoryScore(
        (a) => a.category === 'puzzle'
      ),
    };
  }

  /**
   * Recommend next puzzle or task for Tony
   */
  public static selectAdaptivePuzzle(
    catalog: GeometryPuzzle[],
    solvedPuzzleIds: string[],
    grade: 'grade-2' | 'grade-3'
  ): GeometryPuzzle {
    const gradePuzzles = catalog.filter((p) => p.gradeLevel === grade);
    const unsolved = gradePuzzles.filter((p) => !solvedPuzzleIds.includes(p.id));

    if (unsolved.length > 0) {
      return unsolved[0];
    }

    return gradePuzzles[Math.floor(Math.random() * gradePuzzles.length)];
  }
}
