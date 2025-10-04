<template>
  <div class="booking-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="display-4 fw-bold mb-3">Book a Session</h1>
            <p class="lead">Schedule your tutoring session with ease</p>
          </div>
          <div class="col-md-4 text-end">
            <i class="fas fa-calendar-check fa-5x opacity-75"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Booking Form -->
    <section class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card shadow-lg">
              <div class="card-header bg-white">
                <h3 class="mb-0">
                  <i class="fas fa-calendar-alt me-2"></i>Booking Details
                </h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="submitBooking">
                  <!-- Tutor Selection -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">Select Tutor</label>
                    <select class="form-select" v-model="booking.tutorId" required>
                      <option value="">Choose a tutor...</option>
                      <option v-for="tutor in tutors" :key="tutor.id" :value="tutor.id">
                        {{ tutor.name }} - {{ tutor.subject }} ({{ tutor.level }})
                      </option>
                    </select>
                  </div>

                  <!-- Subject Selection -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">Subject</label>
                    <select class="form-select" v-model="booking.subject" required>
                      <option value="">Select subject...</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="English">English</option>
                      <option value="Science">Science</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>

                  <!-- Session Type -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">Session Type</label>
                    <div class="row">
                      <div class="col-md-4">
                        <div class="form-check">
                          <input 
                            class="form-check-input" 
                            type="radio" 
                            v-model="booking.sessionType" 
                            value="individual" 
                            id="individual"
                          >
                          <label class="form-check-label" for="individual">
                            Individual Session
                          </label>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-check">
                          <input 
                            class="form-check-input" 
                            type="radio" 
                            v-model="booking.sessionType" 
                            value="group" 
                            id="group"
                          >
                          <label class="form-check-label" for="group">
                            Group Session
                          </label>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-check">
                          <input 
                            class="form-check-input" 
                            type="radio" 
                            v-model="booking.sessionType" 
                            value="online" 
                            id="online"
                          >
                          <label class="form-check-label" for="online">
                            Online Session
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Date and Time -->
                  <div class="row mb-4">
                    <div class="col-md-6">
                      <label class="form-label fw-bold">Preferred Date</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="booking.date" 
                        :min="minDate"
                        required
                      >
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold">Preferred Time</label>
                      <select class="form-select" v-model="booking.time" required>
                        <option value="">Select time...</option>
                        <option v-for="time in availableTimes" :key="time" :value="time">
                          {{ time }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Duration -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">Duration</label>
                    <select class="form-select" v-model="booking.duration" required>
                      <option value="">Select duration...</option>
                      <option value="1">1 hour</option>
                      <option value="1.5">1.5 hours</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                    </select>
                  </div>

                  <!-- Location -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">Location</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="booking.location" 
                      placeholder="Enter location or 'Online' for virtual sessions"
                      required
                    >
                  </div>

                  <!-- Special Requirements -->
                  <div class="mb-4">
                    <label class="form-label fw-bold">Special Requirements</label>
                    <textarea 
                      class="form-control" 
                      rows="3" 
                      v-model="booking.requirements"
                      placeholder="Any special requirements or topics you'd like to focus on..."
                    ></textarea>
                  </div>

                  <!-- Pricing Summary -->
                  <div class="card bg-light mb-4">
                    <div class="card-body">
                      <h5 class="card-title">Pricing Summary</h5>
                      <div class="row">
                        <div class="col-md-6">
                          <p class="mb-1">Session Type: <strong>{{ booking.sessionType }}</strong></p>
                          <p class="mb-1">Duration: <strong>{{ booking.duration }} hours</strong></p>
                        </div>
                        <div class="col-md-6 text-end">
                          <h4 class="text-primary mb-0">
                            ${{ calculateTotal() }}
                          </h4>
                          <small class="text-muted">Total amount</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="d-grid">
                    <button 
                      type="submit" 
                      class="btn btn-primary btn-lg"
                      :disabled="!isFormValid"
                    >
                      <i class="fas fa-calendar-check me-2"></i>
                      Book Session
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Booking',
  setup() {
    const route = useRoute()
    
    const booking = ref({
      tutorId: '',
      subject: '',
      sessionType: 'individual',
      date: '',
      time: '',
      duration: '',
      location: '',
      requirements: ''
    })

    const tutors = ref([
      { id: 1, name: 'Dr. Sarah Chen', subject: 'Mathematics', level: 'Secondary' },
      { id: 2, name: 'Mr. John Lim', subject: 'English', level: 'Primary' },
      { id: 3, name: 'Ms. Mary Tan', subject: 'Science', level: 'Secondary' }
    ])

    const availableTimes = ref([
      '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', 
      '03:00 PM', '04:00 PM', '05:00 PM', '07:00 PM', '08:00 PM'
    ])

    const minDate = computed(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })

    const isFormValid = computed(() => {
      return booking.value.tutorId && 
             booking.value.subject && 
             booking.value.date && 
             booking.value.time && 
             booking.value.duration && 
             booking.value.location
    })

    const calculateTotal = () => {
      if (!booking.value.duration) return 0
      
      const baseRate = booking.value.sessionType === 'group' ? 60 : 80
      return baseRate * parseFloat(booking.value.duration)
    }

    const submitBooking = async () => {
      try {
        console.log('Submitting booking:', booking.value)
        // Here you would typically send the booking to your API
        alert('Booking submitted successfully!')
      } catch (error) {
        console.error('Booking error:', error)
        alert('Error submitting booking. Please try again.')
      }
    }

    onMounted(() => {
      // Load booking data if editing existing booking
      const bookingId = route.params.id
      if (bookingId) {
        console.log('Loading booking:', bookingId)
      }
    })

    return {
      booking,
      tutors,
      availableTimes,
      minDate,
      isFormValid,
      calculateTotal,
      submitBooking
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.form-control, .form-select {
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus, .form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
