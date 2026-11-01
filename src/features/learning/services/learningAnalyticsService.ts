import type {
  CampaignId,
  MasteryLevel,
  StudentProfile,
  QuestionAttemptRecord,
  TopicAnalyticsData,
  DailyActivityPoint,
  LearningDashboardSummary,
  HistoryFilterOptions,
  RecommendedPracticeItem,
  QuestionDifficulty,
} from '@/types';
import { getDatabase } from '@/services/storage/indexedDbClient';

const LS_STUDENTS_KEY = 'tmh_student_profiles';
const LS_ACTIVE_STUDENT_KEY = 'tmh_active_student_id';
const LS_ATTEMPTS_PREFIX = 'tmh_attempts_';

export interface CurriculumTopicMeta {
  id: string;
  nameVi: string;
  category: 'arithmetic' | 'geometry' | 'measurement' | 'word_problem' | 'logic';
  grade: CampaignId;
  descriptionVi: string;
  adviceForParents: string;
}

export const GRADE_2_TOPIC_REGISTRY: Record<string, CurriculumTopicMeta> = {
  addition_with_regrouping_100: {
    id: 'addition_with_regrouping_100',
    nameVi: 'Phép cộng có nhớ trong phạm vi 100',
    category: 'arithmetic',
    grade: 'grade-2',
    descriptionVi: 'Cộng hai số có hai chữ số, có nhớ sang hàng chục',
    adviceForParents: 'Khuyến khích bé ghi nhớ quy tắc: cộng hàng đơn vị trước, nếu >= 10 thì nhớ 1 sang hàng chục.',
  },
  subtraction_with_regrouping_100: {
    id: 'subtraction_with_regrouping_100',
    nameVi: 'Phép trừ có nhớ trong phạm vi 100',
    category: 'arithmetic',
    grade: 'grade-2',
    descriptionVi: 'Trừ hai số có hai chữ số, có mượn từ hàng chục',
    adviceForParents: 'Cho bé thực hành mượn 1 chục (10 đơn vị) khi chữ số hàng đơn vị ở số bị trừ nhỏ hơn số trừ.',
  },
  multiplication_table_2_5: {
    id: 'multiplication_table_2_5',
    nameVi: 'Bảng nhân 2 và nhân 5',
    category: 'arithmetic',
    grade: 'grade-2',
    descriptionVi: 'Ghi nhớ và vận dụng bảng nhân 2 và 5 vào tính toán',
    adviceForParents: 'Dạy bé đếm nhảy: 2, 4, 6, 8, 10 hoặc 5, 10, 15, 20 để thuộc bảng cửu chương tự nhiên.',
  },
  division_table_2_5: {
    id: 'division_table_2_5',
    nameVi: 'Bảng chia 2 và chia 5',
    category: 'arithmetic',
    grade: 'grade-2',
    descriptionVi: 'Phép chia tương ứng với bảng nhân 2 và bảng nhân 5',
    adviceForParents: 'Giúp bé nhận diện quan hệ nghịch đảo giữa phép nhân và phép chia (ví dụ 5 x 4 = 20 nên 20 : 5 = 4).',
  },
  measurements_g2: {
    id: 'measurements_g2',
    nameVi: 'Đại lượng đo lường (dm, m, km, kg, l)',
    category: 'measurement',
    grade: 'grade-2',
    descriptionVi: 'Nhận biết, đổi đơn vị và so sánh các đại lượng thực tế',
    adviceForParents: 'Liên hệ thực tế bằng thước kẻ, cân hoa quả trong bếp hoặc bình nước 1 lít để bé dễ hình dung.',
  },
  geometry_g2: {
    id: 'geometry_g2',
    nameVi: 'Hình học & Đoạn thẳng (Gấp khúc, Tam giác, Tứ giác)',
    category: 'geometry',
    grade: 'grade-2',
    descriptionVi: 'Nhận diện hình học, tính độ dài đường gấp khúc',
    adviceForParents: 'Khuyên bé cộng độ dài các đoạn thẳng thành phần để ra độ dài đường gấp khúc một cách cẩn thận.',
  },
  word_problems_g2: {
    id: 'word_problems_g2',
    nameVi: 'Giải toán có lời văn một bước',
    category: 'word_problem',
    grade: 'grade-2',
    descriptionVi: 'Phân tích tóm tắt bài toán, tìm lời giải và phép tính đúng',
    adviceForParents: 'Nhắc bé đọc kĩ từ khóa như "nhiều hơn", "ít hơn", "tất cả", "còn lại" để chọn phép cộng hay trừ.',
  },
};

