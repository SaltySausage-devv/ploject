import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      '/api/auth': 'http://localhost:3001',
      '/api/users': 'http://localhost:3002',
      '/api/profiles': 'http://localhost:3003',
      '/api/bookings': 'http://localhost:3004',
      '/api/messaging': 'http://localhost:3005',
      '/api/reviews': 'http://localhost:3006',
      '/api/notifications': 'http://localhost:3007',
      '/api/analytics': 'http://localhost:3008'
    }
  }
})
