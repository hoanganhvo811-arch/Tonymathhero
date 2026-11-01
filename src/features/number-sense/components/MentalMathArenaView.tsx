import React, { useState } from 'react';
import { Swords, Zap, RotateCcw, Trophy, Flame } from 'lucide-react';

interface MentalMathArenaViewProps {
  bossHp: number;
  bossMaxHp: number;
  tonyHp: number;
  tonyMaxHp: number;
  currentStreak: number;
  highestStreak: number;
  battleLog: string[];
  isBattleVictory: boolean;
  onAttack: (isSuccess: boolean, moveNameVi: string) => void;
  onReset: () => void;
}

export const MentalMathArenaView: React.FC<MentalMathArenaViewProps> = ({
  bossHp,
  bossMaxHp,
  tonyHp,
  tonyMaxHp,
  currentStreak,
  highestStreak,
  battleLog,
  isBattleVictory,
  onAttack,
  onReset,
}) => {
  const [activeSpellQuestion, setActiveSpellQuestion] = useState<{
    spellName: string;
    question: string;
    options: string[];
    correct: string;
  } | null>(null);

  const arenaSpells = [
    {
      name: 'Chưởng Bù Mười (Make Ten Strike)',
      icon: '💥',
      question: 'Tính nhẩm nhanh: 48 + 6 = ?',
      options: ['52', '54', '56', '58'],
      correct: '54',
    },
    {
      name: 'Kiếm Quang Bù Trừ (Compensation Slash)',
      icon: '⚡',
      question: 'Tính nhẩm nhanh: 73 - 19 = ?',
      options: ['52', '53', '54', '55'],
      correct: '54',
    },
    {
      name: 'Phân Tách Thừa Số (Distributive Blast)',
      icon: '🌪️',
      question: 'Tính nhẩm nhanh: 15 × 3 = ? (10 × 3 + 5 × 3)',
      options: ['40', '45', '50', '55'],
      correct: '45',
    },
    {
      name: 'Lôi Đình Đảo Nghịch (Inverse Fact Bolt)',
      icon: '🔮',
      question: 'Tính nhẩm nhanh: 56 : 7 = ?',
      options: ['6', '7', '8', '9'],
      correct: '8',
    },
  ];

  const handleSelectSpell = (spell: typeof arenaSpells[0]) => {
    setActiveSpellQuestion({
      spellName: spell.name,
      question: spell.question,
      options: spell.options,
      correct: spell.correct,
    });
  };

  const handleAnswerSpell = (ans: string) => {
    if (!activeSpellQuestion) return;
    const isCorrect = ans === activeSpellQuestion.correct;
    onAttack(isCorrect, activeSpellQuestion.spellName);
    setActiveSpellQuestion(null);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid #ef4444',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(239, 68, 68, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 800 }}>
          <Swords size={22} />
          <span style={{ fontSize: '1.25rem' }}>ĐẤU TRƯỜNG TÍNH NHẨM: BÓNG MA SỐ HỌC NUMEROR</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 800, fontSize: '0.9rem' }}>
            <Flame size={18} /> Chuỗi Combo: x{currentStreak} (Kỷ lục: x{highestStreak})
          </div>
          <button
            onClick={onReset}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <RotateCcw size={14} /> Tái đấu
          </button>
        </div>
      </div>

      {/* Versus Combat Stage */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '20px',
          alignItems: 'center',
          background: 'rgba(10, 15, 29, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        {/* Tony Card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '3rem' }}>🧙‍♂️</div>
          <div style={{ color: '#38bdf8', fontWeight: 900, fontSize: '1.1rem' }}>Hiệp Sĩ Tony</div>
          <div style={{ width: '100%', maxWidth: '180px', height: '10px', background: '#334155', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${(tonyHp / tonyMaxHp) * 100}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>HP: {tonyHp} / {tonyMaxHp}</span>
        </div>

        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ef4444' }}>VS</div>

        {/* Boss Card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '3rem' }}>👻</div>
          <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.1rem' }}>Bóng Ma Numeror</div>
          <div style={{ width: '100%', maxWidth: '180px', height: '10px', background: '#334155', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${(bossHp / bossMaxHp) * 100}%`, height: '100%', background: '#ef4444', transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>HP: {bossHp} / {bossMaxHp}</span>
        </div>
      </div>

      {/* Battle Log Box */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '12px',
          padding: '12px 16px',
          maxHeight: '90px',
          overflowY: 'auto',
          fontSize: '0.85rem',
          color: '#cbd5e1',
          lineHeight: '1.6',
        }}
      >
        {battleLog.slice(-3).map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>

      {/* Victory Banner */}
      {isBattleVictory ? (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '2px solid #10b981',
            borderRadius: '16px',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '6px' }}>🏆</div>
          <h3 style={{ color: '#34d399', fontSize: '1.5rem', fontWeight: 900 }}>
            CHIẾN THẮNG VANG DỘI!
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '4px' }}>
            Bóng Ma Số Học đã hoàn toàn bị khuất phục bởi tốc độ và độ chuẩn xác của tư duy tính nhẩm!
          </p>
          <div style={{ color: '#facc15', fontWeight: 800, marginTop: '10px' }}>
            ⭐ +250 EXP &nbsp;|&nbsp; 🪙 +120 Vàng
          </div>
        </div>
      ) : activeSpellQuestion ? (
        /* Spell Math Challenge Modal */
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.95)',
            border: '2px solid #facc15',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ color: '#facc15', fontWeight: 800, fontSize: '1rem' }}>
            ⚡ Thử thách tính nhẩm [{activeSpellQuestion.spellName}]:
          </div>
          <p style={{ color: '#f8fafc', fontSize: '1.15rem', fontWeight: 800 }}>
            {activeSpellQuestion.question}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {activeSpellQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSpell(opt)}
                style={{
                  padding: '14px 20px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1.5px solid rgba(250, 204, 21, 0.4)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Spells Grid */
        <div>
          <div style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 800, marginBottom: '10px' }}>
            ⚔️ Chọn chiến thuật tính nhẩm để tấn công Numeror:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {arenaSpells.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSpell(s)}
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                  border: '1.5px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{s.name}</div>
                  <div style={{ color: '#f87171', fontSize: '0.75rem', fontWeight: 700 }}>
                    Sát thương cơ bản: 60+ HP
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
