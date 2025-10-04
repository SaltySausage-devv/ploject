const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3004;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// JWT verification middleware
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

// Validation schemas
const createBookingSchema = Joi.object({
  tutorId: Joi.number().required(),
  studentId: Joi.number().required(),
  subject: Joi.string().required(),
  level: Joi.string().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  location: Joi.string().optional(),
  isOnline: Joi.boolean().default(false),
  notes: Joi.string().max(500).optional(),
  hourlyRate: Joi.number().min(0).required()
});

const updateAvailabilitySchema = Joi.object({
  dayOfWeek: Joi.number().min(0).max(6).required(),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  isAvailable: Joi.boolean().required()
});

// Routes
app.get('/bookings/availability/:tutorId', async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('availability_slots')
      .select('*')
      .eq('tutor_id', tutorId);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: availability, error } = await query.order('date', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({ availability });
  } catch (error) {
    console.error('Availability fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/bookings/availability', verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== 'tutor') {
      return res.status(403).json({ error: 'Only tutors can set availability' });
    }

    const { error, value } = updateAvailabilitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { data: availability, error: insertError } = await supabase
      .from('availability_slots')
      .insert({
        tutor_id: req.user.userId,
        ...value,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    res.status(201).json({
      message: 'Availability updated successfully',
      availability
    });
  } catch (error) {
    console.error('Availability update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/bookings', verifyToken, async (req, res) => {
  try {
    const { error, value } = createBookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if slot is available
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('tutor_id', value.tutorId)
      .eq('start_time', value.startTime)
      .eq('status', 'confirmed');

    if (existingBooking) {
      return res.status(400).json({ error: 'Time slot is already booked' });
    }

    // Calculate total amount
    const duration = (new Date(value.endTime) - new Date(value.startTime)) / (1000 * 60 * 60);
    const totalAmount = duration * value.hourlyRate;

    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        ...value,
        total_amount: totalAmount,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/bookings/student/:studentId', verifyToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('bookings')
      .select(`
        *,
        tutors:tutor_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq('student_id', studentId);

    if (status) {
      query = query.eq('status', status);
    }

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: bookings, error } = await query;

    if (error) {
      throw error;
    }

    res.json({ bookings });
  } catch (error) {
    console.error('Student bookings fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/bookings/tutor/:tutorId', verifyToken, async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('bookings')
      .select(`
        *,
        students:student_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq('tutor_id', tutorId);

    if (status) {
      query = query.eq('status', status);
    }

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: bookings, error } = await query;

    if (error) {
      throw error;
    }

    res.json({ bookings });
  } catch (error) {
    console.error('Tutor bookings fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/bookings/:id/confirm', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is the tutor for this booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('tutor_id, status')
      .eq('id', id)
      .single();

    if (!booking || booking.tutor_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ error: 'Booking is not in pending status' });
    }

    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'Booking confirmed successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Booking confirmation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/bookings/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Check if user is involved in this booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('tutor_id, student_id, status')
      .eq('id', id)
      .single();

    if (!booking || (booking.tutor_id !== req.user.userId && booking.student_id !== req.user.userId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/bookings/:id/reschedule', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { newStartTime, newEndTime } = req.body;

    // Check if user is involved in this booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('tutor_id, student_id, status')
      .eq('id', id)
      .single();

    if (!booking || (booking.tutor_id !== req.user.userId && booking.student_id !== req.user.userId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ error: 'Only confirmed bookings can be rescheduled' });
    }

    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({
        start_time: newStartTime,
        end_time: newEndTime,
        rescheduled_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'Booking rescheduled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Booking reschedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cron job to clean up expired bookings
cron.schedule('0 0 * * *', async () => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'expired' })
      .eq('status', 'pending')
      .lt('start_time', new Date().toISOString());

    if (error) {
      console.error('Cron job error:', error);
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'bookings' });
});

app.listen(PORT, () => {
  console.log(`Bookings service running on port ${PORT}`);
});
