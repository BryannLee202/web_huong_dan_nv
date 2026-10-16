import { execSync } from 'child_process';

const PORTS = [3000, 5000];

for (const port of PORTS) {
  try {
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
    const lines = output.trim().split('\n');
    const pids = new Set();
    
    for (const line of lines) {
      if (line.includes('LISTENING') || line.includes('ESTABLISHED')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && pid !== `${process.pid}`) {
          pids.add(pid);
        }
      }
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        console.log(` [DON DEP] Da giai phong tien trinh cu PID ${pid} chiem cong ${port}`);
      } catch (e) {}
    }
  } catch (err) {
    // Không có tiến trình nào đang chiếm cổng
  }
}
