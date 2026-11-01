import React from 'react';
import {
  X,
  Sparkles,
  Sword,
  Shield,
  Heart,
  Lock,
  CheckCircle,
  Zap,
} from 'lucide-react';
import { useHeroInventoryStore } from '../../inventory/useInventoryStore';
import { useProgressStore } from '../../../game/state/useProgressStore';
import { useAudio } from '../../../hooks/useAudio';

interface SkillTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({ isOpen, onClose }) => {
  const { activeCampaignId, getSkills } = useHeroInventoryStore();
  const currentProgress = useProgressStore((state) => state.currentProgress);
  const heroLevel = currentProgress?.heroLevel || 1;
  const { playClick } = useAudio();

  if (!isOpen) return null;

  const skills = getSkills(activeCampaignId);

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
          background: 'linear-gradient(135deg, #09131f 0%, #0f1d30 100%)',
          border: '2px solid rgba(192, 132, 252, 0.4)',
          borderRadius: '24px',
          width: '96%',
          maxWidth: '860px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(192, 132, 252, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(192, 132, 252, 0.2)',
                border: '1px solid #c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc',
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', fontWeight: 800 }}>
                CÂY KỸ NĂNG HIỆP SĨ (SKILL TREE)
              </h2>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                Cấp độ hiện tại: <strong style={{ color: '#38bdf8' }}>Cấp {heroLevel}</strong> • Mở khóa kỹ năng tự động khi lên cấp
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Skill Cards List */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {skills.map((skill, idx) => {
            const isUnlocked = skill.isUnlocked;
            const skillIcon =
              skill.skillType === 'attack'
                ? '⚔️'
                : skill.skillType === 'magic'
                ? '🔮'
                : skill.skillType === 'defense'
                ? '🛡️'
                : '💚';

            return (
              <div
                key={skill.id}
                style={{
                  background: isUnlocked
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)'
                    : 'rgba(15, 23, 42, 0.4)',
                  border: isUnlocked ? '2px solid rgba(192, 132, 252, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  boxShadow: isUnlocked ? '0 8px 24px rgba(0, 0, 0, 0.4)' : 'none',
                  opacity: isUnlocked ? 1 : 0.65,
                  transition: 'all 0.2s',
                }}
              >
                {/* Level Node & Icon */}
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: isUnlocked ? 'rgba(192, 132, 252, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                    border: isUnlocked ? '2px solid #c084fc' : '1px solid #475569',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '1.8rem' }}>{skillIcon}</span>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: 800 }}>
                      {skill.name}
                    </h3>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>
                      ({skill.nameEn})
                    </span>
                    {isUnlocked ? (
                      <span
                        style={{
                          background: 'rgba(34, 197, 94, 0.2)',
                          color: '#4ade80',
                          border: '1px solid #22c55e',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <CheckCircle size={12} /> Đã Mở Khóa
                      </span>
                    ) : (
                      <span
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#fca5a5',
                          border: '1px solid #ef4444',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Lock size={12} /> Cần Cấp {skill.levelRequirement}
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '6px 0 8px 0', color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.4 }}>
                    {skill.description}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <span>
                      Tiêu hao:{' '}
                      <strong style={{ color: '#38bdf8' }}>
                        {skill.mpCost > 0 ? `${skill.mpCost} MP` : '0 MP'}
                      </strong>
                    </span>
                    {skill.damageMultiplier > 0 && (
                      <span>
                        Sát thương:{' '}
                        <strong style={{ color: '#f87171' }}>
                          {Math.round(skill.damageMultiplier * 100)}% ATK
                        </strong>
                      </span>
                    )}
                    {skill.healingAmount && (
                      <span>
                        Hồi phục:{' '}
                        <strong style={{ color: '#4ade80' }}>
                          +{skill.healingAmount} HP
                        </strong>
                      </span>
                    )}
                    {skill.defenseBuffPercent && (
                      <span>
                        Giảm sát thương:{' '}
                        <strong style={{ color: '#60a5fa' }}>
                          {skill.defenseBuffPercent}%
                        </strong>
                      </span>
                    )}
                    <span>
                      Hồi chiêu:{' '}
                      <strong style={{ color: '#fcd34d' }}>
                        {skill.cooldownTurns > 0 ? `${skill.cooldownTurns} lượt` : 'Tức thì'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
