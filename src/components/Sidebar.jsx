import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Clock, 
  RotateCcw, 
  ShieldAlert, 
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ 
  courses, 
  currentLessonId, 
  completedLessons, 
  onSelectLesson, 
  onResetProgress,
  adminMode,
  setAdminMode
}) {
  const totalCourses = courses.length;
  const passedCoursesCount = courses.filter(c => completedLessons[c.id]?.passed).length;
  const progressPercent = totalCourses > 0 ? Math.round((passedCoursesCount / totalCourses) * 100) : 0;

  const passedScores = courses
    .map(c => completedLessons[c.id]?.score)
    .filter(score => typeof score === 'number');
  const avgScore = passedScores.length > 0 
    ? Math.round(passedScores.reduce((a, b) => a + b, 0) / passedScores.length) 
    : 0;

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full select-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-200">
      
      {/* 1. Header Tiến Độ - Bỏ hoàn toàn các khối hộp cứng nhắc, chuyển sang phẳng liền mạch */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tiến độ đào tạo</span>
          </div>
          <span className="text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200/80 dark:border-blue-800">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar (Royal Blue Gradient) */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2.5">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Thông số tiến độ phẳng (Inline, không khối hộp) */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-0.5">
          <span>Đã đỗ: <strong className="text-slate-900 dark:text-white font-bold">{passedCoursesCount}/{totalCourses} bài</strong></span>
          <span>Điểm TB: <strong className="text-blue-600 dark:text-blue-400 font-bold">{avgScore > 0 ? `${avgScore}%` : 'Chưa thi'}</strong></span>
        </div>
      </div>

      {/* 2. Danh Sách Bài Học - Phẳng hoàn toàn, không viền thẻ đóng hộp (Seamless List) */}
      <div className="flex-1 overflow-y-auto py-2 divide-y divide-slate-100/60 dark:divide-slate-800/60">
        <div className="px-4 pt-2 pb-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Lộ trình 8 chuyên đề ({courses.length})</span>
          {adminMode && (
            <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 font-semibold">
              Admin Mở Khóa
            </span>
          )}
        </div>

        {courses.map((lesson, index) => {
          const isSelected = lesson.id === currentLessonId;
          const lessonProgress = completedLessons[lesson.id];
          const isPassed = Boolean(lessonProgress?.passed);
          const isUnlocked = adminMode || index === 0 || Boolean(completedLessons[courses[index - 1]?.id]?.passed);

          return (
            <div
              key={lesson.id}
              onClick={() => {
                if (isUnlocked) onSelectLesson(lesson.id);
              }}
              className={`group relative px-4 py-3.5 transition-all duration-150 cursor-pointer ${
                isSelected 
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-l-blue-600 text-slate-950 dark:text-white font-medium' 
                  : isUnlocked
                    ? 'hover:bg-slate-50/90 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-l-4 border-l-transparent'
                    : 'opacity-40 cursor-not-allowed border-l-4 border-l-transparent text-slate-500 dark:text-slate-600'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Status Indicator Icon */}
                <div className="mt-0.5 shrink-0">
                  {isPassed ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : !isUnlocked ? (
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                      <Lock className="w-3 h-3" />
                    </div>
                  ) : isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      <PlayCircle className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono shrink-0">
                        {lesson.rinCode || (index + 1 < 10 ? `RM-0${index + 1}` : `RM-${index + 1}`)}
                      </span>
                      <span className={`text-[11px] font-semibold truncate ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {lesson.category || `Chuyên đề ${index + 1}`}
                      </span>
                    </div>
                    {lesson.duration && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center shrink-0">
                        <Clock className="w-2.5 h-2.5 mr-0.5" />
                        {lesson.duration}
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs leading-snug line-clamp-2 ${
                    isSelected ? 'text-slate-950 dark:text-white font-bold' : isUnlocked ? 'text-slate-700 dark:text-slate-200 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {lesson.title}
                  </h4>

                  {/* Status Badges */}
                  <div className="mt-2 flex items-center justify-between">
                    {isPassed ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        Đã đỗ: {lessonProgress.score}%
                      </span>
                    ) : !isUnlocked ? (
                      <span className="inline-flex items-center text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        Khóa tuần tự (Cần ≥ 80%)
                      </span>
                    ) : (
                      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {isSelected ? 'Đang học' : 'Chưa học'}
                      </span>
                    )}

                    {isUnlocked && (
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-blue-600 dark:text-blue-400 translate-x-0.5' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400'}`} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Footer Utility Actions */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 space-y-1.5">
        <button
          onClick={() => setAdminMode(!adminMode)}
          className={`w-full py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all cursor-pointer ${
            adminMode
              ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-750'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{adminMode ? 'Đang bật Xem trước Admin' : 'Chế độ xem trước Admin'}</span>
        </button>

        <button
          onClick={onResetProgress}
          title="Xóa tiến độ và học lại từ đầu"
          className="w-full py-1.5 px-3 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Học lại từ đầu (Reset)</span>
        </button>
      </div>

    </aside>
  );
}
