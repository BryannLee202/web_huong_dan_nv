import React, { useState, useEffect, useRef } from 'react';
import { 
  Headphones, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Settings, 
  X,
  Link2,
  Trash2,
  Check
} from 'lucide-react';
import musicService from '../services/musicService';

export default function ChillMusicPlayer({ variant = 'header', className = '' }) {
  const [state, setState] = useState(musicService.getState());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState(state.musicUrl || '');
  const [inputTitle, setInputTitle] = useState(state.musicTitle || '');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const unsubscribe = musicService.subscribe((newState) => {
      setState(newState);
      setInputUrl(newState.musicUrl || '');
      setInputTitle(newState.musicTitle || '');
    });
    return () => unsubscribe();
  }, []);

  // Đăng ký ref iframe với service
  useEffect(() => {
    if (iframeRef.current) {
      musicService.registerYouTubeIframe(iframeRef.current);
    }
  }, [state.youtubeId]);

  const handleTogglePlay = async (e) => {
    e.stopPropagation();
    const res = await musicService.togglePlay();
    if (res?.needsLink) {
      setIsModalOpen(true);
    }
  };

  const handleSaveLink = (e) => {
    e.preventDefault();
    musicService.setMusicLink(inputUrl.trim(), inputTitle.trim());
    setIsModalOpen(false);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleClearLink = () => {
    musicService.setMusicLink('', '');
    setInputUrl('');
    setInputTitle('');
    setIsModalOpen(false);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    musicService.setVolume(val);
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      
      {/* 1. NÚT BẬT / TẮT NHẠC CHÍNH 1-CLICK */}
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`group flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap shadow-2xs ${
          state.isPlaying
            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white ring-2 ring-blue-400/40 shadow-xs'
            : (state.hasLink
                ? 'bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/[0.08]'
                : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700')
        }`}
        title={
          state.isPlaying 
            ? `Đang phát: ${state.musicTitle} — Bấm để tắt` 
            : (state.hasLink 
                ? `Bật nhạc: ${state.musicTitle}` 
                : 'Chưa có link nhạc - Bấm để nhập link bạn gửi')
        }
        aria-label="Bật tắt nhạc nền"
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

        <span className="hidden sm:inline truncate max-w-[110px] font-semibold">
          {state.isPlaying 
            ? state.musicTitle 
            : (state.hasLink ? 'Nhạc Chill' : 'Cài Link Nhạc')}
        </span>
        <span className="sm:hidden text-[11px] font-bold">
          {state.isPlaying ? 'BẬT' : 'Nhạc'}
        </span>
      </button>

      {/* 2. NÚT CÀI ĐẶT LINK (Nhỏ gọn cạnh nút nhạc) */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="ml-0.5 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        title="Dán hoặc đổi link bài hát"
      >
        <Settings className="w-3 h-3" />
      </button>

      {/* 3. BACKGROUND YOUTUBE AUDIO IFRAME (ẨN HOÀN TOÀN TRONG NỀN KHI PHÁT YOUTUBE) */}
      {state.youtubeId && (
        <iframe
          ref={iframeRef}
          key={state.youtubeId}
          src={`https://www.youtube.com/embed/${state.youtubeId}?enablejsapi=1&autoplay=${state.isPlaying ? 1 : 0}&loop=1&playlist=${state.youtubeId}&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
          title="Background Music Player"
          className="absolute -top-[9999px] -left-[9999px] w-1 h-1 opacity-0 pointer-events-none"
          allow="autoplay"
        />
      )}

      {/* 4. MODAL DÁN LINK NHẠC (SẴN SÀNG KHI NGƯỜI DÙNG GỬI LINK) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 w-full max-w-md text-left relative">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Cài Đặt Link Nhạc Nền</h4>
                  <p className="text-[11px] text-slate-400">Dán link YouTube hoặc link file .mp3 bạn muốn nghe</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form nhập link */}
            <form onSubmit={handleSaveLink} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Đường dẫn bài hát (YouTube hoặc MP3 link):
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... hoặc link mp3"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 Hỗ trợ: Link YouTube bất kỳ, YouTube Music, hoặc link file audio trực tiếp.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tên hiển thị (Tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="VD: Nhạc Lofi Chốt Cọc / Nhạc Sát Hạch"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Điều chỉnh âm lượng */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  <span>Âm lượng phát:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{Math.round(state.volume * 100)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={state.isMuted ? 0 : state.volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                {state.hasLink && (
                  <button
                    type="button"
                    onClick={handleClearLink}
                    className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Gỡ link nhạc</span>
                  </button>
                )}

                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Lưu & Kích Hoạt</span>
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
