import { ref } from 'vue';
import axios from 'axios';

export function usePhoneVerification() {
  const otpSent = ref(false);
  const phoneVerified = ref(false);
  const sendingOTP = ref(false);
  const verifyingOTP = ref(false);
  const isPhoneValid = ref(false);
  const phoneHelper = ref('');
  const otpTimeLeft = ref(0);
  let otpTimer = null;

  // Singapore phone number validation
  const validatePhone = (phone) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Check if it's a valid Singapore number (8 digits starting with 8 or 9)
    if (cleaned.length === 0) {
      isPhoneValid.value = false;
      phoneHelper.value = '';
      return false;
    }

    if (cleaned.length !== 8) {
      isPhoneValid.value = false;
      phoneHelper.value = 'Phone number must be 8 digits';
      return false;
    }

    if (!cleaned.startsWith('8') && !cleaned.startsWith('9')) {
      isPhoneValid.value = false;
      phoneHelper.value = 'Phone number must start with 8 or 9';
      return false;
    }

    isPhoneValid.value = true;
    phoneHelper.value = '✓ Valid Singapore number';
    return true;
  };

  // Send OTP
  const sendOTP = async (phone) => {
    if (!validatePhone(phone)) {
      return { success: false, error: 'Invalid phone number' };
    }

    sendingOTP.value = true;

    try {
      const response = await axios.post('/api/auth/send-otp', {
        phone: phone.replace(/\D/g, '')
      });

      if (response.data.otp) {
        console.log('🔐 Development OTP:', response.data.otp);
      }

      otpSent.value = true;
      otpTimeLeft.value = 600; // 10 minutes
      startOTPTimer();

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send OTP. Please try again.'
      };
    } finally {
      sendingOTP.value = false;
    }
  };

  // Verify OTP
  const verifyOTP = async (phone, code) => {
    if (!code || code.length !== 6) {
      return { success: false, error: 'Please enter a valid 6-digit code' };
    }

    verifyingOTP.value = true;

    try {
      const response = await axios.post('/api/auth/verify-otp', {
        phone: phone.replace(/\D/g, ''),
        code
      });

      if (response.data.verified) {
        phoneVerified.value = true;
        stopOTPTimer();
        return { success: true, message: response.data.message };
      }

      return { success: false, error: 'Verification failed' };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Verification failed. Please try again.'
      };
    } finally {
      verifyingOTP.value = false;
    }
  };

  // Start OTP countdown timer
  const startOTPTimer = () => {
    stopOTPTimer(); // Clear any existing timer

    otpTimer = setInterval(() => {
      if (otpTimeLeft.value > 0) {
        otpTimeLeft.value--;
      } else {
        stopOTPTimer();
      }
    }, 1000);
  };

  // Stop OTP timer
  const stopOTPTimer = () => {
    if (otpTimer) {
      clearInterval(otpTimer);
      otpTimer = null;
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Resend OTP
  const resendOTP = async (phone) => {
    otpSent.value = false;
    phoneVerified.value = false;
    otpTimeLeft.value = 0;
    stopOTPTimer();

    return await sendOTP(phone);
  };

  return {
    otpSent,
    phoneVerified,
    sendingOTP,
    verifyingOTP,
    isPhoneValid,
    phoneHelper,
    otpTimeLeft,
    validatePhone,
    sendOTP,
    verifyOTP,
    formatTime,
    resendOTP,
    stopOTPTimer
  };
}
