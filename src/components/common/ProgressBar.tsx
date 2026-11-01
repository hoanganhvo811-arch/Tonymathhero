import React from 'react';

export interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  sublabel?: string;
  variant?: 'exp' | 'hp' | 'gold' | 'grade2' | 'grade3';
  height?: number;
  showValues?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  sublabel,
  variant = 'exp',
  height = 10,
  showValues = true,
}) => {
  const safeMax = Math.max(1, max);
  const percentage = Math.min(100, Math.max(0, (value / safeMax) * 100));

  const variantGradients: Record<string, string> = {
    exp: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
    hp: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
    gold: 'linear-gradient(90deg, #facc15 0%, #ca8a04 100%)',
    grade2: 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)',
    grade3: 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)',
  };

  const glowColors: Record<string, string> = {
    exp: 'rgba(56, 189, 248, 0.4)',
    hp: 'rgba(34, 197, 94, 0.4)',
    gold: 'rgba(250, 204, 21, 0.4)',
    grade2: 'rgba(56, 189, 248, 0.4)',
    grade3: 'rgba(239, 68, 68, 0.4)',
  };

  return (
    <div style={{ width: '100%' }}>
      {(label || showValues) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
            fontSize: '0.8rem',
            color: '#cbd5e1',
          }}
        >
          <span>{label}</span>
          <span>{sublabel || (showValues ? `${value} / ${max}` : `${Math.round(percentage)}%`)}</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          borderRadius: `${height / 2}px`,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: variantGradients[variant],
            borderRadius: `${height / 2}px`,
            transition: 'width 0.4s ease-out',
            boxShadow: `0 0 10px ${glowColors[variant]}`,
          }}
        />
      </div>
    </div>
  );
};
