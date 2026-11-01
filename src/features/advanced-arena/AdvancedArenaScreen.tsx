import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdvancedArenaStore } from './useAdvancedArenaStore';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { MixedChallengeView } from './components/MixedChallengeView';
import { MultiStepProblemView } from './components/MultiStepProblemView';
import { StrategyChallengeView } from './components/StrategyChallengeView';
import { MathMarathonView } from './components/MathMarathonView';
import { ChallengeTowerView } from './components/ChallengeTowerView';
import { GrandBossArenaView } from './components/GrandBossArenaView';
import { ArenaAnalyticsView } from './components/ArenaAnalyticsView';
import type { ArenaZone } from '@/types/advancedArena';

export const AdvancedArenaScreen: React.FC = () => {
  const navigate = useNavigate();
  const { activeZone, setActiveZone, campaignId, setCampaignId, loadInitialState } = useAdvancedArenaStore();
  const activeCampaignId = useCampaignStore((s) => s.activeCampaignId);

  useEffect(() => {
    if (activeCampaignId) {
      setCampaignId(activeCampaignId as 'grade-2' | 'grade-3');
    }
    loadInitialState();
  }, [activeCampaignId, setCampaignId, loadInitialState]);

  const zoneNavItems: { id: ArenaZone | 'hub'; label: string; icon: string }[] = [
    { id: 'hub', label: 'Tổng Quan Đấu Trường', icon: '🏛️' },
    { id: 'mixed_challenge', label: 'Thử Thách Tổng Hợp', icon: '🎲' },
    { id: 'multi_step', label: 'Toán Nhiều Bước', icon: '📜' },
    { id: 'strategy', label: 'Chiến Lược Giải Toán', icon: '💡' },
    { id: 'marathon', label: 'Đường Đua Marathon', icon: '🏃' },
    { id: 'tower', label: 'Tháp Thử Thách', icon: '🏰' },
    { id: 'grand_boss', label: 'Đại Pháp Sư Nexus', icon: '🧙‍♂️' },
    { id: 'analytics', label: 'Bảng Năng Lực', icon: '📊' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 10%, #1e112a 0%, #100818 60%, #06020c 100%)',
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
                  background: 'linear-gradient(135deg, #c084fc, #a855f7, #eab308)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                🏆 ĐẤU TRƯỜNG THỬ THÁCH TOÁN TỔNG HỢP
              </h1>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                Hợp nhất tinh hoa của cả 7 vương quốc: Đa chủ đề, Toán nhiều bước, Chiến lược nhẩm & Tháp thử thách
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
                border: campaignId === 'grade-2' ? '2px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                background: campaignId === 'grade-2' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255,255,255,0.05)',
                color: campaignId === 'grade-2' ? '#c084fc' : '#94a3b8',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Lớp 2 (Phạm vi 1000)
            </button>
            <button
              onClick={() => setCampaignId('grade-3')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: campaignId === 'grade-3' ? '2px solid #eab308' : '1px solid rgba(255,255,255,0.1)',
                background: campaignId === 'grade-3' ? 'rgba(234, 179, 8, 0.25)' : 'rgba(255,255,255,0.05)',
                color: campaignId === 'grade-3' ? '#fde047' : '#94a3b8',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Lớp 3 (Phạm vi 100.000)
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
                  border: isActive ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(192, 132, 252, 0.2))'
                    : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#f3e8ff' : '#94a3b8',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(168, 85, 247, 0.25)' : 'none',
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
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(99, 102, 241, 0.25) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
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
                    background: 'rgba(168, 85, 247, 0.2)',
                    color: '#c084fc',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}
                >
                  Giai đoạn 19 • Advanced Math Challenges
                </span>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 900, color: '#f3e8ff' }}>
                  Đấu Trường Toàn Năng – Hội Tụ 7 Vương Quốc!
                </h2>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#cbd5e1' }}>
                  Đây là đỉnh cao thử thách dành cho Tony! Không còn rèn luyện từng chủ đề đơn lẻ, Đấu Trường Tổng Hợp đòi hỏi Tony phải kết nối linh hoạt giữa Số học, Nhân chia, Hình học, Đo lường, Thời gian, Tiền tệ và Phân số để vượt qua các cửa ải cam go nhất.
                </p>
              </div>
              <button
                onClick={() => setActiveZone('mixed_challenge')}
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 26px',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(168, 85, 247, 0.4)',
                  transition: 'transform 0.15s ease',
                }}
              >
                🎲 Thử Thách Ngay ➜
              </button>
            </div>

            {/* Hub Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                onClick={() => setActiveZone('mixed_challenge')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎲</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#f3e8ff' }}>
                  Thử Thách Tổng Hợp (Mixed Math)
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Trộn đều câu hỏi từ cả 9 miền kiến thức, tùy chọn 10, 20 hoặc 30 câu với chế độ có hoặc không giới hạn giờ.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('multi_step')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📜</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#f3e8ff' }}>
                  Toán Nhiều Bước Tính
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Giải quyết bài toán yêu cầu từ 2 bước trở lên: tìm dữ kiện trung gian, tổng chi phí rồi đến tiền thừa.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('strategy')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>💡</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#f3e8ff' }}>
                  Chiến Lược Giải Toán
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Khám phá nhiều hướng giải hợp lệ cho cùng một bài toán: tách số, làm tròn, đảo ngược và chia nhỏ mục tiêu.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('marathon')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏃</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#f3e8ff' }}>
                  Đường Đua Math Marathon
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Chạy đua đường trường liên hoàn, duy trì chuỗi đúng và chạm tới các trạm Checkpoint nhận thưởng lớn!
                </p>
              </div>

              <div
                onClick={() => setActiveZone('tower')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏰</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#f3e8ff' }}>
                  Tháp Thử Thách 6 Tầng
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Chinh phục tòa tháp ma thuật từ tầng cơ bản, vận dụng, liên môn cho đến thượng đài trên mây.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('grand_boss')}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🧙‍♂️</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#f3e8ff' }}>
                  Quyết Đấu Archmage Nexus
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                  Trận đại chiến 3 giai đoạn đối đầu Đại Pháp Sư Vạn Vương Quốc với toàn bộ kho tàng toán học.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeZone === 'mixed_challenge' && <MixedChallengeView />}
        {activeZone === 'multi_step' && <MultiStepProblemView />}
        {activeZone === 'strategy' && <StrategyChallengeView />}
        {activeZone === 'marathon' && <MathMarathonView />}
        {activeZone === 'tower' && <ChallengeTowerView />}
        {activeZone === 'grand_boss' && <GrandBossArenaView />}
        {activeZone === 'analytics' && <ArenaAnalyticsView />}
      </div>
    </div>
  );
};
