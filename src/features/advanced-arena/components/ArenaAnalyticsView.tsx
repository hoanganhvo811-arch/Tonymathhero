import React from 'react';
import { useAdvancedArenaStore } from '../useAdvancedArenaStore';
import { ArenaAdaptiveEngine } from '../services/arenaAdaptiveEngine';
import { ARENA_ACHIEVEMENTS } from '../data/arenaAchievementsCatalog';
import {
  BarChart3,
  Award,
  Flame,
  Castle,
  Target,
  Trophy,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const ArenaAnalyticsView: React.FC = () => {
  const { attempts, progress } = useAdvancedArenaStore();

  const topicMastery = ArenaAdaptiveEngine.calculateTopicMastery(attempts);

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.isSuccess).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-amber-700 via-purple-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-yellow-300" />
            Bảng Tổng Kết Năng Lực Toàn Năng (Arena Analytics)
          </h2>
          <p className="text-purple-100 text-sm mt-1">
            Báo cáo tổng hợp độ thành thạo và năng lực tư duy toán học của Tony trên cả 7 vương quốc.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex gap-3">
          <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center">
            <span className="text-[10px] text-purple-200 block uppercase font-bold">Độ chính xác</span>
            <span className="text-2xl font-black text-yellow-300 font-mono">{accuracy}%</span>
          </div>
          <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center">
            <span className="text-[10px] text-purple-200 block uppercase font-bold">Tổng lượt giải</span>
            <span className="text-2xl font-black text-white font-mono">{totalAttempts}</span>
          </div>
        </div>
      </div>

      {/* Record Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Chuỗi đúng kỷ lục</span>
            <span className="text-xl font-black text-yellow-300 font-mono">
              🔥 x{progress.marathonMaxStreak}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl">
            <Castle className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Tháp thử thách</span>
            <span className="text-xl font-black text-purple-300 font-mono">
              Tầng {progress.highestTowerFloorCleared}/6
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-2xl">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Trạm Marathon đạt</span>
            <span className="text-xl font-black text-white font-mono">
              {progress.marathonHighCheckpoint} Trạm
            </span>
          </div>
        </div>
      </div>

      {/* 9 Core Domains Mastery Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Mức Độ Thành Thạo 9 Miền Kiến Thức
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(topicMastery).map((topic) => (
            <div
              key={topic.topicId}
              className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <h4 className="text-xs font-bold text-slate-200">{topic.nameVi}</h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                      topic.status === 'mastered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : topic.status === 'struggling'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {topic.status === 'mastered'
                      ? 'Thành thạo'
                      : topic.status === 'struggling'
                      ? 'Cần rèn luyện'
                      : 'Đang học'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-mono">
                  <span>
                    Tiến độ: {topic.correct}/{topic.attempts} câu
                  </span>
                  <span className="font-bold text-slate-200">{topic.score}%</span>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full transition-all duration-300 ${
                    topic.status === 'mastered'
                      ? 'bg-emerald-500'
                      : topic.status === 'struggling'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${topic.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Gallery */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Huy Chương Đấu Trường Tổng Hợp ({progress.unlockedAchievements.length}/
          {ARENA_ACHIEVEMENTS.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ARENA_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-purple-950/20 border-purple-500/40'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked ? 'bg-purple-500/20 border border-purple-400/50' : 'bg-slate-800'
                  }`}
                >
                  {ach.icon}
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      isUnlocked ? 'text-yellow-300' : 'text-slate-400'
                    }`}
                  >
                    {ach.titleVi}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {ach.descriptionVi}
                  </p>
                  <div className="flex gap-2 mt-2 text-[10px] font-mono font-bold">
                    <span className="text-yellow-400">+{ach.goldReward} Vàng</span>
                    <span className="text-cyan-400">+{ach.xpReward} XP</span>
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
