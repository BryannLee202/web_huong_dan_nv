import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound, 
  Eye, 
  EyeOff, 
  RefreshCw 
} from 'lucide-react';
import api from '../services/api';

export default function ForgotPasswordModal({ isOpen, onClose, onPasswordResetSuccess }) {
  const [step, setStep] = useState(1); // 1: Nhập Email/SĐT, 2: Nhập OTP, 3: Đặt MK mới, 4: Thành công
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [sentTarget, setSentTarget] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [debugOtp, setDebugOtp] = useState('');

  // Có thể gửi lại khi bộ đếm về 0
  const canResend = countdown === 0;

  // Đánh giá 4 tiêu chí mật khẩu mạnh
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  const isPasswordStrong = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  // Đếm ngược gửi lại OTP
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setIdentifier('');
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setSuccessMsg('');
    setDebugOtp('');
    onClose();
  };

  // Bước 1: Gửi OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const cleanId = identifier.trim();

    if (!cleanId) {
      setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại tài khoản của bạn.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.requestOtp(cleanId);
      if (res.success) {
        setSentTarget(res.target || cleanId);
        if (res.debugOtp) {
          setDebugOtp(res.debugOtp);
        }
        setStep(2);
        setCountdown(60);
        setSuccessMsg(res.message || 'Mã xác thực OTP đã được gửi thành công!');
      } else {
        setErrorMsg(res.message || 'Không tìm thấy tài khoản tương ứng.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi gửi mã OTP. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi lại mã OTP
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await api.auth.requestOtp(identifier.trim());
      if (res.success) {
        if (res.debugOtp) setDebugOtp(res.debugOtp);
        setCountdown(60);
        setSuccessMsg('Đã gửi lại mã OTP mới!');
      } else {
        setErrorMsg(res.message || 'Không thể gửi lại mã OTP.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi gửi lại mã OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Bước 2: Xác nhận OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanOtp = otpCode.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMsg('Vui lòng nhập đầy đủ 6 chữ số mã OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.verifyOtp(identifier.trim(), cleanOtp);
      if (res.success) {
        setStep(3);
        setErrorMsg('');
        setSuccessMsg('Xác thực OTP thành công! Vui lòng nhập mật khẩu mới.');
      } else {
        setErrorMsg(res.message || 'Mã OTP không chính xác.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi đối soát mã OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Bước 3: Đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isPasswordStrong) {
      setErrorMsg('Mật khẩu mới chưa đạt chuẩn bảo mật 4 tiêu chí (≥8 ký tự, chữ in hoa, số và ký tự đặc biệt).');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp. Vui lòng nhập lại!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.resetPassword(identifier.trim(), otpCode.trim(), newPassword);
      if (res.success) {
        setStep(4);
        setTimeout(() => {
          handleClose();
          if (onPasswordResetSuccess) {
            onPasswordResetSuccess(identifier.trim(), newPassword);
          }
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Đặt lại mật khẩu thất bại.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 sm:pt-6 pb-2.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-slate-900 border border-slate-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center p-1.5 shrink-0">
              <img 
                src="/images/running_man_logo.png" 
                alt="Running Man" 
                className="w-full h-full object-contain filter brightness-110 drop-shadow-[0_1px_3px_rgba(255,255,255,0.2)]"
              />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">RUNNING MAN</h3>
              <p className="text-[10px] font-extrabold text-[#0d5cb6] dark:text-blue-400 tracking-wider uppercase">Khôi Phục Mật Khẩu</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body - Scrollable on mobile */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          
          {/* Thông báo lỗi nếu có */}
          {errorMsg && (
            <div className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center animate-shake">
              {errorMsg}
            </div>
          )}

          {/* Thông báo thành công nếu có */}
          {successMsg && step !== 4 && (
            <div className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center flex items-center justify-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* BƯỚC 1: NHẬP EMAIL HOẶC SỐ ĐIỆN THOẠI                          */}
          {/* ============================================================== */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="text-left space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tìm tài khoản của bạn</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nhập Email hoặc Số điện thoại bạn đã đăng ký để nhận mã xác thực OTP.
                </p>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Email hoặc Số điện thoại
                </label>
                <div className="h-12 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/50 transition-all flex items-center px-3.5 shadow-2xs">
                  <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input 
                    type="text"
                    required
                    autoFocus
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="VD: nguyenvana@gmail.com hoặc 0901..."
                    className="w-full h-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-4"
              >
                {isLoading ? <span>Đang xử lý...</span> : <span>Gửi mã xác thực OTP</span>}
              </button>
            </form>
          )}

          {/* ============================================================== */}
          {/* BƯỚC 2: NHẬP MÃ OTP 6 CHỮ SỐ                                   */}
          {/* ============================================================== */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-left space-y-1">
                <div className="flex items-center space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    <span>Đổi Email/SĐT</span>
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Nhập mã xác thực OTP</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mã xác thực gồm 6 số đã được gửi đến: <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold">{sentTarget}</strong>
                </p>
              </div>

              {/* Thông báo nếu chạy ở chế độ dev fallback */}
              {debugOtp && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200 text-xs">
                  <span>💡 Mã xác thực kiểm thử của bạn: </span>
                  <span className="font-mono font-black text-sm tracking-widest text-amber-900 dark:text-amber-100">{debugOtp}</span>
                </div>
              )}

              <div className="space-y-1.5 text-center">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block text-left">
                  Mã OTP (6 chữ số)
                </label>
                <div className="h-14 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-blue-500 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/50 transition-all flex items-center justify-center px-4 shadow-2xs">
                  <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 shrink-0" />
                  <input 
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="______"
                    className="w-full h-full bg-transparent text-xl sm:text-2xl text-center font-black tracking-[0.4em] text-blue-700 dark:text-blue-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Đếm ngược gửi lại OTP */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span>Chưa nhận được mã?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Gửi lại mã OTP
                  </button>
                ) : (
                  <span className="font-mono text-slate-400">Gửi lại sau {countdown}s</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <span>Đang xác thực...</span> : <span>Xác nhận mã OTP</span>}
              </button>
            </form>
          )}

          {/* ============================================================== */}
          {/* BƯỚC 3: ĐẶT MẬT KHẨU MỚI (CHỐNG HACK)                           */}
          {/* ============================================================== */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div className="text-left space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tạo mật khẩu mới</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Thiết lập mật khẩu an toàn đáp ứng đủ 4 tiêu chí bảo mật để tránh bị hack.
                </p>
              </div>

              {/* Mật khẩu mới */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Mật khẩu mới
                </label>
                <div className="h-11 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/50 transition-all flex items-center px-3.5 shadow-2xs">
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full h-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Xác nhận lại mật khẩu
                </label>
                <div className="h-11 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/50 transition-all flex items-center px-3.5 shadow-2xs">
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full h-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Bảng checklist 4 tiêu chí bảo mật */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400" />
                    Tiêu chuẩn an toàn chống hack:
                  </span>
                  {newPassword && (
                    <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                      isPasswordStrong 
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      {isPasswordStrong ? '✓ Đạt chuẩn' : 'Chưa đủ'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                  <div className={`flex items-center space-x-1 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                    <span>{hasMinLength ? '✓' : '•'}</span>
                    <span>Từ 8 ký tự</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                    <span>{hasUppercase ? '✓' : '•'}</span>
                    <span>Chữ in hoa (A-Z)</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                    <span>{hasNumber ? '✓' : '•'}</span>
                    <span>Chữ số (0-9)</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                    <span>{hasSpecial ? '✓' : '•'}</span>
                    <span>Ký tự đặc biệt (@, !...)</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isPasswordStrong}
                className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <span>Đang cập nhật...</span> : <span>Lưu mật khẩu mới & Đăng nhập</span>}
              </button>
            </form>
          )}

          {/* ============================================================== */}
          {/* BƯỚC 4: THÀNH CÔNG                                             */}
          {/* ============================================================== */}
          {step === 4 && (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md animate-in zoom-in">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">Đặt lại mật khẩu thành công!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mật khẩu mới của bạn đã được cập nhật an toàn. Đang chuyển hướng bạn đăng nhập...
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
