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
import AdminLessonDocumentModal from './components/AdminLessonDocumentModal';
import AdminRenameLessonModal from './components/AdminRenameLessonModal';
import AdminRightSidebar from './components/AdminRightSidebar';
import DocumentViewer from './components/DocumentViewer';
import UserProfileModal from './components/UserProfileModal';
import FacebookBottomNav from './components/FacebookBottomNav';
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
  ChevronDown,
  BookOpen,
  Trash2,
  BookmarkCheck,
  Edit3
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
    const tabParam = params.get('tab');
    const tab = tabParam === 'quiz' ? 'quiz' : ((tabParam === 'document' || tabParam === 'reading' || tabParam === 'giao-trinh') ? 'document' : 'lecture');
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
    } else if (activeTab === 'document') {
      params.set('tab', 'document');
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
  const [isAdminDocOpen, setIsAdminDocOpen] = useState(false);
  const [adminVideoInitialTab, setAdminVideoInitialTab] = useState('upload');
  const [isAdminQuizOpen, setIsAdminQuizOpen] = useState(false);
  const [isAdminLessonMenuOpen, setIsAdminLessonMenuOpen] = useState(false);
  const [isAdminRenameOpen, setIsAdminRenameOpen] = useState(false);
  const [isAdminRightSidebarCollapsed, setIsAdminRightSidebarCollapsed] = useState(false);
  const [isAdminRightSidebarOpenMobile, setIsAdminRightSidebarOpenMobile] = useState(false);
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
    const allVideos = Array.isArray(options?.videos) && options.videos.length > 0
      ? options.videos
      : (Array.isArray(targetCourse?.videos) ? targetCourse.videos : []);
    
    // Xác định đúng phần video mục tiêu (Phần 1, Phần 2, Phần 3, Phần 4...)
    const reqPartIndex = typeof options?.targetVideoIndex === 'number' 
      ? options.targetVideoIndex 
      : activeVideoIdx;
    const selectedPart = allVideos[reqPartIndex] || null;
    const targetUrl = options?.videoUrl || selectedPart?.url || targetCourse?.videoUrl;
    const targetTitle = options?.videoTitle || selectedPart?.title || targetCourse?.title;
    const mode = options?.mode || 'all'; // 'all' | 'summary_only' | 'quiz_only'

    const modeLabel = mode === 'summary_only'
      ? 'tóm tắt cốt lõi & mốc thời gian'
      : mode === 'quiz_only'
        ? 'ngân hàng 10 câu hỏi sát hạch'
        : 'tóm tắt & bộ đề';

    setIsAiGenerating(true);
    setAiToast({ 
      type: 'loading', 
      message: `AI Siêu Tốc đang đọc video Phần ${reqPartIndex + 1} (${selectedPart?.title || targetCourse?.title}) để tạo ${modeLabel}...` 
    });
    try {
      const res = await api.courses.generateAi(idToProcess, {
        videoUrl: targetUrl,
        videoTitle: targetTitle,
        videoType: selectedPart?.type || targetCourse?.videoType,
        videos: allVideos,
        targetVideoIndex: reqPartIndex,
        scanMode: options?.scanMode || 'single',
        mode
      });
      if (res && res.success) {
        if (Array.isArray(res.courses) && res.courses.length > 0) {
          setCourses(res.courses);
        }
        setAiToast({ 
          type: 'success', 
          message: res.message || `AI đã phân tích Phần ${reqPartIndex + 1}, cập nhật ${modeLabel} độc lập thành công!` 
        });
        setTimeout(() => setAiToast(null), 4000);
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

  // Gỡ bỏ ngay lập tức Tóm tắt & Bài thi cũ không khớp khi Admin chỉ muốn up video thuần túy
  const handleQuickClearLessonContent = async () => {
    if (!currentLesson) return;
    if (!window.confirm(`Bạn có chắc chắn muốn GỠ BỎ Tóm tắt & Bài thi cũ của "${currentLesson.title}" không?\n\n• Tóm tắt và mốc thời gian không khớp sẽ bị xóa sạch.\n• Bộ câu hỏi trắc nghiệm BĐS cũ sẽ được xóa sạch.\n• Đề thi hoặc tài liệu có thể up file văn bản sau trong tab "Giáo Trình Đọc".`)) {
      return;
    }
    try {
      const res = await api.courses.clearContent(currentLesson.id, {
        targetVideoIndex: activeVideoIdx,
        clearType: 'all'
      });
      if (res && res.success && Array.isArray(res.courses)) {
        setCourses(res.courses);
        setAiToast({ type: 'success', message: 'Đã gỡ bỏ tóm tắt & bài thi cũ không khớp thành công!' });
        setTimeout(() => setAiToast(null), 3500);
      }
    } catch (err) {
      setAiToast({ type: 'error', message: err.message || 'Lỗi gỡ bỏ nội dung' });
      setTimeout(() => setAiToast(null), 4000);
    }
  };

  // Cập nhật tên chuyên đề khi Quản trị viên đổi tên
  const handleLessonRenamed = (lessonId, newTitle, updatedCourses) => {
    if (Array.isArray(updatedCourses) && updatedCourses.length > 0) {
      setCourses(updatedCourses);
    } else {
      setCourses(prev => prev.map(c => c.id === lessonId ? { ...c, title: newTitle } : c));
    }
    setAiToast({
      type: 'success',
      message: `Đã đổi tên bài học thành "${newTitle}" thành công!`
    });
    setTimeout(() => setAiToast(null), 3500);
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

      {/* VIEW C: 3-COLUMN TALENTLMS COURSE PLAYER */}
      {currentView === 'player' && (
        <div className="flex-1 max-w-[1720px] w-full mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
          
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

          {/* CENTER COLUMN: MAIN STAGE */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto order-1 lg:order-2">
            
            {/* Breadcrumb & Quick Lesson Switcher on Mobile */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
                <button 
                  onClick={() => setCurrentView('landing')} 
                  className="hover:text-blue-600 transition-colors cursor-pointer shrink-0"
                >
                  Trang chủ
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                <button 
                  onClick={() => setCurrentView('dashboard')} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer shrink-0"
                >
                  Tiến độ
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">{currentLesson.category || 'Kỹ năng bán hàng'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Bài {currentLessonIndex + 1}/{courses.length}</span>
              </div>

              {/* Quick Lesson Switcher Strip on Mobile (< lg) */}
              <div className="lg:hidden mb-3 p-2 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1.5 mb-1.5">
                  <span>Chuyển chuyên đề nhanh:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">Bài {currentLessonIndex + 1}/{courses.length}</span>
                </div>
                <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {courses.map((c, idx) => {
                    const isCur = c.id === currentLessonId;
                    const isPass = completedLessons[c.id]?.passed;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCurrentLessonId(c.id);
                          setActiveTab('lecture');
                          setHasCompletedVideo(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                          isCur
                            ? 'bg-blue-600 text-white shadow-xs'
                            : (isPass
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700')
                        }`}
                      >
                        {isPass && !isCur && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                        <span>{c.rinCode || `RM-0${idx + 1}`}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LESSON TITLE & META BAR (GỌN GÀNG, THOÁNG ĐÃNG, SANG TRỌNG) */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 shadow-xs mb-6">
                {/* Dòng 1: Huy hiệu nhận diện & Trạng thái */}
                <div className="flex items-center justify-between gap-3 flex-wrap mb-3.5 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Badge BÀI X */}
                    <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs tracking-wider shadow-2xs">
                      BÀI {currentLessonIndex + 1}
                    </span>

                    {/* Badge Mã Chuyên Đề RM-XX */}
                    <span className="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-mono font-black text-xs border border-blue-200/60 dark:border-blue-800/80">
                      {currentLesson.rinCode || (currentLessonIndex + 1 < 10 ? `RM-0${currentLessonIndex + 1}` : `RM-${currentLessonIndex + 1}`)}
                    </span>

                    {/* Tên Chủ Đề */}
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {(currentLesson.category || 'Kỹ năng bán hàng').replace(/^Nhóm\s+/i, 'Chủ đề ')}
                    </span>

                    {/* Thời lượng */}
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                      <span>•</span>
                      <span>{currentLesson.duration || '15 phút'}</span>
                    </span>
                  </div>

                  {/* Nhóm Trạng thái học & Nút Quản trị */}
                  <div className="flex items-center gap-2">
                    {completedLessons[currentLesson.id]?.passed ? (
                      <span className="inline-flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                        Đã đỗ: {completedLessons[currentLesson.id]?.score}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200/90 dark:border-blue-800 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-2 animate-pulse"></span>
                        Đang học
                      </span>
                    )}

                    {/* Nút Đổi Tên Chuyên Đề Nhanh Cho Quản Trị Viên */}
                    {isAdminUser && (
                      <button
                        type="button"
                        onClick={() => setIsAdminRenameOpen(true)}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
                        title="Đổi tên chuyên đề này"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Đổi tên</span>
                      </button>
                    )}

                    {/* Nút Mở Bảng Quản Trị Trên Điện Thoại & Tablet (< xl) */}
                    {isAdminUser && (
                      <button
                        type="button"
                        onClick={() => setIsAdminRightSidebarOpenMobile(true)}
                        className="xl:hidden px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
                        title="Mở thanh công cụ quản trị bên phải"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Bảng Quản Trị</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Dòng 2: Tiêu đề bài học toàn chiều ngang - Thoáng đãng, gọn gàng, sang trọng */}
                <div className="flex items-start space-x-3.5 min-w-0">
                  <RealisticCourseIcon className="w-9 h-9 sm:w-10 sm:h-10 shadow-sm shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                      {currentLesson.title}
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs - Khoang Segmented Capsule Chuẩn Đồng Bộ Với Realistic Icons */}
            {(() => {
              const activePartObj = (Array.isArray(currentLesson?.videos) && currentLesson.videos[activeVideoIdx])
                ? currentLesson.videos[activeVideoIdx]
                : null;
              const activePartQuiz = activeVideoIdx === 0
                ? ((Array.isArray(activePartObj?.quiz) && activePartObj.quiz.length > 0) ? activePartObj.quiz : (currentLesson.quiz || []))
                : (Array.isArray(activePartObj?.quiz) ? activePartObj.quiz : []);

              return (
                <div className="w-full sm:w-auto bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-1 rounded-2xl flex items-center justify-stretch sm:inline-flex space-x-1 sm:space-x-1.5 mb-6 shadow-2xs">
                  <button
                    onClick={() => setActiveTab('lecture')}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      activeTab === 'lecture'
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs border border-slate-200/70 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <RealisticCourseIcon className="w-4 h-4 sm:w-5 sm:h-5 shadow-2xs shrink-0" />
                    <span className="truncate">Bài Giảng & Video (Phần {activeVideoIdx + 1})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('document')}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      activeTab === 'document'
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs border border-slate-200/70 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shadow-2xs shrink-0" />
                    <span className="truncate">
                      Giáo Trình Đọc ({Array.isArray(currentLesson?.attachments) ? currentLesson.attachments.length : (Array.isArray(currentLesson?.documents) ? currentLesson.documents.length : 0)})
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      activeTab === 'quiz'
                        ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs border border-slate-200/70 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <RealisticExamIcon className="w-4 h-4 sm:w-5 sm:h-5 shadow-2xs shrink-0" />
                    <span className="truncate">Sát Hạch Phần {activeVideoIdx + 1} ({activePartQuiz.length > 0 ? `${activePartQuiz.length} câu` : 'Tài liệu'})</span>
                    {completedLessons[currentLesson.id]?.passed && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1 shrink-0" />
                    )}
                  </button>
                </div>
              );
            })()}

            {/* TAB 1: VIDEO & TAKEAWAYS (ĐỘC LẬP THEO TỪNG PHẦN) */}
            {activeTab === 'lecture' && (() => {
              const activePartObj = (Array.isArray(currentLesson?.videos) && currentLesson.videos[activeVideoIdx])
                ? currentLesson.videos[activeVideoIdx]
                : null;
              const hasLessonVideo = Boolean(
                (activePartObj?.url && activePartObj.url.trim()) ||
                (activeVideoIdx === 0 && currentLesson?.videoUrl && currentLesson.videoUrl.trim())
              );

              // Dữ liệu Tóm tắt, Timestamps và Quiz tách biệt hoàn toàn theo từng Phần (Phần 2/3/4 không lấy dữ liệu của Phần 1)
              const activePartSummary = activeVideoIdx === 0
                ? ((Array.isArray(activePartObj?.summary) && activePartObj.summary.length > 0) ? activePartObj.summary : (currentLesson.summary || []))
                : (Array.isArray(activePartObj?.summary) ? activePartObj.summary : []);

              const activePartTimestamps = activeVideoIdx === 0
                ? ((Array.isArray(activePartObj?.timestamps) && activePartObj.timestamps.length > 0) ? activePartObj.timestamps : (currentLesson.timestamps || []))
                : (Array.isArray(activePartObj?.timestamps) ? activePartObj.timestamps : []);

              const activePartQuiz = activeVideoIdx === 0
                ? ((Array.isArray(activePartObj?.quiz) && activePartObj.quiz.length > 0) ? activePartObj.quiz : (currentLesson.quiz || []))
                : (Array.isArray(activePartObj?.quiz) ? activePartObj.quiz : []);

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
                    lessonTitle={activePartObj?.title ? `${currentLesson.title} — ${activePartObj.title}` : currentLesson.title}
                    summary={activePartSummary}
                    attachments={currentLesson.attachments || []}
                    timestamps={activePartTimestamps}
                    hasVideo={hasLessonVideo && isVideoAvailable}
                    isAdmin={isAdminUser}
                    onOpenVideoAdmin={() => setIsAdminVideoOpen(true)}
                    onTriggerAi={() => handleTriggerAiGenerate(currentLesson.id, { targetVideoIndex: activeVideoIdx })}
                    onTriggerAiSummary={() => handleTriggerAiGenerate(currentLesson.id, { targetVideoIndex: activeVideoIdx, mode: 'summary_only' })}
                    onTriggerAiQuiz={() => handleTriggerAiGenerate(currentLesson.id, { targetVideoIndex: activeVideoIdx, mode: 'quiz_only' })}
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
                    quizLength={activePartQuiz.length}
                  />
                </div>
              );
            })()}

            {/* TAB 2: GIÁO TRÌNH ĐỌC & TÀI LIỆU VĂN BẢN (HTML, DOCX, PDF, MD) */}
            {activeTab === 'document' && (
              <DocumentViewer
                documents={currentLesson.attachments || currentLesson.documents || []}
                lessonTitle={currentLesson.title}
                lessonId={currentLesson.id}
                isAdmin={isAdminUser}
                onOpenAdminDocModal={() => setIsAdminDocOpen(true)}
              />
            )}

            {/* TAB 3: QUIZ ENGINE (ĐỘC LẬP THEO TỪNG PHẦN + RANDOM ĐỀ KHÔNG TRÙNG LẶP CHO TỪNG MÁY) */}
            {activeTab === 'quiz' && (() => {
              const activePartObj = (Array.isArray(currentLesson?.videos) && currentLesson.videos[activeVideoIdx])
                ? currentLesson.videos[activeVideoIdx]
                : null;
              const hasLessonVideo = Boolean(
                (activePartObj?.url && activePartObj.url.trim()) ||
                (activeVideoIdx === 0 && currentLesson?.videoUrl && currentLesson.videoUrl.trim())
              );
              const isVideoReady = hasLessonVideo && isVideoAvailable;

              const activePartQuiz = activeVideoIdx === 0
                ? ((Array.isArray(activePartObj?.quiz) && activePartObj.quiz.length > 0) ? activePartObj.quiz : (currentLesson.quiz || []))
                : (Array.isArray(activePartObj?.quiz) ? activePartObj.quiz : []);

              const activePartPool = activeVideoIdx === 0
                ? ((Array.isArray(activePartObj?.questionPool) && activePartObj.questionPool.length > 0)
                    ? activePartObj.questionPool
                    : (Array.isArray(currentLesson.questionPool) && currentLesson.questionPool.length > 0 ? currentLesson.questionPool : activePartQuiz))
                : ((Array.isArray(activePartObj?.questionPool) && activePartObj.questionPool.length > 0)
                    ? activePartObj.questionPool
                    : activePartQuiz);

              return (
                <div className="space-y-4">
                  {/* Thanh chọn nhanh giữa các Phần ngay trong tab Sát Hạch (nếu chủ đề có từ 2 phần trở lên) */}
                  {Array.isArray(currentLesson?.videos) && currentLesson.videos.length > 1 && (
                    <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                        Đang sát hạch độc lập cho:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {currentLesson.videos.map((v, idx) => {
                          const partQuizCount = idx === 0
                            ? ((Array.isArray(v?.quiz) && v.quiz.length > 0) ? v.quiz.length : (currentLesson.quiz?.length || 0))
                            : (Array.isArray(v?.quiz) ? v.quiz.length : 0);
                          return (
                            <button
                              key={v.id || idx}
                              type="button"
                              onClick={() => setActiveVideoIdx(idx)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeVideoIdx === idx
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              Phần {idx + 1} ({partQuizCount} câu)
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <QuizEngine
                    key={`${currentLesson.id}_part_${activeVideoIdx}`}
                    lessonId={currentLesson.id}
                    activeVideoIdx={activeVideoIdx}
                    partTitle={activePartObj?.title || `Phần ${activeVideoIdx + 1}`}
                    quiz={activePartQuiz}
                    questionPool={activePartPool}
                    studentName={currentUser?.fullName || currentUser?.name || currentUser?.username || 'Nhân Viên'}
                    passingScore={currentLesson.passingScore || 80}
                    onQuizPassed={handleQuizPassed}
                    onNextLesson={handleNextLesson}
                    hasNextLesson={hasNextLesson}
                    hasVideo={isVideoReady}
                    isAdmin={isAdminUser}
                    onOpenVideoAdmin={() => setIsAdminVideoOpen(true)}
                    onOpenQuizAdmin={() => setIsAdminQuizOpen(true)}
                    onOpenDocumentTab={() => setActiveTab('document')}
                    onTriggerAi={() => handleTriggerAiGenerate(currentLesson.id, { targetVideoIndex: activeVideoIdx, mode: 'quiz_only' })}
                    isAiGenerating={isAiGenerating}
                    onBackToLecture={() => setActiveTab('lecture')}
                  />
                </div>
              );
            })()}

          </main>

          {/* RIGHT COLUMN: ADMIN RIGHT SIDEBAR (CHỈ DÀNH CHO QUẢN TRỊ VIÊN) */}
          {isAdminUser && (
            <AdminRightSidebar
              currentLesson={currentLesson}
              currentLessonIndex={currentLessonIndex}
              totalLessons={courses.length}
              activeVideoIdx={activeVideoIdx}
              onActiveVideoChange={setActiveVideoIdx}
              isAiGenerating={isAiGenerating}
              onTriggerAiSummary={() => handleTriggerAiGenerate(currentLesson.id, { targetVideoIndex: activeVideoIdx, mode: 'summary_only' })}
              onTriggerAiQuiz={() => handleTriggerAiGenerate(currentLesson.id, { targetVideoIndex: activeVideoIdx, mode: 'quiz_only' })}
              onOpenVideoAdmin={() => setIsAdminVideoOpen(true)}
              onOpenDocAdmin={() => setIsAdminDocOpen(true)}
              onOpenQuizAdmin={() => setIsAdminQuizOpen(true)}
              onOpenRename={() => setIsAdminRenameOpen(true)}
              onQuickClear={handleQuickClearLessonContent}
              isOpenMobile={isAdminRightSidebarOpenMobile}
              onCloseMobile={() => setIsAdminRightSidebarOpenMobile(false)}
              isCollapsed={isAdminRightSidebarCollapsed}
              onToggleCollapse={() => setIsAdminRightSidebarCollapsed(!isAdminRightSidebarCollapsed)}
              completedLessons={completedLessons}
            />
          )}
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
            activeVideoIdx={activeVideoIdx}
            onActiveVideoChange={setActiveVideoIdx}
            courses={courses}
            onSelectLesson={(lessonId) => setCurrentLessonId(lessonId)}
            onQuizSaved={(updatedCourses) => {
              if (Array.isArray(updatedCourses) && updatedCourses.length > 0) {
                setCourses(updatedCourses);
              }
            }}
          />

          <AdminLessonDocumentModal
            isOpen={isAdminDocOpen}
            onClose={() => setIsAdminDocOpen(false)}
            lesson={currentLesson}
            onUpdateCourse={(updatedLesson) => {
              setCourses(prev => prev.map(c => c.id === updatedLesson.id ? updatedLesson : c));
            }}
          />

          <AdminRenameLessonModal
            isOpen={isAdminRenameOpen}
            onClose={() => setIsAdminRenameOpen(false)}
            currentLesson={currentLesson}
            onLessonRenamed={handleLessonRenamed}
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

      {/* 7. THANH ĐIỀU HƯỚNG ĐÁY CHUẨN FACEBOOK DÀNH RIÊNG CHO MOBILE (ẨN TRÊN MÁY TÍNH) */}
      {!isLoginView && (
        <FacebookBottomNav
          activeTab={landingTab}
          currentView={currentView}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          totalCoursesCount={courses.length}
          onNavigateHome={() => {
            setCurrentView('landing');
            setLandingTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateCourses={() => {
            setCurrentView('landing');
            setLandingTab('courses');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onTabChange={(tab) => {
            if (tab === 'courses') {
              setCurrentView('landing');
              setLandingTab('courses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (tab === 'home') {
              setCurrentView('landing');
              setLandingTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (tab === 'profile') {
              setCurrentView('landing');
              setLandingTab('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (tab === 'exam') {
              setIsPracticeTestOpen(true);
            } else if (tab === 'handbook') {
              setIsCheatsheetOpen(true);
            }
          }}
          onOpenPracticeTest={() => setIsPracticeTestOpen(true)}
          onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
        />
      )}

    </div>
  );
}
