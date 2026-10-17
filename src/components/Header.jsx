import React from 'react';
import { 
  GraduationCap, 
  Search, 
  FileText, 
  Trophy, 
  Award, 
  Settings, 
  Home, 
  LayoutDashboard, 
  PlayCircle,
  Sparkles
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
  onLogout
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentView('landing')} 
            className="flex items-center space-x-3 cursor-pointer select-none"
          >
            <div className="h-10 w-auto rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-0.5 overflow-hidden">
              <img 
                src="/images/running_man_logo.png" 
                alt="Running Man" 
                className="h-9 w-auto object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-black tracking-tight text-slate-900">RMSA</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                  Running Man Sales Academy
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block uppercase tracking-wider font-semibold">Every Journey Leads Home • Đan Rin</p>
            </div>
          </div>

          {/* Primary View Navigation Switcher */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-emerald-50 text-[#007c5d] border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </button>

            <button
              onClick={() => setCurrentView('player')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                currentView === 'player'
                  ? 'bg-emerald-50 text-[#007c5d] border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Vào học & Thi</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-emerald-50 text-[#007c5d] border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Tiến độ cá nhân</span>
            </button>
          </nav>

          {/* RIN-ID Engine Quick Lookup Bar */}
          <div className="relative hidden md:block w-48 lg:w-60">
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
              placeholder="Tra mã ID (vd: RIN-01)..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007c5d] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2">
            
            {/* Sales Cheatsheet Button */}
            <button
              onClick={onOpenCheatsheet}
              title="Kịch bản tra cứu nhanh"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Kịch bản Sale</span>
            </button>

            {/* Leaderboard Button */}
            <button
              onClick={onOpenLeaderboard}
              title="Bảng xếp hạng thi đua"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Bảng xếp hạng</span>
            </button>

            {/* Certificate Button */}
            <button
              onClick={onOpenCertificate}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                allPassed
                  ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                  : 'text-slate-500 bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Award className={`w-3.5 h-3.5 ${allPassed ? 'text-amber-600' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Chứng nhận</span>
            </button>

            {/* Admin Studio Button */}
            <button
              onClick={onOpenAdmin}
              title="Quản trị nội dung"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white shadow-[0_2px_10px_rgba(37,99,235,0.3)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quản trị</span>
            </button>

            {/* Student Avatar & Logout */}
            <div className="flex items-center pl-2 ml-1 border-l border-slate-200 space-x-1.5">
              <div 
                title={`Học viên: ${userName || 'Nguyễn Văn A'}`}
                className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-bold text-[#007c5d] select-none"
              >
                NV
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Đăng xuất về trang giới thiệu Mapstudy"
                  className="hidden sm:inline-block text-[11px] font-bold text-slate-500 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Đăng xuất
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
