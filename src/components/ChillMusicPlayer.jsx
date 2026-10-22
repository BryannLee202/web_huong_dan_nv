import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal, 
  Music2, 
  X, 
  Search, 
  Link2, 
  Trash2, 
  Check, 
  ChevronDown,
  Headphones,
  Sparkles
} from 'lucide-react';
import musicService from '../services/musicService';

// ICON ĐĨA THAN QUAY (VINYL RECORD ICON - CHUẨN MẪU CAO CẤP)
export function VinylRecordIcon({ isPlaying = false, className = 'w-5 h-5' }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${
        isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-2xs" fill="none">
        {/* Nền đĩa than màu đen tuyền cao cấp */}
        <circle cx="12" cy="12" r="11" className="fill-slate-900 dark:fill-slate-950 stroke-slate-750 dark:stroke-slate-600" strokeWidth="0.8" />
        
        {/* Rãnh đĩa ngoài (Groove ring 1) */}
        <circle cx="12" cy="12" r="8.2" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" strokeDasharray="1.2 1.2" />
        
        {/* Rãnh đĩa trong (Groove ring 2) */}
        <circle cx="12" cy="12" r="6" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
        
        {/* Vòng tâm nhãn đĩa màu đỏ mận/hồng rượu vintage chuẩn mẫu */}
        <circle cx="12" cy="12" r="3.6" className="fill-[#e11d48] dark:fill-blue-600" />
        
        {/* Lỗ trục quay màu trắng (Spindle hole) */}
        <circle cx="12" cy="12" r="1.1" className="fill-white" />
      </svg>
    </span>
  );
}

