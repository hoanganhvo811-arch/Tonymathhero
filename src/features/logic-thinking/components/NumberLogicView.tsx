import React from 'react';
import { useLogicThinkingStore } from '../useLogicThinkingStore';
import { NUMBER_LOGIC_CATALOG } from '../data/numberLogicCatalog';

export const NumberLogicView: React.FC = () => {
  const { currentGrade, numberLogicIndex, answerTask, nextNumberLogicTask, taskFeedback } =
    useLogicThinkingStore();

  const tasks = NUMBER_LOGIC_CATALOG.filter((t) => t.gradeLevel === currentGrade);
  const task = tasks[numberLogicIndex % tasks.length];

  if (!task) {
    return <div className="p-8 text-center text-gray-500">Đang tải thử thách logic số học...</div>;
  }

  const renderVisual = () => {
    if (task.taskType === 'number_matrix' && task.visualData?.matrix) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl shadow-inner mb-6">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${task.visualData.matrix[0].length}, minmax(0, 1fr))` }}>
            {task.visualData.matrix.flat().map((val, i) => (
              <div
                key={i}
                className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-xl font-black text-xl md:text-2xl shadow ${
                  val === '?'
                    ? 'bg-amber-500/20 text-yellow-300 border-2 border-dashed border-yellow-400 animate-pulse'
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                {val}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (task.taskType === 'balance_scale') {
      return (
        <div className="p-6 bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl mb-6 flex flex-col items-center">
          <div className="text-4xl mb-3">⚖️</div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white p-4 rounded-xl border-2 border-amber-300 text-center shadow-sm">
              <span className="text-xs font-bold text-amber-700 uppercase block mb-1">Đĩa Cân Trái</span>
              <div className="font-extrabold text-gray-900 text-lg">{task.visualData?.scaleLeft}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border-2 border-amber-300 text-center shadow-sm">
              <span className="text-xs font-bold text-amber-700 uppercase block mb-1">Đĩa Cân Phải</span>
              <div className="font-extrabold text-gray-900 text-lg">{task.visualData?.scaleRight}</div>
            </div>
          </div>
          <div className="text-xs font-bold text-amber-800 mt-3">⚡ Trạng Thái Cân Bằng Hoàn Hảo ⚡</div>
        </div>
      );
    }

    if (task.taskType === 'condition_detective' && task.visualData?.conditions) {
      return (
        <div className="p-6 bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl mb-6">
          <h4 className="font-bold text-indigo-900 text-sm mb-3 flex items-center gap-2">
            <span>🔎</span> Manh Mối Thám Tử Số Học:
          </h4>
          <ul className="space-y-2">
            {task.visualData.conditions.map((cond, i) => (
              <li
                key={i}
                className="bg-white p-3 rounded-lg border border-indigo-100 text-gray-800 font-medium text-sm flex items-center gap-2 shadow-sm"
              >
                <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {cond}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // Default / magic triangle
    return (
      <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-2xl mb-6 text-center">
        <div className="text-5xl mb-2">📐</div>
        <div className="text-sm font-semibold text-purple-900">Tam Giác Thần Kỳ Phép Tính</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            ⚖️ Logic Số Học & Ma Trận • {currentGrade === 'grade-2' ? 'Lớp 2' : 'Lớp 3'}
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">{task.titleVi}</h2>
        </div>
        <div className="text-sm font-semibold text-gray-500">
          Câu {numberLogicIndex + 1} / {tasks.length}
        </div>
      </div>

      {/* Prompt */}
      <div className="bg-amber-50/60 p-4 rounded-xl text-amber-950 font-medium mb-6 flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>{task.promptVi}</div>
      </div>

      {/* Visual Component */}
      {renderVisual()}

      {/* Hint */}
      <div className="text-xs text-gray-500 italic mb-4 text-center">
        🔍 Gợi ý tư duy: {task.hintVi}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {task.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => answerTask('number_logic', idx)}
            disabled={taskFeedback?.isCorrect}
            className="py-4 px-6 rounded-xl font-bold text-lg bg-amber-50 hover:bg-amber-600 hover:text-white border-2 border-amber-200 text-amber-900 transition-all duration-200 active:scale-95 shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {taskFeedback && (
        <div
          className={`p-5 rounded-2xl mb-6 border-2 transition-all duration-300 ${
            taskFeedback.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="font-extrabold text-lg mb-1">{taskFeedback.message}</div>
          {taskFeedback.explanation && (
            <div className="text-sm mt-2 opacity-90">{taskFeedback.explanation}</div>
          )}
        </div>
      )}

      {/* Next Task Controls */}
      <div className="flex justify-end">
        <button
          onClick={nextNumberLogicTask}
          className="px-6 py-3 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transition flex items-center gap-2"
        >
          Thử Thách Tiếp Theo ➔
        </button>
      </div>
    </div>
  );
};
