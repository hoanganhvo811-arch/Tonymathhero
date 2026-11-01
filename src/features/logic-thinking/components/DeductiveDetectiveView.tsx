import React, { useState } from 'react';
import { useLogicThinkingStore } from '../useLogicThinkingStore';
import { DEDUCTIVE_MYSTERY_CATALOG } from '../data/deductiveMysteryCatalog';

export const DeductiveDetectiveView: React.FC = () => {
  const { currentGrade, deductiveIndex, answerTask, nextDeductiveTask, taskFeedback } =
    useLogicThinkingStore();

  const [checkedClues, setCheckedClues] = useState<Record<number, boolean>>({});

  const tasks = DEDUCTIVE_MYSTERY_CATALOG.filter((t) => t.gradeLevel === currentGrade);
  const task = tasks[deductiveIndex % tasks.length];

  if (!task) {
    return <div className="p-8 text-center text-gray-500">Đang tải hồ sơ vụ án thám tử...</div>;
  }

  const toggleClue = (idx: number) => {
    setCheckedClues((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleNext = () => {
    setCheckedClues({});
    nextDeductiveTask();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-300">
            🕵️ Thám Tử Suy Luận Logic • {currentGrade === 'grade-2' ? 'Lớp 2' : 'Lớp 3'}
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">{task.titleVi}</h2>
        </div>
        <div className="text-sm font-semibold text-gray-500">
          Vụ Án {deductiveIndex + 1} / {tasks.length}
        </div>
      </div>

      {/* Story Scenario */}
      <div className="bg-amber-50/50 p-4 rounded-xl text-amber-950 font-medium mb-6 flex items-start gap-3 border border-amber-200/60">
        <span className="text-3xl">🔎</span>
        <div>
          <h4 className="font-bold text-amber-900 text-sm mb-1 uppercase tracking-wider">Hồ Sơ Vụ Án:</h4>
          <p className="text-gray-800 leading-relaxed">{task.storyScenarioVi}</p>
        </div>
      </div>

      {/* Entities Involved */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Các Nhân Vật / Đối Tượng Liên Quan:</h4>
        <div className="flex flex-wrap gap-3">
          {task.entities.map((ent, i) => (
            <div
              key={i}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <span className="text-xl">{ent.icon}</span>
              <span className="font-bold text-gray-800 text-sm">{ent.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clues Notebook */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 p-5 rounded-2xl border-2 border-amber-200 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-2">
            <span>📋</span> Sổ Tay Manh Mối (Bấm để đánh dấu dữ kiện đã dùng):
          </h4>
          <span className="text-[11px] text-amber-700 font-semibold italic">
            Phương pháp loại trừ thông minh
          </span>
        </div>
        <div className="space-y-2">
          {task.clues.map((clue, idx) => {
            const isChecked = !!checkedClues[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleClue(idx)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 select-none ${
                  isChecked
                    ? 'bg-amber-100/60 border-amber-300 text-amber-800 line-through opacity-75'
                    : 'bg-white border-amber-200 text-gray-800 shadow-sm hover:border-amber-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md border flex items-center justify-center font-bold text-xs ${
                    isChecked
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'border-amber-300 text-transparent'
                  }`}
                >
                  ✓
                </div>
                <span className="text-sm font-medium">{clue}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question */}
      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 text-indigo-950 font-bold mb-6 flex items-center gap-3">
        <span className="text-2xl">❓</span>
        <span className="text-lg">{task.questionVi}</span>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {task.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => answerTask('deductive', idx)}
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
          onClick={handleNext}
          className="px-6 py-3 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transition flex items-center gap-2"
        >
          Vụ Án Tiếp Theo ➔
        </button>
      </div>
    </div>
  );
};
