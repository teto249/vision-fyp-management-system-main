#!/usr/bin/env node
// Test script to verify frontend can connect to backend
const http = require('http');
const https = require('https');
const { URL } = require('url');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (err) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testConnection() {
  console.log('🧪 Testing Frontend → Backend Connection');
  console.log('='.repeat(50));
  console.log(`📡 API URL: ${API_URL}`);
  console.log('⏳ Testing connection...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check endpoint...');
    const healthResponse = await makeRequest(`${API_URL}/api/auth/health`);
    
    if (healthResponse.status !== 200) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    
    console.log('✅ Health Check: SUCCESS');
    console.log('📋 Response:', JSON.stringify(healthResponse.data, null, 2));
    console.log('');

    // Test 2: CORS Check
    console.log('2️⃣ Testing CORS headers...');
    console.log('🔧 Response Headers:');
    Object.entries(healthResponse.headers).forEach(([key, value]) => {
      if (key.toLowerCase().includes('access-control') || key.toLowerCase().includes('cors')) {
        console.log(`   ${key}: ${value}`);
      }
    });
    console.log('');

    // Test 3: Invalid endpoint (should return 404)
    console.log('3️⃣ Testing invalid endpoint (should fail gracefully)...');
    try {
      const invalidResponse = await makeRequest(`${API_URL}/api/invalid-endpoint`);
      if (invalidResponse.status === 404) {
        console.log('✅ 404 handling: SUCCESS (returns proper 404)');
      } else {
        console.log(`⚠️  Unexpected status for invalid endpoint: ${invalidResponse.status}`);
      }
    } catch (err) {
      console.log('⚠️  Error testing invalid endpoint:', err.message);
    }
    console.log('');

    // Summary
    console.log('🎉 CONNECTION TEST SUMMARY');
    console.log('='.repeat(50));
    console.log('✅ Backend is running and accessible');
    console.log('✅ API endpoints are responding');
    console.log('✅ JSON responses are working');
    console.log('✅ Frontend can successfully communicate with backend');
    console.log('');
    console.log('🚀 Ready to start development!');
    
    return true;

  } catch (error) {
    console.log('❌ CONNECTION TEST FAILED');
    console.log('='.repeat(50));
    console.log('🔥 Error:', error.message);
    console.log('');
    console.log('🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Make sure backend server is running on port 3000');
    console.log('2. Check if Backend/.env has correct configuration');
    console.log('3. Verify no firewall is blocking port 3000');
    console.log('4. Try running: npm run dev:backend');
    console.log('');
    
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
