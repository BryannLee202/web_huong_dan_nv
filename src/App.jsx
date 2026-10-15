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
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import PracticeTestModal from './components/PracticeTestModal';
import { 
  PlayCircle, 
  FileCheck2, 
  ChevronRight, 
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [courses, setCourses] = useState([]);
  const [currentLessonId, setCurrentLessonId] = useState('');
  const [completedLessons, setCompletedLessons] = useState({});
  const [activeTab, setActiveTab] = useState('lecture'); // 'lecture' | 'quiz'
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard' | 'player'
  const [adminMode, setAdminMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasCompletedVideo, setHasCompletedVideo] = useState(false);

  // Modals state
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isPracticeTestOpen, setIsPracticeTestOpen] = useState(false);

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

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentLessonIndex = courses.findIndex(c => c.id === currentLessonId);
  const currentLesson = courses[currentLessonIndex] || courses[0];

  const allPassed = courses.length > 0 && courses.every(c => completedLessons[c.id]?.passed);

  const passedScores = courses
    .map(c => completedLessons[c.id]?.score)
    .filter(s => typeof s === 'number');
  const avgScore = passedScores.length > 0 
    ? Math.round(passedScores.reduce((a, b) => a + b, 0) / passedScores.length) 
    : 0;

  const hasNextLesson = currentLessonIndex < courses.length - 1;

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

  const handleNextLesson = () => {
    if (hasNextLesson) {
      const nextLesson = courses[currentLessonIndex + 1];
      setCurrentLessonId(nextLesson.id);
      setActiveTab('lecture');
      setHasCompletedVideo(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-[#007c5d] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold">Đang tải RIN LMS Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-[#007c5d] selection:text-white">
      
      {/* 1. TOP NAVBAR */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        allPassed={allPassed}
      />

      {/* 2. DYNAMIC VIEW CONTAINER */}
      
      {/* VIEW A: LANDING PAGE CHUẨN TALENTLMS & DUOLINGO */}
      {currentView === 'landing' && (
        <LandingPage
          onEnterLMS={() => setCurrentView('player')}
          onOpenPracticeTest={() => setIsPracticeTestOpen(true)}
          onSelectCourse={(id) => {
            setCurrentLessonId(id);
            setCurrentView('player');
            setActiveTab('lecture');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          courses={courses}
        />
      )}

      {/* VIEW B: LEARNER DASHBOARD */}
      {currentView === 'dashboard' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Dashboard
            courses={courses}
            completedLessons={completedLessons}
            onStartLesson={(id) => {
              setCurrentLessonId(id);
              setCurrentView('player');
              setActiveTab('lecture');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
          />
        </div>
      )}

      {/* VIEW C: 2-COLUMN TALENTLMS COURSE PLAYER */}
      {currentView === 'player' && (
        <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
          
          {/* LEFT COLUMN: SIDEBAR ROADMAP */}
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

          {/* RIGHT COLUMN: MAIN STAGE */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            
            {/* Breadcrumb & Lesson Title */}
            <div className="mb-5">
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1.5">
                <button 
                  onClick={() => setCurrentView('dashboard')} 
                  className="hover:text-slate-600 transition-colors cursor-pointer"
                >
                  Tổng quan
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[#007c5d] font-semibold">{currentLesson.category || 'Kỹ năng bán hàng'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-500">Bài {currentLessonIndex + 1}/{courses.length}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {currentLesson.title}
                </h1>

                {/* Status Pill */}
                <div className="shrink-0">
                  {completedLessons[currentLesson.id]?.passed ? (
                    <span className="inline-flex items-center text-xs font-bold text-[#007c5d] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Đã hoàn thành: {completedLessons[currentLesson.id]?.score}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      <PlayCircle className="w-3.5 h-3.5 mr-1.5 text-[#007c5d]" />
                      Đang học
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 mb-6 space-x-6 text-xs sm:text-sm font-semibold">
              <button
                onClick={() => setActiveTab('lecture')}
                className={`pb-3 flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'lecture'
                    ? 'border-[#007c5d] text-[#007c5d] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <PlayCircle className="w-4 h-4" />
                <span>Bài Giảng & Tóm Tắt</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`pb-3 flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'border-[#007c5d] text-[#007c5d] font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Kiểm Tra Sát Hạch ({currentLesson.quiz?.length || 0} câu)</span>
                {completedLessons[currentLesson.id]?.passed && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#007c5d] ml-1" />
                )}
              </button>
            </div>

            {/* TAB 1: VIDEO & TAKEAWAYS */}
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

            {/* TAB 2: QUIZ ENGINE */}
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
      )}

      {/* 3. MODALS */}
      <PracticeTestModal
        isOpen={isPracticeTestOpen}
        onClose={() => setIsPracticeTestOpen(false)}
        onStartFullCourse={() => {
          setIsPracticeTestOpen(false);
          setCurrentView('player');
          setActiveTab('lecture');
        }}
      />

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
