import React, { useState, useEffect } from 'react';
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
  Sparkles
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
  onVideoSaved 
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

  useEffect(() => {
    if (currentLesson) {
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
  }, [currentLesson, isOpen]);

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
        
        // Cập nhật phần 1 trong multiVideos
        setMultiVideos(prev => {
          const updated = [...prev];
          if (updated[0]) {
            updated[0] = { ...updated[0], url: res.videoUrl, type: 'direct' };
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

  // Lưu toàn bộ cấu hình video vào chuyên đề
  const handleSaveVideoConfig = async () => {
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
        setStatusMessage({ type: 'success', text: 'Đã lưu cấu hình video bài giảng thành công!' });
        if (onVideoSaved) {
          onVideoSaved(res.courses || []);
        }
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setStatusMessage({ type: 'error', text: res?.message || 'Lỗi khi lưu cấu hình video' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi kết nối máy chủ' });
    } finally {
      setIsSaving(false);
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#1a1715] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/[0.08] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-[#201c1a] dark:to-[#171514]">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {currentLesson.category || 'Chuyên đề'}
                </span>
                <span className="text-xs text-slate-400 dark:text-stone-500 font-mono">
                  {currentLesson.id}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                Quản lý Video: {currentLesson.title}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.15] text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation (5 Hình thức) */}
        <div className="px-6 pt-3 bg-slate-50/60 dark:bg-[#141211] border-b border-slate-200/80 dark:border-white/[0.08] flex gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-[#1a1715] text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 shadow-xs'
                : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Tải File Trực Tiếp (Không giới hạn)</span>
          </button>

          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-white dark:bg-[#1a1715] text-rose-600 dark:text-rose-400 border-t-2 border-rose-600 shadow-xs'
                : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>Nhúng YouTube</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'drive'
                ? 'bg-white dark:bg-[#1a1715] text-emerald-600 dark:text-emerald-400 border-t-2 border-emerald-600 shadow-xs'
                : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Google Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('direct')}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'direct'
                ? 'bg-white dark:bg-[#1a1715] text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link Ngoài / CDN</span>
          </button>

          <button
            onClick={() => setActiveTab('multipart')}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'multipart'
                ? 'bg-white dark:bg-[#1a1715] text-amber-600 dark:text-amber-400 border-t-2 border-amber-500 shadow-xs'
                : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4 Video Con ({multiVideos.length})</span>
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status Message */}
          {statusMessage.text && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center space-x-2 ${
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
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <p className="font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Cơ chế tải lên trực tiếp không giới hạn dung lượng:</span>
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                  Hệ thống hỗ trợ file video từ 100MB đến 10GB+ (.mp4, .webm, .mov, .mkv). Video được lưu trực tiếp vào ổ đĩa và tự động kích hoạt giao thức HTTP 206 Partial Content Streaming giúp tua video mượt mà không bị nghẽn RAM.
                </p>
              </div>

              {/* Drag & Drop Upload Box */}
              <div className="border-2 border-dashed border-slate-300 dark:border-stone-700 rounded-3xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-[#201c1a]">
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
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {selectedFile ? selectedFile.name : 'Nhấp để chọn file video từ máy tính của bạn'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-stone-400 mt-1">
                      {selectedFile ? `Kích thước: ${formatFileSize(selectedFile.size)}` : 'Hỗ trợ MP4, WEBM, MOV, MKV không giới hạn dung lượng'}
                    </p>
                  </div>
                  <span className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all">
                    Chọn File Video
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
                  <span>Bắt đầu tải lên ({formatFileSize(selectedFile.size)})</span>
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
                <p className="text-[11px] text-slate-400 dark:text-stone-400">
                  Mẹo: Khách hàng có thể tải video lên kênh YouTube của doanh nghiệp ở chế độ <strong>"Không công khai" (Unlisted)</strong> để vừa bảo mật nội bộ vừa tận dụng băng thông tốc độ cao miễn phí của Google.
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
                  <strong>Lưu ý quyền chia sẻ Google Drive:</strong> Trong file Google Drive, hãy bấm nút <em>"Chia sẻ" (Share)</em> $\rightarrow$ Chọn <em>"Bất kỳ ai có đường liên kết đều có thể xem" (Anyone with the link can view)</em> để nhân viên mở xem video không bị chặn quyền.
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

          {/* TAB 5: MULTI-PART LECTURES (4 VIDEO CON) */}
          {activeTab === 'multipart' && (
            <div className="space-y-4">
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
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-[11px] shadow-xs flex items-center space-x-1 cursor-pointer"
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
                            setMultiVideos(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          title="Xóa phần này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

          {/* LIVE PREVIEW BOX */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-stone-300 flex items-center space-x-1.5">
                <Play className="w-3.5 h-3.5 text-blue-600" />
                <span>Xem trước luồng phát trực tiếp (Preview)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[280px]">
                {videoUrl || 'Chưa có URL'}
              </span>
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

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#171514] border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] font-bold text-xs transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>

          <button
            type="button"
            disabled={isSaving || isUploading}
            onClick={handleSaveVideoConfig}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center space-x-2"
          >
            {isSaving ? (
              <span>Đang lưu vào chuyên đề...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Lưu Video Vào Chuyên Đề Này</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
