const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Load environment variables first
dotenv.config();

// Enhanced startup debugging
console.log('🚀 Starting Vision FYP Backend Server...');
console.log('📅 Timestamp:', new Date().toISOString());
console.log('🔧 Node.js version:', process.version);
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
console.log('📁 Working directory:', __dirname);

// Test database connection loading
console.log('📊 Loading database configuration...');
try {
  const { connectDB } = require("./config/database");
  console.log('✅ Database config loaded successfully');
} catch (dbErr) {
  console.error('❌ Failed to load database config:', dbErr.message);
  process.exit(1);
}

// Load routes with detailed error handling
console.log('📁 Loading routes and controllers...');

let authRoutes, adminRoutes, uniAdminRoutes, studentRoutes, supervisorRoutes, userRoutes;

try {
  console.log('   Loading authRoutes...');
  authRoutes = require("./routes/authRoutes");
  console.log('   ✅ authRoutes loaded');
} catch (err) {
  console.error('   ❌ Failed to load authRoutes:', err.message);
  process.exit(1);
}

try {
  console.log('   Loading adminRoutes...');
  adminRoutes = require("./routes/adminRoutes");
  console.log('   ✅ adminRoutes loaded');
} catch (err) {
  console.error('   ❌ Failed to load adminRoutes:', err.message);
  process.exit(1);
}

try {
  console.log('   Loading uniAdminRoutes...');
  uniAdminRoutes = require("./routes/uniAdminRoutes");
  console.log('   ✅ uniAdminRoutes loaded');
} catch (err) {
  console.error('   ❌ Failed to load uniAdminRoutes:', err.message);
  process.exit(1);
}

try {
  console.log('   Loading studentRoutes...');
  studentRoutes = require("./routes/studentRoutes");
  console.log('   ✅ studentRoutes loaded');
} catch (err) {
  console.error('   ❌ Failed to load studentRoutes:', err.message);
  process.exit(1);
}

try {
  console.log('   Loading supervisorRoutes...');
  supervisorRoutes = require("./routes/supervisorRoutes");
  console.log('   ✅ supervisorRoutes loaded');
} catch (err) {
  console.error('   ❌ Failed to load supervisorRoutes:', err.message);
  process.exit(1);
}

try {
  console.log('   Loading userRoutes...');
  userRoutes = require("./routes/UserRoutes");
  console.log('   ✅ userRoutes loaded');
} catch (err) {
  console.error('   ❌ Failed to load userRoutes:', err.message);
  console.error('   📍 Stack:', err.stack);
  
  // Check if the file exists
  const userRoutesPath = path.join(__dirname, 'routes', 'userRoutes.js');
  if (fs.existsSync(userRoutesPath)) {
    console.log('   📄 userRoutes.js file exists at:', userRoutesPath);
  } else {
    console.error('   ❌ userRoutes.js file NOT found at:', userRoutesPath);
    
    // List all files in routes directory
    try {
      const routeFiles = fs.readdirSync(path.join(__dirname, 'routes'));
      console.log('   📁 Available route files:');
      routeFiles.forEach(file => console.log(`      - ${file}`));
    } catch (dirErr) {
      console.error('   ❌ Error reading routes directory:', dirErr.message);
    }
  }
  process.exit(1);
}

// Re-import database connection after routes are loaded
const { connectDB } = require("./config/database");

// Basic error handling for startup
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  console.error('📍 Stack trace:', err.stack);
  
  // Check if it's a module not found error
  if (err.code === 'MODULE_NOT_FOUND') {
    console.error('🔍 Module resolution issue detected:');
    console.error('   - Check if all controller files exist');
    console.error('   - Verify file names match exactly (case-sensitive)');
    console.error('   - Ensure all exports are properly defined');
    
    // List all files in routes and controllers directories
    const path = require('path');
    const fs = require('fs');
    
    try {
      console.log('📁 Files in routes directory:');
      const routeFiles = fs.readdirSync(path.join(__dirname, 'routes'));
      routeFiles.forEach(file => console.log(`   - ${file}`));
      
      console.log('📁 Files in controllers directory:');
      const controllerFiles = fs.readdirSync(path.join(__dirname, 'controllers'));
      controllerFiles.forEach(file => console.log(`   - ${file}`));
    } catch (dirErr) {
      console.error('❌ Error reading directories:', dirErr.message);
    }
  }
  
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});


