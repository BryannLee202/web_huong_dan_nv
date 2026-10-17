import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Lock, 
  User, 
  BadgeCheck, 
  Phone 
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

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

  const [username, setUsername] = useState('nhanvien@runningman.vn');
  const [password, setPassword] = useState('123456');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập Tên tài khoản');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập Mật khẩu');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const rawName = isRegisterMode && fullName ? fullName : (username.includes('@') ? username.split('@')[0] : username);
      const formattedName = (rawName.toLowerCase() === 'nhanvien' || rawName.toLowerCase() === 'nhan_vien') ? 'Chuyên Viên Sale' : (rawName.toLowerCase() === 'hocvien' ? 'Học Viên Mới' : rawName);
      const userRole = (username.toLowerCase().includes('nhanvien') || username.toLowerCase().includes('admin') || rawName.toLowerCase().includes('sale')) ? 'pro_sales' : 'student';
      onLoginSuccess({
        name: formattedName,
        email: username,
        role: userRole
      });
    }, 400);
  };

  const handleQuickLogin = (roleName, email, role = 'student') => {
    setUsername(email);
    setPassword('123456');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: roleName,
        email: email,
        role: role
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-slate-900 dark:selection:bg-blue-600 selection:text-white relative overflow-x-hidden transition-colors duration-200">
      
      {/* Background Soft Glows & Tech Grid Lines */}
      <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-gradient-to-br from-blue-100/60 via-indigo-50/40 to-transparent dark:from-blue-900/20 dark:via-indigo-950/10 rounded-full blur-3xl pointer-events-none -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-sky-100/50 via-teal-50/30 to-transparent dark:from-sky-900/20 dark:via-teal-950/10 rounded-full blur-3xl pointer-events-none translate-x-1/4 translate-y-1/4" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors duration-200">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={onBackToHome}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center p-1 group-hover:shadow-xs group-hover:scale-105 transition-all">
              <img 
                src="/images/running_man_logo.png" 
                alt="Running Man" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-[13px] font-black tracking-wider text-slate-900 dark:text-white leading-tight">RUNNING MAN</span>
                <span className="text-[9px] font-extrabold bg-blue-600 text-white px-1.5 py-0.2 rounded-full tracking-wide">PRO</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">SALES ACADEMY</span>
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
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-[#fbfcfd] via-[#f4f7fb] to-[#e9f0f8] dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 text-slate-900 dark:text-slate-100 p-8 sm:p-9 flex-col justify-between relative overflow-hidden border-r border-slate-200/80 dark:border-slate-800">
            
            {/* Subtle Architectural Blueprint Grid Pattern & Soft Light Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_0.8px,transparent_0.8px)] [background-size:18px_18px] opacity-40 dark:opacity-20 pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-200/25 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-200/25 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Branding & Headline */}
            <div className="relative z-10 space-y-3">
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
            <div className="relative z-10 my-4">
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
                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
                      Thực Chiến
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 3 Editorial Value Cards (Đã xóa bỏ hoàn toàn icon / khối vuông màu) */}
            <div className="relative z-10 space-y-2.5">
              
              {/* Feature 1: Giỏ hàng */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 border-l-4 border-l-blue-600 shadow-2xs hover:shadow-xs transition-all">
                <div className="min-w-0 pr-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Nguồn Hàng Căn Hộ Thật</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Duplex, studio & mini khảo sát thực tế có sẵn</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
                  1.200+ Căn
                </span>
              </div>

              {/* Feature 2: Kịch bản */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 border-l-4 border-l-amber-500 shadow-2xs hover:shadow-xs transition-all">
                <div className="min-w-0 pr-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Kịch Bản Bẻ Gãy Từ Chối</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Chi phí 16k/ngày — Độc quyền chốt cọc trong 15 phút</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800">
                  16k / Ngày
                </span>
              </div>

              {/* Feature 3: Chuẩn hóa */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-xs transition-all">
                <div className="min-w-0 pr-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">8 Nhóm Năng Lực Chuẩn Hóa</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Sát hạch thực chiến & bảo chứng chứng chỉ nội bộ</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                  Sát Hạch
                </span>
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

            {/* FORM */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              
              {/* Nếu là Đăng ký: Thêm Họ và tên + Số điện thoại */}
              {isRegisterMode && (
                <>
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
                        placeholder="Nhập họ và tên của bạn"
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
                </>
              )}

              {/* TRƯỜNG: TÊN TÀI KHOẢN */}
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
                    placeholder="Tên tài khoản hoặc Email nội bộ"
                    className="w-full h-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* TRƯỜNG: MẬT KHẨU */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mật khẩu
                  </label>
                  {!isRegisterMode && (
                    <a 
                      href="#forgot" 
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Vui lòng liên hệ Đan Rin hoặc Trợ giảng qua Zalo để cấp lại mật khẩu.');
                      }} 
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-semibold"
                    >
                      Quên mật khẩu?
                    </a>
                  )}
                </div>
                
                <div className="h-12 w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800 focus-within:bg-white dark:focus-within:bg-slate-800 border border-slate-200/90 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/50 transition-all flex items-center px-3.5 shadow-2xs">
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full h-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

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

            </form>

            {/* Đăng nhập nhanh theo phân quyền chức năng */}
            <div className="w-full mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Đăng nhập nhanh theo vai trò:
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900">
                  Phân Quyền Riêng Biệt
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* VAI TRÒ 1: HỌC VIÊN MỚI (TÂN BINH) */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Học Viên Mới', 'hocvien@runningman.vn', 'student')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-500 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 text-xs">Học viên mới</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-sky-100 dark:group-hover:bg-sky-950 group-hover:text-sky-800 dark:group-hover:text-sky-300">Tân Binh</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-1.5 font-mono">hocvien@runningman.vn</p>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug space-y-0.5 border-t border-slate-200/60 dark:border-slate-700/60 pt-1.5">
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                      • Lộ trình khóa tuần tự chuẩn
                    </p>
                    <p className="text-slate-400 dark:text-slate-500">
                      • Đạt ≥80% để mở khóa bài tiếp
                    </p>
                  </div>
                </button>

                {/* VAI TRÒ 2: CHUYÊN VIÊN SALE (PRO SALES) */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Chuyên Viên Sale', 'nhanvien@runningman.vn', 'pro_sales')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 text-xs">Chuyên viên Sale</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">👑 PRO</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-1.5 font-mono">nhanvien@runningman.vn</p>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug space-y-0.5 border-t border-slate-200/60 dark:border-slate-700/60 pt-1.5">
                    <p className="text-blue-700 dark:text-blue-400 font-bold">
                      • Mở khóa toàn bộ 8 chuyên đề
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      • Toàn quyền Quản trị & Xuất CSV
                    </p>
                  </div>
                </button>
              </div>
            </div>

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

    </div>
  );
}
