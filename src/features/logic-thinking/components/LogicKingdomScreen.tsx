import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogicThinkingStore } from '../useLogicThinkingStore';
import { LogicZone } from '../../../types';
import { PatternRecognitionView } from './PatternRecognitionView';
import { NumberLogicView } from './NumberLogicView';
import { ShapeLogicView } from './ShapeLogicView';
import { InteractiveMazeView } from './InteractiveMazeView';
import { DeductiveDetectiveView } from './DeductiveDetectiveView';
import { NumberCodeCipherView } from './NumberCodeCipherView';
import { LogicGuardianArenaView } from './LogicGuardianArenaView';
import { LogicAnalyticsView } from './LogicAnalyticsView';

interface ZoneTab {
  id: LogicZone;
  label: string;
  icon: string;
  color: string;
}

const ZONE_TABS: ZoneTab[] = [
  { id: 'pattern', label: 'Quy Luật', icon: '🔮', color: 'indigo' },
  { id: 'number_logic', label: 'Logic Số', icon: '⚖️', color: 'amber' },
  { id: 'shape_logic', label: 'Hình Học', icon: '🧩', color: 'sky' },
  { id: 'spatial_maze', label: 'Mê Cung', icon: '🧭', color: 'emerald' },
  { id: 'deductive', label: 'Thám Tử', icon: '🕵️', color: 'orange' },
  { id: 'number_code', label: 'Bẻ Khóa', icon: '🔐', color: 'purple' },
  { id: 'boss_battle', label: 'Đấu Nhân Sư', icon: '👑', color: 'yellow' },
  { id: 'analytics', label: 'Báo Cáo', icon: '📊', color: 'slate' },
];

export const LogicKingdomScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentGrade, activeZone, setGrade, setActiveZone, progress } =
    useLogicThinkingStore();

  const renderActiveView = () => {
    switch (activeZone) {
      case 'pattern':
        return <PatternRecognitionView />;
      case 'number_logic':
        return <NumberLogicView />;
      case 'shape_logic':
        return <ShapeLogicView />;
      case 'spatial_maze':
        return <InteractiveMazeView />;
      case 'deductive':
        return <DeductiveDetectiveView />;
      case 'number_code':
        return <NumberCodeCipherView />;
      case 'boss_battle':
        return <LogicGuardianArenaView />;
      case 'analytics':
        return <LogicAnalyticsView />;
      default:
        return <PatternRecognitionView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-gray-800 pb-16">
      {/* Top Navigation Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/map')}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur transition border border-white/20 flex items-center gap-1.5"
            >
              🗺️ Bản Đồ Thế Giới
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur transition border border-white/20 flex items-center gap-1.5"
            >
              🏠 Trang Chủ
            </button>
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-2 bg-black/30 p-1 rounded-xl border border-white/20">
            <button
              onClick={() => setGrade('grade-2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                currentGrade === 'grade-2'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Lớp 2 (Cơ Bản)
            </button>
            <button
              onClick={() => setGrade('grade-3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                currentGrade === 'grade-3'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Lớp 3 (Nâng Cao)
            </button>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 text-xs font-bold bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/20">
            <span>🧩 Đã Giải: {progress.totalPuzzlesSolved}</span>
            <span>🧭 Mê Cung: {progress.clearedMazeLevels.length}</span>
            <span>👑 Boss: {progress.bossDefeatedPhases.length}/3</span>
          </div>
        </div>

        {/* Title Bar */}
        <div className="max-w-6xl mx-auto px-4 pt-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-3xl shadow-lg border-2 border-yellow-200">
              🧠
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-amber-200 uppercase tracking-wide">
                KINGDOM OF LOGIC – VƯƠNG QUỐC TRÍ TUỆ
              </h1>
              <p className="text-xs md:text-sm text-indigo-200 font-medium">
                Khám phá bí mật mê cung, rèn luyện tư duy logic phản biện và chiến thắng Nhân Sư Malakor!
              </p>
            </div>
          </div>
        </div>

        {/* Zone Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-none flex gap-2 pb-3">
          {ZONE_TABS.map((tab) => {
            const isActive = activeZone === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveZone(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? 'bg-white text-indigo-950 shadow-md scale-105'
                    : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {renderActiveView()}
      </main>
    </div>
  );
};
