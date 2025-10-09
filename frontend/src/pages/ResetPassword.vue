<template>
  <div class="reset-password-page min-vh-100 d-flex align-items-center position-relative" style="background: #1a1a1a !important;">
    <!-- Animated Background Elements -->
    <div class="reset-password-background-elements">
      <div class="floating-icon floating-icon-1">🔐</div>
      <div class="floating-icon floating-icon-2">🔑</div>
      <div class="floating-icon floating-icon-3">🛡️</div>
      <div class="floating-icon floating-icon-4">⚡</div>
      <div class="floating-icon floating-icon-5">🔒</div>
      <div class="floating-icon floating-icon-6">✨</div>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <!-- Reset Password Card with Cyberpunk Styling -->
          <div 
            ref="resetPasswordCard"
            class="cyberpunk-reset-password-card"
          >
            <div class="card-body p-5">
              <!-- Header with Animation -->
              <div ref="resetPasswordHeader" class="text-center mb-4">
                <div ref="logoIcon" class="cyberpunk-logo-icon">
                  <i class="fas fa-lock"></i>
                </div>
                <h2 ref="welcomeText" class="cyberpunk-welcome-text">Reset Password</h2>
                <p ref="subtitleText" class="cyberpunk-subtitle">Enter your new password below</p>
              </div>

              <!-- Success Message -->
              <div v-if="success" ref="successAlert" class="cyberpunk-success-alert">
                <i class="fas fa-check-circle me-2"></i>
                {{ successMessage }}
              </div>

              <!-- Error Alert -->
              <div v-if="error" ref="errorAlert" class="cyberpunk-alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                {{ error }}
              </div>

              <form @submit.prevent="handleResetPassword" v-if="!success">
                <!-- New Password Field with Animation -->
                <div ref="passwordField" class="mb-4">
                  <label for="password" class="cyberpunk-label">New Password</label>
                  <div class="cyberpunk-input-group">
                    <span class="cyberpunk-input-icon">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      v-model="form.password"
                      class="cyberpunk-input"
                      :class="{ 'cyberpunk-input-error': errors.password }"
                      placeholder="Enter your new password"
                      required
                    />
                    <button
                      type="button"
                      class="cyberpunk-toggle-btn"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.password" class="cyberpunk-error-message">
                    {{ errors.password }}
                  </div>
                </div>

                <!-- Confirm Password Field with Animation -->
                <div ref="confirmPasswordField" class="mb-4">
                  <label for="confirmPassword" class="cyberpunk-label">Confirm New Password</label>
                  <div class="cyberpunk-input-group">
                    <span class="cyberpunk-input-icon">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      id="confirmPassword"
                      v-model="form.confirmPassword"
                      class="cyberpunk-input"
                      :class="{ 'cyberpunk-input-error': errors.confirmPassword }"
                      placeholder="Confirm your new password"
                      required
                    />
                    <button
                      type="button"
                      class="cyberpunk-toggle-btn"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.confirmPassword" class="cyberpunk-error-message">
                    {{ errors.confirmPassword }}
                  </div>
                </div>

                <!-- Submit Button with Animation -->
                <button
                  ref="submitButton"
                  type="submit"
                  class="cyberpunk-submit-btn"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="cyberpunk-spinner me-2"></span>
                  <i v-else class="fas fa-save me-2"></i>
                  {{ isLoading ? 'Resetting...' : 'RESET PASSWORD' }}
                </button>

                <!-- Back to Login Link -->
                <div ref="backToLoginLink" class="text-center mt-4">
                  <p class="cyberpunk-signup-text">
                    Remember your password? 
                    <router-link to="/login" class="cyberpunk-link">
                      Back to Login
                    </router-link>
                  </p>
                </div>
              </form>

              <!-- Success Actions -->
              <div v-if="success" class="text-center mt-4">
                <button
                  @click="goToLogin"
                  class="cyberpunk-submit-btn"
                >
                  <i class="fas fa-sign-in-alt me-2"></i>
                  BACK TO LOGIN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { createTimeline, animate, createAnimatable, utils } from 'animejs'

