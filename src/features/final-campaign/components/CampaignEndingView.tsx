import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinalCampaignStore } from '../useFinalCampaignStore';

export const CampaignEndingView: React.FC = () => {
  const navigate = useNavigate();
  const { currentGrade, setStage } = useFinalCampaignStore();

  const crystalElements = [
    { name: 'Ngọc Lam Khởi Nguyên', icon: '💎', color: 'from-blue-400 to-indigo-600' },
    { name: 'Ngọc Hổ Phách Thời Gian', icon: '⏳', color: 'from-amber-400 to-yellow-600' },
    { name: 'Ngọc Hải Vương Nhân Chia', icon: '🌊', color: 'from-cyan-400 to-teal-600' },
    { name: 'Ngọc Băng Giá Phân Số', icon: '❄️', color: 'from-sky-300 to-blue-500' },
    { name: 'Ngọc Thiết Sơn Hình Học', icon: '⛰️', color: 'from-emerald-400 to-green-600' },
    { name: 'Ngọc Hồng Ngọc Thương Mại', icon: '💰', color: 'from-rose-400 to-red-600' },
    { name: 'Đại Ngọc Trí Tuệ Vô Cực', icon: '🧠', color: 'from-purple-400 to-indigo-700' },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-yellow-400/60 text-white max-w-4xl mx-auto text-center space-y-8 relative overflow-hidden">
      {/* Background Radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />

      {/* Top Banner */}
      <div className="relative z-10">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-5xl shadow-2xl animate-bounce border-4 border-yellow-100">
          👑
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-amber-300 block mt-4">
          CHIẾN DỊCH HOÀN THÀNH • {currentGrade === 'grade-2' ? 'LỚP 2' : 'LỚP 3'}
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 mt-2 uppercase tracking-wide drop-shadow">
          MATH HERO – HUYỀN THOẠI BẢY VƯƠNG QUỐC
        </h1>
        <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto mt-2 font-medium">
          Lord Zero đã hoàn toàn bị khuất phục. Bảy Vương Quốc tràn ngập ánh bình minh rực rỡ và tiếng hát ca khải hoàn của muôn dân!
        </p>
      </div>

      {/* Restored 7 Knowledge Crystals Halo */}
      <div className="relative z-10 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-inner">
        <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">
          ✨ BẢY VIÊN NGỌC TRI THỨC ĐÃ ĐƯỢC PHỤC HỒI HOÀN TOÀN ✨
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {crystalElements.map((c, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl bg-gradient-to-br ${c.color} shadow-lg flex flex-col items-center justify-center text-center transform hover:scale-110 transition duration-300`}
            >
              <span className="text-2xl mb-1 drop-shadow">{c.icon}</span>
              <span className="text-[10px] font-black leading-tight text-white drop-shadow">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Card */}
      <div className="relative z-10 p-6 bg-gradient-to-r from-amber-500/10 via-yellow-500/20 to-amber-500/10 border-2 border-amber-400/50 rounded-2xl max-w-lg mx-auto">
        <span className="text-xs font-bold text-amber-300 uppercase block mb-1">
          DANH HIỆU TỐI THƯỢNG ĐƯỢC TRAO
        </span>
        <div className="text-2xl font-black text-yellow-300 mb-2">
          🌟 VỊ THẦN BẢO HỘ TOÁN HỌC 🌟
        </div>
        <p className="text-xs text-gray-300">
          Vinh danh Hiệp Sĩ Tony vì sự dũng cảm phi thường, lòng kiên trì và trí tuệ toán học xuất chúng trong suốt 21 giai đoạn lịch sử!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={() => setStage('hero_journey')}
          className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black rounded-2xl shadow-xl transition flex items-center gap-2"
        >
          <span>📜</span> Xem Hành Trình Tony's Hero Journey
        </button>

        <button
          onClick={() => setStage('endgame_hub')}
          className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-xl transition flex items-center gap-2"
        >
          <span>🌌</span> Khám Phá Nội Dung Endgame
        </button>

        <button
          onClick={() => navigate('/map')}
          className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition flex items-center gap-2"
        >
          <span>🗺️</span> Bản Đồ Thế Giới
        </button>
      </div>
    </div>
  );
};
