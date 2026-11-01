import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export const EnvironmentEffects: React.FC = () => {
  const { scene } = useThree();
  const particlesRef = useRef<THREE.Points>(null);

  // Set scene fog
  React.useEffect(() => {
    scene.fog = new THREE.FogExp2('#071325', 0.0075);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  // Generate atmospheric fantasy floating particles
  const { positions, colors } = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const c1 = new THREE.Color('#38bdf8'); // Cyan
    const c2 = new THREE.Color('#fbbf24'); // Gold
    const c3 = new THREE.Color('#34d399'); // Emerald
    const c4 = new THREE.Color('#f87171'); // Fire ember

    for (let i = 0; i < count; i++) {
      // Scatter over continent (-45 to 45)
      pos[i * 3] = (Math.random() - 0.5) * 90;
      pos[i * 3 + 1] = 1.0 + Math.random() * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 90;

      // Color variation
      const rand = Math.random();
      const chosenColor = rand < 0.35 ? c1 : rand < 0.65 ? c2 : rand < 0.85 ? c3 : c4;

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.02;
      const posAttr = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i);
        y -= 0.03; // Gentle downward drift
        if (y < 0.5) y = 16.0;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Cinematic Lighting Rig */}
      <ambientLight intensity={0.85} color="#e2e8f0" />

      {/* Main Fantasy Sunlight */}
      <directionalLight
        position={[45, 60, 35]}
        intensity={1.8}
        color="#fffbeb"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={180}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0005}
      />

      {/* Secondary Fill Light */}
      <directionalLight
        position={[-35, 40, -40]}
        intensity={0.65}
        color="#38bdf8"
      />

      {/* Volcanic Rim Underlight */}
      <pointLight
        position={[10, 4, -26]}
        color="#ef4444"
        intensity={2.5}
        distance={25}
      />

      {/* Ocean Kingdom Cyan Lagoon Light */}
      <pointLight
        position={[20, 2, 20]}
        color="#06b6d4"
        intensity={2.0}
        distance={22}
      />

      {/* Atmospheric Floating Magic Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.65}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
