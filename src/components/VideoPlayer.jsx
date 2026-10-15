import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  FastForward, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Film,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function VideoPlayer({ 
  videoUrl, 
  title, 
  onVideoEnded, 
  hasCompletedVideo, 
  setHasCompletedVideo 
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Check if it's a YouTube / Vimeo / Drive URL
  const isYouTube = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  const isVimeo = videoUrl && videoUrl.includes('vimeo.com');
  const isDrive = videoUrl && videoUrl.includes('drive.google.com');

  // Convert YouTube standard URL to embed URL
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
      if (url.includes('drive.google.com/file/d/')) {
        const id = url.split('/d/')[1]?.split('/')[0];
        return `https://drive.google.com/file/d/${id}/preview`;
      }
    } catch (e) {
      console.warn('Cannot parse embed url', e);
    }
    return url;
  };

  useEffect(() => {
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [videoUrl, playbackRate]);

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative group">
      
      {/* Video Display Area */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
        {isYouTube || isVimeo || isDrive ? (
          <iframe
            src={getEmbedUrl(videoUrl)}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            controls
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              setHasCompletedVideo(true);
              if (onVideoEnded) onVideoEnded();
            }}
            onError={() => setVideoError(true)}
          />
        )}

        {/* Video Error Fallback */}
        {videoError && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <Film className="w-12 h-12 text-slate-500 mb-3" />
            <h5 className="font-semibold text-slate-200">Không thể tải luồng video</h5>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Đường dẫn video tạm thời chưa khả dụng hoặc định dạng không hỗ trợ. Bạn vẫn có thể xem tóm tắt và làm bài kiểm tra bên dưới.
            </p>
          </div>
        )}

        {/* Video Type Tag */}
        <div className="absolute top-3 right-3 flex items-center space-x-2 z-10 pointer-events-none">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-900/90 text-emerald-400 border border-slate-700/80 backdrop-blur-sm shadow-md">
            HD 1080p
          </span>
        </div>
      </div>

      {/* Video Sub-bar: Speed controls & Mark Finished */}
      <div className="bg-slate-900/95 px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Playback speed buttons (for HTML5 video) */}
        {!isYouTube && !isVimeo && (
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-400 mr-1 flex items-center font-medium">
              <FastForward className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Tốc độ:
            </span>
            {[1, 1.25, 1.5, 2].map((rate) => (
              <button
                key={rate}
                onClick={() => handleSpeedChange(rate)}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  playbackRate === rate
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        )}

        {/* Mark as Watched Button */}
        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => setHasCompletedVideo(!hasCompletedVideo)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              hasCompletedVideo
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${hasCompletedVideo ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{hasCompletedVideo ? 'Đã xem xong video' : 'Đánh dấu đã xem'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
