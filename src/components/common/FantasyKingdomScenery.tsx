import React from 'react';

export interface FantasyKingdomSceneryProps {
  timeOfDay?: 'sunset' | 'dusk' | 'night';
}

export const FantasyKingdomScenery: React.FC<FantasyKingdomSceneryProps> = ({
  timeOfDay = 'sunset',
}) => {
  return (
    <div
      className="fantasy-kingdom-scenery"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* 1. Deep Atmospheric Sky Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 35%, #2a1506 0%, #170d04 40%, #0c1527 80%, #050b14 100%)',
        }}
      />

      {/* 2. Golden Sunset Horizon Sunburst / Light Rays */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.28) 0%, rgba(245, 158, 11, 0.15) 45%, transparent 75%)',
          filter: 'blur(50px)',
        }}
      />

      {/* 3. SVG Scenic Landscape: Mountains, Grand Distant Castle, Forest & Winding River */}
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.9,
        }}
      >
        <defs>
          {/* Mountain gradients */}
          <linearGradient id="mountFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#451a03" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="mountMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#291508" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0b1329" stopOpacity="0.98" />
          </linearGradient>

          {/* Castle silhouette gradient */}
          <linearGradient id="castleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d1f0d" />
            <stop offset="60%" stopColor="#1a1c2e" />
            <stop offset="100%" stopColor="#070c18" />
          </linearGradient>

          {/* River glow gradient */}
          <linearGradient id="riverGlow" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
          </linearGradient>

          {/* Forest gradient */}
          <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14261d" />
            <stop offset="100%" stopColor="#040b08" />
          </linearGradient>
        </defs>

        {/* Layer 1: Distant Mountain Peaks */}
        <path
          d="M 0 680 L 180 540 L 420 620 L 720 480 L 960 580 L 1240 460 L 1500 560 L 1760 490 L 1920 600 L 1920 1080 L 0 1080 Z"
          fill="url(#mountFar)"
        />

        {/* Layer 2: Mid-range Jagged Ridges */}
        <path
          d="M 0 760 L 260 640 L 580 720 L 880 610 L 1100 680 L 1380 590 L 1680 700 L 1920 650 L 1920 1080 L 0 1080 Z"
          fill="url(#mountMid)"
        />

        {/* Layer 3: Grand Distant Castle Silhouette atop Central Ridge */}
        <g transform="translate(860, 430)">
          {/* Main Central Keep & Spire */}
          <rect x="80" y="70" width="40" height="90" fill="url(#castleGrad)" />
          <polygon points="100,20 80,70 120,70" fill="url(#castleGrad)" />
          {/* Spire Flag */}
          <polygon points="100,20 100,32 114,26" fill="#f59e0b" opacity="0.8" />

          {/* Left Tower */}
          <rect x="40" y="90" width="30" height="70" fill="url(#castleGrad)" />
          <polygon points="55,50 40,90 70,90" fill="url(#castleGrad)" />

          {/* Right Tower */}
          <rect x="130" y="90" width="30" height="70" fill="url(#castleGrad)" />
          <polygon points="145,50 130,90 160,90" fill="url(#castleGrad)" />

          {/* Outer Barbican Towers */}
          <rect x="10" y="115" width="22" height="45" fill="url(#castleGrad)" />
          <polygon points="21,80 10,115 32,115" fill="url(#castleGrad)" />

          <rect x="168" y="115" width="22" height="45" fill="url(#castleGrad)" />
          <polygon points="179,80 168,115 190,115" fill="url(#castleGrad)" />

          {/* Castle Walls & Battlements */}
          <rect x="25" y="125" width="150" height="35" fill="url(#castleGrad)" />
          {/* Crenellations */}
          <rect x="30" y="120" width="8" height="6" fill="url(#castleGrad)" />
          <rect x="46" y="120" width="8" height="6" fill="url(#castleGrad)" />
          <rect x="62" y="120" width="8" height="6" fill="url(#castleGrad)" />
          <rect x="130" y="120" width="8" height="6" fill="url(#castleGrad)" />
          <rect x="146" y="120" width="8" height="6" fill="url(#castleGrad)" />
          <rect x="162" y="120" width="8" height="6" fill="url(#castleGrad)" />

          {/* Castle Window Glows (Magical Yellow/Amber) */}
          <rect x="96" y="85" width="8" height="14" rx="3" fill="#fef08a" opacity="0.8" />
          <rect x="52" y="105" width="6" height="10" rx="2" fill="#fef08a" opacity="0.7" />
          <rect x="142" y="105" width="6" height="10" rx="2" fill="#fef08a" opacity="0.7" />
        </g>

        {/* Layer 4: Winding River Reflecting Sunset Skies */}
        <path
          d="M 980 620 Q 940 700 860 760 T 720 890 Q 600 980 400 1080 L 1050 1080 Q 940 960 980 870 Q 1020 780 1000 620 Z"
          fill="url(#riverGlow)"
        />

        {/* Layer 5: Foreground Forest Ridge */}
        <path
          d="M 0 840 Q 300 780 620 830 T 1200 810 Q 1550 820 1920 860 L 1920 1080 L 0 1080 Z"
          fill="url(#forestGrad)"
        />

        {/* Tree Pine Silhouettes on Horizon */}
        <g fill="#07140e">
          {[60, 140, 210, 310, 420, 520, 1380, 1460, 1560, 1680, 1780, 1860].map((x, i) => (
            <polygon
              key={`tree-${i}`}
              points={`${x},${810 + (i % 3) * 10} ${x - 14},${850 + (i % 3) * 10} ${x + 14},${850 + (i % 3) * 10}`}
            />
          ))}
        </g>

        {/* Ambient Ground Vignette at Bottom */}
        <rect x="0" y="920" width="1920" height="160" fill="url(#forestGrad)" opacity="0.95" />
      </svg>

      {/* Layer 6: Soft Horizon Fog / Mist */}
      <div
        style={{
          position: 'absolute',
          bottom: '22%',
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(245, 158, 11, 0.08) 50%, transparent 100%)',
          filter: 'blur(24px)',
        }}
      />
    </div>
  );
};
