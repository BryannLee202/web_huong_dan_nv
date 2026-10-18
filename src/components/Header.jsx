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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand & Logo Monogram Badge (Đồng bộ 100% với Trang Chủ) */}
          <div className="flex items-center space-x-3 shrink-0">
            <div 
              onClick={() => setCurrentView('landing')} 
              className="relative group/logo cursor-pointer select-none"
              title="RMSA - Running Man Sales Academy"
            >
              {/* Lớp hào quang hổ phách phía sau tạo độ sâu 3D */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 opacity-60 group-hover:opacity-100 blur-[3px] transition duration-300" />
              
              {/* Khung Biểu Tượng Kim Loại Sang Trọng */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-slate-950 via-[#0f172a] to-slate-900 p-1.5 flex items-center justify-center shadow-[0_4px_16px_rgba(245,158,11,0.22),0_2px_4px_rgba(0,0,0,0.15)] ring-1.5 ring-amber-400/50 border border-amber-300/40 group-hover:scale-105 transition-all duration-300">
                <img 
                  src="/images/running_man_logo.png" 
                  alt="Running Man" 
                  className="w-full h-full object-contain filter brightness-125 contrast-115 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" 
                />
              </div>
            </div>

            <div 
              className="flex flex-col cursor-pointer select-none" 
              onClick={() => setCurrentView('landing')}
            >
              <div className="flex items-center space-x-1.5">
                <span className="text-[15px] sm:text-base font-black tracking-wider text-slate-950 dark:text-white leading-none">
                  RUNNING MAN
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-xs border border-amber-400/40 uppercase tracking-widest leading-none">
                  PRO
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-[10px] font-black tracking-[0.2em] text-[#0d5cb6] dark:text-blue-400 uppercase leading-none">
                  SALES ACADEMY
                </span>
                <span className="w-1 h-1 rounded-full bg-amber-500 dark:bg-amber-400 inline-block"></span>
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
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-750 focus:bg-white dark:focus:bg-slate-800 rounded-full text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200/80 dark:border-slate-700 focus:border-blue-500 focus:outline-none transition-all font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Zone 2: Center Segmented Dock Tabs (Khoang tab con nhộng lọt lòng chuẩn 100% Trang Chủ) */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 p-1 rounded-full shadow-2xs space-x-1 shrink-0">
            <button
              onClick={() => setCurrentView('landing')}
              className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                currentView === 'landing'
                  ? 'font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-xs border border-slate-200/60 dark:border-slate-700'
                  : 'font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-750'
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
                  ? 'font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-xs border border-slate-200/60 dark:border-slate-700'
                  : 'font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-750'
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
                  ? 'font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-xs border border-slate-200/60 dark:border-slate-700'
                  : 'font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-750'
              }`}
              title="Bảng tiến độ học viên"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentView === 'dashboard' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
              <span>Tiến độ cá nhân</span>
            </button>

            <button
              onClick={onOpenCheatsheet}
              className="hidden xl:inline-block shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-750 transition-all cursor-pointer"
              title="Sổ tay kịch bản bán hàng"
            >
              <span>Kịch bản & Cẩm nang</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="hidden 2xl:inline-block shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-750 transition-all cursor-pointer"
              title="Bảng vàng thi đua nhân sự"
            >
              <span>Bảng xếp hạng</span>
            </button>

            {allPassed && (
              <button
                onClick={onOpenCertificate}
                className="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full font-bold text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800 transition-all cursor-pointer flex items-center space-x-1"
                title="Xem chứng chỉ tốt nghiệp"
              >
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Chứng nhận</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Actions & Identity Pill (Đồng bộ 100% Trang Chủ) */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Nút Chuyển Đổi Chế Độ Ngày & Đêm */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {/* Thẻ định danh theo vai trò & đặc quyền */}
            {userRole === 'pro_sales' ? (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50/90 hover:bg-blue-100/90 dark:bg-blue-950/80 dark:hover:bg-blue-900/80 border border-blue-200/90 dark:border-blue-800 text-xs font-semibold text-blue-900 dark:text-blue-200 shrink-0 shadow-2xs transition-all">
                <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-300 dark:ring-blue-700 animate-pulse shrink-0"></span>
                <span className="truncate max-w-[130px] font-bold text-blue-900 dark:text-blue-100 tracking-wide">
                  {userName || 'Chuyên Viên Sale'}
                </span>
                <span className="text-[9px] bg-blue-600 text-white font-extrabold px-1.5 py-0.5 rounded-full">PRO</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-100 dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0 shadow-2xs transition-all">
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200/80 dark:ring-emerald-800 animate-pulse shrink-0"></span>
                <span className="truncate max-w-[130px] font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                  {userName || 'Học Viên Mới'}
                </span>
                <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded-full">Tân Binh</span>
              </div>
            )}

            {/* Nút Quản trị Studio (Đặc quyền của Quản trị viên / Chuyên viên) */}
            {(userRole === 'pro_sales' || userRole === 'admin') && (
              <button
                onClick={onOpenAdmin}
                title="Quản trị hệ thống đào tạo (Đặc quyền Chuyên viên)"
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
                className="px-3 py-1.5 rounded-full bg-rose-50/90 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-rose-200 font-bold text-xs border border-rose-200/80 dark:border-rose-900/60 hover:border-rose-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 active:scale-95"
                title="Đăng xuất khỏi tài khoản"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Đăng xuất</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
