import { create } from 'zustand';
import type {
  CampaignId,
  StudentProfile,
  QuestionAttemptRecord,
  LearningDashboardSummary,
  HistoryFilterOptions,
  RecommendedPracticeItem,
} from '@/types';
import { LearningAnalyticsService } from './services/learningAnalyticsService';
import { useProgressStore } from '@/game/state/useProgressStore';
import { useCampaignStore } from '@/game/state/useCampaignStore';

export type DashboardTab = 'journey' | 'overview' | 'topics' | 'history' | 'recommendations' | 'teacher' | 'division' | 'word_problems' | 'geometry' | 'number_sense' | 'fractions' | 'time_calendar' | 'money_shopping' | 'advanced_arena' | 'logic_thinking' | 'final_campaign';

interface LearningState {
  students: StudentProfile[];
  activeStudent: StudentProfile | null;
  summary: LearningDashboardSummary | null;
  attempts: QuestionAttemptRecord[];
  recommendedPractices: RecommendedPracticeItem[];
  activeTab: DashboardTab;
  selectedGrade: CampaignId;
  historyFilters: HistoryFilterOptions;
  selectedAttemptForModal: QuestionAttemptRecord | null;
  isProfileModalOpen: boolean;
  isReportModalOpen: boolean;
  isPracticeQuizOpen: boolean;
  activePracticeItem: RecommendedPracticeItem | null;
  isLoading: boolean;

  // Actions
  init: () => Promise<void>;
  refreshSummary: () => Promise<void>;
  switchStudent: (studentId: string) => Promise<void>;
  createStudent: (name: string, grade: CampaignId, avatar?: string) => Promise<StudentProfile>;
  updateStudent: (updates: Partial<StudentProfile>) => Promise<void>;
  setSelectedGrade: (grade: CampaignId) => Promise<void>;
  setActiveTab: (tab: DashboardTab) => void;
  setHistoryFilters: (filters: Partial<HistoryFilterOptions>) => Promise<void>;
  setSelectedAttemptForModal: (attempt: QuestionAttemptRecord | null) => void;
  setIsProfileModalOpen: (open: boolean) => void;
  setIsReportModalOpen: (open: boolean) => void;
  startPractice: (item: RecommendedPracticeItem) => void;
  closePracticeQuiz: () => void;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  students: [],
  activeStudent: null,
  summary: null,
  attempts: [],
  recommendedPractices: [],
  activeTab: 'overview',
  selectedGrade: 'grade-3',
  historyFilters: {
    timeRange: 'all',
    result: 'all',
  },
  selectedAttemptForModal: null,
  isProfileModalOpen: false,
  isReportModalOpen: false,
  isPracticeQuizOpen: false,
  activePracticeItem: null,
  isLoading: false,

  init: async () => {
    set({ isLoading: true });
    try {
      const activeCampaign = useCampaignStore.getState().activeCampaignId || 'grade-3';
      const allProfiles = await LearningAnalyticsService.getAllProfiles();
      const currentActive = await LearningAnalyticsService.getActiveProfile();

      set({
        students: allProfiles,
        activeStudent: currentActive,
        selectedGrade: activeCampaign,
      });

      await get().refreshSummary();
    } catch (e) {
      console.error('Failed to init learning store:', e);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshSummary: async () => {
    const { activeStudent, selectedGrade, historyFilters } = get();
    if (!activeStudent) return;

    try {
      const currentProgress = useProgressStore.getState().currentProgress;
      const extraMetrics = {
        completedQuestsCount: currentProgress?.completedQuestIds?.length ?? 0,
        kingdomsRestoredCount: currentProgress?.rescuedKingdomIds?.length ?? 0,
      };

      const summary = await LearningAnalyticsService.calculateDashboardSummary(
        activeStudent.id,
        selectedGrade,
        extraMetrics
      );

      const attempts = await LearningAnalyticsService.getAttempts(
        activeStudent.id,
        selectedGrade,
        historyFilters
      );

      const recommendedPractices = await LearningAnalyticsService.getRecommendedPractices(
        activeStudent.id,
        selectedGrade
      );

      set({
        summary,
        attempts,
        recommendedPractices,
      });
    } catch (e) {
      console.error('Failed to refresh learning summary:', e);
    }
  },

  switchStudent: async (studentId: string) => {
    set({ isLoading: true });
    try {
      await LearningAnalyticsService.setActiveProfile(studentId);
      const student = (await LearningAnalyticsService.getAllProfiles()).find((p) => p.id === studentId);
      if (student) {
        set({ activeStudent: student, selectedGrade: student.grade });
      }
      await get().refreshSummary();
    } finally {
      set({ isLoading: false });
    }
  },

  createStudent: async (name: string, grade: CampaignId, avatar?: string) => {
    set({ isLoading: true });
    try {
      const newStudent = await LearningAnalyticsService.createProfile(name, grade, avatar);
      const all = await LearningAnalyticsService.getAllProfiles();
      set({
        students: all,
        activeStudent: newStudent,
        selectedGrade: grade,
        isProfileModalOpen: false,
      });
      await get().refreshSummary();
      return newStudent;
    } finally {
      set({ isLoading: false });
    }
  },

  updateStudent: async (updates: Partial<StudentProfile>) => {
    const { activeStudent } = get();
    if (!activeStudent) return;
    try {
      const updated = await LearningAnalyticsService.updateProfile({
        ...updates,
        id: activeStudent.id,
      });
      const all = await LearningAnalyticsService.getAllProfiles();
      set({
        students: all,
        activeStudent: updated,
      });
    } catch (e) {
      console.error('Failed to update student profile:', e);
    }
  },

  setSelectedGrade: async (grade: CampaignId) => {
    set({ selectedGrade: grade });
    await get().refreshSummary();
  },

  setActiveTab: (tab: DashboardTab) => {
    set({ activeTab: tab });
  },

  setHistoryFilters: async (newFilters: Partial<HistoryFilterOptions>) => {
    const updated = { ...get().historyFilters, ...newFilters };
    set({ historyFilters: updated });
    const { activeStudent, selectedGrade } = get();
    if (activeStudent) {
      const attempts = await LearningAnalyticsService.getAttempts(
        activeStudent.id,
        selectedGrade,
        updated
      );
      set({ attempts });
    }
  },

  setSelectedAttemptForModal: (attempt: QuestionAttemptRecord | null) => {
    set({ selectedAttemptForModal: attempt });
  },

  setIsProfileModalOpen: (open: boolean) => {
    set({ isProfileModalOpen: open });
  },

  setIsReportModalOpen: (open: boolean) => {
    set({ isReportModalOpen: open });
  },

  startPractice: (item: RecommendedPracticeItem) => {
    set({
      activePracticeItem: item,
      isPracticeQuizOpen: true,
    });
  },

  closePracticeQuiz: () => {
    set({
      activePracticeItem: null,
      isPracticeQuizOpen: false,
    });
    // Refresh stats when closing practice
    get().refreshSummary();
  },
}));
