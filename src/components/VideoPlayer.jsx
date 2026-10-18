import React, { useRef, useState, useEffect } from 'react';
import { 
  CheckCircle, 
  FastForward, 
  Film,
  CheckCircle2,
  ListVideo,
  FileCheck2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function VideoPlayer({ 
  videoUrl, 
  title, 
  videos = [],
  onVideoEnded, 
  hasCompletedVideo, 
  setHasCompletedVideo,
  seekTime,
  isAdmin = false,
  onOpenVideoAdmin,
  onStartQuiz,
  onVideoStatusChange,
  currentUserName = '',
  currentUserEmail = ''
}) {
  const videoRef = useRef(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoError, setVideoError] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState({});

  // Chuẩn hóa danh sách video lý thuyết (chỉ tính các video có URL thực tế)
  const validVideos = Array.isArray(videos) ? videos.filter(v => Boolean(v && v.url && v.url.trim())) : [];
  const hasMultipleVideos = validVideos.length > 1;

  const videoList = validVideos.length > 0 
    ? validVideos 
    : [
        {
          id: 1,
          title: title || 'Lý thuyết trọng tâm & Khái niệm then chốt',
          url: videoUrl || '',
          type: 'direct',
          duration: '15:00'
        }
      ];

  const currentVideo = videoList[activeVideoIdx] || videoList[0] || {};
  const currentUrl = (currentVideo.url || videoUrl || '').trim();
  const hasValidVideo = Boolean(currentUrl) && !videoError;

  useEffect(() => {
    if (onVideoStatusChange) {
      onVideoStatusChange(hasValidVideo);
    }
  }, [hasValidVideo, onVideoStatusChange]);

  const isYouTube = currentUrl && (currentUrl.includes('youtube.com') || currentUrl.includes('youtu.be'));
  const isVimeo = currentUrl && currentUrl.includes('vimeo.com');
  const isDrive = currentUrl && currentUrl.includes('drive.google.com');

  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
      }
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URL(url).searchParams;
        const id = urlParams.get('v');
        return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
      }
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
      if (url.includes('drive.google.com/file/d/')) {
        const id = url.split('/d/')[1]?.split('/')[0]?.split('?')[0];
        return `https://drive.google.com/file/d/${id}/preview`;
      }
      if (url.includes('drive.google.com/open?id=')) {
        const id = new URL(url).searchParams.get('id');
        return `https://drive.google.com/file/d/${id}/preview`;
      }
    } catch (e) {
      console.warn('Cannot parse embed url', e);
    }
    return url;
  };

  useEffect(() => {
    if (videoRef.current && hasValidVideo) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [currentUrl, playbackRate, hasValidVideo]);

  useEffect(() => {
    if (typeof seekTime === 'number' && videoRef.current && hasValidVideo) {
      videoRef.current.currentTime = seekTime;
      videoRef.current.play().catch(() => {});
    }
  }, [seekTime, hasValidVideo]);

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleVideoCompleted = () => {
    setWatchedVideos(prev => ({ ...prev, [activeVideoIdx]: true }));
    if (activeVideoIdx === videoList.length - 1 || Object.keys(watchedVideos).length + 1 >= videoList.length) {
      setHasCompletedVideo(true);
    }
    if (onVideoEnded) onVideoEnded();
  };

  return (
    <div className="bg-white dark:bg-[#1a1715] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/[0.08] shadow-sm transition-colors duration-200">
      
      {/* 1. THANH CHỌN NHIỀU PHẦN VIDEO (Chỉ hiển thị khi có từ 2 video hợp lệ trở lên) */}
      {hasMultipleVideos && (
        <div className="bg-slate-50 dark:bg-[#151312] px-4 py-3 border-b border-slate-200/90 dark:border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <ListVideo className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-amber-100 uppercase tracking-wider">
                Video Lý Thuyết Chuyên Đề ({videoList.length} phần)
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-stone-400">
              Đang phát phần {activeVideoIdx + 1}/{videoList.length}
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {videoList.map((vid, idx) => {
              const isActive = activeVideoIdx === idx;
              const isWatched = watchedVideos[idx];
              return (
                <button
                  key={vid.id || idx}
                  onClick={() => {
                    setActiveVideoIdx(idx);
                    setVideoError(false);
                  }}
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 dark:border-amber-400 shadow-xs'
                      : 'bg-white dark:bg-[#24201e] border-slate-200 dark:border-white/[0.06] hover:border-amber-400/60 dark:hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-stone-400'
                    }`}>
                      Phần 0{idx + 1}
                    </span>
                    {isWatched ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="text-[9px] text-slate-400 dark:text-stone-500">{vid.duration || 'Lý thuyết'}</span>
                    )}
                  </div>
                  <p className={`text-xs font-bold line-clamp-1 leading-snug ${
                    isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-stone-300'
                  }`}>
                    {vid.title || `Phần ${idx + 1}: Lý thuyết`}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. KHUNG PHÁT VIDEO / GIAO DIỆN CHỜ HOÀN THIỆN TINH TẾ */}
      {hasValidVideo ? (
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
          {isYouTube || isVimeo || isDrive ? (
            <iframe
              key={currentUrl}
              src={getEmbedUrl(currentUrl)}
              title={currentVideo.title || title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              key={currentUrl}
              ref={videoRef}
              src={currentUrl}
              className="w-full h-full object-contain"
              controls
              playsInline
              onEnded={handleVideoCompleted}
              onLoadedData={() => setVideoError(false)}
              onError={() => setVideoError(true)}
            />
          )}

          {/* Dynamic Internal Watermark - Chống quay trộm / phát tán nội dung nội bộ */}
          <div className="absolute bottom-3 left-3 pointer-events-none z-20 opacity-30 select-none text-[9px] sm:text-[10px] font-mono text-white/90 drop-shadow-md">
            RMSA Internal • {currentUserName || 'Học viên'} {currentUserEmail ? `(${currentUserEmail})` : ''}
          </div>

          <div className="absolute top-3 right-3 pointer-events-none flex items-center space-x-1.5 z-20">
            {isDrive && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600/80 text-white backdrop-blur-xs">
                Google Drive
              </span>
            )}
            {isYouTube && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/80 text-white backdrop-blur-xs">
                YouTube HD
              </span>
            )}
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
              1080p Full HD
            </span>
          </div>
        </div>
      ) : (
        /* GIAO DIỆN THAY THẾ KHI CHƯA CÓ VIDEO: SANG TRỌNG, CHUYÊN NGHIỆP, RÕ RÀNG */
        <div className="relative min-h-[320px] sm:min-h-[380px] p-6 sm:p-10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-slate-900 via-slate-900 to-[#1e1b18] dark:from-[#181514] dark:via-[#1e1b18] dark:to-[#141211] text-white overflow-hidden">
          {/* Ambient Lighting & Grid Decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-xl flex flex-col items-center">
            {/* Badge Trạng Thái */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAdmin ? 'KHOANG QUẢN TRỊ BÀI HỌC' : 'CHUYÊN ĐỀ ĐANG BIÊN SOẠN BÀI GIẢNG VIDEO'}</span>
            </div>

            {/* Icon chính */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/5">
              <Film className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            </div>

            {/* Tiêu đề & Thông điệp */}
            <h4 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug mb-2">
              {isAdmin 
                ? 'Chuyên Đề Này Chưa Có Luồng Video' 
                : 'Bài Giảng Video Đang Được Hoàn Thiện'}
            </h4>
            
            <p className="text-xs sm:text-sm text-slate-300 dark:text-stone-300 leading-relaxed max-w-lg mb-6">
              {isAdmin ? (
                'Bạn đang đăng nhập với vai trò Quản Trị Viên. Hãy nhấn nút bên dưới để tải file video lên (không giới hạn dung lượng) hoặc liên kết video bài giảng từ YouTube / Google Drive.'
              ) : (
                'Ban Đào tạo đang ghi hình và tối ưu hóa bài giảng thực chiến chất lượng cao cho chuyên đề này. Bạn hãy đọc kỹ Tóm tắt kiến thức cốt lõi và hoàn thành bài kiểm tra sát hạch bên dưới để ghi nhận điểm số.'
              )}
            </p>

            {/* Action Buttons */}
            {isAdmin ? (
              onOpenVideoAdmin && (
                <button
                  type="button"
                  onClick={onOpenVideoAdmin}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
                >
                  <Film className="w-4 h-4 text-slate-950" />
                  <span>⚙️ Tải lên / Gắn Video Cho Chuyên Đề Này</span>
                </button>
              )
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {onStartQuiz && (
                  <button
                    type="button"
                    onClick={onStartQuiz}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Làm bài kiểm tra sát hạch ngay</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                )}
                
                <a
                  href="#tom-tat-noi-dung"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('tom-tat-noi-dung');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Đọc Tóm Tắt Cốt Lõi Bên Dưới</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. THANH ĐIỀU KHIỂN BÊN DƯỚI (VIDEO SUB-BAR) */}
      <div className="bg-slate-50/80 dark:bg-[#151312] px-4 py-3 border-t border-slate-200/90 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        {hasValidVideo && !isYouTube && !isVimeo ? (
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-500 dark:text-stone-400 mr-1 flex items-center font-medium">
              <FastForward className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Tốc độ:
            </span>
            {[1, 1.25, 1.5, 2].map((rate) => (
              <button
                key={rate}
                onClick={() => handleSpeedChange(rate)}
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  playbackRate === rate
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-white dark:bg-[#24201e] text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08]'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-stone-400">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Thời lượng học lý thuyết & tóm tắt: ~15 phút</span>
          </div>
        )}

        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => {
              const nextState = !hasCompletedVideo;
              setHasCompletedVideo(nextState);
              if (nextState) {
                setWatchedVideos(prev => ({ ...prev, [activeVideoIdx]: true }));
              }
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
              hasCompletedVideo
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-xs'
                : 'bg-white dark:bg-[#24201e] hover:bg-slate-50 dark:hover:bg-[#2e2926] text-slate-700 dark:text-stone-200 border-slate-300 dark:border-white/[0.12]'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${hasCompletedVideo ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
            <span>
              {hasCompletedVideo 
                ? (hasValidVideo ? 'Đã hoàn thành lý thuyết' : 'Đã nắm vững lý thuyết tóm tắt') 
                : (hasValidVideo ? 'Đánh dấu đã xem xong' : 'Đánh dấu đã đọc lý thuyết')}
            </span>
          </button>
        </div>
      </div>

    </div>
  );
}
