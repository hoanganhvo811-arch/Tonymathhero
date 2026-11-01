import React from 'react';
import { useLogicThinkingStore } from '../useLogicThinkingStore';
import { SHAPE_LOGIC_CATALOG } from '../data/shapeLogicCatalog';

export const ShapeLogicView: React.FC = () => {
  const { currentGrade, shapeLogicIndex, answerTask, nextShapeLogicTask, taskFeedback } =
    useLogicThinkingStore();

  const tasks = SHAPE_LOGIC_CATALOG.filter((t) => t.gradeLevel === currentGrade);
  const task = tasks[shapeLogicIndex % tasks.length];

  if (!task) {
    return <div className="p-8 text-center text-gray-500">Đang tải câu đố logic hình học...</div>;
  }

  const renderSvgElement = (shapeType: string, color: string, rotationDeg?: number) => {
    const rotStyle = rotationDeg ? { transform: `rotate(${rotationDeg}deg)` } : {};
    const fill = color || '#0EA5E9';

    switch (shapeType) {
      case 'circle':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" style={rotStyle}>
            <circle cx="30" cy="30" r="24" fill={fill} stroke="#ffffff" strokeWidth="2" />
          </svg>
        );
      case 'square':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" style={rotStyle}>
            <rect x="10" y="10" width="40" height="40" rx="6" fill={fill} stroke="#ffffff" strokeWidth="2" />
          </svg>
        );
      case 'triangle':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" style={rotStyle}>
            <polygon points="30,8 52,50 8,50" fill={fill} stroke="#ffffff" strokeWidth="2" />
          </svg>
        );
      case 'diamond':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" style={rotStyle}>
            <polygon points="30,6 54,30 30,54 6,30" fill={fill} stroke="#ffffff" strokeWidth="2" />
          </svg>
        );
      case 'star':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" style={rotStyle}>
            <polygon
              points="30,6 36,21 54,23 39,35 45,51 30,42 15,51 21,35 6,23 24,21"
              fill={fill}
              stroke="#ffffff"
              strokeWidth="2"
            />
          </svg>
        );
      case 'hexagon':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" style={rotStyle}>
            <polygon points="30,6 51,18 51,42 30,54 9,42 9,18" fill={fill} stroke="#ffffff" strokeWidth="2" />
          </svg>
        );
      default:
        return <div className="text-3xl">🧩</div>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-sky-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-sky-50 text-sky-700 rounded-full border border-sky-200">
            🧩 Logic Hình Học & Không Gian • {currentGrade === 'grade-2' ? 'Lớp 2' : 'Lớp 3'}
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">{task.titleVi}</h2>
        </div>
        <div className="text-sm font-semibold text-gray-500">
          Câu {shapeLogicIndex + 1} / {tasks.length}
        </div>
      </div>

      {/* Prompt */}
      <div className="bg-sky-50/70 p-4 rounded-xl text-sky-950 font-medium mb-6 flex items-start gap-3">
        <span className="text-2xl">📐</span>
        <div>{task.promptVi}</div>
      </div>

      {/* Visual Shapes Showcase */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-6 rounded-2xl mb-6 flex flex-wrap items-center justify-center gap-6 shadow-inner">
        {task.shapesData.map((item, i) => (
          <div
            key={item.id || i}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 shadow-md min-w-[80px]"
          >
            {renderSvgElement(item.svgType, item.color, item.rotationDeg)}
            {item.label && (
              <span className="text-xs font-bold text-sky-200 mt-2">{item.label}</span>
            )}
            {item.specialFeature && (
              <span className="text-[10px] text-gray-300 italic">{item.specialFeature}</span>
            )}
          </div>
        ))}
      </div>

      {/* Hint */}
      <div className="text-xs text-gray-500 italic mb-4 text-center">
        💡 Gợi ý hình học: {task.hintVi}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {task.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => answerTask('shape_logic', idx)}
            disabled={taskFeedback?.isCorrect}
            className="py-4 px-6 rounded-xl font-bold text-lg bg-sky-50 hover:bg-sky-600 hover:text-white border-2 border-sky-200 text-sky-900 transition-all duration-200 active:scale-95 shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
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
          onClick={nextShapeLogicTask}
          className="px-6 py-3 rounded-xl font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md hover:shadow-lg transition flex items-center gap-2"
        >
          Câu Đố Tiếp Theo ➔
        </button>
      </div>
    </div>
  );
};
