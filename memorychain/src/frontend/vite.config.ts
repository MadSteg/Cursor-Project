import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './assets'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:3000',
      '/verify': 'http://localhost:3000',
      '/webhook': 'http://localhost:3000',
    },
  },
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
});