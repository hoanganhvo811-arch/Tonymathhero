import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { KingdomLandmark } from '@/types/kingdom';

interface LandmarkMarkerProps {
  landmark: KingdomLandmark;
  isKingdomUnlocked: boolean;
  onSelect: (landmark: KingdomLandmark) => void;
}

export const LandmarkMarker: React.FC<LandmarkMarkerProps> = ({
  landmark,
  isKingdomUnlocked,
  onSelect,
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = landmark.position[1] + Math.sin(t * 2 + landmark.position[0]) * 0.15;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = t * 1.5;
    }
  });

  const getMarkerColor = () => {
    switch (landmark.type) {
      case 'quest_point':
        return '#38bdf8'; // Sky blue
      case 'monster_camp':
        return '#f87171'; // Red
      case 'treasure':
        return '#facc15'; // Gold
      case 'boss_gate':
        return '#c084fc'; // Purple
      case 'kingdom_castle':
        return '#34d399'; // Emerald
      default:
        return '#fbbf24';
    }
  };

  const getMarkerIcon = () => {
    switch (landmark.type) {
      case 'quest_point':
        return '⚔️';
      case 'monster_camp':
        return '👹';
      case 'treasure':
        return '💎';
      case 'boss_gate':
        return '👑';
      case 'kingdom_castle':
        return '🏰';
      default:
        return '📍';
    }
  };

  const color = getMarkerColor();
  const icon = getMarkerIcon();

  return (
    <group
      position={[landmark.position[0], landmark.position[1], landmark.position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(landmark);
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
      {/* Animated 3D Floating Landmark Mesh */}
      <group ref={meshRef} scale={hovered ? 1.25 : 1.0}>
        {/* Base Runic Ring */}
        <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.75, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.9 : 0.45}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Distinct 3D mesh based on landmark type */}
        {landmark.type === 'quest_point' && (
          <group>
            {/* Glowing crystal obelisk */}
            <mesh position={[0, 0.6, 0]}>
              <octahedronGeometry args={[0.45, 0]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={hovered ? 0.9 : 0.5}
                roughness={0.2}
              />
            </mesh>
            {/* Pedestal */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.2, 0.35, 0.4, 6]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
          </group>
        )}

        {landmark.type === 'monster_camp' && (
          <group>
            {/* Spiked palisade and campfire */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.4, 0.5, 0.5, 6]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
            {/* Red flame core */}
            <mesh position={[0, 0.65, 0]}>
              <coneGeometry args={[0.25, 0.5, 6]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#f97316"
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        )}

        {landmark.type === 'treasure' && (
          <group>
            {/* Golden Chest */}
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.65, 0.45, 0.45]} />
              <meshStandardMaterial
                color="#eab308"
                metalness={0.8}
                roughness={0.2}
                emissive="#ca8a04"
                emissiveIntensity={hovered ? 0.7 : 0.3}
              />
            </mesh>
            {/* Chest lid */}
            <mesh position={[0, 0.55, -0.05]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.68, 0.15, 0.48]} />
              <meshStandardMaterial color="#ca8a04" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        )}

        {landmark.type === 'boss_gate' && (
          <group>
            {/* Mystic Portal Pillars */}
            <mesh position={[-0.45, 0.5, 0]}>
              <boxGeometry args={[0.2, 1.0, 0.2]} />
              <meshStandardMaterial color="#475569" roughness={0.8} />
            </mesh>
            <mesh position={[0.45, 0.5, 0]}>
              <boxGeometry args={[0.2, 1.0, 0.2]} />
              <meshStandardMaterial color="#475569" roughness={0.8} />
            </mesh>
            {/* Arch Top */}
            <mesh position={[0, 1.05, 0]}>
              <boxGeometry args={[1.2, 0.2, 0.25]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            {/* Portal swirling core */}
            <mesh ref={glowRef} position={[0, 0.5, 0]}>
              <planeGeometry args={[0.7, 0.9]} />
              <meshStandardMaterial
                color="#c084fc"
                emissive="#a855f7"
                emissiveIntensity={hovered ? 0.95 : 0.6}
                side={THREE.DoubleSide}
                transparent
                opacity={0.85}
              />
            </mesh>
          </group>
        )}

        {landmark.type === 'kingdom_castle' && (
          <group>
            {/* Central Keep */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.8, 1.0, 0.8]} />
              <meshStandardMaterial color="#475569" roughness={0.7} />
            </mesh>
            {/* Main Spire Tower */}
            <mesh position={[0, 1.25, 0]}>
              <coneGeometry args={[0.45, 0.8, 6]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={hovered ? 0.6 : 0.2}
                roughness={0.3}
              />
            </mesh>
          </group>
        )}

        {/* Hovering 2D/3D Label Badge */}
        <Html
          position={[0, 1.35, 0]}
          center
          distanceFactor={35}
          zIndexRange={[15, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            transition: 'all 0.2s ease',
            opacity: hovered ? 1 : 0.85,
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.88)',
              border: `1px solid ${color}`,
              boxShadow: `0 4px 12px rgba(0,0,0,0.6), 0 0 8px ${color}66`,
              whiteSpace: 'nowrap',
              fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
              fontSize: '11px',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            <span>{icon}</span>
            <span style={{ color }}>{landmark.vietnameseName}</span>
            {!isKingdomUnlocked && (
              <span style={{ fontSize: '9px', color: '#94a3b8' }}>🔒</span>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
};
