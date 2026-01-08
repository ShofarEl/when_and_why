const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// CORS configuration
const corsOptions = {
  origin: [
    'https://when-and-why.vercel.app',
    'http://localhost:3000', // for development
    process.env.CLIENT_URL
  ].filter(Boolean), // Remove any undefined values
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// API Routes
app.use('/api/participants', require('./routes/participants'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/data', require('./routes/data'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI-Assisted Data Science Study API',
    status: 'running',
    frontend: 'https://when-and-why.vercel.app'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});