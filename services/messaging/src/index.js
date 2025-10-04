const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const multer = require('multer');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 3005;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// RabbitMQ connection
let connection;
let channel;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const MESSAGE_QUEUE = 'messages';
const CHAT_QUEUE = 'chat_messages';

// Initialize RabbitMQ
async function initRabbitMQ() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Declare queues
    await channel.assertQueue(MESSAGE_QUEUE, { durable: true });
    await channel.assertQueue(CHAT_QUEUE, { durable: true });
    
    console.log('RabbitMQ connected successfully for messaging');
    
    // Start consuming messages
    await consumeMessages();
    
  } catch (error) {
    console.error('RabbitMQ connection failed:', error);
    // Fallback to direct processing if RabbitMQ is not available
  }
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
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

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    socket.userType = decoded.userType;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Store active connections
const activeConnections = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  activeConnections.set(socket.userId, socket);

  // Join conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
  });

  // Leave conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
  });

  // Handle new message
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, content, messageType = 'text' } = data;

      // Save message to database
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: socket.userId,
          content,
          message_type: messageType,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Broadcast message to conversation room
      io.to(`conversation_${conversationId}`).emit('new_message', message);

      // Update conversation last message
      await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          last_message_content: content
        })
        .eq('id', conversationId);

    } catch (error) {
      console.error('Message send error:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (conversationId) => {
    socket.to(`conversation_${conversationId}`).emit('user_typing', {
      userId: socket.userId,
      isTyping: true
    });
  });

  socket.on('typing_stop', (conversationId) => {
    socket.to(`conversation_${conversationId}`).emit('user_typing', {
      userId: socket.userId,
      isTyping: false
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
    activeConnections.delete(socket.userId);
  });
});

// Validation schemas
const createConversationSchema = Joi.object({
  participantId: Joi.number().required(),
  bookingId: Joi.number().optional()
});

const sendMessageSchema = Joi.object({
  conversationId: Joi.number().required(),
  content: Joi.string().max(1000).required(),
  messageType: Joi.string().valid('text', 'image', 'file', 'document').default('text')
});

