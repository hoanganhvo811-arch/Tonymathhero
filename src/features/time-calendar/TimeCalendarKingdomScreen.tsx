import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimeCalendarStore } from './useTimeCalendarStore';
import { useCampaignStore } from '@/game/state/useCampaignStore';
import { InteractiveClockView } from './components/InteractiveClockView';
import { InteractiveCalendarView } from './components/InteractiveCalendarView';
import { DailyRoutineTimelineView } from './components/DailyRoutineTimelineView';
import { TimeDurationQuestView } from './components/TimeDurationQuestView';
import { TimeBossArenaView } from './components/TimeBossArenaView';
import { TimeAnalyticsView } from './components/TimeAnalyticsView';
import type { TimeCalendarZone } from '@/types/timeCalendar';

export const TimeCalendarKingdomScreen: React.FC = () => {
  const navigate = useNavigate();
  const { activeZone, setActiveZone, campaignId, setCampaignId, loadProgress } = useTimeCalendarStore();
  const activeCampaignId = useCampaignStore((s) => s.activeCampaignId);

  useEffect(() => {
    if (activeCampaignId) {
      setCampaignId(activeCampaignId as 'grade-2' | 'grade-3');
    }
    loadProgress();
  }, [activeCampaignId, setCampaignId, loadProgress]);

  const zoneNavItems: { id: TimeCalendarZone | 'hub'; label: string; icon: string }[] = [
    { id: 'hub', label: 'Tổng Quan Vương Quốc', icon: '🏰' },
    { id: 'clock', label: 'Xem Giờ Đồng Hồ', icon: '⏰' },
    { id: 'calendar', label: 'Khám Phá Cuốn Lịch', icon: '📅' },
    { id: 'timeline', label: 'Lịch Sinh Hoạt', icon: '📋' },
    { id: 'duration', label: 'Khoảng Thời Gian', icon: '⏳' },
    { id: 'boss_arena', label: 'Quyết Đấu Vệ Binh', icon: '⚔️' },
    { id: 'analytics', label: 'Năng Lực Của Tony', icon: '📊' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 10%, #0d1e3a 0%, #061124 60%, #020712 100%)',
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
              <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#facc15', letterSpacing: '0.04em' }}>
                ⏳ TIME &amp; CALENDAR KINGDOM – VƯƠNG QUỐC THỜI GIAN VÀ LỊCH
              </h1>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                Khôi phục bánh răng đồng hồ, cuốn lịch vạn niên và giải cứu Chrono Knowledge Crystal
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
                border: activeZone === item.id ? '2px solid #facc15' : '1px solid rgba(255, 255, 255, 0.1)',
                background: activeZone === item.id ? 'linear-gradient(135deg, rgba(250, 204, 21, 0.3) 0%, rgba(217, 119, 6, 0.4) 100%)' : 'rgba(15, 23, 42, 0.7)',
                color: activeZone === item.id ? '#facc15' : '#cbd5e1',
                boxShadow: activeZone === item.id ? '0 0 16px rgba(250, 204, 21, 0.3)' : 'none',
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
                background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '2px solid rgba(250, 204, 21, 0.4)',
                borderRadius: '20px',
                padding: '24px 28px',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔮</div>
              <h2 style={{ color: '#facc15', fontSize: '1.4rem', fontWeight: 900, marginBottom: '6px' }}>
                HUYỀN THOẠI TRỤC THỜI GIAN BỊ ĐẢO LỘN
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Lord Zero đã làm rối loạn dòng chảy thời gian tại Chrono Kingdom! Bánh răng đồng hồ ngưng chuyển động, ngày tháng trên cuốn lịch bị xáo trộn và những cánh cổng thời không đóng chặt. Tony hãy rèn luyện kỹ năng xem đồng hồ kim, tra cứu lịch vạn niên, tính toán khoảng thời gian và sắp xếp sinh hoạt khoa học để vượt qua 3 giai đoạn thử thách của Chronos Watcher, khôi phục Chrono Knowledge Crystal!
              </p>
            </div>

            {/* 5 Zone Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div
                onClick={() => setActiveZone('clock')}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>⏰</div>
                <h3 style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 800 }}>Xem Giờ Đồng Hồ</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                  Xoay kim đồng hồ, đồng bộ màn hình điện tử, đọc giờ đúng, giờ rưỡi và giờ kém.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('calendar')}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(250, 204, 21, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>📅</div>
                <h3 style={{ color: '#facc15', fontSize: '1.1rem', fontWeight: 800 }}>Khám Phá Cuốn Lịch</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                  Tra cứu ngày tháng, thứ trong tuần, quy tắc nắm tay và nhận biết năm nhuận 366 ngày.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('timeline')}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>📋</div>
                <h3 style={{ color: '#34d399', fontSize: '1.1rem', fontWeight: 800 }}>Lịch Sinh Hoạt</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                  Sắp xếp các hoạt động trong ngày theo đúng thứ tự trên dòng thời gian 24 giờ.
                </p>
              </div>

              <div
                onClick={() => setActiveZone('duration')}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>⏳</div>
                <h3 style={{ color: '#c084fc', fontSize: '1.1rem', fontWeight: 800 }}>Khoảng Thời Gian</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                  Tính toán thời lượng hành trình từ lúc xuất phát đến lúc kết thúc trước khi cổng đóng.
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
                <h3 style={{ color: '#f87171', fontSize: '1.1rem', fontWeight: 800 }}>Quyết Đấu Vệ Binh</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
                  Đánh bại Chronos Watcher qua 3 giai đoạn để thu hồi Chrono Knowledge Crystal!
                </p>
              </div>
            </div>
          </div>
        ) : activeZone === 'clock' ? (
          <InteractiveClockView />
        ) : activeZone === 'calendar' ? (
          <InteractiveCalendarView />
        ) : activeZone === 'timeline' ? (
          <DailyRoutineTimelineView />
        ) : activeZone === 'duration' ? (
          <TimeDurationQuestView />
        ) : activeZone === 'boss_arena' ? (
          <TimeBossArenaView />
        ) : (
          <TimeAnalyticsView />
        )}
      </div>
    </div>
  );
};
