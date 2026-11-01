import React from 'react';
import { Lock, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import type { Kingdom } from '@/types/kingdom';
import { SEVEN_KINGDOMS_3D_CONFIGS } from '@/data/kingdoms/sevenKingdoms3dConfig';

interface ProgressTimelineDockProps {
  kingdoms: Kingdom[];
  unlockedKingdomIds: string[];
  rescuedKingdomIds: string[];
  selectedKingdomId: string | null;
  currentKingdomId: string;
  onSelectKingdom: (kingdom: Kingdom) => void;
}

export const ProgressTimelineDock: React.FC<ProgressTimelineDockProps> = ({
  kingdoms,
  unlockedKingdomIds,
  rescuedKingdomIds,
  selectedKingdomId,
  currentKingdomId,
  onSelectKingdom,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(15, 23, 42, 0.92)',
        border: '1px solid rgba(251, 191, 36, 0.35)',
        borderRadius: '30px',
        padding: '6px 14px',
        boxShadow: '0 10px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(12px)',
        maxWidth: 'calc(100vw - 320px)',
        overflowX: 'auto',
      }}
    >
      {kingdoms.map((k, index) => {
        const conf = SEVEN_KINGDOMS_3D_CONFIGS[k.order] || SEVEN_KINGDOMS_3D_CONFIGS[1];
        const isUnlocked = unlockedKingdomIds.includes(k.id) || k.isUnlockedByDefault;
        const isRescued = rescuedKingdomIds.includes(k.id);
        const isSelected = selectedKingdomId === k.id;
        const isTonyHere = currentKingdomId === k.id;
        const theme = conf.colorTheme;

        return (
          <React.Fragment key={k.id}>
            <button
              onClick={() => onSelectKingdom(k)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                border: isSelected
                  ? `2px solid ${theme.accent}`
                  : isTonyHere
                  ? `1px solid #fbbf24`
                  : '1px solid transparent',
                background: isSelected
                  ? `linear-gradient(135deg, ${theme.primary}55, rgba(30, 41, 59, 0.9))`
                  : isUnlocked
                  ? 'rgba(30, 41, 59, 0.6)'
                  : 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isSelected
                  ? `0 0 14px ${theme.accent}`
                  : isTonyHere
                  ? '0 0 10px rgba(251, 191, 36, 0.5)'
                  : 'none',
                opacity: isUnlocked ? 1 : 0.6,
                transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = 'rgba(51, 65, 85, 0.8)';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = isUnlocked
                    ? 'rgba(30, 41, 59, 0.6)'
                    : 'rgba(15, 23, 42, 0.4)';
                }
              }}
            >
              {/* Order / Status Icon */}
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isRescued
                    ? '#10b981'
                    : isUnlocked
                    ? theme.primary
                    : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                {isRescued ? (
                  <CheckCircle size={13} color="#ffffff" />
                ) : isUnlocked ? (
                  k.order
                ) : (
                  <Lock size={11} color="#cbd5e1" />
                )}
              </div>

              {/* Title */}
              <span
                style={{
                  fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isSelected ? '#ffffff' : isUnlocked ? '#e2e8f0' : '#94a3b8',
                }}
              >
                K0{k.order} {conf.titleVi.split(' ')[0]}
              </span>

              {/* Tony location indicator */}
              {isTonyHere && (
                <span
                  title="Tony đang ở đây"
                  style={{
                    fontSize: '10px',
                    color: '#fbbf24',
                    background: 'rgba(251, 191, 36, 0.2)',
                    padding: '1px 5px',
                    borderRadius: '8px',
                    fontWeight: 700,
                  }}
                >
                  Tony
                </span>
              )}
            </button>

            {/* Connecting Chevron between nodes */}
            {index < kingdoms.length - 1 && (
              <ChevronRight
                size={14}
                color={isRescued ? '#10b981' : isUnlocked ? '#64748b' : '#334155'}
                style={{ opacity: 0.6 }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
