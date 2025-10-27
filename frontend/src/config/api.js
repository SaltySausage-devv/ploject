// API Configuration - centralized backend service URLs
export const API_CONFIG = {
  AUTH: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001',
  USERS: import.meta.env.VITE_USERS_SERVICE_URL || 'http://localhost:3002',
  PROFILES: import.meta.env.VITE_PROFILES_SERVICE_URL || 'http://localhost:3003',
  BOOKINGS: import.meta.env.VITE_BOOKINGS_SERVICE_URL || 'http://localhost:3004',
  MESSAGING: import.meta.env.VITE_MESSAGING_SERVICE_URL || 'http://localhost:3005',
  REVIEWS: import.meta.env.VITE_REVIEWS_SERVICE_URL || 'http://localhost:3006',
  NOTIFICATIONS: import.meta.env.VITE_NOTIFICATIONS_SERVICE_URL || 'http://localhost:3007',
  ANALYTICS: import.meta.env.VITE_ANALYTICS_SERVICE_URL || 'http://localhost:3008',
  CALENDAR: import.meta.env.VITE_CALENDAR_SERVICE_URL || 'http://localhost:3011',
  MAPS: import.meta.env.VITE_MAPS_SERVICE_URL || 'http://localhost:3012'
}

