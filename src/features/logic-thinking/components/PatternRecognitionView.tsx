import React from 'react';
import { useLogicThinkingStore } from '../useLogicThinkingStore';
import { PATTERN_TASKS_CATALOG } from '../data/patternTasksCatalog';

export const PatternRecognitionView: React.FC = () => {
  const { currentGrade, patternIndex, answerTask, nextPatternTask, taskFeedback } =
    useLogicThinkingStore();

  const tasks = PATTERN_TASKS_CATALOG.filter((t) => t.gradeLevel === currentGrade);
  const task = tasks[patternIndex % tasks.length];

  if (!task) {
    return <div className="p-8 text-center text-gray-500">Đang tải câu đố quy luật...</div>;
  }

  const renderShapeIcon = (shapeType?: string, color?: string, rotation?: number) => {
    const rotStyle = rotation ? { transform: `rotate(${rotation}deg)` } : {};
    const fill = color || '#3B82F6';

    switch (shapeType) {
      case 'circle':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" style={rotStyle}>
            <circle cx="20" cy="20" r="16" fill={fill} />
          </svg>
        );
      case 'square':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" style={rotStyle}>
            <rect x="6" y="6" width="28" height="28" rx="4" fill={fill} />
          </svg>
        );
      case 'triangle':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" style={rotStyle}>
            <polygon points="20,6 34,34 6,34" fill={fill} />
          </svg>
        );
      case 'diamond':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" style={rotStyle}>
            <polygon points="20,4 36,20 20,36 4,20" fill={fill} />
          </svg>
        );
      case 'star':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" style={rotStyle}>
            <polygon
              points="20,4 24,14 36,15 26,23 30,34 20,28 10,34 14,23 4,15 16,14"
              fill={fill}
            />
          </svg>
        );
      case 'hexagon':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" style={rotStyle}>
            <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" fill={fill} />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
            🔮 Nhận Diện Quy Luật • {currentGrade === 'grade-2' ? 'Lớp 2' : 'Lớp 3'}
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">{task.titleVi}</h2>
        </div>
        <div className="text-sm font-semibold text-gray-500">
          Câu {patternIndex + 1} / {tasks.length}
        </div>
      </div>

      {/* Prompt */}
      <div className="bg-indigo-50/70 p-4 rounded-xl text-indigo-950 font-medium mb-6 flex items-start gap-3">
        <span className="text-2xl">🧐</span>
        <div>{task.promptVi}</div>
      </div>

      {/* Visual Sequence Display */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl mb-8 flex flex-wrap items-center justify-center gap-3 md:gap-4 shadow-inner min-h-[120px]">
        {task.sequenceElements.map((el, idx) => {
          const isMissing = idx === task.missingIndex;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                isMissing
                  ? 'w-16 h-16 md:w-20 md:h-20 border-3 border-dashed border-yellow-400 bg-yellow-500/20 text-yellow-300 font-black text-2xl shadow-lg animate-pulse'
                  : 'w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg md:text-xl shadow'
              }`}
            >
              {isMissing ? (
                <span>?</span>
              ) : el.type === 'shape' ? (
                renderShapeIcon(el.shapeType, el.color, el.rotationDeg)
              ) : (
                <span className="text-white drop-shadow">{el.value}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Rule Hint */}
      <div className="text-xs text-gray-500 italic mb-4 text-center">
        💡 Gợi ý: {task.hintVi}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {task.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => answerTask('pattern', idx)}
            disabled={taskFeedback?.isCorrect}
            className="py-4 px-6 rounded-xl font-bold text-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white border-2 border-indigo-200 text-indigo-900 transition-all duration-200 active:scale-95 shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback & Next Button */}
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
          onClick={nextPatternTask}
          className="px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition flex items-center gap-2"
        >
          Câu Đố Tiếp Theo ➔
        </button>
      </div>
    </div>
  );
};
