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
        target: 'https://api.cosmicpowertech.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/uploads': {
        target: 'https://api.cosmicpowertech.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
