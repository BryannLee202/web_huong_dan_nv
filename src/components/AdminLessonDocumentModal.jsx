import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  UploadCloud, 
  FileText, 
  FileCode, 
  File, 
  Trash2, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  HardDrive,
  Edit2,
  Save,
  BookOpen
} from 'lucide-react';
import api from '../services/api';

export default function AdminLessonDocumentModal({ 
  isOpen, 
  onClose, 
  lesson, 
  onUpdateCourse 
}) {
  const [documents, setDocuments] = useState(
    Array.isArray(lesson?.attachments) ? lesson.attachments : (Array.isArray(lesson?.documents) ? lesson.documents : [])
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [editingDocId, setEditingDocId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [isGeneratingQuizId, setIsGeneratingQuizId] = useState(null);

  const fileInputRef = useRef(null);

  // Cập nhật state nội bộ khi lesson thay đổi
  React.useEffect(() => {
    if (lesson) {
      const docs = Array.isArray(lesson.attachments) 
        ? lesson.attachments 
        : (Array.isArray(lesson.documents) ? lesson.documents : []);
      setDocuments(docs);
    }
  }, [lesson]);

  if (!isOpen || !lesson) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Gợi ý tiêu đề dựa trên tên file nếu chưa nhập
      if (!docTitle) {
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const cleanTitle = baseName.replace(/[-_]/g, ' ');
        setDocTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatusMessage({ type: 'error', text: 'Vui lòng chọn tệp tài liệu cần tải lên.' });
      return;
    }

    setIsUploading(true);
    setStatusMessage({ type: 'info', text: 'Đang tải tài liệu lên máy chủ...' });

    try {
      const res = await api.documents.upload(
        lesson.id, 
        selectedFile, 
        docTitle.trim() || selectedFile.name,
        docDescription.trim()
      );

      if (res.success) {
        const updatedDocs = res.documents || [];
        setDocuments(updatedDocs);
        setSelectedFile(null);
        setDocTitle('');
        setDocDescription('');
        if (fileInputRef.current) fileInputRef.current.value = '';

        setStatusMessage({ type: 'success', text: 'Tải tài liệu lên thành công!' });

        // Cập nhật lại khoá học ở component cha
        if (onUpdateCourse && Array.isArray(res.courses)) {
          const updatedLesson = res.courses.find(c => c.id === lesson.id);
          if (updatedLesson) onUpdateCourse(updatedLesson);
        }
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Lỗi khi tải tài liệu lên.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi kết nối khi tải tài liệu.' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này khỏi chuyên đề?')) return;

    try {
      const res = await api.documents.delete(lesson.id, docId);
      if (res.success) {
        const updatedDocs = res.documents || [];
        setDocuments(updatedDocs);
        setStatusMessage({ type: 'success', text: 'Đã xóa tài liệu thành công!' });

        if (onUpdateCourse && Array.isArray(res.courses)) {
          const updatedLesson = res.courses.find(c => c.id === lesson.id);
          if (updatedLesson) onUpdateCourse(updatedLesson);
        }
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Không thể xóa tài liệu.' });
    }
  };

  const handleSaveRename = async (docId) => {
    if (!editTitle.trim()) return;

    const updated = documents.map(d => {
      if (d.id === docId) {
        return { ...d, title: editTitle.trim() };
      }
      return d;
    });

    try {
      const res = await api.documents.updateAll(lesson.id, updated);
      if (res.success) {
        setDocuments(updated);
        setEditingDocId(null);
        setStatusMessage({ type: 'success', text: 'Đã đổi tên tài liệu thành công!' });

        if (onUpdateCourse && Array.isArray(res.courses)) {
          const updatedLesson = res.courses.find(c => c.id === lesson.id);
          if (updatedLesson) onUpdateCourse(updatedLesson);
        }
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Lỗi cập nhật tên tài liệu.' });
    }
  };

  const handleGenerateQuizFromDoc = async (doc) => {
    setIsGeneratingQuizId(doc.id);
    setStatusMessage({ type: 'info', text: `AI đang đọc tài liệu "${doc.title}" để sinh 15 câu hỏi sát hạch...` });
    try {
      const res = await api.courses.generateQuizFromDocument(lesson.id, {
        documentId: doc.id
      });
      if (res && res.success) {
        setStatusMessage({
          type: 'success',
          text: res.message || `Đã dùng AI tạo thành công ${res.count || 15} câu hỏi sát hạch từ tài liệu!`
        });
        if (onUpdateCourse && Array.isArray(res.courses)) {
          const updatedLesson = res.courses.find(c => c.id === lesson.id);
          if (updatedLesson) onUpdateCourse(updatedLesson);
        }
      } else {
        setStatusMessage({ type: 'error', text: res?.message || 'Lỗi khi sinh câu hỏi từ tài liệu.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: `Lỗi AI: ${err.message}` });
    } finally {
      setIsGeneratingQuizId(null);
    }
  };

  const getFormatIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('html') || t.includes('htm')) return <FileCode className="w-4 h-4 text-amber-500" />;
    if (t.includes('pdf')) return <FileText className="w-4 h-4 text-rose-500" />;
    if (t.includes('doc')) return <File className="w-4 h-4 text-blue-500" />;
    if (t.includes('md') || t.includes('markdown')) return <BookOpen className="w-4 h-4 text-emerald-500" />;
    return <FileText className="w-4 h-4 text-slate-500" />;
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl border-0 sm:border border-slate-200 dark:border-slate-800 w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] max-w-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MOBILE HEADER (sm:hidden) */}
        <div className="sm:hidden px-3.5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0 gap-2">
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer active:scale-90 shrink-0"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0 text-center px-1">
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider mb-0.5 font-mono">
              <span>{lesson.rinCode || 'RM-DOC'}</span>
              <span>•</span>
              <span>{documents.length} tài liệu</span>
            </div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white truncate">
              {lesson.title}
            </h3>
          </div>

          <div className="w-9 shrink-0" />
        </div>

        {/* DESKTOP HEADER (hidden sm:flex) */}
        <div className="hidden sm:flex p-5 border-b border-slate-100 dark:border-slate-800 items-center justify-between shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-mono">
                  {lesson.rinCode || 'RM-DOC'}
                </span>
                <span className="text-xs font-bold text-slate-400">Quản Lý Giáo Trình & Tài Liệu</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate max-w-md">
                {lesson.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          
          {/* Status Alert */}
          {statusMessage.text && (
            <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in ${
              statusMessage.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
            }`}>
              {statusMessage.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* FORM UPLOAD MỚI */}
          <form onSubmit={handleUploadSubmit} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center">
                <UploadCloud className="w-4 h-4 mr-1.5 text-blue-600" />
                Tải lên tài liệu giáo trình mới
              </span>
              <span className="text-[11px] text-slate-400">
                Hỗ trợ: .html, .docx, .pdf, .md, .txt (Max 50MB)
              </span>
            </div>

            {/* Drop Zone / File Picker */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-5 text-center cursor-pointer transition-all bg-white dark:bg-slate-900 hover:bg-blue-50/30"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".html,.htm,.docx,.doc,.pdf,.md,.markdown,.txt" 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                {selectedFile ? (
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB • Nhấp để chọn file khác</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Nhấp để chọn tệp tài liệu hoặc kéo thả vào đây</p>
                    <p className="text-[11px] text-slate-400">Học viên sẽ đọc trực tiếp trên giao diện hoặc tải về máy</p>
                  </div>
                )}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tiêu đề tài liệu hiển thị cho học viên:
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Ví dụ: Bài 1.1 — Kiến thức sản phẩm & Giá thuê"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mô tả vắn tắt / Ghi chú (tùy chọn):
                </label>
                <input
                  type="text"
                  value={docDescription}
                  onChange={(e) => setDocDescription(e.target.value)}
                  placeholder="Ví dụ: Tài liệu đào tạo nghiệp vụ chuẩn TP.HCM"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang tải lên...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Lưu và Tải lên tài liệu</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* DANH SÁCH TÀI LIỆU HIỆN CÓ CỦA CHUYÊN ĐỀ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Danh sách tài liệu đã có ({documents.length})
              </h4>
              <span className="text-[11px] text-slate-400">
                Hiển thị trong tab "Giáo trình đọc" của bài học
              </span>
            </div>

            {documents.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 text-center text-xs text-slate-400">
                Chuyên đề này chưa có tài liệu đính kèm nào. Hãy tải file lên ở khung bên trên.
              </div>
            ) : (
              <div className="space-y-2.5">
                {documents.map((doc, idx) => {
                  const isEditing = editingDocId === doc.id;
                  return (
                    <div 
                      key={doc.id || idx}
                      className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          {getFormatIcon(doc.fileType)}
                        </div>

                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="px-2 py-1 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white w-full"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveRename(doc.id)}
                                className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shrink-0 cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingDocId(null)}
                                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {doc.title}
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase shrink-0">
                                  {doc.fileType || 'file'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate">
                                {doc.fileName || doc.originalName || 'Tài liệu'} {doc.size ? `• ${doc.size}` : ''}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Document Actions (Dễ chạm bấm ngón tay trên di động) */}
                      <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          disabled={isGeneratingQuizId === doc.id}
                          onClick={() => handleGenerateQuizFromDoc(doc)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-400/40 text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer disabled:opacity-50 active:scale-95"
                          title="AI đọc tài liệu này và tự động tạo 15 câu hỏi sát hạch"
                        >
                          <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isGeneratingQuizId === doc.id ? 'animate-spin' : ''}`} />
                          <span>{isGeneratingQuizId === doc.id ? 'Đang tạo...' : 'AI Sinh Đề'}</span>
                        </button>

                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer active:scale-95"
                            title="Xem trước tài liệu"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setEditingDocId(doc.id);
                            setEditTitle(doc.title);
                          }}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer active:scale-95"
                          title="Đổi tên tài liệu"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer active:scale-95"
                          title="Xóa tài liệu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-center active:scale-98"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
