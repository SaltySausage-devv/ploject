<template>
  <div class="forgot-password-page min-vh-100 d-flex align-items-center position-relative" style="background: #1a1a1a !important;">
    <!-- Animated Background Elements -->
    <div class="forgot-password-background-elements">
      <div class="floating-icon floating-icon-1">🔐</div>
      <div class="floating-icon floating-icon-2">📧</div>
      <div class="floating-icon floating-icon-3">🔑</div>
      <div class="floating-icon floating-icon-4">🛡️</div>
      <div class="floating-icon floating-icon-5">⚡</div>
      <div class="floating-icon floating-icon-6">🔒</div>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <!-- Forgot Password Card with Cyberpunk Styling -->
          <div 
            ref="forgotPasswordCard"
            class="cyberpunk-forgot-password-card"
          >
            <div class="card-body p-5">
              <!-- Header with Animation -->
              <div ref="forgotPasswordHeader" class="text-center mb-4">
                <div ref="logoIcon" class="cyberpunk-logo-icon">
                  <i class="fas fa-key"></i>
                </div>
                <h2 ref="welcomeText" class="cyberpunk-welcome-text">Forgot Password?</h2>
                <p ref="subtitleText" class="cyberpunk-subtitle">Enter your email to receive a reset link</p>
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

              <form @submit.prevent="handleForgotPassword" v-if="!success">
                <!-- Email Field with Animation -->
                <div ref="emailField" class="mb-4">
                  <label for="email" class="cyberpunk-label">Email Address</label>
                  <div class="cyberpunk-input-group">
                    <span class="cyberpunk-input-icon">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      v-model="form.email"
                      class="cyberpunk-input"
                      :class="{ 'cyberpunk-input-error': errors.email }"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  <div v-if="errors.email" class="cyberpunk-error-message">
                    {{ errors.email }}
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
                  <i v-else class="fas fa-paper-plane me-2"></i>
                  {{ isLoading ? 'Sending...' : 'SEND RESET LINK' }}
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { createTimeline, animate, createAnimatable, utils } from 'animejs'

