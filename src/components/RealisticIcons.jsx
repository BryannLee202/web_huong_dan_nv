import React from 'react';

/**
 * BỘ ICON ĐỒNG BỘ CHUẨN DOANH NGHIỆP THỰC CHIẾN (RUNNING MAN SALES ACADEMY)
 * - Phong cách: Tối giản, hiện đại, sắc nét (Swiss Architectural & Apple Pro UI)
 * - Không dùng gradient bóng đổ 3D giả lập / phong cách AI hoạt hình
 * - Đồng bộ 100% kích thước, tỷ lệ viền và hệ màu thương hiệu thực tế
 */

// 1. Icon Khóa học / Chuyên đề: Squircle Xanh Hoàng Gia với ký hiệu Bài giảng
export function RealisticCourseIcon({ className = "" }) {
  return (
    <div className={`w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/80 flex items-center justify-center shrink-0 shadow-2xs transition-all ${className}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" fillOpacity="0.15" />
      </svg>
    </div>
  );
}

// 2. Icon Sát hạch Online: Squircle Vàng Hổ Phách với ký hiệu Bài thi
export function RealisticExamIcon({ className = "" }) {
  return (
    <div className={`w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center shrink-0 shadow-2xs transition-all ${className}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    </div>
  );
}

// 3. Icon Luyện phản xạ thực địa: Squircle Cam Cháy với ký hiệu Mục tiêu
export function RealisticArenaIcon({ className = "" }) {
  return (
    <div className={`w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200/80 dark:border-orange-800/80 flex items-center justify-center shrink-0 shadow-2xs transition-all ${className}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}

// 4. Icon Sách & Sổ tay kịch bản: Squircle Xanh Ngọc Lục Bảo với ký hiệu Cẩm nang mở
export function RealisticBookIcon({ className = "" }) {
  return (
    <div className={`w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center shrink-0 shadow-2xs transition-all ${className}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    </div>
  );
}

// 5. Icon Tài liệu học tập: Squircle Xanh Biển với ký hiệu Thư mục
export function RealisticFolderIcon({ className = "" }) {
  return (
    <div className={`w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200/80 dark:border-cyan-800/80 flex items-center justify-center shrink-0 shadow-2xs transition-all ${className}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 8 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      </svg>
    </div>
  );
}

// 6. Icon Diễn đàn hỏi đáp: Squircle Tím Sang Trọng với ký hiệu Tin nhắn đối đáp
export function RealisticForumIcon({ className = "" }) {
  return (
    <div className={`w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-800/80 flex items-center justify-center shrink-0 shadow-2xs transition-all ${className}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h8" />
        <path d="M8 14h4" />
      </svg>
    </div>
  );
}

// 7. Icon Cộng đồng Running Man: Squircle Chàm Indigo với ký hiệu Đội ngũ
export function RealisticCommunityIcon({ className = "" }) {
  return (
    <div className={`w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-center shrink-0 shadow-2xs transition-all ${className}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
  );
}

// 8. Icon Mạng Xã Hội Chính Hãng (Facebook, YouTube, TikTok) - Chuẩn nhận diện thực tế
export function RealisticFacebookIcon({ className = "" }) {
  return (
    <div className={`w-7 h-7 rounded-xl bg-[#1877f2] flex items-center justify-center shrink-0 shadow-xs text-white ${className}`}>
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    </div>
  );
}

export function RealisticYoutubeIcon({ className = "" }) {
  return (
    <div className={`w-7 h-7 rounded-xl bg-[#ff0000] flex items-center justify-center shrink-0 shadow-xs text-white ${className}`}>
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    </div>
  );
}

export function RealisticTiktokIcon({ className = "" }) {
  return (
    <div className={`w-7 h-7 rounded-xl bg-slate-900 dark:bg-black border border-slate-700/60 dark:border-white/15 flex items-center justify-center shrink-0 shadow-xs text-white ${className}`}>
      <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.9 2.9 0 0 1 2.314-4.644c.314 0 .619.051.905.144V9.421a6.347 6.347 0 0 0-.905-.065 6.342 6.342 0 1 0 6.332 6.338V8.653a8.21 8.21 0 0 0 4.77 1.524V6.732a4.838 4.838 0 0 1-1-.046z" />
      </svg>
    </div>
  );
}

// 9. Các icon bổ trợ chuyên đề BDS & Pháp lý (Dự phòng mở rộng)
export function RealisticLuxuryBuildingIcon({ className = "" }) {
  return (
    <div className={`w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center shrink-0 shadow-2xs ${className}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
        <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
        <path d="M10 14h4" />
        <path d="M10 18h4" />
      </svg>
    </div>
  );
}

export function RealisticDealScriptIcon({ className = "" }) {
  return (
    <div className={`w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center shrink-0 shadow-2xs ${className}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    </div>
  );
}

export function RealisticMasteryShieldIcon({ className = "" }) {
  return (
    <div className={`w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-800/80 flex items-center justify-center shrink-0 shadow-2xs ${className}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </div>
  );
}
