import React from 'react';
import { useMoneyShoppingStore } from '../useMoneyShoppingStore';
import { getBillsByGrade, formatVnd } from '../data/currencyCatalog';
import { CurrencyBillCard } from './CurrencyBillCard';
import type { MoneyDenomination } from '@/types/moneyShopping';
import {
  Calculator,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

export const MoneyCountingView: React.FC = () => {
  const {
    campaignId,
    activeCountingTask,
    tableBills,
    addBillToTable,
    removeBillFromTable,
    clearTable,
    getTableTotal,
    answerCountingTask,
    verifyTableAmount,
    nextCountingTask,
    countingFeedback,
  } = useMoneyShoppingStore();

  const gradeLevel = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
  const availableBills = getBillsByGrade(gradeLevel);
  const currentTableTotal = getTableTotal();

  const isMakeAmountTask = activeCountingTask.taskType === 'make_amount';

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Calculator className="w-6 h-6 text-emerald-300" />
            Bàn Đếm Tiền & Đổi Mệnh Giá
          </h2>
          <p className="text-emerald-100 text-sm mt-1">
            Đặt các tờ tiền lên bàn tính, đếm tổng giá trị và tìm các cách phối hợp mệnh giá phong phú!
          </p>
        </div>
        <div className="bg-black/25 backdrop-blur-md px-5 py-2.5 rounded-xl text-center border border-white/20">
          <span className="text-xs text-emerald-200 uppercase font-bold tracking-wider block">
            Tổng tiền trên bàn
          </span>
          <span className="text-2xl font-black text-yellow-300 font-mono">
            {formatVnd(currentTableTotal)}
          </span>
        </div>
      </div>

      {/* Task Challenge Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
              {activeCountingTask.taskType === 'count_total' && 'Đếm tổng tiền'}
              {activeCountingTask.taskType === 'make_amount' && 'Ghép số tiền mục tiêu'}
              {activeCountingTask.taskType === 'compare_amounts' && 'So sánh số tiền'}
            </span>
            <h3 className="text-xl font-black text-white mt-2">
              {activeCountingTask.titleVi}
            </h3>
          </div>
          {activeCountingTask.targetAmount && (
            <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-right">
              <span className="text-xs text-amber-300 font-semibold block">Mục tiêu cần tạo</span>
              <span className="text-lg font-black text-yellow-400 font-mono">
                {formatVnd(activeCountingTask.targetAmount)}
              </span>
            </div>
          )}
        </div>

        <p className="text-base text-slate-100 font-medium mb-4">
          {activeCountingTask.promptVi}
        </p>

        {/* Task Visual Illustration (Bills Group Shown) */}
        {activeCountingTask.billsGroup && activeCountingTask.billsGroup.length > 0 && (
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-6">
            <span className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wide">
              {activeCountingTask.compareGroupB ? 'Xấp tiền A:' : 'Các tờ tiền được cho:'}
            </span>
            <div className="flex flex-wrap gap-3 items-center">
              {activeCountingTask.billsGroup.map((item, idx) => (
                <CurrencyBillCard
                  key={idx}
                  denomination={item.denomination}
                  count={item.count}
                  size="sm"
                  interactive={false}
                />
              ))}
            </div>

            {/* Compare Group B if present */}
            {activeCountingTask.compareGroupB && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wide">
                  Xấp tiền B:
                </span>
                <div className="flex flex-wrap gap-3 items-center">
                  {activeCountingTask.compareGroupB.map((item, idx) => (
                    <CurrencyBillCard
                      key={idx}
                      denomination={item.denomination}
                      count={item.count}
                      size="sm"
                      interactive={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interactive Counting Table for 'make_amount' */}
        {isMakeAmountTask && (
          <div className="bg-slate-950/70 p-5 rounded-xl border border-dashed border-emerald-500/40 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-slate-200 text-sm">
                  Khu Vực Bàn Tính Tương Tác
                </span>
              </div>
              <button
                onClick={clearTable}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Dọn sạch bàn
              </button>
            </div>

            {/* Placed bills on table */}
            <div className="min-h-24 p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-wrap gap-3 items-center">
              {tableBills.length === 0 ? (
                <p className="text-slate-500 text-sm italic mx-auto">
                  Chưa có tờ tiền nào trên bàn. Nhấn các tờ tiền trong ví bên dưới để thêm vào!
                </p>
              ) : (
                tableBills.map((b) => (
                  <div key={b.denomination} className="flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700">
                    <CurrencyBillCard
                      denomination={b.denomination}
                      count={b.count}
                      size="sm"
                      interactive={false}
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => addBillToTable(b.denomination)}
                        className="p-1 rounded bg-slate-700 hover:bg-emerald-600 text-white cursor-pointer"
                        title="Thêm 1 tờ"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeBillFromTable(b.denomination)}
                        className="p-1 rounded bg-slate-700 hover:bg-rose-600 text-white cursor-pointer"
                        title="Bớt 1 tờ"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tony's Wallet Bills Tray to Add */}
            <div>
              <span className="text-xs text-slate-400 font-semibold mb-2 block">
                Ví tiền của Tony (Nhấn để đặt lên bàn):
              </span>
              <div className="flex flex-wrap gap-2">
                {availableBills.map((bill) => (
                  <CurrencyBillCard
                    key={bill.denomination}
                    bill={bill}
                    size="sm"
                    onClick={() => addBillToTable(bill.denomination)}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={verifyTableAmount}
                className="px-6 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
              >
                Xác nhận số tiền trên bàn ({formatVnd(currentTableTotal)})
              </button>
            </div>
          </div>
        )}

        {/* Options for Multiple Choice tasks */}
        {activeCountingTask.options && activeCountingTask.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {activeCountingTask.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => answerCountingTask(idx)}
                className="p-4 rounded-xl text-left font-bold text-slate-100 bg-slate-800 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500 transition-all duration-150 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-base group-hover:text-emerald-300 transition-colors">
                    {opt}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
              </button>
            ))}
          </div>
        )}

        {/* Feedback & Diagnostics */}
        {countingFeedback && (
          <div
            className={`p-4 rounded-xl border flex flex-col gap-3 ${
              countingFeedback.isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {countingFeedback.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
              )}
              <span className="font-bold text-base">{countingFeedback.message}</span>
            </div>

            {countingFeedback.diagnostic && (
              <div className="bg-black/30 p-3 rounded-lg border border-white/10 text-xs space-y-1">
                <span className="font-bold text-yellow-300 block">
                  💡 Lời khuyên tính nhẩm từ Giáo Sư Math:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {countingFeedback.diagnostic.remediationAdviceVi}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={nextCountingTask}
                className="px-5 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                Bài tiếp theo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
