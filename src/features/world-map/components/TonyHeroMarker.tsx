import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { CampaignId } from '@/types';
import { getHeroImage, HERO_AVATAR_FALLBACK_SVG } from '@/assets/images/heroImages';

interface TonyHeroMarkerProps {
  position: [number, number, number];
  heroLevel: number;
  campaignId: CampaignId;
}

export const TonyHeroMarker: React.FC<TonyHeroMarkerProps> = ({
  position,
  heroLevel,
  campaignId,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  const isG2 = campaignId === 'grade-2';
  const heroColor = isG2 ? '#34d399' : '#38bdf8';
  const heroAvatar = getHeroImage(campaignId);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating hover
      groupRef.current.position.y = position[1] + 2.0 + Math.sin(t * 2.2) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.5;
    }
    if (beaconRef.current) {
      beaconRef.current.rotation.y = t * 0.8;
    }
  });

  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Ground Celestial Pedestal Aura */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.8, 32]} />
        <meshBasicMaterial
          color={heroColor}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rotating Hero Crest Ring */}
      <mesh ref={ringRef} position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 1.1, 16]} />
        <meshBasicMaterial
          color="#facc15"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical Hero Beacon Ray */}
      <mesh ref={beaconRef} position={[0, 9, 0]}>
        <cylinderGeometry args={[0.35, 1.6, 18, 16, 1, true]} />
        <meshBasicMaterial
          color="#facc15"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Tony Character Medal Token */}
      <group ref={groupRef}>
        {/* Outer Golden Crown Rim */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.9, 0.1, 16, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.2}
            emissive="#d97706"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Floating Hero Badge UI */}
        <Html
          position={[0, 0, 0]}
          center
          distanceFactor={30}
          zIndexRange={[15, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: 'translateY(-30px)',
            }}
          >
            {/* Round Portrait Token with Golden Glow */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid #fbbf24`,
                boxShadow: `0 0 20px ${heroColor}, 0 8px 16px rgba(0,0,0,0.8)`,
                background: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={heroAvatar}
                alt="Tony Hero"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = HERO_AVATAR_FALLBACK_SVG;
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 20%',
                }}
              />
            </div>

            {/* Tony Name & Level Pill */}
            <div
              style={{
                marginTop: '6px',
                padding: '3px 10px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.95)',
                border: `1px solid #fbbf24`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span style={{ fontSize: '11px', color: '#fbbf24' }}>★</span>
              <span
                style={{
                  fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                HIỆP SĨ TONY • CẤP {heroLevel}
              </span>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};
