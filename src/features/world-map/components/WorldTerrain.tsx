import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SEVEN_KINGDOMS_3D_CONFIGS } from '@/data/kingdoms/sevenKingdoms3dConfig';

interface WorldTerrainProps {
  onGroundClick?: () => void;
}

export const WorldTerrain: React.FC<WorldTerrainProps> = ({ onGroundClick }) => {
  const waterRef = useRef<THREE.Mesh>(null);
  const magmaRef = useRef<THREE.Mesh>(null);
  const chocoRef = useRef<THREE.Mesh>(null);

  // Generate continent geometry with height variation and vertex coloring based on biomes
  const { geometry } = useMemo(() => {
    const size = 110;
    const segments = 100;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const vertexCount = pos.count;
    const colors = new Float32Array(vertexCount * 3);

    // Biome centers and colors
    const biomes = Object.values(SEVEN_KINGDOMS_3D_CONFIGS).map((conf) => ({
      x: conf.worldPosition[0],
      z: conf.worldPosition[2],
      type: conf.biomeType,
      color: new THREE.Color(conf.colorTheme.groundColor),
      radius: 18,
    }));

    const oceanColor = new THREE.Color('#034f84');
    const pathColor = new THREE.Color('#78716c');

    for (let i = 0; i < vertexCount; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);

      // Distance from continent center
      const distFromCenter = Math.sqrt(vx * vx + vz * vz);

      // Procedural elevation based on biomes
      let elevation = 0;

      // Base undulating terrain
      elevation += Math.sin(vx * 0.12) * Math.cos(vz * 0.12) * 0.4;
      elevation += Math.sin(vx * 0.25 + 1.2) * Math.sin(vz * 0.25 + 0.5) * 0.25;

      // Kingdom 4 (Frozen Mountain) elevation
      const dFrozen = Math.sqrt((vx - (-24)) ** 2 + (vz - (-16)) ** 2);
      if (dFrozen < 16) {
        elevation += Math.max(0, (16 - dFrozen) * 0.25) + Math.cos(vx * 0.4) * 0.5;
      }

      // Kingdom 5 (Stone Mountain) sharp crags elevation
      const dStone = Math.sqrt((vx - (-2)) ** 2 + (vz - (-6)) ** 2);
      if (dStone < 16) {
        elevation += Math.max(0, (16 - dStone) * 0.35) + Math.sin(vx * 0.6) * Math.cos(vz * 0.6) * 0.7;
      }

      // Kingdom 7 (Dark Kingdom) volcanic caldera rim
      const dDark = Math.sqrt((vx - 10) ** 2 + (vz - (-26)) ** 2);
      if (dDark < 16) {
        // Volcano cone with caldera depression in center
        if (dDark < 5) {
          elevation += 1.2; // Caldera floor (magma lake level)
        } else {
          elevation += Math.max(0, (16 - dDark) * 0.28);
        }
      }

      // Kingdom 6 (Sweet Valley) soft rolling mounds
      const dSweet = Math.sqrt((vx - 24) ** 2 + (vz - (-4)) ** 2);
      if (dSweet < 16) {
        elevation += Math.sin(vx * 0.3) * Math.cos(vz * 0.3) * 0.6 + 0.5;
      }

      // Kingdom 2 (Golden Desert) sand dunes
      const dDesert = Math.sqrt((vx - (-8)) ** 2 + (vz - 26) ** 2);
      if (dDesert < 16) {
        elevation += Math.sin(vx * 0.4 + vz * 0.2) * 0.45;
      }

      // Kingdom 3 (Ocean Kingdom) coastal shelf
      const dOcean = Math.sqrt((vx - 20) ** 2 + (vz - 20) ** 2);
      if (dOcean < 18) {
        elevation -= 0.6; // Dips near water
      }

      // Ocean drop-off towards continent perimeter
      if (distFromCenter > 40) {
        const drop = (distFromCenter - 40) * 0.35;
        elevation -= drop;
      }

      pos.setY(i, elevation);

      // Vertex color blending
      let totalWeight = 0;
      const blendedColor = new THREE.Color(0, 0, 0);

      biomes.forEach((b) => {
        const d = Math.sqrt((vx - b.x) ** 2 + (vz - b.z) ** 2);
        const weight = Math.exp(-(d * d) / (2 * b.radius * b.radius));
        blendedColor.r += b.color.r * weight;
        blendedColor.g += b.color.g * weight;
        blendedColor.b += b.color.b * weight;
        totalWeight += weight;
      });

      if (totalWeight > 0) {
        blendedColor.multiplyScalar(1 / totalWeight);
      } else {
        blendedColor.copy(oceanColor);
      }

      // Blend outer edge into ocean color
      if (distFromCenter > 42) {
        const oceanT = Math.min(1, (distFromCenter - 42) / 12);
        blendedColor.lerp(oceanColor, oceanT);
      }

      // Stone path between realms highlight
      // Check distance to connecting spline
      colors[i * 3] = blendedColor.r;
      colors[i * 3 + 1] = blendedColor.g;
      colors[i * 3 + 2] = blendedColor.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    return { geometry: geo };
  }, []);

  // Subtle water surface wave animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (waterRef.current) {
      waterRef.current.position.y = -0.2 + Math.sin(t * 1.2) * 0.05;
    }
    if (magmaRef.current) {
      magmaRef.current.position.y = 1.35 + Math.sin(t * 2.0) * 0.04;
    }
    if (chocoRef.current) {
      chocoRef.current.position.y = 0.5 + Math.sin(t * 1.5) * 0.03;
    }
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); onGroundClick?.(); }}>
      {/* Main Continent Terrain with Vertex Colors */}
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.85}
          metalness={0.1}
          flatShading={false}
        />
      </mesh>

      {/* Surrounding Ocean Water Plane */}
      <mesh
        ref={waterRef}
        position={[0, -0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[160, 160, 32, 32]} />
        <meshStandardMaterial
          color="#0284c7"
          transparent
          opacity={0.78}
          roughness={0.15}
          metalness={0.25}
        />
      </mesh>

      {/* Volcanic Magma Lake inside Dark Kingdom Caldera */}
      <mesh
        ref={magmaRef}
        position={[10, 1.35, -26]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[5.2, 24]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#dc2626"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Chocolate River Lake inside Sweet Valley */}
      <mesh
        ref={chocoRef}
        position={[24, 0.5, -4]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[4.5, 20]} />
        <meshStandardMaterial
          color="#582f0e"
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Oasis Pond inside Golden Desert */}
      <mesh
        position={[-14, 0.52, 22]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[2.8, 16]} />
        <meshStandardMaterial
          color="#06b6d4"
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Decorative Biome Landmarks (Pyramids, Trees, Crystals, Fortresses) */}
      <BiomeEnvironmentalProps />
    </group>
  );
};

