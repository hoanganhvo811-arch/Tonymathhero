import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Kingdom, KingdomLandmark } from '@/types/kingdom';
import { SEVEN_KINGDOMS_3D_CONFIGS } from '@/data/kingdoms/sevenKingdoms3dConfig';
import { LandmarkMarker } from './LandmarkMarker';

interface KingdomZoneProps {
  kingdom: Kingdom;
  isUnlocked: boolean;
  isRescued: boolean;
  isSelected: boolean;
  isCurrentTonyLocation: boolean;
  onSelectKingdom: (kingdom: Kingdom) => void;
  onSelectLandmark: (landmark: KingdomLandmark) => void;
}

export const KingdomZone: React.FC<KingdomZoneProps> = ({
  kingdom,
  isUnlocked,
  isRescued,
  isSelected,
  onSelectKingdom,
  onSelectLandmark,
}) => {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  const conf = SEVEN_KINGDOMS_3D_CONFIGS[kingdom.order] || SEVEN_KINGDOMS_3D_CONFIGS[1];
  const position = conf.worldPosition;
  const theme = conf.colorTheme;

  // Gentle rotation for kingdom magical boundary ring
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3;
    }
    if (beaconRef.current && isSelected) {
      beaconRef.current.rotation.y = t * 0.8;
    }
  });

  const landmarks = kingdom.landmarks || conf.landmarkDefaults;

  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Interactive Base Boundary Area */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectKingdom(kingdom);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          setHovered(false);
        }}
      >
        {/* Ground Magic Circle Rune */}
        <mesh
          ref={ringRef}
          position={[0, 0.08, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[6.5, 7.5, 32]} />
          <meshBasicMaterial
            color={isUnlocked ? theme.accent : '#64748b'}
            transparent
            opacity={isSelected ? 0.95 : hovered ? 0.75 : 0.35}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner Subtle Glow Disc */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[6.5, 24]} />
          <meshBasicMaterial
            color={isUnlocked ? theme.primary : '#334155'}
            transparent
            opacity={isSelected ? 0.25 : hovered ? 0.18 : 0.06}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Selection Vertical Spotlight Cylinder */}
        {isSelected && (
          <mesh ref={beaconRef} position={[0, 8, 0]}>
            <cylinderGeometry args={[2.5, 6.0, 16, 16, 1, true]} />
            <meshBasicMaterial
              color={theme.accent}
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Locked Kingdom Barrier Dome */}
        {!isUnlocked && (
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[7.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial
              color="#475569"
              transparent
              opacity={0.22}
              roughness={0.2}
              metalness={0.5}
              wireframe={true}
            />
          </mesh>
        )}

        {/* 3D Floating Kingdom Banner Nameplate */}
        <Html
          position={[0, 4.2, 0]}
          center
          distanceFactor={45}
          zIndexRange={[15, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: hovered || isSelected ? 'scale(1.15) translateY(-5px)' : 'scale(1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 14px',
              borderRadius: '16px',
              background: isSelected
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))'
                : 'rgba(15, 23, 42, 0.85)',
              border: isSelected
                ? `2px solid ${theme.accent}`
                : isUnlocked
                ? `1px solid ${theme.primary}88`
                : '1px solid #64748b66',
              boxShadow: isSelected
                ? `0 8px 24px rgba(0,0,0,0.8), 0 0 16px ${theme.accent}`
                : '0 4px 14px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(6px)',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Top row: Order & Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: isUnlocked ? theme.accent : '#94a3b8',
                  textTransform: 'uppercase',
                }}
              >
                VƯƠNG QUỐC 0{kingdom.order}
              </span>
              {isRescued ? (
                <span style={{ fontSize: '11px', color: '#34d399' }}>✓ ĐÃ GIẢI CỨU</span>
              ) : isUnlocked ? (
                <span style={{ fontSize: '10px', color: '#facc15' }}>✦ ĐANG THỬ THÁCH</span>
              ) : (
                <span style={{ fontSize: '10px', color: '#ef4444' }}>🔒 BỊ PHONG ẤN</span>
              )}
            </div>

            {/* Kingdom Name */}
            <div
              style={{
                fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
                fontSize: '14px',
                fontWeight: 800,
                color: isUnlocked ? '#ffffff' : '#cbd5e1',
                textShadow: isSelected ? `0 0 10px ${theme.accent}` : 'none',
              }}
            >
              {conf.titleVi}
            </div>

            {/* Math Topic preview badge */}
            <div
              style={{
                fontSize: '10px',
                color: '#94a3b8',
                maxWidth: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {kingdom.mathTopicShort}
            </div>
          </div>
        </Html>
      </group>

      {/* Render the 5 3D Landmark Markers for this Kingdom */}
      {landmarks.map((landmark) => (
        <LandmarkMarker
          key={landmark.id}
          landmark={landmark}
          isKingdomUnlocked={isUnlocked}
          onSelect={(lm) => onSelectLandmark(lm)}
        />
      ))}
    </group>
  );
};
