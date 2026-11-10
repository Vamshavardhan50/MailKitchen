import { spawn } from 'child_process';

console.log('[MAATI Dev] Starting backend API server (port 5000)...');
const backend = spawn('node', ['server.mjs'], { stdio: 'inherit', shell: true });

console.log('[MAATI Dev] Starting Vite frontend server (port 3000)...');
const frontend = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

const cleanup = () => {
  console.log('[MAATI Dev] Shutting down dev servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
