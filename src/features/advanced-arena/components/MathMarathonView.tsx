import React from 'react';
import { useAdvancedArenaStore } from '../useAdvancedArenaStore';
import { MARATHON_CHECKPOINTS } from '../data/marathonCatalog';
import {
  Flame,
  Trophy,
  Flag,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
} from 'lucide-react';

export const MathMarathonView: React.FC = () => {
  const {
    marathonQuestions,
    marathonCurrentIndex,
    marathonStreak,
    marathonMaxStreak,
    marathonCheckpointsReached,
    marathonFinished,
    marathonFeedback,
    answerMarathonQuestion,
    nextMarathonQuestion,
    startMarathon,
  } = useAdvancedArenaStore();

  const currentQuestion = marathonQuestions[marathonCurrentIndex];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-red-600 via-orange-600 to-amber-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Flame className="w-6 h-6 text-yellow-300 animate-bounce" />
            Đường Đua Toán Học (Math Marathon)
          </h2>
          <p className="text-orange-100 text-sm mt-1">
            Chạy đua bền bỉ qua chuỗi câu hỏi liên hoàn! Mỗi câu trả lời đúng giúp Tony tiến thêm 1 bước và chinh phục các trạm tiếp sức Checkpoint!
          </p>
        </div>

        {/* Streaks & Records */}
        <div className="flex items-center gap-3">
          <div className="bg-black/30 border border-white/20 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-orange-200 block uppercase font-bold">Chuỗi đúng hiện tại</span>
            <span className="text-xl font-black text-yellow-300 font-mono">
              🔥 x{marathonStreak}
            </span>
          </div>
          <div className="bg-black/30 border border-white/20 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-orange-200 block uppercase font-bold">Kỷ lục chuỗi cao nhất</span>
            <span className="text-xl font-black text-white font-mono">
              🏆 {marathonMaxStreak}
            </span>
          </div>
        </div>
      </div>

      {/* Marathon Track & Checkpoints Milestones Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <Flag className="w-4 h-4 text-amber-400" />
            Các trạm tiếp sức (Checkpoints):
          </span>
          <span className="text-xs text-amber-300 font-bold">
            Đã đạt: {marathonCheckpointsReached.length}/{MARATHON_CHECKPOINTS.length} Trạm
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {MARATHON_CHECKPOINTS.map((cp) => {
            const isReached = marathonCheckpointsReached.includes(cp.checkpointIndex);
            const isNext = !isReached && marathonStreak < cp.questionThreshold;

            return (
              <div
                key={cp.checkpointIndex}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                  isReached
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md scale-105'
                    : isNext
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <span className="text-lg mb-1">{isReached ? '🏆' : '🚩'}</span>
                <span className="text-[11px] font-black">{cp.questionThreshold} câu đúng</span>
                <span className="text-[9px] text-amber-400 font-mono mt-0.5">
                  +{cp.rewardGold} Vàng
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Question Arena or Finished Screen */}
      {marathonFinished ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl space-y-4">
          <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-400 text-orange-400 mx-auto flex items-center justify-center text-4xl shadow-xl">
            🏃
          </div>
          <h3 className="text-2xl font-black text-orange-300">
            HOÀN THÀNH CHẶNG ĐUA MARATHON!
          </h3>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Tony đã hoàn thành tất cả câu hỏi trên đường đua marathon với chuỗi kỷ lục{' '}
            <strong className="text-yellow-400 font-mono text-base">{marathonMaxStreak} câu đúng liên tiếp</strong>!
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={startMarathon}
              className="px-6 py-2.5 rounded-xl font-bold bg-orange-500 hover:bg-orange-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
            >
              <RotateCcw className="w-4 h-4" /> Chạy lại đường đua mới
            </button>
          </div>
        </div>
      ) : currentQuestion ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-3 py-1 rounded-full border border-orange-800">
              Đường đua: Câu {marathonCurrentIndex + 1}/{marathonQuestions.length} • {currentQuestion.subSkillVi}
            </span>
            <span className="text-xs text-yellow-400 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-yellow-400" /> Chuỗi: {marathonStreak}
            </span>
          </div>

          {/* Question Prompt */}
          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80">
            <h4 className="text-xs font-bold text-orange-300 uppercase tracking-wide mb-1">
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
                onClick={() => answerMarathonQuestion(idx)}
                className="p-4 rounded-xl text-left font-bold text-slate-100 bg-slate-800 hover:bg-orange-600/30 border border-slate-700 hover:border-orange-500 transition-all duration-150 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm group-hover:text-yellow-300 transition-colors">
                    {opt}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-orange-400 transition-opacity" />
              </button>
            ))}
          </div>

          {/* Feedback */}
          {marathonFeedback && (
            <div
              className={`p-4 rounded-xl border flex flex-col gap-3 ${
                marathonFeedback.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {marathonFeedback.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                <span className="font-bold text-base">{marathonFeedback.message}</span>
              </div>

              {marathonFeedback.checkpointAwarded && (
                <div className="bg-amber-500/20 p-3 rounded-lg border border-amber-400/40 text-xs font-bold text-yellow-300 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400 shrink-0" />
                  <span>{marathonFeedback.checkpointAwarded}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={nextMarathonQuestion}
                  className="px-5 py-2.5 rounded-xl font-bold bg-orange-500 hover:bg-orange-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
                >
                  Tiếp tục đường đua <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
