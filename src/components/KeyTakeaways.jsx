import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Target, 
  Download, 
  Clock, 
  BookmarkCheck, 
  PlayCircle,
  Sparkles
} from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_DATE_STR = new Date().toLocaleDateString('vi-VN');

export default function KeyTakeaways({ 
  summary = [], 
  attachments = [],
  timestamps = [],
  onStartQuiz, 
  passingScore = 80, 
  quizLength = 5,
  onSeekVideo,
  hasVideo = false,
  lessonTitle = '',
  isAdmin = false,
  onOpenVideoAdmin,
  onTriggerAi,
  isAiGenerating = false
}) {
  const handleDownloadAttachment = (att) => {
    if (att.url) {
      window.open(att.url, '_blank');
      return;
    }
    const pointsText = summary && summary.length > 0
      ? summary.map((p, i) => `${i + 1}. ${p}`).join('\n')
      : 'Nắm vững kiến thức và kỹ năng thực tế của chuyên đề.';

    const sampleText = `--- TÀI LIỆU ĐÀO TẠO BÁN HÀNG RIN SALES ACADEMY ---\n` +
      `Chuyên đề: ${lessonTitle || 'Kỹ năng môi giới thực chiến'}\n` +
      `Tên tài liệu: ${att.title}\n` +
      `Mã tài liệu: ${att.id}\n` +
      `Dung lượng: ${att.size || '1.0 MB'}\n` +
      `Ngày phát hành: ${CURRENT_DATE_STR}\n\n` +
      `NỘI DUNG CỐT LÕI CẦN GHI NHỚ:\n${pointsText}\n\n` +
      `Bản quyền thuộc Running Man Sales Academy (RMSA) ${CURRENT_YEAR}.`;

    const blob = new Blob([sampleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = att.title.endsWith('.pdf') || att.title.endsWith('.docx') || att.title.endsWith('.xlsx') ? att.title : `${att.title}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const hasSummaryContent = hasVideo && Array.isArray(summary) && summary.length > 0;
  const hasValidAttachments = Array.isArray(attachments) && attachments.length > 0;

  return (
    <div className="space-y-6">
      
      {/* 1. TÓM TẮT NỘI DUNG CỐT LÕI */}
      <div id="tom-tat-noi-dung" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs text-left transition-colors duration-200 scroll-mt-24">
        
        {/* TRƯỜNG HỢP A: ĐÃ CÓ VIDEO VÀ CÓ NỘI DUNG TÓM TẮT */}
        {hasSummaryContent ? (
          <>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Tóm Tắt Nội Dung Cốt Lõi</h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <span>Đã đồng bộ AI</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Các điểm then chốt trích xuất từ bài giảng video để áp dụng thực tế</p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Target className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400" />
                Chuẩn qua: {passingScore}%
              </span>
            </div>

            {/* Summary points list */}
            <ul className="space-y-2.5 mb-6">
              {summary.map((point, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50/70 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Action banner to start quiz */}
            <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-slate-50 dark:from-slate-800 dark:via-indigo-950/40 dark:to-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sẵn sàng kiểm tra kiến thức?</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Bài test gồm {quizLength} câu hỏi trắc nghiệm. Đạt tối thiểu {passingScore}% để mở khóa bài tiếp theo.
                </p>
              </div>

              <button
                onClick={onStartQuiz}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>Làm bài kiểm tra ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : isAdmin ? (
          /* TRƯỜNG HỢP B: QUẢN TRỊ VIÊN - KHUNG CHUẨN BỊ AI TÓM TẮT VIDEO TỰ ĐỘNG */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 dark:border-amber-800/40">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Tóm Tắt Nội Dung Cốt Lõi Bằng AI</h3>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                      Sẵn sàng tích hợp AI
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-stone-400">Tự động đọc bài giảng video để trích xuất 4-5 điểm cốt lõi và mốc thời gian</p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Target className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400" />
                Chuẩn qua: {passingScore}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/60 via-slate-50 to-amber-50/40 dark:from-[#24201e] dark:via-[#1c1917] dark:to-[#221e1c] border border-amber-200/60 dark:border-amber-900/40">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-stone-300 leading-relaxed">
                ⚡ <strong>Đang chờ bài giảng video:</strong> Sau khi bạn tải lên video bài giảng cho chuyên đề này, module AI sẽ tự động phân tích giọng nói, trích xuất các ý lý thuyết cốt lõi và mốc thời gian (timestamps) xuất hiện tại đây mà không cần soạn thảo thủ công.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                {onOpenVideoAdmin && (
                  <button
                    type="button"
                    onClick={onOpenVideoAdmin}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span>⚙️ Cài đặt Video bài giảng</span>
                  </button>
                )}

                {onTriggerAi && (
                  <button
                    type="button"
                    disabled={isAiGenerating}
                    onClick={onTriggerAi}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-xs flex items-center space-x-2 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                  >
                    <Sparkles className={`w-4 h-4 text-slate-950 ${isAiGenerating ? 'animate-spin' : ''}`} />
                    <span>{isAiGenerating ? 'AI đang phân tích & sinh...' : '⚡ Kích hoạt AI Tóm Tắt & Sinh 5 Câu Sát Hạch'}</span>
                  </button>
                )}
              </div>

              <button
                onClick={onStartQuiz}
                className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-stone-300 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer ml-auto"
              >
                <span>Xem thử bộ đề sát hạch ({quizLength} câu)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* TRƯỜNG HỢP C: NHÂN VIÊN - CHỜ BÀI GIẢNG VÀ TẬP TRUNG LÀM BÀI SÁT HẠCH */
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Tóm Tắt Nội Dung Cốt Lõi</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Đang chờ hoàn thiện bản tóm tắt tự động cùng video bài giảng</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Chuyên đề đang được Ban Đào tạo ghi hình và tối ưu hóa bài giảng. Bạn có thể làm ngay bài kiểm tra sát hạch 5 câu bên dưới để ghi nhận điểm số chuyên đề.
            </p>

            <div className="pt-2">
              <button
                onClick={onStartQuiz}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Làm bài kiểm tra sát hạch ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. MỐC THỜI GIAN BÀI GIẢNG (CHỈ HIỂN THỊ KHI ĐÃ CÓ VIDEO BÀI GIẢNG THỰC TẾ) */}
      {hasVideo && timestamps && timestamps.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs text-left transition-colors duration-200">
          <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Mốc Thời Gian Bài Giảng (Timestamps)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Nhấp vào từng mốc để tua video trực tiếp đến phân đoạn tương ứng</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {timestamps.map((ts, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (onSeekVideo) onSeekVideo(ts.seconds);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/70 dark:bg-slate-800/70 hover:bg-blue-50/50 dark:hover:bg-slate-750 transition-all text-left flex items-center space-x-3 cursor-pointer group"
              >
                <span className="font-mono font-black text-xs px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                  {ts.time}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white leading-snug line-clamp-1">
                  {ts.label}
                </span>
                <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. TÀI LIỆU ĐÍNH KÈM & HỌC LIỆU */}
      {hasValidAttachments ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs text-left transition-colors duration-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-800">
                <BookmarkCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Tài Liệu Đính Kèm ({attachments.length})</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Cẩm nang, slide và kịch bản thực tế tải về máy tính để tra cứu</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Tải miễn phí
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate" title={att.title}>
                      {att.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      Định dạng: {att.type?.toUpperCase() || 'PDF'} • Dung lượng: {att.size || '1.0 MB'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadAttachment(att)}
                  title="Tải tài liệu về máy"
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center space-x-1 shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tải về</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : isAdmin ? (
        /* VỚI ADMIN: THÔNG BÁO CHƯA CÓ FILE ĐÍNH KÈM THẬT */
        <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.08] bg-slate-50/60 dark:bg-[#161413] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-stone-400 text-left">
          <div className="flex items-center space-x-2.5">
            <BookmarkCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Chuyên đề này hiện chưa có tài liệu đính kèm (Slide / PDF / Kịch bản).</span>
          </div>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
            Có thể bổ sung qua mục quản lý bài giảng
          </span>
        </div>
      ) : null}

    </div>
  );
}