export default {
  name: 'ResetPassword',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()

    // Template refs for animations
    const resetPasswordCard = ref(null)
    const resetPasswordHeader = ref(null)
    const logoIcon = ref(null)
    const welcomeText = ref(null)
    const subtitleText = ref(null)
    const passwordField = ref(null)
    const confirmPasswordField = ref(null)
    const submitButton = ref(null)
    const backToLoginLink = ref(null)
    const successAlert = ref(null)
    const errorAlert = ref(null)

    const form = reactive({
      password: '',
      confirmPassword: ''
    })

    const errors = ref({})
    const error = ref('')
    const success = ref(false)
    const successMessage = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const isLoading = computed(() => authStore.isLoading)

    // Get token from URL
    const token = computed(() => route.query.token)

    // Advanced Anime.js v4 Reset Password Page Animations
    const initResetPasswordAnimations = async () => {
      await nextTick()
      
      // Create main timeline with advanced settings
      resetPasswordTimeline = createTimeline({
        defaults: { 
          duration: 800,
          ease: 'out(3)',
          frameRate: 60
        },
        playbackRate: 1,
        onBegin: (self) => {
          console.log('Reset password animations started', self.id)
          if (resetPasswordCard.value) {
            resetPasswordCard.value.style.borderColor = 'var(--cyber-orange)'
          }
        },
        onComplete: (self) => {
          console.log('Reset password animations completed', self.id)
          if (resetPasswordCard.value) {
            resetPasswordCard.value.style.borderColor = 'var(--cyber-orange)'
          }
        }
      })

      // Background floating elements with advanced animations
      const floatingElements = document.querySelectorAll('.floating-icon')
      floatingElements.forEach((element, index) => {
        const elementTimeline = createTimeline({
          loop: true,
          alternate: true,
          playbackRate: 0.5 + (index * 0.1)
        })
        
        elementTimeline
          .add(element, {
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1]
          }, 0)
          .add(element, {
            x: [0, 20, 0],
            rotateZ: [0, 360, 0]
          }, 0)
      })

      // Reset password card entrance with 3D effects
      if (resetPasswordCard.value) {
        resetPasswordTimeline
          .label('card-entrance', 0)
          .add(resetPasswordCard.value, {
            opacity: [0, 1],
            y: [100, 0],
            scale: [0.8, 1],
            rotateX: [30, 0],
            rotateY: [15, 0],
            filter: ['blur(10px)', 'blur(0px)'],
            boxShadow: [
              '0 0 0 rgba(255, 140, 66, 0)',
              '0 0 50px rgba(255, 140, 66, 0.5)'
            ]
          }, 'card-entrance')
      }

      // Header elements with staggered 3D animations
      if (logoIcon.value) {
        resetPasswordTimeline
          .label('logo-animation', 200)
          .add(logoIcon.value, {
            scale: [0, 1.2, 1],
            opacity: [0, 1],
            filter: ['blur(5px)', 'blur(0px)']
          }, 'logo-animation')
      }

      if (welcomeText.value) {
        resetPasswordTimeline
          .add(welcomeText.value, {
            y: [50, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
            rotateX: [20, 0]
          }, 'logo-animation += 200')
      }

      if (subtitleText.value) {
        resetPasswordTimeline
          .add(subtitleText.value, {
            y: [30, 0],
            opacity: [0, 1],
            scale: [0.95, 1],
            rotateX: [10, 0]
          }, 'logo-animation += 400')
      }

      // Form fields with advanced staggered animations
      if (passwordField.value) {
        resetPasswordTimeline
          .label('form-animation', 600)
          .add(passwordField.value, {
            x: [-100, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
            rotateY: [-15, 0],
            filter: ['blur(3px)', 'blur(0px)']
          }, 'form-animation')
      }

      if (confirmPasswordField.value) {
        resetPasswordTimeline
          .add(confirmPasswordField.value, {
            x: [-100, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
            rotateY: [-15, 0],
            filter: ['blur(3px)', 'blur(0px)']
          }, 'form-animation += 200')
      }

      if (submitButton.value) {
        resetPasswordTimeline
          .add(submitButton.value, {
            y: [50, 0],
            opacity: [0, 1],
            scale: [0.8, 1],
            rotateX: [20, 0],
            filter: ['blur(5px)', 'blur(0px)']
          }, 'form-animation += 400')
      }

      if (backToLoginLink.value) {
        resetPasswordTimeline
          .add(backToLoginLink.value, {
            y: [30, 0],
            opacity: [0, 1],
            scale: [0.95, 1],
            rotateX: [10, 0]
          }, 'form-animation += 600')
      }
    }

    // Advanced Error animation with timeline
    const animateError = () => {
      if (errorAlert.value) {
        const errorTimeline = createTimeline({
          defaults: { duration: 200, ease: 'out(2)' }
        })
        
        errorTimeline
          .add(errorAlert.value, {
            x: [-20, 20, -15, 15, -10, 10, 0],
            opacity: [0, 1],
            scale: [0.8, 1.1, 1],
            rotateZ: [-5, 5, -3, 3, 0],
            filter: ['blur(3px)', 'blur(0px)']
          }, 0)
      }
    }

    // Advanced Success animation with timeline
    const animateSuccess = () => {
      if (successAlert.value) {
        const successTimeline = createTimeline({
          defaults: { duration: 300, ease: 'out(2)' }
        })
        
        successTimeline
          .add(successAlert.value, {
            y: [-20, 0],
            opacity: [0, 1],
            scale: [0.8, 1.05, 1],
            rotateZ: [-5, 5, 0],
            filter: ['blur(3px)', 'blur(0px)']
          }, 0)
      }
    }

    const validateForm = () => {
      errors.value = {}
      
      if (!form.password) {
        errors.value.password = 'Password is required'
      } else if (form.password.length < 8) {
        errors.value.password = 'Password must be at least 8 characters'
      }

      if (!form.confirmPassword) {
        errors.value.confirmPassword = 'Please confirm your password'
      } else if (form.password !== form.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match'
      }

      return Object.keys(errors.value).length === 0
    }

    const handleResetPassword = async () => {
      if (!validateForm()) {
        animateError()
        return
      }

      if (!token.value) {
        error.value = 'Invalid or missing reset token'
        animateError()
        return
      }

      error.value = ''
      success.value = false

      // Advanced loading animation for button
      if (submitButton.value) {
        const loadingTimeline = createTimeline({
          loop: true,
          playbackRate: 1.5
        })
        
        loadingTimeline
          .add(submitButton.value, {
            scale: [1, 0.95, 1],
            rotateX: [0, 5, 0]
          }, 0)
      }

      try {
        const result = await authStore.resetPassword(token.value, form.password)
        
        if (result.success) {
          success.value = true
          successMessage.value = result.message
          animateSuccess()
        } else {
          error.value = result.error
          animateError()
        }
      } catch (err) {
        error.value = 'An unexpected error occurred. Please try again.'
        animateError()
      }
    }

    const goToLogin = () => {
      router.push('/login')
    }

    // Dynamic speed control for animations
    let resetPasswordTimeline = null

    onMounted(() => {
      // Check if token exists
      if (!token.value) {
        error.value = 'Invalid or missing reset token'
        return
      }

      initResetPasswordAnimations()
    })

    onUnmounted(() => {
      // Clean up floating elements
      const floatingElements = document.querySelectorAll('.floating-icon')
      floatingElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
      
      // Clean up background elements
      const backgroundElements = document.querySelector('.reset-password-background-elements')
      if (backgroundElements && backgroundElements.parentNode) {
        backgroundElements.parentNode.removeChild(backgroundElements)
      }
    })

    return {
      // Template refs
      resetPasswordCard,
      resetPasswordHeader,
      logoIcon,
      welcomeText,
      subtitleText,
      passwordField,
      confirmPasswordField,
      submitButton,
      backToLoginLink,
      successAlert,
      errorAlert,
      // Form data
      form,
      errors,
      error,
      success,
      successMessage,
      showPassword,
      showConfirmPassword,
      isLoading,
      token,
      handleResetPassword,
      goToLogin
    }
  }
}
</script>

<style scoped>
/* Reset Password Page Cyberpunk Styling */
.reset-password-page {
  background: #1a1a1a !important;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  color-scheme: dark;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Force dark background on all elements */
.reset-password-page * {
  background: transparent !important;
}

/* Override any white backgrounds */
.reset-password-page .container,
.reset-password-page .row,
.reset-password-page .col-lg-5,
.reset-password-page .col-md-7 {
  background: transparent !important;
}

/* Ensure body and html are dark */
body, html {
  background: #1a1a1a !important;
}

/* Override any global styles that might cause white backgrounds */
.reset-password-page .card,
.reset-password-page .card-body,
.reset-password-page .form-control,
.reset-password-page .input-group,
.reset-password-page .input-group-text {
  background: transparent !important;
}

/* Force dark theme on all Bootstrap elements */
.reset-password-page .container-fluid,
.reset-password-page .container,
.reset-password-page .row,
.reset-password-page [class*="col-"] {
  background: transparent !important;
}

/* Ensure no white backgrounds from any framework */
.reset-password-page * {
  background-color: transparent !important;
}

/* Only allow specific elements to have backgrounds */
.reset-password-page .cyberpunk-reset-password-card {
  background: rgba(26, 26, 26, 0.95) !important;
}

.reset-password-page .cyberpunk-input-group {
  background: rgba(42, 42, 42, 0.8) !important;
}

/* Animated Background Elements */
.reset-password-background-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  font-size: 2rem;
  opacity: 0.6;
  color: var(--cyber-orange);
  text-shadow: 0 0 10px rgba(255, 140, 66, 0.3);
  animation: float 6s ease-in-out infinite;
}

.floating-icon-1 { top: 10%; left: 10%; animation-delay: 0s; }
.floating-icon-2 { top: 20%; right: 15%; animation-delay: 1s; }
.floating-icon-3 { top: 60%; left: 5%; animation-delay: 2s; }
.floating-icon-4 { top: 70%; right: 10%; animation-delay: 3s; }
.floating-icon-5 { top: 30%; left: 20%; animation-delay: 4s; }
.floating-icon-6 { top: 80%; right: 20%; animation-delay: 5s; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* Cyberpunk Reset Password Card */
.cyberpunk-reset-password-card {
  background: rgba(26, 26, 26, 0.95);
  border: 2px solid var(--cyber-orange);
  border-radius: 20px;
  box-shadow: 
    0 0 30px rgba(255, 140, 66, 0.3),
    0 0 60px rgba(255, 140, 66, 0.1),
    inset 0 0 20px rgba(255, 140, 66, 0.1);
  position: relative;
  z-index: 10;
  overflow: hidden;
}

.cyberpunk-reset-password-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    rgba(255, 140, 66, 0.1) 0%, 
    transparent 50%, 
    rgba(255, 210, 63, 0.1) 100%);
  pointer-events: none;
}

