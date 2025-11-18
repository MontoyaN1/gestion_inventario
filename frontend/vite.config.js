import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      // Redirige todas las llamadas que empiecen con /api al backend
      '/producto': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false,
      },
      '/movimiento': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: 'http://backend:5000', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})