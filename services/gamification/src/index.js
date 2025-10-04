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
const PORT = process.env.PORT || 3009;

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

// Badge definitions
const BADGE_TYPES = {
  FIRST_BOOKING: 'first_booking',
  PERFECT_RATING: 'perfect_rating',
  LOYAL_STUDENT: 'loyal_student',
  TOP_TUTOR: 'top_tutor',
  CONSISTENT_TUTOR: 'consistent_tutor',
  REVIEW_MASTER: 'review_master',
  EARNING_MILESTONE: 'earning_milestone',
  SOCIAL_BUTTERFLY: 'social_butterfly'
};

// Point values for different actions
const POINT_VALUES = {
  BOOKING_COMPLETED: 10,
  REVIEW_RECEIVED: 5,
  PERFECT_RATING: 15,
  CONSISTENT_WEEK: 20,
  REFERRAL: 25,
  ACHIEVEMENT_UNLOCKED: 50
};

// Routes
app.get('/gamification/user/:userId/stats', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user can access these stats
    if (req.user.userId !== parseInt(userId) && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Get user's total points
    const { data: pointsData } = await supabase
      .from('user_points')
      .select('points')
      .eq('user_id', userId);

    const totalPoints = pointsData?.reduce((sum, point) => sum + point.points, 0) || 0;

    // Get user's badges
    const { data: badges } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    // Get user's leaderboard position
    const { data: leaderboardData } = await supabase
      .from('leaderboards')
      .select('rank')
      .eq('user_id', userId)
      .eq('period', 'monthly')
      .single();

    // Get recent achievements
    const { data: recentAchievements } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
      .limit(5);

    res.json({
      totalPoints,
      badges: badges || [],
      leaderboardRank: leaderboardData?.rank || null,
      recentAchievements: recentAchievements || []
    });
  } catch (error) {
    console.error('Gamification stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/gamification/leaderboard/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { period = 'monthly', limit = 10 } = req.query;

    const { data: leaderboard, error } = await supabase
      .from('leaderboards')
      .select(`
        *,
        users:user_id (
          first_name,
          last_name,
          user_type
        )
      `)
      .eq('category', category)
      .eq('period', period)
      .order('score', { ascending: false })
      .limit(parseInt(limit));

    if (error) {
      throw error;
    }

    res.json({ leaderboard: leaderboard || [] });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/gamification/earn-points', verifyToken, async (req, res) => {
  try {
    const { action, description, points } = req.body;

    const { data: pointEntry, error } = await supabase
      .from('user_points')
      .insert({
        user_id: req.user.userId,
        points: points || POINT_VALUES[action] || 0,
        source: action,
        description: description || `${action} completed`,
        earned_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Check for badge eligibility
    await checkBadgeEligibility(req.user.userId);

    res.status(201).json({
      message: 'Points earned successfully',
      points: pointEntry
    });
  } catch (error) {
    console.error('Earn points error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/gamification/badges', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const { data: badges, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ badges: badges || [] });
  } catch (error) {
    console.error('Badges fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/gamification/check-achievements', verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;

    if (req.user.userId !== parseInt(userId) && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const newBadges = await checkBadgeEligibility(userId);

    res.json({
      message: 'Achievement check completed',
      newBadges
    });
  } catch (error) {
    console.error('Achievement check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to check badge eligibility
async function checkBadgeEligibility(userId) {
  const newBadges = [];

  try {
    // Check for first booking badge
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('student_id', userId)
      .eq('status', 'completed');

    if (bookings && bookings.length === 1) {
      await awardBadge(userId, BADGE_TYPES.FIRST_BOOKING, 'First Booking', 'Completed your first tutoring session!');
      newBadges.push(BADGE_TYPES.FIRST_BOOKING);
    }

    // Check for perfect rating badge
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('tutor_id', userId);

    if (reviews && reviews.every(review => review.rating === 5)) {
      await awardBadge(userId, BADGE_TYPES.PERFECT_RATING, 'Perfect Rating', 'Maintained a perfect 5-star rating!');
      newBadges.push(BADGE_TYPES.PERFECT_RATING);
    }

    // Check for loyal student badge (10+ bookings)
    if (bookings && bookings.length >= 10) {
      await awardBadge(userId, BADGE_TYPES.LOYAL_STUDENT, 'Loyal Student', 'Completed 10+ tutoring sessions!');
      newBadges.push(BADGE_TYPES.LOYAL_STUDENT);
    }

    // Check for top tutor badge (highest rated in category)
    const { data: tutorRanking } = await supabase
      .from('tutor_profiles')
      .select('average_rating')
      .eq('user_id', userId)
      .single();

    if (tutorRanking && tutorRanking.average_rating >= 4.8) {
      await awardBadge(userId, BADGE_TYPES.TOP_TUTOR, 'Top Tutor', 'Achieved top-tier rating!');
      newBadges.push(BADGE_TYPES.TOP_TUTOR);
    }

    // Check for earning milestone badges
    const { data: earnings } = await supabase
      .from('earnings')
      .select('net_amount')
      .eq('tutor_id', userId)
      .eq('status', 'paid');

    const totalEarnings = earnings?.reduce((sum, earning) => sum + earning.net_amount, 0) || 0;

    if (totalEarnings >= 1000 && totalEarnings < 2000) {
      await awardBadge(userId, BADGE_TYPES.EARNING_MILESTONE, 'Earning Milestone', 'Earned your first $1000!');
      newBadges.push(BADGE_TYPES.EARNING_MILESTONE);
    }

  } catch (error) {
    console.error('Badge eligibility check error:', error);
  }

  return newBadges;
}

// Helper function to award a badge
async function awardBadge(userId, badgeType, badgeName, description) {
  try {
    // Check if badge already exists
    const { data: existingBadge } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_type', badgeType)
      .single();

    if (!existingBadge) {
      await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_type: badgeType,
          badge_name: badgeName,
          description,
          earned_at: new Date().toISOString()
        });

      // Award points for badge
      await supabase
        .from('user_points')
        .insert({
          user_id: userId,
          points: POINT_VALUES.ACHIEVEMENT_UNLOCKED,
          source: 'badge_earned',
          description: `Badge earned: ${badgeName}`,
          earned_at: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Award badge error:', error);
  }
}

// Update leaderboards daily
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Updating leaderboards...');
    
    // Update monthly leaderboards
    await updateLeaderboard('revenue', 'monthly');
    await updateLeaderboard('bookings', 'monthly');
    await updateLeaderboard('ratings', 'monthly');
    
    console.log('Leaderboards updated successfully');
  } catch (error) {
    console.error('Leaderboard update error:', error);
  }
});

// Helper function to update leaderboards
async function updateLeaderboard(category, period) {
  try {
    let query;
    
    if (category === 'revenue') {
      query = supabase
        .from('earnings')
        .select('tutor_id, net_amount')
        .eq('status', 'paid');
    } else if (category === 'bookings') {
      query = supabase
        .from('bookings')
        .select('tutor_id')
        .eq('status', 'completed');
    } else if (category === 'ratings') {
      query = supabase
        .from('tutor_profiles')
        .select('user_id, average_rating');
    }

    const { data: stats } = await query;

    if (stats) {
      // Process and rank the data
      const rankings = processRankings(stats, category);
      
      // Update leaderboard
      for (const [index, ranking] of rankings.entries()) {
        await supabase
          .from('leaderboards')
          .upsert({
            user_id: ranking.userId,
            category,
            score: ranking.score,
            rank: index + 1,
            period,
            created_at: new Date().toISOString()
          });
      }
    }
  } catch (error) {
    console.error(`Leaderboard update error for ${category}:`, error);
  }
}

// Helper function to process rankings
function processRankings(stats, category) {
  const userStats = {};
  
  stats.forEach(stat => {
    const userId = stat.tutor_id || stat.user_id;
    if (!userStats[userId]) {
      userStats[userId] = 0;
    }
    
    if (category === 'revenue') {
      userStats[userId] += stat.net_amount;
    } else if (category === 'bookings') {
      userStats[userId] += 1;
    } else if (category === 'ratings') {
      userStats[userId] = stat.average_rating;
    }
  });
  
  return Object.entries(userStats)
    .map(([userId, score]) => ({ userId: parseInt(userId), score }))
    .sort((a, b) => b.score - a.score);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'gamification' });
});

app.listen(PORT, () => {
  console.log(`Gamification service running on port ${PORT}`);
});
