import React, { useState, useRef, useEffect } from 'react';
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
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Camera,
  Video,
  Smartphone,
  RefreshCw,
  StopCircle,
  Check,
  FolderOpen,
  Image
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
  const [activePartIdx, setActivePartIdx] = useState(0); // Phần video con đang chọn để xem trước & cho AI đọc
  
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
  const [resetSummaryAndQuiz, setResetSummaryAndQuiz] = useState(true); // Mặc định GỠ BỎ tóm tắt & đề thi cũ không khớp khi đổi video

  // Studio & Live Camera Recorder State
  const videoPreviewRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'recording' | 'recorded'
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [studioFacingMode, setStudioFacingMode] = useState('environment'); // 'environment' (sau) | 'user' (trước)
  const [recordedVideoBlob, setRecordedVideoBlob] = useState(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState('');
  const [studioError, setStudioError] = useState('');

  const stopCameraStream = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startCameraStream = async (facing = studioFacingMode) => {
    stopCameraStream();
    setStudioError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ truy cập Camera trực tiếp.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      cameraStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error('Camera stream error:', err);
      setStudioError(err.message || 'Không thể mở Camera. Vui lòng cấp quyền truy cập Camera/Microphone trong cài đặt trình duyệt.');
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = studioFacingMode === 'environment' ? 'user' : 'environment';
    setStudioFacingMode(nextFacing);
    if (isStudioOpen && recordingState !== 'recording') {
      startCameraStream(nextFacing);
    }
  };

  const startLiveRecording = () => {
    if (!cameraStreamRef.current) {
      startCameraStream();
      return;
    }
    try {
      chunksRef.current = [];
      const mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4'];
      const chosenMime = mimeTypes.find(m => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) || '';
      const recorder = chosenMime 
        ? new MediaRecorder(cameraStreamRef.current, { mimeType: chosenMime }) 
        : new MediaRecorder(cameraStreamRef.current);
      
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: chosenMime || 'video/webm' });
        setRecordedVideoBlob(blob);
        const objUrl = URL.createObjectURL(blob);
        setRecordedVideoUrl(objUrl);
        setRecordingState('recorded');
      };

      recorder.start(1000);
      setRecordingState('recording');
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setStudioError('Lỗi khi bắt đầu quay: ' + err.message);
    }
  };

  const stopLiveRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleApplyRecordedVideo = () => {
    if (!recordedVideoBlob) return;
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const filename = `quay_camera_${timestamp}.webm`;
    const file = new File([recordedVideoBlob], filename, { type: recordedVideoBlob.type || 'video/webm' });
    setSelectedFile(file);
    stopCameraStream();
    setIsStudioOpen(false);
    setRecordingState('idle');
    setRecordedVideoBlob(null);
    if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
    setRecordedVideoUrl('');

    // Bắt đầu upload luôn vào Phần đang chọn
    handleStartUpload(activePartIdx, file);
  };

  const handleRetakeVideo = () => {
    if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
    setRecordedVideoUrl('');
    setRecordedVideoBlob(null);
    setRecordingState('idle');
    startCameraStream();
  };

  const formatRecordingTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      setIsStudioOpen(false);
      setRecordingState('idle');
      if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
      setRecordedVideoUrl('');
    }
  }, [isOpen]);

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
    setActivePartIdx(0);
    
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
    setResetSummaryAndQuiz(true);
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

  // Bắt đầu upload file lên server (Không giới hạn dung lượng) và gắn vào đúng Phần đang chọn
  const handleStartUpload = async (targetIdx = activePartIdx, fileToUpload = selectedFile) => {
    const file = fileToUpload || selectedFile;
    if (!file) {
      setUploadError('Vui lòng chọn một file video từ máy tính của bạn.');
      return null;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadProgress(1);

    try {
      const res = await api.video.uploadWithProgress(file, (prog) => {
        setUploadProgress(prog.percent);
        setUploadedBytes(prog.loadedBytes);
        setTotalBytes(prog.totalBytes);
      });

      if (res && res.videoUrl) {
        const safeIdx = typeof targetIdx === 'number' && targetIdx >= 0 ? targetIdx : 0;
        if (safeIdx === 0) {
          setVideoUrl(res.videoUrl);
          setVideoType('direct');
        }
        const cleanFileTitle = res.fileName 
          ? res.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim()
          : '';

        let nextMulti = [];
        setMultiVideos(prev => {
          const updated = [...prev];
          while (updated.length <= safeIdx) {
            updated.push({
              id: updated.length + 1,
              title: `Phần ${updated.length + 1}: Bài giảng thực chiến`,
              url: '',
              type: 'direct',
              duration: '15 phút'
            });
          }
          updated[safeIdx] = {
            ...updated[safeIdx],
            title: cleanFileTitle || updated[safeIdx].title || `Phần ${safeIdx + 1}: Bài giảng thực chiến`,
            url: res.videoUrl,
            type: 'direct'
          };
          nextMulti = updated;
          return updated;
        });

        setSelectedFile(null);
        setStatusMessage({
          type: 'success',
          text: `Đã tải lên thành công file "${res.fileName}" vào Phần ${safeIdx + 1}!`
        });
        return {
          videoUrl: res.videoUrl,
          fileName: res.fileName,
          cleanTitle: cleanFileTitle,
          targetIdx: safeIdx,
          updatedMulti: nextMulti
        };
      }
      return null;
    } catch (err) {
      setUploadError(err.message || 'Lỗi trong quá trình truyền tải video lên máy chủ');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Lưu video và kích hoạt ngay AI 3.8 phân tích (Hỗ trợ mode: 'summary_only' | 'quiz_only' | 'all')
  const handleSaveAndTriggerAi = async (targetIdx = activePartIdx, mode = 'all') => {
    const safeIdx = typeof targetIdx === 'number' && targetIdx >= 0 ? targetIdx : 0;
    const saved = await handleSaveVideoConfig(false, safeIdx);
    if (!saved) return;
    if (onTriggerAi) {
      const latestMulti = Array.isArray(saved.videos) ? saved.videos : multiVideos;
      const chosenVideo = latestMulti[safeIdx] || null;
      onTriggerAi(currentLesson.id, {
        videoUrl: chosenVideo?.url || saved.mainUrl || videoUrl.trim(),
        videoTitle: chosenVideo?.title || currentLesson.title,
        videoType: chosenVideo?.type || videoType,
        videos: latestMulti,
        targetVideoIndex: safeIdx,
        mode: mode
      });
      setTimeout(() => {
        onClose();
      }, 400);
    }
  };

  // Lưu toàn bộ cấu hình video vào chuyên đề (tự động upload nếu đã chọn file mà chưa bấm nút tải lên)
  const handleSaveVideoConfig = async (shouldClose = true, targetIdx = activePartIdx) => {
    setIsSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      let workingMulti = [...multiVideos];
      let currentMainUrl = videoUrl.trim();
      let currentMainType = videoType;
      const safeIdx = typeof targetIdx === 'number' && targetIdx >= 0 ? targetIdx : 0;

      // Nếu người dùng đã chọn file ở máy tính nhưng bấm thẳng "Lưu Video" hoặc "Lưu & Cho AI Tạo Đề" -> Tự động upload luôn!
      if (selectedFile) {
        const uploadRes = await handleStartUpload(safeIdx, selectedFile);
        if (!uploadRes || !uploadRes.videoUrl) {
          setIsSaving(false);
          return false;
        }
        if (safeIdx === 0) {
          currentMainUrl = uploadRes.videoUrl;
          currentMainType = 'direct';
        }
        while (workingMulti.length <= safeIdx) {
          workingMulti.push({
            id: workingMulti.length + 1,
            title: `Phần ${workingMulti.length + 1}: Bài giảng thực chiến`,
            url: '',
            type: 'direct',
            duration: '15 phút'
          });
        }
        workingMulti[safeIdx] = {
          ...workingMulti[safeIdx],
          title: uploadRes.cleanTitle || workingMulti[safeIdx]?.title || `Phần ${safeIdx + 1}: Bài giảng thực chiến`,
          url: uploadRes.videoUrl,
          type: 'direct'
        };
      }

      if (activeTab === 'youtube') {
        currentMainType = 'youtube';
      } else if (activeTab === 'drive') {
        currentMainType = 'drive';
      } else if (activeTab === 'multipart' && workingMulti[0]?.url) {
        currentMainUrl = workingMulti[0].url;
        currentMainType = workingMulti[0].type || 'direct';
      }

      // Chuẩn hóa mảng multiVideos (Bảo toàn đầy đủ summary, timestamps, quiz, questionPool riêng của từng Phần)
      const updatedMulti = workingMulti.map((v, i) => {
        let partUrl = v.url || '';
        let partType = v.type || 'direct';

        if (i === safeIdx && activeTab !== 'multipart') {
          if (i === 0) {
            partUrl = currentMainUrl;
            partType = currentMainType;
          }
        }

        return {
          ...v,
          id: v.id || i + 1,
          title: v.title || `Phần ${i + 1}: Lý thuyết chuyên đề`,
          url: partUrl,
          type: partType,
          duration: v.duration || '15 phút'
        };
      });

      const finalMainUrl = (safeIdx === 0 && activeTab !== 'multipart')
        ? currentMainUrl
        : (updatedMulti[0]?.url !== undefined ? updatedMulti[0].url : currentMainUrl);
      const finalMainType = (safeIdx === 0 && activeTab !== 'multipart')
        ? currentMainType
        : (updatedMulti[0]?.type || currentMainType);

      const res = await api.courses.updateVideo(currentLesson.id, {
        videoUrl: finalMainUrl,
        videoType: finalMainType,
        videos: updatedMulti,
        resetSummaryAndQuiz: resetSummaryAndQuiz
      });

      if (res && res.success) {
        setMultiVideos(updatedMulti);
        setStatusMessage({ type: 'success', text: `Đã lưu cấu hình video cho "${currentLesson.title}" thành công!` });
        if (onVideoSaved) {
          onVideoSaved(res.courses || []);
        }
        if (shouldClose) {
          setTimeout(() => {
            onClose();
          }, 800);
        }
        return {
          success: true,
          mainUrl: finalMainUrl,
          videos: updatedMulti
        };
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

  // Gỡ bỏ / Hủy video đã chọn hoặc đã tải lên theo đúng Phần đang chọn (Lưu ngay vào database)
  const handleClearVideo = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn gỡ bỏ hoàn toàn video của Phần ${activePartIdx + 1} không? Video sẽ bị xóa khỏi hệ thống.`)) {
      return;
    }
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError('');
    const updated = multiVideos.map((v, i) => {
      if (i === activePartIdx) {
        return { ...v, url: '' };
      }
      return v;
    });
    setMultiVideos(updated);
    if (activePartIdx === 0) setVideoUrl('');

    setIsSaving(true);
    try {
      const finalMainUrl = activePartIdx === 0 ? '' : (updated[0]?.url || '');
      const finalMainType = activePartIdx === 0 ? 'direct' : (updated[0]?.type || 'direct');
      const res = await api.courses.updateVideo(currentLesson.id, {
        videoUrl: finalMainUrl,
        videoType: finalMainType,
        videos: updated,
        resetSummaryAndQuiz: false
      });
      if (res && res.success) {
        setStatusMessage({
          type: 'success',
          text: `Đã gỡ bỏ và xóa hoàn toàn video của Phần ${activePartIdx + 1} thành công!`
        });
        if (onVideoSaved) {
          onVideoSaved(res.courses || []);
        }
      } else {
        setStatusMessage({ type: 'error', text: res?.message || 'Không thể gỡ bỏ video' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: `Lỗi gỡ video: ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  // Gỡ bỏ ngay lập tức Tóm tắt & Bài thi cũ không khớp của chuyên đề này
  const handleClearContentNow = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn GỠ BỎ Tóm tắt & Đề thi cũ của bài học này không?\n\n• Tóm tắt & mốc thời gian cũ sẽ được gỡ bỏ ngay lập tức.\n• Bộ câu hỏi trắc nghiệm BĐS cũ sẽ được gỡ bỏ ngay.\n• Bạn có thể up file tài liệu/đề thi sau trong tab "Giáo Trình Đọc".`)) {
      return;
    }
    setIsSaving(true);
    setStatusMessage({ type: '', text: '' });
    try {
      const res = await api.courses.clearContent(currentLesson.id, {
        targetVideoIndex: activePartIdx,
        clearType: 'all'
      });
      if (res && res.success) {
        setStatusMessage({
          type: 'success',
          text: `Đã gỡ bỏ sạch sẽ tóm tắt & đề thi cũ của Phần ${activePartIdx + 1} thành công!`
        });
        if (onVideoSaved) {
          onVideoSaved(res.courses || []);
        }
      } else {
        setStatusMessage({ type: 'error', text: res?.message || 'Lỗi khi gỡ bỏ nội dung' });
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

  // Tự động chuyển luồng phát preview theo tab và phần video đang chọn
  const currentPartVideo = multiVideos[activePartIdx] || null;
  const previewUrl = (activeTab === 'multipart' || activeTab === 'upload')
    ? (currentPartVideo?.url || (activePartIdx === 0 ? videoUrl : ''))
    : videoUrl;
  const isEmbedSource = previewUrl.includes('youtube.com') || previewUrl.includes('youtu.be') || previewUrl.includes('drive.google.com');

  const tabs = [
    { id: 'upload', label: 'Quay & Tải Lên Trực Tiếp', icon: Camera, badge: 'Camera / 10GB+' },
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
              {/* Thanh chọn Phần bài giảng để gắn file MP4 tải lên */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="text-xs font-bold text-slate-800 dark:text-stone-200 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Chọn Phần bài giảng để tải video lên & tạo đề riêng:</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {multiVideos.map((v, idx) => (
                    <button
                      key={v.id || idx}
                      type="button"
                      onClick={() => setActivePartIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        activePartIdx === idx
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-300 border border-slate-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      Phần {idx + 1} {v.url ? '✓' : ''}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newIdx = multiVideos.length;
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
                      setActivePartIdx(newIdx);
                    }}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Phần {multiVideos.length + 1}</span>
                  </button>
                </div>
              </div>

              {/* Micro-Tips Banner tinh gọn */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center space-x-2 text-blue-900 dark:text-blue-200 font-bold">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Đang chọn tải video cho: Phần {activePartIdx + 1} ({multiVideos[activePartIdx]?.title || `Phần ${activePartIdx + 1}`})</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    Dung lượng tới 10GB+
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    AI Đọc Trực Tiếp MP4
                  </span>
                </div>
              </div>

              {/* Thẻ hiển thị video hiện tại của Phần đang chọn và nút Gỡ Bỏ Video */}
              {(multiVideos[activePartIdx]?.url || (activePartIdx === 0 && videoUrl)) && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 flex items-center justify-between gap-3 animate-in fade-in duration-150">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Film className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                        Video đang gắn tại Phần {activePartIdx + 1}: {multiVideos[activePartIdx]?.title || `Phần ${activePartIdx + 1}`}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-stone-400 font-mono truncate">
                        {multiVideos[activePartIdx]?.url || videoUrl}
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
                    <span>Gỡ Video Phần {activePartIdx + 1}</span>
                  </button>
                </div>
              )}

              {/* Bộ Công Cụ Tải Video & Quay Trực Tiếp Bằng Điện Thoại */}
              <div className="space-y-3.5">
                {/* 2 Lựa chọn lớn: 1. Quay Trực Tiếp Bằng Camera Điện Thoại | 2. Chọn Video Có Sẵn */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* LỰA CHỌN 1: QUAY CAMERA ĐIỆN THOẠI TRỰC TIẾP */}
                  <div>
                    <input 
                      type="file" 
                      id="mobile-native-camera-input" 
                      accept="video/*" 
                      capture="environment"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setSelectedFile(f);
                          setUploadError('');
                          setUploadProgress(0);
                          handleStartUpload(activePartIdx, f);
                        }
                      }}
                      className="hidden" 
                    />
                    <label 
                      htmlFor="mobile-native-camera-input"
                      className="h-full p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/15 border-2 border-emerald-500/40 hover:border-emerald-500 dark:border-emerald-500/30 dark:hover:border-emerald-400 cursor-pointer transition-all flex flex-col items-center justify-between text-center space-y-3 group shadow-2xs hover:shadow-md"
                    >
                      <div className="w-13 h-13 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center justify-center space-x-1">
                          <span>Quay Bằng Camera Điện Thoại</span>
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-stone-300 leading-snug">
                          Chạm là mở ngay Camera điện thoại quay thực địa hoặc bài giảng rồi tự động tải lên Phần {activePartIdx + 1}
                        </p>
                      </div>
                      <span className="w-full py-2.5 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-all">
                        <Camera className="w-4 h-4" />
                        <span>Mở Camera Quay Ngay</span>
                      </span>
                    </label>
                  </div>

                  {/* LỰA CHỌN 2: MỞ ALBUM / THƯ VIỆN ẢNH ĐIỆN THOẠI HOẶC MÁY TÍNH */}
                  <div>
                    <input 
                      type="file" 
                      id="admin-video-file-input" 
                      accept="video/*,.mp4,.mov,.webm,.mkv,.avi"
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <label 
                      htmlFor="admin-video-file-input"
                      className="h-full p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-blue-500/15 border-2 border-blue-500/40 hover:border-blue-500 dark:border-blue-500/30 dark:hover:border-blue-400 cursor-pointer transition-all flex flex-col items-center justify-between text-center space-y-3 group shadow-2xs hover:shadow-md"
                    >
                      <div className="w-13 h-13 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <FolderOpen className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center justify-center space-x-1">
                          <span>Mở Album & Thư Viện Điện Thoại</span>
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-stone-300 leading-snug">
                          Truy cập Album ảnh (Photo Library / Bộ sưu tập) của điện thoại hoặc ổ đĩa máy tính (Tối đa 10GB+, MP4, MOV...)
                        </p>
                      </div>
                      <span className="w-full py-2.5 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-all">
                        <Image className="w-4 h-4" />
                        <span>Mở Album & Chọn Video</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* LỰA CHỌN 3: STUDIO QUAY TRỰC TIẾP TRÊN TRÌNH DUYỆT (WEBCAM & MIC) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isStudioOpen) {
                        setIsStudioOpen(true);
                        startCameraStream();
                      } else {
                        stopCameraStream();
                        setIsStudioOpen(false);
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 hover:bg-slate-50 dark:hover:bg-stone-700 text-xs font-bold text-slate-700 dark:text-stone-200 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <Video className="w-4 h-4 text-rose-500" />
                    <span>{isStudioOpen ? 'Đóng Studio Quay Trực Tiếp' : 'Hoặc: Bật Studio Quay Trực Tiếp Trên Trình Duyệt Web (Webcam & Mic)'}</span>
                  </button>

                  {/* Giao diện Studio Live Recorder khi mở */}
                  {isStudioOpen && (
                    <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center space-x-2">
                          <span className={`w-3 h-3 rounded-full ${recordingState === 'recording' ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                            {recordingState === 'recording' ? 'Đang quay trực tiếp...' : recordingState === 'recorded' ? 'Xem lại đoạn video vừa quay' : 'Studio Webcam & Microphone'}
                          </h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          {recordingState !== 'recording' && (
                            <button
                              type="button"
                              onClick={toggleCameraFacing}
                              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                              title="Đổi camera trước / sau"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Đổi Cam ({studioFacingMode === 'environment' ? 'Sau' : 'Trước'})</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              stopCameraStream();
                              setIsStudioOpen(false);
                            }}
                            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {studioError && (
                        <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                          {studioError}
                        </div>
                      )}

                      {/* Khung hình Viewfinder Camera hoặc Preview */}
                      <div className="relative aspect-video max-h-[360px] bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                        {recordingState === 'recorded' && recordedVideoUrl ? (
                          <video 
                            src={recordedVideoUrl} 
                            controls 
                            autoPlay 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <video 
                            ref={videoPreviewRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Đồng hồ đếm thời gian khi đang quay */}
                        {recordingState === 'recording' && (
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600/90 text-white font-mono font-black text-xs flex items-center space-x-1.5 shadow-md">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            <span>REC {formatRecordingTime(recordingSeconds)}</span>
                          </div>
                        )}
                      </div>

                      {/* Thanh điều khiển Recording */}
                      <div className="flex items-center justify-center gap-3">
                        {recordingState === 'idle' && (
                          <button
                            type="button"
                            onClick={startLiveRecording}
                            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg flex items-center space-x-2 transition-all cursor-pointer hover:scale-105"
                          >
                            <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                            <span>Bắt Đầu Quay Video</span>
                          </button>
                        )}

                        {recordingState === 'recording' && (
                          <button
                            type="button"
                            onClick={stopLiveRecording}
                            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-black text-xs shadow-lg flex items-center space-x-2 transition-all cursor-pointer animate-pulse"
                          >
                            <StopCircle className="w-4 h-4 text-rose-600" />
                            <span>Dừng Quay & Xem Lại</span>
                          </button>
                        )}

                        {recordingState === 'recorded' && (
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <button
                              type="button"
                              onClick={handleRetakeVideo}
                              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Quay Lại</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleApplyRecordedVideo}
                              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>Dùng Video Này & Tải Lên Phần {activePartIdx + 1}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin File đã chọn & chuẩn bị tải lên */}
              {selectedFile && (
                <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Film className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        File đã chuẩn bị: {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-stone-400">
                        Dung lượng: {formatFileSize(selectedFile.size)} • Sẵn sàng tải lên Phần {activePartIdx + 1}
                      </p>
                    </div>
                  </div>

                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => handleStartUpload(activePartIdx, selectedFile)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Bấm Tải Lên Ngay</span>
                    </button>
                  )}
                </div>
              )}

              {/* Progress Bar khi đang upload */}
              {isUploading && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#201c1a] border border-slate-200 dark:border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-blue-600 dark:text-blue-400 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      <span>Đang truyền tải video Phần {activePartIdx + 1} lên máy chủ...</span>
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
                {multiVideos.map((v, idx) => {
                  const isSelected = activePartIdx === idx;
                  return (
                    <div 
                      key={v.id || idx}
                      onClick={() => setActivePartIdx(idx)}
                      className={`p-3.5 rounded-2xl transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'bg-amber-500/10 dark:bg-amber-500/15 border-2 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                          : 'bg-slate-50 dark:bg-[#201c1a] border border-slate-200 dark:border-white/[0.08] hover:border-amber-400/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Video 0{idx + 1}
                          </span>
                          {isSelected ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 flex items-center space-x-1 shadow-2xs">
                              <span>✓ Đang xem trước & chọn tạo đề</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 dark:text-stone-400 font-medium hidden sm:inline">
                              (Bấm để xem video & chọn tạo đề)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            disabled={isSaving || isUploading || isAiGenerating || !v.url}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePartIdx(idx);
                              handleSaveAndTriggerAi(idx);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-[11px] shadow-xs flex items-center space-x-1 cursor-pointer transition-all disabled:opacity-40"
                            title={`Lưu cấu hình và kích hoạt AI 3.8 tạo 10 câu trắc nghiệm cho Video 0${idx + 1}`}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                            <span>AI Tạo Đề Phần {idx + 1}</span>
                          </button>

                          {multiVideos.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const partTitle = v.title || `Phần 0${idx + 1}`;
                                if (window.confirm(`Bạn có chắc chắn muốn xóa phần video này không?\n\n"${partTitle}"\n\n(Lưu ý: Bấm nút "Lưu Video" ở dưới để lưu cập nhật vào hệ thống)`)) {
                                  setMultiVideos(prev => prev.filter((_, i) => i !== idx));
                                  if (activePartIdx >= idx && activePartIdx > 0) {
                                    setActivePartIdx(activePartIdx - 1);
                                  }
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
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={v.title}
                          onFocus={() => setActivePartIdx(idx)}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMultiVideos(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], title: val };
                              return updated;
                            });
                          }}
                          placeholder="Tiêu đề video..."
                          className="sm:col-span-2 px-3 py-2 rounded-xl bg-white dark:bg-[#171514] border border-slate-200 dark:border-white/[0.08] text-xs focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          value={v.duration}
                          onFocus={() => setActivePartIdx(idx)}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMultiVideos(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], duration: val };
                              return updated;
                            });
                          }}
                          placeholder="Thời lượng (vd: 15 phút)"
                          className="px-3 py-2 rounded-xl bg-white dark:bg-[#171514] border border-slate-200 dark:border-white/[0.08] text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <input
                        type="text"
                        value={v.url}
                        onFocus={() => setActivePartIdx(idx)}
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
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#171514] border border-slate-200 dark:border-white/[0.08] text-xs font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI VIDEO INTELLIGENCE BANNER: Tự động Lưu + Upload file (nếu có) trước khi gọi AI đọc đúng Phần đang chọn */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-indigo-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
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
                    Đọc Video Thật 100%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-stone-300 mt-1 leading-relaxed">
                  {`AI tự động lưu và đọc trực tiếp video của Phần ${activePartIdx + 1} (${currentPartVideo?.title || `Phần ${activePartIdx + 1}`}). Chọn riêng chức năng Tóm tắt hoặc Tạo đề độc lập:`}
                </p>
              </div>
            </div>

            {/* TÁCH 2 NÚT RIÊNG BIỆT: TÓM TẮT & TẠO ĐỀ */}
            <div className="flex items-center gap-2 flex-wrap shrink-0 w-full md:w-auto">
              <button
                type="button"
                disabled={isAiGenerating || isUploading || isSaving}
                onClick={() => handleSaveAndTriggerAi(activePartIdx, 'summary_only')}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-60 active:scale-95"
                title={`AI đọc video Phần ${activePartIdx + 1} để trích xuất 4 điểm tóm tắt cốt lõi & mốc thời gian`}
              >
                <Sparkles className={`w-4 h-4 text-slate-950 ${isAiGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isAiGenerating ? 'AI đang đọc...' : `✨ AI Tóm Tắt (Phần ${activePartIdx + 1})`}
                </span>
              </button>

              <button
                type="button"
                disabled={isAiGenerating || isUploading || isSaving}
                onClick={() => handleSaveAndTriggerAi(activePartIdx, 'quiz_only')}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-60 active:scale-95"
                title={`AI đọc video Phần ${activePartIdx + 1} để sinh 10 câu trắc nghiệm sát hạch bám sát video`}
              >
                <BookmarkCheck className="w-4 h-4 text-blue-200" />
                <span>
                  {isAiGenerating ? 'AI đang tạo...' : `⚡ AI Tạo Đề (Phần ${activePartIdx + 1})`}
                </span>
              </button>
            </div>
          </div>

          {/* LIVE PREVIEW BOX: Đồng bộ hiển thị đúng video của tab / phần đang chọn */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-stone-300 flex items-center space-x-1.5">
                <Play className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {`Xem trước luồng phát: Phần ${activePartIdx + 1}${currentPartVideo?.title ? ` (${currentPartVideo.title})` : ''}`}
                </span>
              </span>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px] hidden sm:inline">
                  {previewUrl || 'Chưa có URL'}
                </span>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleClearVideo}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-[11px] font-bold border border-rose-200 dark:border-rose-900/60 flex items-center space-x-1 transition-colors cursor-pointer"
                    title={`Gỡ bỏ video của Phần ${activePartIdx + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Gỡ Video Phần {activePartIdx + 1}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-white/[0.08]">
              {previewUrl ? (
                isEmbedSource ? (
                  <iframe
                    src={getPreviewEmbedUrl(previewUrl)}
                    title="Video Preview"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <Film className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-60" />
                  <p className="text-xs">
                    {`Phần ${activePartIdx + 1} chưa có video. Vui lòng chọn file tải lên hoặc nhập URL ở trên.`}
                  </p>
                </div>
              )}
            </div>

            {/* TÙY CHỌN LÀM MỚI TÓM TẮT & BÀI THI KHI ÚP VIDEO */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={resetSummaryAndQuiz}
                  onChange={(e) => setResetSummaryAndQuiz(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Gỡ bỏ Tóm tắt & Bài thi cũ không khớp với video này</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 uppercase">
                      Mặc định khuyên dùng
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-stone-300 leading-relaxed">
                    Khi bạn chỉ bấm <strong>"Lưu Video"</strong> (không kích hoạt AI), hệ thống sẽ tự động gỡ bỏ tóm tắt cũ và bộ câu hỏi trắc nghiệm BĐS cũ để tránh râu ông nọ cắm cằm bà kia. Đề thi có thể tải lên sau dưới dạng file tài liệu (HTML/Word/PDF) trong tab <em>"Giáo Trình Đọc"</em>.
                  </p>
                </div>
              </label>

              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                  Muốn dọn dẹp ngay bài hiện tại mà không cần up lại video?
                </span>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleClearContentNow}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  title="Gỡ bỏ tóm tắt và bộ câu hỏi cũ của bài học này ngay lập tức"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Gỡ bỏ Tóm tắt & Đề thi cũ ngay</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions: Đồng bộ nút Lưu & Cho AI Tạo Đề theo phần video đang chọn */}
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
              onClick={() => handleSaveVideoConfig(true, activePartIdx)}
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

            {/* 2 Nút Lưu & Kích hoạt AI độc lập */}
            <button
              type="button"
              disabled={isSaving || isUploading || isAiGenerating}
              onClick={() => handleSaveAndTriggerAi(activePartIdx, 'summary_only')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
              title="Lưu video và cho AI đọc để trích xuất tóm tắt cốt lõi & mốc thời gian (Không ghi đè đề thi)"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>
                {isAiGenerating 
                  ? 'AI đang đọc...' 
                  : `✨ Lưu & AI Tóm Tắt (P${activePartIdx + 1})`}
              </span>
            </button>

            <button
              type="button"
              disabled={isSaving || isUploading || isAiGenerating}
              onClick={() => handleSaveAndTriggerAi(activePartIdx, 'quiz_only')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
              title="Lưu video và cho AI đọc để sinh 10 câu sát hạch mới (Không ghi đè tóm tắt)"
            >
              <BookmarkCheck className="w-4 h-4 text-blue-200" />
              <span>
                {isAiGenerating 
                  ? 'AI đang tạo...' 
                  : `⚡ Lưu & AI Tạo Đề (P${activePartIdx + 1})`}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
