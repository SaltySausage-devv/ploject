// EmailJS service for sending password reset emails from the frontend
// This works around the server-side restrictions of EmailJS

import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_3dqgnsi',
  templateId: 'template_ktq4n7j',
  publicKey: 'l8VwHjwH16cAfCk4r'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

/**
 * Send password reset email using EmailJS
 * @param {string} email - Recipient email address
 * @param {string} resetLink - Password reset link
 * @param {string} userName - User's name
 * @returns {Promise<{success: boolean, result?: any, error?: string}>}
 */
export const sendPasswordResetEmail = async (email, resetLink, userName = 'User') => {
  try {
    console.log('📧 Sending password reset email via EmailJS...');
    
    const templateParams = {
      link: resetLink,
      email: email,
      user_name: userName
    };

    console.log('📧 Email parameters:', templateParams);

    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );

    console.log('✅ Password reset email sent successfully!');
    console.log('📊 EmailJS result:', result);
    
    return { success: true, result };
    
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send email' 
    };
  }
};

/**
 * Test EmailJS connection
 * @returns {Promise<{success: boolean, result?: any, error?: string}>}
 */
export const testEmailConnection = async () => {
  try {
    console.log('🧪 Testing EmailJS connection...');
    
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        link: 'https://example.com/test',
        email: 'test@example.com',
        user_name: 'Test User'
      }
    );

    console.log('✅ EmailJS connection test successful!');
    return { success: true, result };
    
  } catch (error) {
    console.error('❌ EmailJS connection test failed:', error);
    return { 
      success: false, 
      error: error.message || 'Connection test failed' 
    };
  }
};

export default {
  sendPasswordResetEmail,
  testEmailConnection
};
