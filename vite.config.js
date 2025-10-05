import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['localhost', 'wealthwisemarketingonline.com'],
  },
  build: {
    chunkSizeWarningLimit: 1500, // 1MB
  },
});
