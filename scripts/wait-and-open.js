import http from 'http';
import { exec } from 'child_process';

const URL = 'http://127.0.0.1:3000';
let attempts = 0;
const MAX_ATTEMPTS = 60; // Thử tối đa 30 giây

function checkServer() {
  attempts++;
  
  const req = http.get(URL, (res) => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      console.log(' [OK] He thong da khoi dong thanh cong! Dang mo trinh duyet...');
      exec(`start ${URL}`);
      process.exit(0);
    } else {
      scheduleNext();
    }
  });

  req.on('error', () => {
    scheduleNext();
  });

  req.setTimeout(1000, () => {
    req.destroy();
    scheduleNext();
  });
}

function scheduleNext() {
  if (attempts >= MAX_ATTEMPTS) {
    console.log(' [CANH BAO] Qua thoi gian cho, tu dong mo trinh duyet...');
    exec(`start ${URL}`);
    process.exit(0);
  } else {
    setTimeout(checkServer, 500);
  }
}

// Bắt đầu kiểm tra sau 500ms
setTimeout(checkServer, 500);
