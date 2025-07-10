const fetch = require('node-fetch');

const RAILWAY_URL = 'https://vision-fyp-management-system-main-production.up.railway.app';

async function testRailway() {
  console.log('🚂 Testing Railway deployment status...\n');
  
  try {
    // Test root endpoint
    console.log('🔍 Testing root endpoint...');
    const rootResponse = await fetch(RAILWAY_URL, {
      timeout: 10000
    });
    
    console.log('Root response status:', rootResponse.status);
    const rootText = await rootResponse.text();
    console.log('Root response:', rootText.substring(0, 200));
    
    if (rootResponse.status === 200) {
      // Test login endpoint
      console.log('\n🔐 Testing login endpoint...');
      const loginResponse = await fetch(`${RAILWAY_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'green-admin',
          password: 'admin123'
        }),
        timeout: 15000
      });
      
      console.log('Login response status:', loginResponse.status);
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful!');
        console.log('User data:', loginData.user);
        console.log('Token received:', !!loginData.token);
      } else {
        const errorText = await loginResponse.text();
        console.log('❌ Login error:', errorText);
      }
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

testRailway();