export default function ChillMusicPlayer({ variant = 'floating', className = '' }) {
  const [state, setState] = useState(musicService.getState());
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customInputUrl, setCustomInputUrl] = useState('');
  const [customInputTitle, setCustomInputTitle] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Đăng ký lắng nghe thay đổi trạng thái từ musicService
  useEffect(() => {
    const unsubscribe = musicService.subscribe((newState) => {
      setState(newState);
      setCustomInputUrl(newState.customUrl || '');
      setCustomInputTitle(newState.customTitle || '');
    });
    return () => unsubscribe();
  }, []);

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // 1-Click: Bấm là phát ngay tại điệp khúc, bấm lần nữa là tạm dừng
  const handleTogglePlay = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    musicService.togglePlay();
  };

  const handleNext = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    musicService.nextTrack();
  };

  const handlePrev = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    musicService.prevTrack();
  };

  const handleSelectTrack = (trackId) => {
    musicService.selectTrack(trackId, true);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    musicService.setVolume(val);
  };

  const handleSaveCustom = (e) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;
    musicService.setCustomLink(customInputUrl, customInputTitle);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleClearCustom = () => {
    musicService.clearCustomLink();
    setCustomInputUrl('');
    setCustomInputTitle('');
  };

  // Lọc bài hát theo tab danh mục và từ khóa tìm kiếm
  const filteredTracks = useMemo(() => {
    let list = state.tracks;
    if (activeTab !== 'all') {
      list = list.filter(t => t.category === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.mood && t.mood.toLowerCase().includes(q)) ||
        (t.tag && t.tag.toLowerCase().includes(q))
      );
    }
    return list;
  }, [state.tracks, activeTab, searchQuery]);

  const current = state.currentTrack;

  // =========================================================================
  // NỘI DUNG DANH SÁCH BÀI HÁT (Dùng chung trong Modal Portal)
  // =========================================================================
  const renderPlaylistBody = () => (
    <>
      {/* 1. Header Mini: Gọn nhẹ với icon đĩa than & nút đóng */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-850/60">
        <div className="flex items-center space-x-2.5">
          <VinylRecordIcon isPlaying={state.isPlaying} className="!w-6 !h-6" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Kho Nhạc Chill & Sát Hạch
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold">
                32 bài • Điệp khúc
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Cắt thẳng vào điệp khúc • Bấm 1 chạm là nghe ngay
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          title="Đóng bảng nhạc"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Thanh bài hát đang phát (Now Playing Strip) - Nhỏ gọn, điều khiển nhanh */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-950/40 dark:to-indigo-950/40 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer active:scale-95 transition-transform"
            title={state.isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
          >
            {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <div className="min-w-0">
            <p className="text-xs font-black text-slate-900 dark:text-white truncate leading-tight">
              {current.title}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold leading-tight mt-0.5">
              🎯 {current.tag || 'Điệp khúc cao trào'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Bài trước"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Bài tiếp theo"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Tabs chọn danh mục (Gọn đẹp, thanh cuộn ngang mượt) */}
      <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-1 overflow-x-auto no-scrollbar shrink-0">
        {state.categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveTab(cat.id)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeTab === cat.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4. Ô tìm kiếm nhanh (Chỉ hiện khi xem danh sách bài hát) */}
      {activeTab !== 'custom' && (
        <div className="px-3 pt-2 pb-1 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Gõ tên bài hát (VD: Thủy chung, Chia tay, Kahoot)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. Danh sách bài hát thu gọn & 100% chạm nhạy trên điện thoại */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar min-h-0">
        {activeTab === 'custom' ? (
          /* Tab Dán link riêng */
          <form onSubmit={handleSaveCustom} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <Link2 className="w-4 h-4 text-blue-600" />
              <span>Dán Link YouTube Hoặc MP3 Bất Kỳ:</span>
            </div>

            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=... hoặc mp3 link"
              value={customInputUrl}
              onChange={(e) => setCustomInputUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="Tên bài hát hiển thị (tùy chọn)"
              value={customInputTitle}
              onChange={(e) => setCustomInputTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />

            <div className="flex items-center justify-between pt-1">
              {state.customUrl && (
                <button
                  type="button"
                  onClick={handleClearCustom}
                  className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Gỡ link</span>
                </button>
              )}

              <button
                type="submit"
                disabled={!customInputUrl.trim()}
                className="ml-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{saveSuccess ? 'Đã lưu!' : 'Lưu & Phát'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Danh sách bài hát dạng button native, 100% chạm là ăn ngay trên mobile */
          filteredTracks.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Không tìm thấy bài hát nào
            </div>
          ) : (
            filteredTracks.map((track, idx) => {
              const isCurrent = state.currentTrackId === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTrack(track.id)}
                  className={`w-full text-left group flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all cursor-pointer active:scale-[0.98] ${
                    isCurrent
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/80 dark:border-blue-800 shadow-2xs'
                      : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {isCurrent && state.isPlaying ? (
                        <VinylRecordIcon isPlaying={true} className="!w-4 !h-4" />
                      ) : (
                        <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-blue-600">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs truncate leading-snug font-bold">
                        {track.title}
                      </p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        🎯 {track.tag}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isCurrent && state.isPlaying
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 group-hover:bg-blue-600 group-hover:text-white'
                    }`}>
                      {isCurrent && state.isPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )
        )}
      </div>

      {/* 6. Footer Mini: Thanh chỉnh âm lượng nhỏ gọn */}
      <div className="px-4 py-2.5 bg-slate-50/90 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => musicService.toggleMute()}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            title={state.isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
          >
            {state.isMuted || state.volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={state.isMuted ? 0 : state.volume}
            onChange={handleVolumeChange}
            className="w-24 sm:w-28 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            title="Âm lượng"
          />

          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 w-8">
            {state.isMuted ? '0%' : `${Math.round(state.volume * 100)}%`}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 font-bold text-xs text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
        >
          Xong
        </button>
      </div>
    </>
  );

  // =========================================================================
  // MODAL PLAYLIST PORTAL: GẮN TRỰC TIẾP VÀO DOCUMENT.BODY (CHỐNG KẸT CSS 100%)
  // =========================================================================
  const renderPortalModal = () => {
    if (!isOpen || typeof document === 'undefined') return null;

    return createPortal(
      <div 
        className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-150 select-none"
        onClick={() => setIsOpen(false)}
      >
        <div 
          className="w-full sm:max-w-md max-h-[85vh] h-[640px] rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-left overflow-hidden animate-in slide-in-from-bottom duration-200 select-text"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Thanh gạt nhỏ trên Mobile */}
          <div className="pt-2.5 pb-1 flex justify-center shrink-0 sm:hidden">
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>

          {renderPlaylistBody()}
        </div>
      </div>,
      document.body
    );
  };

  // =========================================================================
  // BIẾN THỂ 1: FLOATING BUTTON (ĐỒNG BỘ Y HỆT BIỂU TƯỢNG AI MASCOT)
  // =========================================================================
  if (variant === 'floating') {
    return (
      <>
        <div className={`fixed bottom-36 lg:bottom-24 right-4 sm:right-6 z-40 flex items-center space-x-2 select-none ${className}`}>
          
          {/* Thanh Pill hiển thị tên bài đang phát & Nút mở danh sách 32 bài */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            title="Bấm để mở danh sách 32 bài hát & chỉnh âm lượng"
            aria-label="Mở kho nhạc 32 bài"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md text-white text-[11px] font-bold shadow-xl border border-white/15 hover:border-cyan-400/60 transition-all cursor-pointer group active:scale-95"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${state.isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="max-w-[95px] sm:max-w-[140px] truncate text-slate-200 group-hover:text-cyan-300 transition-colors">
              {current.title}
            </span>
            <span className="text-[10px] text-cyan-400 font-extrabold shrink-0 border-l border-slate-700 pl-1.5">
              32 bài ▾
            </span>
          </button>

          {/* Biểu tượng Đĩa than tròn — 1 Chạm là BẬT / TẮT NHẠC ngay lập tức */}
          <button
            type="button"
            onClick={handleTogglePlay}
            title={state.isPlaying ? `Đang phát: ${current.title} — Bấm để TẮT NHẠC` : `Bấm để BẬT NHẠC: ${current.title}`}
            aria-label={state.isPlaying ? "Tắt nhạc" : "Bật nhạc"}
            className={`group relative w-13 h-13 sm:w-15 sm:h-15 rounded-full p-0.5 shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95 ${
              state.isPlaying
                ? 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 shadow-blue-950/50 ring-2 ring-cyan-400/40 hover:ring-cyan-400/90'
                : 'bg-gradient-to-tr from-slate-700 via-slate-600 to-slate-500 dark:from-slate-700 dark:to-slate-800 shadow-slate-950/40 ring-2 ring-slate-400/20 hover:ring-blue-400/60'
            }`}
          >
            {/* Core Vinyl Disc */}
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative overflow-hidden shadow-inner">
              
              {/* Realistic 3D Vinyl Turntable Disc */}
              <div className={`w-full h-full flex items-center justify-center ${state.isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`}>
                <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
                  {/* Nền đĩa than đen tuyền */}
                  <circle cx="24" cy="24" r="22" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
                  
                  {/* Rãnh âm thanh đa tầng (Groove rings) */}
                  <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="3 2" />
                  <circle cx="24" cy="24" r="14" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
                  <circle cx="24" cy="24" r="10.5" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" strokeDasharray="2 2" />
                  
                  {/* Vòng tâm nhãn đĩa mạ vàng sang trọng */}
                  <circle cx="24" cy="24" r="7.5" fill={state.isPlaying ? '#0284c7' : '#d97706'} />
                  <circle cx="24" cy="24" r="7" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                  
                  {/* Lỗ trục quay tâm */}
                  <circle cx="24" cy="24" r="2.2" fill="#ffffff" />
                </svg>
              </div>

              {/* Equalizer Wave / Pause Icon In Center When Playing */}
              {state.isPlaying ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                    <div className="flex items-end space-x-0.5 h-3.5">
                      <span className="w-0.5 sm:w-1 bg-cyan-300 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2.5" />
                      <span className="w-0.5 sm:w-1 bg-white rounded-full animate-[pulse_0.35s_ease-in-out_infinite] h-3.5" />
                      <span className="w-0.5 sm:w-1 bg-amber-300 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
                    </div>
                  </div>
                  {/* Overlay Pause khi hover hoặc chạm: Báo rõ bấm là Tắt nhạc */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-[1px] transition-opacity rounded-full text-white">
                    <Pause className="w-4 h-4 fill-white" />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-amber-400">
                  <Play className="w-4 h-4 ml-0.5 fill-amber-400 text-amber-400" />
                </div>
              )}

              {/* Green/Cyan Online Playing Indicator Dot */}
              <span className={`absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#1a1715] shadow-xs ${
                state.isPlaying
                  ? 'bg-cyan-400 ring-1 ring-cyan-300 animate-pulse'
                  : 'bg-slate-400'
              }`} />

              {/* Floating Musical Notes when playing */}
              {state.isPlaying && (
                <>
                  <span className="absolute -top-1 -left-1 text-[11px] font-bold text-cyan-300 animate-bounce pointer-events-none">♪</span>
                  <span className="absolute -top-2.5 right-1.5 text-[10px] font-bold text-amber-300 animate-pulse pointer-events-none">♫</span>
                </>
              )}

            </div>
          </button>

        </div>

        {renderPortalModal()}
      </>
    );
  }

  // =========================================================================
  // BIẾN THỂ 2: SIDEBAR MINI CARD (ĐẶT Ở CỘT SIDEBAR BÊN TRÁI CHO DESKTOP)
  // =========================================================================
  if (variant === 'sidebar') {
    return (
      <>
        <div className={`p-3 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/80 dark:from-slate-850 dark:to-slate-900 border border-blue-200/70 dark:border-slate-800 shadow-2xs ${className}`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5">
              <VinylRecordIcon isPlaying={state.isPlaying} className="!w-4 !h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Nhạc nền Chill & Sát hạch
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              32 bài ▾
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div 
              onClick={() => setIsOpen(true)}
              className="min-w-0 flex-1 pr-2 cursor-pointer group"
            >
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                {current.title}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                🎯 {current.tag}
              </p>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform"
                title={state.isPlaying ? 'Tạm dừng' : 'Bật nhạc'}
              >
                {state.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700"
                title="Bài tiếp theo"
              >
                <SkipForward className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {renderPortalModal()}
      </>
    );
  }

  // =========================================================================
  // BIẾN THỂ 3: COMPACT PILL (CHO QUIZ ENGINE HOẶC HEADER NẾU CẦN)
  // =========================================================================
  return (
    <>
      <div className={`inline-flex items-center rounded-full border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs backdrop-blur-xs transition-all ${className}`}>
        
        {/* Nút Play/Pause nhanh */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className="group flex items-center space-x-1.5 pl-2.5 pr-2 py-1 text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
          title={state.isPlaying ? `Đang phát: ${current.title} — Bấm để tắt` : `Bật nhạc nền chill: ${current.title}`}
        >
          <VinylRecordIcon isPlaying={state.isPlaying} />
          <span className="flex items-center space-x-1 text-xs font-medium text-slate-800 dark:text-slate-200">
            {state.isPlaying ? (
              <span className="font-bold text-blue-600 dark:text-blue-400">Tắt nhạc ♪</span>
            ) : (
              <span className="font-medium text-slate-700 dark:text-slate-300">Bật nhạc ♪</span>
            )}
          </span>
        </button>

        {/* Vạch ngăn cách */}
        <span className="h-3.5 w-px bg-slate-200 dark:bg-slate-750"></span>

        {/* Nút mở danh sách bài */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-1 px-2 py-1 rounded-r-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title="Mở danh sách bài hát (32 bài) & Chỉnh âm lượng"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {renderPortalModal()}
    </>
  );
}