<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section text-white py-5">
      <div class="container">
        <div class="row align-items-center min-vh-50 hero-row">
          <div class="col-lg-6 col-12 hero-content-col">
            <div class="hero-content">
              <h1 class="display-4 fw-bold mb-4 hero-title cyberpunk-glow">
                Find Your Perfect Tutor in Singapore
              </h1>
              <p class="lead mb-4 hero-subtitle">
                Connect with verified tutors and tuition centres. Transparent pricing, 
                real-time availability, and instant booking for all subjects and levels.
              </p>
              <div class="d-flex gap-3 flex-wrap hero-buttons">
                <router-link to="/search" class="btn btn-cyberpunk btn-lg">
                  <i class="fas fa-search me-2"></i>
                  Find Tutors
                </router-link>
                <router-link to="/register" class="btn btn-cyberpunk btn-lg">
                  <i class="fas fa-user-plus me-2"></i>
                  Join as Tutor
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-12 hero-logo-col">
            <div class="text-center hero-logo-container">
              <div class="hero-image rounded-4 p-4 shadow-lg hero-logo cyberpunk-glow" style="background: var(--cyber-grey); border: 2px solid var(--cyber-orange);">
                <i class="fas fa-graduation-cap text-primary" style="font-size: 8rem; color: var(--cyber-orange) !important;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5" data-animation="fadeInUp">
          <h2 class="display-5 fw-bold mb-3">Why Choose OnlyTutor?</h2>
          <p class="lead text-muted">Everything you need for successful tutoring</p>
        </div>

        <div class="row g-4 mb-5" data-animation="slideInStagger">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="col-lg-4 col-md-6 feature-card"
            data-stagger-item
          >
            <div class="card h-100 cyberpunk-feature-card">
              <div class="card-body text-center p-4">
                <div class="feature-icon cyberpunk-icon rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                  <i :class="feature.icon" class="cyberpunk-icon-text fs-3"></i>
                </div>
                <h5 class="fw-bold mb-3 cyberpunk-feature-title">{{ feature.title }}</h5>
                <p class="cyberpunk-feature-text">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-5">
      <div class="container">
        <div class="row text-center" data-animation="bounceIn">
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stat-item card p-4" style="background: var(--cyber-grey-light); border: 1px solid var(--cyber-orange);">
              <h3 class="display-4 fw-bold text-primary mb-2 stat-number cyberpunk-glow">500+</h3>
              <p class="text-muted">Verified Tutors</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stat-item card p-4" style="background: var(--cyber-grey-light); border: 1px solid var(--cyber-orange);">
              <h3 class="display-4 fw-bold text-primary mb-2 stat-number cyberpunk-glow">1000+</h3>
              <p class="text-muted">Happy Students</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stat-item card p-4" style="background: var(--cyber-grey-light); border: 1px solid var(--cyber-orange);">
              <h3 class="display-4 fw-bold text-primary mb-2 stat-number cyberpunk-glow">50+</h3>
              <p class="text-muted">Subjects</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="stat-item card p-4" style="background: var(--cyber-grey-light); border: 1px solid var(--cyber-orange);">
              <h3 class="display-4 fw-bold text-primary mb-2 stat-number cyberpunk-glow">4.8★</h3>
              <p class="text-muted">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5">
      <div class="container">
        <div class="text-center cta-section" data-animation="zoomIn">
          <div class="card border-0 shadow-lg" style="background: var(--cyber-grey); border: 2px solid var(--cyber-orange) !important;">
            <div class="card-body p-5">
              <h2 class="display-5 fw-bold mb-3 cyberpunk-glow">Ready to Get Started?</h2>
              <p class="lead text-muted mb-4">
                Join thousands of students and tutors who trust OnlyTutor
              </p>
              <div class="d-flex gap-3 justify-content-center flex-wrap">
                <router-link to="/register" class="btn btn-lg">
                  <i class="fas fa-user-plus me-2"></i>
                  Sign Up Now
                </router-link>
                <router-link to="/search" class="btn btn-outline-light btn-lg">
                  <i class="fas fa-search me-2"></i>
                  Browse Tutors
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { animate, stagger, spring } from 'animejs'
import { useScrollAnimations } from '../composables/useScrollAnimations'
import { useAnimatedBackground } from '../composables/useAnimatedBackground'

