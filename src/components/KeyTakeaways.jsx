import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  FileText,
  Target,
  Download,
  Clock,
  FileCode,
  FileSpreadsheet,
  FileCheck2,
  BookmarkCheck,
  PlayCircle
} from 'lucide-react';

export default function KeyTakeaways({ 
  summary = [], 
  attachments = [],
  timestamps = [],
  onStartQuiz, 
  passingScore = 80, 
  quizLength = 5,
  onSeekVideo
}) {
  const handleDownloadAttachment = (att) => {
    // Generate simulated download file with content
    const sampleText = `--- TÀI LIỆU ĐÀO TẠO BÁN HÀNG RIN SALES ACADEMY ---\n` +
      `Tên tài liệu: ${att.title}\n` +
      `Mã tài liệu: ${att.id}\n` +
      `Kích thước: ${att.size}\n` +
      `Ngày cấp: ${new Date().toLocaleDateString('vi-VN')}\n\n` +
      `NỘI DUNG TÓM TẮT THỰC CHIẾN:\n` +
      `1. Lắng nghe và đồng cảm sâu với nỗi đau của khách hàng.\n` +
      `2. Áp dụng quy tắc 7-38-55 trong ngữ điệu và phong thái giao tiếp.\n` +
      `3. Kỹ thuật bẻ gãy từ chối giá bằng cam kết giá trị và độ bền lâu dài.\n` +
      `4. Chốt hợp đồng bằng kỹ thuật lựa chọn thay thế (Alternative Choice).\n\n` +
      `Bản quyền thuộc RIN Sales Academy 2026.`;

    const blob = new Blob([sampleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = att.title.endsWith('.pdf') || att.title.endsWith('.docx') ? att.title : `${att.title}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TÓM TẮT NỘI DUNG CỐT LÕI */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-left">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#007c5d] flex items-center justify-center border border-emerald-100">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Tóm Tắt Nội Dung Cốt Lõi</h3>
              <p className="text-xs text-slate-500">Các điểm then chốt cần ghi nhớ để áp dụng thực tế và làm bài kiểm tra</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            <Target className="w-3.5 h-3.5 mr-1 text-[#007c5d]" />
            Chuẩn qua: {passingScore}%
          </span>
        </div>

        {/* Summary points list */}
        <ul className="space-y-2.5 mb-6">
          {summary && summary.map((point, idx) => (
            <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-[#007c5d] mt-0.5 shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* Action banner to start quiz */}
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Sẵn sàng kiểm tra kiến thức?</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Bài test gồm {quizLength} câu hỏi trắc nghiệm. Đạt tối thiểu {passingScore}% để mở khóa bài tiếp theo.
            </p>
          </div>

          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-[0_4px_14px_rgba(245,158,11,0.35)] border border-amber-300/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>Làm bài kiểm tra ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. MỐC THỜI GIAN BÀI GIẢNG (VIDEO TIMESTAMPS - MOON.VN STYLE) */}
      {timestamps && timestamps.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-left">
          <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Mốc Thời Gian Bài Giảng (Timestamps)</h3>
              <p className="text-xs text-slate-500">Nhấp vào từng mốc để tua video trực tiếp đến phân đoạn tương ứng</p>
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
                className="p-3 rounded-xl border border-slate-200 hover:border-[#007c5d] bg-slate-50/70 hover:bg-emerald-50/50 transition-all text-left flex items-center space-x-3 cursor-pointer group"
              >
                <span className="font-mono font-black text-xs px-2 py-1 rounded-md bg-white border border-slate-200 text-[#007c5d] group-hover:bg-[#007c5d] group-hover:text-white transition-colors shrink-0">
                  {ts.time}
                </span>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-snug line-clamp-1">
                  {ts.label}
                </span>
                <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-[#007c5d] ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. TÀI LIỆU ĐÍNH KÈM & HỌC LIỆU (ATTACHMENTS - CODELEARN STYLE) */}
      {attachments && attachments.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-left">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <BookmarkCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Tài Liệu Đính Kèm ({attachments.length})</h3>
                <p className="text-xs text-slate-500">Cẩm nang, slide và kịch bản mẫu tải về máy tính để tra cứu</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Tải miễn phí
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#007c5d] hover:shadow-xs transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#007c5d] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate" title={att.title}>
                      {att.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Định dạng: {att.type?.toUpperCase() || 'PDF'} • Dung lượng: {att.size || '1.0 MB'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadAttachment(att)}
                  title="Tải tài liệu về máy"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#007c5d] hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center space-x-1 shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tải về</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
