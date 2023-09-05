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
    port: 3001,
    host: '0.0.0.0',
    strictPort: true,
    https: {
      key: process.env.SSL_KEY_FILE,
      cert: process.env.SSL_CERT_FILE,
      ca: process.env.SSL_CA_FILE,
    }
  },


  preview: {
    port: 3301,
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
      '@forms': path.resolve(__dirname, './src/forms'),
      '@pieces': path.resolve(__dirname, './src/pieces'),
      '@api': path.resolve(__dirname, './src/api'),
      '@context': path.resolve(__dirname, './src/context'),
      '@modals': path.resolve(__dirname, './src/modals'),
      '@utils': path.resolve(__dirname, './src/utils'),
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
