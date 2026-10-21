import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  HardDrive,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  RefreshCw,
  AlertCircle,
  Eye,
  Columns
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

  // States chuyên biệt cho hiển thị tài liệu Word (.docx / .doc)
  const [docxHtml, setDocxHtml] = useState('');
  const [isLoadingDocx, setIsLoadingDocx] = useState(false);
  const [docxError, setDocxError] = useState(null);
  const [fontSizePercent, setFontSizePercent] = useState(100);
  const [paperWidthMode, setPaperWidthMode] = useState('standard'); // 'standard' (max-w-4xl), 'wide' (max-w-6xl), 'full' (w-full)
  const [reloadKey, setReloadKey] = useState(0);

  const documentContentRef = useRef(null);

  const activeDoc = documents[activeDocIndex] || documents[0] || null;

  const fileExt = (activeDoc?.fileName || activeDoc?.fileUrl || '').toLowerCase();
  const fileTypeStr = (activeDoc?.fileType || '').toLowerCase();
  const isHtml = fileTypeStr.includes('htm') || fileExt.endsWith('.html') || fileExt.endsWith('.htm');
  const isPdf = fileTypeStr.includes('pdf') || fileExt.endsWith('.pdf');
  const isDocx = fileTypeStr.includes('doc') || fileExt.endsWith('.docx') || fileExt.endsWith('.doc');

  const getFileBadge = (fileType = '', ext = '') => {
    const type = (fileType || ext).toLowerCase();
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

  // Tự động nạp và chuyển đổi file Word (.docx) sang HTML để học viên đọc trực tiếp
  useEffect(() => {
    if (!activeDoc || !isDocx) {
      setDocxHtml('');
      setIsLoadingDocx(false);
      setDocxError(null);
      return;
    }

    const targetUrl = activeDoc.fileUrl || activeDoc.fileName;
    if (!targetUrl) return;

    let isMounted = true;
    setIsLoadingDocx(true);
    setDocxError(null);
    setDocxHtml('');

    const fetchUrl = `/api/documents/docx-html?url=${encodeURIComponent(targetUrl)}`;

    fetch(fetchUrl)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Lỗi máy chủ (${res.status}): Không thể nạp tài liệu Word.`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.html) {
          setDocxHtml(data.html);
        } else if (data.success && !data.html) {
          setDocxHtml('<p class="text-center italic text-slate-400 py-12">Tài liệu Word này không chứa nội dung văn bản khả dụng.</p>');
        } else {
          throw new Error(data.message || 'Không thể chuyển đổi nội dung tài liệu Word.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Lỗi nạp tài liệu Word:', err);
        setDocxError(err.message || 'Không thể đọc nội dung tài liệu Word trên trình duyệt.');
      })
      .finally(() => {
        if (isMounted) setIsLoadingDocx(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeDoc?.id, activeDoc?.fileUrl, activeDoc?.fileName, isDocx, reloadKey]);

  // Ước tính số từ và thời gian đọc tài liệu Word
  const readingStats = useMemo(() => {
    if (!docxHtml) return null;
    const plainText = docxHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = plainText ? plainText.split(' ').length : 0;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return { words, minutes };
  }, [docxHtml]);

  // Nếu chuyên đề chưa có tài liệu nào
  if (!activeDoc) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center w-full max-w-full overflow-hidden">
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

  const badge = getFileBadge(activeDoc.fileType, fileExt);

  // Điều chỉnh độ rộng giấy đọc
  const getPaperMaxWidthClass = () => {
    if (paperWidthMode === 'wide') return 'max-w-6xl';
    if (paperWidthMode === 'full') return 'max-w-full';
    return 'max-w-4xl';
  };

  return (
    <div className={`space-y-4 w-full max-w-full overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-950 p-3 sm:p-6 overflow-y-auto' : ''}`}>
      
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
            {isHtml ? <FileCode className="w-5 h-5" /> : isDocx ? <File className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
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
              {readingStats && (
                <span className="text-[11px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900 flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  ~{readingStats.minutes} phút đọc ({readingStats.words} từ)
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
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto flex-wrap gap-y-1">
          {activeDoc.fileUrl && (
            <a
              href={activeDoc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={activeDoc.fileName || true}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Tải tệp tin gốc về máy"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải về</span>
            </a>
          )}

          {isDocx && (
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="In hoặc Lưu thành file PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">In/PDF</span>
            </button>
          )}

          {activeDoc.fileUrl && !isDocx && (
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
      <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative ${isFullscreen ? 'h-[calc(100vh-140px)]' : 'min-h-[650px] h-[780px]'} flex flex-col`}>
        
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

        {/* VIEW CASE 3: WORD (.DOCX / .DOC) - BỘ ĐỌC TRỰC TIẾP CHUYÊN NGHIỆP TRÊN WEB */}
        {isDocx && (
          <div className="w-full h-full flex flex-col bg-slate-100/70 dark:bg-slate-950 overflow-hidden">
            
            {/* SUB-TOOLBAR ĐỌC VĂN BẢN WORD */}
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 z-10 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                <File className="w-4 h-4" />
                <span className="hidden sm:inline">Chế độ đọc giáo trình Word trực tiếp</span>
                <span className="sm:hidden">Word Reader</span>
              </div>

              {/* CONTROLS: CỠ CHỮ, ĐỘ RỘNG KHỔ GIẤY, NẠP LẠI */}
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setFontSizePercent(p => Math.max(80, p - 10))}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Thu nhỏ cỡ chữ"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 select-none min-w-[42px] text-center">
                    {fontSizePercent}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setFontSizePercent(p => Math.min(140, p + 10))}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Phóng to cỡ chữ"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  {fontSizePercent !== 100 && (
                    <button
                      type="button"
                      onClick={() => setFontSizePercent(100)}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Đặt lại cỡ chữ mặc định (100%)"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Chuyển đổi khổ giấy */}
                <button
                  type="button"
                  onClick={() => {
                    setPaperWidthMode(current => {
                      if (current === 'standard') return 'wide';
                      if (current === 'wide') return 'full';
                      return 'standard';
                    });
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold hidden sm:flex items-center space-x-1 transition-colors cursor-pointer"
                  title="Thay đổi khổ giấy hiển thị (Chuẩn / Rộng / Toàn màn hình)"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>
                    {paperWidthMode === 'standard' ? 'Khổ chuẩn' : paperWidthMode === 'wide' ? 'Khổ rộng' : 'Tràn viền'}
                  </span>
                </button>

                {/* Làm mới / Reload */}
                <button
                  type="button"
                  onClick={() => setReloadKey(k => k + 1)}
                  disabled={isLoadingDocx}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Tải lại tài liệu Word"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDocx ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* PHẦN NỘI DUNG TÀI LIỆU WORD TRÊN NỀN GIẤY TRẮNG */}
            <div 
              ref={documentContentRef}
              className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center custom-scrollbar"
            >
              {/* TRƯỜNG HỢP ĐANG TẢI */}
              {isLoadingDocx && (
                <div className="w-full max-w-3xl my-auto py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 shadow-md">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Đang nạp và định dạng tài liệu Word...
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      Hệ thống đang trích xuất văn bản, tiêu đề, bảng biểu và hình ảnh để hiển thị mượt mà trên trình duyệt.
                    </p>
                  </div>
                </div>
              )}

              {/* TRƯỜNG HỢP CÓ LỖI */}
              {!isLoadingDocx && docxError && (
                <div className="w-full max-w-md my-auto py-12 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900 text-center shadow-lg space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Không thể hiển thị xem trước tệp Word
                    </h4>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                      {docxError}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Bạn có thể thử tải lại hoặc tải file về để mở bằng Microsoft Word trên máy tính hoặc điện thoại.
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setReloadKey(k => k + 1)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Thử lại
                    </button>
                    {activeDoc.fileUrl && (
                      <a
                        href={activeDoc.fileUrl}
                        download={activeDoc.fileName || true}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải file về máy</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* TRƯỜNG HỢP HIỂN THỊ THÀNH CÔNG: KHỔ GIẤY BẢN IN SANG TRỌNG */}
              {!isLoadingDocx && !docxError && docxHtml && (
                <div className={`w-full ${getPaperMaxWidthClass()} transition-all duration-200`}>
                  
                  {/* STYLE CHO NỘI DUNG WORD CHUYỂN ĐỔI */}
                  <style>{`
                    .docx-reader-content {
                      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                      line-height: 1.85;
                      word-break: break-word;
                    }
                    .docx-reader-content h1 {
                      font-size: 1.85rem;
                      font-weight: 800;
                      margin-top: 1.75rem;
                      margin-bottom: 0.85rem;
                      color: #0f172a;
                      border-bottom: 2px solid #e2e8f0;
                      padding-bottom: 0.5rem;
                    }
                    .dark .docx-reader-content h1 {
                      color: #f8fafc;
                      border-bottom-color: #334155;
                    }
                    .docx-reader-content h2 {
                      font-size: 1.45rem;
                      font-weight: 700;
                      margin-top: 1.5rem;
                      margin-bottom: 0.65rem;
                      color: #1e293b;
                    }
                    .dark .docx-reader-content h2 {
                      color: #f1f5f9;
                    }
                    .docx-reader-content h3 {
                      font-size: 1.2rem;
                      font-weight: 700;
                      margin-top: 1.25rem;
                      margin-bottom: 0.5rem;
                      color: #334155;
                    }
                    .dark .docx-reader-content h3 {
                      color: #e2e8f0;
                    }
                    .docx-reader-content p {
                      margin-bottom: 1.1rem;
                      color: #334155;
                    }
                    .dark .docx-reader-content p {
                      color: #cbd5e1;
                    }
                    .docx-reader-content strong,
                    .docx-reader-content b {
                      font-weight: 700;
                      color: #0f172a;
                    }
                    .dark .docx-reader-content strong,
                    .dark .docx-reader-content b {
                      color: #ffffff;
                    }
                    .docx-reader-content table {
                      width: 100%;
                      border-collapse: collapse;
                      margin: 1.5rem 0;
                      border: 1px solid #cbd5e1;
                      border-radius: 12px;
                      overflow: hidden;
                      font-size: 0.92em;
                      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
                    }
                    .dark .docx-reader-content table {
                      border-color: #334155;
                    }
                    .docx-reader-content th,
                    .docx-reader-content td {
                      padding: 0.75rem 1rem;
                      border: 1px solid #e2e8f0;
                      vertical-align: top;
                    }
                    .dark .docx-reader-content th,
                    .dark .docx-reader-content td {
                      border-color: #334155;
                    }
                    .docx-reader-content tr:first-child td,
                    .docx-reader-content tr:first-child th {
                      background-color: #f1f5f9;
                      font-weight: 700;
                      color: #0f172a;
                    }
                    .dark .docx-reader-content tr:first-child td,
                    .dark .docx-reader-content tr:first-child th {
                      background-color: #1e293b;
                      color: #f8fafc;
                    }
                    .docx-reader-content tr:nth-child(even):not(:first-child) td {
                      background-color: #f8fafc;
                    }
                    .dark .docx-reader-content tr:nth-child(even):not(:first-child) td {
                      background-color: rgba(30, 41, 59, 0.4);
                    }
                    .docx-reader-content ul {
                      list-style-type: disc;
                      padding-left: 1.5rem;
                      margin-bottom: 1.25rem;
                    }
                    .docx-reader-content ol {
                      list-style-type: decimal;
                      padding-left: 1.5rem;
                      margin-bottom: 1.25rem;
                    }
                    .docx-reader-content li {
                      margin-bottom: 0.4rem;
                      color: #334155;
                    }
                    .dark .docx-reader-content li {
                      color: #cbd5e1;
                    }
                    .docx-reader-content img {
                      max-width: 100%;
                      height: auto;
                      border-radius: 1rem;
                      margin: 1.5rem auto;
                      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                      display: block;
                    }
                    .docx-reader-content blockquote {
                      border-left: 4px solid #f59e0b;
                      background-color: rgba(245, 158, 11, 0.07);
                      padding: 0.85rem 1.25rem;
                      border-radius: 0 0.75rem 0.75rem 0;
                      margin: 1.25rem 0;
                      font-style: italic;
                      color: #475569;
                    }
                    .dark .docx-reader-content blockquote {
                      background-color: rgba(245, 158, 11, 0.12);
                      color: #cbd5e1;
                    }
                    .docx-reader-content a {
                      color: #2563eb;
                      text-decoration: underline;
                      font-weight: 500;
                    }
                    .dark .docx-reader-content a {
                      color: #60a5fa;
                    }
                  `}</style>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-12 md:p-16 border border-slate-200/80 dark:border-slate-800 shadow-md">
                    
                    {/* TIÊU ĐỀ TRÊN ĐẦU TRANG GIÁO TRÌNH */}
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                          Giáo trình Word chính thức
                        </span>
                        {lessonTitle && (
                          <span className="text-xs font-bold text-slate-400">
                            • {lessonTitle}
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                        {activeDoc.title}
                      </h1>
                      {activeDoc.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                          {activeDoc.description}
                        </p>
                      )}
                    </div>

                    {/* NỘI DUNG VĂN BẢN WORD RENDER ĐẦY ĐỦ */}
                    <div 
                      className="docx-reader-content select-text"
                      style={{ fontSize: `${fontSizePercent}%` }}
                      dangerouslySetInnerHTML={{ __html: docxHtml }}
                    />

                    {/* CUỐI TRANG TÀI LIỆU */}
                    <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
                      <span>RMSA Academy • Running Man Sales Academy</span>
                      {activeDoc.fileUrl && (
                        <a
                          href={activeDoc.fileUrl}
                          download={activeDoc.fileName || true}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải tệp tin Word gốc ({activeDoc.size || 'DOCX'})</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
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