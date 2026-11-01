import React, { useEffect } from 'react';
import { useAdvancedArenaStore } from '../useAdvancedArenaStore';
import { GRAND_BOSS_PHASES } from '../data/grandBossCatalog';
import confetti from 'canvas-confetti';
import {
  Skull,
  Shield,
  Zap,
  Flame,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Crown,
} from 'lucide-react';

export const GrandBossArenaView: React.FC = () => {
  const {
    currentPhaseIndex,
    bossHp,
    bossMaxHp,
    tonyHp,
    tonyMaxHp,
    activeBossSpell,
    comboStreak,
    shieldActive,
    bossBattleFinished,
    bossVictory,
    bossFeedback,
    answerGrandBossSpell,
    restartGrandBossBattle,
  } = useAdvancedArenaStore();

  const currentPhaseConfig =
    GRAND_BOSS_PHASES[currentPhaseIndex - 1] || GRAND_BOSS_PHASES[0];
  const bossHpPercent = Math.max(0, Math.round((bossHp / bossMaxHp) * 100));
  const tonyHpPercent = Math.max(0, Math.round((tonyHp / tonyMaxHp) * 100));

  useEffect(() => {
    if (bossBattleFinished && bossVictory) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  }, [bossBattleFinished, bossVictory]);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4">
      {/* Top Boss Arena Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-6 border-2 border-purple-600/60 shadow-2xl text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-900/80 border-2 border-purple-500 flex items-center justify-center text-3xl shadow-lg">
              🧙‍♂️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800">
                  Đại Pháp Sư Vạn Vương Quốc
                </span>
                <span className="text-xs text-yellow-300 font-bold">
                  Giai đoạn {currentPhaseIndex}/3
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {currentPhaseConfig.bossNameVi}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comboStreak > 1 && (
              <div className="bg-amber-500/20 border border-amber-500/50 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-black text-yellow-300">
                  Combo x{comboStreak}
                </span>
              </div>
            )}
            {shieldActive && (
              <div className="bg-sky-500/20 border border-sky-400/50 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-sky-300">Khiên Thần Binh</span>
              </div>
            )}
          </div>
        </div>

        {/* Phase subtitle */}
        <p className="text-xs text-purple-200/90 mt-3 z-10 relative">
          {currentPhaseConfig.themeVi}
        </p>

        {/* Dual HP Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 z-10 relative">
          {/* Boss HP */}
          <div className="bg-black/50 p-3 rounded-xl border border-purple-900/60">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-purple-400 flex items-center gap-1">
                <Skull className="w-3.5 h-3.5" /> HP Nexus
              </span>
              <span className="font-mono text-purple-300">
                {bossHp}/{bossMaxHp} ({bossHpPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-purple-600 to-pink-500 transition-all duration-300"
                style={{ width: `${bossHpPercent}%` }}
              />
            </div>
          </div>

          {/* Tony HP */}
          <div className="bg-black/50 p-3 rounded-xl border border-blue-900/60">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-sky-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> HP Hiệp Sĩ Tony
              </span>
              <span className="font-mono text-sky-300">
                {tonyHp}/{tonyMaxHp} ({tonyHpPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-sky-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${tonyHpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Battle Scene or Finished */}
      {bossBattleFinished ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl space-y-4">
          {bossVictory ? (
            <>
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 border-2 border-yellow-400 text-yellow-400 mx-auto flex items-center justify-center text-4xl shadow-xl">
                🏆
              </div>
              <h3 className="text-2xl font-black text-yellow-300">
                BẬC THẦY TOÁN HỌC VẠN VƯƠNG QUỐC!
              </h3>
              <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
                Đại Pháp Sư Nexus đã cúi đầu thán phục! Tony đã xuất sắc chứng minh năng lực toán học toàn diện, kết nối tinh hoa của cả 7 vương quốc thần thoại!
              </p>
              <div className="pt-4 flex justify-center">
                <button
                  onClick={restartGrandBossBattle}
                  className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
                >
                  <RotateCcw className="w-4 h-4" /> Khiêu chiến lại Boss Nexus
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 text-red-400 mx-auto flex items-center justify-center text-4xl shadow-xl">
                💀
              </div>
              <h3 className="text-2xl font-black text-rose-400">TONY ĐÃ THẤT BẠI!</h3>
              <p className="text-slate-300 text-sm max-w-lg mx-auto">
                Luồng ma thuật hỗn nguyên của Nexus quá mạnh mẽ! Hãy phục hồi năng lượng và thử lại!
              </p>
              <div className="pt-4 flex justify-center">
                <button
                  onClick={restartGrandBossBattle}
                  className="px-6 py-2.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
                >
                  <RotateCcw className="w-4 h-4" /> Hồi sinh & Thử Lại
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Active Spell Duel */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold uppercase text-yellow-400">
                  Chiêu thức Boss: {activeBossSpell.spellNameVi}
                </span>
              </div>
              <blockquote className="mt-2 text-sm italic text-purple-200/90 bg-purple-950/30 p-3 rounded-xl border border-purple-900/40">
                "{activeBossSpell.bossDialogueVi}"
              </blockquote>
            </div>
            <div className="bg-black/30 px-3 py-1.5 rounded-lg border border-slate-800 text-right shrink-0">
              <span className="text-[10px] text-slate-400 block">Sát thương đòn</span>
              <span className="font-mono font-black text-purple-300 text-sm">
                -{activeBossSpell.damage} HP
              </span>
            </div>
          </div>

          {/* Spell Challenge Text */}
          <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
            <p className="text-base font-bold text-slate-100">
              {activeBossSpell.challengeTextVi}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeBossSpell.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => answerGrandBossSpell(idx)}
                className="p-4 rounded-xl text-left font-bold text-slate-100 bg-slate-800 hover:bg-purple-900/30 border border-slate-700 hover:border-purple-500 transition-all duration-150 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm group-hover:text-purple-300 transition-colors">
                    {opt}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Boss Feedback */}
          {bossFeedback && (
            <div
              className={`p-4 rounded-xl border text-sm flex items-center gap-3 ${
                bossFeedback.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              {bossFeedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span className="font-semibold">{bossFeedback.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
