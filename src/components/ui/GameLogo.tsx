import React from 'react';

export interface GameLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  showTagline?: boolean;
  variant?: 'gold' | 'grade2' | 'grade3';
  className?: string;
  onClick?: () => void;
}

export const GameLogo: React.FC<GameLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showTagline = false,
  variant = 'gold',
  className = '',
  onClick,
}) => {
  // Dimensions per size
  const config = {
    sm: { width: 220, tonySize: '1.25rem', mathSize: '0.65rem', subSize: '0.55rem', swordScale: 0.6 },
    md: { width: 340, tonySize: '2.1rem', mathSize: '0.9rem', subSize: '0.72rem', swordScale: 0.8 },
    lg: { width: 480, tonySize: '3.0rem', mathSize: '1.2rem', subSize: '0.85rem', swordScale: 1.0 },
    hero: { width: 560, tonySize: '3.6rem', mathSize: '1.35rem', subSize: '0.95rem', swordScale: 1.2 },
  }[size];

  const gemColor = variant === 'grade2' ? '#38bdf8' : variant === 'grade3' ? '#f59e0b' : '#facc15';
  const gemGlow = variant === 'grade2' ? 'rgba(56, 189, 248, 0.8)' : 'rgba(250, 204, 21, 0.8)';

  return (
    <div
      className={`game-logo-container ${className}`}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        userSelect: 'none',
        cursor: onClick ? 'pointer' : 'default',
        maxWidth: `${config.width}px`,
        width: '100%',
      }}
    >
      {/* SVG Crest: Crossed Runic Blades & Radiant Knowledge Gem */}
      <svg
        viewBox="0 0 400 110"
        width="100%"
        height={60 * (config.swordScale || 1)}
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0 4px 14px rgba(0, 0, 0, 0.8))',
          marginBottom: '-12px',
        }}
      >
        <defs>
          <linearGradient id="goldBlade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff9c4" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="silverHilt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <radialGradient id="gemLight" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor={gemColor} />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Left Crossed Runic Blade */}
        <g transform="translate(200, 55) rotate(-35) translate(-200, -55)">
          {/* Blade Spine */}
          <polygon points="200,5 204,80 200,85 196,80" fill="url(#goldBlade)" />
          {/* Edge Shimmer */}
          <line x1="200" y1="5" x2="200" y2="80" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
          {/* Guard */}
          <rect x="186" y="80" width="28" height="5" rx="1.5" fill="url(#silverHilt)" />
          {/* Grip */}
          <rect x="198" y="85" width="4" height="15" rx="1" fill="#451a03" />
          {/* Pommel */}
          <circle cx="200" cy="103" r="3.5" fill="url(#goldBlade)" />
        </g>

        {/* Right Crossed Runic Blade */}
        <g transform="translate(200, 55) rotate(35) translate(-200, -55)">
          <polygon points="200,5 204,80 200,85 196,80" fill="url(#goldBlade)" />
          <line x1="200" y1="5" x2="200" y2="80" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
          <rect x="186" y="80" width="28" height="5" rx="1.5" fill="url(#silverHilt)" />
          <rect x="198" y="85" width="4" height="15" rx="1" fill="#451a03" />
          <circle cx="200" cy="103" r="3.5" fill="url(#goldBlade)" />
        </g>

        {/* Central Crown Arch */}
        <path
          d="M 160 55 Q 200 42 240 55 Q 200 48 160 55 Z"
          fill="url(#goldBlade)"
          filter="url(#logoGlow)"
        />

        {/* Central Knowledge Gem (Octagon / Diamond) */}
        <polygon
          points="200,32 214,46 200,60 186,46"
          fill="url(#gemLight)"
          stroke="#ffffff"
          strokeWidth="1.2"
          filter="url(#logoGlow)"
          style={{ filter: `drop-shadow(0 0 10px ${gemGlow})` }}
        />
        {/* Core Highlight */}
        <circle cx="200" cy="46" r="3" fill="#ffffff" opacity="0.9" />
      </svg>

      {/* Main "TONY" Chiseled Metallic Typography */}
      <div
        className="font-cinematic"
        style={{
          fontSize: config.tonySize,
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: '0.12em',
          background: 'linear-gradient(180deg, #fffbeb 0%, #fef08a 25%, #f59e0b 55%, #b45309 85%, #78350f 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 0 #3d1a04) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.9))',
          position: 'relative',
          padding: '0 8px',
          textTransform: 'uppercase',
        }}
      >
        TONY
      </div>

      {/* "MATH HERO" Sculpted Metallic Gold Banner Ribbon */}
      <div
        style={{
          marginTop: '2px',
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 28px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(30, 20, 8, 0.9) 15%, rgba(45, 28, 10, 0.95) 50%, rgba(30, 20, 8, 0.9) 85%, transparent 100%)',
          borderTop: '1.5px solid #fef08a',
          borderBottom: '1.5px solid #d97706',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        }}
      >
        {/* Left Wing Accent */}
        <span style={{ color: '#facc15', fontSize: '0.8em', marginRight: '8px' }}>✦</span>

        <span
          className="font-cinematic"
          style={{
            fontSize: config.mathSize,
            fontWeight: 800,
            letterSpacing: '0.22em',
            color: '#fef08a',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.9), 0 0 10px rgba(250, 204, 21, 0.5)',
            textTransform: 'uppercase',
          }}
        >
          MATH HERO
        </span>

        {/* Right Wing Accent */}
        <span style={{ color: '#facc15', fontSize: '0.8em', marginLeft: '8px' }}>✦</span>
      </div>

      {/* Subtitle: "THE LEGEND OF SEVEN KINGDOMS" */}
      {showSubtitle && (
        <div
          className="font-cinematic"
          style={{
            fontSize: config.subSize,
            fontWeight: 700,
            letterSpacing: '0.24em',
            color: '#cbd5e1',
            marginTop: '8px',
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.9)',
            textTransform: 'uppercase',
          }}
        >
          THE LEGEND OF SEVEN KINGDOMS
        </div>
      )}

      {/* Official Tagline: "THE POWER OF KNOWLEDGE. THE COURAGE OF A HERO." */}
      {showTagline && (
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            color: '#94a3b8',
            marginTop: '6px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>THE POWER OF KNOWLEDGE</span>
          <span style={{ color: '#facc15' }}>•</span>
          <span>THE COURAGE OF A HERO</span>
        </div>
      )}
    </div>
  );
};
