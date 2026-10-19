import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Clock, 
  RotateCcw, 
  ShieldAlert, 
  ChevronRight,
  Trash2,
  X
} from 'lucide-react';
import { RealisticCertificateIcon, RealisticCourseIcon } from './RealisticIcons';

export default function Sidebar({ 
  courses, 
  currentLessonId, 
  completedLessons, 
  onSelectLesson, 
  onResetProgress,
  onDeleteLesson,
  adminMode,
  setAdminMode,
  isAdmin = false
}) {
  const [confirmDeleteLesson, setConfirmDeleteLesson] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExecuteDelete = async (lessonId) => {
    if (!onDeleteLesson) return;
    setIsDeleting(true);
    try {
      await onDeleteLesson(lessonId);
      setConfirmDeleteLesson(null);
    } finally {
      setIsDeleting(false);
    }
  };

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
    <aside className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full select-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-200 order-2 lg:order-1">
      
      {/* 1. Header Tiến Độ - Đồng bộ RealisticCertificateIcon bảo chứng */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <RealisticCertificateIcon className="w-8 h-8 shadow-xs shrink-0" />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lộ trình đào tạo</span>
              </div>
              <p className="text-xs font-black text-slate-900 dark:text-white">
                {passedCoursesCount}/{totalCourses} chuyên đề đạt chuẩn
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200/80 dark:border-blue-800 shadow-2xs">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar (Royal Blue Gradient) */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Thông số tiến độ phẳng */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Tốt nghiệp: <strong className="text-slate-900 dark:text-white font-bold">{passedCoursesCount === totalCourses ? 'Đã hoàn tất' : `Còn ${totalCourses - passedCoursesCount} bài`}</strong></span>
          <span>Điểm TB: <strong className="text-blue-600 dark:text-blue-400 font-bold">{avgScore > 0 ? `${avgScore}%` : 'Chưa thi'}</strong></span>
        </div>
      </div>

      {/* 2. Danh sách Chuyên đề (Scrollable List) */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
        {courses.map((lesson, index) => {
          const isSelected = lesson.id === currentLessonId;
          const lessonProgress = completedLessons[lesson.id] || {};
          const isPassed = lessonProgress.passed;
          
          // Mở khóa nếu bài 1 hoặc bài trước đó đã hoàn thành
          const prevLesson = index > 0 ? courses[index - 1] : null;
          const isUnlocked = adminMode || index === 0 || (prevLesson && completedLessons[prevLesson.id]?.passed);

          return (
            <div
              key={lesson.id}
              onClick={() => isUnlocked && onSelectLesson(lesson.id)}
              className={`p-3.5 sm:p-4 transition-all duration-150 relative group ${
                isSelected 
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-l-blue-600 dark:border-l-blue-500 shadow-2xs' 
                  : isUnlocked 
                    ? 'hover:bg-slate-50/90 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-l-4 border-l-transparent cursor-pointer'
                    : 'opacity-40 cursor-not-allowed border-l-4 border-l-transparent text-slate-500 dark:text-slate-600'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Status Indicator Icon Đồng Bộ Thực Tế */}
                <div className="mt-0.5 shrink-0">
                  {isPassed ? (
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : !isUnlocked ? (
                    <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <Lock className="w-3 h-3" />
                    </div>
                  ) : isSelected ? (
                    <RealisticCourseIcon className="w-6 h-6 shadow-xs" />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-200/80 dark:border-slate-700">
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

                  {/* Status Badges & Admin Actions */}
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

                    <div className="flex items-center space-x-1">
                      {/* Thùng rác xóa chuyên đề (Chỉ Quản trị viên mới thấy) */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteLesson(lesson);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                          title={`Xóa chuyên đề: ${lesson.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isUnlocked && (
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-blue-600 dark:text-blue-400 translate-x-0.5' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400'}`} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Footer Utility Actions */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 space-y-1.5">
        {isAdmin && (
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
        )}

        <button
          onClick={onResetProgress}
          title="Xóa tiến độ và học lại từ đầu"
          className="w-full py-1.5 px-3 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Học lại từ đầu (Reset)</span>
        </button>
      </div>

      {/* 4. MODAL XÁC NHẬN XÓA CHUYÊN ĐỀ (Hỏi lại trước khi xóa) */}
      {confirmDeleteLesson && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => !isDeleting && setConfirmDeleteLesson(null)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Xác nhận xóa chuyên đề?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bạn có chắc chắn muốn xóa chuyên đề này không?
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmDeleteLesson(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-xs space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-mono text-[10px]">
                  {confirmDeleteLesson.rinCode || confirmDeleteLesson.id}
                </span>
                <span className="font-bold text-slate-700 dark:text-stone-300 truncate">
                  {confirmDeleteLesson.category || 'Chuyên đề'}
                </span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">
                {confirmDeleteLesson.title}
              </p>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed pt-1.5 border-t border-rose-200/60 dark:border-rose-900/40">
                ⚠️ <strong>Cảnh báo:</strong> Thao tác này sẽ xóa vĩnh viễn video bài giảng, tài liệu đính kèm và ngân hàng câu hỏi sát hạch thuộc chuyên đề này khỏi hệ thống. Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmDeleteLesson(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleExecuteDelete(confirmDeleteLesson.id)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-50 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Đang xóa...' : 'Xác Nhận Xóa'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
}
