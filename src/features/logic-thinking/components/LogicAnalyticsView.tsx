import React from 'react';
import { useLogicThinkingStore } from '../useLogicThinkingStore';
import { LogicAdaptiveEngine } from '../services/logicAdaptiveEngine';
import { LOGIC_ACHIEVEMENTS_CATALOG } from '../data/logicAchievementsCatalog';

export const LogicAnalyticsView: React.FC = () => {
  const { attempts, progress } = useLogicThinkingStore();

  const breakdowns = LogicAdaptiveEngine.computeSkillBreakdowns(attempts);
  const advice = LogicAdaptiveEngine.generateAdvice(breakdowns);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-100 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b pb-4">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-slate-100 text-slate-800 rounded-full border border-slate-200">
          📊 BÁO CÁO NĂNG LỰC TƯ DUY & LOGIC
        </span>
        <h2 className="text-2xl font-black text-gray-900 mt-2">
          Hồ Sơ Năng Lực Trí Tuệ Của Tony
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Theo dõi mức độ thành thạo 7 nhóm năng lực tư duy toán học và giải quyết vấn đề.
        </p>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-center shadow-sm">
          <div className="text-2xl mb-1">🧩</div>
          <div className="text-2xl font-black text-indigo-900">{progress.totalPuzzlesSolved}</div>
          <span className="text-xs font-bold text-indigo-700 uppercase">Câu Đố Đã Giải</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center shadow-sm">
          <div className="text-2xl mb-1">🧭</div>
          <div className="text-2xl font-black text-emerald-900">{progress.clearedMazeLevels.length}</div>
          <span className="text-xs font-bold text-emerald-700 uppercase">Mê Cung Vượt Qua</span>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-center shadow-sm">
          <div className="text-2xl mb-1">🔐</div>
          <div className="text-2xl font-black text-purple-900">{progress.crackedCodes.length}</div>
          <span className="text-xs font-bold text-purple-700 uppercase">Mật Mã Đã Bẻ</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center shadow-sm">
          <div className="text-2xl mb-1">🦁</div>
          <div className="text-2xl font-black text-amber-900">{progress.bossDefeatedPhases.length}/3</div>
          <span className="text-xs font-bold text-amber-700 uppercase">Giai Đoạn Boss</span>
        </div>
      </div>

      {/* 7 Competencies Breakdown */}
      <div>
        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
          <span>🎯</span> Chi Tiết 7 Kỹ Năng Tư Duy & Logic:
        </h3>
        <div className="space-y-4">
          {breakdowns.map((skill) => (
            <div
              key={skill.skillId}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white transition shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{skill.nameVi}</span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      skill.status === 'mastered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : skill.status === 'struggling'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {skill.status === 'mastered'
                      ? 'Thành Thạo'
                      : skill.status === 'struggling'
                      ? 'Cần Luyện Thêm'
                      : 'Đang Rèn Luyện'}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-gray-700">
                  {skill.correct}/{skill.attempts} đúng ({skill.score}%)
                </div>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    skill.status === 'mastered'
                      ? 'bg-emerald-500'
                      : skill.status === 'struggling'
                      ? 'bg-rose-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.max(5, skill.score)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Advice */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl">
        <h4 className="font-black text-blue-900 text-sm mb-3 flex items-center gap-2">
          <span>💡</span> Lời Khuyên Cá Nhân Hóa Dành Cho Tony:
        </h4>
        <ul className="space-y-2">
          {advice.map((item, idx) => (
            <li
              key={idx}
              className="text-sm font-medium text-blue-950 flex items-start gap-2 bg-white/70 p-2.5 rounded-lg border border-blue-100 shadow-sm"
            >
              <span className="text-blue-600 font-bold">★</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Achievements Showcase */}
      <div>
        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
          <span>🏆</span> Huy Hiệu Trí Tuệ & Thành Tựu:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LOGIC_ACHIEVEMENTS_CATALOG.map((ach) => {
            const isUnlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border-2 flex items-center gap-4 transition ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 shadow-md'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0 ${
                    isUnlocked ? 'bg-amber-100 border border-amber-300' : 'bg-gray-200'
                  }`}
                >
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-extrabold text-sm text-gray-900 truncate">
                      {ach.titleVi}
                    </h5>
                    {isUnlocked && (
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                        ĐÃ MỞ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {ach.descriptionVi}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] font-bold text-amber-800">
                    <span>✨ +{ach.xpReward} XP</span>
                    <span>🪙 +{ach.goldReward} Vàng</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
