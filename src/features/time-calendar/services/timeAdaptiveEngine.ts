import type {
  TimeErrorType,
  TimeSkillBreakdown,
  TimeAttemptRecord,
  TimeSkillId,
} from '@/types/timeCalendar';

export interface TimeDiagnosticResult {
  errorType: TimeErrorType;
  remediationAdviceVi: string;
  recommendedZone: 'clock' | 'calendar' | 'timeline' | 'duration';
}

export class TimeAdaptiveEngine {
  /**
   * Chẩn đoán lỗi nhận thức thời gian và lịch
   */
  public static diagnoseError(
    selectedOption: string,
    correctOption: string,
    targetSkill?: TimeSkillId
  ): TimeDiagnosticResult {
    const sel = selectedOption.trim().toLowerCase();
    const cor = correctOption.trim().toLowerCase();

    // 1. Nhầm kim ngắn và kim dài
    if (
      targetSkill === 'hour_hand_recognition' ||
      targetSkill === 'minute_hand_recognition' ||
      (sel.includes('kim phút') && cor.includes('kim giờ')) ||
      (sel.includes('kim giờ') && cor.includes('kim phút'))
    ) {
      return {
        errorType: 'HAND_CONFUSION',
        remediationAdviceVi:
          'Tony hãy nhớ: Kim NGẮN là kim chỉ GIỜ (chạy chậm), kim DÀI là kim chỉ PHÚT (chạy nhanh hơn).',
        recommendedZone: 'clock',
      };
    }

    // 2. Nhầm số trên mặt đồng hồ với số phút (đọc số 3 là 3 phút thay vì 15 phút)
    if (
      (cor.includes('15 phút') && sel.includes('3 phút')) ||
      (cor.includes('20 phút') && sel.includes('4 phút')) ||
      (cor.includes('30 phút') && sel.includes('6 phút')) ||
      (cor.includes('35 phút') && sel.includes('7 phút')) ||
      (cor.includes('40 phút') && sel.includes('8 phút'))
    ) {
      return {
        errorType: 'MINUTE_MULTIPLIER_ERROR',
        remediationAdviceVi:
          'Quy tắc đọc phút: Mỗi số lớn trên đồng hồ cách nhau 5 phút. Hãy lấy số kim dài chỉ nhân với 5 (ví dụ: chỉ số 3 là 3 x 5 = 15 phút).',
        recommendedZone: 'clock',
      };
    }

    // 3. Nhầm giờ kém (vd 8:45 đọc là 8 giờ kém 15 thay vì 9 giờ kém 15)
    if (
      (cor.includes('9 giờ kém') && sel.includes('8 giờ kém')) ||
      (cor.includes('10 giờ kém') && sel.includes('9 giờ kém')) ||
      (cor.includes('8 giờ kém') && sel.includes('7 giờ kém'))
    ) {
      return {
        errorType: 'PAST_HOUR_CONFUSION',
        remediationAdviceVi:
          'Khi đọc giờ kém: Phải lấy GIỜ KẾ TIẾP kèm theo số phút còn thiếu để đến giờ đó (ví dụ 8:45 là còn 15 phút nữa tới 9 giờ -> đọc là 9 giờ kém 15).',
        recommendedZone: 'clock',
      };
    }

    // 4. Nhầm số ngày trong tháng 30 vs 31
    if (
      (cor.includes('31 ngày') && sel.includes('30 ngày')) ||
      (cor.includes('30 ngày') && sel.includes('31 ngày'))
    ) {
      return {
        errorType: 'MONTH_DAYS_MISUNDERSTANDING',
        remediationAdviceVi:
          'Quy tắc nắm tay: Khớp nhô lên có 31 ngày (tháng 1, 3, 5, 7, 8, 10, 12). Khe lõm xuống có 30 ngày (tháng 4, 6, 9, 11).',
        recommendedZone: 'calendar',
      };
    }

    // 5. Nhầm năm nhuận tháng 2
    if (
      (cor.includes('29 ngày') && sel.includes('28 ngày')) ||
      (cor.includes('366 ngày') && sel.includes('365 ngày'))
    ) {
      return {
        errorType: 'LEAP_YEAR_FEBRUARY_ERROR',
        remediationAdviceVi:
          'Năm nhuận tháng 2 có 29 ngày và cả năm có 366 ngày. Năm thường tháng 2 chỉ có 28 ngày và cả năm có 365 ngày.',
        recommendedZone: 'calendar',
      };
    }

    // 6. Tính sai khoảng thời gian
    if (targetSkill === 'duration_calculation' || sel.includes('giờ') || sel.includes('phút')) {
      return {
        errorType: 'DURATION_CALCULATION_MISTAKE',
        remediationAdviceVi:
          'Để tính khoảng thời gian: Lấy thời điểm KẾT THÚC trừ đi thời điểm BẮT ĐẦU. Có thể chia nhỏ qua mốc giờ tròn.',
        recommendedZone: 'duration',
      };
    }

    return {
      errorType: 'NONE',
      remediationAdviceVi:
        'Hãy quan sát kỹ mặt đồng hồ hoặc tờ lịch để xác định chính xác dữ kiện trước khi chọn đáp án.',
      recommendedZone: 'clock',
    };
  }

