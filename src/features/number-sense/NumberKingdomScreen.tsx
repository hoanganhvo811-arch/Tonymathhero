import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Brain,
  Trees,
  Swords,
  HelpCircle,
  BarChart3,
  Flame,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useNumberSenseStore, type NumberKingdomZone } from './useNumberSenseStore';
import { PLACE_VALUE_TASKS } from './data/placeValueCatalog';
import { PlaceValueBuilderView } from './components/PlaceValueBuilderView';
import { MentalStrategyLabView } from './components/MentalStrategyLabView';
import { NumberPatternsForestView } from './components/NumberPatternsForestView';
import { MentalMathArenaView } from './components/MentalMathArenaView';
import { NumberSenseAnalyticsView } from './components/NumberSenseAnalyticsView';
import { SoundButton } from '@/components/common/SoundButton';

export const NumberKingdomScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeZone,
    setActiveZone,
    campaignId,
    setCampaignId,
    activePlaceValueTask,
    selectPlaceValueTask,
    placedBlocks,
    placeValueFeedback,
    addBlock,
    removeBlock,
    resetBlocks,
    submitPlaceValueCheck,
    activeStrategy,
    strategyFeedback,
    selectStrategy,
    submitStrategyPractice,
    activePattern,
    patternFeedback,
    selectPattern,
    submitPatternAnswer,
    bossHp,
    bossMaxHp,
    tonyHp,
    tonyMaxHp,
    currentStreak,
    highestStreak,
    battleLog,
    isBattleVictory,
    attackArenaBoss,
    resetArenaBattle,
    currentPuzzle,
    solvedPuzzleIds,
    nextAdaptivePuzzle,
    submitPuzzleAnswer,
    totalExp,
    totalGold,
    loadProgress,
  } = useNumberSenseStore();

  useEffect(() => {
    loadProgress('student_tony_hero', campaignId);
  }, [campaignId]);

  const [selectedPuzzleOption, setSelectedPuzzleOption] = React.useState<string | null>(null);
  const [puzzleAnswered, setPuzzleAnswered] = React.useState<boolean>(false);

  const zones: { id: NumberKingdomZone | 'puzzles'; label: string; icon: React.ReactNode }[] = [
    { id: 'tower', label: 'Tháp Giá Trị Hàng', icon: <Building2 size={18} /> },
    { id: 'strategy', label: 'Chiến Lược Tính Nhẩm', icon: <Brain size={18} /> },
    { id: 'forest', label: 'Rừng Quy Luật Số', icon: <Trees size={18} /> },
    { id: 'arena', label: 'Đấu Trường Nhẩm', icon: <Swords size={18} /> },
    { id: 'puzzles', label: 'Hang Động Câu Đố', icon: <HelpCircle size={18} /> },
    { id: 'analytics', label: 'Hồ Sơ Năng Lực', icon: <BarChart3 size={18} /> },
  ];

  const handlePuzzleSelect = (opt: string) => {
    if (puzzleAnswered) return;
    setSelectedPuzzleOption(opt);
    submitPuzzleAnswer(opt);
    setPuzzleAnswered(true);
  };

  const handleNextPuzzle = () => {
    setSelectedPuzzleOption(null);
    setPuzzleAnswered(false);
    nextAdaptivePuzzle();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, #17102e 0%, #0c081c 50%, #030208 100%)',
        color: '#f8fafc',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
      }}
    >
      {/* Top Navigation & Status Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '14px 20px',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <SoundButton
            variant="secondary"
            size="sm"
            onClick={() => navigate('/map')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} /> Bản Đồ Thế Giới
          </SoundButton>

          <div>
            <h1
              style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: '#c084fc',
                letterSpacing: '0.04em',
                margin: 0,
              }}
            >
              🔢 VƯƠNG QUỐC TƯ DUY SỐ VÀ TÍNH NHẨM
            </h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              Number Sense & Mental Math Kingdom – Cấu tạo số, tách ghép số & chiến lược nhẩm thần tốc
            </p>
          </div>
        </div>

        {/* Grade Switcher & EXP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.8)', padding: '3px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setCampaignId('grade-2')}
              style={{
                background: campaignId === 'grade-2' ? '#10b981' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '9px',
                padding: '6px 14px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Lớp 2 (Hiệp Sĩ Nhí)
            </button>
            <button
              onClick={() => setCampaignId('grade-3')}
              style={{
                background: campaignId === 'grade-3' ? '#8b5cf6' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '9px',
                padding: '6px 14px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Lớp 3 (Đại Hiệp Sĩ)
            </button>
          </div>

          <div style={{ background: 'rgba(250, 204, 21, 0.15)', border: '1px solid #facc15', borderRadius: '12px', padding: '6px 14px', color: '#facc15', fontWeight: 800, fontSize: '0.85rem' }}>
            ⭐ +{totalExp} EXP &nbsp;|&nbsp; 🪙 +{totalGold} Vàng
          </div>
        </div>
      </div>

      {/* Zone Tabs Selector */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {zones.map((z) => {
          const isActive = activeZone === (z.id as any);
          return (
            <button
              key={z.id}
              onClick={() => setActiveZone(z.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '14px',
                background: isActive
                  ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
                  : 'rgba(15, 23, 42, 0.7)',
                color: isActive ? '#fff' : '#cbd5e1',
                border: isActive ? '1.5px solid #a78bfa' : '1px solid rgba(255, 255, 255, 0.1)',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 4px 14px rgba(124, 58, 237, 0.4)' : 'none',
              }}
            >
              {z.icon}
              <span>{z.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Zone Content */}
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {/* ZONE 1: PLACE VALUE TOWER */}
        {activeZone === 'tower' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Task selector pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PLACE_VALUE_TASKS.filter((t) => t.gradeLevel === campaignId).map((t) => {
                const isSel = activePlaceValueTask.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => selectPlaceValueTask(t.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: isSel ? '#8b5cf6' : 'rgba(30, 41, 59, 0.8)',
                      color: '#fff',
                      border: isSel ? '1.5px solid #c084fc' : '1px solid rgba(255,255,255,0.1)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Xây dựng: {t.targetNumber}
                  </button>
                );
              })}
            </div>

            <PlaceValueBuilderView
              task={activePlaceValueTask}
              placedBlocks={placedBlocks}
              feedback={placeValueFeedback}
              onAddBlock={addBlock}
              onRemoveBlock={removeBlock}
              onReset={resetBlocks}
              onSubmit={submitPlaceValueCheck}
            />
          </div>
        )}

        {/* ZONE 2: MENTAL STRATEGY LAB */}
        {activeZone === 'strategy' && (
          <MentalStrategyLabView
            activeStrategy={activeStrategy}
            feedback={strategyFeedback}
            onSelectStrategy={selectStrategy}
            onSubmitPractice={submitStrategyPractice}
          />
        )}

        {/* ZONE 3: NUMBER PATTERN FOREST */}
        {activeZone === 'forest' && (
          <NumberPatternsForestView
            activePattern={activePattern}
            feedback={patternFeedback}
            onSelectPattern={selectPattern}
            onSubmitAnswer={submitPatternAnswer}
          />
        )}

        {/* ZONE 4: MENTAL MATH ARENA */}
        {activeZone === 'arena' && (
          <MentalMathArenaView
            bossHp={bossHp}
            bossMaxHp={bossMaxHp}
            tonyHp={tonyHp}
            tonyMaxHp={tonyMaxHp}
            currentStreak={currentStreak}
            highestStreak={highestStreak}
            battleLog={battleLog}
            isBattleVictory={isBattleVictory}
            onAttack={attackArenaBoss}
            onReset={resetArenaBattle}
          />
        )}

        {/* ZONE 5: LOGIC PUZZLE CAVE */}
        {activeZone === ('puzzles' as any) && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
              border: '2px solid #f59e0b',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ color: '#fbbf24', fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>
                  🧩 Hang Động Câu Đố Tư Duy Số ({currentPuzzle.gradeLevel === 'grade-3' ? 'Lớp 3' : 'Lớp 2'})
                </h3>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Kỹ năng: {currentPuzzle.skill}</span>
              </div>
              <div style={{ color: '#facc15', fontSize: '0.85rem', fontWeight: 800 }}>
                Đã giải: {solvedPuzzleIds.length} câu
              </div>
            </div>

            <div style={{ background: 'rgba(10, 15, 29, 0.8)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ color: '#f8fafc', fontSize: '1.15rem', fontWeight: 800, margin: 0, lineHeight: '1.6' }}>
                {currentPuzzle.questionText}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {currentPuzzle.options.map((opt, idx) => {
                const isSelected = selectedPuzzleOption === opt;
                const isCorrect = opt === currentPuzzle.correctAnswer;
                let bg = 'rgba(30, 41, 59, 0.7)';
                let border = '1px solid rgba(255, 255, 255, 0.12)';
                let color = '#cbd5e1';

                if (puzzleAnswered) {
                  if (isCorrect) {
                    bg = 'rgba(16, 185, 129, 0.25)';
                    border = '2px solid #10b981';
                    color = '#34d399';
                  } else if (isSelected) {
                    bg = 'rgba(239, 68, 68, 0.25)';
                    border = '2px solid #ef4444';
                    color = '#f87171';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handlePuzzleSelect(opt)}
                    style={{
                      background: bg,
                      border,
                      borderRadius: '12px',
                      padding: '14px 18px',
                      color,
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: puzzleAnswered ? 'default' : 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {String.fromCharCode(65 + idx)}. {opt}
                  </button>
                );
              })}
            </div>

            {puzzleAnswered && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                  {currentPuzzle.explanationVi}
                </span>
                <button
                  onClick={handleNextPuzzle}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Câu Tiếp Theo <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ZONE 6: ANALYTICS & DASHBOARD */}
        {activeZone === 'analytics' && <NumberSenseAnalyticsView />}
      </div>
    </div>
  );
};
