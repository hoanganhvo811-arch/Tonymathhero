import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ExplorationTerrain } from './ExplorationTerrain';
import { NpcCharacter } from './NpcCharacter';
import { InteractiveObject } from './InteractiveObject';
import { TonyController } from './TonyController';
import type { NpcData, InteractiveObjectData, SubZone } from '@/types/exploration';
import type { KingdomEnvironmentConfig } from '../data/kingdomsExplorationData';

interface ExplorationCanvasProps {
  heroLevel: number;
  subZones: SubZone[];
  npcs: NpcData[];
  interactiveObjects: InteractiveObjectData[];
  collectedObjectIds: string[];
  nearbyInteractable: { type: 'npc' | 'object'; data: NpcData | InteractiveObjectData } | null;
  environment?: KingdomEnvironmentConfig;
  joystickVector?: { x: number; y: number };
  interactTrigger?: number;
  hideNameplates?: boolean;
  onProximityChange: (interactable: { type: 'npc' | 'object'; data: NpcData | InteractiveObjectData } | null) => void;
  onInteract: (interactable: { type: 'npc' | 'object'; data: NpcData | InteractiveObjectData }) => void;
  onZoneChange: (zoneName: string) => void;
}

const DynamicEnvironmentLightingAndFog: React.FC<{ environment?: KingdomEnvironmentConfig }> = ({ environment }) => {
  const { scene } = useThree();

  useEffect(() => {
    const fogColor = environment?.fogColor || '#042414';
    const fogDensity = environment?.fogDensity || 0.014;
    scene.fog = new THREE.FogExp2(fogColor, fogDensity);
    return () => {
      scene.fog = null;
    };
  }, [scene, environment]);

  return (
    <group>
      <ambientLight intensity={0.9} color={environment?.lightColor || '#dcfce7'} />
      <directionalLight
        position={[30, 45, 25]}
        intensity={environment?.lightIntensity || 1.8}
        color={environment?.lightColor || '#fef08a'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={120}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0005}
      />
      {/* Secondary fill light */}
      <directionalLight
        position={[-25, 30, -20]}
        intensity={0.65}
        color={environment?.secondaryLightColor || '#34d399'}
      />
    </group>
  );
};

// Biome Environmental Floating Particles
const BiomeAtmosphericParticles: React.FC<{ environment?: KingdomEnvironmentConfig }> = ({ environment }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleType = environment?.particleType || 'spores';

  const { positions, colors } = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    let baseColor = new THREE.Color('#34d399');
    if (particleType === 'dust') baseColor = new THREE.Color('#fbbf24');
    else if (particleType === 'bubbles') baseColor = new THREE.Color('#38bdf8');
    else if (particleType === 'snow') baseColor = new THREE.Color('#e0f2fe');
    else if (particleType === 'embers') baseColor = new THREE.Color('#f97316');
    else if (particleType === 'candy') baseColor = new THREE.Color('#f472b6');
    else if (particleType === 'void') baseColor = new THREE.Color('#c084fc');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 65;
      pos[i * 3 + 1] = 0.5 + Math.random() * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 65;

      col[i * 3] = baseColor.r;
      col[i * 3 + 1] = baseColor.g;
      col[i * 3 + 2] = baseColor.b;
    }

    return { positions: pos, colors: col };
  }, [particleType]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.015;
      const posAttr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i);
        y -= 0.02;
        if (y < 0.4) y = 10.0;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={colors.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.25} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  );
};

export const ExplorationCanvas: React.FC<ExplorationCanvasProps> = ({
  heroLevel,
  subZones,
  npcs,
  interactiveObjects,
  collectedObjectIds,
  nearbyInteractable,
  environment,
  joystickVector,
  interactTrigger,
  hideNameplates = false,
  onProximityChange,
  onInteract,
  onZoneChange,
}) => {
  const bgColor = environment?.fogColor || '#042414';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 8, 26], fov: 48, near: 0.5, far: 200 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%', background: bgColor }}
      >
        <Suspense fallback={null}>
          <DynamicEnvironmentLightingAndFog environment={environment} />
          <BiomeAtmosphericParticles environment={environment} />

          {/* 3D World Landscape with Biome Features */}
          <ExplorationTerrain environment={environment} />

          {/* NPCs */}
          {npcs.map((npc) => (
            <NpcCharacter
              key={npc.id}
              npc={npc}
              isInteractable={nearbyInteractable?.data.id === npc.id}
              hideNameplates={hideNameplates}
              onInteract={(n) => onInteract({ type: 'npc', data: n })}
            />
          ))}

          {/* Interactive Objects (Chests, Crystals, Cages, Signs) */}
          {interactiveObjects.map((obj) => (
            <InteractiveObject
              key={obj.id}
              objectData={obj}
              isInteractable={nearbyInteractable?.data.id === obj.id}
              isCollected={collectedObjectIds.includes(obj.id)}
              hideNameplates={hideNameplates}
              onInteract={(o) => onInteract({ type: 'object', data: o })}
            />
          ))}

          {/* Tony Hero 3D Character & Third-Person Camera Controller */}
          <TonyController
            heroLevel={heroLevel}
            subZones={subZones}
            npcs={npcs}
            interactiveObjects={interactiveObjects}
            joystickVector={joystickVector}
            interactTrigger={interactTrigger}
            hideNameplates={hideNameplates}
            onProximityChange={onProximityChange}
            onInteract={onInteract}
            onZoneChange={onZoneChange}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
