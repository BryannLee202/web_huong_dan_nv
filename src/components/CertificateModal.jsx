import React from 'react';
import { X, Award, Printer, ShieldCheck, QrCode } from 'lucide-react';

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

  const certId = 'RMSA-VERIFIED-2026-RENTAL';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-3xl rounded-2xl shadow-xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Chứng Nhận Tốt Nghiệp Sát Hạch RMSA</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas */}
        <div className="p-8 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-4 border-double border-amber-600 rounded-2xl p-8 text-center relative shadow-sm">
            
            {/* Top Certificate ID */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mb-2 font-mono">
              <span>MÃ ĐỊNH DANH: {certId}</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold">XÁC MINH HỆ THỐNG RMSA 100%</span>
            </div>

            {/* Logo Running Man */}
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200/90 dark:border-amber-800/80 flex items-center justify-center mx-auto mb-2.5 p-1 shadow-xs">
              <img 
                src="/images/running_man_logo.png" 
                alt="Running Man" 
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs uppercase tracking-widest text-amber-800 dark:text-amber-400 font-bold mb-1">
              RMSA • RUNNING MAN SALES ACADEMY
            </p>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-wide mb-2">
              CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Chứng nhận cấp cho chuyên viên kinh doanh căn hộ cho thuê:</p>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white underline decoration-blue-600 underline-offset-8 mb-4">
              {studentName}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
              Đã hoàn thành toàn bộ lộ trình đào tạo kinh doanh căn hộ cho thuê thực chiến và vượt qua kỳ thi sát hạch năng lực Running Man với điểm số trung bình đạt: <strong className="text-blue-600 dark:text-blue-400 font-bold text-sm">{avgScore}%</strong>
            </p>

            {/* Footer Details */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              <div className="text-left">
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Ngày cấp:</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{currentDate}</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md mb-1">
                  <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">{certId}</span>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Giám Đốc Đào Tạo:</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 italic">Đan Rin (Sáng Lập RMSA)</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {allPassed 
              ? '✅ Nhân viên đã đủ tiêu chuẩn xuất chứng nhận chính thức.' 
              : '⚠️ Bản xem trước (Cần đạt ≥ 80% tất cả các bài để hoàn thành).'}
          </p>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs flex items-center space-x-2 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In / Lưu file PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
