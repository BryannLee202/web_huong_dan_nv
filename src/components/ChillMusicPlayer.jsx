import React, { useState, useEffect, useMemo } from 'react';
import { 
  Headphones, 
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
  Sparkles,
  Zap,
  Flame,
  Radio,
  Music2,
  Trash2
} from 'lucide-react';
import musicService from '../services/musicService';

export default function ChillMusicPlayer({ variant = 'header', className = '' }) {
  const [state, setState] = useState(musicService.getState());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [customInputUrl, setCustomInputUrl] = useState(state.customUrl || '');
  const [customInputTitle, setCustomInputTitle] = useState(state.customTitle || '');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = musicService.subscribe((newState) => {
      setState(newState);
      setCustomInputUrl(newState.customUrl || '');
      setCustomInputTitle(newState.customTitle || '');
    });
    return () => unsubscribe();
  }, []);

  // 1-Click: Bấm là phát, bấm lại là tắt
  const handleTogglePlay = (e) => {
    e.stopPropagation();
    musicService.togglePlay();
  };

  const handleNext = (e) => {
    e.stopPropagation();
    musicService.nextTrack();
  };

  const handlePrev = (e) => {
    e.stopPropagation();
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
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleClearCustom = () => {
    musicService.clearCustomLink();
    setCustomInputUrl('');
    setCustomInputTitle('');
  };

  // Lọc bài hát theo danh mục và từ khóa tìm kiếm
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
    <div className={`relative inline-flex items-center space-x-1 ${className}`}>
      
      {/* 1. NÚT CHÍNH: 1-CLICK BẬT / TẮT NHẠC */}
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`group flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap shadow-2xs ${
          state.isPlaying
            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white ring-2 ring-blue-400/40 shadow-xs animate-pulse-subtle'
            : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/[0.08]'
        }`}
        title={
          state.isPlaying 
            ? `Đang phát: ${current.title} (${current.tag}) — Bấm để dừng` 
            : `Bật nhạc nền chill: ${current.title} — Bấm để phát ngay đoạn điệp khúc`
        }
        aria-label="Bật tắt nhạc nền"
      >
        {state.isPlaying ? (
          <span className="flex items-end space-x-0.5 h-3.5 w-3.5" aria-hidden="true">
            <span className="w-0.5 bg-white rounded-full animate-music-bar-1 h-3"></span>
            <span className="w-0.5 bg-white rounded-full animate-music-bar-2 h-2"></span>
            <span className="w-0.5 bg-white rounded-full animate-music-bar-3 h-3.5"></span>
          </span>
        ) : (
          <Headphones className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
        )}

        {/* Tên bài hát hiển thị trên Desktop */}
        <span className="hidden sm:inline-block truncate max-w-[125px] font-semibold text-[11px] leading-tight">
          {state.isPlaying ? current.title.replace(/\(.*?\)/g, '').trim() : 'Nhạc Chill'}
        </span>

        {/* Nhãn rút gọn trên Mobile */}
        <span className="sm:hidden text-[11px] font-bold">
          {state.isPlaying ? 'ĐANG PHÁT' : 'NHẠC'}
        </span>
      </button>

      {/* 2. NÚT CHUYỂN BÀI KẾ TIẾP NHANH (Hiển thị khi đang phát trên desktop) */}
      {state.isPlaying && (
        <button
          type="button"
          onClick={handleNext}
          className="hidden md:flex p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all cursor-pointer"
          title="Chuyển sang bài tiếp theo (Vào ngay điệp khúc)"
        >
          <SkipForward className="w-3 h-3" />
        </button>
      )}

      {/* 3. NÚT MỞ DANH SÁCH BÀI HÁT & CÀI ĐẶT */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all cursor-pointer relative"
        title="Danh sách 32 bài hát chọn lọc & Cài đặt âm lượng"
        aria-label="Danh sách nhạc nền"
      >
        <SlidersHorizontal className="w-3 h-3" />
        {state.isPlaying && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900 animate-ping"></span>
        )}
      </button>

      {/* 4. MODAL DANH SÁCH 32 BÀI HÁT TÁCH RỜI & CẮT ĐIỆP KHÚC */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col text-left overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-850/40 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      Kho Nhạc Chill & Sát Hạch
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
                      32 Bài • Chuẩn Điệp Khúc
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Đã tách thành từng bài riêng biệt, lọc trùng lặp và cắt thẳng vào đoạn điệp khúc bốc nhất.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Now Playing Bar (Nếu đang phát hoặc có bài đã chọn) */}
            <div className="px-4 py-3 bg-blue-50/80 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer active:scale-95 transition-transform"
                >
                  {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                      {state.isPlaying ? 'ĐANG PHÁT' : 'ĐÃ CHỌN'}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                      {current.tag}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {current.title}
                  </p>
                </div>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Bài trước"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Bài tiếp"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3 shrink-0">
              {/* Category Tabs */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                {state.categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveTab(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
                      activeTab === cat.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Bar (Ẩn khi ở tab custom) */}
              {activeTab !== 'custom' && (
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên bài hát (VD: Thủy Chung, Chia Tay, Kahoot, Vết Thương)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
              {activeTab === 'custom' ? (
                /* Tab Dán link riêng */
                <form onSubmit={handleSaveCustom} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3.5">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-bold text-xs">
                    <Link2 className="w-4 h-4 text-blue-600" />
                    <span>Dán Link YouTube Hoặc MP3 Bất Kỳ Của Bạn</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Đường dẫn URL:
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... hoặc link mp3"
                      value={customInputUrl}
                      onChange={(e) => setCustomInputUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Tên bài hát (tùy chọn):
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Nhạc Chiến Bán Hàng / Nhạc Tập Trung Cao Độ"
                      value={customInputTitle}
                      onChange={(e) => setCustomInputTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {state.customUrl && (
                      <button
                        type="button"
                        onClick={handleClearCustom}
                        className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Gỡ link riêng</span>
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={!customInputUrl.trim()}
                      className="ml-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{copiedSuccess ? 'Đã Lưu Thành Công!' : 'Lưu & Phát Ngay'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Danh sách bài hát tách rời */
                <div className="space-y-1.5">
                  {filteredTracks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Không tìm thấy bài hát nào phù hợp với từ khóa "{searchQuery}"
                    </div>
                  ) : (
                    filteredTracks.map((track, idx) => {
                      const isCurrent = state.currentTrackId === track.id;
                      return (
                        <div
                          key={track.id}
                          onClick={() => handleSelectTrack(track.id)}
                          className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 ring-1 ring-blue-400/30'
                              : 'bg-white hover:bg-slate-50 dark:bg-slate-850 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-750'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 pr-2">
                            {/* Số thứ tự hoặc icon phát */}
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs">
                              {isCurrent && state.isPlaying ? (
                                <span className="flex items-end space-x-0.5 h-3 w-3">
                                  <span className="w-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-music-bar-1 h-3"></span>
                                  <span className="w-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-music-bar-2 h-2"></span>
                                  <span className="w-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-music-bar-3 h-3"></span>
                                </span>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                  {(idx + 1).toString().padStart(2, '0')}
                                </span>
                              )}
                            </div>

                            {/* Tên bài & Metadata */}
                            <div className="min-w-0">
                              <p className={`text-xs font-bold truncate ${
                                isCurrent 
                                  ? 'text-blue-700 dark:text-blue-300' 
                                  : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                              }`}>
                                {track.title}
                              </p>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                                  <span>🎯</span>
                                  <span>{track.tag}</span>
                                </span>
                                {track.mood && (
                                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                                    • {track.mood}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Badge danh mục & Nút play */}
                          <div className="flex items-center space-x-2 shrink-0">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                              {track.categoryName}
                            </span>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              isCurrent && state.isPlaying
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white'
                            }`}>
                              {isCurrent && state.isPlaying ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5 ml-0.5" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Footer: Volume Controller & Quick Status */}
            <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Volume Slider */}
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <button
                  type="button"
                  onClick={() => musicService.toggleMute()}
                  className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                  title={state.isMuted ? 'Bật lại âm thanh' : 'Tắt tiếng'}
                >
                  {state.isMuted || state.volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={state.isMuted ? 0 : state.volume}
                  onChange={handleVolumeChange}
                  className="w-24 sm:w-32 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  title="Âm lượng"
                />

                <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 w-8">
                  {state.isMuted ? '0%' : `${Math.round(state.volume * 100)}%`}
                </span>
              </div>

              {/* Status Note & Close Button */}
              <div className="flex items-center space-x-2 ml-auto">
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  ⚡ Phát ngầm không ngắt quãng
                </span>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