export const GRADE_3_TOPIC_REGISTRY: Record<string, CurriculumTopicMeta> = {
  numbers_up_to_100000: {
    id: 'numbers_up_to_100000',
    nameVi: 'Các số trong phạm vi 100.000 & Làm tròn số',
    category: 'arithmetic',
    grade: 'grade-3',
    descriptionVi: 'Đọc, viết, so sánh và làm tròn số đến hàng chục, trăm, nghìn',
    adviceForParents: 'Nhắc bé xem chữ số đứng ngay sau hàng làm tròn: nếu >= 5 thì cộng 1 vào hàng làm tròn, < 5 giữ nguyên.',
  },
  multiplication_tables_6_9: {
    id: 'multiplication_tables_6_9',
    nameVi: 'Bảng nhân và bảng chia 6, 7, 8, 9',
    category: 'arithmetic',
    grade: 'grade-3',
    descriptionVi: 'Thành thạo bảng cửu chương nâng cao từ 6 đến 9',
    adviceForParents: 'Cho bé ôn tập qua bài hát nhịp điệu cửu chương hoặc các câu hỏi đố vui hằng ngày 5 phút.',
  },
  multi_digit_multiplication: {
    id: 'multi_digit_multiplication',
    nameVi: 'Nhân số có nhiều chữ số với số có một chữ số',
    category: 'arithmetic',
    grade: 'grade-3',
    descriptionVi: 'Đặt tính rồi tính nhân có nhớ trong phạm vi 100.000',
    adviceForParents: 'Rèn cho bé thói quen viết số nhớ nhỏ ở góc để không bị quên khi cộng vào kết quả hàng kế tiếp.',
  },
  division_with_remainder: {
    id: 'division_with_remainder',
    nameVi: 'Phép chia hết và phép chia có dư',
    category: 'arithmetic',
    grade: 'grade-3',
    descriptionVi: 'Thực hiện phép chia một chữ số, xác định số dư nhỏ hơn số chia',
    adviceForParents: 'Nhấn mạnh quy tắc bất biến: số dư luôn phải nhỏ hơn số chia, nếu số dư >= số chia tức là thương chưa đúng.',
  },
  geometry_perimeter_area: {
    id: 'geometry_perimeter_area',
    nameVi: 'Chu vi & Diện tích hình vuông, hình chữ nhật',
    category: 'geometry',
    grade: 'grade-3',
    descriptionVi: 'Công thức tính chu vi và diện tích với đơn vị cm², m²',
    adviceForParents: 'Phân biệt rõ: Chu vi là độ dài đường bao quanh (cộng các cạnh), Diện tích là phần mặt phẳng bên trong (nhân cạnh).',
  },
  two_step_word_problems: {
    id: 'two_step_word_problems',
    nameVi: 'Giải toán có lời văn hai bước',
    category: 'word_problem',
    grade: 'grade-3',
    descriptionVi: 'Phân tích bài toán hai phép tính liên hoàn để tìm đáp số cuối cùng',
    adviceForParents: 'Hỏi bé: "Muốn tìm câu hỏi chính thì trước hết ta cần biết số lượng nào chưa có?", giúp bé tự tìm bước trung gian.',
  },
  fractions_intro: {
    id: 'fractions_intro',
    nameVi: 'Làm quen với phân số (1/2, 1/3, 1/4, 1/5)',
    category: 'arithmetic',
    grade: 'grade-3',
    descriptionVi: 'Nhận biết một phần mấy của một hình hoặc một tập hợp đồ vật',
    adviceForParents: 'Sử dụng hình ảnh chiếc bánh pizza hoặc thanh chocolate chia đều các phần để bé hiểu ý nghĩa của phân số.',
  },
};

