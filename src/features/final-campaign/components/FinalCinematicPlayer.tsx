import React from 'react';
import { useFinalCampaignStore } from '../useFinalCampaignStore';
import { FINAL_INTRO_CINEMATIC, FINAL_OUTRO_CINEMATIC } from '../data/cinematicsCatalog';

interface FinalCinematicPlayerProps {
  type: 'intro' | 'outro';
}

export const FinalCinematicPlayer: React.FC<FinalCinematicPlayerProps> = ({ type }) => {
  const { slideIndex, nextSlide, prevSlide, skipCinematic } = useFinalCampaignStore();

  const scenario = type === 'intro' ? FINAL_INTRO_CINEMATIC : FINAL_OUTRO_CINEMATIC;
  const currentSlide = scenario.slides[slideIndex] || scenario.slides[0];

  const getSpeakerAvatar = (speaker: string) => {
    if (speaker.includes('Lord Zero')) return '👿';
    if (speaker.includes('Tony')) return '👦';
    if (speaker.includes('Pytha') || speaker.includes('Elder Oak')) return '🧙‍♂️';
    if (speaker.includes('Sophia') || speaker.includes('Chronos')) return '👸';
    if (speaker.includes('Aethelgard') || speaker.includes('Thần Long')) return '🐉';
    return '📜';
  };

  return (
    <div className="min-h-[600px] bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-amber-500/40 text-white flex flex-col justify-between max-w-4xl mx-auto relative overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 bg-amber-500/20 text-yellow-300 rounded-full border border-amber-400/40">
            🎬 SỬ THI BẢY VƯƠNG QUỐC • {type === 'intro' ? 'MỞ ĐẦU CHIẾN DỊCH' : 'ĐẠI KHẢI HOÀN'}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-amber-200 mt-2">
            {scenario.titleVi}
          </h2>
        </div>
        <button
          onClick={skipCinematic}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-300 hover:text-white rounded-xl backdrop-blur transition border border-white/20 flex items-center gap-1.5"
        >
          Bỏ Qua (Skip) ⏩
        </button>
      </div>

      {/* Center Cinematic Scene */}
      <div className="my-8 relative z-10 flex flex-col md:flex-row items-center gap-8 bg-slate-900/80 p-6 md:p-8 rounded-2xl border border-white/15 shadow-2xl backdrop-blur-md">
        {/* Speaker Avatar Card */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-br from-amber-500/20 to-purple-600/30 border-2 border-amber-400 flex items-center justify-center text-6xl md:text-7xl shadow-2xl animate-pulse">
            {getSpeakerAvatar(currentSlide.speaker)}
          </div>
          <span className="mt-3 font-black text-amber-300 text-base md:text-lg">
            {currentSlide.speaker}
          </span>
          {currentSlide.speakerTitle && (
            <span className="text-xs text-indigo-300 font-semibold tracking-wide">
              {currentSlide.speakerTitle}
            </span>
          )}
        </div>

        {/* Dialogue Bubble */}
        <div className="flex-1 min-w-0">
          {currentSlide.highlightWord && (
            <div className="inline-block px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs uppercase rounded-lg mb-3 shadow">
              ⚡ {currentSlide.highlightWord}
            </div>
          )}
          <p className="text-lg md:text-xl font-medium text-gray-100 leading-relaxed italic">
            "{currentSlide.dialogue}"
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4 relative z-10">
        <button
          onClick={prevSlide}
          disabled={slideIndex === 0}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition flex items-center gap-2"
        >
          ⬅️ Đoạn Trước
        </button>

        {/* Slide Progress Dots */}
        <div className="flex items-center gap-2">
          {scenario.slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                slideIndex === idx ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="px-6 py-2.5 rounded-xl font-black text-sm bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-lg hover:shadow-yellow-500/30 transition flex items-center gap-2"
        >
          {slideIndex + 1 < scenario.slides.length ? 'Tiếp Tục ➔' : 'Bắt Đầu Chiến Dịch ⚔️'}
        </button>
      </div>
    </div>
  );
};
