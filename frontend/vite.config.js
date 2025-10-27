// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // anything starting with /api will be forwarded to your backend
      '/api': {
        target: 'http://localhost:3000', // your Express server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
