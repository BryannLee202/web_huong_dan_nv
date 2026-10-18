/**
 * RMSA Academy - Standalone SQLite Backup Script
 * Chạy thủ công: node scripts/backup-db.js
 * Hoặc đặt Cronjob chạy hàng ngày lúc 2:00 AM:
 * 0 2 * * * cd /var/www/web-rin && node scripts/backup-db.js >> /var/log/lms-backup.log 2>&1
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createDatabaseBackup, closeDatabase } from '../data/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runBackup() {
  console.log(`[${new Date().toISOString()}] 🔄 Đang tiến hành sao lưu SQLite Database...`);
  try {
    const backup = await createDatabaseBackup();
    console.log(`[${new Date().toISOString()}] ✅ SAO LƯU THÀNH CÔNG!`);
    console.log(`- Tên file: ${backup.fileName}`);
    console.log(`- Đường dẫn: ${backup.filePath}`);

    // Dọn dẹp bản backup cũ hơn 7 ngày
    const backupDir = path.join(__dirname, '..', 'data', 'backups');
    if (fs.existsSync(backupDir)) {
      const now = Date.now();
      const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
      const files = fs.readdirSync(backupDir);
      for (const file of files) {
        if (file.endsWith('.db') || file.endsWith('.json')) {
          const filePath = path.join(backupDir, file);
          const stat = fs.statSync(filePath);
          if (now - stat.mtimeMs > maxAgeMs) {
            fs.unlinkSync(filePath);
            console.log(`- 🗑️ Đã dọn dẹp bản backup cũ: ${file}`);
          }
        }
      }
    }

    closeDatabase();
    process.exit(0);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ LỖI SAO LƯU:`, err);
    process.exit(1);
  }
}

runBackup();
