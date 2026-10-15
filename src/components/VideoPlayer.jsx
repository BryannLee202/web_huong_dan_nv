import React, { useRef, useState, useEffect } from 'react';
import { 
  CheckCircle, 
  FastForward, 
  Film
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
  const [videoError, setVideoError] = useState(false);

  const isYouTube = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  const isVimeo = videoUrl && videoUrl.includes('vimeo.com');
  const isDrive = videoUrl && videoUrl.includes('drive.google.com');

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

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
      
      {/* Video Display Stage */}
      <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center">
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

        {videoError && (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <Film className="w-10 h-10 text-slate-500 mb-2" />
            <h5 className="font-semibold text-slate-100 text-sm">Không thể tải luồng video</h5>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Đường dẫn video tạm thời chưa khả dụng. Bạn có thể xem tóm tắt nội dung và làm bài kiểm tra bên dưới.
            </p>
          </div>
        )}

        <div className="absolute top-3 right-3 pointer-events-none">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
            1080p Full HD
          </span>
        </div>
      </div>

      {/* Video Sub-bar: Speed controls & Mark Finished */}
      <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {!isYouTube && !isVimeo && (
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-500 mr-1 flex items-center font-medium">
              <FastForward className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Tốc độ:
            </span>
            {[1, 1.25, 1.5, 2].map((rate) => (
              <button
                key={rate}
                onClick={() => handleSpeedChange(rate)}
                className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  playbackRate === rate
                    ? 'bg-[#007c5d] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => setHasCompletedVideo(!hasCompletedVideo)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
              hasCompletedVideo
                ? 'bg-emerald-50 text-[#007c5d] border-emerald-300 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${hasCompletedVideo ? 'text-[#007c5d]' : 'text-slate-400'}`} />
            <span>{hasCompletedVideo ? 'Đã xem xong video' : 'Đánh dấu đã xem'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