export class LearningAnalyticsService {
  private static defaultStudent: StudentProfile = {
    id: 'student_tony_hero',
    displayName: 'Hiệp Sĩ Tony',
    avatar: 'tony_classic',
    grade: 'grade-3',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    preferences: {
      soundEnabled: true,
      autoReadExplanation: true,
      preferredSessionMinutes: 20,
    },
  };

  /**
   * Safe storage accessors
   */
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
   * STUDENT PROFILE MANAGEMENT
   */
  public static async getAllProfiles(): Promise<StudentProfile[]> {
    const raw = this.getLS(LS_STUDENTS_KEY);
    if (!raw) {
      const initial = [this.defaultStudent];
      this.setLS(LS_STUDENTS_KEY, JSON.stringify(initial));
      this.setLS(LS_ACTIVE_STUDENT_KEY, this.defaultStudent.id);
      return initial;
    }
    try {
      const list = JSON.parse(raw) as StudentProfile[];
      if (!list || list.length === 0) {
        const initial = [this.defaultStudent];
        this.setLS(LS_STUDENTS_KEY, JSON.stringify(initial));
        return initial;
      }
      return list;
    } catch {
      return [this.defaultStudent];
    }
  }

  public static async getActiveProfile(): Promise<StudentProfile> {
    const profiles = await this.getAllProfiles();
    const activeId = this.getLS(LS_ACTIVE_STUDENT_KEY);
    const found = profiles.find((p) => p.id === activeId);
    if (found) return found;
    return profiles[0] || this.defaultStudent;
  }

  public static async setActiveProfile(studentId: string): Promise<void> {
    this.setLS(LS_ACTIVE_STUDENT_KEY, studentId);
  }

