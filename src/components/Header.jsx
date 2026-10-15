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
  allPassed
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
            <div className="w-10 h-10 rounded-xl bg-[#007c5d] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">RIN</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-[#007c5d] font-bold border border-emerald-200">
                  TALENT LMS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Đào Tạo Bán Hàng Doanh Nghiệp</p>
            </div>
          </div>

          {/* Primary View Navigation Switcher (TalentLMS tabs) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-slate-100 text-[#007c5d]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-slate-100 text-[#007c5d]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Tổng quan học tập</span>
            </button>

            <button
              onClick={() => setCurrentView('player')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                currentView === 'player'
                  ? 'bg-slate-100 text-[#007c5d]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Phòng học 2 Cột</span>
            </button>
          </nav>

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

            {/* Admin Studio Button (TalentLMS Emerald Green) */}
            <button
              onClick={onOpenAdmin}
              title="Quản trị nội dung"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#007c5d] hover:bg-[#00634a] text-white shadow-xs transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quản trị</span>
            </button>

            {/* Student Avatar */}
            <div className="flex items-center pl-2 ml-1 border-l border-slate-200">
              <div 
                title="Học viên: Nguyễn Văn A"
                className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-bold text-[#007c5d] select-none"
              >
                NV
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
