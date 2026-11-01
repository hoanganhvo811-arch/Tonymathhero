import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinalCampaignStore } from '../useFinalCampaignStore';
import { FinalCampaignStage } from '../../../types';
import { FinalCinematicPlayer } from './FinalCinematicPlayer';
import { DarkKingdomTrialsView } from './DarkKingdomTrialsView';
import { LordZeroBossArenaView } from './LordZeroBossArenaView';
import { CampaignEndingView } from './CampaignEndingView';
import { HeroJourneySummaryView } from './HeroJourneySummaryView';
import { EndgameHubView } from './EndgameHubView';

export const FinalCampaignScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentGrade, stage, setGrade, setStage, progress } = useFinalCampaignStore();

  const renderActiveStage = () => {
    switch (stage) {
      case 'cinematic_intro':
        return <FinalCinematicPlayer type="intro" />;
      case 'dark_kingdom_trials':
        return <DarkKingdomTrialsView />;
      case 'boss_battle':
        return <LordZeroBossArenaView />;
      case 'cinematic_outro':
        return <FinalCinematicPlayer type="outro" />;
      case 'campaign_completed_fanfare':
        return <CampaignEndingView />;
      case 'hero_journey':
        return <HeroJourneySummaryView />;
      case 'endgame_hub':
        return <EndgameHubView />;
      default:
        return <DarkKingdomTrialsView />;
    }
  };

  const stagesNav: { id: FinalCampaignStage; label: string; icon: string }[] = [
    { id: 'cinematic_intro', label: 'Cốt Truyện Mở Đầu', icon: '🎬' },
    { id: 'dark_kingdom_trials', label: 'Thử Thách Dark Kingdom', icon: '🏰' },
    { id: 'boss_battle', label: 'Đại Chiến Lord Zero', icon: '⚔️' },
    { id: 'campaign_completed_fanfare', label: 'Lễ Khải Hoàn', icon: '👑' },
    { id: 'hero_journey', label: "Tony's Hero Journey", icon: '📜' },
    { id: 'endgame_hub', label: 'Nội Dung Endgame', icon: '🌌' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 pb-16">
      {/* Top Banner Navigation */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border-b border-white/10 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/map')}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur transition border border-white/20 flex items-center gap-1.5"
            >
              🗺️ Bản Đồ Thế Giới
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur transition border border-white/20 flex items-center gap-1.5"
            >
              🏠 Trang Chủ
            </button>
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/20">
            <button
              onClick={() => setGrade('grade-2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                currentGrade === 'grade-2'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Lớp 2 (Cơ Bản)
            </button>
            <button
              onClick={() => setGrade('grade-3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                currentGrade === 'grade-3'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Lớp 3 (Nâng Cao)
            </button>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 text-xs font-bold bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/20">
            <span>🏰 Tiền Đồn: {progress.clearedTrialIds.length}/5</span>
            <span>👑 Lord Zero: {progress.defeatedBossPhases.length}/5</span>
            <span>💎 Ngọc: 7/7</span>
          </div>
        </div>

        {/* Title Bar */}
        <div className="max-w-6xl mx-auto px-4 pt-3 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-3xl shadow-lg border-2 border-yellow-200">
              👑
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-amber-200 uppercase tracking-wide">
                THE FINAL CAMPAIGN – THE RISE OF THE MATH HERO
              </h1>
              <p className="text-xs md:text-sm text-indigo-200 font-medium">
                Chiến dịch cuối cùng: Phục hồi Bảy Vương Quốc và đánh bại Chúa Tể Hắc Ám Lord Zero!
              </p>
            </div>
          </div>
        </div>

        {/* Stages Navigation Bar */}
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-none flex gap-2 pb-3">
          {stagesNav.map((s) => {
            const isActive = stage === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStage(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                    : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
                }`}
              >
                <span className="text-base">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Stage View */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {renderActiveStage()}
      </main>
    </div>
  );
};
