import React, { useState } from 'react';
import { X, Lock, Phone, User, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('nhanvien@runningman.vn');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Chuyên Viên Kinh Doanh',
        email: identifier,
        role: 'student'
      });
      onClose();
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Học Viên Running Man',
        email: 'nhanvien@runningman.vn',
        role: 'student'
      });
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#1c7fe0] flex items-center justify-center text-white font-black text-xs">
              RM
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Đăng nhập RUNNING MAN LMS</h3>
              <p className="text-[11px] text-slate-500">Đào tạo kinh doanh & Quản trị căn hộ cho thuê</p>
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
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Số điện thoại hoặc Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Nhập số điện thoại hoặc email"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c7fe0] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Mật khẩu
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-[#1c7fe0] hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c7fe0] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#1c7fe0] hover:bg-[#1569bd] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            {isLoading ? (
              <span>Đang đăng nhập...</span>
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">hoặc</span>
            </div>
          </div>

          {/* Quick Demo 1-Click Login Button */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>1-Click Đăng nhập nhanh (Học viên)</span>
          </button>

          <p className="text-[11px] text-center text-slate-500 pt-2">
            Chưa có tài khoản?{' '}
            <span className="text-[#1c7fe0] font-bold cursor-pointer hover:underline">
              Đăng ký ngay
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}
