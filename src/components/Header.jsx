import React from 'react';
import { 
  GraduationCap, 
  Search, 
  FileText, 
  Trophy, 
  Award, 
  Settings, 
  ChevronRight,
  User
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand - TalentLMS Style */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#007c5d] flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">RIN</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-[#007c5d] font-bold border border-emerald-200">
                  ACADEMY
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Đào Tạo Kỹ Năng Bán Hàng Thực Chiến</p>
            </div>
          </div>

          {/* Clean Search Input */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#007c5d] focus:bg-white focus:ring-1 focus:ring-[#007c5d] transition-all"
              />
            </div>
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

            {/* Admin Studio Button (TalentLMS Emerald Green) */}
            <button
              onClick={onOpenAdmin}
              title="Quản trị nội dung"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#007c5d] hover:bg-[#00634a] text-white shadow-xs transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quản trị</span>
            </button>

            {/* Student Avatar Badge */}
            <div className="flex items-center pl-3 ml-1 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-bold text-[#007c5d]">
                NV
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
