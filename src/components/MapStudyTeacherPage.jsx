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
  Check
} from 'lucide-react';

export default function MapStudyTeacherPage({ 
  onOpenLogin, 
  onEnterApp,
  onOpenPracticeTest,
  onOpenCheatsheet,
  onOpenLeaderboard,
  onOpenCertificate
}) {
  const [mainViewTab, setMainViewTab] = useState('home'); // 'home' | 'community'
  const [activeCourseCategory, setActiveCourseCategory] = useState('all'); // 'all' | 'group1_2' | 'group3_4' | 'group5' | 'group6_8' | 'materials'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTeacherModal, setSelectedTeacherModal] = useState(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // State form "Liên hệ tư vấn"
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    facebook: '',
    region: '',
    segment: ''
  });

  // Hero Banners Carousel (Chuẩn MapStudy Banner)
  const heroBanners = [
    {
      id: 1,
      tag: 'RMSA BACK TO BASICS',
      title: 'CUỘC THI "THỰC CHIẾN THẬT - NHẬN QUÀ CHẤT"',
      subtitle: 'Học đúng các bài tập phễu cốt lõi từ Anh Rin - Nắm vững sản phẩm, nguồn hàng, kịch bản dẫn khách và chốt cọc trong 15 phút.',
      prize: '15.000.000Đ',
      date: 'Thời gian: 01/10 - 31/10/2026',
      cta: 'Đăng ký tư vấn ngay',
      bgGradient: 'from-[#0d3b66] via-[#105494] to-[#0284c7]',
      image: '/images/anh_rin_avatar.jpg',
      badge: 'QUÀ TẶNG KHÓA HỌC: BỘ KỊCH BẢN 30S BẺ GÃY TỪ CHỐI GIÁ'
    },
    {
      id: 2,
      tag: 'KỸ NĂNG MÔI GIỚI THỰC CHIẾN',
      title: 'LỘ TRÌNH 8 NHÓM NĂNG LỰC CĂN HỘ CHO THUÊ 2026',
      subtitle: 'Từ phân biệt Studio, Duplex, Căn mini đến quy đổi 500k = 16k/ngày để chốt cọc giữ phòng tại chỗ.',
      prize: 'CHỨNG CHỈ RMSA',
      date: 'Áp dụng toàn hệ thống Running Man',
      cta: 'Vào học bài phễu',
      bgGradient: 'from-[#0b2545] via-[#134074] to-[#1d2d44]',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      badge: 'CẬP NHẬT LIÊN TỤC HÀNG TUẦN TỪ ANH RIN'
    },
    {
      id: 3,
      tag: 'PHÒNG THI SÁT HẠCH ẢO',
      title: 'SÁT HẠCH TRỰC TUYẾN: 30 CÂU HỎI TÌNH HUỐNG THỰC ĐỊA',
      subtitle: 'Thi trắc nghiệm phản xạ xử lý khách chê giá đắt, khách do dự, kiểm tra phòng và thu cọc.',
      prize: 'THƯỞNG NÓNG CỌC ĐẦU TIÊN',
      date: 'Điểm chuẩn ≥ 80% cấp chứng chỉ',
      cta: 'Bắt đầu thi thử',
      bgGradient: 'from-[#004e64] via-[#0072bb] to-[#25a18e]',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      badge: 'PHÒNG THI TỰ ĐỘNG CHUẨN QUỐC TẾ'
    }
  ];

  // Auto carousel slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  // Hot Keywords (Chuẩn MapStudy)
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

  // Đội ngũ Huấn Luyện Viên & Giảng Viên
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

  // 8 Nhóm năng lực môi giới cho thuê của Anh Rin
  const competencyRoadmap = [
    {
      groupNum: 1,
      title: 'Nhóm 1 — Hiểu sản phẩm và thị trường',
      objective: 'Nhân viên phải hiểu mình đang bán gì, cho ai và vì sao khách nên thuê căn đó.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 2,
      title: 'Nhóm 2 — Tạo nguồn hàng và quản lý giỏ căn hộ',
      objective: 'Có nguồn hàng thật, thông tin chính xác và đủ lựa chọn để đáp ứng nhu cầu khách.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 3,
      title: 'Nhóm 3 — Tìm kiếm khách hàng và khai thác nhu cầu',
      objective: 'Biết chủ động tạo khách hàng tiềm năng, thay vì chỉ ngồi chờ khách hỏi tin đăng.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 4,
      title: 'Nhóm 4 — Tư vấn và dẫn khách xem căn hộ',
      objective: 'Tăng tỷ lệ khách từ đặt lịch sang xem thật, và từ xem căn sang lựa chọn căn phù hợp.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 5,
      title: 'Nhóm 5 — Xử lý từ chối, đàm phán và chốt giao dịch',
      objective: 'Bẻ gãy phản đối giá, giải tỏa tâm lý do dự và chốt cọc giữ phòng nhanh gọn.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 6,
      title: 'Nhóm 6 — CRM, KPI và quản lý phễu bán hàng',
      objective: 'Quản lý data khách, theo dõi tỷ lệ chuyển đổi từng giai đoạn và kỷ luật công việc.',
      status: 'active',
      badge: 'Đã đóng gói',
      lessonsCount: 'Bài phễu có sẵn'
    },
    {
      groupNum: 7,
      title: 'Nhóm 7 — Kỷ luật nghề nghiệp và dịch vụ khách hàng',
      objective: 'Đạo đức làm nghề môi giới, bảo vệ cọc của khách, dịch vụ sau chốt và tạo nguồn giới thiệu.',
      status: 'upcoming',
      badge: 'Cập nhật tuần này',
      lessonsCount: 'Anh Rin đang biên soạn'
    },
    {
      groupNum: 8,
      title: 'Nhóm 8 — Thực chiến ngoài thị trường',
      objective: 'Tự tin xử lý tình huống thực địa, khảo sát thị trường và giải quyết ca khó phát sinh.',
      status: 'upcoming',
      badge: 'Cập nhật tuần này',
      lessonsCount: 'Anh Rin đang biên soạn'
    }
  ];

  // Danh sách các khóa học đào tạo đóng gói sẵn (Chuẩn Card MapStudy)
  const trainingCourses = [
    {
      id: 1,
      code: 'RM-01',
      groupKey: 'group1_2',
      title: 'RM-01: HIỂU SÂU SẢN PHẨM - PHÂN BIỆT STUDIO, DUPLEX, CĂN MINI & THỊ TRƯỜNG CHO THUÊ',
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
      code: 'RM-02',
      groupKey: 'group1_2',
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
      code: 'RM-03',
      groupKey: 'group3_4',
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
      code: 'RM-04',
      groupKey: 'group3_4',
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
      code: 'RM-05',
      groupKey: 'group5',
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
      code: 'RM-06',
      groupKey: 'group6_8',
      title: 'RM-06: QUẢN LÝ PHỄU CRM, KỶ LUẬT NGHỀ MÔI GIỚI & XỬ LÝ TÌNH HUỐNG THỰC CHIẾN',
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
      code: 'RM-DOC-01',
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
      id: 8,
      code: 'RM-DOC-02',
      groupKey: 'materials',
      title: 'MẪU HỢP ĐỒNG THUÊ CĂN HỘ DỊCH VỤ & BIÊN BẢN BÀN GIAO PHÒNG CHUẨN PHÁP LÝ',
      categoryLabel: 'Mẫu Hợp Đồng',
      thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      duration: 'File Word/PDF',
      quizCount: 'Tải trực tiếp',
      passingScore: 'Miễn phí',
      instructor: 'Ban Pháp Chế RMSA',
      reactions: 395
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
    <div className="min-h-screen bg-[#edf4fb] text-slate-800 font-sans selection:bg-[#105494] selection:text-white pb-16">
      
      {/* 1. TOP NAVBAR (Chuẩn 100% MapStudy Header) */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-15">
            
            {/* Left: Brand Icon + Search Button Circle */}
            <div className="flex items-center space-x-3">
              {/* Blue Rounded App Icon */}
              <div 
                onClick={() => setMainViewTab('home')}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0e487f] to-[#1464b0] flex items-center justify-center text-white font-black text-xl shadow-xs cursor-pointer select-none hover:opacity-95 transition-all"
                title="RMSA - Running Man Sales Academy"
              >
                M
              </div>

              {/* Circular Search Button Pill */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center text-slate-500 cursor-pointer transition-colors">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Center: Top Nav Icon Pill (MapStudy Style) */}
            <nav className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-slate-100/90 rounded-2xl border border-slate-200/60">
              <button 
                onClick={() => setMainViewTab('home')}
                className={`w-9 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  mainViewTab === 'home' 
                    ? 'bg-[#105494] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Trang chủ"
              >
                <Home className="w-4 h-4" />
              </button>

              <button 
                onClick={() => {
                  setMainViewTab('home');
                  const el = document.getElementById('courses-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-9 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer"
                title="Khóa học & Bài giảng"
              >
                <GraduationCap className="w-4 h-4" />
              </button>

              <button 
                onClick={onOpenPracticeTest || onOpenLogin}
                className="w-9 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer"
                title="Phòng thi sát hạch"
              >
                <FileText className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setMainViewTab('community')}
                className={`w-9 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  mainViewTab === 'community' 
                    ? 'bg-[#105494] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Cộng đồng thảo luận"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              <button 
                onClick={onOpenCheatsheet || onOpenLogin}
                className="w-9 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer"
                title="Đấu trường & Giáo trình"
              >
                <Flame className="w-4 h-4 text-amber-500" />
              </button>
            </nav>

            {/* Right: Auth Action Buttons */}
            <div className="flex items-center space-x-3.5">
              <button 
                onClick={onOpenLogin}
                className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-[#105494] transition-colors cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-sky-600" />
                <span>Kích hoạt thẻ</span>
              </button>

              <button 
                onClick={onOpenLogin}
                className="text-xs font-bold text-slate-700 hover:text-[#105494] transition-colors cursor-pointer"
              >
                Đăng ký
              </button>

              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-xl bg-[#105494] hover:bg-[#0c4275] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 hover:shadow-sm"
              >
                <span>Đăng nhập</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. MAIN 2-COLUMN CONTAINER (Left Sidebar + Right Content Area) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-5">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* COLUMN 1: LEFT SIDEBAR (Chuẩn 100% Sidebar MapStudy trong ảnh người dùng) */}
          {/* ========================================================================= */}
          <aside className="w-full lg:w-60 xl:w-64 shrink-0 lg:sticky lg:top-20 space-y-5">
            
            {/* Top Action: Đăng nhập Button */}
            <div className="bg-white rounded-2xl p-2.5 shadow-2xs border border-slate-200/80">
              <button 
                onClick={onOpenLogin}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-[#105494] hover:bg-sky-50 font-bold text-sm transition-all cursor-pointer text-left"
              >
                <LogIn className="w-4 h-4 text-[#105494]" />
                <span>Đăng nhập</span>
              </button>
            </div>

            {/* Main Navigation List */}
            <div className="bg-white rounded-2xl p-3 shadow-2xs border border-slate-200/80 space-y-1">
              
              <button 
                onClick={() => {
                  setMainViewTab('home');
                  const el = document.getElementById('courses-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-md bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Play className="w-3.5 h-3.5 fill-red-600 text-red-600 ml-0.5" />
                </div>
                <span className="group-hover:text-slate-900">Khóa học</span>
              </button>

              <button 
                onClick={onOpenPracticeTest || onOpenLogin}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="group-hover:text-slate-900">Thi online</span>
              </button>

              <button 
                onClick={onOpenCheatsheet || onOpenLogin}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Crosshair className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <span className="group-hover:text-slate-900">Đấu trường lý thuyết</span>
              </button>

              <button 
                onClick={onOpenCheatsheet || onOpenLogin}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <span className="group-hover:text-slate-900">Sách Map / Sổ tay RMSA</span>
              </button>

              <button 
                onClick={() => {
                  setMainViewTab('home');
                  setActiveCourseCategory('materials');
                  const el = document.getElementById('courses-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-md bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                  <Folder className="w-3.5 h-3.5 text-yellow-600 fill-yellow-600" />
                </div>
                <span className="group-hover:text-slate-900">Tài liệu</span>
              </button>

              <button 
                onClick={() => setMainViewTab('community')}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <span className="group-hover:text-slate-900">Diễn đàn</span>
              </button>

              <button 
                onClick={() => setMainViewTab('community')}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-left group"
              >
                <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Atom className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <span className="group-hover:text-slate-900">Cộng đồng Running Man</span>
              </button>

            </div>

            {/* Section: Liên kết (Social & Instructor Links) */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                Liên kết
              </span>

              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 group"
              >
                <div className="w-7 h-7 rounded-full bg-[#1877f2] text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                  f
                </div>
                <span className="group-hover:text-[#1877f2] transition-colors truncate">Facebook Running Man</span>
              </a>

              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 group"
              >
                <div className="w-7 h-7 rounded-full bg-[#ff0000] text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                  ▶
                </div>
                <span className="group-hover:text-[#ff0000] transition-colors truncate">Thầy Anh Rin - Cho Thuê Căn Hộ</span>
              </a>

              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 group"
              >
                <div className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                  ♪
                </div>
                <span className="group-hover:text-slate-950 transition-colors truncate">Tiktok Running Man</span>
              </a>
            </div>

          </aside>

          {/* ========================================================================= */}
          {/* COLUMN 2: RIGHT MAIN CONTENT AREA                                         */}
          {/* ========================================================================= */}
          <main className="flex-1 min-w-0 space-y-5">
            
            {/* Top Switcher Tabs (Trang chủ vs Cộng đồng - Chuẩn MapStudy) */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMainViewTab('home')}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer ${
                  mainViewTab === 'home'
                    ? 'bg-[#105494] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80'
                }`}
              >
                <span className="w-4 h-4 rounded bg-white/20 flex items-center justify-center text-[10px] font-black">
                  M
                </span>
                <span>Trang chủ</span>
              </button>

              <button
                onClick={() => setMainViewTab('community')}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer ${
                  mainViewTab === 'community'
                    ? 'bg-[#105494] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Cộng đồng</span>
              </button>
            </div>

            {/* TAB CONTENT: HOME OR COMMUNITY */}
            {mainViewTab === 'home' ? (
              <>
                {/* 1. HERO BANNER CAROUSEL (Chuẩn MapStudy Slider) */}
                <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 bg-gradient-to-r from-[#0c3966] via-[#105494] to-[#0284c7] text-white min-h-[260px] sm:min-h-[300px] flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                  
                  {/* Decorative background circle */}
                  <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Header Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{heroBanners[currentSlide].tag}</span>
                    </div>

                    <span className="text-[11px] text-sky-100 font-medium">
                      {heroBanners[currentSlide].date}
                    </span>
                  </div>

                  {/* Slide Main Body */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4 relative z-10">
                    
                    {/* Left: Text & Title */}
                    <div className="md:col-span-8 space-y-2.5 text-left">
                      <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight leading-tight uppercase">
                        {heroBanners[currentSlide].title}
                      </h1>
                      <p className="text-xs sm:text-sm text-sky-100 line-clamp-2 max-w-xl">
                        {heroBanners[currentSlide].subtitle}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <div className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs shadow-xs">
                          {heroBanners[currentSlide].prize}
                        </div>
                        <span className="text-xs text-sky-200 font-semibold">
                          {heroBanners[currentSlide].badge}
                        </span>
                      </div>
                    </div>

                    {/* Right: Instructor Avatar & Branding */}
                    <div className="md:col-span-4 flex justify-end">
                      <div 
                        onClick={() => setSelectedTeacherModal(teachersList[0])}
                        className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 transition-all cursor-pointer group"
                      >
                        <img 
                          src="/images/anh_rin_avatar.jpg" 
                          alt="Anh Rin" 
                          className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400"
                        />
                        <div className="text-left pr-2">
                          <span className="text-[10px] font-bold text-amber-300 uppercase block">HLV Trưởng</span>
                          <p className="text-xs font-bold text-white group-hover:text-amber-200">Anh Rin</p>
                          <span className="text-[10px] text-sky-200">Bấm xem hồ sơ</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Carousel Dots Indicator */}
                  <div className="flex items-center justify-center space-x-2 pt-2 relative z-10">
                    {heroBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>

                </div>

                {/* 2. "LIÊN HỆ TƯ VẤN" FORM (Card trắng chuẩn MapStudy ngay bên dưới Slider) */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Liên hệ tư vấn
                      </h2>
                      <p className="text-xs text-slate-500">
                        Đăng ký nhận lộ trình đào tạo môi giới căn hộ thực chiến hoặc liên hệ phỏng vấn cùng Anh Rin
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#105494] bg-sky-50 px-3 py-1 rounded-full border border-sky-100 hidden sm:inline-block">
                      Phản hồi trong 15 phút
                    </span>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-3.5 pt-1">
                    
                    {/* Row 1: Họ tên + SĐT */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="* Họ và tên"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-[#105494] focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="* Số điện thoại"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-[#105494] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 2: Link Facebook */}
                    <div>
                      <input
                        type="text"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        placeholder="Link Facebook / Zalo cá nhân"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-[#105494] focus:outline-none transition-all"
                      />
                    </div>

                    {/* Row 3: Dropdowns (Lớp/Khu vực + Môn học/Phân khúc) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <select
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-700 border border-transparent focus:border-[#105494] focus:outline-none transition-all cursor-pointer"
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-700 border border-transparent focus:border-[#105494] focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="">* Phân khúc căn hộ quan tâm</option>
                          <option value="duplex">Căn hộ Duplex gác lửng (Phổ biến nhất)</option>
                          <option value="studio">Căn hộ Studio tiện nghi</option>
                          <option value="mini">Căn hộ mini 1 phòng ngủ / 1PK</option>
                          <option value="chdv">Căn hộ dịch vụ cao cấp (Full dịch vụ)</option>
                          <option value="all_8">Trọn gói 8 Nhóm Năng Lực Môi Giới</option>
                        </select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-1 flex items-center justify-between">
                      <p className="text-[11px] text-slate-400 hidden sm:block">
                        Thông tin của bạn được bảo mật tuyệt đối theo chính sách đào tạo Running Man.
                      </p>

                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#105494] hover:bg-[#0c4275] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Gửi thông tin tư vấn</span>
                      </button>
                    </div>

                  </form>
                </div>

                {/* 3. HOT KEYWORDS PILLS ROW */}
                <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 mr-2 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
                      Tìm kiếm nổi bật:
                    </span>
                    {hotKeywords.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(item.query);
                          const el = document.getElementById('courses-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-[#105494] text-slate-600 text-xs font-medium transition-colors cursor-pointer border border-transparent hover:border-sky-200"
                      >
                        #{item.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. DÀN GIẢNG VIÊN / HUẤN LUYỆN VIÊN (Chuẩn MapStudy Teachers Grid) */}
                <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-5">
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
                        className="rounded-2xl border border-slate-200 hover:border-[#105494] p-4 bg-slate-50/50 hover:bg-sky-50/40 transition-all cursor-pointer group flex flex-col justify-between"
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
                            <span className="text-[10px] font-bold text-[#105494] bg-sky-100 px-2.5 py-0.5 rounded-full inline-block">
                              {teacher.badge}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#105494] transition-colors">
                              {teacher.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {teacher.title}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 mt-3">
                          <span className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 mr-1" />
                            {teacher.rating}
                          </span>
                          <span className="text-[#105494] font-semibold group-hover:underline flex items-center">
                            Xem hồ sơ
                            <ChevronRight className="w-3 h-3 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. LỘ TRÌNH 8 NHÓM NĂNG LỰC CỐT LÕI (Chuẩn Roadmap của Anh Rin) */}
                <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Lộ trình chuẩn hóa 8 Nhóm Năng Lực Môi Giới
                      </h2>
                      <p className="text-xs text-slate-500">
                        Học đúng bài phễu - Ra thực chiến ngay - Cập nhật nội dung hàng tuần qua hệ thống
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {competencyRoadmap.map((item) => (
                      <div
                        key={item.groupNum}
                        onClick={onOpenLogin}
                        className="p-4 rounded-xl border border-slate-200 hover:border-[#105494] hover:bg-sky-50/30 transition-all cursor-pointer flex items-start space-x-3.5 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#105494] font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-[#105494] group-hover:text-white transition-colors">
                          {item.groupNum}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#105494]">
                              {item.title}
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              item.status === 'active' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {item.objective}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 6. KHÓA HỌC & BÀI GIẢNG PHỄU (Course Cards chuẩn MapStudy) */}
                <section id="courses-section" className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        Khóa đào tạo & Bài học phễu
                      </h2>
                      <p className="text-xs text-slate-500">
                        Các bài học nền tảng bắt buộc dành cho nhân viên môi giới chuỗi căn hộ Running Man
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => setActiveCourseCategory('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeCourseCategory === 'all'
                            ? 'bg-[#105494] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Tất cả
                      </button>

                      <button
                        onClick={() => setActiveCourseCategory('group1_2')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeCourseCategory === 'group1_2'
                            ? 'bg-[#105494] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Nhóm 1 & 2 (Sản phẩm & Nguồn hàng)
                      </button>

                      <button
                        onClick={() => setActiveCourseCategory('group3_4')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeCourseCategory === 'group3_4'
                            ? 'bg-[#105494] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Nhóm 3 & 4 (Tìm khách & Dẫn phòng)
                      </button>

                      <button
                        onClick={() => setActiveCourseCategory('group5')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeCourseCategory === 'group5'
                            ? 'bg-[#105494] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Nhóm 5 (Bẻ gãy từ chối giá)
                      </button>

                      <button
                        onClick={() => setActiveCourseCategory('materials')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeCourseCategory === 'materials'
                            ? 'bg-[#105494] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Biểu mẫu & Hợp đồng
                      </button>
                    </div>
                  </div>

                  {/* Course Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        onClick={onOpenLogin}
                        className="rounded-2xl border border-slate-200 hover:border-[#105494] overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Thumbnail */}
                          <div className="relative aspect-video overflow-hidden bg-slate-900">
                            <img 
                              src={course.thumb} 
                              alt={course.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                              {course.categoryLabel}
                            </div>
                            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {course.duration}
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-4 space-y-2">
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {course.code}
                            </span>
                            <h3 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-[#105494] transition-colors leading-snug">
                              {course.title}
                            </h3>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700 flex items-center">
                            <UserCheck className="w-3.5 h-3.5 text-[#105494] mr-1" />
                            {course.instructor}
                          </span>
                          <span className="flex items-center text-rose-500 font-semibold">
                            <Heart className="w-3 h-3 fill-rose-500 mr-1" />
                            {course.reactions}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 7. CẨM NANG & KINH NGHIỆM THỰC CHIẾN (Chuẩn Blog/Articles) */}
                <section className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-5">
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
                        onClick={onOpenLogin}
                        className="p-4 rounded-xl border border-slate-200 hover:border-[#105494] hover:bg-sky-50/30 transition-all cursor-pointer flex gap-4 group"
                      >
                        <img 
                          src={art.thumb} 
                          alt={art.title} 
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#105494] bg-sky-50 px-2 py-0.5 rounded border border-sky-100 inline-block">
                            {art.tag}
                          </span>
                          <h3 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-[#105494] leading-snug">
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
              </>
            ) : (
              /* TAB CONTENT: COMMUNITY RUNNING MAN */
              <div className="space-y-5">
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
                      onClick={onOpenLogin}
                      className="px-4 py-2 rounded-xl bg-[#105494] hover:bg-[#0c4275] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      + Viết bài chia sẻ
                    </button>
                  </div>
                </div>

                {/* Community Feed */}
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
            )}

            {/* 8. FOOTER 4 CỘT (Chuẩn Footer MapStudy) */}
            <footer className="bg-white rounded-2xl p-8 shadow-xs border border-slate-200/80 space-y-8 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* Col 1: About RMSA */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-[#105494] text-white flex items-center justify-center font-black text-sm">
                      M
                    </div>
                    <div>
                      <span className="text-xs font-black tracking-wider text-[#105494]">RMSA</span>
                      <p className="text-[10px] text-slate-400">Running Man Sales Academy</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Học viện đào tạo nghiệp vụ môi giới và cho thuê căn hộ thực chiến Running Man. Định vị sản phẩm thật - Dẫn lối tư duy thực chiến.
                  </p>
                  <p className="text-xs font-bold text-amber-600">
                    "EVERY JOURNEY LEADS HOME"
                  </p>
                </div>

                {/* Col 2: Chương trình học */}
                <div className="space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Khóa đào tạo
                  </h4>
                  <ul className="space-y-2 text-slate-600">
                    <li className="hover:text-[#105494] cursor-pointer" onClick={onOpenLogin}>Nhóm 1: Sản phẩm & Giá thị trường</li>
                    <li className="hover:text-[#105494] cursor-pointer" onClick={onOpenLogin}>Nhóm 2: Nguồn hàng & Giỏ căn hộ</li>
                    <li className="hover:text-[#105494] cursor-pointer" onClick={onOpenLogin}>Nhóm 3: Đăng tin & Khai thác nhu cầu</li>
                    <li className="hover:text-[#105494] cursor-pointer" onClick={onOpenLogin}>Nhóm 4: Telesale 30s & Dẫn khách</li>
                    <li className="hover:text-[#105494] cursor-pointer" onClick={onOpenLogin}>Nhóm 5: Bẻ gãy từ chối giá & Chốt cọc</li>
                  </ul>
                </div>

                {/* Col 3: Hỗ trợ học viên */}
                <div className="space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Hỗ trợ học viên
                  </h4>
                  <ul className="space-y-2 text-slate-600">
                    <li className="hover:text-[#105494] cursor-pointer" onClick={onOpenCheatsheet || onOpenLogin}>Sổ tay kịch bản bỏ túi (PDF)</li>
                    <li className="hover:text-[#105494] cursor-pointer" onClick={onOpenPracticeTest || onOpenLogin}>Kỳ thi sát hạch trực tuyến</li>
                    <li className="hover:text-[#105494] cursor-pointer" onClick={onOpenCertificate || onOpenLogin}>Tra cứu chứng chỉ điện tử</li>
                    <li className="hover:text-[#105494] cursor-pointer" onClick={onOpenLeaderboard || onOpenLogin}>Bảng xếp hạng Best Seller</li>
                  </ul>
                </div>

                {/* Col 4: Liên hệ & Giảng viên */}
                <div className="space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Ban Đào Tạo & Tuyển Dụng
                  </h4>
                  <p className="text-slate-600">
                    Huấn luyện viên trưởng: <strong className="text-slate-800">Anh Rin</strong>
                  </p>
                  <p className="text-slate-600">
                    Hotline tuyển dụng: <span className="font-bold text-[#105494]">0909.xxx.xxx</span>
                  </p>
                  <p className="text-slate-600">
                    Trụ sở: TP. Hồ Chí Minh
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={onOpenLogin}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Đăng nhập Cổng Nội Bộ
                    </button>
                  </div>
                </div>

              </div>

              <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400">
                © 2026 RMSA (Running Man Sales Academy) • Giao diện chuẩn MapStudy • Bản quyền thuộc về Anh Rin & Running Man.
              </div>
            </footer>

          </main>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FLOATING ACTION BUTTON (9-Dot Launcher Button ở góc phải dưới - MapStudy) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          
          {/* Menu Popup khi bấm nút */}
          {isFabOpen && (
            <div className="absolute bottom-16 right-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tiện ích nhanh
              </div>

              <button
                onClick={() => { setIsFabOpen(false); if (onOpenPracticeTest) onOpenPracticeTest(); else onOpenLogin(); }}
                className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-sky-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <span>Phòng thi sát hạch</span>
              </button>

              <button
                onClick={() => { setIsFabOpen(false); if (onOpenCheatsheet) onOpenCheatsheet(); else onOpenLogin(); }}
                className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-sky-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span>Sổ tay kịch bản bỏ túi</span>
              </button>

              <button
                onClick={() => { setIsFabOpen(false); if (onOpenLeaderboard) onOpenLeaderboard(); else onOpenLogin(); }}
                className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-sky-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Atom className="w-3.5 h-3.5" />
                </div>
                <span>Bảng xếp hạng Best Seller</span>
              </button>

              <button
                onClick={() => { setIsFabOpen(false); onOpenLogin(); }}
                className="w-full flex items-center space-x-2.5 p-2 rounded-xl bg-[#105494] text-white font-bold text-xs transition-colors cursor-pointer text-left shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập hệ thống</span>
              </button>
            </div>
          )}

          {/* Nút Tròn 9 Chấm (Floating 9-dot Grid Icon) */}
          <button
            onClick={() => setIsFabOpen(!isFabOpen)}
            className="w-13 h-13 rounded-full bg-[#105494] hover:bg-[#0c4275] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Menu tiện ích MapStudy"
          >
            <LayoutGrid className="w-6 h-6" />
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL CHI TIẾT GIẢNG VIÊN (Anh Rin & Dàn Huấn Luyện Viên)               */}
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
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#105494] shadow-sm"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#105494] bg-sky-100 px-2.5 py-0.5 rounded-full inline-block">
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
                  onOpenLogin();
                }}
                className="px-5 py-2 rounded-xl bg-[#105494] hover:bg-[#0c4275] text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
              >
                Đăng ký học cùng Anh Rin
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
