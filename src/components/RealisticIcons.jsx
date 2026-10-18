import React from 'react';

/**
 * HỆ THỐNG ICON BIỂU TRƯNG THỰC TẾ & NỔI BẬT (REALISTIC MICRO-BADGES)
 * Running Man Sales Academy (RMSA)
 * 
 * - Thiết kế: Vật liệu thực tế (Kim loại vàng, Da, Giấy thi, Con dấu sáp, Chìa khóa, Tòa nhà)
 * - Tương phản cao, có chiều sâu vật lý (Dimensional Depth & Crisp Shading)
 * - Triệt tiêu hoàn toàn cảm giác "vector AI mờ nhạt"
 * - Đồng bộ 100% xuyên suốt: Drawer, Sidebar, Hero Carousel, Footer & Feature Badges
 */

// 1. CHUYÊN ĐỀ ĐÀO TẠO & VÀO HỌC THỰC CHIẾN (Tòa nhà Duplex & Play Button mạ bạc)
export function RealisticCourseIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="rc_bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
          <linearGradient id="rc_play" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="rc_bld" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Nền gradient xanh hoàng gia */}
        <rect width="36" height="36" rx="9" fill="url(#rc_bg)" />
        <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        
        {/* Tòa nhà căn hộ cao cấp phía sau */}
        <rect x="6" y="10" width="10" height="20" rx="1.5" fill="url(#rc_bld)" />
        <rect x="8" y="13" width="2" height="2" rx="0.5" fill="#fef08a" />
        <rect x="12" y="13" width="2" height="2" rx="0.5" fill="#fef08a" />
        <rect x="8" y="17" width="2" height="2" rx="0.5" fill="#ffffff" />
        <rect x="12" y="17" width="2" height="2" rx="0.5" fill="#fef08a" />
        <rect x="8" y="21" width="2" height="2" rx="0.5" fill="#fef08a" />
        <rect x="12" y="21" width="2" height="2" rx="0.5" fill="#ffffff" />
        
        {/* Tòa nhà phụ */}
        <rect x="18" y="14" width="8" height="16" rx="1.5" fill="url(#rc_bld)" opacity="0.6" />
        <rect x="20" y="17" width="1.5" height="1.5" rx="0.3" fill="#ffffff" />
        <rect x="23" y="17" width="1.5" height="1.5" rx="0.3" fill="#fef08a" />
        
        {/* Nút Play 3D sắc nét nổi bật phía trước */}
        <circle cx="23" cy="22" r="8.5" fill="#0f172a" fillOpacity="0.6" />
        <circle cx="23" cy="22" r="7.5" fill="url(#rc_play)" />
        <polygon points="21,18.5 27,22 21,25.5" fill="#1e3a8a" />
      </svg>
    </div>
  );
}

// 2. PHÒNG THI SÁT HẠCH ONLINE (Bảng kẹp bài thi, đồng hồ bấm giờ & tích kiểm đạt chuẩn)
export function RealisticExamIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="re_bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="re_paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id="re_gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        {/* Nền gradient hổ phách ấm áp */}
        <rect width="36" height="36" rx="9" fill="url(#re_bg)" />
        <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Tấm bìa kẹp hồ sơ thi sát hạch */}
        <rect x="7" y="7" width="22" height="23" rx="2" fill="#78350f" />
        {/* Tờ giấy thi trắng */}
        <rect x="8.5" y="9" width="19" height="20" rx="1" fill="url(#re_paper)" />
        
        {/* Kẹp kim loại ở đỉnh */}
        <rect x="13.5" y="5.5" width="9" height="3.5" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
        <circle cx="18" cy="7" r="1" fill="#475569" />
        
        {/* Các dòng bài trắc nghiệm thực tế */}
        <rect x="11" y="12" width="8" height="1.5" rx="0.75" fill="#cbd5e1" />
        <circle cx="21" cy="12.75" r="1" fill="#10b981" />
        <rect x="11" y="15.5" width="10" height="1.5" rx="0.75" fill="#cbd5e1" />
        <circle cx="23" cy="16.25" r="1" fill="#10b981" />
        <rect x="11" y="19" width="6" height="1.5" rx="0.75" fill="#cbd5e1" />

        {/* Đồng hồ bấm giờ tính giây ở góc phải bên dưới */}
        <circle cx="24" cy="23" r="6" fill="#0f172a" />
        <circle cx="24" cy="23" r="5" fill="#ffffff" />
        <path d="M24 20.5 V23 H26" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="24" cy="23" r="0.8" fill="#ea580c" />
      </svg>
    </div>
  );
}

