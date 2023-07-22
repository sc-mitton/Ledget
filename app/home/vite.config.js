import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    build: {
        outDir: '../dist',
    },
    mode: 'development',
    server: {
        watch: {
            usePolling: true,
            interval: 100,
        },
        port: 3000,
        host: '0.0.0.0',
        strictPort: true,
        https: {
            key: '/run/secrets/localhost_key',
            cert: '/run/secrets/localhost_crt',
            ca: '/run/secrets/ca_pem'
        }
    },
    plugins: [react()],
})
