import React from 'react';

/**
 * Bộ Icon 3D / Realistic cao cấp, tinh xảo, đậm chất thực tế và chuyên nghiệp
 * Thiết kế bằng vector SVG nhiều lớp (Gradients, Drop-shadows, Highlights)
 * Thay thế hoàn toàn các icon viền đơn điệu / pastel thô của AI
 */

// 1. Icon Khóa học: Nút Play 3D đỏ bóng bẩy cao cấp
export function RealisticCourseIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rcCourseGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff4b4b" />
          <stop offset="0.6" stopColor="#e60023" />
          <stop offset="1" stopColor="#b30018" />
        </linearGradient>
        <linearGradient id="rcCourseGloss" x1="4" y1="4" x2="28" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="rcCourseShadow" x="0" y="2" width="32" height="30" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#b30018" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* Nền bo góc 3D */}
      <rect x="3" y="4" width="26" height="24" rx="7" fill="url(#rcCourseGrad)" filter="url(#rcCourseShadow)" />
      {/* Vệt sáng bóng */}
      <rect x="3.5" y="4.5" width="25" height="12" rx="6.5" fill="url(#rcCourseGloss)" />
      {/* Tam giác Play nổi khối */}
      <path d="M13.5 11.2C13.5 10.4 14.4 9.9 15.1 10.3L22 14.8C22.6 15.2 22.6 16.1 22 16.5L15.1 21C14.4 21.4 13.5 20.9 13.5 20.1V11.2Z" fill="#ffffff" />
    </svg>
  );
}

// 2. Icon Thi Online: Bảng bài thi có đồng hồ & tích xanh chuẩn thi cử
export function RealisticExamIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rcExamBg" x1="5" y1="3" x2="27" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#f0f4f8" />
        </linearGradient>
        <linearGradient id="rcExamClip" x1="10" y1="2" x2="22" y2="7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <filter id="rcExamShadow" x="1" y="2" width="30" height="30" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.12" />
        </filter>
      </defs>
      {/* Tấm bìa kẹp */}
      <rect x="4" y="5" width="24" height="24" rx="5" fill="#e2e8f0" filter="url(#rcExamShadow)" />
      <rect x="5" y="6" width="22" height="22" rx="4" fill="url(#rcExamBg)" />
      {/* Kẹp tài liệu kim loại vàng */}
      <rect x="11" y="3" width="10" height="5" rx="2" fill="url(#rcExamClip)" />
      <circle cx="16" cy="5.5" r="1.2" fill="#ffffff" />
      {/* Các dòng bài thi */}
      <rect x="8" y="11" width="10" height="2" rx="1" fill="#94a3b8" />
      <circle cx="21.5" cy="12" r="2.2" fill="#10b981" />
      <path d="M20.5 12L21.2 12.7L22.5 11.4" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      
      <rect x="8" y="16" width="12" height="2" rx="1" fill="#cbd5e1" />
      <circle cx="21.5" cy="17" r="2.2" fill="#10b981" />
      <path d="M20.5 17L21.2 17.7L22.5 16.4" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="8" y="21" width="8" height="2" rx="1" fill="#cbd5e1" />
      <circle cx="21.5" cy="22" r="2.2" fill="#f59e0b" />
    </svg>
  );
}

// 3. Icon Đấu Trường Chốt Cọc: Khiên & Ngọn lửa chiến binh vàng cam
export function RealisticArenaIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rcArenaGrad" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff7e00" />
          <stop offset="0.7" stopColor="#ea580c" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
        <filter id="rcArenaShadow" x="1" y="2" width="30" height="30" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#ea580c" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* Khiên đấu trường */}
      <path d="M16 3L26 7V16C26 22.5 21.5 27.5 16 29C10.5 27.5 6 22.5 6 16V7L16 3Z" fill="url(#rcArenaGrad)" filter="url(#rcArenaShadow)" />
      {/* Viền sáng */}
      <path d="M16 5.5L24 8.7V15.5C24 20.8 20.3 25.2 16 26.5C11.7 25.2 8 20.8 8 15.5V8.7L16 5.5Z" fill="#ffedd5" fillOpacity="0.2" />
      {/* Tia chớp / Lửa chiến */}
      <path d="M17 10L12 17H16L15 22L20 15H16L17 10Z" fill="#ffffff" />
    </svg>
  );
}

