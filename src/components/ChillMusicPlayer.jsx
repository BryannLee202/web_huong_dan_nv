import React, { useState, useEffect, useRef } from 'react';
import { 
  Headphones, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronDown, 
  Sparkles, 
  Music, 
  Plus, 
  X,
  ExternalLink
} from 'lucide-react';
import musicService, { DEFAULT_TRACKS } from '../services/musicService';

export default function ChillMusicPlayer({ variant = 'header', className = '', onOpenRecommendations }) {
  const [state, setState] = useState(musicService.getState());
  const [isOpen, setIsOpen] = useState(false);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const popoverRef = useRef(null);

  useEffect(() => {
    const unsubscribe = musicService.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  // Đóng popover khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    musicService.togglePlay();
  };

  const handleSelectTrack = (trackId) => {
    musicService.setTrack(trackId);
    if (!state.isPlaying) {
      musicService.play();
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    musicService.setVolume(val);
  };

  const handleAddTrack = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    musicService.addCustomTrack({
      title: customTitle.trim(),
      url: customUrl.trim()
    });
    setCustomTitle('');
    setCustomUrl('');
    setShowAddCustom(false);
  };

  // =========================================================================
  // GIAO DIỆN 1: DÀNH CHO PHÒNG THI SÁT HẠCH TRẮC NGHIỆM (QUIZ HEADER BAR)
  // =========================================================================
  if (variant === 'quiz') {
    return (
      <div className={`relative inline-flex items-center ${className}`} ref={popoverRef}>
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs ${
            state.isPlaying
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-2 ring-blue-400/40'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
          }`}
          title={state.isPlaying ? 'Đang phát nhạc nền tập trung - Bấm để tắt' : 'Bật nhạc nền thư giãn tập trung làm bài thi'}
        >
          {state.isPlaying ? (
            <span className="flex items-end space-x-0.5 h-3 w-3">
              <span className="w-0.5 bg-white rounded-full animate-music-bar-1 h-2.5"></span>
              <span className="w-0.5 bg-white rounded-full animate-music-bar-2 h-1.5"></span>
              <span className="w-0.5 bg-white rounded-full animate-music-bar-3 h-3"></span>
            </span>
          ) : (
            <Headphones className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          )}
          <span>{state.isPlaying ? 'Nhạc: Đang Bật' : 'Nhạc Làm Bài'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-1 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          title="Chọn thể loại nhạc hoặc chỉnh âm lượng"
        >
          <ChevronDown className="w-3 h-3" />
        </button>

        {isOpen && renderPopover()}
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN 2: DÀNH CHO THANH NAVBAR HEADER CHÍNH (ĐỒNG BỘ DESKTOP & MOBILE)
  // =========================================================================
  return (
    <div className={`relative inline-flex items-center ${className}`} ref={popoverRef}>
      {/* Nút bật/tắt nhạc chính 1-click */}
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`group flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap shadow-2xs ${
          state.isPlaying
            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white ring-2 ring-blue-400/40 shadow-xs'
            : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/[0.08]'
        }`}
        title={state.isPlaying ? `Đang phát: ${state.currentTrack.title} — Nhấp để tắt nhạc` : 'Nhấp để bật nhạc chill lúc học & làm việc'}
        aria-label="Bật tắt nhạc nền thư giãn"
      >
        {state.isPlaying ? (
          <span className="flex items-end space-x-0.5 h-3.5 w-3.5">
            <span className="w-0.5 bg-white rounded-full animate-music-bar-1 h-3"></span>
            <span className="w-0.5 bg-white rounded-full animate-music-bar-2 h-2"></span>
            <span className="w-0.5 bg-white rounded-full animate-music-bar-3 h-3.5"></span>
          </span>
        ) : (
          <Headphones className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
        )}

        <span className="hidden sm:inline truncate max-w-[95px] font-semibold">
          {state.isPlaying ? state.currentTrack.title : 'Nhạc Chill'}
        </span>
        <span className="sm:hidden text-[11px] font-bold">
          {state.isPlaying ? 'BẬT' : 'Nhạc'}
        </span>
      </button>

      {/* Nút mở rộng chọn danh sách bài & âm lượng */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="ml-0.5 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        title="Danh sách bài hát & Âm lượng"
      >
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* POPOVER PANEL ĐIỀU KHIỂN & CHỌN BÀI HÁT */}
      {isOpen && renderPopover()}
    </div>
  );

  function renderPopover() {
    return (
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Popover */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Music className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white">RMSA Chill & Focus Audio</h4>
              <p className="text-[10px] text-slate-400">Nhạc nền thư giãn khi làm việc & sát hạch</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thanh điều khiển chính (Play/Pause & Volume Slider) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 mb-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate flex items-center space-x-1.5">
              <span>{state.currentTrack.icon || '🎵'}</span>
              <span className="truncate">{state.currentTrack.title}</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold shrink-0">
              {state.isPlaying ? 'Đang phát' : 'Đang tạm dừng'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
              title={state.isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
            >
              {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />}
            </button>

            {/* Volume Icon & Slider */}
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => musicService.toggleMute()}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={state.isMuted ? 'Bật âm' : 'Tắt tiếng'}
              >
                {state.isMuted || state.volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={state.isMuted ? 0 : state.volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                title={`Âm lượng: ${Math.round(state.volume * 100)}%`}
              />
              <span className="text-[10px] font-mono text-slate-400 w-7 text-right shrink-0">
                {state.isMuted ? '0%' : `${Math.round(state.volume * 100)}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Danh sách thể loại & bài hát */}
        <div className="space-y-1.5 max-h-52 overflow-y-auto no-scrollbar pr-0.5 mb-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1">
            Chọn danh sách phát:
          </div>

          {state.tracks.map((t) => {
            const isCur = t.id === state.currentTrack.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTrack(t.id)}
                className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start space-x-2.5 cursor-pointer ${
                  isCur
                    ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span className="text-base mt-0.5 shrink-0">{t.icon || '🎵'}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${isCur ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {t.title}
                    </span>
                    {isCur && state.isPlaying && (
                      <span className="flex items-end space-x-0.5 h-3 w-3 shrink-0">
                        <span className="w-0.5 bg-blue-600 rounded-full animate-music-bar-1 h-2.5"></span>
                        <span className="w-0.5 bg-blue-600 rounded-full animate-music-bar-2 h-1.5"></span>
                        <span className="w-0.5 bg-blue-600 rounded-full animate-music-bar-3 h-3"></span>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{t.genre}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer: Thêm bài hát riêng của bạn */}
        {showAddCustom ? (
          <form onSubmit={handleAddTrack} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-2">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Thêm bài hát mới:</div>
            <input
              type="text"
              placeholder="Tên bài hát (VD: Lofi Gác Lửng)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 outline-none"
              autoFocus
            />
            <input
              type="text"
              placeholder="Link file .mp3 hoặc để trống dùng Synth"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 outline-none"
            />
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Lưu Bài
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => setShowAddCustom(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm nhạc của bạn</span>
            </button>

            <span className="text-slate-400 text-[10px]">
              Tự động lặp lại êm ái
            </span>
          </div>
        )}

      </div>
    );
  }
}
