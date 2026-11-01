import React, { useState } from 'react';
import {
  Download,
  Share,
  PlusSquare,
  Smartphone,
  Monitor,
  CheckCircle2,
  Sparkles,
  Zap,
  WifiOff,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { SoundButton } from '../common/SoundButton';
import { usePwaStore } from '@/services/pwa/usePwaStore';
import { useAudio } from '@/hooks/useAudio';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const { canInstall, isInstalled, deviceInfo, promptInstall } = usePwaStore();
  const { playSelect, playClick } = useAudio();
  const [installing, setInstalling] = useState(false);
  const [installFeedback, setInstallFeedback] = useState<string | null>(null);

  const handleInstallClick = async () => {
    playSelect();
    setInstalling(true);
    setInstallFeedback(null);
    try {
      const accepted = await promptInstall();
      if (accepted) {
        setInstallFeedback('🎉 Chúc mừng! Bạn đã cài đặt Tony Math Hero thành công!');
      } else {
        setInstallFeedback('Bạn đã đóng bảng cài đặt. Bạn có thể cài lại bất cứ khi nào!');
      }
    } catch {
      setInstallFeedback('Trình duyệt chưa sẵn sàng cài đặt. Vui lòng thử lại sau giây lát.');
    } finally {
      setInstalling(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CÀI ĐẶT ỨNG DỤNG TONY MATH HERO (PWA)"
      subtitle="Chơi mượt mà trên Màn Hình Chính • Toàn màn hình • 100% Ngoại Tuyến"
      maxWidth="780px"
      variant="gold"
    >
      <div className="space-y-6 text-slate-200 select-none">
        {/* Hero Card Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 p-5 rounded-2xl border border-sky-400/40 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-4xl shadow-lg shrink-0 border-2 border-yellow-200">
            🛡️
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                PROGRESSIVE WEB APP
              </span>
              <span className="text-xs text-amber-300 font-bold">Không cần tải từ App Store / CH Play</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-wide">
              TONY MATH HERO – THE LEGEND OF SEVEN KINGDOMS
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Cài ứng dụng trực tiếp lên điện thoại, máy tính bảng hoặc máy tính để bàn để có trải nghiệm toàn màn hình đỉnh cao!
            </p>
          </div>
        </div>

        {/* Status: Already Installed */}
        {isInstalled ? (
          <div className="bg-emerald-950/80 border-2 border-emerald-400/80 p-5 rounded-2xl text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-black text-lg">
              <CheckCircle2 size={24} />
              <span>ỨNG DỤNG ĐÃ ĐƯỢC CÀI ĐẶT TRÊN THIẾT BỊ NÀY!</span>
            </div>
            <p className="text-xs text-emerald-200">
              Bạn có thể mở Tony Math Hero bất kỳ lúc nào từ Màn hình chính (Home Screen) hoặc Menu Ứng dụng.
            </p>
          </div>
        ) : (
          <>
            {/* Install Prompt for Supported Devices (Android, Chrome/Edge Desktop) */}
            {canInstall && (
              <div className="bg-gradient-to-r from-amber-950/60 to-yellow-950/40 border-2 border-amber-400 p-5 rounded-2xl text-center space-y-3 shadow-xl">
                <div className="text-amber-300 font-black text-base flex items-center justify-center gap-2">
                  <Sparkles size={18} className="animate-spin" />
                  <span>THIẾT BỊ CỦA BẠN ĐÃ SẴN SÀNG CÀI ĐẶT VỚI 1 CHẠM!</span>
                </div>
                <p className="text-xs text-amber-100">
                  Nhấn nút bên dưới để tạo biểu tượng Tony Math Hero trên màn hình chính:
                </p>
                <div className="pt-1">
                  <SoundButton
                    onClick={handleInstallClick}
                    disabled={installing}
                    className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg hover:shadow-amber-500/30 transform hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2.5"
                  >
                    <Download size={20} />
                    <span>{installing ? 'ĐANG KẾT NỐI TRÌNH DUYỆT...' : '📥 CÀI ĐẶT ỨNG DỤNG NGAY'}</span>
                  </SoundButton>
                </div>
              </div>
            )}

            {installFeedback && (
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-center text-xs text-amber-300 font-bold">
                {installFeedback}
              </div>
            )}

            {/* Platform Guides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* iOS Guide */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  deviceInfo.isIos
                    ? 'bg-sky-950/40 border-sky-400 shadow-lg shadow-sky-500/10'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone size={18} className="text-sky-400" />
                    <span className="font-black text-sm text-white">iPhone & iPad (Safari)</span>
                  </div>
                  {deviceInfo.isIos && (
                    <span className="text-[10px] bg-sky-500 text-white font-bold px-2 py-0.5 rounded-full">
                      Thiết bị này
                    </span>
                  )}
                </div>
                <ol className="text-xs text-slate-300 space-y-2 pl-4 list-decimal">
                  <li>
                    Mở trang web bằng trình duyệt <strong className="text-sky-300">Safari</strong> trên iPhone/iPad.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>
                      Nhấn vào biểu tượng <strong className="text-amber-300">Chia sẻ</strong>{' '}
                      <Share size={13} className="inline mx-0.5" /> (ở thanh dưới cùng Safari).
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>
                      Cuộn xuống và chọn{' '}
                      <strong className="text-amber-300">"Thêm vào Màn hình chính"</strong>{' '}
                      <PlusSquare size={13} className="inline mx-0.5" /> (Add to Home Screen).
                    </span>
                  </li>
                  <li>
                    Nhấn nút <strong className="text-emerald-400">"Thêm" (Add)</strong> ở góc trên bên phải.
                  </li>
                </ol>
              </div>

              {/* Android & Desktop Guide */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  deviceInfo.isAndroid || deviceInfo.isDesktop
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {deviceInfo.isAndroid ? (
                      <Smartphone size={18} className="text-emerald-400" />
                    ) : (
                      <Monitor size={18} className="text-emerald-400" />
                    )}
                    <span className="font-black text-sm text-white">
                      {deviceInfo.isAndroid ? 'Android (Chrome / Cốc Cốc)' : 'Máy tính PC & Laptop (Chrome / Edge)'}
                    </span>
                  </div>
                  {(deviceInfo.isAndroid || deviceInfo.isDesktop) && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                      Thiết bị này
                    </span>
                  )}
                </div>
                <ol className="text-xs text-slate-300 space-y-2 pl-4 list-decimal">
                  <li>
                    Trên thanh địa chỉ trình duyệt, nhấn biểu tượng{' '}
                    <strong className="text-emerald-300">Cài đặt ứng dụng</strong> (hình màn hình máy tính có mũi tên xuống).
                  </li>
                  <li>
                    Hoặc nhấn vào menu dấu <strong className="text-amber-300">3 chấm</strong> ở góc trên bên phải trình duyệt.
                  </li>
                  <li>
                    Chọn <strong className="text-emerald-300">"Cài đặt TONY MATH HERO..."</strong> hoặc{' '}
                    <strong className="text-emerald-300">"Thêm vào màn hình chính"</strong>.
                  </li>
                  <li>Xác nhận để ứng dụng được ghim ra Desktop / Màn hình điện thoại.</li>
                </ol>
              </div>
            </div>
          </>
        )}

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-sky-500/20 text-sky-400 shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-xs font-black text-white">Toàn Màn Hình</div>
              <div className="text-[11px] text-slate-400">Không bị vướng thanh URL, chơi rộng rãi như game app thật</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <WifiOff size={20} />
            </div>
            <div>
              <div className="text-xs font-black text-white">Chơi 100% Offline</div>
              <div className="text-[11px] text-slate-400">Không cần mạng Wi-Fi hay 4G sau khi cài đặt</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-xs font-black text-white">Tiến Trình An Toàn</div>
              <div className="text-[11px] text-slate-400">Dữ liệu nhân vật và trang bị tự lưu trên thiết bị</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <SoundButton
            onClick={() => {
              playClick();
              onClose();
            }}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Đóng Lại
          </SoundButton>
        </div>
      </div>
    </Modal>
  );
};
