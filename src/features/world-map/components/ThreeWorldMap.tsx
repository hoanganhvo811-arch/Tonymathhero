import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import type { CampaignId, Kingdom, KingdomLandmark } from '@/types';
import { WorldTerrain } from './WorldTerrain';
import { KingdomZone } from './KingdomZone';
import { TonyHeroMarker } from './TonyHeroMarker';
import { EnvironmentEffects } from './EnvironmentEffects';
import { CameraControlsManager } from './CameraControlsManager';
import { SEVEN_KINGDOMS_3D_CONFIGS } from '@/data/kingdoms/sevenKingdoms3dConfig';

interface ThreeWorldMapProps {
  kingdoms: Kingdom[];
  unlockedKingdomIds: string[];
  rescuedKingdomIds: string[];
  currentKingdomId: string;
  selectedKingdom: Kingdom | null;
  heroLevel: number;
  campaignId: CampaignId;
  resetCameraTrigger: number;
  onSelectKingdom: (kingdom: Kingdom) => void;
  onSelectLandmark: (landmark: KingdomLandmark) => void;
  onGroundClick?: () => void;
}

export const ThreeWorldMap: React.FC<ThreeWorldMapProps> = ({
  kingdoms,
  unlockedKingdomIds,
  rescuedKingdomIds,
  currentKingdomId,
  selectedKingdom,
  heroLevel,
  campaignId,
  resetCameraTrigger,
  onSelectKingdom,
  onSelectLandmark,
  onGroundClick,
}) => {
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // WebGL Fallback screen
  if (!webGLSupported) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#091528',
          color: '#ffffff',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ fontSize: '1.4rem', color: '#f59e0b', marginBottom: '8px' }}>
          Trình duyệt không hỗ trợ WebGL 3D
        </h3>
        <p style={{ color: '#94a3b8', maxWidth: '480px' }}>
          Vui lòng kích hoạt tăng tốc phần cứng (Hardware Acceleration) trong cài đặt trình duyệt để chiêm ngưỡng thế giới 3D The Seven Kingdoms.
        </p>
      </div>
    );
  }

  // Get current active position for Tony marker
  const currentKingdom = kingdoms.find((k) => k.id === currentKingdomId) || kingdoms[0];
  const tonyConfig = SEVEN_KINGDOMS_3D_CONFIGS[currentKingdom?.order || 1];
  const tonyPos = tonyConfig?.worldPosition || [-28, 0.5, 18];

  // Target position for camera focusing
  const targetCamPos = selectedKingdom
    ? SEVEN_KINGDOMS_3D_CONFIGS[selectedKingdom.order]?.worldPosition || null
    : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 55, 75], fov: 42, near: 1, far: 250 }}
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        style={{
          width: '100%',
          height: '100%',
          background: '#071325',
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting, Depth Fog & Magic Particles */}
          <EnvironmentEffects />

          {/* Interactive Camera Orbit & Smooth Animation Manager */}
          <CameraControlsManager
            targetPosition={targetCamPos}
            resetTrigger={resetCameraTrigger}
          />

          {/* Continuous Continent Terrain with Vertex Colors & Water */}
          <WorldTerrain onGroundClick={onGroundClick} />

          {/* Render the 7 Kingdoms Interactive Zones */}
          {kingdoms.map((k) => {
            const isUnlocked = unlockedKingdomIds.includes(k.id) || k.isUnlockedByDefault;
            const isRescued = rescuedKingdomIds.includes(k.id);
            const isSelected = selectedKingdom?.id === k.id;
            const isTonyHere = currentKingdomId === k.id;

            return (
              <KingdomZone
                key={k.id}
                kingdom={k}
                isUnlocked={isUnlocked}
                isRescued={isRescued}
                isSelected={isSelected}
                isCurrentTonyLocation={isTonyHere}
                onSelectKingdom={onSelectKingdom}
                onSelectLandmark={onSelectLandmark}
              />
            );
          })}

          {/* Tony Hero 3D Marker at current progress */}
          <TonyHeroMarker
            position={[tonyPos[0], tonyPos[1], tonyPos[2]]}
            heroLevel={heroLevel}
            campaignId={campaignId}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