/* Cyberpunk Logo Icon */
.cyberpunk-logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(45deg, var(--cyber-orange), var(--cyber-yellow));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 25px rgba(255, 140, 66, 0.5);
  border: 3px solid var(--cyber-orange);
}

.cyberpunk-logo-icon i {
  font-size: 2.5rem;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* Cyberpunk Text Styles */
.cyberpunk-welcome-text {
  color: var(--cyber-text);
  font-weight: bold;
  font-size: 2.5rem;
  text-shadow: 0 0 15px rgba(255, 140, 66, 0.5);
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.cyberpunk-subtitle {
  color: var(--cyber-text-muted);
  font-size: 1.1rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

/* Cyberpunk Form Elements */
.cyberpunk-label {
  color: var(--cyber-text);
  font-weight: 600;
  font-size: 1rem;
  text-shadow: 0 0 5px rgba(255, 140, 66, 0.3);
  margin-bottom: 8px;
  display: block;
}

.cyberpunk-input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(42, 42, 42, 0.8);
  border: 2px solid var(--cyber-grey-light);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cyberpunk-input-group:focus-within {
  border-color: var(--cyber-orange);
  box-shadow: 0 0 20px rgba(255, 140, 66, 0.3);
  background: rgba(42, 42, 42, 0.9);
}

.cyberpunk-input-icon {
  padding: 15px;
  background: rgba(255, 140, 66, 0.1);
  color: var(--cyber-orange);
  border-right: 1px solid var(--cyber-grey-light);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.cyberpunk-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--cyber-text);
  padding: 15px;
  font-size: 1rem;
  outline: none;
  font-family: 'Courier New', monospace;
}

.cyberpunk-input::placeholder {
  color: var(--cyber-text-dim);
}

.cyberpunk-input:focus {
  outline: none;
}

.cyberpunk-input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.3) !important;
}