// 3. LUYỆN PHẢN XẠ THỰC ĐỊA & 100% THỰC ĐỊA THẬT (Chìa khóa vàng căn hộ & Định vị GPS)
export function RealisticArenaIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="ra_bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id="ra_gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="40%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
        {/* Nền gradient cam lửa thực chiến */}
        <rect width="36" height="36" rx="9" fill="url(#ra_bg)" />
        <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Vòng radar quét thực địa */}
        <circle cx="18" cy="18" r="12" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="18" cy="18" r="7" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        
        {/* Chiếc Chìa Khóa Vàng Căn Hộ (Master Key) góc nghiêng thực tế */}
        <g transform="rotate(-35 18 18)">
          {/* Đầu chìa tròn có lỗ móc */}
          <circle cx="12" cy="18" r="5" fill="url(#ra_gold)" stroke="#854d0e" strokeWidth="0.8" />
          <circle cx="12" cy="18" r="2.2" fill="#9a3412" />
          {/* Thân chìa dài */}
          <rect x="16" y="16.5" width="13" height="3" rx="0.5" fill="url(#ra_gold)" stroke="#854d0e" strokeWidth="0.8" />
          {/* Răng chìa chốt cọc */}
          <rect x="23" y="19.2" width="2" height="3" rx="0.3" fill="url(#ra_gold)" />
          <rect x="26.5" y="19.2" width="2.2" height="4" rx="0.3" fill="url(#ra_gold)" />
        </g>
        
        {/* Ánh sáng lấp lánh chốt cọc */}
        <path d="M26 8 L27 10 L29 11 L27 12 L26 14 L25 12 L23 11 L25 10 Z" fill="#ffffff" />
      </svg>
    </div>
  );
}

// 4. KỊCH BẢN & CẨM NANG MẪU BỎ TÚI (Sổ tay bìa da thực tế có dải ruy băng đỏ)
export function RealisticBookIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="rb_bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="rb_cover" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>
        {/* Nền gradient xanh ngọc lục bảo */}
        <rect width="36" height="36" rx="9" fill="url(#rb_bg)" />
        <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Cuốn sổ tay kịch bản bỏ túi cao cấp */}
        {/* Ruột giấy bên phải */}
        <rect x="11" y="8" width="18" height="21" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Bìa sổ da màu navy đậm sang trọng */}
        <rect x="8" y="7.5" width="19" height="22" rx="2" fill="url(#rb_cover)" />
        
        {/* Đường may chỉ vàng trang trí ở gáy */}
        <line x1="12" y1="7.5" x2="12" y2="29.5" stroke="#facc15" strokeWidth="1" strokeDasharray="1.5 1.5" />
        
        {/* Dải ruy băng lụa đỏ đánh dấu trang buông xuống */}
        <path d="M21 7.5 V24 L22.5 22.5 L24 24 V7.5 Z" fill="#ef4444" />
        
        {/* Huy hiệu chữ dập nổi mạ vàng trên bìa sổ */}
        <rect x="14" y="13" width="9" height="6" rx="1" fill="#334155" stroke="#facc15" strokeWidth="0.8" />
        <text x="18.5" y="17.2" fontSize="3.8" fontWeight="bold" fill="#facc15" textAnchor="middle" fontFamily="monospace">PDF</text>
      </svg>
    </div>
  );
}

