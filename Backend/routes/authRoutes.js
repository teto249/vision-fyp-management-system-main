const express = require("express");
const { 
  login, 
  initiatePasswordReset, 
  resetPassword, 
  changePassword 
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

// Health check route for testing
router.get("/health", (req, res) => {
  res.json({ 
    status: "success", 
    message: "Backend server is running!", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug endpoint to test request body parsing
router.post("/test", (req, res) => {
  console.log("📥 TEST - Raw request body:", req.body);
  console.log("📥 TEST - Request body keys:", Object.keys(req.body));
  console.log("📥 TEST - Content-Type:", req.headers['content-type']);
  console.log("📥 TEST - Raw headers:", req.headers);
  
  res.json({
    message: "Test endpoint received data",
    receivedBody: req.body,
    bodyKeys: Object.keys(req.body),
    contentType: req.headers['content-type'],
    bodyString: JSON.stringify(req.body)
  });
});

// Login route
router.post("/login", login);

// Password Reset routes
router.post("/forgot-password", initiatePasswordReset);
router.post("/reset-password", resetPassword);
router.post("/change-password", authenticateToken, changePassword);

module.exports = router;
