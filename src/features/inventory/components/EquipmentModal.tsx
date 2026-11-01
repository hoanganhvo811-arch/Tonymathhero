import React, { useState } from 'react';
import {
  X,
  Shield,
  Sword,
  Sparkles,
  Heart,
  Zap,
  Crown,
  Award,
  Layers,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useHeroInventoryStore } from '../useInventoryStore';
import { RARITY_CONFIG } from '../data/itemsCatalog';
import type { EquipmentSlot, InventoryItem } from '@/types/inventory';
import { useProgressStore } from '../../../game/state/useProgressStore';
import { useAudio } from '../../../hooks/useAudio';
import { getHeroImage, HERO_AVATAR_FALLBACK_SVG } from '@/assets/images/heroImages';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInventory?: () => void;
}

const SLOT_DEFINITIONS: { slot: EquipmentSlot; nameVi: string; icon: string }[] = [
  { slot: 'weapon', nameVi: 'Vũ Khí', icon: '⚔️' },
  { slot: 'shield', nameVi: 'Khiên', icon: '🛡️' },
  { slot: 'helmet', nameVi: 'Mũ Giáp', icon: '🪖' },
  { slot: 'armor', nameVi: 'Chiến Giáp', icon: '🥋' },
  { slot: 'gloves', nameVi: 'Găng Tay', icon: '🧤' },
  { slot: 'boots', nameVi: 'Giày Hộ Thể', icon: '👢' },
  { slot: 'ring', nameVi: 'Nhẫn Ma Pháp', icon: '💍' },
  { slot: 'amulet', nameVi: 'Dây Chuyền', icon: '📿' },
];

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  isOpen,
  onClose,
  onOpenInventory,
}) => {
  const {
    activeCampaignId,
    getEquipment,
    getItems,
    getCalculatedStats,
    equipItem,
    unequipItem,
  } = useHeroInventoryStore();

  const currentProgress = useProgressStore((state) => state.currentProgress);
  const heroLevel = currentProgress?.heroLevel || 1;
  const { playClick, playSelect } = useAudio();

  const [activeSlot, setActiveSlot] = useState<EquipmentSlot | null>('weapon');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const equipment = getEquipment(activeCampaignId);
  const items = getItems(activeCampaignId);
  const stats = getCalculatedStats(activeCampaignId, heroLevel);

  const selectedEquippedItem = activeSlot ? equipment[activeSlot] : null;

  // Candidate items in inventory that fit the active slot
  const candidateItems = activeSlot
    ? items.filter((i) => i.slot === activeSlot)
    : [];

  const handleEquipCandidate = (item: InventoryItem) => {
    playSelect();
    const res = equipItem(item.id, item.slot, activeCampaignId);
    setFeedback(res.message);
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    playClick();
    const res = unequipItem(slot, activeCampaignId);
    setFeedback(res.message);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #09131f 0%, #0f1d30 100%)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '24px',
          width: '96%',
          maxWidth: '1040px',
          height: '86vh',
          maxHeight: '700px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.2)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', fontWeight: 800 }}>
                TRANG BỊ & CHỈ SỐ HIỆP SĨ (EQUIPMENT)
              </h2>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                Hiệp Sĩ Tony • Cấp {heroLevel} •{' '}
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                  {activeCampaignId === 'grade-3' ? 'Chiến Giáp Xanh Lam Hoàng Kim' : 'Chiến Giáp Bạc & Lục'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onOpenInventory && (
              <button
                onClick={onOpenInventory}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid #38bdf8',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  color: '#bae6fd',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Mở Túi Đồ
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#cbd5e1',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left: 8 Equipment Slots */}
          <div
            style={{
              flex: 1.2,
              padding: '20px',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
              8 VỊ TRÍ TRANG BỊ
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {SLOT_DEFINITIONS.map(({ slot, nameVi, icon }) => {
                const item = equipment[slot];
                const isSelected = activeSlot === slot;
                const rarityStyle = item ? RARITY_CONFIG[item.rarity] : null;

                return (
                  <div
                    key={slot}
                    onClick={() => {
                      playClick();
                      setActiveSlot(slot);
                      setFeedback(null);
                    }}
                    style={{
                      background: isSelected
                        ? 'rgba(56, 189, 248, 0.2)'
                        : item
                        ? rarityStyle?.bgColor || 'rgba(30, 41, 59, 0.6)'
                        : 'rgba(15, 23, 42, 0.5)',
                      border: `2px solid ${
                        isSelected ? '#38bdf8' : item ? rarityStyle?.borderColor : 'rgba(255, 255, 255, 0.1)'
                      }`,
                      borderRadius: '14px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.4)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>{icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                        {nameVi}
                      </div>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: item ? rarityStyle?.color || '#fff' : '#64748b',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item ? item.name : '(Trống)'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tony Visual Avatar Card */}
            <div
              style={{
                marginTop: 'auto',
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #fbbf24',
                  flexShrink: 0,
                }}
              >
                <img
                  src={getHeroImage(activeCampaignId)}
                  alt="Tony"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = HERO_AVATAR_FALLBACK_SVG;
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.95rem' }}>
                  HIỆP SĨ TONY
                </div>
                <div style={{ color: '#38bdf8', fontSize: '0.78rem' }}>
                  {activeCampaignId === 'grade-3' ? 'Đại Hiệp Sĩ Huyền Thoại' : 'Hiệp Sĩ Khám Phá Rừng Xanh'}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '2px' }}>
                  Trang phục tự động tương thích với bộ trang bị đang sử dụng.
                </div>
              </div>
            </div>
          </div>

          {/* Center: Selected Slot Details & Candidate Inventory Items */}
          <div
            style={{
              flex: 1.3,
              padding: '20px',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              overflowY: 'auto',
            }}
          >
            {activeSlot ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.05rem' }}>
                    VỊ TRÍ: {SLOT_DEFINITIONS.find((s) => s.slot === activeSlot)?.nameVi}
                  </div>
                  {selectedEquippedItem && (
                    <button
                      onClick={() => handleUnequip(activeSlot)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid #ef4444',
                        color: '#fca5a5',
                        borderRadius: '8px',
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Tháo Ra
                    </button>
                  )}
                </div>

                {/* Currently Equipped Summary */}
                {selectedEquippedItem ? (
                  <div
                    style={{
                      background: 'rgba(30, 41, 59, 0.7)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      border: `1px solid ${RARITY_CONFIG[selectedEquippedItem.rarity]?.borderColor}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                        {selectedEquippedItem.name}
                      </span>
                      <span
                        style={{
                          color: RARITY_CONFIG[selectedEquippedItem.rarity]?.color,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                        }}
                      >
                        {RARITY_CONFIG[selectedEquippedItem.rarity]?.labelVi}
                      </span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '4px' }}>
                      {selectedEquippedItem.description}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      borderRadius: '10px',
                      padding: '12px',
                      color: '#64748b',
                      fontSize: '0.82rem',
                      textAlign: 'center',
                    }}
                  >
                    Chưa có trang bị nào ở vị trí này. Hãy chọn một vật phẩm bên dưới để trang bị!
                  </div>
                )}

                {/* Feedback note */}
                {feedback && (
                  <div
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid #38bdf8',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#bae6fd',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Check size={14} />
                    <span>{feedback}</span>
                  </div>
                )}

                {/* Candidate Items in Inventory to Swap */}
                <div style={{ marginTop: '10px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
                    VẬT PHẨM TRONG TÚI CÓ THỂ TRANG BỊ ({candidateItems.length}):
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {candidateItems.map((candidate) => {
                      const canEquip = heroLevel >= candidate.levelRequirement;
                      return (
                        <div
                          key={candidate.id}
                          style={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            padding: '10px 14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>
                              {candidate.name}
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                              Yêu cầu: Cấp {candidate.levelRequirement}{' '}
                              {candidate.stats.attackBonus && `• +${candidate.stats.attackBonus} ATK `}
                              {candidate.stats.defenseBonus && `• +${candidate.stats.defenseBonus} DEF `}
                              {candidate.stats.hpBonus && `• +${candidate.stats.hpBonus} HP `}
                            </div>
                          </div>

                          <button
                            onClick={() => handleEquipCandidate(candidate)}
                            disabled={!canEquip}
                            style={{
                              background: canEquip ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : '#334155',
                              border: canEquip ? '1px solid #38bdf8' : '1px solid #475569',
                              color: canEquip ? '#fff' : '#64748b',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: canEquip ? 'pointer' : 'not-allowed',
                            }}
                          >
                            {canEquip ? 'Trang Bị' : `Cần Cấp ${candidate.levelRequirement}`}
                          </button>
                        </div>
                      );
                    })}

                    {candidateItems.length === 0 && (
                      <div style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        Không có vật phẩm tương thích vị trí này trong túi đồ. Bạn có thể ghé Cửa Hàng để mua thêm!
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', marginTop: '40px' }}>
                Chọn một vị trí trang bị bên trái để xem chi tiết.
              </div>
            )}
          </div>

          {/* Right: Realtime Calculated Hero Stats */}
          <div
            style={{
              flex: 1,
              padding: '20px',
              background: 'rgba(15, 23, 42, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
              BẢNG CHỈ SỐ TỔNG HỢP (STATS)
            </div>

            {/* Stat Row 1: HP */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '10px',
                padding: '10px 14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={14} color="#4ade80" /> Sinh Lực (Max HP)
                </span>
                <span style={{ color: '#4ade80', fontSize: '1rem', fontWeight: 800 }}>
                  {stats.finalStats.maxHp}
                </span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '2px' }}>
                Cơ bản: {stats.base.maxHp} • Trang bị: +{stats.equipmentBonuses.hpBonus}
              </div>
            </div>

            {/* Stat Row 2: MP */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '10px',
                padding: '10px 14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} color="#38bdf8" /> Năng Lượng (Max MP)
                </span>
                <span style={{ color: '#38bdf8', fontSize: '1rem', fontWeight: 800 }}>
                  {stats.finalStats.maxMp}
                </span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '2px' }}>
                Cơ bản: {stats.base.maxMp} • Trang bị: +{stats.equipmentBonuses.mpBonus}
              </div>
            </div>

            {/* Stat Row 3: Attack */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '10px',
                padding: '10px 14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sword size={14} color="#f87171" /> Tấn Công (ATK)
                </span>
                <span style={{ color: '#f87171', fontSize: '1rem', fontWeight: 800 }}>
                  {stats.finalStats.attack}
                </span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '2px' }}>
                Cơ bản: {stats.base.attack} • Trang bị: +{stats.equipmentBonuses.attackBonus}
              </div>
            </div>

            {/* Stat Row 4: Defense */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '10px',
                padding: '10px 14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={14} color="#60a5fa" /> Phòng Thủ (DEF)
                </span>
                <span style={{ color: '#60a5fa', fontSize: '1rem', fontWeight: 800 }}>
                  {stats.finalStats.defense}
                </span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '2px' }}>
                Cơ bản: {stats.base.defense} • Trang bị: +{stats.equipmentBonuses.defenseBonus}
              </div>
            </div>

            {/* Stat Row 5: Magic Power */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '10px',
                padding: '10px 14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#c084fc" /> Ma Lực Tri Thức (MAG)
                </span>
                <span style={{ color: '#c084fc', fontSize: '1rem', fontWeight: 800 }}>
                  {stats.finalStats.magicPower}
                </span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '2px' }}>
                Cơ bản: {stats.base.magicPower} • Trang bị: +{stats.equipmentBonuses.magicBonus}
              </div>
            </div>

            {/* Secondary stats */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.78rem',
                color: '#cbd5e1',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div>
                Tỉ lệ Bạo Kích: <strong style={{ color: '#fbbf24' }}>{stats.finalStats.critChancePercent}%</strong>
              </div>
              <div>
                Thưởng EXP Chiến Đấu: <strong style={{ color: '#fcd34d' }}>+{stats.finalStats.expBonusPercent}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
