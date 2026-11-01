import React, { useEffect, useState } from 'react';
import { useDivisionStore } from '../useDivisionStore';
import { DIVISION_TABLES, DIVISION_FACTS } from '../data/divisionCatalog';

export const DivisionChallengeView: React.FC = () => {
  const {
    challengeActive,
    challengeConfig,
    challengeQuestions,
    challengeIndex,
    challengeCorrectCount,
    challengeWrongCount,
    challengeTimeRemaining,
    challengeResult,
    startChallenge,
    submitChallengeAnswer,
    tickChallengeTimer,
    closeChallengeSummary,
    setActiveTab,
  } = useDivisionStore();

  const [selectedMode, setSelectedMode] = useState<'quick' | 'standard' | 'hero'>('quick');
  const [selectedTables, setSelectedTables] = useState<number[]>([2, 3, 4, 5]);
  const [useTimer, setUseTimer] = useState<boolean>(true);
  const [includeInverse, setIncludeInverse] = useState<boolean>(true);
  const [onlyWeakFacts, setOnlyWeakFacts] = useState<boolean>(false);

  // Timer loop
  useEffect(() => {
    if (!challengeActive || !challengeConfig || challengeConfig.timeLimitSeconds <= 0) return;
    const interval = setInterval(() => {
      tickChallengeTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [challengeActive, challengeConfig, tickChallengeTimer]);

  const toggleTable = (t: number) => {
    setSelectedTables((prev) =>
      prev.includes(t) ? (prev.length > 1 ? prev.filter((x) => x !== t) : prev) : [...prev, t]
    );
  };

  const handleStart = () => {
    const qCount = selectedMode === 'quick' ? 10 : selectedMode === 'standard' ? 20 : 30;
    const timeLimit = useTimer ? (selectedMode === 'quick' ? 90 : selectedMode === 'standard' ? 150 : 240) : 0;

    startChallenge({
      mode: selectedMode,
      questionCount: qCount,
      selectedTables,
      includeMultiplicationRelationship: includeInverse,
      onlyWeakFacts,
      timeLimitSeconds: timeLimit,
    });
  };

  // If Challenge is active, show the challenge question runner
  if (challengeActive && challengeQuestions[challengeIndex]) {
    const currentQ = challengeQuestions[challengeIndex];
    const total = challengeQuestions.length;
    const progressPercent = Math.round(((challengeIndex + 1) / total) * 100);

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', color: '#f8fafc' }}>
        {/* Progress & Stats Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '12px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ fontWeight: 800, color: '#38bdf8' }}>
            Câu {challengeIndex + 1} / {total}
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ color: '#4ade80', fontWeight: 700 }}>✓ Đúng: {challengeCorrectCount}</span>
            <span style={{ color: '#f87171', fontWeight: 700 }}>✗ Sai: {challengeWrongCount}</span>
            {challengeConfig?.timeLimitSeconds ? (
              <span style={{ color: '#fbbf24', fontWeight: 900, background: 'rgba(245, 158, 11, 0.2)', padding: '4px 10px', borderRadius: '8px' }}>
                ⏱️ {challengeTimeRemaining}s
              </span>
            ) : null}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: '#38bdf8', transition: 'width 0.2s ease' }} />
        </div>

        {/* Question Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          }}
        >
          <div style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '16px' }}>
            {currentQ.prompt}
          </div>

          <div
            style={{
              fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
              fontSize: '2.4rem',
              fontWeight: 900,
              color: '#fef08a',
              marginBottom: '28px',
            }}
          >
            {currentQ.formulaDisplay}
          </div>

          {currentQ.options && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => submitChallengeAnswer(opt)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If Challenge is finished, show the Result Summary Modal
  if (challengeResult) {
    return (
      <div style={{ maxWidth: '640px', margin: '30px auto', color: '#f8fafc' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '2px solid #38bdf8',
            borderRadius: '24px',
            padding: '36px',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(56, 189, 248, 0.3)',
          }}
        >
          <div style={{ fontSize: '3.6rem', marginBottom: '8px' }}>
            {challengeResult.accuracyPercent >= 85 ? '👑' : '⭐'}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
              fontSize: '1.8rem',
              fontWeight: 900,
              color: '#38bdf8',
              marginBottom: '6px',
            }}
          >
            KẾT QUẢ THỬ THÁCH PHÉP CHIA
          </h2>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
            Chế độ: <strong>{challengeResult.mode.toUpperCase()}</strong> ({challengeResult.totalQuestions} câu)
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.7)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '24px',
            }}
          >
            <div>
              <div style={{ color: '#4ade80', fontSize: '1.5rem', fontWeight: 900 }}>
                {challengeResult.correctCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SỐ CÂU ĐÚNG</div>
            </div>
            <div>
              <div style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: 900 }}>
                {challengeResult.accuracyPercent}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ĐỘ CHÍNH XÁC</div>
            </div>
            <div>
              <div style={{ color: '#facc15', fontSize: '1.5rem', fontWeight: 900 }}>
                +{challengeResult.xpEarned} EXP
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>+{challengeResult.goldEarned} VÀNG</div>
            </div>
          </div>

          {/* Weak Facts List if any */}
          {challengeResult.weakFactsIdentified.length > 0 && (
            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.85rem', color: '#fb923c', fontWeight: 800, marginBottom: '8px' }}>
                ⚠️ Các phép chia Tony cần chú ý luyện thêm:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {challengeResult.weakFactsIdentified.map((fId) => {
                  const fact = DIVISION_FACTS.find((f) => f.id === fId);
                  if (!fact) return null;
                  return (
                    <span
                      key={fId}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid #ef4444',
                        color: '#fca5a5',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}
                    >
                      {fact.dividend} ÷ {fact.divisor} = {fact.quotient}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={closeChallengeSummary}
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Hoàn Thành
            </button>
            <button
              onClick={() => {
                closeChallengeSummary();
                setActiveTab('practice');
              }}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#cbd5e1',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Luyện Tập Thêm
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Setup Screen
  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', color: '#f8fafc' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
            fontSize: '1.6rem',
            color: '#38bdf8',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>🏆</span>
          <span>THỬ THÁCH PHÉP CHIA THEO CẤP ĐỘ</span>
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
          Lựa chọn chế độ thử thách phù hợp để kiểm tra phản xạ và sự tự tin của Tony đối với phép chia!
        </p>

        {/* Mode Selector */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, marginBottom: '10px' }}>
            1. CHỌN CHẾ ĐỘ THỬ THÁCH:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { id: 'quick', title: 'Nhanh (Quick)', count: 10, time: '90s', icon: '⚡' },
              { id: 'standard', title: 'Chuẩn (Standard)', count: 20, time: '150s', icon: '🎯' },
              { id: 'hero', title: 'Hiệp Sĩ (Hero)', count: 30, time: '240s', icon: '👑' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id as any)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: selectedMode === m.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                  border: selectedMode === m.id ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{m.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: selectedMode === m.id ? '#38bdf8' : '#ffffff' }}>
                  {m.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                  {m.count} câu • {m.time}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tables Selector */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, marginBottom: '10px' }}>
            2. CHỌN CÁC BẢNG CHIA:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {DIVISION_TABLES.map((t) => (
              <button
                key={t}
                onClick={() => toggleTable(t)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: selectedTables.includes(t) ? '#0284c7' : 'rgba(30, 41, 59, 0.7)',
                  border: selectedTables.includes(t) ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Options Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={useTimer}
              onChange={(e) => setUseTimer(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#38bdf8' }}
            />
            <span>Bật tính thời gian thử thách (rèn luyện phản xạ nhanh)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={includeInverse}
              onChange={(e) => setIncludeInverse(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#38bdf8' }}
            />
            <span>Bao gồm câu hỏi liên hệ Phép Nhân ↔ Phép Chia</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={onlyWeakFacts}
              onChange={(e) => setOnlyWeakFacts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#38bdf8' }}
            />
            <span>Chỉ tập trung vào các phép chia Tony thường làm sai</span>
          </label>
        </div>

        {/* Start Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleStart}
            style={{
              padding: '16px 48px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.2rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(56, 189, 248, 0.5)',
            }}
          >
            🚀 BẮT ĐẦU THỬ THÁCH NGAY
          </button>
        </div>
      </div>
    </div>
  );
};
