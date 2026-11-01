import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinalCampaignStore } from '../useFinalCampaignStore';
import { BOSS_REMATCH_CONFIGS, MASTERY_MISSIONS_CONFIG, SECRET_QUESTS_CONFIG } from '../data/endgameCatalog';

export const EndgameHubView: React.FC = () => {
  const navigate = useNavigate();
  const { startRematch, progress, completeMasteryMission, unlockSecretQuest, setStage } =
    useFinalCampaignStore();

  const [activeTab, setActiveTab] = useState<'rematch' | 'replay' | 'mastery' | 'secret'>('rematch');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'normal' | 'heroic' | 'nightmare'>('heroic');

  const replayKingdoms = [
    { title: '➗ Phép Chia (Divisia)', path: '/division-kingdom', icon: '➗', color: 'bg-emerald-50 text-emerald-800' },
    { title: '📖 Toán Lời Văn (Arithmia)', path: '/word-problem-adventure', icon: '📖', color: 'bg-amber-50 text-amber-800' },
    { title: '📐 Hình Học & Đo Lường', path: '/geometry-measurement', icon: '📐', color: 'bg-sky-50 text-sky-800' },
    { title: '🔢 Tư Duy Số & Nhẩm', path: '/number-kingdom', icon: '🔢', color: 'bg-indigo-50 text-indigo-800' },
    { title: '🍕 Vương Quốc Phân Số', path: '/fractions-kingdom', icon: '🍕', color: 'bg-orange-50 text-orange-800' },
    { title: '⏳ Thời Gian & Lịch', path: '/time-kingdom', icon: '⏳', color: 'bg-yellow-50 text-yellow-800' },
    { title: '💰 Tiền Tệ & Mua Sắm', path: '/money-kingdom', icon: '💰', color: 'bg-teal-50 text-teal-800' },
    { title: '🏆 Đấu Trường Tổng Hợp', path: '/advanced-arena', icon: '🏆', color: 'bg-rose-50 text-rose-800' },
    { title: '🧠 Vương Quốc Trí Tuệ', path: '/logic-kingdom', icon: '🧠', color: 'bg-purple-50 text-purple-800' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 text-gray-800 max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="border-b pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-purple-100 text-purple-800 rounded-full border border-purple-300">
            🌌 HẬU TRUYỆN • ENDGAME CONTENT
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
            Đấu Trường Bất Tử & Thử Thách Vô Cực
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Tiếp tục thử thách giới hạn tri thức của Tony sau khi đã giải cứu Bảy Vương Quốc.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStage('hero_journey')}
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition"
          >
            📜 Tony's Hero Journey
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('rematch')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'rematch'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>⚔️</span> Tái Đấu Boss (Boss Rematch)
        </button>
        <button
          onClick={() => setActiveTab('replay')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'replay'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>🏰</span> Du Ngoạn Vương Quốc (Kingdom Replay)
        </button>
        <button
          onClick={() => setActiveTab('mastery')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'mastery'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>📜</span> Nhiệm Vụ Chuyên Sâu (Mastery Missions)
        </button>
        <button
          onClick={() => setActiveTab('secret')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'secret'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>🗝️</span> Nhiệm Vụ Bí Mật (Secret Quests)
        </button>
      </div>

      {/* TAB 1: BOSS REMATCH */}
      {activeTab === 'rematch' && (
        <div className="space-y-6">
          {/* Difficulty selector */}
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-200">
            <span className="text-xs font-bold text-purple-900 uppercase">
              Chọn Cấp Độ Khiêu Chiến:
            </span>
            <div className="flex items-center gap-2">
              {(['normal', 'heroic', 'nightmare'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition ${
                    selectedDifficulty === diff
                      ? diff === 'nightmare'
                        ? 'bg-rose-600 text-white shadow'
                        : diff === 'heroic'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-emerald-600 text-white shadow'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {diff === 'normal' ? 'Bình Thường' : diff === 'heroic' ? 'Anh Hùng' : 'Ác Mộng 🔥'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOSS_REMATCH_CONFIGS.map((boss) => {
              const diffStats = boss.difficulties[selectedDifficulty];
              return (
                <div
                  key={boss.id}
                  className="p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-purple-400 transition shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-3xl shrink-0 shadow-sm">
                      {boss.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-base text-gray-900">{boss.bossNameVi}</h4>
                      <p className="text-xs text-gray-500">{boss.kingdomNameVi}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-bold">
                        <span className="text-rose-600">❤️ {diffStats.hp} HP</span>
                        <span className="text-amber-600">✨ +{diffStats.exp} XP</span>
                        <span className="text-yellow-600">🪙 +{diffStats.gold} Vàng</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => startRematch(boss.id, selectedDifficulty)}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-xs rounded-xl shadow transition"
                  >
                    Khiêu Chiến Tái Đấu ⚔️
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: KINGDOM REPLAY */}
      {activeTab === 'replay' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {replayKingdoms.map((k, i) => (
            <div
              key={i}
              onClick={() => navigate(k.path)}
              className={`p-4 rounded-2xl border cursor-pointer hover:scale-105 transition shadow-sm flex items-center gap-3 ${k.color}`}
            >
              <span className="text-3xl">{k.icon}</span>
              <div className="font-extrabold text-sm">{k.title}</div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MASTERY MISSIONS */}
      {activeTab === 'mastery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MASTERY_MISSIONS_CONFIG.map((mission) => {
            const isCompleted = progress.clearedMasteryMissionIds.includes(mission.id);
            return (
              <div
                key={mission.id}
                className={`p-5 rounded-2xl border-2 transition ${
                  isCompleted
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mission.icon}</span>
                    <h4 className="font-extrabold text-sm text-gray-900">{mission.titleVi}</h4>
                  </div>
                  {isCompleted && (
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-full">
                      HOÀN THÀNH
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-3">{mission.descriptionVi}</p>
                <div className="flex items-center justify-between pt-2 border-t text-[11px] font-bold text-gray-500">
                  <span>Mục tiêu: {mission.targetCount} bài toán</span>
                  <button
                    onClick={() => completeMasteryMission(mission.id)}
                    disabled={isCompleted}
                    className="px-3 py-1 bg-indigo-600 disabled:opacity-50 text-white rounded-lg font-bold text-xs"
                  >
                    {isCompleted ? '✓ Đã Nhận Thưởng' : 'Đánh Dấu Xong'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: SECRET QUESTS */}
      {activeTab === 'secret' && (
        <div className="space-y-4">
          {SECRET_QUESTS_CONFIG.map((sq) => {
            const isClaimed = progress.clearedSecretQuestIds.includes(sq.id);
            return (
              <div
                key={sq.id}
                className={`p-5 rounded-2xl border-2 flex items-start gap-4 transition ${
                  isClaimed
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-slate-900 text-white border-slate-700'
                }`}
              >
                <div className="text-3xl">🗝️</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`font-black text-base ${isClaimed ? 'text-amber-900' : 'text-amber-300'}`}>
                      {sq.titleVi}
                    </h4>
                    {isClaimed && (
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                        ĐÃ KHAI PHÁ
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${isClaimed ? 'text-gray-700' : 'text-gray-300'}`}>
                    {sq.loreVi}
                  </p>
                  <div className="mt-2 text-xs font-mono font-bold text-amber-400">
                    💡 Manh Mối: {sq.clueVi}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10 text-xs font-bold">
                    <span className="text-yellow-500">Phần Thưởng: Danh hiệu [{sq.rewardTitleVi}]</span>
                    <button
                      onClick={() => unlockSecretQuest(sq.id)}
                      disabled={isClaimed}
                      className="px-3.5 py-1.5 bg-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-lg text-xs"
                    >
                      {isClaimed ? '✓ Đã Mở Khóa' : 'Khai Phá Nhiệm Vụ'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
