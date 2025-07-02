const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { connectDB } = require("./config/database");
const userRoutes = require("./routes/UserRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uniAdminRoutes = require("./routes/uniAdminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const supervisorRoutes = require("./routes/supervisorRoutes");
dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
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

// Connect to database
connectDB();

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uniAdmin", uniAdminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/supervisor", supervisorRoutes);

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
  console.error("Error:", err);

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

// Graceful shutdown with file cleanup
process.on("SIGTERM", () => {

  // Close server
  server.close(() => {

    // Cleanup temp files if needed
    const tempDir = path.join(__dirname, "uploads", "temp");
    if (fs.existsSync(tempDir)) {
      fs.rmdir(tempDir, { recursive: true }, (err) => {
        if (err) {
          // Cleanup error
        }
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  // Server running
});

module.exports = app;

