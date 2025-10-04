<template>
  <div class="analytics-page">
    <div class="container py-5">
      <!-- Analytics Header -->
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
        class="row mb-5"
      >
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <h2 class="fw-bold mb-2">
                    <i class="fas fa-chart-line me-2 text-primary"></i>
                    Analytics Dashboard
                  </h2>
                  <p class="text-muted mb-0">Track your performance and growth</p>
                </div>
                <div class="d-flex gap-2">
                  <select v-model="selectedPeriod" class="form-select" style="width: auto;">
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                  <button class="btn btn-outline-primary">
                    <i class="fas fa-download me-2"></i>
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <!-- Key Metrics -->
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.1 }"
        class="row mb-5"
      >
        <div class="col-lg-3 col-md-6 mb-4" v-for="(metric, index) in keyMetrics" :key="index">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <motion.div
                :initial="{ scale: 0.8, opacity: 0 }"
                :animate="{ scale: 1, opacity: 1 }"
                :transition="{ duration: 0.5, delay: index * 0.1 }"
                class="metric-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 spring-bounce"
                style="width: 60px; height: 60px;"
              >
                <i :class="metric.icon" class="text-primary fs-4"></i>
              </motion.div>
              <h3 class="fw-bold mb-1">{{ metric.value }}</h3>
              <p class="text-muted mb-2">{{ metric.label }}</p>
              <div class="d-flex align-items-center justify-content-center">
                <span :class="metric.trend > 0 ? 'text-success' : 'text-danger'" class="small">
                  <i :class="metric.trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="me-1"></i>
                  {{ Math.abs(metric.trend) }}%
                </span>
                <span class="text-muted ms-2 small">vs last period</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <!-- Charts Row -->
      <div class="row mb-5">
        <!-- Revenue Chart -->
        <div class="col-lg-8 mb-4">
          <motion.div
            :initial="{ opacity: 0, x: -30 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6, delay: 0.2 }"
            class="card border-0 shadow-sm h-100"
          >
            <div class="card-header bg-white border-bottom">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-dollar-sign me-2 text-primary"></i>
                Revenue Trend
              </h5>
            </div>
            <div class="card-body">
              <div class="chart-container" style="height: 300px;">
                <canvas ref="revenueChart"></canvas>
              </div>
            </div>
          </motion.div>
        </div>

        <!-- Top Subjects -->
        <div class="col-lg-4 mb-4">
          <motion.div
            :initial="{ opacity: 0, x: 30 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6, delay: 0.3 }"
            class="card border-0 shadow-sm h-100"
          >
            <div class="card-header bg-white border-bottom">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-book me-2 text-primary"></i>
                Top Subjects
              </h5>
            </div>
            <div class="card-body">
              <div v-for="(subject, index) in topSubjects" :key="index" class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center">
                  <div class="subject-rank bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <span class="fw-bold text-primary small">{{ index + 1 }}</span>
                  </div>
                  <span class="fw-medium">{{ subject.name }}</span>
                </div>
                <div class="text-end">
                  <div class="fw-bold">{{ subject.bookings }}</div>
                  <small class="text-muted">bookings</small>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="row mb-5">
        <!-- Conversion Funnel -->
        <div class="col-lg-6 mb-4">
          <motion.div
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.4 }"
            class="card border-0 shadow-sm h-100"
          >
            <div class="card-header bg-white border-bottom">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-funnel-dollar me-2 text-primary"></i>
                Conversion Funnel
              </h5>
            </div>
            <div class="card-body">
              <div class="funnel-container">
                <div v-for="(step, index) in conversionFunnel" :key="index" class="funnel-step mb-3">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="fw-medium">{{ step.label }}</span>
                    <span class="fw-bold text-primary">{{ step.value }}</span>
                  </div>
                  <div class="progress" style="height: 8px;">
                    <div 
                      class="progress-bar bg-primary" 
                      :style="{ width: step.percentage + '%' }"
                    ></div>
                  </div>
                  <small class="text-muted">{{ step.percentage }}% conversion rate</small>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <!-- Recent Activity -->
        <div class="col-lg-6 mb-4">
          <motion.div
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.5 }"
            class="card border-0 shadow-sm h-100"
          >
            <div class="card-header bg-white border-bottom">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-clock me-2 text-primary"></i>
                Recent Activity
              </h5>
            </div>
            <div class="card-body p-0">
              <div v-if="recentActivity.length === 0" class="text-center py-4">
                <i class="fas fa-chart-line text-muted fs-1 mb-3"></i>
                <p class="text-muted">No recent activity</p>
              </div>
              <div v-else>
                <div v-for="(activity, index) in recentActivity" :key="index" class="d-flex align-items-center p-3 border-bottom">
                  <motion.div
                    :initial="{ opacity: 0, x: -20 }"
                    :animate="{ opacity: 1, x: 0 }"
                    :transition="{ duration: 0.4, delay: index * 0.1 }"
                    class="activity-icon bg-light rounded-circle d-flex align-items-center justify-content-center me-3 spring-smooth"
                    style="width: 40px; height: 40px;"
                  >
                    <i :class="activity.icon" class="text-primary"></i>
                  </motion.div>
                  <div class="flex-grow-1">
                    <p class="mb-1 fw-medium">{{ activity.title }}</p>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                  <span :class="activity.badgeClass" class="badge">{{ activity.status }}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <!-- Goals and Targets -->
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.6 }"
        class="row"
      >
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-target me-2 text-primary"></i>
                Goals & Targets
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4 mb-3" v-for="(goal, index) in goals" :key="index">
                  <div class="goal-card p-3 border rounded">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <h6 class="fw-bold mb-0">{{ goal.title }}</h6>
                      <span class="badge bg-primary">{{ goal.progress }}%</span>
                    </div>
                    <div class="progress mb-2" style="height: 6px;">
                      <div 
                        class="progress-bar bg-primary" 
                        :style="{ width: goal.progress + '%' }"
                      ></div>
                    </div>
                    <div class="d-flex justify-content-between">
                      <small class="text-muted">{{ goal.current }} / {{ goal.target }}</small>
                      <small class="text-muted">{{ goal.period }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Analytics',
  setup() {
    const authStore = useAuthStore()
    
    const selectedPeriod = ref('30d')
    const revenueChart = ref(null)
    
    const keyMetrics = ref([
      {
        icon: 'fas fa-dollar-sign',
        label: 'Total Revenue',
        value: '$2,880',
        trend: 12.5
      },
      {
        icon: 'fas fa-users',
        label: 'Active Students',
        value: '25',
        trend: 8.3
      },
      {
        icon: 'fas fa-star',
        label: 'Average Rating',
        value: '4.8',
        trend: 2.1
      },
      {
        icon: 'fas fa-calendar-check',
        label: 'Completed Sessions',
        value: '48',
        trend: 15.2
      }
    ])

    const topSubjects = ref([
      { name: 'Mathematics', bookings: 24 },
      { name: 'Additional Mathematics', bookings: 18 },
      { name: 'Physics', bookings: 12 },
      { name: 'Chemistry', bookings: 8 },
      { name: 'English', bookings: 6 }
    ])

    const conversionFunnel = ref([
      { label: 'Profile Views', value: 1250, percentage: 100 },
      { label: 'Inquiries Sent', value: 312, percentage: 25 },
      { label: 'Trial Sessions', value: 78, percentage: 6.2 },
      { label: 'Regular Bookings', value: 45, percentage: 3.6 }
    ])

    const recentActivity = ref([
      {
        icon: 'fas fa-star',
        title: 'Received 5-star review from Sarah',
        time: '2 hours ago',
        status: 'New',
        badgeClass: 'bg-success'
      },
      {
        icon: 'fas fa-calendar-check',
        title: 'New booking confirmed for tomorrow',
        time: '4 hours ago',
        status: 'Confirmed',
        badgeClass: 'bg-primary'
      },
      {
        icon: 'fas fa-dollar-sign',
        title: 'Payment received for session',
        time: '1 day ago',
        status: 'Paid',
        badgeClass: 'bg-success'
      },
      {
        icon: 'fas fa-user-plus',
        title: 'New student inquiry',
        time: '2 days ago',
        status: 'Pending',
        badgeClass: 'bg-warning'
      }
    ])

    const goals = ref([
      {
        title: 'Monthly Revenue',
        current: 2880,
        target: 3500,
        progress: 82,
        period: 'This month'
      },
      {
        title: 'Student Retention',
        current: 18,
        target: 25,
        progress: 72,
        period: 'This month'
      },
      {
        title: 'Average Rating',
        current: 4.8,
        target: 5.0,
        progress: 96,
        period: 'This month'
      }
    ])

    const initCharts = async () => {
      await nextTick()
      
      if (revenueChart.value) {
        // Initialize Chart.js here
        console.log('Initializing revenue chart')
      }
    }

    onMounted(() => {
      initCharts()
    })

    return {
      selectedPeriod,
      revenueChart,
      keyMetrics,
      topSubjects,
      conversionFunnel,
      recentActivity,
      goals
    }
  }
}
</script>

<style scoped>
.analytics-page {
  background-color: var(--light-bg);
  min-height: 100vh;
}

.metric-icon {
  transition: all 0.3s ease;
}

.metric-icon:hover {
  transform: scale(1.1);
  background-color: var(--primary-color) !important;
}

.metric-icon:hover i {
  color: white !important;
}

.subject-rank {
  transition: all 0.3s ease;
}

.funnel-step {
  transition: all 0.3s ease;
}

.activity-icon {
  transition: all 0.3s ease;
}

.activity-icon:hover {
  background-color: var(--primary-color) !important;
  color: white !important;
}

.goal-card {
  transition: all 0.3s ease;
  background: white;
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.progress-bar {
  transition: width 0.6s ease;
}

.chart-container {
  position: relative;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem !important;
  }
  
  .metric-icon {
    width: 50px !important;
    height: 50px !important;
  }
}
</style>
