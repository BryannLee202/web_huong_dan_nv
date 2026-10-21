/**
 * RMSA Chill & Quiz Music Service
 * Trình quản lý âm thanh nền tập trung & trắc nghiệm dành cho Running Man Sales Academy
 * - Tích hợp bộ phát Web Audio API Synthesizer (Lofi, Quiz Arp, Alpha Wave, Suspense)
 * - Tự động phát file MP3 nếu có trong thư mục public/audio/ hoặc link người dùng cung cấp
 * - Tự động chuyển đổi mượt mà giữa các chế độ, ghi nhớ âm lượng và trạng thái
 */

// Danh sách bài hát & thể loại mặc định
export const DEFAULT_TRACKS = [
  {
    id: 'lofi-study',
    title: 'Lofi Chill Bất Động Sản',
    artist: 'RMSA Chillhop Studio',
    genre: 'Lofi Hip-Hop • Thư Giãn',
    description: 'Nhịp beat 75 BPM êm dịu, tiếng đàn piano ấm áp giúp giảm stress khi đọc tài liệu & chốt cọc.',
    synthType: 'lofi',
    url: '/audio/lofi-study.mp3',
    icon: '☕'
  },
  {
    id: 'kahoot-vibe',
    title: 'Đấu Trường Trí Tuệ (Kahoot Vibe)',
    artist: 'Quiz Arcade Beats',
    genre: 'Game Show • Hào Hứng',
    description: 'Nhịp điệu dồn dập, vui nhộn kiểu Kahoot / Quizizz, kích thích phản xạ tư duy nhanh khi làm bài trắc nghiệm.',
    synthType: 'quiz',
    url: '/audio/kahoot-quiz.mp3',
    icon: '⚡'
  },
  {
    id: 'alpha-focus',
    title: 'Sóng Não Alpha 432Hz',
    artist: 'Deep Focus Ambient',
    genre: 'Dương Cầm • Ghi Nhớ Sâu',
    description: 'Kích thích tần số sóng não 8-12Hz giúp học viên ghi nhớ kiến thức pháp lý và PCCC nhanh hơn.',
    synthType: 'alpha',
    url: '/audio/alpha-focus.mp3',
    icon: '🧠'
  },
  {
    id: 'millionaire',
    title: 'Ai Là Triệu Phú (Cân Nhắc Đáp Án)',
    artist: 'Suspense Quiz Theme',
    genre: 'Kịch Tính • Phân Tích',
    description: 'Giai điệu đồng hồ đếm ngược từng nhịp tim đập, kinh điển khi đứng trước các câu hỏi tình huống khó.',
    synthType: 'suspense',
    url: '/audio/millionaire.mp3',
    icon: '🎯'
  },
  {
    id: 'cafe-rain',
    title: 'Quán Cafe Ngày Mưa',
    artist: 'Rainy Day Acoustic',
    genre: 'Acoustic • Bình Yên',
    description: 'Tiếng mưa rơi nhẹ kết hợp guitar mộc, phù hợp khi ngồi telesale và nghiên cứu giỏ hàng căn hộ.',
    synthType: 'cafe',
    url: '/audio/cafe-rain.mp3',
    icon: '🌧️'
  }
];

class MusicService {
  constructor() {
    this.tracks = [...DEFAULT_TRACKS];
    this.currentTrackId = 'lofi-study';
    this.isPlaying = false;
    this.volume = 0.45; // Âm lượng nền mặc định dễ chịu 45%
    this.isMuted = false;
    this.listeners = new Set();
    this.audioElement = null;
    this.audioCtx = null;
    this.synthInterval = null;
    this.synthMasterGain = null;

    // Khôi phục tùy chọn đã lưu
    if (typeof window !== 'undefined') {
      try {
        const savedVol = localStorage.getItem('rmsa_music_volume');
        if (savedVol !== null) {
          const v = parseFloat(savedVol);
          if (!isNaN(v) && v >= 0 && v <= 1) this.volume = v;
        }
        const savedTrack = localStorage.getItem('rmsa_music_track_id');
        if (savedTrack && this.tracks.some(t => t.id === savedTrack)) {
          this.currentTrackId = savedTrack;
        }
        const customList = JSON.parse(localStorage.getItem('rmsa_custom_tracks') || '[]');
        if (Array.isArray(customList) && customList.length > 0) {
          this.tracks = [...this.tracks, ...customList];
        }
      } catch {}
    }
  }

