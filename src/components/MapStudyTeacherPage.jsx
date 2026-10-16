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
  Zap
} from 'lucide-react';

export default function MapStudyTeacherPage({ onOpenLogin, onEnterApp }) {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'articles'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'foundation' | 'negotiation' | 'closing' | 'materials'
  const [searchQuery, setSearchQuery] = useState('');

  // Thông tin chuyên gia / Đơn vị đào tạo (Thiết kế chuẩn MapStudy nhưng gắn nội dung doanh nghiệp của bạn)
  const teacherProfile = {
    name: 'Chuyên Gia Huấn Luyện B2B',
    title: 'Trưởng Ban Đào Tạo & Phát Triển Năng Lực Bán Hàng RIN Academy',
    badge: 'GIẢNG VIÊN THỰC CHIẾN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    achievements: [
      '10+ năm kinh nghiệm trực tiếp huấn luyện và xây dựng đội ngũ kinh doanh B2B thực chiến.',
      'Đã đào tạo hơn 1,500+ nhân sự bán hàng, nâng tỷ lệ chốt deal thực tế tăng trung bình 38%.',
      'Đóng gói bộ cẩm nang độc quyền "Bẻ gãy 50 lời từ chối giá kinh điển trong giao dịch doanh nghiệp".',
      'Xây dựng lộ trình chuẩn hóa 3 chặng: Khơi gợi nhu cầu ➔ Bẻ gãy từ chối ➔ Chốt hợp đồng lớn.'
    ],
    teachingStyle: [
      'Phương pháp thực chiến 100%, nói không với lý thuyết sáo rỗng. Mô phỏng trực tiếp tình huống đối đáp khách hàng thực tế.',
      'Sát hạch năng lực tự động theo chuẩn phòng thi ảo, phản xạ bấm giờ từng giây, đạt chuẩn ≥ 80% mới cấp chứng nhận hoàn thành.'
    ],
    contactInfo: {
      hotline: '1900 6868',
      email: 'daotao@rinacademy.vn',
      facebook: 'RIN Sales Academy - Học Viện Đào Tạo Kỹ Năng Bán Hàng'
    }
  };

  // Danh sách các khóa học / chuyên đề đào tạo (Thiết kế thẻ chuẩn MapStudy)
  const trainingCourses = [
    {
      id: 1,
      code: 'RIN-01',
      title: 'RIN-01: TIẾP CẬN & KHƠI GỢI NHU CẦU ẨN KHÁCH HÀNG B2B',
      category: 'foundation',
      categoryLabel: 'Chặng 1 • Nền Tảng',
      thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
      duration: '12 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: teacherProfile.name,
      reactions: 342
    },
    {
      id: 2,
      code: 'RIN-02',
      title: 'RIN-02: BẺ GÃY LỜI TỪ CHỐI & NGHỆ THUẬT ĐÀM PHÁN GIÁ',
      category: 'negotiation',
      categoryLabel: 'Chặng 2 • Thực Chiến',
      thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      duration: '15 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: teacherProfile.name,
      reactions: 428
    },
    {
      id: 3,
      code: 'RIN-03',
      title: 'RIN-03: KỸ THUẬT CHỐT DEAL GIẢ ĐỊNH & UP-SELL HỢP ĐỒNG LỚN',
      category: 'closing',
      categoryLabel: 'Chặng 3 • Bứt Phá',
      thumb: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
      duration: '18 phút',
      quizCount: '5 câu',
      passingScore: '≥ 80%',
      instructor: teacherProfile.name,
      reactions: 512
    },
    {
      id: 4,
      code: 'RIN-DOC-01',
      title: 'CẨM NANG BỎ TÚI: 50 CÂU ĐỐI ĐÁP BẺ GÃY TỪ CHỐI GIÁ B2B',
      category: 'materials',
      categoryLabel: 'Tài Liệu Đính Kèm',
      thumb: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      duration: 'Ebook PDF',
      quizCount: 'Tra cứu nhanh',
      passingScore: 'Miễn phí',
      instructor: 'Ban Học Liệu RIN',
      reactions: 620
    },
    {
      id: 5,
      code: 'RIN-DOC-02',
      title: 'MẪU HỢP ĐỒNG PHÂN PHỐI & PHỤ LỤC CAM KẾT DOANH SỐ CHUẨN',
      category: 'materials',
      categoryLabel: 'Mẫu Hợp Đồng',
      thumb: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
      duration: 'File Word/PDF',
      quizCount: 'Tải trực tiếp',
      passingScore: 'Miễn phí',
      instructor: 'Ban Pháp Chế RIN',
      reactions: 295
    },
    {
      id: 6,
      code: 'RIN-ARENA',
      title: 'KỲ THI SÁT HẠCH TOÀN DIỆN: 15 CÂU HỎI TÌNH HUỐNG SALES MASTER',
      category: 'closing',
      categoryLabel: 'Phòng Thi Ảo',
      thumb: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
      duration: '15 phút',
      quizCount: '15 câu',
      passingScore: '≥ 80%',
      instructor: 'Hội Đồng Khảo Sát RIN',
      reactions: 745
    }
  ];

  const filteredCourses = trainingCourses.filter(course => {
    const matchCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchQuery = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      
      {/* 1. TOP NAVBAR (Chuẩn MapStudy: 56px, nền trắng mờ trong suốt, menu icon ở giữa, Đăng nhập bên phải) */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Left: Brand Logo & Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2.5 select-none cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1c7fe0] to-[#0789E8] flex items-center justify-center text-white font-black text-lg shadow-sm">
                  R
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-tight text-[#1a4f8c]">RIN ACADEMY</span>
                  <span className="text-[9px] font-semibold text-slate-400 -mt-1 hidden sm:block">Đào tạo bán hàng B2B thực chiến</span>
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
                  placeholder="Tra cứu chuyên đề (vd: RIN-01)..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[rgba(26,79,140,0.06)] hover:bg-[rgba(26,79,140,0.09)] focus:bg-white rounded-full text-slate-700 placeholder-slate-400 border border-transparent focus:border-[#1c7fe0] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Middle: MapStudy Style Central Icons */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button 
                onClick={() => setActiveTab('courses')}
                className="px-4 py-2 rounded-lg text-slate-600 hover:text-[#1c7fe0] hover:bg-blue-50/50 transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
              </button>

              <button 
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-1.5 text-xs cursor-pointer ${
                  activeTab === 'courses' ? 'text-[#1c7fe0] bg-blue-50/60' : 'text-slate-600 hover:text-[#1c7fe0]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Khóa đào tạo</span>
              </button>

              <button 
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-lg text-slate-600 hover:text-[#1c7fe0] hover:bg-blue-50/50 transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Phòng thi sát hạch</span>
              </button>

              <button 
                onClick={() => setActiveTab('articles')}
                className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-1.5 text-xs cursor-pointer ${
                  activeTab === 'articles' ? 'text-[#1c7fe0] bg-blue-50/60' : 'text-slate-600 hover:text-[#1c7fe0]'
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
                className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-slate-500" />
                <span>Kích hoạt mã</span>
              </button>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              <button 
                onClick={onOpenLogin}
                className="text-xs font-bold text-slate-700 hover:text-[#1c7fe0] cursor-pointer"
              >
                Đăng ký
              </button>

              <button
                onClick={onOpenLogin}
                className="px-5 py-2 rounded-xl bg-[#1c7fe0] hover:bg-[#1569bd] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 hover:scale-[1.02]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. MAIN 2-COLUMN LAYOUT (Chuẩn MapStudy: 42% Trái - 58% Phải) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* CỘT TRÁI (42% width): HỒ SƠ GIẢNG VIÊN / BAN ĐÀO TẠO */}
          <div className="w-full lg:w-[42%] lg:sticky lg:top-20">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
              
              {/* Header profile */}
              <div className="flex gap-5 items-start">
                <div className="relative shrink-0">
                  <img 
                    src={teacherProfile.avatar} 
                    alt={teacherProfile.name} 
                    className="w-32 h-32 rounded-2xl object-cover shadow-sm border border-slate-100"
                  />
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Trạng thái: Đang hoạt động">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="inline-block rounded-full px-3 py-1 text-[11px] font-black uppercase text-[#0789E8] bg-gradient-to-r from-[#EAEBFF] to-[#D3F4FF]">
                    {teacherProfile.badge}
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                    {teacherProfile.name}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2">
                    {teacherProfile.title}
                  </p>
                  
                  {/* CTA Đăng nhập vào học */}
                  <div className="pt-2">
                    <button
                      onClick={onOpenLogin}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#1c7fe0] hover:bg-[#1569bd] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-1.5 hover:scale-[1.01]"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Đăng nhập để vào học ngay</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Thông tin thành tích & Năng lực */}
              <div className="border-t border-slate-100 pt-5 space-y-4 text-xs leading-relaxed text-slate-700">
                
                <div>
                  <h3 className="text-sm font-black text-[#1c7fe0] mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
                    <span>Năng lực & Thành tích huấn luyện</span>
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
                  <h3 className="text-sm font-black text-[#1c7fe0] mb-2 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
                    <span>Phương pháp đào tạo thực chiến</span>
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-slate-600">
                    {teacherProfile.teachingStyle.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kênh hỗ trợ & Liên hệ */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    Kênh hỗ trợ nhân viên & Doanh nghiệp
                  </h4>
                  
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-[#1c7fe0]" />
                    <span>Hotline: <strong className="text-slate-900">{teacherProfile.contactInfo.hotline}</strong></span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-[#1c7fe0]" />
                    <span>Email: <strong className="text-slate-900">{teacherProfile.contactInfo.email}</strong></span>
                  </div>

                  <div className="pt-1">
                    <a
                      href="#facebook"
                      onClick={(e) => { e.preventDefault(); onOpenLogin(); }}
                      className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 transition-all text-[#1c7fe0] font-semibold text-xs"
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

          {/* CỘT PHẢI (58% width): KHO CHUYÊN ĐỀ & BÀI GIẢNG SÁT HẠCH */}
          <div className="w-full lg:w-[58%] space-y-5">
            
            {/* Top Navigation Tabs */}
            <div className="flex items-center space-x-6 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('courses')}
                className={`pb-3 text-sm font-bold relative transition-colors cursor-pointer ${
                  activeTab === 'courses' ? 'text-[#1c7fe0]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Chương trình đào tạo ({trainingCourses.length})</span>
                {activeTab === 'courses' && (
                  <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1c7fe0] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('articles')}
                className={`pb-3 text-sm font-bold relative transition-colors cursor-pointer ${
                  activeTab === 'articles' ? 'text-[#1c7fe0]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Kịch bản & Cẩm nang mẫu</span>
                {activeTab === 'articles' && (
                  <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1c7fe0] rounded-full" />
                )}
              </button>
            </div>

            {/* Category Filter Pills (MapStudy Style) */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-[#1c7fe0] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Tất cả chuyên đề
              </button>
              <button
                onClick={() => setCategoryFilter('foundation')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === 'foundation'
                    ? 'bg-[#1c7fe0] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Nền tảng tiếp cận
              </button>
              <button
                onClick={() => setCategoryFilter('negotiation')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === 'negotiation'
                    ? 'bg-[#1c7fe0] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Bẻ gãy từ chối giá
              </button>
              <button
                onClick={() => setCategoryFilter('closing')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === 'closing'
                    ? 'bg-[#1c7fe0] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Chốt hợp đồng & Sát hạch
              </button>
              <button
                onClick={() => setCategoryFilter('materials')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === 'materials'
                    ? 'bg-[#1c7fe0] text-white shadow-2xs'
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
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#1c7fe0] transition-all cursor-pointer group flex flex-col justify-between"
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
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-[#1c7fe0]">
                          {course.code}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {course.quizCount} • Chuẩn: {course.passingScore}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1c7fe0] transition-colors line-clamp-2 leading-snug">
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
                    <span className="text-[#1c7fe0] font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
                      <span>Vào học</span>
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>

                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                Không tìm thấy nội dung đào tạo phù hợp.
              </div>
            )}

          </div>

        </div>
      </main>

      {/* 3. FOOTER MAPSTUDY CHUẨN */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-700">
            RIN Academy • Hệ Thống Đào Tạo Kỹ Năng Bán Hàng & Khảo Sát Năng Lực Doanh Nghiệp
          </p>
          <p className="text-[11px] text-slate-400">
            Giao diện chuẩn MapStudy • Tự động hóa lộ trình đào tạo nhân sự B2B
          </p>
        </div>
      </footer>

    </div>
  );
}
