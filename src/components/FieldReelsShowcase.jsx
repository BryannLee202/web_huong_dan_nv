import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Plus,
  Trash2,
  ExternalLink,
  X,
  Sparkles,
  Film,
  Flame,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';

const DEFAULT_REELS = [
  {
    id: 'reel_fb_1',
    title: 'Thực Địa Dẫn Khách & Chốt Cọc Căn Hộ Thực Chiến',
    subtitle: 'Tình huống thực tế xử lý tâm lý khách xem phòng và bẻ từ chối ngay tại căn hộ.',
    platform: 'facebook',
    videoUrl: 'https://www.facebook.com/reel/1821834182135514',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    author: 'Đan Rin (HLV Trưởng)',
    tag: '🔥 Facebook Reel',
    viewsLabel: 'Thực chiến RMSA'
  },
  {
    id: 'reel_tiktok_1',
    title: 'Cảm Hứng Không Gian & Trải Nghiệm Chuyển Động Hiện Đại',
    subtitle: 'Góc nhìn trực quan, sinh động và cuốn hút chuẩn xu hướng dẫn phòng thế hệ mới.',
    platform: 'tiktok',
    videoUrl: 'https://www.tiktok.com/@neongo/video/7693034526401924372',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    author: 'Ban Đào Tạo RMSA',
    tag: '🎵 TikTok Trend',
    viewsLabel: 'Xu hướng mới'
  },
  {
    id: 'reel_duplex_3',
    title: 'Tour Khảo Sát Giỏ Hàng Duplex Gác Cao 5.8Tr Bình Thạnh',
    subtitle: 'Checklist 15 phút chuẩn bị phòng, bật đèn vàng ấm và mở rèm ban công đón khách.',
    platform: 'facebook',
    videoUrl: 'https://www.facebook.com/reel/1821834182135514',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    author: 'Đan Rin (Running Man)',
    tag: '🏢 Giỏ Hàng Duplex',
    viewsLabel: 'Mẫu chuẩn 100%'
  },
  {
    id: 'reel_closing_4',
    title: 'Bí Kíp Quy Đổi 16.000đ/Ngày Bẻ Gãy Lời Chê Giá Cao',
    subtitle: 'Tuyệt chiêu chia nhỏ chi phí giúp khách hàng gật đầu giữ cọc trong 30 giây.',
    platform: 'tiktok',
    videoUrl: 'https://www.tiktok.com/@neongo/video/7693034526401924372',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
    author: 'Đan Rin (HLV Trưởng)',
    tag: '⚡ Chốt Cọc 30s',
    viewsLabel: 'Tỷ lệ chốt +40%'
  }
];

