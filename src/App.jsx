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
import Dashboard from './components/Dashboard';
import PracticeTestModal from './components/PracticeTestModal';
import MascotBot from './components/MascotBot';
import MascotChatDrawer from './components/MascotChatDrawer';
import MapStudyTeacherPage from './components/MapStudyTeacherPage';
import MapStudyLoginPage from './components/MapStudyLoginPage';
import LoginModal from './components/LoginModal';
import NetworkStatusBanner from './components/NetworkStatusBanner';
import api from './services/api';
import defaultCoursesData from '../data/courses.json';
import { 
  PlayCircle, 
  FileCheck2, 
  ChevronRight, 
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [courses, setCourses] = useState(defaultCoursesData || []);
  const [currentLessonId, setCurrentLessonId] = useState(defaultCoursesData?.[0]?.id || 'bai-1');
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('rin_completed_lessons');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [activeTab, setActiveTab] = useState('lecture'); // 'lecture' | 'quiz'
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard' | 'player'
  const [searchQuery, setSearchQuery] = useState('');
  const [hasCompletedVideo, setHasCompletedVideo] = useState(false);
  const [seekTime, setSeekTime] = useState(null);

  // Modals state
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isPracticeTestOpen, setIsPracticeTestOpen] = useState(false);
  const [isMascotChatOpen, setIsMascotChatOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#dang-nhap' || window.location.hash === '#dang-ky';
    }
    return false;
  });
  const [loginMode, setLoginMode] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#dang-ky') {
      return 'register';
    }
    return 'login';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('mapstudy_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mapstudy_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && (parsed.name.toLowerCase() === 'nhanvien' || parsed.name.toLowerCase() === 'nhan_vien')) {
          parsed.name = 'Chuyên Viên Sale';
          parsed.role = 'pro_sales';
          try { localStorage.setItem('mapstudy_user', JSON.stringify(parsed)); } catch {}
        }
        return parsed;
      }
      return { name: 'Chuyên Viên Sale', email: 'nhanvien@runningman.vn', role: 'pro_sales' };
    } catch {
      return { name: 'Chuyên Viên Sale', email: 'nhanvien@runningman.vn', role: 'pro_sales' };
    }
  });
  const [adminMode, setAdminMode] = useState(() => {
    return currentUser?.role === 'pro_sales' || currentUser?.role === 'admin' || currentUser?.email === 'nhanvien@runningman.vn';
  });

  // Chế độ Ngày & Đêm (Light / Dark Theme)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('rmsa_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('rmsa_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Listen to browser hash navigation for #dang-nhap / #dang-ky
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#dang-nhap') {
        setIsLoginView(true);
        setLoginMode('login');
      } else if (window.location.hash === '#dang-ky') {
        setIsLoginView(true);
        setLoginMode('register');
      } else if (isLoginView && window.location.hash !== '#dang-nhap' && window.location.hash !== '#dang-ky') {
        setIsLoginView(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoginView]);

  // Load initial courses & progress qua centralized API Service (kèm offline cache)
  const loadData = React.useCallback(async () => {
    try {
      const fetchedCourses = await api.courses.getAll();
      if (Array.isArray(fetchedCourses) && fetchedCourses.length > 0) {
        setCourses(fetchedCourses);
        setCurrentLessonId(prev => prev || fetchedCourses[0].id);
      }

      const studentName = currentUser?.name || 'Nguyễn Văn A';
      const progressData = await api.progress.get(studentName);
      if (progressData && progressData.completedLessons) {
        const remoteCompleted = progressData.completedLessons || {};
        setCompletedLessons(prev => {
          const merged = { ...prev, ...remoteCompleted };
          try {
            localStorage.setItem('rin_completed_lessons', JSON.stringify(merged));
          } catch {}
          return merged;
        });
        if (progressData.currentLessonId) {
          setCurrentLessonId(prev => prev || progressData.currentLessonId);
        }
      }
    } catch (e) {
      console.warn('API fallback loading error:', e.message);
    }
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) {
        await loadData();
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const filteredCourses = courses.filter((c, idx) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const rinCode = (c.rinCode || `RIN-0${idx + 1}`).toLowerCase();
    const altCode = `rin-${idx + 1}`;
    return (
      c.title.toLowerCase().includes(q) ||
      (c.category && c.category.toLowerCase().includes(q)) ||
      rinCode.includes(q) ||
      altCode.includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

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
      localStorage.setItem('rin_completed_lessons', JSON.stringify(updated));
    } catch {}

    try {
      await api.progress.save(updated, lessonId, currentUser?.name || 'Nguyễn Văn A');
    } catch {
      console.warn('Backend offline, progress saved to localStorage safely');
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
        localStorage.removeItem('rin_completed_lessons');
      } catch {}
      try {
        await api.progress.reset(currentUser?.name || 'Nguyễn Văn A');
      } catch {}
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
      const res = await api.courses.saveAll(newCoursesList);
      if (res && res.success) {
        setCourses(newCoursesList);
        return true;
      }
    } catch {
      setCourses(newCoursesList);
      return true;
    }
    setCourses(newCoursesList);
    return true;
  };

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold">Đang tải RIN LMS Platform...</p>
        </div>
      </div>
    );
  }

  // GIAO DIỆN ĐĂNG NHẬP CHUẨN 100% MAPSTUDY (https://mapstudy.edu.vn/dang-nhap)
  if (isLoginView) {
    return (
      <>
        <NetworkStatusBanner />
        <MapStudyLoginPage
        theme={theme}
        onToggleTheme={toggleTheme}
        initialMode={loginMode}
        onBackToHome={() => {
          setIsLoginView(false);
          try {
            if (window.location.hash === '#dang-nhap' || window.location.hash === '#dang-ky') {
              window.history.pushState(null, '', window.location.pathname);
            }
          } catch {}
        }}
        onLoginSuccess={(user) => {
          setIsLoggedIn(true);
          setCurrentUser(user);
          setIsLoginView(false);
          try {
            if (window.location.hash === '#dang-nhap' || window.location.hash === '#dang-ky') {
              window.history.pushState(null, '', window.location.pathname);
            }
            localStorage.setItem('mapstudy_logged_in', 'true');
            localStorage.setItem('mapstudy_user', JSON.stringify(user));
          } catch {}
        }}
      />
      </>
    );
  }

  // GIAO DIỆN LÚC MỚI VÀO (CHƯA ĐĂNG NHẬP): GIAO DIỆN CHUẨN MAPSTUDY KÈM CỘT SIDEBAR VÀ CHỦ ĐỀ RUNNING MAN
  if (!isLoggedIn) {
    return (
      <>
        <NetworkStatusBanner />
        <MapStudyTeacherPage
          theme={theme}
          onToggleTheme={toggleTheme}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          courses={courses}
          onCoursesUpdated={(updated) => setCourses(updated)}
          onOpenLogin={(mode = 'login') => {
            setLoginMode(mode);
            setIsLoginView(true);
            try {
              window.history.pushState(null, '', mode === 'register' ? '#dang-ky' : '#dang-nhap');
            } catch {}
          }}
          onEnterApp={() => {
            setIsLoggedIn(true);
            try { localStorage.setItem('mapstudy_logged_in', 'true'); } catch {}
          }}
          onLogout={() => {
            setIsLoggedIn(false);
            try { localStorage.removeItem('mapstudy_logged_in'); } catch {}
          }}
          onOpenPracticeTest={() => setIsPracticeTestOpen(true)}
          onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onOpenFullScreen={() => {
            setIsLoginModalOpen(false);
            setLoginMode('login');
            setIsLoginView(true);
            try {
              window.history.pushState(null, '', '#dang-nhap');
            } catch {}
          }}
          onLoginSuccess={(user) => {
            setIsLoggedIn(true);
            setCurrentUser(user);
            try {
              localStorage.setItem('mapstudy_logged_in', 'true');
              localStorage.setItem('mapstudy_user', JSON.stringify(user));
            } catch {}
          }}
        />
        <PracticeTestModal
          isOpen={isPracticeTestOpen}
          onClose={() => setIsPracticeTestOpen(false)}
          onStartFullCourse={() => {
            setIsPracticeTestOpen(false);
            setIsLoggedIn(true);
            setCurrentView('player');
            setActiveTab('lecture');
          }}
        />
        <CheatsheetDrawer
          isOpen={isCheatsheetOpen}
          onClose={() => setIsCheatsheetOpen(false)}
        />
        <LeaderboardModal
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
          currentStudentName={currentUser?.name || "Nguyễn Văn A"}
          currentStudentScore={avgScore > 0 ? avgScore : 95}
        />
        <CertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          studentName={currentUser?.name || "Nguyễn Văn A"}
          avgScore={avgScore > 0 ? avgScore : 90}
          allPassed={allPassed}
        />
      </>
    );
  }

  // GIAO DIỆN SAU KHI ĐĂNG NHẬP: HỆ THỐNG ĐÀO TẠO & KHẢO SÁT NĂNG LỰC LMS
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      <NetworkStatusBanner />
      
      {/* 1. TOP NAVBAR (Chỉ hiển thị khi đang học hoặc xem Dashboard, tránh bị 2 thanh header chồng lên nhau khi ở Trang chủ) */}
      {currentView !== 'landing' && (
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          currentView={currentView}
          setCurrentView={setCurrentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          allPassed={allPassed}
          courses={courses}
          userName={currentUser?.name}
          userRole={currentUser?.role || (currentUser?.email === 'nhanvien@runningman.vn' ? 'pro_sales' : 'student')}
          onLogout={() => {
            setIsLoggedIn(false);
            try { localStorage.removeItem('mapstudy_logged_in'); } catch {}
          }}
          onSelectLesson={(id) => {
            setCurrentLessonId(id);
            setCurrentView('player');
            setActiveTab('lecture');
          }}
        />
      )}

      {/* 2. DYNAMIC VIEW CONTAINER */}
      
      {/* VIEW A: MAPSTUDY HOMEPAGE & TEACHER PORTAL */}
      {currentView === 'landing' && (
        <MapStudyTeacherPage
          theme={theme}
          onToggleTheme={toggleTheme}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          courses={courses}
          onCoursesUpdated={(updated) => setCourses(updated)}
          onOpenLogin={(mode = 'login') => {
            setLoginMode(mode);
            setIsLoginView(true);
            try {
              window.history.pushState(null, '', mode === 'register' ? '#dang-ky' : '#dang-nhap');
            } catch {}
          }}
          onEnterApp={() => {
            setCurrentView('player');
            setActiveTab('lecture');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectCourse={(id, tab = 'lecture') => {
            setCurrentLessonId(id);
            setCurrentView('player');
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPracticeTest={() => setIsPracticeTestOpen(true)}
          onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onLogout={() => {
            setIsLoggedIn(false);
            try { localStorage.removeItem('mapstudy_logged_in'); } catch {}
          }}
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
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
                <button 
                  onClick={() => setCurrentView('landing')} 
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Trang chủ
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                <button 
                  onClick={() => setCurrentView('dashboard')} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Tiến độ
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                <span className="text-blue-600 dark:text-blue-400 font-bold">{currentLesson.category || 'Kỹ năng bán hàng'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">Bài {currentLessonIndex + 1}/{courses.length}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {currentLesson.title}
                </h1>

                {/* Status Pill */}
                <div className="shrink-0">
                  {completedLessons[currentLesson.id]?.passed ? (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                      Đã hoàn thành: {completedLessons[currentLesson.id]?.score}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200/90 dark:border-blue-800 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-2 animate-pulse"></span>
                      Đang học
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs - Khoang Segmented Capsule chuẩn 100% Trang Chủ */}
            <div className="bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-1 rounded-2xl inline-flex items-center space-x-1.5 mb-6 shadow-2xs">
              <button
                onClick={() => setActiveTab('lecture')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'lecture'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <PlayCircle className={`w-4 h-4 ${activeTab === 'lecture' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span>Bài Giảng & Tóm Tắt</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <FileCheck2 className={`w-4 h-4 ${activeTab === 'quiz' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span>Kiểm Tra Sát Hạch ({currentLesson.quiz?.length || 0} câu)</span>
                {completedLessons[currentLesson.id]?.passed && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                )}
              </button>
            </div>

            {/* TAB 1: VIDEO & TAKEAWAYS */}
            {activeTab === 'lecture' && (
              <div className="space-y-6">
                <VideoPlayer
                  videoUrl={currentLesson.videoUrl}
                  title={currentLesson.title}
                  videos={currentLesson.videos || []}
                  onVideoEnded={() => setHasCompletedVideo(true)}
                  hasCompletedVideo={hasCompletedVideo}
                  setHasCompletedVideo={setHasCompletedVideo}
                  seekTime={seekTime}
                />

                <KeyTakeaways
                  summary={currentLesson.summary}
                  attachments={currentLesson.attachments || []}
                  timestamps={currentLesson.timestamps || []}
                  onSeekVideo={(secs) => {
                    setSeekTime(secs);
                    setTimeout(() => setSeekTime(null), 800);
                  }}
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

      {/* 3. FLOATING MASCOT & AI CHAT ASSISTANT (SEAL-STYLE) */}
      <MascotBot 
        onClick={() => setIsMascotChatOpen(true)} 
        isOpen={isMascotChatOpen} 
      />

      <MascotChatDrawer
        isOpen={isMascotChatOpen}
        onClose={() => setIsMascotChatOpen(false)}
      />

      {/* 4. MODALS */}
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
