/**
 * RMSA Academy - Standalone SQLite Backup Script
 * Chạy thủ công: node scripts/backup-db.js
 * Hoặc đặt Cronjob chạy hàng ngày lúc 2:00 AM:
 * 0 2 * * * cd /var/www/web-rin && node scripts/backup-db.js >> /var/log/lms-backup.log 2>&1
 */

import { createDatabaseBackup, closeDatabase } from '../data/database.js';

async function runBackup() {
  console.log(`[${new Date().toISOString()}] 🔄 Đang tiến hành sao lưu SQLite Database...`);
  try {
    const backup = await createDatabaseBackup();
    console.log(`[${new Date().toISOString()}] ✅ SAO LƯU THÀNH CÔNG!`);
    console.log(`- Tên file: ${backup.fileName}`);
    console.log(`- Đường dẫn: ${backup.filePath}`);
    closeDatabase();
    process.exit(0);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ LỖI SAO LƯU:`, err);
    process.exit(1);
  }
}

runBackup();
