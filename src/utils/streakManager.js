/**
 * RMSA - Trình Quản Lý Chuỗi Học Tập Thực Chiến Tự Động (Daily Streak Engine)
 * Quy tắc:
 * - Tài khoản mới / chưa học ngày nào: Chuỗi hiển thị 0 ngày (Chưa kích hoạt).
 * - Trả lời đúng câu đầu tiên trong ngày: Tự động khởi động Chuỗi 1 ngày.
 * - Hôm sau vào trả lời đúng ít nhất 1 câu: Tự động tăng lên Chuỗi 2 ngày.
 * - Đủ 3 ngày liên tiếp + làm đúng hôm nay: Tự động mở Chuỗi 4 ngày, cứ thế tiếp tục.
 * - Làm nhiều câu trong 1 ngày: Ghi nhận số câu đúng, bảo toàn chuỗi của ngày đó, không tăng lặp.
 * - Bỏ lỡ > 1 ngày: Chuỗi bị gián đoạn và sẽ bắt đầu lại từ 1 khi có câu trả lời đúng tiếp theo.
 */

export function getLocalDateString(dateInput = new Date()) {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(dateInput = new Date()) {
  const d = new Date(dateInput);
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

export function getDateNDaysAgo(n, dateInput = new Date()) {
  const d = new Date(dateInput);
  d.setDate(d.getDate() - n);
  return getLocalDateString(d);
}

export function getDayDifference(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return 999;
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

const STORAGE_KEY = 'rmsa_daily_streak_v2';
const LEGACY_KEY = 'rmsa_scenario_streak';

/**
 * Tải dữ liệu chuỗi ngày hiện tại
 */
export function loadDailyStreak(userIdentifier = null) {
  const todayStr = getLocalDateString();
  const userStorageKey = userIdentifier ? `${STORAGE_KEY}_${userIdentifier}` : STORAGE_KEY;

  let savedData = null;
  try {
    const raw = localStorage.getItem(userStorageKey);
    if (raw) savedData = JSON.parse(raw);
  } catch {}

  // Nếu tài khoản mới / chưa có dữ liệu lưu trữ
  if (!savedData || typeof savedData.streak !== 'number' || !savedData.lastCompletedDate) {
    return {
      streak: 0,
      lastCompletedDate: null,
      completedToday: false,
      dayDiff: 999,
      todayCorrectCount: 0,
      history: []
    };
  }

  const lastDate = savedData.lastCompletedDate;
  const dayDiff = getDayDifference(lastDate, todayStr);

  let activeStreak = savedData.streak || 0;
  let completedToday = false;

  if (dayDiff === 0) {
    // Đã hoàn thành trong ngày hôm nay
    completedToday = true;
  } else if (dayDiff === 1) {
    // Ngày gần nhất hoàn thành là hôm qua -> Chuỗi còn nguyên, hôm nay đang chờ làm để lên chuỗi tiếp theo
    completedToday = false;
  } else {
    // Bỏ lỡ nhiều hơn 1 ngày -> Chuỗi bị gián đoạn, hiển thị 0 ngày chờ kích hoạt lại từ 1
    completedToday = false;
    activeStreak = 0;
  }

  return {
    streak: activeStreak,
    lastCompletedDate: lastDate,
    completedToday,
    dayDiff,
    todayCorrectCount: completedToday ? (savedData.todayCorrectCount || 1) : 0,
    history: Array.isArray(savedData.history) ? savedData.history : []
  };
}

/**
 * Ghi nhận 1 câu trả lời đúng trong ngày
 * Trả về thông tin chuỗi mới và cờ newlyUnlocked (true nếu hôm nay vừa mới mở khóa chuỗi mới)
 */
export function recordCorrectDailyScenario(userIdentifier = null) {
  const todayStr = getLocalDateString();
  const userStorageKey = userIdentifier ? `${STORAGE_KEY}_${userIdentifier}` : STORAGE_KEY;

  const current = loadDailyStreak(userIdentifier);

  // Trường hợp 1: Tài khoản mới chưa học ngày nào hoặc chuỗi về 0
  if (!current.lastCompletedDate || current.streak === 0) {
    const initialData = {
      streak: 1,
      lastCompletedDate: todayStr,
      history: [todayStr],
      todayCorrectCount: 1
    };
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(initialData));
      localStorage.setItem(LEGACY_KEY, '1');
    } catch {}

    return {
      streak: 1,
      lastCompletedDate: todayStr,
      completedToday: true,
      newlyUnlocked: true,
      dayDiff: 0,
      todayCorrectCount: 1,
      history: [todayStr]
    };
  }

  const dayDiff = getDayDifference(current.lastCompletedDate, todayStr);
  let newStreak = current.streak;
  let newlyUnlocked = false;
  let newTodayCorrectCount = (current.todayCorrectCount || 0) + 1;
  const historySet = new Set(current.history || []);

  if (dayDiff === 0) {
    // Hôm nay đã hoàn thành ít nhất 1 câu rồi
    // Giữ nguyên chuỗi của ngày hôm nay, chỉ tăng số câu đúng
    newlyUnlocked = false;
  } else if (dayDiff === 1) {
    // Hôm qua đã hoàn thành, hôm nay làm câu đầu tiên -> Tăng chuỗi thêm 1 ngày!
    // Ví dụ: đủ 1 ngày -> mở chuỗi 2; đủ 3 ngày -> mở chuỗi 4 ngày!
    newStreak = current.streak + 1;
    newlyUnlocked = true;
    newTodayCorrectCount = 1;
  } else {
    // Bỏ lỡ nhiều hơn 1 ngày -> Bắt đầu lại chuỗi 1 ngày
    newStreak = 1;
    newlyUnlocked = true;
    newTodayCorrectCount = 1;
  }

  historySet.add(todayStr);
  const newHistory = Array.from(historySet).slice(-30);

  const updatedData = {
    streak: newStreak,
    lastCompletedDate: todayStr,
    history: newHistory,
    todayCorrectCount: newTodayCorrectCount
  };

  try {
    localStorage.setItem(userStorageKey, JSON.stringify(updatedData));
    localStorage.setItem(LEGACY_KEY, String(newStreak));
  } catch {}

  return {
    streak: newStreak,
    lastCompletedDate: todayStr,
    completedToday: true,
    newlyUnlocked,
    dayDiff: 0,
    todayCorrectCount: newTodayCorrectCount,
    history: newHistory
  };
}

/**
 * Đặt lại chuỗi về 0 (dành cho tài khoản mới hoặc khi người dùng muốn reset từ đầu)
 */
export function resetDailyStreak(userIdentifier = null) {
  const userStorageKey = userIdentifier ? `${STORAGE_KEY}_${userIdentifier}` : STORAGE_KEY;
  const resetData = {
    streak: 0,
    lastCompletedDate: null,
    history: [],
    todayCorrectCount: 0
  };
  try {
    localStorage.setItem(userStorageKey, JSON.stringify(resetData));
    localStorage.setItem(LEGACY_KEY, '0');
  } catch {}

  return {
    streak: 0,
    lastCompletedDate: null,
    completedToday: false,
    dayDiff: 999,
    todayCorrectCount: 0,
    history: []
  };
}

/**
 * Thiết lập chuỗi theo số ngày tùy chọn (hỗ trợ kiểm thử hoặc khôi phục)
 */
export function setDailyStreak(userIdentifier = null, targetStreak = 0) {
  const yesterdayStr = getYesterdayDateString();
  const userStorageKey = userIdentifier ? `${STORAGE_KEY}_${userIdentifier}` : STORAGE_KEY;
  const streakNum = Math.max(0, parseInt(targetStreak, 10) || 0);

  const history = [];
  for (let i = streakNum; i >= 1; i--) {
    history.push(getDateNDaysAgo(i));
  }

  const data = {
    streak: streakNum,
    lastCompletedDate: streakNum > 0 ? yesterdayStr : null,
    history: history,
    todayCorrectCount: 0
  };

  try {
    localStorage.setItem(userStorageKey, JSON.stringify(data));
    localStorage.setItem(LEGACY_KEY, String(streakNum));
  } catch {}

  return loadDailyStreak(userIdentifier);
}
