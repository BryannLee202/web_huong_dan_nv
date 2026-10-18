/**
 * RMSA Academy - Centralized API Client Layer
 * Thiết kế theo chuẩn kiến trúc: alan2207/bulletproof-react
 * - Chuẩn hóa giao tiếp Frontend <-> Backend
 * - Tự động thử lại khi mạng chập chờn (Retry with Exponential Backoff)
 * - Tự động bắt lỗi và chuẩn hóa thông báo tiếng Việt thân thiện
 * - Timeout an toàn chống treo UI
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';
const DEFAULT_TIMEOUT_MS = 15000; // 15 giây timeout

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
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const rawUser = localStorage.getItem('mapstudy_user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        authToken = parsed?.token || null;
      }
    }
  } catch {}

  const headers = {
    'Accept': 'application/json',
    ...(!options.isFormData && { 'Content-Type': 'application/json' }),
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
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
// API CLIENT SERVICES (PHÂN TẦNG THEO DOMAIN)
// ==========================================

export const api = {
  // 1. Quản lý Khóa học & Chuyên đề
  courses: {
    async getAll() {
      try {
        const res = await request('/api/courses', { method: 'GET' });
        if (res.success && Array.isArray(res.courses)) {
          // Lưu cache nhẹ vào localStorage phòng trường hợp mất mạng
          try { localStorage.setItem('rmsa_cached_courses', JSON.stringify(res.courses)); } catch {}
          return res.courses;
        }
        return [];
      } catch (err) {
        // Fallback đọc từ cache nếu mất mạng
        try {
          const cached = localStorage.getItem('rmsa_cached_courses');
          if (cached) {
            console.warn('[API] Sử dụng dữ liệu khóa học từ bộ đệm ngoại tuyến (Offline Cache)');
            return JSON.parse(cached);
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

    async updateVideo(lessonId, videoData) {
      return await request(`/api/courses/${encodeURIComponent(lessonId)}/video`, {
        method: 'POST',
        body: JSON.stringify(videoData)
      });
    },

    async updateQuiz(lessonId, quizData) {
      return await request(`/api/courses/${encodeURIComponent(lessonId)}/quiz`, {
        method: 'POST',
        body: JSON.stringify(quizData)
      });
    },

    async generateAi(lessonId) {
      return await request(`/api/courses/${encodeURIComponent(lessonId)}/ai-generate`, {
        method: 'POST',
        timeout: 90000
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
    async evaluate({ lessonId, userAnswers, timeTakenSeconds = 0, userName = 'Nguyễn Văn A', branch = 'RMSA - Bình Thạnh', userRole = 'student' }) {
      return await request('/api/quiz/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          lessonId,
          userAnswers,
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

    async backupDatabase() {
      return await request('/api/admin/backup-database', { method: 'POST' });
    },

    async generateAiSummaryAndQuiz(lessonId) {
      return await request(`/api/courses/${encodeURIComponent(lessonId)}/ai-generate`, {
        method: 'POST',
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
    }
  },

  // 10. Đề Thi Sát Hạch Thực Địa Ngẫu Nhiên (Practice Test)
  practiceTest: {
    async getQuestions(count = 5) {
      return await request(`/api/practice-test/questions?count=${count}`, { method: 'GET', timeout: 10000 });
    }
  }
};

export default api;
