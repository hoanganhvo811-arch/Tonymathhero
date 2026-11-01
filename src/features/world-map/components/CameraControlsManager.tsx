import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CameraControlsManagerProps {
  targetPosition: [number, number, number] | null;
  resetTrigger: number;
}

const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 55, 75);
const DEFAULT_TARGET_POS = new THREE.Vector3(0, 0, 5);

export const CameraControlsManager: React.FC<CameraControlsManagerProps> = ({
  targetPosition,
  resetTrigger,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Desired camera position and lookAt target for smooth transitions
  const desiredCamPos = useRef<THREE.Vector3>(DEFAULT_CAMERA_POS.clone());
  const desiredTargetPos = useRef<THREE.Vector3>(DEFAULT_TARGET_POS.clone());
  const isTransitioning = useRef<boolean>(false);

  // When targetPosition changes (a kingdom is clicked)
  useEffect(() => {
    if (targetPosition) {
      // Offset camera nicely to view kingdom from isometric high angle
      desiredCamPos.current.set(
        targetPosition[0] + 0,
        targetPosition[1] + 20,
        targetPosition[2] + 26
      );
      desiredTargetPos.current.set(
        targetPosition[0],
        targetPosition[1] + 1.5,
        targetPosition[2]
      );
      isTransitioning.current = true;
    }
  }, [targetPosition]);

  // When reset camera button is clicked
  useEffect(() => {
    if (resetTrigger > 0) {
      desiredCamPos.current.copy(DEFAULT_CAMERA_POS);
      desiredTargetPos.current.copy(DEFAULT_TARGET_POS);
      isTransitioning.current = true;
    }
  }, [resetTrigger]);

  // Smooth lerp during frame updates
  useFrame(() => {
    if (isTransitioning.current && controlsRef.current) {
      // Smooth lerp position
      camera.position.lerp(desiredCamPos.current, 0.06);
      controlsRef.current.target.lerp(desiredTargetPos.current, 0.06);
      controlsRef.current.update();

      const distPos = camera.position.distanceTo(desiredCamPos.current);
      const distTarget = controlsRef.current.target.distanceTo(desiredTargetPos.current);

      if (distPos < 0.15 && distTarget < 0.15) {
        camera.position.copy(desiredCamPos.current);
        controlsRef.current.target.copy(desiredTargetPos.current);
        controlsRef.current.update();
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.06}
      minDistance={20}
      maxDistance={135}
      maxPolarAngle={Math.PI / 2.15} // Cannot look below the continent horizon
      minPolarAngle={Math.PI / 6}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      panSpeed={0.8}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
};
