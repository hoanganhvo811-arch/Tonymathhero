import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BattlePhase } from '@/types/battle';
import type { Monster } from '@/types/monster';

interface BattleMonsterModelProps {
  monster: Monster;
  phase: BattlePhase;
  isHit?: boolean;
  bossPhase?: 'NORMAL' | 'ENRAGED' | 'FINAL_CHALLENGE';
}

export const BattleMonsterModel: React.FC<BattleMonsterModelProps> = ({
  monster,
  phase,
  isHit = false,
  bossPhase = 'NORMAL',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const tentacleRef1 = useRef<THREE.Mesh>(null);
  const tentacleRef2 = useRef<THREE.Mesh>(null);
  const wingLeftRef = useRef<THREE.Mesh>(null);
  const wingRightRef = useRef<THREE.Mesh>(null);

  const modelType = monster.modelType || 'slime';
  const monsterId = monster.id || '';
  const isDefeated = monster.maxHp > 0 && phase === 'victory';

  // Eye and aura color based on boss phase
  const isEnraged = bossPhase === 'ENRAGED';
  const isFinalChallenge = bossPhase === 'FINAL_CHALLENGE';
  const auraColor = isFinalChallenge ? '#c084fc' : isEnraged ? '#ef4444' : '#38bdf8';

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (isDefeated) {
      // Sinking down and dissolving
      groupRef.current.position.y = Math.max(-1.8, -0.15 * (t * 2));
      groupRef.current.scale.setScalar(Math.max(0.05, 1 - (t % 3) * 0.25));
      groupRef.current.rotation.y = t * 1.5;
    } else if (isHit) {
      // Recoil and shudder on hit
      groupRef.current.position.x = 2.9 + Math.sin(t * 30) * 0.08;
      groupRef.current.position.y = Math.sin(t * 10) * 0.05;
      groupRef.current.rotation.z = 0.15;
    } else if (phase === 'monster_attack') {
      // Lunging forward towards Tony
      const lungeSpeed = isFinalChallenge ? 14 : isEnraged ? 12 : 10;
      const lunge = Math.sin(t * lungeSpeed);
      groupRef.current.position.x = 2.6 - Math.max(0, lunge * 1.2);
      groupRef.current.position.y = Math.sin(t * 4) * 0.1;
      groupRef.current.rotation.z = -0.1;
    } else {
      // Idle breathing / floating
      const breathSpeed = isFinalChallenge ? 3.5 : isEnraged ? 2.8 : 1.8;
      groupRef.current.position.x = 2.6;
      groupRef.current.position.y = Math.sin(t * breathSpeed) * 0.08;
      groupRef.current.rotation.y = -0.35; // facing Tony
      groupRef.current.rotation.z = 0;
    }

    // Glowing core pulse
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      if (mat && mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = isFinalChallenge
          ? 1.2 + Math.sin(t * 8) * 0.5
          : isEnraged
          ? 0.9 + Math.sin(t * 6) * 0.4
          : 0.5 + Math.sin(t * 3) * 0.3;
      }
    }

    // Lord Zero rotating void rings
    if (ringRef1.current) ringRef1.current.rotation.x = t * 1.8;
    if (ringRef2.current) ringRef2.current.rotation.y = t * -1.5;

    // Kraken writhing tentacles
    if (tentacleRef1.current) tentacleRef1.current.rotation.z = Math.sin(t * 3) * 0.35;
    if (tentacleRef2.current) tentacleRef2.current.rotation.z = -Math.sin(t * 3) * 0.35;

    // Ice Dragon flapping crystal wings
    if (wingLeftRef.current) wingLeftRef.current.rotation.y = Math.sin(t * 4) * 0.45;
    if (wingRightRef.current) wingRightRef.current.rotation.y = -Math.sin(t * 4) * 0.45;
  });

  // Identify specific boss models
  const isLordZero = monsterId.includes('lord-zero') || monsterId.includes('umbra');
  const isKraken = monsterId.includes('kraken') || monsterId.includes('aquaria');
  const isDragon = monsterId.includes('dragon') || monsterId.includes('glacia');
  const isWitch = monsterId.includes('witch') || monsterId.includes('candy');
  const isTitan = monsterId.includes('titan') || monsterId.includes('sand');

  return (
    <group ref={groupRef} position={[2.6, 0, 0]}>
      {/* Monster Ground Shadow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[modelType === 'golem' || modelType === 'boss' ? 1.5 : 0.8, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.45} transparent />
      </mesh>

      {/* --- 1. LORD ZERO (FINAL DARK BOSS) --- */}
      {isLordZero && (
        <group position={[0, 1.6, 0]}>
          {/* Central Void Nucleus */}
          <mesh ref={coreRef}>
            <sphereGeometry args={[0.75, 24, 24]} />
            <meshStandardMaterial
              color="#18181b"
              emissive={auraColor}
              emissiveIntensity={1.0}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Concentric Void Rings */}
          <mesh ref={ringRef1} rotation={[0, 0, 0]}>
            <torusGeometry args={[1.35, 0.08, 12, 32]} />
            <meshStandardMaterial color="#7c3aed" emissive="#c084fc" emissiveIntensity={0.8} />
          </mesh>
          <mesh ref={ringRef2} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.7, 0.07, 12, 32]} />
            <meshStandardMaterial color="#ef4444" emissive="#f87171" emissiveIntensity={0.8} />
          </mesh>
          {/* Piercing Red Eyes */}
          <mesh position={[-0.22, 0.2, 0.65]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0.22, 0.2, 0.65]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      )}

      {/* --- 2. KRAKEN (OCEAN BOSS) --- */}
      {isKraken && (
        <group position={[0, 1.2, 0]}>
          <mesh ref={coreRef}>
            <sphereGeometry args={[1.0, 16, 16]} />
            <meshStandardMaterial color="#0f172a" emissive={auraColor} emissiveIntensity={0.6} roughness={0.3} />
          </mesh>
          {/* Giant Cyclops Eye */}
          <mesh position={[0, 0.2, 0.85]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.9} />
          </mesh>
          {/* Writhing Tentacles */}
          <mesh ref={tentacleRef1} position={[-0.9, -0.4, 0.4]} rotation={[0.4, 0, 0.3]}>
            <cylinderGeometry args={[0.15, 0.25, 1.8, 8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh ref={tentacleRef2} position={[0.9, -0.4, 0.4]} rotation={[0.4, 0, -0.3]}>
            <cylinderGeometry args={[0.15, 0.25, 1.8, 8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}

      {/* --- 3. ICE DRAGON (FROZEN BOSS) --- */}
      {isDragon && (
        <group position={[0, 1.4, 0]}>
          {/* Dragon Body */}
          <mesh ref={coreRef}>
            <boxGeometry args={[1.0, 1.1, 1.4]} />
            <meshStandardMaterial color="#0284c7" emissive={auraColor} emissiveIntensity={0.5} roughness={0.2} metalness={0.7} />
          </mesh>
          {/* Dragon Head with Horns */}
          <mesh position={[0, 0.5, 0.9]} rotation={[-Math.PI / 3, 0, 0]}>
            <coneGeometry args={[0.4, 0.9, 8]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.1} />
          </mesh>
          {/* Crystal Wings */}
          <mesh ref={wingLeftRef} position={[-0.9, 0.5, 0]}>
            <boxGeometry args={[1.5, 0.05, 0.9]} />
            <meshStandardMaterial color="#7dd3fc" transparent opacity={0.85} roughness={0.1} />
          </mesh>
          <mesh ref={wingRightRef} position={[0.9, 0.5, 0]}>
            <boxGeometry args={[1.5, 0.05, 0.9]} />
            <meshStandardMaterial color="#7dd3fc" transparent opacity={0.85} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* --- 4. CANDY WITCH (SWEET VALLEY BOSS) --- */}
      {isWitch && (
        <group position={[0, 1.2, 0]}>
          <mesh ref={coreRef}>
            <sphereGeometry args={[0.65, 16, 16]} />
            <meshStandardMaterial color="#f472b6" emissive={auraColor} emissiveIntensity={0.6} />
          </mesh>
          {/* Witch Hat */}
          <mesh position={[0, 0.9, 0]}>
            <coneGeometry args={[0.6, 1.2, 8]} />
            <meshStandardMaterial color="#831843" roughness={0.7} />
          </mesh>
          {/* Candy Wand */}
          <mesh position={[-0.6, 0.2, 0.4]} rotation={[0.4, 0, 0.5]}>
            <cylinderGeometry args={[0.06, 0.06, 1.2, 6]} />
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {/* --- 5. SAND TITAN (GOLDEN DESERT BOSS) --- */}
      {isTitan && (
        <group position={[0, 1.5, 0]}>
          <mesh ref={coreRef}>
            <boxGeometry args={[1.5, 1.4, 1.1]} />
            <meshStandardMaterial color="#d97706" emissive={auraColor} emissiveIntensity={0.6} roughness={0.8} />
          </mesh>
          {/* Golden Sun Emblem Head */}
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} emissive="#f59e0b" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}

      {/* --- 6. STANDARD GOLEM & EMERALD GUARDIAN --- */}
      {(modelType === 'golem' || modelType === 'boss') && !isLordZero && !isKraken && !isDragon && !isWitch && !isTitan && (
        <group position={[0, 1.4, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.3, 1.2, 0.9]} />
            <meshStandardMaterial
              color="#57534e"
              roughness={0.9}
              emissive={isHit ? '#ef4444' : '#000000'}
              emissiveIntensity={isHit ? 0.7 : 0}
            />
          </mesh>
          {/* Glowing Math Rune Core */}
          <mesh ref={coreRef} position={[0, 0.1, 0.46]}>
            <boxGeometry args={[0.45, 0.45, 0.05]} />
            <meshStandardMaterial color={auraColor} emissive={auraColor} emissiveIntensity={0.9} />
          </mesh>
          {/* Stone Shoulder Pauldrons */}
          <mesh position={[-0.9, 0.4, 0]}>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial color="#44403c" roughness={0.9} />
          </mesh>
          <mesh position={[0.9, 0.4, 0]}>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial color="#44403c" roughness={0.9} />
          </mesh>
          {/* Heavy Stone Fists */}
          <mesh position={[-0.9, -0.4, 0.3]}>
            <boxGeometry args={[0.5, 0.6, 0.6]} />
            <meshStandardMaterial color="#78716c" roughness={0.8} />
          </mesh>
          <mesh position={[0.9, -0.4, 0.3]}>
            <boxGeometry args={[0.5, 0.6, 0.6]} />
            <meshStandardMaterial color="#78716c" roughness={0.8} />
          </mesh>
          {/* Glowing Eyes */}
          <mesh position={[-0.2, 0.75, 0.46]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={auraColor} />
          </mesh>
          <mesh position={[0.2, 0.75, 0.46]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={auraColor} />
          </mesh>
        </group>
      )}

      {/* --- 7. SLIME --- */}
      {modelType === 'slime' && !isLordZero && !isKraken && !isDragon && !isWitch && !isTitan && (
        <group position={[0, 0.6, 0]}>
          <mesh>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshStandardMaterial
              color="#22c55e"
              roughness={0.1}
              metalness={0.2}
              transparent
              opacity={0.88}
              emissive={isHit ? '#ef4444' : '#15803d'}
              emissiveIntensity={isHit ? 0.7 : 0.3}
            />
          </mesh>
          <mesh ref={coreRef} position={[0, 0, 0]}>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshStandardMaterial color="#86efac" emissive="#4ade80" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[-0.25, 0.2, 0.55]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.25, 0.2, 0.55]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>
      )}

      {/* --- 8. GOBLIN --- */}
      {modelType === 'goblin' && !isLordZero && !isKraken && !isDragon && !isWitch && !isTitan && (
        <group position={[0, 0.9, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.6, 0.8, 0.4]} />
            <meshStandardMaterial
              color="#475569"
              roughness={0.7}
              emissive={isHit ? '#ef4444' : '#000000'}
              emissiveIntensity={isHit ? 0.6 : 0}
            />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.26, 12, 12]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
          <mesh position={[-0.32, 0.7, 0]} rotation={[0, 0, -0.6]}>
            <coneGeometry args={[0.08, 0.3, 6]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0.32, 0.7, 0]} rotation={[0, 0, 0.6]}>
            <coneGeometry args={[0.08, 0.3, 6]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[-0.1, 0.62, 0.22]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0.1, 0.62, 0.22]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      )}
    </group>
  );
};
