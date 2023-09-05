/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import path from 'path';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/foo',

  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    https: {
      key: process.env.SSL_KEY_FILE,
      cert: process.env.SSL_CERT_FILE,
      ca: process.env.SSL_CA_FILE,
    }
  },

  preview: {
    port: 3300,
    host: '0.0.0.0',
    strictPort: true,
    https: {
      key: process.env.SSL_KEY_FILE,
      cert: process.env.SSL_CERT_FILE,
      ca: process.env.SSL_CA_FILE,
    }
  },

  plugins: [react(), nxViteTsPaths()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@flow': path.resolve(__dirname, './src/flow'),
      '@features': path.resolve(__dirname, './src/features'),
      '@api': path.resolve(__dirname, './src/api'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@modals': path.resolve(__dirname, './src/modals'),
    }
  },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
