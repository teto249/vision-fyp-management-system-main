// Simple test to check if the auth route is working at all
const express = require('express');
const app = express();

app.use(express.json());

// Test route
app.post('/test-login', (req, res) => {
  console.log('📝 Test login route hit');
  console.log('📋 Request body:', req.body);
  
  res.json({
    message: 'Test route working',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on port ${PORT}`);
});

module.exports = app;
