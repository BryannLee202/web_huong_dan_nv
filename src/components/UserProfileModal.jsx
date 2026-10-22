import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Camera, Upload, User, Phone, MapPin, 
  Award, Flame, Trophy, Check, AlertCircle, 
  Briefcase, Tag, QrCode, Smartphone, Trash2,
  Lock, Eye, EyeOff, ShieldCheck, KeyRound
} from 'lucide-react';
import api from '../services/api';

const PRESET_AVATARS = [
  { id: 'mascot-chibi', label: 'Rin Chibi 3D', url: '/mascot-running-rin-chibi.jpg' },
  { id: 'mascot-pro', label: 'Rin Chiến Binh', url: '/mascot-running-rin.jpg' },
  { id: 'coach-rin', label: 'HLV Đan Rin', url: '/images/anh_rin_avatar.jpg' },
  { id: 'logo-crest', label: 'RMSA Crest', url: '/images/running_man_logo.png' }
];

const SKILL_SUGGESTIONS = [
  'Tư vấn Duplex/Studio',
  'Đàm phán cọc thực chiến',
  'Xử lý từ chối giá cao',
  'Dẫn khách thực địa',
  'Soi pháp lý & Quy hoạch',
  'Chốt deal trong ngày',
  'Chăm sóc khách VIP',
  'Telesale phản xạ nhanh'
];

const BRANCH_OPTIONS = [
  'RMSA - Bình Thạnh',
  'RMSA - Quận 1 (Bến Nghé)',
  'RMSA - Quận 7 (Phú Mỹ Hưng)',
  'RMSA - TP. Thủ Đức (Thảo Điền)',
  'RMSA - Phú Nhuận',
  'RMSA - Hội Sở Đào Tạo'
];

