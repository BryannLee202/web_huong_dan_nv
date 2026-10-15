import React from 'react';
import { 
  GraduationCap, 
  PlayCircle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  FileCheck2, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Star, 
  BookOpen, 
  Lock, 
  Upload, 
  ChevronRight,
  Target,
  Zap,
  Clock,
  Timer
} from 'lucide-react';

export default function LandingPage({ 
  onEnterLMS, 
  onOpenPracticeTest,
  onSelectCourse, 
  courses = [] 
}) {
  return (
    <div className="bg-white text-slate-800 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/40 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-[#007c5d] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#007c5d]" />
                <span>NỀN TẢNG ĐÀO TẠO & KHẢO SÁT BÁN HÀNG DOANH NGHIỆP</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Đào tạo nhân sự bán hàng <br className="hidden sm:inline" />
                <span className="text-[#007c5d]">thực chiến & tự động hóa</span> thi sát hạch
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Đóng gói bài giảng video chuẩn HD, thiết lập lộ trình học tuần tự thông minh: 
                <strong className="text-slate-800 font-semibold"> Bắt buộc hoàn thành video và đạt $\ge$ 80% điểm bài test trắc nghiệm </strong> 
                mới được mở khóa bài tiếp theo. Giúp nhân viên nắm vững kịch bản và bứt phá doanh số.
              </p>

              {/* Action Buttons (Duolingo Style: Quick Practice Test + Full Course) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={onOpenPracticeTest}
                  className="px-7 py-3.5 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white font-bold text-sm flex items-center justify-center space-x-2.5 shadow-md shadow-emerald-900/10 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Thi thử phản xạ 3 phút (Miễn phí)</span>
                </button>

                <button
                  onClick={onEnterLMS}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-[#007c5d]" />
                  <span>Vào phòng học chính thức</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007c5d]" />
                  <span>Khóa bài tuần tự chuẩn 80%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007c5d]" />
                  <span>Upload video máy tính & YouTube</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007c5d]" />
                  <span>SQLite Database bền bỉ 100%</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Course Player Preview Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-3 transition-transform hover:-translate-y-1 duration-300">
                
                {/* Top Mockup Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[11px] font-bold text-slate-500 ml-2">Phòng Học RIN LMS • Giao diện 2 Cột</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#007c5d]">
                    Live Demo
                  </span>
                </div>

                {/* Mockup Video Area */}
                <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center text-white mb-3">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-[#007c5d] text-white flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <PlayCircle className="w-7 h-7" />
                    </div>
                    <p className="text-xs font-semibold text-slate-200">Video Kịch Bản Xử Lý Từ Chối</p>
                    <span className="text-[10px] text-slate-400">Tốc độ: 1x, 1.25x, 1.5x, 2x</span>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-white font-mono">
                    1080p HD
                  </span>
                </div>

                {/* Mockup Quiz Card */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Câu hỏi sát hạch #1</span>
                    <span className="text-[10px] font-bold text-[#007c5d] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Yêu cầu: ≥ 80%
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    Khách hàng chê "Giá bên em đắt hơn bên B", câu phản hồi nào chốt sale hiệu quả nhất?
                  </p>
                  <div className="space-y-1">
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-[11px] font-medium text-emerald-900 flex items-center justify-between">
                      <span>B. Đồng cảm, phân tích giá trị và cam kết bảo hành lâu dài</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#007c5d]" />
                    </div>
                  </div>
                </div>

                {/* CTA inside Mockup */}
                <button
                  onClick={onEnterLMS}
                  className="w-full mt-3 py-2 rounded-xl bg-[#007c5d] text-white text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs hover:bg-[#00634a]"
                >
                  <span>Mở phòng học thực tế</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DUOLINGO STYLE: 3-STEP LEARNING JOURNEY */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#007c5d] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              QUY TRÌNH TINH GỌN
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              3 bước đào tạo nhân viên bán hàng chuẩn mực
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hệ thống hóa toàn bộ tri thức doanh nghiệp theo lộ trình tuần tự rõ ràng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative text-left">
              <span className="w-8 h-8 rounded-xl bg-[#007c5d] text-white font-black text-sm flex items-center justify-center mb-4 shadow-xs">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Xem Video Kịch Bản Thực Chiến</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nhân viên theo dõi bài giảng đóng gói 10 - 15 phút. Có tóm tắt các nguyên tắc cốt lõi để ôn tập nhanh.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative text-left">
              <span className="w-8 h-8 rounded-xl bg-[#007c5d] text-white font-black text-sm flex items-center justify-center mb-4 shadow-xs">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Vượt Qua Bài Sát Hạch (≥ 80%)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Làm bài trắc nghiệm tình huống thực tế. Tự động chấm điểm, chỉ ra câu sai và giải thích cặn kẽ để mở khóa bài tiếp theo.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative text-left">
              <span className="w-8 h-8 rounded-xl bg-[#007c5d] text-white font-black text-sm flex items-center justify-center mb-4 shadow-xs">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Cấp Chứng Nhận Có Mã Xác Thực</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Khi hoàn thành 100% lộ trình, hệ thống tự động xuất chứng chỉ tốt nghiệp kèm mã định danh lưu vào hồ sơ nhân sự.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KEY CORE CAPABILITIES (TALENTLMS FEATURES) */}
      <section className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#007c5d] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              TÍNH NĂNG ĐẮT GIÁ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
              Mọi công cụ cần thiết để xây dựng đội ngũ bán hàng vô địch
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Hệ thống được thiết kế theo quy chuẩn quốc tế của TalentLMS, lược bỏ mọi sự rườm rà và tối đa hóa hiệu quả tiếp thu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#007c5d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#007c5d] flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Khóa Bài Học Tuần Tự (Sequencing)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ngăn chặn việc nhân viên tua video hay nhảy cóc bài. Bắt buộc hoàn thành bài 1 và làm bài kiểm tra trắc nghiệm đạt từ 80% trở lên mới mở khóa bài 2.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#007c5d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#007c5d] flex items-center justify-center mb-4">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Upload Video Dễ Dàng Bất Cứ Lúc Nào</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kéo thả file video trực tiếp từ máy tính lên hệ thống (lưu trữ SQLite) hoặc dán link YouTube (chế độ không công khai) để xem Full HD hoàn toàn miễn phí.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#007c5d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#007c5d] flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Quiz Engine Tự Động Chấm Điểm</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chấm điểm tức thì ngay khi bấm nộp bài. Báo rõ câu nào đúng, câu nào sai và giải thích cặn kẽ nguyên nhân vì sao chọn đáp án đó.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#007c5d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#007c5d] flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Sổ Tay Kịch Bản Bỏ Túi (Cheatsheet)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nút mở nhanh bảng kịch bản xử lý từ chối giá, so sánh đối thủ và các câu chốt đơn vàng để nhân viên tra cứu ngay trong lúc tư vấn khách hàng.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#007c5d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#007c5d] flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Chứng Nhận Tốt Nghiệp Khóa Học</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tự động cấp bằng chứng nhận hoàn thành khi nhân viên đỗ toàn bộ các bài thi, có thể in ấn hoặc lưu file PDF để nộp báo cáo cho Ban Giám Đốc.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#007c5d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#007c5d] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Cơ Sở Dữ Liệu SQLite Bền Vững</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cơ sở dữ liệu chạy nhúng trong máy chủ nội bộ với tính năng Sao lưu (Backup) và Khôi phục 1-Click, chống mất mát dữ liệu và bàn giao cực kỳ an tâm.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. COURSE CATALOG PREVIEW SECTION */}
      <section id="kho-khoa-hoc" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-[#007c5d] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                CHƯƠNG TRÌNH ĐÀO TẠO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
                Kho chuyên đề đào tạo bán hàng thực tế
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Các chuyên đề được đóng gói tuần tự, kết hợp video hướng dẫn và bộ đề thi trắc nghiệm tình huống.
              </p>
            </div>

            <button
              onClick={onEnterLMS}
              className="px-5 py-2.5 rounded-xl bg-[#007c5d] hover:bg-[#00634a] text-white text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
            >
              <span>Vào học ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#007c5d] hover:shadow-md transition-all flex flex-col"
              >
                <div className="h-44 bg-gradient-to-tr from-slate-900 to-slate-800 p-5 flex flex-col justify-between text-white relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                      Chuyên đề {idx + 1}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-300 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {course.duration || '15 phút'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-emerald-400 block mb-1">
                      {course.category}
                    </span>
                    <h4 className="text-sm font-bold leading-snug line-clamp-2">
                      {course.title}
                    </h4>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Số câu hỏi trắc nghiệm:</span>
                      <strong className="text-slate-800">{course.quiz?.length || 5} câu</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Chuẩn điểm mở khóa:</span>
                      <strong className="text-[#007c5d] font-bold">{course.passingScore || 80}%</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCourse(course.id)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#007c5d] hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Xem bài học & Làm bài test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="py-16 bg-[#007c5d] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Sẵn sàng nâng cấp năng lực cho đội ngũ bán hàng của bạn?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Hệ thống đào tạo toàn diện, trực quan, dễ sử dụng cho mọi nhân viên và quản lý. 
            Khởi chạy 1-Click trên máy tính hoặc đưa lên mạng với tên miền miễn phí.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenPracticeTest}
              className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-lg transition-all cursor-pointer hover:scale-105"
            >
              Thi thử phản xạ 3 phút ngay
            </button>
            <button
              onClick={onEnterLMS}
              className="px-8 py-3.5 rounded-xl bg-white text-[#007c5d] hover:bg-emerald-50 font-extrabold text-sm shadow-lg transition-all cursor-pointer hover:scale-105"
            >
              Vào phòng học chính thức ➔
            </button>
          </div>
        </div>
      </section>

      {/* 6. CLEAN FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <GraduationCap className="w-5 h-5 text-[#007c5d]" />
            <span>RIN Sales Academy • TalentLMS Edition</span>
          </div>
          <p className="text-slate-500">
            © 2026 RIN Academy. Giải pháp đào tạo kỹ năng bán hàng thực chiến và khảo sát năng lực doanh nghiệp.
          </p>
          <div className="flex items-center space-x-4">
            <button onClick={onOpenPracticeTest} className="hover:text-white transition-colors cursor-pointer">
              Thi thử
            </button>
            <button onClick={onEnterLMS} className="hover:text-white transition-colors cursor-pointer">
              Cổng đào tạo
            </button>
            <a href="https://github.com/BryannLee202/web_huong_dan_nv" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub Repo
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
