// app.js - Express application setup

const express = require('express');
const cors = require('cors');
const bugRoutes = require('./routes/bugRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const asyncHandler = require('./middleware/asyncHandler');

const app = express();

// CORS middleware - Allow requests from React frontend
// In development, allow all origins for easier debugging
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, only allow specific frontend URL
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DEBUG: Request logging middleware
app.use((req, res, next) => {
  console.log('=== DEBUG: Incoming Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Path:', req.path);
  console.log('Original URL:', req.originalUrl);
  console.log('Params:', req.params);
  console.log('Query:', req.query);
  console.log('==============================');
  next();
});

// DEBUG: Log route mounting
console.log('=== DEBUG: App Route Mounting ===');
console.log('Mounting bugRoutes at /api/bugs');
console.log('=================================');

// Routes
app.use('/api/bugs', bugRoutes);

// DEBUG: Log all registered routes
console.log('=== DEBUG: All Registered Routes ===');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    console.log('Router mounted at:', middleware.regexp);
  }
});
console.log('===================================');

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test route for unhandled promise rejection (development only)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/test/unhandled-rejection', asyncHandler(async (req, res) => {
    // This will be caught by asyncHandler
    throw new Error('Test unhandled rejection (caught by asyncHandler)');
  }));

  app.get('/api/test/unhandled-rejection-raw', (req, res) => {
    // This will cause unhandled promise rejection
    Promise.reject(new Error('Test unhandled promise rejection'));
    res.json({ message: 'This will cause an unhandled rejection' });
  });
}

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

