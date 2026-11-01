import type { AdaptiveDifficultyLevel, MistakeCategory } from '@/types';

export const ADAPTIVE_CONFIG = {
  // Sliding window size of recent attempts evaluated per topic
  WINDOW_SIZE: 6,

  // Thresholds for promotion from Level 1 -> 2 -> 3 -> 4
  PROMOTION: {
    CONSECUTIVE_CORRECT_REQUIRED: 3, // 3 consecutive correct triggers check
    ACCURACY_THRESHOLD_PERCENT: 80,   // >= 80% accuracy in sliding window
    MAX_AVERAGE_TIME_SECONDS: 25,     // Must be within fluency time limit
  },

  // Thresholds for demotion (Level 4 -> 3 -> 2 -> 1)
  DEMOTION: {
    CONSECUTIVE_INCORRECT_REQUIRED: 2, // 2 consecutive mistakes triggers reduction
    ACCURACY_THRESHOLD_PERCENT: 50,    // < 50% accuracy in sliding window
  },

  // Fluency speed limit: answers taking longer than this require more practice before advancing
  FLUENCY_TIME_LIMIT_SECONDS: 30,

  // Spaced Repetition: if topic unpracticed for >= this many days, trigger review
  SPACED_REPETITION_DAYS: 5,

  // Question Selection Distribution
  SELECTION_RATIOS: {
    REINFORCEMENT: 0.5, // 50% Topics needing reinforcement / mistakes
    PROGRESSION: 0.3,   // 30% Next topics or higher difficulty
    SPACED_REVIEW: 0.2, // 20% Spaced review of mastered topics
  },

  // Anti-repetition question buffer size (never ask the exact same question in this window)
  ANTI_REPETITION_BUFFER_SIZE: 8,

  // Daily Challenge Structure
  DAILY_CHALLENGE: {
    WARMUP_COUNT: 3,    // Level 1 Easy
    PRACTICE_COUNT: 5,  // Level 2/3 Tailored to Tony's growth area
    CHALLENGE_COUNT: 2, // Level 3/4 Boss / Hard
    TOTAL_COUNT: 10,
    BASE_EXP_REWARD: 150,
    BASE_GOLD_REWARD: 80,
  },
};

export const MISTAKE_CATEGORY_INFO: Record<
  MistakeCategory,
  {
    nameVi: string;
    descriptionVi: string;
    pedagogicalAdvice: string;
    icon: string;
  }
> = {
  calculation_error: {
    nameVi: 'Tính toán & Cộng trừ nhẩm',
    descriptionVi: 'Nhầm lẫn trong bước tính nhẩm hoặc quên số nhớ hàng chục',
    pedagogicalAdvice: 'Khuyến khích bé tính nhẩm tách số (ví dụ 36 + 27 = 36 + 20 + 7) để kiểm soát kết quả tốt hơn.',
    icon: '🧮',
  },
  conceptual_misunderstanding: {
    nameVi: 'Bản chất phép tính',
    descriptionVi: 'Chưa nắm vững quan hệ giữa các phép toán (nhân là cộng nhiều lần, chia là chia đều)',
    pedagogicalAdvice: 'Dùng hình ảnh nhóm đồ vật trực quan để bé hiểu rõ ý nghĩa thực tế của phép tính.',
    icon: '💡',
  },
  multiplication_table_confusion: {
    nameVi: 'Bảng nhân và bảng chia',
    descriptionVi: 'Nhầm lẫn kết quả các phép nhân hoặc chia nâng cao (6, 7, 8, 9)',
    pedagogicalAdvice: 'Dạy bé đếm bước nhảy nhịp điệu (ví dụ: 7, 14, 21, 28) mỗi ngày 5 phút để ghi nhớ tự nhiên.',
    icon: '⚡',
  },
  missing_data_reading: {
    nameVi: 'Đọc sót dữ kiện bài toán',
    descriptionVi: 'Bỏ qua từ khóa quan trọng hoặc nhầm các con số trong đề bài',
    pedagogicalAdvice: 'Nhắc bé đọc to đề bài 2 lần và gạch chân các số liệu then chốt trước khi chọn phép tính.',
    icon: '🔍',
  },
  operation_selection_error: {
    nameVi: 'Chọn sai phép tính bài toán lời văn',
    descriptionVi: 'Chọn phép cộng thay vì phép trừ, hoặc phép nhân thay vì phép chia',
    pedagogicalAdvice: 'Phân tích từ khóa: "nhiều hơn/tất cả" thường là cộng, "bớt đi/còn lại" là trừ, "gấp lên" là nhân, "giảm đi số lần" là chia.',
    icon: '📝',
  },
  unit_conversion_error: {
    nameVi: 'Đổi đơn vị đo lường',
    descriptionVi: 'Nhầm tỷ lệ chuyển đổi giữa dm, m, cm, kg, g hoặc lít',
    pedagogicalAdvice: 'Vẽ bảng bậc thang đơn vị đo lường để bé nhớ quy tắc thêm hoặc bớt số 0 khi đổi đơn vị.',
    icon: '📏',
  },
  time_reading_error: {
    nameVi: 'Xem đồng hồ & Thời gian',
    descriptionVi: 'Nhầm lẫn giữa kim giờ và kim phút hoặc tính sai khoảng thời gian',
    pedagogicalAdvice: 'Nhắc bé: kim ngắn chỉ giờ, kim dài chỉ phút (mỗi số trên mặt đồng hồ ứng với 5 phút).',
    icon: '⏰',
  },
};