// 4. Icon Sách & Sổ Tay RMSA: Cuốn sách bìa da xanh navy viền vàng
export function RealisticBookIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rcBookCover" x1="5" y1="4" x2="27" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e40af" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
        <filter id="rcBookShadow" x="2" y="2" width="28" height="28" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1e3a8a" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Trang sách viền */}
      <path d="M6 7C6 5.3 7.3 4 9 4H24C25.1 4 26 4.9 26 6V24C26 25.1 25.1 26 24 26H9C7.3 26 6 24.7 6 23V7Z" fill="#f8fafc" filter="url(#rcBookShadow)" />
      <path d="M6 7C6 5.3 7.3 4 9 4H22C23.1 4 24 4.9 24 6V24C24 25.1 23.1 26 22 26H9C7.3 26 6 24.7 6 23V7Z" fill="url(#rcBookCover)" />
      {/* Gáy sách mạ vàng */}
      <rect x="6" y="4" width="3.5" height="22" rx="1.5" fill="#d97706" />
      <rect x="7" y="5" width="1.5" height="20" rx="0.75" fill="#fef3c7" />
      {/* Dây ruy băng đánh dấu trang đỏ */}
      <path d="M14 4V16L16.5 14L19 16V4H14Z" fill="#ef4444" />
      {/* Dập chìm chữ RM */}
      <circle cx="16" cy="20" r="3" fill="#fbbf24" fillOpacity="0.3" />
      <path d="M14.5 20H17.5" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// 5. Icon Tài Liệu & Hợp Đồng: Thư mục vàng Manila bóng 3D
export function RealisticFolderIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rcFolderBack" x1="4" y1="6" x2="28" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#eab308" />
          <stop offset="1" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="rcFolderFront" x1="4" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde047" />
          <stop offset="0.5" stopColor="#eab308" />
          <stop offset="1" stopColor="#a16207" />
        </linearGradient>
        <filter id="rcFolderShadow" x="1" y="4" width="30" height="26" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#a16207" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Nắp sau thư mục */}
      <path d="M4 8C4 6.9 4.9 6 6 6H12L15 9H26C27.1 9 28 9.9 28 11V23C28 24.1 27.1 25 26 25H6C4.9 25 4 24.1 4 23V8Z" fill="url(#rcFolderBack)" filter="url(#rcFolderShadow)" />
      {/* Tài liệu trắng bên trong nhô lên */}
      <rect x="7" y="9" width="18" height="12" rx="2" fill="#ffffff" />
      <rect x="9" y="11" width="10" height="1.5" rx="0.75" fill="#cbd5e1" />
      <rect x="9" y="14" width="6" height="1.5" rx="0.75" fill="#cbd5e1" />
      {/* Nắp trước thư mục */}
      <path d="M3 13C3 12 3.8 11.2 4.8 11.2H27.2C28.2 11.2 29 12 29 13L27.5 25C27.5 26.1 26.6 27 25.5 27H6.5C5.4 27 4.5 26.1 4.5 25L3 13Z" fill="url(#rcFolderFront)" />
    </svg>
  );
}

// 6. Icon Diễn Đàn Thảo Luận: Bong bóng chat kép 3D (Xanh dương & San hô)
export function RealisticForumIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rcChatBlue" x1="4" y1="4" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="rcChatCoral" x1="10" y1="10" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f5e" />
          <stop offset="1" stopColor="#be123c" />
        </linearGradient>
        <filter id="rcChatShadow" x="2" y="2" width="28" height="28" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0284c7" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Bong bóng xanh sau */}
      <path d="M5 13C5 8.6 8.6 5 13 5H15C19.4 5 23 8.6 23 13C23 17.4 19.4 21 15 21H12L8 23V20.2C6.2 18.5 5 16 5 13Z" fill="url(#rcChatBlue)" filter="url(#rcChatShadow)" />
      <circle cx="10" cy="13" r="1.5" fill="#ffffff" />
      <circle cx="14" cy="13" r="1.5" fill="#ffffff" />
      <circle cx="18" cy="13" r="1.5" fill="#ffffff" />

      {/* Bong bóng hồng/cam trước */}
      <path d="M12 19C12 15.7 14.7 13 18 13H21C24.3 13 27 15.7 27 19C27 22.3 24.3 25 21 25H19.5L16.5 27V24.5C13.8 23.5 12 21.4 12 19Z" fill="url(#rcChatCoral)" />
      <path d="M16.5 19H22.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 7. Icon Cộng Đồng Running Man: Cúp vinh danh Best Seller mạ vàng & đá quý
