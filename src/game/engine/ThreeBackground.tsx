import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSettingsStore } from '@/game/state/useSettingsStore';

interface ThreeBackgroundProps {
  theme?: 'grade-2' | 'grade-3' | 'intro';
  interactive?: boolean;
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({
  theme = 'intro',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettingsStore();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: settings.graphicsQuality === 'cinematic' || settings.graphicsQuality === 'high',
        alpha: true,
      });
    } catch (e) {
      console.warn('WebGL not supported, using CSS fallback');
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.graphicsQuality === 'cinematic' ? 2 : 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 18;

    // Theme colors
    let primaryColorHex = 0x38bdf8; // Blue
    let secondaryColorHex = 0x818cf8; // Purple/Indigo
    let fogColorHex = 0x07111e;

    if (theme === 'grade-2') {
      primaryColorHex = 0x38bdf8;
      secondaryColorHex = 0x34d399;
      fogColorHex = 0x051b2e;
    } else if (theme === 'grade-3') {
      primaryColorHex = 0xef4444;
      secondaryColorHex = 0xf59e0b;
      fogColorHex = 0x1f0b0b;
    }

    scene.fog = new THREE.FogExp2(fogColorHex, 0.025);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(primaryColorHex, 2.5, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(secondaryColorHex, 2.0, 50);
    pointLight2.position.set(-10, -8, 8);
    scene.add(pointLight2);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Central Floating Knowledge Gem / Monolith
    const gemGeometry = new THREE.OctahedronGeometry(2.4, 0);
    const gemMaterial = new THREE.MeshPhysicalMaterial({
      color: primaryColorHex,
      emissive: primaryColorHex,
      emissiveIntensity: 0.35,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const mainGem = new THREE.Mesh(gemGeometry, gemMaterial);
    mainGem.position.set(0, 0.5, 0);
    mainGroup.add(mainGem);

    // Runic Orbiting Ring
    const ringGeometry = new THREE.TorusGeometry(4.2, 0.08, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: secondaryColorHex,
      emissive: secondaryColorHex,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });
    const orbitRing1 = new THREE.Mesh(ringGeometry, ringMaterial);
    orbitRing1.rotation.x = Math.PI / 3;
    mainGroup.add(orbitRing1);

    const ringGeometry2 = new THREE.TorusGeometry(5.4, 0.05, 16, 100);
    const orbitRing2 = new THREE.Mesh(ringGeometry2, ringMaterial);
    orbitRing2.rotation.y = Math.PI / 4;
    mainGroup.add(orbitRing2);

    // Secondary floating crystals around
    const crystals: THREE.Mesh[] = [];
    const crystalGeo = new THREE.ConeGeometry(0.5, 1.4, 5);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: secondaryColorHex,
      emissive: secondaryColorHex,
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.5,
    });

    const crystalCount = settings.graphicsQuality === 'medium' ? 6 : 14;
    for (let i = 0; i < crystalCount; i++) {
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      const angle = (i / crystalCount) * Math.PI * 2;
      const radius = 7 + (i % 3) * 2;
      crystal.position.set(
        Math.cos(angle) * radius,
        (Math.sin(i * 1.5) * 4) + (i % 2 === 0 ? 1 : -1),
        (Math.sin(angle) * radius) - 4
      );
      crystal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mainGroup.add(crystal);
      crystals.push(crystal);
    }

    // Particle Stars / Math Runes
    let particleCount = 200;
    if (settings.particlesEnabled) {
      particleCount =
        settings.graphicsQuality === 'cinematic'
          ? 700
          : settings.graphicsQuality === 'high'
          ? 400
          : settings.graphicsQuality === 'medium'
          ? 200
          : 80;
    } else {
      particleCount = 50;
    }

    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 60;
      particlePositions[i + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i + 2] = (Math.random() - 0.5) * 40 - 5;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: primaryColorHex,
      size: 0.25,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Main Gem floating and rotation
      mainGem.rotation.y += 0.4 * delta;
      mainGem.rotation.x = Math.sin(elapsedTime * 0.8) * 0.15;
      mainGem.position.y = 0.5 + Math.sin(elapsedTime * 1.2) * 0.35;

      // Orbit rings
      orbitRing1.rotation.z += 0.3 * delta;
      orbitRing1.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.5) * 0.1;

      orbitRing2.rotation.z -= 0.25 * delta;
      orbitRing2.rotation.y = Math.PI / 4 + Math.cos(elapsedTime * 0.6) * 0.12;

      // Crystals hover
      crystals.forEach((c, idx) => {
        c.rotation.y += (0.2 + (idx % 3) * 0.1) * delta;
        c.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.005;
      });

      // Particles gentle drift
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      // Smooth camera parallax
      targetX += (mouseX * 1.2 - targetX) * 0.05;
      targetY += (-mouseY * 1.0 - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      gemGeometry.dispose();
      gemMaterial.dispose();
      ringGeometry.dispose();
      ringGeometry2.dispose();
      ringMaterial.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [theme, interactive, settings.graphicsQuality, settings.particlesEnabled]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
};
