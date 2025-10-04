<template>
  <div class="login-page min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <motion.div
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
            class="card border-0 shadow-lg"
          >
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <i class="fas fa-graduation-cap text-primary fs-1 mb-3"></i>
                <h2 class="fw-bold">Welcome Back</h2>
                <p class="text-muted">Sign in to your TutorConnect account</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      v-model="form.email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div v-if="errors.email" class="invalid-feedback d-block">
                    {{ errors.email }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      v-model="form.password"
                      class="form-control"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.password" class="invalid-feedback d-block">
                    {{ errors.password }}
                  </div>
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    id="remember"
                    v-model="form.remember"
                    class="form-check-input"
                  />
                  <label for="remember" class="form-check-label">
                    Remember me
                  </label>
                </div>

                <div v-if="error" class="alert alert-danger" role="alert">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  {{ error }}
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 py-3 mb-3"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner me-2"></span>
                  <i v-else class="fas fa-sign-in-alt me-2"></i>
                  {{ isLoading ? 'Signing In...' : 'Sign In' }}
                </button>

                <div class="text-center">
                  <p class="mb-0">
                    Don't have an account?
                    <router-link to="/register" class="text-primary text-decoration-none fw-medium">
                      Sign up here
                    </router-link>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const form = reactive({
      email: '',
      password: '',
      remember: false
    })

    const errors = ref({})
    const error = ref('')
    const isLoading = ref(false)
    const showPassword = ref(false)

    const validateForm = () => {
      errors.value = {}
      
      if (!form.email) {
        errors.value.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.value.email = 'Please enter a valid email'
      }

      if (!form.password) {
        errors.value.password = 'Password is required'
      } else if (form.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters'
      }

      return Object.keys(errors.value).length === 0
    }

    const handleLogin = async () => {
      if (!validateForm()) return

      isLoading.value = true
      error.value = ''

      try {
        const result = await authStore.login(form.email, form.password)
        
        if (result.success) {
          router.push('/dashboard')
        } else {
          error.value = result.error
        }
      } catch (err) {
        error.value = 'An unexpected error occurred. Please try again.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      errors,
      error,
      isLoading,
      showPassword,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.card {
  border-radius: 16px;
}

.input-group-text {
  background-color: var(--light-bg);
  border-color: var(--border-color);
  color: var(--text-secondary);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  opacity: 0.7;
  transform: none;
}

.alert {
  border-radius: 8px;
  border: none;
}

@media (max-width: 768px) {
  .card-body {
    padding: 2rem !important;
  }
}
</style>
