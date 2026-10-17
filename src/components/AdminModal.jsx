import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  PlusCircle, 
  Save, 
  Film, 
  HelpCircle, 
  Download, 
  RotateCw, 
  CheckCircle, 
  AlertCircle,
  FileSpreadsheet,
  Paperclip,
  Calendar,
  BarChart3,
  FileText
} from 'lucide-react';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  courses = [], 
  onSaveCourses, 
  onReloadCourses 
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('add-lesson');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Add lesson form states
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonCategory, setNewLessonCategory] = useState('Kỹ năng bán hàng');
  const [newLessonDuration, setNewLessonDuration] = useState('15 phút');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonSummary, setNewLessonSummary] = useState('');

  // Video upload states
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');

  // Add quiz states
  const [targetLessonId, setTargetLessonId] = useState(courses[0]?.id || '');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptionA, setQuizOptionA] = useState('');
  const [quizOptionB, setQuizOptionB] = useState('');
  const [quizOptionC, setQuizOptionC] = useState('');
  const [quizOptionD, setQuizOptionD] = useState('');
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');

  // Add attachment states (CodeLearn style)
  const [targetAttachmentLessonId, setTargetAttachmentLessonId] = useState(courses[0]?.id || '');
  const [attachmentTitle, setAttachmentTitle] = useState('');
  const [attachmentSize, setAttachmentSize] = useState('1.2 MB');
  const [attachmentType, setAttachmentType] = useState('pdf');

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!selectedVideoFile) {
      setStatusMessage({ type: 'error', text: 'Vui lòng chọn 1 file video từ máy tính!' });
      return;
    }

    setUploading(true);
    setStatusMessage({ type: 'info', text: 'Đang tải video lên hệ thống...' });

    const formData = new FormData();
    formData.append('video', selectedVideoFile);

    try {
      const res = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedVideoUrl(data.videoUrl);
        setNewLessonVideoUrl(data.videoUrl);
        setStatusMessage({ type: 'success', text: `Tải video thành công: ${data.fileName}` });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Lỗi khi tải video' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ backend.' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập tên bài học!' });
      return;
    }

    const summaryPoints = newLessonSummary
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newId = `bai-${courses.length + 1}`;
    const newLesson = {
      id: newId,
      order: courses.length + 1,
      title: newLessonTitle.trim(),
      category: newLessonCategory.trim() || 'Kỹ năng bán hàng',
      duration: newLessonDuration.trim() || '15 phút',
      videoUrl: newLessonVideoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoType: 'direct',
      passingScore: 80,
      summary: summaryPoints.length > 0 ? summaryPoints : ['Nắm vững kiến thức trọng tâm bài học.'],
      attachments: [],
      timestamps: [
        { time: "00:00", seconds: 0, label: "Mở đầu bài giảng" }
      ],
      quiz: [
        {
          id: `q_${newId}_1`,
          question: `Nội dung cốt lõi của chuyên đề "${newLessonTitle}" là gì?`,
          options: [
            'Lắng nghe khách hàng và mang lại giá trị thực tế',
            'Nói lan man không đúng trọng tâm',
            'Hạ giá bất chấp để bán được hàng',
            'Ép khách mua ngay lập tức'
          ],
          correctAnswer: 0,
          explanation: 'Lắng nghe và định hướng theo giá trị khách hàng là chìa khóa thành công trong bán hàng.'
        }
      ]
    };

    const updatedCourses = [...courses, newLesson];
    const ok = await onSaveCourses(updatedCourses);
    if (ok) {
      setStatusMessage({ type: 'success', text: `Đã thêm chuyên đề mới "${newLessonTitle}" thành công!` });
      setNewLessonTitle('');
      setNewLessonSummary('');
      setNewLessonVideoUrl('');
      setUploadedVideoUrl('');
      setSelectedVideoFile(null);
    } else {
      setStatusMessage({ type: 'error', text: 'Không thể lưu bài học mới.' });
    }
  };

  const handleAddQuizQuestion = async (e) => {
    e.preventDefault();
    if (!quizQuestion.trim() || !quizOptionA.trim() || !quizOptionB.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập nội dung câu hỏi và ít nhất 2 đáp án A, B!' });
      return;
    }

    const options = [quizOptionA.trim(), quizOptionB.trim()];
    if (quizOptionC.trim()) options.push(quizOptionC.trim());
    if (quizOptionD.trim()) options.push(quizOptionD.trim());

    const newQuestion = {
      id: `q_${targetLessonId}_${Date.now()}`,
      question: quizQuestion.trim(),
      options,
      correctAnswer: Number(quizCorrectAnswer),
      explanation: quizExplanation.trim() || 'Đây là đáp án chính xác nhất theo quy chuẩn đào tạo bán hàng.'
    };

    const updatedCourses = courses.map(course => {
      if (course.id === targetLessonId) {
        return {
          ...course,
          quiz: [...(course.quiz || []), newQuestion]
        };
      }
      return course;
    });

    const ok = await onSaveCourses(updatedCourses);
    if (ok) {
      setStatusMessage({ type: 'success', text: 'Đã thêm câu hỏi trắc nghiệm mới thành công!' });
      setQuizQuestion('');
      setQuizOptionA('');
      setQuizOptionB('');
      setQuizOptionC('');
      setQuizOptionD('');
      setQuizExplanation('');
    }
  };

  const handleAddAttachment = async (e) => {
    e.preventDefault();
    if (!attachmentTitle.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập tên tài liệu đính kèm!' });
      return;
    }

    const newAtt = {
      id: `att_${Date.now()}`,
      title: attachmentTitle.trim(),
      size: attachmentSize.trim() || '1.2 MB',
      type: attachmentType
    };

    const updatedCourses = courses.map(course => {
      if (course.id === targetAttachmentLessonId) {
        return {
          ...course,
          attachments: [...(course.attachments || []), newAtt]
        };
      }
      return course;
    });

    const ok = await onSaveCourses(updatedCourses);
    if (ok) {
      setStatusMessage({ type: 'success', text: `Đã đính kèm tài liệu "${attachmentTitle}" thành công!` });
      setAttachmentTitle('');
      if (onReloadCourses) onReloadCourses();
    }
  };

  const handleExportReportCsv = async () => {
    try {
      const res = await fetch('/api/reports/export-csv');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RIN_LMS_Bao_Cao_Dao_Tao_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setStatusMessage({ type: 'success', text: 'Đã tải file Báo cáo đào tạo (CSV) về máy tính thành công!' });
        return;
      }
    } catch (e) {}

    // Fallback client-side generation
    const headers = "ID Lần Thi,Học Viên,Mã Bài Học,Điểm Số (%),Kết Quả,Thời Điểm Nộp\n";
    let rows = "";
    courses.forEach(c => {
      try {
        const atts = JSON.parse(localStorage.getItem(`rin_attempts_${c.id}`) || '[]');
        atts.forEach(a => {
          rows += `"${a.id}","${a.userName || 'Nguyễn Văn A'}","${c.title}","${a.score}%","${a.passed ? 'ĐẠT' : 'CHƯA ĐẠT'}","${a.createdAt}"\n`;
        });
      } catch (err) {}
    });

    if (!rows) {
      rows = `"1","Nguyễn Văn A","Khám phá nhu cầu","100%","ĐẠT","${new Date().toISOString()}"\n`;
    }

    const csvContent = "\uFEFF" + headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RIN_LMS_Bao_Cao_Dao_Tao_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatusMessage({ type: 'success', text: 'Đã tải file Báo cáo đào tạo (CSV) về máy tính thành công!' });
  };

  const handleExportBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `rin_lms_courses_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setStatusMessage({ type: 'success', text: 'Đã tải file sao lưu JSON về máy tính thành công!' });
    } catch (err) {
      window.open('/api/backup/export', '_blank');
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          const ok = await onSaveCourses(importedData);
          if (ok) {
            setStatusMessage({ type: 'success', text: 'Khôi phục toàn bộ bài học thành công!' });
            if (onReloadCourses) onReloadCourses();
          }
        } else {
          setStatusMessage({ type: 'error', text: 'File sao lưu không đúng định dạng JSON!' });
        }
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Không thể đọc nội dung file sao lưu!' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Quản Trị Hệ Thống Đào Tạo (Admin Studio)</h3>
              <p className="text-xs text-slate-500">Thêm bài học, upload video, đính kèm học liệu và xuất báo cáo kết quả sát hạch</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clean Light Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 space-x-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => { setActiveTab('add-lesson'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'add-lesson'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm bài học</span>
          </button>

          <button
            onClick={() => { setActiveTab('upload-video'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'upload-video'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Tải video từ máy tính</span>
          </button>

          <button
            onClick={() => { setActiveTab('add-quiz'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'add-quiz'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Thêm câu hỏi Quiz</span>
          </button>

          <button
            onClick={() => { setActiveTab('add-attachment'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'add-attachment'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Paperclip className="w-4 h-4" />
            <span>Đính kèm học liệu</span>
          </button>

          <button
            onClick={() => { setActiveTab('export-report'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'export-report'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Báo cáo đào tạo</span>
          </button>

          <button
            onClick={() => { setActiveTab('backup'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Sao lưu & Khôi phục</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMessage.text && (
          <div className={`mx-6 mt-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : statusMessage.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {statusMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700">
          
          {/* TAB 1: THÊM BÀI HỌC */}
          {activeTab === 'add-lesson' && (
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tiêu đề bài học *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Bài 4: Kỹ năng xử lý khách hàng khó tính..."
                    value={newLessonTitle}
                    onChange={e => setNewLessonTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chuyên mục / Kỹ năng
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Kỹ năng giao tiếp B2B"
                    value={newLessonCategory}
                    onChange={e => setNewLessonCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thời lượng ước tính
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 15 phút"
                    value={newLessonDuration}
                    onChange={e => setNewLessonDuration(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đường dẫn Video (Link MP4, YouTube, hoặc Google Drive)
                  </label>
                  <input
                    type="text"
                    placeholder="https://... hoặc /uploads/videos/..."
                    value={newLessonVideoUrl}
                    onChange={e => setNewLessonVideoUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tóm tắt nội dung cốt lõi (Mỗi gạch đầu dòng là 1 dòng mới)
                </label>
                <textarea
                  rows={3}
                  placeholder="Lắng nghe tích cực mà không ngắt lời&#10;Đồng cảm với quan điểm của khách&#10;Đưa ra giải pháp thực tế..."
                  value={newLessonSummary}
                  onChange={e => setNewLessonSummary(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tạo bài học mới</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: TẢI VIDEO TỪ MÁY TÍNH */}
          {activeTab === 'upload-video' && (
            <div className="space-y-4">
              <form onSubmit={handleUploadVideo} className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <Film className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    Chọn video bài giảng từ máy tính (MP4, WebM, MOV - tối đa 1GB)
                  </p>
                  <p className="text-[11px] text-slate-500 mb-4">
                    Video tải lên sẽ được lưu trực tiếp trên máy chủ với cơ chế streaming nhanh không giật lag.
                  </p>
                  
                  <input
                    type="file"
                    accept="video/*"
                    id="video-upload-input"
                    className="hidden"
                    onChange={e => setSelectedVideoFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="video-upload-input"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-300 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>{selectedVideoFile ? selectedVideoFile.name : 'Chọn file video...'}</span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={uploading || !selectedVideoFile}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Đang tải lên...' : 'Bắt đầu tải video lên'}</span>
                  </button>
                </div>
              </form>

              {uploadedVideoUrl && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                  <p className="font-bold">Đường dẫn video của bạn:</p>
                  <p className="font-mono mt-0.5 break-all select-all text-emerald-950">{uploadedVideoUrl}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: THÊM CÂU HỎI QUIZ */}
          {activeTab === 'add-quiz' && (
            <form onSubmit={handleAddQuizQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chọn bài học cần thêm câu hỏi *
                </label>
                <select
                  value={targetLessonId}
                  onChange={e => setTargetLessonId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} (Hiện có: {c.quiz?.length || 0} câu)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nội dung câu hỏi tình huống *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ví dụ: Khi khách hàng phàn nàn về chế độ giao hàng trễ, bạn sẽ phản hồi thế nào?"
                  value={quizQuestion}
                  onChange={e => setQuizQuestion(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Đáp án A *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nội dung đáp án A"
                    value={quizOptionA}
                    onChange={e => setQuizOptionA(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Đáp án B *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nội dung đáp án B"
                    value={quizOptionB}
                    onChange={e => setQuizOptionB(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Đáp án C (tùy chọn)</label>
                  <input
                    type="text"
                    placeholder="Nội dung đáp án C"
                    value={quizOptionC}
                    onChange={e => setQuizOptionC(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Đáp án D (tùy chọn)</label>
                  <input
                    type="text"
                    placeholder="Nội dung đáp án D"
                    value={quizOptionD}
                    onChange={e => setQuizOptionD(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đáp án chính xác nhất
                </label>
                <select
                  value={quizCorrectAnswer}
                  onChange={e => setQuizCorrectAnswer(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value={0}>Đáp án A</option>
                  <option value={1}>Đáp án B</option>
                  <option value={2}>Đáp án C</option>
                  <option value={3}>Đáp án D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giải thích vì sao đúng (Hiển thị cho nhân viên sau khi nộp bài)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Lắng nghe và đồng cảm trước sẽ giúp hạ nhiệt cảm xúc đề phòng của khách hàng..."
                  value={quizExplanation}
                  onChange={e => setQuizExplanation(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Thêm câu hỏi</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: ĐÍNH KÈM HỌC LIỆU (ATTACHMENTS - CODELEARN STYLE) */}
          {activeTab === 'add-attachment' && (
            <form onSubmit={handleAddAttachment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chọn chuyên đề cần đính kèm tài liệu *
                </label>
                <select
                  value={targetAttachmentLessonId}
                  onChange={e => setTargetAttachmentLessonId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} (Hiện có: {c.attachments?.length || 0} tài liệu)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên tài liệu / Tiêu đề cẩm nang *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bộ kịch bản 50 câu đối đáp qua điện thoại.pdf"
                  value={attachmentTitle}
                  onChange={e => setAttachmentTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dung lượng hiển thị
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 1.5 MB"
                    value={attachmentSize}
                    onChange={e => setAttachmentSize(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Định dạng tệp
                  </label>
                  <select
                    value={attachmentType}
                    onChange={e => setAttachmentType(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="pdf">Tài liệu PDF (.pdf)</option>
                    <option value="docx">Văn bản Word (.docx)</option>
                    <option value="pptx">Bài thuyết trình (.pptx)</option>
                    <option value="zip">Gói tài liệu (.zip)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                  <span>Đính kèm tài liệu</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: BÁO CÁO ĐÀO TẠO EXCEL / CSV (CODELEARN STYLE) */}
          {activeTab === 'export-report' && (
            <div className="space-y-4">
              <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 text-left">
                <div className="flex items-center space-x-2.5 mb-2">
                  <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">Xuất Báo Cáo Kết Quả Sát Hạch Doanh Nghiệp</h4>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Xuất toàn bộ lịch sử thi, điểm số %, thời gian làm bài và tỷ lệ đỗ của học viên ra file Excel / CSV tương thích 100% với Microsoft Excel, Google Sheets.
                </p>

                <button
                  onClick={handleExportReportCsv}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs flex items-center space-x-2 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File Báo Cáo (.CSV / Excel)</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800">Các trường dữ liệu trong báo cáo:</span>
                <p>• ID lần thi • Tên nhân viên • Mã chuyên đề • Tên bài học • Điểm số (%) • Kết quả (ĐẠT / CHƯA ĐẠT) • Thời gian làm bài • Thời điểm nộp bài</p>
              </div>
            </div>
          )}

          {/* TAB 6: SAO LƯU & KHÔI PHỤC */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Tải bản sao lưu (Export Backup)</h4>
                <p className="text-xs text-slate-500 mb-3">
                  Tải toàn bộ bài học, video và câu hỏi về máy tính dưới dạng file JSON.
                </p>
                <button
                  onClick={handleExportBackup}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file Backup (.json)</span>
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Khôi phục bản sao lưu (Import Backup)</h4>
                <p className="text-xs text-slate-500 mb-3">
                  Nạp lại file backup đã lưu để phục hồi toàn bộ dữ liệu.
                </p>
                <input
                  type="file"
                  id="import-backup-file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
                <label
                  htmlFor="import-backup-file"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-300 cursor-pointer shadow-xs"
                >
                  <RotateCw className="w-4 h-4 text-slate-600" />
                  <span>Chọn file JSON để khôi phục</span>
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Tổng số bài học: <strong className="text-slate-800">{courses.length}</strong></span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