// 5. TÀI LIỆU HỌC TẬP & GIỎ HÀNG DỰ ÁN (Cặp hồ sơ hợp đồng sắc nét)
export function RealisticFolderIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="rf_bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="rf_tab" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        {/* Nền xanh cyan đại dương */}
        <rect width="36" height="36" rx="9" fill="url(#rf_bg)" />
        <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Mặt sau cặp hồ sơ */}
        <path d="M7 13 C7 11.5 8 10.5 9.5 10.5 H15 L17.5 13 H27 C28.5 13 29.5 14 29.5 15.5 V27 C29.5 28 28.5 29 27 29 H9.5 C8 29 7 28 7 27 Z" fill="#0c4a6e" />
        
        {/* Tài liệu hợp đồng bên trong trồi lên */}
        <rect x="10.5" y="10" width="15" height="15" rx="1" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="13" y="13" width="7" height="1.2" rx="0.6" fill="#3b82f6" />
        <rect x="13" y="16" width="10" height="1" rx="0.5" fill="#94a3b8" />
        <rect x="13" y="18.5" width="9" height="1" rx="0.5" fill="#94a3b8" />
        
        {/* Nắp trước hồ sơ góc mở 3D */}
        <path d="M6.5 16 C6.5 15 7.5 14 9 14 H27 C28.5 14 29.5 15 29.5 16 V27.5 C29.5 28.5 28.5 29.5 27 29.5 H9 C7.5 29.5 6.5 28.5 6.5 27.5 Z" fill="#38bdf8" />
        <path d="M6.5 18 H29.5 L28 29.5 H8 Z" fill="#0284c7" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

// 6. BẢNG VÀNG THI ĐUA & BEST SELLER (Cúp Vàng Vô Địch kim loại mạ vàng sáng loáng)
export function RealisticTrophyIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="rt_bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4338ca" />
            <stop offset="50%" stopColor="#3730a3" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="rt_gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <linearGradient id="rt_shine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Nền xanh tím hoàng gia vinh danh */}
        <rect width="36" height="36" rx="9" fill="url(#rt_bg)" />
        <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        
        {/* Ánh sao vinh quang */}
        <circle cx="18" cy="14" r="10" fill="#facc15" fillOpacity="0.15" />
        
        {/* Thân Cúp Vàng */}
        {/* Quai cúp 2 bên */}
        <path d="M11 11 C8 11 8 16 11 18 H13 V11 Z" fill="url(#rt_gold)" stroke="#854d0e" strokeWidth="0.8" />
        <path d="M25 11 C28 11 28 16 25 18 H23 V11 Z" fill="url(#rt_gold)" stroke="#854d0e" strokeWidth="0.8" />
        
        {/* Bầu cúp chính */}
        <path d="M12 9 H24 V15 C24 18.5 21 21 18 21 C15 21 12 18.5 12 15 Z" fill="url(#rt_gold)" stroke="#854d0e" strokeWidth="0.8" />
        <path d="M13 10 H17 V17 C15 17 13.5 15.5 13 14 Z" fill="url(#rt_shine)" />
        
        {/* Ngôi sao nổi giữa cúp */}
        <polygon points="18,11.5 19,13.5 21,13.8 19.5,15.2 20,17.2 18,16.2 16,17.2 16.5,15.2 15,13.8 17,13.5" fill="#ffffff" />
        
        {/* Cuống cúp */}
        <rect x="16.5" y="21" width="3" height="4" fill="url(#rt_gold)" stroke="#854d0e" strokeWidth="0.6" />
        {/* Đế cúp bằng đá đen bọc viền vàng */}
        <rect x="13" y="25" width="10" height="3.5" rx="1" fill="#0f172a" stroke="#ca8a04" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

// 7. CHỨNG NHẬN TỐT NGHIỆP, CHỨNG CHỈ SỐ HÓA & QR CODE (Con dấu sáp đỏ hoàng gia & Ribbon lụa vàng)
export function RealisticCertificateIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="rcert_bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#be123c" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>
          <linearGradient id="rcert_ribbon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="rcert_seal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fecdd3" />
          </linearGradient>
        </defs>
        {/* Nền đỏ son chứng nhận uy tín */}
        <rect width="36" height="36" rx="9" fill="url(#rcert_bg)" />
        <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* 2 dải ruy băng lụa vàng kim rủ xuống */}
        <path d="M15 19 L11 31 L15 28 L19 31 L16 19 Z" fill="url(#rcert_ribbon)" stroke="#854d0e" strokeWidth="0.5" />
        <path d="M21 19 L17 31 L21 28 L25 31 L22 19 Z" fill="url(#rcert_ribbon)" stroke="#854d0e" strokeWidth="0.5" />
        
        {/* Con dấu tròn bảo chứng danh dự (Official Medal Crest) */}
        <circle cx="18" cy="15" r="9" fill="#881337" stroke="url(#rcert_ribbon)" strokeWidth="1.5" />
        <circle cx="18" cy="15" r="7.5" fill="#be123c" />
        <circle cx="18" cy="15" r="6.5" stroke="#facc15" strokeWidth="0.8" strokeDasharray="1.5 1" />
        
        {/* Ký hiệu V-Verified sắc nét chính giữa con dấu */}
        <path d="M14.5 14.8 L16.8 17.2 L21.5 12.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// 8. CỘNG ĐỒNG THẢO LUẬN & DIỄN ĐÀN (Mạng lưới kết nối đội nhóm thực chiến đàm thoại)
