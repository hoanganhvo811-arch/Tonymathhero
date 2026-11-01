import React from 'react';
import { Award, Gift, Sparkles, Coins, CheckCircle } from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { Badge } from '@/components/common/Badge';
import { useQuestStore } from '../useQuestStore';

export const QuestRewardModal: React.FC = () => {
  const { recentRewardNotification, clearRewardNotification } = useQuestStore();

  if (!recentRewardNotification) return null;

  const { quest, expGained, goldGained, itemNames } = recentRewardNotification;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
      }}
      onClick={clearRewardNotification}
    >
      <div
        style={{
          width: '460px',
          maxWidth: '100%',
          background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
          border: '2px solid #fbbf24',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(251, 191, 36, 0.35)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
          position: 'relative',
          animation: 'zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Crown / Trophy Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(217, 119, 6, 0.2) 100%)',
            border: '2px solid #fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            boxShadow: '0 0 25px rgba(251, 191, 36, 0.6)',
          }}
        >
          <Award size={36} />
        </div>

        {/* Title */}
        <div>
          <Badge variant="gold">
            <Sparkles size={12} style={{ marginRight: '4px' }} /> NHIỆM VỤ HOÀN THÀNH
          </Badge>
          <h2
            className="font-cinematic"
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#ffffff',
              marginTop: '6px',
            }}
          >
            {quest.title}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            Bạn đã xuất sắc hoàn thành tất cả mục tiêu của nhiệm vụ!
          </p>
        </div>

        {/* Rewards Box */}
        <div
          style={{
            width: '100%',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          {/* EXP */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Kinh Nghiệm</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontWeight: 800, fontSize: '1.15rem', marginTop: '2px' }}>
              <Sparkles size={16} />
              +{expGained}
            </div>
          </div>

          <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />

          {/* Gold */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Tiền Vàng</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 800, fontSize: '1.15rem', marginTop: '2px' }}>
              <Coins size={16} />
              +{goldGained}
            </div>
          </div>
        </div>

        {/* Item reward if present */}
        {itemNames && itemNames.length > 0 && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'rgba(52, 211, 153, 0.1)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '12px',
              fontSize: '0.9rem',
              color: '#34d399',
              fontWeight: 700,
            }}
          >
            <Gift size={16} />
            Nhận được: {itemNames.join(', ')}
          </div>
        )}

        {/* Continue Button */}
        <SoundButton
          variant="gold"
          size="lg"
          style={{ width: '100%' }}
          onClick={clearRewardNotification}
          icon={<CheckCircle size={18} />}
        >
          TIẾP TỤC HÀNH TRÌNH
        </SoundButton>
      </div>
    </div>
  );
};
