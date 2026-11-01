import React from 'react';
import { Outlet } from 'react-router-dom';
import { GameHeader } from './GameHeader';
import { useCampaignStore } from '@/game/state/useCampaignStore';

export const GameLayout: React.FC = () => {
  const { activeCampaignId } = useCampaignStore();

  return (
    <div
      className={`theme-${activeCampaignId}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'var(--bg-deep-space, #070b14)',
        color: '#f8fafc',
      }}
    >
      <GameHeader />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};
