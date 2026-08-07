import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/workspace/',
  server: {
    port: 3002,
    host: true,
  },
});
