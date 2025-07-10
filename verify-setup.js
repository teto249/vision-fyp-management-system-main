const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🧪 Vision FYP Management System - Local Setup Verification');
console.log('=========================================================\n');

// Check if required files exist
const requiredFiles = [
  'Backend/.env',
  'Backend/package.json',
  'Backend/app.js',
  'Frontend/.env.local',
  'Frontend/package.json',
  'Frontend/src/app/page.jsx'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check your project structure.');
  process.exit(1);
}

console.log('\n✅ All required files found!\n');

// Test backend health
async function testBackend() {
  console.log('🔧 Testing Backend Connection...');
  try {
    const response = await axios.get('http://localhost:3000/api/health', {
      timeout: 5000
    });
    
    if (response.status === 200) {
      console.log('✅ Backend is running and healthy');
      console.log(`   Response: ${JSON.stringify(response.data)}`);
      return true;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not running');
      console.log('   Please start the backend with: cd Backend && npm run dev');
    } else {
      console.log(`❌ Backend error: ${error.message}`);
    }
    return false;
  }
}

// Test frontend
async function testFrontend() {
  console.log('🎨 Testing Frontend Connection...');
  try {
    const response = await axios.get('http://localhost:3001', {
      timeout: 5000
    });
    
    if (response.status === 200) {
      console.log('✅ Frontend is running and accessible');
      return true;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Frontend is not running');
      console.log('   Please start the frontend with: cd Frontend && npm run dev');
    } else {
      console.log(`❌ Frontend error: ${error.message}`);
    }
    return false;
  }
}

// Check environment configuration
function checkEnvironment() {
  console.log('🔐 Checking Environment Configuration...');
  
  // Check backend .env
  const backendEnv = path.join(__dirname, 'Backend/.env');
  if (fs.existsSync(backendEnv)) {
    const envContent = fs.readFileSync(backendEnv, 'utf8');
    if (envContent.includes('DB_HOST=vision-fyp-mysql')) {
      console.log('✅ Backend database configuration found');
    } else {
      console.log('❌ Backend database configuration incomplete');
    }
    
    if (envContent.includes('FRONTEND_URL=http://localhost:3001')) {
      console.log('✅ Backend configured for local frontend');
    } else {
      console.log('⚠️  Backend may not be configured for local frontend');
    }
  }
  
  // Check frontend .env.local
  const frontendEnv = path.join(__dirname, 'Frontend/.env.local');
  if (fs.existsSync(frontendEnv)) {
    const envContent = fs.readFileSync(frontendEnv, 'utf8');
    if (envContent.includes('NEXT_PUBLIC_API_URL=http://localhost:3000')) {
      console.log('✅ Frontend configured for local backend');
    } else {
      console.log('⚠️  Frontend may not be configured for local backend');
    }
  }
}

// Main verification function
async function runVerification() {
  checkEnvironment();
  console.log('');
  
  const backendRunning = await testBackend();
  const frontendRunning = await testFrontend();
  
  console.log('\n📊 Verification Summary:');
  console.log('========================');
  console.log(`Files: ✅ All required files present`);
  console.log(`Backend: ${backendRunning ? '✅ Running' : '❌ Not running'}`);
  console.log(`Frontend: ${frontendRunning ? '✅ Running' : '❌ Not running'}`);
  
  if (backendRunning && frontendRunning) {
    console.log('\n🎉 LOCAL SETUP VERIFICATION PASSED!');
    console.log('\n📋 You can now:');
    console.log('   1. Visit: http://localhost:3001');
    console.log('   2. Login with: green-admin / admin123');
    console.log('   3. Start developing!');
  } else {
    console.log('\n⚠️  Please start the missing services:');
    if (!backendRunning) console.log('   Backend:  cd Backend && npm run dev');
    if (!frontendRunning) console.log('   Frontend: cd Frontend && npm run dev');
    console.log('\n   Or use: npm run dev (from project root)');
  }
}

// Run the verification
runVerification().catch(error => {
  console.error('Verification failed:', error.message);
  process.exit(1);
});
