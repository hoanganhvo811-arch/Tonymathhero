import React from 'react';
import { useMoneyShoppingStore } from '../useMoneyShoppingStore';
import { formatVnd } from '../data/currencyCatalog';
import {
  Scale,
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';

export const BudgetChallengeView: React.FC = () => {
  const {
    activeBudgetTask,
    budgetFeedback,
    answerBudgetTask,
    nextBudgetTask,
  } = useMoneyShoppingStore();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-purple-700 via-indigo-700 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Scale className="w-6 h-6 text-purple-300" />
            Thử Thách Quản Lý Ngân Sách – Người Tiêu Dùng Thông Thái
          </h2>
          <p className="text-purple-200 text-sm mt-1">
            Cân đối chi tiêu, không để bị vượt quá ngân sách và tìm ra những giải pháp mua sắm tối ưu nhất!
          </p>
        </div>
        <div className="bg-purple-950/60 border border-purple-400/30 px-5 py-3 rounded-xl text-center shrink-0">
          <span className="text-xs text-purple-300 uppercase font-bold tracking-wider block">
            Ngân sách được cấp
          </span>
          <span className="text-2xl font-black text-yellow-300 font-mono">
            {formatVnd(activeBudgetTask.initialBudget)}
          </span>
        </div>
      </div>

      {/* Main Quest Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800">
              Tình huống ngân sách
            </span>
            <h3 className="text-xl font-black text-white mt-2">
              {activeBudgetTask.titleVi}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Wallet className="w-4 h-4 text-amber-400" />
            <span>Ngân sách: </span>
            <strong className="text-amber-300 font-mono">
              {formatVnd(activeBudgetTask.initialBudget)}
            </strong>
          </div>
        </div>

        {/* Story Scenario */}
        <div className="bg-purple-950/20 border border-purple-800/40 p-4 rounded-xl mb-4">
          <p className="text-sm text-purple-200 leading-relaxed font-medium">
            📖 <strong>Bối cảnh:</strong> {activeBudgetTask.scenarioVi}
          </p>
        </div>

        {/* Available Items Preview */}
        {activeBudgetTask.availableItems && activeBudgetTask.availableItems.length > 0 && (
          <div className="mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">
              Các món đồ liên quan:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeBudgetTask.availableItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-200 truncate">
                      {item.nameVi}
                    </p>
                    <p className="text-xs text-amber-400 font-mono font-black">
                      {formatVnd(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question Prompt */}
        <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700 mb-6">
          <p className="text-base text-slate-100 font-semibold leading-relaxed">
            ❓ {activeBudgetTask.promptVi}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {activeBudgetTask.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => answerBudgetTask(idx)}
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

        {/* Feedback & Diagnostics */}
        {budgetFeedback && (
          <div
            className={`p-4 rounded-xl border flex flex-col gap-3 ${
              budgetFeedback.isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {budgetFeedback.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              )}
              <span className="font-bold text-base">{budgetFeedback.message}</span>
            </div>

            {budgetFeedback.diagnostic && (
              <div className="bg-black/30 p-3 rounded-lg border border-white/10 text-xs space-y-1">
                <span className="font-bold text-yellow-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  Mẹo Quản Lý Chi Tiêu:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {budgetFeedback.diagnostic.remediationAdviceVi}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={nextBudgetTask}
                className="px-5 py-2.5 rounded-xl font-bold bg-purple-500 hover:bg-purple-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                Tình huống tiếp theo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