// 3D Visual landmarks and props for each of the 7 kingdoms
const BiomeEnvironmentalProps: React.FC = () => {
  return (
    <group>
      {/* --- KINGDOM 1: EMERALD FOREST PROPS --- */}
      {/* Ancient Giant Trees */}
      <TreeCluster position={[-28, 0.5, 18]} count={12} radius={7} treeColor="#15803d" />
      <TreeCluster position={[-35, 0.5, 12]} count={8} radius={5} treeColor="#166534" />
      <StoneArch position={[-32, 0.8, 22]} />

      {/* --- KINGDOM 2: GOLDEN DESERT PROPS --- */}
      {/* Great Sand Pyramids */}
      <PyramidMesh position={[-4, 1.4, 21]} size={7} height={7} />
      <PyramidMesh position={[-1, 1.0, 28]} size={4.5} height={4.8} />
      {/* Desert Columns & Oasis Palms */}
      <DesertColumn position={[-9, 0.5, 29]} />
      <DesertColumn position={[-6, 0.5, 31]} />
      <PalmCluster position={[-14, 0.55, 22]} />

      {/* --- KINGDOM 3: OCEAN KINGDOM PROPS --- */}
      {/* Sea Rock Islands & Coral Pillars */}
      <CoralPillar position={[14, 0.2, 24]} color="#38bdf8" />
      <CoralPillar position={[26, 0.4, 16]} color="#06b6d4" />
      <CoralPillar position={[23, 0.3, 27]} color="#67e8f9" />
      <SeaBridge position={[18, 0.1, 20]} rotation={[0, 0.4, 0]} />

      {/* --- KINGDOM 4: FROZEN KINGDOM PROPS --- */}
      {/* Ice Crystal Spires */}
      <IceCrystalSpire position={[-20, 2.5, -20]} scale={[1, 3.2, 1]} />
      <IceCrystalSpire position={[-27, 2.3, -13]} scale={[0.8, 2.5, 0.8]} />
      <IceCrystalSpire position={[-23, 2.7, -17]} scale={[1.2, 3.8, 1.2]} />
      <SnowPineCluster position={[-28, 2.0, -18]} count={9} radius={5} />

      {/* --- KINGDOM 5: STONE MOUNTAIN PROPS --- */}
      {/* Rugged Rock Crags & Suspension Bridge */}
      <StoneCrag position={[-5, 3.8, -8]} scale={[2, 4.5, 2]} />
      <StoneCrag position={[2, 3.6, -5]} scale={[1.8, 3.8, 1.8]} />
      <StoneCrag position={[-1, 4.0, -11]} scale={[2.2, 5.0, 2.2]} />
      <SuspensionBridge position={[-2, 3.6, -7]} />

      {/* --- KINGDOM 6: SWEET VALLEY PROPS --- */}
      {/* Candy Canes & Lollipop Swirls */}
      <LollipopTree position={[20, 1.2, -2]} color="#ec4899" spiralColor="#fbcfe8" />
      <LollipopTree position={[28, 1.3, -3]} color="#a855f7" spiralColor="#e9d5ff" />
      <LollipopTree position={[25, 1.4, -9]} color="#06b6d4" spiralColor="#cffafe" />
      <CandyCaneArch position={[19, 1.3, -1]} />

      {/* --- KINGDOM 7: DARK KINGDOM PROPS --- */}
      {/* Obsidian Pillars & Volcanic Chimneys */}
      <ObsidianPillar position={[5, 2.8, -25]} height={5} />
      <ObsidianPillar position={[15, 3.0, -28]} height={6} />
      <ObsidianPillar position={[8, 3.2, -31]} height={5.5} />
      <VolcanoCone position={[10, 2.4, -26]} />
    </group>
  );
};

