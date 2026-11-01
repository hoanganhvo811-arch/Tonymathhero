import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '@/game/state/usePlayerStore';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { useProgressStore } from '@/game/state/useProgressStore';
import { useSettingsStore } from '@/game/state/useSettingsStore';
import { persistenceService } from '@/services/persistence/persistenceService';
import { LoadingScreen } from '@/components/common/LoadingScreen';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Đang kết nối lưu trữ Seven Kingdoms...');

  const { initPlayer } = usePlayerStore();
  const { setCampaignIdQuietly } = useCampaignStore();
  const { loadAllCampaignsProgress, loadProgressForCampaign } = useProgressStore();
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    let isMounted = true;

    async function initializeGame() {
      try {
        setLoadingMsg('Đang tải hồ sơ hiệp sĩ...');
        // 1. Settings
        await loadSettings();

        // 2. Player
        const player = await initPlayer();

        // 3. Active Session (Campaign)
        setLoadingMsg('Đang đồng bộ tiến trình hai chiến dịch...');
        const session = await persistenceService.getActiveSession();
        const initialCampaignId = session ? session.activeCampaignId : 'grade-2';
        setCampaignIdQuietly(initialCampaignId);

        // 4. Progress for all campaigns
        await loadAllCampaignsProgress(player.id);
        await loadProgressForCampaign(player.id, initialCampaignId);

        if (isMounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        if (isMounted) {
          setIsReady(true); // Don't hang indefinitely on error
        }
      }
    }

    initializeGame();

    return () => {
      isMounted = false;
    };
  }, [initPlayer, loadSettings, setCampaignIdQuietly, loadAllCampaignsProgress, loadProgressForCampaign]);

  if (!isReady) {
    return <LoadingScreen message={loadingMsg} />;
  }

  return <>{children}</>;
};
