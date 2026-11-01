import React, { useState } from 'react';
import { useAudio } from '@/hooks/useAudio';

export interface SoundButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'fantasy-gold' | 'danger' | 'ghost' | 'grade2' | 'grade3';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
}

export const SoundButton: React.FC<SoundButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  glow = false,
  className = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled,
  style,
  ...props
}) => {
  const { playHover, playClick } = useAudio();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      setIsHovered(true);
      playHover();
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      playClick();
    }
    onClick?.(e);
  };

  // Base styling
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
    fontWeight: 800,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    opacity: disabled ? 0.45 : 1,
    filter: disabled ? 'grayscale(0.7)' : 'none',
    transform: isHovered && !disabled ? 'translateY(-2px) scale(1.02)' : 'none',
    ...style,
  };

  // Size styling
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '8px 18px', fontSize: '0.8rem' },
    md: { padding: '12px 26px', fontSize: '0.95rem' },
    lg: { padding: '15px 36px', fontSize: '1.1rem' },
    xl: { padding: '18px 48px', fontSize: '1.25rem' },
  };

  // Variant styling
  const variantStyles: Record<string, React.CSSProperties> = {
    'fantasy-gold': {
      background: isHovered
        ? 'linear-gradient(180deg, #fffbeb 0%, #fef08a 30%, #f59e0b 70%, #b45309 100%)'
        : 'linear-gradient(180deg, #fef08a 0%, #facc15 25%, #d97706 70%, #92400e 100%)',
      color: '#381a04',
      border: '1.5px solid #fffbeb',
      boxShadow: isHovered
        ? '0 8px 24px rgba(245, 158, 11, 0.6), 0 0 20px rgba(254, 240, 138, 0.8), inset 0 1px 0 #ffffff'
        : '0 6px 18px rgba(0, 0, 0, 0.65), 0 0 12px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
      textShadow: '0 1px 0 rgba(255, 255, 255, 0.6)',
    },
    gold: {
      background: 'linear-gradient(180deg, #facc15 0%, #ca8a04 100%)',
      color: '#422006',
      border: '1px solid #fef08a',
      boxShadow: glow ? '0 0 24px rgba(250, 204, 21, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.6)' : '0 4px 14px rgba(202, 138, 4, 0.4)',
      textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)',
    },
    primary: {
      background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
      color: '#ffffff',
      border: '1px solid #7dd3fc',
      boxShadow: glow ? '0 0 20px rgba(56, 189, 248, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(2, 132, 199, 0.4)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
    },
    grade2: {
      background: 'linear-gradient(180deg, #34d399 0%, #059669 60%, #047857 100%)',
      color: '#ffffff',
      border: '1.5px solid #a7f3d0',
      boxShadow: isHovered
        ? '0 0 24px rgba(52, 211, 153, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
        : '0 4px 14px rgba(5, 150, 105, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
    },
    grade3: {
      background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 60%, #1e40af 100%)',
      color: '#ffffff',
      border: '1.5px solid #facc15',
      boxShadow: isHovered
        ? '0 0 24px rgba(56, 189, 248, 0.7), 0 0 12px rgba(250, 204, 21, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
        : '0 4px 14px rgba(2, 132, 199, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
    },
    secondary: {
      background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
      color: '#e2e8f0',
      border: '1.5px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    },
    danger: {
      background: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)',
      color: '#ffffff',
      border: '1px solid #fca5a5',
      boxShadow: '0 4px 14px rgba(185, 28, 28, 0.4)',
    },
    ghost: {
      background: 'transparent',
      color: '#94a3b8',
      border: '1px solid transparent',
    },
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <button
      className={`sound-btn ${className}`}
      style={combinedStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
    </button>
  );
};
