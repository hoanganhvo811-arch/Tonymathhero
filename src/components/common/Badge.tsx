import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'grade2' | 'grade3' | 'gold' | 'emerald' | 'locked' | 'default';
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  icon,
  size = 'md',
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    grade2: {
      background: 'rgba(56, 189, 248, 0.15)',
      color: '#7dd3fc',
      border: '1px solid rgba(56, 189, 248, 0.4)',
      boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)',
    },
    grade3: {
      background: 'rgba(239, 68, 68, 0.15)',
      color: '#fca5a5',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)',
    },
    gold: {
      background: 'rgba(250, 204, 21, 0.15)',
      color: '#fef08a',
      border: '1px solid rgba(250, 204, 21, 0.5)',
      boxShadow: '0 0 10px rgba(250, 204, 21, 0.2)',
    },
    emerald: {
      background: 'rgba(52, 211, 153, 0.15)',
      color: '#6ee7b7',
      border: '1px solid rgba(52, 211, 153, 0.4)',
    },
    locked: {
      background: 'rgba(100, 116, 139, 0.2)',
      color: '#94a3b8',
      border: '1px solid rgba(148, 163, 184, 0.3)',
    },
    default: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#e2e8f0',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '3px 8px', fontSize: '0.72rem' },
    md: { padding: '5px 12px', fontSize: '0.82rem' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '9999px',
        fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </span>
  );
};
