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
  AlertCircle
} from 'lucide-react';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  courses, 
  onSaveCourses, 
  onReloadCourses 
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('add-lesson');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonCategory, setNewLessonCategory] = useState('Kỹ năng bán hàng');
  const [newLessonDuration, setNewLessonDuration] = useState('15 phút');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonSummary, setNewLessonSummary] = useState('');

  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');

  const [targetLessonId, setTargetLessonId] = useState(courses[0]?.id || '');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptionA, setQuizOptionA] = useState('');
  const [quizOptionB, setQuizOptionB] = useState('');
  const [quizOptionC, setQuizOptionC] = useState('');
  const [quizOptionD, setQuizOptionD] = useState('');
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#007c5d] flex items-center justify-center border border-emerald-100">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Quản Trị Khóa Học & Quiz</h3>
              <p className="text-xs text-slate-500">Thêm bài học mới, tải video và soạn câu hỏi trắc nghiệm</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean Light Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 space-x-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => { setActiveTab('add-lesson'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'add-lesson'
                ? 'border-[#007c5d] text-[#007c5d] font-bold'
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
                ? 'border-[#007c5d] text-[#007c5d] font-bold'
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
                ? 'border-[#007c5d] text-[#007c5d] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Thêm câu hỏi Quiz</span>
          </button>

          <button
            onClick={() => { setActiveTab('backup'); setStatusMessage({ type: '', text: '' }); }}
            className={`py-3 border-b-2 flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-[#007c5d] text-[#007c5d] font-bold'
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
            {statusMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-[#007c5d] shrink-0" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700">
          
          {/* TAB 1: THÊM BÀI HỌC */}
          {activeTab === 'add-lesson' && (
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề bài học</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bài 4: Kỹ thuật xây dựng lòng tin với khách hàng VIP"
                  value={newLessonTitle}
                  onChange={e => setNewLessonTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#007c5d]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chuyên mục</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Kỹ năng chốt sale nâng cao"
                    value={newLessonCategory}
                    onChange={e => setNewLessonCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#007c5d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thời lượng ước tính</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 15 phút"
                    value={newLessonDuration}
                    onChange={e => setNewLessonDuration(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#007c5d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đường dẫn Video (Dán link YouTube, Google Drive HOẶC dùng file đã tải lên)
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... hoặc /uploads/videos/..."
                  value={newLessonVideoUrl}
                  onChange={e => setNewLessonVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#007c5d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tóm tắt nội dung cốt lõi (Mỗi dòng là 1 ý quan trọng)
                </label>
                <textarea
                  rows={4}
                  placeholder="Mẫu kịch bản chào hỏi 30 giây&#10;Quy tắc lắng nghe khách hàng&#10;Cách xử lý khi khách hàng từ chối"
                  value={newLessonSummary}
                  onChange={e => setNewLessonSummary(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#007c5d]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu bài học</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: TẢI VIDEO */}
          {activeTab === 'upload-video' && (
            <div className="space-y-5">
              <div className="border-2 border-dashed border-slate-300 hover:border-[#007c5d] rounded-2xl p-8 text-center transition-all bg-slate-50">
                <Film className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">Chọn file Video từ máy tính</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
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
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-300 cursor-pointer shadow-xs"
                >
                  <Upload className="w-4 h-4 text-[#007c5d]" />
                  <span>{selectedVideoFile ? selectedVideoFile.name : 'Chọn file từ máy tính'}</span>
                </label>

                {selectedVideoFile && (
                  <div className="mt-4">
                    <p className="text-xs text-[#007c5d] font-semibold mb-3">
                      Đã chọn: {selectedVideoFile.name} ({(selectedVideoFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={handleUploadVideo}
                      className="px-5 py-2 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white font-bold text-xs flex items-center space-x-1.5 mx-auto shadow-xs cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'Đang tải lên...' : 'Bắt đầu tải lên'}</span>
                    </button>
                  </div>
                )}
              </div>

              {uploadedVideoUrl && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Đường dẫn video đã tải lên:</p>
                  <code className="text-xs text-[#007c5d] font-mono select-all block bg-white p-2 rounded border border-slate-200">
                    {uploadedVideoUrl}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: THÊM CÂU HỎI */}
          {activeTab === 'add-quiz' && (
            <form onSubmit={handleAddQuizQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn bài học cần thêm câu hỏi</label>
                <select
                  value={targetLessonId}
                  onChange={e => setTargetLessonId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#007c5d]"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.quiz?.length || 0} câu)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung câu hỏi</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Khi khách hàng phàn nàn giá cao và so sánh với bên B, nhân viên nên làm gì?"
                  value={quizQuestion}
                  onChange={e => setQuizQuestion(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#007c5d]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Các đáp án lựa chọn:</label>
                
                <div className="flex items-center space-x-2">
                  <span className="w-6 text-xs font-bold text-center text-slate-500">A</span>
                  <input
                    type="text"
                    placeholder="Đáp án A"
                    value={quizOptionA}
                    onChange={e => setQuizOptionA(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-6 text-xs font-bold text-center text-slate-500">B</span>
                  <input
                    type="text"
                    placeholder="Đáp án B"
                    value={quizOptionB}
                    onChange={e => setQuizOptionB(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-6 text-xs font-bold text-center text-slate-500">C</span>
                  <input
                    type="text"
                    placeholder="Đáp án C (tùy chọn)"
                    value={quizOptionC}
                    onChange={e => setQuizOptionC(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-6 text-xs font-bold text-center text-slate-500">D</span>
                  <input
                    type="text"
                    placeholder="Đáp án D (tùy chọn)"
                    value={quizOptionD}
                    onChange={e => setQuizOptionD(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Đáp án ĐÚNG</label>
                <select
                  value={quizCorrectAnswer}
                  onChange={e => setQuizCorrectAnswer(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#007c5d]"
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
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#007c5d]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Thêm câu hỏi</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: SAO LƯU & KHÔI PHỤC */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Tải bản sao lưu (Export Backup)</h4>
                <p className="text-xs text-slate-500 mb-3">
                  Tải toàn bộ bài học, video và câu hỏi về máy tính dưới dạng file JSON.
                </p>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
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
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
