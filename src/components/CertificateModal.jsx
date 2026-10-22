import React from 'react';
import { createPortal } from 'react-dom';
import { X, Award, Printer, QrCode } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_ISSUE_DATE = new Date().toLocaleDateString('vi-VN');

export default function CertificateModal({ 
  isOpen, 
  onClose, 
  studentName = 'Nguyễn Văn A', 
  avgScore = 90, 
  allPassed = true,
  issueDate = null
}) {
  if (!isOpen) return null;

  const currentDate = issueDate || DEFAULT_ISSUE_DATE;
  const certId = `RMSA-VERIFIED-${CURRENT_YEAR}-RENTAL`;

  const handlePrint = () => {
    window.print();
  };

  const modalContent = (
    <div data-modal-portal="true" className="fixed inset-0 z-[999999] flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border-0 sm:border border-slate-200 dark:border-slate-800 w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] max-w-3xl rounded-none sm:rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <Award className="w-5 h-5 text-amber-500 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">Chứng Nhận Sát Hạch RMSA</span>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Canvas */}
        <div className="p-3 sm:p-8 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-2 sm:border-4 border-double border-amber-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center relative shadow-sm">
            
            {/* Top Certificate ID */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 mb-2 font-mono gap-1">
              <span>MÃ ĐỊNH DANH: {certId}</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold">XÁC MINH HỆ THỐNG RMSA 100%</span>
            </div>

            {/* Logo Running Man */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-slate-950 dark:bg-slate-900 border border-amber-400/40 dark:border-amber-500/30 flex items-center justify-center mx-auto mb-2 p-1.5 sm:p-2 shadow-md">
              <img 
                src="/images/running_man_logo.png" 
                alt="Running Man" 
                className="w-full h-full object-contain filter brightness-110 drop-shadow-[0_1px_4px_rgba(255,255,255,0.25)]"
              />
            </div>

            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-800 dark:text-amber-400 font-bold mb-1">
              RMSA • RUNNING MAN SALES ACADEMY
            </p>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-wide mb-1 sm:mb-2">
              CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-3 sm:mb-5">Chứng nhận cấp cho nhân sự / nhân viên kinh doanh căn hộ cho thuê:</p>

            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white underline decoration-blue-600 underline-offset-6 sm:underline-offset-8 mb-3 sm:mb-4">
              {studentName}
            </h3>

            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed mb-4 sm:mb-6">
              Đã hoàn thành toàn bộ lộ trình đào tạo kinh doanh căn hộ cho thuê thực chiến và vượt qua kỳ thi sát hạch năng lực Running Man với điểm số trung bình đạt: <strong className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm">{avgScore}%</strong>
            </p>

            {/* Footer Details */}
            <div className="grid grid-cols-2 sm:flex sm:items-center justify-between pt-4 sm:pt-5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto gap-3 sm:gap-2">
              <div className="text-left">
                <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500">Ngày cấp:</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs">{currentDate}</p>
              </div>

              {/* Con dấu linh vật danh dự Running Rin */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img 
                    src="/mascot-running-rin.jpg" 
                    alt="Huy hiệu Running Rin" 
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-amber-500 shadow-md ring-2 ring-amber-300/40"
                  />
                  <span className="absolute -bottom-1 -right-1 text-[6px] sm:text-[7px] bg-amber-500 text-slate-950 font-black px-1 rounded-full uppercase shadow-xs">
                    RMSA SEAL
                  </span>
                </div>
                <span className="text-[7px] sm:text-[8px] text-amber-600 dark:text-amber-400 font-extrabold mt-0.5 sm:mt-1 uppercase tracking-wider">Huy Hiệu Xác Thực</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md mb-0.5 sm:mb-1">
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-[8px] sm:text-[9px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[120px]">{certId}</span>
              </div>

              <div className="text-right">
                <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500">Giám Đốc Đào Tạo:</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs italic">Đan Rin</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-0 shrink-0">
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            {allPassed 
              ? '✅ Nhân viên đã đủ tiêu chuẩn xuất chứng nhận chính thức.' 
              : '⚠️ Bản xem trước (Cần đạt ≥ 80% tất cả các bài để hoàn thành).'}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="sm:hidden flex-1 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs text-center cursor-pointer active:scale-95"
            >
              Đóng
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In / Lưu PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
