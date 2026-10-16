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
  Play
} from 'lucide-react';

export default function MapStudyTeacherPage({ onOpenLogin, onEnterApp }) {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'articles'
  const [gradeFilter, setGradeFilter] = useState('all'); // 'all' | '12' | '11' | '10' | 'book'
  const [searchQuery, setSearchQuery] = useState('');

  // Course list from Mapstudy Vũ Ngọc Anh API
  const teacherCourses = [
    {
      id: 382,
      title: 'BỒI DƯỠNG HSG VẬT LÍ CẤP TỈNH - LỚP 10, 11, 12',
      grade: 'all',
      gradeLabel: 'Bồi dưỡng HSG',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/o6yaebl03004/o6yaebl0301b1787228293377.jpg',
      teacher: 'Thầy Vũ Ngọc Anh',
      reactions: 142
    },
    {
      id: 367,
      title: 'KHÓA HỌC SÁCH LỚP VIP IMOE - MÔN VẬT LÍ',
      grade: '12',
      gradeLabel: 'Lớp 12',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/mfx6oik00qhm/khoa-hoc-sach-lop-vip-imoe-1783418056413.jpg',
      teacher: 'Thầy Vũ Ngọc Anh',
      reactions: 110
    },
    {
      id: 360,
      title: '2K11 XUẤT PHÁT SỚM MÔN VẬT LÍ - LỚP 10',
      grade: '10',
      gradeLabel: 'Lớp 10',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/lu31xqb0kk84/lu31xqb0kk991782096671747.png',
      teacher: 'Thầy Vũ Ngọc Anh',
      reactions: 424
    },
    {
      id: 349,
      title: '2K10 XUẤT PHÁT SỚM MÔN VẬT LÍ - LỚP 11',
      grade: '11',
      gradeLabel: 'Lớp 11',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/kgn857d0dqq7/kgn857d0dqrw1779107244889.jpg',
      teacher: 'Thầy Vũ Ngọc Anh',
      reactions: 405
    },
    {
      id: 308,
      title: 'KHOÁ I - CHUYÊN ĐỀ CƠ BẢN MÔN VẬT LÍ NĂM 2027',
      grade: '12',
      gradeLabel: 'Lớp 12',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/gddegbo002v3/khoa-i---chuyen-de-co-ban-mon-vat-li-nam-2027-1770202215204.png',
      teacher: 'Thầy Vũ Ngọc Anh',
      reactions: 581
    },
    {
      id: 307,
      title: 'KHOÁ M - VẬN DỤNG VÀ VẬN DỤNG CAO MÔN VẬT LÍ NĂM 2027',
      grade: '12',
      gradeLabel: 'Lớp 12',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/gdddygh002t0/khoa-m---van-dung-va-van-dung-cao-vat-li-nam-2027-1770202192050.png',
      teacher: 'Thầy Vũ Ngọc Anh',
      reactions: 97
    },
    {
      id: 306,
      title: 'KHOÁ O - THỰC CHIẾN LUYỆN ĐỀ MÔN VẬT LÍ NĂM 2027',
      grade: '12',
      gradeLabel: 'Lớp 12',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/gdddhc5002tv/khoa-o---thuc-chien-luyen-de-vat-li-nam-2027-1770202169862.png',
      teacher: 'Thầy Vũ Ngọc Anh',
      reactions: 42
    },
    {
      id: 305,
      title: 'KHÓA E - TỔNG ÔN TRỌNG ĐIỂM MÔN VẬT LÍ NĂM 2027',
      grade: '12',
      gradeLabel: 'Lớp 12',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/gddcss5002r3/khoa-e---tong-on-trong-diem-mon-vat-li-nam-2027-1770202138037.png',
      teacher: 'Thầy Vũ Ngọc Anh',
      reactions: 49
    },
    {
      id: 298,
      title: 'SÁCH MÔ HÌNH THÍ NGHIỆM VẬT LÍ 12',
      grade: 'book',
      gradeLabel: 'Sách MapBook',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/fiwu1q5032ow/sach-mo-hinh-thi-nghiem-vat-li-12-1768360404029.png',
      teacher: 'Thầy Vũ Ngọc Anh',
      reactions: 21
    },
    {
      id: 282,
      title: 'SÁCH TINH HOA LÍ THUYẾT VẬT LÍ 12',
      grade: 'book',
      gradeLabel: 'Sách MapBook',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/es7lr9k00eyn/sach-tinh-hoa-li-thuyet---vat-li-12-2026-1766745906249.jpg',
      teacher: 'Thầy Vũ Ngọc Anh',
      reactions: 52
    },
    {
      id: 268,
      title: 'SÁCH 50 ĐỀ MINH HỌA MÔN VẬT LÍ',
      grade: 'book',
      gradeLabel: 'Sách MapBook',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/e3fer980707h/sach-50-de-minh-hoa---mon-vat-li-1765247362173.jpg',
      teacher: 'Thầy Vũ Ngọc Anh, Thầy Nguyễn Trọng Đạt',
      reactions: 164
    },
    {
      id: 239,
      title: 'SÁCH PHONG TOẢ VẬT LÍ 12 - VẬT LÍ NHIỆT',
      grade: 'book',
      gradeLabel: 'Sách MapBook',
      thumb: 'https://mapstudy.sgp1.digitaloceanspaces.com/course/82nyhxn009h9/sach-phong-toa-vat-li-12---vat-li-nhiet-1752140559947.png',
      teacher: 'Thầy Vũ Ngọc Anh',
      reactions: 22
    }
  ];

  const filteredCourses = teacherCourses.filter(course => {
    const matchGrade = gradeFilter === 'all' || course.grade === gradeFilter;
    const matchQuery = !searchQuery || course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      
      {/* 1. MAPSTUDY TOP NAVBAR (Chuẩn 56px, blur effect, trắng trong suốt) */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Left: Brand Logo & Search Bar */}
            <div className="flex items-center space-x-4">
              <a href="#home" className="flex items-center space-x-2 select-none">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1c7fe0] to-[#0789E8] flex items-center justify-center text-white font-black text-lg shadow-sm">
                  M
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-tight text-[#1a4f8c]">Mapstudy.vn</span>
                  <span className="text-[9px] font-semibold text-slate-400 -mt-1 hidden sm:block">Định vị tri thức</span>
                </div>
              </a>

              {/* Search Pill */}
              <div className="relative hidden md:block w-48 lg:w-60">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khóa học..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[rgba(26,79,140,0.06)] hover:bg-[rgba(26,79,140,0.09)] focus:bg-white rounded-full text-slate-700 placeholder-slate-400 border border-transparent focus:border-[#1c7fe0] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Middle: Icon Nav Links (MapStudy style) */}
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
                className="px-4 py-2 rounded-lg text-[#1c7fe0] bg-blue-50/60 font-bold flex items-center space-x-1.5 text-xs cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Khóa học</span>
              </button>

              <button 
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-lg text-slate-600 hover:text-[#1c7fe0] hover:bg-blue-50/50 transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Thi online</span>
              </button>

              <button 
                onClick={() => setActiveTab('articles')}
                className="px-4 py-2 rounded-lg text-slate-600 hover:text-[#1c7fe0] hover:bg-blue-50/50 transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
              >
                <Newspaper className="w-4 h-4" />
                <span>Tài liệu & Tin tức</span>
              </button>
            </nav>

            {/* Right: Auth Action Tools */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={onOpenLogin}
                className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-slate-500" />
                <span>Kích hoạt thẻ</span>
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
                className="px-5 py-2 rounded-xl bg-[#1c7fe0] hover:bg-[#1569bd] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
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
          
          {/* CỘT TRÁI (42% width): HỒ SƠ GIẢNG VIÊN VŨ NGỌC ANH */}
          <div className="w-full lg:w-[42%] lg:sticky lg:top-20">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
              
              {/* Header profile */}
              <div className="flex gap-5 items-start">
                <img 
                  src="https://mapstudy.sgp1.digitaloceanspaces.com/teacher/64b229b5d0a652b97e5ab22d/thay-vu-ngoc-anh-1756368275424.jpg" 
                  alt="Thầy Vũ Ngọc Anh" 
                  className="w-32 h-32 rounded-2xl object-cover shadow-sm shrink-0 border border-slate-100"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="inline-block rounded-full px-3 py-1 text-xs font-black uppercase text-[#0789E8] bg-gradient-to-r from-[#EAEBFF] to-[#D3F4FF]">
                    Giáo viên
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    Thầy Vũ Ngọc Anh
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Giáo viên Vật lý THPT • Mapstudy
                  </p>
                  
                  {/* CTA Đăng nhập vào học */}
                  <div className="pt-2">
                    <button
                      onClick={onOpenLogin}
                      className="w-full py-2 px-3 rounded-xl bg-[#1c7fe0] hover:bg-[#1569bd] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Đăng nhập để vào học</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Thông tin thành tích */}
              <div className="border-t border-slate-100 pt-5 space-y-4 text-xs leading-relaxed text-slate-700">
                
                <div>
                  <h3 className="text-sm font-black text-rose-600 mb-2 flex items-center">
                    <span>Thông tin thầy Vũ Ngọc Anh</span>
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-slate-600">
                    <li>
                      <strong className="text-slate-800">Thủ khoa đầu vào</strong> viện Vật lý - Đại học Bách Khoa Hà Nội.
                    </li>
                    <li>
                      <strong className="text-slate-800">8 năm kinh nghiệm</strong> giảng dạy môn Vật Lý ôn thi Đại học. Có <strong className="text-rose-600">19 điểm 10</strong> Lý trong kỳ thi THPTQG 2022, 1 học sinh Thủ khoa khối A01 toàn quốc.
                    </li>
                    <li>
                      Có <strong className="text-rose-600">11 điểm 10 Lý</strong> trong kỳ thi THPTQG 2023, <strong className="text-slate-900">2 học sinh Thủ khoa</strong> khối A00 toàn quốc; <strong className="text-slate-900">2 học sinh Á khoa</strong> khối A00 toàn quốc; <strong className="text-slate-900">8 học sinh Thủ khoa</strong> tỉnh/ thành phố; <strong className="text-slate-900">69 học sinh Thủ khoa</strong> trường.
                    </li>
                    <li>
                      <strong className="text-slate-900">18 học sinh</strong> đạt điểm 10 vật lý (trên tổng số 55 điểm 10 toàn quốc), 100 học sinh đạt 9.75 điểm, 291 học sinh đạt 9.5 điểm và 1740 học sinh đạt điểm 9+.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-black text-rose-600 mb-2">
                    Phong cách giảng dạy
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-slate-600">
                    <li>
                      Cách dạy mới mẻ, không máy móc, đem những công thức Vật Lý khô khan khó hiểu thành những hiện tượng đời sống lý thú, tạo niềm đam mê cho các học sinh.
                    </li>
                    <li>
                      Đi sâu vào bản chất, khai thác tối đa những bài toán đồ thị, tập trung vào các bài toán mức độ Vận Dụng - Vận Dụng Cao.
                    </li>
                  </ul>
                </div>

                {/* Liên kết mạng xã hội */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">
                    Liên kết mạng xã hội
                  </h4>
                  <a
                    href="https://www.facebook.com/thayhintavungocanh/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 transition-all text-[#1c7fe0] font-semibold text-xs"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      f
                    </div>
                    <span className="truncate">Thầy Vũ Ngọc Anh - chuyên luyện thi Vật Lý lớp 10,11,12</span>
                  </a>
                </div>

              </div>

            </div>
          </div>

          {/* CỘT PHẢI (58% width): DANH SÁCH KHÓA HỌC & BÀI VIẾT */}
          <div className="w-full lg:w-[58%] space-y-5">
            
            {/* Top Navigation Tabs */}
            <div className="flex items-center space-x-6 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('courses')}
                className={`pb-3 text-sm font-bold relative transition-colors cursor-pointer ${
                  activeTab === 'courses' ? 'text-[#1c7fe0]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Khóa học</span>
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
                <span>Bài viết & Tài liệu</span>
                {activeTab === 'articles' && (
                  <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1c7fe0] rounded-full" />
                )}
              </button>
            </div>

            {/* Grade Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setGradeFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  gradeFilter === 'all'
                    ? 'bg-[#1c7fe0] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Tất cả ({teacherCourses.length})
              </button>
              <button
                onClick={() => setGradeFilter('12')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  gradeFilter === '12'
                    ? 'bg-[#1c7fe0] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Lớp 12
              </button>
              <button
                onClick={() => setGradeFilter('11')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  gradeFilter === '11'
                    ? 'bg-[#1c7fe0] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Lớp 11
              </button>
              <button
                onClick={() => setGradeFilter('10')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  gradeFilter === '10'
                    ? 'bg-[#1c7fe0] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Lớp 10
              </button>
              <button
                onClick={() => setGradeFilter('book')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  gradeFilter === 'book'
                    ? 'bg-[#1c7fe0] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Sách MapBook
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
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      <img 
                        src={course.thumb} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                        {course.gradeLabel}
                      </span>
                    </div>

                    {/* Course Info */}
                    <div className="p-3.5 space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1c7fe0] transition-colors line-clamp-2 leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {course.teacher}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-3.5 pb-3 pt-1 flex items-center justify-between text-[11px] border-t border-slate-100">
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
                Không tìm thấy khóa học nào phù hợp với tìm kiếm của bạn.
              </div>
            )}

          </div>

        </div>
      </main>

      {/* 3. FOOTER MAPSTUDY */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-700">
            Mapstudy.edu.vn - Định vị tri thức - dẫn lối tư duy
          </p>
          <p className="text-[11px] text-slate-400">
            Hệ sinh thái giáo dục trực tuyến hàng đầu • Khóa học & Luyện thi THPT Quốc Gia
          </p>
        </div>
      </footer>

    </div>
  );
}
