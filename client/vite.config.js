import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
        setupFiles: './src/setupTests.js',
    },
})
