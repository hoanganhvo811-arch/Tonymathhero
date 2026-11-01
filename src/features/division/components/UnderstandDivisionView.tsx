import React, { useState } from 'react';

export const UnderstandDivisionView: React.FC = () => {
  const [mode, setMode] = useState<'sharing' | 'grouping'>('sharing');
  const [totalItems, setTotalItems] = useState<number>(12);
  const [param, setParam] = useState<number>(3); // sharing: number of groups; grouping: items per group
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);

  // Calculation
  const quotient = Math.floor(totalItems / param);
  const remainder = totalItems % param;

  const itemEmojis = ['🍬', '🍎', '🪙', '💎', '⭐'];
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const emoji = itemEmojis[currentEmojiIndex];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Intro Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
            fontSize: '1.6rem',
            color: '#38bdf8',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>⚖️</span>
          <span>BẢN CHẤT PHÉP CHIA: CHIA ĐỀU & TẠO NHÓM</span>
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Phép chia là hành động chia một số lượng vật thể thành các phần <strong>hoàn toàn bằng nhau</strong>.
          Tony hãy chọn chế độ tương tác bên dưới để tự tay khám phá nhé!
        </p>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button
            onClick={() => setMode('sharing')}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '12px',
              border: mode === 'sharing' ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
              background: mode === 'sharing' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.6)',
              color: mode === 'sharing' ? '#38bdf8' : '#94a3b8',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>🤝</span>
            <span>1. CHIA ĐỀU (SHARING EQUALLY)</span>
          </button>
          <button
            onClick={() => setMode('grouping')}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '12px',
              border: mode === 'grouping' ? '2px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
              background: mode === 'grouping' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(15, 23, 42, 0.6)',
              color: mode === 'grouping' ? '#c084fc' : '#94a3b8',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>📦</span>
            <span>2. CHIA THEO NHÓM (MAKING GROUPS)</span>
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
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
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Tổng số vật thể:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[6, 8, 12, 15, 16, 20, 24].map((n) => (
              <button
                key={n}
                onClick={() => setTotalItems(n)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: totalItems === n ? '#38bdf8' : 'rgba(30, 41, 59, 0.8)',
                  color: totalItems === n ? '#0f172a' : '#ffffff',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
            {mode === 'sharing' ? 'Chia đều cho mấy nhóm?' : 'Mỗi nhóm có mấy vật phẩm?'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[2, 3, 4, 5, 6].map((p) => (
              <button
                key={p}
                onClick={() => setParam(p)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: param === p ? '#a855f7' : 'rgba(30, 41, 59, 0.8)',
                  color: param === p ? '#ffffff' : '#cbd5e1',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Đổi hình ảnh:</div>
          <button
            onClick={() => setCurrentEmojiIndex((i) => (i + 1) % itemEmojis.length)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
          >
            {emoji} Đổi vật thể
          </button>
        </div>
      </div>

      {/* Visual Workspace */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        }}
      >
        {/* Dynamic Formula Banner */}
        <div
          style={{
            textAlign: 'center',
            background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-game, 'Be Vietnam Pro', sans-serif)",
              fontSize: '2rem',
              fontWeight: 900,
              color: '#fef08a',
              letterSpacing: '0.05em',
            }}
          >
            {mode === 'sharing' ? (
              <span>
                {totalItems} ÷ {param} = <span style={{ color: '#4ade80' }}>{quotient}</span>
                {remainder > 0 && <span style={{ color: '#fb923c', fontSize: '1.4rem' }}> (dư {remainder})</span>}
              </span>
            ) : (
              <span>
                {totalItems} ÷ {param} = <span style={{ color: '#4ade80' }}>{quotient} nhóm</span>
                {remainder > 0 && <span style={{ color: '#fb923c', fontSize: '1.4rem' }}> (dư {remainder})</span>}
              </span>
            )}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.95rem', marginTop: '6px' }}>
            {mode === 'sharing'
              ? `Có ${totalItems} ${emoji} chia đều cho ${param} nhóm ➔ Mỗi nhóm nhận được chính xác ${quotient} ${emoji}.`
              : `Có ${totalItems} ${emoji}, cứ mỗi nhóm gom ${param} ${emoji} ➔ Tạo thành ${quotient} nhóm hoàn chỉnh.`}
          </div>
        </div>

        {/* Visual Item Buckets Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
            gap: '16px',
          }}
        >
          {Array.from({ length: mode === 'sharing' ? param : quotient }).map((_, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setActiveGroupIndex(idx)}
              onMouseLeave={() => setActiveGroupIndex(null)}
              style={{
                background:
                  activeGroupIndex === idx
                    ? 'rgba(56, 189, 248, 0.2)'
                    : 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: activeGroupIndex === idx ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                boxShadow: activeGroupIndex === idx ? '0 0 20px rgba(56, 189, 248, 0.4)' : 'none',
              }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#94a3b8',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                }}
              >
                Nhóm {idx + 1}
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '6px',
                  minHeight: '70px',
                  alignItems: 'center',
                }}
              >
                {Array.from({ length: mode === 'sharing' ? quotient : param }).map((_, itemIdx) => (
                  <span key={itemIdx} title={`Vật phẩm ${itemIdx + 1}`}>
                    {emoji}
                  </span>
                ))}
              </div>
              <div
                style={{
                  marginTop: '10px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#34d399',
                }}
              >
                {mode === 'sharing' ? `${quotient} cái` : `${param} cái/nhóm`}
              </div>
            </div>
          ))}
        </div>

        {/* Remainder display if any */}
        {remainder > 0 && (
          <div
            style={{
              marginTop: '20px',
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(234, 88, 12, 0.2)',
              border: '1px solid #f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>⚠️</span>
            <span style={{ color: '#fdba74', fontWeight: 600 }}>
              Còn dư <strong>{remainder}</strong> {emoji} chưa thể chia đều:
            </span>
            <span style={{ fontSize: '1.4rem' }}>{Array(remainder).fill(emoji).join(' ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
