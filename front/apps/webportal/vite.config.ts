/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import path from 'path';
import fs from 'fs';

const certsDir = __dirname + '/../../certs/';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/webportal',

  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
    port: 3001,
    host: 'localhost',
    strictPort: true,
    https: {
      key: fs.readFileSync(certsDir + 'localhost.key'),
      cert: fs.readFileSync(certsDir + 'localhost.crt'),
      ca: fs.readFileSync(certsDir + 'ledgetCA.pem'),
    }
  },

  preview: {
    port: 3301,
    host: 'localhost',
    strictPort: true,
    https: {
      key: fs.readFileSync(certsDir + 'localhost.key'),
      cert: fs.readFileSync(certsDir + 'localhost.crt'),
      ca: fs.readFileSync(certsDir + 'ledgetCA.pem'),
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
