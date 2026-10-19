import React from 'react';
import { 
  Home, 
  Tv, 
  Award, 
  BookOpen, 
  User, 
  Menu 
} from 'lucide-react';

/**
 * FacebookMobileBottomNav: Thanh điều hướng đáy chuẩn ứng dụng Facebook dành cho điện thoại di động
 * - Hiển thị cố định ở đáy màn hình dưới ngón cái người dùng
 * - Hoàn toàn ẩn trên máy tính (lg:hidden) để đảm bảo giao diện desktop không bị ảnh hưởng
 * - Có huy hiệu (Badge) số lượng chuyên đề như icon Video trên Facebook
 */
export default function FacebookBottomNav({
  activeTab = 'home',
  onTabChange,
  currentView = 'landing',
  onNavigateHome,
  onNavigateCourses,
  onOpenPracticeTest,
  onOpenCheatsheet,
  isLoggedIn = false,
  currentUser = null,
  totalCoursesCount = 8
}) {
  // Xác định tab đang active
  const isHomeActive = currentView === 'landing' && activeTab === 'home';
  const isCoursesActive = (currentView === 'landing' && activeTab === 'courses') || currentView === 'player';
  const isExamActive = activeTab === 'exam';
  const isHandbookActive = activeTab === 'handbook';
  const isProfileActive = (currentView === 'landing' && activeTab === 'profile') || currentView === 'dashboard';

  return (
    <nav 
      aria-label="Thanh điều hướng di động RMSA"
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-[#0b172a]/95 backdrop-blur-lg border-t border-[#cfe2f9] dark:border-blue-500/20 shadow-[0_-4px_25px_rgba(13,92,182,0.09)] px-1 py-1.5 safe-bottom"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center">
        
        {/* TAB 1: TRANG CHỦ */}
        <button
          type="button"
          onClick={() => {
            if (onNavigateHome) onNavigateHome();
            else if (onTabChange) onTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
            isHomeActive 
              ? 'text-[#0066ff] dark:text-blue-400 font-bold' 
              : 'text-[#3a5a80] dark:text-slate-400 hover:text-[#0a2540] dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 transition-transform ${isHomeActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#0066ff] dark:bg-blue-400"></span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Trang chủ</span>
        </button>

        {/* TAB 2: KHÓA HỌC (Có badge số 8 đỏ như Facebook Watch) */}
        <button
          type="button"
          onClick={() => {
            if (onNavigateCourses) onNavigateCourses();
            else if (onTabChange) onTabChange('courses');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
            isCoursesActive 
              ? 'text-blue-600 dark:text-blue-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <Tv className={`w-5 h-5 transition-transform ${isCoursesActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {/* Facebook-style Notification Badge */}
            <span className="absolute -top-1 -right-2.5 px-1.5 py-0.2 min-w-4 text-center rounded-full bg-rose-600 text-white text-[9px] font-black leading-tight shadow-xs">
              {totalCoursesCount || 8}
            </span>
            {isCoursesActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Khóa học</span>
        </button>

        {/* TAB 3: SÁT HẠCH & ĐẤU TRƯỜNG */}
        <button
          type="button"
          onClick={() => {
            if (onOpenPracticeTest) onOpenPracticeTest();
            else if (onTabChange) onTabChange('exam');
          }}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
            isExamActive 
              ? 'text-blue-600 dark:text-blue-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <Award className={`w-5 h-5 transition-transform ${isExamActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {/* Sparkle or Live badge */}
            <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[8px] font-extrabold uppercase">
              Thi
            </span>
            {isExamActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Sát hạch</span>
        </button>

        {/* TAB 4: KỊCH BẢN & CẨM NANG */}
        <button
          type="button"
          onClick={() => {
            if (onOpenCheatsheet) onOpenCheatsheet();
            else if (onTabChange) onTabChange('handbook');
          }}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
            isHandbookActive 
              ? 'text-blue-600 dark:text-blue-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <BookOpen className={`w-5 h-5 transition-transform ${isHandbookActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {isHandbookActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Kịch bản</span>
        </button>

        {/* TAB 5: MENU / CÁ NHÂN (Chuẩn Facebook Profile Avatar Tab) */}
        <button
          type="button"
          onClick={() => {
            if (onTabChange) onTabChange('profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
            isProfileActive 
              ? 'text-blue-600 dark:text-blue-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            {isLoggedIn && currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt="Tôi" 
                className={`w-5 h-5 rounded-full object-cover border ${
                  isProfileActive ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-300 dark:border-slate-600'
                }`}
              />
            ) : (
              <Menu className={`w-5 h-5 transition-transform ${isProfileActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            )}
            {isProfileActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Menu</span>
        </button>

      </div>
    </nav>
  );
}
