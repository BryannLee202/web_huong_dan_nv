import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Edit3, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function AdminRenameLessonModal({
  isOpen,
  onClose,
  currentLesson,
  onLessonRenamed
}) {
  const [newTitle, setNewTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentLesson && currentLesson.title) {
      setNewTitle(currentLesson.title);
      setErrorMessage('');
    }
  }, [currentLesson, isOpen]);

  if (!isOpen || !currentLesson) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setErrorMessage('Tên bài học không được để trống.');
      return;
    }
    if (trimmed === currentLesson.title) {
      onClose();
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    try {
      const res = await api.courses.rename(currentLesson.id, trimmed);
      if (res && res.success) {
        if (onLessonRenamed) {
          onLessonRenamed(currentLesson.id, trimmed, res.courses);
        }
        onClose();
      } else {
        setErrorMessage(res?.message || 'Có lỗi xảy ra khi đổi tên.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-10 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Đổi Tên Chuyên Đề
                </h3>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {currentLesson.rinCode || currentLesson.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Chỉnh sửa tiêu đề bài học đồng bộ trên toàn hệ thống LMS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tiêu đề bài học mới:
            </label>
            <textarea
              rows={3}
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none shadow-2xs"
              placeholder="Nhập tiêu đề bài học..."
              autoFocus
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
              <span>Độ dài: {newTitle.length} ký tự</span>
              <button
                type="button"
                onClick={() => {
                  const cleaned = newTitle.replace(/^Bài\s+\d+[:\-]\s*/i, '').trim();
                  setNewTitle(cleaned);
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                title="Bỏ tiền tố 'Bài X:' nếu muốn tiêu đề ngắn gọn hơn"
              >
                Gọt bỏ tiền tố "Bài X:"
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving || !newTitle.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <span>Đang lưu...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu Tên Mới</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
