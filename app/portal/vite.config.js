import react from '@vitejs/plugin-react';
import path from 'path';

export default ({ mode }) => {
    const isProduction = mode === 'production';

    return {
        build: {
            outDir: isProduction ? '../dist' : 'dist-dev',
            minify: isProduction,
            sourcemap: !isProduction,
        },
        mode: 'development',
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
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@assets': path.resolve(__dirname, './src/assets')
            }
        },
        plugins: [react()]
    }
}
