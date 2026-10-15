import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoPlayer from './components/VideoPlayer';
import KeyTakeaways from './components/KeyTakeaways';
import QuizEngine from './components/QuizEngine';
import AdminModal from './components/AdminModal';
import CheatsheetDrawer from './components/CheatsheetDrawer';
import CertificateModal from './components/CertificateModal';
import LeaderboardModal from './components/LeaderboardModal';
import { 
  PlayCircle, 
  FileCheck2, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

export default function App() {
  const [courses, setCourses] = useState([]);
  const [currentLessonId, setCurrentLessonId] = useState('');
  const [completedLessons, setCompletedLessons] = useState({});
  const [activeTab, setActiveTab] = useState('lecture'); // 'lecture' | 'quiz'
  const [adminMode, setAdminMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasCompletedVideo, setHasCompletedVideo] = useState(false);

  // Modals state
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Load initial courses & progress
  const loadData = async () => {
    try {
      const resCourses = await fetch('/api/courses');
      const dataCourses = await resCourses.json();
      if (dataCourses.success && Array.isArray(dataCourses.courses)) {
        setCourses(dataCourses.courses);
        if (!currentLessonId && dataCourses.courses.length > 0) {
          setCurrentLessonId(dataCourses.courses[0].id);
        }
      }

      const resProgress = await fetch('/api/progress');
      const dataProgress = await resProgress.json();
      if (dataProgress.success && dataProgress.progress) {
        setCompletedLessons(dataProgress.progress.completedLessons || {});
        if (dataProgress.progress.currentLessonId && !currentLessonId) {
          setCurrentLessonId(dataProgress.progress.currentLessonId);
        }
      }
    } catch (e) {
      console.warn('Backend loading error or running standalone', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter courses based on search query
  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Find currently active lesson
  const currentLessonIndex = courses.findIndex(c => c.id === currentLessonId);
  const currentLesson = courses[currentLessonIndex] || courses[0];

  // Check if all lessons are passed for certificate
  const allPassed = courses.length > 0 && courses.every(c => completedLessons[c.id]?.passed);

  // Calculate average score for certificate & leaderboard
  const passedScores = courses
    .map(c => completedLessons[c.id]?.score)
    .filter(s => typeof s === 'number');
  const avgScore = passedScores.length > 0 
    ? Math.round(passedScores.reduce((a, b) => a + b, 0) / passedScores.length) 
    : 0;

  // Next lesson check
  const hasNextLesson = currentLessonIndex < courses.length - 1;

  // Handle Quiz Passed
  const handleQuizPassed = async (lessonId, score) => {
    const updated = {
      ...completedLessons,
      [lessonId]: {
        score,
        passed: true,
        completedAt: new Date().toISOString()
      }
    };
    setCompletedLessons(updated);

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedLessons: updated, currentLessonId: lessonId })
      });
    } catch (e) {
      console.error('Cannot save progress', e);
    }
  };

  // Handle Switch to Next Lesson
  const handleNextLesson = () => {
    if (hasNextLesson) {
      const nextLesson = courses[currentLessonIndex + 1];
      setCurrentLessonId(nextLesson.id);
      setActiveTab('lecture');
      setHasCompletedVideo(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle Reset Progress
  const handleResetProgress = async () => {
    if (window.confirm('Bạn có chắc muốn đặt lại toàn bộ tiến độ học và làm lại từ đầu để kiểm thử?')) {
      try {
        await fetch('/api/progress/reset', { method: 'POST' });
      } catch (e) {}
      setCompletedLessons({});
      if (courses.length > 0) {
        setCurrentLessonId(courses[0].id);
      }
      setActiveTab('lecture');
      setHasCompletedVideo(false);
    }
  };

  // Handle Save Courses (Admin)
  const handleSaveCourses = async (newCoursesList) => {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses: newCoursesList })
      });
      const data = await res.json();
      if (data.success) {
        setCourses(newCoursesList);
        return true;
      }
    } catch (e) {
      console.error('Lỗi lưu courses', e);
    }
    return false;
  };

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm">Đang tải hệ thống đào tạo RIN LMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. TOP HEADER */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        allPassed={allPassed}
        adminMode={adminMode}
        setAdminMode={setAdminMode}
      />

      {/* 2. TALENTLMS 2-COLUMN MAIN CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        
        {/* LEFT COLUMN: SIDEBAR ROADMAP & SEQUENCING */}
        <Sidebar
          courses={filteredCourses.length > 0 ? filteredCourses : courses}
          currentLessonId={currentLessonId}
          completedLessons={completedLessons}
          onSelectLesson={(id) => {
            setCurrentLessonId(id);
            setActiveTab('lecture');
            setHasCompletedVideo(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onResetProgress={handleResetProgress}
          adminMode={adminMode}
          setAdminMode={setAdminMode}
        />

        {/* RIGHT COLUMN: MAIN STAGE (VIDEO, SUMMARY, QUIZ) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* Breadcrumb & Lesson Title */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
              <span>Lộ trình đào tạo</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-emerald-400 font-semibold">{currentLesson.category || 'Kỹ năng bán hàng'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-300">Bài {currentLessonIndex + 1}/{courses.length}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentLesson.title}
              </h1>

              {/* Status Pill */}
              <div className="shrink-0">
                {completedLessons[currentLesson.id]?.passed ? (
                  <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    Đã hoàn thành: {completedLessons[currentLesson.id]?.score}%
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-semibold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                    <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                    Đang học
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Bài Giảng Video & Tóm Tắt vs Trắc Nghiệm Quiz) */}
          <div className="flex border-b border-slate-800 mb-6 space-x-3 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('lecture')}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'lecture'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Video Bài Giảng & Tóm Tắt Kịch Bản</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Làm Bài Kiểm Tra Trắc Nghiệm ({currentLesson.quiz?.length || 0} câu)</span>
              {completedLessons[currentLesson.id]?.passed && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
              )}
            </button>
          </div>

          {/* TAB 1: VIDEO PLAYER & KEY TAKEAWAYS */}
          {activeTab === 'lecture' && (
            <div className="space-y-6">
              <VideoPlayer
                videoUrl={currentLesson.videoUrl}
                title={currentLesson.title}
                onVideoEnded={() => setHasCompletedVideo(true)}
                hasCompletedVideo={hasCompletedVideo}
                setHasCompletedVideo={setHasCompletedVideo}
              />

              <KeyTakeaways
                summary={currentLesson.summary}
                onStartQuiz={() => {
                  setActiveTab('quiz');
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                passingScore={currentLesson.passingScore || 80}
                quizLength={currentLesson.quiz?.length || 0}
              />
            </div>
          )}

          {/* TAB 2: INTERACTIVE QUIZ ENGINE */}
          {activeTab === 'quiz' && (
            <QuizEngine
              key={currentLesson.id}
              lessonId={currentLesson.id}
              quiz={currentLesson.quiz || []}
              passingScore={currentLesson.passingScore || 80}
              onQuizPassed={handleQuizPassed}
              onNextLesson={handleNextLesson}
              hasNextLesson={hasNextLesson}
            />
          )}

        </main>
      </div>

      {/* 3. MODALS & DRAWERS */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        courses={courses}
        onSaveCourses={handleSaveCourses}
        onReloadCourses={loadData}
      />

      <CheatsheetDrawer
        isOpen={isCheatsheetOpen}
        onClose={() => setIsCheatsheetOpen(false)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        studentName="Nguyễn Văn A"
        avgScore={avgScore > 0 ? avgScore : 90}
        allPassed={allPassed}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentStudentName="Nguyễn Văn A"
        currentStudentScore={avgScore > 0 ? avgScore : 95}
      />

    </div>
  );
}
