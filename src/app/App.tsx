import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AppProvider } from './providers/AppProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NetworkStatusBadge } from '@/components/common/NetworkStatusBadge';
import { PwaInstallModal } from '@/components/ui/PwaInstallModal';
import { OfflineResourceModal } from '@/components/ui/OfflineResourceModal';
import { usePwaStore } from '@/services/pwa/usePwaStore';

export const App: React.FC = () => {
  const {
    initPwaListeners,
    isInstallModalOpen,
    isOfflineModalOpen,
    setInstallModalOpen,
    setOfflineModalOpen,
  } = usePwaStore();

  useEffect(() => {
    const cleanup = initPwaListeners();
    return cleanup;
  }, [initPwaListeners]);

  return (
    <ErrorBoundary>
      <AppProvider>
        <RouterProvider router={router} />
        <NetworkStatusBadge />
        <PwaInstallModal
          isOpen={isInstallModalOpen}
          onClose={() => setInstallModalOpen(false)}
        />
        <OfflineResourceModal
          isOpen={isOfflineModalOpen}
          onClose={() => setOfflineModalOpen(false)}
        />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
