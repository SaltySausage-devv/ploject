<template>
  <div class="register-page min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <motion.div
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
            class="card border-0 shadow-lg"
          >
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <i class="fas fa-graduation-cap text-primary fs-1 mb-3"></i>
                <h2 class="fw-bold">Join TutorConnect</h2>
                <p class="text-muted">Create your account to get started</p>
              </div>

              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      v-model="form.firstName"
                      class="form-control"
                      :class="{ 'is-invalid': errors.firstName }"
                      placeholder="Enter your first name"
                      required
                    />
                    <div v-if="errors.firstName" class="invalid-feedback">
                      {{ errors.firstName }}
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      v-model="form.lastName"
                      class="form-control"
                      :class="{ 'is-invalid': errors.lastName }"
                      placeholder="Enter your last name"
                      required
                    />
                    <div v-if="errors.lastName" class="invalid-feedback">
                      {{ errors.lastName }}
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    v-model="form.email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="Enter your email"
                    required
                  />
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="userType" class="form-label">I am a</label>
                  <select
                    id="userType"
                    v-model="form.userType"
                    class="form-select"
                    :class="{ 'is-invalid': errors.userType }"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="centre">Tuition Centre</option>
                  </select>
                  <div v-if="errors.userType" class="invalid-feedback">
                    {{ errors.userType }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="phone" class="form-label">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="form.phone"
                    class="form-control"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      v-model="form.password"
                      class="form-control"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="Create a password"
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
                  <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    class="form-control"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    placeholder="Confirm your password"
                    required
                  />
                  <div v-if="errors.confirmPassword" class="invalid-feedback">
                    {{ errors.confirmPassword }}
                  </div>
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    id="terms"
                    v-model="form.terms"
                    class="form-check-input"
                    :class="{ 'is-invalid': errors.terms }"
                    required
                  />
                  <label for="terms" class="form-check-label">
                    I agree to the <a href="#" class="text-primary">Terms of Service</a> and <a href="#" class="text-primary">Privacy Policy</a>
                  </label>
                  <div v-if="errors.terms" class="invalid-feedback">
                    {{ errors.terms }}
                  </div>
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
                  <i v-else class="fas fa-user-plus me-2"></i>
                  {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                </button>

                <div class="text-center">
                  <p class="mb-0">
                    Already have an account?
                    <router-link to="/login" class="text-primary text-decoration-none fw-medium">
                      Sign in here
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
  name: 'Register',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const form = reactive({
      firstName: '',
      lastName: '',
      email: '',
      userType: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false
    })

    const errors = ref({})
    const error = ref('')
    const isLoading = ref(false)
    const showPassword = ref(false)

    const validateForm = () => {
      errors.value = {}
      
      if (!form.firstName.trim()) {
        errors.value.firstName = 'First name is required'
      }

      if (!form.lastName.trim()) {
        errors.value.lastName = 'Last name is required'
      }

      if (!form.email) {
        errors.value.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.value.email = 'Please enter a valid email'
      }

      if (!form.userType) {
        errors.value.userType = 'Please select your role'
      }

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

      if (!form.terms) {
        errors.value.terms = 'You must agree to the terms and conditions'
      }

      return Object.keys(errors.value).length === 0
    }

    const handleRegister = async () => {
      if (!validateForm()) return

      isLoading.value = true
      error.value = ''

      try {
        const result = await authStore.register({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          userType: form.userType,
          phone: form.phone,
          password: form.password
        })
        
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
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.card {
  border-radius: 16px;
}

.form-control:focus,
.form-select:focus {
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
