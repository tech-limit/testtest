import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5650,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:6782',
        changeOrigin: true,
      },
    },
  },
})