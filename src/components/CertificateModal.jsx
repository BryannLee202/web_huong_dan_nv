import React from 'react';
import { X, Award, Printer, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function CertificateModal({ 
  isOpen, 
  onClose, 
  studentName = 'Nguyễn Văn A', 
  avgScore = 90, 
  allPassed = true 
}) {
  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-white">Chứng Nhận Tốt Nghiệp Đào Tạo</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas / Container */}
        <div className="p-8 bg-slate-950 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-4 border-amber-500/40 rounded-2xl p-8 text-center relative shadow-2xl shadow-amber-950/20">
            
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400"></div>
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400"></div>

            {/* Badge Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <Award className="w-9 h-9" />
            </div>

            <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
              RIN SALES ACADEMY • CHỨNG NHẬN ĐẠO TẠO
            </p>
            <h2 className="text-2xl font-black text-white tracking-wide mb-3">
              CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC
            </h2>
            <p className="text-xs text-slate-400 mb-6">Chứng nhận cấp cho nhân sự kinh doanh xuất sắc:</p>

            <h3 className="text-2xl font-bold text-emerald-400 underline decoration-emerald-500/50 underline-offset-8 mb-4">
              {studentName}
            </h3>

            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
              Đã hoàn thành toàn bộ lộ trình đào tạo chuyên sâu và vượt qua các bài thi sát hạch thực tế với điểm số trung bình đạt: <strong className="text-amber-400 font-bold text-sm">{avgScore}%</strong>
            </p>

            {/* Footer Details */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800 text-xs text-slate-400 max-w-md mx-auto">
              <div className="text-left">
                <p className="text-[11px] text-slate-400">Ngày cấp chứng nhận:</p>
                <p className="font-semibold text-slate-200">{currentDate}</p>
              </div>

              <div className="flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-bold text-[11px]">XÁC THỰC HỢP LỆ</span>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-slate-400">Chữ ký Ban Đào Tạo:</p>
                <p className="font-semibold text-amber-400 italic">RIN Academy Director</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            {allPassed 
              ? '✅ Nhân viên đã đủ tiêu chuẩn xuất chứng nhận chính thức.' 
              : '⚠️ Bản xem trước (Cần vượt qua tất cả bài học với điểm ≥ 80% để nhận chính thức).'}
          </p>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-md cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>In / Lưu file PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
