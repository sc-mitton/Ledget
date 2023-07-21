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
            key: './localhost.key',
            cert: './localhost.crt',
            ca: './ledgetCA.pem'
        }
    },
    plugins: [react()],
})
