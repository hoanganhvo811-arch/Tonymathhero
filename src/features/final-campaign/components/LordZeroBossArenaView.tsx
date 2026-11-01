import React from 'react';
import { useFinalCampaignStore } from '../useFinalCampaignStore';
import { LORD_ZERO_PHASES_CONFIG, LORD_ZERO_SPELLS } from '../data/lordZeroBossCatalog';

export const LordZeroBossArenaView: React.FC = () => {
  const {
    currentGrade,
    bossPhaseIndex,
    bossCurrentHp,
    bossMaxHp,
    playerHp,
    crystalShieldsRemaining,
    bossSpellIndex,
    bossBattleStatus,
    bossFeedback,
    answerBossSpell,
    nextBossPhase,
    resetBossBattle,
    setStage,
  } = useFinalCampaignStore();

  const phaseConfig = LORD_ZERO_PHASES_CONFIG[bossPhaseIndex - 1] || LORD_ZERO_PHASES_CONFIG[0];

  const phaseSpells = LORD_ZERO_SPELLS.filter(
    (s) => s.phaseIndex === bossPhaseIndex && s.gradeLevel === currentGrade
  );
  const spells =
    phaseSpells.length > 0
      ? phaseSpells
      : LORD_ZERO_SPELLS.filter((s) => s.phaseIndex === bossPhaseIndex);

  const currentSpell = spells[bossSpellIndex % spells.length];
  const hpPercent = Math.max(0, Math.round((bossCurrentHp / bossMaxHp) * 100));

  const getMoodAvatar = () => {
    switch (phaseConfig.avatarMood) {
      case 'shadow':
        return '👤';
      case 'enraged':
        return '🔥';
      case 'cosmic':
        return '🌌';
      case 'final_form':
        return '👿';
      default:
        return '👑';
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-amber-500/50 text-white max-w-4xl mx-auto space-y-6">
      {/* 5-Phase Progress Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-amber-500/20 text-yellow-300 rounded-full border border-amber-400/40">
            👑 ĐẠI CHIẾN TỐI HẬU • GIAI ĐOẠN {bossPhaseIndex}/5
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-amber-200 mt-2">
            {phaseConfig.bossTitleVi}
          </h2>
          <p className="text-xs text-amber-300/80 mt-1">{phaseConfig.themeVi}</p>
        </div>

        {/* Phase Circles */}
        <div className="flex items-center gap-2">
          {LORD_ZERO_PHASES_CONFIG.map((p) => (
            <div
              key={p.phaseIndex}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all ${
                bossPhaseIndex === p.phaseIndex
                  ? 'bg-amber-500 text-slate-950 border-yellow-200 scale-110 shadow-lg animate-pulse'
                  : bossPhaseIndex > p.phaseIndex
                  ? 'bg-emerald-500 text-white border-emerald-300'
                  : 'bg-white/10 text-white/40 border-white/20'
              }`}
            >
              {bossPhaseIndex > p.phaseIndex ? '✓' : p.phaseIndex}
            </div>
          ))}
        </div>
      </div>

      {/* Battle Status Dashboard (Boss HP vs Player HP & Knowledge Crystal Shields) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Boss HP */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/15 shadow">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase mb-2">
            <span className="text-rose-400 flex items-center gap-2">
              <span>{getMoodAvatar()}</span> Sinh Lực Lord Zero:
            </span>
            <span className="font-mono text-sm text-yellow-300">
              {bossCurrentHp} / {bossMaxHp} HP ({hpPercent}%)
            </span>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                hpPercent > 50
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : hpPercent > 20
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                  : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Player HP & Knowledge Crystal Shields */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/15 shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase mb-1">
            <span className="text-emerald-400 flex items-center gap-2">
              <span>👦</span> Hiệp Sĩ Tony:
            </span>
            <span className="font-mono text-sm text-emerald-300">{playerHp} / 100 HP</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-indigo-300 font-bold">Lá Chắn Ngọc Tri Thức:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-sm transition-opacity duration-300 ${
                    i < crystalShieldsRemaining ? 'opacity-100 scale-105' : 'opacity-25 grayscale'
                  }`}
                  title="Ngọc Tri Thức Bảo Vệ"
                >
                  💎
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Battle Scene / Modal Views */}
      {bossBattleStatus === 'victory' ? (
        /* Final Victory Screen */
        <div className="p-8 bg-gradient-to-b from-amber-500 to-yellow-600 rounded-3xl text-slate-950 text-center shadow-2xl animate-fade-in space-y-4">
          <div className="text-7xl animate-bounce">👑</div>
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-wide">
            ĐẠI KHẢI HOÀN! LORD ZERO ĐÃ BỊ ĐÁNH BẠI!
          </h3>
          <p className="font-bold text-slate-900 max-w-lg mx-auto text-base">
            Tony đã đánh bại trọn vẹn 5 hình thái của Chúa Tể Không Gian Hắc Ám. Bảy Vương Quốc đã được giải phóng!
          </p>
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="px-5 py-2.5 bg-white/40 backdrop-blur rounded-2xl font-black text-lg">
              ✨ +600 XP
            </div>
            <div className="px-5 py-2.5 bg-white/40 backdrop-blur rounded-2xl font-black text-lg">
              🪙 +300 Vàng
            </div>
          </div>
          <button
            onClick={() => {
              useFinalCampaignStore.setState({ activeCinematicType: 'outro', slideIndex: 0 });
              setStage('cinematic_outro');
            }}
            className="px-8 py-4 bg-slate-950 text-yellow-400 hover:bg-slate-900 font-black text-lg rounded-2xl shadow-2xl transition active:scale-95"
          >
            Xem Sử Thi Đại Khải Hoàn Bảy Vương Quốc ➔
          </button>
        </div>
      ) : bossBattleStatus === 'phase_cleared' ? (
        /* Phase Cleared Screen */
        <div className="p-8 bg-gradient-to-b from-emerald-600 to-teal-700 rounded-3xl text-white text-center shadow-2xl space-y-4">
          <div className="text-6xl mb-2">🛡️</div>
          <h3 className="text-2xl md:text-3xl font-black uppercase">
            HẠ GỤC GIAI ĐOẠN {bossPhaseIndex}: {phaseConfig.titleVi}!
          </h3>
          <p className="text-emerald-100 font-medium max-w-lg mx-auto">
            "{phaseConfig.defeatDialogueVi}"
          </p>
          <button
            onClick={nextBossPhase}
            className="px-8 py-3.5 bg-yellow-400 text-yellow-950 hover:bg-yellow-300 font-black text-lg rounded-2xl shadow-xl transition active:scale-95"
          >
            Tiến Vào Giai Đoạn {bossPhaseIndex + 1} ➔
          </button>
        </div>
      ) : (
        /* Active Spell Challenge */
        currentSpell && (
          <div className="space-y-6">
            {/* Boss Dialogue speech bubble */}
            <div className="bg-white/10 backdrop-blur border border-white/20 p-5 rounded-2xl flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shrink-0 shadow">
                {getMoodAvatar()}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  Lời Thách Đố Của Lord Zero:
                </span>
                <p className="text-gray-100 font-medium italic text-base">
                  "{currentSpell.bossSpeechVi}"
                </p>
              </div>
            </div>

            {/* Spell Challenge Content */}
            <div className="bg-slate-900/95 border-2 border-amber-500/40 p-6 md:p-8 rounded-2xl shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                  <span>⚡</span> Ma Pháp: {currentSpell.spellNameVi}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Sát Thương Tri Thức: {currentSpell.damage} HP
                </span>
              </div>

              <p className="text-lg md:text-xl font-bold text-white mb-6">
                {currentSpell.challengeTextVi}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSpell.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => answerBossSpell(idx)}
                    className="py-4 px-6 rounded-2xl font-black text-base md:text-lg bg-white/10 hover:bg-amber-500 hover:text-slate-950 border border-white/20 text-white transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center text-center"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Attack Feedback */}
            {bossFeedback && (
              <div
                className={`p-4 rounded-2xl border transition ${
                  bossFeedback.isCorrect
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md'
                    : bossFeedback.shieldUsed
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                    : 'bg-rose-500/20 border-rose-400 text-rose-200'
                }`}
              >
                <div className="font-black text-sm">{bossFeedback.message}</div>
              </div>
            )}
          </div>
        )
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={resetBossBattle}
          className="text-xs font-bold text-gray-400 hover:text-white transition"
        >
          🔄 Đặt Lại Trận Đấu
        </button>
        <button
          onClick={() => setStage('dark_kingdom_trials')}
          className="text-xs font-bold text-amber-300 hover:text-amber-200 transition"
        >
          🏰 Quay Lại Thử Thách Tiền Đồn
        </button>
      </div>
    </div>
  );
};
