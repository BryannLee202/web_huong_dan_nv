import React, { useRef, useState, useEffect } from 'react';
import { 
  CheckCircle, 
  FastForward, 
  Film,
  CheckCircle2,
  ListVideo
} from 'lucide-react';

export default function VideoPlayer({ 
  videoUrl, 
  title, 
  videos = [],
  onVideoEnded, 
  hasCompletedVideo, 
  setHasCompletedVideo,
  seekTime
}) {
  const videoRef = useRef(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoError, setVideoError] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState({});

  // Chuẩn hóa danh sách video lý thuyết (tối đa 4 video hoặc mảng videos)
  const videoList = Array.isArray(videos) && videos.length > 0 
    ? videos 
    : [
        {
          id: 1,
          title: title || 'Lý thuyết trọng tâm & Khái niệm then chốt',
          url: videoUrl,
          type: 'direct',
          duration: '15:00'
        }
      ];

  const currentVideo = videoList[activeVideoIdx] || videoList[0] || {};
  const currentUrl = currentVideo.url || videoUrl || '';

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
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [currentUrl, playbackRate]);

  useEffect(() => {
    if (typeof seekTime === 'number' && videoRef.current) {
      videoRef.current.currentTime = seekTime;
      videoRef.current.play().catch(() => {});
    }
  }, [seekTime]);

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleVideoCompleted = () => {
    setWatchedVideos(prev => ({ ...prev, [activeVideoIdx]: true }));
    // Nếu đã xem hết các video hoặc là video cuối
    if (activeVideoIdx === videoList.length - 1 || Object.keys(watchedVideos).length + 1 >= videoList.length) {
      setHasCompletedVideo(true);
    }
    if (onVideoEnded) onVideoEnded();
  };

  return (
    <div className="bg-white dark:bg-[#1f1c1a] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/[0.08] shadow-sm transition-colors duration-200">
      
      {/* 1. THANH CHỌN 4 VIDEO LÝ THUYẾT (Nếu chuyên đề có nhiều hơn 1 video) */}
      {videoList.length > 1 && (
        <div className="bg-slate-50 dark:bg-[#171514] px-4 py-3 border-b border-slate-200/90 dark:border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <ListVideo className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-amber-100 uppercase tracking-wider">
                4 Video Lý Thuyết Chuyên Đề ({videoList.length} phần)
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
                      : 'bg-white dark:bg-[#262220] border-slate-200 dark:border-white/[0.06] hover:border-amber-400/60 dark:hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-stone-400'
                    }`}>
                      Video 0{idx + 1}
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

      {/* 2. Video Display Stage */}
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

        {videoError && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <Film className="w-10 h-10 text-amber-500 mb-2" />
            <h5 className="font-semibold text-slate-100 text-sm">Không thể tải luồng video</h5>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Đường dẫn video tạm thời chưa khả dụng hoặc đang cập nhật. Bạn có thể xem tóm tắt nội dung và làm bài trắc nghiệm bên dưới.
            </p>
          </div>
        )}

        <div className="absolute top-3 right-3 pointer-events-none flex items-center space-x-1.5">
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

      {/* 3. Video Sub-bar: Speed controls & Mark Finished */}
      <div className="bg-slate-50/80 dark:bg-[#1a1716] px-4 py-3 border-t border-slate-200/90 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        {!isYouTube && !isVimeo && (
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
                    : 'bg-white dark:bg-[#262220] text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08]'
                }`}
              >
                {rate}x
              </button>
            ))}
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
                : 'bg-white dark:bg-[#262220] hover:bg-slate-50 dark:hover:bg-[#302b28] text-slate-700 dark:text-stone-200 border-slate-300 dark:border-white/[0.12]'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${hasCompletedVideo ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
            <span>{hasCompletedVideo ? 'Đã hoàn thành lý thuyết' : 'Đánh dấu đã xem xong'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
