import React, { useRef, useState, useEffect } from 'react';
import { 
  CheckCircle, 
  FastForward, 
  CheckCircle2,
  ListVideo,
  FileCheck2,
  Sparkles,
  BookmarkCheck,
  BookOpen,
  ArrowRight,
  Clock,
  Trash2,
  Settings
} from 'lucide-react';
import { RealisticCourseIcon } from './RealisticIcons';
import api from '../services/api';

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
  currentUserEmail = '',
  currentLesson = null,
  onCoursesUpdated = null,
  activeVideoIdx = 0,
  onActiveVideoChange = null,
  onTriggerAi = null,
  isAiGenerating = false
}) {
  const videoRef = useRef(null);
  const [internalActiveIdx, setInternalActiveIdx] = useState(activeVideoIdx || 0);
  const currentActiveIdx = typeof onActiveVideoChange === 'function' ? activeVideoIdx : internalActiveIdx;
  const setActiveIdx = (idx) => {
    setInternalActiveIdx(idx);
    if (onActiveVideoChange) onActiveVideoChange(idx);
  };
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoError, setVideoError] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState({});
  const [videoToDelete, setVideoToDelete] = useState(null); // { index, title }
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);

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

  const currentVideo = videoList[currentActiveIdx] || videoList[0] || {};
  const currentUrl = (currentVideo.url || videoUrl || '').trim();
  const hasValidVideo = Boolean(currentUrl) && !videoError;

  useEffect(() => {
    if (onVideoStatusChange) {
      onVideoStatusChange(hasValidVideo);
    }
  }, [hasValidVideo, onVideoStatusChange]);

  // Xử lý xác nhận xóa một phần hoặc gỡ toàn bộ video trực tiếp dành cho Quản trị viên
  const handleConfirmDeleteVideo = async () => {
    if (!videoToDelete) return;
    setIsDeletingVideo(true);
    try {
      const lessonId = currentLesson?.id;
      if (!lessonId) {
        alert('Không tìm thấy mã chuyên đề cần xóa video.');
        return;
      }

      // 1. Trường hợp gỡ toàn bộ video của bài học (Gỡ video nhanh 1-click)
      if (videoToDelete.isClearAll || videoToDelete.index === -1) {
        const res = await api.courses.updateVideo(lessonId, {
          videoUrl: '',
          videoType: 'direct',
          videos: []
        });

        if (res && res.success) {
          if (onCoursesUpdated && Array.isArray(res.courses)) {
            onCoursesUpdated(res.courses);
          }
          setActiveIdx(0);
          setVideoToDelete(null);
        } else {
          alert(res?.message || 'Có lỗi khi gỡ video. Vui lòng thử lại!');
        }
        return;
      }

      // 2. Trường hợp xóa 1 phần trong danh sách nhiều phần video
      const targetIdx = videoToDelete.index;
      const sourceVideos = Array.isArray(currentLesson?.videos) && currentLesson.videos.length > 0
        ? currentLesson.videos
        : videoList;
      const remainingVideos = sourceVideos.filter((_, i) => i !== targetIdx);

      const mainVideoUrl = remainingVideos[0]?.url || '';
      const mainVideoType = remainingVideos[0]?.type || 'direct';

      const res = await api.courses.updateVideo(lessonId, {
        videoUrl: mainVideoUrl,
        videoType: mainVideoType,
        videos: remainingVideos
      });

      if (res && res.success) {
        if (onCoursesUpdated && Array.isArray(res.courses)) {
          onCoursesUpdated(res.courses);
        }
        if (activeVideoIdx >= remainingVideos.length) {
          setActiveIdx(Math.max(0, remainingVideos.length - 1));
        }
        setVideoToDelete(null);
      } else {
        alert(res?.message || 'Có lỗi khi xóa phần video. Vui lòng thử lại!');
      }
    } catch (err) {
      console.error('Lỗi khi xóa phần video:', err);
      alert(err.message || 'Có lỗi xảy ra khi gửi yêu cầu xóa video tới máy chủ.');
    } finally {
      setIsDeletingVideo(false);
    }
  };

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
              {isAdmin && onOpenVideoAdmin && (
                <button
                  type="button"
                  onClick={() => onOpenVideoAdmin('multipart')}
                  className="ml-1 px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20 transition-all cursor-pointer flex items-center space-x-1"
                  title="Mở bảng quản lý chi tiết các video con"
                >
                  <Settings className="w-3 h-3" />
                  <span>Quản lý</span>
                </button>
              )}
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-stone-400">
              Đang phát phần {currentActiveIdx + 1}/{videoList.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {videoList.map((vid, idx) => {
              const isActive = currentActiveIdx === idx;
              const isWatched = watchedVideos[idx];
              const partQuizCount = Array.isArray(vid.quiz) ? vid.quiz.length : 0;
              return (
                <div
                  key={vid.id || idx}
                  className={`relative group rounded-xl border transition-all overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 dark:border-amber-400 shadow-xs'
                      : 'bg-white dark:bg-[#24201e] border-slate-200 dark:border-white/[0.06] hover:border-amber-400/60 dark:hover:border-amber-500/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveIdx(idx);
                      setVideoError(false);
                    }}
                    className="w-full text-left p-2.5 cursor-pointer flex flex-col justify-between flex-1"
                  >
                    <div className="flex items-center justify-between mb-1 pr-6">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                        isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-stone-400'
                      }`}>
                        Phần 0{idx + 1} {partQuizCount > 0 ? `• ${partQuizCount} câu` : ''}
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

                  {/* 2 Nút AI Đọc Video & Tạo Đề riêng biệt cho riêng Phần này (dành cho Admin) */}
                  {isAdmin && onTriggerAi && vid.url && (
                    <div className="px-2 pb-2 pt-1 grid grid-cols-2 gap-1 border-t border-slate-100 dark:border-white/[0.05]">
                      <button
                        type="button"
                        disabled={isAiGenerating}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIdx(idx);
                          onTriggerAi({
                            targetVideoIndex: idx,
                            videoUrl: vid.url,
                            videoTitle: vid.title,
                            videos: videoList,
                            mode: 'summary_only'
                          });
                        }}
                        className="py-1 px-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-800 dark:text-amber-300 hover:text-slate-950 font-extrabold text-[10px] flex items-center justify-center space-x-1 transition-all cursor-pointer disabled:opacity-50"
                        title={`AI đọc video Phần ${idx + 1} để cập nhật tóm tắt & mốc thời gian`}
                      >
                        <Sparkles className={`w-3 h-3 ${isAiGenerating && isActive ? 'animate-spin' : ''}`} />
                        <span className="truncate">✨ Tóm Tắt P{idx + 1}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isAiGenerating}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIdx(idx);
                          onTriggerAi({
                            targetVideoIndex: idx,
                            videoUrl: vid.url,
                            videoTitle: vid.title,
                            videos: videoList,
                            mode: 'quiz_only'
                          });
                        }}
                        className="py-1 px-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white font-extrabold text-[10px] flex items-center justify-center space-x-1 transition-all cursor-pointer disabled:opacity-50"
                        title={`AI đọc video Phần ${idx + 1} để sinh 10 câu trắc nghiệm sát hạch`}
                      >
                        <BookmarkCheck className="w-3 h-3 text-blue-500 dark:text-blue-300 group-hover:text-white" />
                        <span className="truncate">⚡ Tạo Đề P{idx + 1}</span>
                      </button>
                    </div>
                  )}

                  {/* Nút xóa phần video trực tiếp dành cho Quản trị viên (khi có từ 2 video trở lên) */}
                  {isAdmin && videoList.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoToDelete({
                          index: idx,
                          title: vid.title || `Phần 0${idx + 1}`
                        });
                      }}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-70 group-hover:opacity-100 transition-all cursor-pointer z-10"
                      title={`Xóa phần video này: ${vid.title || `Phần 0${idx + 1}`}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
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

          <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-20">
            {isAdmin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setVideoToDelete({
                    index: -1,
                    isClearAll: true,
                    title: currentVideo.title || title || 'Video bài giảng này'
                  });
                }}
                className="pointer-events-auto px-2.5 py-1 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white text-[11px] font-bold backdrop-blur-xs border border-rose-400/40 shadow-md flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                title="Gỡ bỏ và xóa video này khỏi chuyên đề nhanh nhất"
              >
                <Trash2 className="w-3 h-3" />
                <span>Gỡ Video</span>
              </button>
            )}
            {isDrive && (
              <span className="pointer-events-none text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600/80 text-white backdrop-blur-xs">
                Google Drive
              </span>
            )}
            {isYouTube && (
              <span className="pointer-events-none text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/80 text-white backdrop-blur-xs">
                YouTube HD
              </span>
            )}
            <span className="pointer-events-none text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
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

            {/* Icon chính thực tế 3D */}
            <div className="mb-4">
              <RealisticCourseIcon className="w-20 h-20 sm:w-24 sm:h-24 shadow-xl" />
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
                  className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm shadow-lg flex items-center space-x-2.5 transition-all cursor-pointer active:scale-95"
                >
                  <RealisticCourseIcon className="w-5 h-5 rounded-md" />
                  <span>Cài Đặt & Gắn Video Bài Giảng</span>
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

        {/* NÚT THAO TÁC NHANH DÀNH CHO QUẢN TRỊ VIÊN (ADMIN ONLY) */}
        {isAdmin && hasValidVideo && (
          <div className="flex items-center space-x-1.5 order-first sm:order-none">
            <button
              type="button"
              onClick={() => {
                setVideoToDelete({
                  index: -1,
                  isClearAll: true,
                  title: currentVideo.title || title || 'Video bài giảng này'
                });
              }}
              className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
              title="Gỡ bỏ và xóa video này khỏi bài học ngay lập tức"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Gỡ Video Nhanh</span>
            </button>

            {onOpenVideoAdmin && (
              <button
                type="button"
                onClick={() => onOpenVideoAdmin('upload')}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 dark:bg-[#24201e] dark:hover:bg-[#2e2926] text-slate-700 dark:text-stone-300 border border-slate-200 dark:border-white/[0.08] text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
                title="Đổi hoặc tải video mới lên"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-stone-400" />
                <span>Đổi Video</span>
              </button>
            )}
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

      {/* MODAL XÁC NHẬN XÓA / GỠ VIDEO DÀNH CHO ADMIN */}
      {videoToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
            if (!isDeletingVideo) setVideoToDelete(null);
          }}
        >
          <div 
            className="bg-white dark:bg-[#1a1715] rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/[0.08] shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 text-rose-500">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {videoToDelete.isClearAll ? 'Xác nhận gỡ video bài giảng?' : 'Xác nhận xóa phần video?'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-stone-400">
                  {videoToDelete.isClearAll 
                    ? 'Video sẽ được gỡ khỏi chuyên đề này và đưa về trạng thái chờ nạp video mới.' 
                    : 'Hành động này sẽ cập nhật cơ sở dữ liệu chuyên đề và không thể hoàn tác.'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#24201e] border border-slate-200 dark:border-white/[0.06] text-xs space-y-1.5">
              <p className="font-semibold text-slate-700 dark:text-stone-300">
                {videoToDelete.isClearAll 
                  ? 'Bạn có chắc chắn muốn gỡ video này khỏi chuyên đề không?' 
                  : 'Bạn có chắc chắn muốn xóa phần video này không?'}
              </p>
              <p className="font-bold text-rose-600 dark:text-rose-400 break-words">
                "{videoToDelete.title}"
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={isDeletingVideo}
                onClick={() => setVideoToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeletingVideo}
                onClick={handleConfirmDeleteVideo}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                {isDeletingVideo ? (
                  <span>Đang xử lý...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{videoToDelete.isClearAll ? 'Xác nhận gỡ video' : 'Xác nhận xóa'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
