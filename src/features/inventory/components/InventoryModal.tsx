import React, { useState } from 'react';
import {
  X,
  Package,
  Shield,
  Sword,
  Sparkles,
  Heart,
  Gem,
  Award,
  Coins,
  Check,
  AlertCircle,
} from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { useHeroInventoryStore } from '../useInventoryStore';
import { RARITY_CONFIG } from '../data/itemsCatalog';
import type { InventoryItem, ItemCategory } from '@/types/inventory';
import { useProgressStore } from '../../../game/state/useProgressStore';
import { useAudio } from '../../../hooks/useAudio';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEquipSuccess?: (msg: string) => void;
}

type FilterTab = 'all' | ItemCategory;

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  onEquipSuccess,
}) => {
  const {
    activeCampaignId,
    getItems,
    equipItem,
    useConsumable,
    sellItem,
    inventoryCapacity,
  } = useHeroInventoryStore();

  const currentProgress = useProgressStore((state) => state.currentProgress);
  const heroLevel = currentProgress?.heroLevel || 1;
  const goldCoins = currentProgress?.goldCoins || 0;
  const { playClick, playSelect } = useAudio();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const items = getItems(activeCampaignId);

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const handleSelectItem = (item: InventoryItem) => {
    playClick();
    setSelectedItem(item);
    setActionFeedback(null);
  };

  const handleEquip = () => {
    if (!selectedItem) return;
    playSelect();
    const res = equipItem(selectedItem.id, selectedItem.slot, activeCampaignId);
    setActionFeedback(res.message);
    if (res.success) {
      if (onEquipSuccess) onEquipSuccess(res.message);
      // Refresh selectedItem from updated list
      const updated = getItems(activeCampaignId).find((i) => i.id === selectedItem.id);
      setSelectedItem(updated || null);
    }
  };

  const handleUse = () => {
    if (!selectedItem) return;
    playSelect();
    const stats = useHeroInventoryStore.getState().getCalculatedStats(activeCampaignId);
    const res = useConsumable(selectedItem.id, stats.finalStats.maxHp - 10, stats.finalStats.maxMp - 10, activeCampaignId);
    setActionFeedback(res.message);
    if (res.success) {
      const updated = getItems(activeCampaignId).find((i) => i.id === selectedItem.id);
      setSelectedItem(updated || null);
    }
  };

  const handleSell = () => {
    if (!selectedItem) return;
    playClick();
    const res = sellItem(selectedItem.id, 1, activeCampaignId);
    setActionFeedback(res.message);
    if (res.success) {
      const updated = getItems(activeCampaignId).find((i) => i.id === selectedItem.id);
      setSelectedItem(updated || null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
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
          maxWidth: '980px',
          height: '85vh',
          maxHeight: '680px',
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
              <Package size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', fontWeight: 800 }}>
                TÚI ĐỒ HIỆP SĨ (INVENTORY)
              </h2>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                Chiến dịch:{' '}
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                  {activeCampaignId === 'grade-3' ? 'Lớp 3 - Đại Hiệp Sĩ' : 'Lớp 2 - Hiệp Sĩ Nhí'}
                </span>{' '}
                • Sức chứa: <strong style={{ color: '#f8fafc' }}>{items.length}/{inventoryCapacity}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                borderRadius: '20px',
                padding: '4px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#fbbf24',
                fontWeight: 800,
                fontSize: '0.9rem',
              }}
            >
              <Coins size={16} />
              <span>{goldCoins} Vàng</span>
            </div>

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

        {/* Filter Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.4)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'all', label: 'Tất Cả' },
            { id: 'weapons', label: 'Vũ Khí' },
            { id: 'armor', label: 'Áo Giáp' },
            { id: 'accessories', label: 'Phụ Kiện' },
            { id: 'consumables', label: 'Tiêu Hao' },
            { id: 'quest_items', label: 'Nhiệm Vụ' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClick();
                  setActiveFilter(tab.id as FilterTab);
                }}
                style={{
                  background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(30, 41, 59, 0.6)',
                  border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#fff' : '#cbd5e1',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Body (Grid + Inspection Panel) */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Item Grid View */}
          <div
            style={{
              flex: 1.5,
              padding: '20px',
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))',
              gridAutoRows: '76px',
              gap: '12px',
              alignContent: 'start',
            }}
          >
            {filteredItems.map((item) => {
              const rarityStyle = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common;
              const isSelected = selectedItem?.id === item.id;
              const canEquipLevel = heroLevel >= item.levelRequirement;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  style={{
                    position: 'relative',
                    background: isSelected ? 'rgba(56, 189, 248, 0.25)' : rarityStyle.bgColor,
                    border: `2px solid ${isSelected ? '#38bdf8' : rarityStyle.borderColor}`,
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 14px rgba(56, 189, 248, 0.6)' : '0 2px 8px rgba(0,0,0,0.4)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Icon representation */}
                  <span style={{ fontSize: '1.7rem' }}>
                    {item.category === 'weapons'
                      ? '⚔️'
                      : item.category === 'armor'
                      ? '🛡️'
                      : item.category === 'accessories'
                      ? '💍'
                      : item.category === 'consumables'
                      ? '🧪'
                      : '💎'}
                  </span>

                  {/* Quantity badge */}
                  {item.quantity > 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        background: 'rgba(0, 0, 0, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '1px 5px',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        color: '#f8fafc',
                      }}
                    >
                      {item.quantity}
                    </div>
                  )}

                  {/* Equipped status pin */}
                  {item.isEquipped && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '4px',
                        left: '4px',
                        background: '#10b981',
                        borderRadius: '4px',
                        padding: '1px 3px',
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        color: '#fff',
                      }}
                    >
                      E
                    </div>
                  )}
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '40px',
                  color: '#64748b',
                  fontSize: '0.9rem',
                }}
              >
                Không có vật phẩm nào trong mục này.
              </div>
            )}
          </div>

          {/* Item Details Inspection Drawer (Right) */}
          <div
            style={{
              flex: 1,
              background: 'rgba(15, 23, 42, 0.75)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto',
            }}
          >
            {selectedItem ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Item Name & Rarity Header */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem', fontWeight: 800 }}>
                      {selectedItem.name}
                    </h3>
                    <div
                      style={{
                        background: RARITY_CONFIG[selectedItem.rarity]?.bgColor,
                        border: `1px solid ${RARITY_CONFIG[selectedItem.rarity]?.borderColor}`,
                        color: RARITY_CONFIG[selectedItem.rarity]?.color,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      {RARITY_CONFIG[selectedItem.rarity]?.labelVi}
                    </div>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '4px' }}>
                    Yêu cầu cấp độ:{' '}
                    <strong style={{ color: heroLevel >= selectedItem.levelRequirement ? '#4ade80' : '#f87171' }}>
                      Cấp {selectedItem.levelRequirement}
                    </strong>
                    {selectedItem.slot && ` • Vị trí: ${selectedItem.slot}`}
                  </div>
                </div>

                {/* Description */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#cbd5e1',
                    fontSize: '0.82rem',
                    lineHeight: 1.45,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {selectedItem.description}
                </div>

                {/* Stat Modifiers */}
                {selectedItem.stats && Object.keys(selectedItem.stats).length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      background: 'rgba(30, 41, 59, 0.4)',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                      CHỈ SỐ CỘNG THÊM:
                    </span>
                    {selectedItem.stats.attackBonus && (
                      <div style={{ color: '#f87171', fontSize: '0.82rem', fontWeight: 700 }}>
                        + {selectedItem.stats.attackBonus} Sức Tấn Công (ATK)
                      </div>
                    )}
                    {selectedItem.stats.defenseBonus && (
                      <div style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700 }}>
                        + {selectedItem.stats.defenseBonus} Phòng Thủ (DEF)
                      </div>
                    )}
                    {selectedItem.stats.hpBonus && (
                      <div style={{ color: '#4ade80', fontSize: '0.82rem', fontWeight: 700 }}>
                        + {selectedItem.stats.hpBonus} Sinh Lực (HP)
                      </div>
                    )}
                    {selectedItem.stats.mpBonus && (
                      <div style={{ color: '#60a5fa', fontSize: '0.82rem', fontWeight: 700 }}>
                        + {selectedItem.stats.mpBonus} Năng Lượng (MP)
                      </div>
                    )}
                    {selectedItem.stats.magicBonus && (
                      <div style={{ color: '#c084fc', fontSize: '0.82rem', fontWeight: 700 }}>
                        + {selectedItem.stats.magicBonus} Ma Lực Tri Thức (MAG)
                      </div>
                    )}
                    {selectedItem.stats.critChancePercent && (
                      <div style={{ color: '#f59e0b', fontSize: '0.82rem', fontWeight: 700 }}>
                        + {selectedItem.stats.critChancePercent}% Tỉ Lệ Bạo Kích
                      </div>
                    )}
                    {selectedItem.stats.expBonusPercent && (
                      <div style={{ color: '#fcd34d', fontSize: '0.82rem', fontWeight: 700 }}>
                        + {selectedItem.stats.expBonusPercent}% EXP Nhận Được
                      </div>
                    )}
                  </div>
                )}

                {/* Effects (for consumables) */}
                {selectedItem.effects && (
                  <div
                    style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#86efac',
                      fontSize: '0.8rem',
                    }}
                  >
                    {selectedItem.effects.healHp && <div>💚 Hồi phục +{selectedItem.effects.healHp} HP</div>}
                    {selectedItem.effects.healMp && <div>💙 Hồi phục +{selectedItem.effects.healMp} MP</div>}
                    {selectedItem.effects.buffAttackPercent && (
                      <div>⚔️ Tăng +{selectedItem.effects.buffAttackPercent}% ATK trong {selectedItem.effects.buffDurationTurns} lượt</div>
                    )}
                  </div>
                )}

                {/* Price info */}
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>Giá bán: <strong style={{ color: '#fbbf24' }}>{selectedItem.sellPrice} Vàng</strong></span>
                  <span>Số lượng: <strong style={{ color: '#fff' }}>{selectedItem.quantity}</strong></span>
                </div>

                {/* Action Feedback message */}
                {actionFeedback && (
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
                    <span>{actionFeedback}</span>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#64748b',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                }}
              >
                Nhấp vào một vật phẩm bất kỳ trong túi đồ để xem chi tiết và sử dụng.
              </div>
            )}

            {/* Bottom Actions Bar */}
            {selectedItem && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                {/* Equip Button (if equippable) */}
                {selectedItem.slot && (
                  <button
                    onClick={handleEquip}
                    disabled={heroLevel < selectedItem.levelRequirement}
                    style={{
                      flex: 1.2,
                      background:
                        heroLevel >= selectedItem.levelRequirement
                          ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                          : 'rgba(30, 41, 59, 0.5)',
                      border: heroLevel >= selectedItem.levelRequirement ? '1px solid #38bdf8' : '1px solid #475569',
                      color: heroLevel >= selectedItem.levelRequirement ? '#fff' : '#64748b',
                      borderRadius: '10px',
                      padding: '10px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: heroLevel >= selectedItem.levelRequirement ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s',
                    }}
                  >
                    🛡️ Trang Bị
                  </button>
                )}

                {/* Use Button (if consumable) */}
                {selectedItem.category === 'consumables' && (
                  <button
                    onClick={handleUse}
                    style={{
                      flex: 1.2,
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      border: '1px solid #34d399',
                      color: '#fff',
                      borderRadius: '10px',
                      padding: '10px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    🧪 Sử Dụng
                  </button>
                )}

                {/* Sell Button */}
                {selectedItem.category !== 'quest_items' && selectedItem.category !== 'special_items' && (
                  <button
                    onClick={handleSell}
                    style={{
                      flex: 1,
                      background: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#fef08a',
                      borderRadius: '10px',
                      padding: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    Bán (+{selectedItem.sellPrice} V)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
