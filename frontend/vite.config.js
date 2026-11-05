import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/recommend': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/health': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/users': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/user': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/events': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    }
  }
})
