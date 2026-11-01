import React from 'react';
import { useLogicThinkingStore } from '../useLogicThinkingStore';
import { NUMBER_CODE_CATALOG } from '../data/numberCodeCatalog';

export const NumberCodeCipherView: React.FC = () => {
  const {
    currentGrade,
    currentCodeIndex,
    codeEnteredDigits,
    codeGuessFeedback,
    setCodeDigit,
    verifyCodeGuess,
    selectCodeDirectOption,
    nextCodeLevel,
  } = useLogicThinkingStore();

  const levels = NUMBER_CODE_CATALOG.filter((l) => l.gradeLevel === currentGrade);
  const activeLevel = levels[currentCodeIndex % levels.length];

  if (!activeLevel) {
    return <div className="p-8 text-center text-gray-500">Đang tải mật mã số học...</div>;
  }

  const handleDigitChange = (idx: number, delta: number) => {
    const curVal = parseInt(codeEnteredDigits[idx] || '0', 10);
    const nextVal = (curVal + delta + 10) % 10;
    setCodeDigit(idx, nextVal.toString());
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
            🔐 Bẻ Khóa Mật Mã Số • {currentGrade === 'grade-2' ? '2 Chữ Số' : '3 Chữ Số'}
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">{activeLevel.titleVi}</h2>
        </div>
        <div className="text-sm font-semibold text-gray-500">
          Cấp Độ {currentCodeIndex + 1} / {levels.length}
        </div>
      </div>

      {/* Clues Table */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl mb-6 shadow-md">
        <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>📜</span> Dữ Kiện Mật Mã Được Cung Cấp:
        </h4>
        <div className="space-y-2.5">
          {activeLevel.clues.map((clue, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-purple-600/40 border border-purple-400 text-purple-200 font-mono font-bold text-lg rounded-lg">
                  {clue.guess}
                </span>
                <span className="text-sm text-gray-200 font-medium">{clue.clueTextVi}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1 text-emerald-400">
                  🟢 Đúng vị trí: {clue.correctWellPlaced}
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  🟡 Sai vị trí: {clue.correctWrongPlace}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Tumbler Wheels */}
      <div className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 border-2 border-purple-200 rounded-2xl mb-6 flex flex-col items-center">
        <span className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-4">
          Bánh Răng Khóa Mã Số (Bấm nút +/- để xoay số):
        </span>
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-6">
          {Array.from({ length: activeLevel.digitCount }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleDigitChange(idx, 1)}
                className="w-12 h-10 bg-purple-200 hover:bg-purple-300 active:scale-95 text-purple-900 rounded-t-xl font-black text-lg transition flex items-center justify-center shadow"
              >
                ▲
              </button>
              <div className="w-16 h-20 md:w-20 md:h-24 bg-slate-900 border-4 border-purple-400 rounded-xl shadow-2xl flex items-center justify-center font-mono font-black text-3xl md:text-4xl text-yellow-300">
                {codeEnteredDigits[idx] || '0'}
              </div>
              <button
                onClick={() => handleDigitChange(idx, -1)}
                className="w-12 h-10 bg-purple-200 hover:bg-purple-300 active:scale-95 text-purple-900 rounded-b-xl font-black text-lg transition flex items-center justify-center shadow"
              >
                ▼
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={verifyCodeGuess}
          className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-lg rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <span>🔓</span> Thử Bẻ Khóa Mã Số!
        </button>
      </div>

      {/* Or Select Fast Option */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2 text-center">
          Hoặc chọn nhanh đáp án suy luận của Tony:
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {activeLevel.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectCodeDirectOption(i)}
              className="py-3 px-4 bg-purple-50 hover:bg-purple-600 hover:text-white border border-purple-200 text-purple-900 font-mono font-black text-xl rounded-xl transition shadow active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Guess Feedback */}
      {codeGuessFeedback && (
        <div
          className={`p-5 rounded-2xl mb-6 border-2 transition-all duration-300 ${
            codeGuessFeedback.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-md animate-bounce'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="font-extrabold text-lg mb-1">{codeGuessFeedback.message}</div>
          {codeGuessFeedback.isCorrect && (
            <div className="text-sm mt-2 opacity-90">{activeLevel.explanationVi}</div>
          )}
        </div>
      )}

      {/* Next Level Button */}
      <div className="flex justify-end">
        <button
          onClick={nextCodeLevel}
          className="px-6 py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition flex items-center gap-2"
        >
          Mật Mã Tiếp Theo ➔
        </button>
      </div>
    </div>
  );
};
