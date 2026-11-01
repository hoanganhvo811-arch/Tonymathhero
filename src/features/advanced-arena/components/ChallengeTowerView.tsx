import React from 'react';
import { useAdvancedArenaStore } from '../useAdvancedArenaStore';
import { CHALLENGE_TOWER_FLOORS } from '../data/towerCatalog';
import {
  Castle,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  AlertTriangle,
} from 'lucide-react';

export const ChallengeTowerView: React.FC = () => {
  const {
    activeFloorNumber,
    floorQuestions,
    floorQuestionIndex,
    floorCorrectCount,
    floorCompleted,
    towerFeedback,
    selectFloor,
    answerTowerQuestion,
    nextTowerQuestion,
    progress,
    setActiveZone,
  } = useAdvancedArenaStore();

  const currentFloorConfig =
    CHALLENGE_TOWER_FLOORS.find((f) => f.floorNumber === activeFloorNumber) ||
    CHALLENGE_TOWER_FLOORS[0];

  const currentQuestion = floorQuestions[floorQuestionIndex];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-indigo-700 via-purple-700 to-pink-700 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Castle className="w-6 h-6 text-yellow-300" />
            Tháp Thử Thách Vạn Vương Quốc (Challenge Tower)
          </h2>
          <p className="text-purple-100 text-sm mt-1">
            Leo lên từng tầng tháp ma thuật: từ nền tảng cơ bản, vận dụng thực tế, đến mê cung đa bước và chạm trán Boss Nexus trên đỉnh tháp!
          </p>
        </div>
        <div className="bg-black/30 border border-white/20 px-4 py-2.5 rounded-xl text-center shrink-0">
          <span className="text-xs text-purple-200 block uppercase font-bold">Tầng cao nhất đạt được</span>
          <span className="text-xl font-black text-yellow-300 font-mono">
            Tầng {progress.highestTowerFloorCleared}/6
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tower Floors Elevator Map */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">
            Bản đồ 6 tầng tháp (Chọn tầng để leo):
          </span>

          <div className="flex flex-col-reverse gap-2.5">
            {CHALLENGE_TOWER_FLOORS.map((floor) => {
              const isUnlocked =
                floor.floorNumber === 1 || progress.highestTowerFloorCleared >= floor.floorNumber - 1;
              const isCleared = progress.highestTowerFloorCleared >= floor.floorNumber;
              const isSelected = activeFloorNumber === floor.floorNumber;

              return (
                <button
                  key={floor.floorNumber}
                  disabled={!isUnlocked}
                  onClick={() => selectFloor(floor.floorNumber)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600/30 border-purple-400 shadow-lg scale-102 ring-2 ring-purple-400/50'
                      : isCleared
                      ? 'bg-slate-800/80 border-emerald-500/40 text-slate-200 hover:bg-slate-700'
                      : isUnlocked
                      ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-950/60 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{floor.badgeIcon}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">
                          Tầng {floor.floorNumber}
                        </span>
                        {isCleared && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 rounded-sm font-bold">
                            Xong
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {floor.nameVi.replace(/^Tầng \d+: /, '')}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <Unlock className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Active Floor Challenge Arena */}
        <div className="lg:col-span-2 space-y-5">
          {/* Floor Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800">
                  {currentFloorConfig.nameVi}
                </span>
                <p className="text-sm text-slate-300 mt-2 font-medium">
                  {currentFloorConfig.themeVi}
                </p>
              </div>

              {activeFloorNumber === 6 && (
                <button
                  onClick={() => setActiveZone('grand_boss')}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 transition-transform shrink-0"
                >
                  👑 Vào Đấu Boss Nexus
                </button>
              )}
            </div>

            {/* Floor Progress Bar */}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Tiến độ câu: {floorQuestionIndex + 1}/{floorQuestions.length}</span>
                <span>Số câu đúng: {floorCorrectCount}/{floorQuestions.length}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{
                    width: `${Math.round(((floorQuestionIndex + 1) / floorQuestions.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Floor Cleared Notification or Active Question */}
          {floorCompleted ? (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-8 text-center shadow-2xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-xl">
                ✨
              </div>
              <h3 className="text-2xl font-black text-emerald-300">
                CHINH PHỤC THÀNH CÔNG TẦNG {activeFloorNumber}!
              </h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Tony đã xuất sắc giải đúng {floorCorrectCount}/{floorQuestions.length} câu hỏi và kích hoạt cánh cổng bước tiếp!
              </p>
              <div className="flex justify-center gap-3 pt-2">
                {activeFloorNumber < 6 ? (
                  <button
                    onClick={() => selectFloor(activeFloorNumber + 1)}
                    className="px-6 py-2.5 rounded-xl font-bold bg-purple-500 hover:bg-purple-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
                  >
                    Lên Tầng {activeFloorNumber + 1} Tiếp Theo <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveZone('grand_boss')}
                    className="px-6 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
                  >
                    👑 Vào Khiêu Chiến Boss Nexus <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wide mb-1">
                  {currentQuestion.titleVi}
                </h4>
                <p className="text-base text-slate-100 font-medium leading-relaxed">
                  {currentQuestion.promptVi}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => answerTowerQuestion(idx)}
                    className="p-4 rounded-xl text-left font-bold text-slate-100 bg-slate-800 hover:bg-purple-600/30 border border-slate-700 hover:border-purple-500 transition-all duration-150 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm group-hover:text-purple-300 transition-colors">
                        {opt}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity" />
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {towerFeedback && (
                <div
                  className={`p-4 rounded-xl border flex flex-col gap-2 ${
                    towerFeedback.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {towerFeedback.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span className="font-bold text-sm">{towerFeedback.message}</span>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={nextTowerQuestion}
                      className="px-4 py-2 rounded-xl font-bold bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      Câu tiếp theo <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
