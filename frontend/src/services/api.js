import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { getApiUrl } from '../utils/api-helper'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// Request interceptor to rewrite URLs for production and add auth token
api.interceptors.request.use(
  (config) => {
    // Construct full path (baseURL + url)
    const fullPath = config.baseURL && config.url ? config.baseURL + config.url : config.url
    
    console.log('🔧 API INTERCEPTOR:', {
      originalUrl: config.url,
      baseURL: config.baseURL,
      fullPath: fullPath,
      startsWithApi: fullPath && fullPath.startsWith('/api/')
    })
    
    // Rewrite URL for production (full backend URLs)
    if (fullPath && fullPath.startsWith('/api/')) {
      const newUrl = getApiUrl(fullPath)
      console.log('🔧 API INTERCEPTOR: Converting URL:', { from: fullPath, to: newUrl })
      config.url = newUrl
      config.baseURL = '' // Clear baseURL since we now have full URL
    }
    
    // Add auth token
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    console.log('🔧 API INTERCEPTOR: Final config:', {
      url: config.url,
      baseURL: config.baseURL,
      hasAuth: !!config.headers.Authorization
    })
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
