import { create } from 'zustand';
import type {
  TimeCalendarZone,
  ClockTime,
  ClockTask,
  CalendarTask,
  TimeDurationTask,
  DailyRoutineItem,
  TimeKingdomProgress,
  TimeAttemptRecord,
  TimeBossSpellQuestion,
} from '@/types/timeCalendar';
import type { CampaignId } from '@/types/campaign';
import { CLOCK_TASKS_CATALOG } from './data/clockTasksCatalog';
import { CALENDAR_TASKS_CATALOG } from './data/calendarTasksCatalog';
import { DURATION_TASKS_CATALOG } from './data/durationTasksCatalog';
import { DAILY_ROUTINE_PRESETS } from './data/dailyRoutineCatalog';
import { TIME_ACHIEVEMENTS } from './data/timeAchievementsCatalog';
import {
  TIME_BOSS_PHASES,
  TIME_BOSS_SPELLS,
} from './data/timeBossCatalog';
import { TimeAdaptiveEngine } from './services/timeAdaptiveEngine';
import { persistenceService } from '@/services/persistence/persistenceService';

export interface TimeCalendarState {
  activeZone: TimeCalendarZone | 'hub';
  campaignId: CampaignId;
  setActiveZone: (zone: TimeCalendarZone | 'hub') => void;
  setCampaignId: (campaignId: CampaignId) => void;

  // Clock State
  clockTime: ClockTime;
  activeClockTask: ClockTask;
  clockIndex: number;
  clockFeedback: { isCorrect?: boolean; message: string } | null;
  adjustTime: (deltaMinutes: number) => void;
  setTime: (hours: number, minutes: number) => void;
  answerClockTask: (selectedIdx: number) => boolean;
  checkClockSetting: () => boolean;
  nextClockTask: () => void;

  // Calendar State
  calendarMonth: number;
  calendarYear: number;
  selectedCalendarDate: number | null;
  activeCalendarTask: CalendarTask;
  calendarIndex: number;
  calendarFeedback: { isCorrect?: boolean; message: string } | null;
  prevMonth: () => void;
  nextMonth: () => void;
  selectDate: (day: number) => void;
  answerCalendarTask: (selectedIdx: number) => boolean;
  nextCalendarTask: () => void;

  // Daily Routine & Timeline State
  routineItems: DailyRoutineItem[];
  routineFeedback: { isCorrect?: boolean; message: string } | null;
  reorderRoutineItem: (fromIdx: number, toIdx: number) => void;
  checkRoutineOrder: () => boolean;
  resetRoutine: () => void;

  // Duration Tasks State
  activeDurationTask: TimeDurationTask;
  durationIndex: number;
  durationFeedback: { isCorrect?: boolean; message: string } | null;
  answerDurationTask: (selectedIdx: number) => boolean;
  nextDurationTask: () => void;

  // Boss Battle State
  currentPhaseIndex: number;
  bossHp: number;
  bossMaxHp: number;
  tonyHp: number;
  tonyMaxHp: number;
  battleStreak: number;
  currentBossSpell: TimeBossSpellQuestion;
  battleLogs: string[];
  isBossDefeated: boolean;
  answerBossSpell: (selectedOption: string) => boolean;
  resetBossArena: () => void;

  // Progress & Analytics
  progress: TimeKingdomProgress;
  loadProgress: () => Promise<void>;
  saveProgress: () => Promise<void>;
  recordAttempt: (record: Omit<TimeAttemptRecord, 'id' | 'timestamp'>) => void;
}

const getTasksForGrade = <T extends { gradeLevel: 'grade-2' | 'grade-3' }>(
  tasks: T[],
  grade: CampaignId
): T[] => {
  return tasks.filter((t) => t.gradeLevel === grade);
};

