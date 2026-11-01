import React from 'react';
import { useFinalCampaignStore } from '../useFinalCampaignStore';
import { FINAL_MATH_TRIALS } from '../data/finalTrialsCatalog';

export const DarkKingdomTrialsView: React.FC = () => {
  const {
    currentGrade,
    activeTrialIndex,
    clearedTrialIds,
    trialFeedback,
    answerTrial,
    nextTrial,
    enterBossArena,
  } = useFinalCampaignStore();

  const trials = FINAL_MATH_TRIALS.filter((t) => t.gradeLevel === currentGrade);
  const activeTrial = trials[activeTrialIndex % trials.length];

  if (!activeTrial) {
    return <div className="p-8 text-center text-gray-500">Đang tải thử thách Dark Kingdom...</div>;
  }

  const allTrialsCleared = trials.every((t) => clearedTrialIds.includes(t.id));

  return (
    <div className="bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-500/30 text-white max-w-4xl mx-auto space-y-8">
      {/* Dark Kingdom Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-400/40">
            🏰 PHÁO ĐÀI HẮC ÁM • {currentGrade === 'grade-2' ? 'CẤP ĐỘ LỚP 2' : 'CẤP ĐỘ LỚP 3'}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-amber-300 mt-2">
            Thử Thách Tiền Đồn Dark Kingdom
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Phá giải 5 cổng phong ấn để mở lối vào căn phòng ngai vàng của Lord Zero.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 text-amber-200">
            Đã Phá Giải: {clearedTrialIds.length} / {trials.length} Cổng
          </span>
        </div>
      </div>

      {/* 5 Trial Gates Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {trials.map((trial, idx) => {
          const isCleared = clearedTrialIds.includes(trial.id);
          const isActive = idx === activeTrialIndex;
          return (
            <button
              key={trial.id}
              onClick={() => {
                useFinalCampaignStore.setState({ activeTrialIndex: idx, trialFeedback: null });
              }}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-24 ${
                isActive
                  ? 'bg-purple-600/40 border-amber-400 shadow-lg scale-105'
                  : isCleared
                  ? 'bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400">Cổng {idx + 1}</span>
                <span>{isCleared ? '✅' : '🔒'}</span>
              </div>
              <div className="text-[11px] font-bold text-gray-200 line-clamp-2">
                {trial.mathDomainVi}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Trial Card */}
      <div className="bg-slate-950/80 p-6 md:p-8 rounded-2xl border border-white/15 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
            <span>⚡</span> Chuyên Đề: {activeTrial.mathDomainVi}
          </span>
          <span className="text-xs font-bold text-emerald-400">
            +{activeTrial.rewardExp} XP • +{activeTrial.rewardGold} Vàng
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-white mb-2">{activeTrial.titleVi}</h3>
        <p className="text-sm text-gray-300 italic mb-6">"{activeTrial.storyVi}"</p>

        {/* Visual Content Box */}
        {activeTrial.visualData && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6 flex items-center justify-center gap-4 flex-wrap text-center">
            {activeTrial.visualData.items?.map((item, i) => (
              <span key={i} className="px-3 py-1.5 bg-purple-900/40 border border-purple-400 text-purple-200 font-mono font-black text-lg rounded-lg">
                {item}
              </span>
            ))}
            {activeTrial.visualData.values?.map((val, i) => (
              <span key={i} className="px-3 py-1.5 bg-indigo-900/40 border border-indigo-400 text-indigo-200 font-mono font-black text-lg rounded-lg">
                {val}
              </span>
            ))}
          </div>
        )}

        {/* Question Prompt */}
        <div className="bg-purple-950/60 p-4 rounded-xl border border-purple-400/40 text-purple-100 font-bold text-base mb-6 flex items-start gap-3">
          <span className="text-2xl">❓</span>
          <div>{activeTrial.questionVi}</div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {activeTrial.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => answerTrial(idx)}
              className="py-4 px-6 rounded-xl font-bold text-base md:text-lg bg-white/10 hover:bg-amber-500 hover:text-slate-950 border border-white/20 text-white transition-all duration-200 active:scale-95 shadow flex items-center justify-center text-center"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feedback Alert */}
        {trialFeedback && (
          <div
            className={`p-5 rounded-2xl mb-6 border-2 transition ${
              trialFeedback.isCorrect
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md'
                : 'bg-rose-500/20 border-rose-400 text-rose-200'
            }`}
          >
            <div className="font-black text-base mb-1">{trialFeedback.message}</div>
            {trialFeedback.explanation && (
              <div className="text-sm mt-2 opacity-90">{trialFeedback.explanation}</div>
            )}
          </div>
        )}

        {/* Trial Controls */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-xs text-gray-400 italic">
            💡 Gợi ý: {activeTrial.hintVi}
          </span>
          <button
            onClick={nextTrial}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-700 text-white shadow transition flex items-center gap-2"
          >
            Cổng Tiếp Theo ➔
          </button>
        </div>
      </div>

      {/* Enter Lord Zero Arena Call To Action */}
      <div className="p-6 bg-gradient-to-r from-amber-600/30 via-purple-900/40 to-slate-950 border-2 border-amber-400 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div>
          <span className="text-xs font-black text-amber-300 uppercase tracking-widest block mb-1">
            ĐẤU TRƯỜNG THẦN ĐIỆN HẮC ÁM
          </span>
          <h4 className="text-xl font-black text-white">
            {allTrialsCleared
              ? 'Toàn Bộ 5 Cổng Đã Bị Phá Vỡ! Căn Phòng Chúa Tể Đang Rộng Mở!'
              : 'Tony Có Thể Tiến Vào Khiêu Chiến Trực Tiếp Lord Zero!'}
          </h4>
        </div>
        <button
          onClick={enterBossArena}
          className="px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-lg rounded-2xl shadow-xl transition active:scale-95 flex items-center gap-2 shrink-0"
        >
          <span>⚔️</span> KHIÊU CHIẾN LORD ZERO!
        </button>
      </div>
    </div>
  );
};
