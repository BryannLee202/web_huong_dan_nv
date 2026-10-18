import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Award,
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Star, 
  X,
  Play,
  Check,
  LogOut,
  Plus,
  Menu,
  GraduationCap,
  Trophy,
  Target,
  Flame,
  Zap,
  RefreshCw,
  Shuffle,
  Bot,
  ArrowUp,
  MapPin,
  Camera
} from 'lucide-react';
import { 
  RealisticCourseIcon,
  RealisticExamIcon,
  RealisticArenaIcon,
  RealisticBookIcon,
  RealisticFolderIcon,
  RealisticForumIcon,
  RealisticCommunityIcon,
  RealisticTrophyIcon,
  RealisticCertificateIcon,
  RealisticAiRinIcon,
  RealisticSecurityIcon,
  RealisticRealEstateIcon,
  RealisticFacebookIcon,
  RealisticYoutubeIcon,
  RealisticTiktokIcon
} from './RealisticIcons';
import ThemeToggle from './ThemeToggle';
import InternalCommunityTab from './InternalCommunityTab';
import CreateCourseModal from './CreateCourseModal';
import { getRandomScenario } from '../../data/scenariosBank';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { loadDailyStreak, recordCorrectDailyScenario, resetDailyStreak, setDailyStreak } from '../utils/streakManager';

// Năm hiện tại tự động cập nhật theo lịch thực tế (sang 2027, 2028... tự động cập nhật)
const CURRENT_YEAR = new Date().getFullYear();