  // Đăng ký nhận thông báo thay đổi trạng thái
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
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.getCurrentTrack(),
      volume: this.volume,
      isMuted: this.isMuted,
      tracks: this.tracks
    };
  }

  getCurrentTrack() {
    return this.tracks.find(t => t.id === this.currentTrackId) || this.tracks[0];
  }

  setVolume(vol) {
    const v = Math.max(0, Math.min(1, vol));
    this.volume = v;
    if (v > 0) this.isMuted = false;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : v;
    }
    if (this.synthMasterGain) {
      this.synthMasterGain.gain.setValueAtTime(this.isMuted ? 0 : v * 0.25, this.audioCtx?.currentTime || 0);
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

  setTrack(trackId) {
    const track = this.tracks.find(t => t.id === trackId);
    if (!track) return;
    this.currentTrackId = trackId;
    try {
      localStorage.setItem('rmsa_music_track_id', trackId);
    } catch {}

    if (this.isPlaying) {
      this.stopAll();
      this.playCurrentTrack();
    } else {
      this.notify();
    }
  }

  addCustomTrack(track) {
    if (!track || !track.title) return;
    const newTrack = {
      id: `custom-${Date.now()}`,
      title: track.title,
      artist: track.artist || 'Tùy chỉnh',
      genre: track.genre || 'Người dùng tải lên',
      description: track.description || 'Bài hát do bạn bổ sung.',
      url: track.url || '',
      synthType: 'lofi',
      icon: '🎵',
      isCustom: true
    };
    this.tracks.push(newTrack);
    try {
      const customOnly = this.tracks.filter(t => t.isCustom);
      localStorage.setItem('rmsa_custom_tracks', JSON.stringify(customOnly));
    } catch {}
    this.setTrack(newTrack.id);
  }

  async togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
  }

  async play() {
    this.isPlaying = true;
    this.notify();
    await this.playCurrentTrack();
  }

  pause() {
    this.isPlaying = false;
    this.stopAll();
    this.notify();
  }

  stopAll() {
    // 1. Dừng thẻ Audio HTML5
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {}
      this.audioElement = null;
    }

    // 2. Dừng bộ phát Synthesizer
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }

    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.synthMasterGain?.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.1);
      } catch {}
    }
  }

  async playCurrentTrack() {
    const track = this.getCurrentTrack();
    if (!track) return;

    // Nếu bài có URL thực tế (.mp3 / stream link)
    if (track.url) {
      try {
        const audio = new Audio(track.url);
        audio.loop = true;
        audio.volume = this.isMuted ? 0 : this.volume;
        this.audioElement = audio;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise.catch(() => {
            // Nếu trình duyệt chặn hoặc file chưa có, tự động kích hoạt bộ synth mượt mà
            this.startSynthesizer(track.synthType || 'lofi');
          });
          return;
        }
      } catch (e) {
        console.info('Using Web Audio Synthesizer fallback for ambient track:', track.title);
      }
    }

    // Nếu không có file MP3 vật lý, phát Web Audio Synthesizer chất lượng cao
    this.startSynthesizer(track.synthType || 'lofi');
  }

  // =========================================================================
  // BỘ TỔNG HỢP ÂM THANH NỀN THỰC THỜI (WEB AUDIO API SYNTHESIZER)
  // Không cần file mạng, không sợ lỗi 404, phát tức thì 100% trên mọi máy
  // =========================================================================
  startSynthesizer(type = 'lofi') {
    if (typeof window === 'undefined') return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Master Gain & Filter
    this.synthMasterGain = this.audioCtx.createGain();
    const effGain = this.isMuted ? 0 : this.volume * 0.22;
    this.synthMasterGain.gain.setValueAtTime(effGain, this.audioCtx.currentTime);

    // Warm Lowpass Filter (tạo chất âm lofi ấm áp, không chói tai)
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'quiz' ? 1400 : 780, this.audioCtx.currentTime);

    this.synthMasterGain.connect(filter);
    filter.connect(this.audioCtx.destination);

    if (type === 'quiz') {
      this.playQuizArpeggioLoop();
    } else if (type === 'alpha') {
      this.playAlphaWaveBinauralLoop();
    } else if (type === 'suspense') {
      this.playSuspenseClockLoop();
    } else {
      this.playLofiChordsLoop();
    }
  }

  // 1. Lofi Chords Progression (Cmaj7 -> Am7 -> Dm7 -> G7)
  playLofiChordsLoop() {
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [146.83, 220.00, 261.63, 349.23], // Dm7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];
    let step = 0;

    const triggerChord = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const notes = chords[step % chords.length];
      step++;

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const noteGain = this.audioCtx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        const now = this.audioCtx.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.08, now + 0.15 + idx * 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(noteGain);
        noteGain.connect(this.synthMasterGain);

        osc.start(now + idx * 0.05);
        osc.stop(now + 2.9);
      });
    };

    triggerChord();
    this.synthInterval = setInterval(triggerChord, 3000);
  }

  // 2. Kahoot & Quiz Arcade Arpeggio (sôi động, thúc đẩy tư duy)
  playQuizArpeggioLoop() {
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    let step = 0;

    const triggerNote = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const freq = scale[step % scale.length];
      step++;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.synthMasterGain);

      osc.start(now);
      osc.stop(now + 0.38);
    };

    triggerNote();
    this.synthInterval = setInterval(triggerNote, 320);
  }

  // 3. Alpha Waves 432Hz Binaural Drone
  playAlphaWaveBinauralLoop() {
    if (!this.audioCtx) return;
    const baseFreq = 216; // A3 hài hòa
    const alphaDiff = 10; // Tần số sóng não Alpha 10Hz

    // Kênh trái
    const oscL = this.audioCtx.createOscillator();
    const gainL = this.audioCtx.createGain();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);
    gainL.gain.setValueAtTime(0.09, this.audioCtx.currentTime);
    oscL.connect(gainL);
    gainL.connect(this.synthMasterGain);
    oscL.start();

    // Kênh phải lệch 10Hz tạo nhịp binaural
    const oscR = this.audioCtx.createOscillator();
    const gainR = this.audioCtx.createGain();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(baseFreq + alphaDiff, this.audioCtx.currentTime);
    gainR.gain.setValueAtTime(0.09, this.audioCtx.currentTime);
    oscR.connect(gainR);
    gainR.connect(this.synthMasterGain);
    oscR.start();

    // Điểm xuyết nốt đàn piano ngẫu nhiên mỗi 4 giây
    const chimeFreqs = [432, 540, 648, 864];
    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx) return;
      const f = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
      const chimeOsc = this.audioCtx.createOscillator();
      const chimeGain = this.audioCtx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(f, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.gain.linearRampToValueAtTime(0.06, now + 0.1);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.synthMasterGain);

      chimeOsc.start(now);
      chimeOsc.stop(now + 3.6);
    }, 4000);
  }

  // 4. Suspense Clock Tick (Ai Là Triệu Phú)
  playSuspenseClockLoop() {
    const triggerTick = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, this.audioCtx.currentTime); // A2 deep bass pulse

      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.synthMasterGain);

      osc.start(now);
      osc.stop(now + 0.52);
    };

    triggerTick();
    this.synthInterval = setInterval(triggerTick, 1000); // 1 giây 1 nhịp đồng hồ
  }
}

// Xuất singleton instance
export const musicService = new MusicService();
export default musicService;
