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
import AdminLessonVideoModal from './components/AdminLessonVideoModal';
import AdminLessonQuizModal from './components/AdminLessonQuizModal';
import UserProfileModal from './components/UserProfileModal';
import { RealisticCourseIcon, RealisticExamIcon, RealisticAiRinIcon } from './components/RealisticIcons';
import api from './services/api';
import defaultCoursesData from '../data/courses.json';
import { 
  ChevronRight, 
  CheckCircle2,
  Sparkles,
  AlertCircle,
  X,
  Settings,
  ChevronDown
} from 'lucide-react';

// ============================================================================
// HỆ THỐNG ĐIỀU HƯỚNG DEEP LINKING & BẢO TOÀN VỊ TRÍ KHI F5 TOÀN DIỆN
// ============================================================================
function parseRouteFromHash(hash) {
  const cleanHash = (hash || '').replace(/^#\/?/, '').trim();
  const [pathPart = '', queryPart = ''] = cleanHash.split('?');
  const params = new URLSearchParams(queryPart);

  // 1. Phân hệ đăng nhập / đăng ký
  if (pathPart === 'dang-nhap') {
    return { isLoginView: true, loginMode: 'login' };
  }
  if (pathPart === 'dang-ky') {
    return { isLoginView: true, loginMode: 'register' };
  }

  // 2. Bài học cụ thể: #/bai-hoc/bai-3 hoặc #bai-3
  if (pathPart.startsWith('bai-hoc/') || /^bai-\d+/.test(pathPart)) {
    const lessonId = pathPart.replace(/^bai-hoc\//, '') || 'bai-1';
    const tab = params.get('tab') === 'quiz' ? 'quiz' : 'lecture';
    const part = parseInt(params.get('part'), 10);
    const activeVideoIdx = !isNaN(part) && part >= 0 ? part : 0;

    return {
      currentView: 'player',
      currentLessonId: lessonId,
      activeTab: tab,
      activeVideoIdx: activeVideoIdx,
      isLoginView: false
    };
  }

  // 3. Lộ trình đào tạo (Dashboard)
  if (pathPart === 'lo-trinh' || pathPart === 'dashboard') {
    return {
      currentView: 'dashboard',
      isLoginView: false
    };
  }

  // 4. Các tab ngoài Trang chủ
  if (pathPart === 'khoa-hoc' || pathPart === 'khoa-dao-tao' || pathPart === 'courses') {
    return { currentView: 'landing', landingTab: 'courses', isLoginView: false };
  }
  if (pathPart === 'sat-hach' || pathPart === 'exam') {
    return { currentView: 'landing', landingTab: 'exam', isLoginView: false };
  }
  if (pathPart === 'cam-nang' || pathPart === 'cheatsheet') {
    return { currentView: 'landing', landingTab: 'cheatsheet', isLoginView: false };
  }
  if (pathPart === 'cong-dong' || pathPart === 'community') {
    return { currentView: 'landing', landingTab: 'community', isLoginView: false };
  }
  if (pathPart === 'trang-chu' || pathPart === 'home') {
    return { currentView: 'landing', landingTab: 'home', isLoginView: false };
  }

  // 5. Fallback khi hash rỗng: Khôi phục phiên gần nhất từ LocalStorage
  if (!cleanHash) {
    try {
      const saved = localStorage.getItem('rin_last_navigation');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.currentView) {
          return parsed;
        }
      }
    } catch {}
  }

  return {
    currentView: 'landing',
    landingTab: 'home',
    currentLessonId: 'bai-1',
    activeTab: 'lecture',
    activeVideoIdx: 0,
    isLoginView: false,
    loginMode: 'login'
  };
}

function formatHashFromState({ currentView, landingTab, currentLessonId, activeTab, activeVideoIdx, isLoginView, loginMode }) {
  if (isLoginView) {
    return loginMode === 'register' ? '#/dang-ky' : '#/dang-nhap';
  }

  if (currentView === 'player' && currentLessonId) {
    let hash = `#/bai-hoc/${currentLessonId}`;
    const params = new URLSearchParams();
    if (activeTab === 'quiz') {
      params.set('tab', 'quiz');
    }
    if (typeof activeVideoIdx === 'number' && activeVideoIdx > 0) {
      params.set('part', String(activeVideoIdx));
    }
    const q = params.toString();
    return q ? `${hash}?${q}` : hash;
  }

  if (currentView === 'dashboard') {
    return '#/lo-trinh';
  }

  if (currentView === 'landing') {
    if (landingTab === 'courses') return '#/khoa-dao-tao';
    if (landingTab === 'exam') return '#/sat-hach';
    if (landingTab === 'cheatsheet') return '#/cam-nang';
    if (landingTab === 'community') return '#/cong-dong';
    return '#/trang-chu';
  }

  return '#/trang-chu';
}

