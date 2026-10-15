import React, { useState } from 'react';
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
  Timer,
  Search,
  Trophy,
  Flame,
  Radio,
  Briefcase,
  HelpCircle,
  Check
} from 'lucide-react';

export default function LandingPage({ 
  onEnterLMS, 
  onOpenPracticeTest,
  onOpenCheatsheet,
  onOpenLeaderboard,
  onSelectCourse, 
  courses = [] 
}) {
  const [idSearchQuery, setIdSearchQuery] = useState('');
  const [searchFeedback, setSearchFeedback] = useState('');

  const handleIdSearch = (e) => {
    e.preventDefault();
    const query = idSearchQuery.trim().toLowerCase();
    if (!query) return;

    // Check if matching RIN-ID (e.g. rin-01, rin-1, bai-1, chot don, gia)
    const match = courses.find(c => 
      c.id.toLowerCase().includes(query) ||
      c.title.toLowerCase().includes(query) ||
      (query === 'rin-01' && c.id === 'bai-1') ||
      (query === 'rin-02' && c.id === 'bai-2') ||
      (query === 'rin-03' && c.id === 'bai-3')
    );

    if (match) {
      setSearchFeedback(`✅ Tìm thấy chuyên đề: "${match.title}"! Đang chuyển hướng...`);
      setTimeout(() => {
        onSelectCourse(match.id);
      }, 600);
    } else {
      setSearchFeedback(`⚠️ Không tìm thấy mã "${idSearchQuery}". Thử nhập: RIN-01, RIN-02 hoặc từ khóa "từ chối", "chốt đơn".`);
    }
  };

  return (
    <div className="bg-white text-slate-800 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-emerald-50/40 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-[#007c5d] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#007c5d]" />
                <span>HỆ SINH THÁI ĐÀO TẠO & KHẢO SÁT BÁN HÀNG DOANH NGHIỆP</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Đào tạo nhân sự bán hàng <br className="hidden sm:inline" />
                <span className="text-[#007c5d]">thực chiến & tự động hóa</span> thi sát hạch
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Đóng gói bài giảng video chuẩn HD, phòng thi ảo bấm giờ thực chiến theo chuẩn Moon.vn, 
                thiết lập lộ trình học tuần tự thông minh: 
                <strong className="text-slate-800 font-semibold"> Bắt buộc hoàn thành video và đạt $\ge$ 80% điểm bài test trắc nghiệm </strong> 
                mới được mở khóa bài tiếp theo.
              </p>

              {/* Action Buttons */}
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
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007c5d]" />
                  <span>Khóa bài tuần tự chuẩn 80%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007c5d]" />
                  <span>Tra mã tình huống Sales ID</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007c5d]" />
                  <span>Phòng thi ảo bấm giờ sát hạch</span>
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

      {/* 2. MOON.VN STYLE: QUICK ACCESS BAR (LỐI TẮT THẦN TỐC) */}
      <section className="bg-slate-50/80 border-b border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Quick 1: Thi Thử 3 Phút */}
            <button
              onClick={onOpenPracticeTest}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#007c5d] hover:shadow-md transition-all flex items-center space-x-3.5 text-left cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 transition-colors">
                <Zap className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Test Nhanh</span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#007c5d] transition-colors">Thi Thử Phản Xạ 3'</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">3 tình huống chấm điểm ngay</p>
              </div>
            </button>

            {/* Quick 2: Tra Cứu Mã Sales ID */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-center text-left">
              <span className="text-[10px] font-black uppercase text-[#007c5d] tracking-wider mb-1">Mã Tình Huống</span>
              <form onSubmit={handleIdSearch} className="flex items-center space-x-1.5">
                <input
                  type="text"
                  placeholder="Nhập ID (vd: RIN-01)"
                  value={idSearchQuery}
                  onChange={e => setIdSearchQuery(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007c5d]"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-[#007c5d] hover:bg-[#00634a] text-white shrink-0 cursor-pointer"
                  title="Tìm kiếm tình huống"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Quick 3: Bảng Vàng Salesman */}
            <button
              onClick={onOpenLeaderboard}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#007c5d] hover:shadow-md transition-all flex items-center space-x-3.5 text-left cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 text-[#007c5d] flex items-center justify-center shrink-0 transition-colors">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-[#007c5d] tracking-wider">Thứ Hạng</span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#007c5d] transition-colors">Bảng Vàng Salesman</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">Top điểm số tuần & tháng</p>
              </div>
            </button>

            {/* Quick 4: Sổ Tay Kịch Bản Chốt Đơn */}
            <button
              onClick={onOpenCheatsheet}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#007c5d] hover:shadow-md transition-all flex items-center space-x-3.5 text-left cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Kịch Bản Nhanh</span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#007c5d] transition-colors">Sổ Tay Phản Xạ</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">Script đối đáp khách hàng</p>
              </div>
            </button>

          </div>

          {searchFeedback && (
            <div className="mt-3 text-xs font-medium text-slate-700 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-xl">
              {searchFeedback}
            </div>
          )}
        </div>
      </section>

      {/* 3. MOON.VN STYLE: PHÒNG THI THỰC CHIẾN ĐANG MỞ (LIVE SALES ARENA) */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-xl">
            
            {/* Background glowing sphere */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-[#007c5d]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4 text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                  <span>ĐANG MỞ PHÒNG THI SÁT HẠCH TRỰC TUYẾN</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  Kỳ Sát Hạch Năng Lực B2B Sales Master • Quý 4/2026
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Đề thi chuẩn hóa 15 câu hỏi tình huống thực tế (Khám phá nhu cầu, Bẻ gãy từ chối giá, Chốt deal giả định). 
                  Tự động đếm ngược 15 phút, khóa chuyển tab chống gian lận và cấp chứng chỉ chuẩn quốc tế ngay sau khi hoàn thành.
                </p>

                {/* Exam Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">Thời gian</span>
                    <strong className="text-sm font-bold text-white flex items-center mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400 mr-1.5" /> 15 phút
                    </strong>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">Quy mô đề</span>
                    <strong className="text-sm font-bold text-white flex items-center mt-0.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> 15 câu trắc nghiệm
                    </strong>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">Chuẩn đỗ</span>
                    <strong className="text-sm font-bold text-white flex items-center mt-0.5">
                      <Award className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> $\ge$ 80% (12/15)
                    </strong>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">Đã tham gia</span>
                    <strong className="text-sm font-bold text-white flex items-center mt-0.5">
                      <Users className="w-3.5 h-3.5 text-blue-400 mr-1.5" /> 342 nhân sự
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Column */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-3">
                <button
                  onClick={onOpenPracticeTest}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#007c5d] hover:bg-[#00634a] text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40 hover:scale-105 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Vào phòng thi sát hạch ngay</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <span className="text-[11px] text-slate-400 text-center">
                  * Hoàn toàn miễn phí • Không yêu cầu tài khoản
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. MOON.VN STYLE: LỘ TRÌNH ĐÀO TẠO 3 CHẶNG CHUẨN B2B (PATHWAY STEPS) */}
      <section className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#007c5d] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              LỘ TRÌNH 3 CHẶNG PRO B2B
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              Lộ trình từng bước biến nhân viên mới thành Best Seller
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Phân cấp khoa học theo tiêu chuẩn Moon Pro S & TalentLMS, mở khóa tuần tự dựa trên năng lực thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Chặng 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#007c5d] hover:shadow-md transition-all text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 text-[#007c5d]">
                    CHẶNG 1 • RIN-01
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Nền Tảng</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Tiếp Cận & Khơi Gợi Nhu Cầu Ẩn
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Kỹ thuật mở đầu cuộc gọi 30 giây phá băng tâm lý đề phòng, đặt bộ câu hỏi mở SPIN để khách hàng tự nhận ra vấn đề của doanh nghiệp mình.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Video 12 phút • 5 câu test</span>
                <button
                  onClick={() => onSelectCourse('bai-1')}
                  className="text-[#007c5d] font-bold hover:underline flex items-center cursor-pointer"
                >
                  <span>Học ngay</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Chặng 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#007c5d] hover:shadow-md transition-all text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">
                    CHẶNG 2 • RIN-02
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Thực Chiến</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Bẻ Gãy Lời Từ Chối & Đàm Phán Giá
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Phương pháp phản xạ 4 bước: Lắng nghe - Đồng cảm - Đặt lại khung giá trị - Chuyển hướng. Không bao giờ nói xấu đối thủ hay hạ giá vô cớ.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Video 15 phút • 5 câu test</span>
                <button
                  onClick={() => onSelectCourse('bai-2')}
                  className="text-[#007c5d] font-bold hover:underline flex items-center cursor-pointer"
                >
                  <span>Học ngay</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Chặng 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#007c5d] hover:shadow-md transition-all text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800">
                    CHẶNG 3 • RIN-03
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Bứt Phá</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Kỹ Thuật Chốt Hợp Đồng & Up-sell
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Nắm bắt tín hiệu mua hàng ngầm, áp dụng kỹ thuật chốt giả định (Assumptive Close) và lựa chọn thay thế (Alternative Choice) để ký kết nhanh.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Video 18 phút • 5 câu test</span>
                <button
                  onClick={() => onSelectCourse('bai-3')}
                  className="text-[#007c5d] font-bold hover:underline flex items-center cursor-pointer"
                >
                  <span>Học ngay</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. MENTOR & TRAINER SHOWCASE (ĐỘI NGŨ CHUYÊN GIA) */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#007c5d] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              CHUYÊN GIA HUẤN LUYỆN
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              Được cố vấn bởi các chuyên gia B2B Sales hàng đầu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Bài giảng và kịch bản đối thoại được đúc kết từ hàng ngàn hợp đồng bán hàng thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-emerald-700 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md border-4 border-white">
                TN
              </div>
              <h4 className="text-base font-bold text-slate-900">Trần Hữu Nghĩa</h4>
              <p className="text-xs text-[#007c5d] font-semibold">Chuyên gia Đào tạo B2B Sales Master</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                12 năm kinh nghiệm dẫn dắt đội ngũ kinh doanh công nghệ, từng huấn luyện hơn 500+ trưởng phòng và best seller.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-amber-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md border-4 border-white">
                ML
              </div>
              <h4 className="text-base font-bold text-slate-900">Nguyễn Mai Linh</h4>
              <p className="text-xs text-[#007c5d] font-semibold">Trưởng Bộ Phận Huấn Luyện Kỹ Năng RIN</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tác giả của bộ cẩm nang "100 Câu Phản Xạ Bẻ Gãy Lời Từ Chối Giá", chuyên gia tâm lý đàm phán khách hàng doanh nghiệp.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-blue-700 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md border-4 border-white">
                QT
              </div>
              <h4 className="text-base font-bold text-slate-900">Lê Quốc Tuấn</h4>
              <p className="text-xs text-[#007c5d] font-semibold">Cố Vấn Đàm Phán & Chốt Hợp Đồng</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chuyên gia cấu trúc gói giải pháp giá trị cao (High-ticket Deal), cố vấn thương thảo hợp đồng phân phối quy mô lớn.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SOCIAL PROOF STATS COUNTER */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">1,250+</span>
              <p className="text-xs text-slate-400 mt-1">Nhân viên đã sát hạch</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-amber-400">96.8%</span>
              <p className="text-xs text-slate-400 mt-1">Tỷ lệ qua môn chuẩn 80%</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-blue-400">+38%</span>
              <p className="text-xs text-slate-400 mt-1">Tăng trưởng doanh thu trung bình</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white">100%</span>
              <p className="text-xs text-slate-400 mt-1">SQLite & Offline Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COURSE CATALOG PREVIEW SECTION */}
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
                      Chuyên đề {idx + 1} • {course.id === 'bai-1' ? 'RIN-01' : course.id === 'bai-2' ? 'RIN-02' : 'RIN-03'}
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

      {/* 8. BOTTOM CTA BANNER */}
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

      {/* 9. CLEAN FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <GraduationCap className="w-5 h-5 text-[#007c5d]" />
            <span>RIN Sales Academy • Moon & TalentLMS Edition</span>
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
            <button onClick={onOpenLeaderboard} className="hover:text-white transition-colors cursor-pointer">
              Bảng vàng
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
