const https = require('https');

function checkRailwayHealth() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'vision-fyp-management-system-main-production.up.railway.app',
      path: '/health',
      method: 'GET',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function waitForRailway() {
  let attempts = 0;
  const maxAttempts = 20; // Wait up to 10 minutes (30 seconds * 20)
  
  console.log('🔄 Waiting for Railway deployment to complete...');
  
  while (attempts < maxAttempts) {
    try {
      attempts++;
      console.log(`⏳ Attempt ${attempts}/${maxAttempts} - Checking Railway...`);
      
      const result = await checkRailwayHealth();
      
      if (result.status === 200) {
        console.log('✅ Railway backend is online and healthy!');
        console.log('📊 Response:', result.body);
        return true;
      } else {
        console.log(`⚠️  Railway responded with status ${result.status}`);
        console.log('📊 Response:', result.body);
      }
    } catch (error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('502')) {
        console.log(`⏳ Railway still deploying... (${error.message})`);
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    
    if (attempts < maxAttempts) {
      console.log('💤 Waiting 30 seconds before next check...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  console.log('❌ Railway deployment timeout - please check manually');
  return false;
}

waitForRailway();
