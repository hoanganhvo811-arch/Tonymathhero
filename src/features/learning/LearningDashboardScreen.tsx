import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  BarChart3,
  History,
  Target,
  GraduationCap,
  Users,
  Printer,
  Map,
  Shield,
  Briefcase,
  ChevronRight,
  Sparkles,
  Calendar,
  Divide,
  BookOpen,
  Compass,
  PieChart,
  Clock,
  Coins,
  Trophy,
  Crown,
} from 'lucide-react';
import { useLearningStore, type DashboardTab } from './useLearningStore';
import { LearningMetricCards } from './components/LearningMetricCards';
import { TopicAnalyticsChart } from './components/TopicAnalyticsChart';
import { LearningHistoryTable } from './components/LearningHistoryTable';
import { QuestionDetailModal } from './components/QuestionDetailModal';
import { RecommendedPracticeSection } from './components/RecommendedPracticeSection';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { PrintableReportView } from './components/PrintableReportView';
import { PracticeQuizModal } from './components/PracticeQuizModal';
import { TonyLearningJourneyTab } from '../adaptive/components/TonyLearningJourneyTab';
import { DailyChallengeModal } from '../adaptive/components/DailyChallengeModal';
import { ParentFriendlySummaryModal } from '../adaptive/components/ParentFriendlySummaryModal';
import { DivisionDashboardSection } from '../division/components/DivisionDashboardSection';
import { WordProblemAnalyticsView } from '../word-problems/components/WordProblemAnalyticsView';
import { GeometryAnalyticsView } from '../geometry-measurement/components/GeometryAnalyticsView';
import { NumberSenseAnalyticsView } from '../number-sense/components/NumberSenseAnalyticsView';
import { FractionAnalyticsView } from '../fractions/components/FractionAnalyticsView';
import { TimeAnalyticsView } from '../time-calendar/components/TimeAnalyticsView';
import { MoneyAnalyticsView } from '../money-shopping/components/MoneyAnalyticsView';
import { ArenaAnalyticsView } from '../advanced-arena/components/ArenaAnalyticsView';
import { LogicAnalyticsView } from '../logic-thinking/components/LogicAnalyticsView';
import { HeroJourneySummaryView } from '../final-campaign/components/HeroJourneySummaryView';
import { HeroPortrait } from '@/components/common/HeroPortrait';
import { SoundButton } from '@/components/common/SoundButton';
import { GRADE_2_TOPIC_REGISTRY, GRADE_3_TOPIC_REGISTRY } from './services/learningAnalyticsService';

