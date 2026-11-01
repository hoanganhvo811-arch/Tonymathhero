import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinalCampaignStore } from '../useFinalCampaignStore';
import { FinalAdaptiveEngine } from '../services/finalAdaptiveEngine';

export const HeroJourneySummaryView: React.FC = () => {
  const navigate = useNavigate();
  const { currentGrade, setStage } = useFinalCampaignStore();

  const stats = FinalAdaptiveEngine.aggregateHeroJourneyStats(currentGrade);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-amber-200 text-gray-800 max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="border-b pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-300">
            📜 TỔNG KẾT HÀNH TRÌNH HUYỀN THOẠI
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
            TONY'S HERO JOURNEY – BẢN HÙNG CA TOÁN HỌC
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Ghi nhận toàn bộ thành tích thực tế từ Phase 1 đến Phase 21 của Hiệp Sĩ Tony.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStage('endgame_hub')}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition"
          >
            Nội Dung Endgame ➔
          </button>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center shadow-sm">
          <div className="text-3xl mb-1">👑</div>
          <div className="text-2xl font-black text-amber-900">Cấp {stats.heroLevel}</div>
          <span className="text-[11px] font-bold text-amber-700 uppercase">Đẳng Cấp Hiệp Sĩ</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center shadow-sm">
          <div className="text-3xl mb-1">🏰</div>
          <div className="text-2xl font-black text-emerald-900">{stats.rescuedKingdomsCount}/7</div>
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Vương Quốc Giải Cứu</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-center shadow-sm">
          <div className="text-3xl mb-1">💎</div>
          <div className="text-2xl font-black text-blue-900">{stats.knowledgeCrystalsCount}/7</div>
          <span className="text-[11px] font-bold text-blue-700 uppercase">Ngọc Tri Thức</span>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl text-center shadow-sm">
          <div className="text-3xl mb-1">🎯</div>
          <div className="text-2xl font-black text-purple-900">{stats.mathAccuracyPercent}%</div>
          <span className="text-[11px] font-bold text-purple-700 uppercase">Độ Chính Xác Toán</span>
        </div>

        <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl text-center shadow-sm">
          <div className="text-3xl mb-1">⚔️</div>
          <div className="text-2xl font-black text-orange-900">{stats.totalBattlesWon}</div>
          <span className="text-[11px] font-bold text-orange-700 uppercase">Trận Thắng Chiến Trường</span>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-center shadow-sm">
          <div className="text-3xl mb-1">🐉</div>
          <div className="text-2xl font-black text-rose-900">{stats.totalBossesDefeated} Boss</div>
          <span className="text-[11px] font-bold text-rose-700 uppercase">Thủ Hộ Đã Khuất Phục</span>
        </div>

        <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl text-center shadow-sm">
          <div className="text-3xl mb-1">📜</div>
          <div className="text-2xl font-black text-teal-900">{stats.totalQuestsCompleted}</div>
          <span className="text-[11px] font-bold text-teal-700 uppercase">Nhiệm Vụ Hoàn Thành</span>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-center shadow-sm">
          <div className="text-3xl mb-1">🧠</div>
          <div className="text-2xl font-black text-indigo-900">{stats.masteredSkillsCount}</div>
          <span className="text-[11px] font-bold text-indigo-700 uppercase">Kỹ Năng Thành Thạo</span>
        </div>
      </div>

      {/* Memorable Milestones Timeline */}
      <div>
        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
          <span>🌟</span> Các Dấu Mốc Lịch Sử Đáng Nhớ:
        </h3>
        <div className="space-y-3">
          {stats.milestones.map((ms, idx) => (
            <div
              key={ms.id || idx}
              className="p-4 rounded-2xl border border-gray-200 bg-gray-50/70 hover:bg-white transition flex items-start gap-4 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                {ms.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-extrabold text-sm text-gray-900">{ms.titleVi}</h4>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {ms.dateAchievedVi}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{ms.descriptionVi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav Controls */}
      <div className="flex items-center justify-between border-t pt-4">
        <button
          onClick={() => setStage('campaign_completed_fanfare')}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
        >
          ⬅️ Về Lễ Khải Hoàn
        </button>
        <button
          onClick={() => navigate('/map')}
          className="px-6 py-2.5 rounded-xl font-black text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow transition flex items-center gap-2"
        >
          Vào Bản Đồ Thế Giới ➔
        </button>
      </div>
    </div>
  );
};
