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
    <header className="sticky top-0 z-40 w-full bg-[#0e2722]/95 dark:bg-[#091a16]/95 backdrop-blur-md border-b border-emerald-500/15 shadow-[0_4px_24px_rgba(10,38,32,0.18)] transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand & Logo Lockup - Xanh Bạc Hà Sẫm Tôn Vinh Kim Loại Bạc RM */}
          <div className="flex items-center space-x-3 shrink-0">
            <div 
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 cursor-pointer select-none group/brand"
              title="RMSA - Running Man Sales Academy"
            >
              {/* Biểu tượng "RM" Kim loại Bạc trong suốt nguyên bản - Nổi bật trên nền ngọc bích sẫm */}
              <div className="h-11 sm:h-12 flex items-center justify-center transition-transform duration-200 group-hover/brand:scale-105 shrink-0">
                <img 
                  src="/images/running_man_logo.png" 
                  alt="Running Man" 
                  className="h-10 sm:h-11 w-auto max-w-[58px] sm:max-w-[66px] object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] filter brightness-105" 
                />
              </div>

              {/* Vạch ngăn tinh tế phong cách kiến trúc */}
              <div className="h-7 w-px bg-emerald-500/25 hidden sm:block shrink-0" />

              {/* Typography thương hiệu sắc nét */}
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[14px] sm:text-[15px] font-black tracking-wider text-white leading-none">
                    RUNNING MAN
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8.5px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest leading-none shadow-2xs">
                    PRO
                  </span>
                </div>
                <span className="text-[9.5px] font-extrabold tracking-[0.22em] text-emerald-300 uppercase leading-none mt-1">
                  SALES ACADEMY
                </span>
              </div>
            </div>

            {/* Minimalist Search Pill (Đồng bộ Trang Chủ) */}
            <div className="relative hidden xl:block w-48 ml-2">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-emerald-200/60">
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
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-emerald-950/40 hover:bg-emerald-950/60 focus:bg-emerald-950/80 rounded-full text-white placeholder-emerald-200/50 border border-emerald-500/20 focus:border-emerald-400 focus:outline-none transition-all font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-emerald-300/70 hover:text-white text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Zone 2: Center Segmented Dock Tabs (Khoang tab cao cấp lọt lòng chuẩn 100% Trang Chủ) */}
          <nav className="hidden lg:flex items-center bg-emerald-950/40 border border-emerald-500/20 p-1 rounded-full shadow-inner space-x-1 shrink-0 backdrop-blur-sm">
            <button
              onClick={() => setCurrentView('landing')}
              className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                currentView === 'landing'
                  ? 'font-bold text-slate-950 bg-white shadow-md'
                  : 'font-semibold text-emerald-100/75 hover:text-white hover:bg-emerald-500/15'
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
                  ? 'font-bold text-slate-950 bg-white shadow-md'
                  : 'font-semibold text-emerald-100/75 hover:text-white hover:bg-emerald-500/15'
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
                  ? 'font-bold text-slate-950 bg-white shadow-md'
                  : 'font-semibold text-emerald-100/75 hover:text-white hover:bg-emerald-500/15'
              }`}
              title="Bảng tiến độ học viên"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentView === 'dashboard' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
              <span>Tiến độ cá nhân</span>
            </button>

            <button
              onClick={onOpenCheatsheet}
              className="hidden xl:inline-block shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-emerald-100/75 hover:text-white hover:bg-emerald-500/15 transition-all cursor-pointer"
              title="Sổ tay kịch bản bán hàng"
            >
              <span>Kịch bản & Cẩm nang</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="hidden 2xl:inline-block shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-emerald-100/75 hover:text-white hover:bg-emerald-500/15 transition-all cursor-pointer"
              title="Bảng vàng thi đua nhân sự"
            >
              <span>Bảng xếp hạng</span>
            </button>

            {allPassed && (
              <button
                onClick={onOpenCertificate}
                className="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full font-bold text-xs text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 transition-all cursor-pointer flex items-center space-x-1"
                title="Xem chứng chỉ tốt nghiệp"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Chứng nhận</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Actions & Identity Pill (Đồng bộ nút Xanh Dương 100% Trang Chủ) */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Nút Chuyển Đổi Chế Độ Ngày & Đêm */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {/* Thẻ định danh theo vai trò & đặc quyền */}
            {userRole === 'pro_sales' ? (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-600/25 hover:bg-blue-600/35 border border-blue-400/30 text-xs font-semibold text-blue-200 shrink-0 shadow-2xs transition-all">
                <span className="w-2 h-2 rounded-full bg-blue-400 ring-2 ring-blue-400/40 animate-pulse shrink-0"></span>
                <span className="truncate max-w-[130px] font-bold text-white tracking-wide">
                  {userName || 'Chuyên Viên Sale'}
                </span>
                <span className="text-[9px] bg-blue-600 text-white font-extrabold px-1.5 py-0.5 rounded-full">PRO</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/20 text-xs font-semibold text-slate-200 shrink-0 shadow-2xs transition-all">
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40 animate-pulse shrink-0"></span>
                <span className="truncate max-w-[130px] font-bold text-white tracking-wide">
                  {userName || 'Học Viên Mới'}
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full">Tân Binh</span>
              </div>
            )}

            {/* Nút Quản trị Studio (Đặc quyền của Quản trị viên / Chuyên viên) */}
            {(userRole === 'pro_sales' || userRole === 'admin') && (
              <button
                onClick={onOpenAdmin}
                title="Quản trị hệ thống đào tạo (Đặc quyền Chuyên viên)"
                className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
              >
                <Settings className="w-3.5 h-3.5 text-blue-100" />
                <span className="hidden md:inline">Quản trị</span>
              </button>
            )}

            {/* Nút Đăng xuất đàng hoàng, rõ ràng */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/30 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 active:scale-95"
                title="Đăng xuất khỏi tài khoản"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Đăng xuất</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
