import React from 'react';
import { useLogicThinkingStore } from '../useLogicThinkingStore';
import { LOGIC_GUARDIAN_PHASES, LOGIC_GUARDIAN_SPELLS } from '../data/logicGuardianCatalog';

export const LogicGuardianArenaView: React.FC = () => {
  const {
    currentGrade,
    bossPhaseIndex,
    bossCurrentHp,
    bossMaxHp,
    bossSpellIndex,
    bossBattleStatus,
    bossFeedback,
    answerBossSpell,
    nextBossPhase,
    resetBossBattle,
  } = useLogicThinkingStore();

  const phaseConfig = LOGIC_GUARDIAN_PHASES[bossPhaseIndex - 1] || LOGIC_GUARDIAN_PHASES[0];

  const phaseSpells = LOGIC_GUARDIAN_SPELLS.filter(
    (s) => s.phaseIndex === bossPhaseIndex && s.gradeLevel === currentGrade
  );
  const spells = phaseSpells.length > 0
    ? phaseSpells
    : LOGIC_GUARDIAN_SPELLS.filter((s) => s.phaseIndex === bossPhaseIndex);

  const currentSpell = spells[bossSpellIndex % spells.length];

  const hpPercent = Math.max(0, Math.round((bossCurrentHp / bossMaxHp) * 100));

  return (
    <div className="bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-amber-500/40 text-white max-w-4xl mx-auto">
      {/* Boss Stage Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div>
          <span className="text-xs font-black tracking-widest uppercase px-3 py-1 bg-amber-500/20 text-yellow-300 rounded-full border border-amber-400/40">
            👑 ĐẤU TRƯỜNG THỦ HỘ • GIAI ĐOẠN {bossPhaseIndex}/3
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-amber-200 mt-2">
            {phaseConfig.bossNameVi}
          </h2>
          <p className="text-xs text-amber-300/80 mt-1">{phaseConfig.themeVi}</p>
        </div>
        <div className="flex items-center gap-2">
          {LOGIC_GUARDIAN_PHASES.map((p) => (
            <div
              key={p.phaseIndex}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                bossPhaseIndex === p.phaseIndex
                  ? 'bg-amber-500 text-slate-950 border-yellow-300 shadow-lg animate-pulse'
                  : bossPhaseIndex > p.phaseIndex
                  ? 'bg-emerald-500 text-white border-emerald-300'
                  : 'bg-white/10 text-white/50 border-white/20'
              }`}
            >
              {bossPhaseIndex > p.phaseIndex ? '✓' : p.phaseIndex}
            </div>
          ))}
        </div>
      </div>

      {/* Boss Health Bar */}
      <div className="mb-8 bg-black/40 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between text-xs font-extrabold uppercase mb-2">
          <span className="text-amber-400 flex items-center gap-2">
            <span>🦁</span> Sinh Lực Malakor:
          </span>
          <span className="font-mono text-sm text-yellow-300">
            {bossCurrentHp} / {bossMaxHp} HP ({hpPercent}%)
          </span>
        </div>
        <div className="w-full h-5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/20">
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

      {/* Grand Victory Screen */}
      {bossBattleStatus === 'victory' ? (
        <div className="p-8 bg-gradient-to-b from-amber-500 to-yellow-600 rounded-2xl text-slate-950 text-center shadow-2xl animate-fade-in mb-6">
          <div className="text-6xl mb-4 animate-bounce">👑</div>
          <h3 className="text-3xl font-black uppercase mb-2">ĐẠI THẮNG NHÂN SƯ MALAKOR!</h3>
          <p className="font-bold text-slate-900 max-w-lg mx-auto mb-6">
            Tony đã vận dụng toàn bộ óc quan sát, tư duy mê cung, logic số học và suy luận thám tử để giải cứu Vương Quốc Trí Tuệ!
          </p>
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="px-4 py-2 bg-white/30 backdrop-blur rounded-xl font-black text-lg">
              ✨ +300 XP
            </div>
            <div className="px-4 py-2 bg-white/30 backdrop-blur rounded-xl font-black text-lg">
              🪙 +150 Vàng
            </div>
          </div>
          <button
            onClick={resetBossBattle}
            className="px-8 py-3.5 bg-slate-950 text-yellow-400 hover:bg-slate-900 font-black rounded-xl shadow-xl transition"
          >
            🔄 Khiêu Chiến Lại Từ Đầu
          </button>
        </div>
      ) : bossBattleStatus === 'phase_won' ? (
        /* Phase Won Modal */
        <div className="p-8 bg-gradient-to-b from-emerald-600 to-teal-700 rounded-2xl text-white text-center shadow-2xl mb-6">
          <div className="text-5xl mb-3">🛡️</div>
          <h3 className="text-2xl font-black uppercase mb-2">ĐÃ PHÁ GIẢI GIAI ĐOẠN {bossPhaseIndex}!</h3>
          <p className="text-emerald-100 font-medium mb-6">
            Hình thái này của Malakor đã tan biến. Hãy chuẩn bị tinh thần bước vào giai đoạn tiếp theo!
          </p>
          <button
            onClick={nextBossPhase}
            className="px-8 py-3.5 bg-yellow-400 text-yellow-950 hover:bg-yellow-300 font-black rounded-xl shadow-xl transition"
          >
            Tiến Vào Giai Đoạn {bossPhaseIndex + 1} ➔
          </button>
        </div>
      ) : (
        /* Active Spell Challenge */
        currentSpell && (
          <div>
            {/* Boss Dialogue Box */}
            <div className="bg-white/10 backdrop-blur border border-white/20 p-5 rounded-2xl mb-6 flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shrink-0 shadow">
                🦁
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  Khẩu Quyết Thách Đố Của Malakor:
                </span>
                <p className="text-gray-100 font-medium italic">"{currentSpell.bossDialogueVi}"</p>
              </div>
            </div>

            {/* Spell Challenge Content */}
            <div className="bg-slate-900/90 border border-amber-500/30 p-6 rounded-2xl mb-6 shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                  <span>⚡</span> Tuyệt Kỹ: {currentSpell.spellNameVi}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Sát Thương: {currentSpell.damage} HP
                </span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white mb-6">
                {currentSpell.challengeTextVi}
              </p>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentSpell.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => answerBossSpell(idx)}
                    className="py-4 px-6 rounded-xl font-black text-lg bg-white/10 hover:bg-amber-500 hover:text-slate-950 border border-white/20 text-white transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Attack Feedback */}
            {bossFeedback && (
              <div
                className={`p-4 rounded-xl mb-6 border transition ${
                  bossFeedback.isCorrect
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md'
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
      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
        <button
          onClick={resetBossBattle}
          className="text-xs font-bold text-gray-400 hover:text-white transition"
        >
          🔄 Đặt Lại Trận Đấu
        </button>
        <span className="text-xs text-amber-300/60 italic">
          Đánh bại 3 giai đoạn để phong ấn Nhân Sư Trí Tuệ!
        </span>
      </div>
    </div>
  );
};
