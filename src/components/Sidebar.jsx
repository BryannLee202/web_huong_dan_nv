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
    <aside className="w-full lg:w-80 shrink-0 bg-white border-r border-slate-200 flex flex-col h-full select-none shadow-xs">
      
      {/* Course Roadmap & Progress Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white/80 backdrop-blur-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tiến độ khóa học</span>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar (Royal Blue Gradient) */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3.5">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Stats Grid (Seamless, light, no heavy box borders) */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-50/80 py-2 px-3 rounded-xl border border-slate-200/60">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Đã hoàn thành</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{passedCoursesCount} / {totalCourses} bài</p>
          </div>
          <div className="bg-slate-50/80 py-2 px-3 rounded-xl border border-slate-200/60">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Điểm trung bình</p>
            <p className="text-xs font-bold text-blue-600 mt-0.5">{avgScore > 0 ? `${avgScore}%` : 'Chưa thi'}</p>
          </div>
        </div>
      </div>

      {/* Lesson List (Seamless, continuous list without harsh box containment) */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        <div className="px-2 pt-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Danh sách bài học ({courses.length})</span>
          {adminMode && (
            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
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
              className={`group relative rounded-xl p-3 transition-all duration-150 cursor-pointer ${
                isSelected 
                  ? 'bg-blue-50/80 border-l-4 border-l-blue-600 border border-blue-200/60 shadow-2xs text-slate-900' 
                  : isUnlocked
                    ? 'hover:bg-slate-100/70 border border-transparent'
                    : 'opacity-50 cursor-not-allowed border border-transparent'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Status Indicator Icon */}
                <div className="mt-0.5 shrink-0">
                  {isPassed ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : !isUnlocked ? (
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                      <Lock className="w-3 h-3" />
                    </div>
                  ) : isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      <PlayCircle className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono shrink-0">
                        {lesson.rinCode || (index + 1 < 10 ? `RM-0${index + 1}` : `RM-${index + 1}`)}
                      </span>
                      <span className={`text-[11px] font-semibold truncate ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                        {lesson.category || `Chuyên đề ${index + 1}`}
                      </span>
                    </div>
                    {lesson.duration && (
                      <span className="text-[10px] text-slate-400 flex items-center shrink-0">
                        <Clock className="w-2.5 h-2.5 mr-0.5" />
                        {lesson.duration}
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs leading-snug line-clamp-2 ${
                    isSelected ? 'text-slate-950 font-bold' : isUnlocked ? 'text-slate-700 font-medium group-hover:text-blue-700' : 'text-slate-400'
                  }`}>
                    {lesson.title}
                  </h4>

                  {/* Status Badges */}
                  <div className="mt-2 flex items-center justify-between">
                    {isPassed ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Đã đỗ: {lessonProgress.score}%
                      </span>
                    ) : !isUnlocked ? (
                      <span className="inline-flex items-center text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        Khóa tuần tự (Cần ≥ 80%)
                      </span>
                    ) : (
                      <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-blue-100/70 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isSelected ? 'Đang học' : 'Chưa học'}
                      </span>
                    )}

                    {isUnlocked && (
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'}`} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Utility Actions */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-1.5">
        <button
          onClick={() => setAdminMode(!adminMode)}
          className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all cursor-pointer ${
            adminMode
              ? 'bg-amber-100/80 border-amber-300 text-amber-900'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{adminMode ? 'Đang bật Xem trước Admin' : 'Chế độ xem trước Admin'}</span>
        </button>

        <button
          onClick={onResetProgress}
          title="Xóa tiến độ và học lại từ đầu"
          className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-700 bg-transparent hover:bg-rose-50 border border-transparent hover:border-rose-200 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Học lại từ đầu (Reset)</span>
        </button>
      </div>

    </aside>
  );
}
