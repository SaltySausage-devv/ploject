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
            </motion.div>
        </div>
    </div>
</template>
<script>
export default{
    name: "AboutUs"
}
return {

}
</script>

<style scoped>
.dashboard-page {
  background: #1a1a1a !important;
  min-height: 100vh;
  color: var(--cyber-text, #ffffff);
}

/* Cards */
.card {
  background: rgba(26, 26, 26, 0.85) !important;
  border: 2px solid var(--cyber-grey-light, #4a4a4a) !important;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(255, 140, 66, 0.1),
    0 0 30px rgba(255, 140, 66, 0.05) !important;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  color: var(--cyber-text, #ffffff) !important;
}

.card:hover {
  border-color: var(--cyber-orange, #ff8c42) !important;
  box-shadow: 0 0 25px rgba(255, 140, 66, 0.3) !important;
  transform: translateY(-2px);
}

.card-header {
  background: rgba(255, 140, 66, 0.1) !important;
  border-bottom: 1px solid var(--cyber-orange, #ff8c42) !important;
  color: var(--cyber-text, #ffffff) !important;
}

.card-body {
  color: var(--cyber-text, #ffffff) !important;
}

/* Headings */
h2,
h3,
h4,
h5,
h6 {
  color: var(--cyber-text, #ffffff) !important;
  text-shadow: 0 0 5px rgba(255, 140, 66, 0.3);
}

/* Text */
.text-muted {
  color: var(--cyber-text-muted, #cccccc) !important;
}

.fw-bold {
  color: var(--cyber-text, #ffffff) !important;
}

.fw-medium {
  color: var(--cyber-text, #ffffff) !important;
}

/* Avatar */
.avatar {
  background: rgba(255, 140, 66, 0.2) !important;
  border: 2px solid var(--cyber-orange, #ff8c42);
  transition: transform 0.3s ease;
}

.card:hover .avatar {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 140, 66, 0.5);
}

/* Stats */
.stat-icon {
  background: rgba(255, 140, 66, 0.2) !important;
  border: 2px solid var(--cyber-orange, #ff8c42);
  transition: all 0.3s ease;
}

.card:hover .stat-icon {
  transform: scale(1.1);
  background: linear-gradient(
    45deg,
    var(--cyber-orange, #ff8c42),
    var(--cyber-yellow, #ffd23f)
  ) !important;
  box-shadow: 0 0 20px rgba(255, 140, 66, 0.5);
}

.card:hover .stat-icon i {
  color: white !important;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.stat-icon i {
  color: var(--cyber-orange, #ff8c42) !important;
}

/* Activity & Notification Icons */
.activity-icon,
.notification-icon {
  background: rgba(255, 140, 66, 0.1) !important;
  border: 1px solid var(--cyber-grey-light, #4a4a4a);
  transition: all 0.3s ease;
}

.activity-icon i,
.notification-icon i {
  color: var(--cyber-orange, #ff8c42) !important;
}

.activity-icon:hover,
.notification-icon:hover {
  background: var(--cyber-orange, #ff8c42) !important;
  border-color: var(--cyber-orange, #ff8c42);
  box-shadow: 0 0 15px rgba(255, 140, 66, 0.5);
}

.activity-icon:hover i,
.notification-icon:hover i {
  color: white !important;
}

/* Buttons */
.btn-outline-primary {
  background: transparent !important;
  border: 2px solid var(--cyber-orange, #ff8c42) !important;
  color: var(--cyber-text, #ffffff) !important;
  transition: all 0.3s ease;
  border-radius: 10px;
  font-weight: 600;
}

.btn-outline-primary:hover {
  background: linear-gradient(
    45deg,
    var(--cyber-orange, #ff8c42),
    var(--cyber-yellow, #ffd23f)
  ) !important;
  border-color: var(--cyber-orange, #ff8c42) !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(255, 140, 66, 0.5) !important;
}

/* Badges */
.badge {
  border: 1px solid var(--cyber-orange, #ff8c42);
  font-weight: 600;
  padding: 0.5em 0.8em;
  border-radius: 6px;
}

.badge-success {
  background: rgba(16, 185, 129, 0.2) !important;
  color: #10b981 !important;
  border-color: #10b981 !important;
}

.badge-warning {
  background: rgba(245, 158, 11, 0.2) !important;
  color: #f59e0b !important;
  border-color: #f59e0b !important;
}

.badge-info {
  background: rgba(59, 130, 246, 0.2) !important;
  color: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

.badge-danger {
  background: rgba(239, 68, 68, 0.2) !important;
  color: #ef4444 !important;
  border-color: #ef4444 !important;
}

/* Border bottom for activity items */
.border-bottom {
  border-color: var(--cyber-grey-light, #4a4a4a) !important;
}

/* Icons color */
i.text-primary {
  color: var(--cyber-orange, #ff8c42) !important;
}

/* Background light elements */
.bg-light {
  background: rgba(255, 140, 66, 0.1) !important;
}

.bg-white {
  background: rgba(26, 26, 26, 0.5) !important;
}

/* Small text */
small {
  color: var(--cyber-text-muted, #cccccc) !important;
}
</style>