function parseUserSkills(rawSkills) {
  if (Array.isArray(rawSkills)) return rawSkills;
  if (typeof rawSkills === 'string' && rawSkills.trim()) {
    try {
      const parsed = JSON.parse(rawSkills);
      return Array.isArray(parsed) ? parsed : rawSkills.split(',').map(s => s.trim());
    } catch {
      return rawSkills.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return ['Tư vấn Duplex/Studio', 'Dẫn khách thực địa', 'Đàm phán cọc thực chiến'];
}

export default function UserProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  completedLessons = {},
  courses = []
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'badge'
  
  // Khởi tạo state từ currentUser
  const [fullName, setFullName] = useState(() => currentUser?.fullName || currentUser?.name || '');
  const [phone, setPhone] = useState(() => currentUser?.phone || '');
  const [branch, setBranch] = useState(() => currentUser?.branch || 'RMSA - Bình Thạnh');
  const [title, setTitle] = useState(() => currentUser?.title || (currentUser?.role === 'admin' ? 'Quản Trị Viên & HLV Đào Tạo' : 'Chuyên Viên Tư Vấn Thực Chiến'));
  const [bio, setBio] = useState(() => currentUser?.bio || 'Chiến binh Running Man Sales Academy - Chốt deal thực chiến.');
  const [skills, setSkills] = useState(() => parseUserSkills(currentUser?.skills));
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(() => currentUser?.avatarUrl || currentUser?.avatar_url || '');

  // Điều chỉnh state an toàn khi currentUser thay đổi
  const [prevUserId, setPrevUserId] = useState(() => currentUser?.id);
  if (currentUser && currentUser.id !== prevUserId) {
    setPrevUserId(currentUser.id);
    setFullName(currentUser.fullName || currentUser.name || '');
    setPhone(currentUser.phone || '');
    setBranch(currentUser.branch || 'RMSA - Bình Thạnh');
    setTitle(currentUser.title || (currentUser.role === 'admin' ? 'Quản Trị Viên & HLV Đào Tạo' : 'Chuyên Viên Tư Vấn Thực Chiến'));
    setBio(currentUser.bio || 'Chiến binh Running Man Sales Academy - Chốt deal thực chiến.');
    setSkills(parseUserSkills(currentUser.skills));
    setAvatarUrl(currentUser.avatarUrl || currentUser.avatar_url || '');
  }

  // Trạng thái lưu hồ sơ
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ msg: '', type: '' });

  // Đổi mật khẩu states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({ msg: '', type: '' });

  // Tiêu chí mật khẩu an toàn
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  const isPasswordStrong = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  // Xử lý đổi mật khẩu trực tiếp
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordFeedback({ msg: '', type: '' });

    if (!currentPassword) {
      setPasswordFeedback({ msg: 'Vui lòng nhập mật khẩu hiện tại của bạn.', type: 'error' });
      return;
    }
    if (!isPasswordStrong) {
      setPasswordFeedback({ msg: 'Mật khẩu mới chưa đáp ứng đủ 4 tiêu chuẩn an toàn (từ 8 ký tự, chữ hoa, số và ký tự đặc biệt).', type: 'error' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordFeedback({ msg: 'Mật khẩu xác nhận không trùng khớp. Vui lòng kiểm tra lại!', type: 'error' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const changePasswordFn = api.profile?.changePassword || api.user?.changePassword || api.auth?.changePassword;
      const res = await changePasswordFn({
        userId: currentUser.id || currentUser.username,
        currentPassword,
        newPassword
      });

      if (res && res.success) {
        setPasswordFeedback({ msg: 'Đổi mật khẩu thành công! Mật khẩu mới đã có hiệu lực ngay lập tức.', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordFeedback({ msg: res?.message || 'Đổi mật khẩu thất bại. Mật khẩu hiện tại chưa chính xác!', type: 'error' });
      }
    } catch (err) {
      setPasswordFeedback({ msg: err.message || 'Lỗi kết nối máy chủ khi đổi mật khẩu.', type: 'error' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Upload refs
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  if (!isOpen || !currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const initialChar = (fullName || currentUser.name || 'U').charAt(0).toUpperCase();

  // Thống kê thành tích
  const passedLessonsCount = Object.values(completedLessons).filter(l => l?.passed).length;
  const totalCourses = courses.length || 8;
  const progressPercent = Math.round((passedLessonsCount / totalCourses) * 100);

  // Cấp bậc học viện
  let tierLevel = 'Học Viên Tập Sự';
  let tierColor = 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
  if (passedLessonsCount >= 8) {
    tierLevel = 'Master Chốt Deal';
    tierColor = 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700';
  } else if (passedLessonsCount >= 5) {
    tierLevel = 'Cao Thủ Đàm Phán';
    tierColor = 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
  } else if (passedLessonsCount >= 3) {
    tierLevel = 'Chiến Binh Thực Chiến';
    tierColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
  }

  // Xử lý nén ảnh trên trình duyệt bằng Canvas (tối ưu dung lượng, load siêu nhanh)
  const processImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 480;
          let width = img.width;
          let height = img.height;

          // Crop vuông tâm ảnh
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxDim, maxDim);

          // Xuất ảnh JPEG chất lượng 0.88 (~35KB)
          const base64 = canvas.toDataURL('image/jpeg', 0.88);
          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload và đồng bộ Avatar tức thì
  const handleAvatarFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (.jpg, .png, .webp)');
      return;
    }

    setIsUploadingAvatar(true);
    setFeedback({ msg: 'Đang xử lý nén và tải ảnh lên...', type: 'info' });

    try {
      const compressedBase64 = await processImageFile(file);
      setAvatarUrl(compressedBase64); // Live Preview ngay tức khắc

      // Gửi lên server backend SQLite
      const res = await api.profile.uploadAvatar({
        imageBase64: compressedBase64,
        userId: currentUser.id
      });

      if (res && res.success) {
        const finalUrl = res.avatarUrl || compressedBase64;
        setAvatarUrl(finalUrl);

        // Cập nhật state hệ thống và localStorage
        const updated = {
          ...currentUser,
          avatarUrl: finalUrl,
          avatar_url: finalUrl
        };
        if (onUpdateUser) onUpdateUser(updated);

        setFeedback({ msg: 'Cập nhật ảnh đại diện thành công!', type: 'success' });
        setIsAvatarPickerOpen(false);
      } else {
        setFeedback({ msg: res?.message || 'Không thể lưu ảnh đại diện lên máy chủ', type: 'error' });
      }
    } catch (err) {
      console.error('Lỗi upload avatar:', err);
      setFeedback({ msg: 'Lỗi tải ảnh đại diện. Vui lòng thử lại!', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
      if (e.target) e.target.value = '';
    }
  };

  // Chọn avatar Preset
  const handleSelectPresetAvatar = async (presetUrl) => {
    setIsUploadingAvatar(true);
    setAvatarUrl(presetUrl);

    try {
      const res = await api.profile.update({
        userId: currentUser.id,
        avatarUrl: presetUrl
      });

      if (res && res.success) {
        const updated = {
          ...currentUser,
          avatarUrl: presetUrl,
          avatar_url: presetUrl
        };
        if (onUpdateUser) onUpdateUser(updated);
        setFeedback({ msg: 'Đã đổi ảnh đại diện mascot Running Rin!', type: 'success' });
        setIsAvatarPickerOpen(false);
      }
    } catch {
      setFeedback({ msg: 'Lỗi đổi ảnh đại diện', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Xóa ảnh đại diện (trở về chữ cái)
  const handleRemoveAvatar = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh đại diện và quay về chữ cái mặc định?')) return;
    setIsUploadingAvatar(true);
    setAvatarUrl('');

    try {
      const res = await api.profile.update({
        userId: currentUser.id,
        avatarUrl: ''
      });

      if (res && res.success) {
        const updated = {
          ...currentUser,
          avatarUrl: '',
          avatar_url: ''
        };
        if (onUpdateUser) onUpdateUser(updated);
        setFeedback({ msg: 'Đã xóa ảnh đại diện.', type: 'info' });
        setIsAvatarPickerOpen(false);
      }
    } catch {
      setFeedback({ msg: 'Lỗi xóa ảnh đại diện', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Toggle kỹ năng
  const handleToggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  // Thêm kỹ năng tùy chỉnh
  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
      setCustomSkillInput('');
    }
  };

  // Lưu thông tin hồ sơ
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFeedback({ msg: 'Vui lòng nhập họ và tên của bạn', type: 'error' });
      return;
    }

    setIsSaving(true);
    setFeedback({ msg: 'Đang lưu thông tin hồ sơ...', type: 'info' });

    try {
      const res = await api.profile.update({
        userId: currentUser.id,
        fullName: fullName.trim(),
        phone: phone.trim(),
        branch,
        title: title.trim(),
        bio: bio.trim(),
        skills: JSON.stringify(skills),
        avatarUrl
      });

      if (res && res.success && res.user) {
        const updated = {
          ...currentUser,
          ...res.user,
          name: res.user.fullName || res.user.name,
          fullName: res.user.fullName,
          avatarUrl: res.user.avatarUrl,
          skills
        };
        if (onUpdateUser) onUpdateUser(updated);
        setFeedback({ msg: 'Lưu và đồng bộ hồ sơ cá nhân thành công!', type: 'success' });
      } else {
        setFeedback({ msg: res?.message || 'Lỗi khi lưu thông tin', type: 'error' });
      }
    } catch (err) {
      setFeedback({ msg: err.message || 'Lỗi kết nối máy chủ', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-0 sm:p-5 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      
      {/* Hidden File Inputs for Avatar Upload */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleAvatarFileSelected}
      />
      <input 
        ref={cameraInputRef}
        type="file" 
        accept="image/*" 
        capture="user" 
        className="hidden" 
        onChange={handleAvatarFileSelected}
      />

      {/* MODAL CONTAINER - Phong cách Apple / Stripe Clean Corporate */}
      <div 
        className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] max-w-2xl rounded-none sm:rounded-3xl bg-white dark:bg-[#18191c] border-0 sm:border border-slate-200 dark:border-white/[0.12] shadow-2xl overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* TOP MODAL HEADER BAR */}
        <div className="px-4 sm:px-7 py-3 sm:py-3.5 border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
              Hồ Sơ Cá Nhân & Quản Trị
            </h3>
            <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 font-semibold shrink-0">
              RMSA-{currentUser.id ? String(currentUser.id).padStart(2, '0') : 'NV01'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/[0.08] hover:bg-slate-300/80 dark:hover:bg-white/[0.15] text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PROFILE HEADER IDENTITY (Bố cục ngang hoàn toàn, không đè chữ, không che mất chữ) */}
        <div className="px-5 sm:px-7 py-5 bg-white dark:bg-[#18191c] border-b border-slate-200/80 dark:border-white/[0.08] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Left: Avatar & Tên Học Viên (Rộng rãi, không truncate gò bó) */}
            <div className="flex items-center space-x-4">
              
              {/* Avatar + Nút Camera */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden p-0.5 bg-white dark:bg-[#18191c] ring-2 ring-slate-200 dark:ring-white/[0.15] shadow-sm">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={fullName}
                      className="w-full h-full rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-inner">
                      {initialChar}
                    </div>
                  )}
                </div>

                {/* Nút bấm Camera đổi avatar */}
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(prev => !prev)}
                  disabled={isUploadingAvatar}
                  className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md border-2 border-white dark:border-[#18191c] transition-all cursor-pointer flex items-center justify-center"
                  title="Thay đổi ảnh đại diện (Tải từ máy tính hoặc máy ảnh điện thoại)"
                >
                  {isUploadingAvatar ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Popover chọn nguồn tải Avatar */}
                {isAvatarPickerOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-[#202124] border border-slate-200 dark:border-white/[0.12] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-white/[0.08]">
                      <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                        Đổi Ảnh Đại Diện
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setIsAvatarPickerOpen(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/[0.06] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold">Tải lên từ Tệp / Thư viện</p>
                        <p className="text-[10px] text-slate-400 font-normal">Chọn ảnh từ máy tính hoặc album điện thoại</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (cameraInputRef.current) cameraInputRef.current.click();
                      }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/[0.06] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Smartphone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold">Chụp trực tiếp từ Máy ảnh</p>
                        <p className="text-[10px] text-slate-400 font-normal">Dùng camera điện thoại hoặc webcam</p>
                      </div>
                    </button>

                    {/* Bộ sưu tập Avatar Mascot Running Rin 3D */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.08]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Chọn Avatar Mascot RMSA:
                      </p>
                      <div className="grid grid-cols-4 gap-1.5">
                        {PRESET_AVATARS.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectPresetAvatar(p.url)}
                            className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.1] hover:border-blue-500 hover:ring-2 hover:ring-blue-500/30 transition-all cursor-pointer p-0.5"
                            title={p.label}
                          >
                            <img src={p.url} alt={p.label} className="w-full h-10 object-cover rounded-lg" />
                            <span className="block text-[9px] text-center font-bold truncate text-slate-600 dark:text-slate-300 mt-0.5">
                              {p.label.split(' ')[0]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Xóa avatar về mặc định */}
                    {avatarUrl && (
                      <div className="pt-1.5 border-t border-slate-100 dark:border-white/[0.08]">
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Quay về ảnh chữ cái mặc định</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tên & Thông tin chính (Tuyệt đối KHÔNG truncate ép dẹp) */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {fullName || currentUser.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                    isAdmin 
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800' 
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  }`}>
                    {isAdmin ? 'Quản Trị Viên' : 'Học Viên Nội Bộ'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                  {title || 'Chuyên Viên Tư Vấn Thực Chiến'} • {branch}
                </p>

                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {currentUser.email || currentUser.username}
                </p>
              </div>

            </div>

            {/* Right: Nút hành động nhanh đổi ảnh đại diện */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAvatarPickerOpen(prev => !prev)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/[0.15] bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Đổi Ảnh Đại Diện</span>
              </button>
            </div>

          </div>
        </div>

        {/* SUB-NAV TABS (Nằm trên một hàng riêng biệt, thanh lịch chuẩn Stripe/Apple) */}
        <div className="px-5 sm:px-7 bg-slate-50 dark:bg-[#1a1b1e] border-b border-slate-200/80 dark:border-white/[0.08] flex items-center space-x-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Thông Tin & Kỹ Năng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('badge')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'badge'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Thẻ Số & Danh Hiệu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Đổi Mật Khẩu</span>
          </button>
        </div>

        {/* FEEDBACK BANNER */}
        {feedback.msg && (
          <div className={`mx-5 sm:mx-7 mt-3 p-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in duration-150 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : feedback.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-center space-x-2">
              {feedback.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedback.msg}</span>
            </div>
            <button type="button" onClick={() => setFeedback({ msg: '', type: '' })} className="opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* MODAL BODY (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

          {/* TAB 1: THÔNG TIN & KỸ NĂNG */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Họ và tên */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Họ và Tên Học Viên *</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="VD: Lê Minh Tài"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.15] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400">Hiển thị trên Chứng chỉ, Bảng Vàng và Diễn đàn.</p>
                </div>

                {/* Số điện thoại / Zalo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Số Điện Thoại / Zalo</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0901 234 567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.15] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400">Dùng để nhận OTP khôi phục mật khẩu và kết nối công việc.</p>
                </div>

                {/* Chi nhánh công tác */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Chi Nhánh / Cơ Sở Trực Thuộc</span>
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.15] bg-white dark:bg-[#202124] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
                  >
                    {BRANCH_OPTIONS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Chức danh / Vị trí */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                    <span>Chức Vụ / Vị Trí Thực Chiến</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Chuyên viên tư vấn Duplex cao cấp"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.15] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

              </div>

              {/* Châm ngôn chốt deal / Bio cá nhân */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <span>Châm Ngôn Thực Chiến / Giới Thiệu Bản Thân (Bio)</span>
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Chia sẻ mục tiêu đào tạo hoặc câu châm ngôn chốt deal tâm đắc của bạn..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.15] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              {/* Kỹ năng thế mạnh (Tag chips) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Kỹ Năng & Thế Mạnh Thực Chiến ({skills.length} kỹ năng đã chọn)</span>
                </label>
                
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_SUGGESTIONS.map(s => {
                    const isSelected = skills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleToggleSkill(s)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.1] hover:border-blue-400'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{s}
                      </button>
                    );
                  })}
                </div>

                {/* Thêm kỹ năng tùy chỉnh */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="Thêm kỹ năng khác..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.04] text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSkill(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/[0.1] hover:bg-slate-300 dark:hover:bg-white/[0.15] text-xs font-bold cursor-pointer transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              {/* Nút Submit Lưu */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50 active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Lưu Thay Đổi Hồ Sơ</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: THẺ NHÂN SỰ SỐ & HUY HIỆU */}
          {activeTab === 'badge' && (
            <div className="space-y-6">
              
              {/* SMART DIGITAL PASS (Phong cách Thẻ Nhân Sự Doanh Nghiệp Tối Giản Sang Trọng) */}
              <div className="mx-auto max-w-md p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
                
                {/* Pass Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="font-black text-xs tracking-wider text-slate-100">RUNNING MAN SALES ACADEMY</h4>
                    <p className="text-[9.5px] text-slate-400 uppercase font-mono">Thẻ Cán Bộ / Học Viên Nội Bộ</p>
                  </div>
                  
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tierColor}`}>
                    {tierLevel}
                  </span>
                </div>

                {/* Pass Body */}
                <div className="flex items-center space-x-4 py-1">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-sm bg-slate-800">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-600 flex items-center justify-center text-xl font-black">
                        {initialChar}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-base text-white">{fullName || currentUser.name}</h3>
                    <p className="text-xs text-slate-300 font-medium truncate">{title || 'Chuyên viên tư vấn'}</p>
                    <p className="text-[11px] text-blue-400 font-mono mt-0.5">
                      RMSA-{currentUser.id ? String(currentUser.id).padStart(2, '0') : 'NV01'} • {branch}
                    </p>
                  </div>
                </div>

                {/* Pass Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[9.5px] text-slate-400 uppercase font-mono">Tiến độ đào tạo</p>
                    <p className="font-bold text-emerald-400">{passedLessonsCount}/{totalCourses} chuyên đề ({progressPercent}%)</p>
                  </div>

                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[10.5px] font-mono text-slate-200">
                    <QrCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>VERIFIED ID</span>
                  </div>
                </div>

              </div>

              {/* TỦ HUY HIỆU THÀNH TÍCH THỰC CHIẾN */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Bộ Huy Hiệu Thành Tích Đã Mở Khóa</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Badge 1 */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">Chiến Binh Kỷ Luật</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Rèn luyện phản xạ tình huống thực địa mỗi ngày.</p>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div className={`p-3.5 rounded-xl border flex items-center space-x-3 ${
                    passedLessonsCount >= 1 
                      ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' 
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] opacity-60'
                  }`}>
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">Bách Phát Bách Trúng</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {passedLessonsCount >= 1 ? `Đã hoàn thành ${passedLessonsCount} bài sát hạch!` : 'Vượt qua ít nhất 1 bài sát hạch.'}
                      </p>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div className={`p-3.5 rounded-xl border flex items-center space-x-3 ${
                    passedLessonsCount === totalCourses 
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800' 
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] opacity-60'
                  }`}>
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">Master Chốt Deal RMSA</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {passedLessonsCount === totalCourses ? 'Tốt nghiệp xuất sắc 8/8 chuyên đề cốt lõi!' : 'Hoàn thành 8/8 chuyên đề để mở khóa.'}
                      </p>
                    </div>
                  </div>

                  {/* Badge 4 */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">Chiến Binh Thực Địa</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Nắm vững quy trình dẫn khách và đàm phán cọc.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ĐỔI MẬT KHẨU AN TOÀN */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg mx-auto py-2">
              {/* Header Box */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Thiết Lập Mật Khẩu Cá Nhân</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Đổi mật khẩu định kỳ giúp bảo vệ tài khoản cá nhân, kết quả sát hạch và điểm thi trên hệ thống LMS Running Man Academy.
                  </p>
                </div>
              </div>

              {/* Password Feedback Banner */}
              {passwordFeedback.msg && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in ${
                  passwordFeedback.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  <div className="flex items-center space-x-2">
                    {passwordFeedback.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    <span>{passwordFeedback.msg}</span>
                  </div>
                  <button type="button" onClick={() => setPasswordFeedback({ msg: '', type: '' })} className="opacity-70 hover:opacity-100 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Trường Mật khẩu hiện tại */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mật Khẩu Hiện Tại *</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Nhập mật khẩu bạn đang sử dụng"
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.15] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Trường Mật khẩu mới */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mật Khẩu Mới *</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Nhập mật khẩu mới an toàn"
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.15] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4 Tiêu chí an toàn mật khẩu */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span>Yêu cầu mật khẩu an toàn:</span>
                  {newPassword && (
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      isPasswordStrong ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {isPasswordStrong ? '✓ Đạt chuẩn an toàn' : 'Chưa đủ điều kiện'}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
                  <div className={`flex items-center space-x-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasMinLength ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                      {hasMinLength ? '✓' : '•'}
                    </span>
                    <span>Từ 8 ký tự trở lên</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasUppercase ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                      {hasUppercase ? '✓' : '•'}
                    </span>
                    <span>Có chữ in hoa (A-Z)</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasNumber ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                      {hasNumber ? '✓' : '•'}
                    </span>
                    <span>Có chữ số (0-9)</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasSpecial ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                      {hasSpecial ? '✓' : '•'}
                    </span>
                    <span>Ký tự đặc biệt (@, !, #, $...)</span>
                  </div>
                </div>
              </div>

              {/* Trường Nhập lại mật khẩu mới */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Xác Nhận Lại Mật Khẩu Mới *</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    placeholder="Nhập lại mật khẩu mới trùng khớp"
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-white/[0.15] bg-white dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Nút Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang cập nhật mật khẩu...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Xác Nhận Đổi Mật Khẩu Mới</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}


        </div>

        {/* MODAL FOOTER */}
        <div className="p-3.5 sm:px-7 sm:py-3 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#1a1b1e] flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs">
          <div className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
            Dữ liệu đồng bộ tức thì với cơ sở dữ liệu RMSA
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-xl bg-slate-200 dark:bg-white/[0.1] hover:bg-slate-300 dark:hover:bg-white/[0.15] text-slate-700 dark:text-slate-200 font-bold cursor-pointer transition-colors text-center active:scale-98"
          >
            Đóng hồ sơ
          </button>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
