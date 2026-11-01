import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { NpcData } from '@/types/exploration';

interface NpcCharacterProps {
  npc: NpcData;
  isInteractable: boolean;
  hideNameplates?: boolean;
  onInteract: (npc: NpcData) => void;
}

export const NpcCharacter: React.FC<NpcCharacterProps> = ({
  npc,
  isInteractable,
  hideNameplates = false,
  onInteract,
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const questIconRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (questIconRef.current) {
      // Floating bobbing quest marker
      questIconRef.current.position.y = 2.8 + Math.sin(t * 3) * 0.15;
      questIconRef.current.rotation.y = t * 1.5;
    }
    if (meshRef.current) {
      // Gentle idle breathing
      meshRef.current.position.y = Math.sin(t * 2 + npc.position[0]) * 0.04;
    }
  });

  const getNpcColors = () => {
    switch (npc.id) {
      case 'npc-elder-oak':
        return { robe: '#15803d', accent: '#ca8a04', skin: '#fed7aa' };
      case 'npc-lily':
        return { robe: '#f472b6', accent: '#fde047', skin: '#fecdd3' };
      case 'npc-forest-guardian':
        return { robe: '#065f46', accent: '#6ee7b7', skin: '#e2e8f0' };
      case 'npc-merchant':
        return { robe: '#7e22ce', accent: '#facc15', skin: '#fed7aa' };
      default:
        return { robe: '#334155', accent: '#38bdf8', skin: '#fef3c7' };
    }
  };

  const colors = getNpcColors();

  return (
    <group
      position={[npc.position[0], npc.position[1], npc.position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onInteract(npc);
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
      {/* Ground Interaction Circle */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 1.2, 16]} />
        <meshBasicMaterial
          color={isInteractable ? '#fbbf24' : '#34d399'}
          transparent
          opacity={isInteractable ? 0.8 : hovered ? 0.5 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Stylized NPC Model */}
      <group ref={meshRef} scale={hovered || isInteractable ? 1.12 : 1.0}>
        {/* Robe / Body */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.45, 1.5, 8]} />
          <meshStandardMaterial color={colors.robe} roughness={0.8} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <sphereGeometry args={[0.26, 12, 12]} />
          <meshStandardMaterial color={colors.skin} roughness={0.6} />
        </mesh>
        {/* Headwear / Hair / Hat */}
        <mesh position={[0, 1.9, 0]}>
          <coneGeometry args={[0.32, 0.35, 8]} />
          <meshStandardMaterial color={colors.accent} roughness={0.7} />
        </mesh>

        {/* Floating Quest Marker "!" Above Head */}
        {npc.hasQuestMarker && (
          <group ref={questIconRef} position={[0, 2.8, 0]}>
            <mesh>
              <octahedronGeometry args={[0.32, 0]} />
              <meshStandardMaterial
                color="#facc15"
                emissive="#eab308"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        )}

        {/* Billboard Nameplate */}
        {!hideNameplates && (
          <Html
            position={[0, npc.hasQuestMarker ? 3.4 : 2.5, 0]}
            center
            distanceFactor={30}
            zIndexRange={[15, 0]}
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '3px 8px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: isInteractable ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: isInteractable
                  ? '0 0 12px rgba(251, 191, 36, 0.6)'
                  : '0 4px 10px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{npc.avatarIcon}</span>
                <span
                  style={{
                    fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  {npc.name}
                </span>
              </div>
              <span style={{ fontSize: '9px', color: '#fbbf24' }}>{npc.role}</span>
              {isInteractable && (
                <span
                  style={{
                    fontSize: '9px',
                    background: '#fbbf24',
                    color: '#0f172a',
                    padding: '1px 6px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    marginTop: '2px',
                  }}
                >
                  [E] NÓI CHUYỆN
                </span>
              )}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};
