import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, HardDrive, CheckCircle2 } from 'lucide-react';
import { usePwaStore } from '@/services/pwa/usePwaStore';

export const NetworkStatusBadge: React.FC = () => {
  const { isOnline, setOfflineModalOpen } = usePwaStore();
  const [wasOffline, setWasOffline] = useState(false);
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setShowRestoredNotice(false);
    } else if (wasOffline) {
      setShowRestoredNotice(true);
      const timer = setTimeout(() => {
        setShowRestoredNotice(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // If online and no recent reconnection event, render nothing (unobtrusive)
  if (isOnline && !showRestoredNotice) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9000,
        pointerEvents: 'auto',
        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {!isOnline ? (
        <button
          onClick={() => setOfflineModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
            border: '1.5px solid #fbbf24',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.75), 0 0 12px rgba(251, 191, 36, 0.4)',
            color: '#f8fafc',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          title="Nhấn để kiểm tra tài nguyên ngoại tuyến"
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#f59e0b',
              boxShadow: '0 0 8px #f59e0b',
              display: 'inline-block',
            }}
          />
          <WifiOff size={14} color="#f59e0b" />
          <span>Chế độ Ngoại Tuyến (Offline) – Tiến trình tự lưu</span>
          <span
            style={{
              background: 'rgba(251, 191, 36, 0.2)',
              color: '#fde047',
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '6px',
              marginLeft: '4px',
            }}
          >
            Chi tiết
          </span>
        </button>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.95), rgba(15, 23, 42, 0.98))',
            border: '1.5px solid #34d399',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.75), 0 0 12px rgba(52, 211, 153, 0.4)',
            color: '#ecfdf5',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={15} color="#34d399" />
          <span>Đã kết nối lại Internet</span>
        </div>
      )}
    </div>
  );
};
