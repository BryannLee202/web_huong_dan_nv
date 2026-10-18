/**
 * RMSA - Trình Quản Lý Chuỗi Học Tập Thực Chiến Tự Động (Daily Streak Engine)
 * Quy tắc:
 * - Mỗi ngày lịch (00:00 - 23:59) chỉ cần trả lời đúng ít nhất 1 câu tình huống thực địa.
 * - Đủ ngày hôm trước + làm đúng hôm nay -> Tự động mở chuỗi ngày tiếp theo (ví dụ: đủ 3 ngày -> mở chuỗi 4).
 * - Làm nhiều câu trong 1 ngày: Ghi nhận số câu đúng, giữ nguyên chuỗi của ngày đó để tránh spam.
 * - Bỏ lỡ > 1 ngày: Chuỗi tự động làm mới về 1 ngày khi có câu trả lời đúng tiếp theo.
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
  const yesterdayStr = getYesterdayDateString();
  const userStorageKey = userIdentifier ? `${STORAGE_KEY}_${userIdentifier}` : STORAGE_KEY;

  let savedData = null;
  try {
    const raw = localStorage.getItem(userStorageKey);
    if (raw) savedData = JSON.parse(raw);
  } catch {}

  // Migration: Nếu chưa có dữ liệu v2 nhưng có legacy streak hoặc khởi tạo mặc định 3 ngày
  if (!savedData || typeof savedData.streak !== 'number') {
    let initialStreak = 3;
    try {
      const leg = localStorage.getItem(LEGACY_KEY);
      if (leg) initialStreak = parseInt(leg, 10) || 3;
    } catch {}

    // Giả định ban đầu: Chuỗi 3 ngày đã hoàn thành đến hôm qua, hôm nay chờ mở chuỗi 4
    savedData = {
      streak: initialStreak,
      lastCompletedDate: yesterdayStr,
      history: [getDateNDaysAgo(2), yesterdayStr],
      todayCorrectCount: 0
    };
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(savedData));
      localStorage.setItem(LEGACY_KEY, String(initialStreak));
    } catch {}
  }

  const lastDate = savedData.lastCompletedDate;
  const dayDiff = getDayDifference(lastDate, todayStr);

  let activeStreak = savedData.streak || 0;
  let completedToday = false;

  if (dayDiff === 0) {
    // Đã hoàn thành trong ngày hôm nay
    completedToday = true;
  } else if (dayDiff === 1) {
    // Ngày gần nhất hoàn thành là hôm qua -> Chuỗi còn nguyên, hôm nay chưa làm
    completedToday = false;
  } else {
    // Bỏ lỡ nhiều hơn 1 ngày -> Chuỗi đã bị đứt, nếu làm câu tiếp theo sẽ bắt đầu lại từ 1
    completedToday = false;
    // Lưu ý: Hiển thị 0 nếu đứt chuỗi, hoặc giữ streak cũ nếu muốn chờ câu tiếp theo
    // Để thân thiện với học viên: nếu chưa làm thì thông báo chuỗi đang chờ kích hoạt
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
  const dayDiff = getDayDifference(current.lastCompletedDate, todayStr);

  let newStreak = current.streak;
  let newlyUnlocked = false;
  let newTodayCorrectCount = current.todayCorrectCount + 1;
  const historySet = new Set(current.history || []);

  if (dayDiff === 0) {
    // Hôm nay đã hoàn thành ít nhất 1 câu rồi
    // Giữ nguyên streak của ngày hôm nay, chỉ tăng bộ đếm số câu đúng
    newlyUnlocked = false;
  } else if (dayDiff === 1) {
    // Hôm qua đã hoàn thành, hôm nay làm câu đầu tiên -> Tăng chuỗi thêm 1 ngày!
    // Ví dụ: Đang đủ 3 ngày -> mở chuỗi 4 ngày!
    newStreak = (current.streak || 0) + 1;
    newlyUnlocked = true;
    newTodayCorrectCount = 1;
  } else {
    // Bỏ lỡ hoặc bắt đầu mới -> Khởi động chuỗi 1 ngày
    newStreak = 1;
    newlyUnlocked = true;
    newTodayCorrectCount = 1;
  }

  historySet.add(todayStr);
  const newHistory = Array.from(historySet).slice(-30); // Giữ tối đa 30 ngày gần nhất

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
