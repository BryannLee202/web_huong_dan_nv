import React, { useState } from 'react';
import { X, Lock, User, CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onOpenFullScreen }) {
  const [identifier, setIdentifier] = useState('nhanvien@runningman.vn');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const rawName = identifier.includes('@') ? identifier.split('@')[0] : identifier;
      const formattedName = (rawName.toLowerCase() === 'nhanvien' || rawName.toLowerCase() === 'nhan_vien') ? 'Chuyên Viên Sale' : (rawName.toLowerCase() === 'hocvien' ? 'Học Viên Mới' : rawName);
      const userRole = (identifier.toLowerCase().includes('nhanvien') || identifier.toLowerCase().includes('admin') || rawName.toLowerCase().includes('sale')) ? 'pro_sales' : 'student';
      onLoginSuccess({
        name: formattedName,
        email: identifier,
        role: userRole
      });
      onClose();
    }, 400);
  };

  const handleQuickDemoLogin = (roleName, email, role = 'student') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: roleName,
        email: email,
        role: role
      });
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1 overflow-hidden">
              <img 
                src="/images/running_man_logo.png" 
                alt="Running Man" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">ĐĂNG NHẬP RMSA</h3>
              <p className="text-[10px] text-slate-400 font-medium">Running Man Sales Academy • Đan Rin</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-700 block">
              Tên tài khoản
            </label>
            <div className="h-11 w-full rounded-xl bg-[#F2F5F9] focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all flex items-center px-3.5">
              <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Tên tài khoản hoặc Email"
                className="w-full h-full bg-transparent text-xs text-slate-800 placeholder-[#99AEBE] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Mật khẩu
              </label>
              <a 
                href="#forgot" 
                onClick={(e) => {
                  e.preventDefault();
                  alert('Vui lòng liên hệ Trợ giảng hoặc Đan Rin qua Zalo/Hotline để nhận mã đặt lại mật khẩu.');
                }} 
                className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline font-semibold"
              >
                Quên mật khẩu?
              </a>
            </div>
            <div className="h-11 w-full rounded-xl bg-[#F2F5F9] focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all flex items-center px-3.5">
              <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="w-full h-full bg-transparent text-xs text-slate-800 placeholder-[#99AEBE] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* reCAPTCHA disclaimer */}
          <p className="text-[10px] text-slate-400 leading-relaxed text-left">
            Trang web này được bảo vệ bởi reCAPTCHA và Điều khoản dịch vụ của Google được áp dụng.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-sm shadow-[0_4px_16px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2"
          >
            {isLoading ? (
              <span>Đang đăng nhập...</span>
            ) : (
              <span>Đăng nhập vào hệ thống LMS</span>
            )}
          </button>

          {/* Quick Demo Login */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">
                Đăng nhập nhanh theo vai trò:
              </span>
              <span className="text-[9px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100">
                Phân quyền riêng
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Học Viên Mới', 'hocvien@runningman.vn', 'student')}
                className="p-2.5 rounded-xl bg-[#F2F5F9] hover:bg-sky-50/80 border border-slate-200/70 text-slate-700 hover:text-sky-900 font-medium text-left transition-colors cursor-pointer text-[11px]"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-bold text-slate-900">Học viên mới</p>
                  <span className="text-[8px] font-bold px-1 rounded-full bg-slate-200 text-slate-600">Tân Binh</span>
                </div>
                <p className="text-[9px] text-slate-400 font-mono mb-1">hocvien@runningman.vn</p>
                <p className="text-[9px] text-slate-500 leading-tight border-t border-slate-200/60 pt-1">Khóa tuần tự • Thi ≥80%</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Chuyên Viên Sale', 'nhanvien@runningman.vn', 'pro_sales')}
                className="p-2.5 rounded-xl bg-[#F2F5F9] hover:bg-blue-50/80 border border-slate-200/70 text-slate-700 hover:text-blue-900 font-medium text-left transition-colors cursor-pointer text-[11px]"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-bold text-slate-900">Chuyên viên Sale</p>
                  <span className="text-[8px] font-extrabold px-1 rounded-full bg-blue-100 text-blue-700">👑 PRO</span>
                </div>
                <p className="text-[9px] text-slate-400 font-mono mb-1">nhanvien@runningman.vn</p>
                <p className="text-[9px] text-blue-700 font-bold leading-tight border-t border-slate-200/60 pt-1">Mở full 8 bài • Quản trị</p>
              </button>
            </div>
          </div>

          {onOpenFullScreen && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullScreen();
                }}
                className="text-xs text-[#105494] font-semibold hover:underline cursor-pointer"
              >
                Mở trang đăng nhập chuẩn MapStudy đầy đủ →
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
