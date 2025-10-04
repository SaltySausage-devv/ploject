<template>
  <div class="gamification-page">
    <div class="container py-5">
      <!-- Gamification Header -->
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
                    <i class="fas fa-trophy me-2 text-primary"></i>
                    Gamification Hub
                  </h2>
                  <p class="text-muted mb-0">Earn points, unlock badges, and climb the leaderboards!</p>
                </div>
                <div class="text-end">
                  <div class="points-display bg-primary bg-opacity-10 rounded-pill px-4 py-2">
                    <i class="fas fa-star text-primary me-2"></i>
                    <span class="fw-bold text-primary fs-4">{{ userStats.totalPoints }}</span>
                    <span class="text-muted ms-1">points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <!-- Stats Overview -->
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.1 }"
        class="row mb-5"
      >
        <div class="col-lg-3 col-md-6 mb-4" v-for="(stat, index) in stats" :key="index">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <motion.div
                :initial="{ scale: 0.8, opacity: 0 }"
                :animate="{ scale: 1, opacity: 1 }"
                :transition="{ duration: 0.5, delay: index * 0.1 }"
                class="stat-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bounce-effect"
                style="width: 60px; height: 60px;"
              >
                <i :class="stat.icon" class="text-primary fs-4"></i>
              </motion.div>
              <h4 class="fw-bold mb-1">{{ stat.value }}</h4>
              <p class="text-muted mb-0">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div class="row">
        <!-- Badges Section -->
        <div class="col-lg-6 mb-4">
          <motion.div
            :initial="{ opacity: 0, x: -30 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6, delay: 0.2 }"
            class="card border-0 shadow-sm h-100"
          >
            <div class="card-header bg-white border-bottom">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-medal me-2 text-primary"></i>
                Your Badges
              </h5>
            </div>
            <div class="card-body">
              <div v-if="userStats.badges.length === 0" class="text-center py-4">
                <i class="fas fa-medal text-muted fs-1 mb-3"></i>
                <p class="text-muted">No badges earned yet</p>
                <p class="text-muted small">Complete activities to earn your first badge!</p>
              </div>
              <div v-else class="row g-3">
                <motion.div
                  v-for="(badge, index) in userStats.badges"
                  :key="badge.id"
                  :initial="{ opacity: 0, scale: 0.8 }"
                  :animate="{ opacity: 1, scale: 1 }"
                  :transition="{ duration: 0.4, delay: index * 0.1 }"
                  class="col-6"
                >
                  <div class="badge-card p-3 border rounded text-center spring-bounce">
                    <div class="badge-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 50px; height: 50px;">
                      <i class="fas fa-medal text-primary"></i>
                    </div>
                    <h6 class="fw-bold mb-1">{{ badge.badge_name }}</h6>
                    <p class="text-muted small mb-2">{{ badge.description }}</p>
                    <small class="text-muted">{{ formatDate(badge.earned_at) }}</small>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <!-- Leaderboard Section -->
        <div class="col-lg-6 mb-4">
          <motion.div
            :initial="{ opacity: 0, x: 30 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6, delay: 0.3 }"
            class="card border-0 shadow-sm h-100"
          >
            <div class="card-header bg-white border-bottom">
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="fw-bold mb-0">
                  <i class="fas fa-trophy me-2 text-primary"></i>
                  Leaderboard
                </h5>
                <select v-model="selectedLeaderboard" class="form-select form-select-sm" style="width: auto;">
                  <option value="revenue">Revenue</option>
                  <option value="bookings">Bookings</option>
                  <option value="ratings">Ratings</option>
                </select>
              </div>
            </div>
            <div class="card-body p-0">
              <div v-if="leaderboard.length === 0" class="text-center py-4">
                <i class="fas fa-trophy text-muted fs-1 mb-3"></i>
                <p class="text-muted">No leaderboard data available</p>
              </div>
              <div v-else>
                <div v-for="(entry, index) in leaderboard" :key="entry.user_id" class="d-flex align-items-center p-3 border-bottom">
                  <motion.div
                    :initial="{ opacity: 0, x: -20 }"
                    :animate="{ opacity: 1, x: 0 }"
                    :transition="{ duration: 0.4, delay: index * 0.05 }"
                    class="d-flex align-items-center w-100"
                  >
                    <div class="rank-badge me-3" :class="getRankClass(index + 1)">
                      <span class="fw-bold">{{ index + 1 }}</span>
                    </div>
                    <div class="user-avatar bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                      <i class="fas fa-user text-primary"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="fw-bold mb-0">{{ entry.users?.first_name }} {{ entry.users?.last_name }}</h6>
                      <small class="text-muted">{{ entry.users?.user_type }}</small>
                    </div>
                    <div class="text-end">
                      <div class="fw-bold text-primary">{{ formatScore(entry.score) }}</div>
                      <small class="text-muted">{{ getScoreLabel(selectedLeaderboard) }}</small>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <!-- Recent Achievements -->
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.4 }"
        class="row mb-5"
      >
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-star me-2 text-primary"></i>
                Recent Achievements
              </h5>
            </div>
            <div class="card-body p-0">
              <div v-if="userStats.recentAchievements.length === 0" class="text-center py-4">
                <i class="fas fa-star text-muted fs-1 mb-3"></i>
                <p class="text-muted">No recent achievements</p>
              </div>
              <div v-else>
                <div v-for="(achievement, index) in userStats.recentAchievements" :key="achievement.id" class="d-flex align-items-center p-3 border-bottom">
                  <motion.div
                    :initial="{ opacity: 0, x: -20 }"
                    :animate="{ opacity: 1, x: 0 }"
                    :transition="{ duration: 0.4, delay: index * 0.1 }"
                    class="achievement-icon bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3 spring-smooth"
                    style="width: 45px; height: 45px;"
                  >
                    <i class="fas fa-trophy text-success"></i>
                  </motion.div>
                  <div class="flex-grow-1">
                    <h6 class="fw-bold mb-1">{{ achievement.badge_name }}</h6>
                    <p class="text-muted mb-0">{{ achievement.description }}</p>
                  </div>
                  <div class="text-end">
                    <div class="badge bg-success">+50 points</div>
                    <small class="text-muted d-block">{{ formatDate(achievement.earned_at) }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <!-- Available Badges -->
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.5 }"
        class="row"
      >
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom">
              <h5 class="fw-bold mb-0">
                <i class="fas fa-target me-2 text-primary"></i>
                Available Badges
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div v-for="(badge, index) in availableBadges" :key="index" class="col-lg-4 col-md-6">
                  <motion.div
                    :initial="{ opacity: 0, y: 20 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 0.4, delay: index * 0.1 }"
                    class="available-badge p-3 border rounded"
                  >
                    <div class="d-flex align-items-center mb-2">
                      <div class="badge-icon bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i :class="badge.icon" class="text-muted"></i>
                      </div>
                      <div>
                        <h6 class="fw-bold mb-0">{{ badge.name }}</h6>
                        <small class="text-muted">{{ badge.points }} points</small>
                      </div>
                    </div>
                    <p class="text-muted small mb-2">{{ badge.description }}</p>
                    <div class="progress mb-2" style="height: 6px;">
                      <div class="progress-bar bg-primary" :style="{ width: badge.progress + '%' }"></div>
                    </div>
                    <small class="text-muted">{{ badge.progress }}% complete</small>
                  </motion.div>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Gamification',
  setup() {
    const authStore = useAuthStore()
    
    const userStats = reactive({
      totalPoints: 0,
      badges: [],
      leaderboardRank: null,
      recentAchievements: []
    })

    const selectedLeaderboard = ref('revenue')
    const leaderboard = ref([])

    const stats = computed(() => [
      {
        icon: 'fas fa-star',
        label: 'Total Points',
        value: userStats.totalPoints.toLocaleString()
      },
      {
        icon: 'fas fa-medal',
        label: 'Badges Earned',
        value: userStats.badges.length
      },
      {
        icon: 'fas fa-trophy',
        label: 'Leaderboard Rank',
        value: userStats.leaderboardRank ? `#${userStats.leaderboardRank}` : 'Unranked'
      },
      {
        icon: 'fas fa-fire',
        label: 'Streak',
        value: '7 days'
      }
    ])

    const availableBadges = ref([
      {
        name: 'First Booking',
        description: 'Complete your first tutoring session',
        icon: 'fas fa-calendar-check',
        points: 50,
        progress: 100
      },
      {
        name: 'Perfect Rating',
        description: 'Maintain a 5-star average rating',
        icon: 'fas fa-star',
        points: 100,
        progress: 80
      },
      {
        name: 'Loyal Student',
        description: 'Complete 10+ tutoring sessions',
        icon: 'fas fa-heart',
        points: 150,
        progress: 60
      },
      {
        name: 'Top Tutor',
        description: 'Achieve top-tier rating (4.8+)',
        icon: 'fas fa-crown',
        points: 200,
        progress: 90
      },
      {
        name: 'Earning Milestone',
        description: 'Earn your first $1000',
        icon: 'fas fa-dollar-sign',
        points: 250,
        progress: 45
      },
      {
        name: 'Social Butterfly',
        description: 'Receive 50+ reviews',
        icon: 'fas fa-comments',
        points: 300,
        progress: 30
      }
    ])

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatScore = (score) => {
      if (selectedLeaderboard.value === 'revenue') {
        return `$${score.toLocaleString()}`
      } else if (selectedLeaderboard.value === 'bookings') {
        return `${score} sessions`
      } else {
        return `${score}★`
      }
    }

    const getScoreLabel = (category) => {
      switch (category) {
        case 'revenue': return 'earned'
        case 'bookings': return 'completed'
        case 'ratings': return 'average'
        default: return 'score'
      }
    }

    const getRankClass = (rank) => {
      if (rank === 1) return 'rank-first'
      if (rank === 2) return 'rank-second'
      if (rank === 3) return 'rank-third'
      return 'rank-other'
    }

    const loadGamificationData = async () => {
      try {
        // Simulate API calls
        userStats.totalPoints = 1250
        userStats.badges = [
          {
            id: 1,
            badge_name: 'First Booking',
            description: 'Completed your first tutoring session!',
            earned_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            badge_name: 'Perfect Rating',
            description: 'Maintained a perfect 5-star rating!',
            earned_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
        userStats.leaderboardRank = 15
        userStats.recentAchievements = userStats.badges.slice(0, 3)

        leaderboard.value = [
          { user_id: 1, score: 15420, users: { first_name: 'Sarah', last_name: 'Chen', user_type: 'tutor' } },
          { user_id: 2, score: 12850, users: { first_name: 'David', last_name: 'Lim', user_type: 'tutor' } },
          { user_id: 3, score: 11200, users: { first_name: 'Emily', last_name: 'Wong', user_type: 'tutor' } },
          { user_id: 4, score: 9850, users: { first_name: 'Michael', last_name: 'Tan', user_type: 'tutor' } },
          { user_id: 5, score: 8750, users: { first_name: 'Lisa', last_name: 'Ng', user_type: 'tutor' } }
        ]
      } catch (error) {
        console.error('Load gamification data error:', error)
      }
    }

    onMounted(() => {
      loadGamificationData()
    })

    return {
      userStats,
      selectedLeaderboard,
      leaderboard,
      stats,
      availableBadges,
      formatDate,
      formatScore,
      getScoreLabel,
      getRankClass
    }
  }
}
</script>

<style scoped>
.gamification-page {
  background-color: var(--light-bg);
  min-height: 100vh;
}

.points-display {
  transition: all 0.3s ease;
}

.points-display:hover {
  transform: scale(1.05);
  background-color: var(--primary-color) !important;
  color: white !important;
}

.stat-icon {
  transition: all 0.3s ease;
}

.stat-icon:hover {
  transform: scale(1.1);
  background-color: var(--primary-color) !important;
}

.stat-icon:hover i {
  color: white !important;
}

.badge-card {
  transition: all 0.3s ease;
  background: white;
}

.badge-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
  border-color: var(--primary-color) !important;
}

.badge-icon {
  transition: all 0.3s ease;
}

.badge-card:hover .badge-icon {
  background-color: var(--primary-color) !important;
}

.badge-card:hover .badge-icon i {
  color: white !important;
}

.rank-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.rank-first {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #8b6914;
}

.rank-second {
  background: linear-gradient(135deg, #c0c0c0, #e5e5e5);
  color: #666;
}

.rank-third {
  background: linear-gradient(135deg, #cd7f32, #daa520);
  color: white;
}

.rank-other {
  background: var(--light-bg);
  color: var(--text-secondary);
}

.user-avatar {
  transition: all 0.3s ease;
}

.achievement-icon {
  transition: all 0.3s ease;
}

.achievement-icon:hover {
  transform: scale(1.1);
  background-color: var(--success-color) !important;
}

.achievement-icon:hover i {
  color: white !important;
}

.available-badge {
  transition: all 0.3s ease;
  background: white;
}

.available-badge:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
  border-color: var(--primary-color) !important;
}

.progress-bar {
  transition: width 0.6s ease;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem !important;
  }
  
  .stat-icon {
    width: 50px !important;
    height: 50px !important;
  }
}
</style>
