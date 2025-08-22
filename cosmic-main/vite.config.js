import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/uploads': {
        target: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
