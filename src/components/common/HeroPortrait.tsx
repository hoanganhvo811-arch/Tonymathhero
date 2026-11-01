import React, { useState } from 'react';
import { Shield, Sparkles, Sword } from 'lucide-react';
import type { CampaignId } from '@/types';
import { HERO_IMAGES, HERO_AVATAR_FALLBACK_SVG } from '@/assets/images/heroImages';

export interface HeroPortraitProps {
  campaignId: CampaignId;
  size?: number;
  glow?: boolean;
  className?: string;
  showBadge?: boolean;
  mode?: 'full' | 'avatar' | 'showcase';
  customTitle?: string;
  interactive?: boolean;
}

export const HeroPortrait: React.FC<HeroPortraitProps> = ({
  campaignId,
  size = 280,
  glow = true,
  className = '',
  showBadge = true,
  mode = 'full',
  customTitle,
  interactive = true,
}) => {
  const isG2 = campaignId === 'grade-2';
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  // The official character image of Tony Warrior (with base64 offline bundling + SVG fallback)
  const heroImgSrc = imgError
    ? HERO_AVATAR_FALLBACK_SVG
    : (isG2 ? HERO_IMAGES.grade2 : HERO_IMAGES.grade3);

  // Grade 2: The Little Hero (Silver & Emerald Green explorer warrior)
  // Grade 3: The Legendary Hero (Royal Blue & Radiant Gold legendary warrior)
  const themeConfig = isG2
    ? {
        primary: '#10b981', // Emerald
        secondary: '#059669',
        accent: '#6ee7b7',
        silver: '#e2e8f0',
        glowColor: 'rgba(16, 185, 129, 0.7)',
        ambientGradient: 'linear-gradient(180deg, rgba(16, 185, 129, 0.15) 0%, transparent 40%, rgba(6, 35, 25, 0.9) 100%)',
        badgeBg: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
        borderColor: '#10b981',
        title: 'THE LITTLE HERO',
        subtitle: 'Giáp Bạc & Xanh Lục Khám Phá',
        weaponText: 'Kiếm Ánh Sáng Tập Sự • Khiên Dũng Khí Bạc',
        filterStyle: 'hue-rotate(65deg) saturate(1.22) contrast(1.08) brightness(1.02)',
      }
    : {
        primary: '#38bdf8', // Royal Blue
        secondary: '#0284c7',
        accent: '#facc15', // Radiant Gold
        silver: '#fef08a',
        glowColor: 'rgba(56, 189, 248, 0.75)',
        ambientGradient: 'linear-gradient(180deg, rgba(2, 132, 199, 0.15) 0%, transparent 40%, rgba(7, 30, 61, 0.9) 100%)',
        badgeBg: 'linear-gradient(90deg, #1e40af 0%, #0284c7 60%, #f59e0b 100%)',
        borderColor: '#facc15',
        title: 'THE LEGENDARY HERO',
        subtitle: 'Giáp Xanh Lam & Vàng Kim Huyền Thoại',
        weaponText: 'Thần Kiếm Mặt Trời • Khiên Quang Năng Vạn Số',
        filterStyle: 'hue-rotate(-15deg) saturate(1.3) contrast(1.12) brightness(1.02)',
      };

  // 1. AVATAR MODE (For Header HUD and compact cards)
  if (mode === 'avatar') {
    return (
      <div
        className={`hero-avatar-container ${className}`}
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${themeConfig.borderColor}`,
          boxShadow: glow ? `0 0 16px ${themeConfig.glowColor}` : '0 4px 12px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isG2 ? '#041f17' : '#071e3d',
          flexShrink: 0,
        }}
      >
        <img
          src={heroImgSrc}
          alt="Tony Warrior Avatar"
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%', // Focus on hero face & chestplate
            transform: 'scale(1.25)',
            filter: themeConfig.filterStyle,
          }}
        />
      </div>
    );
  }

  // 2. FULL / SHOWCASE MODE
  const width = size;
  const height = Math.round(size * 1.58);

  return (
    <div
      className={`hero-portrait-card ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{
        position: 'relative',
        width: `${width}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'none',
      }}
    >
      {/* Radiant Background Aura */}
      {glow && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            width: `${width * 0.95}px`,
            height: `${height * 0.8}px`,
            borderRadius: '28px',
            background: `radial-gradient(ellipse at 50% 50%, ${themeConfig.glowColor} 0%, transparent 72%)`,
            filter: 'blur(34px)',
            zIndex: 0,
            animation: 'pulseGlow 3.5s ease-in-out infinite',
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0.85,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Frame Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: `${height}px`,
          borderRadius: '24px',
          overflow: 'hidden',
          border: `2px solid ${themeConfig.borderColor}`,
          boxShadow: `0 18px 45px rgba(0, 0, 0, 0.85), inset 0 0 24px rgba(0, 0, 0, 0.5), 0 0 ${isHovered ? '32px' : '20px'} ${themeConfig.glowColor}`,
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(5, 8, 16, 0.98) 100%)',
        }}
      >
        {/* The Official Warrior Tony Photo with tailored Costume Shader Filter */}
        <img
          src={heroImgSrc}
          alt={`Chiến Binh Tony - ${themeConfig.title}`}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            filter: themeConfig.filterStyle,
            transform: isHovered ? 'scale(1.04)' : 'scale(1.0)',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Ambient Overlay Vignette & Atmosphere Gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: themeConfig.ambientGradient,
            pointerEvents: 'none',
          }}
        />

        {/* Floating Runic Corner Badge */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'rgba(10, 15, 29, 0.8)',
            backdropFilter: 'blur(8px)',
            padding: '5px 12px',
            borderRadius: '9999px',
            border: `1.5px solid ${themeConfig.accent}`,
            fontSize: '0.74rem',
            fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '0.08em',
            boxShadow: `0 0 14px ${themeConfig.glowColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sparkles size={13} color={themeConfig.accent} />
          <span>{isG2 ? 'LỚP 2' : 'LỚP 3'}</span>
        </div>

        {/* Bottom Lore & Equipment Plaque inside Image */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 14px 14px 14px',
            background: 'linear-gradient(0deg, rgba(5, 8, 16, 0.98) 0%, rgba(5, 8, 16, 0.75) 65%, transparent 100%)',
            textAlign: 'center',
          }}
        >
          <div
            className="font-cinematic"
            style={{
              fontSize: '1.1rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.08em',
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.95)',
            }}
          >
            TONY • CHIẾN BINH TOÁN HỌC
          </div>
          <div
            style={{
              fontSize: '0.78rem',
              color: themeConfig.accent,
              fontWeight: 700,
              letterSpacing: '0.05em',
              marginTop: '3px',
            }}
          >
            {themeConfig.subtitle}
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              color: '#cbd5e1',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Sword size={12} color={themeConfig.accent} />
            <span>{themeConfig.weaponText}</span>
          </div>
        </div>
      </div>

      {/* Floating Champion Badge Below Card */}
      {showBadge && (
        <div
          style={{
            position: 'relative',
            marginTop: '-16px',
            zIndex: 2,
            background: themeConfig.badgeBg,
            padding: '7px 20px',
            borderRadius: '9999px',
            border: `1.5px solid #ffffff`,
            boxShadow: `0 6px 20px rgba(0, 0, 0, 0.75), 0 0 16px ${themeConfig.glowColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Shield size={14} color="#ffffff" />
          <span
            className="font-cinematic"
            style={{
              fontSize: '0.84rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.08em',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.9)',
            }}
          >
            {customTitle || (isG2 ? 'TONY • THE LITTLE HERO' : 'TONY • THE LEGENDARY HERO')}
          </span>
        </div>
      )}
    </div>
  );
};