// Routes
app.post('/conversations', verifyToken, async (req, res) => {
  try {
    const { error, value } = createConversationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { participantId, bookingId } = value;

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .or(`participant1_id.eq.${req.user.userId},participant1_id.eq.${participantId}`)
      .or(`participant2_id.eq.${req.user.userId},participant2_id.eq.${participantId}`)
      .single();

    if (existingConversation) {
      return res.json({ conversation: existingConversation });
    }

    // Create new conversation
    const { data: conversation, error: insertError } = await supabase
      .from('conversations')
      .insert({
        participant1_id: req.user.userId,
        participant2_id: participantId,
        booking_id: bookingId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    res.status(201).json({
      message: 'Conversation created successfully',
      conversation
    });
  } catch (error) {
    console.error('Conversation creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/conversations', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant1:participant1_id (
          first_name,
          last_name,
          user_type
        ),
        participant2:participant2_id (
          first_name,
          last_name,
          user_type
        )
      `)
      .or(`participant1_id.eq.${req.user.userId},participant2_id.eq.${req.user.userId}`)
      .order('last_message_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    res.json({ conversations });
  } catch (error) {
    console.error('Conversations fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/conversations/:id/messages', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant in conversation
    const { data: conversation } = await supabase
      .from('conversations')
      .select('participant1_id, participant2_id')
      .eq('id', id)
      .single();

    if (!conversation || 
        (conversation.participant1_id !== req.user.userId && 
         conversation.participant2_id !== req.user.userId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const offset = (page - 1) * limit;

    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          first_name,
          last_name,
          user_type
        )
      `)
      .eq('conversation_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Messages fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/conversations/:id/messages', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = sendMessageSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verify user is participant in conversation
    const { data: conversation } = await supabase
      .from('conversations')
      .select('participant1_id, participant2_id')
      .eq('id', id)
      .single();

    if (!conversation || 
        (conversation.participant1_id !== req.user.userId && 
         conversation.participant2_id !== req.user.userId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { data: message, error: insertError } = await supabase
      .from('messages')
      .insert({
        conversation_id: id,
        sender_id: req.user.userId,
        content: value.content,
        message_type: value.messageType,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        sender:sender_id (
          first_name,
          last_name,
          user_type
        )
      `)
      .single();

    if (insertError) {
      throw insertError;
    }

    // Update conversation last message
    await supabase
      .from('conversations')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_content: value.content
      })
      .eq('id', id);

    res.status(201).json({
      message: 'Message sent successfully',
      message: message
    });
  } catch (error) {
    console.error('Message send error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/conversations/:id/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { messageType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Verify user is participant in conversation
    const { data: conversation } = await supabase
      .from('conversations')
      .select('participant1_id, participant2_id')
      .eq('id', id)
      .single();

    if (!conversation || 
        (conversation.participant1_id !== req.user.userId && 
         conversation.participant2_id !== req.user.userId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Upload file to Supabase Storage
    const fileName = `messages/${id}/${Date.now()}_${req.file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('message-files')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype
      });

    if (uploadError) {
      throw uploadError;
    }

    // Save message with file reference
    const { data: message, error: insertError } = await supabase
      .from('messages')
      .insert({
        conversation_id: id,
        sender_id: req.user.userId,
        content: uploadData.path,
        message_type: messageType || 'file',
        file_name: req.file.originalname,
        file_size: req.file.size,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        sender:sender_id (
          first_name,
          last_name,
          user_type
        )
      `)
      .single();

    if (insertError) {
      throw insertError;
    }

    res.status(201).json({
      message: 'File uploaded successfully',
      message: message
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/conversations/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Mark messages as read
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', id)
      .neq('sender_id', req.user.userId)
      .is('read_at', null);

    if (error) {
      throw error;
    }

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// RabbitMQ Consumer Function
async function consumeMessages() {
  if (!channel) return;
  
  await channel.consume(MESSAGE_QUEUE, async (msg) => {
    if (msg) {
      try {
        const messageData = JSON.parse(msg.content.toString());
        console.log('Processing message:', messageData);
        
        // Store message in database
        const { data: message } = await supabase
          .from('messages')
          .insert({
            conversation_id: messageData.conversationId,
            sender_id: messageData.senderId,
            content: messageData.content,
            message_type: messageData.type || 'text',
            attachments: messageData.attachments || null,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (message) {
          // Emit to Socket.io clients
          io.to(`conversation_${messageData.conversationId}`).emit('new_message', message);
          
          // Send to chat queue for real-time processing
          await channel.sendToQueue(CHAT_QUEUE, Buffer.from(JSON.stringify(message)));
        }
        
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg, false, false);
      }
    }
  });
}

// Publish message to RabbitMQ
async function publishMessage(messageData) {
  if (channel) {
    await channel.sendToQueue(MESSAGE_QUEUE, Buffer.from(JSON.stringify(messageData)), {
      persistent: true
    });
  } else {
    // Fallback to direct processing
    await processMessageDirectly(messageData);
  }
}

async function processMessageDirectly(messageData) {
  try {
    // Store message in database
    const { data: message } = await supabase
      .from('messages')
      .insert({
        conversation_id: messageData.conversationId,
        sender_id: messageData.senderId,
        content: messageData.content,
        message_type: messageData.type || 'text',
        attachments: messageData.attachments || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (message) {
      // Emit to Socket.io clients
      io.to(`conversation_${messageData.conversationId}`).emit('new_message', message);
    }
  } catch (error) {
    console.error('Direct message processing failed:', error);
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'messaging',
    rabbitmq: connection ? 'connected' : 'disconnected'
  });
});

// Initialize RabbitMQ and start server
initRabbitMQ().then(() => {
  server.listen(PORT, () => {
    console.log(`Messaging service running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize:', error);
  server.listen(PORT, () => {
    console.log(`Messaging service running on port ${PORT} (without RabbitMQ)`);
  });
});
