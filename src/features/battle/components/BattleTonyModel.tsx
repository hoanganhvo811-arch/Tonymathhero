import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BattlePhase, SkillType } from '@/types/battle';
import type { CampaignGrade } from '@/types/campaign';

interface BattleTonyModelProps {
  grade?: CampaignGrade;
  phase: BattlePhase;
  isHit?: boolean;
  skillType?: SkillType;
}

export const BattleTonyModel: React.FC<BattleTonyModelProps> = ({
  grade = 'grade-2',
  phase,
  isHit = false,
  skillType = 'basic',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const swordArmRef = useRef<THREE.Group>(null);
  const shieldArmRef = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Mesh>(null);
  const magicAuraRef = useRef<THREE.Mesh>(null);

  const isGrade3 = grade === 'grade-3';
  const armorColor = isGrade3 ? '#1e3a8a' : '#047857'; // Royal blue vs Forest emerald
  const trimColor = isGrade3 ? '#fbbf24' : '#e2e8f0'; // Gold vs Silver

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (isHit) {
      // Take damage reaction: recoil backward, shudder, raise shield
      groupRef.current.position.x = -2.9 + Math.sin(t * 30) * 0.08;
      groupRef.current.position.y = 0.02;
      groupRef.current.rotation.z = -0.15;
      if (shieldArmRef.current) {
        shieldArmRef.current.rotation.y = 0.6;
        shieldArmRef.current.position.x = -0.2;
      }
    } else if (phase === 'victory') {
      // Victory / Celebrate pose: jump, spin sword high
      groupRef.current.position.x = -2.6;
      groupRef.current.position.y = Math.abs(Math.sin(t * 4)) * 0.35;
      groupRef.current.rotation.z = 0;
      if (swordArmRef.current) {
        swordArmRef.current.rotation.x = -Math.PI * 0.75 + Math.sin(t * 8) * 0.2;
        swordArmRef.current.rotation.z = Math.sin(t * 6) * 0.2;
      }
    } else if (phase === 'defeat') {
      // Defeat pose: kneeling down on one knee
      groupRef.current.position.x = -2.6;
      groupRef.current.position.y = -0.38;
      groupRef.current.rotation.x = 0.22;
      groupRef.current.rotation.z = 0;
      if (swordArmRef.current) {
        swordArmRef.current.rotation.x = -0.25;
      }
    } else if (phase === 'player_attack') {
      if (skillType === 'magic') {
        // Cast magic pose: float up slightly, sword held high towards sky
        groupRef.current.position.x = -2.5;
        groupRef.current.position.y = 0.25 + Math.sin(t * 6) * 0.08;
        if (swordArmRef.current) {
          swordArmRef.current.rotation.x = -Math.PI * 0.85;
          swordArmRef.current.rotation.z = -0.3;
        }
      } else {
        // Physical slash lunging strike towards monster
        const lunge = Math.sin(t * 12);
        groupRef.current.position.x = -2.6 + Math.max(0, lunge * 1.1);
        groupRef.current.position.y = Math.sin(t * 6) * 0.04;
        if (swordArmRef.current) {
          swordArmRef.current.rotation.x = -Math.PI * 0.5 + lunge * 0.8;
          swordArmRef.current.rotation.z = 0.2;
        }
      }
    } else {
      // Idle combat breathing stance
      groupRef.current.position.x = -2.6;
      groupRef.current.position.y = Math.sin(t * 2) * 0.05;
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0.35; // slightly turn toward monster
      groupRef.current.rotation.z = 0;

      if (swordArmRef.current) {
        swordArmRef.current.rotation.x = -0.4 + Math.sin(t * 2.5) * 0.08;
        swordArmRef.current.rotation.z = 0.2 + Math.cos(t * 2.5) * 0.05;
      }
      if (shieldArmRef.current) {
        shieldArmRef.current.rotation.y = -0.3 + Math.sin(t * 2) * 0.04;
        shieldArmRef.current.position.x = -0.42;
      }
    }

    // Cape flutter animation
    if (capeRef.current) {
      capeRef.current.rotation.x = 0.25 + Math.sin(t * 3.5) * 0.12;
    }

    // Magic aura rotation
    if (magicAuraRef.current) {
      magicAuraRef.current.rotation.z = t * 1.5;
    }
  });

  return (
    <group ref={groupRef} position={[-2.6, 0, 0]}>
      {/* Hero Shadow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.4} transparent />
      </mesh>

      {/* Magic Aura Ring under feet during magic cast */}
      {phase === 'player_attack' && skillType === 'magic' && (
        <mesh ref={magicAuraRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 1.3, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Hero Body Group */}
      <group position={[0, 1.1, 0]}>
        {/* Legs / Greaves */}
        <mesh position={[-0.2, -0.6, 0]}>
          <cylinderGeometry args={[0.09, 0.1, 0.65, 8]} />
          <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0.2, -0.6, 0]}>
          <cylinderGeometry args={[0.09, 0.1, 0.65, 8]} />
          <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Torso / Breastplate */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.55, 0.6, 0.3]} />
          <meshStandardMaterial
            color={armorColor}
            roughness={0.25}
            metalness={0.8}
            emissive={isHit ? '#ef4444' : '#000000'}
            emissiveIntensity={isHit ? 0.6 : 0}
          />
        </mesh>
        {/* Golden/Silver Chest Crest */}
        <mesh position={[0, -0.05, 0.16]}>
          <boxGeometry args={[0.28, 0.3, 0.04]} />
          <meshStandardMaterial color={trimColor} roughness={0.2} metalness={0.9} emissive={trimColor} emissiveIntensity={0.2} />
        </mesh>

        {/* Hero Head */}
        <mesh position={[0, 0.42, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>

        {/* Helmet with Visor */}
        <mesh position={[0, 0.48, 0]}>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.45, 0.14]}>
          <boxGeometry args={[0.28, 0.08, 0.12]} />
          <meshStandardMaterial color={trimColor} roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Hero Hair Tufts */}
        <mesh position={[0, 0.64, 0]}>
          <coneGeometry args={[0.08, 0.28, 6]} />
          <meshStandardMaterial color={trimColor} metalness={0.8} />
        </mesh>

        {/* Flowing Cape */}
        <mesh ref={capeRef} position={[0, 0.1, -0.18]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[0.48, 0.75, 0.04]} />
          <meshStandardMaterial color={isGrade3 ? '#dc2626' : '#059669'} roughness={0.8} />
        </mesh>

        {/* Right Arm & Sword */}
        <group ref={swordArmRef} position={[0.38, 0.1, 0]}>
          {/* Upper Arm */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.32, 8]} />
            <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Sword Handle & Guard */}
          <mesh position={[0, -0.32, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.18, 6]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.32, 0.22]}>
            <boxGeometry args={[0.22, 0.05, 0.05]} />
            <meshStandardMaterial color={trimColor} roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Glowing Blade */}
          <mesh position={[0, -0.32, 0.7]}>
            <boxGeometry args={[0.08, 0.03, 0.9]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.1}
              metalness={0.95}
              emissive={skillType === 'magic' ? '#38bdf8' : '#fbbf24'}
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>

        {/* Left Arm & Shield */}
        <group ref={shieldArmRef} position={[-0.42, 0.1, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.32, 8]} />
            <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Shield Emblem */}
          <mesh position={[-0.05, -0.15, 0.15]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.08, 0.58, 0.42]} />
            <meshStandardMaterial color={armorColor} roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[-0.07, -0.15, 0.15]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.06, 0.28, 0.22]} />
            <meshStandardMaterial color={trimColor} roughness={0.2} metalness={0.9} emissive={trimColor} emissiveIntensity={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
