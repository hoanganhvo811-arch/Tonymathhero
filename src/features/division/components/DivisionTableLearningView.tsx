import React, { useState } from 'react';
import { useDivisionStore } from '../useDivisionStore';
import { DIVISION_FACTS, DIVISION_TABLES } from '../data/divisionCatalog';

export const DivisionTableLearningView: React.FC = () => {
  const {
    selectedTable,
    setSelectedTable,
    hideAnswers,
    toggleHideAnswers,
    speakDivisionVi,
    setActiveTab,
    progress,
  } = useDivisionStore();

  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const tableFacts = DIVISION_FACTS.filter((f) => f.tableNumber === selectedTable);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Table Selector Header */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>📜</span>
            <span>BẢNG CHIA {selectedTable}</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            Bấm vào loa 🔊 để nghe đọc chuẩn tiếng Việt, hoặc bấm thẻ để lật đáp án!
          </p>
        </div>

        {/* Table Selector Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {DIVISION_TABLES.map((t) => {
            const isUnlocked = progress?.unlockedTables.includes(t) ?? true;
            return (
              <button
                key={t}
                onClick={() => isUnlocked && setSelectedTable(t)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  border: selectedTable === t ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: selectedTable === t ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(30, 41, 59, 0.8)',
                  color: isUnlocked ? '#ffffff' : '#64748b',
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.5,
                  boxShadow: selectedTable === t ? '0 0 16px rgba(56, 189, 248, 0.6)' : 'none',
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Hide Answers and Practice Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={toggleHideAnswers}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: hideAnswers ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.2)',
              background: hideAnswers ? 'rgba(245, 158, 11, 0.2)' : 'rgba(30, 41, 59, 0.8)',
              color: hideAnswers ? '#fbbf24' : '#cbd5e1',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {hideAnswers ? '👁️ Hiện Toàn Bộ Đáp Án' : '🙈 Ẩn Đáp Án (Flashcard)'}
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
            }}
          >
            🎯 Luyện Tập Bảng {selectedTable}
          </button>
        </div>
      </div>

      {/* 10 Facts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}
      >
        {tableFacts.map((fact) => {
          const isHidden = hideAnswers && !revealedIds[fact.id];
          const factProgress = progress?.factsProgress[fact.id];
          const mastery = factProgress?.masteryLevel || 'NOT_STARTED';

          return (
            <div
              key={fact.id}
              onClick={() => hideAnswers && toggleReveal(fact.id)}
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border:
                  mastery === 'MASTERED'
                    ? '2px solid #10b981'
                    : mastery === 'DEVELOPING'
                    ? '1px solid #38bdf8'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '18px 20px',
                cursor: hideAnswers ? 'pointer' : 'default',
                position: 'relative',
                boxShadow: mastery === 'MASTERED' ? '0 0 15px rgba(16, 185, 129, 0.25)' : 'none',
                transition: 'transform 0.15s ease',
              }}
            >
              {/* Mastery Indicator */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '8px',
                  background:
                    mastery === 'MASTERED'
                      ? 'rgba(16, 185, 129, 0.2)'
                      : mastery === 'DEVELOPING'
                      ? 'rgba(56, 189, 248, 0.2)'
                      : 'rgba(148, 163, 184, 0.1)',
                  color:
                    mastery === 'MASTERED'
                      ? '#34d399'
                      : mastery === 'DEVELOPING'
                      ? '#38bdf8'
                      : '#94a3b8',
                }}
              >
                {mastery === 'MASTERED' ? '★ THÀNH THẠO' : mastery === 'DEVELOPING' ? '✦ ĐANG TIẾN BỘ' : '○ CHƯA HỌC'}
              </div>

              {/* Main Formula Display */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    color: '#ffffff',
                  }}
                >
                  <span>{fact.dividend} ÷ {fact.divisor} = </span>
                  {isHidden ? (
                    <span
                      style={{
                        color: '#fbbf24',
                        background: 'rgba(245, 158, 11, 0.25)',
                        padding: '2px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      ?
                    </span>
                  ) : (
                    <span style={{ color: '#4ade80' }}>{fact.quotient}</span>
                  )}
                </div>

                {/* Audio Speak Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakDivisionVi(fact.promptVi);
                  }}
                  title="Nghe đọc tiếng Việt"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                  }}
                >
                  🔊
                </button>
              </div>

              {/* Vietnamese Reading Text */}
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '8px' }}>
                {fact.promptVi}
              </div>

              {/* Inverse Multiplication Link */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.78rem',
                  color: '#cbd5e1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Quan hệ nhân:</span>
                <strong style={{ color: '#fef08a' }}>
                  {fact.divisor} × {fact.quotient} = {fact.dividend}
                </strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
