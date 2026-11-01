import React from 'react';
import { Award, Heart, Zap, Sword, Shield, Sparkles, Check } from 'lucide-react';
import { useAudio } from '../../../hooks/useAudio';

interface LevelUpModalProps {
  isOpen: boolean;
  oldLevel: number;
  newLevel: number;
  newSkillsUnlocked?: string[];
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  oldLevel,
  newLevel,
  newSkillsUnlocked = [],
  onClose,
}) => {
  if (!isOpen) return null;

  const hpGain = (newLevel - oldLevel) * 25;
  const mpGain = (newLevel - oldLevel) * 15;
  const atkGain = (newLevel - oldLevel) * 6;
  const defGain = (newLevel - oldLevel) * 4;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 110,
        padding: '20px',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #091e14 0%, #0f172a 100%)',
          border: '2px solid #fbbf24',
          borderRadius: '28px',
          padding: '32px 36px',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 45px rgba(251, 191, 36, 0.5)',
          animation: 'zoomIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '8px' }}>🌟</div>
        <div
          style={{
            fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
            color: '#fbbf24',
            fontSize: '2rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            textShadow: '0 0 16px rgba(251, 191, 36, 0.8)',
            marginBottom: '4px',
            textTransform: 'uppercase',
          }}
        >
          LÊN CẤP ĐỘ MỚI!
        </div>
        <div style={{ color: '#cbd5e1', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>
          Cấp {oldLevel} ➔ <span style={{ color: '#4ade80', fontSize: '1.25rem' }}>Cấp {newLevel}</span>
        </div>

        {/* Stat Increases Grid */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '18px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: 700, fontSize: '0.88rem' }}>
            <Heart size={16} /> Sinh Lực: +{hpGain} HP
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, fontSize: '0.88rem' }}>
            <Zap size={16} /> Năng Lượng: +{mpGain} MP
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700, fontSize: '0.88rem' }}>
            <Sword size={16} /> Tấn Công: +{atkGain} ATK
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: 700, fontSize: '0.88rem' }}>
            <Shield size={16} /> Phòng Thủ: +{defGain} DEF
          </div>
        </div>

        {/* Newly Unlocked Skills Announcement */}
        {newSkillsUnlocked.length > 0 && (
          <div
            style={{
              background: 'rgba(192, 132, 252, 0.15)',
              border: '1px solid #c084fc',
              borderRadius: '14px',
              padding: '12px 16px',
              marginBottom: '24px',
              textAlign: 'left',
            }}
          >
            <div style={{ color: '#e9d5ff', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
              ✨ KỸ NĂNG MỚI ĐÃ ĐƯỢC MỞ KHÓA:
            </div>
            {newSkillsUnlocked.map((skillName, idx) => (
              <div key={idx} style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', marginTop: '4px' }}>
                • {skillName}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            border: '2px solid #fbbf24',
            color: '#fff',
            borderRadius: '14px',
            padding: '12px 20px',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(217, 119, 6, 0.5)',
            transition: 'all 0.2s',
          }}
        >
          Tiếp Tục Phiêu Lưu!
        </button>
      </div>
    </div>
  );
};
