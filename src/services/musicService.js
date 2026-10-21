/**
 * RMSA Chill Music Service - Trình phát nhạc nền & Sát hạch
 * - Tích hợp đầy đủ các bài hát từ 4 link YouTube người dùng cung cấp
 * - Đã tách thành 32 bài riêng biệt từ 2 mixtape / playlist lớn
 * - Tự động LỌC BÀI TRÙNG LẶP (Deduplication)
 * - Mỗi bài đều VÀO THẲNG ĐIỆP KHÚC (Chorus Drop / Start Time)
 * - 1-Click: Bấm là phát, bấm lại là dừng
 * - Chuyển bài, chỉnh âm lượng, hỗ trợ dán thêm link cá nhân
 */

export function extractYouTubeId(url = '') {
  if (!url) return '';
  const clean = String(url).trim();
  try {
    if (clean.includes('youtu.be/')) {
      return clean.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || '';
    }
    if (clean.includes('youtube.com/watch')) {
      const parsed = new URL(clean);
      return parsed.searchParams.get('v') || '';
    }
    if (clean.includes('youtube.com/embed/')) {
      return clean.split('youtube.com/embed/')[1]?.split('?')[0] || '';
    }
    if (clean.includes('youtube.com/shorts/')) {
      return clean.split('youtube.com/shorts/')[1]?.split('?')[0] || '';
    }
  } catch {}
  return '';
}

// Hàm chuẩn hóa chuỗi để phát hiện và lọc bài trùng lặp
export function normalizeTrackTitle(title = '') {
  return String(title)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/drill|tiktok|remix|ft|nhac|hot|trend|\(.*?\)|\[.*?\]/gi, '')
    .replace(/[^a-z0-9]/g, '');
}