export function RealisticCommunityIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rcGoldGrad" x1="6" y1="4" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <filter id="rcCupShadow" x="2" y="2" width="28" height="28" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#b45309" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* Quai cúp trái & phải */}
      <path d="M8 8H6C4.9 8 4 8.9 4 10V12C4 14.8 6.2 17 9 17H10" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 8H26C27.1 8 28 8.9 28 10V12C28 14.8 25.8 17 23 17H22" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
      {/* Thân cúp */}
      <path d="M8 6C8 4.9 8.9 4 10 4H22C23.1 4 24 4.9 24 6V13C24 17.4 20.4 21 16 21C11.6 21 8 17.4 8 13V6Z" fill="url(#rcGoldGrad)" filter="url(#rcCupShadow)" />
      {/* Đế cúp */}
      <path d="M14 21H18V24H14V21Z" fill="#b45309" />
      <rect x="10" y="24" width="12" height="4" rx="2" fill="#1e293b" />
      <rect x="11" y="25" width="10" height="2" rx="1" fill="#f59e0b" />
      {/* Ngôi sao chiến thắng */}
      <polygon points="16,8 17.2,11.5 20.5,11.5 17.8,13.5 18.8,17 16,14.8 13.2,17 14.2,13.5 11.5,11.5 14.8,11.5" fill="#ffffff" />
    </svg>
  );
}

// 8. Icon Mạng Xã Hội Độc Quyền (Facebook, YouTube, TikTok)
export function RealisticFacebookIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rcFbGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1877f2" />
          <stop offset="1" stopColor="#0b5ed7" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill="url(#rcFbGrad)" />
      <path d="M14.5 12.5H12.5V19H9.8V12.5H8.5V10.2H9.8V8.7C9.8 7.3 10.6 6 12.8 6H14.7V8.3H13.4C12.7 8.3 12.5 8.6 12.5 9.2V10.2H14.8L14.5 12.5Z" fill="#ffffff" />
    </svg>
  );
}

export function RealisticYoutubeIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rcYtGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff2d2d" />
          <stop offset="1" stopColor="#c90000" />
        </linearGradient>
      </defs>
      <rect x="2" y="4" width="20" height="16" rx="5" fill="url(#rcYtGrad)" />
      <path d="M10 8.5L16 12L10 15.5V8.5Z" fill="#ffffff" />
    </svg>
  );
}

export function RealisticTiktokIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#0f172a" />
      <path d="M14.5 6C15 7.2 16.1 8 17.5 8.2V10.3C16.3 10.3 15.2 9.8 14.5 9.1V14.5C14.5 16.7 12.7 18.5 10.5 18.5C8.3 18.5 6.5 16.7 6.5 14.5C6.5 12.3 8.3 10.5 10.5 10.5C10.9 10.5 11.2 10.6 11.5 10.7V12.9C11.2 12.7 10.9 12.6 10.5 12.6C9.4 12.6 8.6 13.5 8.6 14.5C8.6 15.6 9.4 16.4 10.5 16.4C11.6 16.4 12.5 15.5 12.5 14.5V6H14.5Z" fill="#ffffff" />
      <path d="M15 6.5C15.5 7.7 16.6 8.5 18 8.7V9.5C16.8 9.5 15.7 9 15 8.3V6.5Z" fill="#00f2fe" fillOpacity="0.8" />
    </svg>
  );
}

