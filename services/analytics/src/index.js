const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
require('dotenv').config({ path: '../../.env' });

const app = express();
const PORT = process.env.PORT || 3008;

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
const analyticsQuerySchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  period: Joi.string().valid('day', 'week', 'month', 'year').default('month'),
  groupBy: Joi.string().valid('date', 'subject', 'level', 'tutor').default('date')
});

// Routes
app.get('/analytics/tutor/:tutorId', verifyToken, async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { error, value } = analyticsQuerySchema.validate(req.query);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user is the tutor or admin
    if (req.user.userId !== parseInt(tutorId) && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { startDate, endDate, period, groupBy } = value;

    // Set default date range if not provided
    const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    // Get tutor's bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('tutor_id', tutorId)
      .gte('created_at', defaultStartDate)
      .lte('created_at', defaultEndDate);

    if (bookingsError) {
      throw bookingsError;
    }

    // Get tutor's profile views
    const { data: profileViews, error: viewsError } = await supabase
      .from('profile_views')
      .select('*')
      .eq('tutor_id', tutorId)
      .gte('created_at', defaultStartDate)
      .lte('created_at', defaultEndDate);

    if (viewsError) {
      throw viewsError;
    }

    // Get tutor's reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('tutor_id', tutorId)
      .gte('created_at', defaultStartDate)
      .lte('created_at', defaultEndDate);

    if (reviewsError) {
      throw reviewsError;
    }

    // Calculate metrics
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    
    const totalEarnings = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    const conversionRate = profileViews.length > 0 
      ? (totalBookings / profileViews.length) * 100 
      : 0;

    // Group data by specified criteria
    let groupedData = {};
    
    if (groupBy === 'date') {
      groupedData = groupByDate(bookings, period);
    } else if (groupBy === 'subject') {
      groupedData = groupBySubject(bookings);
    } else if (groupBy === 'level') {
      groupedData = groupByLevel(bookings);
    }

    // Get recent activity
    const recentActivity = await getRecentActivity(tutorId);

    res.json({
      overview: {
        totalBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalEarnings,
        averageRating: Math.round(averageRating * 10) / 10,
        totalViews: profileViews.length,
        conversionRate: Math.round(conversionRate * 10) / 10
      },
      groupedData,
      recentActivity
    });
  } catch (error) {
    console.error('Tutor analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/analytics/centre/:centreId', verifyToken, async (req, res) => {
  try {
    const { centreId } = req.params;
    const { error, value } = analyticsQuerySchema.validate(req.query);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user is the centre or admin
    if (req.user.userId !== parseInt(centreId) && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { startDate, endDate, period, groupBy } = value;

    // Set default date range if not provided
    const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    // Get centre's bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('centre_id', centreId)
      .gte('created_at', defaultStartDate)
      .lte('created_at', defaultEndDate);

    if (bookingsError) {
      throw bookingsError;
    }

    // Get centre's profile views
    const { data: profileViews, error: viewsError } = await supabase
      .from('profile_views')
      .select('*')
      .eq('centre_id', centreId)
      .gte('created_at', defaultStartDate)
      .lte('created_at', defaultEndDate);

    if (viewsError) {
      throw viewsError;
    }

    // Calculate metrics
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    
    const totalRevenue = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

    const conversionRate = profileViews.length > 0 
      ? (totalBookings / profileViews.length) * 100 
      : 0;

    // Group data by specified criteria
    let groupedData = {};
    
    if (groupBy === 'date') {
      groupedData = groupByDate(bookings, period);
    } else if (groupBy === 'subject') {
      groupedData = groupBySubject(bookings);
    } else if (groupBy === 'level') {
      groupedData = groupByLevel(bookings);
    }

    // Get recent activity
    const recentActivity = await getRecentActivity(centreId, 'centre');

    res.json({
      overview: {
        totalBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        totalViews: profileViews.length,
        conversionRate: Math.round(conversionRate * 10) / 10
      },
      groupedData,
      recentActivity
    });
  } catch (error) {
    console.error('Centre analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/analytics/admin/overview', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { startDate, endDate } = req.query;

    // Set default date range if not provided
    const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    // Get platform-wide metrics
    const [
      { data: totalUsers },
      { data: totalTutors },
      { data: totalCentres },
      { data: totalBookings },
      { data: totalRevenue },
      { data: totalReviews }
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('users').select('id', { count: 'exact' }).eq('user_type', 'tutor'),
      supabase.from('users').select('id', { count: 'exact' }).eq('user_type', 'centre'),
      supabase.from('bookings').select('id', { count: 'exact' }).gte('created_at', defaultStartDate).lte('created_at', defaultEndDate),
      supabase.from('bookings').select('total_amount').eq('status', 'completed').gte('created_at', defaultStartDate).lte('created_at', defaultEndDate),
      supabase.from('reviews').select('id', { count: 'exact' }).gte('created_at', defaultStartDate).lte('created_at', defaultEndDate)
    ]);

    const revenue = totalRevenue?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

    // Get top performing tutors
    const { data: topTutors } = await supabase
      .from('tutor_profiles')
      .select(`
        user_id,
        average_rating,
        total_reviews,
        users:user_id (
          first_name,
          last_name
        )
      `)
      .order('average_rating', { ascending: false })
      .limit(10);

    // Get popular subjects
    const { data: subjectStats } = await supabase
      .from('bookings')
      .select('subject')
      .gte('created_at', defaultStartDate)
      .lte('created_at', defaultEndDate);

    const subjectCounts = {};
    subjectStats?.forEach(booking => {
      subjectCounts[booking.subject] = (subjectCounts[booking.subject] || 0) + 1;
    });

    const popularSubjects = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([subject, count]) => ({ subject, count }));

    res.json({
      overview: {
        totalUsers: totalUsers?.length || 0,
        totalTutors: totalTutors?.length || 0,
        totalCentres: totalCentres?.length || 0,
        totalBookings: totalBookings?.length || 0,
        totalRevenue: revenue,
        totalReviews: totalReviews?.length || 0
      },
      topTutors,
      popularSubjects
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
function groupByDate(bookings, period) {
  const groups = {};
  
  bookings.forEach(booking => {
    const date = new Date(booking.created_at);
    let key;
    
    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    if (!groups[key]) {
      groups[key] = { count: 0, revenue: 0 };
    }
    
    groups[key].count++;
    if (booking.status === 'completed') {
      groups[key].revenue += booking.total_amount || 0;
    }
  });
  
  return groups;
}

function groupBySubject(bookings) {
  const groups = {};
  
  bookings.forEach(booking => {
    const subject = booking.subject;
    
    if (!groups[subject]) {
      groups[subject] = { count: 0, revenue: 0 };
    }
    
    groups[subject].count++;
    if (booking.status === 'completed') {
      groups[subject].revenue += booking.total_amount || 0;
    }
  });
  
  return groups;
}

function groupByLevel(bookings) {
  const groups = {};
  
  bookings.forEach(booking => {
    const level = booking.level;
    
    if (!groups[level]) {
      groups[level] = { count: 0, revenue: 0 };
    }
    
    groups[level].count++;
    if (booking.status === 'completed') {
      groups[level].revenue += booking.total_amount || 0;
    }
  });
  
  return groups;
}

async function getRecentActivity(userId, userType = 'tutor') {
  try {
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select(`
        *,
        students:student_id (
          first_name,
          last_name
        ),
        tutors:tutor_id (
          first_name,
          last_name
        )
      `)
      .eq(userType === 'tutor' ? 'tutor_id' : 'centre_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    return recentBookings || [];
  } catch (error) {
    console.error('Recent activity error:', error);
    return [];
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'analytics' });
});

app.listen(PORT, () => {
  console.log(`Analytics service running on port ${PORT}`);
});
