const https = require('https');

function testAuthRoute() {
  console.log('🧪 Testing Railway auth route configuration...');
  
  // Test 1: Check if auth route exists
  console.log('\n📍 Test 1: Testing auth route base');
  const options1 = {
    hostname: 'vision-fyp-management-system-main-production.up.railway.app',
    path: '/api/auth',
    method: 'GET',
    timeout: 10000
  };

  const req1 = https.request(options1, (res) => {
    console.log('📊 Auth route status:', res.statusCode);
    console.log('📊 Response headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📊 Response body:', data);
      testLoginRoute(); // Test login route next
    });
  });

  req1.on('error', (error) => {
    console.error('❌ Auth route error:', error.message);
    testLoginRoute(); // Still test login route
  });

  req1.on('timeout', () => {
    console.log('⏰ Auth route timeout');
    req1.destroy();
    testLoginRoute(); // Still test login route
  });

  req1.end();
}

function testLoginRoute() {
  console.log('\n📍 Test 2: Testing login route with OPTIONS (CORS preflight)');
  
  const options2 = {
    hostname: 'vision-fyp-management-system-main-production.up.railway.app',
    path: '/api/auth/login',
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://vision-fyp-management-system-main.vercel.app',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    },
    timeout: 10000
  };

  const req2 = https.request(options2, (res) => {
    console.log('📊 Login OPTIONS status:', res.statusCode);
    console.log('📊 CORS headers:', {
      'access-control-allow-origin': res.headers['access-control-allow-origin'],
      'access-control-allow-methods': res.headers['access-control-allow-methods'],
      'access-control-allow-headers': res.headers['access-control-allow-headers']
    });
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📊 OPTIONS response:', data);
      testActualLogin(); // Test actual login
    });
  });

  req2.on('error', (error) => {
    console.error('❌ LOGIN OPTIONS error:', error.message);
    testActualLogin(); // Still test actual login
  });

  req2.on('timeout', () => {
    console.log('⏰ LOGIN OPTIONS timeout');
    req2.destroy();
    testActualLogin(); // Still test actual login
  });

  req2.end();
}

function testActualLogin() {
  console.log('\n📍 Test 3: Testing actual login POST');
  
  const postData = JSON.stringify({
    username: 'green-admin',
    password: 'admin123'
  });

  const options3 = {
    hostname: 'vision-fyp-management-system-main-production.up.railway.app',
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Origin': 'https://vision-fyp-management-system-main.vercel.app'
    },
    timeout: 15000
  };

  const req3 = https.request(options3, (res) => {
    console.log('📊 Login POST status:', res.statusCode);
    console.log('📊 Response headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📊 Login response:', data);
      
      if (res.statusCode === 200) {
        console.log('✅ Login test successful!');
      } else {
        console.log('❌ Login test failed');
      }
    });
  });

  req3.on('error', (error) => {
    console.error('❌ LOGIN POST error:', error.message);
  });

  req3.on('timeout', () => {
    console.log('⏰ LOGIN POST timeout');
    req3.destroy();
  });

  req3.write(postData);
  req3.end();
}

// Start the tests
testAuthRoute();
