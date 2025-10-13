<template>
  <div
    class="modal fade show"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Reschedule Booking</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- Current Booking Info -->
            <div class="alert alert-info mb-3">
              <strong>Current Booking:</strong><br />
              {{ formatDate(booking.start_time) }} at
              {{ formatTime(booking.start_time) }}
            </div>

            <!-- New Date Selection -->
            <div class="mb-3">
              <label class="form-label">New Date</label>
              <input
                type="date"
                v-model="newDate"
                class="form-control"
                :min="today"
                required
              />
            </div>

            <!-- New Time Selection -->
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Start Time</label>
                <input
                  type="time"
                  v-model="newStartTime"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">End Time</label>
                <input
                  type="time"
                  v-model="newEndTime"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <!-- Reason for Rescheduling -->
            <div class="mb-3">
              <label class="form-label">Reason for Rescheduling</label>
              <textarea
                v-model="reason"
                class="form-control"
                rows="3"
                placeholder="Please explain why you need to reschedule..."
                required
              ></textarea>
            </div>

            <!-- Summary -->
            <div
              v-if="newDate && newStartTime && newEndTime"
              class="alert alert-success"
            >
              <strong>New Time:</strong><br />
              {{ formatDate(newDate) }} from {{ newStartTime }} to
              {{ newEndTime }}
              <span v-if="isValidTimeRange" class="text-success">
                ✓ Valid time range
              </span>
              <span v-else class="text-danger">
                ✗ End time must be after start time
              </span>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-warning"
            @click="handleSubmit"
            :disabled="loading || !isValidForm"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Send Reschedule Request
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useToast } from "../../composables/useToast";
import { useAuthStore } from "../../stores/auth";

export default {
  name: "RescheduleModal",
  props: {
    booking: {
      type: Object,
      required: true,
    },
  },
  emits: ["close", "rescheduled"],
  setup(props, { emit }) {
    const { showToast } = useToast();
    const authStore = useAuthStore();

    // Reactive data
    const loading = ref(false);
    const newDate = ref("");
    const newStartTime = ref("");
    const newEndTime = ref("");
    const reason = ref("");

    // Computed properties
    const today = computed(() => {
      return new Date().toISOString().split("T")[0];
    });

    const isValidTimeRange = computed(() => {
      return (
        newStartTime.value &&
        newEndTime.value &&
        newStartTime.value < newEndTime.value
      );
    });

    const isValidForm = computed(() => {
      return (
        newDate.value &&
        newStartTime.value &&
        newEndTime.value &&
        reason.value &&
        isValidTimeRange.value
      );
    });

    // Methods
    function formatDate(dateString) {
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString("en-US", options);
    }

    function formatTime(dateString) {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    async function handleSubmit() {
      try {
        loading.value = true;

        if (!isValidForm.value) {
          showToast("Please fill in all required fields", "error");
          return;
        }

        // Create new datetime strings
        const newStartDateTime = new Date(
          `${newDate.value}T${newStartTime.value}`
        );
        const newEndDateTime = new Date(`${newDate.value}T${newEndTime.value}`);

        const payload = {
          start_time: newStartDateTime.toISOString(),
          end_time: newEndDateTime.toISOString(),
          reschedule_reason: reason.value,
        };

        const response = await fetch(
          `/api/calendar/bookings/${props.booking.id}/reschedule`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authStore.token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to send reschedule request"
          );
        }

        const result = await response.json();
        showToast(
          result.message ||
            "Reschedule request sent successfully. Waiting for confirmation.",
          "success"
        );
        emit("rescheduled");
      } catch (error) {
        console.error("Error rescheduling booking:", error);
        showToast("Failed to reschedule booking", "error");
      } finally {
        loading.value = false;
      }
    }

    return {
      loading,
      newDate,
      newStartTime,
      newEndTime,
      reason,
      today,
      isValidTimeRange,
      isValidForm,
      formatDate,
      formatTime,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.modal {
  z-index: 1060;
}

.modal-dialog {
  max-width: 500px;
}

.modal-content {
  background: #2d2d44 !important;
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 12px;
  color: #ffffff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.modal-header {
  background: linear-gradient(135deg, #3a3a52 0%, #2d2d44 100%);
  border-bottom: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 12px 12px 0 0;
  padding: 1.25rem 1.5rem;
}

.modal-title {
  color: #ff6b35;
  font-weight: 700;
  font-size: 1.25rem;
}

.btn-close {
  filter: invert(1);
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  background: #2d2d44;
  color: #ffffff;
  padding: 1.5rem;
}

.modal-footer {
  background: linear-gradient(135deg, #2d2d44 0%, #3a3a52 100%);
  border-top: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 0 0 12px 12px;
  padding: 1.25rem 1.5rem;
}

.form-label {
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 0.5rem;
}

.form-control {
  background: #3a3a52;
  border: 1px solid rgba(255, 107, 53, 0.3);
  color: #ffffff;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  background: #3a3a52;
  border-color: #ff6b35;
  color: #ffffff;
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
  outline: none;
}

.form-control::placeholder {
  color: #888;
}

.alert {
  margin-bottom: 1rem;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid;
}

.alert-info {
  background-color: rgba(58, 150, 207, 0.15);
  border-color: rgba(58, 150, 207, 0.5);
  color: #3a96cf;
}

.alert-success {
  background-color: rgba(40, 167, 69, 0.15);
  border-color: rgba(40, 167, 69, 0.5);
  color: #28a745;
}

.text-success {
  color: #28a745 !important;
  font-weight: 600;
}

.text-danger {
  color: #ff6b6b !important;
  font-weight: 600;
}

.btn-warning {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  border: none;
  color: #ffffff;
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.btn-warning:hover {
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
  color: #ffffff;
}

.btn-warning:disabled {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #6c757d;
  border-color: #6c757d;
  color: #ffffff;
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

/* Custom styling for time inputs */
input[type="date"],
input[type="time"] {
  color-scheme: dark;
}

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>
