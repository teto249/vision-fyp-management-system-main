const https = require('https');

function testLogin() {
  const postData = JSON.stringify({
    username: 'green-admin',
    password: 'admin123'
  });

  const options = {
    hostname: 'vision-fyp-management-system-main-production.up.railway.app',
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 10000
  };

  console.log('🧪 Testing Railway login with native HTTPS...');
  console.log('📋 Request URL:', `https://${options.hostname}${options.path}`);
  console.log('📋 Request Body:', postData);

  const req = https.request(options, (res) => {
    console.log('📊 Response Status:', res.statusCode);
    console.log('📊 Response Headers:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('📊 Response Body:', data);
      
      if (res.statusCode === 200) {
        console.log('✅ Login test successful!');
      } else {
        console.log('❌ Login test failed');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
  });

  req.on('timeout', () => {
    console.log('⏰ Request timeout');
    req.destroy();
  });

  req.write(postData);
  req.end();
}

testLogin();
