import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BattleTonyModel } from './BattleTonyModel';
import { BattleMonsterModel } from './BattleMonsterModel';
import type { BattlePhase, SkillType } from '@/types/battle';
import type { Monster } from '@/types/monster';
import type { CampaignGrade } from '@/types/campaign';

interface BattleArenaCanvasProps {
  grade?: CampaignGrade;
  phase: BattlePhase;
  monster: Monster;
  monsterHp: number;
  selectedSkill?: SkillType;
}

// Atmospheric magic particles component
const MagicSparks: React.FC = () => {
  const count = 40;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: Math.random() * 4 + 0.5,
      z: (Math.random() - 0.5) * 10,
      speed: Math.random() * 0.02 + 0.01,
      scale: Math.random() * 0.08 + 0.04,
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      dummy.position.set(p.x + Math.sin(t * 0.5 + i) * 0.5, p.y + Math.cos(t * 0.8 + i) * 0.4, p.z);
      dummy.scale.setScalar(p.scale * (1 + Math.sin(t * 2 + i) * 0.3));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#34d399" transparent opacity={0.6} />
    </instancedMesh>
  );
};

// Ancient Stone Arena Floor and Pillars
const ArenaEnvironment: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Outer Ground */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#062e19" roughness={0.9} />
      </mesh>

      {/* Raised Arena Circular Dais */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[6.5, 7, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Runic Circle Inlay */}
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.5, 4.2, 32]} />
        <meshBasicMaterial color="#059669" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.8, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
      </mesh>

      {/* Background Ancient Stone Pillars */}
      {[-6, -4, 4, 6].map((x, idx) => (
        <group key={idx} position={[x, 0, -4.5]}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.4, 0.45, 4, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.1, 0]}>
            <boxGeometry args={[1, 0.3, 1]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Emerald Forest Pine Trees in distant background */}
      {[-8, -5.5, -2, 2, 5.5, 8].map((x, idx) => (
        <group key={`tree-${idx}`} position={[x, 0, -7.5 + (idx % 2)]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 3, 6]} />
            <meshStandardMaterial color="#3f2e18" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <coneGeometry args={[1.4, 2.5, 7]} />
            <meshStandardMaterial color="#064e3b" roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.8, 0]}>
            <coneGeometry args={[1.1, 2.0, 7]} />
            <meshStandardMaterial color="#047857" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Subtle RPG camera sway
const CameraRig: React.FC = () => {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(t * 0.3) * 0.25;
    state.camera.position.y = 2.2 + Math.cos(t * 0.4) * 0.1;
    state.camera.lookAt(0, 1.1, 0);
  });
  return null;
};

export const BattleArenaCanvas: React.FC<BattleArenaCanvasProps> = ({
  grade = 'grade-2',
  phase,
  monster,
  monsterHp,
  selectedSkill = 'basic',
}) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 2.2, 7.8], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#021b10']} />
        <fog attach="fog" args={['#021b10', 8, 22]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.65} color="#d1fae5" />
        <directionalLight position={[5, 10, 5]} intensity={1.2} color="#fef08a" castShadow />
        <directionalLight position={[-6, 4, -2]} intensity={0.5} color="#38bdf8" />

        {/* Spotlight on Tony */}
        <spotLight position={[-2.6, 6, 2]} target-position={[-2.6, 1, 0]} intensity={1.8} angle={0.45} penumbra={0.7} color="#67e8f9" />
        {/* Spotlight on Monster */}
        <spotLight position={[2.6, 6, 2]} target-position={[2.6, 1, 0]} intensity={1.6} angle={0.45} penumbra={0.7} color="#f87171" />

        {/* 3D Scene Elements */}
        <CameraRig />
        <ArenaEnvironment />
        <MagicSparks />

        {/* Characters */}
        <BattleTonyModel grade={grade} phase={phase} skillType={selectedSkill} />
        <BattleMonsterModel monster={monster} phase={phase} />
      </Canvas>
    </div>
  );
};
