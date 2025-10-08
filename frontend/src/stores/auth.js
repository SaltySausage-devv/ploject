import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!session.value && !!user.value)
  const userType = computed(() => user.value?.user_type || null)
  const token = computed(() => session.value?.access_token || null)

  // Computed property to provide backwards compatibility with camelCase field names
  const userWithCamelCase = computed(() => {
    if (!user.value) return null
    return {
      ...user.value,
      firstName: user.value.first_name,
      lastName: user.value.last_name,
      userType: user.value.user_type,
      dateOfBirth: user.value.date_of_birth,
      createdAt: user.value.created_at,
      updatedAt: user.value.updated_at
    }
  })

  const login = async (email, password) => {
    isLoading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      session.value = data.session

      // Fetch user profile from database
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.error('Profile fetch error:', profileError)
        } else {
          user.value = profile
        }
      }

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.message || 'Login failed'
      }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      })

      if (authError) throw authError

      // Create user profile in database
      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: userData.email,
              first_name: userData.firstName,
              last_name: userData.lastName,
              user_type: userData.userType || 'student',
              phone: userData.phone || null,
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single()

        if (profileError) throw profileError

        session.value = authData.session
        user.value = profile
      }

      return { success: true, user: authData.user }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: error.message || 'Registration failed'
      }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      user.value = null
      session.value = null
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const initializeAuth = async () => {
    try {
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      if (currentSession) {
        session.value = currentSession

        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()

        if (profile) {
          user.value = profile
        }
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        session.value = newSession

        if (newSession?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', newSession.user.id)
            .single()

          if (profile) {
            user.value = profile
          }
        } else {
          user.value = null
        }
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      if (!user.value?.id) {
        throw new Error('No user logged in')
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          date_of_birth: profileData.dateOfBirth,
          address: profileData.address,
          bio: profileData.bio
        })
        .eq('id', user.value.id)
        .select()
        .single()

      if (error) throw error

      user.value = data
      return { success: true, user: data }
    } catch (error) {
      console.error('Profile update error:', error)
      return {
        success: false,
        error: error.message || 'Profile update failed'
      }
    }
  }

  return {
    user: userWithCamelCase, // Export the camelCase version for backwards compatibility
    rawUser: user, // Export raw user for direct access if needed
    session,
    token,
    isLoading,
    isAuthenticated,
    userType,
    login,
    register,
    logout,
    initializeAuth,
    updateProfile
  }
})
