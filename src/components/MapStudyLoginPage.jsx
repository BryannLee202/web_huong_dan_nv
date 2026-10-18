import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Lock, 
  User, 
  BadgeCheck, 
  Phone,
  KeyRound,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';
import ForgotPasswordModal from './ForgotPasswordModal';
import GoogleAuthButton from './GoogleAuthButton';

export default function MapStudyLoginPage({ 
  onBackToHome, 
  onLoginSuccess,
  initialMode = 'login',
  theme = 'light',
  onToggleTheme
}) {
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');

  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    setIsRegisterMode(initialMode === 'register');
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const branch = 'Running Man Sales Academy';
  const [isBossRegister, setIsBossRegister] = useState(false);
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Đánh giá 4 tiêu chí mật khẩu mạnh chống hack
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const isPasswordStrong = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập Tên tài khoản hoặc Email');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập Mật khẩu');
      return;
    }

    if (isRegisterMode) {
      if (!fullName.trim()) {
        setErrorMsg('Vui lòng nhập Họ và tên');
        return;
      }
      if (!isPasswordStrong) {
        setErrorMsg('Mật khẩu chưa đủ an toàn. Vui lòng đáp ứng đủ 4 tiêu chí: từ 8 ký tự, có chữ in hoa, số và ký tự đặc biệt (VD: Rin@2026!).');
        return;
      }
      if (!confirmPassword.trim()) {
        setErrorMsg('Vui lòng xác nhận lại mật khẩu');
        return;
      }
      if (password.trim() !== confirmPassword.trim()) {
        setErrorMsg('Mật khẩu xác nhận không trùng khớp. Vui lòng kiểm tra lại!');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        const data = await api.auth.register({
          username: username.trim(),
          password: password.trim(),
          fullName: fullName.trim(),
          phone: phone.trim(),
          branch,
          role: isBossRegister ? 'admin' : 'student',
          adminSecretKey: isBossRegister ? adminSecretKey.trim() : ''
        });

        if (data && data.success) {
          setSuccessMsg('Đăng ký tài khoản thành công! Đang tự động đăng nhập...');
          setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess(data.user);
          }, 600);
          return;
        } else {
          setErrorMsg(data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại!');
          setIsLoading(false);
          return;
        }
      } else {
        // Đăng nhập
        const data = await api.auth.login(username.trim(), password.trim());
        if (data && data.success) {
          setIsLoading(false);
          onLoginSuccess(data.user);
          return;
        } else {
          setErrorMsg(data?.message || 'Tài khoản hoặc mật khẩu không chính xác!');
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi kết nối máy chủ');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-slate-900 dark:selection:bg-blue-600 selection:text-white relative overflow-x-hidden transition-colors duration-200">
      
      {/* Background Soft Glows & Tech Grid Lines */}
      <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-gradient-to-br from-blue-100/60 via-indigo-50/40 to-transparent dark:from-blue-900/20 dark:via-indigo-950/10 rounded-full blur-3xl pointer-events-none -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-sky-100/50 via-teal-50/30 to-transparent dark:from-sky-900/20 dark:via-teal-950/10 rounded-full blur-3xl pointer-events-none translate-x-1/4 translate-y-1/4" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors duration-200">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Brand Name - Đồng Bộ 100% Trang Chủ */}
          <div 
            onClick={onBackToHome}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none group"
            title="RMSA - Running Man Sales Academy"
          >
            {/* Bệ Đỡ Trang Sức Than Chì Tôn Vinh Biểu Tượng Kim Loại Bạc RM */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 dark:bg-slate-900 border border-slate-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center p-1.5 transition-transform duration-200 group-hover:scale-105 shrink-0">
              <img 
                src="/images/running_man_logo.png" 
                alt="Running Man" 
                className="w-full h-full object-contain filter brightness-110 drop-shadow-[0_1px_3px_rgba(255,255,255,0.2)]"
              />
            </div>

            {/* Vạch ngăn tinh tế phong cách kiến trúc */}
            <div className="h-6 w-px bg-slate-200 dark:bg-white/[0.12] hidden sm:block shrink-0" />

            {/* Typography thương hiệu sắc nét - Không chữ PRO */}
            <div className="flex flex-col">
              <span className="text-[14px] sm:text-[15px] font-black tracking-wider text-slate-900 dark:text-white leading-none">
                RUNNING MAN
              </span>
              <span className="text-[9.5px] font-extrabold tracking-[0.22em] text-[#0d5cb6] dark:text-blue-400 uppercase leading-none mt-1">
                SALES ACADEMY
              </span>
            </div>
          </div>

          {/* Right Header: Theme Toggle & Back Button */}
          <div className="flex items-center space-x-2.5">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <button
              onClick={onBackToHome}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay về Trang chủ</span>
            </button>
          </div>

        </div>
      </header>

      {/* MAIN 2-COLUMN LUXURY SHOWCASE CONTAINER */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-14 flex items-center justify-center">
        
        <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_70px_-15px_rgba(15,23,42,0.12)] border border-slate-200/90 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* ========================================================================= */}
          {/* CỘT TRÁI (LEFT SHOWCASE COLUMN): ARCHITECTURAL LUXURY HERO                 */}
          {/* ========================================================================= */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-[#fbfcfd] via-[#f4f7fb] to-[#e9f0f8] dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 text-slate-900 dark:text-slate-100 p-7 xl:p-8 flex-col justify-center space-y-4 xl:space-y-5 relative overflow-hidden border-r border-slate-200/80 dark:border-slate-800">
            
            {/* Subtle Architectural Blueprint Grid Pattern & Soft Light Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_0.8px,transparent_0.8px)] [background-size:18px_18px] opacity-40 dark:opacity-20 pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-200/25 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-200/25 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Branding & Headline */}
            <div className="relative z-10 space-y-2.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-2xs text-[11px] font-bold text-slate-800 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="tracking-wide uppercase text-[10px] text-slate-400 dark:text-slate-400 font-extrabold">RMSA</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-700 dark:text-slate-200 font-bold">Học Viện Môi Giới Thực Chiến</span>
              </div>

              <h1 className="text-2xl xl:text-3xl font-black text-slate-950 dark:text-white tracking-tight leading-snug">
                Làm Chủ Nghề Môi Giới <br className="hidden xl:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-indigo-300 dark:to-sky-400">
                  Căn Hộ Cho Thuê
                </span>
              </h1>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Học đúng quy trình thực chiến từ <strong className="font-bold text-slate-900 dark:text-white">Đan Rin</strong> — Nắm vững sản phẩm, làm chủ giỏ hàng thật và chốt cọc trong 15 phút.
              </p>
            </div>

            {/* Middle: Apartment Showcase Card with Dan Rin badge */}
            <div className="relative z-10">
              <div className="relative rounded-2xl overflow-hidden bg-white p-1.5 border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] group">
                <div className="relative rounded-xl overflow-hidden aspect-[16/9]">
                  <img 
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" 
                    alt="Căn hộ Studio Duplex cao cấp"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
                  
                  {/* Floating Mentor Glass Badge inside photo */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-white/80 shadow-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img 
                        src="/images/anh_rin_avatar.jpg" 
                        alt="Đan Rin" 
                        className="w-9 h-9 rounded-lg object-cover ring-2 ring-amber-400/90 shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1">
                          <p className="text-xs font-black text-slate-900 truncate">Đan Rin</p>
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-600 fill-blue-600 text-white shrink-0" />
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium truncate">3+ Năm chuỗi duplex & căn hộ mini</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 3 Editorial Value Cards (Gọn gàng, tinh tế, không thẻ pill vụn vặt) */}
            <div className="relative z-10 space-y-2">
              
              {/* Feature 1: Giỏ hàng */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 border-l-4 border-l-blue-600 shadow-2xs hover:shadow-xs transition-all">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Nguồn Hàng Căn Hộ Thật</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Duplex, studio & mini khảo sát thực tế có sẵn</p>
              </div>

              {/* Feature 2: Kịch bản */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 border-l-4 border-l-amber-500 shadow-2xs hover:shadow-xs transition-all">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Kịch Bản Bẻ Gãy Từ Chối</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Độc quyền chốt cọc trong 15 phút</p>
              </div>

              {/* Feature 3: Chuẩn hóa */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-xs transition-all">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">8 Nhóm Năng Lực Chuẩn Hóa</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Sát hạch thực chiến & bảo chứng chứng chỉ nội bộ</p>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* CỘT PHẢI (RIGHT FORM COLUMN): CLEAN LUXURY AUTH FORM                      */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 p-7 sm:p-9 lg:p-10 flex flex-col justify-center bg-white dark:bg-slate-900 transition-colors">
            
            {/* Header Form */}
            <div className="w-full text-center sm:text-left space-y-1.5 mb-6">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-800 text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">
                <span>Cổng Đào Tạo Nội Bộ RMSA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {isRegisterMode ? 'Đăng ký tài khoản' : 'Đăng nhập hệ thống'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                Truy cập bài giảng, thực hành kịch bản chốt cọc và kiểm tra sát hạch năng lực.
              </p>
            </div>

            {/* Error banner nếu có */}
            {errorMsg && (
              <div className="w-full mb-4 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center animate-shake">
                {errorMsg}
              </div>
            )}

            {/* Success banner nếu có */}
            {successMsg && (
              <div className="w-full mb-4 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center flex items-center justify-center space-x-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              
              {/* Nếu là Đăng ký: Thêm Họ và tên + Số điện thoại + Chi nhánh + Tùy chọn quyền quản lý */}
              {isRegisterMode && (
                <>
                  {/* Hàng 1: Họ và tên & Số điện thoại */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                        Họ và tên
                      </label>
                      <div className="h-12 w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-800 border border-slate-200/90 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/50 transition-all flex items-center px-3.5 shadow-2xs">
                        <User className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                        <input 
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nhập họ và tên"
                          className="w-full h-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                        Số điện thoại
                      </label>
                      <div className="h-12 w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-800 border border-slate-200/90 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/50 transition-all flex items-center px-3.5 shadow-2xs">
                        <Phone className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                        <input 
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Nhập số điện thoại"
                          className="w-full h-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phân biệt quyền Chủ / Quản trị viên */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 space-y-2 text-left">
                    <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={isBossRegister}
                        onChange={(e) => setIsBossRegister(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300 dark:border-amber-700 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />
                        Đăng ký quyền Chủ Doanh Nghiệp / Quản Trị Viên
                      </span>
                    </label>

                    {isBossRegister && (
                      <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
                        <label className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 block">
                          Mã kích hoạt Quản trị (Chỉ dành cho Chủ/Quản lý)
                        </label>
                        <div className="h-10 w-full rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 flex items-center px-3 shadow-2xs">
                          <KeyRound className="w-3.5 h-3.5 text-amber-500 mr-2 shrink-0" />
                          <input 
                            type="password"
                            value={adminSecretKey}
                            onChange={(e) => setAdminSecretKey(e.target.value)}
                            placeholder="Nhập mã bí mật Quản trị (VD: RMSA-BOSS-2026)"
                            className="w-full h-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                          Nhân viên thông thường bỏ qua ô này. Tài khoản sẽ tự động cấp quyền Học viên/Nhân viên bán hàng.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* TRƯỜNG: TÊN TÀI KHOẢN HOẶC EMAIL */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Tên tài khoản hoặc Email
                </label>
                <div className="h-12 w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-800 border border-slate-200/90 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/50 transition-all flex items-center px-3.5 shadow-2xs">
                  <User className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isRegisterMode ? "Email nội bộ của bạn" : "Tên tài khoản hoặc Email nội bộ"}
                    className="w-full h-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* TRƯỜNG MẬT KHẨU: NẾU ĐĂNG KÝ THÌ CHIA 2 CỘT (MẬT KHẨU & XÁC NHẬN MẬT KHẨU), NẾU ĐĂNG NHẬP THÌ 1 CỘT */}
              <div className={isRegisterMode ? "grid grid-cols-1 sm:grid-cols-2 gap-3.5" : "space-y-1.5"}>
                
                {/* TRƯỜNG: MẬT KHẨU */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {isRegisterMode ? 'Mật khẩu' : 'Mật khẩu'}
                    </label>
                    {!isRegisterMode && (
                      <button 
                        type="button"
                        onClick={() => {
                          setErrorMsg('');
                          setShowForgotPasswordModal(true);
                        }} 
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-semibold cursor-pointer"
                      >
                        Quên mật khẩu?
                      </button>
                    )}
                  </div>
                  
                  <div className="h-12 w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-800 border border-slate-200/90 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/50 transition-all flex items-center px-3.5 shadow-2xs">
                    <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isRegisterMode ? "Tạo mật khẩu" : "Nhập mật khẩu"}
                      className="w-full h-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors"
                      title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* TRƯỜNG: XÁC THỰC LẠI MẬT KHẨU (CHỈ DÀNH CHO ĐĂNG KÝ) */}
                {isRegisterMode && (
                  <div className="space-y-1.5 text-left animate-in fade-in duration-200">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Xác nhận lại mật khẩu
                    </label>
                    <div className="h-12 w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-800 border border-slate-200/90 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/50 transition-all flex items-center px-3.5 shadow-2xs">
                      <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu trùng khớp"
                        className="w-full h-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors"
                        title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* BẢNG CHÚ THÍCH TIÊU CHUẨN MẬT KHẨU AN TOÀN CHỐNG HACK (HIỆN KHI ĐĂNG KÝ) */}
              {isRegisterMode && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400 shrink-0" />
                      Yêu cầu mật khẩu an toàn chống hack:
                    </span>
                    {password && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPasswordStrong 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}>
                        {isPasswordStrong ? '✓ Đạt chuẩn an toàn' : 'Chưa đủ chuẩn'}
                      </span>
                    )}
                  </div>

                  {/* 4 Điều kiện trực quan (Checklist xanh lá khi thỏa mãn) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    <div className={`flex items-center space-x-1.5 transition-colors ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 transition-colors ${hasMinLength ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        {hasMinLength ? '✓' : '•'}
                      </span>
                      <span>Từ 8 ký tự trở lên</span>
                    </div>

                    <div className={`flex items-center space-x-1.5 transition-colors ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 transition-colors ${hasUppercase ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        {hasUppercase ? '✓' : '•'}
                      </span>
                      <span>Có chữ in hoa (A-Z)</span>
                    </div>

                    <div className={`flex items-center space-x-1.5 transition-colors ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 transition-colors ${hasNumber ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        {hasNumber ? '✓' : '•'}
                      </span>
                      <span>Có chữ số (0-9)</span>
                    </div>

                    <div className={`flex items-center space-x-1.5 transition-colors ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 transition-colors ${hasSpecial ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        {hasSpecial ? '✓' : '•'}
                      </span>
                      <span>Ký tự đặc biệt (@, !, #, $...)</span>
                    </div>
                  </div>

                  {/* Chú thích & Gợi ý ví dụ cụ thể */}
                  <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug">
                    💡 <span className="font-semibold text-slate-700 dark:text-slate-300">Gợi ý ví dụ:</span> <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">Rin@2026!</span> hoặc <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">SalesPro#88</span>
                  </div>
                </div>
              )}

              {/* Thông báo reCAPTCHA */}
              <div className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed text-left pt-0.5">
                Được bảo vệ bởi reCAPTCHA • Áp dụng{' '}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-slate-600 dark:text-slate-400 hover:underline font-medium"
                >
                  Quyền riêng tư
                </a>{' '}
                và{' '}
                <a 
                  href="https://policies.google.com/terms" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-slate-600 dark:text-slate-400 hover:underline font-medium"
                >
                  Điều khoản dịch vụ
                </a>.
              </div>

              {/* Nút Đăng nhập / Đăng ký */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2 tracking-wide"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <span>{isRegisterMode ? 'Tạo tài khoản học viên' : 'Đăng nhập vào hệ thống LMS'}</span>
                )}
              </button>

              {/* Dải phân cách "Hoặc" */}
              <div className="relative flex py-2 items-center my-1">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Hoặc tiếp tục với
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Nút Đăng nhập / Đăng ký Google Thật 100% */}
              <GoogleAuthButton 
                onSuccess={(user) => {
                  setSuccessMsg('Đăng nhập Google thành công! Đang chuyển hướng...');
                  setTimeout(() => {
                    onLoginSuccess(user);
                  }, 500);
                }}
                onError={(msg) => setErrorMsg(msg)}
                buttonText={isRegisterMode ? "Đăng ký nhanh bằng Google" : "Tiếp tục với Google"}
              />

            </form>

            {/* Dòng chân trang chuyển đổi: Chưa có tài khoản? Đăng ký */}
            <div className="mt-6 text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
              {isRegisterMode ? (
                <>
                  <span>Đã có tài khoản? </span>
                  <button 
                    onClick={() => {
                      setIsRegisterMode(false);
                      setErrorMsg('');
                    }}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Đăng nhập ngay
                  </button>
                </>
              ) : (
                <>
                  <span>Chưa có tài khoản? </span>
                  <button 
                    onClick={() => {
                      setIsRegisterMode(true);
                      setErrorMsg('');
                    }}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Đăng ký thành viên
                  </button>
                </>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* MODAL QUÊN MẬT KHẨU & OTP THẬT */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onPasswordResetSuccess={(resetUser) => {
          setShowForgotPasswordModal(false);
          if (resetUser) {
            setSuccessMsg('Đã đặt lại mật khẩu và tự động đăng nhập!');
            setTimeout(() => {
              onLoginSuccess(resetUser);
            }, 600);
          }
        }}
      />

    </div>
  );
}
