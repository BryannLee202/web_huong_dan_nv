import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  PlusCircle, 
  Save, 
  Trash2, 
  FileText, 
  Film, 
  HelpCircle, 
  Download, 
  RotateCw, 
  CheckCircle, 
  AlertCircle,
  Link as LinkIcon
} from 'lucide-react';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  courses, 
  onSaveCourses, 
  onReloadCourses 
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('add-lesson'); // 'add-lesson' | 'upload-video' | 'add-quiz' | 'backup'
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Add Lesson Form State
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonCategory, setNewLessonCategory] = useState('Kỹ năng bán hàng');
  const [newLessonDuration, setNewLessonDuration] = useState('15 phút');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonSummary, setNewLessonSummary] = useState('');

  // Video Upload State
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');

  // Add Quiz Question State
  const [targetLessonId, setTargetLessonId] = useState(courses[0]?.id || '');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptionA, setQuizOptionA] = useState('');
  const [quizOptionB, setQuizOptionB] = useState('');
  const [quizOptionC, setQuizOptionC] = useState('');
  const [quizOptionD, setQuizOptionD] = useState('');
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');

  // Handle Video Upload
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

  // Handle Add Lesson
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
      summary: summaryPoints.length > 0 ? summaryPoints : ['Ghi nhớ cốt lõi của bài học.'],
      quiz: []
    };

    const updatedCourses = [...courses, newLesson];
    const ok = await onSaveCourses(updatedCourses);
    if (ok) {
      setStatusMessage({ type: 'success', text: `Đã thêm thành công: ${newLesson.title}` });
      setNewLessonTitle('');
      setNewLessonSummary('');
      setNewLessonVideoUrl('');
      setSelectedVideoFile(null);
    }
  };

  // Handle Add Quiz Question
  const handleAddQuizQuestion = async (e) => {
    e.preventDefault();
    if (!quizQuestion.trim() || !quizOptionA.trim() || !quizOptionB.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập câu hỏi và ít nhất 2 đáp án (A và B)!' });
      return;
    }

    const options = [quizOptionA.trim(), quizOptionB.trim()];
    if (quizOptionC.trim()) options.push(quizOptionC.trim());
    if (quizOptionD.trim()) options.push(quizOptionD.trim());

    const newQuestion = {
      id: `q_${Date.now()}`,
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

  // Handle Export Backup
  const handleExportBackup = () => {
    window.open('/api/backup/export', '_blank');
  };

  // Handle Import Backup
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
            setStatusMessage({ type: 'success', text: 'Khôi phục toàn bộ bài học từ bản sao lưu thành công!' });
            if (onReloadCourses) onReloadCourses();
          }
        } else {
          setStatusMessage({ type: 'error', text: 'File sao lưu không đúng định dạng JSON danh sách bài học!' });
        }
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Không thể đọc nội dung file sao lưu!' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Quản Trị Khóa Học & Bộ Câu Hỏi Quiz</h3>
              <p className="text-xs text-slate-400">Dễ dàng thêm bài học, upload video từ máy tính và tạo câu hỏi kiểm tra</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 space-x-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => { setActiveTab('add-lesson'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'add-lesson'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm bài học mới</span>
          </button>

          <button
            onClick={() => { setActiveTab('upload-video'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'upload-video'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Tải video từ máy tính</span>
          </button>

          <button
            onClick={() => { setActiveTab('add-quiz'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'add-quiz'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Thêm câu hỏi Quiz</span>
          </button>

          <button
            onClick={() => { setActiveTab('backup'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Sao lưu & Khôi phục (1-Click)</span>
          </button>
        </div>

        {/* Status Message Banner */}
        {statusMessage.text && (
          <div className={`mx-6 mt-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' 
              : statusMessage.type === 'error'
                ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                : 'bg-blue-950/60 text-blue-300 border border-blue-800'
          }`}>
            {statusMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-200">
          
          {/* TAB 1: THÊM BÀI HỌC MỚI */}
          {activeTab === 'add-lesson' && (
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tiêu đề bài học</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bài 4: Kỹ thuật xây dựng lòng tin với khách hàng VIP"
                  value={newLessonTitle}
                  onChange={e => setNewLessonTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Chuyên mục / Phân loại</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Kỹ năng chốt sale nâng cao"
                    value={newLessonCategory}
                    onChange={e => setNewLessonCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Thời lượng ước tính</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 15 phút"
                    value={newLessonDuration}
                    onChange={e => setNewLessonDuration(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Đường dẫn Video (Dán link YouTube, Google Drive, Loom HOẶC dán link đã tải lên)
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... hoặc /uploads/videos/..."
                  value={newLessonVideoUrl}
                  onChange={e => setNewLessonVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 Bạn có thể qua Tab "Tải video từ máy tính" để upload file trực tiếp, hệ thống sẽ tự động điền link vào đây.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tóm tắt kiến thức cốt lõi (Mỗi dòng là 1 ý quan trọng)
                </label>
                <textarea
                  rows={4}
                  placeholder="Mẫu kịch bản chào hỏi 30 giây&#10;Quy tắc lắng nghe khách hàng&#10;Cách xử lý khi khách hàng từ chối"
                  value={newLessonSummary}
                  onChange={e => setNewLessonSummary(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-900/40 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu bài học mới</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: TẢI VIDEO TỪ MÁY TÍNH */}
          {activeTab === 'upload-video' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-8 text-center transition-all bg-slate-950/40">
                <Film className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-200">Chọn file Video từ máy tính để tải lên</h4>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Hỗ trợ các định dạng .mp4, .webm, .mov (dung lượng tối đa 1GB)
                </p>

                <input
                  type="file"
                  id="video-upload-input"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={e => setSelectedVideoFile(e.target.files[0])}
                  className="hidden"
                />
                
                <label
                  htmlFor="video-upload-input"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-600 cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>{selectedVideoFile ? selectedVideoFile.name : 'Chọn file từ máy tính'}</span>
                </label>

                {selectedVideoFile && (
                  <div className="mt-4">
                    <p className="text-xs text-emerald-400 font-semibold mb-3">
                      Đã chọn: {selectedVideoFile.name} ({(selectedVideoFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={handleUploadVideo}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 mx-auto shadow-lg shadow-emerald-900/30 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'Đang tải lên...' : 'Bắt đầu tải lên hệ thống'}</span>
                    </button>
                  </div>
                )}
              </div>

              {uploadedVideoUrl && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-xs text-slate-400 mb-1">Đường dẫn video đã tải lên:</p>
                  <code className="text-xs text-emerald-400 font-mono select-all block bg-slate-900 p-2 rounded border border-slate-800">
                    {uploadedVideoUrl}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: THÊM CÂU HỎI QUIZ */}
          {activeTab === 'add-quiz' && (
            <form onSubmit={handleAddQuizQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Chọn bài học cần thêm câu hỏi</label>
                <select
                  value={targetLessonId}
                  onChange={e => setTargetLessonId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} (Hiện có {c.quiz?.length || 0} câu)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nội dung câu hỏi tình huống</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Khi khách hàng phàn nàn giá cao và so sánh với bên B, nhân viên sale nên trả lời thế nào?"
                  value={quizQuestion}
                  onChange={e => setQuizQuestion(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Các đáp án lựa chọn:</label>
                
                <div className="flex items-center space-x-2">
                  <span className="w-6 text-xs font-bold text-center text-slate-400">A</span>
                  <input
                    type="text"
                    placeholder="Đáp án A"
                    value={quizOptionA}
                    onChange={e => setQuizOptionA(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-6 text-xs font-bold text-center text-slate-400">B</span>
                  <input
                    type="text"
                    placeholder="Đáp án B"
                    value={quizOptionB}
                    onChange={e => setQuizOptionB(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-6 text-xs font-bold text-center text-slate-400">C</span>
                  <input
                    type="text"
                    placeholder="Đáp án C (tùy chọn)"
                    value={quizOptionC}
                    onChange={e => setQuizOptionC(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-6 text-xs font-bold text-center text-slate-400">D</span>
                  <input
                    type="text"
                    placeholder="Đáp án D (tùy chọn)"
                    value={quizOptionD}
                    onChange={e => setQuizOptionD(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Đáp án ĐÚNG</label>
                <select
                  value={quizCorrectAnswer}
                  onChange={e => setQuizCorrectAnswer(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={0}>Đáp án A</option>
                  <option value={1}>Đáp án B</option>
                  <option value={2}>Đáp án C</option>
                  <option value={3}>Đáp án D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giải thích vì sao đúng/sai (Hiện cho nhân viên khi nộp bài)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Lắng nghe và đồng cảm trước khi đưa ra giá trị thực sẽ giúp khách hàng hạ nhiệt cảm xúc đề phòng..."
                  value={quizExplanation}
                  onChange={e => setQuizExplanation(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-900/40 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Thêm câu hỏi vào bài</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: SAO LƯU & KHÔI PHỤC (1-CLICK) */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1">Xuất file sao lưu dự phòng (Export Backup)</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Tải toàn bộ bài học, video và ngân hàng câu hỏi trắc nghiệm về máy tính dưới dạng file JSON để cất giữ an toàn.
                </p>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file Backup về máy</span>
                </button>
              </div>

              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1">Khôi phục từ bản sao lưu (Import Backup)</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Nếu khách hàng lỡ tay xóa nhầm hoặc muốn nạp khóa học mới, chỉ cần chọn file backup đã lưu để phục hồi toàn bộ.
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
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-600 cursor-pointer transition-all"
                >
                  <RotateCw className="w-4 h-4 text-amber-400" />
                  <span>Chọn file JSON để khôi phục</span>
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-400">
          <span>Tổng số bài học hiện có: <strong className="text-white">{courses.length}</strong> bài</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
}