export default {
  name: 'Home',
  setup() {
    const { setupScrollAnimations, createParticleEffect, setupParallaxEffect, setupMagneticEffect } = useScrollAnimations()
    const { initAnimatedBackground, cleanup } = useAnimatedBackground()
    const features = ref([
      {
        icon: 'fas fa-search',
        title: 'Easy Discovery',
        description: 'Find tutors by subject, level, location, and price with our advanced search filters.'
      },
      {
        icon: 'fas fa-shield-alt',
        title: 'Verified Profiles',
        description: 'All tutors are verified with credentials, experience, and background checks.'
      },
      {
        icon: 'fas fa-calendar-check',
        title: 'Instant Booking',
        description: 'Book sessions instantly with real-time availability and automated confirmations.'
      },
      {
        icon: 'fas fa-dollar-sign',
        title: 'Transparent Pricing',
        description: 'Clear, upfront pricing with no hidden fees. Compare rates easily.'
      },
      {
        icon: 'fas fa-comments',
        title: 'Direct Messaging',
        description: 'Communicate directly with tutors before and after sessions.'
      },
      {
        icon: 'fas fa-star',
        title: 'Reviews & Ratings',
        description: 'Read genuine reviews and ratings from other students.'
      }
    ])

    onMounted(() => {
      // Remove any existing test elements
      const existingTest = document.getElementById('anime-test')
      if (existingTest) {
        existingTest.remove()
      }
      
      // Initialize animated background
      initAnimatedBackground()
      
      // Advanced Hero section animations with keyframes
      animate('.hero-title', {
        keyframes: [
          { opacity: 0, y: 50, scale: 0.8, ease: 'outExpo', duration: 0 },
          { opacity: 1, y: 0, scale: 1.05, ease: 'outBack', duration: 800 },
          { scale: 1, ease: 'outElastic', duration: 400 }
        ],
        duration: 1200
      })

      animate('.hero-subtitle', {
        keyframes: [
          { opacity: 0, y: 30, ease: 'outExpo', duration: 0 },
          { opacity: 1, y: 0, ease: 'outCubic', duration: 600 }
        ],
        delay: 300,
        duration: 600
      })

      animate('.hero-buttons', {
        keyframes: [
          { opacity: 0, y: 20, scale: 0.9, ease: 'outExpo', duration: 0 },
          { opacity: 1, y: 0, scale: 1, ease: 'outBack', duration: 500 }
        ],
        delay: 600,
        duration: 500
      })

      // Advanced logo animation with complex keyframes
      animate('.hero-logo', {
        keyframes: [
          { scale: 0.5, rotate: -180, ease: 'outExpo', duration: 0 },
          { scale: 1.2, rotate: 10, ease: 'outBack', duration: 600 },
          { scale: 1, rotate: 0, ease: spring({ bounce: 0.6 }), duration: 400 }
        ],
        delay: 400,
        duration: 1000
      })

      // Feature cards with advanced staggered animations
      animate('.feature-card', {
        keyframes: [
          { opacity: 0, y: 80, scale: 0.8, rotate: -5, ease: 'outExpo', duration: 0 },
          { opacity: 1, y: 0, scale: 1.05, rotate: 2, ease: 'outBack', duration: 600 },
          { scale: 1, rotate: 0, ease: 'outElastic', duration: 300 }
        ],
        delay: stagger(200, { start: 800 }),
        duration: 900
      })

      // Advanced stats animation with counter effect
      animate('.stat-number', {
        keyframes: [
          { scale: 0, rotate: 360, ease: 'outExpo', duration: 0 },
          { scale: 1.3, rotate: 0, ease: 'outBack', duration: 600 },
          { scale: 1, ease: spring({ bounce: 0.4 }), duration: 400 }
        ],
        delay: stagger(300, { start: 1200 }),
        duration: 1000
      })

      // CTA section with dramatic entrance
      animate('.cta-section', {
        keyframes: [
          { opacity: 0, y: 60, scale: 0.9, ease: 'outExpo', duration: 0 },
          { opacity: 1, y: 0, scale: 1.02, ease: 'outBack', duration: 700 },
          { scale: 1, ease: 'outElastic', duration: 300 }
        ],
        delay: 1000,
        duration: 1000
      })

      // Continuous floating animation with cyberpunk glow
      animate('.hero-logo', {
        keyframes: [
          { y: 0, rotate: 0, scale: 1, ease: 'inOutSine', duration: 1500 },
          { y: -15, rotate: 2, scale: 1.05, ease: 'inOutSine', duration: 1500 },
          { y: 0, rotate: 0, scale: 1, ease: 'inOutSine', duration: 1500 }
        ],
        loop: true,
        duration: 4500
      })

      // Subtle cyberpunk glow animation for title
      animate('.hero-title', {
        keyframes: [
          { textShadow: '0 0 8px rgba(255, 140, 66, 0.3)', ease: 'inOutSine', duration: 3000 },
          { textShadow: '0 0 15px rgba(255, 140, 66, 0.5)', ease: 'inOutSine', duration: 3000 },
          { textShadow: '0 0 8px rgba(255, 140, 66, 0.3)', ease: 'inOutSine', duration: 3000 }
        ],
        loop: true,
        duration: 9000
      })

      // Add interactive hover effects
      setupInteractiveAnimations()
      
      // Setup scroll-triggered animations
      setupScrollAnimations()
      
      // Setup parallax effects
      setupParallaxEffect()
    })

    onUnmounted(() => {
      // Clean up animated background when component unmounts
      cleanup()
    })

    const setupInteractiveAnimations = () => {
      // Feature card hover effects with particle effects
      const featureCards = document.querySelectorAll('.feature-card')
      featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          animate(card, {
            scale: 1.05,
            y: -10,
            rotate: 2,
            duration: 300,
            ease: 'outBack'
          })
          
          // Add particle effect on hover
          createParticleEffect(card)
        })

        card.addEventListener('mouseleave', () => {
          animate(card, {
            scale: 1,
            y: 0,
            rotate: 0,
            duration: 300,
            ease: 'outBack'
          })
        })

        // Add magnetic effect
        setupMagneticEffect(card)
      })

      // Button hover effects
      const buttons = document.querySelectorAll('.btn')
      buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          animate(button, {
            scale: 1.1,
            y: -5,
            duration: 200,
            ease: 'outBack'
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

      // Stats hover effects
      const statNumbers = document.querySelectorAll('.stat-number')
      statNumbers.forEach(stat => {
        stat.addEventListener('mouseenter', () => {
          animate(stat, {
            scale: 1.2,
            rotate: 5,
            duration: 300,
            ease: 'outElastic'
          })
        })

        stat.addEventListener('mouseleave', () => {
          animate(stat, {
            scale: 1,
            rotate: 0,
            duration: 300,
            ease: 'outElastic'
          })
        })
      })
    }

    return {
      features
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
}

.hero-image {
  max-width: 400px;
  margin: 0 auto;
}

.feature-icon {
  transition: all 0.3s ease;
}

.card:hover .feature-icon {
  transform: scale(1.1);
  background-color: var(--primary-color) !important;
}

.card:hover .feature-icon i {
  color: white !important;
}

.stat-item {
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

/* Fix for 979px overlap issue - Hero logo overlapping with buttons */
@media (max-width: 979px) {
  .hero-section {
    padding-top: 4rem !important;
    margin-top: 2rem;
  }
  
  .hero-content {
    margin-top: 1rem;
  }
  
  .display-4 {
    font-size: 2.3rem;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  .hero-buttons {
    margin-top: 1.5rem;
  }
  
  /* Move hero logo below content to prevent overlap */
  .hero-row {
    display: flex;
    flex-direction: column;
  }
  
  .hero-content-col {
    order: 1;
  }
  
  .hero-logo-col {
    order: 2;
  }
  
  .hero-logo-container {
    margin-top: 3rem !important;
  }
  
  .hero-content {
    margin-bottom: 2rem;
  }
  
  /* Reduce hero logo size at this breakpoint */
  .hero-image {
    max-width: 280px !important;
  }
  
  .hero-image i {
    font-size: 4.5rem !important;
  }
}

/* Fix for 924px overlap issue - Hero logo overlapping with buttons */
@media (max-width: 924px) {
  .hero-section {
    padding-top: 4rem !important;
    margin-top: 2rem;
  }
  
  .hero-content {
    margin-top: 1rem;
  }
  
  .display-4 {
    font-size: 2.2rem;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  .hero-buttons {
    margin-top: 1.5rem;
  }
  
  /* Move hero logo below content to prevent overlap */
  .hero-row {
    display: flex;
    flex-direction: column;
  }
  
  .hero-content-col {
    order: 1;
  }
  
  .hero-logo-col {
    order: 2;
  }
  
  .hero-logo-container {
    margin-top: 3rem !important;
  }
  
  .hero-content {
    margin-bottom: 2rem;
  }
  
  /* Reduce hero logo size at this breakpoint */
  .hero-image {
    max-width: 250px !important;
  }
  
  .hero-image i {
    font-size: 4rem !important;
  }
}

/* Fix for 783px overlap issue - Hero logo overlapping with buttons */
@media (max-width: 783px) {
  .hero-section {
    padding-top: 4rem !important;
    margin-top: 2rem;
  }
  
  .hero-content {
    margin-top: 1rem;
  }
  
  .display-4 {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  .hero-buttons {
    margin-top: 1.5rem;
  }
  
  /* Move hero logo below content to prevent overlap */
  .hero-row {
    display: flex;
    flex-direction: column;
  }
  
  .hero-content-col {
    order: 1;
  }
  
  .hero-logo-col {
    order: 2;
  }
  
  .hero-logo-container {
    margin-top: 3rem !important;
  }
  
  .hero-content {
    margin-bottom: 2rem;
  }
  
  /* Reduce hero logo size at this breakpoint */
  .hero-image {
    max-width: 200px !important;
  }
  
  .hero-image i {
    font-size: 3rem !important;
  }
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .hero-section {
    min-height: 60vh;
    text-align: center;
    padding: 2rem 0;
    padding-top: 4rem !important;
  }
  
  .hero-content {
    margin-bottom: 2rem;
  }
  
  .display-4 {
    font-size: 2.2rem;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  .lead {
    font-size: 1rem;
    line-height: 1.4;
  }
  
  .hero-buttons {
    justify-content: center;
    gap: 1rem;
  }
  
  .hero-buttons .btn {
    flex: 1;
    min-width: 140px;
    font-size: 0.9rem;
    padding: 0.75rem 1rem;
  }
  
  .hero-logo-container {
    margin-top: 2rem;
  }
  
  .hero-image {
    max-width: 250px;
    margin: 0 auto;
  }
  
  .hero-image i {
    font-size: 4rem !important;
  }
}

@media (max-width: 576px) {
  .display-4 {
    font-size: 1.8rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-buttons .btn {
    width: 100%;
    max-width: 200px;
  }
  
  .hero-image {
    max-width: 200px;
  }
  
  .hero-image i {
    font-size: 3rem !important;
  }
}
</style>
