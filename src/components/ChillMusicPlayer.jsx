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
import { api } from '../services/api';
import AdminMusicModal from './AdminMusicModal';

// ICON ĐĨA THAN QUAY (VINYL RECORD ICON - CHUẨN MẪU CAO CẤP)
export function VinylRecordIcon({ isPlaying = false, isBuffering = false, className = 'w-5 h-5' }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${
        isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
      } ${isBuffering ? 'animate-pulse' : ''} ${className}`}
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customInputUrl, setCustomInputUrl] = useState('');
  const [customInputTitle, setCustomInputTitle] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('mapstudy_user') || localStorage.getItem('mapstudy_logged_in_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (
          u?.role === 'admin' ||
          u?.role === 'pro_sales' ||
          String(u?.email || '').toLowerCase().includes('admin') ||
          String(u?.username || '').toLowerCase().includes('admin') ||
          String(u?.name || '').toLowerCase().includes('quản trị')
        ) {
          setIsAdmin(true);
        }
      }
    } catch {}
  }, [isOpen]);

  const autoCollapseTimeoutRef = useRef(null);
  const prevTrackIdRef = useRef(state.currentTrackId);

  // Kích hoạt mở rộng tạm thời rồi tự động thu gọn (Apple Dynamic Island style)
  // Mặc định kéo dài 10 giây trên mobile để người dùng thao tác thoải mái
  const triggerTemporaryExpand = (duration = 10000) => {
    setIsExpanded(true);
    if (autoCollapseTimeoutRef.current) clearTimeout(autoCollapseTimeoutRef.current);
    autoCollapseTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, duration);
  };

  // Đăng ký lắng nghe thay đổi trạng thái từ musicService
  useEffect(() => {
    const unsubscribe = musicService.subscribe((newState) => {
      setState(newState);
      setCustomInputUrl(newState.customUrl || '');
      setCustomInputTitle(newState.customTitle || '');
    });
    return () => unsubscribe();
  }, []);

  // Tự động bung nhẹ thanh thông tin khi đổi bài mới trong lúc đang phát
  useEffect(() => {
    if (state.currentTrackId !== prevTrackIdRef.current) {
      prevTrackIdRef.current = state.currentTrackId;
      if (state.isPlaying) {
        triggerTemporaryExpand(8000);
      }
    }
  }, [state.currentTrackId, state.isPlaying]);

  // Dọn dẹp timer khi component unmount
  useEffect(() => {
    return () => {
      if (autoCollapseTimeoutRef.current) clearTimeout(autoCollapseTimeoutRef.current);
    };
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
    const willPlay = !state.isPlaying;
    musicService.togglePlay();
    if (willPlay) {
      triggerTemporaryExpand(10000);
    }
  };

  // Chạm trực tiếp vào Đĩa than trên Mobile / Desktop:
  // - Khi thanh đang thu gọn: Bung thanh ngay lập tức + phát nhạc nếu đang tắt
  // - Khi thanh đang mở: Chuyển đổi Bật / Tạm dừng
  const handleDiscClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!isExpanded) {
      setIsExpanded(true);
      if (!state.isPlaying) {
        musicService.play();
      }
      triggerTemporaryExpand(12000);
    } else {
      const willPlay = !state.isPlaying;
      musicService.togglePlay();
      triggerTemporaryExpand(willPlay ? 10000 : 4000);
    }
  };

  const handleMouseEnter = () => {
    if (autoCollapseTimeoutRef.current) clearTimeout(autoCollapseTimeoutRef.current);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (autoCollapseTimeoutRef.current) clearTimeout(autoCollapseTimeoutRef.current);
    autoCollapseTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 2500);
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

  const handleAdminDeleteTrack = async (trackId, trackTitle) => {
    if (!window.confirm(`Xác nhận xóa bài hát "${trackTitle}" khỏi hệ thống?`)) return;
    try {
      const res = await api.music.deleteTrack(trackId);
      if (res && res.success) {
        await musicService.reloadTracks();
      }
    } catch (err) {
      alert(`Lỗi xóa bài hát: ${err.message}`);
    }
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
                {state.tracks?.length || 32} bài • Điệp khúc
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Cắt thẳng vào điệp khúc • Bấm 1 chạm là nghe ngay
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white text-[10px] font-black flex items-center space-x-1 transition-all cursor-pointer shadow-2xs border border-amber-500/30"
              title="Quản trị kho nhạc & AI bóc tách điệp khúc (Admin)"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Up Nhạc AI</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            title="Đóng bảng nhạc"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Thanh bài hát đang phát (Now Playing Strip) - Nhỏ gọn, điều khiển nhanh */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-950/40 dark:to-indigo-950/40 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer active:scale-95 transition-transform"
            title={state.isBuffering ? 'Đang kết nối...' : state.isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
          >
            {state.isBuffering ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : state.isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>
          <div className="min-w-0">
            <p className="text-xs font-black text-slate-900 dark:text-white truncate leading-tight">
              {state.isBuffering ? '⏳ Đang kết nối bài hát...' : current.title}
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
            {isAdmin ? (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-amber-800 dark:text-amber-300">
                    👑 Quản Trị Kho Nhạc Hệ Thống
                  </p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400">
                    AI tự động tách Playlist & Điệp khúc cho toàn bộ học viên.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black shadow-xs shrink-0 cursor-pointer"
                >
                  Mở Quản Trị AI
                </button>
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-[10.5px] text-slate-500 dark:text-slate-400">
                🔒 <strong>Lưu ý:</strong> Link dán tại đây chỉ lưu trên máy cá nhân. Chỉ <strong>Quản trị viên</strong> mới có quyền cập nhật nhạc chung cho toàn bộ học viên.
              </div>
            )}

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

                  <div className="flex items-center space-x-1 shrink-0">
                    {isAdmin && track.id !== 'custom' && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdminDeleteTrack(track.id, track.title);
                        }}
                        className="w-7 h-7 rounded-full hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer mr-0.5"
                        title="Xóa bài hát này khỏi hệ thống (Quản trị viên)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </span>
                    )}

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
    return (
      <>
        {isOpen && typeof document !== 'undefined' && createPortal(
          <div 
            data-modal-portal="true"
            className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-150 select-none"
            onClick={() => setIsOpen(false)}
          >
            <div 
              className="w-full sm:max-w-md max-h-[85vh] h-[640px] rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-left overflow-hidden pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:pb-0 animate-in slide-in-from-bottom duration-200 select-text"
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
        )}

        {/* MODAL QUẢN TRỊ KHO NHẠC DÀNH CHO QUẢN TRỊ VIÊN */}
        {isAdmin && (
          <AdminMusicModal
            isOpen={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
            onRefreshPlaylist={() => musicService.reloadTracks()}
          />
        )}
      </>
    );
  };

  // =========================================================================
  // BIẾN THỂ 1: FLOATING BUTTON (DYNAMIC ISLAND AUTO-COLLAPSE)
  // =========================================================================
  if (variant === 'floating') {
    return (
      <>
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`fixed bottom-36 lg:bottom-24 right-4 sm:right-6 z-40 flex items-center select-none group/player ${className}`}
        >
          {/* Thanh Điều Khiển Thu Gọn Tự Động (Dynamic Island Floating Capsule) */}
          <div 
            className={`transition-all duration-300 ease-out flex items-center overflow-hidden ${
              isExpanded 
                ? 'max-w-[calc(100vw-90px)] sm:max-w-[460px] opacity-100 translate-x-0 mr-2 pointer-events-auto' 
                : 'max-w-0 opacity-0 translate-x-3 pointer-events-none mr-0'
            }`}
          >
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl text-white text-[11px] font-bold shadow-2xl border border-white/20 dark:border-slate-700/80">
              
              {/* Tên bài đang phát & Chạm để mở modal 32 bài */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                }}
                className="flex items-center space-x-1.5 min-w-0 max-w-[110px] sm:max-w-[155px] text-left hover:text-cyan-300 transition-colors cursor-pointer group/title"
                title="Bấm để mở danh sách bài hát chi tiết"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  state.isBuffering
                    ? 'bg-amber-400 animate-ping'
                    : state.isPlaying
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-slate-500'
                }`} />
                <span className={`truncate ${state.isBuffering ? 'text-amber-300 font-semibold text-[10px]' : 'text-slate-200 group-hover/title:text-cyan-300'} transition-colors`}>
                  {state.isBuffering ? '⏳ Đang kết nối...' : current.title}
                </span>
              </button>

              {/* Nút lùi / tới bài nhanh */}
              <div className="flex items-center space-x-0.5 border-l border-slate-750 pl-1 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Bài trước"
                >
                  <SkipBack className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Bài tiếp theo"
                >
                  <SkipForward className="w-3 h-3" />
                </button>
              </div>

              {/* Thanh chỉnh âm lượng Mini tích hợp trực tiếp */}
              <div className="flex items-center space-x-1 border-l border-slate-750 pl-1 shrink-0">
                <button
                  type="button"
                  onClick={() => musicService.toggleMute()}
                  className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title={state.isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
                >
                  {state.isMuted || state.volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.isMuted ? 0 : state.volume}
                  onChange={(e) => {
                    handleVolumeChange(e);
                    if (autoCollapseTimeoutRef.current) clearTimeout(autoCollapseTimeoutRef.current);
                  }}
                  onTouchStart={() => {
                    if (autoCollapseTimeoutRef.current) clearTimeout(autoCollapseTimeoutRef.current);
                  }}
                  onMouseUp={() => triggerTemporaryExpand(10000)}
                  onTouchEnd={() => triggerTemporaryExpand(12000)}
                  className="w-12 sm:w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  title={`Âm lượng: ${Math.round(state.volume * 100)}%`}
                />
              </div>

              {/* Nút Kho 32 bài */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                }}
                className="px-2 py-0.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-[10px] font-extrabold border border-cyan-400/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
                title="Mở toàn bộ kho 32 bài"
              >
                32 bài ▾
              </button>

              {/* Nút thu gọn thủ công */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="w-5 h-5 rounded-full hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-0.5"
                title="Thu gọn"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Biểu tượng Đĩa than tròn — 1 Chạm là BẬT / TẮT NHẠC ngay lập tức */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={handleDiscClick}
              title={
                state.isBuffering
                  ? "Đang kết nối bài hát..."
                  : state.isPlaying
                  ? `Đang phát: ${current.title} — Bấm để TẮT NHẠC`
                  : `Bấm để BẬT NHẠC: ${current.title}`
              }
              aria-label={state.isPlaying ? "Tắt nhạc" : "Bật nhạc"}
              className={`group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 touch-manipulation ${
                state.isBuffering
                  ? 'bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 shadow-amber-950/50 ring-2 ring-amber-400/80 animate-pulse'
                  : state.isPlaying
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
                    <circle cx="24" cy="24" r="7.5" fill={state.isBuffering ? '#f59e0b' : state.isPlaying ? '#0284c7' : '#d97706'} />
                    <circle cx="24" cy="24" r="7" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                    
                    {/* Lỗ trục quay tâm */}
                    <circle cx="24" cy="24" r="2.2" fill="#ffffff" />
                  </svg>
                </div>

                {/* Equalizer Wave / Buffering Spinner / Pause Icon In Center */}
                {state.isBuffering ? (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-amber-300">
                    <span className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : state.isPlaying ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                      <div className="flex items-end space-x-0.5 h-3">
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

                {/* Status Dot: Amber (Buffering), Cyan (Playing), Slate (Paused) */}
                <span className={`absolute top-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#1a1715] shadow-xs ${
                  state.isBuffering
                    ? 'bg-amber-400 ring-1 ring-amber-300 animate-ping'
                    : state.isPlaying
                    ? 'bg-cyan-400 ring-1 ring-cyan-300 animate-pulse'
                    : 'bg-slate-400'
                }`} />

                {/* Floating Musical Notes when playing */}
                {state.isPlaying && !state.isBuffering && (
                  <>
                    <span className="absolute -top-1 -left-1 text-[11px] font-bold text-cyan-300 animate-bounce pointer-events-none">♪</span>
                    <span className="absolute -top-2 right-1 text-[10px] font-bold text-amber-300 animate-pulse pointer-events-none">♫</span>
                  </>
                )}

              </div>
            </button>
          </div>

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
              {state.tracks?.length || 32} bài ▾
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
          title={`Mở danh sách bài hát (${state.tracks?.length || 32} bài) & Chỉnh âm lượng`}
        >
          <SlidersHorizontal className="w-3 h-3" />
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {renderPortalModal()}
    </>
  );
}