export function RealisticCommunityIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="rcomm_bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
          <linearGradient id="rcomm_bubble1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e0e7ff" />
          </linearGradient>
          <linearGradient id="rcomm_bubble2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
        {/* Nền xanh chàm indigo kết nối */}
        <rect width="36" height="36" rx="9" fill="url(#rcomm_bg)" />
        <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Bong bóng thảo luận lớn (Trắng - Báo cọc phòng) */}
        <path d="M7 16 C7 11.5 11 8 16.5 8 C22 8 26 11.5 26 16 C26 20.5 22 24 16.5 24 C14.5 24 13 23.5 11.5 22.8 L7.5 24.5 L8.5 20.8 C7.5 19.5 7 17.8 7 16 Z" fill="url(#rcomm_bubble1)" />
        
        {/* 3 chấm đàm thoại thời gian thực */}
        <circle cx="12.5" cy="16" r="1.5" fill="#4f46e5" />
        <circle cx="16.5" cy="16" r="1.5" fill="#4f46e5" />
        <circle cx="20.5" cy="16" r="1.5" fill="#4f46e5" />
        
        {/* Bong bóng phụ phía trước (Cam năng lượng - Phản xạ thực chiến) */}
        <path d="M19 22 C19 19.5 21.5 17.5 24.5 17.5 C27.5 17.5 30 19.5 30 22 C30 24.5 27.5 26.5 24.5 26.5 C23.5 26.5 22.5 26.2 21.8 25.8 L19 27 L19.8 24.8 C19.2 24 19 23 19 22 Z" fill="url(#rcomm_bubble2)" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="23" cy="22" r="0.8" fill="#ffffff" />
        <circle cx="25" cy="22" r="0.8" fill="#ffffff" />
        <circle cx="27" cy="22" r="0.8" fill="#ffffff" />
      </svg>
    </div>
  );
}

