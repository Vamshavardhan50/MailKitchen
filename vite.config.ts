import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'child_process';
import http from 'http';

function autoBackendPlugin() {
  let backendProcess: any = null;

  return {
    name: 'auto-backend-server',
    configureServer(server: any) {
      // Check if server is already running on port 5000
      const req = http.get('http://127.0.0.1:5000/api/health', (res) => {
        if (res.statusCode === 200) {
          console.log('[vite] Local backend server is already active on port 5000.');
        }
      });

      req.on('error', () => {
        console.log('[vite] Starting local backend server on port 5000 (node server.mjs)...');
        backendProcess = spawn('node', ['server.mjs'], {
          stdio: 'inherit',
          shell: true,
          env: { ...process.env, PORT: '5000' }
        });

        backendProcess.on('error', (err: any) => {
          console.error('[vite] Could not start local backend server:', err.message);
        });
      });

      server.httpServer?.on('close', () => {
        if (backendProcess) {
          backendProcess.kill();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), autoBackendPlugin()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/sanity-proxy': {
        target: 'https://ohmgd0hu.api.sanity.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sanity-proxy/, ''),
        headers: {
          Origin: 'https://maatikitchen.com'
        }
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            // Gracefully handle backend server not running during frontend dev
            if (res && 'writeHead' in res && !res.headersSent) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, offline: true }));
            }
          });
        },
      },
    },
  },
});