function getEmbedDetails(videoUrl = '') {
  const url = String(videoUrl || '').trim();
  const tiktokMatch = url.match(/tiktok\.com\/.*\/video\/(\d+)/i);
  if (tiktokMatch && tiktokMatch[1]) {
    return {
      type: 'tiktok',
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
      originalUrl: url
    };
  }

  if (url.includes('facebook.com/reel/') || url.includes('facebook.com/watch') || url.includes('fb.watch')) {
    return {
      type: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=380`,
      originalUrl: url
    };
  }

  const ytMatch = url.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      originalUrl: url
    };
  }

  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    return {
      type: 'direct',
      embedUrl: url,
      originalUrl: url
    };
  }

  return {
    type: 'external',
    embedUrl: url,
    originalUrl: url
  };
}

export default function FieldReelsShowcase({ isAdmin = false, currentUser = null }) {
  const [reels, setReels] = useState(DEFAULT_REELS);
  const [activeReel, setActiveReel] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reelToDelete, setReelToDelete] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newThumbUrl, setNewThumbUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const fetchReels = useCallback(async () => {
    try {
      const list = await api.community.getReels();
      if (Array.isArray(list) && list.length > 0) {
        setReels(list);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchReels();
    const timer = setInterval(fetchReels, 12000);
    return () => clearInterval(timer);
  }, [fetchReels]);

  const handleAddReel = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newVideoUrl.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await api.community.createReel({
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || 'Thước phim thực chiến dẫn phòng & chốt cọc nội bộ Running Man.',
        videoUrl: newVideoUrl.trim(),
        thumbnailUrl: newThumbUrl.trim() || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        author: currentUser?.fullName || currentUser?.name || 'Đan Rin (HLV Trưởng)'
      });
      if (res.success && Array.isArray(res.reels)) {
        setReels(res.reels);
      }
      setNewTitle('');
      setNewSubtitle('');
      setNewVideoUrl('');
      setNewThumbUrl('');
      setIsAddModalOpen(false);
      showToast('Đã thêm Thước phim thực chiến & đồng bộ lên mọi thiết bị!');
    } catch (err) {
      showToast(err.message || 'Không thể thêm thước phim');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!reelToDelete) return;
    const id = reelToDelete.id;
    setReels(prev => prev.filter(r => r.id !== id));
    setReelToDelete(null);
    try {
      const res = await api.community.deleteReel(id);
      if (res.success && Array.isArray(res.reels)) {
        setReels(res.reels);
      }
      showToast('Đã xóa thước phim và đồng bộ toàn hệ thống!');
    } catch {}
  };

  return (
    <div className="bg-white dark:bg-[#1e1c1a] rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-xs space-y-3.5 relative overflow-hidden animate-card-reveal">
      {/* Hào quang chuyển động nhẹ phía sau */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-amber-500/10 blur-2xl pointer-events-none animate-aurora" />

      {toast && (
        <div className="fixed top-20 right-4 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-white shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Thước Phim Thực Chiến */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-orange-500 text-white flex items-center justify-center shadow-sm animate-pulse-ring shrink-0">
            <Film className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                Thước Phim Thực Địa (Reels & TikTok)
              </h3>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60">
                <Flame className="w-3 h-3 fill-rose-500 text-rose-500 animate-flame-beat" />
                <span>LIVE MOTION</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Vuốt ngang trên điện thoại hoặc chạm vào thẻ để xem video dẫn phòng & cảm hứng thực chiến
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 btn-shimmer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Thêm Reel / TikTok</span>
          </button>
        )}
      </div>

      {/* Dải Thước Phim: Vuốt ngang mượt chuẩn Facebook Reels trên Mobile + Grid 4 cột trên Desktop */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 -mx-1 px-1">
        {reels.map((reel, idx) => (
          <div
            key={reel.id}
            onClick={() => setActiveReel(reel)}
            className={`group relative shrink-0 w-[210px] sm:w-auto h-[270px] sm:h-[260px] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/[0.1] cursor-pointer snap-start hover-3d-card animate-card-reveal stagger-${(idx % 4) + 1}`}
          >
            {/* Ảnh nền có hiệu ứng Zoom Parallax mượt khi chạm/di chuột */}
            <img
              src={reel.thumbnailUrl}
              alt={reel.title}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80';
              }}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Lớp phủ Gradient Điện Ảnh */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/35 to-slate-950/30" />

            {/* Badge nền tảng góc trên trái */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black backdrop-blur-md border shadow-2xs ${
                reel.platform === 'tiktok'
                  ? 'bg-slate-900/80 text-cyan-300 border-cyan-400/40'
                  : 'bg-blue-600/85 text-white border-blue-400/40'
              }`}>
                {reel.tag}
              </span>

              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReelToDelete(reel);
                  }}
                  title="Xóa thước phim này"
                  className="w-7 h-7 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Nút Play lơ lửng chính giữa với sóng tỏa tròn */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/60 text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-115 group-hover:bg-blue-600/90 animate-pulse-ring">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </div>

            {/* Thông tin tiêu đề góc dưới */}
            <div className="absolute bottom-0 inset-x-0 p-3.5 text-left space-y-1">
              <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-300">
                <Sparkles className="w-3 h-3 shrink-0" />
                <span className="truncate">{reel.author} • {reel.viewsLabel}</span>
              </div>
              <h4 className="text-xs sm:text-[13px] font-extrabold text-white leading-snug line-clamp-2 group-hover:text-amber-200 transition-colors">
                {reel.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL XEM THƯỚC PHIM TRỰC TIẾP (HỖ TRỢ TIKTOK EMBED, FACEBOOK REEL & MỞ APP TRÊN ĐIỆN THOẠI) */}
      {activeReel && (() => {
        const embed = getEmbedDetails(activeReel.videoUrl);
        return (
          <div
            onClick={() => setActiveReel(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95"
            >
              {/* Modal Top Bar */}
              <div className="p-3.5 px-4 border-b border-white/10 flex items-center justify-between gap-2 bg-slate-950/60">
                <div className="text-left min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                    {activeReel.tag} • {activeReel.author}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {activeReel.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveReel(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Khung phát Video / Embed */}
              <div className="relative bg-black flex-1 min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden">
                {embed.type === 'tiktok' || embed.type === 'facebook' || embed.type === 'youtube' ? (
                  <iframe
                    src={embed.embedUrl}
                    title={activeReel.title}
                    className="w-full h-[420px] sm:h-[480px] border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : embed.type === 'direct' ? (
                  <video
                    src={embed.embedUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[460px] object-contain"
                  />
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <img
                      src={activeReel.thumbnailUrl}
                      alt={activeReel.title}
                      className="w-40 h-40 object-cover rounded-2xl mx-auto border border-white/20"
                    />
                    <p className="text-xs text-slate-300">{activeReel.subtitle}</p>
                  </div>
                )}
              </div>

              {/* Thanh công cụ dưới: Mở trực tiếp trên App Facebook / TikTok (Cực tiện trên Điện Thoại) */}
              <div className="p-3.5 bg-slate-950 border-t border-white/10 flex items-center justify-between gap-3">
                <p className="text-[11px] text-slate-300 text-left line-clamp-2 flex-1">
                  {activeReel.subtitle}
                </p>
                <a
                  href={activeReel.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center space-x-1.5 shrink-0 shadow-md"
                >
                  <span>Mở ứng dụng gốc</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL XÁC NHẬN XÓA REEL (ADMIN) */}
      {reelToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/10 rounded-3xl max-w-sm w-full p-5 text-left space-y-4 shadow-2xl">
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Xóa thước phim thực chiến này?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thước phim <strong>"{reelToDelete.title}"</strong> sẽ được gỡ khỏi trang chủ của toàn bộ nhân viên.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReelToDelete(null)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM THƯỚC PHIM MỚI (ADMIN) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#202020] border border-slate-200 dark:border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl text-left">
            <div className="p-4 px-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                + Thêm Thước Phim Thực Địa (Reel / TikTok)
              </h4>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddReel} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tiêu đề thước phim *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thực chiến dẫn khách chốt căn Duplex Quận 1"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Đường dẫn Video (Facebook Reel / TikTok / YouTube / MP4) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.facebook.com/reel/... hoặc https://www.tiktok.com/..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mô tả ngắn gọn
                </label>
                <input
                  type="text"
                  placeholder="Bí quyết xử lý tình huống thực tế..."
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ảnh bìa Thumbnail (Tùy chọn)
                </label>
                <input
                  type="url"
                  placeholder="Để trống sẽ tự dùng ảnh căn hộ Duplex mẫu"
                  value={newThumbUrl}
                  onChange={(e) => setNewThumbUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Đăng & Đồng bộ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
