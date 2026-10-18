import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Settings, 
  LogOut,
  Award,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Home
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({ 
  currentView, 
  setCurrentView,
  searchQuery, 
  setSearchQuery, 
  onOpenCheatsheet, 
  onOpenAdmin, 
  onOpenCertificate, 
  onOpenLeaderboard,
  onOpenPracticeTest,
  onNavigateLanding,
  allPassed,
  courses,
  onSelectLesson,
  userName,
  userRole = 'student',
  currentUser = null,
  onLogout,
  theme = 'light',
  onToggleTheme
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Phân quyền Quản trị viên chuẩn xác: admin role hoặc email/username/tên admin
  const isAdminUser = userRole === 'admin' || 
    currentUser?.role === 'admin' || 
    currentUser?.email === 'admin@runningman.vn' ||
    (currentUser?.email && currentUser.email.toLowerCase().includes('admin')) ||
    (currentUser?.username && currentUser.username.toLowerCase().includes('admin')) ||
    (currentUser?.name && (currentUser.name.toLowerCase().includes('admin') || currentUser.name.toLowerCase().includes('quản trị')));

  // Chuẩn hóa tên hiển thị trang trọng, loại bỏ chức danh thừa
  const formatStudentName = (name) => {
    if (!name) return 'Nhân viên';
    const clean = String(name).trim();
    const lower = clean.toLowerCase();
    if (lower === 'nhanvien' || lower === 'nhan vien' || lower === 'nhan_vien' || lower.startsWith('nhanvien@')) {
      return 'Nhân viên';
    }
    if (lower === 'hocvien' || lower === 'hoc vien' || lower === 'hoc_vien' || lower.startsWith('hocvien@')) {
      return 'Học viên';
    }
    if (lower === 'admin' || lower.startsWith('admin@')) {
      return 'Quản Trị Viên';
    }
    return clean;
  };

  const displayName = formatStudentName(currentUser?.name || userName);
  const displayEmail = currentUser?.email || currentUser?.username || 'nhanvien@runningman.vn';
  const avatarUrl = currentUser?.avatarUrl || currentUser?.avatar_url;
  const initialChar = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#141414]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand & Logo Lockup - Sang Trọng, Tinh Tế, Liền Mạch Hoàn Hảo */}
          <div className="flex items-center space-x-3 shrink-0">
            <div 
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 cursor-pointer select-none group/brand"
              title="RMSA - Running Man Sales Academy"
            >
              {/* Bệ Đỡ Trang Sức Than Chì Tôn Vinh Biểu Tượng Kim Loại Bạc RM */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 dark:bg-slate-900 border border-slate-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center p-1.5 transition-transform duration-200 group-hover/brand:scale-105 shrink-0">
                <img 
                  src="/images/running_man_logo.png" 
                  alt="Running Man" 
                  className="w-full h-full object-contain filter brightness-110 drop-shadow-[0_1px_3px_rgba(255,255,255,0.2)]" 
                />
              </div>

              {/* Vạch ngăn tinh tế phong cách kiến trúc */}
              <div className="h-6 w-px bg-slate-200 dark:bg-white/[0.12] hidden sm:block shrink-0" />

              {/* Typography thương hiệu sắc nét */}
              <div className="flex flex-col">
                <span className="text-[14px] sm:text-[15px] font-black tracking-wider text-slate-900 dark:text-white leading-none">
                  RUNNING MAN
                </span>
                <span className="text-[9.5px] font-extrabold tracking-[0.22em] text-[#0d5cb6] dark:text-blue-400 uppercase leading-none mt-1">
                  SALES ACADEMY
                </span>
              </div>
            </div>

            {/* Minimalist Search Pill (Đồng bộ Trang Chủ) */}
            <div className="relative hidden xl:block w-36 2xl:w-44 ml-2">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (searchQuery || '').trim().toLowerCase();
                    if (!val) return;
                    const found = courses?.find((c, idx) => {
                      const rinId = (c.rinCode || `RIN-0${idx + 1}`).toLowerCase();
                      const altId = `rin-${idx + 1}`;
                      return rinId === val || altId === val || c.id.toLowerCase() === val || c.title.toLowerCase().includes(val);
                    });
                    if (found && onSelectLesson) {
                      onSelectLesson(found.id);
                    }
                  }
                }}
                placeholder="Tìm chuyên đề, bài phễu..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 dark:bg-white/[0.06] dark:hover:bg-white/[0.09] focus:bg-white dark:focus:bg-[#1a1a1a] rounded-full text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200/80 dark:border-white/[0.08] focus:border-blue-500 focus:outline-none transition-all font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Zone 2: Center Segmented Dock Tabs (Khoang tab cao cấp ĐỒNG BỘ 100% Trang Chủ) */}
          <nav className="hidden lg:flex items-center bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] p-1 rounded-full shadow-2xs space-x-1 shrink-0 backdrop-blur-sm">
            <button
              onClick={() => onNavigateLanding ? onNavigateLanding('home') : setCurrentView('landing')}
              className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all cursor-pointer flex items-center space-x-1.5"
              title="Về Trang chủ RMSA"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
              <span>Trang chủ</span>
            </button>

            {/* Chức năng Vào học & Thi (Active trên trang này) */}
            <button
              onClick={() => setCurrentView('player')}
              className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                currentView === 'player'
                  ? 'font-bold text-slate-950 dark:text-white bg-white dark:bg-[#252525] shadow-xs border border-slate-200/60 dark:border-white/[0.1]'
                  : 'font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05]'
              }`}
              title="Phòng học & Sát hạch 8 chuyên đề thực chiến"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentView === 'player' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
              <span>Vào học & Thi</span>
            </button>

            <button
              onClick={() => onNavigateLanding ? onNavigateLanding('courses') : setCurrentView('landing')}
              className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all cursor-pointer flex items-center space-x-1.5"
              title="Khóa đào tạo & Giảng viên Đan Rin"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
              <span>Khóa đào tạo</span>
            </button>

            <button
              onClick={() => onOpenPracticeTest ? onOpenPracticeTest() : null}
              className="hidden xl:inline-flex shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all cursor-pointer items-center space-x-1.5"
              title="Phòng thi sát hạch trực tuyến"
            >
              <span>Phòng thi sát hạch</span>
            </button>

            <button
              onClick={() => onNavigateLanding ? onNavigateLanding('community') : setCurrentView('landing')}
              className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all cursor-pointer flex items-center space-x-1.5"
              title="Cộng đồng thảo luận"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
              <span>Cộng đồng</span>
            </button>

            <button
              onClick={onOpenCheatsheet}
              className="hidden 2xl:inline-flex shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all cursor-pointer items-center space-x-1.5"
              title="Sổ tay kịch bản bán hàng"
            >
              <span>Kịch bản & Cẩm nang</span>
            </button>

            {allPassed && (
              <button
                onClick={onOpenCertificate}
                className="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full font-bold text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/30 border border-amber-200/80 dark:border-amber-400/30 transition-all cursor-pointer flex items-center space-x-1"
                title="Xem chứng chỉ tốt nghiệp"
              >
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Chứng nhận</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Actions & Synchronized Profile Pill with Dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Nút Chuyển Đổi Chế Độ Ngày & Đêm */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {/* Nút Quản trị Studio trực tiếp (Đặc quyền Quản trị viên trên màn hình lớn) */}
            {isAdminUser && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                title="Quản trị hệ thống đào tạo (Đặc quyền Quản trị viên)"
                className="hidden xl:flex px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer items-center space-x-1.5 shrink-0 whitespace-nowrap"
              >
                <Settings className="w-3.5 h-3.5 text-blue-100 shrink-0" />
                <span className="shrink-0">Quản trị</span>
              </button>
            )}

            {/* Profile Dropdown Menu Trigger - ĐỒNG BỘ 100% VỚI TRANG CHỦ */}
            <div className="relative shrink-0" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(prev => !prev)}
                className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] border border-slate-200/80 dark:border-white/[0.08] text-xs font-bold text-slate-800 dark:text-slate-100 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0 whitespace-nowrap"
                title="Mở hồ sơ cá nhân và cài đặt"
              >
                {/* Avatar / Chữ cái đại diện */}
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName} 
                    className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full object-cover shrink-0 ring-1.5 ring-blue-500/30" 
                  />
                ) : (
                  <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-[10px] flex items-center justify-center shadow-2xs shrink-0 ring-1.5 ring-white dark:ring-slate-800">
                    {initialChar}
                  </div>
                )}

                {/* Chấm trạng thái trực tuyến */}
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-700 animate-pulse shrink-0"></span>

                {/* Tên hiển thị */}
                <span className="truncate max-w-[90px] sm:max-w-[120px] font-bold text-slate-900 dark:text-white">
                  {displayName}
                </span>

                {/* Huy hiệu vai trò */}
                {isAdminUser ? (
                  <span className="hidden sm:inline-flex text-[9px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full shrink-0">
                    ADMIN
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex text-[9px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded-full shrink-0">
                    Nhân viên
                  </span>
                )}

                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 shrink-0 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Bảng Dropdown Thông Tin Cá Nhân & Quyền Hạn */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200/90 dark:border-white/[0.12] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                  {/* Khối danh tính tài khoản */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] flex items-center space-x-3">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt={displayName} 
                        className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-blue-500/40" 
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0 ring-2 ring-white dark:ring-slate-800">
                        {initialChar}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-slate-900 dark:text-white text-sm truncate">
                          {displayName}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate" title={displayEmail}>
                        {displayEmail}
                      </p>
                      <div className="mt-1">
                        {isAdminUser ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            <ShieldCheck className="w-3 h-3 text-amber-500 shrink-0" />
                            Quản Trị Viên
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            Nhân viên
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Danh mục điều hướng tiện ích */}
                  <div className="space-y-1 text-xs">
                    {isAdminUser && onOpenAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-amber-900 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-500/15 hover:bg-amber-100 dark:hover:bg-amber-500/25 border border-amber-200 dark:border-amber-500/30 font-bold transition-all cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Bảng Quản Trị Hệ Thống</span>
                        </div>
                        <span className="text-[9px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-full shrink-0">ADMIN</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onNavigateLanding) onNavigateLanding('home');
                        else setCurrentView('landing');
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] font-medium transition-all cursor-pointer"
                    >
                      <Home className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Trang chủ học viện</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setCurrentView('dashboard');
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] font-medium transition-all cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Bảng tiến độ cá nhân</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onOpenCheatsheet) onOpenCheatsheet();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] font-medium transition-all cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Sổ tay kịch bản & Cẩm nang</span>
                    </button>

                    {onOpenLeaderboard && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenLeaderboard();
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] font-medium transition-all cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Bảng vàng xếp hạng thi đua</span>
                      </button>
                    )}

                    {allPassed && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          if (onOpenCertificate) onOpenCertificate();
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-amber-700 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 font-bold transition-all cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Xem chứng chỉ tốt nghiệp</span>
                      </button>
                    )}
                  </div>

                  {/* Nút Đăng xuất trang nhã bên trong Menu */}
                  {onLogout && (
                    <div className="pt-2 border-t border-slate-200/80 dark:border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-500/30 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
                      >
                        <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Đăng xuất khỏi tài khoản</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
