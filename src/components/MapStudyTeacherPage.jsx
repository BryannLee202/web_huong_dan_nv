import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Key, 
  LogIn, 
  Home, 
  BookOpen, 
  FileText, 
  Newspaper, 
  Award,
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
  KeyRound,
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
  X
} from 'lucide-react';

export default function MapStudyTeacherPage({ onOpenLogin, onEnterApp }) {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'roadmap' | 'articles'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'group1_2' | 'group3_4' | 'group5' | 'group6_8' | 'materials'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTeacherModal, setSelectedTeacherModal] = useState(null);

  // Danh sách Banner Slider lớn ở đầu trang (Chuẩn Hero Carousel MapStudy)
  const heroBanners = [
    {
      id: 1,
      badge: 'CHƯƠNG TRÌNH ĐÀO TẠO NỘI BỘ 2026',
      title: 'Lộ Trình 8 Nhóm Năng Lực Môi Giới Căn Hộ Cho Thuê Thực Chiến',
      subtitle: 'Học đúng các bài tập phễu từ Anh Rin - Nắm vững sản phẩm, nguồn hàng, kịch bản dẫn khách và chốt cọc trong 15 phút.',
      ctaPrimary: 'Bắt đầu học ngay',
      ctaSecondary: 'Xem 8 nhóm năng lực',
      bgGradient: 'from-slate-950 via-slate-900 to-amber-950/70',
      image: '/images/anh_rin_avatar.jpg',
      tag: 'RMSA PHỄU BẮT BUỘC'
    },
    {
      id: 2,
      badge: 'CẨM NANG THỰC CHIẾN ĐỘC QUYỀN',
      title: 'Tuyệt Chiêu Bẻ Gãy 30 Lời Từ Chối Giá & Bí Quyết Chia Nhỏ 16K/Ngày',
      subtitle: 'Giải quyết triệt để 2 nỗi sợ lớn nhất của sale: Khách chê giá đắt hơn đối thủ & Khách bảo "để về suy nghĩ thêm".',
      ctaPrimary: 'Đọc kịch bản mẫu',
      ctaSecondary: 'Làm bài thi thử 3 phút',
      bgGradient: 'from-slate-950 via-zinc-900 to-blue-950/70',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      tag: 'KỊCH BẢN CHỐT CỌC'
    },
    {
      id: 3,
      badge: 'PHÒNG THI SÁT HẠCH NĂNG LỰC',
      title: 'Kỳ Thi Sát Hạch Chuẩn Hóa RMSA: 15 Câu Tình Huống Thực Địa',
      subtitle: 'Đánh giá năng lực tự động theo chuẩn phòng thi ảo. Đạt chuẩn ≥ 80% cấp ngay chứng chỉ tốt nghiệp điện tử chính thức.',
      ctaPrimary: 'Vào thi sát hạch',
      ctaSecondary: 'Xem danh sách vinh danh',
      bgGradient: 'from-slate-950 via-slate-900 to-emerald-950/70',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      tag: 'CHỨNG CHỈ RMSA'
    }
  ];

  // Tự động chuyển slide sau mỗi 6 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  // Từ khóa tìm kiếm hot (Chuẩn Hot Keywords của MapStudy)
  const hotKeywords = [
    { title: '🔥 Khóa phễu RM-01', query: 'RM-01' },
    { title: '🏢 Studio & Duplex', query: 'Studio' },
    { title: '📞 Kịch bản gọi 30s', query: 'Kịch bản' },
    { title: '💰 Bẻ gãy từ chối giá', query: 'từ chối' },
    { title: '🤝 Chốt cọc giữ chỗ', query: 'chốt cọc' },
    { title: '⚡ 8 Nhóm năng lực', query: 'Nhóm' },
    { title: '👨‍🏫 Giảng viên Anh Rin', query: 'Anh Rin' }
  ];

  // Đội ngũ Huấn Luyện Viên & Giảng Viên (Giống dàn Giáo viên của MapStudy)
  const teachersList = [
    {
      id: 1,
      name: 'Anh Rin',
      role: 'Sáng Lập & Giám Đốc RMSA',
      title: 'Chuyên gia đào tạo nghiệp vụ môi giới căn hộ cho thuê thực chiến',
      avatar: '/images/anh_rin_avatar.jpg',
      badge: 'GIẢNG VIÊN CHÍNH',
      rating: '5.0',
      totalLessons: '6 Chuyên đề phễu',
      achievements: [
        '8+ năm kinh nghiệm trực tiếp phát triển & vận hành chuỗi căn hộ mini, duplex, studio cho thuê đạt tỷ lệ lấp đầy >95%.',
        'Huấn luyện hơn 500+ anh em môi giới thực chiến từ con số 0 đến chốt cọc đều đặn mỗi tháng.',
        'Đóng gói bộ chuẩn 8 Nhóm Năng Lực Nghiệp Vụ Môi Giới Căn Hộ Cho Thuê.',
        'Triết lý: "Học đúng bài phễu - Ra thực chiến ngay - Update bài học hàng tuần".'
      ]
    },
    {
      id: 2,
      name: 'Ban Vận Hành Tòa Nhà',
      role: 'Quản Lý Giỏ Hàng & Dịch Vụ Số',
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

  // 8 Nhóm năng lực chuẩn nghiệp vụ môi giới cho thuê của Anh Rin
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
      title: 'RM-02: TẠO NGUỒN HÀNG THẬT & KỸ NĂNG KHAI THÁC, CẬP NHẬT GIỎ CĂN HỘ TRỐNG VỚI CHỦ NHÀ',
      categoryLabel: 'Nhóm 2 • Nguồn Hàng',
      thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      duration: '12 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: 'Anh Rin',
      reactions: 412
    },
    {
      id: 3,
      code: 'RM-03',
      groupKey: 'group3_4',
      title: 'RM-03: CHỦ ĐỘNG TÌM KIẾM KHÁCH HÀNG (ĐĂNG TIN CHỢ TỐT/SOCIAL) & KHAI THÁC NHU CẦU 2 PHÚT',
      categoryLabel: 'Nhóm 3 • Tìm Khách',
      thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      duration: '15 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: 'Anh Rin',
      reactions: 495
    },
    {
      id: 4,
      code: 'RM-04',
      groupKey: 'group3_4',
      title: 'RM-04: KỊCH BẢN TƯ VẤN TELESALE & CHECKLIST ĐÓN KHÁCH XEM PHÒNG TĂNG TỶ LỆ CHỐT 200%',
      categoryLabel: 'Nhóm 4 • Dẫn Khách',
      thumb: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
      duration: '15 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: 'Anh Rin',
      reactions: 520
    },
    {
      id: 5,
      code: 'RM-05',
      groupKey: 'group5',
      title: 'RM-05: BẺ GÃY TỪ CHỐI GIÁ THUÊ & TUYỆT CHIÊU CHỐT ĐƠN, CHỐT CỌC GIỮ PHÒNG NGAY TẠI CHỖ',
      categoryLabel: 'Nhóm 5 • Chốt Cọc',
      thumb: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
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
      title: 'RM-06: QUẢN LÝ PHỄU CRM, KỶ LUẬT NGHỀ MÔI GIỚI & XỬ LÝ TÌNH HUỐNG THỰC CHIẾN THỊ TRƯỜNG',
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

  // Kịch bản & Cẩm nang nghiệp vụ (Chuẩn News & Blog MapStudy)
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

  const filteredCourses = trainingCourses.filter(course => {
    const matchCategory = categoryFilter === 'all' || course.groupKey === categoryFilter;
    const matchQuery = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. TOP NAVBAR (Chuẩn MapStudy: Logo, Thanh tìm kiếm, Menu icon trung tâm, Nút Đăng nhập) */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center space-x-3.5 select-none cursor-pointer">
              <img 
                src="/images/running_man_logo.png" 
                alt="RUNNING MAN Logo" 
                className="h-9 w-auto object-contain"
              />
              <div className="h-6 w-px bg-slate-700 hidden sm:block" />
              <div className="flex flex-col hidden sm:block">
                <span className="text-xs font-black tracking-widest text-amber-400">RMSA</span>
                <span className="text-[9px] font-semibold text-slate-400 -mt-0.5">Running Man Sales Academy</span>
              </div>
            </div>

            {/* Center: Search Pill (Chuẩn MapStudy) */}
            <div className="relative hidden md:block w-52 lg:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tra cứu bài phễu (vd: RM-01, chốt cọc)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-850 focus:bg-slate-900 rounded-full text-slate-200 placeholder-slate-400 border border-slate-700 focus:border-amber-400 focus:outline-none transition-all"
              />
            </div>

            {/* Middle: MapStudy Style Central Icons */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button 
                onClick={() => { setActiveTab('courses'); setCategoryFilter('all'); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 text-xs cursor-pointer transition-all ${
                  activeTab === 'courses' ? 'text-amber-400 bg-slate-900 border border-amber-400/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </button>

              <button 
                onClick={() => setActiveTab('roadmap')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 text-xs cursor-pointer transition-all ${
                  activeTab === 'roadmap' ? 'text-amber-400 bg-slate-900 border border-amber-400/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>8 Nhóm năng lực</span>
              </button>

              <button 
                onClick={() => { setActiveTab('courses'); setCategoryFilter('all'); }}
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Khóa đào tạo</span>
              </button>

              <button 
                onClick={onOpenLogin}
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Phòng thi sát hạch</span>
              </button>

              <button 
                onClick={() => setActiveTab('articles')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 text-xs cursor-pointer transition-all ${
                  activeTab === 'articles' ? 'text-amber-400 bg-slate-900 border border-amber-400/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Cẩm nang thực chiến</span>
              </button>
            </nav>

            {/* Right: Auth Action Tools (MapStudy Style) */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={onOpenLogin}
                className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Kích hoạt mã</span>
              </button>

              <div className="h-4 w-px bg-slate-800 hidden sm:block" />

              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 hover:scale-[1.02]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập học ngay</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. HERO BANNER CAROUSEL (Chuẩn MapStudy Slider lớn đầu trang) */}
      <section className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Main Slide Card */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800/90 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10 lg:p-12">
            
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Column: Slide Content */}
              <div className="lg:col-span-8 space-y-4 text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{heroBanners[currentSlide].badge}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {heroBanners[currentSlide].title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {heroBanners[currentSlide].subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={onOpenLogin}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black shadow-md transition-all flex items-center space-x-2 cursor-pointer hover:scale-[1.02]"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{heroBanners[currentSlide].ctaPrimary}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>

                  <button
                    onClick={() => setActiveTab('roadmap')}
                    className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>{heroBanners[currentSlide].ctaSecondary}</span>
                  </button>
                </div>

                {/* Slide Features */}
                <div className="flex items-center space-x-6 pt-3 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                    Thực chiến 100%
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                    Sát hạch tự động ≥ 80%
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                    Update bài hàng tuần
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Visual Photo */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative group cursor-pointer" onClick={() => setSelectedTeacherModal(teachersList[0])}>
                  <div className="w-56 h-64 sm:w-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl relative bg-slate-900">
                    <img 
                      src={heroBanners[currentSlide].image} 
                      alt="Anh Rin - Running Man"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 mb-1 inline-block">
                        {heroBanners[currentSlide].tag}
                      </span>
                      <p className="text-sm font-black text-white">Anh Rin (Running Man)</p>
                      <p className="text-[10px] text-slate-300">Nhấn xem hồ sơ giảng viên</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Slider Dots & Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-6 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                {heroBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
                  className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroBanners.length)}
                  className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* 3. HOT KEYWORDS ROW (Chuẩn MapStudy) */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-400 text-[11px] mr-1 flex items-center">
              <Flame className="w-3.5 h-3.5 text-amber-500 mr-1" />
              Chuyên đề nổi bật:
            </span>
            {hotKeywords.map((kw, i) => (
              <button
                key={i}
                onClick={() => { setSearchQuery(kw.query); setActiveTab('courses'); }}
                className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-amber-400 text-[11px] font-medium transition-all cursor-pointer"
              >
                {kw.title}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 4. ĐỘI NGŨ HUẤN LUYỆN VIÊN & CHUYÊN GIA (Chuẩn Dàn Giáo Viên MapStudy) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Đội Ngũ Huấn Luyện Viên Thực Chiến</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Chuyên Gia Đồng Hành Cùng Đội Ngũ Môi Giới RMSA
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Mỗi bài giảng đều được đúc kết từ hàng nghìn giờ tiếp khách, dẫn xem căn hộ và xử lý từ chối ngoài thực địa.
            </p>
          </div>

          {/* Teachers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachersList.map((teacher) => (
              <div 
                key={teacher.id}
                onClick={() => setSelectedTeacherModal(teacher)}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Teacher Avatar */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img 
                      src={teacher.avatar} 
                      alt={teacher.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-amber-300 text-[10px] font-black uppercase backdrop-blur-xs">
                      {teacher.badge}
                    </span>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono flex items-center">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
                      {teacher.rating}
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                      {teacher.name}
                    </h3>
                    <p className="text-xs font-bold text-amber-700">
                      {teacher.role}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {teacher.title}
                    </p>
                  </div>
                </div>

                {/* Footer card */}
                <div className="pt-4 mt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-amber-700">
                  <span className="text-[11px]">{teacher.totalLessons}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. KHU VỰC CHÍNH: KHÓA ĐÀO TẠO & 8 NHÓM NĂNG LỰC (Chuẩn MapStudy Layout) */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Tabs Navigation */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab('courses')}
                className={`pb-2 text-sm font-black relative transition-colors cursor-pointer ${
                  activeTab === 'courses' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>Kho Khóa Đào Tạo Phễu ({trainingCourses.length})</span>
                {activeTab === 'courses' && (
                  <div className="absolute -bottom-4 left-0 w-full h-[3px] bg-amber-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('roadmap')}
                className={`pb-2 text-sm font-black relative transition-colors cursor-pointer ${
                  activeTab === 'roadmap' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>Lộ Trình 8 Nhóm Năng Lực</span>
                {activeTab === 'roadmap' && (
                  <div className="absolute -bottom-4 left-0 w-full h-[3px] bg-amber-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('articles')}
                className={`pb-2 text-sm font-black relative transition-colors cursor-pointer ${
                  activeTab === 'articles' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>Cẩm Nang Nghiệp Vụ Mẫu ({articlesList.length})</span>
                {activeTab === 'articles' && (
                  <div className="absolute -bottom-4 left-0 w-full h-[3px] bg-amber-500 rounded-full" />
                )}
              </button>
            </div>

            {/* Quick stats tag */}
            <div className="text-xs text-slate-500 font-medium">
              Chuẩn đánh giá năng lực: <strong className="text-amber-700 font-bold">≥ 80% qua môn</strong>
            </div>
          </div>

          {/* TAB 1: KHO KHÓA HỌC PHỄU */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              
              {/* Category Filter Pills (MapStudy Style) */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Tất cả chuyên đề
                </button>
                <button
                  onClick={() => setCategoryFilter('group1_2')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'group1_2'
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Nhóm 1 & 2: Sản phẩm & Nguồn hàng
                </button>
                <button
                  onClick={() => setCategoryFilter('group3_4')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'group3_4'
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Nhóm 3 & 4: Tìm khách & Dẫn xem
                </button>
                <button
                  onClick={() => setCategoryFilter('group5')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'group5'
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Nhóm 5: Đàm phán & Chốt cọc
                </button>
                <button
                  onClick={() => setCategoryFilter('group6_8')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'group6_8'
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Nhóm 6: Quản lý phễu CRM
                </button>
                <button
                  onClick={() => setCategoryFilter('materials')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === 'materials'
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Tài liệu & Kịch bản mẫu
                </button>
              </div>

              {/* Course Cards Grid (Chuẩn MapStudy Course Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={onOpenLogin}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Course Thumbnail */}
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        <img 
                          src={course.thumb} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                          {course.categoryLabel}
                        </span>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-amber-400" />
                          {course.duration}
                        </span>
                      </div>

                      {/* Course Info */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            {course.code}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {course.quizCount} • Chuẩn: {course.passingScore}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                          {course.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          Giảng viên: <strong className="text-slate-700">{course.instructor}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 pb-3 pt-2 flex items-center justify-between text-[11px] border-t border-slate-100">
                      <span className="flex items-center text-rose-500 font-semibold space-x-1">
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        <span>{course.reactions}</span>
                      </span>
                      <span className="text-amber-700 font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
                        <span>Vào học ngay</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>

                  </div>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                  Không tìm thấy bài học nào phù hợp với từ khóa "{searchQuery}".
                </div>
              )}

            </div>
          )}

          {/* TAB 2: LỘ TRÌNH 8 NHÓM NĂNG LỰC */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Khung 8 Nhóm Năng Lực Chuẩn Nghiệp Vụ Môi Giới Căn Hộ
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Được thiết kế thực chiến bởi Anh Rin dành riêng cho nhân sự Running Man Sales Academy (RMSA).
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shrink-0">
                  ⚡ Tuần tự 8 chặng từ Nguồn hàng đến Chốt cọc
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {competencyRoadmap.map((item) => (
                  <div 
                    key={item.groupNum}
                    onClick={onOpenLogin}
                    className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer group flex items-start justify-between"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        item.status === 'active' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {item.groupNum}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <strong className="text-slate-800">Mục tiêu:</strong> {item.objective}
                        </p>
                        <div className="flex items-center space-x-2 pt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {item.badge}
                          </span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-slate-400">{item.lessonsCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-3 text-slate-400 group-hover:text-amber-700 transition-colors mt-1">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BÀI VIẾT & CẨM NANG NGHIỆP VỤ MẪU */}
          {activeTab === 'articles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {articlesList.map((art) => (
                <div 
                  key={art.id}
                  onClick={onOpenLogin}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex gap-4 items-start">
                    <img 
                      src={art.thumb} 
                      alt={art.title} 
                      className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-100 group-hover:scale-105 transition-transform"
                    />
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                          {art.tag}
                        </span>
                        <span>•</span>
                        <span>{art.readTime}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 flex items-center">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      {art.views} lượt đọc
                    </span>
                    <span className="text-amber-700 font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
                      <span>Đọc trọn vẹn</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER (Chuẩn MapStudy) */}
      <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-slate-950 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center lg:text-left">
              <span className="text-xs font-black uppercase tracking-widest text-slate-900/80">
                RUNNING MAN SALES ACADEMY (RMSA)
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                Sẵn sàng bứt phá doanh số cho thuê căn hộ cùng Anh Rin?
              </h3>
              <p className="text-xs sm:text-sm text-slate-900/90 max-w-xl font-medium">
                Đăng nhập tài khoản nhân viên để mở khóa các bài phễu thực chiến, làm bài thi tình huống và nhận chứng chỉ tốt nghiệp điện tử ngay hôm nay.
              </p>
            </div>

            <button
              onClick={onOpenLogin}
              className="px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-sm shadow-2xl transition-all cursor-pointer hover:scale-105 shrink-0 flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập vào học ngay</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER CHUẨN MAPSTUDY (4 Cột đầy đủ thông tin) */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-14 pb-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-850">
            
            {/* Cột 1: Thông tin thương hiệu */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img 
                  src="/images/running_man_logo.png" 
                  alt="RUNNING MAN Logo" 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-xs text-slate-400 font-serif italic">
                "Every Journey Leads Home"
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                RMSA (Running Man Sales Academy) - Hệ thống đào tạo nghiệp vụ môi giới và quản trị căn hộ cho thuê thực chiến.
              </p>
            </div>

            {/* Cột 2: Các chuyên đề phễu */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Chuyên Đề Phễu Trọng Tâm
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li className="hover:text-amber-400 cursor-pointer" onClick={onOpenLogin}>• RM-01: Hiểu sản phẩm Studio & Duplex</li>
                <li className="hover:text-amber-400 cursor-pointer" onClick={onOpenLogin}>• RM-02: Tạo nguồn hàng & Giỏ căn trống</li>
                <li className="hover:text-amber-400 cursor-pointer" onClick={onOpenLogin}>• RM-03: Đăng tin Chợ Tốt & Tìm khách</li>
                <li className="hover:text-amber-400 cursor-pointer" onClick={onOpenLogin}>• RM-04: Kịch bản tư vấn telesale 30s</li>
                <li className="hover:text-amber-400 cursor-pointer" onClick={onOpenLogin}>• RM-05: Bẻ gãy từ chối giá & Chốt cọc</li>
              </ul>
            </div>

            {/* Cột 3: Hỗ trợ học viên */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Hỗ Trợ & Sát Hạch
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li className="hover:text-amber-400 cursor-pointer" onClick={onOpenLogin}>• Tiêu chuẩn qua môn: ≥ 80%</li>
                <li className="hover:text-amber-400 cursor-pointer" onClick={onOpenLogin}>• Phòng thi trắc nghiệm bấm giờ</li>
                <li className="hover:text-amber-400 cursor-pointer" onClick={onOpenLogin}>• Cấp chứng chỉ điện tử RMSA</li>
                <li className="hover:text-amber-400 cursor-pointer" onClick={onOpenLogin}>• Cập nhật bài giảng định kỳ hàng tuần</li>
              </ul>
            </div>

            {/* Cột 4: Kênh liên hệ */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Kênh Liên Hệ RMSA
              </h4>
              <div className="space-y-2 text-[11px] text-slate-400">
                <p>Hotline: <strong className="text-slate-200">0909 68 89 89</strong></p>
                <p>Email: <strong className="text-slate-200">daotao@runningman.vn</strong></p>
                <p>Giảng viên: <strong className="text-amber-400">Anh Rin (Running Man)</strong></p>
              </div>
            </div>

          </div>

          <div className="pt-6 text-center text-[11px] text-slate-600">
            © 2026 RMSA (Running Man Sales Academy) • All rights reserved • Giao diện chuẩn MapStudy
          </div>
        </div>
      </footer>

      {/* MODAL XEM HỒ SƠ CHI TIẾT GIẢNG VIÊN (ANH RIN) */}
      {selectedTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 font-serif font-black text-xs">
                  RM
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedTeacherModal.name}</h3>
                  <p className="text-[11px] text-amber-700 font-bold">{selectedTeacherModal.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTeacherModal(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs leading-relaxed max-h-[75vh] overflow-y-auto">
              <div className="flex gap-4 items-center">
                <img 
                  src={selectedTeacherModal.avatar} 
                  alt={selectedTeacherModal.name} 
                  className="w-24 h-28 rounded-2xl object-cover shadow-sm border border-slate-200"
                />
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black border border-amber-200">
                    {selectedTeacherModal.badge}
                  </span>
                  <p className="text-xs font-semibold text-slate-700">{selectedTeacherModal.title}</p>
                  <p className="text-[11px] text-slate-500">Đánh giá học viên: ⭐ {selectedTeacherModal.rating}/5.0</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase">Thành tích & Năng lực huấn luyện:</h4>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  {selectedTeacherModal.achievements.map((ach, idx) => (
                    <li key={idx}>{ach}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => { setSelectedTeacherModal(null); onOpenLogin(); }}
                  className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập để vào học chuyên đề của {selectedTeacherModal.name}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
