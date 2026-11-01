import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, Clock, Award, Gift, Sparkles, ChevronRight } from 'lucide-react';
import { SoundButton } from '@/components/common/SoundButton';
import { Badge } from '@/components/common/Badge';
import { useQuestStore } from '../useQuestStore';
import type { Quest } from '@/types/quest';

interface QuestJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestJournalModal: React.FC<QuestJournalModalProps> = ({ isOpen, onClose }) => {
  const { quests, activeQuestId, setActiveQuestId } = useQuestStore();
  const [activeTab, setActiveTab] = useState<'active' | 'available' | 'completed'>('active');
  const [selectedQuestId, setSelectedQuestId] = useState<string>(activeQuestId || quests[0]?.id || '');

  if (!isOpen) return null;

  const filteredQuests = quests.filter((q) => {
    if (activeTab === 'active') return q.status === 'active';
    if (activeTab === 'available') return q.status === 'available';
    if (activeTab === 'completed') return q.status === 'completed';
    return true;
  });

  const selectedQuest = quests.find((q) => q.id === selectedQuestId) || filteredQuests[0] || quests[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '840px',
          maxWidth: '100%',
          height: '560px',
          maxHeight: '90vh',
          background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1d 100%)',
          border: '2px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(251, 191, 36, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.1) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(251, 191, 36, 0.2)',
                border: '1px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <h2
                className="font-cinematic"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                }}
              >
                SỔ NHIỆM VỤ HIỆP SĨ (QUEST JOURNAL)
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Hành trình phiêu lưu và giải cứu Bảy Vương Quốc
              </p>
            </div>
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
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Filters */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <TabButton
            active={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
            label={`Đang thực hiện (${quests.filter((q) => q.status === 'active').length})`}
          />
          <TabButton
            active={activeTab === 'available'}
            onClick={() => setActiveTab('available')}
            label={`Có thể nhận (${quests.filter((q) => q.status === 'available').length})`}
          />
          <TabButton
            active={activeTab === 'completed'}
            onClick={() => setActiveTab('completed')}
            label={`Đã hoàn thành (${quests.filter((q) => q.status === 'completed').length})`}
          />
        </div>

        {/* Body 2-Column Layout */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Column: Quest List */}
          <div
            style={{
              width: '320px',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              overflowY: 'auto',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              background: 'rgba(15, 23, 42, 0.3)',
            }}
          >
            {filteredQuests.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                Không có nhiệm vụ nào trong mục này.
              </div>
            ) : (
              filteredQuests.map((quest) => {
                const isSelected = selectedQuest?.id === quest.id;
                return (
                  <div
                    key={quest.id}
                    onClick={() => setSelectedQuestId(quest.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(30, 41, 59, 0.8) 100%)'
                        : 'rgba(30, 41, 59, 0.4)',
                      border: isSelected ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          color: '#fbbf24',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        Chương {quest.chapter} • {quest.category === 'rescue_quest' ? 'Giải Cứu' : 'Nhiệm Vụ Chính'}
                      </span>
                      {quest.status === 'completed' && (
                        <CheckCircle size={14} color="#34d399" />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginTop: '4px',
                      }}
                    >
                      {quest.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                      Người giao: {quest.giverNpcName}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Quest Details */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {selectedQuest ? (
              <>
                {/* Title & Status */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge variant={selectedQuest.status === 'completed' ? 'emerald' : 'gold'}>
                      {selectedQuest.status === 'completed'
                        ? 'ĐÃ HOÀN THÀNH'
                        : selectedQuest.status === 'active'
                        ? 'ĐANG THỰC HIỆN'
                        : 'CÓ THỂ NHẬN'}
                    </Badge>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Người giao: <strong style={{ color: '#ffffff' }}>{selectedQuest.giverNpcName}</strong>
                    </span>
                  </div>
                  <h3
                    className="font-cinematic"
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      marginTop: '6px',
                    }}
                  >
                    {selectedQuest.title}
                  </h3>
                </div>

                {/* Story Intro */}
                <div
                  style={{
                    background: 'rgba(30, 41, 59, 0.4)',
                    padding: '14px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '0.9rem',
                    color: '#cbd5e1',
                    lineHeight: '1.6',
                    fontStyle: 'italic',
                  }}
                >
                  "{selectedQuest.storyIntro}"
                </div>

                {/* Objectives Checklist */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', marginBottom: '10px' }}>
                    MỤC TIÊU CẦN ĐẠT
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedQuest.objectives?.map((obj) => (
                      <div
                        key={obj.id}
                        style={{
                          background: obj.isCompleted ? 'rgba(52, 211, 153, 0.1)' : 'rgba(30, 41, 59, 0.5)',
                          border: obj.isCompleted
                            ? '1px solid rgba(52, 211, 153, 0.3)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <CheckCircle
                            size={16}
                            color={obj.isCompleted ? '#34d399' : '#64748b'}
                          />
                          <span
                            style={{
                              fontSize: '0.88rem',
                              color: obj.isCompleted ? '#6ee7b7' : '#ffffff',
                              textDecoration: obj.isCompleted ? 'line-through' : 'none',
                            }}
                          >
                            {obj.description}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: obj.isCompleted ? '#34d399' : '#fbbf24',
                          }}
                        >
                          {obj.currentCount}/{obj.targetCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewards */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(30, 41, 59, 0.6) 100%)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Gift size={20} color="#fbbf24" />
                    <div>
                      <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>
                        PHẦN THƯỞNG HOÀN THÀNH
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 700, marginTop: '2px' }}>
                        +{selectedQuest.rewardExp} EXP • +{selectedQuest.rewardGold} Vàng
                      </div>
                    </div>
                  </div>
                  {selectedQuest.rewardItemNames && selectedQuest.rewardItemNames.length > 0 && (
                    <Badge variant="emerald">
                      {selectedQuest.rewardItemNames.join(', ')}
                    </Badge>
                  )}
                </div>

                {/* Pin as active quest button */}
                {selectedQuest.status === 'active' && activeQuestId !== selectedQuest.id && (
                  <SoundButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveQuestId(selectedQuest.id)}
                  >
                    Ghim lên màn hình theo dõi
                  </SoundButton>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>
                Chọn một nhiệm vụ từ danh sách để xem chi tiết.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({
  active,
  onClick,
  label,
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '6px 14px',
      borderRadius: '20px',
      border: active ? '1px solid #fbbf24' : '1px solid transparent',
      background: active ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
      color: active ? '#ffffff' : '#94a3b8',
      fontSize: '0.85rem',
      fontWeight: active ? 700 : 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
  >
    {label}
  </button>
);