.cyberpunk-toggle-btn {
  background: rgba(255, 140, 66, 0.1);
  border: none;
  color: var(--cyber-orange);
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 1px solid var(--cyber-grey-light);
}

.cyberpunk-toggle-btn:hover {
  background: rgba(255, 140, 66, 0.2);
  color: var(--cyber-yellow);
}

/* Cyberpunk Submit Button */
.cyberpunk-submit-btn {
  width: 100%;
  background: linear-gradient(45deg, var(--cyber-orange), var(--cyber-yellow));
  border: 2px solid var(--cyber-orange);
  color: white;
  padding: 18px;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 140, 66, 0.3);
  position: relative;
  overflow: hidden;
}

.cyberpunk-submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.cyberpunk-submit-btn:hover::before {
  left: 100%;
}

.cyberpunk-submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 30px rgba(255, 140, 66, 0.5);
  border-color: var(--cyber-yellow);
}

.cyberpunk-submit-btn:disabled {
  opacity: 0.7;
  transform: none;
  cursor: not-allowed;
}

/* Cyberpunk Alert */
.cyberpunk-alert {
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid #ef4444;
  color: #ef4444;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
}

/* Cyberpunk Success Alert */
.cyberpunk-success-alert {
  background: rgba(34, 197, 94, 0.1);
  border: 2px solid #22c55e;
  color: #22c55e;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.2);
}

/* Cyberpunk Error Message */
.cyberpunk-error-message {
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 5px;
  text-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
}

/* Cyberpunk Signup Link */
.cyberpunk-signup-text {
  color: var(--cyber-text-muted);
  font-size: 1rem;
  margin: 0;
}

.cyberpunk-link {
  color: var(--cyber-orange);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(255, 140, 66, 0.3);
}

.cyberpunk-link:hover {
  color: var(--cyber-yellow);
  text-shadow: 0 0 10px rgba(255, 210, 63, 0.5);
  text-decoration: none;
}

/* Cyberpunk Spinner */
.cyberpunk-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .cyberpunk-reset-password-card {
    margin: 20px;
    border-radius: 15px;
  }
  
  .cyberpunk-welcome-text {
    font-size: 2rem;
  }
  
  .floating-icon {
    font-size: 1.5rem;
  }
  
  .cyberpunk-logo-icon {
    width: 60px;
    height: 60px;
  }
  
  .cyberpunk-logo-icon i {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .cyberpunk-reset-password-card {
    margin: 10px;
  }
  
  .cyberpunk-welcome-text {
    font-size: 1.8rem;
  }
  
  .cyberpunk-submit-btn {
    padding: 15px;
    font-size: 1rem;
  }
}
</style>
