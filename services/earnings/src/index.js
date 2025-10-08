const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const cron = require('node-cron');
require('dotenv').config({ path: '../../.env' });

const app = express();
const PORT = process.env.PORT || 3010;

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

// Platform commission rate (5%)
const PLATFORM_COMMISSION = 0.05;

// Validation schemas
const createEarningSchema = Joi.object({
  tutorId: Joi.number().required(),
  centreId: Joi.number().optional(),
  bookingId: Joi.number().required(),
  amount: Joi.number().min(0).required(),
  description: Joi.string().optional()
});

const updateEarningSchema = Joi.object({
  status: Joi.string().valid('pending', 'paid', 'cancelled').optional(),
  paidAt: Joi.date().optional(),
  notes: Joi.string().optional()
});

// Routes
app.get('/earnings/tutor/:tutorId', verifyToken, async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { startDate, endDate, status, page = 1, limit = 20 } = req.query;

    // Check if user can access these earnings
    if (req.user.userId !== parseInt(tutorId) && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    let query = supabase
      .from('earnings')
      .select(`
        *,
        bookings:booking_id (
          subject,
          level,
          start_time,
          end_time,
          students:student_id (
            first_name,
            last_name
          )
        )
      `)
      .eq('tutor_id', tutorId);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const offset = (page - 1) * limit;
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: earnings, error } = await query;

    if (error) {
      throw error;
    }

    // Get summary statistics
    const { data: summary } = await supabase
      .from('earnings')
      .select('amount, commission, net_amount, status')
      .eq('tutor_id', tutorId);

    const totalEarnings = summary?.reduce((sum, earning) => sum + earning.amount, 0) || 0;
    const totalCommission = summary?.reduce((sum, earning) => sum + earning.commission, 0) || 0;
    const totalNet = summary?.reduce((sum, earning) => sum + earning.net_amount, 0) || 0;
    const pendingEarnings = summary?.filter(e => e.status === 'pending').reduce((sum, earning) => sum + earning.net_amount, 0) || 0;
    const paidEarnings = summary?.filter(e => e.status === 'paid').reduce((sum, earning) => sum + earning.net_amount, 0) || 0;

    res.json({
      earnings: earnings || [],
      summary: {
        totalEarnings,
        totalCommission,
        totalNet,
        pendingEarnings,
        paidEarnings
      }
    });
  } catch (error) {
    console.error('Tutor earnings fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/earnings/centre/:centreId', verifyToken, async (req, res) => {
  try {
    const { centreId } = req.params;
    const { startDate, endDate, status, page = 1, limit = 20 } = req.query;

    // Check if user can access these earnings
    if (req.user.userId !== parseInt(centreId) && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    let query = supabase
      .from('earnings')
      .select(`
        *,
        bookings:booking_id (
          subject,
          level,
          start_time,
          end_time,
          students:student_id (
            first_name,
            last_name
          )
        )
      `)
      .eq('centre_id', centreId);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const offset = (page - 1) * limit;
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: earnings, error } = await query;

    if (error) {
      throw error;
    }

    res.json({ earnings: earnings || [] });
  } catch (error) {
    console.error('Centre earnings fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/earnings', verifyToken, async (req, res) => {
  try {
    const { error, value } = createEarningSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { tutorId, centreId, bookingId, amount, description } = value;

    // Calculate commission and net amount
    const commission = amount * PLATFORM_COMMISSION;
    const netAmount = amount - commission;

    const { data: earning, error: insertError } = await supabase
      .from('earnings')
      .insert({
        tutor_id: tutorId,
        centre_id: centreId,
        booking_id: bookingId,
        amount,
        commission,
        net_amount: netAmount,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    res.status(201).json({
      message: 'Earning created successfully',
      earning
    });
  } catch (error) {
    console.error('Earning creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/earnings/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateEarningSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user can update this earning
    const { data: earning } = await supabase
      .from('earnings')
      .select('tutor_id, centre_id')
      .eq('id', id)
      .single();

    if (!earning || 
        (earning.tutor_id !== req.user.userId && 
         earning.centre_id !== req.user.userId && 
         req.user.userType !== 'admin')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updateData = { ...value };
    if (value.status === 'paid' && !value.paidAt) {
      updateData.paid_at = new Date().toISOString();
    }

    const { data: updatedEarning, error: updateError } = await supabase
      .from('earnings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    res.json({
      message: 'Earning updated successfully',
      earning: updatedEarning
    });
  } catch (error) {
    console.error('Earning update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/earnings/summary/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'month' } = req.query;

    // Check if user can access this summary
    if (req.user.userId !== parseInt(userId) && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    let startDate;
    const now = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const { data: earnings } = await supabase
      .from('earnings')
      .select('amount, commission, net_amount, status, created_at')
      .or(`tutor_id.eq.${userId},centre_id.eq.${userId}`)
      .gte('created_at', startDate.toISOString());

    const summary = {
      totalEarnings: 0,
      totalCommission: 0,
      totalNet: 0,
      pendingAmount: 0,
      paidAmount: 0,
      averageEarning: 0,
      totalSessions: 0
    };

    if (earnings) {
      summary.totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
      summary.totalCommission = earnings.reduce((sum, earning) => sum + earning.commission, 0);
      summary.totalNet = earnings.reduce((sum, earning) => sum + earning.net_amount, 0);
      summary.pendingAmount = earnings.filter(e => e.status === 'pending').reduce((sum, earning) => sum + earning.net_amount, 0);
      summary.paidAmount = earnings.filter(e => e.status === 'paid').reduce((sum, earning) => sum + earning.net_amount, 0);
      summary.totalSessions = earnings.length;
      summary.averageEarning = summary.totalSessions > 0 ? summary.totalNet / summary.totalSessions : 0;
    }

    res.json({ summary });
  } catch (error) {
    console.error('Earnings summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/earnings/analytics/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    // Check if user can access this analytics
    if (req.user.userId !== parseInt(userId) && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    // Get earnings data
    const { data: earnings } = await supabase
      .from('earnings')
      .select('amount, net_amount, created_at, status')
      .or(`tutor_id.eq.${userId},centre_id.eq.${userId}`)
      .gte('created_at', defaultStartDate)
      .lte('created_at', defaultEndDate)
      .order('created_at', { ascending: true });

    // Group by date for trend analysis
    const dailyEarnings = {};
    const weeklyEarnings = {};
    const monthlyEarnings = {};

    earnings?.forEach(earning => {
      const date = new Date(earning.created_at);
      const dayKey = date.toISOString().split('T')[0];
      const weekKey = getWeekKey(date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!dailyEarnings[dayKey]) dailyEarnings[dayKey] = 0;
      if (!weeklyEarnings[weekKey]) weeklyEarnings[weekKey] = 0;
      if (!monthlyEarnings[monthKey]) monthlyEarnings[monthKey] = 0;

      dailyEarnings[dayKey] += earning.net_amount;
      weeklyEarnings[weekKey] += earning.net_amount;
      monthlyEarnings[monthKey] += earning.net_amount;
    });

    res.json({
      dailyTrend: Object.entries(dailyEarnings).map(([date, amount]) => ({ date, amount })),
      weeklyTrend: Object.entries(weeklyEarnings).map(([week, amount]) => ({ week, amount })),
      monthlyTrend: Object.entries(monthlyEarnings).map(([month, amount]) => ({ month, amount }))
    });
  } catch (error) {
    console.error('Earnings analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to get week key
function getWeekKey(date) {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week}`;
}

// Helper function to get week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Process completed bookings and create earnings
cron.schedule('0 */6 * * *', async () => {
  try {
    console.log('Processing completed bookings for earnings...');
    
    // Get completed bookings that haven't been processed for earnings
    const { data: completedBookings } = await supabase
      .from('bookings')
      .select('id, tutor_id, centre_id, total_amount, created_at')
      .eq('status', 'completed')
      .is('earnings_processed', null);

    for (const booking of completedBookings || []) {
      const commission = booking.total_amount * PLATFORM_COMMISSION;
      const netAmount = booking.total_amount - commission;

      await supabase
        .from('earnings')
        .insert({
          tutor_id: booking.tutor_id,
          centre_id: booking.centre_id,
          booking_id: booking.id,
          amount: booking.total_amount,
          commission,
          net_amount: netAmount,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      // Mark booking as processed
      await supabase
        .from('bookings')
        .update({ earnings_processed: true })
        .eq('id', booking.id);
    }

    console.log('Earnings processing completed');
  } catch (error) {
    console.error('Earnings processing error:', error);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'earnings' });
});

app.listen(PORT, () => {
  console.log(`Earnings service running on port ${PORT}`);
});
