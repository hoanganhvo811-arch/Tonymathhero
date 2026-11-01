import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { SoundButton } from './SoundButton';
import { useAudio } from '@/hooks/useAudio';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
  variant?: 'default' | 'grade2' | 'grade3' | 'gold';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '560px',
  variant = 'default',
}) => {
  const { playClick } = useAudio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const borderColors: Record<string, string> = {
    default: 'rgba(255, 255, 255, 0.15)',
    grade2: 'rgba(56, 189, 248, 0.4)',
    grade3: 'rgba(239, 68, 68, 0.4)',
    gold: 'rgba(250, 204, 21, 0.45)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(5, 8, 16, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth,
          backgroundColor: 'rgba(15, 23, 42, 0.96)',
          border: `1px solid ${borderColors[variant]}`,
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
            }}
          >
            <div>
              {title && (
                <h3
                  className="font-cinematic"
                  style={{
                    fontSize: '1.25rem',
                    color: '#f8fafc',
                    letterSpacing: '0.06em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                  {subtitle}
                </p>
              )}
            </div>
            <SoundButton
              variant="ghost"
              size="sm"
              onClick={() => {
                playClick();
                onClose();
              }}
              style={{
                padding: '6px',
                borderRadius: '8px',
                color: '#94a3b8',
              }}
              aria-label="Đóng"
            >
              <X size={20} />
            </SoundButton>
          </div>
        )}

        {/* Content body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
