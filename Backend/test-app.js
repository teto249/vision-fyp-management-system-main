const express = require('express');
const cors = require('cors');

console.log('🚀 Testing basic Express server...');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Basic server working!' });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log('🎯 Basic server test completed successfully!');
  
  // Exit after 2 seconds for testing
  setTimeout(() => {
    console.log('🏁 Test completed, shutting down...');
    server.close();
    process.exit(0);
  }, 2000);
});
