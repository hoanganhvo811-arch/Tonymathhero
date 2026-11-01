import React from 'react';
import { useAdvancedArenaStore } from '../useAdvancedArenaStore';
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Compass,
  Zap,
} from 'lucide-react';

export const StrategyChallengeView: React.FC = () => {
  const {
    activeStrategyQuestion,
    strategyFeedback,
    answerStrategy,
    nextStrategyQuestion,
  } = useAdvancedArenaStore();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Compass className="w-6 h-6 text-yellow-300" />
            Thử Thách Chiến Lược Giải Toán (Math Strategy)
          </h2>
          <p className="text-teal-100 text-sm mt-1">
            Không có con đường duy nhất trong Toán học! Khám phá nhiều phương pháp giải khác nhau: tách số, làm tròn, đảo ngược hoặc phân rã bài toán.
          </p>
        </div>
        <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center shrink-0">
          <span className="text-xs text-teal-200 block uppercase font-bold">Phương pháp tư duy</span>
          <span className="text-xl font-black text-yellow-300">Đa Chiến Lược</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 px-3 py-1 rounded-full border border-teal-800">
              {activeStrategyQuestion.subSkillVi}
            </span>
            <h3 className="text-xl font-black text-white mt-2">
              {activeStrategyQuestion.titleVi}
            </h3>
          </div>
        </div>

        {/* Problem Prompt */}
        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80">
          <p className="text-base text-slate-100 font-medium leading-relaxed">
            {activeStrategyQuestion.promptVi}
          </p>
        </div>

        {/* Alternative Strategies Showcase */}
        {activeStrategyQuestion.alternativeStrategies &&
          activeStrategyQuestion.alternativeStrategies.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Các chiến lược có thể áp dụng:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeStrategyQuestion.alternativeStrategies.map((strat, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1.5"
                  >
                    <span className="text-xs font-black text-amber-400 block">
                      Chiến lược {idx + 1}: {strat.strategyNameVi}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {strat.descriptionVi}
                    </p>
                    <div className="bg-black/40 p-2 rounded text-[11px] font-mono text-emerald-300 border border-slate-800">
                      {strat.stepsSummaryVi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeStrategyQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => answerStrategy(idx)}
              className="p-4 rounded-xl text-left font-bold text-slate-100 bg-slate-800 hover:bg-teal-600/30 border border-slate-700 hover:border-teal-500 transition-all duration-150 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-teal-500 text-white flex items-center justify-center font-bold text-sm">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm group-hover:text-teal-300 transition-colors">
                  {opt}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-teal-400 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Feedback & Diagnostics */}
        {strategyFeedback && (
          <div
            className={`p-4 rounded-xl border flex flex-col gap-3 ${
              strategyFeedback.isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {strategyFeedback.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
              )}
              <span className="font-bold text-base">{strategyFeedback.message}</span>
            </div>

            <div className="bg-black/30 p-3 rounded-lg border border-white/10 text-xs space-y-1">
              <span className="font-bold text-yellow-300 block">
                🧠 Đánh giá sư phạm từ Giáo Sư Math:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {activeStrategyQuestion.explanationVi}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={nextStrategyQuestion}
                className="px-5 py-2.5 rounded-xl font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                Thử thách tiếp theo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
