import React, { useEffect } from 'react';
import { useLogicThinkingStore } from '../useLogicThinkingStore';
import { MAZE_LEVELS_CATALOG } from '../data/mazeLevelsCatalog';

export const InteractiveMazeView: React.FC = () => {
  const {
    currentGrade,
    currentMazeIndex,
    mazePlayerPos,
    mazeKeysCollected,
    mazeDoorUnlocked,
    mazeSteps,
    mazeStatus,
    moveMazePlayer,
    resetMaze,
    nextMaze,
  } = useLogicThinkingStore();

  const mazes = MAZE_LEVELS_CATALOG.filter((m) => m.gradeLevel === currentGrade);
  const activeMaze = mazes[currentMazeIndex % mazes.length] || MAZE_LEVELS_CATALOG[0];

  // Listen to keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        moveMazePlayer('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        moveMazePlayer('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        moveMazePlayer('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        moveMazePlayer('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveMazePlayer]);

  const rows = activeMaze.gridSize.rows;
  const cols = activeMaze.gridSize.cols;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            🧭 Mê Cung Không Gian • {currentGrade === 'grade-2' ? '5x5 (Lớp 2)' : '7x7 (Lớp 3)'}
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">{activeMaze.titleVi}</h2>
        </div>
        <div className="flex items-center gap-2">
          {mazes.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                useLogicThinkingStore.setState({ currentMazeIndex: idx });
                resetMaze();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentMazeIndex === idx
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Màn {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Story & Objective */}
      <div className="bg-emerald-50/70 p-3.5 rounded-xl text-emerald-950 text-sm font-medium mb-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">📜</span>
          <span>{activeMaze.storyVi}</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm">
          <span>🗝️ Chìa Khóa: {mazeKeysCollected}/{activeMaze.requiredKeys}</span>
          <span>🚪 Cổng: {mazeDoorUnlocked ? 'Đã Mở 🔓' : 'Đang Khóa 🔒'}</span>
          <span>👣 Bước: {mazeSteps}</span>
        </div>
      </div>

      {/* Maze Grid */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div
          className="bg-slate-900 p-4 rounded-2xl shadow-2xl border-4 border-slate-700 inline-block"
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: '4px',
          }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const char = activeMaze.layout[r]?.[c] || 'W';
              const isPlayer = mazePlayerPos.row === r && mazePlayerPos.col === c;
              const isWall = char === 'W';
              const isKey = char === 'K' && mazeKeysCollected < activeMaze.requiredKeys;
              const isDoor = char === 'D';
              const isExit = char === 'E';

              let cellBg = 'bg-slate-800';
              let content = null;

              if (isWall) {
                cellBg = 'bg-slate-950 border border-slate-800 shadow-inner';
                content = <div className="w-full h-full bg-slate-900/60 rounded-sm" />;
              } else if (isDoor) {
                cellBg = mazeDoorUnlocked ? 'bg-emerald-900/60' : 'bg-rose-900/60';
                content = <span className="text-xl">{mazeDoorUnlocked ? '🔓' : '🚪'}</span>;
              } else if (isKey) {
                cellBg = 'bg-amber-900/40';
                content = <span className="text-xl animate-bounce">🗝️</span>;
              } else if (isExit) {
                cellBg = 'bg-indigo-900/60';
                content = <span className="text-xl animate-pulse">🏁</span>;
              }

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center font-bold text-sm select-none relative transition-colors duration-150 ${cellBg}`}
                >
                  {content}
                  {isPlayer && (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl animate-pulse drop-shadow-md z-10">
                      👦
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* D-Pad Controller for Touch / Mouse Click */}
      <div className="flex flex-col items-center justify-center mb-6">
        <span className="text-xs text-gray-400 font-semibold mb-2">
          Điều khiển bằng phím Mũi Tên (W, A, S, D) hoặc bấm nút dưới:
        </span>
        <div className="grid grid-cols-3 gap-2 w-48">
          <div />
          <button
            onClick={() => moveMazePlayer('up')}
            className="p-3 bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-xl font-black text-xl shadow active:scale-90 transition border border-slate-300"
          >
            ⬆️
          </button>
          <div />
          <button
            onClick={() => moveMazePlayer('left')}
            className="p-3 bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-xl font-black text-xl shadow active:scale-90 transition border border-slate-300"
          >
            ⬅️
          </button>
          <button
            onClick={() => moveMazePlayer('down')}
            className="p-3 bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-xl font-black text-xl shadow active:scale-90 transition border border-slate-300"
          >
            ⬇️
          </button>
          <button
            onClick={() => moveMazePlayer('right')}
            className="p-3 bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-xl font-black text-xl shadow active:scale-90 transition border border-slate-300"
          >
            ➡️
          </button>
        </div>
      </div>

      {/* Victory Status */}
      {mazeStatus === 'won' && (
        <div className="p-6 rounded-2xl mb-6 bg-emerald-500 text-white shadow-xl text-center animate-bounce">
          <div className="text-3xl mb-2">🎉 CHIẾN THẮNG MÊ CUNG! 🎉</div>
          <p className="font-semibold text-emerald-100 text-sm">
            Tony đã vượt qua mê cung thành công trong {mazeSteps} bước chân! (Tối ưu: {activeMaze.optimalSteps} bước).
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={resetMaze}
              className="px-5 py-2.5 bg-white text-emerald-800 font-bold rounded-xl shadow hover:bg-emerald-50 transition"
            >
              🔄 Chơi Lại Màn Này
            </button>
            <button
              onClick={nextMaze}
              className="px-5 py-2.5 bg-yellow-400 text-yellow-950 font-black rounded-xl shadow hover:bg-yellow-300 transition"
            >
              Mê Cung Tiếp Theo ➔
            </button>
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between border-t pt-4">
        <button
          onClick={resetMaze}
          className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
        >
          🔄 Đặt Lại Vị Trí
        </button>
        <button
          onClick={nextMaze}
          className="px-6 py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition flex items-center gap-2 text-sm"
        >
          Đổi Mê Cung Khác ➔
        </button>
      </div>
    </div>
  );
};
