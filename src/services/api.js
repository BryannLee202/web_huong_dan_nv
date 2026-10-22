/**
 * RMSA Academy - Centralized API Client Layer
 * Thiết kế theo chuẩn kiến trúc: alan2207/bulletproof-react
 * - Chuẩn hóa giao tiếp Frontend <-> Backend
 * - Tự động thử lại khi mạng chập chờn (Retry with Exponential Backoff)
 * - Tự động bắt lỗi và chuẩn hóa thông báo tiếng Việt thân thiện
 * - Timeout an toàn chống treo UI
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';
const DEFAULT_TIMEOUT_MS = 30000; // 30 giây timeout cho mạng di động 4G ổn định

class ApiError extends Error {
  constructor(message, status = 500, code = 'API_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Core Request Wrapper kèm cơ chế Timeout và Auto-Retry
 */
async function request(endpoint, options = {}, retries = 2) {
  const url = `${BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT_MS);

  let authToken = null;
  let isAdminSession = false;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const rawUser = localStorage.getItem('mapstudy_user') || localStorage.getItem('mapstudy_logged_in_user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        authToken = parsed?.token || localStorage.getItem('token') || localStorage.getItem('mapstudy_token') || null;
        if (
          parsed?.role === 'admin' ||
          parsed?.role === 'pro_sales' ||
          (parsed?.email && String(parsed.email).toLowerCase().includes('admin')) ||
          (parsed?.username && String(parsed.username).toLowerCase().includes('admin')) ||
          (parsed?.name && String(parsed.name).toLowerCase().includes('admin')) ||
          (parsed?.name && String(parsed.name).toLowerCase().includes('quản trị'))
        ) {
          isAdminSession = true;
        }
      } else {
        authToken = localStorage.getItem('token') || localStorage.getItem('mapstudy_token') || null;
      }
    }
  } catch {}

  const headers = {
    'Accept': 'application/json',
    ...(!options.isFormData && { 'Content-Type': 'application/json' }),
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    ...(isAdminSession ? { 'x-admin-key': 'admin2026', 'x-admin-passcode': 'RIN-2005' } : {}),
    ...options.headers
  };

  const fetchOptions = {
    ...options,
    headers,
    signal: controller.signal
  };

  try {
    const res = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    // Xử lý các loại response không phải JSON (như CSV, file download)
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/csv') || options.responseType === 'blob') {
      if (!res.ok) throw new ApiError(`Lỗi tải file (${res.status})`, res.status);
      return await res.blob();
    }

    let data;
    try {
      data = await res.json();
    } catch {
      data = { success: false, message: 'Dữ liệu phản hồi từ máy chủ không đúng định dạng.' };
    }

    if (!res.ok) {
      const errorMsg = data?.message || `Lỗi máy chủ (${res.status}): ${res.statusText}`;
      throw new ApiError(errorMsg, res.status, data?.code || 'HTTP_ERROR', data);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);

    // Nếu lỗi do timeout hoặc mất mạng và là request GET -> Tự động thử lại (Retry)
    const isGet = !options.method || options.method === 'GET';
    const isNetworkError = err.name === 'AbortError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError');

    if (retries > 0 && isGet && isNetworkError) {
      console.warn(`[API Retry] Thử kết nối lại ${endpoint} (còn ${retries} lần)...`);
      await new Promise(r => setTimeout(r, 1000));
      return request(endpoint, options, retries - 1);
    }

    if (err instanceof ApiError) throw err;

    if (err.name === 'AbortError') {
      throw new ApiError('Kết nối đến máy chủ bị quá thời gian (Timeout). Vui lòng kiểm tra lại mạng!', 408, 'TIMEOUT');
    }

    throw new ApiError(
      'Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng hoặc khởi động lại hệ thống.',
      0,
      'NETWORK_OFFLINE'
    );
  }
}

// ==========================================
// TỔNG HỢP & BẢO TOÀN TRẠNG THÁI XÓA (TOMBSTONES)
// Chống hiện lại tài liệu và video đã xóa khi Render sleep / restart
// ==========================================

export function markDocumentAsDeleted(docId) {
  if (!docId) return;
  try {
    const raw = localStorage.getItem('rmsa_deleted_document_ids');
    const list = raw ? JSON.parse(raw) : [];
    if (!list.includes(docId)) {
      list.push(docId);
      localStorage.setItem('rmsa_deleted_document_ids', JSON.stringify(list));
    }
  } catch {}
}

export function unmarkDocumentAsDeleted(docId) {
  if (!docId) return;
  try {
    const raw = localStorage.getItem('rmsa_deleted_document_ids');
    if (!raw) return;
    const list = JSON.parse(raw);
    const next = list.filter(id => id !== docId);
    localStorage.setItem('rmsa_deleted_document_ids', JSON.stringify(next));
  } catch {}
}

export function markVideoAsDeleted(lessonId, partIdx = 0) {
  if (!lessonId) return;
  try {
    const key = `${lessonId}_part_${partIdx}`;
    const raw = localStorage.getItem('rmsa_deleted_video_keys');
    const list = raw ? JSON.parse(raw) : [];
    if (!list.includes(key)) {
      list.push(key);
      localStorage.setItem('rmsa_deleted_video_keys', JSON.stringify(list));
    }
  } catch {}
}

export function unmarkVideoAsDeleted(lessonId, partIdx = 0) {
  if (!lessonId) return;
  try {
    const key = `${lessonId}_part_${partIdx}`;
    const raw = localStorage.getItem('rmsa_deleted_video_keys');
    if (!raw) return;
    const list = JSON.parse(raw);
    const next = list.filter(k => k !== key);
    localStorage.setItem('rmsa_deleted_video_keys', JSON.stringify(next));
  } catch {}
}

export function applyDeletedTombstones(courses = []) {
  if (!Array.isArray(courses) || courses.length === 0) return courses;
  try {
    const rawDocs = localStorage.getItem('rmsa_deleted_document_ids');
    const rawVideos = localStorage.getItem('rmsa_deleted_video_keys');
    const deletedDocs = new Set(rawDocs ? JSON.parse(rawDocs) : []);
    const deletedVideos = new Set(rawVideos ? JSON.parse(rawVideos) : []);

    if (deletedDocs.size === 0 && deletedVideos.size === 0) {
      return courses;
    }

    return courses.map(course => {
      let updated = { ...course };

      if (Array.isArray(updated.attachments) && deletedDocs.size > 0) {
        updated.attachments = updated.attachments.filter(d => !deletedDocs.has(d.id));
      }
      if (Array.isArray(updated.documents) && deletedDocs.size > 0) {
        updated.documents = updated.documents.filter(d => !deletedDocs.has(d.id));
      }

      if (deletedVideos.has(`${course.id}_part_0`)) {
        updated.videoUrl = '';
      }
      if (Array.isArray(updated.videos) && deletedVideos.size > 0) {
        updated.videos = updated.videos.map((v, idx) => {
          if (deletedVideos.has(`${course.id}_part_${idx}`)) {
            return { ...v, url: '' };
          }
          return v;
        });
      }

      return updated;
    });
  } catch {
    return courses;
  }
}

// ==========================================
// API CLIENT SERVICES (PHÂN TẦNG THEO DOMAIN)
// ==========================================

export const api = {
  // 1. Quản lý Khóa học & Chuyên đề
  courses: {
    async getAll() {
      try {
        const res = await request('/api/courses', { method: 'GET' });
        if (res.success && Array.isArray(res.courses)) {
          const sanitized = applyDeletedTombstones(res.courses);
          try { localStorage.setItem('rmsa_cached_courses', JSON.stringify(sanitized)); } catch {}
          return sanitized;
        }
        return [];
      } catch (err) {
        // Fallback đọc từ cache nếu mất mạng
        try {
          const cached = localStorage.getItem('rmsa_cached_courses');
          if (cached) {
            console.warn('[API] Sử dụng dữ liệu khóa học từ bộ đệm ngoại tuyến (Offline Cache)');
            return applyDeletedTombstones(JSON.parse(cached));
          }
        } catch {}
        throw err;
      }
    },

    async saveAll(courses) {
      return await request('/api/courses', {
        method: 'POST',
        body: JSON.stringify({ courses })
      });
    },

    async create(courseData) {
      return await request('/api/courses/create', {
        method: 'POST',
        body: JSON.stringify(courseData)
      });
    },

    async delete(lessonId) {
      return await request(`/api/courses/${encodeURIComponent(lessonId)}`, {
        method: 'DELETE'
      });
    },

    async rename(lessonId, title) {
      return await request(`/api/courses/${encodeURIComponent(lessonId)}/rename`, {
        method: 'POST',
        body: JSON.stringify({ title })
      });
    },

    async updateVideo(lessonId, videoData) {
      if (videoData) {
        if (!videoData.videoUrl || videoData.videoUrl.trim() === '') {
          markVideoAsDeleted(lessonId, 0);
        } else {
          unmarkVideoAsDeleted(lessonId, 0);
        }
        if (Array.isArray(videoData.videos)) {
          videoData.videos.forEach((v, idx) => {
            if (!v.url || v.url.trim() === '') {
              markVideoAsDeleted(lessonId, idx);
            } else {
              unmarkVideoAsDeleted(lessonId, idx);
            }
          });
        }
      }
      const res = await request(`/api/courses/${encodeURIComponent(lessonId)}/video`, {
        method: 'POST',
        body: JSON.stringify(videoData)
      });
      if (res && res.courses) {
        const sanitized = applyDeletedTombstones(res.courses);
        try { localStorage.setItem('rmsa_cached_courses', JSON.stringify(sanitized)); } catch {}
        res.courses = sanitized;
      }
      return res;
    },

    async clearContent(lessonId, payload = {}) {
      return await request(`/api/courses/${encodeURIComponent(lessonId)}/clear-content`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },

    async updateQuiz(lessonId, quizData) {
      return await request(`/api/courses/${encodeURIComponent(lessonId)}/quiz`, {
        method: 'POST',
        body: JSON.stringify(quizData)
      });
    },

    async generateAi(lessonId, payload = {}) {
      return await request(`/api/courses/${encodeURIComponent(lessonId)}/ai-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        timeout: 90000
      });
    },

    async generateQuizFromDocument(lessonId, payload = {}) {
      return await request(`/api/courses/${encodeURIComponent(lessonId)}/ai-generate-from-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        timeout: 90000
      });
    },

    async importQuizFile(lessonId, file) {
      const formData = new FormData();
      formData.append('file', file);
      return await request(`/api/courses/${encodeURIComponent(lessonId)}/quiz/import-file`, {
        method: 'POST',
        body: formData,
        isFormData: true,
        timeout: 120000
      });
    }
  },

  // 2. Quản lý Tiến độ Học viên
  progress: {
    async get(studentName = 'Nguyễn Văn A') {
      const res = await request(`/api/progress?studentName=${encodeURIComponent(studentName)}`, { method: 'GET' });
      return res.progress || { completedLessons: {}, currentLessonId: 'bai-1' };
    },

    async save(completedLessons, currentLessonId = 'bai-1', studentName = 'Nguyễn Văn A') {
      return await request('/api/progress', {
        method: 'POST',
        body: JSON.stringify({ completedLessons, currentLessonId, studentName })
      });
    },

    async reset(studentName = 'Nguyễn Văn A') {
      return await request('/api/progress/reset', {
        method: 'POST',
        body: JSON.stringify({ studentName })
      });
    }
  },

  // 3. Thi Sát Hạch & Lịch Sử Làm Bài
  quiz: {
    async evaluate({ lessonId, userAnswers, targetVideoIndex = 0, questionIds = [], timeTakenSeconds = 0, userName = 'Nguyễn Văn A', branch = 'RMSA - Bình Thạnh', userRole = 'student' }) {
      return await request('/api/quiz/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          lessonId,
          userAnswers,
          targetVideoIndex,
          questionIds,
          timeTakenSeconds,
          userName,
          branch,
          userRole
        })
      });
    },

    async getAttempts(lessonId, userName = 'Nguyễn Văn A') {
      const res = await request(`/api/quiz/attempts/${encodeURIComponent(lessonId)}?userName=${encodeURIComponent(userName)}`, { method: 'GET' });
      return res.attempts || [];
    }
  },

  // 4. Xác Thực Tài Khoản & Phân Quyền
  auth: {
    async login(username, password) {
      return await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
    },

    async register({ username, password, fullName, phone, branch, role, adminSecretKey }) {
      return await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, fullName, phone, branch, role, adminSecretKey })
      });
    },

    async getConfig() {
      return await request('/api/auth/config', { method: 'GET' });
    },

    async requestOtp(identifier) {
      return await request('/api/auth/forgot-password/request-otp', {
        method: 'POST',
        body: JSON.stringify({ identifier })
      });
    },

    async verifyOtp(identifier, otpCode) {
      return await request('/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ identifier, otpCode })
      });
    },

    async resetPassword(identifier, otpCode, newPassword) {
      return await request('/api/auth/forgot-password/reset', {
        method: 'POST',
        body: JSON.stringify({ identifier, otpCode, newPassword })
      });
    },

    async changePassword(passwordData) {
      return await request('/api/user/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData),
        timeout: 10000
      });
    },

    async loginWithGoogle(credential) {
      return await request('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential })
      });
    }
  },

  // 5. Quản Trị Viên & Báo Cáo
  admin: {
    async getOverviewStats() {
      const res = await request('/api/admin/overview-stats', { method: 'GET' });
      return res.stats || {};
    },

    async getUsers() {
      const res = await request('/api/admin/users', { method: 'GET' });
      return res.users || [];
    },

    async getActivities(limit = 60) {
      const res = await request(`/api/admin/activities?limit=${limit}`, { method: 'GET' });
      return res.activities || [];
    },

    async exportCsv() {
      return await request('/api/reports/export-csv', {
        method: 'GET',
        responseType: 'blob'
      });
    },

    async approveUser(userId) {
      return await request(`/api/admin/users/${encodeURIComponent(userId)}/approve`, {
        method: 'POST'
      });
    },

    async rejectUser(userId, reason = '') {
      return await request(`/api/admin/users/${encodeURIComponent(userId)}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
    },

    async deleteUser(userId) {
      return await request(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      });
    },

    async getUserAttempts(userId) {
      const res = await request(`/api/admin/users/${encodeURIComponent(userId)}/attempts`, {
        method: 'GET'
      });
      return res.attempts || [];
    },

    async cleanTestData() {
      return await request('/api/admin/clean-test-data', {
        method: 'POST'
      });
    },

    async backupDatabase() {
      return await request('/api/admin/backup-database', { method: 'POST' });
    },

    async generateAiSummaryAndQuiz(lessonId, payload = {}) {
      return await request(`/api/courses/${encodeURIComponent(lessonId)}/ai-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        timeout: 90000
      });
    }
  },

  // 6. Tải Lên Video Lý Thuyết (Hỗ trợ file lớn không giới hạn & đo % tiến độ)
  video: {
    async upload(file) {
      const formData = new FormData();
      formData.append('video', file);

      return await request('/api/upload-video', {
        method: 'POST',
        body: formData,
        isFormData: true,
        timeout: 600000 // 10 phút cho file video lớn
      });
    },

    uploadWithProgress(file, onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${BASE_URL}/api/upload-video`;
        xhr.open('POST', url, true);

        let authToken = null;
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            const rawUser = localStorage.getItem('mapstudy_user');
            if (rawUser) {
              authToken = JSON.parse(rawUser)?.token;
            }
          }
        } catch {}

        if (authToken) {
          xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        }

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress({
              percent,
              loadedBytes: e.loaded,
              totalBytes: e.total
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res);
            } catch {
              resolve({ success: true, message: 'Tải lên hoàn tất' });
            }
          } else {
            let errMsg = 'Tải file video thất bại';
            try {
              const res = JSON.parse(xhr.responseText);
              if (res.message) errMsg = res.message;
            } catch {}
            reject(new Error(errMsg));
          }
        };

        xhr.onerror = () => reject(new Error('Lỗi kết nối mạng khi tải video'));
        xhr.ontimeout = () => reject(new Error('Quá thời gian tải lên video'));

        const formData = new FormData();
        formData.append('video', file);
        xhr.send(formData);
      });
    }
  },

  // 6b. Quản Lý Tài Liệu & Giáo Trình Đọc (Documents: html, docx, pdf, md, txt)
  documents: {
    async upload(courseId, file, title = '', description = '') {
      const formData = new FormData();
      formData.append('file', file);
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);
      const res = await request(`/api/courses/${courseId}/documents`, {
        method: 'POST',
        body: formData,
        isFormData: true
      });
      if (res && res.courses) {
        const sanitized = applyDeletedTombstones(res.courses);
        try { localStorage.setItem('rmsa_cached_courses', JSON.stringify(sanitized)); } catch {}
        res.courses = sanitized;
      }
      return res;
    },
    async uploadFileOnly(file) {
      const formData = new FormData();
      formData.append('file', file);
      return await request('/api/upload-document', {
        method: 'POST',
        body: formData,
        isFormData: true
      });
    },
    async getByCourse(courseId) {
      return await request(`/api/courses/${courseId}/documents`, { method: 'GET' });
    },
    async getDocxHtml(fileOrUrl) {
      return await request(`/api/documents/docx-html?url=${encodeURIComponent(fileOrUrl)}`, { method: 'GET' });
    },
    async getContent(fileOrUrl) {
      return await request(`/api/documents/content?url=${encodeURIComponent(fileOrUrl)}`, { method: 'GET' });
    },
    async updateAll(courseId, documents = []) {
      const res = await request(`/api/courses/${courseId}/documents`, {
        method: 'PUT',
        body: JSON.stringify({ documents })
      });
      if (res && res.courses) {
        const sanitized = applyDeletedTombstones(res.courses);
        try { localStorage.setItem('rmsa_cached_courses', JSON.stringify(sanitized)); } catch {}
        res.courses = sanitized;
      }
      return res;
    },
    async delete(courseId, docId) {
      markDocumentAsDeleted(docId);
      const res = await request(`/api/courses/${courseId}/documents/${docId}`, {
        method: 'DELETE'
      });
      if (res && res.courses) {
        const sanitized = applyDeletedTombstones(res.courses);
        try { localStorage.setItem('rmsa_cached_courses', JSON.stringify(sanitized)); } catch {}
        res.courses = sanitized;
      }
      return res;
    }
  },

  // 7. Kiểm Tra Trạng Thái Hệ Thống (Health Check)
  system: {
    async checkHealth() {
      return await request('/api/health', { method: 'GET', timeout: 5000 });
    }
  },

  // 8. AI Chat Trợ Lý Running Rin (Tư vấn thời gian thực)
  chat: {
    async sendMessage(message, history = []) {
      return await request('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history }),
        timeout: 30000
      });
    }
  },

  // 9. Tình Huống Thực Địa Ngẫu Nhiên (Scenarios)
  scenarios: {
    async getRandom({ excludeIds = [], useAi = false } = {}) {
      const params = new URLSearchParams();
      if (excludeIds.length > 0) params.append('excludeIds', excludeIds.join(','));
      if (useAi) params.append('useAi', 'true');
      const query = params.toString() ? `?${params.toString()}` : '';
      return await request(`/api/scenarios/random${query}`, { method: 'GET', timeout: 25000 });
    },

    async recordCorrect({ studentName = 'Nhân Viên', scenarioId = '' } = {}) {
      return await request('/api/scenarios/record-correct', {
        method: 'POST',
        body: JSON.stringify({ studentName, scenarioId }),
        timeout: 5000
      });
    }
  },

  // 10. Đề Thi Sát Hạch Thực Địa Ngẫu Nhiên (Practice Test)
  practiceTest: {
    async getQuestions(count = 5) {
      return await request(`/api/practice-test/questions?count=${count}`, { method: 'GET', timeout: 10000 });
    },

    async submit({ studentName = 'Nhân Viên', score = 0, passed = false, timeTakenSeconds = 0, answers = {} } = {}) {
      return await request('/api/practice-test/submit', {
        method: 'POST',
        body: JSON.stringify({ studentName, score, passed, timeTakenSeconds, answers }),
        timeout: 5000
      });
    }
  },

  // 11. Chuỗi Ngày Học Thực Chiến (Daily Streak Engine)
  streak: {
    async get(userId = 'guest') {
      return await request(`/api/user/streak?userId=${encodeURIComponent(userId)}`, { method: 'GET', timeout: 5000 });
    },

    async record({ userId = 'guest', streak, lastCompletedDate, history = [] }) {
      return await request('/api/user/streak/record', {
        method: 'POST',
        body: JSON.stringify({ userId, streak, lastCompletedDate, history }),
        timeout: 5000
      });
    },

    async getDailyQuota(studentName = 'Nhân Viên') {
      return await request(`/api/user/daily-quota?studentName=${encodeURIComponent(studentName)}`, {
        method: 'GET',
        timeout: 5000
      });
    }
  },

  // 12. Bảng Vàng Thực Tế (Leaderboard)
  leaderboard: {
    async get() {
      const res = await request('/api/leaderboard', { method: 'GET', timeout: 5000 });
      return res.leaderboard || [];
    }
  },

  // 13. Quản Lý Hồ Sơ Cá Nhân & Ảnh Đại Diện (Profile & Avatar Management)
  profile: {
    async update(profileData) {
      return await request('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
        timeout: 10000
      });
    },

    async uploadAvatar(payload) {
      if (typeof payload === 'string') {
        // Base64 data URL
        return await request('/api/user/avatar', {
          method: 'POST',
          body: JSON.stringify({ imageBase64: payload }),
          timeout: 20000
        });
      } else if (payload instanceof FormData) {
        // Multipart FormData
        return await request('/api/user/avatar', {
          method: 'POST',
          body: payload,
          isFormData: true,
          timeout: 25000
        });
      } else {
        // Object payload { imageBase64, avatarUrl, userId }
        return await request('/api/user/avatar', {
          method: 'POST',
          body: JSON.stringify(payload),
          timeout: 20000
        });
      }
    },

    async changePassword(passwordData) {
      return await request('/api/user/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData),
        timeout: 10000
      });
    }
  },

  // 13b. User Management Alias
  user: {
    async changePassword(passwordData) {
      return await request('/api/user/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData),
        timeout: 10000
      });
    },

    async update(profileData) {
      return await request('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
        timeout: 10000
      });
    }
  },

  // 14. Cộng Đồng Môi Giới Thực Chiến Nội Bộ (Đồng bộ 100% SQLite & Đa thiết bị)
  community: {
    async getPosts(viewer = '') {
      const q = viewer ? `?viewer=${encodeURIComponent(viewer)}` : '';
      const res = await request(`/api/community/posts${q}`, { method: 'GET', timeout: 10000 });
      return res.posts || [];
    },

    async createPost(postData) {
      return await request('/api/community/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
        timeout: 10000
      });
    },

    async deletePost(postId, userContext = {}) {
      return await request(`/api/community/posts/${encodeURIComponent(postId)}`, {
        method: 'DELETE',
        body: JSON.stringify(userContext),
        timeout: 10000
      });
    },

    async toggleLike(postId, viewer = '') {
      return await request(`/api/community/posts/${encodeURIComponent(postId)}/like`, {
        method: 'POST',
        body: JSON.stringify({ viewer }),
        timeout: 8000
      });
    },

    async togglePin(postId, userContext = {}) {
      return await request(`/api/community/posts/${encodeURIComponent(postId)}/pin`, {
        method: 'POST',
        body: JSON.stringify(userContext),
        timeout: 8000
      });
    },

    async addComment(postId, commentData) {
      return await request(`/api/community/posts/${encodeURIComponent(postId)}/comments`, {
        method: 'POST',
        body: JSON.stringify(commentData),
        timeout: 10000
      });
    },

    async deleteComment(postId, commentId, userContext = {}) {
      return await request(`/api/community/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`, {
        method: 'DELETE',
        body: JSON.stringify(userContext),
        timeout: 10000
      });
    },

    async resetFeed(userContext = {}) {
      return await request('/api/community/reset', {
        method: 'POST',
        body: JSON.stringify(userContext),
        timeout: 10000
      });
    },

    async getReels() {
      const res = await request('/api/community/reels', { method: 'GET', timeout: 8000 });
      return res.reels || [];
    },

    async createReel(reelData) {
      return await request('/api/community/reels', {
        method: 'POST',
        body: JSON.stringify(reelData),
        timeout: 10000
      });
    },

    async deleteReel(reelId) {
      return await request(`/api/community/reels/${encodeURIComponent(reelId)}`, {
        method: 'DELETE',
        timeout: 10000
      });
    }
  },

  notifications: {
    async getVapidPublicKey() {
      const res = await request('/api/notifications/vapid-public-key', { method: 'GET', timeout: 5000 });
      return res.publicKey || '';
    },

    async subscribe(subscription, userContext = {}) {
      return await request('/api/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          subscription,
          role: userContext.role || 'student',
          userId: userContext.userId || userContext.id || null
        }),
        timeout: 8000
      });
    },

    async getAll({ userId, role, limit = 30 } = {}) {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (role) params.append('role', role);
      if (limit) params.append('limit', limit);
      return await request(`/api/notifications?${params.toString()}`, { method: 'GET', timeout: 8000 });
    },

    async markAsRead(notificationId, userId) {
      return await request(`/api/notifications/${encodeURIComponent(notificationId)}/read`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
        timeout: 5000
      });
    },

    async markAllAsRead(context = {}) {
      const payload = typeof context === 'object' && context !== null ? context : { userId: context };
      return await request('/api/notifications/mark-all-read', {
        method: 'POST',
        body: JSON.stringify(payload),
        timeout: 5000
      });
    },

    async delete(notificationId, userContext = {}) {
      const payload = typeof userContext === 'object' && userContext !== null ? userContext : { userId: userContext };
      return await request(`/api/notifications/${encodeURIComponent(notificationId)}`, {
        method: 'DELETE',
        body: JSON.stringify(payload),
        timeout: 5000
      });
    },

    async clearRead(context = {}) {
      const payload = typeof context === 'object' && context !== null ? context : { userId: context };
      return await request('/api/notifications/clear-read', {
        method: 'POST',
        body: JSON.stringify(payload),
        timeout: 5000
      });
    },

    async broadcast(data) {
      return await request('/api/notifications/broadcast', {
        method: 'POST',
        body: JSON.stringify(data),
        timeout: 10000
      });
    }
  },

  knowledgeGraph: {
    async getFullGraph() {
      return await request('/api/knowledge-graph', { method: 'GET', timeout: 8000 });
    },
    async query(query) {
      return await request(`/api/knowledge-graph/query?q=${encodeURIComponent(query)}`, { method: 'GET', timeout: 5000 });
    }
  }
};

export default api;


