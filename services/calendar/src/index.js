const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { google } = require('googleapis');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3011;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Initialize Google Calendar API
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
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
const createEventSchema = Joi.object({
  bookingId: Joi.number().required(),
  title: Joi.string().required(),
  description: Joi.string().optional(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  location: Joi.string().optional(),
  attendees: Joi.array().items(Joi.string().email()).optional()
});

const updateEventSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  startTime: Joi.date().optional(),
  endTime: Joi.date().optional(),
  location: Joi.string().optional(),
  attendees: Joi.array().items(Joi.string().email()).optional()
});

// Routes
app.get('/calendar/auth-url', verifyToken, (req, res) => {
  try {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: req.user.userId.toString()
    });

    res.json({ authUrl });
  } catch (error) {
    console.error('Auth URL generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/calendar/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    const userId = parseInt(state);

    if (!code || !userId) {
      return res.status(400).json({ error: 'Invalid callback parameters' });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens in database
    await supabase
      .from('calendar_tokens')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
        created_at: new Date().toISOString()
      });

    res.json({ message: 'Calendar connected successfully' });
  } catch (error) {
    console.error('Calendar callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/calendar/events', verifyToken, async (req, res) => {
  try {
    const { error, value } = createEventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { bookingId, title, description, startTime, endTime, location, attendees } = value;

    // Get user's calendar tokens
    const { data: tokens } = await supabase
      .from('calendar_tokens')
      .select('*')
      .eq('user_id', req.user.userId)
      .single();

    if (!tokens) {
      return res.status(400).json({ error: 'Calendar not connected' });
    }

    // Set up OAuth2 client with user's tokens
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Create calendar event
    const event = {
      summary: title,
      description: description || '',
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: 'Asia/Singapore'
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: 'Asia/Singapore'
      },
      location: location || '',
      attendees: attendees?.map(email => ({ email })) || []
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    // Store event mapping in database
    await supabase
      .from('calendar_events')
      .insert({
        booking_id: bookingId,
        user_id: req.user.userId,
        google_event_id: response.data.id,
        created_at: new Date().toISOString()
      });

    res.status(201).json({
      message: 'Event created successfully',
      event: response.data
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/calendar/events/:eventId', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { error, value } = updateEventSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Get event mapping
    const { data: eventMapping } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', eventId)
      .eq('user_id', req.user.userId)
      .single();

    if (!eventMapping) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get user's calendar tokens
    const { data: tokens } = await supabase
      .from('calendar_tokens')
      .select('*')
      .eq('user_id', req.user.userId)
      .single();

    if (!tokens) {
      return res.status(400).json({ error: 'Calendar not connected' });
    }

    // Set up OAuth2 client
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Update calendar event
    const event = {};
    if (value.title) event.summary = value.title;
    if (value.description) event.description = value.description;
    if (value.startTime) {
      event.start = {
        dateTime: new Date(value.startTime).toISOString(),
        timeZone: 'Asia/Singapore'
      };
    }
    if (value.endTime) {
      event.end = {
        dateTime: new Date(value.endTime).toISOString(),
        timeZone: 'Asia/Singapore'
      };
    }
    if (value.location) event.location = value.location;
    if (value.attendees) event.attendees = value.attendees.map(email => ({ email }));

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventMapping.google_event_id,
      resource: event
    });

    res.json({
      message: 'Event updated successfully',
      event: response.data
    });
  } catch (error) {
    console.error('Event update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/calendar/events/:eventId', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Get event mapping
    const { data: eventMapping } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', eventId)
      .eq('user_id', req.user.userId)
      .single();

    if (!eventMapping) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get user's calendar tokens
    const { data: tokens } = await supabase
      .from('calendar_tokens')
      .select('*')
      .eq('user_id', req.user.userId)
      .single();

    if (!tokens) {
      return res.status(400).json({ error: 'Calendar not connected' });
    }

    // Set up OAuth2 client
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Delete calendar event
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventMapping.google_event_id
    });

    // Remove event mapping
    await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventId);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Event deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/calendar/events', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Get user's calendar tokens
    const { data: tokens } = await supabase
      .from('calendar_tokens')
      .select('*')
      .eq('user_id', req.user.userId)
      .single();

    if (!tokens) {
      return res.status(400).json({ error: 'Calendar not connected' });
    }

    // Set up OAuth2 client
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get events from Google Calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate || new Date().toISOString(),
      timeMax: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    res.json({ events: response.data.items || [] });
  } catch (error) {
    console.error('Events fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/calendar/sync/:bookingId', verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Get booking details
    const { data: booking } = await supabase
      .from('bookings')
      .select(`
        *,
        tutors:tutor_id (
          first_name,
          last_name,
          email
        ),
        students:student_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', bookingId)
      .single();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Create calendar event for both tutor and student
    const eventTitle = `Tutoring Session - ${booking.subject}`;
    const eventDescription = `Tutoring session for ${booking.level} ${booking.subject}`;
    const attendees = [booking.tutors.email, booking.students.email];

    // Create event for tutor
    await createCalendarEvent(req.user.userId, {
      bookingId,
      title: eventTitle,
      description: eventDescription,
      startTime: booking.start_time,
      endTime: booking.end_time,
      location: booking.location,
      attendees
    });

    res.json({ message: 'Booking synced to calendar successfully' });
  } catch (error) {
    console.error('Calendar sync error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to create calendar event
async function createCalendarEvent(userId, eventData) {
  try {
    // Get user's calendar tokens
    const { data: tokens } = await supabase
      .from('calendar_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!tokens) {
      throw new Error('Calendar not connected');
    }

    // Set up OAuth2 client
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Create calendar event
    const event = {
      summary: eventData.title,
      description: eventData.description,
      start: {
        dateTime: new Date(eventData.startTime).toISOString(),
        timeZone: 'Asia/Singapore'
      },
      end: {
        dateTime: new Date(eventData.endTime).toISOString(),
        timeZone: 'Asia/Singapore'
      },
      location: eventData.location || '',
      attendees: eventData.attendees?.map(email => ({ email })) || []
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    // Store event mapping
    await supabase
      .from('calendar_events')
      .insert({
        booking_id: eventData.bookingId,
        user_id: userId,
        google_event_id: response.data.id,
        created_at: new Date().toISOString()
      });

    return response.data;
  } catch (error) {
    console.error('Create calendar event error:', error);
    throw error;
  }
}

// Auto-sync completed bookings to calendar
cron.schedule('0 */6 * * *', async () => {
  try {
    console.log('Syncing completed bookings to calendar...');
    
    // Get completed bookings that haven't been synced
    const { data: completedBookings } = await supabase
      .from('bookings')
      .select('id, tutor_id, student_id, subject, level, start_time, end_time, location')
      .eq('status', 'completed')
      .is('calendar_synced', null);

    for (const booking of completedBookings || []) {
      try {
        // Sync for tutor
        await createCalendarEvent(booking.tutor_id, {
          bookingId: booking.id,
          title: `Tutoring Session - ${booking.subject}`,
          description: `Completed tutoring session for ${booking.level} ${booking.subject}`,
          startTime: booking.start_time,
          endTime: booking.end_time,
          location: booking.location
        });

        // Mark as synced
        await supabase
          .from('bookings')
          .update({ calendar_synced: true })
          .eq('id', booking.id);
      } catch (error) {
        console.error(`Calendar sync error for booking ${booking.id}:`, error);
      }
    }

    console.log('Calendar sync completed');
  } catch (error) {
    console.error('Calendar sync cron error:', error);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'calendar' });
});

app.listen(PORT, () => {
  console.log(`Calendar service running on port ${PORT}`);
});
