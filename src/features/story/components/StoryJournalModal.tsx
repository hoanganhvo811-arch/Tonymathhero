import React, { useState } from 'react';
import {
  BookOpen,
  MapPin,
  CheckCircle2,
  Sword,
  Gem,
  Users,
  Lock,
  Sparkles,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { SoundButton } from '@/components/common/SoundButton';
import { STORY_CHAPTERS_CONFIG } from '../data/mainStoryConfig';
import { SEVEN_KNOWLEDGE_CRYSTALS } from '../data/sevenCrystalsConfig';
import { GRADE_2_BOSSES } from '../../bosses/data/sevenBossesConfig';
import { SEVEN_KINGDOMS_3D_CONFIGS } from '@/data/kingdoms/sevenKingdoms3dConfig';
import { useProgressStore } from '@/game/state/useProgressStore';
import { useQuestStore } from '@/features/quests/useQuestStore';
import { useKingdomProgressionStore } from '@/features/kingdom-progression/useKingdomProgressionStore';
import { useAudio } from '@/hooks/useAudio';

interface StoryJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type JournalTab = 'story' | 'kingdoms' | 'quests' | 'bosses' | 'crystals' | 'characters';

export const StoryJournalModal: React.FC<StoryJournalModalProps> = ({ isOpen, onClose }) => {
  const { playSelect } = useAudio();
  const [activeTab, setActiveTab] = useState<JournalTab>('story');

  const { currentProgress } = useProgressStore();
  const { quests } = useQuestStore();
  const { getKingdomStatus } = useKingdomProgressionStore();

  if (!isOpen) return null;

  const rescuedKingdomIds = currentProgress?.rescuedKingdomIds || [];
  const completedQuestIds = currentProgress?.completedQuestIds || [];
  const collectedGemIds = currentProgress?.collectedGemIds || [];

  const tabs: { id: JournalTab; label: string; icon: any }[] = [
    { id: 'story', label: 'Cốt Truyện', icon: BookOpen },
    { id: 'kingdoms', label: '7 Vương Quốc', icon: MapPin },
    { id: 'quests', label: 'Nhiệm Vụ', icon: CheckCircle2 },
    { id: 'bosses', label: 'Hồ Sơ Boss', icon: Sword },
    { id: 'crystals', label: 'Ngọc Tri Thức', icon: Gem },
    { id: 'characters', label: 'Nhân Vật', icon: Users },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="NHẬT KÝ HÀNH TRÌNH HIỆP SĨ (STORY JOURNAL)" maxWidth="940px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '480px' }}>
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            paddingBottom: '10px',
            overflowX: 'auto',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <SoundButton
                key={tab.id}
                onClick={() => {
                  playSelect();
                  setActiveTab(tab.id);
                }}
                style={{
                  background: isActive ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(15, 23, 42, 0.6)',
                  border: isActive ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </SoundButton>
            );
          })}
        </div>

        {/* Tab 1: Main Story Chapters */}
        {activeTab === 'story' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, color: '#facc15', fontSize: '1rem', fontWeight: 800 }}>
              Tiến Trình 7 Chương Sử Thi Bảy Vương Quốc
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
              {STORY_CHAPTERS_CONFIG.map((chapter) => {
                const isCompleted = chapter.order === 0 || rescuedKingdomIds.length >= chapter.order;
                const isCurrent = rescuedKingdomIds.length === chapter.order - 1;

                return (
                  <div
                    key={chapter.id}
                    style={{
                      background: isCurrent
                        ? 'rgba(251, 191, 36, 0.1)'
                        : isCompleted
                        ? 'rgba(16, 185, 129, 0.08)'
                        : 'rgba(15, 23, 42, 0.5)',
                      border: isCurrent
                        ? '1px solid #fbbf24'
                        : isCompleted
                        ? '1px solid rgba(16, 185, 129, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isCompleted ? '#10b981' : isCurrent ? '#f59e0b' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '12px',
                        flexShrink: 0,
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={18} /> : chapter.order}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h5 style={{ margin: 0, color: '#f8fafc', fontSize: '0.98rem', fontWeight: 700 }}>
                          {chapter.titleVi}
                        </h5>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: isCompleted ? '#4ade80' : isCurrent ? '#fbbf24' : '#64748b',
                          }}
                        >
                          {isCompleted ? 'Hoàn Thành' : isCurrent ? 'Đang Thực Hiện' : 'Chưa Khám Phá'}
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.4 }}>
                        {chapter.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: 7 Kingdoms */}
        {activeTab === 'kingdoms' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', maxHeight: '380px', overflowY: 'auto' }}>
            {Object.entries(SEVEN_KINGDOMS_3D_CONFIGS).map(([orderStr, config]) => {
              const order = Number(orderStr);
              const prefix = currentProgress?.campaignId === 'grade-3' ? 'g3-k' : 'g2-k';
              const keys = ['', `${prefix}1-arithmia`, `${prefix}2-chronos`, `${prefix}3-multiplex`, `${prefix}4-divisia`, `${prefix}5-geometria`, `${prefix}6-fractions`, `${prefix}7-apex`];
              const kId = keys[order] || '';
              const status = getKingdomStatus(kId);

              const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
                RESTORED: { label: 'ĐÃ GIẢI CỨU (RESTORED)', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)' },
                IN_PROGRESS: { label: 'ĐANG KHÁM PHÁ (IN PROGRESS)', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
                LOCKED: { label: 'BỊ PHONG ẤN (LOCKED)', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
                BOSS_DEFEATED: { label: 'BOSS ĐÃ BẠI', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
                CORRUPTED: { label: 'BỊ BÓNG TỐI CHIẾM', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' },
              };

              const badge = statusBadge[status] || statusBadge.LOCKED;

              return (
                <div
                  key={order}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: status === 'RESTORED' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ margin: 0, color: '#f8fafc', fontWeight: 800, fontSize: '0.95rem' }}>
                      #{order}. {config.titleVi}
                    </h5>
                  </div>
                  <span
                    style={{
                      alignSelf: 'flex-start',
                      color: badge.color,
                      background: badge.bg,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 700,
                    }}
                  >
                    {badge.label}
                  </span>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4 }}>
                    {config.tagline}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Quests History */}
        {activeTab === 'quests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
            {quests.map((q) => {
              const isCompleted = completedQuestIds.includes(q.id) || q.status === 'completed';
              return (
                <div
                  key={q.id}
                  style={{
                    background: isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                    border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h5 style={{ margin: 0, color: isCompleted ? '#4ade80' : '#f8fafc', fontWeight: 700 }}>
                      {q.title}
                    </h5>
                    <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.82rem' }}>
                      {q.objectiveSummary}
                    </p>
                  </div>
                  <span
                    style={{
                      color: isCompleted ? '#4ade80' : '#fbbf24',
                      background: isCompleted ? 'rgba(74, 222, 128, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isCompleted ? 'Đã Xong' : 'Đang Làm'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: Boss Records */}
        {activeTab === 'bosses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', maxHeight: '380px', overflowY: 'auto' }}>
            {Object.values(GRADE_2_BOSSES).map((boss, idx) => {
              const isDefeated = rescuedKingdomIds.length >= idx + 1;
              return (
                <div
                  key={boss.bossId}
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: isDefeated ? '1px solid #10b981' : '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ margin: 0, color: '#f8fafc', fontWeight: 800 }}>{boss.titleVi}</h5>
                    <span
                      style={{
                        color: isDefeated ? '#4ade80' : '#f87171',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {isDefeated ? 'ĐÃ ĐÁNH BẠI' : 'CHƯA HẠ GỤC'}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                    {boss.description}
                  </p>
                  <div style={{ fontSize: '11px', color: '#fbbf24', marginTop: '4px' }}>
                    Chủ đề: {boss.allowedMathTopics.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 5: Crystals Collection Link */}
        {activeTab === 'crystals' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', maxHeight: '380px', overflowY: 'auto' }}>
            {SEVEN_KNOWLEDGE_CRYSTALS.map((c) => {
              const isCollected = collectedGemIds.some(
                (id) => id === c.id || id === `gem-g2-${c.order}` || id === `gem-g3-${c.order}`
              );
              return (
                <div
                  key={c.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: `1px solid ${isCollected ? c.color : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isCollected ? c.color : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0,
                    }}
                  >
                    <Gem size={20} />
                  </div>
                  <div>
                    <h5 style={{ margin: 0, color: '#f8fafc', fontSize: '0.9rem', fontWeight: 700 }}>
                      {c.vietnameseName}
                    </h5>
                    <span style={{ fontSize: '11px', color: isCollected ? c.color : '#64748b', fontWeight: 600 }}>
                      {isCollected ? 'Đã thu hồi' : 'Chưa thu thập'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 6: Important Characters */}
        {activeTab === 'characters' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', maxHeight: '380px', overflowY: 'auto' }}>
            {[
              { name: 'Hiệp Sĩ Tony', role: 'Nhân Vật Chính', desc: 'Chiến binh trẻ tuổi mang trái tim dũng cảm và thanh gươm tri thức.' },
              { name: 'Trưởng Lão Elder Oak', role: 'Làng Khởi Nguyên', desc: 'Người dẫn đường thông tuệ trao cho Tony nhiệm vụ giải cứu 7 vương quốc.' },
              { name: 'Cô Bé Lily', role: 'Dân Làng Rừng Xanh', desc: 'Cô bé ngoan ngoãn hướng dẫn Tony tìm dấu vết quái vật và giải cứu dân làng.' },
              { name: 'Forest Guardian', role: 'Thần Thụ Rừng Xanh', desc: 'Thủ hộ vĩ đại của Rừng Xanh, đã được Tony thanh tẩy khỏi bóng tối.' },
              { name: 'Thương Nhân Odo', role: 'Nhà Buôn Du Mục', desc: 'Thương gia vui tính cung cấp vũ khí, áo giáp và dược phẩm cho các hiệp sĩ.' },
              { name: 'Lord Zero', role: 'Kẻ Thù Tối Thượng', desc: 'Chúa tể bóng tối toan tính biến toàn bộ tri thức thế giới thành số 0 trống rỗng.' },
            ].map((char) => (
              <div
                key={char.name}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 style={{ margin: 0, color: '#f8fafc', fontWeight: 700 }}>{char.name}</h5>
                  <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>{char.role}</span>
                </div>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4 }}>
                  {char.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <SoundButton
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '8px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Đóng Nhật Ký
          </SoundButton>
        </div>
      </div>
    </Modal>
  );
};
