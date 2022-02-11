import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\/(.+)/, replacement: path.resolve(process.cwd(), 'src/$1') },
      { find: /~(.+)$/, replacement: path.resolve(process.cwd(), 'node_modules/$1') },
    ],
  },
});
