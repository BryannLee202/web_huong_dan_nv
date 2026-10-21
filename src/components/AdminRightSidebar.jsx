import React from 'react';
import { 
  Sparkles, 
  BookmarkCheck, 
  BookOpen, 
  Trash2, 
  Edit3, 
  Settings, 
  ChevronRight, 
  X, 
  Layers,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Video
} from 'lucide-react';
import { RealisticCourseIcon, RealisticAiRinIcon } from './RealisticIcons';

export default function AdminRightSidebar({
  currentLesson,
  currentLessonIndex = 0,
  totalLessons = 8,
  activeVideoIdx = 0,
  onActiveVideoChange,
  isAiGenerating = false,
  onTriggerAiSummary,
  onTriggerAiQuiz,
  onOpenVideoAdmin,
  onOpenDocAdmin,
  onOpenRename,
  onQuickClear,
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  completedLessons = {}
}) {
  if (!currentLesson) return null;

  const validVideos = Array.isArray(currentLesson.videos) 
    ? currentLesson.videos.filter(v => v && v.url) 
    : [];
  const activePart = validVideos[activeVideoIdx] || validVideos[0] || null;
  const activePartLabel = validVideos.length > 1 ? `Phần ${activeVideoIdx + 1}` : '';
  const currentQuiz = Array.isArray(currentLesson.quiz) ? currentLesson.quiz : [];
  const currentSummary = Array.isArray(currentLesson.summary) ? currentLesson.summary : [];
  const isPassed = completedLessons[currentLesson.id]?.passed;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 text-left select-none">
      
      {/* 1. HEADER BẢNG QUẢN TRỊ */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/60 dark:bg-slate-800/40">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider truncate">
                Quản Trị Bài Học
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono shrink-0">
                {currentLesson.rinCode || `RM-0${currentLessonIndex + 1}`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Bài {currentLessonIndex + 1}/{totalLessons} • {currentLesson.category || 'Bán hàng'}
            </p>
          </div>
        </div>

        {/* Mobile Close Button / Desktop Collapse Button */}
        <div className="flex items-center space-x-1 shrink-0">
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="xl:hidden w-7 h-7 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              title="Đóng bảng quản trị"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden xl:flex w-7 h-7 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 items-center justify-center cursor-pointer"
              title={isCollapsed ? 'Mở rộng thanh quản trị' : 'Thu gọn thanh quản trị'}
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* MULTI-PART VIDEO CHIPS (NẾU CÓ TỪ 2 PHẦN TRỞ LÊN) */}
      {validVideos.length > 1 && (
        <div className="px-4 py-2.5 bg-blue-50/50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Phần video đang chọn:</span>
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-mono font-black">
              Phần {activeVideoIdx + 1}/{validVideos.length}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {validVideos.map((vid, idx) => (
              <button
                key={vid.id || idx}
                type="button"
                onClick={() => onActiveVideoChange && onActiveVideoChange(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeVideoIdx === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                P{idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SCROLLABLE TOOL BUTTONS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* GROUP 1: AI MULTIMODAL VIDEO ENGINE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>AI Multimodal Video Engine</span>
            </span>
            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300">
              Riêng biệt
            </span>
          </div>

          {/* Nút 1: AI Tóm Tắt Video */}
          <button
            type="button"
            disabled={isAiGenerating}
            onClick={onTriggerAiSummary}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 hover:from-amber-500/20 to-orange-500/10 hover:to-orange-500/20 border border-amber-400/40 hover:border-amber-400 text-left flex items-start space-x-3 transition-all cursor-pointer group shadow-2xs disabled:opacity-50"
            title="Cho AI xem video để trích xuất 4 điểm cốt lõi và mốc thời gian"
          >
            <RealisticAiRinIcon className={`w-8 h-8 rounded-xl shadow-2xs shrink-0 mt-0.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {isAiGenerating ? 'AI đang đọc video...' : (activePartLabel ? `✨ AI Tóm Tắt (${activePartLabel})` : '✨ AI Tóm Tắt Video')}
                </p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  Ý chính
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Trích xuất 4 điểm cốt lõi & mốc thời gian bài giảng
              </p>
            </div>
          </button>

          {/* Nút 2: AI Sinh 10 Câu Sát Hạch */}
          <button
            type="button"
            disabled={isAiGenerating}
            onClick={onTriggerAiQuiz}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-500/10 hover:from-blue-500/20 to-indigo-500/10 hover:to-indigo-500/20 border border-blue-400/40 hover:border-blue-400 text-left flex items-start space-x-3 transition-all cursor-pointer group shadow-2xs disabled:opacity-50"
            title="Cho AI xem video để sinh ngân hàng 10 câu trắc nghiệm sát hạch bám sát video"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-300 dark:border-blue-800 shadow-2xs mt-0.5">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {isAiGenerating ? 'AI đang tạo đề...' : (activePartLabel ? `⚡ AI Sinh Đề (${activePartLabel})` : '⚡ AI Sinh 10 Câu')}
                </p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-800 dark:text-blue-300">
                  10 câu
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Tạo đề trắc nghiệm bám sát 100% video thực tế
              </p>
            </div>
          </button>
        </div>

        {/* GROUP 2: QUẢN LÝ BÀI GIẢNG & NỘI DUNG */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Quản Lý Bài Giảng & Nội Dung
          </span>

          {/* Quản lý Video */}
          <button
            type="button"
            onClick={onOpenVideoAdmin}
            className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-left flex items-center space-x-3 transition-all cursor-pointer group shadow-2xs"
          >
            <RealisticCourseIcon className="w-7 h-7 rounded-lg shadow-2xs shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Quản Lý Video Bài Giảng
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Tải file máy chủ, liên kết YouTube, Drive
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
          </button>

          {/* Quản lý Tài liệu */}
          <button
            type="button"
            onClick={onOpenDocAdmin}
            className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-left flex items-center space-x-3 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                Quản Lý Giáo Trình & Tài Liệu
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Upload giáo trình .html, .docx, .pdf, .md
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
          </button>

          {/* Đổi tên chuyên đề */}
          <button
            type="button"
            onClick={onOpenRename}
            className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-left flex items-center space-x-3 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
              <Edit3 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Đổi Tên Chuyên Đề
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Chỉnh sửa tiêu đề bài học hiển thị
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
          </button>
        </div>

        {/* GROUP 3: THAO TÁC LÀM MỚI & DỌN DẸP */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Làm Mới & Dọn Dẹp
          </span>

          <button
            type="button"
            onClick={onQuickClear}
            className="w-full p-2.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/60 text-left flex items-center space-x-3 transition-all cursor-pointer group shadow-2xs"
            title="Gỡ bỏ tóm tắt & đề thi cũ không khớp khi đổi video"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
              <Trash2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                Gỡ Tóm Tắt & Đề Thi Cũ
              </p>
              <p className="text-[10px] text-rose-600/80 dark:text-rose-400/80 truncate">
                Xóa nội dung không khớp với video mới
              </p>
            </div>
          </button>
        </div>

      </div>

      {/* 4. FOOTER: THẺ TRẠNG THÁI TỔNG QUAN BÀI HỌC */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 shrink-0 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
          <span>Tình trạng chuyên đề:</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            isPassed 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
          }`}>
            {isPassed ? `Đã đỗ (${completedLessons[currentLesson.id]?.score}%)` : 'Đang học'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Tóm tắt AI</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {currentSummary.length > 0 ? `✓ Có ${currentSummary.length} ý` : 'Chưa có'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Bộ đề sát hạch</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {currentQuiz.length > 0 ? `✓ ${currentQuiz.length} câu hỏi` : 'Chưa có đề'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* A. DESKTOP VIEW (>= xl): DOCKED SIDEBAR BÊN PHẢI */}
      <aside 
        className={`hidden xl:flex ${
          isCollapsed ? 'w-0 border-none overflow-hidden' : 'w-80 2xl:w-84 shrink-0'
        } transition-all duration-300 ease-in-out order-3`}
      >
        {sidebarContent}
      </aside>

      {/* Nút nhỏ để mở lại nếu Admin thu gọn trên Desktop */}
      {isCollapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden xl:flex fixed right-4 top-24 z-40 px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl text-slate-800 dark:text-slate-100 items-center space-x-2 text-xs font-bold hover:border-amber-400 transition-all cursor-pointer group"
          title="Mở thanh quản trị bài học bên phải"
        >
          <Settings className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />
          <span>Bảng Quản Trị</span>
        </button>
      )}

      {/* B. MOBILE & TABLET (< xl): OFF-CANVAS SLIDE-OVER DRAWER */}
      {isOpenMobile && (
        <div className="xl:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />
          {/* Slide panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm h-full shadow-2xl animate-in slide-in-from-right duration-250 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
