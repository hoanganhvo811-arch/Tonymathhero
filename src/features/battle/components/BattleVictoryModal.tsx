import React from 'react';
import type { Monster } from '@/types/monster';

interface BattleVictoryModalProps {
  isOpen: boolean;
  monster: Monster;
  expGained: number;
  goldGained: number;
  consecutiveMistakes: number;
  onContinueExploration: () => void;
  onReturnMap: () => void;
}

export const BattleVictoryModal: React.FC<BattleVictoryModalProps> = ({
  isOpen,
  monster,
  expGained,
  goldGained,
  consecutiveMistakes,
  onContinueExploration,
  onReturnMap,
}) => {
  if (!isOpen) return null;

  // Star rating
  const stars = consecutiveMistakes === 0 ? 3 : consecutiveMistakes === 1 ? 2 : 1;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #091e14 0%, #0f172a 100%)',
          border: '2px solid #10b981',
          borderRadius: '28px',
          padding: '32px 36px',
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(16, 185, 129, 0.4)',
          animation: 'zoomIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Victory Ribbon & Trophy */}
        <div style={{ fontSize: '3.6rem', marginBottom: '8px' }}>🏆</div>
        <div
          style={{
            fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Segoe UI', -apple-system, sans-serif)",
            color: '#34d399',
            fontSize: 'clamp(1.35rem, 3.5vw, 1.9rem)',
            fontWeight: 900,
            lineHeight: 1.3,
            letterSpacing: '0.04em',
            textShadow: '0 0 16px rgba(52, 211, 153, 0.6)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            whiteSpace: 'normal',
          }}
        >
          CHIẾN THẮNG VANG DỘI!
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '16px' }}>
          Bạn đã khuất phục thành công <strong>{monster.name}</strong> bằng sức mạnh của tri thức!
        </p>

        {/* Stars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '2.2rem', marginBottom: '20px' }}>
          <span style={{ color: stars >= 1 ? '#fbbf24' : '#475569', textShadow: stars >= 1 ? '0 0 12px #f59e0b' : 'none' }}>★</span>
          <span style={{ color: stars >= 2 ? '#fbbf24' : '#475569', textShadow: stars >= 2 ? '0 0 12px #f59e0b' : 'none' }}>★</span>
          <span style={{ color: stars >= 3 ? '#fbbf24' : '#475569', textShadow: stars >= 3 ? '0 0 12px #f59e0b' : 'none' }}>★</span>
        </div>

        {/* Rewards Box */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <div style={{ fontSize: '1.4rem', marginBottom: '2px' }}>⭐</div>
            <div style={{ color: '#38bdf8', fontSize: '1.15rem', fontWeight: 800 }}>+{expGained}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600 }}>KINH NGHIỆM (EXP)</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <div>
            <div style={{ fontSize: '1.4rem', marginBottom: '2px' }}>💰</div>
            <div style={{ color: '#f59e0b', fontSize: '1.15rem', fontWeight: 800 }}>+{goldGained}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600 }}>VÀNG THƯỞNG (GOLD)</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px' }}>
          <button
            onClick={onContinueExploration}
            style={{
              flex: 1.2,
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              border: '2px solid #34d399',
              color: '#fff',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(5, 150, 105, 0.4)',
              transition: 'all 0.2s',
            }}
          >
            🗺️ Tiếp Tục Thám Hiểm
          </button>
          <button
            onClick={onReturnMap}
            style={{
              flex: 1,
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#cbd5e1',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            🏰 Bản Đồ Thế Giới
          </button>
        </div>
      </div>
    </div>
  );
};
