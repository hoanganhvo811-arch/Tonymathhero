import React from 'react';
import { useAdvancedArenaStore } from '../useAdvancedArenaStore';
import {
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';

export const MultiStepProblemView: React.FC = () => {
  const {
    activeMultiStepQuestion,
    multiStepFeedback,
    answerMultiStep,
    nextMultiStepQuestion,
  } = useAdvancedArenaStore();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-300" />
            Bài Toán Nhiều Bước Tính (Multi-Step Problems)
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Rèn luyện khả năng lập luận qua nhiều mắt xích logic: xác định dữ kiện trung gian để tìm ra đáp số cuối cùng.
          </p>
        </div>
        <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center shrink-0">
          <span className="text-xs text-cyan-200 block uppercase font-bold">Số bước giải</span>
          <span className="text-xl font-black text-white font-mono">
            {activeMultiStepQuestion.steps?.length || 2} Bước
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800">
              {activeMultiStepQuestion.subSkillVi}
            </span>
            <h3 className="text-xl font-black text-white mt-2">
              {activeMultiStepQuestion.titleVi}
            </h3>
          </div>
        </div>

        {/* Story context & Problem prompt */}
        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80">
          <p className="text-base text-slate-100 font-medium leading-relaxed">
            {activeMultiStepQuestion.promptVi}
          </p>
        </div>

        {/* Visual Steps Breakdown Tracker */}
        {activeMultiStepQuestion.steps && activeMultiStepQuestion.steps.length > 0 && (
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
              Sơ đồ các bước tư duy:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeMultiStepQuestion.steps.map((step) => (
                <div
                  key={step.stepIndex}
                  className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/50 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {step.stepIndex}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      {step.promptVi}
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono mt-0.5 block">
                      Mục tiêu: {step.expectedResult}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeMultiStepQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => answerMultiStep(idx)}
              className="p-4 rounded-xl text-left font-bold text-slate-100 bg-slate-800 hover:bg-blue-600/30 border border-slate-700 hover:border-blue-500 transition-all duration-150 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm group-hover:text-cyan-300 transition-colors">
                  {opt}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Feedback & Diagnostics */}
        {multiStepFeedback && (
          <div
            className={`p-4 rounded-xl border flex flex-col gap-3 ${
              multiStepFeedback.isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {multiStepFeedback.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
              )}
              <span className="font-bold text-base">{multiStepFeedback.message}</span>
            </div>

            {/* Complete solution breakdown */}
            <div className="bg-black/30 p-3 rounded-lg border border-white/10 text-xs space-y-2">
              <span className="font-bold text-yellow-300 block">
                📋 Trình bày lời giải chi tiết:
              </span>
              <p className="text-slate-200 leading-relaxed">
                {activeMultiStepQuestion.explanationVi}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={nextMultiStepQuestion}
                className="px-5 py-2.5 rounded-xl font-bold bg-blue-500 hover:bg-blue-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                Bài toán tiếp theo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
