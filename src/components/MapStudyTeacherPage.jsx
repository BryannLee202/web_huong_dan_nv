import React, { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';

export default function MapStudyTeacherPage({ onOpenLogin, onEnterApp }) {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'roadmap' | 'articles'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'group1_2' | 'group3_4' | 'group5' | 'group6_8' | 'materials'
  const [searchQuery, setSearchQuery] = useState('');

  // Thông tin chuyên gia / Giảng viên đào tạo Anh Rin - Running Man
  const teacherProfile = {
    name: 'Anh Rin',
    title: 'Sáng Lập & Giám Đốc RMSA (Running Man Sales Academy)',
    badge: 'CHUYÊN GIA ĐÀO TẠO MÔI GIỚI THỰC CHIẾN',
    avatar: '/images/anh_rin_avatar.jpg',
    achievements: [
      'Trực tiếp phát triển & vận hành chuỗi căn hộ mini, duplex, studio cho thuê đạt tỷ lệ lấp đầy >95%.',
      'Đã huấn luyện hơn 500+ anh em môi giới thực chiến từ con số 0 đến chốt cọc đều đặn mỗi tháng.',
      'Đóng gói bộ chuẩn 8 Nhóm Năng Lực Nghiệp Vụ Môi Giới Căn Hộ Cho Thuê từ thực tế thị trường.',
      'Phương châm đào tạo: "Học đúng bài tập phễu - Vào thực chiến ngay - Update bài học hàng tuần".'
    ],
    teachingStyle: [
      '100% tình huống thực chiến: Từ cách lấy nguồn hàng thật, kỹ thuật đăng tin Chợ Tốt/Social, đến checklist đón khách 15 phút và bẻ gãy từ chối giá.',
      'Sát hạch tự động sau từng bài học: Đạt chuẩn ≥ 80% mới cấp quyền chốt deal thực tế và cấp chứng nhận.'
    ],
    contactInfo: {
      hotline: '0909 68 89 89',
      email: 'daotao@runningman.vn',
      facebook: 'Hệ Thống Căn Hộ Cho Thuê RUNNING MAN - Anh Rin'
    }
  };

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

  // Danh sách các khóa học đào tạo đóng gói sẵn (Chuẩn MapStudy)
  const trainingCourses = [
    {
      id: 1,
      code: 'RM-01',
      groupKey: 'group1_2',
      title: 'RM-01: HIỂU SẢU SẢN PHẨM - PHÂN BIỆT STUDIO, DUPLEX, CĂN MINI & THỊ TRƯỜNG CHO THUÊ',
      categoryLabel: 'Nhóm 1 • Sản Phẩm',
      thumb: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      duration: '15 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: teacherProfile.name,
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
      instructor: teacherProfile.name,
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
      instructor: teacherProfile.name,
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
      instructor: teacherProfile.name,
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
      instructor: teacherProfile.name,
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
      instructor: teacherProfile.name,
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
      instructor: 'Ban Đào Tạo Running Man',
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
      instructor: 'Ban Pháp Chế Running Man',
      reactions: 395
    }
  ];

  // Kịch bản thực chiến (Tab Kịch bản)
  const articlesList = [
    {
      id: 'art-1',
      title: 'Kịch bản 30 giây phá băng khi khách nhắn hỏi: "Phòng này còn không em? Giá bao nhiêu?"',
      excerpt: 'Tuyệt đối không chỉ trả lời "Dạ còn" rồi im lặng. Quy trình 3 bước gửi lời chào nồng nhiệt, khơi gợi thời gian dọn phòng và chốt lịch xem phòng trực tiếp trong ngày.',
      tag: 'Nhóm 4 • Telesale',
      readTime: '4 phút đọc',
      date: 'Tháng 10/2026'
    },
    {
      id: 'art-2',
      title: 'Bí quyết biến 500k chênh lệch thành 16.000đ/ngày: Bẻ gãy lời từ chối "Giá phòng bên em đắt quá"',
      excerpt: 'Quy đổi chi phí trên ngày: 16k/ngày chưa bằng nửa ly cà phê nhưng đổi lấy an ninh vân tay 2 lớp, camera 24/7, giờ tự do, máy giặt riêng và bảo trì kỹ thuật miễn phí.',
      tag: 'Nhóm 5 • Bẻ gãy từ chối',
      readTime: '6 phút đọc',
      date: 'Tháng 10/2026'
    },
    {
      id: 'art-3',
      title: 'Checklist 5 bước biến căn phòng thành không gian hút khách trước giờ hẹn 15 phút',
      excerpt: 'Đến trước mở cửa thông thoáng, bật điều hòa 24 độ mát rượi, hương tinh dầu nhẹ, kéo rèm đón sáng tự nhiên tạo ấn tượng WOW ngay khi khách bước chân vào.',
      tag: 'Nhóm 4 • Dẫn khách',
      readTime: '5 phút đọc',
      date: 'Tháng 10/2026'
    },
    {
      id: 'art-4',
      title: 'Kỹ thuật chốt cọc giả định (Assumptive Close) & Quy trình thu cọc lập phiếu giữ phòng 24h',
      excerpt: 'Cách nhận diện 4 tín hiệu muốn mua của khách thuê và hướng khách hàng vào phương thức đặt cọc (tiền mặt hay quét QR) để khóa phòng trên hệ thống.',
      tag: 'Nhóm 5 • Chốt cọc',
      readTime: '5 phút đọc',
      date: 'Tháng 10/2026'
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      
      {/* 1. TOP NAVBAR (Chuẩn MapStudy: 56px, nền trắng mờ trong suốt, menu icon ở giữa, Đăng nhập bên phải) */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo & Search Bar */}
            <div className="flex items-center space-x-4">
              <div 
                onClick={() => setActiveTab('courses')}
                className="flex items-center space-x-3 select-none cursor-pointer"
              >
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

              {/* Search Pill */}
              <div className="relative hidden md:block w-48 lg:w-60">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tra cứu bài phễu (vd: RM-01, chốt cọc)..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 focus:bg-slate-900 rounded-full text-slate-200 placeholder-slate-400 border border-slate-700 focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Middle: MapStudy Style Central Icons */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button 
                onClick={() => setActiveTab('courses')}
                className={`px-3 py-2 rounded-lg font-bold flex items-center space-x-1.5 text-xs cursor-pointer transition-all ${
                  activeTab === 'courses' ? 'text-amber-400 bg-slate-900 border border-amber-400/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Khóa đào tạo</span>
              </button>

              <button 
                onClick={() => setActiveTab('roadmap')}
                className={`px-3 py-2 rounded-lg font-bold flex items-center space-x-1.5 text-xs cursor-pointer transition-all ${
                  activeTab === 'roadmap' ? 'text-amber-400 bg-slate-900 border border-amber-400/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>8 Nhóm năng lực sale</span>
              </button>

              <button 
                onClick={onOpenLogin}
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Phòng thi sát hạch</span>
              </button>

              <button 
                onClick={() => setActiveTab('articles')}
                className={`px-3 py-2 rounded-lg font-bold flex items-center space-x-1.5 text-xs cursor-pointer transition-all ${
                  activeTab === 'articles' ? 'text-amber-400 bg-slate-900 border border-amber-400/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                <span>Kịch bản & Cẩm nang</span>
              </button>
            </nav>

            {/* Right: Auth Action Tools */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={onOpenLogin}
                className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Kích hoạt mã</span>
              </button>

              <div className="h-4 w-px bg-slate-800 hidden sm:block" />

              <button
                onClick={onOpenLogin}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 hover:scale-[1.02]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập học ngay</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. MAIN 2-COLUMN LAYOUT (Chuẩn MapStudy: 42% Trái - 58% Phải) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* CỘT TRÁI (42% width): HỒ SƠ GIẢNG VIÊN ANH RIN - RUNNING MAN */}
          <div className="w-full lg:w-[42%] lg:sticky lg:top-20">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
              
              {/* Header profile with Real Photo */}
              <div className="flex gap-5 items-start">
                <div className="relative shrink-0">
                  <img 
                    src={teacherProfile.avatar} 
                    alt={teacherProfile.name} 
                    className="w-32 h-36 rounded-2xl object-cover shadow-md border-2 border-amber-400/40"
                  />
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs" title="Đang trực tiếp huấn luyện">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="inline-block rounded-full px-3 py-1 text-[11px] font-black uppercase text-amber-700 bg-amber-50 border border-amber-200">
                    {teacherProfile.badge}
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {teacherProfile.name}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2">
                    {teacherProfile.title}
                  </p>
                  
                  {/* CTA Đăng nhập vào học */}
                  <div className="pt-2">
                    <button
                      onClick={onOpenLogin}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-1.5 hover:scale-[1.01] border border-slate-800"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Đăng nhập tài khoản cá nhân</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Thông tin thành tích & Năng lực */}
              <div className="border-t border-slate-100 pt-5 space-y-4 text-xs leading-relaxed text-slate-700">
                
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
                    <span>Năng lực thực chiến & Triết lý đào tạo</span>
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-slate-600">
                    {teacherProfile.achievements.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-2 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
                    <span>Quy chuẩn sát hạch & Đánh giá năng lực</span>
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-slate-600">
                    {teacherProfile.teachingStyle.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Slogan Banner */}
                <div className="p-3.5 rounded-2xl bg-slate-950 text-white border border-slate-800 text-center space-y-1">
                  <p className="text-[10px] uppercase font-bold text-amber-400 tracking-widest">RMSA • RUNNING MAN SALES ACADEMY</p>
                  <p className="text-xs font-serif italic text-slate-200">"Every Journey Leads Home"</p>
                </div>

                {/* Kênh hỗ trợ & Liên hệ */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    Kênh hỗ trợ đội ngũ & Ban Quản Trị
                  </h4>
                  
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hotline: <strong className="text-slate-900">{teacherProfile.contactInfo.hotline}</strong></span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-amber-600" />
                    <span>Email: <strong className="text-slate-900">{teacherProfile.contactInfo.email}</strong></span>
                  </div>

                  <div className="pt-1">
                    <a
                      href="#facebook"
                      onClick={(e) => { e.preventDefault(); onOpenLogin(); }}
                      className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/70 transition-all text-slate-800 font-semibold text-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        f
                      </div>
                      <span className="truncate">{teacherProfile.contactInfo.facebook}</span>
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* CỘT PHẢI (58% width): KHO CHUYÊN ĐỀ & 8 NHÓM NĂNG LỰC */}
          <div className="w-full lg:w-[58%] space-y-5">
            
            {/* Top Navigation Tabs */}
            <div className="flex items-center space-x-6 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('courses')}
                className={`pb-3 text-sm font-bold relative transition-colors cursor-pointer ${
                  activeTab === 'courses' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Kho bài phễu & Tài liệu ({trainingCourses.length})</span>
                {activeTab === 'courses' && (
                  <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-amber-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('roadmap')}
                className={`pb-3 text-sm font-bold relative transition-colors cursor-pointer ${
                  activeTab === 'roadmap' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>8 Nhóm năng lực môi giới</span>
                {activeTab === 'roadmap' && (
                  <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-amber-500 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('articles')}
                className={`pb-3 text-sm font-bold relative transition-colors cursor-pointer ${
                  activeTab === 'articles' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Kịch bản & Cẩm nang ({articlesList.length})</span>
                {activeTab === 'articles' && (
                  <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-amber-500 rounded-full" />
                )}
              </button>
            </div>

            {/* TAB 1: KHO BÀI PHỄU CỐT LÕI */}
            {activeTab === 'courses' && (
              <>
                {/* Notice banner về việc update bài học hàng tuần */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-3 text-xs text-amber-900">
                  <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Lộ trình học tập phễu thực chiến:</span> Các bài học phễu cơ bản đã sẵn sàng. Anh Rin đang trực tiếp biên soạn và cập nhật thêm bài học, video mới hàng tuần để đội ngũ học và áp dụng ngay ra thị trường.
                  </div>
                </div>

                {/* Category Filter Pills (MapStudy Style) */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      categoryFilter === 'all'
                        ? 'bg-slate-900 text-amber-400 shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Tất cả chuyên đề
                  </button>
                  <button
                    onClick={() => setCategoryFilter('group1_2')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      categoryFilter === 'group1_2'
                        ? 'bg-slate-900 text-amber-400 shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Nhóm 1 & 2: Sản phẩm & Nguồn hàng
                  </button>
                  <button
                    onClick={() => setCategoryFilter('group3_4')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      categoryFilter === 'group3_4'
                        ? 'bg-slate-900 text-amber-400 shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Nhóm 3 & 4: Tìm khách & Dẫn xem
                  </button>
                  <button
                    onClick={() => setCategoryFilter('group5')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      categoryFilter === 'group5'
                        ? 'bg-slate-900 text-amber-400 shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Nhóm 5: Đàm phán & Chốt cọc
                  </button>
                  <button
                    onClick={() => setCategoryFilter('group6_8')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      categoryFilter === 'group6_8'
                        ? 'bg-slate-900 text-amber-400 shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Nhóm 6: Quản lý phễu CRM
                  </button>
                  <button
                    onClick={() => setCategoryFilter('materials')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      categoryFilter === 'materials'
                        ? 'bg-slate-900 text-amber-400 shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Tài liệu & Kịch bản mẫu
                  </button>
                </div>

                {/* Courses Card Grid (MapStudy Style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                        <div className="p-3.5 space-y-1.5">
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
                            {course.instructor}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-3.5 pb-3 pt-1.5 flex items-center justify-between text-[11px] border-t border-slate-100">
                        <span className="flex items-center text-rose-500 font-semibold space-x-1">
                          <Heart className="w-3.5 h-3.5 fill-rose-500" />
                          <span>{course.reactions}</span>
                        </span>
                        <span className="text-amber-700 font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
                          <span>Vào học</span>
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>

                    </div>
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    Không tìm thấy nội dung đào tạo phù hợp với từ khóa "{searchQuery}".
                  </div>
                )}
              </>
            )}

            {/* TAB 2: LỘ TRÌNH 8 NHÓM NĂNG LỰC */}
            {activeTab === 'roadmap' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    Chuẩn Hóa 8 Nhóm Năng Lực Môi Giới Căn Hộ Cho Thuê
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lộ trình đào tạo toàn diện do Anh Rin xây dựng cho đội ngũ Running Man từ tạo nguồn hàng đến chốt cọc thực tế.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {competencyRoadmap.map((item) => (
                    <div 
                      key={item.groupNum}
                      onClick={onOpenLogin}
                      className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group flex items-start justify-between"
                    >
                      <div className="flex items-start space-x-3.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          item.status === 'active' 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {item.groupNum}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                              {item.title}
                            </h4>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              item.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <strong className="text-slate-800">Mục tiêu:</strong> {item.objective}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Trạng thái: {item.lessonsCount}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-3 text-slate-400 group-hover:text-amber-600 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: KỊCH BẢN & CẨM NANG THỰC CHIẾN */}
            {activeTab === 'articles' && (
              <div className="space-y-4">
                {articlesList.map((art) => (
                  <div 
                    key={art.id}
                    onClick={onOpenLogin}
                    className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                        {art.tag}
                      </span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                      <span>•</span>
                      <span>{art.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors mb-1.5">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {art.excerpt}
                    </p>
                    <div className="flex items-center text-xs font-bold text-amber-700">
                      <span>Đăng nhập để đọc trọn vẹn kịch bản</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </main>

      {/* 3. FOOTER MAPSTUDY CHUẨN */}
      <footer className="mt-16 bg-slate-950 text-slate-400 border-t border-slate-800 py-10 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <img 
              src="/images/running_man_logo.png" 
              alt="RUNNING MAN Logo" 
              className="h-7 w-auto object-contain mx-auto"
            />
          </div>
          <p className="font-bold text-slate-200">
            RMSA • Running Man Sales Academy (Giảng viên: Anh Rin)
          </p>
          <p className="text-[11px] text-slate-400">
            Học Viện Môi Giới Căn Hộ Cho Thuê Thực Chiến • 8 Nhóm Năng Lực • Every Journey Leads Home
          </p>
        </div>
      </footer>

    </div>
  );
}
