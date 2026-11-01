import React from 'react';
import { Compass, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import type { SpatialMazeTask } from '../../../types/geometryMeasurement';

interface SpatialMazeLabProps {
  task: SpatialMazeTask;
  playerPos: { x: number; y: number };
  commands: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[];
  feedback: string | null;
  onMove: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  onReset: () => void;
}

export const SpatialMazeLab: React.FC<SpatialMazeLabProps> = ({
  task,
  playerPos,
  commands,
  feedback,
  onMove,
  onReset,
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '2px solid #10b981',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(16, 185, 129, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 800, marginBottom: '6px' }}>
          <Compass size={22} />
          <span style={{ fontSize: '1.25rem' }}>{task.title}</span>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>{task.promptVi}</p>
      </div>

      {/* Maze Grid Stage */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.9) 0%, rgba(10, 15, 29, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '35px',
          flexWrap: 'wrap',
        }}
      >
        {/* Grid Cells */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${task.gridSize.rows}, 50px)`,
            gridTemplateColumns: `repeat(${task.gridSize.cols}, 50px)`,
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '10px',
            borderRadius: '12px',
            border: '2px solid #334155',
          }}
        >
          {Array.from({ length: task.gridSize.rows }).map((_, r) =>
            Array.from({ length: task.gridSize.cols }).map((_, c) => {
              const isPlayer = playerPos.x === c && playerPos.y === r;
              const isTarget = task.targetPos.x === c && task.targetPos.y === r;
              const isObstacle = task.obstacles.some((o) => o.x === c && o.y === r);

              return (
                <div
                  key={`${r}-${c}`}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '8px',
                    background: isObstacle
                      ? 'rgba(239, 68, 68, 0.25)'
                      : isTarget
                      ? 'rgba(250, 204, 21, 0.25)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isObstacle
                      ? '1px solid #ef4444'
                      : isTarget
                      ? '2px solid #facc15'
                      : '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    position: 'relative',
                  }}
                >
                  {isPlayer && <span>🧙‍♂️</span>}
                  {!isPlayer && isTarget && <span>🗝️</span>}
                  {isObstacle && <span>🪨</span>}
                </div>
              );
            })
          )}
        </div>

        {/* Direction Controls (D-Pad) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 800 }}>ĐỊNH HƯỚNG DI CHUYỂN</div>
          <button
            onClick={() => onMove('UP')}
            style={{
              width: '56px',
              height: '50px',
              borderRadius: '10px',
              background: '#334155',
              border: '2px solid #38bdf8',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 900,
            }}
            title="Lên trên"
          >
            <ArrowUp size={24} />
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onMove('LEFT')}
              style={{
                width: '56px',
                height: '50px',
                borderRadius: '10px',
                background: '#334155',
                border: '2px solid #38bdf8',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Sang trái"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={() => onMove('DOWN')}
              style={{
                width: '56px',
                height: '50px',
                borderRadius: '10px',
                background: '#334155',
                border: '2px solid #38bdf8',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Xuống dưới"
            >
              <ArrowDown size={24} />
            </button>
            <button
              onClick={() => onMove('RIGHT')}
              style={{
                width: '56px',
                height: '50px',
                borderRadius: '10px',
                background: '#334155',
                border: '2px solid #38bdf8',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Sang phải"
            >
              <ArrowRight size={24} />
            </button>
          </div>

          <button
            onClick={onReset}
            style={{
              marginTop: '10px',
              background: 'transparent',
              border: 'none',
              color: '#cbd5e1',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} /> Về điểm xuất phát
          </button>
        </div>
      </div>

      {/* Movement History / Trail */}
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>Các bước đã đi ({commands.length}):</span>
        {commands.length === 0 ? (
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Chưa di chuyển</span>
        ) : (
          commands.map((cmd, idx) => (
            <span
              key={idx}
              style={{
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: '#38bdf8',
                fontWeight: 800,
              }}
            >
              {cmd}
            </span>
          ))
        )}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: feedback.includes('CHÚC MỪNG') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${feedback.includes('CHÚC MỪNG') ? '#10b981' : '#ef4444'}`,
            color: feedback.includes('CHÚC MỪNG') ? '#34d399' : '#fca5a5',
            fontSize: '0.9rem',
            fontWeight: 800,
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};
