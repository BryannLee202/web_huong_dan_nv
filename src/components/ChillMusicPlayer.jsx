import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  SlidersHorizontal, 
  X, 
  Link2, 
  Check, 
  Search, 
  Trash2,
  Music2
} from 'lucide-react';
import musicService from '../services/musicService';

// ICON ĐĨA THAN QUAY (VINYL RECORD ICON - CHUẨN MẪU NGƯỜI DÙNG YÊU CẦU)
function VinylRecordIcon({ isPlaying = false, className = '' }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full select-none ${
        isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-2xs" fill="none">
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

export default function ChillMusicPlayer({ variant = 'header', className = '' }) {
  const [state, setState] = useState(musicService.getState());
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [customInputUrl, setCustomInputUrl] = useState(state.customUrl || '');
  const [customInputTitle, setCustomInputTitle] = useState(state.customTitle || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const containerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = musicService.subscribe((newState) => {
      setState(newState);
      setCustomInputUrl(newState.customUrl || '');
      setCustomInputTitle(newState.customTitle || '');
    });
    return () => unsubscribe();
  }, []);

  // Đóng popover khi click ra ngoài trên Desktop
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // 1-Click: Bấm là phát ngay tại điệp khúc, bấm lần nữa là tạm dừng
  const handleTogglePlay = (e) => {
    e.stopPropagation();
    musicService.togglePlay();
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    musicService.nextTrack();
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
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

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      
      {/* =========================================================================
          1. NÚT CHÍNH: NÚT ĐĨA THAN "Bật nhạc ♪" CHUẨN 100% THEO HÌNH MẪU
          ========================================================================= */}
      <div className="inline-flex items-center rounded-full border border-slate-350 dark:border-slate-750 bg-white/95 dark:bg-slate-900/95 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs backdrop-blur-xs transition-all">
        
        {/* Nút Play/Pause 1-Click: Click là đĩa than quay và phát ngay điệp khúc */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className="group flex items-center space-x-1.5 pl-2 pr-2.5 py-1 text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
          title={
            state.isPlaying 
              ? `Đang phát: ${current.title} (${current.tag}) — Bấm để tắt` 
              : `Bật nhạc nền chill: ${current.title} — Bấm để phát ngay điệp khúc`
          }
          aria-label="Bật tắt nhạc nền"
        >
          {/* Icon Đĩa Than Xoay Tròn (Vinyl Record) */}
          <VinylRecordIcon isPlaying={state.isPlaying} />

          {/* Dòng chữ "Bật nhạc ♪" / "Tắt nhạc ♪" đúng chuẩn font & nốt nhạc của hình mẫu */}
          <span className="flex items-center space-x-1 text-xs font-medium text-slate-800 dark:text-slate-200">
            {state.isPlaying ? (
              <>
                <span className="hidden md:inline truncate max-w-[105px] font-bold text-blue-600 dark:text-blue-400">
                  {current.title.replace(/\(.*?\)/g, '').trim()}
                </span>
                <span className="md:hidden font-bold text-blue-600 dark:text-blue-400">Tắt nhạc</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold animate-pulse">♪</span>
              </>
            ) : (
              <>
                <span className="font-medium text-slate-700 dark:text-slate-300">Bật nhạc</span>
                <span className="text-slate-500 dark:text-slate-400">♪</span>
              </>
            )}
          </span>
        </button>

        {/* Vạch ngăn cách thanh thoát */}
        <span className="h-3.5 w-px bg-slate-200 dark:bg-slate-750"></span>

        {/* Nút mở danh sách bài hát & âm lượng */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(prev => !prev);
          }}
          className={`px-1.5 py-1 rounded-r-full transition-colors cursor-pointer relative ${
            isOpen
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
          title="Chọn bài hát (32 bài) & Chỉnh âm lượng"
          aria-label="Danh sách bài hát"
        >
          <SlidersHorizontal className="w-3 h-3" />
          {state.isPlaying && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900"></span>
          )}
        </button>
      </div>

      {/* =========================================================================
          2. GIAO DIỆN CHỌN BÀI HÁT GỌN GÀNG:
             - TRÊN MÁY TÍNH: Mini Popover thả xuống bên dưới nút (Không che khuất màn hình)
             - TRÊN ĐIỆN THOẠI: Bottom Sheet kéo từ dưới lên (Dễ bấm bằng ngón tay cái)
          ========================================================================= */}
      {isOpen && (
        <>
          {/* Backdrop mờ nhẹ (Chỉ hiện trên mobile để bấm ra ngoài tắt nhanh) */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-2xs z-40 sm:hidden animate-in fade-in duration-100"
            onClick={() => setIsOpen(false)}
          />

          <div 
            className={`
              z-50 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col text-left overflow-hidden transition-all
              /* Desktop: Mini Popover thanh lịch neo ngay góc phải nút nhạc */
              hidden sm:flex sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-[360px] sm:max-h-[460px] sm:rounded-2xl
              /* Mobile: Bottom Sheet ôm gọn từ cạnh dưới màn hình lên, cao vừa phải (68vh) */
              sm:hidden fixed inset-x-0 bottom-0 max-h-[68vh] rounded-t-3xl
            `}
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Thanh gạt nhỏ trên Mobile (Drag Handle Indicator) */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>

            {/* Header Mini: Gọn nhẹ với icon đĩa than */}
            <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-850/50">
              <div className="flex items-center space-x-2">
                <VinylRecordIcon isPlaying={state.isPlaying} />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Kho Nhạc Chill & Sát Hạch
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                  32 bài • Điệp khúc
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Đóng bảng nhạc"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Thanh bài hát đang phát (Now Playing Strip) - Nhỏ gọn, điều khiển nhanh */}
            <div className="px-3 py-2 bg-blue-50/70 dark:bg-blue-950/30 border-b border-blue-100/70 dark:border-blue-900/30 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2 min-w-0 pr-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer active:scale-95 transition-transform"
                  title={state.isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
                >
                  {state.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                </button>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                    {current.title}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight">
                    🎯 {current.tag}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                  title="Bài trước"
                >
                  <SkipBack className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                  title="Bài tiếp theo"
                >
                  <SkipForward className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Tabs chọn danh mục (Gọn đẹp, thanh cuộn ngang mượt) */}
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-1 overflow-x-auto no-scrollbar shrink-0">
              {state.categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    activeTab === cat.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Ô tìm kiếm nhanh (Chỉ hiện khi xem danh sách bài hát) */}
            {activeTab !== 'custom' && (
              <div className="px-2.5 pt-2 pb-1 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Gõ tên bài hát (VD: Thủy chung, Chia tay, Kahoot)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
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

            {/* Danh sách bài hát thu gọn & tinh tế (Slim Density List) */}
            <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-0.5 custom-scrollbar">
              {activeTab === 'custom' ? (
                /* Tab Dán link riêng */
                <form onSubmit={handleSaveCustom} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-2.5 text-xs">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                    <Link2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dán Link YouTube Hoặc MP3 Bất Kỳ:</span>
                  </div>

                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... hoặc mp3 link"
                    value={customInputUrl}
                    onChange={(e) => setCustomInputUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Tên bài hát hiển thị (tùy chọn)"
                    value={customInputTitle}
                    onChange={(e) => setCustomInputTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />

                  <div className="flex items-center justify-between pt-1">
                    {state.customUrl && (
                      <button
                        type="button"
                        onClick={handleClearCustom}
                        className="text-[11px] text-rose-500 hover:text-rose-600 font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Gỡ link</span>
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={!customInputUrl.trim()}
                      className="ml-auto px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-[11px] font-bold shadow-xs cursor-pointer flex items-center space-x-1 transition-all"
                    >
                      <Check className="w-3 h-3" />
                      <span>{saveSuccess ? 'Đã lưu!' : 'Lưu & Phát'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Danh sách bài hát slim, bấm 1 chạm là nghe ngay */
                filteredTracks.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Không tìm thấy bài hát nào
                  </div>
                ) : (
                  filteredTracks.map((track, idx) => {
                    const isCurrent = state.currentTrackId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => handleSelectTrack(track.id)}
                        className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                            : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          {/* Trạng thái phát / Số thứ tự */}
                          <div className="w-4 h-4 flex items-center justify-center shrink-0">
                            {isCurrent && state.isPlaying ? (
                              <VinylRecordIcon isPlaying={true} className="!w-4 !h-4" />
                            ) : (
                              <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-600">
                                {(idx + 1).toString().padStart(2, '0')}
                              </span>
                            )}
                          </div>

                          {/* Tên bài và tag điệp khúc gọn gàng */}
                          <div className="min-w-0">
                            <p className="text-xs truncate leading-snug">
                              {track.title}
                            </p>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                              🎯 {track.tag}
                            </span>
                          </div>
                        </div>

                        {/* Nút Play nhỏ gọn */}
                        <div className="shrink-0">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isCurrent && state.isPlaying
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 group-hover:bg-blue-600 group-hover:text-white'
                          }`}>
                            {isCurrent && state.isPlaying ? (
                              <Pause className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3 ml-0.5" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )
              )}
            </div>

            {/* Footer Mini: Thanh chỉnh âm lượng nhỏ gọn */}
            <div className="px-3 py-2 bg-slate-50/80 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 text-xs">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => musicService.toggleMute()}
                  className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                  title={state.isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
                >
                  {state.isMuted || state.volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.isMuted ? 0 : state.volume}
                  onChange={handleVolumeChange}
                  className="w-20 sm:w-24 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  title="Âm lượng"
                />

                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 w-7">
                  {state.isMuted ? '0%' : `${Math.round(state.volume * 100)}%`}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
