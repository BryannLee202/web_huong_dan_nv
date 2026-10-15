import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Clock, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award
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
  // Calculate overall progress
  const totalCourses = courses.length;
  const passedCoursesCount = courses.filter(c => completedLessons[c.id]?.passed).length;
  const progressPercent = totalCourses > 0 ? Math.round((passedCoursesCount / totalCourses) * 100) : 0;

  // Calculate average score
  const passedScores = courses
    .map(c => completedLessons[c.id]?.score)
    .filter(score => typeof score === 'number');
  const avgScore = passedScores.length > 0 
    ? Math.round(passedScores.reduce((a, b) => a + b, 0) / passedScores.length) 
    : 0;

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none">
      
      {/* Course Roadmap & Progress Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tiến độ đào tạo</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {progressPercent}% Hoàn thành
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50 mb-3">
          <div 
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/40">
            <p className="text-[11px] text-slate-400">Số bài đã đỗ</p>
            <p className="text-sm font-bold text-slate-200">{passedCoursesCount} / {totalCourses}</p>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/40">
            <p className="text-[11px] text-slate-400">Điểm trung bình</p>
            <p className="text-sm font-bold text-amber-400">{avgScore > 0 ? `${avgScore}%` : 'Chưa có'}</p>
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="px-2 pt-1 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Lộ trình bài học ({courses.length})</span>
          {adminMode && (
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
              Admin Mở Khóa Tất Cả
            </span>
          )}
        </div>

        {courses.map((lesson, index) => {
          const isSelected = lesson.id === currentLessonId;
          const lessonProgress = completedLessons[lesson.id];
          const isPassed = Boolean(lessonProgress?.passed);

          // Sequencing Lock Logic:
          // Lesson 0 is always unlocked.
          // Lesson i requires Lesson (i - 1) to be passed, UNLESS adminMode is active.
          const isUnlocked = adminMode || index === 0 || Boolean(completedLessons[courses[index - 1]?.id]?.passed);

          return (
            <div
              key={lesson.id}
              onClick={() => {
                if (isUnlocked) {
                  onSelectLesson(lesson.id);
                }
              }}
              className={`group relative rounded-xl p-3 transition-all duration-200 border cursor-pointer ${
                isSelected 
                  ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/50' 
                  : isUnlocked
                    ? 'bg-slate-900/60 hover:bg-slate-800/50 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Status Indicator Icon */}
                <div className="mt-0.5 shrink-0">
                  {isPassed ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : !isUnlocked ? (
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center border border-slate-700">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  ) : isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-sm shadow-teal-500/30">
                      <PlayCircle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-semibold text-xs border border-slate-700">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Content details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-medium text-emerald-400/90 truncate">
                      {lesson.category || `Chuyên đề ${index + 1}`}
                    </span>
                    {lesson.duration && (
                      <span className="text-[10px] text-slate-400 flex items-center space-x-0.5 shrink-0">
                        <Clock className="w-2.5 h-2.5 mr-0.5" />
                        {lesson.duration}
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs font-semibold leading-snug mt-0.5 line-clamp-2 ${
                    isSelected ? 'text-white font-bold' : isUnlocked ? 'text-slate-200' : 'text-slate-400'
                  }`}>
                    {lesson.title}
                  </h4>

                  {/* Status Badges */}
                  <div className="mt-2 flex items-center justify-between">
                    {isPassed ? (
                      <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        Đã đỗ: {lessonProgress.score}%
                      </span>
                    ) : !isUnlocked ? (
                      <span className="inline-flex items-center text-[10px] font-medium text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                        Khóa tuần tự (Cần ≥ {courses[index - 1]?.passingScore || 80}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-medium text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                        {isSelected ? 'Đang học' : 'Chưa hoàn thành'}
                      </span>
                    )}

                    {isUnlocked && (
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'}`} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Utility Actions */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/95 space-y-2">
        {/* Toggle Admin Preview Mode */}
        <button
          onClick={() => setAdminMode(!adminMode)}
          className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-2 border transition-all ${
            adminMode
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{adminMode ? 'Đang bật Xem trước Admin' : 'Chế độ xem trước Admin'}</span>
        </button>

        {/* Reset Progress Button */}
        <button
          onClick={onResetProgress}
          title="Xóa tiến độ và học lại từ đầu để kiểm thử"
          className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300 bg-slate-850 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900/50 flex items-center justify-center space-x-1.5 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Học lại từ đầu (Reset)</span>
        </button>
      </div>

    </aside>
  );
}
