import type { CampaignId } from './campaign';

export type TimeCalendarZone =
  | 'clock'
  | 'calendar'
  | 'timeline'
  | 'duration'
  | 'boss_arena'
  | 'analytics';

export type TimeSkillId =
  | 'hour_hand_recognition' // Nhận biết kim giờ (kim ngắn)
  | 'minute_hand_recognition' // Nhận biết kim phút (kim dài)
  | 'exact_hour_reading' // Đọc giờ đúng (8:00, 9:00)
  | 'half_quarter_reading' // Đọc giờ 15 phút, 30 phút (giờ rưỡi)
  | 'five_minute_reading' // Đọc giờ chính xác đến 5 phút (Lớp 3)
  | 'past_hour_reading' // Đọc giờ kém (Lớp 3: 9 giờ kém 15, 9 giờ kém 10)
  | 'calendar_days_weeks' // Đọc ngày, thứ trong tuần, hôm qua, hôm nay, ngày mai
  | 'month_days_leap_year' // Số ngày trong tháng (30, 31, 28/29 ngày, năm nhuận)
  | 'duration_calculation'; // Tính khoảng thời gian bắt đầu, kết thúc, thời lượng

export type TimeErrorType =
  | 'NONE'
  | 'HAND_CONFUSION' // Nhầm kim giờ với kim phút
  | 'MINUTE_MULTIPLIER_ERROR' // Nhầm số chỉ phút (vd kim chỉ số 3 đọc là 3 phút thay vì 15 phút)
  | 'PAST_HOUR_CONFUSION' // Nhầm giờ kém với giờ hơn (vd 9 giờ kém 15 đọc là 8 giờ kém 15)
  | 'MONTH_DAYS_MISUNDERSTANDING' // Nhầm số ngày trong tháng 30 vs 31 ngày
  | 'LEAP_YEAR_FEBRUARY_ERROR' // Nhầm số ngày tháng 2 năm nhuận (28 vs 29 ngày)
  | 'DURATION_CALCULATION_MISTAKE'; // Tính sai khoảng thời gian trôi qua

export interface ClockTime {
  hours: number; // 1 - 12 (hoặc 0 - 23)
  minutes: number; // 0 - 59
  period?: 'AM' | 'PM';
}

export interface ClockTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  taskType: 'read_clock' | 'set_clock' | 'match_digital' | 'identify_hand';
  titleVi: string;
  promptVi: string;
  targetTime: ClockTime;
  verbalTimeVi: string; // "8 giờ 15 phút", "8 giờ rưỡi", "9 giờ kém 15"
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  targetSkill: TimeSkillId;
}

export interface CalendarTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  taskType: 'find_day_of_week' | 'month_days' | 'relative_day' | 'leap_year';
  titleVi: string;
  promptVi: string;
  month: number; // 1 - 12
  year: number; // e.g. 2026, 2024
  targetDate?: number; // 1 - 31
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  targetSkill: TimeSkillId;
}

export interface TimeDurationTask {
  id: string;
  gradeLevel: 'grade-2' | 'grade-3';
  titleVi: string;
  storyContextVi: string;
  startTime: ClockTime;
  endTime: ClockTime;
  durationMinutes: number;
  durationDisplayVi: string;
  options: string[];
  correctIndex: number;
  explanationVi: string;
  hintVi: string;
  targetSkill: TimeSkillId;
}

export interface DailyRoutineItem {
  id: string;
  titleVi: string;
  icon: string;
  typicalTimeVi: string;
  hours: number;
  minutes: number;
  orderIndex: number;
  descriptionVi: string;
}

export interface TimeBossSpellQuestion {
  id: string;
  phaseIndex: number;
  gradeLevel: 'grade-2' | 'grade-3';
  spellNameVi: string;
  bossDialogueVi: string;
  questionTextVi: string;
  visualClock?: ClockTime;
  options: string[];
  correctAnswer: string;
  damage: number;
  explanationVi: string;
}

export interface TimeSkillBreakdown {
  hourHandScore: number;
  minuteHandScore: number;
  exactHourScore: number;
  halfQuarterScore: number;
  fiveMinuteScore: number;
  pastHourScore: number;
  calendarDaysScore: number;
  monthDaysLeapScore: number;
  durationScore: number;
}

export interface TimeAttemptRecord {
  id: string;
  taskId: string;
  category: 'clock' | 'calendar' | 'duration' | 'routine' | 'boss_arena';
  gradeLevel: 'grade-2' | 'grade-3';
  timestamp: string;
  isSuccess: boolean;
  errorType: TimeErrorType;
  timeSpentSeconds: number;
  details?: string;
}

export interface TimeAchievement {
  id: string;
  nameVi: string;
  descVi: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  progress: number;
}

export interface TimeKingdomProgress {
  campaignId: CampaignId;
  clockTasksCompleted: number;
  calendarTasksCompleted: number;
  durationTasksCompleted: number;
  routineTasksCompleted: number;
  bossDefeated: boolean;
  knowledgeCrystalObtained: boolean;
  totalAttempts: number;
  successCount: number;
  accuracyPercentage: number;
  skillBreakdown: TimeSkillBreakdown;
  achievements: TimeAchievement[];
  attemptHistory: TimeAttemptRecord[];
}