export const useTimeCalendarStore = create<TimeCalendarState>((set, get) => {
  const initialGrade: CampaignId = 'grade-2';
  const g2Clocks = getTasksForGrade(CLOCK_TASKS_CATALOG, initialGrade);
  const g2Calendars = getTasksForGrade(CALENDAR_TASKS_CATALOG, initialGrade);
  const g2Durations = getTasksForGrade(DURATION_TASKS_CATALOG, initialGrade);
  const g2Spells = getTasksForGrade(TIME_BOSS_SPELLS, initialGrade);

  const initialProgress: TimeKingdomProgress = {
    campaignId: initialGrade,
    clockTasksCompleted: 0,
    calendarTasksCompleted: 0,
    durationTasksCompleted: 0,
    routineTasksCompleted: 0,
    bossDefeated: false,
    knowledgeCrystalObtained: false,
    totalAttempts: 0,
    successCount: 0,
    accuracyPercentage: 100,
    skillBreakdown: TimeAdaptiveEngine.calculateSkillBreakdown([]),
    achievements: [...TIME_ACHIEVEMENTS],
    attemptHistory: [],
  };

  return {
    activeZone: 'hub',
    campaignId: initialGrade,
    setActiveZone: (zone) => set({ activeZone: zone }),
    setCampaignId: (grade) => {
      const clocks = getTasksForGrade(CLOCK_TASKS_CATALOG, grade);
      const calendars = getTasksForGrade(CALENDAR_TASKS_CATALOG, grade);
      const durations = getTasksForGrade(DURATION_TASKS_CATALOG, grade);
      const spells = getTasksForGrade(TIME_BOSS_SPELLS, grade);

      set({
        campaignId: grade,
        activeClockTask: clocks[0] || CLOCK_TASKS_CATALOG[0],
        clockIndex: 0,
        clockFeedback: null,
        activeCalendarTask: calendars[0] || CALENDAR_TASKS_CATALOG[0],
        calendarIndex: 0,
        calendarFeedback: null,
        activeDurationTask: durations[0] || DURATION_TASKS_CATALOG[0],
        durationIndex: 0,
        durationFeedback: null,
        currentBossSpell: spells[0] || TIME_BOSS_SPELLS[0],
      });
      get().loadProgress();
    },

    // Clock
    clockTime: { hours: 8, minutes: 0 },
    activeClockTask: g2Clocks[0] || CLOCK_TASKS_CATALOG[0],
    clockIndex: 0,
    clockFeedback: null,
    adjustTime: (deltaMinutes) => {
      const { clockTime } = get();
      let totalMins = clockTime.hours * 60 + clockTime.minutes + deltaMinutes;
      if (totalMins < 0) totalMins += 24 * 60;
      totalMins = totalMins % (24 * 60);

      const h = Math.floor(totalMins / 60) % 12 || 12;
      const m = totalMins % 60;
      set({ clockTime: { hours: h, minutes: m }, clockFeedback: null });
    },
    setTime: (hours, minutes) => {
      set({ clockTime: { hours: hours % 12 || 12, minutes: minutes % 60 }, clockFeedback: null });
    },
    answerClockTask: (selectedIdx) => {
      const { activeClockTask, campaignId } = get();
      const isCorrect = selectedIdx === activeClockTask.correctIndex;
      const selectedOption = activeClockTask.options[selectedIdx] || '';
      const correctOption = activeClockTask.options[activeClockTask.correctIndex] || '';

      const diag = TimeAdaptiveEngine.diagnoseError(
        selectedOption,
        correctOption,
        activeClockTask.targetSkill
      );

      get().recordAttempt({
        taskId: activeClockTask.id,
        category: 'clock',
        gradeLevel: campaignId,
        isSuccess: isCorrect,
        errorType: diag.errorType,
        timeSpentSeconds: 6,
        details: isCorrect ? 'Clock reading correct' : `Selected ${selectedOption}, expected ${correctOption}`,
      });

      if (isCorrect) {
        set((state) => ({
          clockFeedback: {
            isCorrect: true,
            message: `✨ CHÍNH XÁC! ${activeClockTask.explanationVi}`,
          },
          progress: {
            ...state.progress,
            clockTasksCompleted: state.progress.clockTasksCompleted + 1,
          },
        }));
      } else {
        set({
          clockFeedback: {
            isCorrect: false,
            message: `❌ Chưa chính xác. ${diag.remediationAdviceVi}`,
          },
        });
      }
      get().saveProgress();
      return isCorrect;
    },
    checkClockSetting: () => {
      const { clockTime, activeClockTask, campaignId } = get();
      const target = activeClockTask.targetTime;
      const isCorrect =
        (clockTime.hours % 12) === (target.hours % 12) && clockTime.minutes === target.minutes;

      get().recordAttempt({
        taskId: activeClockTask.id,
        category: 'clock',
        gradeLevel: campaignId,
        isSuccess: isCorrect,
        errorType: isCorrect ? 'NONE' : 'HAND_CONFUSION',
        timeSpentSeconds: 8,
        details: `Set ${clockTime.hours}:${clockTime.minutes}, target was ${target.hours}:${target.minutes}`,
      });

      if (isCorrect) {
        set((state) => ({
          clockFeedback: {
            isCorrect: true,
            message: `🎉 TUYỆT VỜI! Bạn đã chỉnh kim đồng hồ chỉ đúng ${activeClockTask.verbalTimeVi}!`,
          },
          progress: {
            ...state.progress,
            clockTasksCompleted: state.progress.clockTasksCompleted + 1,
          },
        }));
      } else {
        set({
          clockFeedback: {
            isCorrect: false,
            message: `❌ Đồng hồ đang chỉ ${clockTime.hours} giờ ${clockTime.minutes} phút. Hãy điều chỉnh kim để chỉ đúng ${activeClockTask.verbalTimeVi}.`,
          },
        });
      }
      get().saveProgress();
      return isCorrect;
    },
    nextClockTask: () => {
      const tasks = getTasksForGrade(CLOCK_TASKS_CATALOG, get().campaignId);
      const nextIdx = (get().clockIndex + 1) % tasks.length;
      set({
        clockIndex: nextIdx,
        activeClockTask: tasks[nextIdx],
        clockFeedback: null,
      });
    },

    // Calendar
    calendarMonth: 10,
    calendarYear: 2026,
    selectedCalendarDate: 15,
    activeCalendarTask: g2Calendars[0] || CALENDAR_TASKS_CATALOG[0],
    calendarIndex: 0,
    calendarFeedback: null,
    prevMonth: () => {
      const { calendarMonth, calendarYear } = get();
      if (calendarMonth === 1) {
        set({ calendarMonth: 12, calendarYear: calendarYear - 1, selectedCalendarDate: null });
      } else {
        set({ calendarMonth: calendarMonth - 1, selectedCalendarDate: null });
      }
    },
    nextMonth: () => {
      const { calendarMonth, calendarYear } = get();
      if (calendarMonth === 12) {
        set({ calendarMonth: 1, calendarYear: calendarYear + 1, selectedCalendarDate: null });
      } else {
        set({ calendarMonth: calendarMonth + 1, selectedCalendarDate: null });
      }
    },
    selectDate: (day) => set({ selectedCalendarDate: day }),
    answerCalendarTask: (selectedIdx) => {
      const { activeCalendarTask, campaignId } = get();
      const isCorrect = selectedIdx === activeCalendarTask.correctIndex;
      const selectedOption = activeCalendarTask.options[selectedIdx] || '';
      const correctOption = activeCalendarTask.options[activeCalendarTask.correctIndex] || '';

      const diag = TimeAdaptiveEngine.diagnoseError(
        selectedOption,
        correctOption,
        activeCalendarTask.targetSkill
      );

      get().recordAttempt({
        taskId: activeCalendarTask.id,
        category: 'calendar',
        gradeLevel: campaignId,
        isSuccess: isCorrect,
        errorType: diag.errorType,
        timeSpentSeconds: 7,
        details: isCorrect ? 'Calendar answer correct' : `Selected ${selectedOption}, expected ${correctOption}`,
      });

      if (isCorrect) {
        set((state) => ({
          calendarFeedback: {
            isCorrect: true,
            message: `⭐ CHÍNH XÁC! ${activeCalendarTask.explanationVi}`,
          },
          progress: {
            ...state.progress,
            calendarTasksCompleted: state.progress.calendarTasksCompleted + 1,
          },
        }));
      } else {
        set({
          calendarFeedback: {
            isCorrect: false,
            message: `❌ Chưa đúng! ${diag.remediationAdviceVi}`,
          },
        });
      }
      get().saveProgress();
      return isCorrect;
    },
    nextCalendarTask: () => {
      const tasks = getTasksForGrade(CALENDAR_TASKS_CATALOG, get().campaignId);
      const nextIdx = (get().calendarIndex + 1) % tasks.length;
      set({
        calendarIndex: nextIdx,
        activeCalendarTask: tasks[nextIdx],
        calendarMonth: tasks[nextIdx].month,
        calendarYear: tasks[nextIdx].year,
        calendarFeedback: null,
      });
    },

    // Daily Routine
    routineItems: [...DAILY_ROUTINE_PRESETS],
    routineFeedback: null,
    reorderRoutineItem: (fromIdx, toIdx) => {
      const list = [...get().routineItems];
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      set({ routineItems: list, routineFeedback: null });
    },
    checkRoutineOrder: () => {
      const { routineItems, campaignId } = get();
      const isSorted = routineItems.every((item, i) => {
        if (i === 0) return true;
        const prev = routineItems[i - 1];
        return item.hours * 60 + item.minutes >= prev.hours * 60 + prev.minutes;
      });

      get().recordAttempt({
        taskId: 'routine_sort_task',
        category: 'routine',
        gradeLevel: campaignId,
        isSuccess: isSorted,
        errorType: isSorted ? 'NONE' : 'DURATION_CALCULATION_MISTAKE',
        timeSpentSeconds: 10,
        details: isSorted ? 'Routine correctly ordered' : 'Routine disorder',
      });

      if (isSorted) {
        set((state) => ({
          routineFeedback: {
            isCorrect: true,
            message: '🎉 HOÀN HẢO! Các hoạt động trong ngày đã được sắp xếp khoa học và chuẩn xác theo dòng thời gian!',
          },
          progress: {
            ...state.progress,
            routineTasksCompleted: state.progress.routineTasksCompleted + 1,
          },
        }));
      } else {
        set({
          routineFeedback: {
            isCorrect: false,
            message: '❌ Thứ tự chưa đúng! Hãy nhớ: Buổi sáng thức dậy, ăn sáng, đi học -> trưa nghỉ ngơi -> chiều luyện tập -> tối ăn tối, học bài, đi ngủ!',
          },
        });
      }
      get().saveProgress();
      return isSorted;
    },
    resetRoutine: () => {
      // Shuffles slightly to challenge Tony
      const shuffled = [...DAILY_ROUTINE_PRESETS].sort(() => Math.random() - 0.5);
      set({ routineItems: shuffled, routineFeedback: null });
    },

    // Duration Tasks
    activeDurationTask: g2Durations[0] || DURATION_TASKS_CATALOG[0],
    durationIndex: 0,
    durationFeedback: null,
    answerDurationTask: (selectedIdx) => {
      const { activeDurationTask, campaignId } = get();
      const isCorrect = selectedIdx === activeDurationTask.correctIndex;
      const selectedOption = activeDurationTask.options[selectedIdx] || '';
      const correctOption = activeDurationTask.options[activeDurationTask.correctIndex] || '';

      const diag = TimeAdaptiveEngine.diagnoseError(
        selectedOption,
        correctOption,
        activeDurationTask.targetSkill
      );

      get().recordAttempt({
        taskId: activeDurationTask.id,
        category: 'duration',
        gradeLevel: campaignId,
        isSuccess: isCorrect,
        errorType: diag.errorType,
        timeSpentSeconds: 6,
        details: isCorrect ? 'Duration calculated correctly' : `Selected ${selectedOption}, expected ${correctOption}`,
      });

      if (isCorrect) {
        set((state) => ({
          durationFeedback: {
            isCorrect: true,
            message: `✨ CHÍNH XÁC! ${activeDurationTask.explanationVi}`,
          },
          progress: {
            ...state.progress,
            durationTasksCompleted: state.progress.durationTasksCompleted + 1,
          },
        }));
      } else {
        set({
          durationFeedback: {
            isCorrect: false,
            message: `❌ Chưa chính xác. ${diag.remediationAdviceVi}`,
          },
        });
      }
      get().saveProgress();
      return isCorrect;
    },
    nextDurationTask: () => {
      const tasks = getTasksForGrade(DURATION_TASKS_CATALOG, get().campaignId);
      const nextIdx = (get().durationIndex + 1) % tasks.length;
      set({
        durationIndex: nextIdx,
        activeDurationTask: tasks[nextIdx],
        durationFeedback: null,
      });
    },

    // Boss Arena
    currentPhaseIndex: 1,
    bossHp: TIME_BOSS_PHASES[0].bossHp,
    bossMaxHp: TIME_BOSS_PHASES[0].maxHp,
    tonyHp: 100,
    tonyMaxHp: 100,
    battleStreak: 0,
    currentBossSpell: g2Spells[0] || TIME_BOSS_SPELLS[0],
    battleLogs: [
      '⏳ Chronos Watcher thức tỉnh và xoay ngược bánh răng thời gian của Vương quốc!',
    ],
    isBossDefeated: false,
    answerBossSpell: (selectedOption) => {
      const { currentBossSpell, bossHp, tonyHp, battleStreak, currentPhaseIndex, campaignId } = get();
      const isCorrect = selectedOption.trim() === currentBossSpell.correctAnswer.trim();

      get().recordAttempt({
        taskId: currentBossSpell.id,
        category: 'boss_arena',
        gradeLevel: campaignId,
        isSuccess: isCorrect,
        errorType: isCorrect ? 'NONE' : 'HAND_CONFUSION',
        timeSpentSeconds: 7,
        details: `Boss spell ${currentBossSpell.spellNameVi}: ${isCorrect ? 'PASS' : 'FAIL'}`,
      });

      const nextStreak = isCorrect ? battleStreak + 1 : 0;
      const logs = [...get().battleLogs];

      if (isCorrect) {
        const comboMultiplier = nextStreak >= 3 ? 1.5 : 1.0;
        const damageDealt = Math.round(currentBossSpell.damage * comboMultiplier);
        const nextBossHp = Math.max(0, bossHp - damageDealt);
        logs.unshift(
          `⚡ Tony đọc chuẩn xác dòng thời gian! Gây ${damageDealt} sát thương (Combo x${comboMultiplier})!`
        );

        if (nextBossHp <= 0) {
          if (currentPhaseIndex < 3) {
            const nextPhase = currentPhaseIndex + 1;
            const phaseConfig = TIME_BOSS_PHASES[nextPhase - 1];
            const spells = TIME_BOSS_SPELLS.filter(
              (s) => s.phaseIndex === nextPhase && s.gradeLevel === campaignId
            );
            logs.unshift(
              `💥 ĐÁNH BẠI GIAI ĐOẠN ${currentPhaseIndex}! Vệ Binh bước vào ${phaseConfig.phaseNameVi}!`
            );
            set({
              currentPhaseIndex: nextPhase,
              bossHp: phaseConfig.bossHp,
              bossMaxHp: phaseConfig.maxHp,
              currentBossSpell: spells[0] || currentBossSpell,
              battleStreak: nextStreak,
              battleLogs: logs,
            });
            return true;
          } else {
            logs.unshift(
              `🏆 CHIẾN THẮNG VANG DỘI! Chronos Watcher đã bị cảm hóa! Dòng thời gian được khôi phục, Chrono Knowledge Crystal đã trở lại!`
            );
            set((state) => ({
              bossHp: 0,
              isBossDefeated: true,
              battleLogs: logs,
              progress: {
                ...state.progress,
                bossDefeated: true,
                knowledgeCrystalObtained: true,
              },
            }));
            get().saveProgress();
            return true;
          }
        } else {
          const spells = TIME_BOSS_SPELLS.filter(
            (s) => s.phaseIndex === currentPhaseIndex && s.gradeLevel === campaignId
          );
          const randomSpell = spells[Math.floor(Math.random() * spells.length)] || currentBossSpell;
          set({
            bossHp: nextBossHp,
            currentBossSpell: randomSpell,
            battleStreak: nextStreak,
            battleLogs: logs,
          });
          return true;
        }
      } else {
        const bossDamage = 20;
        const nextTonyHp = Math.max(10, tonyHp - bossDamage);
        logs.unshift(
          `💔 Câu trả lời chưa chính xác! Bão cát thời gian phản kích, Tony mất ${bossDamage} HP!`
        );
        set({
          tonyHp: nextTonyHp,
          battleStreak: 0,
          battleLogs: logs,
        });
        return false;
      }
    },
    resetBossArena: () => {
      const spells = TIME_BOSS_SPELLS.filter(
        (s) => s.phaseIndex === 1 && s.gradeLevel === get().campaignId
      );
      set({
        currentPhaseIndex: 1,
        bossHp: TIME_BOSS_PHASES[0].bossHp,
        bossMaxHp: TIME_BOSS_PHASES[0].maxHp,
        tonyHp: 100,
        tonyMaxHp: 100,
        battleStreak: 0,
        currentBossSpell: spells[0] || TIME_BOSS_SPELLS[0],
        isBossDefeated: false,
        battleLogs: ['⏳ Trận chiến bắt đầu lại! Phá vỡ phong ấn bánh răng thời gian!'],
      });
    },

    // Progress
    progress: initialProgress,
    loadProgress: async () => {
      try {
        const saved = await persistenceService.getTimeProgress(get().campaignId);
        if (saved) {
          set({ progress: saved });
        }
      } catch (err) {
        console.warn('Could not load time progress:', err);
      }
    },
    saveProgress: async () => {
      try {
        await persistenceService.saveTimeProgress(get().progress);
      } catch (err) {
        console.warn('Could not save time progress:', err);
      }
    },
    recordAttempt: (record) => {
      const fullRecord: TimeAttemptRecord = {
        ...record,
        id: `time_att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
      };
      set((state) => {
        const history = [...state.progress.attemptHistory, fullRecord];
        const successCount = history.filter((h) => h.isSuccess).length;
        const total = history.length;
        const accuracyPercentage = total > 0 ? Math.round((successCount / total) * 100) : 100;
        const skillBreakdown = TimeAdaptiveEngine.calculateSkillBreakdown(history);

        const achievements = state.progress.achievements.map((ach) => {
          let progress = ach.progress;
          let unlocked = ach.unlocked;

          if (ach.id === 'time_clock_reader' && state.progress.clockTasksCompleted >= 3) {
            unlocked = true;
            progress = 100;
          } else if (ach.id === 'time_calendar_master' && state.progress.calendarTasksCompleted >= 3) {
            unlocked = true;
            progress = 100;
          } else if (ach.id === 'time_duration_expert' && state.progress.durationTasksCompleted >= 3) {
            unlocked = true;
            progress = 100;
          } else if (ach.id === 'time_routine_architect' && state.progress.routineTasksCompleted >= 1) {
            unlocked = true;
            progress = 100;
          } else if (ach.id === 'time_boss_slayer' && state.progress.bossDefeated) {
            unlocked = true;
            progress = 100;
          } else if (
            ach.id === 'time_crystal_guardian' &&
            state.progress.bossDefeated &&
            accuracyPercentage >= 80
          ) {
            unlocked = true;
            progress = 100;
          }

          return { ...ach, unlocked, progress };
        });

        return {
          progress: {
            ...state.progress,
            totalAttempts: total,
            successCount,
            accuracyPercentage,
            skillBreakdown,
            achievements,
            attemptHistory: history,
          },
        };
      });
    },
  };
});
