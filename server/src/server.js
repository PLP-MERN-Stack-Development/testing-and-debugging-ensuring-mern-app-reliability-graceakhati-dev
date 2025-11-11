// server.js - Server entry point

const app = require('./app');
const connectDB = require('./config/database');
const errorLogger = require('./utils/errorLogger');

const PORT = process.env.PORT || 5000;

// Start server and connect to database
const startServer = async () => {
  try {
    // Connect to database (non-blocking)
    await connectDB();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`✅ Health check available at http://localhost:${PORT}/api/health`);
      console.log(`✅ API endpoints available at http://localhost:${PORT}/api/bugs`);
    });

    // Set up error handlers with server reference
    setupErrorHandlers(server);
    
    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Set up error handlers
const setupErrorHandlers = (server) => {
  // Enhanced unhandled promise rejection handler
  process.on('unhandledRejection', (err, promise) => {
    // Log the error with full context
    errorLogger.logUnhandledRejection(err, promise);
    
    // In production, close server gracefully
    if (process.env.NODE_ENV === 'production') {
      console.error('Unhandled Promise Rejection. Shutting down gracefully...');
      server.close(() => {
        console.error('Server closed due to unhandled promise rejection');
        process.exit(1);
      });
    } else {
      // In development, log but don't exit
      console.error('Unhandled Promise Rejection (development mode):', err);
    }
  });

  // Enhanced uncaught exception handler
  process.on('uncaughtException', (err) => {
    // Log the error
    errorLogger.logUncaughtException(err);
    
    // Uncaught exceptions are more serious - always exit
    console.error('Uncaught Exception. Shutting down...');
    server.close(() => {
      console.error('Server closed due to uncaught exception');
      process.exit(1);
    });
  });

  // Handle SIGTERM (graceful shutdown)
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });
};

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

