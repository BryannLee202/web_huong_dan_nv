import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Settings, 
  FileCode, 
  File, 
  ChevronRight,
  Info,
  Calendar,
  HardDrive
} from 'lucide-react';

export default function DocumentViewer({ 
  documents = [], 
  lessonTitle = '', 
  lessonId = '',
  isAdmin = false, 
  onOpenAdminDocModal,
  isCompleted = false,
  onToggleComplete
}) {
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasMarkedRead, setHasMarkedRead] = useState(false);

  const activeDoc = documents[activeDocIndex] || documents[0] || null;

  const getFileBadge = (fileType = '') => {
    const type = fileType.toLowerCase();
    if (type.includes('html') || type.includes('htm')) {
      return { label: 'HTML Interactive', color: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
    }
    if (type.includes('pdf')) {
      return { label: 'Tài liệu PDF', color: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
    }
    if (type.includes('doc')) {
      return { label: 'Word (.docx)', color: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
    }
    if (type.includes('md') || type.includes('markdown')) {
      return { label: 'Markdown', color: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
    }
    return { label: 'Văn bản', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
  };

  // Nếu chuyên đề chưa có tài liệu nào
  if (!activeDoc) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Chưa có tài liệu đọc cho chuyên đề này
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          Giáo trình chi tiết và tài liệu hướng dẫn sẽ được cập nhật sớm. Bạn có thể xem video bài giảng hoặc thực hiện bài sát hạch.
        </p>

        {isAdmin && (
          <button
            type="button"
            onClick={onOpenAdminDocModal}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Tải lên tài liệu (.html, .docx, .pdf, .md)</span>
          </button>
        )}
      </div>
    );
  }

  const badge = getFileBadge(activeDoc.fileType);
  const isHtml = (activeDoc.fileType || '').toLowerCase().includes('htm');
  const isPdf = (activeDoc.fileType || '').toLowerCase().includes('pdf');
  const isDocx = (activeDoc.fileType || '').toLowerCase().includes('doc');

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-950 p-4 sm:p-6 overflow-y-auto' : ''}`}>
      
      {/* 1. DOCUMENT TABS / SELECTOR (NẾU BÀI HỌC CÓ NHIỀU TÀI LIỆU) */}
      {documents.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1">
            Chọn tài liệu ({documents.length}):
          </span>
          {documents.map((doc, idx) => {
            const isSel = idx === activeDocIndex;
            return (
              <button
                key={doc.id || idx}
                type="button"
                onClick={() => setActiveDocIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="max-w-[200px] truncate">{doc.title || `Tài liệu ${idx + 1}`}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. DOCUMENT CONTROL HEADER BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0 mt-0.5 sm:mt-0">
            {isHtml ? <FileCode className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2 mb-1 flex-wrap gap-y-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.color}`}>
                {badge.label}
              </span>
              {activeDoc.size && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center">
                  <HardDrive className="w-3 h-3 mr-1" />
                  {activeDoc.size}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {activeDoc.title}
            </h2>
            {activeDoc.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {activeDoc.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          {activeDoc.fileUrl && (
            <a
              href={activeDoc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={activeDoc.fileName || true}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Tải tệp tin về máy"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải về</span>
            </a>
          )}

          {activeDoc.fileUrl && (
            <a
              href={activeDoc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Mở tab mới trong trình duyệt"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tab mới</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Xem toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdminDocModal}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300/40 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Quản trị danh sách tài liệu"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Quản lý</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. DOCUMENT CONTENT VIEWPORT */}
      <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative ${isFullscreen ? 'h-[calc(100vh-140px)]' : 'min-h-[650px] h-[780px]'}`}>
        
        {/* VIEW CASE 1: HTML FILE (NHÚNG TRỰC TIẾP QUA IFRAME CHUẨN ĐẸP) */}
        {isHtml && (
          <iframe
            src={activeDoc.fileUrl}
            title={activeDoc.title}
            className="w-full h-full border-0 bg-[#FAF8F3]"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}

        {/* VIEW CASE 2: PDF FILE */}
        {isPdf && (
          <iframe
            src={`${activeDoc.fileUrl}#toolbar=1&navpanes=0`}
            title={activeDoc.title}
            className="w-full h-full border-0 bg-slate-100 dark:bg-slate-900"
          />
        )}

        {/* VIEW CASE 3: WORD (.DOCX) - PREVIEW & DOWNLOAD CARD */}
        {isDocx && (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950/50">
            <div className="w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 shadow-sm">
              <File className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              Tài liệu Microsoft Word
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white max-w-md mb-2">
              {activeDoc.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              Tài liệu giáo trình nội bộ định dạng Word. Bạn có thể tải về máy tính hoặc điện thoại để xem và chỉnh sửa.
            </p>
            <a
              href={activeDoc.fileUrl}
              download={activeDoc.fileName || true}
              className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải file Word (.docx) về máy</span>
            </a>
          </div>
        )}

        {/* VIEW CASE 4: OTHER TEXT FORMATS (MARKDOWN / TXT) */}
        {!isHtml && !isPdf && !isDocx && (
          <iframe
            src={activeDoc.fileUrl}
            title={activeDoc.title}
            className="w-full h-full border-0 bg-white dark:bg-slate-900 p-4 font-mono text-xs"
          />
        )}
      </div>

      {/* 4. FOOTER COMPLETION STATUS */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Hoàn thành việc đọc giáo trình để nắm vững kiến thức trước khi làm bài sát hạch.</span>
        </div>

        <button
          type="button"
          onClick={() => {
            setHasMarkedRead(!hasMarkedRead);
            if (onToggleComplete) onToggleComplete(!hasMarkedRead);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shrink-0 ${
            hasMarkedRead || isCompleted
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{hasMarkedRead || isCompleted ? 'Đã hoàn thành đọc bài' : 'Đánh dấu đã đọc xong'}</span>
        </button>
      </div>

    </div>
  );
}
