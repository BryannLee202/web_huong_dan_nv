/**
 * RMSA Chill Music Service - Trình phát nhạc nền theo link người dùng
 * - Không có nhạc mẫu hay bài hát mặc định
 * - Sẵn sàng phát theo link do người dùng cung cấp (Hỗ trợ cả link YouTube & link MP3 trực tiếp)
 * - 1-Click: Bấm là phát, bấm lại là tắt
 */

// Hàm trích xuất YouTube Video ID từ mọi định dạng link
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

class MusicService {
  constructor() {
    this.musicUrl = '';
    this.musicTitle = 'Nhạc Chill & Sát Hạch';
    this.isPlaying = false;
    this.volume = 0.5;
    this.isMuted = false;
    this.listeners = new Set();
    this.audioElement = null;
    this.youtubePlayerIframe = null;

    // Khôi phục link và âm lượng đã lưu
    if (typeof window !== 'undefined') {
      try {
        const savedUrl = localStorage.getItem('rmsa_user_music_link') || '';
        const savedTitle = localStorage.getItem('rmsa_user_music_title') || '';
        const savedVol = localStorage.getItem('rmsa_music_volume');
        if (savedUrl) this.musicUrl = savedUrl;
        if (savedTitle) this.musicTitle = savedTitle;
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

  getState() {
    const isYt = Boolean(extractYouTubeId(this.musicUrl));
    return {
      isPlaying: this.isPlaying,
      musicUrl: this.musicUrl,
      musicTitle: this.musicTitle,
      volume: this.volume,
      isMuted: this.isMuted,
      isYouTube: isYt,
      youtubeId: extractYouTubeId(this.musicUrl),
      hasLink: Boolean(this.musicUrl && this.musicUrl.trim())
    };
  }

  setMusicLink(url, title = '') {
    const cleanUrl = String(url || '').trim();
    this.musicUrl = cleanUrl;
    if (title && title.trim()) {
      this.musicTitle = title.trim();
    } else {
      const ytId = extractYouTubeId(cleanUrl);
      this.musicTitle = ytId ? 'Nhạc Nền YouTube' : (cleanUrl ? 'Nhạc Nền Chill' : 'Chưa có link nhạc');
    }

    try {
      localStorage.setItem('rmsa_user_music_link', cleanUrl);
      localStorage.setItem('rmsa_user_music_title', this.musicTitle);
    } catch {}

    // Nếu đang phát thì chuyển sang phát link mới
    if (this.isPlaying) {
      this.stop();
      if (cleanUrl) {
        this.play();
      } else {
        this.isPlaying = false;
      }
    }
    this.notify();
  }

  setVolume(vol) {
    const v = Math.max(0, Math.min(1, vol));
    this.volume = v;
    if (v > 0) this.isMuted = false;
    
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : v;
    }

    // Gửi lệnh chỉnh âm lượng tới iframe YouTube (nếu đang phát)
    if (this.youtubePlayerIframe && this.youtubePlayerIframe.contentWindow) {
      try {
        const ytVol = this.isMuted ? 0 : Math.round(v * 100);
        this.youtubePlayerIframe.contentWindow.postMessage(
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

  async togglePlay() {
    if (!this.musicUrl || !this.musicUrl.trim()) {
      return { needsLink: true };
    }
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
    return { needsLink: false };
  }

  async play() {
    if (!this.musicUrl || !this.musicUrl.trim()) {
      this.isPlaying = false;
      this.notify();
      return;
    }

    this.isPlaying = true;
    this.notify();

    const ytId = extractYouTubeId(this.musicUrl);
    if (ytId) {
      // Phát qua YouTube Embed
      this.playYouTube(ytId);
    } else {
      // Phát qua HTML5 Audio (Direct MP3 / Stream link)
      this.playHtmlAudio(this.musicUrl);
    }
  }

  pause() {
    this.isPlaying = false;
    this.stop();
    this.notify();
  }

  stop() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {}
      this.audioElement = null;
    }

    if (this.youtubePlayerIframe) {
      try {
        this.youtubePlayerIframe.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
      } catch {}
    }
  }

  playHtmlAudio(url) {
    if (this.youtubePlayerIframe) {
      try {
        this.youtubePlayerIframe.contentWindow?.postMessage(
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
      this.audioElement.play().catch((err) => {
        console.warn('Cannot autoplay audio file:', err);
      });
    } catch (e) {
      console.warn('HTML5 Audio error:', e);
    }
  }

  playYouTube(ytId) {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch {}
      this.audioElement = null;
    }

    // Gửi lệnh play tới background iframe hoặc trigger qua DOM
    if (this.youtubePlayerIframe && this.youtubePlayerIframe.contentWindow) {
      try {
        this.youtubePlayerIframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
        const ytVol = this.isMuted ? 0 : Math.round(this.volume * 100);
        this.youtubePlayerIframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [ytVol] }),
          '*'
        );
      } catch {}
    }
  }

  registerYouTubeIframe(iframeEl) {
    this.youtubePlayerIframe = iframeEl;
  }
}

export const musicService = new MusicService();
export default musicService;
