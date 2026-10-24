/**
 * Danh sách 32 bài hát hạt giống mặc định chuẩn của hệ thống RMSA Chill Music
 * Cắt thẳng vào điệp khúc, đã qua lọc trùng lặp
 */

export const DEFAULT_SEED_TRACKS = [
  // ==========================================
  // NHÓM 1: ⚡ NHẠC KAHOOT & SÁT HẠCH (2 BÀI)
  // ==========================================
  {
    id: 'kahoot-original',
    title: 'Kahoot Lobby Theme (Bản Gốc 10 Giờ)',
    category: 'kahoot',
    categoryName: '⚡ Nhạc Kahoot Sát Hạch',
    youtubeId: '8YGlzSl6cxU',
    startTime: 15,
    tag: 'Điệp khúc 0:15',
    mood: 'Tập trung, hồi hộp',
    order_index: 1,
    is_active: 1
  },
  {
    id: 'kahoot-uia',
    title: 'Nhạc Game Kahoot (Bản Gốc & UIA Remix)',
    category: 'kahoot',
    categoryName: '⚡ Nhạc Kahoot Sát Hạch',
    youtubeId: 'TC4Uuj3SfLg',
    startTime: 10,
    tag: 'Điệp khúc 0:10',
    mood: 'Sôi động, năng lượng',
    order_index: 2,
    is_active: 1
  },

  // ==========================================
  // NHÓM 2: 🔥 PLAYLIST DRILL TIKTOK - ACV (7 BÀI)
  // Link gốc: https://www.youtube.com/watch?v=OQFweHsReVI
  // ==========================================
  {
    id: 'acv-1',
    title: 'Ngày Mình Chia Tay (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 28,
    tag: 'Điệp khúc 0:28',
    mood: 'Catchy, cuốn hút',
    order_index: 3,
    is_active: 1
  },
  {
    id: 'acv-2',
    title: 'Kẻ Say Tình (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 260,
    tag: 'Điệp khúc 4:20',
    mood: 'Cực cháy, tự tin',
    order_index: 4,
    is_active: 1
  },
  {
    id: 'acv-3',
    title: 'Thủy Chung (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 585,
    tag: 'Điệp khúc 9:45',
    mood: 'Tình cảm, lôi cuốn',
    order_index: 5,
    is_active: 1
  },
  {
    id: 'acv-4',
    title: 'Trả Cho Em (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 775,
    tag: 'Điệp khúc 12:55',
    mood: 'Nhịp điệu sâu lắng',
    order_index: 6,
    is_active: 1
  },
  {
    id: 'acv-5',
    title: 'Có Khi Nào Rời Xa (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 965,
    tag: 'Điệp khúc 16:05',
    mood: 'Hoài niệm, da diết',
    order_index: 7,
    is_active: 1
  },
  {
    id: 'acv-6',
    title: 'Sao Mình Chưa Nắm Tay Nhau (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 1150,
    tag: 'Điệp khúc 19:10',
    mood: 'Dễ thương, ngọt ngào',
    order_index: 8,
    is_active: 1
  },
  {
    id: 'acv-7',
    title: 'Hôm Qua Tôi Đã Khóc (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 1355,
    tag: 'Điệp khúc 22:35',
    mood: 'Cảm xúc bùng nổ',
    order_index: 9,
    is_active: 1
  },

  // ==========================================
  // NHÓM 3: 🖤 BẢN TÌNH CA DRILL 2026 - VUA DRILL (23 BÀI)
  // Link gốc: https://www.youtube.com/watch?v=_Bp8AGV-kXM
  // ==========================================
  {
    id: 'vua-1',
    title: 'Thà Quên Đi (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 32,
    tag: 'Điệp khúc 0:32',
    mood: 'Chill beat, cuốn hút',
    order_index: 10,
    is_active: 1
  },
  {
    id: 'vua-2',
    title: 'Vết Thương (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 212,
    tag: 'Điệp khúc 3:32',
    mood: 'Tâm trạng',
    order_index: 11,
    is_active: 1
  },
  {
    id: 'vua-3',
    title: 'Thành Đô (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 395,
    tag: 'Điệp khúc 6:35',
    mood: 'Lãng tử, phong trần',
    order_index: 12,
    is_active: 1
  },
  {
    id: 'vua-4',
    title: 'Thương Nhau Đến Thế (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 558,
    tag: 'Điệp khúc 9:18',
    mood: 'Trầm ấm, thư giãn',
    order_index: 13,
    is_active: 1
  },
  {
    id: 'vua-5',
    title: 'Bông Hoa Chẳng Tồn Tại (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 700,
    tag: 'Điệp khúc 11:40',
    mood: 'Nhẹ nhàng',
    order_index: 14,
    is_active: 1
  },
  {
    id: 'vua-6',
    title: 'Em Vội Quên x Bông Hoa Nở Muộn',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 868,
    tag: 'Điệp khúc 14:28',
    mood: 'Mashup hot trend',
    order_index: 15,
    is_active: 1
  },
  {
    id: 'vua-7',
    title: 'Yêu Thương Chẳng Là Mãi Mãi',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1050,
    tag: 'Điệp khúc 17:30',
    mood: 'Sâu lắng',
    order_index: 16,
    is_active: 1
  },
  {
    id: 'vua-8',
    title: 'Địa Ngục Trần Gian x Anh Đã Không Biết Cách Yêu Em',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1205,
    tag: 'Điệp khúc 20:05',
    mood: 'Điệp khúc cao trào',
    order_index: 17,
    is_active: 1
  },
  {
    id: 'vua-9',
    title: 'Nếu Ngược Lối (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1410,
    tag: 'Điệp khúc 23:30',
    mood: 'Du dương',
    order_index: 18,
    is_active: 1
  },
  {
    id: 'vua-10',
    title: 'Chấp Niệm Trong Drill',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1550,
    tag: 'Điệp khúc 25:50',
    mood: 'Kiên trì, bứt phá',
    order_index: 19,
    is_active: 1
  },
  {
    id: 'vua-11',
    title: 'Mưa Rơi Vào Phòng (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1715,
    tag: 'Điệp khúc 28:35',
    mood: 'Chill mưa đêm',
    order_index: 20,
    is_active: 1
  },
  {
    id: 'vua-12',
    title: 'Hai Người Hai Hướng (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1865,
    tag: 'Điệp khúc 31:05',
    mood: 'Trầm lắng',
    order_index: 21,
    is_active: 1
  },
  {
    id: 'vua-13',
    title: 'Thương Lấy Chính Mình x Em Đâu Thua Một Ai',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2015,
    tag: 'Điệp khúc 33:35',
    mood: 'Động lực chữa lành',
    order_index: 22,
    is_active: 1
  },
  {
    id: 'vua-14',
    title: 'Đêm Trăng Tình Yêu (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2200,
    tag: 'Điệp khúc 36:40',
    mood: 'Gợi nhớ tuổi thơ',
    order_index: 23,
    is_active: 1
  },
  {
    id: 'vua-15',
    title: 'Vở Kịch Của Em (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2390,
    tag: 'Điệp khúc 39:50',
    mood: 'Cao trào gay cấn',
    order_index: 24,
    is_active: 1
  },
  {
    id: 'vua-16',
    title: 'Sợ Phải Kết Thúc (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2545,
    tag: 'Điệp khúc 42:25',
    mood: 'Cảm xúc dâng trào',
    order_index: 25,
    is_active: 1
  },
  {
    id: 'vua-17',
    title: 'Khuôn Mặt Đáng Thương (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2705,
    tag: 'Điệp khúc 45:05',
    mood: 'Day dứt',
    order_index: 26,
    is_active: 1
  },
  {
    id: 'vua-18',
    title: 'Nhường Lại Nỗi Đau (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2878,
    tag: 'Điệp khúc 47:58',
    mood: 'Nhẹ nhõm, buông bỏ',
    order_index: 27,
    is_active: 1
  },
  {
    id: 'vua-19',
    title: 'Đã Lỡ Yêu Em Nhiều (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 3020,
    tag: 'Điệp khúc 50:20',
    mood: 'Cuốn hút, bay bổng',
    order_index: 28,
    is_active: 1
  },
  {
    id: 'vua-20',
    title: 'Lỡ Một Lời Thương (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 3245,
    tag: 'Điệp khúc 54:05',
    mood: 'Ngọt ngào, êm ái',
    order_index: 29,
    is_active: 1
  },
  {
    id: 'vua-21',
    title: 'Tuyết Yêu Thương (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 3410,
    tag: 'Điệp khúc 56:50',
    mood: 'Ký ức Audition rực rỡ',
    order_index: 30,
    is_active: 1
  },
  {
    id: 'vua-22',
    title: 'Bức Tranh Vĩnh Hằng ft. Tháp Rơi Tự Do',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 3545,
    tag: 'Điệp khúc 59:05',
    mood: 'Bùng nổ cảm xúc',
    order_index: 31,
    is_active: 1
  },
  {
    id: 'vua-23',
    title: 'Dù Có Cách Xa (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 3700,
    tag: 'Điệp khúc 1:01:40',
    mood: 'Tươi vui, ấm áp',
    order_index: 32,
    is_active: 1
  }
];
