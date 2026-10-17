import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  User, 
  Sparkles,
  Home,
  Check
} from 'lucide-react';

export default function MapStudyLoginPage({ 
  onBackToHome, 
  onLoginSuccess,
  initialMode = 'login'
}) {
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');

  useEffect(() => {
    setIsRegisterMode(initialMode === 'register');
  }, [initialMode]);
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
      const formattedName = (rawName.toLowerCase() === 'nhanvien' || rawName.toLowerCase() === 'nhan_vien') ? 'Nhân Viên' : (rawName.toLowerCase() === 'hocvien' ? 'Học Viên' : rawName);
      onLoginSuccess({
        name: formattedName,
        email: username,
        role: 'student'
      });
    }, 400);
  };

  const handleQuickLogin = (roleName, email) => {
    setUsername(email);
    setPassword('123456');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: roleName,
        email: email,
        role: 'student'
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-slate-900 selection:text-white relative overflow-x-hidden">
      
      {/* Background Soft Glow (tinh tế, tự nhiên, không gắt) */}
      <div 
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-teal-50/50 via-emerald-50/30 to-transparent rounded-full blur-3xl pointer-events-none -translate-x-1/4 -translate-y-1/4" 
      />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1440px] mx-auto px-6 h-15 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={onBackToHome}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1 group-hover:shadow-xs transition-all">
              <img 
                src="/images/running_man_logo.png" 
                alt="Running Man" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-black tracking-wider text-slate-900 leading-tight">RUNNING MAN</span>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">SALES ACADEMY</span>
            </div>
          </div>

          {/* Nút quay lại trang chủ */}
          <button
            onClick={onBackToHome}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay về Trang chủ</span>
          </button>

        </div>
      </header>

      {/* MAIN 2-COLUMN LAYOUT */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-8 sm:py-12 lg:py-16 flex items-center justify-center">
        
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* ========================================================================= */}
          {/* CỘT TRÁI (LEFT COLUMN): CHÀO MỪNG TRỞ LẠI & HÌNH ẢNH MINH HỌA             */}
          {/* ========================================================================= */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center border-r border-slate-200 pr-8 xl:pr-12 space-y-6">
            
            <div>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold tracking-wide uppercase mb-3 border border-slate-200/60">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Running Man Sales Academy</span>
              </span>
              <h1 className="text-3xl xl:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {isRegisterMode ? 'Đăng ký tài khoản' : 'Chào mừng trở lại'}
              </h1>
              <p className="text-xs xl:text-sm text-slate-500 mt-2 font-normal leading-relaxed">
                Học đúng bài phễu từ Huấn luyện viên Anh Rin — Làm chủ sản phẩm, tạo nguồn hàng thật và chốt cọc căn hộ cho thuê trong 15 phút.
              </p>
            </div>

            {/* Khung hình ảnh thực tế căn hộ + Anh Rin */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" 
                alt="Khóa học BĐS Running Man"
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/images/anh_rin_avatar.jpg" 
                    alt="Anh Rin" 
                    className="w-8 h-8 rounded-lg object-cover border border-amber-400"
                  />
                  <div>
                    <p className="text-xs font-bold leading-none">Huấn Luyện Viên Anh Rin</p>
                    <p className="text-[10px] text-sky-200 mt-0.5">8+ Năm vận hành chuỗi căn hộ mini & duplex</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 cam kết thực chiến */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>8 Nhóm năng lực môi giới căn hộ cho thuê thực chiến</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Giỏ hàng thật hơn 1.200 căn hộ dịch vụ, studio, duplex</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bộ kịch bản bẻ gãy từ chối giá 16k/ngày độc quyền</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* CỘT PHẢI (RIGHT COLUMN): FORM ĐĂNG NHẬP CHUẨN 100% MAPSTUDY               */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center max-w-md mx-auto w-full">
            
            <div className="w-full text-center space-y-2 mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
                {isRegisterMode ? 'Đăng ký thành viên' : 'Đăng nhập'}
              </h2>
              
              {/* Dòng ghi chú nguyên bản MapStudy: (Hệ thống Running Man và RMSA có thể sử dụng chung một tài khoản) */}
              <p className="text-xs text-slate-500 italic max-w-sm mx-auto leading-relaxed">
                (Hệ thống Running Man và RMSA có thể sử dụng chung một tài khoản để đăng nhập)
              </p>
            </div>

            {/* Error banner nếu có */}
            {errorMsg && (
              <div className="w-full mb-4 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center animate-shake">
                {errorMsg}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              
              {/* Nếu là Đăng ký: Thêm Họ và tên + Số điện thoại */}
              {isRegisterMode && (
                <>
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Họ và tên
                    </label>
                    <div className="h-12 w-full rounded-xl bg-[#F2F5F9] focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                      <input 
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nhập họ và tên của bạn"
                        className="w-full h-full bg-transparent px-4 text-xs sm:text-sm text-slate-800 placeholder-[#99AEBE] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Số điện thoại
                    </label>
                    <div className="h-12 w-full rounded-xl bg-[#F2F5F9] focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                      <input 
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="w-full h-full bg-transparent px-4 text-xs sm:text-sm text-slate-800 placeholder-[#99AEBE] focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* TRƯỜNG: TÊN TÀI KHOẢN (Chuẩn MapStudy: bg-[#F2F5F9], placeholder:text-[#99AEBE]) */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Tên tài khoản
                  </label>
                </div>
                <div className="h-12 w-full rounded-xl bg-[#F2F5F9] focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tên tài khoản hoặc Email"
                    className="w-full h-full bg-transparent px-4 text-xs sm:text-sm text-slate-800 placeholder-[#99AEBE] focus:outline-none"
                  />
                </div>
              </div>

              {/* TRƯỜNG: MẬT KHẨU (Có nút ẩn/hiện mắt như MapStudy) */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Mật khẩu
                  </label>
                  {!isRegisterMode && (
                    <a 
                      href="#forgot" 
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Vui lòng liên hệ Trợ giảng hoặc Anh Rin qua Zalo/Hotline để nhận mã đặt lại mật khẩu.');
                      }} 
                      className="text-xs text-slate-700 hover:text-slate-950 hover:underline font-medium"
                    >
                      Quên mật khẩu?
                    </a>
                  )}
                </div>
                
                <div className="h-12 w-full rounded-xl bg-[#F2F5F9] focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900 transition-all flex items-center pr-3">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    className="w-full h-full bg-transparent px-4 text-xs sm:text-sm text-slate-800 placeholder-[#99AEBE] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Thông báo reCAPTCHA chuẩn nguyên văn MapStudy */}
              <div className="text-[11px] text-slate-400 leading-relaxed text-left pt-1">
                Trang web này được bảo vệ bởi reCAPTCHA và{' '}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-slate-600 hover:underline font-medium"
                >
                  Chính sách quyền riêng tư
                </a>{' '}
                và{' '}
                <a 
                  href="https://policies.google.com/terms" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-slate-600 hover:underline font-medium"
                >
                  Điều khoản dịch vụ
                </a>{' '}
                của Google được áp dụng.
              </div>

              {/* Nút Đăng nhập / Đăng ký */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-sm shadow-[0_4px_18px_rgba(37,99,235,0.32)] hover:shadow-[0_6px_24px_rgba(79,70,229,0.45)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <span>{isRegisterMode ? 'Đăng ký tài khoản' : 'Đăng nhập'}</span>
                )}
              </button>

            </form>

            {/* Đăng nhập nhanh tài khoản mẫu cho nhân viên */}
            <div className="w-full mt-6 pt-5 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Đăng nhập nhanh (Tài khoản thử nghiệm):
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Học Viên Mới', 'hocvien@runningman.vn')}
                  className="p-2.5 rounded-xl bg-[#F2F5F9] hover:bg-slate-100 border border-slate-200/70 text-slate-700 hover:text-slate-950 font-medium text-left transition-colors cursor-pointer"
                >
                  <p className="font-bold">Học viên mới</p>
                  <p className="text-[10px] text-slate-400">hocvien@runningman.vn</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('Chuyên Viên Bán Hàng', 'nhanvien@runningman.vn')}
                  className="p-2.5 rounded-xl bg-[#F2F5F9] hover:bg-slate-100 border border-slate-200/70 text-slate-700 hover:text-slate-950 font-medium text-left transition-colors cursor-pointer"
                >
                  <p className="font-bold">Chuyên viên Sale</p>
                  <p className="text-[10px] text-slate-400">nhanvien@runningman.vn</p>
                </button>
              </div>
            </div>

            {/* Dòng chân trang chuyển đổi: Chưa có tài khoản? Đăng ký */}
            <div className="mt-6 text-xs text-slate-600">
              {isRegisterMode ? (
                <>
                  <span>Đã có tài khoản? </span>
                  <button 
                    onClick={() => {
                      setIsRegisterMode(false);
                      setErrorMsg('');
                    }}
                    className="font-bold text-slate-950 hover:underline cursor-pointer"
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
                    className="font-bold text-slate-950 hover:underline cursor-pointer"
                  >
                    Đăng ký
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
