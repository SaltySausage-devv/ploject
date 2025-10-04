<template>
  <div class="search-page">
    <div class="container py-5">
      <!-- Search Header -->
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
        class="row mb-5"
      >
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h2 class="fw-bold mb-4">
                <i class="fas fa-search me-2 text-primary"></i>
                Find Your Perfect Tutor
              </h2>
              
              <!-- Search Form -->
              <form @submit.prevent="searchTutors" class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Subject</label>
                  <select v-model="filters.subject" class="form-select">
                    <option value="">All Subjects</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Science">Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Additional Mathematics">Additional Mathematics</option>
                  </select>
                </div>
                
                <div class="col-md-4">
                  <label class="form-label">Level</label>
                  <select v-model="filters.level" class="form-select">
                    <option value="">All Levels</option>
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="JC">JC</option>
                    <option value="IB">IB</option>
                    <option value="IGCSE">IGCSE</option>
                  </select>
                </div>
                
                <div class="col-md-4">
                  <label class="form-label">Teaching Mode</label>
                  <select v-model="filters.teachingMode" class="form-select">
                    <option value="">Any Mode</option>
                    <option value="online">Online Only</option>
                    <option value="in-person">In-Person Only</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Location</label>
                  <input
                    type="text"
                    v-model="filters.location"
                    class="form-control"
                    placeholder="Enter location or postal code"
                  />
                </div>
                
                <div class="col-md-3">
                  <label class="form-label">Min Rate ($/hr)</label>
                  <input
                    type="number"
                    v-model="filters.minRate"
                    class="form-control"
                    placeholder="0"
                  />
                </div>
                
                <div class="col-md-3">
                  <label class="form-label">Max Rate ($/hr)</label>
                  <input
                    type="number"
                    v-model="filters.maxRate"
                    class="form-control"
                    placeholder="100"
                  />
                </div>
                
                <div class="col-12">
                  <button type="submit" class="btn btn-primary" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner me-2"></span>
                    <i v-else class="fas fa-search me-2"></i>
                    {{ isLoading ? 'Searching...' : 'Search Tutors' }}
                  </button>
                  <button type="button" @click="clearFilters" class="btn btn-outline-secondary ms-2">
                    <i class="fas fa-times me-2"></i>
                    Clear Filters
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      <!-- Results -->
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.1 }"
        class="row"
      >
        <!-- Filters Sidebar -->
        <div class="col-lg-3 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom">
              <h6 class="fw-bold mb-0">Refine Search</h6>
            </div>
            <div class="card-body">
              <!-- Rating Filter -->
              <div class="mb-4">
                <h6 class="fw-bold mb-3">Rating</h6>
                <div class="form-check" v-for="rating in [5, 4, 3, 2, 1]" :key="rating">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`rating-${rating}`"
                    :value="rating"
                    v-model="filters.ratings"
                  />
                  <label class="form-check-label d-flex align-items-center" :for="`rating-${rating}`">
                    <div class="rating me-2">
                      <i v-for="i in 5" :key="i" :class="i <= rating ? 'fas fa-star star' : 'far fa-star star empty'"></i>
                    </div>
                    <span class="text-muted">({{ Math.random() * 50 + 10 | Math.floor }})</span>
                  </label>
                </div>
              </div>

              <!-- Experience Filter -->
              <div class="mb-4">
                <h6 class="fw-bold mb-3">Experience</h6>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="exp-1" value="1-2" v-model="filters.experience" />
                  <label class="form-check-label" for="exp-1">1-2 years</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="exp-2" value="3-5" v-model="filters.experience" />
                  <label class="form-check-label" for="exp-2">3-5 years</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="exp-3" value="5+" v-model="filters.experience" />
                  <label class="form-check-label" for="exp-3">5+ years</label>
                </div>
              </div>

              <!-- Availability Filter -->
              <div class="mb-4">
                <h6 class="fw-bold mb-3">Availability</h6>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="avail-now" value="now" v-model="filters.availability" />
                  <label class="form-check-label" for="avail-now">Available Now</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="avail-week" value="week" v-model="filters.availability" />
                  <label class="form-check-label" for="avail-week">This Week</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="avail-weekend" value="weekend" v-model="filters.availability" />
                  <label class="form-check-label" for="avail-weekend">Weekends</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div class="col-lg-9">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0">
              {{ tutors.length }} tutors found
            </h5>
            <div class="d-flex align-items-center gap-3">
              <span class="text-muted">Sort by:</span>
              <select v-model="sortBy" class="form-select" style="width: auto;">
                <option value="rating">Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="experience">Experience</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>

          <!-- Tutor Cards -->
          <div v-if="tutors.length === 0 && !isLoading" class="text-center py-5">
            <i class="fas fa-search text-muted fs-1 mb-3"></i>
            <h5 class="text-muted">No tutors found</h5>
            <p class="text-muted">Try adjusting your search criteria</p>
          </div>

          <div v-else class="row g-4">
            <motion.div
              v-for="(tutor, index) in tutors"
              :key="tutor.id"
              :initial="{ opacity: 0, y: 30 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.6, delay: index * 0.1 }"
              class="col-lg-6"
            >
              <div class="card border-0 shadow-sm h-100 tutor-card">
                <div class="card-body p-4">
                  <div class="d-flex align-items-start mb-3">
                    <div class="tutor-avatar bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px;">
                      <i class="fas fa-user text-primary fs-4"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="fw-bold mb-1">{{ tutor.name }}</h6>
                      <p class="text-muted mb-2">{{ tutor.subjects.join(', ') }}</p>
                      <div class="d-flex align-items-center mb-2">
                        <div class="rating me-2">
                          <i v-for="i in 5" :key="i" :class="i <= tutor.rating ? 'fas fa-star star' : 'far fa-star star empty'"></i>
                        </div>
                        <span class="text-muted">({{ tutor.reviews }} reviews)</span>
                      </div>
                    </div>
                    <div class="text-end">
                      <h5 class="fw-bold text-primary mb-0">${{ tutor.hourlyRate }}/hr</h5>
                    </div>
                  </div>

                  <div class="mb-3">
                    <p class="text-muted mb-2">{{ tutor.bio }}</p>
                    <div class="d-flex flex-wrap gap-1">
                      <span v-for="level in tutor.levels" :key="level" class="badge bg-light text-dark">{{ level }}</span>
                    </div>
                  </div>

                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center text-muted">
                      <i class="fas fa-map-marker-alt me-1"></i>
                      <small>{{ tutor.location }}</small>
                    </div>
                    <div class="d-flex gap-2">
                      <button class="btn btn-outline-primary btn-sm">
                        <i class="fas fa-heart"></i>
                      </button>
                      <router-link :to="`/tutor/${tutor.id}`" class="btn btn-primary btn-sm">
                        View Profile
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <!-- Load More Button -->
          <div v-if="tutors.length > 0" class="text-center mt-5">
            <button class="btn btn-outline-primary" @click="loadMore">
              <i class="fas fa-plus me-2"></i>
              Load More Tutors
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'SearchTutors',
  setup() {
    const filters = reactive({
      subject: '',
      level: '',
      teachingMode: '',
      location: '',
      minRate: '',
      maxRate: '',
      ratings: [],
      experience: [],
      availability: []
    })

    const sortBy = ref('rating')
    const tutors = ref([])
    const isLoading = ref(false)

    const searchTutors = async () => {
      isLoading.value = true
      
      // Simulate API call
      setTimeout(() => {
        tutors.value = [
          {
            id: 1,
            name: 'Dr. Sarah Chen',
            subjects: ['Mathematics', 'Additional Mathematics'],
            levels: ['Secondary', 'JC'],
            rating: 4.9,
            reviews: 127,
            hourlyRate: 80,
            bio: 'Experienced mathematics tutor with 8 years of experience. Specializes in O-Level and A-Level mathematics.',
            location: 'Orchard, Singapore',
            teachingMode: 'online'
          },
          {
            id: 2,
            name: 'Mr. David Lim',
            subjects: ['Physics', 'Chemistry'],
            levels: ['Secondary', 'JC'],
            rating: 4.7,
            reviews: 89,
            hourlyRate: 70,
            bio: 'Former MOE teacher with 10 years of experience. Excellent track record with students.',
            location: 'Marina Bay, Singapore',
            teachingMode: 'in-person'
          },
          {
            id: 3,
            name: 'Ms. Emily Wong',
            subjects: ['English', 'Literature'],
            levels: ['Primary', 'Secondary'],
            rating: 4.8,
            reviews: 156,
            hourlyRate: 60,
            bio: 'Passionate English tutor with a focus on creative writing and comprehension skills.',
            location: 'Tampines, Singapore',
            teachingMode: 'both'
          }
        ]
        isLoading.value = false
      }, 1000)
    }

    const clearFilters = () => {
      Object.keys(filters).forEach(key => {
        if (Array.isArray(filters[key])) {
          filters[key] = []
        } else {
          filters[key] = ''
        }
      })
    }

    const loadMore = () => {
      // Add more tutors to the list
      tutors.value.push(...tutors.value.slice(0, 3))
    }

    onMounted(() => {
      searchTutors()
    })

    return {
      filters,
      sortBy,
      tutors,
      isLoading,
      searchTutors,
      clearFilters,
      loadMore
    }
  }
}
</script>

<style scoped>
.search-page {
  background-color: var(--light-bg);
  min-height: 100vh;
}

.tutor-card {
  transition: all 0.3s ease;
}

.tutor-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.tutor-avatar {
  transition: transform 0.3s ease;
}

.tutor-card:hover .tutor-avatar {
  transform: scale(1.1);
}

.rating .star {
  color: #fbbf24;
  font-size: 0.9rem;
}

.rating .star.empty {
  color: #d1d5db;
}

.form-check-input:checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-outline-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .tutor-card .card-body {
    padding: 1.5rem !important;
  }
  
  .tutor-avatar {
    width: 50px !important;
    height: 50px !important;
  }
}
</style>
