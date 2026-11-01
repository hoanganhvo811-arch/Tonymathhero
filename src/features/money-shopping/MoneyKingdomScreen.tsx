import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoneyShoppingStore } from './useMoneyShoppingStore';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { MoneyRecognitionView } from './components/MoneyRecognitionView';
import { MoneyCountingView } from './components/MoneyCountingView';
import { InteractiveShopView } from './components/InteractiveShopView';
import { BudgetChallengeView } from './components/BudgetChallengeView';
import { MoneyBossArenaView } from './components/MoneyBossArenaView';
import { MoneyAnalyticsView } from './components/MoneyAnalyticsView';
import type { MoneyZone } from '@/types/moneyShopping';

export const MoneyKingdomScreen: React.FC = () => {
  const navigate = useNavigate();
  const { activeZone, setActiveZone, campaignId, setCampaignId, loadInitialState } = useMoneyShoppingStore();
  const activeCampaignId = useCampaignStore((s) => s.activeCampaignId);

  useEffect(() => {
    if (activeCampaignId) {
      setCampaignId(activeCampaignId as 'grade-2' | 'grade-3');
    }
    loadInitialState();
  }, [activeCampaignId, setCampaignId, loadInitialState]);

  const zoneNavItems: { id: MoneyZone | 'hub'; label: string; icon: string }[] = [
    { id: 'hub', label: 'Vương Quốc Thương Mại', icon: '🏰' },
    { id: 'recognition', label: 'Nhận Biết Tiền', icon: '💵' },
    { id: 'counting', label: 'Bàn Đếm & Đổi Tiền', icon: '🧮' },
    { id: 'interactive_shop', label: 'Tiệm Tạp Hóa Ma Thuật', icon: '🛒' },
    { id: 'budget_challenge', label: 'Thử Thách Ngân Sách', icon: '⚖️' },
    { id: 'boss_arena', label: 'Quyết Đấu Gian Thương', icon: '⚔️' },
    { id: 'analytics', label: 'Năng Lực Của Tony', icon: '📊' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 10%, #1e1b18 0%, #120f0c 60%, #080604 100%)',
        color: '#f8fafc',
        padding: '24px 20px',
        fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Segoe UI', sans-serif)",
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigate('/world-map')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                padding: '8px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              🗺️ Bản Đồ Thế Giới
            </button>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                💰 VƯƠNG QUỐC TIỀN TỆ VÀ MUA SẮM
              </h1>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                Khám phá giá trị đồng tiền Việt Nam, rèn luyện đếm tiền và mua sắm thông thái
              </p>
            </div>
          </div>

          {/* Grade Level Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Cấp độ:</span>
            <button
              onClick={() => setCampaignId('grade-2')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: campaignId === 'grade-2' ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                background: campaignId === 'grade-2' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.05)',
                color: campaignId === 'grade-2' ? '#fbbf24' : '#94a3b8',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Lớp 2 (≤ 10.000đ)
            </button>
            <button
              onClick={() => setCampaignId('grade-3')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: campaignId === 'grade-3' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                background: campaignId === 'grade-3' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                color: campaignId === 'grade-3' ? '#34d399' : '#94a3b8',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Lớp 3 (≤ 100.000đ)
            </button>
          </div>
        </div>

        {/* Zone Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '20px',
          }}
        >
          {zoneNavItems.map((item) => {
            const isActive = activeZone === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveZone(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: isActive ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.35))' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#fef3c7' : '#94a3b8',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(245, 158, 11, 0.2)' : 'none',
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Zone Content */}
        {activeZone === 'hub' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Hub Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.25) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ maxWidth: '650px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#fbbf24',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}
                >
                  Giai đoạn 18 • Money & Shopping Adventure
                </span>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 900, color: '#fef3c7' }}>
                  Chào mừng Tony đến với Vương Quốc Tiền Tệ!
                </h2>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#cbd5e1' }}>
                  Vương quốc thương mại đang rơi vào hỗn loạn vì phép thuật gian lận giá cả của Dark Merchant Lord Malakor. Tony hãy dùng khả năng tính nhẩm tiền tệ, kiểm tra hóa đơn và quản lý ngân sách để giải cứu các cửa hàng và đem lại sự bình yên!
                </p>
              </div>
              <button
                onClick={() => setActiveZone('interactive_shop')}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#1a1306',
                  border: 'none',
                  padding: '14px 26px',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.35)',
                  transition: 'transform 0.15s ease',
                }}
              >
                🛒 Mua Sắm Ngay ➜
              </button>
            </div>

            {/* Kingdom Zones Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                onClick={() => setActiveZone('recognition')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>💵</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#fef3c7' }}>
                  Nhận Biết Tiền Việt Nam
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Khám phá các mệnh giá từ 100đ đến 100.000đ, quan sát màu sắc, hình ảnh di tích và chất liệu polymer/cotton.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('counting')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🧮</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#fef3c7' }}>
                  Bàn Đếm & Đổi Mệnh Giá
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Đếm tổng các xấp tiền, tạo số tiền mục tiêu từ nhiều cách kết hợp khác nhau và so sánh các xấp tiền.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('interactive_shop')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🛒</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#fef3c7' }}>
                  Tiệm Tạp Hóa Ma Thuật
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Chọn hàng trên kệ, tính tổng hóa đơn, trả tiền mặt và tính tiền thừa chính xác để nhận hóa đơn thật.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('budget_challenge')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚖️</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#fef3c7' }}>
                  Thử Thách Ngân Sách
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Học cách quản lý ngân sách chi tiêu, kiểm tra vượt trần và rèn luyện tư duy người tiêu dùng thông thái.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('boss_arena')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚔️</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#fef3c7' }}>
                  Quyết Đấu Gian Thương
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Vượt qua 3 giai đoạn ma thuật giá cả của Dark Merchant Lord Malakor bằng tốc độ tính nhẩm thần sầu!
                </p>
              </div>

              <div
                onClick={() => setActiveZone('analytics')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#fef3c7' }}>
                  Năng Lực Của Tony
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Xem biểu đồ radar và phân tích 9 kỹ năng toán mua sắm cùng gợi ý học tập từ Adaptive Learning Engine.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeZone === 'recognition' && <MoneyRecognitionView />}
        {activeZone === 'counting' && <MoneyCountingView />}
        {activeZone === 'interactive_shop' && <InteractiveShopView />}
        {activeZone === 'budget_challenge' && <BudgetChallengeView />}
        {activeZone === 'boss_arena' && <MoneyBossArenaView />}
        {activeZone === 'analytics' && <MoneyAnalyticsView />}
      </div>
    </div>
  );
};