export default function MapStudyTeacherPage({ 
  onOpenLogin, 
  onEnterApp,
  onOpenPracticeTest,
  onOpenCheatsheet,
  onOpenLeaderboard,
  onOpenCertificate,
  onSelectCourse,
  isLoggedIn = false,
  currentUser = null,
  onLogout,
  onOpenAdmin,
  theme = 'light',
  onToggleTheme,
  courses = [],
  completedLessons = {},
  onCoursesUpdated,
  initialTab = 'home',
  onTabChange,
  onOpenProfile
}) {
  // mainViewTab: 'home' (Trang chủ MapStudy) | 'courses' (Khóa đào tạo & Giảng viên Đan Rin) | 'community' (Cộng đồng)
  const [mainViewTab, setMainViewTab] = useState(initialTab || 'home');
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);

  if (initialTab && initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setMainViewTab(initialTab);
  }

  const handleTabSwitch = (tab) => {
    setMainViewTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [activeCourseCategory, setActiveCourseCategory] = useState('all'); // 'all' | 'group1_2' | 'group3_4' | 'group5' | 'group6_8' | 'materials'
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isControlDrawerOpen, setIsControlDrawerOpen] = useState(false);

  // Phân quyền Quản trị viên chặt chẽ: Chỉ khi có role admin hoặc tài khoản admin
  const isAdminUser = Boolean(isLoggedIn) && (
    currentUser?.role === 'admin' || 
    currentUser?.email === 'admin@runningman.vn' ||
    (currentUser?.email && currentUser.email.toLowerCase().includes('admin')) ||
    (currentUser?.username && currentUser.username.toLowerCase().includes('admin')) ||
    (currentUser?.name && (currentUser.name.toLowerCase().includes('admin') || currentUser.name.toLowerCase().includes('quản trị')))
  );
  
  // Điều hướng thông minh cho thanh lọc danh mục
  const categoryScrollRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkCategoryScroll = () => {
    const el = categoryScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const handleScrollCategory = (direction) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -260 : 260;
    el.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(checkCategoryScroll, 300);
  };

  const handleCategoryWheel = (e) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    if (e.deltaY !== 0) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
      checkCategoryScroll();
    }
  };

  useEffect(() => {
    checkCategoryScroll();
    const handleResize = () => checkCategoryScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mainViewTab]);

  const [leaderboardList, setLeaderboardList] = useState([]);
  const [dailyQuota, setDailyQuota] = useState({ scenariosToday: 0, scenariosMax: 5, practiceToday: 0, practiceMax: 3 });

  const fetchLeaderboard = useCallback(() => {
    api.leaderboard.get()
      .then((data) => {
        if (Array.isArray(data)) {
          setLeaderboardList(data);
        }
      })
      .catch(() => {});
  }, []);

  const fetchDailyQuota = useCallback(() => {
    const sName = currentUser?.fullName || currentUser?.name || currentUser?.username || 'Nhân Viên';
    api.streak.getDailyQuota(sName)
      .then(res => {
        if (res && res.success) {
          setDailyQuota({
            scenariosToday: res.scenariosToday || 0,
            scenariosMax: res.scenariosMax || 5,
            practiceToday: res.practiceToday || 0,
            practiceMax: res.practiceMax || 3
          });
        }
      })
      .catch(() => {});
  }, [currentUser]);

  useEffect(() => {
    fetchLeaderboard();
    fetchDailyQuota();
    // Tự động làm mới mỗi 15 giây để cập nhật nhanh nhất kết quả thi của nhân viên
    const timer = setInterval(() => {
      fetchLeaderboard();
      fetchDailyQuota();
    }, 15000);
    return () => clearInterval(timer);
  }, [fetchLeaderboard, fetchDailyQuota]);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Định dạng tên tài khoản trang trọng, đàng hoàng
  const formatStudentName = (name) => {
    if (!name) return 'Nhân Viên';
    const clean = String(name).trim();
    const lower = clean.toLowerCase();
    if (lower === 'nhanvien' || lower === 'nhan vien' || lower === 'nhan_vien' || lower.startsWith('nhanvien@')) {
      return 'Nhân Viên';
    }
    if (lower === 'hocvien' || lower === 'hoc vien' || lower === 'hoc_vien' || lower.startsWith('hocvien@')) {
      return 'Học Viên';
    }
    if (lower === 'admin' || lower.startsWith('admin@')) {
      return 'Quản Trị Viên';
    }
    return clean;
  };

  // Hero Banners Carousel (Cổng Đào Tạo Nội Bộ Nhân Viên Running Man)
  const heroBanners = [
    {
      id: 1,
      tag: 'CỔNG ĐÀO TẠO NỘI BỘ RUNNING MAN',
      tagColor: 'text-blue-900 bg-blue-900/5 border-blue-800/15',
      dotColor: 'bg-blue-600',
      date: `Khóa Huấn Luyện ${CURRENT_YEAR}`,
      titleTop: 'HỆ THỐNG HUẤN LUYỆN',
      titleHighlight: 'KỸ NĂNG SALE CĂN HỘ',
      titleBottom: 'DÀNH RIÊNG CHO NHÂN VIÊN RUNNING MAN',
      subtitle: 'Đóng gói toàn diện 8 nhóm năng lực cốt lõi: Phân biệt giỏ hàng Studio & Duplex, kỹ thuật Telesale 30s khai thác nhu cầu và quy trình dẫn khách chốt cọc trong ngày.',
      badgeTitle: '8 CHUYÊN ĐỀ PHỄU BÁN HÀNG',
      badgeSubtitle: 'Huấn luyện trực tiếp bởi Đan Rin',
      primaryBtnText: 'Vào học chuyên đề ngay',
      secondaryBtnText: 'Xem 8 nhóm năng lực',
      actionType: 'course',
      bgGradient: 'linear-gradient(135deg, #f0fdf9 0%, #e6f6f2 50%, #edf8f5 100%)',
      darkBgGradient: 'linear-gradient(135deg, #222222 0%, #1a1a1a 100%)',
      spotlightColor: 'bg-white/[0.02]',
      visualType: 'apartment',
      cardTitle: 'Studio Duplex Gác Lửng • Giỏ Hàng Thật',
      cardTag: '5.8 Tr/tháng',
      cardImg: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=700&q=80',
      mentorName: 'Đan Rin (Running Man)',
      mentorRole: 'HLV Trưởng Running Man',
      mentorDesc: '500+ Nhân viên đã đào tạo thực tế'
    },
    {
      id: 2,
      tag: 'TÀI LIỆU NỘI BỘ ĐỘC QUYỀN',
      tagColor: 'text-indigo-900 bg-indigo-900/5 border-indigo-800/15',
      dotColor: 'bg-indigo-600',
      date: `Sổ Tay Kịch Bản Bỏ Túi ${CURRENT_YEAR}`,
      titleTop: 'BỘ KỊCH BẢN 30 GIÂY',
      titleHighlight: 'BẺ GÃY TỪ CHỐI GIÁ',
      titleBottom: 'VÀ KỸ THUẬT CHỐT CỌC THẦN TỐC',
      subtitle: 'Nắm vững công thức quy đổi 500k chênh lệch = 16.000đ/ngày, kỹ thuật chốt cọc giả định (Assumptive Close) và checklist đón khách 15 phút để tăng tỷ lệ chốt giao dịch lên 40%.',
      badgeTitle: '30+ KỊCH BẢN ĐỐI ĐÁP ĐỘC QUYỀN',
      badgeSubtitle: 'Đóng gói từ 3+ năm thực địa',
      primaryBtnText: 'Tra cứu kịch bản mẫu',
      secondaryBtnText: 'Xem cẩm nang thực chiến',
      actionType: 'playbook',
      bgGradient: 'linear-gradient(135deg, #f0f4ff 0%, #e8edff 50%, #f4f6fc 100%)',
      darkBgGradient: 'linear-gradient(135deg, #222222 0%, #1a1a1a 100%)',
      spotlightColor: 'bg-white/[0.02]',
      visualType: 'playbook',
      cardTitle: 'Sổ Tay Bỏ Túi • Bí Quyết Đối Đáp Khách',
      cardTag: 'Độc Quyền RMSA',
      cardImg: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=80',
      mentorName: 'Ban Nghiên Cứu & Đào Tạo',
      mentorRole: 'Kịch Bản Bỏ Túi (PDF)',
      mentorDesc: 'Quy đổi 16k/ngày • Assumptive Close'
    },
    {
      id: 3,
      tag: 'SÁT HẠCH NĂNG LỰC ĐỊNH KỲ',
      tagColor: 'text-amber-900 bg-amber-900/5 border-amber-800/15',
      dotColor: 'bg-amber-600',
      date: 'Phòng Thi Ảo • Chuẩn Năng Lực',
      titleTop: 'PHÒNG THI SÁT HẠCH ẢO',
      titleHighlight: 'TÌNH HUỐNG THỰC ĐỊA',
      titleBottom: 'VÀ CHỨNG CHỈ ĐIỆN TỬ NỘI BỘ',
      subtitle: 'Kiểm tra phản xạ thực tế qua ngân hàng 15 câu hỏi tình huống mô phỏng. Đạt chuẩn ≥ 80% được cấp Chứng chỉ Điện tử RMSA và quyền ưu tiên nhận giỏ hàng dẫn khách từ công ty.',
      badgeTitle: 'ĐẠT CHUẨN ≥ 80% CẤP CHỨNG CHỈ',
      badgeSubtitle: 'Vinh danh Bảng Vàng Best Seller',
      primaryBtnText: 'Vào phòng thi sát hạch',
      secondaryBtnText: 'Xem Bảng Xếp Hạng',
      actionType: 'exam',
      bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fffdf5 100%)',
      darkBgGradient: 'linear-gradient(135deg, #222222 0%, #1a1a1a 100%)',
      spotlightColor: 'bg-white/[0.02]',
      visualType: 'certificate',
      cardTitle: 'Chứng Nhận Nghiệp Vụ Sale Căn Hộ RMSA',
      cardTag: 'Điểm Đạt: ≥ 80%',
      cardImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80',
      mentorName: 'Hội Đồng Khảo Sát RMSA',
      mentorRole: 'Xác Thực Điện Tử QR',
      mentorDesc: 'Cấp chứng nhận chuẩn hóa nội bộ'
    }
  ];

  const [isBannerHovered, setIsBannerHovered] = useState(false);

  // Safe slide navigation functions with complete wrap-around looping (Trang 1 <-> Trang 3)
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => {
      const len = heroBanners.length;
      return ((prev - 1) % len + len) % len;
    });
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => {
      const len = heroBanners.length;
      return (prev + 1) % len;
    });
  };

  // Safe normalized slide index that NEVER goes out of bounds
  const safeSlide = ((currentSlide % heroBanners.length) + heroBanners.length) % heroBanners.length;
  const currentBanner = heroBanners[safeSlide] || heroBanners[0];

  // Auto carousel slide with hover pause
  useEffect(() => {
    if (isBannerHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isBannerHovered, heroBanners.length]);

  // Hot Keywords
  const hotKeywords = [
    { title: 'Kịch bản Telesale 30s', query: 'kịch bản' },
    { title: 'Duplex gác lửng', query: 'duplex' },
    { title: 'Căn hộ Studio', query: 'studio' },
    { title: 'Bẻ gãy từ chối giá', query: 'từ chối' },
    { title: 'Checklist đón khách 15p', query: 'đón khách' },
    { title: 'Tiến độ đào tạo', query: 'tiến độ' }
  ];

  // Danh mục phân loại chuyên đề (Tách riêng từng chủ đề độc lập - Tinh gọn)
  const courseCategories = [
    { key: 'all', label: 'Tất cả (8)' },
    { key: 'nhom_1', label: '1. Sản phẩm & Giá' },
    { key: 'nhom_2', label: '2. Nguồn hàng' },
    { key: 'nhom_3', label: '3. Tìm khách' },
    { key: 'nhom_4', label: '4. Dẫn phòng 15p' },
    { key: 'nhom_5', label: '5. Bẻ giá & Chốt cọc' },
    { key: 'nhom_6', label: '6. Quản lý CRM' },
    { key: 'nhom_7', label: '7. Dịch vụ CSKH' },
    { key: 'nhom_8', label: '8. Thực chiến' },
    { key: 'materials', label: 'Tài liệu & Mẫu' }
  ];

  // Danh sách các khóa học đào tạo (Chuẩn Card MapStudy theo từng nhóm năng lực)
  const trainingCourses = React.useMemo(() => [
    {
      id: 1,
      lessonId: 'bai-1',
      code: 'RM-01',
      stageBadge: 'Chuyên Đề 01',
      groupKey: 'nhom_1',
      title: 'RM-01: HIỂU SẢN PHẨM & THỊ TRƯỜNG - PHÂN BIỆT STUDIO, DUPLEX, CĂN MINI CHO THUÊ',
      categoryLabel: 'Nhóm 1 • Sản Phẩm',
      thumb: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      duration: '15 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: 'Đan Rin',
      reactions: 385
    },
    {
      id: 2,
      lessonId: 'bai-2',
      code: 'RM-02',
      stageBadge: 'Chuyên Đề 02',
      groupKey: 'nhom_2',
      title: 'RM-02: TẠO NGUỒN HÀNG THẬT & QUẢN TRỊ DỊCH VỤ SỐ CHỦ NHÀ CHO THUÊ',
      categoryLabel: 'Nhóm 2 • Nguồn Hàng',
      thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      duration: '14 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: 'Đan Rin',
      reactions: 420
    },
    {
      id: 3,
      lessonId: 'bai-3',
      code: 'RM-03',
      stageBadge: 'Chuyên Đề 03',
      groupKey: 'nhom_3',
      title: 'RM-03: KỸ NĂNG ĐĂNG TIN ĐA KÊNH & BỘ 6 CÂU HỎI KHAI THÁC NHU CẦU TRONG 2 PHÚT',
      categoryLabel: 'Nhóm 3 • Tìm Khách',
      thumb: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
      duration: '15 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: 'Đan Rin',
      reactions: 512
    },
    {
      id: 4,
      lessonId: 'bai-4',
      code: 'RM-04',
      stageBadge: 'Chuyên Đề 04',
      groupKey: 'nhom_4',
      title: 'RM-04: KỊCH BẢN GỌI ĐIỆN 30 GIÂY & CHECKLIST ĐÓN KHÁCH TRƯỚC GIỜ HẸN 15 PHÚT',
      categoryLabel: 'Nhóm 4 • Dẫn Khách',
      thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      duration: '16 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: 'Đan Rin',
      reactions: 590
    },
    {
      id: 5,
      lessonId: 'bai-5',
      code: 'RM-05',
      stageBadge: 'Chuyên Đề 05',
      groupKey: 'nhom_5',
      title: 'RM-05: KỸ THUẬT BẺ GÃY TỪ CHỐI GIÁ (16K/NGÀY) & CHỐT CỌC GIỮ PHÒNG TẠI CHỖ',
      categoryLabel: 'Nhóm 5 • Chốt Cọc',
      thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      duration: '18 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: 'Đan Rin',
      reactions: 680
    },
    {
      id: 6,
      lessonId: 'bai-6',
      code: 'RM-06',
      stageBadge: 'Chuyên Đề 06',
      groupKey: 'nhom_6',
      title: 'RM-06: QUẢN LÝ PHỄU CRM, THIẾT LẬP KPI & TỐI ƯU TỶ LỆ CHUYỂN ĐỔI BÁN HÀNG',
      categoryLabel: 'Nhóm 6 • Quản Lý Phễu',
      thumb: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
      duration: '15 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: 'Đan Rin',
      reactions: 435
    },
    {
      id: 7,
      lessonId: 'bai-7',
      code: 'RM-07',
      stageBadge: 'Chuyên Đề 07',
      groupKey: 'nhom_7',
      title: 'RM-07: KỶ LUẬT NGHỀ NGHIỆP, BẢO VỆ CỌC & QUY TRÌNH CHĂM SÓC KHÁCH HÀNG 72H',
      categoryLabel: 'Nhóm 7 • Kỷ Luật & CSKH',
      thumb: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
      duration: '15 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: 'Đan Rin',
      reactions: 480
    },
    {
      id: 8,
      lessonId: 'bai-8',
      code: 'RM-08',
      stageBadge: 'Chuyên Đề 08',
      groupKey: 'nhom_8',
      title: 'RM-08: THỰC CHIẾN NGOÀI THỊ TRƯỜNG - KHẢO SÁT THỰC ĐỊA & XỬ LÝ 10 CA KHÓ',
      categoryLabel: 'Nhóm 8 • Thực Chiến Thị Trường',
      thumb: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      duration: '16 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: 'Đan Rin',
      reactions: 560
    },
    {
      id: 9,
      lessonId: 'bai-5',
      code: 'RM-DOC-01',
      stageBadge: 'Tài Liệu Đính Kèm',
      groupKey: 'materials',
      title: 'CẨM NANG BỎ TÚI: 30 KỊCH BẢN ĐỐI ĐÁP BẺ GÃY TỪ CHỐI GIÁ THUÊ PHÒNG TRỌ / CĂN HỘ',
      categoryLabel: 'Tài Liệu Đính Kèm',
      thumb: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
      duration: 'Ebook PDF',
      quizCount: 'Tra cứu nhanh',
      passingScore: 'Miễn phí',
      instructor: 'Ban Đào Tạo RMSA',
      reactions: 710
    },
    {
      id: 10,
      lessonId: 'bai-2',
      code: 'RM-DOC-02',
      stageBadge: 'Mẫu Hợp Đồng',
      groupKey: 'materials',
      title: 'MẪU HỢP ĐỒNG THUÊ CĂN HỘ DỊCH VỤ & BIÊN BẢN BÀN GIAO PHÒNG CHUẨN PHÁP LÝ',
      categoryLabel: 'Mẫu Hợp Đồng',
      thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      duration: 'File Word/PDF',
      quizCount: 'Tải trực tiếp',
      passingScore: 'Miễn phí',
      instructor: 'Ban Pháp Chế RMSA',
      reactions: 395
    },
    {
      id: 11,
      lessonId: 'bai-1',
      code: 'RM-ARENA',
      stageBadge: 'Phòng Thi Ảo',
      groupKey: 'materials',
      title: 'KỲ THI SÁT HẠCH TOÀN DIỆN: 15 CÂU HỎI TÌNH HUỐNG THỰC ĐỊA MÔI GIỚI CĂN HỘ',
      categoryLabel: 'Sát Hạch Năng Lực',
      thumb: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      duration: '15 phút',
      quizCount: '15 câu',
      passingScore: '≥ 80%',
      instructor: 'Hội Đồng Khảo Sát RMSA',
      reactions: 620
    }
  ], []);

  // Tiến độ học tập của học viên nội bộ (đồng bộ theo từng tài khoản đăng nhập)
  const activeCompleted = React.useMemo(() => {
    // Nếu chưa đăng nhập: Luôn hiển thị tiến độ mới 0% để người dùng làm quen
    if (!isLoggedIn) {
      return {};
    }
    if (completedLessons && typeof completedLessons === 'object') {
      return completedLessons;
    }
    return {};
  }, [completedLessons, isLoggedIn]);

  const rawCoursesList = Array.isArray(courses) && courses.length > 0 ? courses : [];
  const totalLessonsCount = rawCoursesList.length || 8;
  const passedCount = rawCoursesList.filter((c) => activeCompleted[c.id]?.passed).length;
  const progressPercent = totalLessonsCount > 0 ? Math.round((passedCount / totalLessonsCount) * 100) : 0;
  const allCompleted = totalLessonsCount > 0 && passedCount >= totalLessonsCount;

  // Chuyên đề tiếp theo cần học (bài đầu tiên chưa hoàn thành sát hạch)
  const nextLessonToStudy = rawCoursesList.find((c) => !activeCompleted[c.id]?.passed) || rawCoursesList[0];

  // Điểm trung bình các bài sát hạch đã đạt
  const passedScores = rawCoursesList
    .map((c) => activeCompleted[c.id]?.score)
    .filter((s) => typeof s === 'number' && !isNaN(s));
  const averageScore = passedScores.length > 0
    ? Math.round(passedScores.reduce((a, b) => a + b, 0) / passedScores.length)
    : 0;

  const studentRawName = currentUser?.fullName || currentUser?.name || currentUser?.username || (isLoggedIn ? 'Nhân Viên' : 'Chiến Binh Mới');
  const studentName = formatStudentName(studentRawName);

  // ĐẤU TRƯỜNG PHẢN XẠ THỰC CHIẾN 60 GIÂY (RANDOM & KHÔNG LẶP LẠI MỖI LẦN MỞ)
  const [currentScenario, setCurrentScenario] = useState(() => getRandomScenario([]));
  const [selectedScenarioOption, setSelectedScenarioOption] = useState(null);
  const [seenScenarioIds, setSeenScenarioIds] = useState(() => [currentScenario?.id || 'sc-1']);
  const [isAiGeneratingScenario, setIsAiGeneratingScenario] = useState(false);
  
  // Chuỗi học tập thực tế tự động (Daily Streak Engine)
  const userIdentifier = currentUser?.id || currentUser?.username || 'guest';
  const [prevUserIdentifier, setPrevUserIdentifier] = useState(userIdentifier);
  const [streakData, setStreakData] = useState(() => loadDailyStreak(userIdentifier));
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [streakCelebrationMsg, setStreakCelebrationMsg] = useState('');

  // Khi tài khoản đăng nhập thay đổi, đồng bộ tức thì cache cục bộ của user đó
  if (prevUserIdentifier !== userIdentifier) {
    setPrevUserIdentifier(userIdentifier);
    setStreakData(loadDailyStreak(userIdentifier));
  }

  // Tự động đồng bộ chuỗi streak với backend SQLite mỗi khi tài khoản đăng nhập thay đổi
  useEffect(() => {
    let isMounted = true;
    api.streak.get(userIdentifier).then(res => {
      if (isMounted && res && res.success && typeof res.streak === 'number') {
        setStreakData({
          streak: res.streak,
          lastCompletedDate: res.lastCompletedDate,
          history: Array.isArray(res.history) ? res.history : []
        });
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, [userIdentifier]);

  // Tải tình huống ngẫu nhiên tiếp theo (Không lặp lại hoặc tự tạo bằng AI)
  const handleNextRandomScenario = React.useCallback(async (useAi = false) => {
    setSelectedScenarioOption(null);
    setStreakCelebrationMsg('');
    if (useAi) {
      setIsAiGeneratingScenario(true);
      try {
        const res = await api.scenarios.getRandom({ excludeIds: seenScenarioIds, useAi: true });
        if (res && res.success && res.scenario) {
          setCurrentScenario(res.scenario);
          setSeenScenarioIds(prev => [...prev, res.scenario.id]);
          return;
        }
      } catch (err) {
        console.warn('Lỗi khi gọi AI sinh tình huống:', err);
      } finally {
        setIsAiGeneratingScenario(false);
      }
    }

    // Bốc ngẫu nhiên từ ngân hàng tình huống phong phú không lặp lại
    const nextScenario = getRandomScenario(seenScenarioIds);
    setCurrentScenario(nextScenario);
    setSeenScenarioIds(prev => {
      const updated = [...prev, nextScenario.id];
      return updated.length >= 20 ? [nextScenario.id] : updated;
    });
  }, [seenScenarioIds]);

  const handleSelectScenarioOption = (idx) => {
    if (selectedScenarioOption !== null || !currentScenario) return;
    setSelectedScenarioOption(idx);
    if (currentScenario?.options[idx]?.isCorrect) {
      const updated = recordCorrectDailyScenario(userIdentifier);
      setStreakData(updated);

      if (updated.newlyUnlocked) {
        try {
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {}
        setStreakCelebrationMsg(`🎉 Chúc mừng! Bạn đã hoàn thành câu đúng hôm nay và mở Chuỗi ${updated.streak} ngày liên tiếp!`);
      } else {
        setStreakCelebrationMsg(`🎯 Chuẩn xác! Hôm nay bạn đã duy trì Chuỗi đúng ${updated.streak} ngày.`);
      }

      // Tự động ghi nhận tình huống thực địa vào SQLite (chống spam tối đa 5 câu/ngày tích điểm)
      const studentDisplayName = currentUser?.fullName || currentUser?.name || currentUser?.username || 'Nhân Viên';
      api.scenarios.recordCorrect({
        studentName: studentDisplayName,
        scenarioId: currentScenario.id
      }).then(res => {
        if (res && res.success) {
          setStreakCelebrationMsg(res.message);
          fetchLeaderboard();
          fetchDailyQuota();
        }
      }).catch(() => {});

      // Tự động đồng bộ lên backend SQLite
      api.streak.record({
        userId: userIdentifier,
        streak: updated.streak,
        lastCompletedDate: updated.lastCompletedDate,
        history: updated.history
      }).catch(() => {});
    }
  };

  const handleResetStreak = () => {
    const res = resetDailyStreak(userIdentifier);
    setStreakData(res);
    setStreakCelebrationMsg('Đã đặt lại về Chuỗi 0 ngày. Bạn hãy làm đúng 1 câu hôm nay để bắt đầu Chuỗi 1 ngày!');
    api.streak.record({
      userId: userIdentifier,
      streak: 0,
      lastCompletedDate: null,
      history: []
    }).catch(() => {});
  };

  const handleSetTestStreak = (days) => {
    const res = setDailyStreak(userIdentifier, days);
    setStreakData(res);
    setStreakCelebrationMsg(`Đã thiết lập mốc Chuỗi ${days} ngày (trả lời đúng hôm nay để mở Chuỗi ${days + 1})!`);
    api.streak.record({
      userId: userIdentifier,
      streak: res.streak,
      lastCompletedDate: res.lastCompletedDate,
      history: res.history
    }).catch(() => {});
  };

  const combinedCoursesList = React.useMemo(() => {
    if (Array.isArray(courses) && courses.length > 0) {
      return courses.map((c, idx) => {
        const matchTpl = trainingCourses.find(tc => tc.lessonId === c.id || tc.id === c.order);
        const stageBadge = matchTpl ? matchTpl.stageBadge : `Chuyên Đề ${String(c.order || idx + 1).padStart(2, '0')}`;
        const code = c.rinCode || matchTpl?.code || `RM-${String(c.order || idx + 1).padStart(2, '0')}`;
        const groupKey = c.groupKey || matchTpl?.groupKey || (c.order <= 8 ? `nhom_${c.order}` : 'nhom_1');
        const categoryLabel = c.category || matchTpl?.categoryLabel || 'Nhóm Đào Tạo';
        const thumb = c.thumb || matchTpl?.thumb || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80';
        const duration = c.duration || matchTpl?.duration || '15 phút';
        const quizCount = `${c.quiz?.length || 5} câu`;
        const passingScore = typeof c.passingScore === 'number' ? `≥ ${c.passingScore}%` : (c.passingScore || '≥ 80%');
        const instructor = matchTpl?.instructor || 'Đan Rin';
        const videosCount = Array.isArray(c.videos) && c.videos.length > 0 ? c.videos.length : 4;

        return {
          id: c.order || idx + 1,
          lessonId: c.id,
          code,
          stageBadge,
          groupKey,
          title: c.title,
          categoryLabel,
          thumb,
          duration,
          quizCount,
          passingScore,
          instructor,
          videosCount
        };
      });
    }
    return trainingCourses;
  }, [courses, trainingCourses]);

  const filteredCourses = combinedCoursesList.filter(course => {
    const matchCategory = activeCourseCategory === 'all' || course.groupKey === activeCourseCategory;
    const matchQuery = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handleCourseClick = (course) => {
    if (isLoggedIn && onSelectCourse) {
      onSelectCourse(course.lessonId || 'bai-1');
    } else if (onOpenLogin) {
      onOpenLogin();
    }
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#171514] text-slate-800 dark:text-[#f5f5f4] font-sans selection:bg-slate-900 selection:text-white pb-16 relative transition-colors duration-200">
      
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR: UNIFIED GLASS BAR WITH DISTINGUISHED ZONES                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#141414]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-colors duration-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Zone 1: Brand & Logo Lockup - Sang Trọng, Tinh Tế, Liền Mạch Hoàn Hảo */}
            <div className="flex items-center space-x-3 shrink-0">
              <div 
                onClick={() => setMainViewTab('home')}
                className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 cursor-pointer select-none group/brand"
                title="RMSA - Running Man Sales Academy"
              >
                {/* Bệ Đỡ Trang Sức Than Chì Tôn Vinh Biểu Tượng Kim Loại Bạc RM */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 dark:bg-slate-900 border border-slate-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center p-1.5 transition-transform duration-200 group-hover/brand:scale-105 shrink-0">
                  <img 
                    src="/images/running_man_logo.png" 
                    alt="Running Man" 
                    className="w-full h-full object-contain filter brightness-110 drop-shadow-[0_1px_3px_rgba(255,255,255,0.2)]"
                  />
                </div>

                {/* Vạch ngăn tinh tế phong cách kiến trúc */}
                <div className="h-6 w-px bg-slate-200 dark:bg-white/[0.12] hidden sm:block shrink-0" />

                {/* Typography thương hiệu sắc nét */}
                <div className="flex flex-col">
                  <span className="text-[14px] sm:text-[15px] font-black tracking-wider text-slate-900 dark:text-white leading-none">
                    RUNNING MAN
                  </span>
                  <span className="text-[9.5px] font-extrabold tracking-[0.22em] text-[#0d5cb6] dark:text-blue-400 uppercase leading-none mt-1">
                    SALES ACADEMY
                  </span>
                </div>
              </div>

              {/* Minimalist Search Pill - Kính Sáng Hiện Đại */}
              <div className="relative hidden 2xl:block w-44 ml-2">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm chuyên đề, bài phễu..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 dark:bg-white/[0.06] dark:hover:bg-white/[0.09] focus:bg-white dark:focus:bg-[#1a1a1a] rounded-full text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200/80 dark:border-white/[0.08] focus:border-blue-500 focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Zone 2: Center Segmented Dock Tabs (Khoang tab con nhộng thanh lịch ĐỒNG BỘ 100%) */}
            <nav className="hidden lg:flex items-center bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] p-1 rounded-full shadow-2xs space-x-1 shrink-0 backdrop-blur-sm">
              <button 
                onClick={() => handleTabSwitch('home')}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewTab === 'home' 
                    ? 'font-bold text-slate-950 dark:text-white bg-white dark:bg-[#252525] shadow-xs border border-slate-200/60 dark:border-white/[0.1]' 
                    : 'font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05]'
                }`}
                title="Trang chủ RMSA"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${mainViewTab === 'home' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
                <span>Trang chủ</span>
              </button>

              {/* Chức năng Vào học & Thi trực tiếp trên thanh tab */}
              <button 
                onClick={() => {
                  if (isLoggedIn) {
                    onEnterApp();
                  } else if (onOpenLogin) {
                    onOpenLogin('login');
                  }
                }}
                className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all cursor-pointer flex items-center space-x-1.5"
                title="Vào phòng học & làm bài kiểm tra sát hạch 8 chuyên đề"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
                <span>Vào học & Thi</span>
              </button>

              <button 
                onClick={() => handleTabSwitch('courses')}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewTab === 'courses' 
                    ? 'font-bold text-slate-950 dark:text-white bg-white dark:bg-[#252525] shadow-xs border border-slate-200/60 dark:border-white/[0.1]' 
                    : 'font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05]'
                }`}
                title="Khóa đào tạo & Giảng viên Đan Rin"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${mainViewTab === 'courses' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
                <span>Khóa đào tạo</span>
              </button>

              <button 
                onClick={onOpenPracticeTest || onOpenLogin}
                className="hidden xl:inline-flex shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all cursor-pointer items-center space-x-1.5"
                title="Phòng thi sát hạch trực tuyến"
              >
                <span>Phòng thi sát hạch</span>
              </button>

              <button 
                onClick={() => handleTabSwitch('community')}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewTab === 'community' 
                    ? 'font-bold text-slate-950 dark:text-white bg-white dark:bg-[#252525] shadow-xs border border-slate-200/60 dark:border-white/[0.1]' 
                    : 'font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05]'
                }`}
                title="Cộng đồng thảo luận"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${mainViewTab === 'community' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
                <span>Cộng đồng</span>
              </button>

              <button 
                onClick={onOpenCheatsheet || onOpenLogin}
                className="hidden 2xl:inline-flex shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all cursor-pointer items-center space-x-1.5"
                title="Kịch bản & Cẩm nang mẫu"
              >
                <span>Kịch bản & Cẩm nang</span>
              </button>
            </nav>

            {/* Zone 3: Actions & Smart Right Sidebar Menu Trigger (Đồng bộ nút Xanh Dương 100%) */}
            <div className="flex items-center space-x-2 shrink-0">
              
              {/* Nút Chuyển Đổi Chế Độ Ngày & Đêm */}
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />

              {isLoggedIn ? (
                <>
                  {/* Nút Vào học tiếp (Chỉ hiển thị trên màn hình nhỏ/tablet khi khoang tab trung tâm ẩn) */}
                  <button
                    onClick={onEnterApp}
                    className="lg:hidden px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                  >
                    <Play className="w-3 h-3 fill-white text-white" />
                    <span className="hidden sm:inline">Vào học tiếp</span>
                  </button>

                  {/* Nút Quản trị LMS (Hiển thị trực tiếp trên màn hình cực lớn 2XL) */}
                  {isAdminUser && onOpenAdmin && (
                    <button
                      onClick={onOpenAdmin}
                      className="hidden 2xl:flex px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-xs transition-all cursor-pointer items-center space-x-1.5 shrink-0"
                      title="Mở bảng quản trị LMS"
                    >
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      <span>Quản trị LMS</span>
                    </button>
                  )}

                  {/* NÚT MỞ BẢNG ĐIỀU KHIỂN & TIỆN ÍCH SIDEBAR */}
                  <button
                    onClick={() => setIsControlDrawerOpen(true)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] border border-slate-200/80 dark:border-white/[0.08] text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
                    title="Mở Bảng Điều Khiển & Menu Quản Trị"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-700 animate-pulse shrink-0"></span>
                    <span className="truncate max-w-[110px] hidden md:inline">
                      {formatStudentName(currentUser?.name)}
                    </span>
                    <Menu className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => onOpenLogin && onOpenLogin('register')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    Đăng ký
                  </button>

                  {/* Nút Đăng nhập - Xanh Dương Hoàng Gia Đồng Bộ 100% Nút Đăng Nhập LMS */}
                  <button
                    onClick={() => onOpenLogin && onOpenLogin('login')}
                    className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center shrink-0"
                  >
                    <span>Đăng nhập</span>
                  </button>

                  <button
                    onClick={() => setIsControlDrawerOpen(true)}
                    className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/[0.08] cursor-pointer"
                    title="Mở menu tiện ích"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SMART RIGHT SIDEBAR DRAWER: TRUNG TÂM ĐIỀU KHIỂN & QUẢN TRỊ RMSA        */}
      {/* ========================================================================= */}
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
          isControlDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsControlDrawerOpen(false)}
      />

      {/* Slide-out Sidebar Panel */}
      <aside 
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm sm:w-[380px] bg-white dark:bg-[#1a1715] border-l border-slate-200 dark:border-white/[0.1] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${
          isControlDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/80 dark:bg-[#201d1a]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 dark:bg-slate-900 border border-slate-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center p-1 shrink-0">
              <img 
                src="/images/running_man_logo.png" 
                alt="RMSA" 
                className="w-full h-full object-contain filter brightness-110 drop-shadow-[0_1px_3px_rgba(255,255,255,0.2)]" 
              />
            </div>
            <div>
              <h4 className="text-xs font-black tracking-wide text-slate-900 dark:text-white uppercase">
                Trung Tâm Điều Khiển
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Running Man Sales Academy
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsControlDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#2a2622] hover:bg-slate-200 dark:hover:bg-[#34302b] flex items-center justify-center text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-white/[0.1] transition-colors cursor-pointer"
            title="Đóng bảng điều khiển"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* User Profile Identity Card */}
          {isLoggedIn ? (
            <div 
              onClick={() => {
                setIsControlDrawerOpen(false);
                if (onOpenProfile) onOpenProfile();
              }}
              className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-[#24201c] dark:to-[#1d1a17] hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-[#2a2622] dark:hover:to-[#221e1a] border border-slate-200/80 dark:border-white/[0.08] space-y-3 shadow-xs cursor-pointer transition-all group"
              title="Bấm để xem và chỉnh sửa hồ sơ / đổi ảnh đại diện"
            >
              <div className="flex items-center space-x-3">
                <div className="relative shrink-0">
                  {currentUser?.avatarUrl || currentUser?.avatar_url ? (
                    <img 
                      src={currentUser.avatarUrl || currentUser.avatar_url} 
                      alt={currentUser?.name || 'User'} 
                      className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-white dark:ring-[#2e2a26] group-hover:ring-blue-500 transition-all" 
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-sm shrink-0 ring-2 ring-white dark:ring-[#2e2a26]">
                      {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 p-1 rounded-full bg-blue-600 text-white shadow-xs group-hover:scale-110 transition-transform">
                    <Camera className="w-2.5 h-2.5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-900 dark:text-white text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {currentUser?.name || 'Nhân viên RMSA'}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {currentUser?.email || currentUser?.username || 'nhanvien@gmail.com'}
                  </p>
                </div>
              </div>

              {/* Role Badge & Edit link */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {isAdminUser ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                      <ShieldCheck className="w-3 h-3 text-amber-500" />
                      Quản Trị Viên
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      Nhân viên
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 underline">
                  Hồ sơ & Avatar ➜
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#24201c] border border-slate-200 dark:border-white/[0.08] text-center space-y-2">
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Bạn chưa đăng nhập tài khoản nhân viên.
              </p>
              <div className="flex gap-2 justify-center pt-1">
                <button
                  onClick={() => {
                    setIsControlDrawerOpen(false);
                    if (onOpenLogin) onOpenLogin('login');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    setIsControlDrawerOpen(false);
                    if (onOpenLogin) onOpenLogin('register');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
                >
                  Đăng ký
                </button>
              </div>
            </div>
          )}

          {/* ADMIN STUDIO SPECIAL SPOTLIGHT CARD */}
          {isAdminUser && onOpenAdmin && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/20 dark:via-amber-500/10 dark:to-transparent border border-amber-500/30 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-black text-amber-900 dark:text-amber-300 text-xs uppercase">
                      Admin Studio
                    </h5>
                    <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                      Giám sát nhân sự & thi trực tiếp
                    </p>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
                  VIP
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Xem toàn bộ danh sách nhân sự, dòng hoạt động Live SQLite, tải video và báo cáo CSV.
              </p>
              <button
                onClick={() => {
                  setIsControlDrawerOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mở Bảng Quản Trị Hệ Thống ➜</span>
              </button>
            </div>
          )}

          {/* Quick Actions Navigation List */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Tiện Ích & Phòng Chuyên Đề
            </span>

            <button
              onClick={() => {
                setIsControlDrawerOpen(false);
                if (onEnterApp) onEnterApp();
              }}
              className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#25211e] flex items-center space-x-3 text-slate-700 dark:text-slate-200 font-semibold transition-colors cursor-pointer text-left"
            >
              <RealisticCourseIcon className="w-8 h-8" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white">Vào Học & Thi Sát Hạch</div>
                <div className="text-[10px] text-slate-400">8 chuyên đề thực chiến</div>
              </div>
            </button>

            <button
              onClick={() => {
                setIsControlDrawerOpen(false);
                if (onOpenPracticeTest) onOpenPracticeTest();
                else if (onOpenLogin) onOpenLogin();
              }}
              className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#25211e] flex items-center space-x-3 text-slate-700 dark:text-slate-200 font-semibold transition-colors cursor-pointer text-left"
            >
              <RealisticExamIcon className="w-8 h-8" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white">Phòng Thi Sát Hạch Online</div>
                <div className="text-[10px] text-slate-400">Thi thử 25 câu tính giờ chuẩn</div>
              </div>
            </button>

            <button
              onClick={() => {
                setIsControlDrawerOpen(false);
                if (onOpenCheatsheet) onOpenCheatsheet();
                else if (onOpenLogin) onOpenLogin();
              }}
              className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#25211e] flex items-center space-x-3 text-slate-700 dark:text-slate-200 font-semibold transition-colors cursor-pointer text-left"
            >
              <RealisticBookIcon className="w-8 h-8" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white">Kịch Bản & Cẩm Nang Mẫu</div>
                <div className="text-[10px] text-slate-400">50 tình huống đối đáp thực tế</div>
              </div>
            </button>

            <button
              onClick={() => {
                setIsControlDrawerOpen(false);
                if (onOpenLeaderboard) onOpenLeaderboard();
              }}
              className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#25211e] flex items-center space-x-3 text-slate-700 dark:text-slate-200 font-semibold transition-colors cursor-pointer text-left"
            >
              <RealisticTrophyIcon className="w-8 h-8" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white">Bảng Vàng Thi Đua Nhân Sự</div>
                <div className="text-[10px] text-slate-400">Vinh danh tuần & tháng</div>
              </div>
            </button>

            <button
              onClick={() => {
                setIsControlDrawerOpen(false);
                if (onOpenCertificate) onOpenCertificate();
              }}
              className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#25211e] flex items-center space-x-3 text-slate-700 dark:text-slate-200 font-semibold transition-colors cursor-pointer text-left"
            >
              <RealisticCertificateIcon className="w-8 h-8" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white">Chứng Nhận Tốt Nghiệp</div>
                <div className="text-[10px] text-slate-400">Chứng chỉ RMSA bản chính thức</div>
              </div>
            </button>

            <button
              onClick={() => {
                setIsControlDrawerOpen(false);
                setMainViewTab('community');
              }}
              className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#25211e] flex items-center space-x-3 text-slate-700 dark:text-slate-200 font-semibold transition-colors cursor-pointer text-left"
            >
              <RealisticCommunityIcon className="w-8 h-8" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white">Cộng Đồng Thảo Luận Thực Chiến</div>
                <div className="text-[10px] text-slate-400">Hỏi đáp ca khó & báo cọc phòng</div>
              </div>
            </button>
          </div>

          {/* Theme Switch Row */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between px-2">
            <span className="text-slate-600 dark:text-slate-300 font-semibold text-xs">
              Giao diện hệ thống
            </span>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

        </div>

        {/* Drawer Footer */}
        {isLoggedIn && (
          <div className="p-4 border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#201d1a]">
            <button
              onClick={() => {
                setIsControlDrawerOpen(false);
                if (onLogout) {
                  onLogout();
                } else {
                  try { localStorage.removeItem('mapstudy_logged_in'); } catch {}
                  window.location.reload();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Đăng Xuất Khỏi Tài Khoản</span>
            </button>
          </div>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* 2. CHỌN GIAO DIỆN HIỂN THỊ DỰA TRÊN TAB:                                    */}
      {/*    A) 'home'     : TRANG CHỦ MAPSTUDY (Sidebar trái + Banner + Tư vấn)    */}
      {/*    B) 'courses'  : TRANG GIẢNG VIÊN ANH RIN & KHÓA ĐÀO TẠO (Ảnh thứ 2)    */}
      {/*    C) 'community': CỘNG ĐỒNG THẢO LUẬN RUNNING MAN                        */}
      {/* ========================================================================= */}

      {/* ========================================================================= */}
      {/* GIAO DIỆN B: KHÓA ĐÀO TẠO & HỒ SƠ GIẢNG VIÊN ANH RIN (Theo đúng ảnh 2)     */}
      {/* ========================================================================= */}
      {mainViewTab === 'courses' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* CỘT TRÁI: HỒ SƠ CHI TIẾT GIẢNG VIÊN ANH RIN */}
            <div className="lg:col-span-4 bg-white dark:bg-[#1f1c1a] rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90 dark:border-white/[0.08] space-y-6">
              
              {/* Header profile */}
              <div className="space-y-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative shrink-0">
                    <img 
                      src="/images/anh_rin_avatar.jpg" 
                      alt="Đan Rin" 
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 dark:border-white/10 shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-[#14161d] shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Đan Rin (Running Man)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-stone-400 leading-relaxed font-semibold">
                      HLV Trưởng & Quản Lý Đào Tạo Thực Địa RMSA
                    </p>
                  </div>
                </div>

                {/* Primary Action Button - Nội bộ nhân viên */}
                <button
                  onClick={isLoggedIn ? onEnterApp : onOpenLogin}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-black text-xs shadow-md dark:shadow-amber-500/15 border border-transparent dark:border-amber-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center cursor-pointer"
                >
                  <span>{isLoggedIn ? '➜ Vào lớp đào tạo nội bộ' : '➜ Đăng nhập tài khoản nhân viên'}</span>
                </button>
              </div>

              <div className="h-px bg-slate-100 dark:bg-white/[0.06]" />

              {/* Mục tiêu huấn luyện học viên mới */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Mục tiêu huấn luyện học viên mới</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-stone-300 leading-relaxed pl-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>Kèm cặp thực tế:</strong> Hướng dẫn học viên mới từ con số 0 đến khi tự tin dẫn khách và chốt thành công căn phòng đầu tiên.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>Làm chủ giỏ hàng:</strong> Thuộc lòng biểu phí, đặc điểm phòng duplex, studio và vị trí các tòa nhà trên toàn hệ thống RMSA.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>Kịch bản thực chiến:</strong> Nắm vững phương pháp chia nhỏ giá 16k/ngày để bẻ gãy từ chối khi khách chê giá phòng đắt.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>Kỷ luật tác phong:</strong> Luôn có mặt trước 15 phút, bật sẵn điều hòa, chuẩn bị nước mát đón khách và phối hợp chia sẻ giỏ hàng cùng đồng đội.</span>
                  </li>
                </ul>
              </div>

              <div className="h-px bg-slate-100 dark:bg-white/[0.06]" />

              {/* Quy chế học việc tại Running Man */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Quy chế học việc tại Running Man</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-stone-300 leading-relaxed pl-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span><strong>Học thật - Dắt thật:</strong> Nói không với lý thuyết suông; sau mỗi chuyên đề đều có tình huống đóng vai đối đáp thực tế với HLV.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span><strong>Điều kiện nhận data khách:</strong> Bắt buộc hoàn thành sát hạch trắc nghiệm đạt chuẩn ≥ 80% mới được cấp quyền nhận giỏ hàng dẫn khách.</span>
                  </li>
                </ul>
              </div>

              <div className="h-px bg-slate-100 dark:bg-white/[0.06]" />

              {/* Kênh hỗ trợ nội bộ */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-stone-300 pt-1">
                <span className="text-[11px] font-bold text-slate-400 dark:text-stone-400 uppercase tracking-wider block">
                  Kênh trợ giúp nghiệp vụ nội bộ
                </span>
                <p className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-stone-400" />
                  <span>Hotline Quản lý (Cứu deal tại phòng): <strong className="text-slate-900 dark:text-white">0909.xxx.xxx</strong></span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-stone-400" />
                  <span>Email Ban Đào Tạo: <strong className="text-slate-900 dark:text-white">daotao.noibo@runningman.vn</strong></span>
                </p>
              </div>

            </div>

            {/* CỘT PHẢI: TABS VÀ DANH SÁCH KHÓA HỌC / KỊCH BẢN MẪU */}
            <div className="lg:col-span-8 space-y-4">

              {/* Category Pills Filter: Thanh trượt thông minh có nút bấm điều hướng và fade mask */}
              <div className="relative group/carousel flex items-center">
                {/* Nút lướt sang trái */}
                {canScrollLeft && (
                  <button
                    onClick={() => handleScrollCategory('left')}
                    aria-label="Lướt sang trái"
                    className="absolute -left-2 z-20 w-7 h-7 rounded-full bg-white/95 dark:bg-[#1f1c1a]/95 text-slate-800 dark:text-stone-100 border border-slate-200 dark:border-stone-700 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {/* Fade Mask bên trái */}
                {canScrollLeft && (
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-[#171514] to-transparent pointer-events-none z-10" />
                )}

                {/* Danh sách cuộn ngang */}
                <div
                  ref={categoryScrollRef}
                  onScroll={checkCategoryScroll}
                  onWheel={handleCategoryWheel}
                  className="flex items-center space-x-2 overflow-x-auto py-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth w-full"
                >
                  {courseCategories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCourseCategory(cat.key)}
                      className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeCourseCategory === cat.key
                          ? 'bg-blue-600 dark:bg-amber-500 text-white dark:text-stone-950 font-black shadow-xs ring-1 ring-blue-500/30 dark:ring-amber-400/50 hover:brightness-105'
                          : 'bg-white dark:bg-[#262320] text-slate-700 dark:text-stone-300 border border-slate-200/90 dark:border-stone-800 hover:bg-slate-100 dark:hover:bg-[#2e2a26] hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Fade Mask bên phải */}
                {canScrollRight && (
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#171514] to-transparent pointer-events-none z-10" />
                )}

                {/* Nút lướt sang phải */}
                {canScrollRight && (
                  <button
                    onClick={() => handleScrollCategory('right')}
                    aria-label="Lướt sang phải"
                    className="absolute -right-2 z-20 w-7 h-7 rounded-full bg-white/95 dark:bg-[#1f1c1a]/95 text-slate-800 dark:text-stone-100 border border-slate-200 dark:border-stone-700 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Course Cards Grid (2 hoặc 3 cột theo ảnh 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Ô TẠO CHUYÊN ĐỀ MỚI - CHỈ QUẢN TRỊ VIÊN MỚI ĐƯỢC NHÌN THẤY VÀ THAO TÁC */}
                {isAdminUser && (
                  <div
                    onClick={() => setIsCreateCourseOpen(true)}
                    className="bg-amber-500/[0.04] hover:bg-amber-500/[0.09] dark:bg-amber-500/[0.03] dark:hover:bg-amber-500/[0.08] rounded-2xl border-2 border-dashed border-amber-500/40 dark:border-amber-400/30 hover:border-amber-500 dark:hover:border-amber-400 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[340px] shadow-2xs hover:shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                      ADMIN ONLY
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all mb-3.5">
                      <Plus className="w-7 h-7 stroke-[2.5]" />
                    </div>

                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2 border border-amber-500/20">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>QUẢN TRỊ VIÊN</span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5 group-hover:text-amber-500 transition-colors">
                      + Tạo Chuyên Đề Mới
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-stone-400 max-w-xs leading-relaxed mb-4">
                      Tải lên 4 video lý thuyết (YouTube, GDrive, MP4) & thiết lập bộ câu hỏi trắc nghiệm sát hạch.
                    </p>

                    <span className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs transition-colors">
                      <span>Mở giao diện tạo</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}

                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="bg-white dark:bg-[#1f1c1a] rounded-2xl border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.2] overflow-hidden shadow-2xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail with stage badge */}
                      <div className="relative aspect-video overflow-hidden bg-slate-900">
                        <img 
                          src={course.thumb} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wide shadow-xs border border-white/15">
                          {course.stageBadge}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-white text-[10px] font-medium flex items-center border border-white/10">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.duration}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 dark:text-slate-400 font-semibold">
                          <span className="text-slate-900 dark:text-slate-200 font-bold">{course.code}</span>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold">{course.videosCount || 4} Video</span>
                          <span>•</span>
                          <span>{course.quizCount}</span>
                          <span>•</span>
                          <span>Chuẩn: {course.passingScore}</span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                          {course.title}
                        </h4>

                        <p className="text-[11px] text-slate-400 dark:text-slate-400">
                          {course.instructor}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 py-2.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-end text-xs">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 dark:bg-[#1e212b] group-hover:bg-blue-600 dark:group-hover:bg-amber-500 text-blue-700 dark:text-slate-200 group-hover:text-white dark:group-hover:text-slate-950 font-bold text-[11px] border border-blue-200/60 dark:border-white/[0.08] group-hover:border-transparent transition-all shadow-2xs">
                        Vào học
                        <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* GIAO DIỆN A: TRANG CHỦ MAPSTUDY TỔNG QUAN (Sidebar Trái + Slider + Tư Vấn) */}
      {/* ========================================================================= */}
      {mainViewTab === 'home' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-5">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* COLUMN 1: MODERN FRAMELESS SIDEBAR (Thanh thoát, không đóng hộp, chuẩn UI/UX quốc tế) */}
            <aside className="w-full lg:w-60 xl:w-64 shrink-0 lg:sticky lg:top-20 space-y-4 order-2 lg:order-1">
              
              {/* 1. Top Action CTA: Vào học ngay */}
              <button 
                onClick={isLoggedIn ? onEnterApp : onOpenLogin}
                className="w-full flex items-center justify-center px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-black text-sm tracking-wide shadow-md dark:shadow-amber-500/15 border border-transparent dark:border-amber-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>{isLoggedIn ? 'Vào học ngay' : 'Đăng nhập LMS'}</span>
              </button>

              {/* 2. Main Navigation List (Frameless soft items) */}
              <div className="space-y-1">
                <button 
                  onClick={() => setMainViewTab('courses')}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticCourseIcon />
                  <span className="font-bold">Chuyên đề & Huấn luyện viên</span>
                </button>

                <button 
                  onClick={onOpenPracticeTest || onOpenLogin}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticExamIcon />
                  <span className="font-bold">Sát hạch online</span>
                </button>

                <button 
                  onClick={onOpenPracticeTest || onOpenLogin}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticArenaIcon />
                  <span className="font-bold">Luyện phản xạ thực địa</span>
                </button>

                <button 
                  onClick={onOpenCheatsheet || onOpenLogin}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticBookIcon />
                  <span className="font-bold">Cẩm nang & Kịch bản thực chiến</span>
                </button>

                <button 
                  onClick={() => {
                    setMainViewTab('courses');
                    setActiveCourseCategory('materials');
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticFolderIcon />
                  <span className="font-bold">Tài liệu</span>
                </button>

                <button 
                  onClick={() => setMainViewTab('community')}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticForumIcon />
                  <span className="font-bold">Diễn đàn</span>
                </button>

                <button 
                  onClick={() => setMainViewTab('community')}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticCommunityIcon />
                  <span className="font-bold">Cộng đồng Running Man</span>
                </button>
              </div>

              <div className="h-px bg-slate-200/60 dark:bg-slate-800 my-2" />

              {/* 3. Section: Liên kết */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2.5 mb-1.5">
                  Liên kết
                </span>

                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors text-xs font-semibold text-slate-600 dark:text-slate-400 group"
                >
                  <RealisticFacebookIcon />
                  <span className="group-hover:text-[#1877f2] transition-colors truncate">Facebook Running Man</span>
                </a>

                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors text-xs font-semibold text-slate-600 dark:text-slate-400 group"
                >
                  <RealisticYoutubeIcon />
                  <span className="group-hover:text-[#ff0000] transition-colors truncate">Thầy Đan Rin - Căn Hộ</span>
                </a>

                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors text-xs font-semibold text-slate-600 dark:text-slate-400 group"
                >
                  <RealisticTiktokIcon />
                  <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">Tiktok Running Man</span>
                </a>
              </div>
            </aside>

            {/* COLUMN 2: MAIN CONTENT (Seamless, breathable, frameless design) */}
            <main className="flex-1 min-w-0 space-y-6 order-1 lg:order-2 w-full">
              
              {/* 1. HERO BANNER CAROUSEL (CỔNG ĐÀO TẠO NỘI BỘ NHÂN VIÊN RUNNING MAN) */}
              <div 
                onMouseEnter={() => setIsBannerHovered(true)}
                onMouseLeave={() => setIsBannerHovered(false)}
                className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_24px_rgba(15,23,42,0.06)] min-h-[310px] sm:min-h-[340px] flex flex-col justify-between p-6 sm:p-8 lg:p-9 text-slate-900 dark:text-white transition-all duration-500 group/banner"
                style={{
                  background: theme === 'dark' ? (currentBanner.darkBgGradient || '#0f172a') : currentBanner.bgGradient
                }}
              >
                {/* Mũi tên chuyển trang bên trái (Quay vòng từ trang 1 sang trang 3 an toàn) */}
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 dark:bg-[#252525]/90 hover:bg-white dark:hover:bg-[#303030] text-slate-700 dark:text-zinc-200 shadow-md hover:shadow-xl border border-slate-200/90 dark:border-white/[0.1] backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                  title="Chuyển về trang trước (Trang 1 <-> Trang 3)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Mũi tên chuyển trang bên phải (Quay vòng từ trang 3 sang trang 1 an toàn) */}
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 dark:bg-[#252525]/90 hover:bg-white dark:hover:bg-[#303030] text-slate-700 dark:text-zinc-200 shadow-md hover:shadow-xl border border-slate-200/90 dark:border-white/[0.1] backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                  title="Chuyển sang trang tiếp theo (Trang 3 <-> Trang 1)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Soft ambient lighting spots */}
                <div className={`absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 ${currentBanner.spotlightColor} rounded-full blur-3xl pointer-events-none transition-all duration-700`} />

                {/* Top Badge & Date Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 mb-3 px-1 sm:px-3">
                  <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-bold tracking-wide ${currentBanner.tagColor} dark:bg-[#282828] dark:border-white/[0.08] dark:text-zinc-200`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentBanner.dotColor} animate-pulse`}></span>
                    <span>{currentBanner.tag}</span>
                  </div>

                  <span className="text-xs text-slate-500 dark:text-zinc-300 font-semibold bg-white/85 dark:bg-[#252525]/85 backdrop-blur-md px-3.5 py-1 rounded-full border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
                    {currentBanner.date}
                  </span>
                </div>

                {/* Content Grid: Left Info & Right Visual (ĐỘNG HOÀN TOÀN THEO SLIDE) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-center my-2 relative z-10 px-1 sm:px-3">
                  
                  {/* Cột trái: Tiêu đề typography động */}
                  <div className="md:col-span-7 space-y-3.5 text-left">
                    <h1 className="text-xl sm:text-2xl lg:text-[31px] font-black tracking-tight leading-[1.24] text-slate-950 dark:text-white uppercase">
                      {currentBanner.titleTop} <span className="text-[#0d5cb6] dark:text-blue-400">{currentBanner.titleHighlight}</span><br />
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold">{currentBanner.titleBottom}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl">
                      {currentBanner.subtitle}
                    </p>

                    {/* Huy hiệu đặc quyền nội bộ */}
                    <div className="pt-1 flex flex-wrap items-center gap-2.5">
                      <div className="px-4 py-2 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 border border-transparent dark:border-slate-700">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>{currentBanner.badgeTitle}</span>
                      </div>
                    </div>

                    {/* CTA Buttons - Tối ưu chạm bấm trên màn hình điện thoại */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                      <button
                        onClick={() => {
                          if (currentBanner.actionType === 'playbook') {
                            if (onOpenCheatsheet) onOpenCheatsheet();
                            else if (onOpenLogin) onOpenLogin();
                          } else if (currentBanner.actionType === 'exam') {
                            if (onOpenPracticeTest) onOpenPracticeTest();
                            else if (onOpenLogin) onOpenLogin();
                          } else {
                            if (isLoggedIn) onEnterApp();
                            else onOpenLogin();
                          }
                        }}
                        className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-black text-xs shadow-md dark:shadow-amber-500/20 border border-blue-400/30 dark:border-amber-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <Play className="w-3 h-3 fill-white dark:fill-stone-950 text-white dark:text-stone-950" />
                        <span>{currentBanner.primaryBtnText}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (currentBanner.actionType === 'exam') {
                            if (onOpenLeaderboard) onOpenLeaderboard();
                            else setMainViewTab('courses');
                          } else {
                            setMainViewTab('courses');
                          }
                        }}
                        className="px-4 py-2.5 rounded-full bg-white dark:bg-[#282828] hover:bg-slate-50 dark:hover:bg-[#323232] text-slate-700 dark:text-zinc-200 font-semibold text-xs border border-slate-200 dark:border-white/[0.08] shadow-2xs transition-all cursor-pointer hover:border-slate-300 dark:hover:border-white/[0.15] text-center"
                      >
                        {currentBanner.secondaryBtnText}
                      </button>
                    </div>
                  </div>

                  {/* Cột phải: THẺ MINH HỌA ĐA DẠNG THEO TỪNG SLIDE (Khác biệt 100%) */}
                  <div className="md:col-span-5 relative w-full">
                    <div className="bg-white dark:bg-[#202020] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/[0.08] shadow-md p-2.5 space-y-2.5 max-w-[340px] mx-auto md:ml-auto w-full">
                      
                      {/* Ảnh minh họa theo slide */}
                      <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img 
                          src={currentBanner.cardImg} 
                          alt={currentBanner.cardTitle} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-semibold text-white">
                          {currentBanner.cardTitle}
                        </div>
                        <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-slate-900/90 text-white font-bold text-[11px] shadow-xs">
                          {currentBanner.cardTag}
                        </div>
                      </div>

                      {/* Thẻ phụ chi tiết theo từng slide */}
                      <div 
                        onClick={() => {
                          if (currentBanner.actionType === 'playbook') {
                            if (onOpenCheatsheet) onOpenCheatsheet();
                            else onOpenLogin();
                          } else if (currentBanner.actionType === 'exam') {
                            if (onOpenPracticeTest) onOpenPracticeTest();
                            else onOpenLogin();
                          } else {
                            setMainViewTab('courses');
                          }
                        }}
                        className="flex items-center space-x-3 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100/90 dark:hover:bg-slate-700 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer group"
                      >
                        {currentBanner.visualType === 'apartment' ? (
                          <img 
                            src="/images/anh_rin_avatar.jpg" 
                            alt="Đan Rin" 
                            className="w-10 h-10 rounded-xl object-cover border border-blue-400/80 shrink-0 shadow-xs"
                          />
                        ) : currentBanner.visualType === 'playbook' ? (
                          <RealisticBookIcon className="w-10 h-10 rounded-xl" />
                        ) : (
                          <RealisticCertificateIcon className="w-10 h-10 rounded-xl" />
                        )}

                        <div className="text-left flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {currentBanner.mentorName}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {currentBanner.mentorDesc}
                          </p>
                        </div>

                        <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold shrink-0">
                          RMSA ★
                        </span>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Carousel Navigation Dots + Page Counter */}
                <div className="flex items-center justify-center space-x-3 pt-2 relative z-10">
                  <div className="flex items-center space-x-2">
                    {heroBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          safeSlide === idx ? 'w-8 bg-slate-900 dark:bg-white' : 'w-2 bg-slate-400/50 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-400'
                        }`}
                        title={`Xem trang ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-400">
                    0{safeSlide + 1} / 0{heroBanners.length}
                  </span>
                </div>
              </div>

              {/* 3. HOT KEYWORDS ROW (Seamless, no heavy box) */}
              <div className="flex flex-wrap items-center gap-2 py-1 px-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mr-1" />
                  Tìm kiếm nổi bật:
                </span>
                {hotKeywords.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item.query);
                      setMainViewTab('courses');
                    }}
                    className="px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 text-xs font-medium transition-all cursor-pointer border border-transparent dark:border-slate-700/60 shadow-2xs"
                  >
                    #{item.title}
                  </button>
                ))}
              </div>

              {/* BẢNG ĐIỀU KHIỂN TIẾN ĐỘ HỌC TẬP NỘI BỘ & NÚT TIẾP TỤC HỌC 1 CHẠM (PHƯƠNG ÁN 1) */}
              <section className="space-y-6 pt-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[11px] font-bold tracking-wider uppercase border border-blue-200/60 dark:border-blue-800">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Cổng Học Tập Nội Bộ RMSA</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Bảng Tiến Độ Đào Tạo & Tiếp Tục Học 1 Chạm
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
                      Chuẩn hóa 8 chuyên đề thực chiến • Vượt qua sát hạch ≥ 80% để mở khóa chứng chỉ thực địa
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenLeaderboard && onOpenLeaderboard()}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Bảng Vàng Học Viên</span>
                    </button>
                    <button
                      onClick={() => onOpenCertificate && onOpenCertificate()}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all flex items-center space-x-1.5 border border-blue-200/60 dark:border-blue-800 cursor-pointer shadow-2xs"
                    >
                      <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Chứng Chỉ RMSA</span>
                    </button>
                  </div>
                </div>

                {/* Main Progress & Next Lesson Showcase Card */}
                <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-slate-50/60 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
                  {/* Decorative subtle ambient background glows */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Left side: Student Info & Overall Progress (7 cols) */}
                    <div className="lg:col-span-7 space-y-5">
                      <div className="flex items-center space-x-3.5">
                        {/* Avatar có thể click đổi */}
                        <div 
                          onClick={() => {
                            if (isLoggedIn && onOpenProfile) onOpenProfile();
                            else if (onOpenLogin) onOpenLogin('login');
                          }}
                          className="relative group shrink-0 cursor-pointer"
                          title={isLoggedIn ? "Bấm để đổi ảnh đại diện và chỉnh sửa hồ sơ" : "Bấm để đăng nhập tài khoản"}
                        >
                          {currentUser?.avatarUrl || currentUser?.avatar_url ? (
                            <img 
                              src={currentUser.avatarUrl || currentUser.avatar_url} 
                              alt={studentName}
                              className="w-13 h-13 rounded-2xl object-cover shadow-md shrink-0 border border-blue-400/80 ring-2 ring-blue-500/20 group-hover:ring-blue-500 transition-all"
                            />
                          ) : (
                            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                              {(studentName && studentName.length > 0) ? studentName.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          {isLoggedIn && (
                            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-blue-600 text-white shadow-xs group-hover:scale-110 transition-transform">
                              <Camera className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 
                              onClick={() => {
                                if (isLoggedIn && onOpenProfile) onOpenProfile();
                                else if (onOpenLogin) onOpenLogin('login');
                              }}
                              className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {studentName}
                            </h3>
                            <span 
                              onClick={() => {
                                if (!isLoggedIn && onOpenLogin) onOpenLogin('login');
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${!isLoggedIn ? 'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700' : ''} ${
                              currentUser?.role === 'admin'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                : (isLoggedIn
                                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700')
                            }`}>
                              {currentUser?.role === 'admin' ? 'Quản Trị Viên' : (isLoggedIn ? 'Học Viên Nội Bộ' : 'Chưa Đăng Nhập ➜')}
                            </span>
                            {isLoggedIn && onOpenProfile && (
                              <button
                                type="button"
                                onClick={onOpenProfile}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                                title="Mở hồ sơ & Đổi avatar"
                              >
                                <Camera className="w-2.5 h-2.5" />
                                <span>Đổi Avatar / Hồ sơ</span>
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isLoggedIn ? (
                              <>
                                Mã {currentUser?.role === 'admin' ? 'quản trị' : 'học viên'}: <strong className="text-slate-700 dark:text-slate-200 font-mono font-bold">RMSA-{currentUser?.id ? String(currentUser.id).padStart(2, '0') : 'NV01'}</strong> • {currentUser?.branch || 'Huấn luyện bởi HLV Đan Rin'}
                              </>
                            ) : (
                              <>
                                Cổng đào tạo nội bộ Running Man • Đăng nhập để ghi nhận tiến độ & sát hạch
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span>Tiến độ hoàn thành 8 chuyên đề cốt lõi</span>
                          </span>
                          <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                            {progressPercent}% ({passedCount}/{totalLessonsCount} bài)
                          </span>
                        </div>
                        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 transition-all duration-700 ease-out shadow-xs"
                            style={{ width: `${Math.max(progressPercent, 4)}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
                          <span>{allCompleted ? '🎉 Bạn đã xuất sắc hoàn thành toàn bộ khóa học!' : `Còn ${totalLessonsCount - passedCount} chuyên đề cần vượt qua sát hạch`}</span>
                          <span>Chuẩn đạt: ≥ 80% / bài</span>
                        </p>
                      </div>

                      {/* 3 Metrics Mini Cards */}
                      <div className="grid grid-cols-3 gap-3 pt-1">
                        <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Chuyên đề đã đỗ</span>
                          <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                            {passedCount} <span className="text-xs text-slate-400 font-normal">/ {totalLessonsCount}</span>
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Điểm TB sát hạch</span>
                          <span className="text-base font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5 block">
                            {averageScore > 0 ? `${averageScore}%` : 'Chưa thi'}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Chứng chỉ điện tử</span>
                          <span className={`text-[12px] font-black mt-1 block truncate ${allCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {allCompleted ? '✓ Đã cấp' : 'Đang mở khóa'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: 1-Click Continue Learning Hero Action (5 cols) */}
                    <div className="lg:col-span-5">
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                        
                        <div className="relative z-10 space-y-3.5">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-white/20">
                              <Sparkles className="w-3 h-3 text-amber-300" />
                              <span>{allCompleted ? 'Ôn Tập Nâng Cao' : 'Bài Học Kế Tiếp Của Bạn'}</span>
                            </span>
                            <span className="text-[11px] font-bold text-blue-100/90 font-mono">
                              {nextLessonToStudy?.duration || '15 phút'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] font-semibold text-blue-200 block">
                              Chuyên đề {nextLessonToStudy?.order || 1}
                            </span>
                            <h4 className="text-base font-black text-white line-clamp-2 leading-snug mt-0.5">
                              {nextLessonToStudy?.title || 'Hiểu sâu sản phẩm & thị trường'}
                            </h4>
                          </div>

                          <p className="text-xs text-blue-100/80 line-clamp-2 leading-relaxed">
                            {Array.isArray(nextLessonToStudy?.summary) && nextLessonToStudy.summary[0]
                              ? nextLessonToStudy.summary[0]
                              : 'Học đúng quy trình thực chiến để tự tin dẫn khách và chốt cọc ngay tại phòng.'}
                          </p>

                          <div className="pt-2 flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => {
                                if (isLoggedIn) {
                                  if (onSelectCourse && nextLessonToStudy?.id) {
                                    onSelectCourse(nextLessonToStudy.id, 'lecture');
                                  } else if (onEnterApp) {
                                    onEnterApp();
                                  }
                                } else {
                                  if (onOpenLogin) onOpenLogin('login');
                                }
                              }}
                              className="w-full py-3 px-4 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-black text-sm transition-all duration-200 flex items-center justify-center shadow-lg shadow-black/10 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                            >
                              <span>{allCompleted ? 'Vào ôn luyện bài này' : 'Tiếp Tục Học Ngay'}</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                if (onSelectCourse && nextLessonToStudy?.id) {
                                  onSelectCourse(nextLessonToStudy.id, 'exam');
                                } else if (onOpenPracticeTest) {
                                  onOpenPracticeTest();
                                }
                              }}
                              className="py-3 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1 border border-white/20 cursor-pointer shrink-0"
                              title="Làm bài sát hạch trắc nghiệm chuyên đề này"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Thi thử</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ĐẤU TRƯỜNG PHẢN XẠ 60S & BẢNG PHONG THẦN RMSA */}
              <section className="space-y-4 pt-2">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  
                  {/* CỘT 1: ĐẤU TRƯỜNG PHẢN XẠ 60 GIÂY (7 cols) */}
                  <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 text-[10.5px] font-bold tracking-wider uppercase border border-amber-200/60 dark:border-amber-800">
                              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>Đấu Trường Phản Xạ 60s</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                              <Shuffle className="w-2.5 h-2.5 text-blue-500" />
                              <span>{currentScenario?.source?.includes('gemini') ? '✨ AI Tự Tạo' : '🎲 Random Không Lặp'}</span>
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Tình huống thực địa ngẫu nhiên</span>
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            {streakData.completedToday ? (
                              <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span>Hôm nay đã đạt chuẩn chuỗi • Ngày mai mở Chuỗi {streakData.streak + 1}</span>
                              </span>
                            ) : (
                              <span className="text-[10.5px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-amber-500 shrink-0 animate-pulse" />
                                <span>Đúng 1 câu hôm nay để mở Chuỗi {streakData.streak + 1} ngày 🔥</span>
                              </span>
                            )}

                            {/* Hạn ngạch rèn luyện chống spam */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                              dailyQuota.scenariosToday >= (dailyQuota.scenariosMax || 5)
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            }`}>
                              <span>🎯 Đã tích điểm: {dailyQuota.scenariosToday}/{dailyQuota.scenariosMax || 5} câu hôm nay</span>
                            </span>
                          </div>
                        </div>

                        {/* Top Right Controls & Streak */}
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            type="button"
                            disabled={isAiGeneratingScenario}
                            onClick={() => handleNextRandomScenario(true)}
                            className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800 text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
                            title="Yêu cầu Gemini AI sinh tình huống mới toanh"
                          >
                            <Bot className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${isAiGeneratingScenario ? 'animate-spin' : ''}`} />
                            <span>{isAiGeneratingScenario ? 'AI đang tạo...' : 'AI Tạo Mới'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setIsStreakModalOpen(true)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border shrink-0 shadow-2xs cursor-pointer transition-all hover:scale-105 active:scale-95 text-left ${
                              streakData.completedToday
                                ? 'bg-amber-500/10 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 ring-1 ring-amber-400/30'
                                : 'bg-orange-50 dark:bg-orange-950/60 border-orange-200/70 dark:border-orange-800 text-orange-600 dark:text-orange-400'
                            }`}
                            title="Nhấn để xem quy luật tự động & lộ trình chuỗi ngày"
                          >
                            <Flame className={`w-4 h-4 fill-orange-500 text-orange-500 ${streakData.completedToday ? 'animate-bounce' : 'animate-pulse'}`} />
                            <div className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-[9.5px] uppercase font-bold tracking-wider block leading-none text-slate-400 dark:text-slate-500">Chuỗi đúng</span>
                                {streakData.completedToday && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" title="Đã đạt chuẩn hôm nay"></span>
                                )}
                              </div>
                              <span className="text-xs font-black font-mono leading-none mt-0.5 block">{streakData.streak} ngày 🔥</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Thông báo chúc mừng khi hoàn thành câu đúng nâng chuỗi */}
                      {streakCelebrationMsg && (
                        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center justify-between shadow-2xs animate-in fade-in">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />
                            <span>{streakCelebrationMsg}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStreakCelebrationMsg('')}
                            className="p-1 hover:bg-amber-200 dark:hover:bg-amber-900 rounded-md text-slate-500 hover:text-slate-700 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Question Box */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/80">
                            Chủ đề: {currentScenario?.category || 'Xử lý phản đối'}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleNextRandomScenario(false)}
                            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Shuffle className="w-3 h-3" />
                            <span>Đổi câu khác</span>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                          "{currentScenario?.question}"
                        </p>
                      </div>

                      {/* 4 Options */}
                      <div className="space-y-2">
                        {(currentScenario?.options || []).map((opt, oIdx) => {
                          const isSelected = selectedScenarioOption === oIdx;
                          const showResult = selectedScenarioOption !== null;
                          let optionStyle = "border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200";
                          
                          if (showResult) {
                            if (opt.isCorrect) {
                              optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500 font-bold";
                            } else if (isSelected && !opt.isCorrect) {
                              optionStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500";
                            } else {
                              optionStyle = "border-slate-200/40 dark:border-slate-800/40 opacity-40 text-slate-400";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={showResult}
                              onClick={() => handleSelectScenarioOption(oIdx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-[13px] font-medium transition-all flex items-start space-x-2.5 cursor-pointer ${optionStyle}`}
                            >
                              <span className="font-bold shrink-0 mt-0.5">
                                {showResult && opt.isCorrect ? '✅' : (showResult && isSelected ? '❌' : `(${String.fromCharCode(65 + oIdx)})`)}
                              </span>
                              <span className="flex-1 leading-snug">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Mentor Feedback & Next Button */}
                      {selectedScenarioOption !== null && currentScenario?.options[selectedScenarioOption] && (
                        <div className="pt-2 space-y-3">
                          <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                            currentScenario.options[selectedScenarioOption].isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                          }`}>
                            <div className="font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>Cố vấn thực chiến từ HLV Đan Rin:</span>
                            </div>
                            <p>{currentScenario.options[selectedScenarioOption].feedback}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={isAiGeneratingScenario}
                              onClick={() => handleNextRandomScenario(true)}
                              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                              <Bot className={`w-3.5 h-3.5 ${isAiGeneratingScenario ? 'animate-spin' : ''}`} />
                              <span>{isAiGeneratingScenario ? 'AI đang tạo...' : '✨ AI Tạo Tình Huống Mới'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleNextRandomScenario(false)}
                              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 text-white dark:text-slate-900 hover:text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                            >
                              <span>Tình huống tiếp theo (Ngẫu nhiên)</span>
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CỘT 2: BẢNG PHONG THẦN & HUY HIỆU CHIẾN BINH (5 cols) */}
                  <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="space-y-0.5">
                          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[10.5px] font-bold tracking-wider uppercase border border-blue-200/60 dark:border-blue-800">
                            <Trophy className="w-3 h-3 text-amber-500" />
                            <span>Bảng Vàng Tuần Này</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                            Top Chiến Binh RMSA
                          </h3>
                        </div>

                        <button
                          onClick={() => onOpenLeaderboard && onOpenLeaderboard()}
                          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-0.5 cursor-pointer"
                        >
                          <span>Xem tất cả</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Top 3 Leaderboard List */}
                      {leaderboardList.length === 0 ? (
                        <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-dashed border-amber-300/60 dark:border-amber-800/60 text-center space-y-2">
                          <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              Bảng Vàng Đang Chờ Ghi Danh
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                              Chưa có nhân viên nào hoàn thành bài thi đạt chuẩn tuần này. Toàn bộ dữ liệu mẫu đã làm sạch để công bằng 100%.
                            </p>
                          </div>
                          <button
                            onClick={() => onOpenPracticeTest ? onOpenPracticeTest() : (onEnterApp && onEnterApp())}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
                          >
                            <span>Làm bài sát hạch ngay</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {leaderboardList.slice(0, 3).map((st) => {
                            const isRank1 = st.rank === 1;
                            const isRank2 = st.rank === 2;
                            const initial = (st.name || 'N').charAt(0).toUpperCase();

                            return (
                              <div 
                                key={st.rank}
                                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-2xs ${
                                  isRank1 
                                    ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/60'
                                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60'
                                }`}
                              >
                                <div className="flex items-center space-x-3 min-w-0">
                                  <span className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                                    isRank1 
                                      ? 'bg-amber-400 text-slate-900' 
                                      : isRank2 
                                        ? 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white'
                                        : 'bg-amber-700/60 text-white'
                                  }`}>
                                    {st.rank}
                                  </span>
                                  <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                                    isRank1
                                      ? 'bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                                  }`}>
                                    {initial}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                      {formatStudentName(st.name)}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                      {st.branch || 'RMSA'} • {st.passedCount}/{st.totalCourses || 8} Bài • {st.avgScore}% TB
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-[11px] font-black font-mono shrink-0 ${
                                  isRank1 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'
                                }`}>
                                  {st.streak || 0} 🔥
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Badges Section */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Huy Hiệu Chinh Phục Của Bạn
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800 text-center">
                            <span className="text-lg block">⚡</span>
                            <span className="text-[10px] font-bold text-blue-900 dark:text-blue-200 block truncate mt-0.5">Phá Băng</span>
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold block">Đã đạt</span>
                          </div>
                          <div className={`p-2.5 rounded-xl border text-center ${passedCount >= 5 ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'}`}>
                            <span className="text-lg block">🛡️</span>
                            <span className="text-[10px] font-bold text-slate-900 dark:text-white block truncate mt-0.5">Bẻ Gãy Giá</span>
                            <span className={`text-[9px] font-semibold block ${passedCount >= 5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                              {passedCount >= 5 ? 'Đã đạt' : 'Đang mở'}
                            </span>
                          </div>
                          <div className={`p-2.5 rounded-xl border text-center ${allCompleted ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-800' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'}`}>
                            <span className="text-lg block">👑</span>
                            <span className="text-[10px] font-bold text-slate-900 dark:text-white block truncate mt-0.5">Chốt Cọc 24h</span>
                            <span className={`text-[9px] font-semibold block ${allCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                              {allCompleted ? 'Đã đạt' : 'Cần 8/8 bài'}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </section>

            </main>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GIAO DIỆN C: CỘNG ĐỒNG THẢO LUẬN RUNNING MAN                              */}
      {/* ========================================================================= */}
      {mainViewTab === 'community' && (
        <InternalCommunityTab
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onOpenLogin={onOpenLogin}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. FOOTER CAO CẤP CHUẨN DOANH NGHIỆP & HỌC VIỆN THỰC CHIẾN               */}
      {/* ========================================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 mt-10 mb-8">
        <footer className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-9 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200/90 dark:border-slate-800 space-y-9 relative overflow-hidden transition-colors">
          
          {/* Ambient Decorative Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-32 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* DẢI 1: BĂNG CHUYỀN CAM KẾT CHẤT LƯỢNG ĐÀO TẠO (TRUST & QUALITY BAR) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-7 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
              <RealisticRealEstateIcon className="w-9 h-9" />
              <div className="min-w-0">
                <h5 className="text-[12px] font-bold text-slate-900 dark:text-white truncate">100% Thực Địa Thật</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Sản phẩm & giỏ hàng TP.HCM</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
              <RealisticAiRinIcon className="w-9 h-9" />
              <div className="min-w-0">
                <h5 className="text-[12px] font-bold text-slate-900 dark:text-white truncate">AI Running Rin 24/7</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Phản xạ bẻ gãy từ chối giá</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
              <RealisticCertificateIcon className="w-9 h-9" />
              <div className="min-w-0">
                <h5 className="text-[12px] font-bold text-slate-900 dark:text-white truncate">Chứng Chỉ Số Hóa</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Định danh cấp bằng điện tử</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
              <RealisticSecurityIcon className="w-9 h-9" />
              <div className="min-w-0">
                <h5 className="text-[12px] font-bold text-slate-900 dark:text-white truncate">Bảo Mật Nội Bộ SSL</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Phân quyền dữ liệu an toàn</p>
              </div>
            </div>
          </div>

          {/* DẢI 2: KHUNG 4 CỘT CHUYÊN NGHIỆP */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
            
            {/* CỘT 1 (4/12): THƯƠNG HIỆU & ĐỊNH VỊ CỐT LÕI */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-950 dark:bg-slate-900 border border-slate-800/80 shadow-md flex items-center justify-center p-1.5 shrink-0 ring-1 ring-white/10">
                  <img 
                    src="/images/running_man_logo.png" 
                    alt="Running Man" 
                    className="w-full h-full object-contain filter brightness-110 drop-shadow-[0_1px_3px_rgba(255,255,255,0.2)]"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-wider text-slate-900 dark:text-white leading-none">RUNNING MAN</span>
                    <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">PRO</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#0d5cb6] dark:text-blue-400 tracking-[0.24em] uppercase leading-none mt-1">Sales Academy</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pr-2">
                Học viện đào tạo nghiệp vụ môi giới và cho thuê căn hộ thực chiến Running Man. Định vị sản phẩm thật - Dẫn lối tư duy thực chiến chốt đơn đỉnh cao.
              </p>

              {/* Tagline Huy Hiệu Sang Trọng */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-800/60 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-[10.5px] font-black tracking-widest text-blue-700 dark:text-blue-300 uppercase">
                  "Every Journey Leads Home"
                </span>
              </div>

              {/* Mạng xã hội / Kênh đào tạo */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">Kênh Đào Tạo Chính Thức</span>
                <div className="flex items-center space-x-2">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
                    title="Facebook Running Man"
                  >
                    <RealisticFacebookIcon className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
                    title="YouTube Kênh Đào Tạo"
                  >
                    <RealisticYoutubeIcon className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://tiktok.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
                    title="TikTok Kỹ Năng Thực Chiến"
                  >
                    <RealisticTiktokIcon className="w-5 h-5" />
                  </a>
                  <div className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-[10.5px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    Zalo OA RMSA
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT 2 (3/12): LỘ TRÌNH ĐÀO TẠO */}
            <div className="lg:col-span-3 space-y-3.5">
              <div className="flex items-center space-x-2.5">
                <RealisticCourseIcon className="w-7 h-7" />
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  Lộ Trình Đào Tạo
                </h4>
              </div>

              <ul className="space-y-2 text-xs">
                {[
                  { num: '01', title: 'Sản phẩm & Khảo sát giá thị trường' },
                  { num: '02', title: 'Nguồn hàng & Giỏ căn hộ VIP' },
                  { num: '03', title: 'Đăng tin đa kênh & Khai thác nhu cầu' },
                  { num: '04', title: 'Telesale 30s & Dẫn khách thực địa' },
                  { num: '05', title: 'Bẻ gãy từ chối giá & Chốt cọc' },
                ].map((item) => (
                  <li 
                    key={item.num}
                    onClick={() => {
                      setMainViewTab('courses');
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.num}
                      </span>
                      <span className="truncate group-hover:translate-x-0.5 transition-transform">{item.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-500 transition-all shrink-0" />
                  </li>
                ))}
              </ul>
            </div>

            {/* CỘT 3 (2/12): HỆ SINH THÁI HỖ TRỢ HỌC VIÊN */}
            <div className="lg:col-span-2 space-y-3.5">
              <div className="flex items-center space-x-2.5">
                <RealisticArenaIcon className="w-7 h-7" />
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  Hỗ Trợ Thực Chiến
                </h4>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li 
                  onClick={onOpenCheatsheet || onOpenLogin}
                  className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <RealisticBookIcon className="w-5 h-5 rounded-lg shrink-0" />
                    <span className="truncate">Sổ tay kịch bản (PDF)</span>
                  </div>
                  <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                    Bỏ túi
                  </span>
                </li>

                <li 
                  onClick={onOpenPracticeTest || onOpenLogin}
                  className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <RealisticExamIcon className="w-5 h-5 rounded-lg shrink-0" />
                    <span className="truncate">Kỳ thi sát hạch online</span>
                  </div>
                  <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800">
                    Đổi mới
                  </span>
                </li>

                <li 
                  onClick={onOpenCertificate || onOpenLogin}
                  className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <RealisticCertificateIcon className="w-5 h-5 rounded-lg shrink-0" />
                    <span className="truncate">Tra cứu chứng chỉ số</span>
                  </div>
                  <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-200 dark:border-blue-800">
                    Mã QR
                  </span>
                </li>

                <li 
                  onClick={onOpenLeaderboard || onOpenLogin}
                  className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <RealisticTrophyIcon className="w-5 h-5 rounded-lg shrink-0" />
                    <span className="truncate">Bảng Vàng Best Seller</span>
                  </div>
                  <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-orange-50 dark:bg-orange-950 text-orange-600 border border-orange-200 dark:border-orange-800">
                    Live
                  </span>
                </li>
              </ul>
            </div>

            {/* CỘT 4 (3/12): BAN HUẤN LUYỆN, HOTLINE & VÀO LMS */}
            <div className="lg:col-span-3 space-y-3.5">
              <div className="flex items-center space-x-2.5">
                <RealisticSecurityIcon className="w-7 h-7" />
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  Ban Huấn Luyện & Tuyển Dụng
                </h4>
              </div>

              {/* Thẻ Mini Profile HLV Đan Rin */}
              <div className="p-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center space-x-3">
                <div className="relative shrink-0">
                  <img 
                    src="/images/anh_rin_avatar.jpg" 
                    alt="HLV Đan Rin" 
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">Đan Rin</span>
                    <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400">(Running Man)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">HLV Trưởng & Quản Lý Đào Tạo</p>
                </div>
              </div>

              {/* Hotline & Địa bàn */}
              <div className="space-y-1.5 text-xs">
                <a 
                  href="tel:0909386888" 
                  className="flex items-center space-x-2 p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100/60 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-[11px] font-bold">Hotline 24/7: 0909.38.68.88</span>
                </a>

                <div className="flex items-start space-x-2 text-[11px] text-slate-500 dark:text-slate-400 px-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Hội Sở RMSA • Bình Thạnh, Q.1, Q.7, TP. Thủ Đức</span>
                </div>
              </div>

              {/* Nút Vào LMS Đào Tạo */}
              <div className="pt-1">
                <button
                  onClick={isLoggedIn ? onEnterApp : onOpenLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{isLoggedIn ? 'Vào LMS Đào Tạo Thực Chiến' : 'Đăng Nhập Cổng Nội Bộ RMSA'}</span>
                </button>
                <div className="flex items-center justify-center space-x-1.5 text-[9.5px] text-slate-400 dark:text-slate-500 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Hệ thống LMS trực tuyến 24/7 • Phiên bản v2.6 Enterprise</span>
                </div>
              </div>
            </div>

          </div>

          {/* DẢI 3: CHÂN TRANG BẢN QUYỀN & TIỆN ÍCH LÊN ĐẦU TRANG */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="text-center sm:text-left">
              © {CURRENT_YEAR} <strong className="text-slate-700 dark:text-slate-300">RMSA (Running Man Sales Academy)</strong> • Giao diện chuẩn MapStudy • Toàn quyền tác quyền thuộc về <strong className="text-slate-700 dark:text-slate-300">Đan Rin & Running Man</strong>.
            </div>

            <div className="flex items-center space-x-4">
              <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors" onClick={() => setMainViewTab('courses')}>Quy chuẩn đào tạo</span>
              <span>•</span>
              <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors" onClick={onOpenCheatsheet || onOpenLogin}>Bảo mật nội bộ</span>
              <span>•</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition-all"
                title="Cuộn lên đầu trang"
              >
                <ArrowUp className="w-3 h-3" />
                <span>Lên đầu trang</span>
              </button>
            </div>
          </div>

        </footer>
      </div>

      {/* MODAL TẠO CHUYÊN ĐỀ MỚI (CHỈ DÀNH CHO QUẢN TRỊ VIÊN) */}
      <CreateCourseModal
        isOpen={isCreateCourseOpen}
        onClose={() => setIsCreateCourseOpen(false)}
        nextOrderNum={combinedCoursesList.length + 1}
        onCourseCreated={(updatedCourses) => {
          if (onCoursesUpdated) {
            onCoursesUpdated(updatedCourses);
          }
        }}
      />

      {/* MODAL CHI TIẾT CHUỖI RÈN LUYỆN THỰC CHIẾN TỰ ĐỘNG */}
      {isStreakModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                  <Flame className="w-5 h-5 fill-orange-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Chuỗi Rèn Luyện Thực Chiến
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cập nhật tự động theo ngày lịch thực tế
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStreakModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Highlight Box */}
            <div className="my-5 p-5 rounded-2xl bg-linear-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 text-center relative">
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                Thành tích hiện tại
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white my-1 font-mono flex items-center justify-center gap-2">
                <span>{streakData.streak}</span>
                <span className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-300">ngày</span>
                <Flame className="w-7 h-7 fill-orange-500 text-orange-500 animate-bounce" />
              </div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-2">
                {streakData.streak === 0 ? (
                  <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4 inline animate-pulse" />
                    Tài khoản mới: Chỉ cần trả lời đúng 1 câu tình huống hôm nay để kích hoạt Chuỗi 1 ngày đầu tiên!
                  </span>
                ) : streakData.completedToday ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 inline" />
                    Hôm nay bạn đã hoàn thành câu đúng! Mục tiêu ngày mai: Mở Chuỗi {streakData.streak + 1} ngày 🔥
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4 inline animate-pulse" />
                    Chỉ cần đúng 1 câu tình huống hôm nay để kích hoạt Chuỗi {streakData.streak + 1} ngày!
                  </span>
                )}
              </p>
            </div>

            {/* Lộ trình ngày trực quan */}
            <div className="space-y-2 mb-5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Lộ trình mở chuỗi tự động:
              </div>
              <div className="grid grid-cols-4 gap-2">
                {streakData.streak === 0 ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 text-center">
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Chuỗi 1</div>
                      <div className="text-xs font-black text-blue-700 dark:text-blue-300">Đúng hôm nay 🚀</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center opacity-70">
                      <div className="text-[10px] text-slate-500 font-bold">Chuỗi 2</div>
                      <div className="text-xs font-bold text-slate-500">Ngày mai ⏳</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center opacity-60">
                      <div className="text-[10px] text-slate-400 font-bold">Chuỗi 3</div>
                      <div className="text-xs font-bold text-slate-400">Ngày mốt ⏳</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center opacity-50">
                      <div className="text-[10px] text-slate-400 font-bold">Chuỗi 4</div>
                      <div className="text-xs font-bold text-slate-400">Sắp tới...</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center">
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Chuỗi {Math.max(1, streakData.streak - 1)}</div>
                      <div className="text-xs font-black text-emerald-700 dark:text-emerald-300">Đã đạt ✅</div>
                    </div>
                    <div className={`p-2.5 rounded-xl border text-center ${
                      streakData.completedToday
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                    }`}>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Chuỗi {streakData.streak}</div>
                      <div className={`text-xs font-black ${streakData.completedToday ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                        {streakData.completedToday ? 'Hôm nay ✅' : 'Đang giữ 🔥'}
                      </div>
                    </div>
                    <div className={`p-2.5 rounded-xl border text-center ${
                      streakData.completedToday
                        ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                        : 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800'
                    }`}>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Chuỗi {streakData.streak + 1}</div>
                      <div className="text-xs font-black text-blue-700 dark:text-blue-300">
                        {streakData.completedToday ? 'Ngày mai ⏳' : 'Hôm nay 🚀'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center opacity-70">
                      <div className="text-[10px] text-slate-400 font-bold">Chuỗi {streakData.streak + 2}</div>
                      <div className="text-xs font-bold text-slate-400">Sắp tới...</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quy tắc rèn luyện chuẩn RMSA */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Target className="w-3.5 h-3.5 text-blue-500" />
                <span>Quy chuẩn phản xạ từ HLV Đan Rin:</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-[11px] leading-relaxed">
                <li><strong className="text-slate-800 dark:text-slate-200">Bắt đầu từ ngày 1:</strong> Tài khoản mới chưa học ngày nào sẽ bắt đầu từ Chuỗi 0. Khi trả lời đúng câu đầu tiên, chuỗi sẽ kích hoạt lên 1 ngày.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">1 câu đúng mỗi ngày:</strong> Mỗi ngày chỉ cần trả lời đúng ít nhất 1 tình huống thực địa để duy trì & mở ngày tiếp theo (đủ 3 ngày mở chuỗi 4).</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Chống học vẹt:</strong> Làm nhiều câu trong 1 ngày vẫn chỉ tính 1 ngày để đảm bảo thói quen phản xạ bền bỉ mỗi ngày.</li>
              </ul>
            </div>

            {/* Công cụ kiểm thử nhanh & Đặt lại chuỗi */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-400 font-medium">Công cụ kiểm thử:</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleResetStreak}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 font-bold transition-colors cursor-pointer"
                  title="Đặt lại chuỗi về 0 ngày như một tài khoản mới"
                >
                  🔄 Đặt về 0 ngày (Mới)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetTestStreak(3)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600 dark:hover:text-amber-400 text-slate-600 dark:text-slate-300 font-bold transition-colors cursor-pointer"
                  title="Thiết lập sẵn 3 ngày để test tính năng mở chuỗi 4"
                >
                  ⚡ Mốc 3 ngày (Test mở 4)
                </button>
              </div>
            </div>

            {/* Footer Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsStreakModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white hover:bg-blue-600 dark:hover:bg-blue-500 text-white dark:text-slate-900 hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Đã hiểu & Tiếp tục luyện phản xạ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