export default {
  name: 'ForgotPassword',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Template refs for animations
    const forgotPasswordCard = ref(null)
    const forgotPasswordHeader = ref(null)
    const logoIcon = ref(null)
    const welcomeText = ref(null)
    const subtitleText = ref(null)
    const emailField = ref(null)
    const submitButton = ref(null)
    const backToLoginLink = ref(null)
    const successAlert = ref(null)
    const errorAlert = ref(null)

    const form = reactive({
      email: ''
    })

    const errors = ref({})
    const error = ref('')
    const success = ref(false)
    const successMessage = ref('')
    const isLoading = computed(() => authStore.isLoading)

    // Advanced Anime.js v4 Forgot Password Page Animations
    const initForgotPasswordAnimations = async () => {
      await nextTick()
      
      // Create main timeline with advanced settings
      forgotPasswordTimeline = createTimeline({
        defaults: { 
          duration: 800,
          ease: 'out(3)',
          frameRate: 60
        },
        playbackRate: 1,
        onBegin: (self) => {
          console.log('Forgot password animations started', self.id)
          if (forgotPasswordCard.value) {
            forgotPasswordCard.value.style.borderColor = 'var(--cyber-orange)'
          }
        },
        onComplete: (self) => {
          console.log('Forgot password animations completed', self.id)
          if (forgotPasswordCard.value) {
            forgotPasswordCard.value.style.borderColor = 'var(--cyber-orange)'
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

      // Forgot password card entrance with 3D effects
      if (forgotPasswordCard.value) {
        forgotPasswordTimeline
          .label('card-entrance', 0)
          .add(forgotPasswordCard.value, {
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
        forgotPasswordTimeline
          .label('logo-animation', 200)
          .add(logoIcon.value, {
            scale: [0, 1.2, 1],
            opacity: [0, 1],
            filter: ['blur(5px)', 'blur(0px)']
          }, 'logo-animation')
      }

      if (welcomeText.value) {
        forgotPasswordTimeline
          .add(welcomeText.value, {
            y: [50, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
            rotateX: [20, 0]
          }, 'logo-animation += 200')
      }

      if (subtitleText.value) {
        forgotPasswordTimeline
          .add(subtitleText.value, {
            y: [30, 0],
            opacity: [0, 1],
            scale: [0.95, 1],
            rotateX: [10, 0]
          }, 'logo-animation += 400')
      }

      // Form fields with advanced staggered animations
      if (emailField.value) {
        forgotPasswordTimeline
          .label('form-animation', 600)
          .add(emailField.value, {
            x: [-100, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
            rotateY: [-15, 0],
            filter: ['blur(3px)', 'blur(0px)']
          }, 'form-animation')
      }

      if (submitButton.value) {
        forgotPasswordTimeline
          .add(submitButton.value, {
            y: [50, 0],
            opacity: [0, 1],
            scale: [0.8, 1],
            rotateX: [20, 0],
            filter: ['blur(5px)', 'blur(0px)']
          }, 'form-animation += 200')
      }

      if (backToLoginLink.value) {
        forgotPasswordTimeline
          .add(backToLoginLink.value, {
            y: [30, 0],
            opacity: [0, 1],
            scale: [0.95, 1],
            rotateX: [10, 0]
          }, 'form-animation += 400')
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
      
      if (!form.email) {
        errors.value.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.value.email = 'Please enter a valid email'
      }

      return Object.keys(errors.value).length === 0
    }

    const handleForgotPassword = async () => {
      if (!validateForm()) {
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
        const result = await authStore.forgotPassword(form.email)
        
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
    let forgotPasswordTimeline = null

    onMounted(() => {
      initForgotPasswordAnimations()
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
      const backgroundElements = document.querySelector('.forgot-password-background-elements')
      if (backgroundElements && backgroundElements.parentNode) {
        backgroundElements.parentNode.removeChild(backgroundElements)
      }
    })

    return {
      // Template refs
      forgotPasswordCard,
      forgotPasswordHeader,
      logoIcon,
      welcomeText,
      subtitleText,
      emailField,
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
      isLoading,
      handleForgotPassword,
      goToLogin
    }
  }
}
</script>

<style scoped>
/* Forgot Password Page Cyberpunk Styling */
.forgot-password-page {
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
.forgot-password-page * {
  background: transparent !important;
}

/* Override any white backgrounds */
.forgot-password-page .container,
.forgot-password-page .row,
.forgot-password-page .col-lg-5,
.forgot-password-page .col-md-7 {
  background: transparent !important;
}

/* Ensure body and html are dark */
body, html {
  background: #1a1a1a !important;
}

/* Override any global styles that might cause white backgrounds */
.forgot-password-page .card,
.forgot-password-page .card-body,
.forgot-password-page .form-control,
.forgot-password-page .input-group,
.forgot-password-page .input-group-text {
  background: transparent !important;
}

/* Force dark theme on all Bootstrap elements */
.forgot-password-page .container-fluid,
.forgot-password-page .container,
.forgot-password-page .row,
.forgot-password-page [class*="col-"] {
  background: transparent !important;
}

/* Ensure no white backgrounds from any framework */
.forgot-password-page * {
  background-color: transparent !important;
}

/* Only allow specific elements to have backgrounds */
.forgot-password-page .cyberpunk-forgot-password-card {
  background: rgba(26, 26, 26, 0.95) !important;
}

.forgot-password-page .cyberpunk-input-group {
  background: rgba(42, 42, 42, 0.8) !important;
}

/* Animated Background Elements */
.forgot-password-background-elements {
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

/* Cyberpunk Forgot Password Card */
.cyberpunk-forgot-password-card {
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

.cyberpunk-forgot-password-card::before {
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
  .cyberpunk-forgot-password-card {
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
  .cyberpunk-forgot-password-card {
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
