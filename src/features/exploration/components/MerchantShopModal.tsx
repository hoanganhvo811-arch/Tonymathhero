import React, { useState } from 'react';
import { X, ShoppingBag, Coins, Shield, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import { useHeroInventoryStore } from '../../inventory/useInventoryStore';
import { MASTER_ITEMS_CATALOG, RARITY_CONFIG } from '../../inventory/data/itemsCatalog';
import type { InventoryItem } from '@/types/inventory';
import { useProgressStore } from '../../../game/state/useProgressStore';
import { useAudio } from '../../../hooks/useAudio';

interface MerchantShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantShopModal: React.FC<MerchantShopModalProps> = ({ isOpen, onClose }) => {
  const { activeCampaignId, getItems, buyItem, sellItem } = useHeroInventoryStore();
  const currentProgress = useProgressStore((state) => state.currentProgress);
  const heroLevel = currentProgress?.heroLevel || 1;
  const goldCoins = currentProgress?.goldCoins || 0;
  const { playClick, playSelect } = useAudio();

  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter catalog items for shop: only purchasable non-quest items up to level 4
  const shopCatalog = MASTER_ITEMS_CATALOG.filter(
    (item) => item.category !== 'quest_items' && item.category !== 'special_items' && item.buyPrice > 0
  );

  const inventoryItems = getItems(activeCampaignId);

  const handleBuy = (item: InventoryItem) => {
    playSelect();
    const res = buyItem(item, 1, activeCampaignId);
    setPurchaseNotice(res.message);
  };

  const handleSell = (item: InventoryItem) => {
    playClick();
    const res = sellItem(item.id, 1, activeCampaignId);
    setPurchaseNotice(res.message);
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
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(8px)',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '880px',
          height: '84vh',
          maxHeight: '660px',
          background: 'linear-gradient(135deg, #09131f 0%, #0f1d30 100%)',
          border: '2px solid rgba(245, 158, 11, 0.5)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.25)',
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
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
              }}
            >
              <ShoppingBag size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', fontWeight: 800 }}>
                TIỆM TẠP HÓA THƯƠNG NHÂN ODO
              </h2>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                Cung cấp trang bị, vũ khí và dược thảo thám hiểm chất lượng cao
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

        {/* Tab Buttons (Buy vs Sell) */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.4)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            onClick={() => {
              playClick();
              setActiveTab('buy');
              setPurchaseNotice(null);
            }}
            style={{
              background: activeTab === 'buy' ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : 'rgba(30, 41, 59, 0.6)',
              border: activeTab === 'buy' ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
              color: activeTab === 'buy' ? '#fff' : '#cbd5e1',
              borderRadius: '10px',
              padding: '6px 18px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            🛒 Mua Hàng ({shopCatalog.length})
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveTab('sell');
              setPurchaseNotice(null);
            }}
            style={{
              background: activeTab === 'sell' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(30, 41, 59, 0.6)',
              border: activeTab === 'sell' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
              color: activeTab === 'sell' ? '#fff' : '#cbd5e1',
              borderRadius: '10px',
              padding: '6px 18px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            📦 Bán Vật Phẩm ({inventoryItems.length})
          </button>
        </div>

        {/* Notice alert */}
        {purchaseNotice && (
          <div
            style={{
              margin: '12px 24px 0 24px',
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38bdf8',
              color: '#bae6fd',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle size={15} />
            <span>{purchaseNotice}</span>
          </div>
        )}

        {/* Items List View */}
        <div
          style={{
            flex: 1,
            padding: '16px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {activeTab === 'buy' ? (
            shopCatalog.map((item) => {
              const rarityStyle = RARITY_CONFIG[item.rarity];
              const canAfford = goldCoins >= item.buyPrice;
              const meetsLevel = heroLevel >= item.levelRequirement;

              return (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.55)',
                    border: `1px solid ${rarityStyle?.borderColor || 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '14px',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: rarityStyle?.bgColor || 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${rarityStyle?.borderColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        flexShrink: 0,
                      }}
                    >
                      {item.category === 'weapons' ? '⚔️' : item.category === 'armor' ? '🛡️' : item.category === 'consumables' ? '🧪' : '💍'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.92rem' }}>
                          {item.name}
                        </span>
                        <span style={{ color: rarityStyle?.color, fontSize: '0.7rem', fontWeight: 700 }}>
                          [{rarityStyle?.labelVi}]
                        </span>
                        {item.levelRequirement > 1 && (
                          <span style={{ color: meetsLevel ? '#4ade80' : '#f87171', fontSize: '0.72rem' }}>
                            (Cần Cấp {item.levelRequirement})
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '2px' }}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.95rem' }}>
                      {item.buyPrice} V
                    </div>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      style={{
                        background: canAfford ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : '#334155',
                        border: canAfford ? '1px solid #fbbf24' : '1px solid #475569',
                        color: canAfford ? '#fff' : '#64748b',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {canAfford ? 'Mua' : 'Thiếu Vàng'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            inventoryItems.map((item) => {
              const rarityStyle = RARITY_CONFIG[item.rarity];
              const isQuestItem = item.category === 'quest_items' || item.category === 'special_items' || item.sellPrice <= 0;

              return (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.55)',
                    border: `1px solid ${rarityStyle?.borderColor || 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '14px',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: rarityStyle?.bgColor || 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${rarityStyle?.borderColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        flexShrink: 0,
                      }}
                    >
                      {item.category === 'weapons' ? '⚔️' : item.category === 'armor' ? '🛡️' : item.category === 'consumables' ? '🧪' : '💍'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.92rem' }}>
                          {item.name}
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          (x{item.quantity})
                        </span>
                        {item.isEquipped && (
                          <span style={{ background: '#10b981', color: '#fff', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                            ĐANG TRANG BỊ
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '2px' }}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {isQuestItem ? (
                      <span
                        style={{
                          color: '#f87171',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <AlertTriangle size={14} /> Không thể bán
                      </span>
                    ) : (
                      <>
                        <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.95rem' }}>
                          +{item.sellPrice} V
                        </div>
                        <button
                          onClick={() => handleSell(item)}
                          style={{
                            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                            border: '1px solid #38bdf8',
                            color: '#fff',
                            borderRadius: '10px',
                            padding: '8px 16px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Bán
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {activeTab === 'sell' && inventoryItems.length === 0 && (
            <div style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '40px' }}>
              Túi đồ hiện đang trống rỗng.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
