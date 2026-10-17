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
      
      {/* 1. HERO BANNER - SANG TRá»ŒNG, TINH Táº¾ & Gá»ŒN GĂ€NG */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-10 pb-12 sm:pt-14 sm:pb-16">
        {/* Soft background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-50/70 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Clear Value Proposition & Direct CTAs */}
            <div className="lg:col-span-7 space-y-5 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>RMSA â€¢ RUNNING MAN SALES ACADEMY</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-[1.2]">
                LĂ m chá»§ ká»¹ nÄƒng dáº«n khĂ¡ch & <br className="hidden sm:inline" />
                <span className="text-amber-600">chá»‘t cá»c cÄƒn há»™ cho thuĂª thá»±c chiáº¿n</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Chuáº©n hĂ³a 8 nhĂ³m nÄƒng lá»±c mĂ´i giá»›i thá»±c chiáº¿n tá»« Äan Rin: tá»« hiá»ƒu sáº£n pháº©m, táº¡o nguá»“n hĂ ng, Ä‘Äƒng tin tĂ¬m khĂ¡ch, telesale 30s phĂ¡ bÄƒng, checklist Ä‘Ă³n khĂ¡ch 15 phĂºt Ä‘áº¿n ká»¹ thuáº­t báº» gĂ£y tá»« chá»‘i giĂ¡ vĂ  chá»‘t cá»c giá»¯ phĂ²ng.
              </p>

              {/* Personal Learner Quick Progress Widget (Náº¿u há»c viĂªn Ä‘Ă£ báº¯t Ä‘áº§u) */}
              {totalCourses > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 max-w-xl">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-700 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                      Tiáº¿n Ä‘á»™ há»c táº­p cá»§a báº¡n:
                    </span>
                    <span className="font-bold text-blue-600">
                      {passedCount}/{totalCourses} bĂ i ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
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
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-sm flex items-center space-x-2 shadow-[0_4px_16px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{passedCount > 0 ? `Tiáº¿p tá»¥c há»c: ${nextLessonRinId}` : 'Báº¯t Ä‘áº§u há»c ngay'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={onOpenPracticeTest}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs transition-all flex items-center space-x-2 cursor-pointer hover:border-blue-500"
                >
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Thi thá»­ pháº£n xáº¡ 3 phĂºt</span>
                </button>

                <button
                  onClick={onOpenCheatsheet}
                  className="px-4 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-semibold text-xs border border-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sá»• tay ká»‹ch báº£n</span>
                </button>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>KhĂ³a bĂ i tuáº§n tá»± (Chuáº©n $\ge$ 80%)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>PhĂ²ng thi báº¥m giá» Moon.vn</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cáº¥p chá»©ng chá»‰ Ä‘iá»‡n tá»­</span>
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
                    <span className="text-[11px] font-bold text-slate-600 ml-1">Lá»›p Há»c Trá»±c Tuyáº¿n RIN</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-blue-600 border border-emerald-200">
                    SĂ¡t háº¡ch chuáº©n hĂ³a
                  </span>
                </div>

                {/* Video Preview Box */}
                <div 
                  onClick={() => onSelectCourse(courses[0]?.id || 'bai-1', 'lecture')}
                  className="group relative aspect-video bg-slate-900 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center text-white shadow-inner"
                >
                  <div className="text-center space-y-2 transition-transform group-hover:scale-105 duration-200">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                      <PlayCircle className="w-7 h-7" />
                    </div>
                    <p className="text-xs font-bold text-slate-100">Báº¥m Ä‘á»ƒ vĂ o há»c ngay</p>
                    <span className="text-[10px] text-emerald-300">Video HD â€¢ KĂ¨m tĂ i liá»‡u PDF & Timestamp</span>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-300">
                    RIN-01 â€¢ 12 phĂºt
                  </div>
                </div>

                {/* Next Up Checklist Preview */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Lá»™ trĂ¬nh 6 chuyĂªn Ä‘á» sĂ¡t háº¡ch báº¯t buá»™c:
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
                              ? 'bg-emerald-100 text-blue-600' 
                              : unlocked 
                                ? 'bg-slate-200 text-slate-700' 
                                : 'bg-slate-200 text-slate-400'
                          }`}>
                            {isPassed ? 'âœ“' : i + 1}
                          </span>
                          <span className="font-semibold text-slate-800 truncate">
                            <span className="font-bold text-blue-600 mr-1.5">{code}:</span>
                            {c.title}
                          </span>
                        </div>
                        
                        <div className="shrink-0 ml-2">
                          {isPassed ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              ÄĂ£ Ä‘á»— {completedLessons[c.id]?.score}%
                            </span>
                          ) : unlocked ? (
                            <span className="text-[10px] font-bold text-blue-600 flex items-center">
                              VĂ o há»c <ChevronRight className="w-3 h-3 ml-0.5" />
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

      {/* 2. QUICK ACCESS DOCK (THANH 4 TIá»†N ĂCH TRá»ŒNG TĂ‚M - Gá»ŒN GĂ€NG, Äáº¸P Máº®T) */}
      <section className="py-6 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Dock 1: Thi Thá»­ 3 PhĂºt */}
            <button
              onClick={onOpenPracticeTest}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all flex items-center space-x-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 group-hover:bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 transition-colors">
                <Zap className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Thi Thá»­ 3 PhĂºt</h4>
                <p className="text-[11px] text-slate-500">3 cĂ¢u pháº£n xáº¡ nhanh</p>
              </div>
            </button>

            {/* Dock 2: Báº£ng VĂ ng Xáº¿p Háº¡ng */}
            <button
              onClick={onOpenLeaderboard}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all flex items-center space-x-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 text-blue-600 flex items-center justify-center shrink-0 transition-colors">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Báº£ng VĂ ng Thi Äua</h4>
                <p className="text-[11px] text-slate-500">Xáº¿p háº¡ng Best Seller</p>
              </div>
            </button>

            {/* Dock 3: Sá»• Tay Ká»‹ch Báº£n B2B */}
            <button
              onClick={onOpenCheatsheet}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all flex items-center space-x-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Sá»• Tay Ká»‹ch Báº£n</h4>
                <p className="text-[11px] text-slate-500">Script Ä‘á»‘i Ä‘Ă¡p khĂ¡ch hĂ ng</p>
              </div>
            </button>

            {/* Dock 4: Chá»©ng Chá»‰ SĂ¡t Háº¡ch */}
            <button
              onClick={onOpenCertificate}
              className={`p-4 rounded-xl border transition-all flex items-center space-x-3 text-left cursor-pointer group ${
                allPassed
                  ? 'bg-amber-50/60 border-amber-300 hover:shadow-xs'
                  : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-xs'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                allPassed ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-blue-600'
              }`}>
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  {allPassed ? 'Nháº­n Chá»©ng Chá»‰' : 'Chá»©ng Chá»‰ ÄĂ o Táº¡o'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {allPassed ? 'ÄĂ£ Ä‘á»§ Ä‘iá»u kiá»‡n cáº¥p' : 'Chuáº©n tá»‘t nghiá»‡p â‰¥ 80%'}
                </p>
              </div>
            </button>

          </div>
        </div>
      </section>

      {/* 3. TRá»ŒNG TĂ‚M: KHO CHUYĂN Äá»€ Há»ŒC Táº¬P (COURSE CATALOG & ROADMAP) */}
      <section id="khoa-hoc" className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Quick Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <span>Lá»˜ TRĂŒNH ÄĂ€O Táº O THá»°C CHIáº¾N</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                3 ChuyĂªn Ä‘á» nĂ¢ng táº§m nÄƒng lá»±c bĂ¡n hĂ ng B2B
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Báº¥m vĂ o chuyĂªn Ä‘á» Ä‘á»ƒ xem video bĂ i giáº£ng, táº£i cáº©m nang PDF vĂ  lĂ m bĂ i thi tráº¯c nghiá»‡m.
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
                placeholder="Lá»c mĂ£ (vd: RIN-01, giĂ¡, chá»‘t)..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  âœ•
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
                { bg: 'bg-emerald-50', text: 'text-blue-600', border: 'border-emerald-200', tag: 'CHáº¶NG 1 â€¢ Ná»€N Táº¢NG' },
                { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', tag: 'CHáº¶NG 2 â€¢ THá»°C CHIáº¾N' },
                { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', tag: 'CHáº¶NG 3 â€¢ Bá»¨T PHĂ' }
              ];
              const stage = stageColors[idx % stageColors.length];

              return (
                <div
                  key={course.id}
                  className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                    unlocked 
                      ? 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-md' 
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
                          <span>ÄĂ£ Ä‘á»— {userScore}%</span>
                        </span>
                      ) : unlocked ? (
                        <span className="text-[11px] font-bold text-blue-600 bg-emerald-50/80 px-2 py-0.5 rounded-full">
                          Sáºµn sĂ ng há»c
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" />
                          <span>Äang khĂ³a</span>
                        </span>
                      )}
                    </div>

                    {/* Module Title */}
                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                      <span className="text-blue-600 mr-1.5">{rinCode}:</span>
                      {course.title}
                    </h3>

                    {/* Module Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {course.summary?.keyPrinciples?.[0] || 
                       course.description || 
                       'Trang bá»‹ bá»™ cĂ´ng cá»¥ ká»¹ nÄƒng bĂ¡n hĂ ng B2B thá»±c chiáº¿n, cĂ¡c nguyĂªn táº¯c Ä‘Ă m phĂ¡n vĂ  giáº£i phĂ¡p xá»­ lĂ½ tĂ¬nh huá»‘ng nhanh.'}
                    </p>

                    {/* Specs / Meta */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Thá»i lÆ°á»£ng</span>
                        <strong className="text-slate-800 font-semibold">{course.duration || '15 phĂºt'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Sá»‘ cĂ¢u há»i</span>
                        <strong className="text-slate-800 font-semibold">{course.quiz?.length || 5} cĂ¢u</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Chuáº©n Ä‘á»—</span>
                        <strong className="text-blue-600 font-bold">â‰¥ {course.passingScore || 80}%</strong>
                      </div>
                    </div>

                  </div>

                  {/* Card Action Buttons (Direct 1-Click) */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
                    {unlocked ? (
                      <>
                        <button
                          onClick={() => onSelectCourse(course.id, 'lecture')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-[0_2px_10px_rgba(37,99,235,0.3)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>{isPassed ? 'Xem láº¡i bĂ i giáº£ng' : 'VĂ o há»c ngay'}</span>
                        </button>

                        <button
                          onClick={() => onSelectCourse(course.id, 'quiz')}
                          title="LĂ m bĂ i kiá»ƒm tra tráº¯c nghiá»‡m"
                          className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>LĂ m bĂ i thi</span>
                        </button>
                      </>
                    ) : (
                      <div className="w-full py-2.5 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-medium text-center flex items-center justify-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Cáº§n hoĂ n thĂ nh BĂ i {idx} (â‰¥80%) Ä‘á»ƒ má»Ÿ khĂ³a</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. PHĂ’NG THI SĂT Háº CH TRá»°C TUYáº¾N (EXAM ARENA SPOTLIGHT - PHONG CĂCH MOON.VN SANG TRá»ŒNG) */}
      <section className="py-12 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-lg border border-slate-800">
            
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-8 space-y-3 text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                  <span>PHĂ’NG THI SĂT Háº CH TRá»°C TUYáº¾N</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  PhĂ²ng Thi Tráº¯c Nghiá»‡m TĂ¬nh Huá»‘ng Sales Master
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Thiáº¿t káº¿ theo chuáº©n Moon.vn: LÆ°á»›i ma tráº­n 15 cĂ¢u há»i, Ä‘á»“ng há»“ Ä‘áº¿m ngÆ°á»£c tá»«ng giĂ¢y, 
                  nĂºt gáº¯n cá» phĂ¢n vĂ¢n, há»‡ thá»‘ng tá»± Ä‘á»™ng cháº¥m Ä‘iá»ƒm vĂ  lÆ°u lá»‹ch sá»­ lĂ m bĂ i (Attempt History).
                </p>

                {/* Features Pills */}
                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
                    â± Äáº¿m lĂ¹i 15 phĂºt
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
                    đŸ”¢ LÆ°á»›i ma tráº­n 1 - 15 cĂ¢u
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
                    đŸ¯ Äáº¡t chuáº©n â‰¥ 80% cáº¥p chá»©ng chá»‰
                  </span>
                </div>
              </div>

              {/* Action Column */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-2">
                <button
                  onClick={onOpenPracticeTest}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_4px_16px_rgba(37,99,235,0.32)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-white fill-white" />
                  <span>VĂ o phĂ²ng thi sĂ¡t háº¡ch ngay</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <span className="text-[11px] text-slate-400">
                  Miá»…n phĂ­ â€¢ Cháº¥m Ä‘iá»ƒm tá»± Ä‘á»™ng tá»©c thĂ¬
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. QUY TRĂŒNH Há»ŒC Táº¬P 3 BÆ¯á»C ÄÆ N GIáº¢N (HOW IT WORKS) */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            QUY TRĂŒNH TINH Gá»ŒN
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 mb-8">
            3 BÆ°á»›c dá»… dĂ ng Ä‘á»ƒ nĂ¢ng cáº¥p nÄƒng lá»±c bĂ¡n hĂ ng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-blue-600 font-black text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900">Xem video bĂ i giáº£ng 15 phĂºt</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Náº¯m vá»¯ng ká»‹ch báº£n Ä‘á»‘i thoáº¡i, báº¥m vĂ o cĂ¡c má»‘c thá»i gian (Timestamp) Ä‘á»ƒ tua nhanh pháº§n kiáº¿n thá»©c trá»ng tĂ¢m.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900">Thi tráº¯c nghiá»‡m Ä‘áº¡t â‰¥ 80%</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                LĂ m bĂ i thi tráº¯c nghiá»‡m tĂ¬nh huá»‘ng thá»±c táº¿. Äáº¡t Ä‘iá»ƒm má»Ÿ khĂ³a bĂ i há»c tiáº¿p theo vĂ  lÆ°u káº¿t quáº£ vĂ o há»“ sÆ¡.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900">Nháº­n chá»©ng chá»‰ & Thá»±c chiáº¿n</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ÄÆ°á»£c cáº¥p Chá»©ng chá»‰ tá»‘t nghiá»‡p Ä‘iá»‡n tá»­ chuáº©n doanh nghiá»‡p vĂ  Ă¡p dá»¥ng ngay ká»‹ch báº£n vĂ o cĂ¡c cuá»™c gá»i chá»‘t deal.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CLEAN ENTERPRISE FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>RIN Sales Academy â€¢ Ná»n Táº£ng ÄĂ o Táº¡o BĂ¡n HĂ ng Doanh Nghiá»‡p</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button onClick={onOpenPracticeTest} className="hover:text-white transition-colors cursor-pointer">
              Thi thá»­ 3 phĂºt
            </button>
            <button onClick={onOpenLeaderboard} className="hover:text-white transition-colors cursor-pointer">
              Báº£ng vĂ ng
            </button>
            <button onClick={onOpenCheatsheet} className="hover:text-white transition-colors cursor-pointer">
              Sá»• tay ká»‹ch báº£n
            </button>
            <button onClick={onOpenCertificate} className="hover:text-white transition-colors cursor-pointer">
              Chá»©ng chá»‰
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