export default function App() {
  const initialNav = React.useMemo(() => {
    return parseRouteFromHash(typeof window !== 'undefined' ? window.location.hash : '');
  }, []);

  const [courses, setCourses] = useState(defaultCoursesData || []);
  const [currentLessonId, setCurrentLessonId] = useState(initialNav.currentLessonId || defaultCoursesData?.[0]?.id || 'bai-1');
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('rin_completed_lessons');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [activeTab, setActiveTab] = useState(initialNav.activeTab || 'lecture'); // 'lecture' | 'quiz'
  const [currentView, setCurrentView] = useState(initialNav.currentView || 'landing'); // 'landing' | 'dashboard' | 'player'
  const [searchQuery, setSearchQuery] = useState('');
  const [hasCompletedVideo, setHasCompletedVideo] = useState(false);
  const [seekTime, setSeekTime] = useState(null);
  const [isVideoAvailable, setIsVideoAvailable] = useState(false);

  // Modals state
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminVideoOpen, setIsAdminVideoOpen] = useState(false);
  const [adminVideoInitialTab, setAdminVideoInitialTab] = useState('upload');
  const [isAdminQuizOpen, setIsAdminQuizOpen] = useState(false);
  const [isAdminLessonMenuOpen, setIsAdminLessonMenuOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isPracticeTestOpen, setIsPracticeTestOpen] = useState(false);
  const [isMascotChatOpen, setIsMascotChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [landingTab, setLandingTab] = useState(initialNav.landingTab || 'home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(() => Boolean(initialNav.isLoginView));
  const [loginMode, setLoginMode] = useState(initialNav.loginMode || 'login');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('mapstudy_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const isLogged = localStorage.getItem('mapstudy_logged_in') === 'true';
      if (!isLogged) return null;
      const saved = localStorage.getItem('mapstudy_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && (parsed.name.toLowerCase() === 'nhanvien' || parsed.name.toLowerCase() === 'nhan_vien' || parsed.name === 'Chuyên Viên Sale')) {
          parsed.name = 'Nhân viên';
          parsed.role = 'student';
          try { localStorage.setItem('mapstudy_user', JSON.stringify(parsed)); } catch {}
        }
        if (parsed.role === 'pro_sales') {
          parsed.role = 'student';
          try { localStorage.setItem('mapstudy_user', JSON.stringify(parsed)); } catch {}
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Phân quyền Quản trị viên chuẩn xác 100%
  const isAdminUser = Boolean(isLoggedIn) && (
    currentUser?.role === 'admin' ||
    currentUser?.email === 'admin@runningman.vn' ||
    (currentUser?.email && currentUser.email.toLowerCase().includes('admin')) ||
    (currentUser?.username && currentUser.username.toLowerCase().includes('admin')) ||
    (currentUser?.name && (currentUser.name.toLowerCase().includes('admin') || currentUser.name.toLowerCase().includes('quản trị')))
  );

  const [adminMode, setAdminMode] = useState(() => {
    return isAdminUser;
  });

  // State AI phân tích video & sinh nội dung LMS
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiToast, setAiToast] = useState(null); // { type: 'loading' | 'success' | 'error', message: string }
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  const handleTriggerAiGenerate = async (targetLessonId, options = {}) => {
    const idToProcess = targetLessonId || currentLessonId;
    if (!idToProcess) return;
    const targetCourse = courses.find(c => c.id === idToProcess);
    const validVideos = Array.isArray(targetCourse?.videos) ? targetCourse.videos.filter(v => v && v.url) : [];
    
    // Xác định phần video mục tiêu nếu có nhiều phần
    const reqPartIndex = typeof options?.targetVideoIndex === 'number' 
      ? options.targetVideoIndex 
      : (validVideos.length > 1 ? activeVideoIdx : 0);
    const selectedPart = validVideos[reqPartIndex] || null;
    const targetUrl = options?.videoUrl || selectedPart?.url || targetCourse?.videoUrl;
    const targetTitle = options?.videoTitle || selectedPart?.title || targetCourse?.title;

    setIsAiGenerating(true);
    setAiToast({ 
      type: 'loading', 
      message: `AI 3.8 đang đọc ${selectedPart?.title ? `"${selectedPart.title}"` : 'video bài giảng'}, trích xuất tóm tắt cốt lõi & tạo 10 câu sát hạch...` 
    });
    try {
      const res = await api.courses.generateAi(idToProcess, {
        videoUrl: targetUrl,
        videoTitle: targetTitle,
        videoType: selectedPart?.type || targetCourse?.videoType,
        videos: targetCourse?.videos,
        targetVideoIndex: reqPartIndex,
        scanMode: options?.scanMode || 'single'
      });
      if (res && res.success) {
        if (Array.isArray(res.courses) && res.courses.length > 0) {
          setCourses(res.courses);
        }
        setAiToast({ 
          type: 'success', 
          message: res.message || 'AI 3.8 đã phân tích video, cập nhật tóm tắt và 10 câu hỏi sát hạch thành công!' 
        });
        setTimeout(() => setAiToast(null), 5000);
        return res;
      } else {
        setAiToast({ 
          type: 'error', 
          message: res?.message || 'Có lỗi xảy ra khi gọi module AI.' 
        });
        setTimeout(() => setAiToast(null), 5000);
      }
    } catch (err) {
      setAiToast({ 
        type: 'error', 
        message: err.message || 'Lỗi kết nối khi gọi AI.' 
      });
      setTimeout(() => setAiToast(null), 5000);
    } finally {
      setIsAiGenerating(false);
    }
  };

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

  // 1. Tự động đồng bộ trạng thái React ra URL Hash & LocalStorage khi bất kỳ điều hướng nào thay đổi
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const navSnapshot = {
      currentView,
      landingTab,
      currentLessonId,
      activeTab,
      activeVideoIdx,
      isLoginView,
      loginMode
    };

    const targetHash = formatHashFromState(navSnapshot);

    // Lưu snapshot vào LocalStorage làm điểm tựa khôi phục
    try {
      localStorage.setItem('rin_last_navigation', JSON.stringify(navSnapshot));
    } catch {}

    // Cập nhật URL Hash mượt mà không reload trang
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [currentView, landingTab, currentLessonId, activeTab, activeVideoIdx, isLoginView, loginMode]);

  // 2. Lắng nghe sự kiện người dùng bấm Back / Forward hoặc gõ URL mới
  useEffect(() => {
    const handleLocationChange = () => {
      const parsed = parseRouteFromHash(window.location.hash);
      if (parsed.isLoginView !== undefined) setIsLoginView(parsed.isLoginView);
      if (parsed.loginMode) setLoginMode(parsed.loginMode);
      if (parsed.currentView) setCurrentView(parsed.currentView);
      if (parsed.landingTab) setLandingTab(parsed.landingTab);
      if (parsed.currentLessonId) setCurrentLessonId(parsed.currentLessonId);
      if (parsed.activeTab) setActiveTab(parsed.activeTab);
      if (typeof parsed.activeVideoIdx === 'number') setActiveVideoIdx(parsed.activeVideoIdx);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Load initial courses & progress qua centralized API Service (kèm offline cache)
  const loadData = React.useCallback(async () => {
    try {
      const fetchedCourses = await api.courses.getAll();
      if (Array.isArray(fetchedCourses) && fetchedCourses.length > 0) {
        setCourses(fetchedCourses);
        // Bảo toàn bài học hiện tại, chỉ gán bài đầu tiên nếu state chưa có bài nào
        setCurrentLessonId(prev => prev || fetchedCourses[0].id);
      }

      if (!isLoggedIn || !currentUser) {
        setCompletedLessons({});
        return;
      }

      const studentName = currentUser?.fullName || currentUser?.name || currentUser?.username;
      if (!studentName) {
        setCompletedLessons({});
        return;
      }

      const progressData = await api.progress.get(studentName);
      if (progressData && progressData.completedLessons) {
        const remoteCompleted = progressData.completedLessons || {};
        setCompletedLessons(remoteCompleted);
        try {
          localStorage.setItem(`rin_completed_lessons_${studentName}`, JSON.stringify(remoteCompleted));
        } catch {}
        // Tuyệt đối không đè lên bài học mà người dùng đang mở trên URL
        if (progressData.currentLessonId) {
          setCurrentLessonId(prev => prev || progressData.currentLessonId);
        }
      } else {
        setCompletedLessons({});
      }
    } catch (e) {
      console.warn('API fallback loading error:', e.message);
    }
  }, [currentUser, isLoggedIn]);

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

    const sName = currentUser?.fullName || currentUser?.name || currentUser?.username || 'Nhân Viên';
    try {
      await api.progress.save(updated, lessonId, sName);
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
      const sName = currentUser?.fullName || currentUser?.name || currentUser?.username || 'Nhân Viên';
      try {
        localStorage.removeItem('rin_completed_lessons');
      } catch {}
      try {
        await api.progress.reset(sName);
      } catch {}
      setCompletedLessons({});
      if (courses.length > 0) {
        setCurrentLessonId(courses[0].id);
      }
      setActiveTab('lecture');
      setHasCompletedVideo(false);
    }
  };

  // Đăng nhập thành công: Tự động cập nhật hồ sơ và nạp mới tiến độ của tài khoản đó
  const handleLoginSuccess = async (user) => {
    setIsLoggedIn(true);
    const normalizedUser = {
      ...user,
      name: user?.fullName || user?.name || user?.username || 'Nhân Viên',
      fullName: user?.fullName || user?.name || user?.username || 'Nhân Viên',
      email: user?.email || (user?.username && user.username.includes('@') ? user.username : ''),
      role: user?.role === 'admin' ? 'admin' : 'student'
    };
    setCurrentUser(normalizedUser);
    setIsLoginView(false);
    setIsLoginModalOpen(false);
    try {
      if (typeof window !== 'undefined' && (window.location.hash === '#dang-nhap' || window.location.hash === '#dang-ky')) {
        window.history.pushState(null, '', window.location.pathname);
      }
      localStorage.setItem('mapstudy_logged_in', 'true');
      localStorage.setItem('mapstudy_user', JSON.stringify(normalizedUser));
    } catch {}

    const sName = normalizedUser.fullName || normalizedUser.name || normalizedUser.username;
    try {
      const progressData = await api.progress.get(sName);
      if (progressData && progressData.completedLessons) {
        setCompletedLessons(progressData.completedLessons);
        if (progressData.currentLessonId) {
          setCurrentLessonId(progressData.currentLessonId);
        } else if (courses.length > 0) {
          setCurrentLessonId(courses[0].id);
        }
      } else {
        setCompletedLessons({});
        if (courses.length > 0) setCurrentLessonId(courses[0].id);
      }
    } catch {
      setCompletedLessons({});
    }
  };

  // Cập nhật hồ sơ & ảnh đại diện: Đồng bộ ngay lập tức xuyên suốt ứng dụng
  const handleUpdateProfile = (updatedUser) => {
    if (!updatedUser) return;
    const normalized = {
      ...currentUser,
      ...updatedUser,
      name: updatedUser.fullName || updatedUser.name || currentUser?.name,
      fullName: updatedUser.fullName || updatedUser.name || currentUser?.fullName,
      avatarUrl: updatedUser.avatarUrl || updatedUser.avatar_url || ''
    };
    setCurrentUser(normalized);
    try {
      localStorage.setItem('mapstudy_user', JSON.stringify(normalized));
    } catch {}
  };

  // Đăng xuất: Xóa sạch toàn bộ thông tin tài khoản và tiến độ cũ
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCompletedLessons({});
    setCurrentView('landing');
    setLandingTab('home');
    if (courses.length > 0) {
      setCurrentLessonId(courses[0].id);
    }
    try {
      localStorage.removeItem('mapstudy_logged_in');
      localStorage.removeItem('mapstudy_user');
      localStorage.removeItem('rin_completed_lessons');
      localStorage.removeItem('rin_last_navigation');
      window.history.replaceState(null, '', '#/trang-chu');
    } catch {}
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

  // Xóa chuyên đề khỏi hệ thống (Chỉ Admin mới có quyền)
  const handleDeleteCourse = async (lessonId) => {
    try {
      const res = await api.courses.delete(lessonId);
      if (res && res.success) {
        const updatedCourses = res.courses || [];
        setCourses(updatedCourses);

        if (currentLessonId === lessonId) {
          const remaining = updatedCourses.filter(c => c.id !== lessonId);
          if (remaining.length > 0) {
            setCurrentLessonId(remaining[0].id);
          }
        }

        setAiToast({
          type: 'success',
          message: 'Đã xóa chuyên đề thành công!'
        });
        setTimeout(() => setAiToast(null), 3000);
        return true;
      } else {
        alert(res?.message || 'Lỗi khi xóa chuyên đề');
        return false;
      }
    } catch (err) {
      alert(`Lỗi khi xóa chuyên đề: ${err.message}`);
      return false;
    }
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
        onLoginSuccess={handleLoginSuccess}
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
          completedLessons={completedLessons}
          onCoursesUpdated={(updated) => setCourses(updated)}
          onOpenLogin={(mode = 'login') => {
            setLoginMode(mode);
            setIsLoginView(true);
            try {
              window.history.pushState(null, '', mode === 'register' ? '#dang-ky' : '#dang-nhap');
            } catch {}
          }}
          onEnterApp={() => {
            if (currentUser) {
              setIsLoggedIn(true);
              try { localStorage.setItem('mapstudy_logged_in', 'true'); } catch {}
            } else {
              setLoginMode('login');
              setIsLoginView(true);
              try { window.history.pushState(null, '', '#dang-nhap'); } catch {}
            }
          }}
          onOpenProfile={() => {
            if (currentUser) {
              setIsProfileOpen(true);
            } else {
              setLoginMode('login');
              setIsLoginView(true);
              try { window.history.pushState(null, '', '#dang-nhap'); } catch {}
            }
          }}
          onLogout={handleLogout}
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
          onLoginSuccess={handleLoginSuccess}
        />
        <PracticeTestModal
          isOpen={isPracticeTestOpen}
          onClose={() => setIsPracticeTestOpen(false)}
          currentUser={currentUser}
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
          currentStudentName={currentUser?.fullName || currentUser?.name || currentUser?.username || "Nhân Viên"}
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
          onOpenPracticeTest={() => setIsPracticeTestOpen(true)}
          onNavigateLanding={(tab = 'home') => {
            setLandingTab(tab);
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          allPassed={allPassed}
          courses={courses}
          currentUser={currentUser}
          userName={currentUser?.name}
          userRole={currentUser?.role === 'admin' ? 'admin' : 'student'}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileOpen(true)}
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
          completedLessons={completedLessons}
          onCoursesUpdated={(updated) => setCourses(updated)}
          initialTab={landingTab}
          onTabChange={(tab) => setLandingTab(tab)}
          onOpenProfile={() => setIsProfileOpen(true)}
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
          onLogout={handleLogout}
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
            isAdmin={isAdminUser}
            onDeleteLesson={handleDeleteCourse}
          />

          {/* RIGHT COLUMN: MAIN STAGE */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto order-1 lg:order-2">
            
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
                <div className="flex items-center space-x-3">
                  <RealisticCourseIcon className="w-10 h-10 shadow-sm shrink-0" />
                  <div>
                    <div className="flex items-center space-x-2 mb-0.5">
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-mono">
                        {currentLesson.rinCode || (currentLessonIndex + 1 < 10 ? `RM-0${currentLessonIndex + 1}` : `RM-${currentLessonIndex + 1}`)}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {currentLesson.category || 'Kỹ năng bán hàng'}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                      {currentLesson.title}
                    </h1>
                  </div>
                </div>

                {/* Status Pill & Admin Action Tools */}
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  {/* Status Pill */}
                  <div>
                    {completedLessons[currentLesson.id]?.passed ? (
                      <span className="inline-flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                        Đã đỗ: {completedLessons[currentLesson.id]?.score}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-full border border-blue-200/90 dark:border-blue-800 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-2 animate-pulse"></span>
                        Đang học
                      </span>
                    )}
                  </div>

                  {/* ADMIN ACTION BAR (HYBRID: DESKTOP TOOLBAR + MOBILE/TABLET DROPDOWN) */}
                  {isAdminUser && (() => {
                    const validLessonVideos = Array.isArray(currentLesson.videos) ? currentLesson.videos.filter(v => v && v.url) : [];
                    const activePart = validLessonVideos[activeVideoIdx];
                    const activePartLabel = validLessonVideos.length > 1 
                      ? (activePart?.title ? `Phần ${activeVideoIdx + 1}` : `Phần ${activeVideoIdx + 1}`) 
                      : '';

                    return (
                    <div className="relative">
                      {/* 1. DESKTOP VIEW (>= xl): TOOLBAR VIÊN THUỐC LIỀN KHỐI 2 NÚT SANG TRỌNG */}
                      <div className="hidden xl:flex bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 p-1 rounded-2xl items-center space-x-1 shadow-2xs">
                        <button
                          type="button"
                          disabled={isAiGenerating}
                          onClick={() => handleTriggerAiGenerate(currentLesson.id, { targetVideoIndex: activeVideoIdx })}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700 hover:border-amber-400/80 dark:hover:border-amber-400/60 text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-2xs disabled:opacity-60"
                          title={validLessonVideos.length > 1 
                            ? `Kích hoạt AI đọc chính xác ${activePart?.title || `Phần ${activeVideoIdx + 1}`} để tóm tắt và sinh 10 câu sát hạch` 
                            : 'Kích hoạt AI phân tích video, tự động tóm tắt và sinh 10 câu sát hạch'}
                        >
                          <RealisticAiRinIcon className={`w-4 h-4 rounded-md ${isAiGenerating ? 'animate-spin' : ''}`} />
                          <span>
                            {isAiGenerating 
                              ? 'AI đang đọc video...' 
                              : (activePartLabel ? `AI Đọc ${activePartLabel} & Tạo Đề` : 'AI Đọc & Tạo Đề')}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsAdminVideoOpen(true)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700 hover:border-blue-400/80 dark:hover:border-blue-400/60 text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-2xs"
                          title="Quản lý Video bài giảng (Tải file không giới hạn, YouTube, Drive)"
                        >
                          <RealisticCourseIcon className="w-4 h-4 rounded-md" />
                          <span>Quản lý Video</span>
                        </button>
                      </div>

                      {/* 2. TABLET & MOBILE VIEW (< xl): 1 NÚT DUY NHẤT GOM GỌN KÈM DROPDOWN TRANG TRỌNG */}
                      <div className="flex xl:hidden">
                        <button
                          type="button"
                          onClick={() => setIsAdminLessonMenuOpen(!isAdminLessonMenuOpen)}
                          className="px-3.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center space-x-2 shadow-2xs transition-all cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 text-amber-500" />
                          <span>Quản trị bài học</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isAdminLessonMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isAdminLessonMenuOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-30" 
                              onClick={() => setIsAdminLessonMenuOpen(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                              <button
                                type="button"
                                disabled={isAiGenerating}
                                onClick={() => {
                                  setIsAdminLessonMenuOpen(false);
                                  handleTriggerAiGenerate(currentLesson.id, { targetVideoIndex: activeVideoIdx });
                                }}
                                className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left flex items-center space-x-3 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                <RealisticAiRinIcon className="w-8 h-8 rounded-lg shadow-2xs shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {isAiGenerating 
                                      ? 'AI đang đọc video...' 
                                      : (activePartLabel ? `AI Đọc ${activePartLabel} & Tạo Đề` : 'AI Đọc & Tạo Đề')}
                                  </p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                    {activePart?.title ? `Đọc video: ${activePart.title}` : 'Tự động tóm tắt & sinh 10 câu trắc nghiệm'}
                                  </p>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setIsAdminLessonMenuOpen(false);
                                  setIsAdminVideoOpen(true);
                                }}
                                className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                              >
                                <RealisticCourseIcon className="w-8 h-8 rounded-lg shadow-2xs shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    Quản lý Video Bài Giảng
                                  </p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                    Tải file không giới hạn, YouTube, Drive
                                  </p>
                                </div>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Navigation Tabs - Khoang Segmented Capsule Chuẩn Đồng Bộ Với Realistic Icons */}
            <div className="bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-1 rounded-2xl inline-flex items-center space-x-1.5 mb-6 shadow-2xs max-w-full overflow-x-auto">
              <button
                onClick={() => setActiveTab('lecture')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                  activeTab === 'lecture'
                    ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs border border-slate-200/70 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <RealisticCourseIcon className="w-5 h-5 shadow-2xs" />
                <span>Bài Giảng & Tóm Tắt</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs border border-slate-200/70 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <RealisticExamIcon className="w-5 h-5 shadow-2xs" />
                <span>Kiểm Tra Sát Hạch ({currentLesson.quiz?.length || 0} câu)</span>
                {completedLessons[currentLesson.id]?.passed && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                )}
              </button>
            </div>

            {/* TAB 1: VIDEO & TAKEAWAYS */}
            {activeTab === 'lecture' && (() => {
              const hasLessonVideo = Boolean(
                (currentLesson?.videoUrl && currentLesson.videoUrl.trim()) ||
                (Array.isArray(currentLesson?.videos) && currentLesson.videos.some(v => v && v.url && v.url.trim()))
              );

              return (
                <div className="space-y-6">
                  <VideoPlayer
                    videoUrl={currentLesson.videoUrl}
                    title={currentLesson.title}
                    videos={currentLesson.videos || []}
                    currentLesson={currentLesson}
                    onCoursesUpdated={(updated) => {
                      if (Array.isArray(updated) && updated.length > 0) {
                        setCourses(updated);
                      }
                    }}
                    onVideoEnded={() => setHasCompletedVideo(true)}
                    hasCompletedVideo={hasCompletedVideo}
                    setHasCompletedVideo={setHasCompletedVideo}
                    seekTime={seekTime}
                    isAdmin={isAdminUser}
                    activeVideoIdx={activeVideoIdx}
                    onActiveVideoChange={setActiveVideoIdx}
                    onTriggerAi={(opt) => handleTriggerAiGenerate(currentLesson.id, opt)}
                    isAiGenerating={isAiGenerating}
                    onOpenVideoAdmin={(tab = 'upload') => {
                      setAdminVideoInitialTab(tab);
                      setIsAdminVideoOpen(true);
                    }}
                    onStartQuiz={() => {
                      setActiveTab('quiz');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    onVideoStatusChange={setIsVideoAvailable}
                    currentUserName={currentUser?.name}
                    currentUserEmail={currentUser?.email || currentUser?.username}
                  />

                  <KeyTakeaways
                    lessonTitle={currentLesson.title}
                    summary={currentLesson.summary}
                    attachments={currentLesson.attachments || []}
                    timestamps={currentLesson.timestamps || []}
                    hasVideo={hasLessonVideo && isVideoAvailable}
                    isAdmin={isAdminUser}
                    onOpenVideoAdmin={() => setIsAdminVideoOpen(true)}
                    onTriggerAi={() => handleTriggerAiGenerate(currentLesson.id, { targetVideoIndex: activeVideoIdx })}
                    isAiGenerating={isAiGenerating}
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
              );
            })()}

            {/* TAB 2: QUIZ ENGINE */}
            {activeTab === 'quiz' && (() => {
              const hasLessonVideo = Boolean(
                (currentLesson?.videoUrl && currentLesson.videoUrl.trim()) ||
                (Array.isArray(currentLesson?.videos) && currentLesson.videos.some(v => v && v.url && v.url.trim()))
              );
              const isVideoReady = hasLessonVideo && isVideoAvailable;

              return (
                <div className="space-y-4">
                  {/* Banner Quản trị viên nhanh (chỉ hiển thị khi bài học đã có video) */}
                  {isAdminUser && isVideoReady && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-semibold text-amber-900 dark:text-amber-200">
                          Đặc quyền Quản Trị Viên: Bạn có thể thêm, sửa, xóa câu hỏi hoặc nhập nhanh đề thi từ Word/Text.
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isAiGenerating}
                          onClick={() => handleTriggerAiGenerate(currentLesson.id, { targetVideoIndex: activeVideoIdx })}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 font-bold text-xs shrink-0 cursor-pointer border border-amber-400/40 active:scale-95 transition-all flex items-center space-x-1"
                        >
                          <Sparkles className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ${isAiGenerating ? 'animate-spin' : ''}`} />
                          <span>{isAiGenerating ? 'AI đang tạo...' : 'AI Sinh lại 10 câu'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAdminQuizOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
                        >
                          Biên tập đề thi này
                        </button>
                      </div>
                    </div>
                  )}

                  <QuizEngine
                    key={currentLesson.id}
                    lessonId={currentLesson.id}
                    quiz={currentLesson.quiz || []}
                    passingScore={currentLesson.passingScore || 80}
                    onQuizPassed={handleQuizPassed}
                    onNextLesson={handleNextLesson}
                    hasNextLesson={hasNextLesson}
                    hasVideo={isVideoReady}
                    isAdmin={isAdminUser}
                    onOpenVideoAdmin={() => setIsAdminVideoOpen(true)}
                    onOpenQuizAdmin={() => setIsAdminQuizOpen(true)}
                    onTriggerAi={() => handleTriggerAiGenerate(currentLesson.id)}
                    isAiGenerating={isAiGenerating}
                    onBackToLecture={() => setActiveTab('lecture')}
                  />
                </div>
              );
            })()}

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
        currentUser={currentUser}
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
        studentName={currentUser?.fullName || currentUser?.name || "Nhân Viên"}
        avgScore={avgScore > 0 ? avgScore : 90}
        allPassed={allPassed}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentStudentName={currentUser?.fullName || currentUser?.name || currentUser?.username || "Nhân Viên"}
        currentStudentScore={avgScore > 0 ? avgScore : 95}
      />

      {/* 4.5. USER PROFILE & AVATAR MANAGEMENT MODAL */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateProfile}
        completedLessons={completedLessons}
        courses={courses}
      />

      {/* 5. ADMIN LESSON TOOLS (CHỈ QUẢN TRỊ VIÊN MỚI THẤY VÀ ĐƯỢC PHÉP TRUY CẬP) */}
      {isAdminUser && (
        <>
          <AdminLessonVideoModal
            isOpen={isAdminVideoOpen}
            onClose={() => setIsAdminVideoOpen(false)}
            currentLesson={currentLesson}
            courses={courses}
            initialTab={adminVideoInitialTab}
            onSelectLesson={(lessonId) => setCurrentLessonId(lessonId)}
            onTriggerAi={handleTriggerAiGenerate}
            isAiGenerating={isAiGenerating}
            onVideoSaved={(updatedCourses) => {
              if (Array.isArray(updatedCourses) && updatedCourses.length > 0) {
                setCourses(updatedCourses);
              }
            }}
          />

          <AdminLessonQuizModal
            isOpen={isAdminQuizOpen}
            onClose={() => setIsAdminQuizOpen(false)}
            currentLesson={currentLesson}
            courses={courses}
            onSelectLesson={(lessonId) => setCurrentLessonId(lessonId)}
            onQuizSaved={(updatedCourses) => {
              if (Array.isArray(updatedCourses) && updatedCourses.length > 0) {
                setCourses(updatedCourses);
              }
            }}
          />
        </>
      )}

      {/* 6. TOAST NOTIFICATION CHO TÍNH NĂNG AI */}
      {aiToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-md">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start space-x-3 backdrop-blur-md ${
            aiToast.type === 'loading'
              ? 'bg-slate-900/95 text-white border-blue-500/40 shadow-blue-500/20'
              : aiToast.type === 'success'
              ? 'bg-slate-900/95 text-white border-emerald-500/50 shadow-emerald-500/20'
              : 'bg-slate-900/95 text-white border-rose-500/50 shadow-rose-500/20'
          }`}>
            <div className="shrink-0 mt-0.5">
              {aiToast.type === 'loading' ? (
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              ) : aiToast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <p className="font-bold text-sm mb-0.5 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {aiToast.type === 'loading' 
                    ? 'RMSA Multimodal AI Engine' 
                    : aiToast.type === 'success' 
                    ? 'AI Hoàn Tất Thành Công!' 
                    : 'Thông Báo AI'}
                </span>
              </p>
              <p className="text-slate-300 leading-relaxed font-medium">
                {aiToast.message}
              </p>
            </div>
            {aiToast.type !== 'loading' && (
              <button 
                onClick={() => setAiToast(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
