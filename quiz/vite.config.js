// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com', // API endpoint without CORS issues
        changeOrigin: true,  // Changes the origin of the host header to the target URL
        rewrite: (path) => path.replace(/^\/api/, ''),  // Rewrites /api in the path
      },
    },
  },
});
