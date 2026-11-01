import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDivisionStore } from '../useDivisionStore';
import { DIVISION_FACTS, DIVISION_TABLES } from '../data/divisionCatalog';
import { DivisionAdaptiveEngine } from '../services/divisionAdaptiveEngine';

interface DivisionDashboardSectionProps {
  campaignId: 'grade-2' | 'grade-3';
}

export const DivisionDashboardSection: React.FC<DivisionDashboardSectionProps> = ({ campaignId }) => {
  const navigate = useNavigate();
  const { progress, initDivisionKingdom } = useDivisionStore();

  useEffect(() => {
    initDivisionKingdom('player_tony_hero', campaignId);
  }, [campaignId, initDivisionKingdom]);

  const applicableFacts = DIVISION_FACTS.filter(
    (f) => campaignId === 'grade-3' || f.gradeLevel === 'both' || f.gradeLevel === 'grade-2'
  );

  const summary = DivisionAdaptiveEngine.getMasterySummary(
    applicableFacts,
    progress?.factsProgress || {}
  );

  const weakFacts = DivisionAdaptiveEngine.getWeakFacts(
    applicableFacts,
    progress?.factsProgress || {}
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#38bdf8',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span>➗</span>
            <span>PHÂN TÍCH NĂNG LỰC PHÉP CHIA CỦA TONY</span>
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
            Dữ liệu ghi nhận thực tế từ các bài luyện tập, giải đố trực quan và thử thách tại Vương quốc Phép Chia.
          </p>
        </div>

        <button
          onClick={() => navigate('/division-kingdom')}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)',
          }}
        >
          🏰 Mở Vương Quốc Phép Chia
        </button>
      </div>

      {/* 4 Mastery Tiers Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            borderRadius: '16px',
            padding: '18px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399' }}>
            {summary.mastered}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            ★ THÀNH THẠO (MASTERED)
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            ≥ 3 lần thử, độ chính xác ≥ 85%
          </div>
        </div>

        <div
          style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid #38bdf8',
            borderRadius: '16px',
            padding: '18px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>
            {summary.developing}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            ✦ ĐANG TIẾN BỘ (DEVELOPING)
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            ≥ 3 lần thử, độ chính xác 70 - 84%
          </div>
        </div>

        <div
          style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid #f59e0b',
            borderRadius: '16px',
            padding: '18px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#facc15' }}>
            {summary.learning}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            ○ ĐANG HỌC (LEARNING)
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            Mới bắt đầu luyện tập
          </div>
        </div>

        <div
          style={{
            background: 'rgba(100, 116, 139, 0.1)',
            border: '1px solid #64748b',
            borderRadius: '16px',
            padding: '18px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#94a3b8' }}>
            {summary.notStarted}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', marginTop: '4px' }}>
            🔒 CHƯA HỌC (NOT STARTED)
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Chưa có lượt làm bài nào
          </div>
        </div>
      </div>

      {/* Breakdown per Table (Tables 2 through 9) */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '24px',
        }}
      >
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
          Tiến Độ Từng Bảng Chia (Tables 2 - 9)
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {DIVISION_TABLES.map((t) => {
            const tableFacts = applicableFacts.filter((f) => f.tableNumber === t);
            if (tableFacts.length === 0) return null;

            const tableMastered = tableFacts.filter(
              (f) => progress?.factsProgress[f.id]?.masteryLevel === 'MASTERED'
            ).length;
            const percent = Math.round((tableMastered / tableFacts.length) * 100);

            return (
              <div key={t}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#cbd5e1' }}>Bảng Chia {t}</span>
                  <span style={{ color: '#38bdf8', fontWeight: 800 }}>
                    {tableMastered} / {tableFacts.length} phép tính ({percent}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: percent === 100 ? '#10b981' : percent > 50 ? '#38bdf8' : '#f59e0b',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Facts Recommendations */}
      {weakFacts.length > 0 && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <div style={{ fontWeight: 800, color: '#f87171', fontSize: '1rem', marginBottom: '8px' }}>
            ⚠️ Phép chia cần ưu tiên ôn tập theo gợi ý của AI Thích Ứng:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {weakFacts.map((fact) => (
              <div
                key={fact.id}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                {fact.dividend} ÷ {fact.divisor} = {fact.quotient} ({fact.tipVi})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
