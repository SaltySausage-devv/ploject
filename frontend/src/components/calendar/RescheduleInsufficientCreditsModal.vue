<template>
  <div
    class="modal fade show"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content cyberpunk-modal">
        <div class="modal-header cyberpunk-header">
          <h5 class="modal-title">
            <i class="fas fa-exclamation-triangle text-warning me-2"></i>
            Insufficient Credits for Reschedule
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-warning mb-4">
            <p class="mb-0">
              <strong>You don't have enough credits to accept this reschedule request.</strong>
            </p>
            <p class="mb-0 mt-2">
              The new session duration requires more credits than you currently have.
            </p>
          </div>

          <!-- Credit Breakdown -->
          <div class="credit-breakdown mb-4">
            <h6 class="mb-3">
              <i class="fas fa-calculator me-2"></i>
              Credit Breakdown
            </h6>

            <!-- New Token Price -->
            <div class="credit-item mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <span class="credit-label">
                  <i class="fas fa-calendar-plus text-primary me-2"></i>
                  New Token Price:
                </span>
                <span class="credit-value text-primary fw-bold">
                  {{ formatCredits(newCredits) }} Credits
                </span>
              </div>
              <small class="text-muted ms-4">
                Cost for the rescheduled session
              </small>
            </div>

            <!-- Student Current Token -->
            <div class="credit-item mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <span class="credit-label">
                  <i class="fas fa-wallet text-info me-2"></i>
                  Student Current Token:
                </span>
                <span class="credit-value text-info fw-bold">
                  {{ formatCredits(currentCredits) }} Credits
                </span>
              </div>
              <small class="text-muted ms-4">
                Your current credit balance
              </small>
            </div>

            <!-- Previous Session Held Token -->
            <div class="credit-item mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <span class="credit-label">
                  <i class="fas fa-undo text-success me-2"></i>
                  Previous Session Held Token:
                </span>
                <span class="credit-value text-success fw-bold">
                  {{ formatCredits(originalCredits) }} Credits
                </span>
              </div>
              <small class="text-muted ms-4">
                Credits from original session (will be refunded)
              </small>
            </div>

            <!-- Divider -->
            <hr class="my-3" />

            <!-- Comparison -->
            <div class="credit-comparison">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="credit-label fw-bold">
                  <i class="fas fa-balance-scale text-warning me-2"></i>
                  Comparison:
                </span>
                <span class="credit-value fw-bold">
                  {{ formatCredits(newCredits) }} vs
                  {{ formatCredits(currentCredits + originalCredits) }}
                </span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted ms-4">New Token Price</span>
                <span class="text-muted">
                  (Current + Refunded)
                </span>
              </div>
            </div>

            <!-- Shortfall -->
            <div class="credit-shortfall mt-4 p-3 bg-danger bg-opacity-10 rounded">
              <div class="d-flex justify-content-between align-items-center">
                <span class="credit-label fw-bold text-danger">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  Shortfall:
                </span>
                <span class="credit-value text-danger fw-bold fs-5">
                  {{ formatCredits(shortfall) }} Credits
                </span>
              </div>
              <p class="mb-0 mt-2 text-muted small">
                You need {{ formatCredits(shortfall) }} more credits to accept this reschedule.
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex gap-2 justify-content-end">
            <button
              type="button"
              class="btn btn-secondary"
              @click="$emit('close')"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RescheduleInsufficientCreditsModal',
  props: {
    newCredits: {
      type: Number,
      required: true
    },
    currentCredits: {
      type: Number,
      required: true
    },
    originalCredits: {
      type: Number,
      required: true
    },
    shortfall: {
      type: Number,
      required: true
    }
  },
  emits: ['close'],
  setup() {
    const formatCredits = (credits) => {
      return parseFloat(credits).toFixed(2)
    }

    return {
      formatCredits
    }
  }
}
</script>

<style scoped>
.cyberpunk-modal {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid var(--cyber-orange);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(232, 90, 42, 0.3);
}

.cyberpunk-header {
  background: linear-gradient(135deg, rgba(232, 90, 42, 0.1) 0%, rgba(232, 90, 42, 0.05) 100%);
  border-bottom: 2px solid var(--cyber-orange);
  padding: 1rem 1.5rem;
}

.modal-title {
  color: var(--cyber-orange);
  font-weight: 600;
  text-shadow: 0 0 10px rgba(232, 90, 42, 0.5);
}

.credit-breakdown {
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(232, 90, 42, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
}

.credit-item {
  padding: 0.75rem;
  background: rgba(45, 45, 45, 0.3);
  border-radius: 6px;
  border-left: 3px solid var(--cyber-orange);
}

.credit-label {
  color: #ffffff;
  font-size: 0.95rem;
}

.credit-value {
  font-size: 1.1rem;
}

.credit-comparison {
  background: rgba(232, 90, 42, 0.1);
  border: 1px solid rgba(232, 90, 42, 0.3);
  border-radius: 6px;
  padding: 1rem;
}

.credit-shortfall {
  border: 2px solid rgba(220, 53, 69, 0.5) !important;
}

.btn-cyberpunk {
  background: linear-gradient(135deg, var(--cyber-orange) 0%, #ff6b35 100%);
  border: none;
  color: #ffffff;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(232, 90, 42, 0.3);
}

.btn-cyberpunk:hover {
  background: linear-gradient(135deg, #ff6b35 0%, var(--cyber-orange) 100%);
  box-shadow: 0 6px 20px rgba(232, 90, 42, 0.5);
  transform: translateY(-2px);
}

.btn-close {
  filter: invert(1);
  opacity: 0.8;
}

.btn-close:hover {
  opacity: 1;
}
</style>