const app = express();

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body keys:', Object.keys(req.body || {}));
  }
  next();
});

// Enhanced CORS configuration for debugging
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001", 
  "http://localhost:5173",
  "https://vision-fyp-management-system-main.vercel.app"
].filter(Boolean);

// Add any Vercel preview URLs
if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push(/https:\/\/.*\.vercel\.app$/);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') return allowed === origin;
        if (allowed instanceof RegExp) return allowed.test(origin);
        return false;
      })) {
        return callback(null, true);
      }
      
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
  })
);

// Configure body parser with increased limits for file uploads
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configure static file serving for different upload types
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/documents",
  express.static(path.join(__dirname, "uploads", "documents"))
);

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, "uploads", "documents"),
    path.join(__dirname, "uploads", "profiles"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Create upload directories on startup
createUploadDirs();

// Connect to database with error handling
const connectToDatabase = async () => {
  try {
    console.log('📊 Connecting to database...');
    await connectDB();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('💡 Make sure MySQL/XAMPP is running and database exists');
    console.error('💡 Check your .env file for correct database credentials');
    
    // In development, continue without database
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Running in development mode without database connection');
      return false;
    } else {
      console.error('💥 Cannot start server without database connection in production');
      process.exit(1);
    }
  }
};

// Initialize database connection
connectToDatabase();

// API Routes
console.log('🛣️  Setting up API routes...');

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uniAdmin", uniAdminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/users", userRoutes);

console.log('✅ All API routes configured successfully');

// Log all registered routes for debugging
try {
  console.log('📍 Registered routes:');
  if (app._router && app._router.stack) {
    app._router.stack.forEach((middleware, index) => {
      if (middleware.route) {
        console.log(`   - ${middleware.route.path} (${Object.keys(middleware.route.methods).join(', ').toUpperCase()})`);
      } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
        console.log(`   - Router middleware #${index + 1}`);
        middleware.handle.stack.forEach((handler, handlerIndex) => {
          if (handler.route) {
            console.log(`     - ${handler.route.path} (${Object.keys(handler.route.methods).join(', ').toUpperCase()})`);
          }
        });
      }
    });
  }
} catch (routeErr) {
  console.error('❌ Error logging routes:', routeErr.message);
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uploadDirs: {
      documents: fs.existsSync(path.join(__dirname, "uploads", "documents")),
      profiles: fs.existsSync(path.join(__dirname, "uploads", "profiles")),
    },
  });
});

// Handle favicon requests
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// 404 Error handler
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
});

// Enhanced error handler for file operations
app.use((err, req, res, next) => {

  // Handle file-related errors
  if (err.code === "ENOENT") {
    return res.status(404).json({
      status: "error",
      message: "File not found",
    });
  }

  if (err.code === "ETIMEDOUT") {
    return res.status(408).json({
      status: "error",
      message: "File upload timed out",
    });
  }

  const statusCode =
    err.status || res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err.details || undefined,
    }),
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running successfully on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('🎯 Backend startup completed successfully!');
  console.log('═══════════════════════════════════════════════════════════');
});

// Graceful shutdown with file cleanup
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  
  // Close server
  server.close(() => {
    console.log("Server closed");
    
    // Cleanup temp files if needed
    const tempDir = path.join(__dirname, "uploads", "temp");
    if (fs.existsSync(tempDir)) {
      fs.rmdir(tempDir, { recursive: true }, (err) => {
        if (err) {
          console.error("Error cleaning up temp files:", err.message);
        }
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});

module.exports = app;

