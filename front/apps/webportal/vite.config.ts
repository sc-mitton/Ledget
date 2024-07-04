/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import path from 'path';
import fs from 'fs';
import { visualizer } from "rollup-plugin-visualizer";

const certsDir = __dirname + '/../../certs/';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/webportal',

  ...(process.env.NODE_ENV === 'development'
    ? {
      server: {
        watch: {
          usePolling: true,
          interval: 100,
        },
        port: 3001,
        host: 'localhost',
        strictPort: true,
        https: {
          key: fs.existsSync(certsDir + 'localhost.key') ? fs.readFileSync(certsDir + 'localhost.key') : '',
          cert: fs.existsSync(certsDir + 'localhost.crt') ? fs.readFileSync(certsDir + 'localhost.crt') : '',
          ca: fs.existsSync(certsDir + 'ledgetCA.pem') ? fs.readFileSync(certsDir + 'ledgetCA.pem') : '',
        }
      }
    }
    : {}
  ),

  ...(process.env.NODE_ENV === 'development'
    ? {
      preview: {
        port: 3301,
        host: 'localhost',
        strictPort: true,
        https: {
          key: fs.existsSync(certsDir + 'localhost.key') ? fs.readFileSync(certsDir + 'localhost.key') : '',
          cert: fs.existsSync(certsDir + 'localhost.crt') ? fs.readFileSync(certsDir + 'localhost.crt') : '',
          ca: fs.existsSync(certsDir + 'ledgetCA.pem') ? fs.readFileSync(certsDir + 'ledgetCA.pem') : '',
        }
      }
    }
    : {}
  ),

  plugins: [react(), nxViteTsPaths(), visualizer()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@api': path.resolve(__dirname, './src/api'),
      '@context': path.resolve(__dirname, './src/context'),
      '@modals': path.resolve(__dirname, './src/modals'),
      '@features': path.resolve(__dirname, './src/features'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
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

  build: {
    chunkSizeWarningLimit: 1024 * 1024,
  }
});