export const LearningDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [isParentSummaryOpen, setIsParentSummaryOpen] = useState(false);

  const {
    students,
    activeStudent,
    summary,
    attempts,
    recommendedPractices,
    activeTab,
    selectedGrade,
    historyFilters,
    selectedAttemptForModal,
    isProfileModalOpen,
    isReportModalOpen,
    isPracticeQuizOpen,
    activePracticeItem,
    isLoading,
    init,
    switchStudent,
    createStudent,
    setSelectedGrade,
    setActiveTab,
    setHistoryFilters,
    setSelectedAttemptForModal,
    setIsProfileModalOpen,
    setIsReportModalOpen,
    startPractice,
    closePracticeQuiz,
  } = useLearningStore();

  useEffect(() => {
    init();
  }, [init]);

  const isG2 = selectedGrade === 'grade-2';
  const primaryColor = isG2 ? '#38bdf8' : '#ef4444';
  const availableTopics = Object.values(isG2 ? GRADE_2_TOPIC_REGISTRY : GRADE_3_TOPIC_REGISTRY).map(
    (t) => ({ id: t.id, nameVi: t.nameVi })
  );

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: 'journey', label: 'Hành Trình Thích Ứng (AI Brain)', icon: <Sparkles size={18} /> },
    { id: 'overview', label: 'Tổng Quan Năng Lực', icon: <Brain size={18} /> },
    { id: 'topics', label: 'Phân Tích Chuyên Đề', icon: <BarChart3 size={18} /> },
    { id: 'history', label: 'Lịch Sử Bài Làm', icon: <History size={18} /> },
    { id: 'recommendations', label: 'Lộ Trình Rèn Luyện', icon: <Target size={18} /> },
    { id: 'division', label: 'Vương Quốc Phép Chia', icon: <Divide size={18} /> },
    { id: 'word_problems', label: 'Toán Có Lời Văn', icon: <BookOpen size={18} /> },
    { id: 'geometry', label: 'Hình Học & Đo Lường', icon: <Compass size={18} /> },
    { id: 'number_sense', label: 'Tư Duy Số & Nhẩm', icon: <Brain size={18} /> },
    { id: 'fractions', label: 'Vương Quốc Phân Số', icon: <PieChart size={18} /> },
    { id: 'time_calendar', label: 'Thời Gian & Lịch', icon: <Clock size={18} /> },
    { id: 'money_shopping', label: 'Tiền Tệ & Mua Sắm', icon: <Coins size={18} /> },
    { id: 'advanced_arena', label: 'Đấu Trường Tổng Hợp', icon: <Trophy size={18} /> },
    { id: 'logic_thinking', label: 'Trí Tuệ & Logic', icon: <Brain size={18} /> },
    { id: 'final_campaign', label: 'Hành Trình Math Hero', icon: <Crown size={18} /> },
    { id: 'teacher', label: 'Góc Sư Phạm & Phụ Huynh', icon: <GraduationCap size={18} /> },
  ];

  const handlePracticeTopic = (topicId: string, topicNameVi: string) => {
    startPractice({
      topicId,
      topicNameVi,
      campaignId: selectedGrade,
      reason: 'Rèn luyện chủ động theo chuyên đề bạn chọn',
      currentAccuracy: 0,
      recommendedDifficulty: 'normal',
      suggestedQuestionsCount: 5,
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0f1d 0%, #030712 100%)',
        color: '#f8fafc',
        padding: '24px',
        paddingBottom: '80px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* TOP HERO & PROFILE BANNER */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            border: isG2 ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Left: Tony Portrait & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <HeroPortrait
              campaignId={selectedGrade}
              mode="avatar"
              size={72}
              glow={true}
              showBadge={true}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1
                  className="font-cinematic"
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    margin: 0,
                    letterSpacing: '0.04em',
                  }}
                >
                  TONY MATH HERO
                </h1>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: isG2 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${primaryColor}`,
                    color: primaryColor,
                  }}
                >
                  HỆ THỐNG QUẢN LÝ HỌC TẬP &amp; ĐÁNH GIÁ NĂNG LỰC
                </span>
              </div>

              {/* Active student selector button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Users size={15} color="#38bdf8" />
                  <span>Học sinh: <strong style={{ color: '#38bdf8' }}>{activeStudent?.displayName || 'Hiệp Sĩ Tony'}</strong></span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>(Đổi hồ sơ)</span>
                </button>

                {/* Grade Campaign Selector Toggle */}
                <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '8px', padding: '3px' }}>
                  <button
                    onClick={() => setSelectedGrade('grade-2')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: isG2 ? '#0284c7' : 'transparent',
                      color: isG2 ? '#ffffff' : '#94a3b8',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Lớp 2 (Hiệp Sĩ Nhỏ)
                  </button>
                  <button
                    onClick={() => setSelectedGrade('grade-3')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: !isG2 ? '#b91c1c' : 'transparent',
                      color: !isG2 ? '#ffffff' : '#94a3b8',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Lớp 3 (Đại Hiệp Sĩ)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <SoundButton
              variant="gold"
              size="md"
              onClick={() => setIsDailyChallengeOpen(true)}
              icon={<Calendar size={16} />}
            >
              Thử Thách Ngày
            </SoundButton>

            <SoundButton
              variant="fantasy-gold"
              size="md"
              onClick={() => setIsReportModalOpen(true)}
              icon={<Printer size={16} />}
            >
              Xuất Báo Cáo A4
            </SoundButton>

            <SoundButton
              variant={isG2 ? 'grade2' : 'grade3'}
              size="md"
              onClick={() => navigate('/map')}
              icon={<Map size={16} />}
            >
              Vào Bản Đồ Thế Giới
            </SoundButton>

            <SoundButton
              variant="secondary"
              size="md"
              onClick={() => navigate('/profile')}
              icon={<Briefcase size={16} />}
            >
              Hồ Sơ &amp; Túi Đồ
            </SoundButton>
          </div>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '6px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflowX: 'auto',
          }}
        >
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive
                    ? isG2
                      ? 'linear-gradient(90deg, #0284c7, #38bdf8)'
                      : 'linear-gradient(90deg, #b91c1c, #ef4444)'
                    : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {t.icon}
                {t.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        {summary && (
          <div>
            {/* TAB 0: TONY'S ADAPTIVE LEARNING JOURNEY */}
            {activeTab === 'journey' && (
              <TonyLearningJourneyTab
                studentId={activeStudent?.id || 'student_tony_hero'}
                campaignId={selectedGrade}
                isG2={isG2}
                onLaunchPractice={handlePracticeTopic}
                onOpenDailyChallenge={() => setIsDailyChallengeOpen(true)}
                onOpenParentSummary={() => setIsParentSummaryOpen(true)}
              />
            )}

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <LearningMetricCards summary={summary} isG2={isG2} />
                <RecommendedPracticeSection
                  recommendations={recommendedPractices}
                  strengths={summary.strengths}
                  needsPractice={summary.needsPractice}
                  onStartPractice={startPractice}
                  isG2={isG2}
                />
              </div>
            )}

            {/* TAB 2: TOPICS */}
            {activeTab === 'topics' && (
              <TopicAnalyticsChart
                topicBreakdown={summary.topicBreakdown}
                isG2={isG2}
                onPracticeTopic={handlePracticeTopic}
              />
            )}

            {/* TAB 3: HISTORY */}
            {activeTab === 'history' && (
              <LearningHistoryTable
                attempts={attempts}
                filters={historyFilters}
                availableTopics={availableTopics}
                onFilterChange={setHistoryFilters}
                onSelectAttempt={setSelectedAttemptForModal}
                isG2={isG2}
              />
            )}

            {/* TAB 4: RECOMMENDATIONS */}
            {activeTab === 'recommendations' && (
              <RecommendedPracticeSection
                recommendations={recommendedPractices}
                strengths={summary.strengths}
                needsPractice={summary.needsPractice}
                onStartPractice={startPractice}
                isG2={isG2}
              />
            )}

            {/* TAB: DIVISION KINGDOM ANALYTICS */}
            {activeTab === 'division' && (
              <DivisionDashboardSection campaignId={selectedGrade === 'grade-3' ? 'grade-3' : 'grade-2'} />
            )}

            {/* TAB: WORD PROBLEM ADVENTURE ANALYTICS */}
            {activeTab === 'word_problems' && (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <WordProblemAnalyticsView />
              </div>
            )}

            {/* TAB: GEOMETRY & MEASUREMENT ANALYTICS */}
            {activeTab === 'geometry' && (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <GeometryAnalyticsView />
              </div>
            )}

            {/* TAB: NUMBER SENSE & MENTAL MATH ANALYTICS */}
            {activeTab === 'number_sense' && (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <NumberSenseAnalyticsView />
              </div>
            )}

            {/* TAB: FRACTIONS KINGDOM ANALYTICS */}
            {activeTab === 'fractions' && (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <FractionAnalyticsView />
              </div>
            )}

            {/* TAB: TIME & CALENDAR KINGDOM ANALYTICS */}
            {activeTab === 'time_calendar' && (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <TimeAnalyticsView />
              </div>
            )}

            {/* TAB: MONEY & SHOPPING KINGDOM ANALYTICS */}
            {activeTab === 'money_shopping' && (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <MoneyAnalyticsView />
              </div>
            )}

            {/* TAB: ADVANCED ARENA ANALYTICS */}
            {activeTab === 'advanced_arena' && (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <ArenaAnalyticsView />
              </div>
            )}

            {/* TAB: LOGIC & CRITICAL THINKING ANALYTICS */}
            {activeTab === 'logic_thinking' && (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <LogicAnalyticsView />
              </div>
            )}

            {/* TAB: FINAL CAMPAIGN & HERO JOURNEY */}
            {activeTab === 'final_campaign' && (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <HeroJourneySummaryView />
              </div>
            )}

            {/* TAB 5: TEACHER / PARENT */}
            {activeTab === 'teacher' && (
              <TeacherDashboardView
                summary={summary}
                isG2={isG2}
                onOpenReport={() => setIsReportModalOpen(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      <QuestionDetailModal
        attempt={selectedAttemptForModal}
        onClose={() => setSelectedAttemptForModal(null)}
        isG2={isG2}
      />

      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        students={students}
        activeStudent={activeStudent}
        onSwitchStudent={switchStudent}
        onCreateStudent={createStudent}
        isG2={isG2}
      />

      <PrintableReportView
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        summary={summary}
        studentName={activeStudent?.displayName || 'Hiệp Sĩ Tony'}
        campaignId={selectedGrade}
      />

      <PracticeQuizModal
        practiceItem={activePracticeItem}
        onClose={closePracticeQuiz}
        isG2={isG2}
      />

      <DailyChallengeModal
        isOpen={isDailyChallengeOpen}
        onClose={() => setIsDailyChallengeOpen(false)}
        studentId={activeStudent?.id || 'student_tony_hero'}
        campaignId={selectedGrade}
        isG2={isG2}
      />

      <ParentFriendlySummaryModal
        isOpen={isParentSummaryOpen}
        onClose={() => setIsParentSummaryOpen(false)}
        summary={summary}
        studentName={activeStudent?.displayName || 'Hiệp Sĩ Tony'}
        campaignId={selectedGrade}
      />
    </div>
  );
};
