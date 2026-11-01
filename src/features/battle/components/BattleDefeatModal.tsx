import React from 'react';
import type { Monster } from '@/types/monster';

interface BattleDefeatModalProps {
  isOpen: boolean;
  monster: Monster;
  onRetry: () => void;
  onReturnVillage: () => void;
}

export const BattleDefeatModal: React.FC<BattleDefeatModalProps> = ({
  isOpen,
  monster,
  onRetry,
  onReturnVillage,
}) => {
  if (!isOpen) return null;

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
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          border: '2px solid #ef4444',
          borderRadius: '28px',
          padding: '32px 36px',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 32px rgba(239, 68, 68, 0.3)',
          animation: 'fadeIn 0.35s ease',
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🛡️</div>
        <div
          style={{
            fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Segoe UI', -apple-system, sans-serif)",
            color: '#f87171',
            fontSize: '1.75rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            marginBottom: '6px',
            textTransform: 'uppercase',
          }}
        >
          HIỆP SĨ CẦN NGHỈ NGƠI!
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
          Sinh lực của Tony đã cạn kiệt trước <strong>{monster.name}</strong>. Đừng nản lòng, bất kỳ hiệp sĩ vĩ đại nào cũng phải trải qua những lần thử thách để rèn luyện ý chí và trí tuệ!
        </p>

        {/* Tip Box */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '14px',
            padding: '12px 18px',
            marginBottom: '24px',
            color: '#fef3c7',
            fontSize: '0.85rem',
            lineHeight: 1.4,
            border: '1px solid rgba(251, 191, 36, 0.2)',
          }}
        >
          💡 <strong>Mẹo Hiệp Sĩ:</strong> Quái vật này đặc biệt yếu trước phép tính{' '}
          <span style={{ color: '#38bdf8' }}>{monster.weaknessMathTopic}</span>. Hãy đọc kỹ đề và tính cẩn thận từng hàng nhé!
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '14px' }}>
          <button
            onClick={onRetry}
            style={{
              flex: 1.2,
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              border: '2px solid #ef4444',
              color: '#fff',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)',
              transition: 'all 0.2s',
            }}
          >
            🔥 Thử Lại Ngay (Hồi phục HP)
          </button>
          <button
            onClick={onReturnVillage}
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
            🏡 Về Ngôi Làng
          </button>
        </div>
      </div>
    </div>
  );
};
