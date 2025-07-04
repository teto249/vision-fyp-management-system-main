const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🧪 Testing Railway backend login...');
    
    const response = await fetch('https://vision-fyp-management-system-main-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'green-admin',
        password: 'admin123'
      })
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log('📊 Response Body:', data);
    
    if (response.ok) {
      console.log('✅ Login test successful!');
    } else {
      console.log('❌ Login test failed');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testLogin();
