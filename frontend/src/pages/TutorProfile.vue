<template>
  <div class="tutor-profile-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="display-4 fw-bold mb-3">Tutor Profile</h1>
            <p class="lead">Connect with experienced tutors for personalized learning</p>
          </div>
          <div class="col-md-4 text-end">
            <i class="fas fa-user-graduate fa-5x opacity-75"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Tutor Profile Content -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <!-- Tutor Info Card -->
          <div class="col-lg-4 mb-4">
            <div class="card shadow-lg h-100">
              <div class="card-body text-center">
                <div class="tutor-avatar mb-3">
                  <img 
                    :src="tutor.avatar || '/default-avatar.jpg'" 
                    :alt="tutor.name"
                    class="rounded-circle"
                    style="width: 120px; height: 120px; object-fit: cover;"
                  >
                </div>
                <h3 class="card-title">{{ tutor.name }}</h3>
                <p class="text-muted">{{ tutor.subject }} • {{ tutor.level }}</p>
                <div class="rating mb-3">
                  <i class="fas fa-star text-warning" v-for="n in 5" :key="n"></i>
                  <span class="ms-2">({{ tutor.rating }})</span>
                </div>
                <div class="d-grid gap-2">
                  <button class="btn btn-primary btn-lg">
                    <i class="fas fa-calendar-plus me-2"></i>Book Session
                  </button>
                  <button class="btn btn-outline-primary">
                    <i class="fas fa-comment me-2"></i>Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tutor Details -->
          <div class="col-lg-8">
            <!-- About Section -->
            <div class="card shadow-sm mb-4">
              <div class="card-header">
                <h4 class="mb-0">
                  <i class="fas fa-user me-2"></i>About {{ tutor.name }}
                </h4>
              </div>
              <div class="card-body">
                <p class="card-text">{{ tutor.bio }}</p>
                <div class="row">
                  <div class="col-md-6">
                    <h6><i class="fas fa-graduation-cap me-2"></i>Education</h6>
                    <p>{{ tutor.education }}</p>
                  </div>
                  <div class="col-md-6">
                    <h6><i class="fas fa-briefcase me-2"></i>Experience</h6>
                    <p>{{ tutor.experience }} years</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Subjects & Levels -->
            <div class="card shadow-sm mb-4">
              <div class="card-header">
                <h4 class="mb-0">
                  <i class="fas fa-book me-2"></i>Subjects & Levels
                </h4>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <h6>Subjects</h6>
                    <div class="d-flex flex-wrap gap-2">
                      <span 
                        class="badge bg-primary" 
                        v-for="subject in tutor.subjects" 
                        :key="subject"
                      >
                        {{ subject }}
                      </span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <h6>Levels</h6>
                    <div class="d-flex flex-wrap gap-2">
                      <span 
                        class="badge bg-success" 
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
            <div class="card shadow-sm mb-4">
              <div class="card-header">
                <h4 class="mb-0">
                  <i class="fas fa-dollar-sign me-2"></i>Pricing
                </h4>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4">
                    <div class="text-center p-3 border rounded">
                      <h5 class="text-primary">${{ tutor.hourlyRate }}/hour</h5>
                      <small class="text-muted">Individual Session</small>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="text-center p-3 border rounded">
                      <h5 class="text-success">${{ tutor.groupRate }}/hour</h5>
                      <small class="text-muted">Group Session</small>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="text-center p-3 border rounded">
                      <h5 class="text-info">${{ tutor.packageRate }}/month</h5>
                      <small class="text-muted">Monthly Package</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews -->
            <div class="card shadow-sm">
              <div class="card-header">
                <h4 class="mb-0">
                  <i class="fas fa-star me-2"></i>Reviews ({{ reviews.length }})
                </h4>
              </div>
              <div class="card-body">
                <div v-for="review in reviews" :key="review.id" class="review-item mb-3 p-3 border rounded">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="mb-1">{{ review.studentName }}</h6>
                      <div class="rating mb-2">
                        <i 
                          class="fas fa-star" 
                          :class="n <= review.rating ? 'text-warning' : 'text-muted'"
                          v-for="n in 5" 
                          :key="n"
                        ></i>
                      </div>
                      <p class="mb-0">{{ review.comment }}</p>
                    </div>
                    <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'TutorProfile',
  setup() {
    const route = useRoute()
    const tutor = ref({
      id: 1,
      name: 'Dr. Sarah Chen',
      subject: 'Mathematics',
      level: 'Secondary',
      avatar: '/default-avatar.jpg',
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

    onMounted(() => {
      // Load tutor data based on route parameter
      const tutorId = route.params.id
      if (tutorId) {
        // Fetch tutor data from API
        console.log('Loading tutor:', tutorId)
      }
    })

    return {
      tutor,
      reviews,
      formatDate
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.tutor-avatar img {
  border: 4px solid #fff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.rating i {
  font-size: 1.2em;
}

.review-item {
  background-color: #f8f9fa;
  transition: transform 0.2s ease;
}

.review-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
</style>
