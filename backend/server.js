const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const backendDir = __dirname;
const distServer = path.join(backendDir, 'dist', 'server.js');
const child = spawn('npm', fs.existsSync(distServer) ? ['run', 'start'] : ['run', 'dev'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.exit(0);
    return;
  }

  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('Failed to start backend dev server:', error);
  process.exit(1);
});

process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});