// 9. Icon Tòa Nhà & Penthouse 3D Xanh Sapphire & Vàng Kim
export function RealisticLuxuryBuildingIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rlbTower" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="0.5" stopColor="#1d4ed8" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="rlbRoofGold" x1="10" y1="2" x2="22" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde047" />
          <stop offset="0.6" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="rlbWindowLit" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fef08a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="rlbShadow" x="2" y="2" width="28" height="28" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#1e3a8a" floodOpacity="0.3" />
        </filter>
      </defs>
      <rect x="7" y="6" width="18" height="22" rx="3" fill="url(#rlbTower)" filter="url(#rlbShadow)" />
      <rect x="10" y="3" width="12" height="4" rx="1.5" fill="url(#rlbRoofGold)" />
      <rect x="15" y="1" width="2" height="2.5" fill="#f59e0b" />
      <rect x="10" y="8" width="3" height="3" rx="0.75" fill="url(#rlbWindowLit)" />
      <rect x="14.5" y="8" width="3" height="3" rx="0.75" fill="url(#rlbWindowLit)" />
      <rect x="19" y="8" width="3" height="3" rx="0.75" fill="#93c5fd" />
      <rect x="10" y="13" width="3" height="3" rx="0.75" fill="#93c5fd" />
      <rect x="14.5" y="13" width="3" height="3" rx="0.75" fill="url(#rlbWindowLit)" />
      <rect x="19" y="13" width="3" height="3" rx="0.75" fill="url(#rlbWindowLit)" />
      <rect x="10" y="18" width="3" height="3" rx="0.75" fill="url(#rlbWindowLit)" />
      <rect x="14.5" y="18" width="3" height="3" rx="0.75" fill="#93c5fd" />
      <rect x="19" y="18" width="3" height="3" rx="0.75" fill="url(#rlbWindowLit)" />
      <rect x="13.5" y="23" width="5" height="5" rx="1" fill="#f8fafc" />
      <line x1="16" y1="23" x2="16" y2="28" stroke="#cbd5e1" strokeWidth="0.8" />
    </svg>
  );
}

// 10. Icon Kịch Bản Chốt Cọc & Tia Sét 3D Vàng Cam Hổ Phách
export function RealisticDealScriptIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rdsDoc" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffbeb" />
          <stop offset="1" stopColor="#fef3c7" />
        </linearGradient>
        <linearGradient id="rdsBolt" x1="12" y1="8" x2="22" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="0.4" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
        <filter id="rdsShadow" x="2" y="2" width="28" height="28" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#d97706" floodOpacity="0.25" />
        </filter>
        <filter id="rdsBoltGlow" x="8" y="6" width="16" height="20" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#ea580c" floodOpacity="0.4" />
        </filter>
      </defs>
      <rect x="5" y="4" width="22" height="24" rx="4" fill="#fcd34d" filter="url(#rdsShadow)" />
      <rect x="6" y="5" width="20" height="22" rx="3" fill="url(#rdsDoc)" />
      <rect x="9" y="8" width="7" height="1.5" rx="0.75" fill="#f59e0b" />
      <rect x="9" y="12" width="14" height="1.5" rx="0.75" fill="#e2e8f0" />
      <rect x="9" y="16" width="10" height="1.5" rx="0.75" fill="#e2e8f0" />
      <rect x="9" y="20" width="8" height="1.5" rx="0.75" fill="#e2e8f0" />
      <path 
        d="M19 7L13 17H18L15 25L23 14H18L20 7Z" 
        fill="url(#rdsBolt)" 
        filter="url(#rdsBoltGlow)"
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 11. Icon Khiên Chuẩn Hóa Năng Lực 3D Ngọc Lục Bảo & Viền Vàng Kim
export function RealisticMasteryShieldIcon({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rmsShield" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="0.6" stopColor="#059669" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="rmsGoldRim" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <filter id="rmsShadow" x="2" y="2" width="28" height="28" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#047857" floodOpacity="0.3" />
        </filter>
      </defs>
      <path 
        d="M16 3L26 7V16C26 22.2 21.7 27.2 16 29C10.3 27.2 6 22.2 6 16V7L16 3Z" 
        fill="url(#rmsGoldRim)" 
        filter="url(#rmsShadow)" 
      />
      <path 
        d="M16 5.2L24 8.5V15.5C24 20.6 20.5 24.8 16 26.5C11.5 24.8 8 20.6 8 15.5V8.5L16 5.2Z" 
        fill="url(#rmsShield)" 
      />
      <path 
        d="M16 6.5L22.5 9.2V14C22.5 17 20.5 20 16 21.5C14.5 20.2 11.5 18 10.5 15V9.2L16 6.5Z" 
        fill="#ffffff" 
        fillOpacity="0.18" 
      />
      <path 
        d="M12 16L15 19L20.5 13" 
        stroke="#ffffff" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
