import React from 'react';
import { 
  Search, 
  Settings, 
  LogOut,
  Play,
  Award,
  Trophy,
  BookOpen
} from 'lucide-react';

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
  onLogout
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand & Logo Monogram Badge (Đồng bộ 100% với Trang Chủ) */}
          <div className="flex items-center space-x-3 shrink-0">
            <div 
              onClick={() => setCurrentView('landing')} 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-1 flex items-center justify-center cursor-pointer select-none shadow-[0_2px_8px_rgba(15,23,42,0.22)] ring-1 ring-slate-800/80 hover:scale-105 transition-all"
              title="RMSA - Running Man Sales Academy"
            >
              <img 
                src="/images/running_man_logo.png" 
                alt="Running Man" 
                className="w-full h-full object-contain filter brightness-110 drop-shadow-xs" 
              />
            </div>

            <div 
              className="flex flex-col cursor-pointer select-none" 
              onClick={() => setCurrentView('landing')}
            >
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-black tracking-wider text-slate-900 leading-tight">RUNNING MAN</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200/70 uppercase tracking-wider">PRO</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">SALES ACADEMY</span>
            </div>

            {/* Minimalist Search Pill (Đồng bộ Trang Chủ) */}
            <div className="relative hidden xl:block w-48 ml-2">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
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
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-full text-slate-700 placeholder-slate-400 border border-slate-200/80 focus:border-blue-500 focus:outline-none transition-all font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Zone 2: Center Segmented Dock Tabs (Khoang tab con nhộng lọt lòng chuẩn 100% Trang Chủ) */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 border border-slate-200/70 p-1 rounded-full shadow-2xs space-x-1 shrink-0">
            <button
              onClick={() => setCurrentView('landing')}
              className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                currentView === 'landing'
                  ? 'font-bold text-slate-900 bg-white shadow-xs border border-slate-200/60'
                  : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                  ? 'font-bold text-slate-900 bg-white shadow-xs border border-slate-200/60'
                  : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50'
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
                  ? 'font-bold text-slate-900 bg-white shadow-xs border border-slate-200/60'
                  : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              title="Bảng tiến độ học viên"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentView === 'dashboard' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
              <span>Tiến độ cá nhân</span>
            </button>

            <button
              onClick={onOpenCheatsheet}
              className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all cursor-pointer"
              title="Sổ tay kịch bản bán hàng"
            >
              <span>Kịch bản & Cẩm nang</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all cursor-pointer"
              title="Bảng vàng thi đua nhân sự"
            >
              <span>Bảng xếp hạng</span>
            </button>

            {allPassed && (
              <button
                onClick={onOpenCertificate}
                className="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full font-bold text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-all cursor-pointer flex items-center space-x-1"
                title="Xem chứng chỉ tốt nghiệp"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Chứng nhận</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Actions & Identity Pill (Đồng bộ 100% Trang Chủ) */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Thẻ định danh theo vai trò & đặc quyền */}
            {userRole === 'pro_sales' ? (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50/90 hover:bg-blue-100/90 border border-blue-200/90 text-xs font-semibold text-blue-900 shrink-0 shadow-2xs transition-all">
                <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-300 animate-pulse shrink-0"></span>
                <span className="truncate max-w-[130px] font-bold text-blue-900 tracking-wide">
                  {userName || 'Chuyên Viên Sale'}
                </span>
                <span className="text-[9px] bg-blue-600 text-white font-extrabold px-1.5 py-0.5 rounded-full">PRO</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-100 border border-slate-200/90 text-xs font-semibold text-slate-800 shrink-0 shadow-2xs transition-all">
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200/80 animate-pulse shrink-0"></span>
                <span className="truncate max-w-[130px] font-bold text-slate-900 tracking-wide">
                  {userName || 'Học Viên Mới'}
                </span>
                <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded-full">Tân Binh</span>
              </div>
            )}

            {/* Nút Quản trị Studio (Đặc quyền riêng của Chuyên Viên Sale PRO) */}
            {userRole === 'pro_sales' && (
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
                className="px-3 py-1.5 rounded-full bg-rose-50/90 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold text-xs border border-rose-200/80 hover:border-rose-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 active:scale-95"
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
