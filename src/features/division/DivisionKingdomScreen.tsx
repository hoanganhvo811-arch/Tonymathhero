import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivisionStore, type DivisionTab } from './useDivisionStore';
import { UnderstandDivisionView } from './components/UnderstandDivisionView';
import { DivisionTableLearningView } from './components/DivisionTableLearningView';
import { MultiplicationDivisionRelationshipView } from './components/MultiplicationDivisionRelationshipView';
import { DivisionPracticeCenterView } from './components/DivisionPracticeCenterView';
import { VisualDivisionPuzzlesView } from './components/VisualDivisionPuzzlesView';
import { DivisionBattleView } from './components/DivisionBattleView';
import { DivisionChallengeView } from './components/DivisionChallengeView';
import { DivisionAchievementsView } from './components/DivisionAchievementsView';
import { useProgressStore } from '../../game/state/useProgressStore';
import { DIVISION_FACTS } from './data/divisionCatalog';
import { DivisionAdaptiveEngine } from './services/divisionAdaptiveEngine';

export const DivisionKingdomScreen: React.FC = () => {
  const navigate = useNavigate();
  const currentProgress = useProgressStore((state) => state.currentProgress);
  const grade = currentProgress?.campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
  const playerId = currentProgress?.playerId || 'player_tony_hero';

  const { activeTab, setActiveTab, initDivisionKingdom, progress } = useDivisionStore();

  useEffect(() => {
    initDivisionKingdom(playerId, grade);
  }, [playerId, grade, initDivisionKingdom]);

  // Compute adaptive metrics
  const applicableFacts = DIVISION_FACTS.filter(
    (f) => grade === 'grade-3' || f.gradeLevel === 'both' || f.gradeLevel === 'grade-2'
  );
  const summary = DivisionAdaptiveEngine.getMasterySummary(
    applicableFacts,
    progress?.factsProgress || {}
  );

  const tabs: { id: DivisionTab; label: string; icon: string }[] = [
    { id: 'hub', label: 'Đại Sảnh', icon: '🏰' },
    { id: 'understand', label: 'Bản Chất Phép Chia', icon: '⚖️' },
    { id: 'tables', label: 'Bảng Chia', icon: '📜' },
    { id: 'relationship', label: 'Nhân ↔ Chia', icon: '🔄' },
    { id: 'practice', label: 'Luyện Tập', icon: '🎯' },
    { id: 'puzzles', label: 'Chia Đồ Vật', icon: '🧩' },
    { id: 'battle', label: 'Đấu Cự Thạch Boss', icon: '⚔️' },
    { id: 'challenge', label: 'Thử Thách', icon: '🏆' },
    { id: 'achievements', label: 'Thành Tích', icon: '🎖️' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, #082f49 0%, #0c1a2e 50%, #030712 100%)',
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
            DIVISION KINGDOM • VƯƠNG QUỐC PHÉP CHIA
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>THÀNH THẠO PHÉP CHIA</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#34d399' }}>
            {summary.mastered} / {summary.totalFacts} phép tính ({summary.masteryPercent}%)
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>TỔNG SỐ LẦN ĐÃ LUYỆN</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#38bdf8' }}>
            {summary.totalAttempts} câu
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ĐỘ CHÍNH XÁC TRUNG BÌNH</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#facc15' }}>
            {summary.accuracyPercent}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>TIẾN TRÌNH CÂU ĐỐ</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#c084fc' }}>
            {progress?.completedPuzzles.length || 0} / 6 câu đố
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

      {/* Main Content Area */}
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {activeTab === 'hub' && (
          <div>
            {/* Hub Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '24px',
                padding: '32px',
                textAlign: 'center',
                marginBottom: '28px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ fontSize: '3.6rem', marginBottom: '8px' }}>🏰</div>
              <h2
                style={{
                  fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#38bdf8',
                  marginBottom: '10px',
                }}
              >
                CHÀO MỪNG HIỆP SĨ TONY ĐẾN VỚI VƯƠNG QUỐC PHÉP CHIA!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '720px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                Tại đây, Tony sẽ khám phá bí mật của việc <strong>chia đều kho báu</strong>, nắm vững bảng chia từ 2 đến 9,
                thấu hiểu mối liên kết kỳ diệu giữa phép nhân và phép chia, và đối đầu với <strong>Cự Thạch Ma Vương</strong> để
                giải cứu vương quốc!
              </p>
            </div>

            {/* Quick Navigation Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '18px',
              }}
            >
              {[
                {
                  id: 'understand',
                  title: 'Bản Chất Phép Chia',
                  desc: 'Kéo thả, chia đều đồ vật và tạo nhóm trực quan sinh động.',
                  icon: '⚖️',
                  color: '#38bdf8',
                },
                {
                  id: 'tables',
                  title: 'Bảng Chia (2 - 9)',
                  desc: 'Học thuộc từng bảng chia, nghe giọng đọc tiếng Việt và lật thẻ ẩn đáp án.',
                  icon: '📜',
                  color: '#4ade80',
                },
                {
                  id: 'relationship',
                  title: 'Quan Hệ Nhân ↔ Chia',
                  desc: 'Khám phá gia đình phép tính ngược nhau: A × B = C ➔ C ÷ A = B.',
                  icon: '🔄',
                  color: '#facc15',
                },
                {
                  id: 'practice',
                  title: 'Trung Tâm Luyện Tập',
                  desc: '8 dạng bài tập phong phú: trắc nghiệm, điền khuyết, toán lời văn.',
                  icon: '🎯',
                  color: '#f472b6',
                },
                {
                  id: 'puzzles',
                  title: 'Câu Đố Chia Đồ Vật',
                  desc: '6 màn giải đố chia kẹo, vàng, đá quý cho các nhân vật cổ tích.',
                  icon: '🧩',
                  color: '#a78bfa',
                },
                {
                  id: 'battle',
                  title: 'Đấu Cự Thạch Boss',
                  desc: 'Vận dụng phép chia để tấn công và khuất phục Đại Boss Cự Thạch.',
                  icon: '⚔️',
                  color: '#f87171',
                },
                {
                  id: 'challenge',
                  title: 'Thử Thách Tính Giờ',
                  desc: 'Chế độ 10, 20, 30 câu kiểm tra phản xạ nhanh và nhận báo cáo điểm yếu.',
                  icon: '🏆',
                  color: '#fbbf24',
                },
                {
                  id: 'achievements',
                  title: 'Danh Hiệu & Phần Thưởng',
                  desc: 'Mở khóa 6 danh hiệu hiệp sĩ và nhận hàng trăm EXP & Vàng thưởng.',
                  icon: '🎖️',
                  color: '#34d399',
                },
              ].map((card) => (
                <div
                  key={card.id}
                  onClick={() => setActiveTab(card.id as DivisionTab)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = card.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  }}
                >
                  <div style={{ fontSize: '2.4rem', marginBottom: '10px' }}>{card.icon}</div>
                  <h3
                    style={{
                      fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: card.color,
                      marginBottom: '8px',
                    }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'understand' && <UnderstandDivisionView />}
        {activeTab === 'tables' && <DivisionTableLearningView />}
        {activeTab === 'relationship' && <MultiplicationDivisionRelationshipView />}
        {activeTab === 'practice' && <DivisionPracticeCenterView />}
        {activeTab === 'puzzles' && <VisualDivisionPuzzlesView />}
        {activeTab === 'battle' && <DivisionBattleView />}
        {activeTab === 'challenge' && <DivisionChallengeView />}
        {activeTab === 'achievements' && <DivisionAchievementsView />}
      </div>
    </div>
  );
};
