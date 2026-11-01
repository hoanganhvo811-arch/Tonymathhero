import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'grade2' | 'grade3' | 'gold' | 'dark';
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  glow = false,
  className = '',
  style,
  onClick,
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'rgba(15, 23, 42, 0.85)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: glow ? '0 0 20px rgba(56, 189, 248, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
    },
    grade2: {
      background: 'linear-gradient(160deg, rgba(14, 34, 61, 0.9) 0%, rgba(7, 25, 47, 0.95) 100%)',
      border: '1px solid rgba(56, 189, 248, 0.35)',
      boxShadow: glow ? '0 0 25px rgba(56, 189, 248, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
    },
    grade3: {
      background: 'linear-gradient(160deg, rgba(46, 13, 13, 0.9) 0%, rgba(26, 8, 8, 0.95) 100%)',
      border: '1px solid rgba(239, 68, 68, 0.35)',
      boxShadow: glow ? '0 0 25px rgba(239, 68, 68, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
    },
    gold: {
      background: 'linear-gradient(160deg, rgba(45, 33, 11, 0.9) 0%, rgba(25, 18, 5, 0.95) 100%)',
      border: '1px solid rgba(250, 204, 21, 0.45)',
      boxShadow: glow ? '0 0 25px rgba(250, 204, 21, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
    },
    dark: {
      background: 'rgba(10, 15, 26, 0.92)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
    },
  };

  return (
    <div
      className={`game-card ${className}`}
      onClick={onClick}
      style={{
        borderRadius: '16px',
        padding: '24px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'all 0.25s ease',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </div>
  );
};
