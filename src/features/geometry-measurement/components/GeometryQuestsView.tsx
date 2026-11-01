import React from 'react';
import { Award, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import type { RealLifeGeometryQuest } from '../data/geometryQuestsCatalog';

interface GeometryQuestsViewProps {
  quests: RealLifeGeometryQuest[];
  activeQuest: RealLifeGeometryQuest | null;
  questStep: number;
  solvedQuestIds: string[];
  onStartQuest: (questId: string) => void;
  onAnswerStep: (answer: string | number) => boolean;
}

export const GeometryQuestsView: React.FC<GeometryQuestsViewProps> = ({
  quests,
  activeQuest,
  questStep,
  solvedQuestIds,
  onStartQuest,
  onAnswerStep,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Quests Selector Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {quests.map((q) => {
          const isSelected = activeQuest?.id === q.id;
          const isSolved = solvedQuestIds.includes(q.id);

          return (
            <div
              key={q.id}
              onClick={() => onStartQuest(q.id)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)'
                  : 'rgba(15, 23, 42, 0.7)',
                border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '2rem' }}>{q.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.95rem' }}>{q.title}</div>
                <div style={{ color: isSolved ? '#34d399' : '#94a3b8', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  {isSolved ? (
                    <>
                      <CheckCircle2 size={13} /> Đã hoàn thành
                    </>
                  ) : (
                    'Chưa hoàn thành'
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Quest Content */}
      {activeQuest && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
            border: '2px solid #38bdf8',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Quest Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 800 }}>
                <Compass size={22} />
                <span style={{ fontSize: '1.3rem' }}>{activeQuest.title}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                {activeQuest.storyIntroVi}
              </p>
            </div>

            <div style={{ background: 'rgba(250, 204, 21, 0.15)', border: '1px solid #facc15', borderRadius: '12px', padding: '6px 14px', color: '#facc15', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} /> +{activeQuest.rewardXp} EXP &nbsp;|&nbsp; +{activeQuest.rewardGold} Vàng
            </div>
          </div>

          {/* Stepper Progress */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {activeQuest.taskSteps.map((s, idx) => {
              const isPast = idx < questStep;
              const isCurrent = idx === questStep;
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: '8px',
                    borderRadius: '4px',
                    background: isPast ? '#10b981' : isCurrent ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease',
                  }}
                />
              );
            })}
          </div>

          {/* Current Step Task */}
          {questStep < activeQuest.taskSteps.length ? (
            <div
              style={{
                background: 'rgba(10, 15, 29, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div>
                <span style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 800 }}>
                  BƯỚC {questStep + 1} / {activeQuest.taskSteps.length}
                </span>
                <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>
                  {activeQuest.taskSteps[questStep].descriptionVi}
                </h3>
              </div>

              {/* Step Options */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {activeQuest.taskSteps[questStep].options?.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAnswerStep(opt)}
                    style={{
                      padding: '14px 20px',
                      background: 'rgba(30, 41, 59, 0.8)',
                      border: '1.5px solid rgba(56, 189, 248, 0.4)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    👉 {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10b981',
                borderRadius: '16px',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎉</div>
              <h3 style={{ color: '#34d399', fontSize: '1.4rem', fontWeight: 900 }}>
                HOÀN THÀNH XUẤT SẮC NHIỆM VỤ!
              </h3>
              <p style={{ color: '#cbd5e1', marginTop: '6px' }}>
                Tony đã vận dụng hình học và đo lường để giải quyết trọn vẹn tình huống thực tế này!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
