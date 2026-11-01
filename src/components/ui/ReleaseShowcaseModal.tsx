import React from 'react';
import { Modal } from '../common/Modal';
import { SoundButton } from '../common/SoundButton';
import { Crown, Sparkles, BookOpen, Shield, Trophy, Map, Brain, Award, Star } from 'lucide-react';

interface ReleaseShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlaying?: () => void;
}

export const ReleaseShowcaseModal: React.FC<ReleaseShowcaseModalProps> = ({
  isOpen,
  onClose,
  onStartPlaying,
}) => {
  const kingdoms = [
    { name: 'Thảo Nguyên Arithmia', topic: 'Cộng trừ có nhớ 1000 & 100.000', icon: '🌱', color: 'from-emerald-500 to-green-700' },
    { name: 'Thành Cổ Chronos', topic: 'Xem giờ, ngày tháng & thời gian', icon: '⏳', color: 'from-amber-500 to-yellow-700' },
    { name: 'Vương Quốc Multiplex', topic: 'Bảng nhân 2-9 & bản chất phép nhân', icon: '✖️', color: 'from-blue-500 to-cyan-700' },
    { name: 'Vương Quốc Divisia', topic: 'Phép chia đều & quan hệ nhân chia', icon: '➗', color: 'from-indigo-500 to-purple-700' },
    { name: 'Thành Trì Geometria', topic: 'Hình học, chu vi, diện tích & đo lường', icon: '📐', color: 'from-teal-500 to-emerald-700' },
    { name: 'Thung Lũng Phân Số', topic: 'Khái niệm, so sánh & chia sẻ công bằng', icon: '🍕', color: 'from-orange-500 to-rose-700' },
    { name: 'Thần Điện Apex Aethelgard', topic: 'Toán lời văn 2 bước & Chung kết', icon: '👑', color: 'from-yellow-400 to-amber-600' },
  ];

  const highlights = [
    { title: '21 Phân Hệ Học Tập', desc: 'Bao quát toàn diện chương trình Toán Lớp 2 và Lớp 3 theo chuẩn năng lực hiện đại.', icon: '📚' },
    { title: 'Nhập Vai RPG 3D Đỉnh Cao', desc: 'Trải nghiệm chiến đấu với quái vật bằng kiến thức toán học, thu thập vũ khí và mở khóa vương quốc.', icon: '🛡️' },
    { title: 'Trí Não Thích Ứng (AI Brain)', desc: 'Tự động chẩn đoán lỗi sai, hỗ trợ gợi ý thông thái và cá nhân hóa lộ trình cho từng học sinh.', icon: '🧠' },
    { title: 'Đóng Gói 1 File HTML Độc Lập', desc: 'Chạy hoàn toàn offline mọi lúc mọi nơi mà không cần cài đặt phần mềm hay kết nối internet.', icon: '📦' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GIỚI THIỆU SẢN PHẨM – TONY MATH HERO"
      subtitle="The Legend of Seven Kingdoms • Phiên Bản Phát Hành Hoàn Thiện V2.2"
      maxWidth="820px"
      variant="gold"
    >
      <div className="space-y-6 text-gray-200 select-none">
        {/* Hero Banner Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 rounded-2xl border-2 border-amber-400/50 flex flex-col md:flex-row items-center gap-6 shadow-xl">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-6xl shadow-2xl shrink-0 border-2 border-yellow-200 animate-pulse">
            👦
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                OFFICIAL RELEASE
              </span>
              <span className="text-xs text-amber-300 font-bold">Dành Cho Trẻ Em Lớp 2 & Lớp 3</span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-wide">
              TONY MATH HERO – THE LEGEND OF SEVEN KINGDOMS
            </h3>
            <p className="text-xs md:text-sm text-gray-300 mt-2 leading-relaxed font-medium">
              Một kiệt tác game giáo dục nhập vai biến môn Toán thành cuộc phiêu lưu huyền thoại giải cứu Bảy Vương Quốc khỏi ách thống trị của Chúa Tể Hắc Ám Lord Zero!
            </p>
          </div>
        </div>

        {/* 4 Core Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 shadow-sm hover:border-amber-400/40 transition"
            >
              <span className="text-2xl shrink-0">{h.icon}</span>
              <div>
                <h4 className="font-black text-sm text-amber-300">{h.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Seven Kingdoms Showcase */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
            <span>🏰</span> BẢY VƯƠNG QUỐC TRONG THẾ GIỚI TONY MATH HERO:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {kingdoms.map((k, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-900 border border-white/15 shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{k.icon}</span>
                  <span className="text-[10px] font-bold text-gray-500">#{i + 1}</span>
                </div>
                <h5 className="font-extrabold text-xs text-white truncate">{k.name}</h5>
                <p className="text-[10px] text-indigo-300 mt-1 line-clamp-2">{k.topic}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Climax & Lord Zero */}
        <div className="p-4 bg-gradient-to-r from-purple-900/40 to-slate-950 border border-purple-500/30 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👿</span>
            <div>
              <span className="font-black text-sm text-purple-200 block">
                Chúa Tể Không Gian Hắc Ám: Lord Zero
              </span>
              <span className="text-xs text-gray-400">
                5 giai đoạn thử thách hội tụ toàn bộ tinh hoa tư duy, giải mã và phản biện toán học.
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="px-3 py-1 bg-amber-500/20 text-yellow-300 border border-amber-400/40 text-xs font-black rounded-lg">
              👑 MATH HERO
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-[11px] text-gray-500 font-medium">
            Phiên bản phát hành hoàn thiện • Bản quyền giáo dục toán Tony Hero
          </span>
          <div className="flex items-center gap-3">
            <SoundButton variant="secondary" size="sm" onClick={onClose}>
              Đóng Cửa Sổ
            </SoundButton>
            {onStartPlaying && (
              <SoundButton
                variant="fantasy-gold"
                size="sm"
                onClick={() => {
                  onClose();
                  onStartPlaying();
                }}
              >
                🚀 BẮT ĐẦU CHƠI NGAY!
              </SoundButton>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
