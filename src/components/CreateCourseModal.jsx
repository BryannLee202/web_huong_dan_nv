import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  PlusCircle, 
  Save, 
  Film, 
  HelpCircle, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Layers, 
  Link2,
  FileCheck2,
  FolderPlus
} from 'lucide-react';
import api from '../services/api';

export default function CreateCourseModal({ 
  isOpen, 
  onClose, 
  onCourseCreated,
  nextOrderNum = 9
}) {
  const [activeStep, setActiveStep] = useState('info'); // 'info' | 'videos' | 'quiz'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // 1. Thông tin chung chuyên đề
  const [courseCode, setCourseCode] = useState(`RM-${String(nextOrderNum).padStart(2, '0')}`);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('nhom_1');
  const [courseDuration, setCourseDuration] = useState('60 phút');
  const [passingScore, setPassingScore] = useState(80);
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=700&q=80');
  const [summaryPoints, setSummaryPoints] = useState([
    'Nắm vững nguyên lý cốt lõi và tiêu chuẩn sản phẩm thực địa.',
    'Thực hành kịch bản tư vấn nhanh trong 2 phút đầu tiên.',
    'Xử lý tình huống từ chối phổ biến của khách thuê thực tế.'
  ]);

  // 2. Cấu hình đúng 4 Video Lý Thuyết cho chuyên đề (để trống URL nếu chờ tải lên sau)
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Video 1: Tổng quan lý thuyết & Khái niệm nền tảng',
      url: '',
      type: 'youtube', // 'youtube' | 'gdrive' | 'direct' | 'upload'
      duration: '15:00'
    },
    {
      id: 2,
      title: 'Video 2: Phân tích mô hình & Khảo sát thực tế phòng trọ / căn hộ',
      url: '',
      type: 'youtube',
      duration: '15:00'
    },
    {
      id: 3,
      title: 'Video 3: Kịch bản tư vấn & Kỹ năng bẻ giá đàm phán',
      url: '',
      type: 'youtube',
      duration: '15:00'
    },
    {
      id: 4,
      title: 'Video 4: Tổng kết thực chiến & Hướng dẫn làm bài thi sát hạch',
      url: '',
      type: 'youtube',
      duration: '15:00'
    }
  ]);

  // 3. Cấu hình trắc nghiệm sát hạch (mặc định rỗng, admin có thể thêm thủ công hoặc dùng AI sinh đề sau)
  const [quizzes, setQuizzes] = useState([]);

  // Thêm / sửa tóm tắt
  const handleUpdateSummaryPoint = (index, value) => {
    const updated = [...summaryPoints];
    updated[index] = value;
    setSummaryPoints(updated);
  };

  const handleAddSummaryPoint = () => {
    setSummaryPoints([...summaryPoints, '']);
  };

  const handleRemoveSummaryPoint = (index) => {
    setSummaryPoints(summaryPoints.filter((_, i) => i !== index));
  };

  // Cập nhật video
  const handleUpdateVideo = (index, field, value) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], [field]: value };
    setVideos(updated);
  };

  // Upload video file trực tiếp lên server
  const handleUploadVideoFile = async (index, file) => {
    if (!file) return;
    setUploadingIndex(index);
    setStatusMessage({ type: 'info', text: `Đang tải video ${index + 1} lên máy chủ...` });

    try {
      const data = await api.video.upload(file);
      if (data && data.success) {
        handleUpdateVideo(index, 'url', data.videoUrl);
        handleUpdateVideo(index, 'type', 'direct');
        setStatusMessage({ type: 'success', text: `Tải video ${index + 1} thành công!` });
      } else {
        setStatusMessage({ type: 'error', text: data?.message || 'Lỗi tải video lên máy chủ' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Không thể kết nối đến máy chủ tải video' });
    } finally {
      setUploadingIndex(null);
    }
  };

  // Thêm / sửa câu hỏi trắc nghiệm
  const handleAddQuiz = () => {
    setQuizzes([
      ...quizzes,
      {
        id: `q_${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }
    ]);
  };

  const handleUpdateQuiz = (qIdx, field, value) => {
    const updated = [...quizzes];
    updated[qIdx] = { ...updated[qIdx], [field]: value };
    setQuizzes(updated);
  };

  const handleUpdateQuizOption = (qIdx, optIdx, value) => {
    const updated = [...quizzes];
    const newOptions = [...updated[qIdx].options];
    newOptions[optIdx] = value;
    updated[qIdx].options = newOptions;
    setQuizzes(updated);
  };

  const handleRemoveQuiz = (qIdx) => {
    setQuizzes(quizzes.filter((_, i) => i !== qIdx));
  };

  // Danh mục 8 chủ đề năng lực ngắn gọn
  const categoryOptions = [
    { key: 'nhom_1', label: 'Chủ đề 1 • Sản phẩm & Thị trường' },
    { key: 'nhom_2', label: 'Chủ đề 2 • Nguồn hàng & Giỏ căn' },
    { key: 'nhom_3', label: 'Chủ đề 3 • Tìm khách & Nhu cầu' },
    { key: 'nhom_4', label: 'Chủ đề 4 • Tư vấn & Dẫn khách' },
    { key: 'nhom_5', label: 'Chủ đề 5 • Đàm phán & Chốt cọc' },
    { key: 'nhom_6', label: 'Chủ đề 6 • CRM & Quản lý phễu' },
    { key: 'nhom_7', label: 'Chủ đề 7 • Kỷ luật nghề & CSKH' },
    { key: 'nhom_8', label: 'Chủ đề 8 • Thực chiến thị trường' }
  ];

  // Submit tạo chuyên đề mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseTitle.trim()) {
      setActiveStep('info');
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập tên chuyên đề!' });
      return;
    }

    // Kiểm tra tiêu đề 4 video (đường link có thể bổ sung hoặc upload sau)
    const invalidVideo = videos.find(v => !v.title || !v.title.trim());
    if (invalidVideo) {
      setActiveStep('videos');
      setStatusMessage({ type: 'error', text: 'Vui lòng điền tiêu đề cho các phần video lý thuyết!' });
      return;
    }

    // Lọc các câu hỏi trắc nghiệm hợp lệ (nếu admin có thêm)
    const validQuizzes = quizzes.filter(q => q && q.question && q.question.trim());
    for (let i = 0; i < validQuizzes.length; i++) {
      const q = validQuizzes[i];
      if (!Array.isArray(q.options) || q.options.some(opt => !opt.trim())) {
        setActiveStep('quiz');
        setStatusMessage({ type: 'error', text: `Câu số ${i + 1} cần điền đầy đủ các lựa chọn đáp án.` });
        return;
      }
    }

    setIsSubmitting(true);
    setStatusMessage({ type: 'info', text: 'Đang lưu chuyên đề vào SQLite database...' });

    const newCoursePayload = {
      id: `bai-${nextOrderNum}`,
      order: nextOrderNum,
      rinCode: courseCode,
      title: `${courseCode}: ${courseTitle.toUpperCase()}`,
      category: categoryOptions.find(c => c.key === courseCategory)?.label || 'Chủ đề Thực Chiến',
      groupKey: courseCategory,
      duration: courseDuration,
      passingScore: Number(passingScore) || 80,
      thumb: thumbnailUrl,
      summary: summaryPoints.filter(p => p.trim()),
      videos: videos.map((v, i) => ({
        id: i + 1,
        title: v.title.trim() || `Phần ${i + 1}: Lý thuyết nền tảng`,
        url: (v.url || '').trim(),
        type: v.type || 'direct',
        duration: v.duration || '15:00',
        quiz: [],
        questionPool: []
      })),
      quiz: validQuizzes.map((q, idx) => ({
        id: `q_${nextOrderNum}_${idx + 1}`,
        question: q.question.trim(),
        options: q.options.map(opt => opt.trim()),
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: (q.explanation || '').trim()
      }))
    };

    try {
      const data = await api.courses.create(newCoursePayload);
      if (data && data.success) {
        setStatusMessage({ type: 'success', text: '✅ Đã tạo chuyên đề mới và đồng bộ vào SQLite thành công!' });
        setTimeout(() => {
          if (onCourseCreated) {
            onCourseCreated(data.courses || []);
          }
          onClose();
        }, 600);
      } else {
        setStatusMessage({ type: 'error', text: data?.message || 'Lỗi khi lưu vào SQLite database' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi máy chủ kết nối SQLite database!' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-0 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] max-w-4xl bg-white dark:bg-[#1f1c1a] rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 dark:border-white/[0.1] overflow-hidden flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MOBILE HEADER (sm:hidden) */}
        <div className="sm:hidden px-3.5 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-white/[0.1] shrink-0 gap-2">
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition-all cursor-pointer active:scale-90 shrink-0"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0 text-center px-1">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider mb-0.5">
              <span>Admin Only</span>
              <span>•</span>
              <span className="font-mono">{courseCode}</span>
            </div>
            <h3 className="text-xs font-black text-white truncate">
              Tạo Chuyên Đề Đào Tạo Mới
            </h3>
          </div>

          <div className="w-9 shrink-0 text-right">
            <span className="text-[10px] font-mono text-stone-400">
              {activeStep === 'info' ? '1/3' : activeStep === 'videos' ? '2/3' : '3/3'}
            </span>
          </div>
        </div>

        {/* DESKTOP HEADER (hidden sm:flex) */}
        <div className="hidden sm:flex px-6 py-4 bg-slate-900 text-white items-center justify-between border-b border-white/[0.1] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black tracking-wide uppercase text-white">
                  TẠO PHÒNG CHUYÊN ĐỀ ĐÀO TẠO MỚI
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wider">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-stone-300 font-medium">
                Cấu hình 4 Video lý thuyết đa nguồn (YouTube, Drive, MP4) & 1 Bộ trắc nghiệm sát hạch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Step Pills (Scroll ngang mượt mà trên di động) */}
        <div className="px-3 sm:px-6 py-2.5 bg-slate-100 dark:bg-[#171514] border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-2 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveStep('info')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                activeStep === 'info'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-[#262220] text-slate-600 dark:text-stone-300 hover:bg-slate-200 dark:hover:bg-[#302b28]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Thông tin chung</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('videos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                activeStep === 'videos'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-[#262220] text-slate-600 dark:text-stone-300 hover:bg-slate-200 dark:hover:bg-[#302b28]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>2. 4 Video Lý Thuyết ({videos.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                activeStep === 'quiz'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-[#262220] text-slate-600 dark:text-stone-300 hover:bg-slate-200 dark:hover:bg-[#302b28]'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>3. Trắc nghiệm ({quizzes.length} câu)</span>
            </button>
          </div>

          <div className="hidden sm:block text-[11px] font-mono text-slate-500 dark:text-stone-400 shrink-0">
            Mã định danh: <span className="font-bold text-amber-500">{courseCode}</span>
          </div>
        </div>

        {/* Status Alert Banner */}
        {statusMessage.text && (
          <div className={`px-6 py-2 text-xs font-semibold flex items-center space-x-2 shrink-0 ${
            statusMessage.type === 'error'
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-b border-rose-500/20'
              : statusMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/20'
              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-b border-blue-500/20'
          }`}>
            {statusMessage.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ============================================================= */}
          {/* STEP 1: THÔNG TIN CHUYÊN ĐỀ                                   */}
          {/* ============================================================= */}
          {activeStep === 'info' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
                    Mã Chuyên Đề <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="VD: RM-09"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#262220] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
                    Tên Chuyên Đề Đào Tạo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="VD: KỸ NĂNG ĐÀM PHÁN HỢP ĐỒNG & CHỐT PHÒNG THẦN TỐC"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#262220] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
                    Nhóm năng lực
                  </label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#262220] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat.key} value={cat.key} className="bg-white dark:bg-[#1f1c1a]">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
                    Thời lượng ước tính
                  </label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    placeholder="VD: 60 phút (4 video)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#262220] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
                    Điểm đạt trắc nghiệm (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#262220] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-stone-300 block mb-1">
                  Đường dẫn ảnh bìa Thumbnail
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#262220] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                  {thumbnailUrl && (
                    <div className="w-12 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                      <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Tóm tắt lý thuyết cốt lõi */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-stone-300">
                    Tóm tắt & Mục tiêu ghi nhớ nhanh
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSummaryPoint}
                    className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Thêm ý</span>
                  </button>
                </div>
                {summaryPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="w-5 text-center text-xs font-bold text-slate-400">{idx + 1}.</span>
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => handleUpdateSummaryPoint(idx, e.target.value)}
                      placeholder="Nhập nội dung tóm tắt cốt lõi..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#262220] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSummaryPoint(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* STEP 2: 4 VIDEO LÝ THUYẾT ĐA NGUỒN                            */}
          {/* ============================================================= */}
          {activeStep === 'videos' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Film className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-xs font-bold text-slate-800 dark:text-amber-100">
                    Tiêu chuẩn: Mỗi chuyên đề gồm đúng 4 Video lý thuyết chuyên sâu.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-stone-400">
                  Hỗ trợ: YouTube • Google Drive • MP4 trực tiếp • Upload file
                </span>
              </div>

              <div className="space-y-4">
                {videos.map((vid, vIdx) => (
                  <div 
                    key={vid.id || vIdx} 
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#262220] border border-slate-200 dark:border-white/[0.08] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                          0{vIdx + 1}
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                          Video Lý Thuyết Số {vIdx + 1}
                        </h4>
                      </div>

                      {/* Loại nguồn video */}
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateVideo(vIdx, 'type', 'youtube')}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                            vid.type === 'youtube'
                              ? 'bg-red-600 text-white shadow-2xs'
                              : 'bg-white dark:bg-[#1f1c1a] text-slate-600 dark:text-stone-300'
                          }`}
                        >
                          YouTube
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateVideo(vIdx, 'type', 'gdrive')}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                            vid.type === 'gdrive'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'bg-white dark:bg-[#1f1c1a] text-slate-600 dark:text-stone-300'
                          }`}
                        >
                          Google Drive
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateVideo(vIdx, 'type', 'direct')}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                            vid.type === 'direct'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-white dark:bg-[#1f1c1a] text-slate-600 dark:text-stone-300'
                          }`}
                        >
                          Direct / MP4
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-3">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-stone-400 block mb-1">
                          Tiêu đề phần video
                        </label>
                        <input
                          type="text"
                          value={vid.title}
                          onChange={(e) => handleUpdateVideo(vIdx, 'title', e.target.value)}
                          placeholder={`VD: Phần ${vIdx + 1}: Kỹ năng then chốt...`}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1f1c1a] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-stone-400 block mb-1">
                          Thời lượng
                        </label>
                        <input
                          type="text"
                          value={vid.duration}
                          onChange={(e) => handleUpdateVideo(vIdx, 'duration', e.target.value)}
                          placeholder="VD: 15:00"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1f1c1a] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* URL & Upload Box */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-stone-400 block mb-1">
                        Đường dẫn Video ({vid.type === 'gdrive' ? 'Dán link Google Drive chia sẻ' : vid.type === 'youtube' ? 'Dán link YouTube (youtu.be hoặc watch?v=)' : 'Dán link MP4 hoặc Tải file lên'})
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={vid.url}
                            onChange={(e) => handleUpdateVideo(vIdx, 'url', e.target.value)}
                            placeholder={
                              vid.type === 'youtube'
                                ? 'https://www.youtube.com/watch?v=...'
                                : vid.type === 'gdrive'
                                ? 'https://drive.google.com/file/d/.../view?usp=sharing'
                                : 'https://domain.com/video.mp4 hoặc tải file'
                            }
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-[#1f1c1a] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                          />
                          <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                        </div>

                        {/* Nút Upload trực tiếp cho MP4 */}
                        <label className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-[#322c28] hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-stone-200 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingIndex === vIdx ? 'Đang tải...' : 'Tải MP4'}</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            disabled={uploadingIndex !== null}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleUploadVideoFile(vIdx, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* STEP 3: TRẮC NGHIỆM SÁT HẠCH                                   */}
          {/* ============================================================= */}
          {activeStep === 'quiz' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-xs font-bold text-slate-800 dark:text-amber-100">
                    Phần thi trắc nghiệm sát hạch chuyên đề ({quizzes.length} câu hỏi).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuiz}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Thêm câu hỏi mới</span>
                </button>
              </div>

              <div className="space-y-4">
                {quizzes.length === 0 ? (
                  <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#1a1715]/50">
                    <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700 dark:text-stone-300 mb-1">
                      Chưa có câu hỏi trắc nghiệm nào
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-stone-400 max-w-md mx-auto mb-3">
                      Bạn có thể bấm <strong>"Thêm câu hỏi mới"</strong> để tự nhập, hoặc tạo chuyên đề trước rồi dùng AI sinh đề / tải file đề lên sau khi đã có bài giảng video.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddQuiz}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold inline-flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Thêm câu hỏi đầu tiên</span>
                    </button>
                  </div>
                ) : (
                  quizzes.map((q, qIdx) => (
                  <div
                    key={q.id || qIdx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#262220] border border-slate-200 dark:border-white/[0.08] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Câu hỏi 0{qIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuiz(qIdx)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Xóa câu hỏi này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Nội dung câu hỏi */}
                    <div>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleUpdateQuiz(qIdx, 'question', e.target.value)}
                        placeholder="Nhập nội dung câu hỏi sát hạch..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1f1c1a] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* 4 Lựa chọn A, B, C, D */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctAnswer === optIdx;
                        const labelChar = String.fromCharCode(65 + optIdx);
                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all ${
                              isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-400'
                                : 'bg-white dark:bg-[#1f1c1a] border-slate-200 dark:border-white/[0.08]'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleUpdateQuiz(qIdx, 'correctAnswer', optIdx)}
                              className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                                isCorrect
                                  ? 'bg-emerald-500 text-slate-950 font-bold'
                                  : 'bg-slate-200 dark:bg-stone-700 text-slate-700 dark:text-stone-300 hover:bg-amber-500 hover:text-slate-950'
                              }`}
                              title={isCorrect ? 'Đáp án đúng' : 'Nhấn để chọn làm đáp án đúng'}
                            >
                              {labelChar}
                            </button>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleUpdateQuizOption(qIdx, optIdx, e.target.value)}
                              placeholder={`Lựa chọn ${labelChar}...`}
                              className="flex-1 bg-transparent text-xs text-slate-800 dark:text-white focus:outline-none font-medium"
                            />
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Lời giải thích */}
                    <div>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => handleUpdateQuiz(qIdx, 'explanation', e.target.value)}
                        placeholder="Lời giải thích chi tiết khi học viên hoàn thành câu này..."
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1f1c1a] border border-dashed border-slate-300 dark:border-white/[0.1] text-xs text-slate-700 dark:text-stone-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* DESKTOP FOOTER (hidden sm:flex) */}
        <div className="hidden sm:flex px-6 py-4 bg-slate-50 dark:bg-[#171514] border-t border-slate-200 dark:border-white/[0.08] items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            {activeStep !== 'info' && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 'quiz' ? 'videos' : 'info')}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-[#262220] hover:bg-slate-300 dark:hover:bg-[#302b28] text-slate-700 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer"
              >
                ← Quay lại bước trước
              </button>
            )}
            {activeStep !== 'quiz' && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 'info' ? 'videos' : 'quiz')}
                className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-[#302b28] hover:bg-slate-900 dark:hover:bg-[#3a3430] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Tiếp theo →
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-transparent hover:bg-slate-200 dark:hover:bg-white/[0.05] text-slate-600 dark:text-stone-300 text-xs font-bold transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang lưu vào SQLite...' : 'Lưu & Xuất Bản Chuyên Đề'}</span>
            </button>
          </div>
        </div>

        {/* MOBILE FOOTER (sm:hidden: 2 hàng chuẩn ngón tay cái) */}
        <div className="sm:hidden px-3.5 py-2.5 bg-slate-50 dark:bg-[#171514] border-t border-slate-200 dark:border-white/[0.08] flex flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang lưu vào SQLite...' : 'Lưu & Xuất Bản Chuyên Đề'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-stone-300 text-xs font-bold text-center cursor-pointer active:scale-95"
            >
              Hủy bỏ
            </button>
            {activeStep !== 'quiz' ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 'info' ? 'videos' : 'quiz')}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 dark:bg-[#302b28] text-white text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95"
              >
                Tiếp theo →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveStep('videos')}
                className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-[#262220] text-slate-800 dark:text-stone-200 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95"
              >
                ← Bước trước
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
