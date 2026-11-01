import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { KingdomEnvironmentConfig } from '../data/kingdomsExplorationData';

interface ExplorationTerrainProps {
  environment?: KingdomEnvironmentConfig;
}

export const ExplorationTerrain: React.FC<ExplorationTerrainProps> = ({ environment }) => {
  const waterRef = useRef<THREE.Mesh>(null);
  const biome = environment?.biomeType || 'emerald_forest';

  // Subtle wave ripple for water / lava / chocolate plane
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (waterRef.current) {
      const waterPos = environment?.waterPosition || [16, -0.15, 6];
      waterRef.current.position.y = waterPos[1] + Math.sin(t * 1.5) * 0.03;
    }
  });

  // Base terrain geometry with elevation and vertex coloring based on biome
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(90, 90, 60, 60);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const vertexCount = pos.count;
    const colors = new Float32Array(vertexCount * 3);

    const baseColor = new THREE.Color(environment?.groundColor || '#15803d');
    const secondaryColor = new THREE.Color(environment?.secondaryGroundColor || '#064e3b');
    const pathColor = new THREE.Color(environment?.pathColor || '#a8a29e');

    for (let i = 0; i < vertexCount; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);

      let elevation = 0;

      // Biome-specific elevation formulas
      if (biome === 'golden_desert') {
        // Rolling sand dunes with ripple waves
        elevation += Math.sin(vx * 0.2 + vz * 0.15) * 0.7;
        elevation += Math.cos(vx * 0.4) * 0.2;
      } else if (biome === 'ocean_kingdom') {
        // Coastal shelf dipping into the ocean
        elevation += Math.sin(vx * 0.1) * Math.cos(vz * 0.1) * 0.3;
        if (vz < 5) elevation -= (5 - vz) * 0.15;
      } else if (biome === 'frozen_kingdom') {
        // Sharp frozen crags and snow drifts
        elevation += Math.sin(vx * 0.2) * Math.cos(vz * 0.2) * 0.5;
        if (Math.abs(vx) > 18) elevation += (Math.abs(vx) - 18) * 0.35;
      } else if (biome === 'stone_mountain') {
        // Jagged rocky peaks
        elevation += Math.sin(vx * 0.3) * Math.cos(vz * 0.3) * 0.8;
      } else if (biome === 'sweet_valley') {
        // Soft rounded marshmallow mounds
        elevation += Math.sin(vx * 0.15) * Math.sin(vz * 0.15) * 0.6 + 0.2;
      } else if (biome === 'dark_kingdom') {
        // Jagged volcanic caldera rim
        const dCenter = Math.sqrt(vx * vx + (vz + 10) ** 2);
        if (dCenter < 8) {
          elevation -= 0.6; // sunken caldera floor
        } else {
          elevation += Math.min(2.5, (dCenter - 8) * 0.2);
        }
      } else {
        // Emerald forest: rolling hills
        elevation += Math.sin(vx * 0.15) * Math.cos(vz * 0.15) * 0.35;
        const dLake = Math.sqrt((vx - 16) ** 2 + (vz - 6) ** 2);
        if (dLake < 11) {
          elevation -= Math.max(0, (11 - dLake) * 0.25);
        }
      }

      // Outer boundary mountain walls to enclose exploration area
      const distFromCenter = Math.sqrt(vx * vx + vz * vz);
      if (distFromCenter > 34) {
        elevation += (distFromCenter - 34) * 0.5;
      }

      pos.setY(i, elevation);

      // Color mapping
      const color = new THREE.Color().copy(baseColor);

      // Main road paths
      if (Math.abs(vx) < 2.5 && vz > 0 && vz < 26) {
        color.copy(pathColor);
      } else if (Math.abs(vz - 15) < 2.5 && vx > -15 && vx < 15) {
        color.copy(pathColor);
      }

      // Secondary biome gradient
      const dSecondary = Math.sqrt((vx - (-16)) ** 2 + (vz - (-10)) ** 2);
      if (dSecondary < 16) {
        color.lerp(secondaryColor, Math.max(0, 1 - dSecondary / 16));
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    return geo;
  }, [biome, environment]);

  return (
    <group>
      {/* Main Ground Mesh */}
      <mesh geometry={terrainGeo} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.88} metalness={0.08} />
      </mesh>

      {/* Dynamic Water / Lava / Chocolate plane */}
      {environment?.hasWaterPlane && (
        <mesh
          ref={waterRef}
          position={environment.waterPosition || [16, -0.15, 6]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <circleGeometry args={[environment.waterRadius || 10, 32]} />
          <meshStandardMaterial
            color={environment.waterColor || '#06b6d4'}
            transparent
            opacity={biome === 'sweet_valley' ? 0.95 : 0.82}
            roughness={0.12}
            metalness={0.25}
          />
        </mesh>
      )}

      {/* --- BIOME SPECIFIC DECORATIONS --- */}
      {biome === 'golden_desert' && (
        <group>
          {/* Desert Sun Pyramids */}
          <mesh position={[-2, 6, -22]} castShadow receiveShadow>
            <coneGeometry args={[14, 12, 4]} />
            <meshStandardMaterial color="#d97706" roughness={0.9} />
          </mesh>
          <mesh position={[-2, 12.2, -22]}>
            <coneGeometry args={[2, 2.5, 4]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} emissive="#f59e0b" emissiveIntensity={0.6} />
          </mesh>

          {/* Sandstone Obelisks */}
          <SandObelisk position={[16, 0, -12]} />
          <SandObelisk position={[-16, 0, -10]} />
          <SandObelisk position={[6, 0, 8]} />
          <SandObelisk position={[-8, 0, 8]} />

          {/* Oasis Palm Trees */}
          <PalmTree position={[4, 0, 18]} scale={1.2} />
          <PalmTree position={[-4, 0, 17]} scale={1.1} />
          <PalmTree position={[2, 0, 12]} scale={1.3} />
        </group>
      )}

      {biome === 'ocean_kingdom' && (
        <group>
          {/* Coral Pillars & Arches */}
          <CoralSpire position={[-14, 0, -8]} color="#06b6d4" scale={1.3} />
          <CoralSpire position={[14, 0, -10]} color="#38bdf8" scale={1.2} />
          <CoralSpire position={[-8, 0, 10]} color="#f43f5e" scale={1.1} />
          <CoralSpire position={[8, 0, 10]} color="#a855f7" scale={1.0} />

          {/* Sea Relic Temple */}
          <mesh position={[0, 4, -18]} castShadow>
            <cylinderGeometry args={[8, 9, 8, 8]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      )}

      {biome === 'frozen_kingdom' && (
        <group>
          {/* Frost Ice Spires */}
          <IceSpire position={[-16, 0, -12]} scale={1.5} />
          <IceSpire position={[16, 0, -12]} scale={1.4} />
          <IceSpire position={[-10, 0, 8]} scale={1.1} />
          <IceSpire position={[10, 0, 8]} scale={1.2} />

          {/* Frost Keep Citadel */}
          <mesh position={[0, 5, -20]} castShadow>
            <boxGeometry args={[14, 10, 10]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.15} metalness={0.7} />
          </mesh>

          {/* Snowy Pine Trees */}
          <SnowyPine position={[-6, 0, 16]} scale={1.2} />
          <SnowyPine position={[6, 0, 17]} scale={1.3} />
          <SnowyPine position={[-12, 0, 12]} scale={1.1} />
        </group>
      )}

      {biome === 'stone_mountain' && (
        <group>
          {/* Granite Crags & Iron Braziers */}
          <IronBrazier position={[-5, 0, 12]} />
          <IronBrazier position={[5, 0, 12]} />
          <IronBrazier position={[-12, 0, -8]} />
          <IronBrazier position={[12, 0, -8]} />

          {/* Giant Forge Anvil & Hammer Peak Citadel */}
          <mesh position={[0, 4, -18]} castShadow>
            <cylinderGeometry args={[6, 8, 8, 6]} />
            <meshStandardMaterial color="#44403c" roughness={0.6} metalness={0.8} />
          </mesh>
          <mesh position={[0, 8.5, -18]}>
            <boxGeometry args={[4, 2, 8]} />
            <meshStandardMaterial color="#78716c" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      )}

      {biome === 'sweet_valley' && (
        <group>
          {/* Giant Candy Canes & Peppermint Discs */}
          <GiantCandyCane position={[-8, 0, 10]} />
          <GiantCandyCane position={[8, 0, 10]} />
          <PeppermintDisc position={[-14, 0, -8]} />
          <PeppermintDisc position={[14, 0, -8]} />

          {/* Sugar Crystal Palace */}
          <mesh position={[0, 5, -18]} castShadow>
            <cylinderGeometry args={[7, 8, 10, 16]} />
            <meshStandardMaterial color="#f472b6" roughness={0.2} metalness={0.3} emissive="#fbcfe8" emissiveIntensity={0.2} />
          </mesh>
        </group>
      )}

      {biome === 'dark_kingdom' && (
        <group>
          {/* Obsidian Monoliths & Void Braziers */}
          <VoidMonolith position={[-12, 0, -10]} />
          <VoidMonolith position={[12, 0, -10]} />
          <VoidMonolith position={[-6, 0, 12]} />
          <VoidMonolith position={[6, 0, 12]} />

          {/* Lord Zero Void Spire */}
          <mesh position={[0, 6, -18]} castShadow>
            <octahedronGeometry args={[5, 2]} />
            <meshStandardMaterial color="#3b0764" roughness={0.2} metalness={0.9} emissive="#7c3aed" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {/* Default Emerald Forest Props */}
      {biome === 'emerald_forest' && (
        <group>
          <VillageHouse position={[-8, 0, 12]} rotationY={0.3} roofColor="#b45309" />
          <VillageHouse position={[8, 0, 10]} rotationY={-0.4} roofColor="#d97706" />
          <VillageHouse position={[10, 0, 20]} rotationY={-0.6} roofColor="#7c2d12" />
          <VillageWell position={[0, 0, 14]} />
          <WoodFence position={[-4, 0, 8]} count={4} />
          <WoodFence position={[4, 0, 6]} count={3} />

          <GiantForestTree position={[-14, 0, 8]} scale={1.3} />
          <GiantForestTree position={[-22, 0, 6]} scale={1.5} />
          <GiantForestTree position={[-18, 0, -4]} scale={1.4} />
          <GiantForestTree position={[-10, 0, -2]} scale={1.1} />

          {/* Stone Archway Portal to Ancient Ruins */}
          <group position={[18, 0, -14]} rotation={[0, -0.4, 0]}>
            <mesh position={[-2.2, 2.5, 0]} castShadow>
              <boxGeometry args={[0.8, 5, 0.8]} />
              <meshStandardMaterial color="#64748b" roughness={0.9} />
            </mesh>
            <mesh position={[2.2, 2.5, 0]} castShadow>
              <boxGeometry args={[0.8, 5, 0.8]} />
              <meshStandardMaterial color="#64748b" roughness={0.9} />
            </mesh>
            <mesh position={[0, 5.2, 0]} castShadow>
              <boxGeometry args={[5.2, 0.8, 0.9]} />
              <meshStandardMaterial color="#64748b" roughness={0.9} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};

// ==========================================
// PROCEDURAL 3D BIOME PROPS
// ==========================================

const SandObelisk: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 2.5, 0]} castShadow>
      <boxGeometry args={[0.9, 5, 0.9]} />
      <meshStandardMaterial color="#d97706" roughness={0.8} />
    </mesh>
    <mesh position={[0, 5.4, 0]} castShadow>
      <coneGeometry args={[0.65, 1.2, 4]} />
      <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} emissive="#f59e0b" emissiveIntensity={0.4} />
    </mesh>
  </group>
);

const PalmTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[0, 2.5, 0]} castShadow>
      <cylinderGeometry args={[0.18, 0.28, 5, 6]} />
      <meshStandardMaterial color="#78350f" roughness={0.9} />
    </mesh>
    {/* Fronds */}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <mesh key={i} position={[0, 5.1, 0]} rotation={[0.4, (i * Math.PI) / 3, 0]}>
        <boxGeometry args={[0.4, 0.05, 2.2]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} />
      </mesh>
    ))}
  </group>
);

