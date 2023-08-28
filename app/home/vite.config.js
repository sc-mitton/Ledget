import react from '@vitejs/plugin-react'
import path from 'path'

export default ({ mode }) => {
    const isProduction = mode === 'production'

    return {
        build: {
            outDir: isProduction ? '../dist' : 'dist-dev',
            minify: isProduction,
            sourcemap: !isProduction,
        },
        mode: 'production',
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
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@assets': path.resolve(__dirname, './src/assets'),
                '@components': path.resolve(__dirname, './src/components'),
                '@utils': path.resolve(__dirname, './src/utils'),
                '@flow': path.resolve(__dirname, './src/flow'),
                '@features': path.resolve(__dirname, './src/features'),
                '@api': path.resolve(__dirname, './src/api'),
                '@features': path.resolve(__dirname, './src/features'),
                '@pages': path.resolve(__dirname, './src/pages'),
                '@modals': path.resolve(__dirname, './src/modals'),
            }
        },
        plugins: [react()],
    }
}
