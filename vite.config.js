import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    open: '/index.html',
    port: 3000
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'home.html'),
        profile: resolve(__dirname, 'profile.html'),
        workouts: resolve(__dirname, 'workouts.html'),
        nutrition: resolve(__dirname, 'nutrition.html'),
        settings: resolve(__dirname, 'settings.html')
      }
    }
  }
}); 