const CoralSpire: React.FC<{ position: [number, number, number]; color: string; scale?: number }> = ({ position, color, scale = 1 }) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[0, 2, 0]} castShadow>
      <coneGeometry args={[0.6, 4, 7]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} emissive={color} emissiveIntensity={0.25} />
    </mesh>
  </group>
);

const IceSpire: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[0, 3, 0]} castShadow>
      <coneGeometry args={[0.8, 6, 5]} />
      <meshStandardMaterial color="#bae6fd" roughness={0.1} metalness={0.8} transparent opacity={0.88} />
    </mesh>
  </group>
);

const SnowyPine: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[0, 1, 0]} castShadow>
      <cylinderGeometry args={[0.2, 0.3, 2, 6]} />
      <meshStandardMaterial color="#451a03" />
    </mesh>
    <mesh position={[0, 2.5, 0]} castShadow>
      <coneGeometry args={[1.5, 2.2, 6]} />
      <meshStandardMaterial color="#064e3b" />
    </mesh>
    <mesh position={[0, 4, 0]} castShadow>
      <coneGeometry args={[1.1, 1.8, 6]} />
      <meshStandardMaterial color="#e0f2fe" />
    </mesh>
  </group>
);

const IronBrazier: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 1, 0]} castShadow>
      <cylinderGeometry args={[0.4, 0.3, 2, 6]} />
      <meshStandardMaterial color="#292524" metalness={0.9} roughness={0.4} />
    </mesh>
    <mesh position={[0, 2.1, 0]}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.8} />
    </mesh>
    <pointLight position={[0, 2.2, 0]} color="#f97316" intensity={2} distance={8} />
  </group>
);