// Tree cluster for forests
const TreeCluster: React.FC<{ position: [number, number, number]; count: number; radius: number; treeColor: string }> = ({
  position,
  count,
  radius,
  treeColor,
}) => {
  const trees = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.sin(i);
      const r = (i % 2 === 0 ? 0.4 : 0.85) * radius;
      return {
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        scale: 0.7 + (i % 5) * 0.15,
      };
    });
  }, [count, radius]);

  return (
    <group position={position}>
      {trees.map((t, idx) => (
        <group key={idx} position={[t.x, 0, t.z]} scale={t.scale}>
          {/* Trunk */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.22, 1.2, 6]} />
            <meshStandardMaterial color="#5c3d2e" roughness={0.9} />
          </mesh>
          {/* Leaves cone */}
          <mesh position={[0, 1.6, 0]} castShadow>
            <coneGeometry args={[0.9, 1.8, 6]} />
            <meshStandardMaterial color={treeColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, 2.4, 0]} castShadow>
            <coneGeometry args={[0.65, 1.4, 6]} />
            <meshStandardMaterial color={treeColor} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Snow pine cluster for Frozen Kingdom
const SnowPineCluster: React.FC<{ position: [number, number, number]; count: number; radius: number }> = ({
  position,
  count,
  radius,
}) => {
  return (
    <group position={position}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const r = (i % 2 === 0 ? 0.5 : 0.9) * radius;
        return (
          <group key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]} scale={0.75 + (i % 3) * 0.15}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.12, 0.18, 1.0, 5]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <coneGeometry args={[0.85, 1.7, 5]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.6} />
            </mesh>
            <mesh position={[0, 2.2, 0]}>
              <coneGeometry args={[0.6, 1.2, 5]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Sandstone Pyramid
const PyramidMesh: React.FC<{ position: [number, number, number]; size: number; height: number }> = ({
  position,
  size,
  height,
}) => {
  return (
    <group position={position}>
      {/* Main Pyramid */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <coneGeometry args={[size * 0.7, height, 4]} />
        <meshStandardMaterial
          color="#d97706"
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>
      {/* Golden Capstone */}
      <mesh position={[0, height - 0.2, 0]}>
        <coneGeometry args={[size * 0.18, 0.6, 4]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#ca8a04"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
};

// Palm tree cluster for desert oasis
const PalmCluster: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {[0, 1.2, -1.0].map((offset, i) => (
        <group key={i} position={[offset, 0, (i % 2) * 0.8]} scale={0.8 + i * 0.1}>
          {/* Curved trunk */}
          <mesh position={[0, 1.0, 0]} rotation={[0, 0, 0.12 * (i - 1)]}>
            <cylinderGeometry args={[0.1, 0.16, 2.0, 6]} />
            <meshStandardMaterial color="#854d0e" roughness={0.9} />
          </mesh>
          {/* Palm Fronds */}
          <mesh position={[0.15 * (i - 1), 2.1, 0]}>
            <sphereGeometry args={[0.9, 7, 5]} />
            <meshStandardMaterial color="#16a34a" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Desert column
const DesertColumn: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <mesh position={[position[0], position[1] + 1.2, position[2]]} castShadow>
    <cylinderGeometry args={[0.25, 0.35, 2.4, 8]} />
    <meshStandardMaterial color="#b45309" roughness={0.8} />
  </mesh>
);

// Stone arch for Emerald Forest
const StoneArch: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[-0.8, 1.0, 0]} castShadow>
      <boxGeometry args={[0.4, 2.0, 0.4]} />
      <meshStandardMaterial color="#334155" roughness={0.9} />
    </mesh>
    <mesh position={[0.8, 1.0, 0]} castShadow>
      <boxGeometry args={[0.4, 2.0, 0.4]} />
      <meshStandardMaterial color="#334155" roughness={0.9} />
    </mesh>
    <mesh position={[0, 2.1, 0]} castShadow>
      <boxGeometry args={[2.2, 0.4, 0.5]} />
      <meshStandardMaterial color="#334155" roughness={0.9} />
    </mesh>
  </group>
);

// Coral pillar for Ocean Kingdom
const CoralPillar: React.FC<{ position: [number, number, number]; color: string }> = ({ position, color }) => (
  <mesh position={[position[0], position[1] + 1.5, position[2]]} castShadow>
    <cylinderGeometry args={[0.3, 0.5, 3.0, 6]} />
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.25}
      roughness={0.4}
    />
  </mesh>
);

// Sea bridge
const SeaBridge: React.FC<{ position: [number, number, number]; rotation: [number, number, number] }> = ({
  position,
  rotation,
}) => (
  <mesh position={position} rotation={rotation}>
    <boxGeometry args={[1.2, 0.25, 6]} />
    <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
  </mesh>
);

// Ice Crystal Spire for Frozen Kingdom
const IceCrystalSpire: React.FC<{ position: [number, number, number]; scale: [number, number, number] }> = ({
  position,
  scale,
}) => (
  <mesh position={[position[0], position[1] + scale[1] / 2, position[2]]} scale={scale} castShadow>
    <octahedronGeometry args={[1, 0]} />
    <meshStandardMaterial
      color="#7dd3fc"
      emissive="#38bdf8"
      emissiveIntensity={0.35}
      roughness={0.15}
      metalness={0.3}
      transparent
      opacity={0.88}
    />
  </mesh>
);

// Stone Mountain crags
const StoneCrag: React.FC<{ position: [number, number, number]; scale: [number, number, number] }> = ({
  position,
  scale,
}) => (
  <mesh position={[position[0], position[1] + scale[1] / 2, position[2]]} scale={scale} castShadow>
    <dodecahedronGeometry args={[1, 0]} />
    <meshStandardMaterial color="#475569" roughness={0.95} />
  </mesh>
);

// Suspension bridge for Stone Mountain
const SuspensionBridge: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0, 0]} rotation={[0, 0.3, 0]}>
      <boxGeometry args={[1.0, 0.1, 5.5]} />
      <meshStandardMaterial color="#78350f" roughness={0.9} />
    </mesh>
  </group>
);

// Lollipop tree for Sweet Valley
const LollipopTree: React.FC<{ position: [number, number, number]; color: string; spiralColor: string }> = ({
  position,
  color,
  spiralColor,
}) => (
  <group position={position}>
    {/* White stick */}
    <mesh position={[0, 1.0, 0]} castShadow>
      <cylinderGeometry args={[0.08, 0.08, 2.0, 8]} />
      <meshStandardMaterial color="#ffffff" roughness={0.3} />
    </mesh>
    {/* Candy Disc / Sphere */}
    <mesh position={[0, 2.2, 0]} castShadow>
      <sphereGeometry args={[0.85, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={spiralColor}
        emissiveIntensity={0.25}
        roughness={0.3}
      />
    </mesh>
  </group>
);

// Candy Cane Arch
const CandyCaneArch: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[-0.8, 1.2, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.12, 2.4, 8]} />
      <meshStandardMaterial color="#f43f5e" roughness={0.4} />
    </mesh>
    <mesh position={[0.8, 1.2, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.12, 2.4, 8]} />
      <meshStandardMaterial color="#f43f5e" roughness={0.4} />
    </mesh>
  </group>
);

// Obsidian Pillar for Dark Kingdom
const ObsidianPillar: React.FC<{ position: [number, number, number]; height: number }> = ({ position, height }) => (
  <mesh position={[position[0], position[1] + height / 2, position[2]]} castShadow>
    <cylinderGeometry args={[0.35, 0.7, height, 5]} />
    <meshStandardMaterial
      color="#18181b"
      emissive="#ef4444"
      emissiveIntensity={0.15}
      roughness={0.6}
      metalness={0.4}
    />
  </mesh>
);

// Volcano Cone
const VolcanoCone: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[2.5, 5.5, 3.0, 16]} />
      <meshStandardMaterial
        color="#27272a"
        roughness={0.9}
        metalness={0.2}
      />
    </mesh>
  </group>
);
