import React from 'react';
import { useMoneyShoppingStore } from '../useMoneyShoppingStore';
import { MoneyAdaptiveEngine } from '../services/moneyAdaptiveEngine';
import { MONEY_ACHIEVEMENTS } from '../data/moneyAchievementsCatalog';
import { formatVnd } from '../data/currencyCatalog';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Coins,
  Receipt,
} from 'lucide-react';

export const MoneyAnalyticsView: React.FC = () => {
  const {
    attempts,
    progress,
    setActiveZone,
  } = useMoneyShoppingStore();

  const skillBreakdown = MoneyAdaptiveEngine.calculateSkillBreakdown(attempts);
  const recommendedFocus = MoneyAdaptiveEngine.getRecommendedFocus(attempts);

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.isSuccess).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-amber-700 via-yellow-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-yellow-300" />
            Hồ Sơ Năng Lực Tiền Tệ & Mua Sắm
          </h2>
          <p className="text-amber-100 text-sm mt-1">
            Phân tích 9 kỹ năng toán học thực tế của Tony dựa trên hệ thống Adaptive Learning.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl text-center border border-white/20">
            <span className="text-xs text-amber-200 block uppercase font-bold">Độ chính xác</span>
            <span className="text-2xl font-black text-yellow-300 font-mono">
              {accuracy}%
            </span>
          </div>
          <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl text-center border border-white/20">
            <span className="text-xs text-amber-200 block uppercase font-bold">Tổng lượt giải</span>
            <span className="text-2xl font-black text-white font-mono">
              {totalAttempts}
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Zone Card */}
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wide block">
              Gợi ý lộ trình tiếp theo từ Adaptive Engine
            </span>
            <p className="text-sm font-semibold text-slate-100 mt-0.5">
              {recommendedFocus.reasonVi}
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveZone(recommendedFocus.zone)}
          className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105 shrink-0"
        >
          Đến khu vực ngay <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Practical Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Đơn hàng hoàn tất</span>
            <span className="text-lg font-black text-slate-100 font-mono">
              {progress.totalShoppingPurchases} đơn
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Tiền hàng đã trao đổi</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {formatVnd(progress.totalCashHandled)}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Tiền thừa đã tính</span>
            <span className="text-lg font-black text-yellow-400 font-mono">
              {formatVnd(progress.totalChangeCalculated)}
            </span>
          </div>
        </div>
      </div>

      {/* 9 Core Competency Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Chi Tiết 9 Năng Lực Toán Mua Sắm
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(skillBreakdown).map((skill) => (
            <div
              key={skill.skillId}
              className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <h4 className="text-xs font-bold text-slate-200">
                    {skill.nameVi}
                  </h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                      skill.status === 'mastered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : skill.status === 'struggling'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {skill.status === 'mastered'
                      ? 'Thành thạo'
                      : skill.status === 'struggling'
                      ? 'Cần rèn luyện'
                      : 'Đang học'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-mono">
                  <span>Tiến độ: {skill.correct}/{skill.attempts} lần</span>
                  <span className="font-bold text-slate-200">{skill.score}%</span>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full transition-all duration-300 ${
                    skill.status === 'mastered'
                      ? 'bg-emerald-500'
                      : skill.status === 'struggling'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Thành Tích Vương Quốc Tiền Tệ ({progress.unlockedAchievements.length}/{MONEY_ACHIEVEMENTS.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {MONEY_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-500/20 border border-amber-400/50'
                      : 'bg-slate-800'
                  }`}
                >
                  {ach.icon}
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      isUnlocked ? 'text-amber-300' : 'text-slate-400'
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
