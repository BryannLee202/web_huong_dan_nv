import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  HardDrive, 
  Link as LinkIcon, 
  Film, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Layers,
  Trash2,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

function Youtube({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function AdminLessonVideoModal({ 
  isOpen, 
  onClose, 
  currentLesson, 
  courses = [],
  onSelectLesson,
  onVideoSaved,
  onTriggerAi,
  isAiGenerating = false,
  initialTab = null
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'youtube' | 'drive' | 'direct' | 'multipart'
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('direct');
  const [multiVideos, setMultiVideos] = useState([]);
  
  // State upload file
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [uploadError, setUploadError] = useState('');
  
  // State lưu trữ
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [prevLessonId, setPrevLessonId] = useState(null);

  // Xác định vị trí chuyên đề hiện tại để đồng bộ các chuyên đề trước / sau
  const currentLessonIndex = Array.isArray(courses) 
    ? courses.findIndex(c => c.id === currentLesson?.id) 
    : -1;
  const prevLesson = currentLessonIndex > 0 ? courses[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < courses.length - 1 ? courses[currentLessonIndex + 1] : null;

  const handleSwitchLesson = (targetLessonId) => {
    if (onSelectLesson && targetLessonId && targetLessonId !== currentLesson?.id) {
      onSelectLesson(targetLessonId);
    }
  };

  if (currentLesson && isOpen && currentLesson.id !== prevLessonId) {
    setPrevLessonId(currentLesson.id);
    setVideoUrl(currentLesson.videoUrl || '');
    setVideoType(currentLesson.videoType || 'direct');
    
    const vids = Array.isArray(currentLesson.videos) && currentLesson.videos.length > 0
      ? currentLesson.videos
      : [
          {
            id: 1,
            title: currentLesson.title || 'Phần 1: Lý thuyết nền tảng & Khái niệm then chốt',
            url: currentLesson.videoUrl || '',
            type: currentLesson.videoType || 'direct',
            duration: currentLesson.duration || '15 phút'
          }
        ];
    setMultiVideos(vids);
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError('');
    setStatusMessage({ type: '', text: '' });
    
    // Ưu tiên tab chỉ định từ bên ngoài nếu có
    if (initialTab) {
      setActiveTab(initialTab);
    } else {
      // Tự động chuyển tab phù hợp với url hiện có
      const url = currentLesson.videoUrl || '';
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        setActiveTab('youtube');
      } else if (url.includes('drive.google.com')) {
        setActiveTab('drive');
      } else if (url.startsWith('/uploads/')) {
        setActiveTab('upload');
      } else if (url.startsWith('http')) {
        setActiveTab('direct');
      }
    }
  }

  if (!isOpen || !currentLesson) return null;

  // Xử lý chọn file từ máy tính
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError('');
      setUploadProgress(0);
    }
  };

  // Format kích thước file dễ đọc
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Bắt đầu upload file lên server (Không giới hạn dung lượng)
  const handleStartUpload = async () => {
    if (!selectedFile) {
      setUploadError('Vui lòng chọn một file video từ máy tính của bạn.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadProgress(1);

    try {
      const res = await api.video.uploadWithProgress(selectedFile, (prog) => {
        setUploadProgress(prog.percent);
        setUploadedBytes(prog.loadedBytes);
        setTotalBytes(prog.totalBytes);
      });

      if (res && res.videoUrl) {
        setVideoUrl(res.videoUrl);
        setVideoType('direct');
        setStatusMessage({ type: 'success', text: `Đã tải lên máy chủ thành công file ${res.fileName}!` });
        
        // Cập nhật phần 1 trong multiVideos kèm tên file thật để AI nhận diện
        const cleanFileTitle = res.fileName 
          ? res.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim()
          : '';
        setMultiVideos(prev => {
          const updated = [...prev];
          if (updated[0]) {
            updated[0] = { 
              ...updated[0], 
              title: cleanFileTitle || updated[0].title,
              url: res.videoUrl, 
              type: 'direct' 
            };
          }
          return updated;
        });
      }
    } catch (err) {
      setUploadError(err.message || 'Lỗi trong quá trình truyền tải video lên máy chủ');
    } finally {
      setIsUploading(false);
    }
  };

  // Lưu video và kích hoạt ngay AI 3.8 phân tích tạo đề (1-Click Pipeline)
  const handleSaveAndTriggerAi = async () => {
    const saved = await handleSaveVideoConfig(false);
    if (!saved) return;
    if (onTriggerAi) {
      onTriggerAi(currentLesson.id);
      setTimeout(() => {
        onClose();
      }, 400);
    }
  };

  // Lưu toàn bộ cấu hình video vào chuyên đề
  const handleSaveVideoConfig = async (shouldClose = true) => {
    setIsSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      // Chuẩn hóa video URL chính
      let mainUrl = videoUrl.trim();
      let mainType = videoType;

      if (activeTab === 'youtube') {
        mainType = 'youtube';
      } else if (activeTab === 'drive') {
        mainType = 'drive';
      } else if (activeTab === 'multipart' && multiVideos[0]?.url) {
        mainUrl = multiVideos[0].url;
        mainType = multiVideos[0].type || 'direct';
      }

      // Chuẩn hóa mảng multiVideos
      const updatedMulti = multiVideos.map((v, i) => ({
        id: v.id || i + 1,
        title: v.title || `Phần ${i + 1}: Lý thuyết chuyên đề`,
        url: i === 0 && mainUrl ? mainUrl : (v.url || ''),
        type: i === 0 && mainType ? mainType : (v.type || 'direct'),
        duration: v.duration || '15 phút'
      }));

      const res = await api.courses.updateVideo(currentLesson.id, {
        videoUrl: mainUrl,
        videoType: mainType,
        videos: updatedMulti
      });

      if (res && res.success) {
        setStatusMessage({ type: 'success', text: `Đã lưu cấu hình video cho "${currentLesson.title}" thành công!` });
        if (onVideoSaved) {
          onVideoSaved(res.courses || []);
        }
        if (shouldClose) {
          setTimeout(() => {
            onClose();
          }, 800);
        }
        return true;
      } else {
        setStatusMessage({ type: 'error', text: res?.message || 'Lỗi khi lưu cấu hình video' });
        return false;
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi kết nối máy chủ' });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Lưu và chuyển sang chuyên đề tiếp theo
  const handleSaveAndNext = async () => {
    const success = await handleSaveVideoConfig(false);
    if (success && nextLesson) {
      handleSwitchLesson(nextLesson.id);
    }
  };

  // Gỡ bỏ / Hủy video đã chọn hoặc đã tải lên
  const handleClearVideo = () => {
    setVideoUrl('');
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError('');
    setMultiVideos(prev => {
      const updated = [...prev];
      if (updated[0]) {
        updated[0] = { ...updated[0], url: '' };
      }
      return updated;
    });
    setStatusMessage({
      type: 'success',
      text: 'Đã gỡ bỏ video. Hãy bấm "Lưu Video Vào Chuyên Đề Này" để lưu bài học ở trạng thái chưa có video, hoặc chọn file mới để thay thế.'
    });
  };

  // Helper chuyển đổi URL nhúng xem trước
  const getPreviewEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('drive.google.com/file/d/')) {
      const id = url.split('/d/')[1]?.split('/')[0]?.split('?')[0];
      return `https://drive.google.com/file/d/${id}/preview`;
    }
    if (url.includes('drive.google.com/open?id=')) {
      const id = new URL(url).searchParams.get('id');
      return `https://drive.google.com/file/d/${id}/preview`;
    }
    return url;
  };

  const isEmbedSource = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('drive.google.com');

  const tabs = [
    { id: 'upload', label: 'Tải File Trực Tiếp', icon: Upload, badge: '10GB+' },
    { id: 'youtube', label: 'Nhúng YouTube', icon: Youtube, color: 'text-rose-500' },
    { id: 'drive', label: 'Google Drive', icon: HardDrive, color: 'text-emerald-500' },
    { id: 'direct', label: 'Link Ngoài / CDN', icon: LinkIcon, color: 'text-indigo-500' },
    { id: 'multipart', label: multiVideos.length > 0 ? `Video Con (${multiVideos.length})` : 'Video Con', icon: Layers, color: 'text-amber-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#1a1715] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/[0.08] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Thanh điều hướng chuyên đề thông minh & đồng bộ */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between gap-3 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-[#201c1a] dark:to-[#171514]">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {currentLesson.category || 'Chuyên đề'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                  currentLesson.videoUrl
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-stone-800 text-slate-500 dark:text-stone-400 border border-slate-200 dark:border-stone-700'
                }`}>
                  <span>{currentLesson.videoUrl ? '✓ Đã gắn video' : '○ Chưa có video'}</span>
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                Quản lý Video: {currentLesson.title}
              </h3>
            </div>
          </div>

          {/* Cụm điều hướng & đồng bộ các chuyên đề */}
          <div className="flex items-center space-x-2 shrink-0">
            {courses.length > 1 && (
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-stone-800/80 border border-slate-200/80 dark:border-stone-700 rounded-xl p-1">
                <button
                  type="button"
                  disabled={!prevLesson}
                  onClick={() => prevLesson && handleSwitchLesson(prevLesson.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title={prevLesson ? `Chuyên đề trước: ${prevLesson.title}` : 'Đang ở chuyên đề đầu tiên'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <select
                  value={currentLesson.id}
                  onChange={(e) => handleSwitchLesson(e.target.value)}
                  className="text-xs font-bold bg-transparent text-slate-800 dark:text-stone-200 px-2 py-1 focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[170px] truncate"
                  title="Chuyển nhanh sang chuyên đề khác"
                >
                  {courses.map((c, i) => (
                    <option key={c.id} value={c.id} className="bg-white dark:bg-stone-900 text-slate-900 dark:text-white">
                      Bài {i + 1}: {c.title.replace(/^Bài \d+:\s*/, '')} {c.videoUrl ? '✓' : ''}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={!nextLesson}
                  onClick={() => nextLesson && handleSwitchLesson(nextLesson.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title={nextLesson ? `Chuyên đề tiếp theo: ${nextLesson.title}` : 'Đang ở chuyên đề cuối cùng'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.15] text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation: Segmented Bar cao cấp - Chống 100% cắt mép / tràn viền */}
        <div className="px-5 py-2.5 bg-slate-50/80 dark:bg-[#141211] border-b border-slate-200/80 dark:border-white/[0.08]">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-stone-900/90 rounded-2xl overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-stone-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/60 dark:border-stone-700'
                      : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-stone-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${tab.color || ''}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                      isActive 
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                        : 'bg-slate-300/80 dark:bg-stone-800 text-slate-700 dark:text-stone-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Status Message */}
          {statusMessage.text && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: UPLOAD FILE MÁY TÍNH */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Micro-Tips Banner tinh gọn */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center space-x-2 text-blue-900 dark:text-blue-200 font-bold">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Máy chủ lưu trữ video cục bộ tốc độ cao (Fast Streaming)</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    Dung lượng tới 10GB+
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                    HTTP 206 Mượt Mà
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    MP4 • WebM • MOV
                  </span>
                </div>
              </div>

              {/* Thẻ hiển thị video hiện tại và nút Gỡ Bỏ Video nếu đã có video */}
              {videoUrl && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 flex items-center justify-between gap-3 animate-in fade-in duration-150">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Film className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                        Video đang được gắn cho chuyên đề này
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-stone-400 font-mono truncate">
                        {videoUrl}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearVideo}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-900/60 flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                    title="Gỡ bỏ và hủy video này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Gỡ Bỏ Video</span>
                  </button>
                </div>
              )}

              {/* Drag & Drop Upload Box */}
              <div className="border-2 border-dashed border-slate-300 dark:border-stone-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-3xl p-7 text-center transition-all bg-slate-50/60 dark:bg-stone-900/30">
                <input 
                  type="file" 
                  id="admin-video-file-input" 
                  accept="video/*,.mp4,.webm,.mov,.mkv,.avi"
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <label 
                  htmlFor="admin-video-file-input" 
                  className="flex flex-col items-center justify-center cursor-pointer space-y-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center ring-4 ring-blue-500/5 transition-transform hover:scale-105">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {selectedFile ? selectedFile.name : 'Kéo thả file video vào đây hoặc bấm để chọn'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-stone-400 mt-1">
                      {selectedFile ? `Kích thước: ${formatFileSize(selectedFile.size)}` : 'Hỗ trợ MP4, WEBM, MOV, MKV không giới hạn dung lượng'}
                    </p>
                  </div>
                  <span className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all">
                    {selectedFile ? 'Đổi File Khác' : 'Chọn File Video Từ Máy Tính'}
                  </span>
                </label>
              </div>

              {/* Progress Bar khi đang upload */}
              {isUploading && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#201c1a] border border-slate-200 dark:border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-blue-600 dark:text-blue-400 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      <span>Đang truyền tải video lên máy chủ...</span>
                    </span>
                    <span className="text-slate-800 dark:text-white font-mono">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-stone-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Đã tải: {formatFileSize(uploadedBytes)}</span>
                    <span>Tổng: {formatFileSize(totalBytes || selectedFile?.size)}</span>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  {uploadError}
                </div>
              )}

              {selectedFile && !isUploading && (
                <button
                  type="button"
                  onClick={handleStartUpload}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-2 cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Bắt đầu tải lên máy chủ ({formatFileSize(selectedFile.size)})</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 2: YOUTUBE */}
          {activeTab === 'youtube' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block">
                  Đường dẫn Video YouTube (Công khai hoặc Không công khai - Unlisted)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setVideoType('youtube');
                    }}
                    placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                    className="w-full h-12 px-4 pr-10 rounded-2xl bg-slate-50 dark:bg-[#201c1a] border border-slate-200 dark:border-white/[0.08] focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                  <Youtube className="w-5 h-5 text-rose-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-stone-400">
                  💡 <strong>Mẹo chuyên nghiệp:</strong> Bạn có thể tải video lên kênh YouTube ở chế độ <strong>"Không công khai" (Unlisted)</strong> để vừa bảo mật bài giảng nội bộ, vừa tận dụng băng thông phát video siêu tốc độ của Google.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE DRIVE */}
          {activeTab === 'drive' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block">
                  Đường dẫn Chia sẻ Google Drive
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setVideoType('drive');
                    }}
                    placeholder="https://drive.google.com/file/d/1a2b3c.../view?usp=sharing"
                    className="w-full h-12 px-4 pr-10 rounded-2xl bg-slate-50 dark:bg-[#201c1a] border border-slate-200 dark:border-white/[0.08] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                  <HardDrive className="w-5 h-5 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  <strong>Lưu ý quyền chia sẻ Google Drive:</strong> Trong file Drive, hãy bấm nút <em>"Chia sẻ" (Share)</em> $\rightarrow$ Chọn <em>"Bất kỳ ai có đường liên kết đều có thể xem" (Anyone with the link can view)</em> để nhân viên mở xem video không bị chặn quyền.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIRECT LINK / CDN */}
          {activeTab === 'direct' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block">
                  Đường dẫn Video MP4 Trực tiếp / CDN Ngoài
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setVideoType('direct');
                    }}
                    placeholder="https://cdn.domain.com/videos/chuyen-de-1.mp4"
                    className="w-full h-12 px-4 pr-10 rounded-2xl bg-slate-50 dark:bg-[#201c1a] border border-slate-200 dark:border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                  <LinkIcon className="w-5 h-5 text-indigo-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MULTI-PART LECTURES (VIDEO CON) */}
          {activeTab === 'multipart' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2.5">
                <Layers className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-relaxed">
                  <p className="font-bold">Quản lý các phần video bài giảng con ({multiVideos.length} phần):</p>
                  <p className="text-[11px] opacity-90">
                    Bạn có thể chỉnh sửa link/tiêu đề, bấm <span className="font-bold text-rose-500">"Xóa phần này"</span> để loại bỏ video không mong muốn, hoặc thêm phần mới. Sau khi chỉnh sửa, bấm <span className="font-bold">"Lưu Video Vào Chuyên Đề Này"</span> ở dưới để cập nhật vào hệ thống.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-stone-300">
                  Danh sách các video bài giảng con ({multiVideos.length} phần)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMultiVideos(prev => [
                      ...prev,
                      {
                        id: prev.length + 1,
                        title: `Phần ${prev.length + 1}: Bài giảng thực chiến`,
                        url: '',
                        type: 'direct',
                        duration: '15 phút'
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] shadow-xs flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm phần video</span>
                </button>
              </div>

              <div className="space-y-3">
                {multiVideos.map((v, idx) => (
                  <div key={v.id || idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#201c1a] border border-slate-200 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Video 0{idx + 1}
                      </span>
                      {multiVideos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const partTitle = v.title || `Phần 0${idx + 1}`;
                            if (window.confirm(`Bạn có chắc chắn muốn xóa phần video này không?\n\n"${partTitle}"\n\n(Lưu ý: Bấm nút "Lưu Video Vào Chuyên Đề Này" ở dưới để lưu cập nhật vào hệ thống)`)) {
                              setMultiVideos(prev => prev.filter((_, i) => i !== idx));
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white dark:text-rose-400 dark:hover:text-white border border-rose-500/20 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                          title="Xóa phần video này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa phần này</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={v.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMultiVideos(prev => {
                            const updated = [...prev];
                            updated[idx] = { ...updated[idx], title: val };
                            return updated;
                          });
                        }}
                        placeholder="Tiêu đề video..."
                        className="sm:col-span-2 px-3 py-2 rounded-xl bg-white dark:bg-[#171514] border border-slate-200 dark:border-white/[0.08] text-xs"
                      />
                      <input
                        type="text"
                        value={v.duration}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMultiVideos(prev => {
                            const updated = [...prev];
                            updated[idx] = { ...updated[idx], duration: val };
                            return updated;
                          });
                        }}
                        placeholder="Thời lượng (vd: 15 phút)"
                        className="px-3 py-2 rounded-xl bg-white dark:bg-[#171514] border border-slate-200 dark:border-white/[0.08] text-xs"
                      />
                    </div>
                    <input
                      type="text"
                      value={v.url}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMultiVideos(prev => {
                          const updated = [...prev];
                          updated[idx] = { ...updated[idx], url: val };
                          return updated;
                        });
                        if (idx === 0) setVideoUrl(val);
                      }}
                      placeholder="URL video (YouTube, Drive, Local upload hoặc MP4)..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#171514] border border-slate-200 dark:border-white/[0.08] text-xs font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI VIDEO INTELLIGENCE BANNER: Thiết kế sang trọng, cân bằng, duy nhất 1 nút AI */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-indigo-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start space-x-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/40 mt-0.5">
                <Sparkles className={`w-5 h-5 text-amber-500 ${isAiGenerating ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    AI Multimodal Video Engine
                  </h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                    Auto 100%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-stone-300 mt-1 leading-relaxed">
                  AI tự động quét video bài giảng, trích xuất 4 điểm tóm tắt cốt lõi và sinh bộ 10 câu sát hạch thực tế theo đúng cẩm nang của HLV Đan Rin.
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={isAiGenerating || isUploading}
              onClick={async () => {
                if (onTriggerAi) {
                  await onTriggerAi(currentLesson.id);
                }
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 shrink-0 disabled:opacity-60 active:scale-95"
            >
              <Sparkles className={`w-4 h-4 text-slate-950 ${isAiGenerating ? 'animate-spin' : ''}`} />
              <span>{isAiGenerating ? 'AI đang phân tích...' : 'AI Đọc Video & Sinh 10 Câu Sát Hạch'}</span>
            </button>
          </div>

          {/* LIVE PREVIEW BOX */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-stone-300 flex items-center space-x-1.5">
                <Play className="w-3.5 h-3.5 text-blue-600" />
                <span>Xem trước luồng phát trực tiếp (Preview)</span>
              </span>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px] hidden sm:inline">
                  {videoUrl || 'Chưa có URL'}
                </span>
                {videoUrl && (
                  <button
                    type="button"
                    onClick={handleClearVideo}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-[11px] font-bold border border-rose-200 dark:border-rose-900/60 flex items-center space-x-1 transition-colors cursor-pointer"
                    title="Gỡ bỏ và hủy video này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Gỡ Bỏ Video</span>
                  </button>
                )}
              </div>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-white/[0.08]">
              {videoUrl ? (
                isEmbedSource ? (
                  <iframe
                    src={getPreviewEmbedUrl(videoUrl)}
                    title="Video Preview"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <Film className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-60" />
                  <p className="text-xs">Chưa có video được chọn. Vui lòng nhập link hoặc tải file lên.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions: Cân bằng hoàn hảo, không còn nút thừa, hỗ trợ chuyển chuyên đề tiếp theo */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 dark:bg-[#171514] border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] font-bold text-xs transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>

          <div className="flex items-center gap-2.5">
            {nextLesson && (
              <button
                type="button"
                disabled={isSaving || isUploading}
                onClick={handleSaveAndNext}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 dark:hover:bg-stone-700 text-slate-800 dark:text-stone-200 font-bold text-xs border border-slate-200/80 dark:border-stone-700 flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                title={`Lưu bài hiện tại và chuyển tiếp sang ${nextLesson.title}`}
              >
                <span>Lưu & Sang Bài Tiếp Theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              disabled={isSaving || isUploading}
              onClick={() => handleSaveVideoConfig(true)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-slate-50 dark:hover:bg-stone-700 text-slate-800 dark:text-stone-200 font-bold text-xs shadow-xs disabled:opacity-50 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              {isSaving ? (
                <span>Đang lưu video...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Lưu Video</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isSaving || isUploading || isAiGenerating}
              onClick={handleSaveAndTriggerAi}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
              title="Tự động lưu video và kích hoạt ngay AI 3.8 phân tích nội dung để tạo tóm tắt & 10 câu sát hạch"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isAiGenerating ? 'AI 3.8 đang đọc video...' : '⚡ Lưu & Cho AI 3.8 Tạo Đề Luôn'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
