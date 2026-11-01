import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuestStore } from '../useQuestStore';

interface QuestTrackerWidgetProps {
  onOpenJournal: () => void;
}

export const QuestTrackerWidget: React.FC<QuestTrackerWidgetProps> = ({ onOpenJournal }) => {
  const { getActiveQuest } = useQuestStore();
  const [collapsed, setCollapsed] = useState(false);
  const activeQuest = getActiveQuest();

  if (!activeQuest) {
    return (
      <button
        onClick={onOpenJournal}
        style={{
          position: 'absolute',
          top: '90px',
          right: '20px',
          zIndex: 20,
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '16px',
          padding: '8px 14px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: '#fbbf24',
          fontSize: '0.85rem',
          fontWeight: 700,
        }}
      >
        <BookOpen size={16} />
        <span>Sổ Nhiệm Vụ (J)</span>
      </button>
    );
  }

  // Find the first uncompleted objective
  const activeObjective = activeQuest.objectives?.find((o) => !o.isCompleted) || activeQuest.objectives?.[0];
  const completedObjectivesCount = activeQuest.objectives?.filter((o) => o.isCompleted).length || 0;
  const totalObjectivesCount = activeQuest.objectives?.length || 1;
  const progressPercent = Math.round((completedObjectivesCount / totalObjectivesCount) * 100);

  return (
    <div
      style={{
        position: 'absolute',
        top: '90px',
        right: '20px',
        zIndex: 20,
        width: '280px',
        background: 'rgba(15, 23, 42, 0.92)',
        border: '1px solid rgba(251, 191, 36, 0.4)',
        borderRadius: '18px',
        padding: '12px 14px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(251, 191, 36, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          onClick={onOpenJournal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <BookOpen size={14} color="#fbbf24" />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#fbbf24',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Nhiệm Vụ Đang Làm
          </span>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px',
          }}
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Quest Title */}
      <div
        onClick={onOpenJournal}
        style={{
          fontFamily: "var(--font-game, 'Be Vietnam Pro', 'Montserrat', sans-serif)",
          fontSize: '0.95rem',
          fontWeight: 700,
          color: '#ffffff',
          cursor: 'pointer',
        }}
      >
        {activeQuest.title}
      </div>

      {!collapsed && activeObjective && (
        <>
          {/* Current Objective */}
          <div
            onClick={onOpenJournal}
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '10px',
              padding: '8px 10px',
              fontSize: '0.8rem',
              color: '#cbd5e1',
              lineHeight: '1.4',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#38bdf8', fontWeight: 600, marginBottom: '2px' }}>
              <span>Mục tiêu hiện tại:</span>
              <span>{activeObjective.currentCount}/{activeObjective.targetCount}</span>
            </div>
            {activeObjective.description}
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: '100%',
              height: '4px',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #fbbf24, #34d399)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <div
            onClick={onOpenJournal}
            style={{
              fontSize: '10px',
              color: '#94a3b8',
              textAlign: 'right',
              cursor: 'pointer',
            }}
          >
            Bấm để mở Sổ Nhiệm Vụ (J)
          </div>
        </>
      )}
    </div>
  );
};
