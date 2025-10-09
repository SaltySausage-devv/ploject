const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const https = require('https');
require('dotenv').config({ path: '../../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID || 'service_3dqgnsi',
  templateId: process.env.EMAILJS_TEMPLATE_ID || 'template_ktq4n7j',
  publicKey: process.env.EMAILJS_PUBLIC_KEY || 'l8VwHjwH16cAfCk4r'
};

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userType: Joi.string().valid('student', 'tutor', 'centre').required(),
  phone: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required()
});

// JWT utilities
const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Email sending utility with fallback
const sendResetEmail = async (email, resetLink, userName) => {
  try {
    console.log('📧 Attempting to send password reset email to:', email);
    
    // For now, we'll log the reset link and provide instructions
    // In production, you would integrate with a proper email service
    console.log('🔗 Password Reset Link:', resetLink);
    console.log('📧 Email Details:');
    console.log('   To:', email);
    console.log('   Subject: Password Reset Request');
    console.log('   Template Parameters:');
    console.log('     - link:', resetLink);
    console.log('     - email:', email);
    console.log('     - user_name:', userName || 'User');
    
    // Manual email sending instructions
    console.log('\n📝 To send the email manually:');
    console.log('1. Go to https://dashboard.emailjs.com/');
    console.log('2. Use the following template parameters:');
    console.log('   Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('   Template ID:', EMAILJS_CONFIG.templateId);
    console.log('   Public Key:', EMAILJS_CONFIG.publicKey);
    console.log('3. Or use the EmailJS dashboard to send the email directly');
    
    // Return success for now (in production, implement actual email sending)
    return { success: true, result: 'Email details logged for manual sending' };
    
  } catch (error) {
    console.error('❌ Failed to process email request:', error);
    return { success: false, error: error.message };
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/auth/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, firstName, lastName, userType, phone } = value;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
        phone,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Generate token
    const token = generateToken(user.id, userType);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Find user
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.user_type);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/verify', verifyToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

app.post('/auth/refresh', verifyToken, (req, res) => {
  const newToken = generateToken(req.user.userId, req.user.userType);
  res.json({
    token: newToken,
    user: req.user
  });
});

// Password reset endpoints
app.post('/auth/forgot-password', async (req, res) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = value;

    // Check if user exists
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, email, first_name')
      .eq('email', email)
      .single();

    if (findError || !user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store reset token in database (you might want to create a separate table for this)
    // For now, we'll use a simple approach with the existing users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        reset_token: resetToken,
        reset_token_expires: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error storing reset token:', updateError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    // Send reset email
    const emailResult = await sendResetEmail(email, resetLink, user.first_name);
    
    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error);
      // Still return success to user for security (don't reveal email sending failures)
    }

    // Log reset link in development for testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔗 Password reset link for ${email}: ${resetLink}`);
    }

    res.json({ 
      message: 'If an account with that email exists, a password reset link has been sent.',
      // Only include reset link in development for testing
      ...(process.env.NODE_ENV === 'development' && { resetLink })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/reset-password', async (req, res) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { token, password } = value;

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'password_reset') {
        return res.status(400).json({ error: 'Invalid reset token' });
      }
    } catch (jwtError) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token exists in database and is not expired
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, reset_token, reset_token_expires')
      .eq('id', decoded.userId)
      .eq('reset_token', token)
      .single();

    if (findError || !user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (new Date() > new Date(user.reset_token_expires)) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset token
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ message: 'Password has been reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth' });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
