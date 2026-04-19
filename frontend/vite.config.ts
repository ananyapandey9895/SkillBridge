import path from 'path';
import { config } from 'dotenv';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

config(); // loads .env into process.env for vite.config.ts (Node context)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: parseInt(process.env.PORT ?? '5173'),
    proxy: {
      '/api': process.env.BACKEND_URL ?? 'http://localhost:3000',
    },
  },
});
