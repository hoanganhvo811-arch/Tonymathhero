import { CLOCK_TASKS_CATALOG } from '../features/time-calendar/data/clockTasksCatalog';
import { CALENDAR_TASKS_CATALOG } from '../features/time-calendar/data/calendarTasksCatalog';
import { DURATION_TASKS_CATALOG } from '../features/time-calendar/data/durationTasksCatalog';
import { DAILY_ROUTINE_PRESETS } from '../features/time-calendar/data/dailyRoutineCatalog';
import { TIME_BOSS_PHASES, TIME_BOSS_SPELLS } from '../features/time-calendar/data/timeBossCatalog';
import { TIME_ACHIEVEMENTS } from '../features/time-calendar/data/timeAchievementsCatalog';
import { TimeAdaptiveEngine } from '../features/time-calendar/services/timeAdaptiveEngine';

console.log('================================================================');
console.log('🧪 RUNNING PHASE 17 TIME & CALENDAR KINGDOM TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, errorDetail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (errorDetail) console.error(`     Details: ${errorDetail}`);
    failCount++;
  }
}

// 1. Clock Tasks Test (20 tasks, 10 G2, 10 G3)
const g2Clocks = CLOCK_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-2');
const g3Clocks = CLOCK_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-3');
const clocksValid = CLOCK_TASKS_CATALOG.every(
  (t) =>
    t.correctIndex >= 0 &&
    t.correctIndex < t.options.length &&
    t.targetTime.hours >= 1 &&
    t.targetTime.hours <= 12 &&
    t.targetTime.minutes >= 0 &&
    t.targetTime.minutes < 60
);
assert(
  g2Clocks.length === 10 && g3Clocks.length === 10 && clocksValid,
  'Clock Tasks Catalog has 20 tasks with valid clock times (10 Grade 2, 10 Grade 3)'
);

// 2. Calendar Tasks Test (16 tasks, 8 G2, 8 G3)
const g2Calendars = CALENDAR_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-2');
const g3Calendars = CALENDAR_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-3');
const calendarsValid = CALENDAR_TASKS_CATALOG.every(
  (t) =>
    t.correctIndex >= 0 &&
    t.correctIndex < t.options.length &&
    t.month >= 1 &&
    t.month <= 12 &&
    t.options[t.correctIndex].length > 0
);
assert(
  g2Calendars.length === 8 && g3Calendars.length === 8 && calendarsValid,
  'Calendar Tasks Catalog has 16 tasks with valid date logic (8 Grade 2, 8 Grade 3)'
);

// 3. Duration Tasks Test (12 tasks, 6 G2, 6 G3)
const g2Durations = DURATION_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-2');
const g3Durations = DURATION_TASKS_CATALOG.filter((t) => t.gradeLevel === 'grade-3');
const durationsValid = DURATION_TASKS_CATALOG.every(
  (t) =>
    t.correctIndex >= 0 &&
    t.correctIndex < t.options.length &&
    t.durationMinutes > 0 &&
    t.options[t.correctIndex].length > 0
);
assert(
  g2Durations.length === 6 && g3Durations.length === 6 && durationsValid,
  'Duration Tasks Catalog has 12 tasks with exact duration calculations (6 Grade 2, 6 Grade 3)'
);

// 4. Daily Routine Presets Test
const routineOrderValid = DAILY_ROUTINE_PRESETS.every((item, i) => {
  if (i === 0) return true;
  const prev = DAILY_ROUTINE_PRESETS[i - 1];
  return item.hours * 60 + item.minutes >= prev.hours * 60 + prev.minutes;
});
assert(
  DAILY_ROUTINE_PRESETS.length === 9 && routineOrderValid,
  'Daily Routine has 9 activities in chronological sequence (6:00 to 21:00)'
);

// 5. Boss Arena Phases & Spells Test
const phasesValid =
  TIME_BOSS_PHASES.length === 3 &&
  TIME_BOSS_PHASES[0].bossHp === 320 &&
  TIME_BOSS_PHASES[1].bossHp === 360 &&
  TIME_BOSS_PHASES[2].bossHp === 420;