// 32 BÀI HÁT TÁCH RỜI TỪ 4 LINK YOUTUBE CỦA NGƯỜI DÙNG - CẮT THẲNG VÀO ĐIỆP KHÚC
export const RAW_PRESET_TRACKS = [
  // ==========================================
  // NHÓM 1: ⚡ NHẠC KAHOOT & SÁT HẠCH (2 BÀI)
  // ==========================================
  {
    id: 'kahoot-original',
    title: 'Kahoot Lobby Theme (Bản Gốc 10 Giờ)',
    category: 'kahoot',
    categoryName: '⚡ Nhạc Kahoot Sát Hạch',
    youtubeId: '8YGlzSl6cxU',
    startTime: 15, // Vào beat chính lúc 0:15
    tag: 'Điệp khúc 0:15',
    mood: 'Tập trung, hồi hộp'
  },
  {
    id: 'kahoot-uia',
    title: 'Nhạc Game Kahoot (Bản Gốc & UIA Remix)',
    category: 'kahoot',
    categoryName: '⚡ Nhạc Kahoot Sát Hạch',
    youtubeId: 'TC4Uuj3SfLg',
    startTime: 10, // Vào beat drop sôi động lúc 0:10
    tag: 'Điệp khúc 0:10',
    mood: 'Sôi động, năng lượng'
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
    startTime: 28, // Điệp khúc: "Ngày mình chia tay em khóc như mưa..." (0:28)
    tag: 'Điệp khúc 0:28',
    mood: 'Catchy, cuốn hút'
  },
  {
    id: 'acv-2',
    title: 'Kẻ Say Tình (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 260, // Điệp khúc lúc 04:20 (260s)
    tag: 'Điệp khúc 4:20',
    mood: 'Cực cháy, tự tin'
  },
  {
    id: 'acv-3',
    title: 'Thủy Chung (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 585, // Điệp khúc lúc 09:45 (585s)
    tag: 'Điệp khúc 9:45',
    mood: 'Tình cảm, lôi cuốn'
  },
  {
    id: 'acv-4',
    title: 'Trả Cho Em (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 775, // Điệp khúc lúc 12:55 (775s)
    tag: 'Điệp khúc 12:55',
    mood: 'Nhịp điệu sâu lắng'
  },
  {
    id: 'acv-5',
    title: 'Có Khi Nào Rời Xa (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 965, // Điệp khúc lúc 16:05 (965s)
    tag: 'Điệp khúc 16:05',
    mood: 'Hoài niệm, da diết'
  },
  {
    id: 'acv-6',
    title: 'Sao Mình Chưa Nắm Tay Nhau (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 1150, // Điệp khúc lúc 19:10 (1150s)
    tag: 'Điệp khúc 19:10',
    mood: 'Dễ thương, ngọt ngào'
  },
  {
    id: 'acv-7',
    title: 'Hôm Qua Tôi Đã Khóc (Drill TikTok)',
    category: 'acv-drill',
    categoryName: '🔥 Drill TikTok (ACV)',
    youtubeId: 'OQFweHsReVI',
    startTime: 1355, // Điệp khúc lúc 22:35 (1355s)
    tag: 'Điệp khúc 22:35',
    mood: 'Cảm xúc bùng nổ'
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
    startTime: 32, // Điệp khúc lúc 0:32
    tag: 'Điệp khúc 0:32',
    mood: 'Chill beat, cuốn hút'
  },
  {
    id: 'vua-2',
    title: 'Vết Thương (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 212, // Điệp khúc lúc 03:32
    tag: 'Điệp khúc 3:32',
    mood: 'Tâm trạng'
  },
  {
    id: 'vua-3',
    title: 'Thành Đô (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 395, // Điệp khúc lúc 06:35
    tag: 'Điệp khúc 6:35',
    mood: 'Lãng tử, phong trần'
  },
  {
    id: 'vua-4',
    title: 'Thương Nhau Đến Thế (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 558, // Điệp khúc lúc 09:18
    tag: 'Điệp khúc 9:18',
    mood: 'Trầm ấm, thư giãn'
  },
  {
    id: 'vua-5',
    title: 'Bông Hoa Chẳng Tồn Tại (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 700, // Điệp khúc lúc 11:40
    tag: 'Điệp khúc 11:40',
    mood: 'Nhẹ nhàng'
  },
  {
    id: 'vua-6',
    title: 'Em Vội Quên x Bông Hoa Nở Muộn',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 868, // Điệp khúc lúc 14:28
    tag: 'Điệp khúc 14:28',
    mood: 'Mashup hot trend'
  },
  {
    id: 'vua-7',
    title: 'Yêu Thương Chẳng Là Mãi Mãi',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1050, // Điệp khúc lúc 17:30
    tag: 'Điệp khúc 17:30',
    mood: 'Sâu lắng'
  },
  {
    id: 'vua-8',
    title: 'Địa Ngục Trần Gian x Anh Đã Không Biết Cách Yêu Em',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1205, // Điệp khúc lúc 20:05
    tag: 'Điệp khúc 20:05',
    mood: 'Điệp khúc cao trào'
  },
  {
    id: 'vua-9',
    title: 'Nếu Ngược Lối (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1410, // Điệp khúc lúc 23:30
    tag: 'Điệp khúc 23:30',
    mood: 'Du dương'
  },
  {
    id: 'vua-10',
    title: 'Chấp Niệm Trong Drill',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1550, // Điệp khúc lúc 25:50
    tag: 'Điệp khúc 25:50',
    mood: 'Kiên trì, bứt phá'
  },
  {
    id: 'vua-11',
    title: 'Mưa Rơi Vào Phòng (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1715, // Điệp khúc lúc 28:35
    tag: 'Điệp khúc 28:35',
    mood: 'Chill mưa đêm'
  },
  {
    id: 'vua-12',
    title: 'Hai Người Hai Hướng (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 1865, // Điệp khúc lúc 31:05
    tag: 'Điệp khúc 31:05',
    mood: 'Trầm lắng'
  },
  {
    id: 'vua-13',
    title: 'Thương Lấy Chính Mình x Em Đâu Thua Một Ai',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2015, // Điệp khúc lúc 33:35
    tag: 'Điệp khúc 33:35',
    mood: 'Động lực chữa lành'
  },
  {
    id: 'vua-14',
    title: 'Đêm Trăng Tình Yêu (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2200, // Điệp khúc lúc 36:40
    tag: 'Điệp khúc 36:40',
    mood: 'Gợi nhớ tuổi thơ'
  },
  {
    id: 'vua-15',
    title: 'Vở Kịch Của Em (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2390, // Điệp khúc lúc 39:50
    tag: 'Điệp khúc 39:50',
    mood: 'Cao trào gay cấn'
  },
  {
    id: 'vua-16',
    title: 'Sợ Phải Kết Thúc (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2545, // Điệp khúc lúc 42:25
    tag: 'Điệp khúc 42:25',
    mood: 'Cảm xúc dâng trào'
  },
  {
    id: 'vua-17',
    title: 'Khuôn Mặt Đáng Thương (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2705, // Điệp khúc lúc 45:05
    tag: 'Điệp khúc 45:05',
    mood: 'Day dứt'
  },
  {
    id: 'vua-18',
    title: 'Nhường Lại Nỗi Đau (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 2878, // Điệp khúc lúc 47:58
    tag: 'Điệp khúc 47:58',
    mood: 'Nhẹ nhõm, buông bỏ'
  },
  {
    id: 'vua-19',
    title: 'Đã Lỡ Yêu Em Nhiều (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 3020, // Điệp khúc lúc 50:20
    tag: 'Điệp khúc 50:20',
    mood: 'Cuốn hút, bay bổng'
  },
  {
    id: 'vua-20',
    title: 'Lỡ Một Lời Thương (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 3245, // Điệp khúc lúc 54:05
    tag: 'Điệp khúc 54:05',
    mood: 'Ngọt ngào, êm ái'
  },
  {
    id: 'vua-21',
    title: 'Tuyết Yêu Thương (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 3410, // Điệp khúc lúc 56:50
    tag: 'Điệp khúc 56:50',
    mood: 'Ký ức Audition rực rỡ'
  },
  {
    id: 'vua-22',
    title: 'Bức Tranh Vĩnh Hằng ft. Tháp Rơi Tự Do',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 3545, // Điệp khúc lúc 59:05
    tag: 'Điệp khúc 59:05',
    mood: 'Bùng nổ cảm xúc'
  },
  {
    id: 'vua-23',
    title: 'Dù Có Cách Xa (Bản Tình Ca Drill)',
    category: 'vua-drill',
    categoryName: '🖤 Tình Ca Drill (Vua Drill)',
    youtubeId: '_Bp8AGV-kXM',
    startTime: 3700, // Điệp khúc lúc 1:01:40 (3700s)
    tag: 'Điệp khúc 1:01:40',
    mood: 'Tươi vui, ấm áp'
  }
];

