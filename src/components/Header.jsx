import React from 'react';
import { 
  Search, 
  Settings, 
  LogOut,
  Award
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
  allPassed,
  courses,
  onSelectLesson,
  userName,
  userRole = 'student',
  onLogout,
  theme = 'light',
  onToggleTheme
}) {
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
            <div className="relative hidden xl:block w-48 ml-2">
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

          {/* Zone 2: Center Segmented Dock Tabs (Khoang tab cao cấp lọt lòng chuẩn 100% Trang Chủ) */}
          <nav className="hidden lg:flex items-center bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] p-1 rounded-full shadow-2xs space-x-1 shrink-0 backdrop-blur-sm">
            <button
              onClick={() => setCurrentView('landing')}
              className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                currentView === 'landing'
                  ? 'font-bold text-slate-950 dark:text-white bg-white dark:bg-[#252525] shadow-xs border border-slate-200/60 dark:border-white/[0.1]'
                  : 'font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05]'
              }`}
              title="Về Trang chủ"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentView === 'landing' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
              <span>Trang chủ</span>
            </button>

            <button
              onClick={() => setCurrentView('player')}
              className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                currentView === 'player'
                  ? 'font-bold text-slate-950 dark:text-white bg-white dark:bg-[#252525] shadow-xs border border-slate-200/60 dark:border-white/[0.1]'
                  : 'font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05]'
              }`}
              title="Phòng học & Sát hạch"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentView === 'player' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
              <span>Vào học & Thi</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                currentView === 'dashboard'
                  ? 'font-bold text-slate-950 dark:text-white bg-white dark:bg-[#252525] shadow-xs border border-slate-200/60 dark:border-white/[0.1]'
                  : 'font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05]'
              }`}
              title="Bảng tiến độ học viên"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentView === 'dashboard' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
              <span>Tiến độ cá nhân</span>
            </button>

            <button
              onClick={onOpenCheatsheet}
              className="hidden xl:inline-block shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all cursor-pointer"
              title="Sổ tay kịch bản bán hàng"
            >
              <span>Kịch bản & Cẩm nang</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="hidden 2xl:inline-block shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all cursor-pointer"
              title="Bảng vàng thi đua nhân sự"
            >
              <span>Bảng xếp hạng</span>
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

          {/* Zone 3: Actions & Identity Pill (Đồng bộ nút Xanh Dương 100% Trang Chủ) */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Nút Chuyển Đổi Chế Độ Ngày & Đêm */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {/* Thẻ định danh theo vai trò: Quản Trị Viên hoặc Nhân viên */}
            {userRole === 'admin' ? (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/15 hover:bg-amber-100 dark:hover:bg-amber-500/25 border border-amber-300 dark:border-amber-500/30 text-xs font-semibold text-amber-900 dark:text-amber-200 shrink-0 shadow-2xs transition-all">
                <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-300 dark:ring-amber-400/40 animate-pulse shrink-0"></span>
                <span className="truncate max-w-[130px] font-bold text-amber-900 dark:text-amber-200 tracking-wide">
                  {userName || 'Quản Trị Viên'}
                </span>
                <span className="text-[9px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-full">ADMIN</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] border border-slate-200/80 dark:border-white/[0.08] text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0 shadow-2xs transition-all">
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-400/40 animate-pulse shrink-0"></span>
                <span className="truncate max-w-[130px] font-bold text-slate-900 dark:text-white tracking-wide">
                  {userName || 'Nhân viên'}
                </span>
                <span className="text-[9px] bg-slate-200 dark:bg-white/15 text-slate-700 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded-full">Nhân viên</span>
              </div>
            )}

            {/* Nút Quản trị Studio (Đặc quyền Quản trị viên) */}
            {userRole === 'admin' && (
              <button
                onClick={onOpenAdmin}
                title="Quản trị hệ thống đào tạo (Đặc quyền Quản trị viên)"
                className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
              >
                <Settings className="w-3.5 h-3.5 text-blue-100" />
                <span className="hidden md:inline">Quản trị</span>
              </button>
            )}

            {/* Nút Đăng xuất đàng hoàng, rõ ràng */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white font-bold text-xs border border-rose-200 dark:border-rose-500/30 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 active:scale-95"
                title="Đăng xuất khỏi tài khoản"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
                <span>Đăng xuất</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
