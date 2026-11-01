import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWordProblemStore, type WordProblemTab } from './useWordProblemStore';
import { WordProblemWorldView } from './components/WordProblemWorldView';
import { ProblemReadingView } from './components/ProblemReadingView';
import { StepByStepSolvingView } from './components/StepByStepSolvingView';
import { VisualMathStoryView } from './components/VisualMathStoryView';
import { WordProblemCatalogView } from './components/WordProblemCatalogView';
import { WordProblemAnalyticsView } from './components/WordProblemAnalyticsView';
import { WordProblemAchievementsView } from './components/WordProblemAchievementsView';
import { useProgressStore } from '../../game/state/useProgressStore';
import { WORD_PROBLEMS_CATALOG } from './data/wordProblemsCatalog';

export const WordProblemAdventureScreen: React.FC = () => {
  const navigate = useNavigate();
  const currentProgress = useProgressStore((state) => state.currentProgress);
  const grade = currentProgress?.campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
  const playerId = currentProgress?.playerId || 'player_tony_hero';

  const { activeTab, setActiveTab, initWordProblemAdventure, progress, solvingStage } = useWordProblemStore();

  useEffect(() => {
    initWordProblemAdventure(playerId, grade);
  }, [playerId, grade, initWordProblemAdventure]);

  const solvedCount = progress?.solvedProblemIds.length || 0;
  const totalCount = WORD_PROBLEMS_CATALOG.filter(
    (p) => grade === 'grade-3' || p.gradeLevel === 'grade-2' || p.gradeLevel === 'both'
  ).length;

  const tabs: { id: WordProblemTab; label: string; icon: string }[] = [
    { id: 'world', label: 'Vùng Đất Lời Văn', icon: '🗺️' },
    { id: 'solve', label: solvingStage === 'reading' || solvingStage === 'analyzing' ? 'Đọc & Phân Tích' : 'Giải Từng Bước', icon: '⚡' },
    { id: 'visual_story', label: 'Trực Quan Hóa', icon: '🎨' },
    { id: 'catalog', label: 'Kho Bài Toán', icon: '📚' },
    { id: 'analytics', label: 'Phân Tích Năng Lực', icon: '📊' },
    { id: 'achievements', label: 'Danh Hiệu', icon: '🎖️' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 50%, #030712 100%)',
        color: '#f8fafc',
        padding: '24px 20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Banner Navigation */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <button
          onClick={() => navigate('/map')}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#cbd5e1',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🗺️</span>
          <span>Bản Đồ Thế Giới</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
              fontSize: '1.8rem',
              fontWeight: 900,
              color: '#38bdf8',
              letterSpacing: '0.04em',
              textShadow: '0 0 20px rgba(56, 189, 248, 0.6)',
              margin: 0,
            }}
          >
            WORD PROBLEM ADVENTURE • HỌC & GIẢI TOÁN CÓ LỜI VĂN
          </h1>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            Chiến Dịch: <strong style={{ color: '#facc15' }}>{grade === 'grade-2' ? 'Lớp 2 (Hiệp Sĩ Khám Phá)' : 'Lớp 3 (Đại Hiệp Sĩ Huyền Thoại)'}</strong>
          </div>
        </div>

        <button
          onClick={() => navigate('/learning-dashboard')}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38bdf8',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>📊</span>
          <span>Báo Cáo Học Tập</span>
        </button>
      </div>

      {/* Stats Ticker */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto 24px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '18px',
          padding: '14px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>BÀI TOÁN ĐÃ HOÀN THÀNH</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#34d399' }}>
            {solvedCount} / {totalCount} nhiệm vụ ({totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0}%)
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>TỔNG SỐ LẦN ĐÃ GIẢI</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#38bdf8' }}>
            {progress?.attempts.length || 0} lượt làm
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>DANH HIỆU ĐÃ ĐẠT</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#facc15' }}>
            {progress?.achievements.filter((a) => a.unlocked).length || 0} / 6 danh hiệu
          </div>
        </div>
      </div>

      {/* Tab Navigation Ribbon */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto 24px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '14px',
                background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(15, 23, 42, 0.7)',
                border: isActive ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isActive ? '0 0 16px rgba(56, 189, 248, 0.4)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main View Area */}
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {activeTab === 'world' && <WordProblemWorldView />}
        {activeTab === 'solve' && (
          <div>
            {solvingStage === 'reading' || solvingStage === 'analyzing' ? (
              <ProblemReadingView />
            ) : (
              <StepByStepSolvingView />
            )}
          </div>
        )}
        {activeTab === 'visual_story' && <VisualMathStoryView />}
        {activeTab === 'catalog' && <WordProblemCatalogView />}
        {activeTab === 'analytics' && <WordProblemAnalyticsView />}
        {activeTab === 'achievements' && <WordProblemAchievementsView />}
      </div>
    </div>
  );
};