// 9. AI RUNNING RIN 24/7 (Sử dụng trực tiếp ảnh 3D Mascot Rin thật có đèn báo Active 24/7)
export function RealisticAiRinIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shrink-0 select-none shadow-xs border border-amber-500/40 bg-slate-950 ${className}`}>
      <img 
        src="/mascot-running-rin-chibi.jpg" 
        alt="Running Rin AI"
        className="w-full h-full object-cover scale-105"
      />
      {/* Đèn báo trạng thái trực tuyến 24/7 */}
      <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
    </div>
  );
}

// 10. BẢO MẬT NỘI BỘ SSL (Khiên thép tôi luyện & Ổ khóa vàng đồng)
export function RealisticSecurityIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="rsec_bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6d28d9" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          <linearGradient id="rsec_shield" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="rsec_lock" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
        {/* Nền tím bảo mật an ninh */}
        <rect width="36" height="36" rx="9" fill="url(#rsec_bg)" />
        <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Khiên thép bảo vệ */}
        <path d="M18 7 L27 10.5 V18 C27 23.5 23 27.5 18 29.5 C13 27.5 9 23.5 9 18 V10.5 L18 7 Z" fill="#312e81" stroke="#e0e7ff" strokeWidth="1.2" />
        <path d="M18 8.5 L25.5 11.5 V18 C25.5 22.5 22 26 18 27.8 V8.5 Z" fill="#4338ca" />
        
        {/* Ổ khóa vàng ở trung tâm khiên */}
        {/* Vòng khóa trên */}
        <path d="M15 16 V13.5 C15 11.8 16.3 10.5 18 10.5 C19.7 10.5 21 11.8 21 13.5 V16" stroke="url(#rsec_lock)" strokeWidth="1.8" strokeLinecap="round" />
        {/* Thân ổ khóa vàng */}
        <rect x="14" y="16" width="8" height="6.5" rx="1.5" fill="url(#rsec_lock)" stroke="#854d0e" strokeWidth="0.8" />
        {/* Lỗ khóa */}
        <circle cx="18" cy="18.5" r="0.9" fill="#78350f" />
        <path d="M18 19 V20.8" stroke="#78350f" strokeWidth="0.9" />
      </svg>
    </div>
  );
}

// 11. ĐỊNH VỊ BẤT ĐỘNG SẢN 100% THỰC ĐỊA THẬT (Ghim GPS cắm vào Tòa nhà TP.HCM)
export function RealisticRealEstateIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="rre_bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>
          <linearGradient id="rre_pin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
        {/* Nền xanh lam thực địa */}
        <rect width="36" height="36" rx="9" fill="url(#rre_bg)" />
        <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Tòa nhà căn hộ thực tế */}
        <rect x="8" y="14" width="20" height="15" rx="1.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
        <rect x="11" y="17" width="2.5" height="2.5" rx="0.5" fill="#fef08a" />
        <rect x="15" y="17" width="2.5" height="2.5" rx="0.5" fill="#ffffff" />
        <rect x="19" y="17" width="2.5" height="2.5" rx="0.5" fill="#fef08a" />
        <rect x="23" y="17" width="2.5" height="2.5" rx="0.5" fill="#ffffff" />
        
        <rect x="11" y="21" width="2.5" height="2.5" rx="0.5" fill="#ffffff" />
        <rect x="15" y="21" width="2.5" height="2.5" rx="0.5" fill="#fef08a" />
        <rect x="19" y="21" width="2.5" height="2.5" rx="0.5" fill="#ffffff" />
        <rect x="23" y="21" width="2.5" height="2.5" rx="0.5" fill="#fef08a" />

        {/* Ghim GPS đỏ cắm trên đỉnh tòa nhà */}
        <path d="M18 6 C15.5 6 13.5 8 13.5 10.5 C13.5 14 18 18 18 18 C18 18 22.5 14 22.5 10.5 C22.5 8 20.5 6 18 6 Z" fill="url(#rre_pin)" stroke="#ffffff" strokeWidth="1" />
        <circle cx="18" cy="10.5" r="1.8" fill="#ffffff" />
      </svg>
    </div>
  );
}

// 12. MẠNG XÃ HỘI CHÍNH HÃNG (Facebook, YouTube, TikTok) - Chuẩn nhận diện thực tế
export function RealisticFacebookIcon({ className = "w-7 h-7" }) {
  return (
    <div className={`rounded-xl bg-[#1877f2] flex items-center justify-center shrink-0 shadow-xs text-white ${className}`}>
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    </div>
  );
}

export function RealisticYoutubeIcon({ className = "w-7 h-7" }) {
  return (
    <div className={`rounded-xl bg-[#ff0000] flex items-center justify-center shrink-0 shadow-xs text-white ${className}`}>
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    </div>
  );
}

export function RealisticTiktokIcon({ className = "w-7 h-7" }) {
  return (
    <div className={`rounded-xl bg-slate-900 dark:bg-black border border-slate-700/60 dark:border-white/15 flex items-center justify-center shrink-0 shadow-xs text-white ${className}`}>
      <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.9 2.9 0 0 1 2.314-4.644c.314 0 .619.051.905.144V9.421a6.347 6.347 0 0 0-.905-.065 6.342 6.342 0 1 0 6.332 6.338V8.653a8.21 8.21 0 0 0 4.77 1.524V6.732a4.838 4.838 0 0 1-1-.046z" />
      </svg>
    </div>
  );
}

// 13. DIỄN ĐÀN HỎI ĐÁP & CHIA SẺ DEAL (Bong bóng đàm thoại tím chuyên sâu)
export function RealisticForumIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="rforum_bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#6b21a8" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="9" fill="url(#rforum_bg)" />
        <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Bong bóng thảo luận diễn đàn */}
        <path d="M8 12 C8 9.5 10 7.5 12.5 7.5 H23.5 C26 7.5 28 9.5 28 12 V19 C28 21.5 26 23.5 23.5 23.5 H13 L9 27.5 V23.5 H8.5 C8 23.5 8 21.5 8 19 Z" fill="#ffffff" />
        
        {/* Dòng chat mô phỏng */}
        <rect x="12" y="11.5" width="12" height="2" rx="1" fill="#7c3aed" />
        <rect x="12" y="15" width="8" height="2" rx="1" fill="#c084fc" />
        <circle cx="23" cy="16" r="1.2" fill="#f59e0b" />
      </svg>
    </div>
  );
}

