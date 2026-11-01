import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { InteractiveObjectData } from '@/types/exploration';

interface InteractiveObjectProps {
  objectData: InteractiveObjectData;
  isInteractable: boolean;
  isCollected: boolean;
  hideNameplates?: boolean;
  onInteract: (obj: InteractiveObjectData) => void;
}

export const InteractiveObject: React.FC<InteractiveObjectProps> = ({
  objectData,
  isInteractable,
  isCollected,
  hideNameplates = false,
  onInteract,
}) => {
  const [hovered, setHovered] = useState(false);
  const crystalRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (crystalRef.current && objectData.type === 'energy_crystal') {
      crystalRef.current.rotation.y = t * 2.0;
      crystalRef.current.position.y = 0.6 + Math.sin(t * 3.0) * 0.12;
    }
  });

  // If already collected and not a persistent signpost or opened cage, hide or show opened
  if (isCollected && objectData.type === 'energy_crystal') {
    return null; // Crystal disappears once collected
  }

  return (
    <group
      position={[objectData.position[0], objectData.position[1], objectData.position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        if (!isCollected) onInteract(objectData);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!isCollected) {
          document.body.style.cursor = 'pointer';
          setHovered(true);
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setHovered(false);
      }}
    >
      {/* Ground Proximity Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.9, 16]} />
        <meshBasicMaterial
          color={isInteractable ? '#fbbf24' : '#38bdf8'}
          transparent
          opacity={isInteractable ? 0.8 : hovered ? 0.5 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* --- ENERGY CRYSTAL --- */}
      {objectData.type === 'energy_crystal' && (
        <group>
          <mesh ref={crystalRef} position={[0, 0.6, 0]}>
            <octahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.9}
              roughness={0.1}
              metalness={0.4}
              transparent
              opacity={0.9}
            />
          </mesh>
          <pointLight ref={glowRef} position={[0, 0.6, 0]} color="#38bdf8" intensity={1.5} distance={5} />
        </group>
      )}

      {/* --- TREASURE CHEST --- */}
      {objectData.type === 'treasure_chest' && (
        <group position={[0, 0.25, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.5, 0.5]} />
            <meshStandardMaterial
              color={isCollected ? '#78350f' : '#b45309'}
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
          {/* Lid */}
          <mesh
            position={[0, 0.32, isCollected ? -0.15 : 0]}
            rotation={[isCollected ? 0.6 : 0, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.85, 0.15, 0.55]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#d97706"
              emissiveIntensity={isCollected ? 0.1 : 0.4}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}

      {/* --- VILLAGER CAGE --- */}
      {objectData.type === 'villager_cage' && (
        <group position={[0, 1.0, 0]}>
          {/* Iron Cage Frame */}
          <mesh>
            <boxGeometry args={[2.2, 2.0, 2.2]} />
            <meshStandardMaterial
              color="#334155"
              wireframe={!isCollected}
              roughness={0.5}
              metalness={0.8}
            />
          </mesh>
          {/* 3 Villager Figures Inside (if not yet rescued) */}
          {!isCollected && (
            <>
              {[-0.5, 0, 0.5].map((x, i) => (
                <group key={i} position={[x, -0.3, 0]}>
                  <mesh position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[0.15, 0.22, 0.6, 6]} />
                    <meshStandardMaterial color="#3b82f6" />
                  </mesh>
                  <mesh position={[0, 0.7, 0]}>
                    <sphereGeometry args={[0.14, 8, 8]} />
                    <meshStandardMaterial color="#fed7aa" />
                  </mesh>
                </group>
              ))}
            </>
          )}
        </group>
      )}

      {/* --- SIGNPOST --- */}
      {objectData.type === 'signpost' && (
        <group position={[0, 0.8, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.1, 1.6, 6]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.2, 0.4, 0.08]} />
            <meshStandardMaterial color="#b45309" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* Floating Prompt Label when in proximity */}
      {isInteractable && !isCollected && !hideNameplates && (
        <Html
          position={[0, 1.6, 0]}
          center
          distanceFactor={28}
          zIndexRange={[15, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              padding: '3px 8px',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid #fbbf24',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)',
              fontSize: '10px',
              fontWeight: 800,
              color: '#fbbf24',
            }}
          >
            [E] {objectData.promptText}
          </div>
        </Html>
      )}
    </group>
  );
};