  public static async createProfile(
    displayName: string,
    grade: CampaignId,
    avatar = 'tony_classic'
  ): Promise<StudentProfile> {
    const profiles = await this.getAllProfiles();
    const newStudent: StudentProfile = {
      id: `student_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      displayName: displayName.trim() || 'Hiệp Sĩ Tân Binh',
      avatar,
      grade,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      preferences: {
        soundEnabled: true,
        autoReadExplanation: true,
        preferredSessionMinutes: 20,
      },
    };
    profiles.push(newStudent);
    this.setLS(LS_STUDENTS_KEY, JSON.stringify(profiles));
    await this.setActiveProfile(newStudent.id);
    return newStudent;
  }

  public static async updateProfile(
    updates: Partial<StudentProfile> & { id: string }
  ): Promise<StudentProfile> {
    const profiles = await this.getAllProfiles();
    const idx = profiles.findIndex((p) => p.id === updates.id);
    if (idx >= 0) {
      profiles[idx] = {
        ...profiles[idx],
        ...updates,
        lastActive: new Date().toISOString(),
      };
      this.setLS(LS_STUDENTS_KEY, JSON.stringify(profiles));
      return profiles[idx];
    }
    throw new Error(`Profile ${updates.id} not found`);
  }

  /**
   * QUESTION ATTEMPT RECORDING
   */
  public static async recordQuestionAttempt(
    data: Omit<QuestionAttemptRecord, 'attemptId' | 'timestamp'>
  ): Promise<QuestionAttemptRecord> {
    const attempt: QuestionAttemptRecord = {
      ...data,
      attemptId: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    const key = `${LS_ATTEMPTS_PREFIX}${data.studentId}_${data.campaignId}`;
    const existing = await this.getAttempts(data.studentId, data.campaignId);
    existing.unshift(attempt); // latest first

    // Limit to 2000 attempts in localStorage for peak performance
    const trimmed = existing.slice(0, 2000);
    this.setLS(key, JSON.stringify(trimmed));

    // Update active profile timestamp
    try {
      await this.updateProfile({ id: data.studentId });
    } catch {
      // ignore
    }

    return attempt;
  }

  /**
   * GET FILTERED ATTEMPTS
   */
  public static async getAttempts(
    studentId: string,
    campaignId: CampaignId,
    filters?: HistoryFilterOptions
  ): Promise<QuestionAttemptRecord[]> {
    const key = `${LS_ATTEMPTS_PREFIX}${studentId}_${campaignId}`;
    const raw = this.getLS(key);
    let attempts: QuestionAttemptRecord[] = [];

    if (raw) {
      try {
        attempts = JSON.parse(raw);
      } catch {
        attempts = [];
      }
    }

    if (!filters) {
      return attempts;
    }

    let filtered = [...attempts];

    // Filter by topic
    if (filters.topic && filters.topic !== 'all') {
      filtered = filtered.filter((a) => a.topic === filters.topic);
    }

    // Filter by difficulty
    if (filters.difficulty && (filters.difficulty as string) !== 'all') {
      filtered = filtered.filter((a) => a.difficulty === filters.difficulty);
    }

    // Filter by result
    if (filters.result === 'correct') {
      filtered = filtered.filter((a) => a.firstAttemptResult === true);
    } else if (filters.result === 'incorrect') {
      filtered = filtered.filter((a) => a.firstAttemptResult === false);
    }

    // Filter by time range
    if (filters.timeRange === '7_days') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      filtered = filtered.filter((a) => new Date(a.timestamp) >= cutoff);
    } else if (filters.timeRange === '30_days') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      filtered = filtered.filter((a) => new Date(a.timestamp) >= cutoff);
    }

    // Search query
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (a) =>
          a.questionText.toLowerCase().includes(q) ||
          a.topicNameVi.toLowerCase().includes(q) ||
          (a.explanation && a.explanation.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  /**
   * MASTERY LEVEL EVALUATOR
   * 4 Tiers:
   * 1. NOT_STARTED: 0 questions
   * 2. LEARNING: < 60% accuracy
   * 3. DEVELOPING: 60% - 84% accuracy OR < 10 questions
   * 4. MASTERED: >= 85% accuracy AND >= 10 attempts
   */
  public static evaluateMasteryLevel(totalQuestions: number, correctCount: number): MasteryLevel {
    if (totalQuestions === 0) return 'NOT_STARTED';
    const accuracy = (correctCount / totalQuestions) * 100;
    if (accuracy < 60) return 'LEARNING';
    if (accuracy < 85 || totalQuestions < 10) return 'DEVELOPING';
    return 'MASTERED';
  }

  /**
   * CALCULATE DASHBOARD SUMMARY (10 CORE METRICS)
   */
  public static async calculateDashboardSummary(
    studentId: string,
    campaignId: CampaignId,
    extraMetrics?: { completedQuestsCount?: number; kingdomsRestoredCount?: number }
  ): Promise<LearningDashboardSummary> {
    const student = await this.getActiveProfile();
    const attempts = await this.getAttempts(studentId, campaignId);

    const topicRegistry =
      campaignId === 'grade-2' ? GRADE_2_TOPIC_REGISTRY : GRADE_3_TOPIC_REGISTRY;
    const totalTopics = Object.keys(topicRegistry).length;

    const totalQuestions = attempts.length;
    let firstAttemptCorrect = 0;
    let finalCorrect = 0;
    let totalSeconds = 0;

    // Per-topic accumulation
    const topicStatsMap: Record<
      string,
      {
        total: number;
        firstCorrect: number;
        finalCorrect: number;
        totalTime: number;
        difficulties: Set<QuestionDifficulty>;
        lastDate?: string;
        recentResults: boolean[];
      }
    > = {};

    // Daily activity map (last 14 days)
    const dailyMap: Record<string, { count: number; correct: number }> = {};
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      dailyMap[ds] = { count: 0, correct: 0 };
    }

    // Process attempts
    for (const att of attempts) {
      if (att.firstAttemptResult) firstAttemptCorrect++;
      if (att.finalResult) finalCorrect++;
      totalSeconds += att.timeSpentSeconds || 15;

      const tKey = att.topic;
      if (!topicStatsMap[tKey]) {
        topicStatsMap[tKey] = {
          total: 0,
          firstCorrect: 0,
          finalCorrect: 0,
          totalTime: 0,
          difficulties: new Set<QuestionDifficulty>(),
          recentResults: [],
        };
      }

      const ts = topicStatsMap[tKey];
      ts.total++;
      if (att.firstAttemptResult) ts.firstCorrect++;
      if (att.finalResult) ts.finalCorrect++;
      ts.totalTime += att.timeSpentSeconds || 15;
      ts.difficulties.add(att.difficulty);
      if (!ts.lastDate || att.timestamp > ts.lastDate) {
        ts.lastDate = att.timestamp;
      }
      if (ts.recentResults.length < 5) {
        ts.recentResults.push(att.firstAttemptResult);
      }

      // Daily mapping
      const dayStr = att.timestamp.split('T')[0];
      if (dailyMap[dayStr]) {
        dailyMap[dayStr].count++;
        if (att.firstAttemptResult) dailyMap[dayStr].correct++;
      }
    }

    const firstAttemptAccuracy =
      totalQuestions > 0 ? Math.round((firstAttemptCorrect / totalQuestions) * 100) : 0;
    const finalAccuracy =
      totalQuestions > 0 ? Math.round((finalCorrect / totalQuestions) * 100) : 0;
    const totalLearningTimeMinutes = Math.round(totalSeconds / 60);

    // Topic breakdown
    const topicBreakdown: Record<string, TopicAnalyticsData> = {};
    let topicsMasteredCount = 0;
    let topicsPracticedCount = 0;

    for (const [id, meta] of Object.entries(topicRegistry)) {
      const stats = topicStatsMap[id];
      if (stats && stats.total > 0) {
        topicsPracticedCount++;
        const firstAcc = Math.round((stats.firstCorrect / stats.total) * 100);
        const finAcc = Math.round((stats.finalCorrect / stats.total) * 100);
        const mastery = this.evaluateMasteryLevel(stats.total, stats.firstCorrect);
        if (mastery === 'MASTERED') topicsMasteredCount++;

        // Trend calculation
        let trend: 'improving' | 'stable' | 'needs_practice' = 'stable';
        if (stats.recentResults.length >= 3) {
          const recentSum = stats.recentResults.filter(Boolean).length;
          const recentRate = recentSum / stats.recentResults.length;
          if (recentRate >= 0.8) trend = 'improving';
          else if (recentRate < 0.5) trend = 'needs_practice';
        }

        topicBreakdown[id] = {
          topicId: id,
          topicNameVi: meta.nameVi,
          campaignId,
          totalQuestions: stats.total,
          firstAttemptCorrect: stats.firstCorrect,
          firstAttemptIncorrect: stats.total - stats.firstCorrect,
          firstAttemptAccuracy: firstAcc,
          finalAccuracy: finAcc,
          averageTimeSeconds: Math.round(stats.totalTime / stats.total),
          masteryLevel: mastery,
          completedDifficulties: Array.from(stats.difficulties),
          trend,
          lastAttemptDate: stats.lastDate,
        };
      } else {
        // Not started
        topicBreakdown[id] = {
          topicId: id,
          topicNameVi: meta.nameVi,
          campaignId,
          totalQuestions: 0,
          firstAttemptCorrect: 0,
          firstAttemptIncorrect: 0,
          firstAttemptAccuracy: 0,
          finalAccuracy: 0,
          averageTimeSeconds: 0,
          masteryLevel: 'NOT_STARTED',
          completedDifficulties: [],
          trend: 'stable',
        };
      }
    }

    // Identify Strengths (Accuracy >= 80% and at least 3 questions)
    const topicList = Object.values(topicBreakdown);
    const strengths = topicList
      .filter((t) => t.totalQuestions >= 3 && t.firstAttemptAccuracy >= 80)
      .sort((a, b) => b.firstAttemptAccuracy - a.firstAttemptAccuracy);

    // Identify Needs Practice: Prioritize topics with mistakes (Accuracy < 65% with >= 2 questions), then unattempted
    const attemptedNeedsPractice = topicList
      .filter((t) => t.totalQuestions >= 2 && t.firstAttemptAccuracy < 65)
      .sort((a, b) => a.firstAttemptAccuracy - b.firstAttemptAccuracy);

    const unattempted = topicList.filter((t) => t.totalQuestions === 0);

    const needsPractice = [...attemptedNeedsPractice, ...unattempted];

    // Learning Streak calculation (authentic days in a row up to today)
    const datesWithAttempts = new Set(attempts.map((a) => a.timestamp.split('T')[0]));
    let streakDays = 0;
    const checkDate = new Date();

    // Check if practiced today or yesterday
    const todayStr = checkDate.toISOString().split('T')[0];
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];

    if (datesWithAttempts.has(todayStr) || datesWithAttempts.has(yesterdayStr)) {
      // Count backwards
      let curr = new Date(datesWithAttempts.has(todayStr) ? todayStr : yesterdayStr);
      while (datesWithAttempts.has(curr.toISOString().split('T')[0])) {
        streakDays++;
        curr.setDate(curr.getDate() - 1);
      }
    }

    // Daily activity array
    const dailyActivity: DailyActivityPoint[] = Object.entries(dailyMap).map(([d, val]) => ({
      date: d,
      questionsCount: val.count,
      correctCount: val.correct,
      accuracy: val.count > 0 ? Math.round((val.correct / val.count) * 100) : 0,
    }));

    return {
      studentId,
      studentName: student.displayName,
      campaignId,
      totalQuestions,
      firstAttemptCorrect,
      firstAttemptIncorrect: totalQuestions - firstAttemptCorrect,
      firstAttemptAccuracy,
      finalAccuracy,
      totalLearningTimeMinutes,
      topicsPracticed: topicsPracticedCount,
      totalTopics,
      topicsMastered: topicsMasteredCount,
      learningStreakDays: streakDays,
      completedQuestsCount: extraMetrics?.completedQuestsCount ?? 0,
      kingdomsRestoredCount: extraMetrics?.kingdomsRestoredCount ?? 0,
      strengths,
      needsPractice,
      topicBreakdown,
      dailyActivity,
    };
  }

  /**
   * RECOMMENDED PRACTICES
   */
  public static async getRecommendedPractices(
    studentId: string,
    campaignId: CampaignId
  ): Promise<RecommendedPracticeItem[]> {
    const summary = await this.calculateDashboardSummary(studentId, campaignId);
    const items: RecommendedPracticeItem[] = [];

    // Prioritize topics that need practice
    for (const topic of summary.needsPractice.slice(0, 4)) {
      let reason = 'Cần luyện tập thêm để củng cố kỹ năng cơ bản';
      let recommendedDifficulty: QuestionDifficulty = 'easy';

      if (topic.totalQuestions === 0) {
        reason = 'Chuyên đề mới chưa khám phá! Hãy rèn luyện để mở khóa sức mạnh mới.';
        recommendedDifficulty = 'easy';
      } else if (topic.firstAttemptAccuracy < 50) {
        reason = `Độ chính xác hiện tại là ${topic.firstAttemptAccuracy}%. Hãy luyện các câu cơ bản để nắm vững phương pháp.`;
        recommendedDifficulty = 'easy';
      } else {
        reason = `Độ chính xác ${topic.firstAttemptAccuracy}%. Thêm một chút rèn luyện là Tony sẽ đạt mức Thành Thạo!`;
        recommendedDifficulty = 'normal';
      }

      items.push({
        topicId: topic.topicId,
        topicNameVi: topic.topicNameVi,
        campaignId,
        reason,
        currentAccuracy: topic.firstAttemptAccuracy,
        recommendedDifficulty,
        suggestedQuestionsCount: 5,
      });
    }

    // If all topics are mastered or none in needsPractice, suggest advanced challenges
    if (items.length === 0) {
      for (const topic of summary.strengths.slice(0, 2)) {
        items.push({
          topicId: topic.topicId,
          topicNameVi: topic.topicNameVi,
          campaignId,
          reason: 'Bé đã rất thành thạo! Hãy thử sức với các câu hỏi Thử Thách Cực Hạn.',
          currentAccuracy: topic.firstAttemptAccuracy,
          recommendedDifficulty: 'hard',
          suggestedQuestionsCount: 5,
        });
      }
    }

    return items;
  }
}
