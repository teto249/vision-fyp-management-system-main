const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./config/database");
const userRoutes = require("./routes/UserRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uniAdminRoutes = require("./routes/uniAdminRoutes");


dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors());

// Middleware for parsing requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 
// Connect to database
connectDB();

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uniAdmin", uniAdminRoutes);
// 404 Error handler
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404);
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});