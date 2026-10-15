import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Settings, 
  Search, 
  FileText, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  onOpenCheatsheet, 
  onOpenAdmin, 
  onOpenCertificate, 
  onOpenLeaderboard,
  allPassed,
  adminMode,
  setAdminMode
}) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/30 text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">RIN</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  LMS SALES
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Học viện Đào tạo Kỹ năng Bán hàng Thực chiến</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm bài học, kịch bản..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-800/80 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Sales Cheatsheet Button */}
            <button
              onClick={onOpenCheatsheet}
              title="Kịch bản tra cứu nhanh"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:border-slate-600"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Kịch bản Sale</span>
            </button>

            {/* Leaderboard Button */}
            <button
              onClick={onOpenLeaderboard}
              title="Bảng vinh danh"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:border-slate-600"
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="hidden sm:inline">Bảng xếp hạng</span>
            </button>

            {/* Certificate Button */}
            <button
              onClick={onOpenCertificate}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
                allPassed
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold border-amber-300 shadow-lg shadow-amber-500/20 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
              }`}
            >
              <Award className={`w-4 h-4 ${allPassed ? 'text-slate-950' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Chứng nhận</span>
              {allPassed && <Sparkles className="w-3.5 h-3.5 text-slate-950" />}
            </button>

            {/* Admin Studio Button */}
            <button
              onClick={onOpenAdmin}
              title="Quản trị khóa học & Quiz"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all shadow-emerald-900/30"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Quản trị</span>
            </button>

            {/* Employee Avatar Badge */}
            <div className="flex items-center pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                NV
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
