<template>
  <nav class="navbar navbar-expand-lg navbar-dark cyberpunk-navbar fixed-top shadow-sm">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <i class="fas fa-graduation-cap me-2" style="color: var(--cyber-orange);"></i>
        <span class="fw-bold">OnlyTutor</span>
      </router-link>

      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/search" class="nav-link">
              <i class="fas fa-search me-1"></i>
              Find Tutors
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link" v-if="isAuthenticated">
              <i class="fas fa-tachometer-alt me-1"></i>
              Dashboard
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link to="/login" class="nav-link">
              <i class="fas fa-sign-in-alt me-1"></i>
              Login
            </router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link to="/register" class="btn btn-cyberpunk ms-2">
              <i class="fas fa-user-plus me-1"></i>
              Sign Up
            </router-link>
          </li>
          
          <li class="nav-item dropdown" v-if="isAuthenticated">
            <a 
              class="nav-link dropdown-toggle d-flex align-items-center" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fas fa-user-circle me-2"></i>
              {{ user?.firstName }}
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link to="/profile" class="dropdown-item">
                  <i class="fas fa-user me-2"></i>
                  Profile
                </router-link>
              </li>
              <li>
                <router-link to="/messages" class="dropdown-item">
                  <i class="fas fa-envelope me-2"></i>
                  Messages
                </router-link>
              </li>
              <li v-if="userType === 'tutor' || userType === 'centre'">
                <router-link to="/analytics" class="dropdown-item">
                  <i class="fas fa-chart-bar me-2"></i>
                  Analytics
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a href="#" @click="logout" class="dropdown-item text-danger">
                  <i class="fas fa-sign-out-alt me-2"></i>
                  Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { animate, stagger, spring } from 'animejs'

export default {
  name: 'Navbar',
  setup() {
    const authStore = useAuthStore()

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const user = computed(() => authStore.user)
    const userType = computed(() => authStore.userType)

    const logout = () => {
      authStore.logout()
    }

    onMounted(() => {
      // Advanced navbar brand animation with keyframes
      animate('.navbar-brand', {
        keyframes: [
          { scale: 0.5, opacity: 0, rotate: -180, ease: 'outExpo', duration: 0 },
          { scale: 1.1, opacity: 1, rotate: 10, ease: 'outBack', duration: 400 },
          { scale: 1, rotate: 0, ease: spring({ bounce: 0.4 }), duration: 300 }
        ],
        duration: 700
      })

      // Advanced nav links with complex staggered animation
      animate('.nav-link', {
        keyframes: [
          { y: -30, opacity: 0, scale: 0.8, ease: 'outExpo', duration: 0 },
          { y: 0, opacity: 1, scale: 1.05, ease: 'outBack', duration: 400 },
          { scale: 1, ease: 'outElastic', duration: 200 }
        ],
        delay: stagger(150, { start: 200 }),
        duration: 600
      })

      // Setup interactive navbar animations
      setupNavbarInteractions()
    })

    const setupNavbarInteractions = () => {
      // Nav link hover effects
      const navLinks = document.querySelectorAll('.nav-link')
      navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          animate(link, {
            scale: 1.1,
            y: -3,
            rotate: 2,
            duration: 200,
            ease: 'outBack'
          })
        })

        link.addEventListener('mouseleave', () => {
          animate(link, {
            scale: 1,
            y: 0,
            rotate: 0,
            duration: 200,
            ease: 'outBack'
          })
        })
      })

      // Button advanced hover effects
      const buttons = document.querySelectorAll('.btn')
      buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          animate(button, {
            keyframes: [
              { scale: 1.05, y: -2, ease: 'outBack', duration: 150 },
              { scale: 1.1, y: -5, ease: 'outElastic', duration: 100 }
            ],
            duration: 250
          })
        })

        button.addEventListener('mouseleave', () => {
          animate(button, {
            scale: 1,
            y: 0,
            duration: 200,
            ease: 'outBack'
          })
        })
      })

      // Brand logo continuous subtle animation
      const brand = document.querySelector('.navbar-brand')
      if (brand) {
        animate(brand, {
          keyframes: [
            { rotate: 0, scale: 1, ease: 'inOutSine', duration: 2000 },
            { rotate: 2, scale: 1.02, ease: 'inOutSine', duration: 2000 },
            { rotate: 0, scale: 1, ease: 'inOutSine', duration: 2000 }
          ],
          loop: true,
          duration: 6000
        })
      }
    }

    return {
      isAuthenticated,
      user,
      userType,
      logout
    }
  }
}
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
  color: var(--cyber-text) !important;
  text-decoration: none;
  text-shadow: var(--cyber-glow-faint);
}

.navbar-brand:hover {
  color: var(--cyber-orange) !important;
  text-shadow: var(--cyber-glow);
}

.nav-link {
  font-weight: 500;
  color: var(--cyber-text-muted) !important;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--cyber-orange) !important;
}

.nav-link.router-link-active {
  color: var(--cyber-orange) !important;
}

.dropdown-menu {
  background: var(--cyber-grey) !important;
  border: 1px solid var(--cyber-orange) !important;
  box-shadow: var(--cyber-glow) !important;
  border-radius: 8px;
  padding: 8px 0;
}

.dropdown-item {
  padding: 8px 16px;
  transition: all 0.3s ease;
  color: var(--cyber-text) !important;
}

.dropdown-item:hover {
  background-color: var(--cyber-grey-light) !important;
  color: var(--cyber-orange) !important;
}

@media (max-width: 768px) {
  .navbar-nav {
    margin-top: 16px;
  }
  
  .btn {
    margin-top: 8px;
  }
}
</style>
