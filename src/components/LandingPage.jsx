import React, { useState } from 'react';
import { 
  GraduationCap, 
  PlayCircle, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Clock, 
  Search, 
  Trophy, 
  Zap, 
  BookOpen, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  FileText,
  FileCheck2,
  Check,
  ChevronRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export default function LandingPage({ 
  onEnterLMS, 
  onOpenPracticeTest,
  onOpenCheatsheet,
  onOpenLeaderboard,
  onOpenCertificate,
  onSelectCourse, 
  courses = [],
  completedLessons = {},
  currentLessonId,
  allPassed = false
}) {
  const [searchFilter, setSearchFilter] = useState('');

  // Calculate learner statistics
  const totalCourses = courses.length;
  const passedCount = courses.filter(c => completedLessons[c.id]?.passed).length;
  const progressPercent = totalCourses > 0 ? Math.round((passedCount / totalCourses) * 100) : 0;

  // Find next lesson to suggest
  const nextLesson = courses.find(c => !completedLessons[c.id]?.passed) || courses[0];
  const nextLessonIdx = courses.findIndex(c => c.id === nextLesson?.id);
  const nextLessonRinId = nextLesson?.rinCode || `RIN-0${nextLessonIdx >= 0 ? nextLessonIdx + 1 : 1}`;

  // Filter courses based on user search query
  const filteredCourses = courses.filter((c, idx) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    const rin = (c.rinCode || `rin-0${idx + 1}`).toLowerCase();
    const altRin = `rin-${idx + 1}`;
    return (
      c.title.toLowerCase().includes(q) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      rin.includes(q) ||
      altRin.includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  // Helper to determine if a course is unlocked
  const isCourseUnlocked = (index) => {
    if (index === 0) return true;
    const prevCourse = courses[index - 1];
    return !!completedLessons[prevCourse?.id]?.passed;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* 1. HERO BANNER - SANG TRỌNG, TINH TẾ & GỌN GÀNG */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-10 pb-12 sm:pt-14 sm:pb-16">
        {/* Soft background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-50/70 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Clear Value Proposition & Direct CTAs */}
            <div className="lg:col-span-7 space-y-5 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#007c5d] text-xs font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#007c5d]" />
                <span>RUNNING MAN • HỆ THỐNG ĐÀO TẠO KINH DOANH CĂN HỘ CHO THUÊ</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-[1.2]">
                Làm chủ kỹ năng dẫn khách & <br className="hidden sm:inline" />
                <span className="text-[#007c5d]">chốt cọc căn hộ cho thuê thực chiến</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Lộ trình 6 chuyên đề độc quyền từ Anh Rin: từ kiến thức căn hộ mini/duplex/studio, kịch bản telesale 30s phá băng, bẻ gãy từ chối giá đến tuyệt chiêu chốt cọc trong 15 phút và dịch vụ số chủ nhà.
              </p>

              {/* Personal Learner Quick Progress Widget (Nếu học viên đã bắt đầu) */}
              {totalCourses > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 max-w-xl">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-700 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 text-[#007c5d] mr-1.5" />
                      Tiến độ học tập của bạn:
                    </span>
                    <span className="font-bold text-[#007c5d]">
                      {passedCount}/{totalCourses} bài ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full bg-[#007c5d] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons: 1-Click to Start / Continue */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    if (nextLesson) {
                      onSelectCourse(nextLesson.id, 'lecture');
                    } else {
                      onEnterLMS();
                    }
                  }}
                  className="px-6 py-3.5 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white font-bold text-sm flex items-center space-x-2 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{passedCount > 0 ? `Tiếp tục học: ${nextLessonRinId}` : 'Bắt đầu học ngay'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={onOpenPracticeTest}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs transition-all flex items-center space-x-2 cursor-pointer hover:border-[#007c5d]"
                >
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Thi thử phản xạ 3 phút</span>
                </button>

                <button
                  onClick={onOpenCheatsheet}
                  className="px-4 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-semibold text-xs border border-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sổ tay kịch bản</span>
                </button>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#007c5d]" />
                  <span>Khóa bài tuần tự (Chuẩn $\ge$ 80%)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#007c5d]" />
                  <span>Phòng thi bấm giờ Moon.vn</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#007c5d]" />
                  <span>Cấp chứng chỉ điện tử</span>
                </div>
              </div>

            </div>

            {/* Right Column: Clean Interactive LMS Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 space-y-3.5">
                
                {/* Window Bar */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <span className="text-[11px] font-bold text-slate-600 ml-1">Lớp Học Trực Tuyến RIN</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#007c5d] border border-emerald-200">
                    Sát hạch chuẩn hóa
                  </span>
                </div>

                {/* Video Preview Box */}
                <div 
                  onClick={() => onSelectCourse(courses[0]?.id || 'bai-1', 'lecture')}
                  className="group relative aspect-video bg-slate-900 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center text-white shadow-inner"
                >
                  <div className="text-center space-y-2 transition-transform group-hover:scale-105 duration-200">
                    <div className="w-12 h-12 rounded-full bg-[#007c5d] text-white flex items-center justify-center mx-auto shadow-md">
                      <PlayCircle className="w-7 h-7" />
                    </div>
                    <p className="text-xs font-bold text-slate-100">Bấm để vào học ngay</p>
                    <span className="text-[10px] text-emerald-300">Video HD • Kèm tài liệu PDF & Timestamp</span>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-300">
                    RIN-01 • 12 phút
                  </div>
                </div>

                {/* Next Up Checklist Preview */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Lộ trình 6 chuyên đề sát hạch bắt buộc:
                  </span>
                  
                  {courses.slice(0, 6).map((c, i) => {
                    const isPassed = completedLessons[c.id]?.passed;
                    const unlocked = isCourseUnlocked(i);
                    const code = c.rinCode || `RIN-0${i + 1}`;

                    return (
                      <div 
                        key={c.id}
                        onClick={() => unlocked && onSelectCourse(c.id, 'lecture')}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                          unlocked 
                            ? 'bg-slate-50 hover:bg-emerald-50/60 border-slate-200 hover:border-emerald-300 cursor-pointer' 
                            : 'bg-slate-50/50 border-slate-200/60 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isPassed 
                              ? 'bg-emerald-100 text-[#007c5d]' 
                              : unlocked 
                                ? 'bg-slate-200 text-slate-700' 
                                : 'bg-slate-200 text-slate-400'
                          }`}>
                            {isPassed ? '✓' : i + 1}
                          </span>
                          <span className="font-semibold text-slate-800 truncate">
                            <span className="font-bold text-[#007c5d] mr-1.5">{code}:</span>
                            {c.title}
                          </span>
                        </div>
                        
                        <div className="shrink-0 ml-2">
                          {isPassed ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Đã đỗ {completedLessons[c.id]?.score}%
                            </span>
                          ) : unlocked ? (
                            <span className="text-[10px] font-bold text-[#007c5d] flex items-center">
                              Vào học <ChevronRight className="w-3 h-3 ml-0.5" />
                            </span>
                          ) : (
                            <Lock className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. QUICK ACCESS DOCK (THANH 4 TIỆN ÍCH TRỌNG TÂM - GỌN GÀNG, ĐẸP MẮT) */}
      <section className="py-6 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Dock 1: Thi Thử 3 Phút */}
            <button
              onClick={onOpenPracticeTest}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#007c5d] hover:shadow-xs transition-all flex items-center space-x-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 group-hover:bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 transition-colors">
                <Zap className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#007c5d]">Thi Thử 3 Phút</h4>
                <p className="text-[11px] text-slate-500">3 câu phản xạ nhanh</p>
              </div>
            </button>

            {/* Dock 2: Bảng Vàng Xếp Hạng */}
            <button
              onClick={onOpenLeaderboard}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#007c5d] hover:shadow-xs transition-all flex items-center space-x-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 text-[#007c5d] flex items-center justify-center shrink-0 transition-colors">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#007c5d]">Bảng Vàng Thi Đua</h4>
                <p className="text-[11px] text-slate-500">Xếp hạng Best Seller</p>
              </div>
            </button>

            {/* Dock 3: Sổ Tay Kịch Bản B2B */}
            <button
              onClick={onOpenCheatsheet}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#007c5d] hover:shadow-xs transition-all flex items-center space-x-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#007c5d]">Sổ Tay Kịch Bản</h4>
                <p className="text-[11px] text-slate-500">Script đối đáp khách hàng</p>
              </div>
            </button>

            {/* Dock 4: Chứng Chỉ Sát Hạch */}
            <button
              onClick={onOpenCertificate}
              className={`p-4 rounded-xl border transition-all flex items-center space-x-3 text-left cursor-pointer group ${
                allPassed
                  ? 'bg-amber-50/60 border-amber-300 hover:shadow-xs'
                  : 'bg-white border-slate-200 hover:border-[#007c5d] hover:shadow-xs'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                allPassed ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-[#007c5d]'
              }`}>
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#007c5d]">
                  {allPassed ? 'Nhận Chứng Chỉ' : 'Chứng Chỉ Đào Tạo'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {allPassed ? 'Đã đủ điều kiện cấp' : 'Chuẩn tốt nghiệp ≥ 80%'}
                </p>
              </div>
            </button>

          </div>
        </div>
      </section>

      {/* 3. TRỌNG TÂM: KHO CHUYÊN ĐỀ HỌC TẬP (COURSE CATALOG & ROADMAP) */}
      <section id="khoa-hoc" className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Quick Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#007c5d] uppercase tracking-wider mb-1">
                <span>LỘ TRÌNH ĐÀO TẠO THỰC CHIẾN</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                3 Chuyên đề nâng tầm năng lực bán hàng B2B
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Bấm vào chuyên đề để xem video bài giảng, tải cẩm nang PDF và làm bài thi trắc nghiệm.
              </p>
            </div>

            {/* Smart Search Filter Bar */}
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Lọc mã (vd: RIN-01, giá, chốt)..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007c5d] focus:border-transparent transition-all"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => {
              const rinCode = course.rinCode || `RIN-0${idx + 1}`;
              const isPassed = completedLessons[course.id]?.passed;
              const userScore = completedLessons[course.id]?.score;
              const unlocked = isCourseUnlocked(idx);

              // Distinct accent color per module
              const stageColors = [
                { bg: 'bg-emerald-50', text: 'text-[#007c5d]', border: 'border-emerald-200', tag: 'CHẶNG 1 • NỀN TẢNG' },
                { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', tag: 'CHẶNG 2 • THỰC CHIẾN' },
                { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', tag: 'CHẶNG 3 • BỨT PHÁ' }
              ];
              const stage = stageColors[idx % stageColors.length];

              return (
                <div
                  key={course.id}
                  className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                    unlocked 
                      ? 'bg-white border-slate-200 hover:border-[#007c5d] hover:shadow-md' 
                      : 'bg-slate-50/70 border-slate-200/60 opacity-75'
                  }`}
                >
                  {/* Card Header & Content */}
                  <div className="p-6">
                    
                    {/* Top Tag & Status */}
                    <div className="flex items-center justify-between mb-3.5">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${stage.bg} ${stage.text} ${stage.border}`}>
                        {stage.tag}
                      </span>

                      {isPassed ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Đã đỗ {userScore}%</span>
                        </span>
                      ) : unlocked ? (
                        <span className="text-[11px] font-bold text-[#007c5d] bg-emerald-50/80 px-2 py-0.5 rounded-full">
                          Sẵn sàng học
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" />
                          <span>Đang khóa</span>
                        </span>
                      )}
                    </div>

                    {/* Module Title */}
                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                      <span className="text-[#007c5d] mr-1.5">{rinCode}:</span>
                      {course.title}
                    </h3>

                    {/* Module Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {course.summary?.keyPrinciples?.[0] || 
                       course.description || 
                       'Trang bị bộ công cụ kỹ năng bán hàng B2B thực chiến, các nguyên tắc đàm phán và giải pháp xử lý tình huống nhanh.'}
                    </p>

                    {/* Specs / Meta */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Thời lượng</span>
                        <strong className="text-slate-800 font-semibold">{course.duration || '15 phút'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Số câu hỏi</span>
                        <strong className="text-slate-800 font-semibold">{course.quiz?.length || 5} câu</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Chuẩn đỗ</span>
                        <strong className="text-[#007c5d] font-bold">≥ {course.passingScore || 80}%</strong>
                      </div>
                    </div>

                  </div>

                  {/* Card Action Buttons (Direct 1-Click) */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
                    {unlocked ? (
                      <>
                        <button
                          onClick={() => onSelectCourse(course.id, 'lecture')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>{isPassed ? 'Xem lại bài giảng' : 'Vào học ngay'}</span>
                        </button>

                        <button
                          onClick={() => onSelectCourse(course.id, 'quiz')}
                          title="Làm bài kiểm tra trắc nghiệm"
                          className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>Làm bài thi</span>
                        </button>
                      </>
                    ) : (
                      <div className="w-full py-2.5 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-medium text-center flex items-center justify-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Cần hoàn thành Bài {idx} (≥80%) để mở khóa</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. PHÒNG THI SÁT HẠCH TRỰC TUYẾN (EXAM ARENA SPOTLIGHT - PHONG CÁCH MOON.VN SANG TRỌNG) */}
      <section className="py-12 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-lg border border-slate-800">
            
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#007c5d]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-8 space-y-3 text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                  <span>PHÒNG THI SÁT HẠCH TRỰC TUYẾN</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Phòng Thi Trắc Nghiệm Tình Huống Sales Master
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Thiết kế theo chuẩn Moon.vn: Lưới ma trận 15 câu hỏi, đồng hồ đếm ngược từng giây, 
                  nút gắn cờ phân vân, hệ thống tự động chấm điểm và lưu lịch sử làm bài (Attempt History).
                </p>

                {/* Features Pills */}
                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
                    ⏱ Đếm lùi 15 phút
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
                    🔢 Lưới ma trận 1 - 15 câu
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
                    🎯 Đạt chuẩn ≥ 80% cấp chứng chỉ
                  </span>
                </div>
              </div>

              {/* Action Column */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-2">
                <button
                  onClick={onOpenPracticeTest}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Vào phòng thi sát hạch ngay</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <span className="text-[11px] text-slate-400">
                  Miễn phí • Chấm điểm tự động tức thì
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. QUY TRÌNH HỌC TẬP 3 BƯỚC ĐƠN GIẢN (HOW IT WORKS) */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-xs font-bold text-[#007c5d] uppercase tracking-wider">
            QUY TRÌNH TINH GỌN
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 mb-8">
            3 Bước dễ dàng để nâng cấp năng lực bán hàng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#007c5d] font-black text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900">Xem video bài giảng 15 phút</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nắm vững kịch bản đối thoại, bấm vào các mốc thời gian (Timestamp) để tua nhanh phần kiến thức trọng tâm.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900">Thi trắc nghiệm đạt ≥ 80%</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Làm bài thi trắc nghiệm tình huống thực tế. Đạt điểm mở khóa bài học tiếp theo và lưu kết quả vào hồ sơ.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900">Nhận chứng chỉ & Thực chiến</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Được cấp Chứng chỉ tốt nghiệp điện tử chuẩn doanh nghiệp và áp dụng ngay kịch bản vào các cuộc gọi chốt deal.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CLEAN ENTERPRISE FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <GraduationCap className="w-5 h-5 text-[#007c5d]" />
            <span>RIN Sales Academy • Nền Tảng Đào Tạo Bán Hàng Doanh Nghiệp</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button onClick={onOpenPracticeTest} className="hover:text-white transition-colors cursor-pointer">
              Thi thử 3 phút
            </button>
            <button onClick={onOpenLeaderboard} className="hover:text-white transition-colors cursor-pointer">
              Bảng vàng
            </button>
            <button onClick={onOpenCheatsheet} className="hover:text-white transition-colors cursor-pointer">
              Sổ tay kịch bản
            </button>
            <button onClick={onOpenCertificate} className="hover:text-white transition-colors cursor-pointer">
              Chứng chỉ
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
