<template>
  <div class="dashboard-page">
    <div class="container py-5">
      <!-- Welcome Section -->
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
        class="row mb-5"
      >
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center">
                <div class="avatar bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px;">
                  <i class="fas fa-user text-primary fs-4"></i>
                </div>
                <div>
                  <h2 class="fw-bold mb-1">Welcome back, {{ user?.firstName }}!</h2>
                  <p class="text-muted mb-0">Here's what's happening with your account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <!-- Quick Stats -->
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.1 }"
        class="row mb-5"
      >
        <div class="col-lg-3 col-md-6 mb-4" v-for="(stat, index) in stats" :key="index">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <div class="stat-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 50px; height: 50px;">
                <i :class="stat.icon" class="text-primary fs-5"></i>
              </div>
              <h4 class="fw-bold mb-1">{{ stat.value }}</h4>
              <p class="text-muted mb-0">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <!-- Recent Activity -->
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.2 }"
        class="row"
      >
        <div class="col-lg-8 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-clock me-2 text-primary"></i>
                Recent Activity
              </h5>
            </div>
            <div class="card-body p-0">
              <div v-if="recentActivity.length === 0" class="text-center py-5">
                <i class="fas fa-inbox text-muted fs-1 mb-3"></i>
                <p class="text-muted">No recent activity</p>
              </div>
              <div v-else>
                <div v-for="(activity, index) in recentActivity" :key="index" class="d-flex align-items-center p-3 border-bottom">
                  <div class="activity-icon bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i :class="activity.icon" class="text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-1 fw-medium">{{ activity.title }}</p>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                  <span :class="activity.badgeClass" class="badge">{{ activity.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <!-- Quick Actions -->
          <motion.div
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.3 }"
            class="card border-0 shadow-sm mb-4"
          >
            <div class="card-header bg-white border-bottom">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-bolt me-2 text-primary"></i>
                Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <router-link to="/search" class="btn btn-outline-primary">
                  <i class="fas fa-search me-2"></i>
                  Find Tutors
                </router-link>
                <router-link to="/messages" class="btn btn-outline-primary">
                  <i class="fas fa-envelope me-2"></i>
                  Messages
                </router-link>
                <router-link to="/profile" class="btn btn-outline-primary">
                  <i class="fas fa-user me-2"></i>
                  Update Profile
                </router-link>
                <router-link to="/analytics" class="btn btn-outline-primary" v-if="userType === 'tutor' || userType === 'centre'">
                  <i class="fas fa-chart-bar me-2"></i>
                  View Analytics
                </router-link>
              </div>
            </div>
          </motion.div>

          <!-- Notifications -->
          <motion.div
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.4 }"
            class="card border-0 shadow-sm"
          >
            <div class="card-header bg-white border-bottom">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-bell me-2 text-primary"></i>
                Notifications
              </h5>
            </div>
            <div class="card-body p-0">
              <div v-if="notifications.length === 0" class="text-center py-3">
                <p class="text-muted mb-0">No new notifications</p>
              </div>
              <div v-else>
                <div v-for="(notification, index) in notifications" :key="index" class="d-flex align-items-start p-3 border-bottom">
                  <div class="notification-icon bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 35px; height: 35px;">
                    <i :class="notification.icon" class="text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-1 fw-medium">{{ notification.title }}</p>
                    <small class="text-muted">{{ notification.time }}</small>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Dashboard',
  setup() {
    const authStore = useAuthStore()
    
    const user = computed(() => authStore.user)
    const userType = computed(() => authStore.userType)
    
    const stats = ref([])
    const recentActivity = ref([])
    const notifications = ref([])

    const loadDashboardData = async () => {
      // Load stats based on user type
      if (userType.value === 'student') {
        stats.value = [
          { icon: 'fas fa-book', label: 'Active Bookings', value: '3' },
          { icon: 'fas fa-star', label: 'Completed Sessions', value: '12' },
          { icon: 'fas fa-clock', label: 'Hours This Month', value: '24' },
          { icon: 'fas fa-dollar-sign', label: 'Total Spent', value: '$1,440' }
        ]
      } else if (userType.value === 'tutor') {
        stats.value = [
          { icon: 'fas fa-users', label: 'Total Students', value: '25' },
          { icon: 'fas fa-star', label: 'Average Rating', value: '4.8' },
          { icon: 'fas fa-clock', label: 'Hours This Month', value: '48' },
          { icon: 'fas fa-dollar-sign', label: 'Earnings', value: '$2,880' }
        ]
      } else if (userType.value === 'centre') {
        stats.value = [
          { icon: 'fas fa-users', label: 'Total Students', value: '150' },
          { icon: 'fas fa-star', label: 'Average Rating', value: '4.6' },
          { icon: 'fas fa-calendar', label: 'Classes This Month', value: '45' },
          { icon: 'fas fa-dollar-sign', label: 'Revenue', value: '$8,100' }
        ]
      }

      // Load recent activity
      recentActivity.value = [
        {
          icon: 'fas fa-calendar-check',
          title: 'New booking confirmed',
          time: '2 hours ago',
          status: 'Confirmed',
          badgeClass: 'bg-success'
        },
        {
          icon: 'fas fa-star',
          title: 'Received 5-star review',
          time: '1 day ago',
          status: 'Completed',
          badgeClass: 'bg-success'
        },
        {
          icon: 'fas fa-envelope',
          title: 'New message from student',
          time: '2 days ago',
          status: 'Unread',
          badgeClass: 'bg-warning'
        }
      ]

      // Load notifications
      notifications.value = [
        {
          icon: 'fas fa-bell',
          title: 'Booking reminder: Math session tomorrow at 2 PM',
          time: '1 hour ago'
        },
        {
          icon: 'fas fa-star',
          title: 'New review received',
          time: '3 hours ago'
        },
        {
          icon: 'fas fa-envelope',
          title: 'Message from tutor',
          time: '5 hours ago'
        }
      ]
    }

    onMounted(() => {
      loadDashboardData()
    })

    return {
      user,
      userType,
      stats,
      recentActivity,
      notifications
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  background-color: var(--light-bg);
  min-height: 100vh;
}

.avatar {
  transition: transform 0.3s ease;
}

.card:hover .avatar {
  transform: scale(1.05);
}

.stat-icon {
  transition: all 0.3s ease;
}

.card:hover .stat-icon {
  transform: scale(1.1);
  background-color: var(--primary-color) !important;
}

.card:hover .stat-icon i {
  color: white !important;
}

.activity-icon,
.notification-icon {
  transition: all 0.3s ease;
}

.activity-icon:hover,
.notification-icon:hover {
  background-color: var(--primary-color) !important;
  color: white !important;
}

.btn-outline-primary {
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
</style>
