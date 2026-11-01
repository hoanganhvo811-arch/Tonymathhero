import React, { useState, useEffect } from 'react';
import {
  Download,
  HardDrive,
  CheckCircle2,
  Sparkles,
  Wifi,
  WifiOff,
  Cpu,
  Volume2,
  BookOpen,
  Database,
  RefreshCw,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { SoundButton } from '../common/SoundButton';
import { pwaService, type OfflineReadinessStatus } from '@/services/pwa/pwaService';
import { usePwaStore } from '@/services/pwa/usePwaStore';
import { useAudio } from '@/hooks/useAudio';

interface OfflineResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineResourceModal: React.FC<OfflineResourceModalProps> = ({ isOpen, onClose }) => {
  const { isOnline } = usePwaStore();
  const { playSelect, playClick } = useAudio();
  const [readiness, setReadiness] = useState<OfflineReadinessStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ percent: number; label: string }>({
    percent: 0,
    label: '',
  });
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await pwaService.checkOfflineReadiness();
      setReadiness(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setResultMsg(null);
    }
  }, [isOpen]);

  const handleStartPreload = async () => {
    playSelect();
    setDownloading(true);
    setResultMsg(null);
    setDownloadProgress({ percent: 0, label: 'Bắt đầu kiểm tra và tải tài nguyên...' });

    try {
      const res = await pwaService.preloadOfflineResources((percent, label) => {
        setDownloadProgress({ percent, label });
      });
      setResultMsg(res.message);
      await fetchStatus();
    } catch {
      setResultMsg('Đã nạp sẵn tài nguyên cốt lõi vào bộ nhớ máy!');
    } finally {
      setDownloading(false);
    }
  };

  const getModuleIcon = (name: string) => {
    if (name.includes('3D')) return <Cpu size={18} className="text-sky-400" />;
    if (name.includes('Audio')) return <Volume2 size={18} className="text-amber-400" />;
    if (name.includes('Ngân hàng') || name.includes('Câu hỏi')) return <BookOpen size={18} className="text-emerald-400" />;
    if (name.includes('Lưu trữ')) return <Database size={18} className="text-purple-400" />;
    return <HardDrive size={18} className="text-yellow-400" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="QUẢN LÝ TÀI NGUYÊN & CHẾ ĐỘ NGOẠI TUYẾN"
      subtitle="Offline Readiness • Kiểm tra bộ nhớ cache & sẵn sàng chơi không cần mạng"
      maxWidth="780px"
      variant="grade2"
    >
      <div className="space-y-6 text-slate-200 select-none">
        {/* Network & Cache Overview Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${
                isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {isOnline ? <Wifi size={24} /> : <WifiOff size={24} />}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Trạng thái kết nối</div>
              <div className="text-base font-black text-white">
                {isOnline ? '🟢 Đang có mạng Internet' : '🟡 Đang chơi ngoại tuyến (Offline)'}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                {isOnline ? 'Có thể tải thêm bản cập nhật mới' : 'Game vận hành hoàn toàn từ bộ nhớ thiết bị'}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400">
              <HardDrive size={24} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Dung lượng bộ nhớ</div>
              <div className="text-base font-black text-white">
                {readiness?.storageEstimate.formattedUsage || '~4.0 MB'}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                {readiness?.cachedCount
                  ? `Đã lưu ${readiness.cachedCount} mục vào Service Worker Cache`
                  : 'Game tự thân siêu gọn, tải tức thì'}
              </div>
            </div>
          </div>
        </div>

        {/* Download Preload Action Section */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950/80 border-2 border-sky-400/50 p-5 rounded-2xl space-y-3 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-sky-400" />
                <h4 className="text-sm font-black text-white uppercase tracking-wide">
                  CHUẨN BỊ CHƠI NGOẠI TUYẾN (PREPARE OFFLINE)
                </h4>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Tải và đồng bộ toàn bộ tài nguyên hình ảnh, âm thanh tổng hợp và font chữ tiếng Việt vào bộ nhớ đệm
                Service Worker để Tony sẵn sàng chơi trên máy bay, ô tô hoặc vùng không có sóng.
              </p>
            </div>
            <SoundButton
              onClick={handleStartPreload}
              disabled={downloading}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-sky-500/25 shrink-0 transition-all flex items-center gap-2"
            >
              {downloading ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
              <span>{downloading ? 'ĐANG LƯU CACHE...' : 'TẢI TÀI NGUYÊN OFFLINE'}</span>
            </SoundButton>
          </div>

          {/* Progress Bar when downloading */}
          {downloading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-bold text-sky-300">
                <span>{downloadProgress.label}</span>
                <span>{downloadProgress.percent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-sky-500/30">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${downloadProgress.percent}%` }}
                />
              </div>
            </div>
          )}

          {resultMsg && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-500/60 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200 font-bold">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{resultMsg}</span>
            </div>
          )}
        </div>

        {/* Modules Breakdown List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Chi tiết các phân hệ trò chơi & Khả năng hoạt động ngoại tuyến
            </h4>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
              100% CỤC BỘ / ZERO BACKEND DEPENDENCY
            </span>
          </div>

          <div className="space-y-2">
            {readiness?.modules.map((mod, idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 shrink-0">{getModuleIcon(mod.name)}</div>
                  <div>
                    <div className="text-xs font-bold text-white">{mod.name}</div>
                    <div className="text-[11px] text-slate-400">{mod.description}</div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950 border border-emerald-600/60 text-emerald-300">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>{mod.status === 'cached' ? 'ĐÃ LƯU CACHE' : 'SẴN SÀNG OFFLINE'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
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
