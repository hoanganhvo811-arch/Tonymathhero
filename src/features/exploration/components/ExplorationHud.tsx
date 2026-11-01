import React from 'react';
import {
  Compass,
  BookOpen,
  ShoppingBag,
  Settings as SettingsIcon,
  Coins,
  Sparkles,
  Heart,
  Zap,
  MapPin,
  Shield,
  Swords,
  Package,
} from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { Badge } from '@/components/common/Badge';
import { HERO_IMAGES, HERO_AVATAR_FALLBACK_SVG } from '@/assets/images/heroImages';
import type { NpcData, InteractiveObjectData } from '@/types/exploration';

interface ExplorationHudProps {
  heroLevel: number;
  currentExp: number;
  nextLevelExp: number;
  goldCoins: number;
  currentZoneName: string;
  nearbyInteractable: { type: 'npc' | 'object'; data: NpcData | InteractiveObjectData } | null;
  onOpenJournal: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  onReturnToMap: () => void;
  onOpenBattle?: () => void;
  onOpenInventory?: () => void;
  onOpenEquipment?: () => void;
  onOpenSkills?: () => void;
  onInteract: () => void;
}

export const ExplorationHud: React.FC<ExplorationHudProps> = ({
  heroLevel,
  currentExp,
  nextLevelExp,
  goldCoins,
  currentZoneName,
  nearbyInteractable,
  onOpenJournal,
  onOpenShop,
  onOpenSettings,
  onReturnToMap,
  onOpenBattle,
  onOpenInventory,
  onOpenEquipment,
  onOpenSkills,
  onInteract,
}) => {
  const hp = 325;
  const maxHp = 325;
  const mp = 160;
  const maxMp = 160;

  return (
    <>
      {/* TOP-LEFT: Tony Hero Stats Status Card */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 20,
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(251, 191, 36, 0.35)',
          borderRadius: '20px',
          padding: '10px 16px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        {/* Tony Round Avatar */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #fbbf24',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.6)',
            background: '#0f172a',
            flexShrink: 0,
          }}
        >
          <img
            src={HERO_IMAGES.default}
            alt="Tony"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = HERO_AVATAR_FALLBACK_SVG;
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Stats Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
              HIỆP SĨ TONY
            </span>
            <Badge variant="gold" size="sm">CẤP {heroLevel}</Badge>
          </div>

          {/* HP Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Heart size={12} color="#ef4444" />
            <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${(hp / maxHp) * 100}%`, height: '100%', background: '#22c55e' }} />
            </div>
            <span style={{ fontSize: '9px', color: '#86efac', fontWeight: 700 }}>{hp}/{maxHp}</span>
          </div>

          {/* MP Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={12} color="#38bdf8" />
            <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${(mp / maxMp) * 100}%`, height: '100%', background: '#38bdf8' }} />
            </div>
            <span style={{ fontSize: '9px', color: '#7dd3fc', fontWeight: 700 }}>{mp}/{maxMp}</span>
          </div>

          {/* Gold & EXP */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '2px' }}>
            <span style={{ color: '#facc15', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Coins size={11} /> {goldCoins.toLocaleString()} Vàng
            </span>
            <span style={{ color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Sparkles size={11} /> {currentExp}/{nextLevelExp} EXP
            </span>
          </div>
        </div>
      </div>

      {/* TOP-CENTER: Kingdom Title & Current Sub-Zone Banner */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          background: 'rgba(15, 23, 42, 0.88)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          borderRadius: '24px',
          padding: '8px 20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            color: '#34d399',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          VƯƠNG QUỐC 01 • RỪNG XANH CỔ ĐẠI
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#ffffff',
          }}
        >
          <MapPin size={16} color="#fbbf24" />
          <span>{currentZoneName}</span>
        </div>
      </div>

      {/* TOP-RIGHT NAVIGATION BUTTONS */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {onOpenInventory && (
          <SoundButton
            variant="secondary"
            size="sm"
            onClick={onOpenInventory}
            icon={<Package size={15} />}
          >
            Túi Đồ (I)
          </SoundButton>
        )}

        {onOpenEquipment && (
          <SoundButton
            variant="secondary"
            size="sm"
            onClick={onOpenEquipment}
            icon={<Shield size={15} />}
          >
            Trang Bị (E)
          </SoundButton>
        )}

        {onOpenBattle && (
          <SoundButton
            variant="primary"
            size="sm"
            onClick={onOpenBattle}
            icon={<Swords size={15} />}
          >
            Đấu Trường (B)
          </SoundButton>
        )}

        <SoundButton
          variant="secondary"
          size="sm"
          onClick={onOpenShop}
          icon={<ShoppingBag size={15} />}
        >
          Cửa Hàng
        </SoundButton>

        <SoundButton
          variant="secondary"
          size="sm"
          onClick={onReturnToMap}
          icon={<Compass size={15} />}
        >
          Bản Đồ Thế Giới (M)
        </SoundButton>

        <button
          onClick={onOpenSettings}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1',
            cursor: 'pointer',
          }}
        >
          <SettingsIcon size={16} />
        </button>
      </div>

      {/* BOTTOM-CENTER: Desktop Controls Guide Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '11px',
          color: '#cbd5e1',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          gap: '12px',
        }}
      >
        <span>⌨️ <strong>WASD / Mũi tên:</strong> Di chuyển</span>
        <span>•</span>
        <span>🏃 <strong>Shift:</strong> Chạy nhanh</span>
        <span>•</span>
        <span>✨ <strong>E / Space:</strong> Tương tác</span>
        <span>•</span>
        <span>📜 <strong>J:</strong> Sổ nhiệm vụ</span>
      </div>

      {/* BOTTOM-RIGHT: Action Interact Button (Prominent when near interactable) */}
      {nearbyInteractable && (
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            zIndex: 30,
            animation: 'pulse 1.5s infinite',
          }}
        >
          <button
            onClick={onInteract}
            style={{
              padding: '14px 28px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
              border: '2px solid #ffffff',
              boxShadow: '0 10px 30px rgba(251, 191, 36, 0.6), 0 0 20px rgba(251, 191, 36, 0.4)',
              color: '#0f172a',
              fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span>✨</span>
            <span>
              {nearbyInteractable.type === 'npc'
                ? `NÓI CHUYỆN (${(nearbyInteractable.data as NpcData).name})`
                : (nearbyInteractable.data as InteractiveObjectData).promptText}
            </span>
          </button>
        </div>
      )}
    </>
  );
};
