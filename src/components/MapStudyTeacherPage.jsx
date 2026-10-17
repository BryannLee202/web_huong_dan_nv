import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Key, 
  LogIn, 
  Home, 
  BookOpen, 
  FileText, 
  Newspaper, 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Mail, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Building, 
  Download, 
  Users, 
  Compass, 
  Layers, 
  PhoneCall, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp, 
  Flame, 
  CheckCircle, 
  Eye, 
  MessageCircle, 
  ArrowRight, 
  UserCheck, 
  Star, 
  PlayCircle, 
  X,
  Play,
  BarChart3,
  Crosshair,
  Folder,
  Atom,
  LayoutGrid,
  Send,
  Check,
  User,
  LogOut
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
  onOpenAdmin
}) {
  // mainViewTab: 'home' (Trang chủ MapStudy) | 'courses' (Khóa đào tạo & Giảng viên Anh Rin) | 'community' (Cộng đồng)
  const [mainViewTab, setMainViewTab] = useState('home');
  const [courseTabSub, setCourseTabSub] = useState('program'); // 'program' | 'scripts'
  const [activeCourseCategory, setActiveCourseCategory] = useState('all'); // 'all' | 'group1_2' | 'group3_4' | 'group5' | 'group6_8' | 'materials'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTeacherModal, setSelectedTeacherModal] = useState(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
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
      badgeSubtitle: 'Huấn luyện trực tiếp bởi Anh Rin',
      primaryBtnText: 'Vào học chuyên đề ngay',
      secondaryBtnText: 'Xem 8 nhóm năng lực',
      actionType: 'course',
      bgGradient: 'linear-gradient(135deg, #f0fdf9 0%, #e6f6f2 50%, #edf8f5 100%)',
      spotlightColor: 'bg-teal-200/35',
      visualType: 'apartment',
      cardTitle: 'Studio Duplex Gác Lửng • Giỏ Hàng Thật',
      cardTag: '5.8 Tr/tháng',
      cardImg: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=700&q=80',
      mentorName: 'Anh Rin (Running Man)',
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
      badgeSubtitle: 'Đóng gói từ 8+ năm thực địa',
      primaryBtnText: 'Tra cứu kịch bản mẫu',
      secondaryBtnText: 'Xem cẩm nang thực chiến',
      actionType: 'playbook',
      bgGradient: 'linear-gradient(135deg, #f0f4ff 0%, #e8edff 50%, #f4f6fc 100%)',
      spotlightColor: 'bg-indigo-200/30',
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
      tagColor: 'text-purple-900 bg-purple-900/5 border-purple-800/15',
      dotColor: 'bg-purple-600',
      date: 'Phòng Thi Ảo • Chuẩn Năng Lực',
      titleTop: 'PHÒNG THI SÁT HẠCH ẢO',
      titleHighlight: 'TÌNH HUỐNG THỰC ĐỊA',
      titleBottom: 'VÀ CHỨNG CHỈ ĐIỆN TỬ NỘI BỘ',
      subtitle: 'Kiểm tra phản xạ thực tế qua ngân hàng 15 câu hỏi tình huống mô phỏng. Đạt chuẩn ≥ 80% được cấp Chứng chỉ Điện tử RMSA và quyền ưu tiên nhận data khách nét từ công ty.',
      badgeTitle: 'ĐẠT CHUẨN ≥ 80% CẤP CHỨNG CHỈ',
      badgeSubtitle: 'Vinh danh Bảng Vàng Best Seller',
      primaryBtnText: 'Vào phòng thi sát hạch',
      secondaryBtnText: 'Xem Bảng Xếp Hạng',
      actionType: 'exam',
      bgGradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #fbf8ff 100%)',
      spotlightColor: 'bg-purple-200/30',
      visualType: 'certificate',
      cardTitle: 'Chứng Nhận Nghiệp Vụ Sale Căn Hộ RMSA',
      cardTag: 'Điểm Đạt: ≥ 80%',
      cardImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80',
      mentorName: 'Hội Đồng Khảo Sát RMSA',
      mentorRole: 'Xác Thực Điện Tử QR',
      mentorDesc: 'Cấp chứng nhận chuẩn hóa nội bộ'
    }
  ];

  // Auto carousel slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  // Hot Keywords
  const hotKeywords = [
    { title: 'Kịch bản Telesale 30s', query: 'kịch bản' },
    { title: 'Duplex gác lửng', query: 'duplex' },
    { title: 'Căn hộ Studio', query: 'studio' },
    { title: 'Bẻ gãy từ chối giá', query: 'từ chối' },
    { title: 'Thầy Anh Rin', query: 'Anh Rin' },
    { title: 'Checklist đón khách 15p', query: 'đón khách' },
    { title: '8 Nhóm năng lực', query: 'nhóm' },
    { title: 'Quy đổi 16k/ngày', query: '16k' }
  ];

  // Đội ngũ Giảng viên
  const teachersList = [
    {
      id: 1,
      name: 'Anh Rin',
      role: 'Sáng Lập & Huấn Luyện Viên Trưởng RMSA',
      title: 'Chuyên gia đào tạo nghiệp vụ môi giới & vận hành chuỗi căn hộ cho thuê thực chiến',
      avatar: '/images/anh_rin_avatar.jpg',
      badge: 'GIẢNG VIÊN CHÍNH',
      rating: '5.0',
      totalLessons: '6 Chuyên đề phễu',
      achievements: [
        '8+ năm kinh nghiệm trực tiếp phát triển & vận hành chuỗi căn hộ mini, duplex, studio cho thuê đạt tỷ lệ lấp đầy >95%.',
        'Huấn luyện hơn 500+ anh em môi giới thực chiến từ con số 0 đến chốt cọc đều đặn mỗi tháng.',
        'Đóng gói chuẩn 8 Nhóm Năng Lực Nghiệp Vụ Môi Giới Căn Hộ Cho Thuê Running Man.',
        'Triết lý: "Học đúng bài phễu - Ra thực chiến ngay - Update bài học hàng tuần".'
      ]
    },
    {
      id: 2,
      name: 'Ban Vận Hành Tòa Nhà',
      role: 'Quản Lý Nguồn Hàng & Dịch Vụ Số',
      title: 'Chuyên gia khảo sát nguồn hàng thật & số hóa thông tin chủ nhà',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      badge: 'NGUỒN HÀNG THẬT',
      rating: '4.9',
      totalLessons: 'Nhóm 2: Nguồn hàng & Giỏ căn',
      achievements: [
        'Quản lý danh mục hơn 3.000 căn hộ trống trên hệ thống số chủ nhà.',
        'Quy chuẩn hóa quy trình chụp ảnh, quay video góc rộng và cập nhật tình trạng phòng realtime.'
      ]
    },
    {
      id: 3,
      name: 'Tổ Marketing & Đăng Tin',
      role: 'Khai Thác Khách Hàng Tiềm Năng',
      title: 'Chuyên gia tạo phễu Chợ Tốt, Hội nhóm Facebook & Video ngắn TikTok',
      avatar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
      badge: 'TẠO PHỄU KHÁCH',
      rating: '4.9',
      totalLessons: 'Nhóm 3: Đăng tin & Tìm khách',
      achievements: [
        'Chủ động tạo ra hơn 200+ khách hỏi thuê mới mỗi tuần cho đội ngũ môi giới.',
        'Bộ 20 mẫu tin đăng có tỷ lệ click cao nhất ngành cho thuê căn hộ.'
      ]
    },
    {
      id: 4,
      name: 'Hội Đồng Khảo Sát RMSA',
      role: 'Ban Sát Hạch & Cấp Chứng Chỉ',
      title: 'Hệ thống đánh giá năng lực tự động & quản lý phễu CRM',
      avatar: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      badge: 'PHÒNG THI ẢO',
      rating: '5.0',
      totalLessons: 'Kỳ thi sát hạch & CRM',
      achievements: [
        'Sát hạch tự động sau mỗi bài học với thang điểm chuẩn ≥ 80%.',
        'Theo dõi tỷ lệ chuyển đổi từng chặng trong phễu bán hàng CRM.'
      ]
    }
  ];

  // 8 Nhóm năng lực môi giới cho thuê của Anh Rin (Tách riêng từng chủ đề độc lập)
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

  // Danh mục phân loại chuyên đề (Tách riêng từng chủ đề độc lập)
  const courseCategories = [
    { key: 'all', label: 'Tất cả (8 Nhóm)' },
    { key: 'nhom_1', label: 'Nhóm 1: Sản phẩm & Thị trường' },
    { key: 'nhom_2', label: 'Nhóm 2: Nguồn hàng & Giỏ căn' },
    { key: 'nhom_3', label: 'Nhóm 3: Tìm khách & Nhu cầu' },
    { key: 'nhom_4', label: 'Nhóm 4: Tư vấn & Dẫn khách' },
    { key: 'nhom_5', label: 'Nhóm 5: Xử lý từ chối & Chốt deal' },
    { key: 'nhom_6', label: 'Nhóm 6: CRM & Quản lý phễu' },
    { key: 'nhom_7', label: 'Nhóm 7: Kỷ luật & Dịch vụ CSKH' },
    { key: 'nhom_8', label: 'Nhóm 8: Thực chiến thị trường' },
    { key: 'materials', label: 'Tài liệu & Biểu mẫu' }
  ];

  // Danh sách các khóa học đào tạo (Chuẩn Card MapStudy theo từng nhóm năng lực)
  const trainingCourses = [
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
      instructor: 'Anh Rin',
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
      instructor: 'Anh Rin',
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
      instructor: 'Anh Rin',
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
      instructor: 'Anh Rin',
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
      instructor: 'Anh Rin',
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
      instructor: 'Anh Rin',
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
      instructor: 'Anh Rin',
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
      instructor: 'Anh Rin',
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
  ];

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

  // Thảo luận cộng đồng Running Man
  const communityPosts = [
    {
      id: 1,
      author: 'Tuấn Saler - Chi nhánh Bình Thạnh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: '15 phút trước',
      title: 'Kinh nghiệm chốt thành công căn Duplex 5.8tr tại Phan Đăng Lưu chỉ sau 1 lần dẫn!',
      content: 'Chào cả nhà, hôm nay em vừa áp dụng triệt để Checklist đón khách 15 phút và công thức chia nhỏ 16k/ngày của Anh Rin. Khách ban đầu so sánh với bên Nơ Trang Long 5.3tr nhưng sau khi chỉ ra máy giặt riêng và ban công thoáng, khách đồng ý chuyển khoản cọc 1 triệu giữ phòng luôn!',
      likes: 42,
      comments: 18,
      tag: 'Chia sẻ kinh nghiệm'
    },
    {
      id: 2,
      author: 'Hoàng Minh - Chi nhánh Phú Nhuận',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      time: '1 giờ trước',
      title: 'Hỏi kinh nghiệm: Khách đòi giữ phòng 1 tuần mới ký hợp đồng thì xử lý thế nào?',
      content: 'Anh em cho em hỏi, khách đã ưng phòng nhưng xin giữ cọc đến cuối tuần sau mới dọn vào. Chủ nhà chỉ cho giữ tối đa 3 ngày. Trong trường hợp này các bác tư vấn sao để không mất khách ạ?',
      likes: 28,
      comments: 24,
      tag: 'Hỏi đáp ca khó'
    },
    {
      id: 3,
      author: 'Anh Rin (HLV Trưởng)',
      avatar: '/images/anh_rin_avatar.jpg',
      time: '3 giờ trước',
      title: 'Lưu ý quan trọng cho anh em khi dẫn khách xem phòng giờ trưa nắng gắt',
      content: 'Nhắc nhở toàn bộ anh em: Thời tiết Sài Gòn dạo này rất nắng. Khi hẹn khách từ 11h - 14h, bắt buộc phải đến trước 20 phút, bật máy lạnh sẵn và chuẩn bị 1 chai nước suối lạnh mời khách. Khách bước vào phòng mát rượi là tâm lý đã muốn chốt 50% rồi!',
      likes: 95,
      comments: 31,
      tag: 'Nhắc nhở nghiệp vụ'
    }
  ];

  const filteredCourses = trainingCourses.filter(course => {
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
      alert('Vui lòng nhập Họ và tên và Số điện thoại để được tư vấn!');
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      alert('Đã gửi thông tin liên hệ thành công! Ban Đào tạo RMSA & Anh Rin sẽ liên hệ bạn trong vòng 15 phút.');
      setFormData({ fullName: '', phone: '', facebook: '', region: '', segment: '' });
      setFormSubmitted(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-slate-900 selection:text-white pb-16 relative">
      
      {/* Ambient warm & mint diffused lighting (tinh tế, thanh lịch, tự nhiên, không giống AI) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[480px] bg-gradient-to-b from-teal-50/50 via-emerald-50/20 to-transparent pointer-events-none -z-10 blur-3xl" />
      
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR: UNIFIED GLASS BAR WITH DISTINGUISHED ZONES                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Zone 1: Brand & Logo Monogram Badge */}
            <div className="flex items-center space-x-3 shrink-0">
              <div 
                onClick={() => setMainViewTab('home')}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-1 flex items-center justify-center cursor-pointer select-none shadow-[0_2px_8px_rgba(15,23,42,0.22)] ring-1 ring-slate-800/80 hover:scale-105 transition-all"
                title="RMSA - Running Man Sales Academy"
              >
                <img 
                  src="/images/running_man_logo.png" 
                  alt="Running Man" 
                  className="w-full h-full object-contain filter brightness-110 drop-shadow-xs"
                />
              </div>

              <div className="flex flex-col cursor-pointer select-none" onClick={() => setMainViewTab('home')}>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-black tracking-wider text-slate-900 leading-tight">RUNNING MAN</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200/70 uppercase tracking-wider">PRO</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">SALES ACADEMY</span>
              </div>

              {/* Minimalist Search Pill */}
              <div className="relative hidden 2xl:block w-44 ml-2">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm chuyên đề, bài phễu..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-full text-slate-700 placeholder-slate-400 border border-slate-200/80 focus:border-indigo-400 focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Zone 2: Center Segmented Dock Tabs (Khoang tab cao cấp lọt lòng) */}
            <nav className="hidden lg:flex items-center bg-slate-100/80 border border-slate-200/70 p-1 rounded-full shadow-2xs space-x-1 shrink-0">
              <button 
                onClick={() => setMainViewTab('home')}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewTab === 'home' 
                    ? 'font-bold text-slate-900 bg-white shadow-xs border border-slate-200/60' 
                    : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                title="Trang chủ RMSA"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${mainViewTab === 'home' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
                <span>Trang chủ</span>
              </button>

              <button 
                onClick={() => setMainViewTab('courses')}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewTab === 'courses' 
                    ? 'font-bold text-slate-900 bg-white shadow-xs border border-slate-200/60' 
                    : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                title="Khóa đào tạo & Giảng viên Anh Rin"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${mainViewTab === 'courses' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
                <span>Khóa đào tạo</span>
              </button>

              <button 
                onClick={onOpenPracticeTest || onOpenLogin}
                className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all cursor-pointer flex items-center space-x-1.5"
                title="Phòng thi sát hạch trực tuyến"
              >
                <span>Phòng thi sát hạch</span>
              </button>

              <button 
                onClick={onOpenCheatsheet || onOpenLogin}
                className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full font-semibold text-xs text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all cursor-pointer flex items-center space-x-1.5"
                title="Kịch bản & Cẩm nang mẫu"
              >
                <span>Kịch bản & Cẩm nang</span>
              </button>

              <button 
                onClick={() => setMainViewTab('community')}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewTab === 'community' 
                    ? 'font-bold text-slate-900 bg-white shadow-xs border border-slate-200/60' 
                    : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                title="Cộng đồng thảo luận"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${mainViewTab === 'community' ? 'bg-blue-600' : 'bg-transparent'}`}></span>
                <span>Cộng đồng</span>
              </button>
            </nav>

            {/* Zone 3: Actions & Clear Logout Button */}
            <div className="flex items-center space-x-2 shrink-0">
              {isLoggedIn ? (
                <>
                  {/* Thẻ định danh Nhân viên / Học viên trang trọng đàng hoàng */}
                  <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-100 border border-slate-200/90 text-xs font-semibold text-slate-800 shrink-0 shadow-2xs transition-all">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200/80 animate-pulse shrink-0"></span>
                    <span className="truncate max-w-[130px] font-bold text-slate-900 tracking-wide">
                      {formatStudentName(currentUser?.name)}
                    </span>
                  </div>

                  {/* Nút Vào học tiếp */}
                  <button
                    onClick={onEnterApp}
                    className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold shadow-[0_3px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_5px_18px_rgba(79,70,229,0.42)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Vào học tiếp</span>
                  </button>

                  {/* Nút Đăng xuất đàng hoàng, rõ ràng */}
                  <button
                    onClick={onLogout || (() => {
                      try { localStorage.removeItem('mapstudy_logged_in'); } catch (e) {}
                      window.location.reload();
                    })}
                    className="px-3 py-1.5 rounded-full bg-rose-50/90 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold text-xs border border-rose-200/80 hover:border-rose-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 active:scale-95"
                    title="Đăng xuất khỏi tài khoản"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Đăng xuất</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => onOpenLogin && onOpenLogin('register')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
                  >
                    Đăng ký
                  </button>

                  <button
                    onClick={() => onOpenLogin && onOpenLogin('login')}
                    className="px-4.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold shadow-[0_3px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_5px_18px_rgba(79,70,229,0.42)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                  >
                    <span>Đăng nhập</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

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
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90 space-y-6">
              
              {/* Header profile */}
              <div className="space-y-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative shrink-0">
                    <img 
                      src="/images/anh_rin_avatar.jpg" 
                      alt="Anh Rin" 
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase inline-block border border-slate-200/60">
                      Giảng viên thực chiến
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Anh Rin (Running Man)
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Trưởng Ban Đào Tạo & Phát Triển Năng Lực Bán Hàng RMSA
                    </p>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={isLoggedIn ? onEnterApp : onOpenLogin}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.32)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isLoggedIn ? 'Vào học ngay trên LMS' : 'Đăng nhập để vào học ngay'}</span>
                </button>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Năng lực & Thành tích huấn luyện */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Năng lực & Thành tích huấn luyện</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 leading-relaxed pl-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>8+ năm kinh nghiệm trực tiếp phát triển & vận hành chuỗi căn hộ mini, duplex, studio cho thuê đạt tỷ lệ lấp đầy &gt;95%.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Đã đào tạo hơn 500+ nhân sự bán hàng, nâng tỷ lệ chốt deal thực tế tăng trung bình 40%.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Đóng gói bộ cẩm nang độc quyền "Bẻ gãy 30 lời từ chối giá kinh điển trong cho thuê căn hộ".</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Xây dựng lộ trình chuẩn hóa 8 Nhóm Năng Lực Môi Giới Thực Chiến.</span>
                  </li>
                </ul>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Phương pháp đào tạo thực chiến */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Phương pháp đào tạo thực chiến</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 leading-relaxed pl-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Phương pháp thực chiến 100%, nói không với lý thuyết sáo rỗng. Mô phỏng trực tiếp tình huống đối đáp khách hàng thực tế.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>Sát hạch năng lực tự động theo chuẩn phòng thi ảo, phản xạ bấm giờ từng giây, đạt chuẩn ≥ 80% cấp chứng nhận hoàn thành.</span>
                  </li>
                </ul>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Kênh hỗ trợ */}
              <div className="space-y-2 text-xs text-slate-600 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Kênh hỗ trợ nhân viên & Doanh nghiệp
                </span>
                <p className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Hotline: <strong>0909.xxx.xxx</strong></span>
                </p>
                <p className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  <span>Email: <strong>daotao@runningman.vn</strong></span>
                </p>
              </div>

            </div>

            {/* CỘT PHẢI: TABS VÀ DANH SÁCH KHÓA HỌC / KỊCH BẢN MẪU */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Header Tabs: Chương trình đào tạo vs Kịch bản & Cẩm nang */}
              <div className="flex border-b border-slate-200 space-x-8 text-xs font-bold">
                <button
                  onClick={() => setCourseTabSub('program')}
                  className={`pb-3 border-b-2 cursor-pointer transition-all ${
                    courseTabSub === 'program'
                      ? 'border-slate-900 text-slate-950 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Chương trình đào tạo (8 nhóm năng lực thực chiến)
                </button>

                <button
                  onClick={() => setCourseTabSub('scripts')}
                  className={`pb-3 border-b-2 cursor-pointer transition-all ${
                    courseTabSub === 'scripts'
                      ? 'border-slate-900 text-slate-950 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Kịch bản & Cẩm nang mẫu
                </button>
              </div>

              {/* Category Pills Filter (Tách riêng từng chủ đề) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {courseCategories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCourseCategory(cat.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeCourseCategory === cat.key
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_2px_10px_rgba(37,99,235,0.3)] border border-blue-400/40 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0'
                        : 'bg-white hover:bg-indigo-50/70 hover:border-indigo-200 text-slate-700 border border-slate-200/90 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Course Cards Grid (2 hoặc 3 cột theo ảnh 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 overflow-hidden shadow-2xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail with stage badge */}
                      <div className="relative aspect-video overflow-hidden bg-slate-900">
                        <img 
                          src={course.thumb} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold tracking-wide shadow-xs border border-white/20">
                          {course.stageBadge}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.duration}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold">
                          <span className="text-slate-900 font-bold">{course.code}</span>
                          <span>•</span>
                          <span>{course.quizCount}</span>
                          <span>•</span>
                          <span>Chuẩn: {course.passingScore}</span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {course.title}
                        </h4>

                        <p className="text-[11px] text-slate-400">
                          {course.instructor}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="flex items-center text-rose-500 font-semibold text-[11px]">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 mr-1" />
                        {course.reactions}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 text-blue-700 group-hover:text-white font-bold text-[11px] border border-blue-200/60 group-hover:border-transparent transition-all shadow-xs group-hover:shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
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
            <aside className="w-full lg:w-60 xl:w-64 shrink-0 lg:sticky lg:top-20 space-y-4">
              
              {/* 1. Top Action CTA: Vào học ngay */}
              <button 
                onClick={isLoggedIn ? onEnterApp : onOpenLogin}
                className="w-full flex items-center justify-center space-x-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-sm tracking-wide shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.42)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>{isLoggedIn ? 'Vào học ngay' : 'Đăng nhập LMS'}</span>
              </button>

              {/* 2. Main Navigation List (Frameless soft items) */}
              <div className="space-y-1">
                <button 
                  onClick={() => setMainViewTab('courses')}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticCourseIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">Khóa học & Giảng viên</span>
                </button>

                <button 
                  onClick={onOpenPracticeTest || onOpenLogin}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticExamIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">Thi online</span>
                </button>

                <button 
                  onClick={onOpenCheatsheet || onOpenLogin}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticArenaIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">Đấu trường lý thuyết</span>
                </button>

                <button 
                  onClick={onOpenCheatsheet || onOpenLogin}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticBookIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">Sách Map / Sổ tay RMSA</span>
                </button>

                <button 
                  onClick={() => {
                    setMainViewTab('courses');
                    setActiveCourseCategory('materials');
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticFolderIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">Tài liệu</span>
                </button>

                <button 
                  onClick={() => setMainViewTab('community')}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticForumIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">Diễn đàn</span>
                </button>

                <button 
                  onClick={() => setMainViewTab('community')}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer text-left group"
                >
                  <RealisticCommunityIcon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" />
                  <span className="font-bold">Cộng đồng Running Man</span>
                </button>
              </div>

              <div className="h-px bg-slate-200/60 my-2" />

              {/* 3. Section: Liên kết */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2.5 mb-1.5">
                  Liên kết
                </span>

                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors text-xs font-semibold text-slate-600 group"
                >
                  <RealisticFacebookIcon className="w-5 h-5 shrink-0" />
                  <span className="group-hover:text-[#1877f2] transition-colors truncate">Facebook Running Man</span>
                </a>

                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors text-xs font-semibold text-slate-600 group"
                >
                  <RealisticYoutubeIcon className="w-5 h-5 shrink-0" />
                  <span className="group-hover:text-[#ff0000] transition-colors truncate">Thầy Anh Rin - Căn Hộ</span>
                </a>

                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors text-xs font-semibold text-slate-600 group"
                >
                  <RealisticTiktokIcon className="w-5 h-5 shrink-0" />
                  <span className="group-hover:text-slate-900 transition-colors truncate">Tiktok Running Man</span>
                </a>
              </div>
            </aside>

            {/* COLUMN 2: MAIN CONTENT (Seamless, breathable, frameless design) */}
            <main className="flex-1 min-w-0 space-y-6">
              
              {/* 1. HERO BANNER CAROUSEL (CỔNG ĐÀO TẠO NỘI BỘ NHÂN VIÊN RUNNING MAN) */}
              <div 
                className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.06)] min-h-[310px] sm:min-h-[340px] flex flex-col justify-between p-6 sm:p-8 lg:p-9 text-slate-900 transition-all duration-500 group/banner"
                style={{
                  background: heroBanners[currentSlide].bgGradient
                }}
              >
                {/* Mũi tên chuyển trang bên trái */}
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
                  className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 shadow-md hover:shadow-xl border border-slate-200/90 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                  title="Chuyển về trang trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Mũi tên chuyển trang bên phải */}
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroBanners.length)}
                  className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 shadow-md hover:shadow-xl border border-slate-200/90 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                  title="Chuyển sang trang tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Soft ambient lighting spots */}
                <div className={`absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 ${heroBanners[currentSlide].spotlightColor} rounded-full blur-3xl pointer-events-none transition-all duration-700`} />
                <div className="absolute left-1/3 bottom-0 -mb-12 w-80 h-80 bg-indigo-100/25 rounded-full blur-3xl pointer-events-none" />

                {/* Top Badge & Date Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 mb-3 px-1 sm:px-3">
                  <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-bold tracking-wide ${heroBanners[currentSlide].tagColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${heroBanners[currentSlide].dotColor} animate-pulse`}></span>
                    <span>{heroBanners[currentSlide].tag}</span>
                  </div>

                  <span className="text-xs text-slate-500 font-semibold bg-white/85 backdrop-blur-md px-3.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                    {heroBanners[currentSlide].date}
                  </span>
                </div>

                {/* Content Grid: Left Info & Right Visual (ĐỘNG HOÀN TOÀN THEO SLIDE) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-center my-2 relative z-10 px-1 sm:px-3">
                  
                  {/* Cột trái: Tiêu đề typography động */}
                  <div className="md:col-span-7 space-y-3.5 text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-[31px] font-black tracking-tight leading-[1.22] text-slate-950 uppercase">
                      {heroBanners[currentSlide].titleTop} <span className="text-[#0d5cb6]">{heroBanners[currentSlide].titleHighlight}</span><br />
                      <span className="text-slate-800 font-extrabold">{heroBanners[currentSlide].titleBottom}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl">
                      {heroBanners[currentSlide].subtitle}
                    </p>

                    {/* Huy hiệu đặc quyền nội bộ */}
                    <div className="pt-1 flex flex-wrap items-center gap-2.5">
                      <div className="px-4 py-2 rounded-full bg-slate-900 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>{heroBanners[currentSlide].badgeTitle}</span>
                      </div>
                      <span className="text-xs text-slate-700 font-semibold bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
                        🛡️ {heroBanners[currentSlide].badgeSubtitle}
                      </span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          if (heroBanners[currentSlide].actionType === 'playbook') {
                            if (onOpenCheatsheet) onOpenCheatsheet();
                            else if (onOpenLogin) onOpenLogin();
                          } else if (heroBanners[currentSlide].actionType === 'exam') {
                            if (onOpenPracticeTest) onOpenPracticeTest();
                            else if (onOpenLogin) onOpenLogin();
                          } else {
                            if (isLoggedIn) onEnterApp();
                            else onOpenLogin();
                          }
                        }}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.32)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center space-x-2"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>{heroBanners[currentSlide].primaryBtnText}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (heroBanners[currentSlide].actionType === 'exam') {
                            if (onOpenLeaderboard) onOpenLeaderboard();
                            else setMainViewTab('courses');
                          } else {
                            setMainViewTab('courses');
                          }
                        }}
                        className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-2xs transition-all cursor-pointer hover:border-slate-300"
                      >
                        {heroBanners[currentSlide].secondaryBtnText}
                      </button>
                    </div>
                  </div>

                  {/* Cột phải: THẺ MINH HỌA ĐA DẠNG THEO TỪNG SLIDE (Khác biệt 100%) */}
                  <div className="md:col-span-5 relative">
                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-md p-2.5 space-y-2.5 max-w-[340px] ml-auto">
                      
                      {/* Ảnh minh họa theo slide */}
                      <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                        <img 
                          src={heroBanners[currentSlide].cardImg} 
                          alt={heroBanners[currentSlide].cardTitle} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                        />
                        <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-semibold text-white">
                          {heroBanners[currentSlide].cardTitle}
                        </div>
                        <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-slate-900/90 text-white font-bold text-[11px] shadow-xs">
                          {heroBanners[currentSlide].cardTag}
                        </div>
                      </div>

                      {/* Thẻ phụ chi tiết theo từng slide */}
                      <div 
                        onClick={() => {
                          if (heroBanners[currentSlide].actionType === 'playbook') {
                            if (onOpenCheatsheet) onOpenCheatsheet();
                            else onOpenLogin();
                          } else if (heroBanners[currentSlide].actionType === 'exam') {
                            if (onOpenPracticeTest) onOpenPracticeTest();
                            else onOpenLogin();
                          } else {
                            setMainViewTab('courses');
                          }
                        }}
                        className="flex items-center space-x-3 bg-slate-50/80 hover:bg-slate-100/90 p-2 rounded-xl border border-slate-200/80 transition-colors cursor-pointer group"
                      >
                        {heroBanners[currentSlide].visualType === 'apartment' ? (
                          <img 
                            src="/images/anh_rin_avatar.jpg" 
                            alt="Anh Rin" 
                            className="w-10 h-10 rounded-lg object-cover border border-blue-400/80 shrink-0"
                          />
                        ) : heroBanners[currentSlide].visualType === 'playbook' ? (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 text-indigo-600">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0 text-purple-600">
                            <Award className="w-5 h-5" />
                          </div>
                        )}

                        <div className="text-left flex-1 min-w-0">
                          <div className="flex items-center space-x-1">
                            <span className="text-[9px] font-bold text-blue-600 uppercase">
                              {heroBanners[currentSlide].mentorRole}
                            </span>
                            <CheckCircle2 className="w-3 h-3 text-sky-600" />
                          </div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {heroBanners[currentSlide].mentorName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {heroBanners[currentSlide].mentorDesc}
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
                          currentSlide === idx ? 'w-8 bg-slate-900' : 'w-2 bg-slate-400/50 hover:bg-slate-600'
                        }`}
                        title={`Xem trang ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    0{currentSlide + 1} / 0{heroBanners.length}
                  </span>
                </div>
              </div>

              {/* 2. "LIÊN HỆ TƯ VẤN" FORM (Seamless Surface) */}
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(15,23,42,0.02)] border border-slate-200/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Liên hệ tư vấn
                    </h2>
                    <p className="text-xs text-slate-500">
                      Đăng ký nhận lộ trình đào tạo sale căn hộ hoặc liên hệ tư vấn cùng Anh Rin
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/80 hidden sm:inline-block">
                    Phản hồi trong 15 phút
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
                        placeholder="* Họ và tên"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-slate-400 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="* Số điện thoại"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-slate-400 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="Link Facebook / Zalo cá nhân"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-slate-400 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-700 border border-slate-200 focus:border-slate-400 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="">* Khu vực hoạt động / Chi nhánh</option>
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-700 border border-slate-200 focus:border-slate-400 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="">* Chuyên đề / Phân khúc quan tâm</option>
                        <option value="nhom_1">Nhóm 1 — Hiểu sản phẩm và thị trường</option>
                        <option value="nhom_2">Nhóm 2 — Tạo nguồn hàng và quản lý giỏ căn hộ</option>
                        <option value="nhom_3">Nhóm 3 — Tìm kiếm khách hàng và khai thác nhu cầu</option>
                        <option value="nhom_4">Nhóm 4 — Tư vấn và dẫn khách xem căn hộ</option>
                        <option value="nhom_5">Nhóm 5 — Xử lý từ chối, đàm phán và chốt giao dịch</option>
                        <option value="nhom_6">Nhóm 6 — CRM, KPI và quản lý phễu bán hàng</option>
                        <option value="nhom_7">Nhóm 7 — Kỷ luật nghề nghiệp và dịch vụ khách hàng</option>
                        <option value="nhom_8">Nhóm 8 — Kỹ năng thực tế ngoài thị trường</option>
                        <option value="all_8">Trọn gói 8 Chuyên đề Kỹ năng Sale Căn Hộ</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400 hidden sm:block">
                      Thông tin của bạn được bảo mật tuyệt đối theo chính sách đào tạo Running Man.
                    </p>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.32)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi thông tin tư vấn</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 3. HOT KEYWORDS ROW (Seamless, no heavy box) */}
              <div className="flex flex-wrap items-center gap-2 py-1 px-1">
                <span className="text-xs font-bold text-slate-500 mr-2 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-1" />
                  Tìm kiếm nổi bật:
                </span>
                {hotKeywords.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item.query);
                      setMainViewTab('courses');
                    }}
                    className="px-3 py-1 rounded-full bg-slate-100/90 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 text-xs font-medium transition-all cursor-pointer border border-transparent shadow-2xs"
                  >
                    #{item.title}
                  </button>
                ))}
              </div>

              {/* 4. DÀN GIẢNG VIÊN (Frameless Section) */}
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Đội ngũ Giảng viên & Huấn luyện viên
                    </h2>
                    <p className="text-xs text-slate-500">
                      Được dẫn dắt bởi Anh Rin cùng ban vận hành nguồn hàng thật chuỗi căn hộ Running Man
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {teachersList.map((teacher) => (
                    <div
                      key={teacher.id}
                      onClick={() => setSelectedTeacherModal(teacher)}
                      className="rounded-2xl border border-slate-200/60 hover:border-blue-400/60 p-4 bg-white hover:bg-slate-50/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-xs group-hover:scale-105 transition-transform duration-300">
                          <img 
                            src={teacher.avatar} 
                            alt={teacher.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                        </div>

                        <div className="text-center space-y-1">
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full inline-block border border-slate-200/60">
                            {teacher.badge}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {teacher.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {teacher.title}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 mt-3">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 mr-1" />
                          {teacher.rating}
                        </span>
                        <span className="text-slate-800 font-semibold group-hover:text-blue-600 group-hover:underline flex items-center transition-colors">
                          Xem hồ sơ
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. 8 NHÓM NĂNG LỰC CỐT LÕI (FRAMELESS, AIRY, SEAMLESS LUXURY DESIGN) */}
              <section className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold tracking-wider uppercase border border-blue-200/60">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>Khung Năng Lực Cốt Lõi RMSA</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Lộ trình chuẩn hóa 8 Nhóm Năng Lực Môi Giới
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal">
                      Học đúng bài phễu • Ra thực chiến ngay • Đóng gói từ 8+ năm kinh nghiệm thực địa của Huấn luyện viên Anh Rin
                    </p>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 shrink-0 hidden sm:inline-block">
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
                      className="p-5 rounded-2xl bg-white hover:bg-white border border-slate-200/60 hover:border-blue-500/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_-6px_rgba(37,99,235,0.1)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Top Row: Index Badge & Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all shadow-2xs">
                            {item.groupNum < 10 ? `0${item.groupNum}` : item.groupNum}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Chuyên đề {item.groupNum}
                          </span>
                        </div>

                        {item.status === 'active' ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Đã đóng gói</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200/70 shrink-0">
                            <span>Cập nhật tuần này</span>
                          </span>
                        )}
                      </div>

                      {/* Middle: Full Title (NO TRUNCATION!) & Objective */}
                      <div className="space-y-1.5 flex-1 py-1">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                          {item.objective}
                        </p>
                      </div>

                      {/* Bottom Footer: Meta & Action Link */}
                      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">{item.lessonsCount}</span>
                        <span className="font-bold text-slate-600 group-hover:text-blue-600 flex items-center space-x-1 transition-colors">
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
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Cẩm nang & Kinh nghiệm thực chiến
                    </h2>
                    <p className="text-xs text-slate-500">
                      Bí quyết xử lý tình huống thực địa và kịch bản đối đáp độc quyền
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {articlesList.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => setMainViewTab('courses')}
                      className="p-4 rounded-2xl border border-slate-200/60 hover:border-blue-400/60 bg-white hover:bg-slate-50/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex gap-4 group"
                    >
                      <img 
                        src={art.thumb} 
                        alt={art.title} 
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-slate-200/80 group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60 inline-block">
                          {art.tag}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {art.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {art.excerpt}
                        </p>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-400 pt-1">
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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6">
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Cộng đồng Môi Giới Thực Chiến Running Man
                  </h2>
                  <p className="text-xs text-slate-500">
                    Nơi giao lưu, hỏi đáp tình huống thực địa và vinh danh kết quả bán hàng mỗi ngày
                  </p>
                </div>
                <button
                  onClick={isLoggedIn ? () => alert('Tính năng đăng bài thảo luận nội bộ!') : onOpenLogin}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.42)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  + Viết bài chia sẻ
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200/80 space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.avatar} 
                        alt={post.author} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{post.author}</p>
                        <span className="text-[10px] text-slate-400">{post.time}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                      {post.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={onOpenLogin}
                        className="flex items-center space-x-1.5 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>{post.likes} Yêu thích</span>
                      </button>
                      <button 
                        onClick={onOpenLogin}
                        className="flex items-center space-x-1.5 hover:text-sky-600 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.comments} Bình luận</span>
                      </button>
                    </div>
                    <button 
                      onClick={onOpenLogin}
                      className="hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FOOTER 4 CỘT CHUẨN                                                     */}
      {/* ========================================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 mt-8">
        <footer className="bg-white rounded-2xl p-8 shadow-xs border border-slate-200/80 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-0.5 overflow-hidden">
                  <img 
                    src="/images/running_man_logo.png" 
                    alt="Running Man" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-xs font-black tracking-wider text-slate-900">RMSA • RUNNING MAN</span>
                  <p className="text-[10px] text-slate-400">Running Man Sales Academy</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Học viện đào tạo nghiệp vụ môi giới và cho thuê căn hộ thực chiến Running Man. Định vị sản phẩm thật - Dẫn lối tư duy thực chiến.
              </p>
              <p className="text-xs font-bold text-blue-600">
                "EVERY JOURNEY LEADS HOME"
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Khóa đào tạo
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>Nhóm 1: Sản phẩm & Giá thị trường</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>Nhóm 2: Nguồn hàng & Giỏ căn hộ</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>Nhóm 3: Đăng tin & Khai thác nhu cầu</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>Nhóm 4: Telesale 30s & Dẫn khách</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setMainViewTab('courses')}>Nhóm 5: Bẻ gãy từ chối giá & Chốt cọc</li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Hỗ trợ học viên
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={onOpenCheatsheet || onOpenLogin}>Sổ tay kịch bản bỏ túi (PDF)</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={onOpenPracticeTest || onOpenLogin}>Kỳ thi sát hạch trực tuyến</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={onOpenCertificate || onOpenLogin}>Tra cứu chứng chỉ điện tử</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={onOpenLeaderboard || onOpenLogin}>Bảng xếp hạng Best Seller</li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Ban Đào Tạo & Tuyển Dụng
              </h4>
              <p className="text-slate-600">
                Huấn luyện viên trưởng: <strong className="text-slate-800">Anh Rin</strong>
              </p>
              <p className="text-slate-600">
                Hotline tuyển dụng: <span className="font-bold text-slate-900">0909.xxx.xxx</span>
              </p>
              <p className="text-slate-600">
                Trụ sở: TP. Hồ Chí Minh
              </p>
              <div className="pt-2">
                <button
                  onClick={isLoggedIn ? onEnterApp : onOpenLogin}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  {isLoggedIn ? 'Vào LMS Đào Tạo' : 'Đăng nhập Cổng Nội Bộ'}
                </button>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400">
            © 2026 RMSA (Running Man Sales Academy) • Giao diện chuẩn MapStudy • Bản quyền thuộc về Anh Rin & Running Man.
          </div>
        </footer>
      </div>



      {/* ========================================================================= */}
      {/* 5. MODAL HỒ SƠ GIẢNG VIÊN                                                 */}
      {/* ========================================================================= */}
      {selectedTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              onClick={() => setSelectedTeacherModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              <img 
                src={selectedTeacherModal.avatar} 
                alt={selectedTeacherModal.name} 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full inline-block border border-slate-200/60">
                  {selectedTeacherModal.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedTeacherModal.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedTeacherModal.role}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Thành tựu & Kinh nghiệm thực chiến:
              </h4>
              <ul className="space-y-2">
                {selectedTeacherModal.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedTeacherModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setSelectedTeacherModal(null);
                  setMainViewTab('courses');
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.32)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer transition-all"
              >
                Xem các khóa học của Anh Rin
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