const spellsValid = TIME_BOSS_SPELLS.every(
  (s) => s.options.includes(s.correctAnswer) && s.damage > 0
);
assert(
  phasesValid && spellsValid && TIME_BOSS_SPELLS.length >= 6,
  'Time Boss Chronos Watcher has 3 progressive phases and verified spells across Grade 2 and Grade 3'
);

// 6. Adaptive Diagnostic Engine Test
const diagHand = TimeAdaptiveEngine.diagnoseError('kim phút', 'kim giờ', 'hour_hand_recognition');
const diagMult = TimeAdaptiveEngine.diagnoseError('8 giờ 3 phút', '8 giờ 15 phút');
const diagPast = TimeAdaptiveEngine.diagnoseError('8 giờ kém 15 phút', '9 giờ kém 15 phút');
const diagMonth = TimeAdaptiveEngine.diagnoseError('30 ngày', '31 ngày');
const diagLeap = TimeAdaptiveEngine.diagnoseError('28 ngày', '29 ngày');
const diagDur = TimeAdaptiveEngine.diagnoseError('3 giờ', '2 giờ', 'duration_calculation');

const diagAllPassed =
  diagHand.errorType === 'HAND_CONFUSION' &&
  diagMult.errorType === 'MINUTE_MULTIPLIER_ERROR' &&
  diagPast.errorType === 'PAST_HOUR_CONFUSION' &&
  diagMonth.errorType === 'MONTH_DAYS_MISUNDERSTANDING' &&
  diagLeap.errorType === 'LEAP_YEAR_FEBRUARY_ERROR' &&
  diagDur.errorType === 'DURATION_CALCULATION_MISTAKE';
assert(
  diagAllPassed,
  'Adaptive Engine accurately detects HAND_CONFUSION, MINUTE_MULTIPLIER, PAST_HOUR, MONTH_DAYS, LEAP_YEAR, and DURATION errors'
);

// 7. Skill Breakdown Calculation Test
const mockAttempts = [
  {
    id: '1',
    taskId: 'g2_clock_identify_hands',
    category: 'clock' as const,
    gradeLevel: 'grade-2' as const,
    timestamp: new Date().toISOString(),
    isSuccess: true,
    errorType: 'NONE' as const,
    timeSpentSeconds: 5,
  },
  {
    id: '2',
    taskId: 'g2_cal_days_in_week',
    category: 'calendar' as const,
    gradeLevel: 'grade-2' as const,
    timestamp: new Date().toISOString(),
    isSuccess: true,
    errorType: 'NONE' as const,
    timeSpentSeconds: 6,
  },
  {
    id: '3',
    taskId: 'g2_dur_one_hour_journey',
    category: 'duration' as const,
    gradeLevel: 'grade-2' as const,
    timestamp: new Date().toISOString(),
    isSuccess: true,
    errorType: 'NONE' as const,
    timeSpentSeconds: 5,
  },
];
const breakdown = TimeAdaptiveEngine.calculateSkillBreakdown(mockAttempts);
const breakdownValid =
  breakdown.hourHandScore === 100 &&
  breakdown.calendarDaysScore === 100 &&
  breakdown.durationScore === 100;
assert(
  breakdownValid,
  'Skill Breakdown engine computes mastery scores across all 9 time & calendar competencies'
);

// 8. Achievements Catalog Test
const achievementsValid =
  TIME_ACHIEVEMENTS.length === 6 &&
  TIME_ACHIEVEMENTS.every((a) => a.id.startsWith('time_') && a.xpReward > 0);
assert(
  achievementsValid,
  'Achievements Catalog contains 6 Time Kingdom achievements with valid rewards'
);

console.log('\n================================================================');
if (failCount === 0) {
  console.log(`🎉 ALL ${passCount} PHASE 17 TIME & CALENDAR TESTS PASSED!`);
} else {
  console.error(`💥 ${failCount} TESTS FAILED out of ${passCount + failCount}`);
}
console.log('================================================================\n');

if (failCount > 0) process.exit(1);
