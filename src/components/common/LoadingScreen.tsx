import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Đang khởi tạo thế giới Seven Kingdoms...',
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, #0c1a30 0%, #060b14 70%, #020408 100%)',
        color: '#ffffff',
      }}
    >
      {/* Animated Emblem */}
      <div
        style={{
          position: 'relative',
          width: '90px',
          height: '90px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pulsing glow ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, transparent 70%)',
            animation: 'pulseGlow 2s infinite',
          }}
        />

        {/* Shield Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.6)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Shield size={34} color="#ffffff" />
        </div>
      </div>

      {/* Title */}
      <h2
        className="font-cinematic"
        style={{
          fontSize: '1.4rem',
          letterSpacing: '0.12em',
          fontWeight: 800,
          color: '#ffffff',
          marginBottom: '8px',
          textShadow: '0 0 16px rgba(56, 189, 248, 0.6)',
        }}
      >
        TONY MATH HERO
      </h2>

      {/* Message */}
      <p
        style={{
          fontSize: '0.9rem',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Sparkles size={16} color="#38bdf8" />
        {message}
      </p>

      {/* Progress Bar Line */}
      <div
        style={{
          width: '240px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          marginTop: '20px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #38bdf8 0%, #facc15 50%, #38bdf8 100%)',
            backgroundSize: '200% 100%',
            animation: 'rotateRune 2s linear infinite',
          }}
        />
      </div>
    </div>
  );
};
