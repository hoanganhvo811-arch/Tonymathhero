import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFractionStore } from './useFractionStore';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { InteractiveFractionBuilderView } from './components/InteractiveFractionBuilderView';
import { FractionRecognitionView } from './components/FractionRecognitionView';
import { FractionComparisonView } from './components/FractionComparisonView';
import { FairSharingView } from './components/FairSharingView';
import { FractionBossArenaView } from './components/FractionBossArenaView';
import { FractionAnalyticsView } from './components/FractionAnalyticsView';
import type { FractionZone } from '@/types/fractions';

export const FractionKingdomScreen: React.FC = () => {
  const navigate = useNavigate();
  const { activeZone, setActiveZone, campaignId, setCampaignId, loadProgress } = useFractionStore();
  const activeCampaignId = useCampaignStore((s) => s.activeCampaignId);

  useEffect(() => {
    if (activeCampaignId) {
      setCampaignId(activeCampaignId as 'grade-2' | 'grade-3');
    }
    loadProgress();
  }, [activeCampaignId, setCampaignId, loadProgress]);

  const zoneNavItems: { id: FractionZone | 'hub'; label: string; icon: string }[] = [
    { id: 'hub', label: 'Tổng Quan Vương Quốc', icon: '🏰' },
    { id: 'builder', label: 'Tự Chia Phân Số', icon: '🛠️' },
    { id: 'recognition', label: 'Nhận Diện Phân Số', icon: '🔍' },
    { id: 'comparison', label: 'So Sánh Trực Quan', icon: '⚖️' },
    { id: 'fair_sharing', label: 'Chia Phần Công Bằng', icon: '🎁' },
    { id: 'boss_arena', label: 'Quyết Đấu Ma Vương', icon: '⚔️' },
    { id: 'analytics', label: 'Năng Lực Của Tony', icon: '📊' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 10%, #0a1f18 0%, #050e14 70%, #02070a 100%)',
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
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid #475569',
                color: '#cbd5e1',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🗺️ Bản Đồ Thế Giới
            </button>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', letterSpacing: '0.04em' }}>
                🍕 FRACTIONS KINGDOM – VƯƠNG QUỐC PHÂN SỐ
              </h1>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                Khám phá bản chất phân số qua các phần chia bằng nhau • Giải cứu Knowledge Crystal
              </p>
            </div>
          </div>

          {/* Grade Selector Pill */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setCampaignId('grade-2')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 800,
                border: campaignId === 'grade-2' ? '2px solid #10b981' : '1px solid #475569',
                background: campaignId === 'grade-2' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                color: campaignId === 'grade-2' ? '#34d399' : '#94a3b8',
                cursor: 'pointer',
              }}
            >
              Lớp 2 (Hiệp Sĩ Nhí)
            </button>
            <button
              onClick={() => setCampaignId('grade-3')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 800,
                border: campaignId === 'grade-3' ? '2px solid #38bdf8' : '1px solid #475569',
                background: campaignId === 'grade-3' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                color: campaignId === 'grade-3' ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer',
              }}
            >
              Lớp 3 (Đại Hiệp Sĩ)
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '24px',
          }}
        >
          {zoneNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveZone(item.id)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: activeZone === item.id ? '2px solid #34d399' : '1px solid rgba(255, 255, 255, 0.1)',
                background: activeZone === item.id ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.4) 100%)' : 'rgba(15, 23, 42, 0.7)',
                color: activeZone === item.id ? '#34d399' : '#cbd5e1',
                boxShadow: activeZone === item.id ? '0 0 16px rgba(16, 185, 129, 0.3)' : 'none',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Main Body View */}
        {activeZone === 'hub' ? (
          /* Hub Landing View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Lore Intro Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '20px',
                padding: '24px 28px',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔮</div>
              <h2 style={{ color: '#34d399', fontSize: '1.4rem', fontWeight: 900, marginBottom: '6px' }}>
                HUYỀN THOẠI TINH THỂ PHÂN SỐ BỊ PHONG ẤN
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Lord Chaos Partition đã dùng ma thuật phân tách các vật phẩm của Vương quốc thành muôn vàn mảnh vỡ to nhỏ hỗn loạn. Để khôi phục Knowledge Crystal, Tony phải thông qua 5 khu vực rèn luyện: tự chia hình, nhận diện phân số, so sánh kích thước các phần và chia tài nguyên công bằng cho dân làng trước khi bước vào trận chiến đối đầu Ma Vương!
              </p>
            </div>

            {/* 5 Zone Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div
                onClick={() => setActiveZone('builder')}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🛠️</div>
                <h3 style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 800 }}>Xây Dựng Phân Số</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                  Tự tay chọn số phần chia đều cho pizza, sô-cô-la và tô màu để khám phá tỉ lệ.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('recognition')}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🔍</div>
                <h3 style={{ color: '#34d399', fontSize: '1.1rem', fontWeight: 800 }}>Nhận Diện Phân Số</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                  Phân biệt một nửa, một phần ba, một phần tư và cạm bẫy các phần chia không đều.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('comparison')}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(250, 204, 21, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>⚖️</div>
                <h3 style={{ color: '#facc15', fontSize: '1.1rem', fontWeight: 800 }}>So Sánh Trực Quan</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                  Hiểu vì sao 1/2 lớn hơn 1/4 qua việc so sánh kích thước các miếng bánh thực tế.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('fair_sharing')}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🎁</div>
                <h3 style={{ color: '#c084fc', fontSize: '1.1rem', fontWeight: 800 }}>Chia Phần Công Bằng</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                  Vận dụng phân số vào bài toán chia táo, bánh mì, vàng bạc cho hiệp sĩ và dân làng.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('boss_arena')}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>⚔️</div>
                <h3 style={{ color: '#f87171', fontSize: '1.1rem', fontWeight: 800 }}>Quyết Đấu Ma Vương</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                  3 giai đoạn kịch tính với Lord Chaos Partition để thu hồi Knowledge Crystal!
                </p>
              </div>
            </div>
          </div>
        ) : activeZone === 'builder' ? (
          <InteractiveFractionBuilderView />
        ) : activeZone === 'recognition' ? (
          <FractionRecognitionView />
        ) : activeZone === 'comparison' ? (
          <FractionComparisonView />
        ) : activeZone === 'fair_sharing' ? (
          <FairSharingView />
        ) : activeZone === 'boss_arena' ? (
          <FractionBossArenaView />
        ) : (
          <FractionAnalyticsView />
        )}
      </div>
    </div>
  );
};
