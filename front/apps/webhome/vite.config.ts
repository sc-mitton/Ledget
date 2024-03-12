/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import path from 'path'
import fs from 'fs'
import { visualizer } from "rollup-plugin-visualizer";

// root dir of nx monorepo
const certsDir = __dirname + '/../../certs/';

const devServerConfig = {
  watch: {
    usePolling: true,
    interval: 100,
  },
  port: 3000,
  host: 'localhost',
  strictPort: true,
  https: {
    key: fs.readFileSync(certsDir + 'localhost.key'),
    cert: fs.readFileSync(certsDir + 'localhost.crt'),
    ca: fs.readFileSync(certsDir + 'ledgetCA.pem'),
  }
}

const previewConfig = {
  port: 3300,
  host: 'localhost',
  strictPort: true,
  https: {
    key: fs.readFileSync(certsDir + 'localhost.key'),
    cert: fs.readFileSync(certsDir + 'localhost.crt'),
    ca: fs.readFileSync(certsDir + 'ledgetCA.pem'),
  }
}

export default defineConfig({
  cacheDir: '../../node_modules/.vite/webhome',

  server: process.env.NODE_ENV === 'dev' ? devServerConfig : {},
  preview: process.env.NODE_ENV === 'dev' ? previewConfig : {},

  plugins: [react(), nxViteTsPaths(), visualizer()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@context': path.resolve(__dirname, './src/context'),
      '@flow': path.resolve(__dirname, './src/flow'),
      '@features': path.resolve(__dirname, './src/features'),
      '@api': path.resolve(__dirname, './src/api'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@modals': path.resolve(__dirname, './src/modals'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@styles': path.resolve(__dirname, './src/styles'),
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
