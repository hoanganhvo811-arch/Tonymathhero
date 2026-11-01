import React from 'react';
import { useMoneyShoppingStore } from '../useMoneyShoppingStore';
import { getBillsByGrade } from '../data/currencyCatalog';
import { CurrencyBillCard } from './CurrencyBillCard';
import { Sparkles, HelpCircle, ArrowRight, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';

export const MoneyRecognitionView: React.FC = () => {
  const {
    campaignId,
    activeRecognitionTask,
    selectedBillDetail,
    selectBillDetail,
    answerRecognitionTask,
    nextRecognitionTask,
    recognitionFeedback,
  } = useMoneyShoppingStore();

  const gradeLevel = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
  const availableBills = getBillsByGrade(gradeLevel);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-amber-600 to-yellow-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            Nhận Biết Mệnh Giá Tiền Việt Nam
          </h2>
          <p className="text-amber-100 text-sm mt-1">
            {gradeLevel === 'grade-2'
              ? 'Lớp 2: Làm quen với các mệnh giá từ 100đ đến 10.000đ (tiền giấy cotton và polymer 10k).'
              : 'Lớp 3: Mở rộng nhận biết các tờ polymer giá trị cao 20.000đ, 50.000đ và 100.000đ.'}
          </p>
        </div>
        <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/20">
          <span className="text-xs text-amber-200 uppercase font-bold tracking-wider block">
            Cấp độ hiện tại
          </span>
          <span className="text-lg font-black text-yellow-300">
            {gradeLevel === 'grade-2' ? 'Lớp 2 (<= 10.000đ)' : 'Lớp 3 (<= 100.000đ)'}
          </span>
        </div>
      </div>

      {/* Bill Showcase & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bill Gallery */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-lg font-bold text-slate-100 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-yellow-400" />
            Bảng Trưng Bày Tiền Tệ (Nhấn để xem chi tiết)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {availableBills.map((bill) => (
              <CurrencyBillCard
                key={bill.denomination}
                bill={bill}
                size="md"
                selected={selectedBillDetail?.denomination === bill.denomination}
                onClick={() => selectBillDetail(bill)}
              />
            ))}
          </div>
        </div>

        {/* Detail Inspection Card */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-amber-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Chi Tiết Mệnh Giá
            </h3>
            {selectedBillDetail ? (
              <div className="space-y-4">
                <div className="flex justify-center py-2">
                  <CurrencyBillCard bill={selectedBillDetail} size="lg" interactive={false} />
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Mệnh giá:</span>
                    <span className="font-bold text-yellow-400 text-base">
                      {selectedBillDetail.labelVi}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Chất liệu:</span>
                    <span className="font-semibold text-slate-200">
                      {selectedBillDetail.material === 'polymer' ? 'Nhựa Polymer cao cấp' : 'Giấy sợi Cotton'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Phù hợp:</span>
                    <span className="font-semibold text-sky-400">
                      {selectedBillDetail.gradeLevel === 'grade-2' ? 'Lớp 2 & Lớp 3' : 'Mở rộng Lớp 3'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-lg border border-slate-800">
                  {selectedBillDetail.descriptionVi}
                </p>
                <div className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/50 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{selectedBillDetail.featureHintVi}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic">
                Hãy nhấn vào một tờ tiền bên cạnh để khám phá đặc điểm!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Recognition Quest / Quiz */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
              Nhiệm vụ nhận diện
            </span>
            <h3 className="text-xl font-black text-white mt-2">
              {activeRecognitionTask.titleVi}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Kỹ năng mục tiêu</span>
            <span className="text-sm font-semibold text-emerald-400">
              Nhận biết & phân biệt tiền
            </span>
          </div>
        </div>

        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 mb-6">
          <p className="text-lg text-slate-100 font-medium leading-relaxed">
            {activeRecognitionTask.promptVi}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {activeRecognitionTask.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => answerRecognitionTask(idx)}
              className="p-4 rounded-xl text-left font-bold text-slate-100 bg-slate-800 hover:bg-amber-600/30 border border-slate-700 hover:border-amber-500 transition-all duration-150 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-base group-hover:text-yellow-300 transition-colors">
                  {opt}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-yellow-400 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Feedback & Diagnostics */}
        {recognitionFeedback && (
          <div
            className={`p-4 rounded-xl border flex flex-col gap-3 ${
              recognitionFeedback.isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {recognitionFeedback.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
              )}
              <span className="font-bold text-base">{recognitionFeedback.message}</span>
            </div>

            {recognitionFeedback.diagnostic && (
              <div className="bg-black/30 p-3 rounded-lg border border-white/10 text-xs space-y-1">
                <span className="font-bold text-yellow-300 block">
                  💡 Gợi ý tư duy từ Giáo Sư Math:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {recognitionFeedback.diagnostic.remediationAdviceVi}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={nextRecognitionTask}
                className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                Câu tiếp theo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