const GiantCandyCane: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 2.5, 0]} castShadow>
      <cylinderGeometry args={[0.2, 0.2, 5, 8]} />
      <meshStandardMaterial color="#f43f5e" roughness={0.3} />
    </mesh>
    <mesh position={[0.4, 5.2, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
      <meshStandardMaterial color="#ffffff" roughness={0.3} />
    </mesh>
  </group>
);

const PeppermintDisc: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[1.8, 1.8, 0.4, 16]} />
      <meshStandardMaterial color="#ec4899" emissive="#fbcfe8" emissiveIntensity={0.2} roughness={0.2} />
    </mesh>
  </group>
);

const VoidMonolith: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 3, 0]} castShadow>
      <boxGeometry args={[0.8, 6, 0.8]} />
      <meshStandardMaterial color="#18181b" metalness={0.95} roughness={0.2} emissive="#581c87" emissiveIntensity={0.4} />
    </mesh>
    <pointLight position={[0, 3.5, 0]} color="#c084fc" intensity={1.8} distance={8} />
  </group>
);

const VillageHouse: React.FC<{ position: [number, number, number]; rotationY?: number; roofColor?: string }> = ({
  position,
  rotationY = 0,
  roofColor = '#b45309',
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.2, 2.6, 2.8]} />
      <meshStandardMaterial color="#fef3c7" roughness={0.8} />
    </mesh>
    <mesh position={[0, 3.2, 0]} castShadow>
      <coneGeometry args={[2.5, 1.6, 4]} />
      <meshStandardMaterial color={roofColor} roughness={0.6} />
    </mesh>
  </group>
);

const VillageWell: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.5, 0]} castShadow>
      <cylinderGeometry args={[0.9, 1.0, 1.0, 8]} />
      <meshStandardMaterial color="#64748b" roughness={0.9} />
    </mesh>
  </group>
);

const WoodFence: React.FC<{ position: [number, number, number]; count?: number }> = ({ position, count = 3 }) => (
  <group position={position}>
    {Array.from({ length: count }).map((_, i) => (
      <mesh key={i} position={[i * 1.2, 0.45, 0]} castShadow>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
    ))}
  </group>
);

const GiantForestTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[0, 2.5, 0]} castShadow>
      <cylinderGeometry args={[0.35, 0.55, 5, 8]} />
      <meshStandardMaterial color="#451a03" roughness={0.9} />
    </mesh>
    <mesh position={[0, 6, 0]} castShadow>
      <sphereGeometry args={[2.2, 12, 12]} />
      <meshStandardMaterial color="#15803d" roughness={0.8} />
    </mesh>
  </group>
);
