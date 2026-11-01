import React from 'react';
import {
  X,
  Swords,
  Gift,
  ShieldAlert,
  Flame,
  Castle,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { Badge } from '@/components/common/Badge';
import type { KingdomLandmark } from '@/types/kingdom';

interface LandmarkModalProps {
  landmark: KingdomLandmark | null;
  onClose: () => void;
}

export const LandmarkModal: React.FC<LandmarkModalProps> = ({ landmark, onClose }) => {
  if (!landmark) return null;

  const getIcon = () => {
    switch (landmark.type) {
      case 'quest_point':
        return <MapPin size={28} color="#38bdf8" />;
      case 'monster_camp':
        return <Flame size={28} color="#ef4444" />;
      case 'treasure':
        return <Gift size={28} color="#facc15" />;
      case 'boss_gate':
        return <ShieldAlert size={28} color="#c084fc" />;
      case 'kingdom_castle':
        return <Castle size={28} color="#34d399" />;
      default:
        return <Swords size={28} color="#fbbf24" />;
    }
  };

  const getTypeNameVi = () => {
    switch (landmark.type) {
      case 'quest_point':
        return 'ĐIỂM NHIỆM VỤ (QUEST POINT)';
      case 'monster_camp':
        return 'TRẠI QUÁI VẬT (MONSTER CAMP)';
      case 'treasure':
        return 'RƯƠNG BÁU TRI THỨC (TREASURE)';
      case 'boss_gate':
        return 'CỔNG ĐẠI ĐIỆN BOSS (BOSS GATE)';
      case 'kingdom_castle':
        return 'LÂU ĐÀI TRUNG TÂM (KINGDOM CASTLE)';
      default:
        return 'ĐỊA ĐIỂM KHÁM PHÁ';
    }
  };

  const getBadgeVariant = () => {
    switch (landmark.type) {
      case 'quest_point':
        return 'grade2';
      case 'monster_camp':
        return 'grade3';
      case 'treasure':
        return 'gold';
      case 'boss_gate':
        return 'locked';
      case 'kingdom_castle':
        return 'emerald';
      default:
        return 'gold';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '460px',
          maxWidth: '100%',
          background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1d 100%)',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(251, 191, 36, 0.2)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Top Header with Icon and Type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {getIcon()}
          </div>
          <div>
            <Badge variant={getBadgeVariant() as any}>
              {getTypeNameVi()}
            </Badge>
            <h3
              className="font-cinematic"
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
                marginTop: '4px',
              }}
            >
              {landmark.vietnameseName}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {landmark.name}
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: '0.92rem',
            color: '#cbd5e1',
            lineHeight: '1.5',
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {landmark.description}
        </p>

        {/* Reward Preview */}
        {landmark.rewardSummary && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(250, 204, 21, 0.1)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '0.88rem',
              color: '#facc15',
            }}
          >
            <Gift size={18} />
            <span>
              <strong>Phần thưởng dự kiến:</strong> {landmark.rewardSummary}
            </span>
          </div>
        )}

        {/* Phase Readiness Note */}
        <div
          style={{
            fontSize: '0.82rem',
            color: '#94a3b8',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <CheckCircle size={14} color="#34d399" />
          Điểm mốc đã sẵn sàng kết nối hệ thống Nhiệm Vụ & Chiến Đấu ở Phase 4.
        </div>

        {/* Action Button */}
        <SoundButton variant="primary" style={{ width: '100%' }} onClick={onClose}>
          ĐÓNG THÔNG TIN
        </SoundButton>
      </div>
    </div>
  );
};
