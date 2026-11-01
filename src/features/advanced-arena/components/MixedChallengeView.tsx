import React, { useEffect } from 'react';
import { useAdvancedArenaStore } from '../useAdvancedArenaStore';
import type { AdaptiveChallengeMode } from '../services/arenaAdaptiveEngine';
import {
  Sparkles,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Filter,
  Check,
  Flame,
} from 'lucide-react';

export const MixedChallengeView: React.FC = () => {
  const {
    mixedLength,
    isTimed,
    timeRemainingSeconds,
    mixedQuestions,
    mixedCurrentIndex,
    mixedScore,
    mixedFeedback,
    mixedSessionFinished,
    startMixedSession,
    answerMixedQuestion,
    nextMixedQuestion,
    tickTimer,
    adaptiveMode,
    setAdaptiveMode,
  } = useAdvancedArenaStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimed && !mixedSessionFinished && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimed, mixedSessionFinished, timeRemainingSeconds, tickTimer]);

  const currentQuestion = mixedQuestions[mixedCurrentIndex];
  const progressPercent = Math.round(((mixedCurrentIndex + 1) / mixedQuestions.length) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const modeOptions: { id: AdaptiveChallengeMode; label: string; desc: string }[] = [
    { id: 'recommended', label: '🌟 AI Gợi Ý', desc: 'Cân đối kỹ năng yếu và ôn tập' },
    { id: 'weakness_training', label: '🎯 Khắc Phục Điểm Yếu', desc: 'Tập trung chủ đề cần rèn luyện' },
    { id: 'mixed_review', label: '🎲 Trộn Toàn Diện', desc: 'Trộn đều tất cả 9 vương quốc' },
    { id: 'master_challenge', label: '⚡ Thử Thách Bậc Thầy', desc: 'Độ khó nâng cao & câu hỏi đa bước' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-amber-600 via-yellow-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            Thử Thách Toán Tổng Hợp Đa Chủ Đề
          </h2>
          <p className="text-amber-100 text-sm mt-1">
            Hợp nhất toàn bộ kiến thức 7 vương quốc: Số học, Phép tính, Hình học, Đo lường, Thời gian, Tiền tệ & Phân số.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-3">
          {isTimed && (
            <div className="bg-black/30 border border-white/20 px-4 py-2 rounded-xl text-center flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="font-mono font-bold text-lg text-yellow-300">
                {formatTime(timeRemainingSeconds)}
              </span>
            </div>
          )}
          <div className="bg-black/30 border border-white/20 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-amber-200 block uppercase font-bold">Điểm số</span>
            <span className="text-xl font-black text-white font-mono">{mixedScore} đ</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Length, Timer Toggle, Mode Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Session length selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Số lượng:</span>
          {([10, 20, 30] as const).map((len) => (
            <button
              key={len}
              onClick={() => startMixedSession(len, isTimed)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                mixedLength === len
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {len} câu
            </button>
          ))}
        </div>

        {/* Timer toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Đồng hồ:</span>
          <button
            onClick={() => startMixedSession(mixedLength, !isTimed)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              isTimed
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {isTimed ? 'Có giới hạn giờ' : 'Thong thả không giới hạn'}
          </button>
        </div>

        {/* Adaptive mode selector */}
        <div className="flex flex-wrap gap-2">
          {modeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setAdaptiveMode(opt.id);
                startMixedSession(mixedLength, isTimed);
              }}
              title={opt.desc}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                adaptiveMode === opt.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Arena or Finished Scorecard */}
      {mixedSessionFinished ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl space-y-4">
          <div className="w-20 h-20 rounded-full bg-yellow-500/20 border-2 border-yellow-400 text-yellow-400 mx-auto flex items-center justify-center text-4xl shadow-xl">
            🏆
          </div>
          <h3 className="text-2xl font-black text-yellow-300">
            HOÀN THÀNH LƯỢT THI ĐẤU TỔNG HỢP!
          </h3>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Tony đã vượt qua {mixedQuestions.length} câu hỏi trộn liên chủ đề với tổng điểm{' '}
            <strong className="text-amber-400 font-mono text-base">{mixedScore} điểm</strong>!
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => startMixedSession(mixedLength, isTimed)}
              className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
            >
              <RotateCcw className="w-4 h-4" /> Bắt đầu lượt mới
            </button>
          </div>
        </div>
      ) : currentQuestion ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          {/* Header: Topic tag, question index & progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
                Câu {mixedCurrentIndex + 1}/{mixedQuestions.length} • {currentQuestion.subSkillVi}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Title & Prompt */}
          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/70">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1">
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
                onClick={() => answerMixedQuestion(idx)}
                className="p-4 rounded-xl text-left font-bold text-slate-100 bg-slate-800 hover:bg-amber-600/30 border border-slate-700 hover:border-amber-500 transition-all duration-150 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm group-hover:text-yellow-300 transition-colors">
                    {opt}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-amber-400 transition-opacity" />
              </button>
            ))}
          </div>

          {/* Feedback & Diagnostics */}
          {mixedFeedback && (
            <div
              className={`p-4 rounded-xl border flex flex-col gap-3 ${
                mixedFeedback.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {mixedFeedback.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                <span className="font-bold text-base">{mixedFeedback.message}</span>
              </div>

              {mixedFeedback.diagnostic && (
                <div className="bg-black/30 p-3 rounded-lg border border-white/10 text-xs space-y-1">
                  <span className="font-bold text-yellow-300 block">
                    💡 Hướng dẫn tư duy:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {mixedFeedback.diagnostic.remediationAdviceVi}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={nextMixedQuestion}
                  className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
                >
                  Câu tiếp theo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
