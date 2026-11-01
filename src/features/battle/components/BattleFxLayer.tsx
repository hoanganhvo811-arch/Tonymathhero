import React from 'react';
import type { FloatingTextFx, CombatVisualFx } from '@/types/battle';

interface BattleFxLayerProps {
  floatingTexts: FloatingTextFx[];
  combatVisuals?: CombatVisualFx[];
  isScreenShaking?: boolean;
}

export const BattleFxLayer: React.FC<BattleFxLayerProps> = ({
  floatingTexts,
  combatVisuals = [],
  isScreenShaking = false,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 25,
        overflow: 'hidden',
        animation: isScreenShaking ? 'subtleScreenShake 0.4s ease-in-out' : 'none',
      }}
    >
      {/* 1. Combat Visual FX Animations */}
      {combatVisuals.map((fx) => {
        if (fx.type === 'sword_slash') {
          return (
            <div
              key={fx.id}
              style={{
                position: 'absolute',
                top: `${fx.y}%`,
                left: `${fx.x}%`,
                transform: 'translate(-50%, -50%) rotate(-35deg)',
                width: '160px',
                height: '8px',
                background: 'linear-gradient(90deg, transparent, #ffffff 40%, #fbbf24 70%, transparent)',
                boxShadow: '0 0 25px #facc15, 0 0 50px #ea580c',
                borderRadius: '50%',
                animation: 'slashSwipe 0.35s ease-out forwards',
              }}
            />
          );
        }

        if (fx.type === 'magic_projectile') {
          return (
            <div
              key={fx.id}
              style={{
                position: 'absolute',
                top: '42%',
                left: '28%',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ffffff 0%, #38bdf8 50%, #0284c7 100%)',
                boxShadow: '0 0 30px #38bdf8, 0 0 60px #0284c7',
                animation: 'projectileFly 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards',
              }}
            />
          );
        }

        if (fx.type === 'impact') {
          return (
            <div
              key={fx.id}
              style={{
                position: 'absolute',
                top: `${fx.y}%`,
                left: `${fx.x}%`,
                transform: 'translate(-50%, -50%)',
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                border: '3px solid #facc15',
                boxShadow: '0 0 40px #facc15, inset 0 0 20px #f59e0b',
                animation: 'impactExpand 0.4s ease-out forwards',
              }}
            />
          );
        }

        if (fx.type === 'shield') {
          return (
            <div
              key={fx.id}
              style={{
                position: 'absolute',
                top: '45%',
                left: '26%',
                transform: 'translate(-50%, -50%)',
                width: '140px',
                height: '180px',
                borderRadius: '50% 50% 40% 40%',
                background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.4) 0%, rgba(2, 132, 199, 0.1) 70%, transparent 100%)',
                border: '2px solid rgba(56, 189, 248, 0.85)',
                boxShadow: '0 0 35px rgba(56, 189, 248, 0.7)',
                animation: 'shieldPulse 0.6s ease-in-out forwards',
              }}
            />
          );
        }

        if (fx.type === 'heal') {
          return (
            <div
              key={fx.id}
              style={{
                position: 'absolute',
                top: '48%',
                left: '26%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '140px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 80%)',
                boxShadow: '0 0 40px rgba(34, 197, 94, 0.8)',
                animation: 'healAuraSpiral 0.8s ease-out forwards',
              }}
            />
          );
        }

        if (fx.type === 'phase_transition') {
          return (
            <div
              key={fx.id}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 74% 42%, rgba(239, 68, 68, 0.45) 0%, transparent 70%)',
                animation: 'phaseFlash 0.9s ease-out forwards',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  padding: '12px 32px',
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '2px solid #ef4444',
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.8)',
                  borderRadius: '12px',
                  color: '#fca5a5',
                  fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  animation: 'bannerPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
              >
                ⚠️ BOSS PHẪN NỘ! CHUYỂN GIAI ĐOẠN ⚠️
              </div>
            </div>
          );
        }

        if (fx.type === 'victory_explosion') {
          return (
            <div
              key={fx.id}
              style={{
                position: 'absolute',
                inset: 0,
                animation: 'victoryGlow 1.2s ease-out forwards',
                pointerEvents: 'none',
              }}
            />
          );
        }

        return null;
      })}

      {/* 2. Floating Numbers & Positive Feedback Text */}
      {floatingTexts.map((fx) => {
        const isTony = fx.target === 'player';
        return (
          <div
            key={fx.id}
            style={{
              position: 'absolute',
              top: '38%',
              left: isTony ? '26%' : '74%',
              transform: 'translate(-50%, -50%)',
              color: fx.color,
              fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
              fontSize: fx.isCritical ? '2.4rem' : '1.85rem',
              fontWeight: 900,
              textShadow: '0 0 14px rgba(0,0,0,0.95), 0 0 24px rgba(0,0,0,0.85), 2px 2px 0 #000',
              animation: 'floatUpAndFade 1.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}
          >
            {fx.text}
          </div>
        );
      })}

      <style>{`
        @keyframes floatUpAndFade {
          0% {
            opacity: 0;
            transform: translate(-50%, 0) scale(0.6);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -25px) scale(1.15);
          }
          65% {
            opacity: 1;
            transform: translate(-50%, -55px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -90px) scale(0.85);
          }
        }

        @keyframes slashSwipe {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(-35deg) scaleX(0.2);
          }
          40% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(-35deg) scaleX(1.4);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(-35deg) scaleX(1.8);
          }
        }

        @keyframes projectileFly {
          0% {
            left: 28%;
            opacity: 1;
            transform: scale(0.8);
          }
          80% {
            left: 70%;
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            left: 74%;
            opacity: 0;
            transform: scale(1.6);
          }
        }

        @keyframes impactExpand {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.6);
          }
        }

        @keyframes shieldPulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.7);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }

        @keyframes healAuraSpiral {
          0% {
            opacity: 0;
            transform: translate(-50%, 20px) scale(0.6);
          }
          40% {
            opacity: 1;
            transform: translate(-50%, -20px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -60px) scale(1.3);
          }
        }

        @keyframes phaseFlash {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes bannerPop {
          0% { transform: scale(0.7); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1.0); opacity: 1; }
        }

        @keyframes victoryGlow {
          0% { background: rgba(250, 204, 21, 0.4); }
          100% { background: transparent; }
        }

        @keyframes subtleScreenShake {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-4px, 3px); }
          40% { transform: translate(4px, -3px); }
          60% { transform: translate(-3px, -2px); }
          80% { transform: translate(3px, 2px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
};