  /**
   * Tính toán điểm năng lực cho 9 kỹ năng thời gian & lịch
   */
  public static calculateSkillBreakdown(attempts: TimeAttemptRecord[]): TimeSkillBreakdown {
    const scores: Record<TimeSkillId, { correct: number; total: number }> = {
      hour_hand_recognition: { correct: 0, total: 0 },
      minute_hand_recognition: { correct: 0, total: 0 },
      exact_hour_reading: { correct: 0, total: 0 },
      half_quarter_reading: { correct: 0, total: 0 },
      five_minute_reading: { correct: 0, total: 0 },
      past_hour_reading: { correct: 0, total: 0 },
      calendar_days_weeks: { correct: 0, total: 0 },
      month_days_leap_year: { correct: 0, total: 0 },
      duration_calculation: { correct: 0, total: 0 },
    };

    attempts.forEach((a) => {
      if (a.category === 'duration') {
        scores.duration_calculation.total++;
        if (a.isSuccess) scores.duration_calculation.correct++;
      } else if (a.category === 'calendar') {
        if (a.taskId.includes('leap') || a.taskId.includes('month')) {
          scores.month_days_leap_year.total++;
          if (a.isSuccess) scores.month_days_leap_year.correct++;
        } else {
          scores.calendar_days_weeks.total++;
          if (a.isSuccess) scores.calendar_days_weeks.correct++;
        }
      } else if (a.category === 'routine') {
        scores.exact_hour_reading.total++;
        if (a.isSuccess) scores.exact_hour_reading.correct++;
      } else {
        // clock / arena
        if (a.taskId.includes('hand')) {
          scores.hour_hand_recognition.total++;
          if (a.isSuccess) scores.hour_hand_recognition.correct++;
        } else if (a.taskId.includes('past')) {
          scores.past_hour_reading.total++;
          if (a.isSuccess) scores.past_hour_reading.correct++;
        } else if (a.taskId.includes('five') || a.taskId.includes('minute')) {
          scores.five_minute_reading.total++;
          if (a.isSuccess) scores.five_minute_reading.correct++;
        } else if (a.taskId.includes('half') || a.taskId.includes('quarter')) {
          scores.half_quarter_reading.total++;
          if (a.isSuccess) scores.half_quarter_reading.correct++;
        } else {
          scores.exact_hour_reading.total++;
          if (a.isSuccess) scores.exact_hour_reading.correct++;
        }
      }
    });

    const calc = (s: { correct: number; total: number }, fallback = 85) =>
      s.total === 0 ? fallback : Math.round((s.correct / s.total) * 100);

    return {
      hourHandScore: calc(scores.hour_hand_recognition, 90),
      minuteHandScore: calc(scores.minute_hand_recognition, 90),
      exactHourScore: calc(scores.exact_hour_reading, 85),
      halfQuarterScore: calc(scores.half_quarter_reading, 80),
      fiveMinuteScore: calc(scores.five_minute_reading, 75),
      pastHourScore: calc(scores.past_hour_reading, 75),
      calendarDaysScore: calc(scores.calendar_days_weeks, 85),
      monthDaysLeapScore: calc(scores.month_days_leap_year, 80),
      durationScore: calc(scores.duration_calculation, 80),
    };
  }

  /**
   * Đề xuất trọng tâm luyện tập thích ứng
   */
  public static getRecommendedFocus(skills: TimeSkillBreakdown): {
    skillNameVi: string;
    targetZone: 'clock' | 'calendar' | 'timeline' | 'duration' | 'boss_arena';
    adviceVi: string;
  } {
    if (skills.pastHourScore < 75) {
      return {
        skillNameVi: 'Đọc Giờ Kém (Past Hour Reading)',
        targetZone: 'clock',
        adviceVi: 'Tony hãy vào Đồng Hồ Tương Tác để luyện cách đọc giờ khi kim phút đã vượt qua số 6.',
      };
    }
    if (skills.fiveMinuteScore < 75) {
      return {
        skillNameVi: 'Đọc Giờ Đến 5 Phút',
        targetZone: 'clock',
        adviceVi: 'Luyện tập bảng nhân 5 để tính nhanh số phút tương ứng với từng số trên mặt đồng hồ.',
      };
    }
    if (skills.monthDaysLeapScore < 75) {
      return {
        skillNameVi: 'Số Ngày Trong Tháng & Năm Nhuận',
        targetZone: 'calendar',
        adviceVi: 'Thực hành đếm các tháng 30 ngày và 31 ngày bằng mẹo nắm tay trên cuốn lịch ma thuật.',
      };
    }
    if (skills.durationScore < 75) {
      return {
        skillNameVi: 'Tính Khoảng Thời Gian (Duration)',
        targetZone: 'duration',
        adviceVi: 'Luyện tập tính khoảng cách thời gian giữa thời điểm khởi hành và thời điểm đến nơi.',
      };
    }
    return {
      skillNameVi: 'Chiến Binh Thời Gian Toàn Diện',
      targetZone: 'boss_arena',
      adviceVi: 'Năng lực thời gian của Tony rất xuất sắc! Hãy bước vào Đấu trường khiêu chiến Chronos Watcher!',
    };
  }
}
