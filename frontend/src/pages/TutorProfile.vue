<template>
  <div class="tutor-profile-page">
    <!-- Floating Background Elements -->
    <div class="floating-elements">
      <div class="floating-icon" ref="floatingIcon1">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <div class="floating-icon" ref="floatingIcon2">
        <i class="fas fa-book"></i>
      </div>
      <div class="floating-icon" ref="floatingIcon3">
        <i class="fas fa-star"></i>
      </div>
      <div class="floating-icon" ref="floatingIcon4">
        <i class="fas fa-chalkboard-teacher"></i>
      </div>
      <div class="floating-icon" ref="floatingIcon5">
        <i class="fas fa-lightbulb"></i>
      </div>
      <div class="floating-icon" ref="floatingIcon6">
        <i class="fas fa-calculator"></i>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="cyberpunk-hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="cyberpunk-hero-title" ref="heroTitle">Tutor Profile</h1>
            <p class="cyberpunk-hero-subtitle" ref="heroSubtitle">Connect with experienced tutors for personalized learning</p>
          </div>
          <div class="col-md-4 text-end">
            <i class="fas fa-user-graduate cyberpunk-hero-icon" ref="heroIcon"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Tutor Profile Content -->
    <section class="cyberpunk-content-section">
      <div class="container">
        <div class="row">
          <!-- Tutor Info Card -->
          <div class="col-lg-4 mb-4">
            <div class="cyberpunk-tutor-card" ref="tutorCard">
              <div class="cyberpunk-card-body text-center">
                <div class="cyberpunk-tutor-avatar mb-3">
                  <img 
                    :src="tutor.avatar" 
                    :alt="tutor.name"
                    class="cyberpunk-avatar-img"
                    ref="tutorAvatar"
                  >
                </div>
                <h3 class="cyberpunk-tutor-name">{{ tutor.name }}</h3>
                <p class="cyberpunk-tutor-specialization">{{ tutor.subject }} • {{ tutor.level }}</p>
                <div class="cyberpunk-rating mb-3">
                  <i class="fas fa-star cyberpunk-star" v-for="n in 5" :key="n"></i>
                  <span class="cyberpunk-rating-text">({{ tutor.rating }})</span>
                </div>
                <div class="cyberpunk-button-group">
                  <button class="cyberpunk-btn cyberpunk-btn-primary" ref="bookButton">
                    <i class="fas fa-calendar-plus me-2"></i>Book Session
                  </button>
                  <button class="cyberpunk-btn cyberpunk-btn-outline" ref="messageButton">
                    <i class="fas fa-comment me-2"></i>Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tutor Details -->
          <div class="col-lg-8">
            <!-- About Section -->
            <div class="cyberpunk-detail-card mb-4" ref="aboutCard">
              <div class="cyberpunk-card-header">
                <h4 class="cyberpunk-card-title">
                  <i class="fas fa-user me-2"></i>About {{ tutor.name }}
                </h4>
              </div>
              <div class="cyberpunk-card-body">
                <p class="cyberpunk-card-text">{{ tutor.bio }}</p>
                <div class="row">
                  <div class="col-md-6">
                    <h6 class="cyberpunk-info-title"><i class="fas fa-graduation-cap me-2"></i>Education</h6>
                    <p class="cyberpunk-info-text">{{ tutor.education }}</p>
                  </div>
                  <div class="col-md-6">
                    <h6 class="cyberpunk-info-title"><i class="fas fa-briefcase me-2"></i>Experience</h6>
                    <p class="cyberpunk-info-text">{{ tutor.experience }} years</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Subjects & Levels -->
            <div class="cyberpunk-detail-card mb-4" ref="subjectsCard">
              <div class="cyberpunk-card-header">
                <h4 class="cyberpunk-card-title">
                  <i class="fas fa-book me-2"></i>Subjects & Levels
                </h4>
              </div>
              <div class="cyberpunk-card-body">
                <div class="row">
                  <div class="col-md-6">
                    <h6 class="cyberpunk-section-title">Subjects</h6>
                    <div class="cyberpunk-tags">
                      <span 
                        class="cyberpunk-tag cyberpunk-tag-primary" 
                        v-for="subject in tutor.subjects" 
                        :key="subject"
                      >
                        {{ subject }}
                      </span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <h6 class="cyberpunk-section-title">Levels</h6>
                    <div class="cyberpunk-tags">
                      <span 
                        class="cyberpunk-tag cyberpunk-tag-success" 
                        v-for="level in tutor.levels" 
                        :key="level"
                      >
                        {{ level }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pricing -->
            <div class="cyberpunk-detail-card mb-4" ref="pricingCard">
              <div class="cyberpunk-card-header">
                <h4 class="cyberpunk-card-title">
                  <i class="fas fa-dollar-sign me-2"></i>Pricing
                </h4>
              </div>
              <div class="cyberpunk-card-body">
                <div class="row">
                  <div class="col-md-4">
                    <div class="cyberpunk-pricing-item">
                      <h5 class="cyberpunk-price cyberpunk-price-primary">${{ tutor.hourlyRate }}/hour</h5>
                      <small class="cyberpunk-price-label">Individual Session</small>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="cyberpunk-pricing-item">
                      <h5 class="cyberpunk-price cyberpunk-price-success">${{ tutor.groupRate }}/hour</h5>
                      <small class="cyberpunk-price-label">Group Session</small>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="cyberpunk-pricing-item">
                      <h5 class="cyberpunk-price cyberpunk-price-info">${{ tutor.packageRate }}/month</h5>
                      <small class="cyberpunk-price-label">Monthly Package</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews -->
            <div class="cyberpunk-detail-card" ref="reviewsCard">
              <div class="cyberpunk-card-header">
                <h4 class="cyberpunk-card-title">
                  <i class="fas fa-star me-2"></i>Reviews ({{ reviews.length }})
                </h4>
              </div>
              <div class="cyberpunk-card-body">
                <div v-for="review in reviews" :key="review.id" class="cyberpunk-review-item">
                  <div class="cyberpunk-review-content">
                    <div>
                      <h6 class="cyberpunk-review-name">{{ review.studentName }}</h6>
                      <div class="cyberpunk-review-rating">
                        <i 
                          class="fas fa-star" 
                          :class="n <= review.rating ? 'cyberpunk-star-filled' : 'cyberpunk-star-empty'"
                          v-for="n in 5" 
                          :key="n"
                        ></i>
                      </div>
                      <p class="cyberpunk-review-comment">{{ review.comment }}</p>
                    </div>
                    <small class="cyberpunk-review-date">{{ formatDate(review.createdAt) }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { createTimeline, animate, createAnimatable, utils } from 'animejs'

export default {
  name: 'TutorProfile',
  setup() {
    const route = useRoute()
    
    // Refs for animations
    const heroTitle = ref(null)
    const heroSubtitle = ref(null)
    const heroIcon = ref(null)
    const tutorCard = ref(null)
    const tutorAvatar = ref(null)
    const bookButton = ref(null)
    const messageButton = ref(null)
    const aboutCard = ref(null)
    const subjectsCard = ref(null)
    const pricingCard = ref(null)
    const reviewsCard = ref(null)
    const floatingIcon1 = ref(null)
    const floatingIcon2 = ref(null)
    const floatingIcon3 = ref(null)
    const floatingIcon4 = ref(null)
    const floatingIcon5 = ref(null)
    const floatingIcon6 = ref(null)

    const tutor = ref({
      id: 1,
      name: 'Dr. Sarah Chen',
      subject: 'Mathematics',
      level: 'Secondary',
      avatar: 'https://i.pravatar.cc/400?img=3',
      rating: 4.8,
      bio: 'Experienced mathematics tutor with over 10 years of teaching experience. Specialized in helping students excel in algebra, calculus, and statistics.',
      education: 'PhD in Mathematics, NUS',
      experience: 10,
      subjects: ['Mathematics', 'Statistics', 'Calculus'],
      levels: ['Primary', 'Secondary', 'JC'],
      hourlyRate: 80,
      groupRate: 60,
      packageRate: 300
    })

    // Sample tutors data - in real app, this would come from API
    const tutorsData = {
      1: {
        id: 1,
        name: 'Dr. Sarah Chen',
        subject: 'Mathematics',
        level: 'Secondary',
        avatar: 'https://i.pravatar.cc/400?img=3',
        rating: 4.8,
        bio: 'Experienced mathematics tutor with over 10 years of teaching experience. Specialized in helping students excel in algebra, calculus, and statistics.',
        education: 'PhD in Mathematics, NUS',
        experience: 10,
        subjects: ['Mathematics', 'Statistics', 'Calculus'],
        levels: ['Primary', 'Secondary', 'JC'],
        hourlyRate: 80,
        groupRate: 60,
        packageRate: 300
      },
      2: {
        id: 2,
        name: 'Mr. David Lim',
        subject: 'Physics',
        level: 'Secondary',
        avatar: 'https://i.pravatar.cc/400?img=5',
        rating: 4.5,
        bio: 'Former MOE teacher with 10 years of experience. Excellent track record with students in physics and chemistry.',
        education: 'MSc in Physics, NTU',
        experience: 10,
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        levels: ['Secondary', 'JC'],
        hourlyRate: 70,
        groupRate: 50,
        packageRate: 250
      },
      3: {
        id: 3,
        name: 'Ms. Emily Wong',
        subject: 'English',
        level: 'Primary',
        avatar: 'https://i.pravatar.cc/400?img=7',
        rating: 4.9,
        bio: 'Passionate English tutor with a focus on creative writing and comprehension skills. Helps students excel in literature and language.',
        education: 'MA in English Literature, NUS',
        experience: 8,
        subjects: ['English', 'Literature', 'Creative Writing'],
        levels: ['Primary', 'Secondary'],
        hourlyRate: 60,
        groupRate: 45,
        packageRate: 200
      }
    }

    const reviews = ref([
      {
        id: 1,
        studentName: 'John Lim',
        rating: 5,
        comment: 'Excellent tutor! Sarah helped me improve my math grades significantly.',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        studentName: 'Mary Tan',
        rating: 5,
        comment: 'Very patient and explains concepts clearly. Highly recommended!',
        createdAt: '2024-01-10'
      },
      {
        id: 3,
        studentName: 'David Wong',
        rating: 4,
        comment: 'Great teaching methods and very knowledgeable.',
        createdAt: '2024-01-05'
      }
    ])

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }


    const initProfileAnimations = () => {
      // Create main timeline
      const profileTimeline = createTimeline({
        defaults: { 
          duration: 800,
          ease: 'out(3)',
          frameRate: 60
        }
      })

      // Hero section animations
      profileTimeline
        .add(heroTitle.value, {
          opacity: [0, 1],
          translateY: [50, 0],
          duration: 1000,
          delay: 0
        })
        .add(heroSubtitle.value, {
          opacity: [0, 1],
          translateY: [50, 0],
          duration: 1000,
          delay: 200
        })
        .add(heroIcon.value, {
          opacity: [0, 1],
          translateY: [50, 0],
          duration: 1000,
          delay: 400
        })

      // Tutor card animation
      profileTimeline
        .add(tutorCard.value, {
          opacity: [0, 1],
          translateX: [-100, 0],
          duration: 1200,
          delay: 800
        })

      // Avatar animation
      profileTimeline
        .add(tutorAvatar.value, {
          scale: [0, 1],
          rotate: [180, 0],
          duration: 1000,
          delay: 1000,
          ease: 'out(4)'
        })

      // Button animations
      profileTimeline
        .add(bookButton.value, {
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
          delay: 1200
        })
        .add(messageButton.value, {
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
          delay: 1300
        })

      // Detail cards animation
      profileTimeline
        .add(aboutCard.value, {
          opacity: [0, 1],
          translateX: [100, 0],
          duration: 1000,
          delay: 1400
        })
        .add(subjectsCard.value, {
          opacity: [0, 1],
          translateX: [100, 0],
          duration: 1000,
          delay: 1600
        })
        .add(pricingCard.value, {
          opacity: [0, 1],
          translateX: [100, 0],
          duration: 1000,
          delay: 1800
        })
        .add(reviewsCard.value, {
          opacity: [0, 1],
          translateX: [100, 0],
          duration: 1000,
          delay: 2000
        })

      // Floating elements animation - single animation, no loop
      const floatingElements = [
        floatingIcon1.value, floatingIcon2.value, floatingIcon3.value,
        floatingIcon4.value, floatingIcon5.value, floatingIcon6.value
      ]

      floatingElements.forEach((element, index) => {
        if (element) {
          profileTimeline.add(element, {
            opacity: [0, 0.1],
            translateY: [0, -10],
            duration: 2000,
            delay: 2200 + (index * 200),
            ease: 'out(2)'
          })
        }
      })
    }

    const handleCardHover = (cardRef) => {
      if (cardRef.value) {
        const hoverTimeline = createTimeline({
          defaults: { duration: 300, ease: 'out(2)' }
        })
        
        hoverTimeline.add(cardRef.value, {
          scale: 1.02
        })
      }
    }

    const handleCardLeave = (cardRef) => {
      if (cardRef.value) {
        const leaveTimeline = createTimeline({
          defaults: { duration: 300, ease: 'out(2)' }
        })
        
        leaveTimeline.add(cardRef.value, {
          scale: 1
        })
      }
    }

    const loadTutorData = (tutorId) => {
      // In a real app, this would be an API call
      // For now, we'll use our sample data
      if (tutorsData[tutorId]) {
        tutor.value = tutorsData[tutorId]
        console.log('Loaded tutor:', tutor.value.name)
      } else {
        console.log('Tutor not found, using default')
        // Keep default tutor data
      }
    }

    onMounted(() => {
      // Load tutor data based on route parameter
      const tutorId = parseInt(route.params.id)
      if (tutorId) {
        loadTutorData(tutorId)
      }

      // Initialize animations
      setTimeout(() => {
        initProfileAnimations()
      }, 100)
    })

    // Watch for route changes to load different tutors
    watch(() => route.params.id, (newTutorId) => {
      if (newTutorId) {
        const tutorId = parseInt(newTutorId)
        loadTutorData(tutorId)
        
        // Re-initialize animations for new tutor
        setTimeout(() => {
          initProfileAnimations()
        }, 100)
      }
    })

    return {
      tutor,
      reviews,
      formatDate,
      heroTitle,
      heroSubtitle,
      heroIcon,
      tutorCard,
      tutorAvatar,
      bookButton,
      messageButton,
      aboutCard,
      subjectsCard,
      pricingCard,
      reviewsCard,
      floatingIcon1,
      floatingIcon2,
      floatingIcon3,
      floatingIcon4,
      floatingIcon5,
      floatingIcon6,
      handleCardHover,
      handleCardLeave
    }
  }
}
</script>

<style scoped>
/* Cyberpunk Tutor Profile Page */
.tutor-profile-page {
  background: var(--cyber-bg);
  color: var(--cyber-text);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Floating Background Elements */
.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-icon {
  position: absolute;
  color: var(--cyber-orange);
  opacity: 0.1;
  font-size: 2rem;
}

.floating-icon:nth-child(1) { top: 10%; left: 10%; }
.floating-icon:nth-child(2) { top: 20%; right: 15%; }
.floating-icon:nth-child(3) { top: 60%; left: 5%; }
.floating-icon:nth-child(4) { top: 70%; right: 10%; }
.floating-icon:nth-child(5) { top: 30%; left: 50%; }
.floating-icon:nth-child(6) { top: 80%; right: 30%; }


/* Hero Section */
.cyberpunk-hero-section {
  background: linear-gradient(135deg, var(--cyber-bg-dark) 0%, var(--cyber-bg) 100%);
  border-bottom: 2px solid var(--cyber-orange);
  padding: 4rem 0;
  position: relative;
  z-index: 2;
}

.cyberpunk-hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--cyber-orange);
  text-shadow: 0 0 20px rgba(255, 140, 66, 0.5);
  margin-bottom: 1rem;
}