// Hàm lọc bỏ bài trùng lặp (Strict Deduplication)
export function filterDuplicateTracks(trackList) {
  const seenTitles = new Set();
  const result = [];

  for (const track of trackList) {
    const key = normalizeTrackTitle(track.title);
    if (!key) {
      result.push(track);
      continue;
    }
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      result.push(track);
    }
  }
  return result;
}

// Danh sách bài hát chuẩn đã qua lọc trùng lặp
export const PRESET_TRACKS = filterDuplicateTracks(RAW_PRESET_TRACKS);

export const MUSIC_CATEGORIES = [
  { id: 'all', label: 'Tất cả (32)', icon: '🎵' },
  { id: 'kahoot', label: '⚡ Kahoot Sát Hạch (2)', icon: '⚡' },
  { id: 'acv-drill', label: '🔥 Drill TikTok ACV (7)', icon: '🔥' },
  { id: 'vua-drill', label: '🖤 Tình Ca Drill (23)', icon: '🖤' },
  { id: 'custom', label: '🔗 Tùy chọn riêng', icon: '🔗' }
];

class MusicService {
  constructor() {
    this.tracks = PRESET_TRACKS;
    this.currentTrackId = 'kahoot-original'; // Mặc định mở đầu bằng Kahoot sôi động
    this.isPlaying = false;
    this.volume = 0.5;
    this.isMuted = false;
    this.listeners = new Set();
    this.audioElement = null;
    this.iframeElement = null;
    this.customUrl = '';
    this.customTitle = '';
    this.activeCategory = 'all';

    // Khôi phục cài đặt đã lưu
    if (typeof window !== 'undefined') {
      try {
        const savedTrackId = localStorage.getItem('rmsa_music_track_id');
        const savedCustomUrl = localStorage.getItem('rmsa_user_music_link');
        const savedCustomTitle = localStorage.getItem('rmsa_user_music_title');
        const savedVol = localStorage.getItem('rmsa_music_volume');

        if (savedTrackId && (this.tracks.some(t => t.id === savedTrackId) || savedTrackId === 'custom')) {
          this.currentTrackId = savedTrackId;
        }
        if (savedCustomUrl) this.customUrl = savedCustomUrl;
        if (savedCustomTitle) this.customTitle = savedCustomTitle;
        if (savedVol !== null) {
          const v = parseFloat(savedVol);
          if (!isNaN(v) && v >= 0 && v <= 1) this.volume = v;
        }
      } catch {}
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(state);
      } catch (e) {
        console.warn('Listener error in MusicService:', e);
      }
    }
  }

  getCurrentTrack() {
    if (this.currentTrackId === 'custom') {
      const ytId = extractYouTubeId(this.customUrl);
      return {
        id: 'custom',
        title: this.customTitle || (ytId ? 'Link YouTube Tùy Chọn' : (this.customUrl ? 'Nhạc Tùy Chọn' : 'Chưa có link')),
        category: 'custom',
        categoryName: '🔗 Tùy chọn riêng',
        youtubeId: ytId,
        url: this.customUrl,
        startTime: 0,
        tag: 'Link riêng',
        mood: 'Tự chọn'
      };
    }
    return this.tracks.find(t => t.id === this.currentTrackId) || this.tracks[0];
  }

  getState() {
    const current = this.getCurrentTrack();
    const isYt = Boolean(current.youtubeId);
    return {
      isPlaying: this.isPlaying,
      currentTrack: current,
      currentTrackId: this.currentTrackId,
      tracks: this.tracks,
      categories: MUSIC_CATEGORIES,
      activeCategory: this.activeCategory,
      volume: this.volume,
      isMuted: this.isMuted,
      isYouTube: isYt,
      youtubeId: current.youtubeId,
      customUrl: this.customUrl,
      customTitle: this.customTitle,
      hasLink: Boolean(current.youtubeId || current.url || this.tracks.length > 0)
    };
  }

  setCategory(catId) {
    this.activeCategory = catId;
    this.notify();
  }

  // Quản lý Single Iframe duy nhất trên DOM toàn ứng dụng (Tránh trùng lặp âm thanh)
  ensureIframe() {
    if (typeof document === 'undefined') return null;

    let iframe = document.getElementById('rmsa-global-yt-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'rmsa-global-yt-iframe';
      iframe.title = 'RMSA Background Audio Engine';
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      iframe.setAttribute('allow', 'autoplay');
      document.body.appendChild(iframe);
    }
    this.iframeElement = iframe;
    return iframe;
  }

  // 1-Click: Bấm là phát, bấm lại là dừng
  async togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
    return { isPlaying: this.isPlaying };
  }

  // Chọn bài hát và tự động nhảy vào đúng điệp khúc
  selectTrack(trackId, shouldPlay = true) {
    if (trackId === 'custom') {
      this.currentTrackId = 'custom';
    } else {
      const found = this.tracks.find(t => t.id === trackId);
      if (found) {
        this.currentTrackId = found.id;
      }
    }

    try {
      localStorage.setItem('rmsa_music_track_id', this.currentTrackId);
    } catch {}

    if (shouldPlay) {
      this.play();
    } else {
      this.notify();
    }
  }

  // Chuyển sang bài kế tiếp
  nextTrack() {
    const list = this.activeCategory === 'all'
      ? this.tracks
      : this.tracks.filter(t => t.category === this.activeCategory);

    if (list.length === 0) return;

    const idx = list.findIndex(t => t.id === this.currentTrackId);
    const nextIdx = (idx + 1) % list.length;
    this.selectTrack(list[nextIdx].id, this.isPlaying);
  }

  // Quay lại bài trước
  prevTrack() {
    const list = this.activeCategory === 'all'
      ? this.tracks
      : this.tracks.filter(t => t.category === this.activeCategory);

    if (list.length === 0) return;

    const idx = list.findIndex(t => t.id === this.currentTrackId);
    const prevIdx = (idx - 1 + list.length) % list.length;
    this.selectTrack(list[prevIdx].id, this.isPlaying);
  }

  async play() {
    const track = this.getCurrentTrack();
    this.isPlaying = true;
    this.notify();

    if (track.youtubeId) {
      this.playYouTube(track.youtubeId, track.startTime || 0);
    } else if (track.url) {
      this.playHtmlAudio(track.url);
    }
  }

  playYouTube(ytId, startTime = 0) {
    // Dừng HTML Audio nếu có
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch {}
      this.audioElement = null;
    }

    const iframe = this.ensureIframe();
    if (!iframe) return;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const targetSrc = `https://www.youtube.com/embed/${ytId}?enablejsapi=1&autoplay=1&start=${startTime}&loop=1&playlist=${ytId}&origin=${encodeURIComponent(origin)}`;

    // Kiểm tra xem iframe đã tải video này chưa
    const currentSrc = iframe.getAttribute('src') || '';
    const isSameVideo = currentSrc.includes(ytId);

    if (isSameVideo && iframe.contentWindow) {
      try {
        // Cùng 1 video (ví dụ chuyển bài trong cùng mixtape Vua Drill hoặc ACV): Seek trực tiếp tới giây điệp khúc
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [startTime, true] }),
          '*'
        );
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
        const ytVol = this.isMuted ? 0 : Math.round(this.volume * 100);
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [ytVol] }),
          '*'
        );
      } catch {
        iframe.src = targetSrc;
      }
    } else {
      // Khác video: tải lại src với param start điệp khúc
      iframe.src = targetSrc;
    }
  }

  playHtmlAudio(url) {
    // Dừng YouTube iframe nếu đang phát
    if (this.iframeElement && this.iframeElement.contentWindow) {
      try {
        this.iframeElement.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
      } catch {}
    }

    try {
      if (!this.audioElement || this.audioElement.src !== url) {
        this.audioElement = new Audio(url);
        this.audioElement.loop = true;
      }
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
      this.audioElement.play().catch(err => {
        console.warn('Cannot autoplay audio file:', err);
      });
    } catch (e) {
      console.warn('HTML5 Audio error:', e);
    }
  }

  pause() {
    this.isPlaying = false;
    this.stopMedia();
    this.notify();
  }

  stopMedia() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch {}
    }

    if (this.iframeElement && this.iframeElement.contentWindow) {
      try {
        this.iframeElement.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
      } catch {}
    }
  }

  setVolume(vol) {
    const v = Math.max(0, Math.min(1, vol));
    this.volume = v;
    if (v > 0) this.isMuted = false;

    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : v;
    }

    if (this.iframeElement && this.iframeElement.contentWindow) {
      try {
        const ytVol = this.isMuted ? 0 : Math.round(v * 100);
        this.iframeElement.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [ytVol] }),
          '*'
        );
      } catch {}
    }

    try {
      localStorage.setItem('rmsa_music_volume', String(v));
    } catch {}
    this.notify();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
  }

  setCustomLink(url, title = '') {
    const cleanUrl = String(url || '').trim();
    this.customUrl = cleanUrl;
    this.customTitle = title.trim();

    try {
      localStorage.setItem('rmsa_user_music_link', cleanUrl);
      localStorage.setItem('rmsa_user_music_title', this.customTitle);
    } catch {}

    if (cleanUrl) {
      this.selectTrack('custom', true);
    } else {
      this.selectTrack('kahoot-original', false);
    }
  }

  clearCustomLink() {
    this.customUrl = '';
    this.customTitle = '';
    try {
      localStorage.removeItem('rmsa_user_music_link');
      localStorage.removeItem('rmsa_user_music_title');
    } catch {}
    this.selectTrack('kahoot-original', false);
  }
}

export const musicService = new MusicService();
export default musicService;
