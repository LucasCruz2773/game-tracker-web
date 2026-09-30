import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.API_PROXY_TARGET || 'http://localhost:3000';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // The API is served under /api on the same origin so the httpOnly session cookie
      // works without CORS.
      proxy: {
        '/api': {
          target: apiTarget,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