.cyberpunk-hero-subtitle {
  font-size: 1.3rem;
  color: var(--cyber-text-muted);
  margin-bottom: 0;
}

.cyberpunk-hero-icon {
  font-size: 5rem;
  color: var(--cyber-orange);
  opacity: 0.8;
  filter: drop-shadow(0 0 10px rgba(255, 140, 66, 0.3));
}

/* Content Section */
.cyberpunk-content-section {
  padding: 3rem 0;
  position: relative;
  z-index: 2;
}

/* Tutor Card */
.cyberpunk-tutor-card {
  background: rgba(26, 26, 26, 0.85);
  border: 1px solid var(--cyber-orange);
  border-radius: 12px;
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.cyberpunk-tutor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(255, 140, 66, 0.2);
}

.cyberpunk-card-body {
  padding: 2rem;
}

.cyberpunk-tutor-avatar {
  position: relative;
}

.cyberpunk-avatar-img {
  width: 120px !important;
  height: 120px !important;
  border: 3px solid var(--cyber-orange);
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 20px rgba(255, 140, 66, 0.3);
}

.cyberpunk-tutor-name {
  color: var(--cyber-text);
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.cyberpunk-tutor-specialization {
  color: var(--cyber-text-muted);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.cyberpunk-rating {
  margin-bottom: 1.5rem;
}

.cyberpunk-star {
  color: var(--cyber-orange);
  font-size: 1.2rem;
  margin-right: 0.2rem;
}

.cyberpunk-rating-text {
  color: var(--cyber-text-muted);
  margin-left: 0.5rem;
}

.cyberpunk-button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cyberpunk-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.cyberpunk-btn-primary {
  background: linear-gradient(45deg, var(--cyber-orange), #ff8c42);
  color: var(--cyber-bg-dark);
  box-shadow: 0 4px 15px rgba(255, 140, 66, 0.3);
}

.cyberpunk-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 140, 66, 0.4);
}

.cyberpunk-btn-outline {
  background: transparent;
  color: var(--cyber-orange);
  border: 2px solid var(--cyber-orange);
}

.cyberpunk-btn-outline:hover {
  background: var(--cyber-orange);
  color: var(--cyber-bg-dark);
  transform: translateY(-2px);
}

/* Detail Cards */
.cyberpunk-detail-card {
  background: rgba(26, 26, 26, 0.85);
  border: 1px solid var(--cyber-grey);
  border-radius: 12px;
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.cyberpunk-detail-card:hover {
  transform: translateY(-3px);
  border-color: var(--cyber-orange);
  box-shadow: 0 12px 40px rgba(255, 140, 66, 0.1);
}

.cyberpunk-card-header {
  background: rgba(255, 140, 66, 0.1);
  border-bottom: 1px solid var(--cyber-orange);
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
}

.cyberpunk-card-title {
  color: var(--cyber-orange);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.cyberpunk-card-body {
  padding: 1.5rem;
}

.cyberpunk-card-text {
  color: var(--cyber-text);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.cyberpunk-info-title {
  color: var(--cyber-orange);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.cyberpunk-info-text {
  color: var(--cyber-text-muted);
  margin-bottom: 1rem;
}

.cyberpunk-section-title {
  color: var(--cyber-text);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* Tags */
.cyberpunk-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cyberpunk-tag {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cyberpunk-tag-primary {
  background: rgba(255, 140, 66, 0.2);
  color: var(--cyber-orange);
  border: 1px solid var(--cyber-orange);
}

.cyberpunk-tag-success {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  border: 1px solid #2ecc71;
}

/* Pricing */
.cyberpunk-pricing-item {
  text-align: center;
  padding: 1.5rem;
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid var(--cyber-grey);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cyberpunk-pricing-item:hover {
  border-color: var(--cyber-orange);
  transform: translateY(-2px);
}

.cyberpunk-price {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.cyberpunk-price-primary {
  color: var(--cyber-orange);
}

.cyberpunk-price-success {
  color: #2ecc71;
}

.cyberpunk-price-info {
  color: #3498db;
}

.cyberpunk-price-label {
  color: var(--cyber-text-muted);
  font-size: 0.9rem;
}

/* Reviews */
.cyberpunk-review-item {
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid var(--cyber-grey);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.cyberpunk-review-item:hover {
  border-color: var(--cyber-orange);
  transform: translateY(-2px);
}

.cyberpunk-review-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.cyberpunk-review-name {
  color: var(--cyber-text);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.cyberpunk-review-rating {
  margin-bottom: 0.8rem;
}

.cyberpunk-star-filled {
  color: var(--cyber-orange);
}

.cyberpunk-star-empty {
  color: var(--cyber-grey);
}

.cyberpunk-review-comment {
  color: var(--cyber-text-muted);
  line-height: 1.5;
  margin-bottom: 0;
}

.cyberpunk-review-date {
  color: var(--cyber-text-muted);
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .cyberpunk-hero-title {
    font-size: 2.5rem;
  }
  
  .cyberpunk-hero-subtitle {
    font-size: 1.1rem;
  }
  
  .cyberpunk-hero-icon {
    font-size: 3rem;
  }
  
  .cyberpunk-tutor-name {
    font-size: 1.5rem;
  }
  
  .cyberpunk-avatar-img {
    width: 100px !important;
    height: 100px !important;
  }
}
</style>
