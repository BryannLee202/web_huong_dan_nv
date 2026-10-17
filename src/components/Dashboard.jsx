import React from 'react';
import { 
  PlayCircle, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  Trophy,
  ChevronRight
} from 'lucide-react';

export default function Dashboard({ 
  courses, 
  completedLessons, 
  onStartLesson, 
  onOpenCheatsheet 
}) {
  const totalCourses = courses.length;
  const passedCoursesCount = courses.filter(c => completedLessons[c.id]?.passed).length;
  const progressPercent = totalCourses > 0 ? Math.round((passedCoursesCount / totalCourses) * 100) : 0;

  const passedScores = courses
    .map(c => completedLessons[c.id]?.score)
    .filter(s => typeof s === 'number');
  const avgScore = passedScores.length > 0 
    ? Math.round(passedScores.reduce((a, b) => a + b, 0) / passedScores.length) 
    : 0;

  // Find the first uncompleted lesson to suggest "Tiếp tục học"
  const nextLesson = courses.find(c => !completedLessons[c.id]?.passed) || courses[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* 1. WELCOME BANNER (Đồng bộ phong cách Luxury Navy - Cobalt của Trang chủ) */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0d5cb6] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Học Viện Kỹ Năng Bán Hàng Nội Bộ Running Man</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Chào mừng trở lại, Nhân Viên! 👋
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Bạn đã hoàn thành <strong className="text-white font-bold">{progressPercent}%</strong> lộ trình đào tạo bán hàng. 
            {progressPercent >= 100 
              ? ' Bạn đã hoàn thành xuất sắc tất cả chuyên đề và đủ điều kiện nhận Chứng chỉ tốt nghiệp!' 
              : ' Hãy tiếp tục hoàn thành các bài học tiếp theo để mở khóa toàn bộ chứng chỉ và thăng tiến năng lực.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartLesson(nextLesson.id)}
              className="px-6 py-2.5 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs flex items-center space-x-2 shadow-xs cursor-pointer transition-all hover:scale-105"
            >
              <span>{progressPercent >= 100 ? 'Xem lại bài học' : 'Tiếp tục bài học'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCheatsheet}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 cursor-pointer"
            >
              Sổ tay kịch bản Sale
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Bài học đã đỗ</span>
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{passedCoursesCount} / {totalCourses}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Đạt chuẩn ≥ 80%</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Điểm trung bình</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{avgScore > 0 ? `${avgScore}%` : 'Chưa thi'}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Tất cả các bài kiểm tra</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Xếp hạng đội ngũ</span>
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">Hạng 3</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Trong 25 nhân viên kinh doanh</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Chứng nhận tốt nghiệp</span>
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{progressPercent >= 100 ? 'Sẵn sàng' : 'Chưa đạt'}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{progressPercent >= 100 ? 'Bấm để in/tải PDF' : 'Cần hoàn thành 100%'}</p>
        </div>
      </div>

      {/* 3. CONTINUE LEARNING SPOTLIGHT */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Bài Học Tiếp Theo Của Bạn</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Chuyên đề cần hoàn thành để tiếp tục lộ trình</p>
          </div>
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200/90 dark:border-blue-800">
            {nextLesson.duration || '15 phút'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
              <PlayCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block">{nextLesson.category}</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{nextLesson.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Yêu cầu: Xem video & làm trắc nghiệm đạt tối thiểu {nextLesson.passingScore || 80}% điểm.
              </p>
            </div>
          </div>

          <button
            onClick={() => onStartLesson(nextLesson.id)}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <span>Vào học ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. LEARNING ROADMAP CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Toàn Bộ Lộ Trình Đào Tạo ({courses.length} Bài)</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Quy chuẩn mở khóa tuần tự</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, idx) => {
            const isPassed = completedLessons[course.id]?.passed;
            const isUnlocked = idx === 0 || completedLessons[courses[idx - 1]?.id]?.passed;

            return (
              <div
                key={course.id}
                onClick={() => {
                  if (isUnlocked) onStartLesson(course.id);
                }}
                className={`p-5 rounded-2xl border transition-all ${
                  isPassed
                    ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60 shadow-xs'
                    : isUnlocked
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md cursor-pointer'
                      : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Chuyên đề {idx + 1}</span>
                  {isPassed ? (
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {completedLessons[course.id]?.score}%
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200/80 dark:border-blue-800">
                      Sẵn sàng học
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      Bị khóa
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {course.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  {course.summary?.[0] || 'Nắm vững nguyên tắc và kịch bản thực tế.'}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 dark:text-slate-500">{course.quiz?.length || 5} câu test</span>
                  <span className={`flex items-center ${isUnlocked ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    <span>{isPassed ? 'Học lại' : 'Vào học'}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
