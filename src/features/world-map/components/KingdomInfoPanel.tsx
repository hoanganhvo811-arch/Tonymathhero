import React from 'react';
import {
  X,
  Swords,
  Shield,
  Gem,
  CheckCircle,
  Lock,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { Badge } from '@/components/common/Badge';
import { ALL_MONSTERS } from '@/data/monsters';
import type { Kingdom } from '@/types/kingdom';
import { SEVEN_KINGDOMS_3D_CONFIGS } from '@/data/kingdoms/sevenKingdoms3dConfig';

interface KingdomInfoPanelProps {
  kingdom: Kingdom;
  isUnlocked: boolean;
  isRescued: boolean;
  isCurrent: boolean;
  onClose: () => void;
  onEnter: (kingdom: Kingdom) => void;
  onSimulateRescue: (kingdom: Kingdom) => void;
  onChallengeBoss?: (bossId: string) => void;
}

export const KingdomInfoPanel: React.FC<KingdomInfoPanelProps> = ({
  kingdom,
  isUnlocked,
  isRescued,
  isCurrent,
  onClose,
  onEnter,
  onSimulateRescue,
  onChallengeBoss,
}) => {
  const conf = SEVEN_KINGDOMS_3D_CONFIGS[kingdom.order] || SEVEN_KINGDOMS_3D_CONFIGS[1];
  const monster = ALL_MONSTERS[kingdom.guardianMonsterId];
  const theme = conf.colorTheme;

  // Calculate completion percentage
  const completionPercent = isRescued ? 100 : isUnlocked ? 35 : 0;
  const completedQuestsCount = isRescued ? 5 : isUnlocked ? 1 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        bottom: '20px',
        width: '380px',
        maxWidth: 'calc(100vw - 40px)',
        zIndex: 30,
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(10, 15, 29, 0.98) 100%)',
        border: `1px solid ${theme.primary}88`,
        borderRadius: '20px',
        boxShadow: `0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px ${theme.primary}44`,
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Header with Title and Close Button */}
      <div
        style={{
          position: 'relative',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: `linear-gradient(135deg, ${theme.primary}22 0%, transparent 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: theme.accent,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              VƯƠNG QUỐC 0{kingdom.order} • {conf.titleEn}
            </span>
          </div>
          <h3
            className="font-cinematic"
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              marginTop: '2px',
            }}
          >
            {conf.titleVi}
          </h3>
        </div>

        <button
          onClick={onClose}
          style={{
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
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable Body Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Status & Completion Bar */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '14px',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Trạng thái vương quốc:</span>
            {isRescued ? (
              <Badge variant="emerald">
                <CheckCircle size={12} style={{ marginRight: '4px' }} /> ĐÃ GIẢI CỨU
              </Badge>
            ) : isUnlocked ? (
              <Badge variant="gold">
                <Sparkles size={12} style={{ marginRight: '4px' }} /> ĐÃ MỞ KHÓA
              </Badge>
            ) : (
              <Badge variant="locked">
                <Lock size={12} style={{ marginRight: '4px' }} /> BỊ PHONG ẤN
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>
            <span>Tiến độ hoàn thành:</span>
            <span style={{ fontWeight: 700, color: theme.accent }}>{completionPercent}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: 'rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${completionPercent}%`,
                height: '100%',
                borderRadius: '4px',
                background: `linear-gradient(90deg, ${theme.secondary}, ${theme.accent})`,
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
            <span>Nhiệm vụ: {completedQuestsCount}/5 hoàn thành</span>
            <span>Cấp yêu cầu: Cấp {kingdom.requiredHeroLevel}</span>
          </div>
        </div>

        {/* Math Challenge Topic */}
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.primary}18 0%, rgba(15, 23, 42, 0.6) 100%)`,
            border: `1px solid ${theme.primary}44`,
            borderRadius: '14px',
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.accent, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
            <Award size={14} /> Thử Thách Toán Học Cốt Lõi
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: '4px 0 6px 0' }}>
            {kingdom.mathTopicShort}
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.45' }}>
            {kingdom.mathTopic}
          </p>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic' }}>
            {kingdom.conceptSummary}
          </p>
        </div>

        {/* Lore / Tagline */}
        <div>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
            Truyền Thuyết Vương Quốc
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5', fontStyle: 'italic' }}>
            "{conf.lore}"
          </p>
        </div>

        {/* Guardian Boss Preview */}
        {monster && (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.4)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
                border: '1px solid #ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0,
              }}
            >
              👹
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '10px', color: '#f87171', fontWeight: 700, textTransform: 'uppercase' }}>
                TRÙM THỦ HỘ: {monster.title}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {monster.name}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                HP: {monster.maxHp} • Công: {monster.attackPower} • Thủ: {monster.defense}
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Gem Reward */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: `1px solid ${kingdom.gem.color}55`,
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: `radial-gradient(circle, ${kingdom.gem.color}44 0%, rgba(15, 23, 42, 0.8) 100%)`,
              border: `1px solid ${kingdom.gem.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: kingdom.gem.color,
              flexShrink: 0,
            }}
          >
            <Gem size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', color: kingdom.gem.color, fontWeight: 700, textTransform: 'uppercase' }}>
              PHẦN THƯỞNG GIẢI CỨU
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
              {kingdom.gem.name}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              {kingdom.gem.powerGranted}
            </div>
          </div>
        </div>

        {/* If Locked: Explanation */}
        {!isUnlocked && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '0.85rem',
              color: '#fca5a5',
              lineHeight: '1.4',
            }}
          >
            🔒 <strong>Vương quốc bị phong ấn:</strong> Cần giải cứu Vương quốc 0{kingdom.order - 1} để phá vỡ kết giới ma thuật!
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {isUnlocked ? (
          <>
            <SoundButton
              variant="gold"
              size="lg"
              style={{ width: '100%' }}
              onClick={() => onEnter(kingdom)}
              icon={<Swords size={18} />}
            >
              VÀO VƯƠNG QUỐC (EXPLORE)
            </SoundButton>

            {/* Boss Challenge Shortcut */}
            <SoundButton
              variant="secondary"
              size="md"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.35) 100%)',
                border: '1px solid #ef4444',
                color: '#fecaca',
              }}
              onClick={() => {
                const bossMap: Record<number, string> = {
                  1: 'boss-emerald-guardian',
                  2: 'boss-sand-titan',
                  3: 'boss-abyss-kraken',
                  4: 'boss-ice-dragon',
                  5: 'boss-mountain-golem',
                  6: 'boss-candy-witch',
                  7: 'boss-lord-zero',
                };
                const bossId = bossMap[kingdom.order] || 'boss-emerald-guardian';
                if (onChallengeBoss) {
                  onChallengeBoss(bossId);
                } else {
                  window.location.href = `/battle?monster=${bossId}`;
                }
              }}
              icon={<Flame size={16} color="#ef4444" />}
            >
              THÁCH ĐẤU ĐẠI BOSS (#{kingdom.order})
            </SoundButton>
          </>
        ) : (
          <SoundButton
            variant="secondary"
            size="lg"
            style={{ width: '100%' }}
            disabled
            icon={<Lock size={18} />}
          >
            CHƯA MỞ KHÓA
          </SoundButton>
        )}

        {/* Simulate Rescue Button for quick progress verification */}
        <SoundButton
          variant="secondary"
          size="sm"
          style={{ width: '100%' }}
          onClick={() => onSimulateRescue(kingdom)}
          icon={<Sparkles size={14} />}
        >
          {isRescued ? 'Mô Phỏng Lại Giải Cứu' : 'Mô Phỏng Giải Cứu (Test)'}
        </SoundButton>
      </div>
    </div>
  );
};
