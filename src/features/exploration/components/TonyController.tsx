import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { NpcData, InteractiveObjectData, SubZone } from '@/types/exploration';

interface TonyControllerProps {
  initialPosition?: [number, number, number];
  heroLevel: number;
  subZones?: SubZone[];
  joystickVector?: { x: number; y: number };
  interactTrigger?: number;
  npcs: NpcData[];
  interactiveObjects: InteractiveObjectData[];
  hideNameplates?: boolean;
  onProximityChange: (interactable: { type: 'npc' | 'object'; data: NpcData | InteractiveObjectData } | null) => void;
  onInteract: (interactable: { type: 'npc' | 'object'; data: NpcData | InteractiveObjectData }) => void;
  onZoneChange?: (zoneName: string) => void;
}

export const TonyController: React.FC<TonyControllerProps> = ({
  initialPosition = [0, 0, 16],
  heroLevel,
  subZones = [],
  joystickVector,
  interactTrigger = 0,
  npcs,
  interactiveObjects,
  hideNameplates = false,
  onProximityChange,
  onInteract,
  onZoneChange,
}) => {
  const { camera } = useThree();
  const tonyRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const swordArmRef = useRef<THREE.Group>(null);
  const shieldArmRef = useRef<THREE.Mesh>(null);
  const capeRef = useRef<THREE.Mesh>(null);

  // Position, velocity, and jump state
  const pos = useRef<THREE.Vector3>(new THREE.Vector3(initialPosition[0], initialPosition[1], initialPosition[2]));
  const verticalVelocity = useRef<number>(0);
  const isJumping = useRef<boolean>(false);
  const targetRotation = useRef<number>(0);
  const currentRotation = useRef<number>(0);
  const isMoving = useRef<boolean>(false);
  const isSprinting = useRef<boolean>(false);

  // Keyboard keys tracker
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'KeyE') {
        checkAndInteract();
      } else if (e.code === 'Space') {
        // Space jumps if on ground
        if (!isJumping.current) {
          verticalVelocity.current = 7.5;
          isJumping.current = true;
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [npcs, interactiveObjects]);

  // Touch action button trigger
  useEffect(() => {
    if (interactTrigger > 0) {
      checkAndInteract();
    }
  }, [interactTrigger]);

  const checkAndInteract = () => {
    const current = pos.current;
    // Check NPCs
    for (const npc of npcs) {
      const d = Math.sqrt((current.x - npc.position[0]) ** 2 + (current.z - npc.position[2]) ** 2);
      if (d < 3.2) {
        onInteract({ type: 'npc', data: npc });
        return;
      }
    }
    // Check Objects
    for (const obj of interactiveObjects) {
      const d = Math.sqrt((current.x - obj.position[0]) ** 2 + (current.z - obj.position[2]) ** 2);
      if (d < obj.interactionRadius) {
        onInteract({ type: 'object', data: obj });
        return;
      }
    }
  };

  // Collision detection boundaries
  const isPositionValid = (x: number, z: number): boolean => {
    if (x < -36 || x > 36 || z < -36 || z > 33) return false;
    // Obstacle bounds
    if (Math.abs(x - (-8)) < 2.2 && Math.abs(z - 12) < 2.0) return false;
    if (Math.abs(x - 8) < 2.2 && Math.abs(z - 10) < 2.0) return false;
    if (Math.abs(x - 10) < 2.2 && Math.abs(z - 20) < 2.0) return false;
    return true;
  };

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Calculate movement vector
    let moveX = 0;
    let moveZ = 0;

    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveZ -= 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveZ += 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveX -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveX += 1;

    // Joystick input integration
    if (joystickVector && (Math.abs(joystickVector.x) > 0.1 || Math.abs(joystickVector.y) > 0.1)) {
      moveX += joystickVector.x;
      moveZ -= joystickVector.y;
    }

    const hasInput = moveX !== 0 || moveZ !== 0;
    isMoving.current = hasInput;
    isSprinting.current = Boolean(
      keys.current['ShiftLeft'] ||
        keys.current['ShiftRight'] ||
        (joystickVector && Math.hypot(joystickVector.x, joystickVector.y) > 0.75)
    );

    const speed = isSprinting.current ? 9.8 : 6.0;

    if (hasInput) {
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      const dirX = (moveX / len) * speed * delta;
      const dirZ = (moveZ / len) * speed * delta;

      const nextX = pos.current.x + dirX;
      const nextZ = pos.current.z + dirZ;

      if (isPositionValid(nextX, pos.current.z)) {
        pos.current.x = nextX;
      }
      if (isPositionValid(pos.current.x, nextZ)) {
        pos.current.z = nextZ;
      }

      targetRotation.current = Math.atan2(dirX, dirZ);
    }

    // Jump physics calculation
    if (isJumping.current) {
      pos.current.y += verticalVelocity.current * delta;
      verticalVelocity.current -= 22 * delta; // Gravity
      if (pos.current.y <= 0) {
        pos.current.y = 0;
        verticalVelocity.current = 0;
        isJumping.current = false;
      }
    }

    // Smooth rotation interpolation
    let rotDiff = targetRotation.current - currentRotation.current;
    while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
    while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
    currentRotation.current += rotDiff * 0.2;

    // Update Tony 3D group position & rotation
    if (tonyRef.current) {
      tonyRef.current.position.set(pos.current.x, pos.current.y, pos.current.z);
      tonyRef.current.rotation.y = currentRotation.current;
    }

    // Walking & Running Skeletal Animation
    const gaitSpeed = isSprinting.current ? 16 : 10;
    if (modelRef.current) {
      if (isJumping.current) {
        // Jump pose
        if (leftLegRef.current) leftLegRef.current.rotation.x = -0.35;
        if (rightLegRef.current) rightLegRef.current.rotation.x = 0.35;
        if (swordArmRef.current) swordArmRef.current.rotation.x = -Math.PI * 0.4;
        if (capeRef.current) capeRef.current.rotation.x = 0.65;
      } else if (isMoving.current) {
        // Natural alternating stride & arm swing
        modelRef.current.position.y = Math.abs(Math.sin(t * gaitSpeed)) * 0.12;
        modelRef.current.rotation.z = Math.sin(t * gaitSpeed) * 0.05;

        if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(t * gaitSpeed) * 0.45;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(t * gaitSpeed) * 0.45;
        if (swordArmRef.current) swordArmRef.current.rotation.x = -Math.sin(t * gaitSpeed) * 0.35 + 0.2;
        if (shieldArmRef.current) shieldArmRef.current.rotation.x = Math.sin(t * gaitSpeed) * 0.25;
        if (capeRef.current) capeRef.current.rotation.x = 0.25 + (isSprinting.current ? 0.45 : 0.2) + Math.sin(t * 8) * 0.08;
      } else {
        // Idle breathing stance
        modelRef.current.position.y = Math.sin(t * 2) * 0.03;
        modelRef.current.rotation.z = 0;

        if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
        if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
        if (swordArmRef.current) swordArmRef.current.rotation.x = 0.2 + Math.sin(t * 2) * 0.05;
        if (shieldArmRef.current) shieldArmRef.current.rotation.x = 0;
        if (capeRef.current) capeRef.current.rotation.x = 0.15 + Math.sin(t * 3) * 0.05;
      }
    }

    // Smooth third-person follow camera
    const camTargetPos = new THREE.Vector3(pos.current.x, pos.current.y + 7.5, pos.current.z + 10.5);
    camera.position.lerp(camTargetPos, 0.08);
    camera.lookAt(pos.current.x, pos.current.y + 1.2, pos.current.z);

    // Sub-zone detection
    if (subZones.length > 0 && onZoneChange) {
      for (const zone of subZones) {
        const d = Math.sqrt((pos.current.x - zone.center[0]) ** 2 + (pos.current.z - zone.center[2]) ** 2);
        if (d < zone.radius) {
          onZoneChange(zone.nameVi);
          break;
        }
      }
    }

    // Proximity check for HUD interact prompt
    let closestInteractable: { type: 'npc' | 'object'; data: NpcData | InteractiveObjectData } | null = null;
    let closestDist = 999;

    for (const npc of npcs) {
      const d = Math.sqrt((pos.current.x - npc.position[0]) ** 2 + (pos.current.z - npc.position[2]) ** 2);
      if (d < 3.2 && d < closestDist) {
        closestDist = d;
        closestInteractable = { type: 'npc', data: npc };
      }
    }

    for (const obj of interactiveObjects) {
      const d = Math.sqrt((pos.current.x - obj.position[0]) ** 2 + (pos.current.z - obj.position[2]) ** 2);
      if (d < obj.interactionRadius && d < closestDist) {
        closestDist = d;
        closestInteractable = { type: 'object', data: obj };
      }
    }

    onProximityChange(closestInteractable);
  });

  return (
    <group ref={tonyRef} position={initialPosition}>
      {/* Ground Shadow & Aura Pedestal */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.9, 24]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Tony Hero 3D Character Model */}
      <group ref={modelRef}>
        {/* Armored Boots & Legs */}
        <mesh ref={leftLegRef} position={[-0.18, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.7, 6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh ref={rightLegRef} position={[0.18, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.7, 6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Armored Torso with Gold Trims */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[0.65, 0.75, 0.38]} />
          <meshStandardMaterial
            color="#0369a1"
            emissive="#0284c7"
            emissiveIntensity={0.25}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>
        {/* Golden Chest Plate Emblem */}
        <mesh position={[0, 1.15, 0.2]}>
          <boxGeometry args={[0.3, 0.3, 0.05]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Flowing Crimson Cape */}
        <mesh ref={capeRef} position={[0, 0.85, -0.22]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.55, 0.85, 0.05]} />
          <meshStandardMaterial color="#dc2626" roughness={0.8} />
        </mesh>

        {/* Silver Knight Sword in Right Hand */}
        <group ref={swordArmRef} position={[0.42, 0.9, 0.1]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.08, 0.9, 0.02]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.26, 0.06, 0.06]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        </group>

        {/* Blue & Silver Knight Shield on Left Hand */}
        <mesh ref={shieldArmRef} position={[-0.42, 0.95, 0.08]} rotation={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.1, 0.65, 0.45]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Head / Helmet */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Golden Helmet Crest */}
        <mesh position={[0, 1.84, 0]} castShadow>
          <coneGeometry args={[0.08, 0.35, 6]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Floating Tony Avatar Token Disc */}
        {!hideNameplates && (
          <Html
            position={[0, 2.3, 0]}
            center
            distanceFactor={24}
            zIndexRange={[15, 0]}
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <div
              style={{
                padding: '2px 10px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid #facc15',
                boxShadow: '0 2px 10px rgba(0,0,0,0.6)',
                color: '#facc15',
                fontSize: '11px',
                fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
                fontWeight: 800,
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
              }}
            >
              ⭐ Hiệp Sĩ Tony (Lv.{heroLevel})
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};
