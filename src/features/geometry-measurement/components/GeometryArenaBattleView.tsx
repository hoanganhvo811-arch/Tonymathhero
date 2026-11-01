import React, { useState } from 'react';
import { Swords, Shield, Zap, RotateCcw, Trophy } from 'lucide-react';

interface GeometryArenaBattleViewProps {
  bossHp: number;
  bossMaxHp: number;
  tonyHp: number;
  tonyMaxHp: number;
  battleLog: string[];
  isBattleVictory: boolean;
  onAttack: (isSuccess: boolean, moveNameVi: string) => void;
  onReset: () => void;
}

export const GeometryArenaBattleView: React.FC<GeometryArenaBattleViewProps> = ({
  bossHp,
  bossMaxHp,
  tonyHp,
  tonyMaxHp,
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

  const spells = [
    {
      name: 'Nhát Chém Thước Đo (Ruler Strike)',
      icon: '📏',
      dmg: 75,
      question: 'Muốn đo chiều dài một vật thật chính xác, ta phải đặt đầu vật trùng khít với vạch số mấy của thước?',
      options: ['Vạch số 1', 'Vạch số 0', 'Mép ngoài thước gỗ', 'Vạch số 2'],
      correct: 'Vạch số 0',
    },
    {
      name: 'Khiên Phép Góc Vuông Ê-ke',
      icon: '📐',
      dmg: 75,
      question: 'Để kiểm tra một góc có phải là góc vuông hay không, Tony dùng dụng cụ nào?',
      options: ['Thước dây', 'Cân đĩa', 'Thước ê-ke', 'Đồng hồ cát'],
      correct: 'Thước ê-ke',
    },
    {
      name: 'Bão Tố Khối Lập Phương',
      icon: '🧊',
      dmg: 75,
      question: 'Khối lập phương có tất cả bao nhiêu đỉnh và bao nhiêu cạnh?',
      options: ['6 đỉnh, 12 cạnh', '8 đỉnh, 12 cạnh', '8 đỉnh, 6 cạnh', '12 đỉnh, 8 cạnh'],
      correct: '8 đỉnh, 12 cạnh',
    },
    {
      name: 'Kim Thời Gian Xuyên Thấu',
      icon: '⏰',
      dmg: 75,
      question: 'Một giờ đồng hồ có bao nhiêu phút?',
      options: ['30 phút', '50 phút', '60 phút', '100 phút'],
      correct: '60 phút',
    },
  ];

  const handleSelectSpell = (spell: typeof spells[0]) => {
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
      {/* Arena Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 800 }}>
          <Swords size={22} />
          <span style={{ fontSize: '1.25rem' }}>ĐẤU TRƯỜNG TOÁN HỌC: BOSS GIGA GEOMETRICUS</span>
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
          <div style={{ fontSize: '3rem' }}>🗿</div>
          <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.1rem' }}>Giga Geometricus</div>
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
            Tony đã khuất phục hoàn toàn Ma Vương Hình Khối bằng tri thức hình học và đo lường!
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
            ⚡ Thử thách niệm chú [{activeSpellQuestion.spellName}]:
          </div>
          <p style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>
            {activeSpellQuestion.question}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {activeSpellQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSpell(opt)}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1.5px solid rgba(250, 204, 21, 0.4)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  fontWeight: 800,
                  fontSize: '0.9rem',
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
            ⚔️ Chọn chiêu thức hình học & đo lường để tấn công Boss:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {spells.map((s, idx) => (
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
                    Sát thương: {s.dmg} HP
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
