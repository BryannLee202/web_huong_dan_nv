import React, { useState, useEffect } from 'react';
import { 
  Search, 
  LogIn, 
  BookOpen, 
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
  Send,
  Check,
  LogOut,
  Plus,
  Menu
} from 'lucide-react';
import { 
  RealisticCourseIcon,
  RealisticExamIcon,
  RealisticArenaIcon,
  RealisticBookIcon,
  RealisticFolderIcon,
  RealisticForumIcon,
  RealisticCommunityIcon,
  RealisticFacebookIcon,
  RealisticYoutubeIcon,
  RealisticTiktokIcon
} from './RealisticIcons';
import ThemeToggle from './ThemeToggle';
import InternalCommunityTab from './InternalCommunityTab';
import CreateCourseModal from './CreateCourseModal';

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
  onCoursesUpdated,
  initialTab = 'home',
  onTabChange
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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form "Liên hệ tư vấn"
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    facebook: '',
    region: '',
    segment: ''
  });

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
      date: 'Khóa Huấn Luyện 2026',
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
      date: 'Sổ Tay Kịch Bản Bỏ Túi 2026',
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
    { title: 'Thầy Đan Rin', query: 'Đan Rin' },
    { title: 'Checklist đón khách 15p', query: 'đón khách' },
    { title: '8 Nhóm năng lực', query: 'nhóm' },
    { title: 'Quy đổi 16k/ngày', query: '16k' }
  ];

  // 8 Nhóm năng lực môi giới cho thuê của Đan Rin (Tách riêng từng chủ đề độc lập)
  const competencyRoadmap = [
    {
      groupNum: 1,
      filterKey: 'nhom_1',
      title: 'Nhóm 1 — Hiểu sản phẩm và thị trường',
      objective: 'Nhân viên phải hiểu mình đang bán gì, cho ai và vì sao khách nên thuê căn đó.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 2,
      filterKey: 'nhom_2',
      title: 'Nhóm 2 — Tạo nguồn hàng và quản lý giỏ căn hộ',
      objective: 'Có nguồn hàng thật, thông tin chính xác và đủ lựa chọn để đáp ứng nhu cầu khách.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 3,
      filterKey: 'nhom_3',
      title: 'Nhóm 3 — Tìm kiếm khách hàng và khai thác nhu cầu',
      objective: 'Biết chủ động tạo khách hàng tiềm năng, thay vì chỉ ngồi chờ khách hỏi tin đăng.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 4,
      filterKey: 'nhom_4',
      title: 'Nhóm 4 — Tư vấn và dẫn khách xem căn hộ',
      objective: 'Tăng tỷ lệ khách từ đặt lịch sang xem thật, và từ xem căn sang lựa chọn căn phù hợp.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 5,
      filterKey: 'nhom_5',
      title: 'Nhóm 5 — Xử lý từ chối, đàm phán và chốt giao dịch',
      objective: 'Bẻ gãy phản đối giá, giải tỏa tâm lý do dự và chốt cọc giữ phòng nhanh gọn.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 6,
      filterKey: 'nhom_6',
      title: 'Nhóm 6 — CRM, KPI và quản lý phễu bán hàng',
      objective: 'Quản lý data khách, theo dõi tỷ lệ chuyển đổi từng giai đoạn và kỷ luật công việc.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 7,
      filterKey: 'nhom_7',
      title: 'Nhóm 7 — Kỷ luật nghề nghiệp và dịch vụ khách hàng',
      objective: 'Đạo đức làm nghề môi giới, bảo vệ cọc của khách, dịch vụ sau chốt và tạo nguồn giới thiệu.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 8,
      filterKey: 'nhom_8',
      title: 'Nhóm 8 — Thực chiến ngoài thị trường',
      objective: 'Tự tin xử lý tình huống thực địa, khảo sát thị trường và giải quyết ca khó phát sinh.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    }
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

  // Cẩm nang & Tin tức thực chiến
  const articlesList = [
    {
      id: 'art-1',
      title: 'Kịch bản 30 giây phá băng khi khách nhắn hỏi: "Phòng này còn không em? Giá bao nhiêu?"',
      excerpt: 'Tuyệt đối không chỉ trả lời "Dạ còn" rồi im lặng. Quy trình 3 bước gửi lời chào nồng nhiệt, khơi gợi thời gian dọn phòng và chốt lịch xem phòng trực tiếp trong ngày.',
      tag: 'Nhóm 4 • Telesale',
      readTime: '4 phút đọc',
      date: 'Tháng 10/2026',
      views: '1,420',
      thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'art-2',
      title: 'Bí quyết biến 500k chênh lệch thành 16.000đ/ngày: Bẻ gãy lời từ chối "Giá phòng bên em đắt quá"',
      excerpt: 'Quy đổi chi phí trên ngày: 16k/ngày chưa bằng nửa ly cà phê nhưng đổi lấy an ninh vân tay 2 lớp, camera 24/7, giờ tự do, máy giặt riêng và bảo trì kỹ thuật miễn phí.',
      tag: 'Nhóm 5 • Bẻ gãy từ chối',
      readTime: '6 phút đọc',
      date: 'Tháng 10/2026',
      views: '2,890',
      thumb: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'art-3',
      title: 'Checklist 5 bước biến căn phòng thành không gian hút khách trước giờ hẹn 15 phút',
      excerpt: 'Đến trước mở cửa thông thoáng, bật điều hòa 24 độ mát rượi, hương tinh dầu nhẹ, kéo rèm đón sáng tự nhiên tạo ấn tượng WOW ngay khi khách bước chân vào.',
      tag: 'Nhóm 4 • Dẫn khách',
      readTime: '5 phút đọc',
      date: 'Tháng 10/2026',
      views: '1,950',
      thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'art-4',
      title: 'Kỹ thuật chốt cọc giả định (Assumptive Close) & Quy trình thu cọc lập phiếu giữ phòng 24h',
      excerpt: 'Cách nhận diện 4 tín hiệu muốn mua của khách thuê và hướng khách hàng vào phương thức đặt cọc (tiền mặt hay quét QR) để khóa phòng trên hệ thống.',
      tag: 'Nhóm 5 • Chốt cọc',
      readTime: '5 phút đọc',
      date: 'Tháng 10/2026',
      views: '3,210',
      thumb: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=500&q=80'
    }
  ];


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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Vui lòng nhập Họ và tên và Số điện thoại nội bộ!');
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      alert('Đã gửi yêu cầu kèm cặp thực tế thành công! Ban Đào Tạo RMSA sẽ sắp xếp nhân sự hỗ trợ bạn ngay trong ca làm việc.');
      setFormData({ fullName: '', phone: '', facebook: '', region: '', segment: '' });
      setFormSubmitted(false);
    }, 400);
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
                className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-white/[0.05] transition-all cursor-pointer flex items-center space-x-1.5"
                title="Vào phòng học & làm bài kiểm tra sát hạch 8 chuyên đề"
              >
                <Play className="w-3 h-3 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400 shrink-0" />
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
                    className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                  >
                    <LogIn className="w-3.5 h-3.5 text-white" />
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
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-[#24201c] dark:to-[#1d1a17] border border-slate-200/80 dark:border-white/[0.08] space-y-3 shadow-xs">
              <div className="flex items-center space-x-3">
                {currentUser?.avatarUrl || currentUser?.avatar_url ? (
                  <img 
                    src={currentUser.avatarUrl || currentUser.avatar_url} 
                    alt={currentUser?.name || 'User'} 
                    className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-white dark:ring-[#2e2a26]" 
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-sm shrink-0 ring-2 ring-white dark:ring-[#2e2a26]">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-900 dark:text-white text-sm truncate">
                      {currentUser?.name || 'Nhân viên RMSA'}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {currentUser?.email || currentUser?.username || 'nhanvien@gmail.com'}
                  </p>
                </div>
              </div>

              {/* Role Badge - Chỉ hiển thị Quản Trị Viên hoặc Nhân Viên (Đã bỏ hoàn toàn chi nhánh) */}
              <div className="flex flex-wrap gap-1.5 pt-1">
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
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Play className="w-3.5 h-3.5" />
              </div>
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
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
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
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
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
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Star className="w-3.5 h-3.5" />
              </div>
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
              <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Award className="w-3.5 h-3.5" />
              </div>
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
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Mail className="w-3.5 h-3.5" />
              </div>
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
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-black text-xs shadow-md dark:shadow-amber-500/15 border border-transparent dark:border-amber-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
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
                className="w-full flex items-center justify-center space-x-2.5 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-black text-sm tracking-wide shadow-md dark:shadow-amber-500/15 border border-transparent dark:border-amber-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
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
                        className="flex items-center space-x-3 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100/90 dark:hover:bg-slate-750 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer group"
                      >
                        {currentBanner.visualType === 'apartment' ? (
                          <img 
                            src="/images/anh_rin_avatar.jpg" 
                            alt="Đan Rin" 
                            className="w-10 h-10 rounded-lg object-cover border border-blue-400/80 shrink-0"
                          />
                        ) : currentBanner.visualType === 'playbook' ? (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400">
                            <Award className="w-5 h-5" />
                          </div>
                        )}

                        <div className="text-left flex-1 min-w-0">
                          <div className="flex items-center space-x-1">
                            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                              {currentBanner.mentorRole}
                            </span>
                            <CheckCircle2 className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                          </div>
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

              {/* 2. "ĐĂNG KÝ KÈM CẶP THỰC ĐỊA 1-1" FORM (Chuẩn nội bộ 100%) */}
              <div className="bg-white/80 dark:bg-[#1f1c1a] backdrop-blur-xs rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(15,23,42,0.02)] border border-slate-200/60 dark:border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      Đăng ký kèm cặp thực địa 1-1
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-stone-400">
                      Dành cho học viên mới cần HLV Đan Rin hoặc Quản lý đi cùng hỗ trợ dẫn khách chốt deal tại phòng
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200/80 dark:border-amber-800/40 hidden sm:inline-block">
                    Ưu tiên hỗ trợ trong ngày
                  </span>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-3.5 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="* Họ và tên học viên"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#262320] hover:bg-slate-100/70 dark:hover:bg-[#2e2a26] focus:bg-white dark:focus:bg-[#262320] text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-stone-500 border border-slate-200 dark:border-stone-700 focus:border-amber-500 dark:focus:border-amber-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="* Số điện thoại nội bộ"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#262320] hover:bg-slate-100/70 dark:hover:bg-[#2e2a26] focus:bg-white dark:focus:bg-[#262320] text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-stone-500 border border-slate-200 dark:border-stone-700 focus:border-amber-500 dark:focus:border-amber-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="Mã nhân viên / Zalo liên hệ trực tiếp"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#262320] hover:bg-slate-100/70 dark:hover:bg-[#2e2a26] focus:bg-white dark:focus:bg-[#262320] text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-stone-500 border border-slate-200 dark:border-stone-700 focus:border-amber-500 dark:focus:border-amber-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#262320] hover:bg-slate-100/70 dark:hover:bg-[#2e2a26] focus:bg-white dark:focus:bg-[#262320] text-xs text-slate-700 dark:text-stone-200 border border-slate-200 dark:border-stone-700 focus:border-amber-500 dark:focus:border-amber-500 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="">* Khu vực thị trường cần dẫn khách</option>
                        <option value="binh_thanh">Khu vực Bình Thạnh - Phú Nhuận</option>
                        <option value="quan_1_3">Khu vực Quận 1 - Quận 3 - Quận 10</option>
                        <option value="thu_duc">Khu vực TP. Thủ Đức (Thảo Điền, An Phú)</option>
                        <option value="go_vap">Khu vực Gò Vấp - Tân Bình</option>
                        <option value="quan_7">Khu vực Quận 7 - Nam Sài Gòn</option>
                      </select>
                    </div>

                    <div>
                      <select
                        value={formData.segment}
                        onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#262320] hover:bg-slate-100/70 dark:hover:bg-[#2e2a26] focus:bg-white dark:focus:bg-[#262320] text-xs text-slate-700 dark:text-stone-200 border border-slate-200 dark:border-stone-700 focus:border-amber-500 dark:focus:border-amber-500 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="">* Tình huống cần hỗ trợ kèm cặp</option>
                        <option value="nhom_4">Hỗ trợ dẫn khách xem phòng trực tiếp</option>
                        <option value="nhom_5">Hỗ trợ bẻ gãy từ chối giá & chốt cọc giữ phòng</option>
                        <option value="nhom_1">Hỗ trợ khảo sát & làm quen giỏ hàng thực tế</option>
                        <option value="nhom_3">Hỗ trợ khai thác nhu cầu & sàng lọc khách nét</option>
                        <option value="all_8">Kèm cặp thực tế toàn diện quy trình dắt khách</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400 dark:text-stone-400 hidden sm:block">
                      Thông tin được chuyển trực tiếp đến Ban Đào Tạo Running Man Sales Academy.
                    </p>

                    <button
                      type="submit"
                      disabled={formSubmitted}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-stone-950 font-black text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{formSubmitted ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu kèm cặp thực tế'}</span>
                    </button>
                  </div>
                </form>
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

              {/* 8 NHÓM NĂNG LỰC CỐT LÕI (FRAMELESS, AIRY, SEAMLESS LUXURY DESIGN) */}
              <section className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold tracking-wider uppercase border border-blue-200/60 dark:border-blue-800">
                      <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span>Khung Năng Lực Cốt Lõi RMSA</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Lộ trình chuẩn hóa 8 Nhóm Năng Lực Môi Giới
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
                      Học đúng quy trình thực chiến • Ra thực chiến ngay • Đóng gói từ 3+ năm kinh nghiệm thực địa của Đan Rin
                    </p>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 shrink-0 hidden sm:inline-block">
                    Cập nhật liên tục 2026
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {competencyRoadmap.map((item) => (
                    <div
                      key={item.groupNum}
                      onClick={() => {
                        setMainViewTab('courses');
                        setActiveCourseCategory(item.filterKey || `nhom_${item.groupNum}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-850 border border-slate-200/60 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_-6px_rgba(37,99,235,0.1)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Top Row: Index Badge & Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-800 text-white dark:text-blue-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all shadow-2xs border border-transparent dark:border-slate-700">
                            {item.groupNum < 10 ? `0${item.groupNum}` : item.groupNum}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Chuyên đề {item.groupNum}
                          </span>
                        </div>

                        {item.status === 'active' ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Đã đóng gói</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700 shrink-0">
                            <span>Cập nhật tuần này</span>
                          </span>
                        )}
                      </div>

                      {/* Middle: Full Title (NO TRUNCATION!) & Objective */}
                      <div className="space-y-1.5 flex-1 py-1">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                          {item.objective}
                        </p>
                      </div>

                      {/* Bottom Footer: Meta & Action Link */}
                      <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">{item.lessonsCount}</span>
                        <span className="font-bold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center space-x-1 transition-colors">
                          <span>Vào học chuyên đề</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. CẨM NANG & KINH NGHIỆM (FRAMELESS SECTION) */}
              <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      Cẩm nang & Kinh nghiệm thực chiến
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Bí quyết xử lý tình huống thực địa và kịch bản đối đáp độc quyền
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {articlesList.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => setMainViewTab('courses')}
                      className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 hover:border-blue-400/60 dark:hover:border-blue-500/60 bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex gap-4 group"
                    >
                      <img 
                        src={art.thumb} 
                        alt={art.title} 
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-slate-200/80 dark:border-slate-700 group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700 inline-block">
                          {art.tag}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                          {art.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {art.excerpt}
                        </p>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                          <span>{art.readTime}</span>
                          <span>•</span>
                          <span>{art.views} lượt xem</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
      {/* 3. FOOTER 4 CỘT CHUẨN                                                     */}
      {/* ========================================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 mt-8">
        <footer className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-slate-900 border border-slate-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center p-1.5 shrink-0">
                  <img 
                    src="/images/running_man_logo.png" 
                    alt="Running Man" 
                    className="w-full h-full object-contain filter brightness-110 drop-shadow-[0_1px_3px_rgba(255,255,255,0.2)]"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-wider text-slate-900 dark:text-white leading-none">RUNNING MAN</span>
                  <span className="text-[9.5px] font-extrabold text-[#0d5cb6] dark:text-blue-400 tracking-[0.22em] uppercase leading-none mt-1">Sales Academy</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Học viện đào tạo nghiệp vụ môi giới và cho thuê căn hộ thực chiến Running Man. Định vị sản phẩm thật - Dẫn lối tư duy thực chiến.
              </p>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                "EVERY JOURNEY LEADS HOME"
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Khóa đào tạo
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>Nhóm 1: Sản phẩm & Giá thị trường</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>Nhóm 2: Nguồn hàng & Giỏ căn hộ</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>Nhóm 3: Đăng tin & Khai thác nhu cầu</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>Nhóm 4: Telesale 30s & Dẫn khách</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>Nhóm 5: Bẻ gãy từ chối giá & Chốt cọc</li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Hỗ trợ học viên
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={onOpenCheatsheet || onOpenLogin}>Sổ tay kịch bản bỏ túi (PDF)</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={onOpenPracticeTest || onOpenLogin}>Kỳ thi sát hạch trực tuyến</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={onOpenCertificate || onOpenLogin}>Tra cứu chứng chỉ điện tử</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" onClick={onOpenLeaderboard || onOpenLogin}>Bảng xếp hạng Best Seller</li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Ban Đào Tạo & Tuyển Dụng
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Phụ trách đào tạo: <strong className="text-slate-800 dark:text-slate-200">Đan Rin</strong>
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Hotline tuyển dụng: <span className="font-bold text-slate-900 dark:text-white">0909.xxx.xxx</span>
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Trụ sở: TP. Hồ Chí Minh
              </p>
              <div className="pt-2">
                <button
                  onClick={isLoggedIn ? onEnterApp : onOpenLogin}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  {isLoggedIn ? 'Vào LMS Đào Tạo' : 'Đăng nhập Cổng Nội Bộ'}
                </button>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400 dark:text-slate-500">
            © 2026 RMSA (Running Man Sales Academy) • Giao diện chuẩn MapStudy • Bản quyền thuộc về Đan Rin & Running Man.
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

    </div>
  );
}
