const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

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
const tutorProfileSchema = Joi.object({
  bio: Joi.string().max(1000).optional(),
  subjects: Joi.array().items(Joi.string()).optional(),
  levels: Joi.array().items(Joi.string().valid('Primary', 'Secondary', 'JC', 'IB', 'IGCSE')).optional(),
  hourlyRate: Joi.number().min(0).optional(),
  packageRates: Joi.object().optional(),
  qualifications: Joi.array().items(Joi.object({
    degree: Joi.string().required(),
    institution: Joi.string().required(),
    year: Joi.number().required()
  })).optional(),
  experience: Joi.number().min(0).optional(),
  teachingMode: Joi.array().items(Joi.string().valid('online', 'in-person', 'both')).optional(),
  location: Joi.object({
    address: Joi.string().optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    radius: Joi.number().min(1).max(50).optional()
  }).optional(),
  availability: Joi.object().optional()
});

const centreProfileSchema = Joi.object({
  name: Joi.string().required(),
  bio: Joi.string().max(1000).optional(),
  subjects: Joi.array().items(Joi.string()).optional(),
  levels: Joi.array().items(Joi.string().valid('Primary', 'Secondary', 'JC', 'IB', 'IGCSE')).optional(),
  hourlyRate: Joi.number().min(0).optional(),
  packageRates: Joi.object().optional(),
  facilities: Joi.array().items(Joi.string()).optional(),
  capacity: Joi.number().min(1).optional(),
  location: Joi.object({
    address: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  }).required(),
  operatingHours: Joi.object().optional(),
  contactInfo: Joi.object({
    phone: Joi.string().optional(),
    email: Joi.string().email().optional(),
    website: Joi.string().uri().optional()
  }).optional()
});

// Routes
app.get('/profiles/tutor/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: profile, error } = await supabase
      .from('tutor_profiles')
      .select(`
        *,
        users:user_id (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('user_id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Tutor profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/profiles/centre/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: profile, error } = await supabase
      .from('centre_profiles')
      .select(`
        *,
        users:user_id (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('user_id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Centre profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/profiles/tutor', verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== 'tutor') {
      return res.status(403).json({ error: 'Only tutors can create tutor profiles' });
    }

    const { error, value } = tutorProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { data: profile, error: insertError } = await supabase
      .from('tutor_profiles')
      .insert({
        user_id: req.user.userId,
        ...value,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    res.status(201).json({
      message: 'Tutor profile created successfully',
      profile
    });
  } catch (error) {
    console.error('Tutor profile creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/profiles/centre', verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== 'centre') {
      return res.status(403).json({ error: 'Only centres can create centre profiles' });
    }

    const { error, value } = centreProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { data: profile, error: insertError } = await supabase
      .from('centre_profiles')
      .insert({
        user_id: req.user.userId,
        ...value,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    res.status(201).json({
      message: 'Centre profile created successfully',
      profile
    });
  } catch (error) {
    console.error('Centre profile creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/profiles/tutor/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns this profile
    const { data: existingProfile } = await supabase
      .from('tutor_profiles')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existingProfile || existingProfile.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { error, value } = tutorProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { data: profile, error: updateError } = await supabase
      .from('tutor_profiles')
      .update({
        ...value,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    res.json({
      message: 'Tutor profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Tutor profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/profiles/centre/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns this profile
    const { data: existingProfile } = await supabase
      .from('centre_profiles')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existingProfile || existingProfile.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { error, value } = centreProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { data: profile, error: updateError } = await supabase
      .from('centre_profiles')
      .update({
        ...value,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    res.json({
      message: 'Centre profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Centre profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search profiles
app.get('/profiles/search', async (req, res) => {
  try {
    const { 
      type, 
      subject, 
      level, 
      location, 
      minRate, 
      maxRate, 
      teachingMode,
      page = 1,
      limit = 20
    } = req.query;

    let query = supabase
      .from(type === 'centre' ? 'centre_profiles' : 'tutor_profiles')
      .select(`
        *,
        users:user_id (
          first_name,
          last_name,
          email
        )
      `);

    // Apply filters
    if (subject) {
      query = query.contains('subjects', [subject]);
    }
    if (level) {
      query = query.contains('levels', [level]);
    }
    if (minRate) {
      query = query.gte('hourly_rate', minRate);
    }
    if (maxRate) {
      query = query.lte('hourly_rate', maxRate);
    }
    if (teachingMode && type === 'tutor') {
      query = query.contains('teaching_mode', [teachingMode]);
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: profiles, error } = await query;

    if (error) {
      throw error;
    }

    res.json({ profiles });
  } catch (error) {
    console.error('Profile search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload verification documents
app.post('/profiles/verification/:id', verifyToken, upload.single('document'), async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload file to Supabase Storage
    const fileName = `verification/${id}/${documentType}_${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('verification-documents')
      .upload(fileName, req.file.buffer, {
        contentType: 'application/pdf'
      });

    if (uploadError) {
      throw uploadError;
    }

    // Update verification status
    const { error: updateError } = await supabase
      .from('verification_documents')
      .insert({
        profile_id: id,
        document_type: documentType,
        file_path: uploadData.path,
        status: 'pending',
        uploaded_at: new Date().toISOString()
      });

    if (updateError) {
      throw updateError;
    }

    res.json({
      message: 'Verification document uploaded successfully',
      filePath: uploadData.path
    });
  } catch (error) {
    console.error('Verification upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'profiles' });
});

app.listen(PORT, () => {
  console.log(`Profiles service running on port ${PORT}`);
});
