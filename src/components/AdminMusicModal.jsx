import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  Music, 
  Music2,
  Play, 
  Pause, 
  Trash2, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Link2, 
  Plus, 
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { api } from '../services/api';
import musicService from '../services/musicService';
import { VinylRecordIcon } from './ChillMusicPlayer';

export function formatSecondsToTime(totalSeconds = 0) {
  const sec = Math.max(0, parseInt(totalSeconds, 10) || 0);
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function AdminMusicModal({ isOpen, onClose, onRefreshPlaylist }) {
  const [activeTab, setActiveTab] = useState('ai-upload'); // 'ai-upload' | 'manage-list'
  
  // AI Link Analysis State
  const [inputUrl, setInputUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzedTracks, setAnalyzedTracks] = useState([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState(new Set());
  const [isSavingBatch, setIsSavingBatch] = useState(false);

  // Existing Tracks Management State
  const [existingTracks, setExistingTracks] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  // Preview Audio State (Phát thử 5 giây điệp khúc)
  const [previewTrackId, setPreviewTrackId] = useState(null);
  const previewTimerRef = useRef(null);

  // Toast notification
  const [toast, setToast] = useState({ type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast({ type: '', message: '' });
    }, 4000);
  };

  // Tải danh sách bài hát hiện tại từ database
  const loadExistingTracks = async () => {
    setLoadingExisting(true);
    try {
      const tracks = await api.music.getAdminTracks();
      setExistingTracks(tracks || []);
    } catch (err) {
      showToast('error', `Lỗi tải danh sách nhạc: ${err.message}`);
    } finally {
      setLoadingExisting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadExistingTracks();
    } else {
      // Dọn dẹp timer nghe thử khi đóng modal
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    }
  }, [isOpen]);

  // Phân tích link YouTube bằng AI
  const handleAnalyzeLink = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanUrl = inputUrl.trim();
    if (!cleanUrl) {
      showToast('error', 'Vui lòng dán đường link YouTube cần phân tích.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalyzedTracks([]);
    setSelectedTrackIds(new Set());

    try {
      const res = await api.music.analyzeLink(cleanUrl);
      if (res && res.success && Array.isArray(res.tracks)) {
        setAnalysisResult(res);
        setAnalyzedTracks(res.tracks);
        // Mặc định chọn tất cả bài hát vừa phân tích
        setSelectedTrackIds(new Set(res.tracks.map(t => t.id)));
        showToast('success', res.message || `Đã phân tích thành công ${res.tracks.length} bài hát!`);
      } else {
        throw new Error(res?.message || 'Không thể phân tích dữ liệu âm nhạc từ link này.');
      }
    } catch (err) {
      showToast('error', err.message || 'Lỗi khi phân tích đường link. Vui lòng thử lại.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle chọn bài
  const handleToggleSelectTrack = (trackId) => {
    setSelectedTrackIds(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  };

  const handleSelectAllTracks = () => {
    if (selectedTrackIds.size === analyzedTracks.length) {
      setSelectedTrackIds(new Set());
    } else {
      setSelectedTrackIds(new Set(analyzedTracks.map(t => t.id)));
    }
  };

  // Cập nhật thông tin trực tiếp trên bảng preview trước khi lưu
  const handleUpdateAnalyzedTrack = (index, field, value) => {
    setAnalyzedTracks(prev => {
      const clone = [...prev];
      if (clone[index]) {
        clone[index] = { ...clone[index], [field]: value };
        if (field === 'startTime') {
          const sec = parseInt(value, 10) || 0;
          clone[index].tag = `Điệp khúc ${formatSecondsToTime(sec)}`;
        }
      }
      return clone;
    });
  };

  // Nghe thử 5 giây tại mốc Điệp Khúc
  const handlePreviewChorus = (track) => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);

    if (previewTrackId === track.id) {
      // Đang nghe thử bài này -> tạm dừng
      musicService.pause();
      setPreviewTrackId(null);
      return;
    }

    setPreviewTrackId(track.id);
    // Sử dụng musicService để phát video tại đúng mốc startTime
    musicService.selectTrack(track.id, {
      ...track,
      startTime: parseInt(track.startTime, 10) || 0
    });

    // Tự động tạm dừng sau 6 giây
    previewTimerRef.current = setTimeout(() => {
      musicService.pause();
      setPreviewTrackId(null);
    }, 6000);
  };

  // Lưu hàng loạt bài hát đã chọn vào kho nhạc hệ thống
  const handleSaveSelectedTracks = async () => {
    const tracksToSave = analyzedTracks.filter(t => selectedTrackIds.has(t.id));
    if (tracksToSave.length === 0) {
      showToast('error', 'Vui lòng chọn ít nhất 1 bài hát để lưu.');
      return;
    }

    setIsSavingBatch(true);
    try {
      const res = await api.music.saveBatch(tracksToSave);
      if (res && res.success) {
        showToast('success', res.message || `Đã lưu thành công ${tracksToSave.length} bài hát vào kho nhạc!`);
        setInputUrl('');
        setAnalysisResult(null);
        setAnalyzedTracks([]);
        setSelectedTrackIds(new Set());
        await loadExistingTracks();
        if (onRefreshPlaylist) onRefreshPlaylist();
        await musicService.reloadTracks();
        setActiveTab('manage-list');
      } else {
        throw new Error(res?.message || 'Lỗi khi lưu bài hát vào database.');
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSavingBatch(false);
    }
  };

  // Xóa 1 bài hát khỏi kho nhạc
  const handleDeleteTrack = async (trackId, trackTitle) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài hát "${trackTitle}" khỏi kho nhạc của toàn bộ hệ thống không?`)) {
      return;
    }

    setDeletingId(trackId);
    try {
      const res = await api.music.deleteTrack(trackId);
      if (res && res.success) {
        showToast('success', `Đã xóa bài hát "${trackTitle}".`);
        setExistingTracks(prev => prev.filter(t => t.id !== trackId));
        if (onRefreshPlaylist) onRefreshPlaylist();
        await musicService.reloadTracks();
      } else {
        throw new Error(res?.message || 'Lỗi khi xóa bài hát.');
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Khôi phục kho nhạc về 32 bài mặc định
  const handleResetToDefault = async () => {
    if (!window.confirm('Hành động này sẽ khôi phục kho nhạc về danh sách 32 bài hát mẫu chuẩn chất lượng cao. Bạn có chắc chắn muốn khôi phục không?')) {
      return;
    }

    setIsResetting(true);
    try {
      const res = await api.music.resetDefault();
      if (res && res.success) {
        showToast('success', 'Đã khôi phục thành công 32 bài hát chuẩn!');
        await loadExistingTracks();
        if (onRefreshPlaylist) onRefreshPlaylist();
        await musicService.reloadTracks();
      } else {
        throw new Error(res?.message || 'Lỗi khi khôi phục kho nhạc.');
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsResetting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#1a1c23] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. HEADER MODAL */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-900/60">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-500 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                  Quản Trị Kho Nhạc & AI Tách Điệp Khúc
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Only</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Chỉ Quản trị viên mới có quyền cập nhật • AI tự động phân rã Playlist & tìm đoạn điệp khúc
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TOAST THÔNG BÁO NHANH */}
        {toast.message && (
          <div className={`px-4 py-2.5 text-xs font-bold flex items-center space-x-2 transition-all ${
            toast.type === 'error'
              ? 'bg-rose-500 text-white'
              : 'bg-emerald-500 text-white'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
            <span className="truncate">{toast.message}</span>
          </div>
        )}

        {/* 2. TAB NAVIGATION */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-2 shrink-0 bg-white dark:bg-[#1a1c23]">
          <button
            type="button"
            onClick={() => setActiveTab('ai-upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'ai-upload'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Bóc Tách Link / Playlist</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('manage-list'); loadExistingTracks(); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'manage-list'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>Kho Nhạc Hiện Có ({existingTracks.length})</span>
          </button>
        </div>

        {/* 3. NỘI DUNG CHÍNH (SCROLLABLE BODY) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {activeTab === 'ai-upload' ? (
            <div className="space-y-4">
              {/* Form dán link */}
              <form onSubmit={handleAnalyzeLink} className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <Link2 className="w-4 h-4 text-amber-500" />
                    <span>Dán đường link YouTube (Bài lẻ hoặc Playlist / Mixtape):</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Hỗ trợ: watch?v=..., playlist?list=..., youtu.be/...</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... hoặc https://www.youtube.com/playlist?list=..."
                    disabled={isAnalyzing}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-amber-500 placeholder:text-slate-400"
                  />

                  <button
                    type="submit"
                    disabled={isAnalyzing || !inputUrl.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white text-xs font-black shadow-xs flex items-center justify-center space-x-2 shrink-0 cursor-pointer transition-all"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>AI Đang Phân Tích...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Bắt Đầu Bóc Tách AI</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  💡 <strong>Gợi ý:</strong> Khi dán link Playlist, AI sẽ tự động tách từng bài riêng ra và phát hiện giây điệp khúc hay nhất để cắt sẵn cho học viên nghe!
                </p>
              </form>

              {/* Bảng kết quả phân tích & xem trước */}
              {analyzedTracks.length > 0 && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleSelectAllTracks}
                        className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1 hover:text-amber-500 cursor-pointer"
                      >
                        {selectedTrackIds.size === analyzedTracks.length ? (
                          <CheckSquare className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                        <span>Chọn tất cả ({selectedTrackIds.size}/{analyzedTracks.length})</span>
                      </button>

                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                        {analysisResult?.mode === 'playlist' ? '📂 Danh sách Playlist' : '🎵 Bài hát đơn lẻ'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveSelectedTracks}
                      disabled={isSavingBatch || selectedTrackIds.size === 0}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all"
                    >
                      {isSavingBatch ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Lưu {selectedTrackIds.size} bài vào Kho Nhạc</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {analyzedTracks.map((track, idx) => {
                      const isSelected = selectedTrackIds.has(track.id);
                      const isPreviewing = previewTrackId === track.id;

                      return (
                        <div
                          key={track.id}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-800'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => handleToggleSelectTrack(track.id)}
                              className="cursor-pointer shrink-0"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-5 h-5 text-amber-500" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-400" />
                              )}
                            </button>

                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative flex items-center justify-center">
                              {track.thumbnailUrl ? (
                                <img src={track.thumbnailUrl} alt={track.title} className="w-full h-full object-cover" />
                              ) : (
                                <Music className="w-4 h-4 text-slate-400" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <input
                                type="text"
                                value={track.title}
                                onChange={(e) => handleUpdateAnalyzedTrack(idx, 'title', e.target.value)}
                                className="w-full px-2 py-1 rounded-lg text-xs font-black text-slate-900 dark:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-transparent focus:border-amber-500 focus:outline-none"
                              />
                              <div className="flex items-center space-x-2 mt-0.5 px-2">
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                                  🎯 {track.tag}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ID: {track.youtubeId}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bộ chỉnh giây Điệp Khúc & Nghe thử 5s */}
                          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                            <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Giây:</span>
                              <input
                                type="number"
                                min="0"
                                value={track.startTime}
                                onChange={(e) => handleUpdateAnalyzedTrack(idx, 'startTime', parseInt(e.target.value, 10) || 0)}
                                className="w-14 px-1.5 py-0.5 text-center text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-600 focus:outline-none focus:border-amber-500"
                              />
                              <span className="text-[10px] font-mono text-slate-400">({formatSecondsToTime(track.startTime)})</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handlePreviewChorus(track)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                                isPreviewing
                                  ? 'bg-rose-500 text-white shadow-xs animate-pulse'
                                  : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                              }`}
                              title="Nghe thử 5 giây đoạn điệp khúc"
                            >
                              {isPreviewing ? (
                                <>
                                  <Pause className="w-3.5 h-3.5" />
                                  <span>Dừng</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 ml-0.5" />
                                  <span>Thử 5s</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: QUẢN LÝ DANH SÁCH BÀI HÁT HIỆN CÓ */
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Danh sách bài hát đang phát hành trên hệ thống
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Học viên sẽ nghe trực tiếp các bài hát này khi bấm vào Đĩa than
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    disabled={isResetting}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    title="Khôi phục lại 32 bài mặc định ban đầu"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                    <span>Khôi phục 32 bài gốc</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('ai-upload')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center space-x-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm nhạc mới</span>
                  </button>
                </div>
              </div>

              {loadingExisting ? (
                <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center space-y-2">
                  <span className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải danh sách bài hát...</span>
                </div>
              ) : existingTracks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Kho nhạc hiện đang trống. Hãy thêm bài hát mới hoặc bấm "Khôi phục 32 bài gốc".
                </div>
              ) : (
                <div className="space-y-2">
                  {existingTracks.map((track, idx) => (
                    <div
                      key={track.id}
                      className="px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-blue-400/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0 w-6 text-center">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {track.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              🎯 {track.tag || `Điệp khúc ${formatSecondsToTime(track.startTime)}`}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({formatSecondsToTime(track.startTime)})
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium truncate max-w-[120px]">
                              {track.categoryName || track.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handlePreviewChorus(track)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            previewTrackId === track.id
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white'
                          }`}
                          title="Nghe thử 5s điệp khúc"
                        >
                          {previewTrackId === track.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTrack(track.id, track.title)}
                          disabled={deletingId === track.id}
                          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                          title="Xóa bài hát khỏi hệ thống"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. FOOTER MODAL */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between shrink-0 text-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            💡 Tự động đồng bộ tới trình phát của toàn bộ học viên khi Quản trị viên cập nhật.
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
