#!/usr/bin/env node

/**
 * Quick Setup Script for Your AWS RDS MySQL Instance
 * This uses the details from your RDS instance
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function quickSetup() {
  console.log('🎉 AWS RDS MySQL Quick Setup');
  console.log('============================\n');
  
  console.log('Your RDS instance details:');
  console.log('📍 Endpoint: vision-fyp-mysql.cfagqgew27bl.ap-southeast-2.rds.amazonaws.com');
  console.log('🚪 Port: 3306');
  console.log('👤 Username: admin');
  console.log('🌏 Region: ap-southeast-2 (Sydney)\n');
  
  // Get master password
  const password = await askQuestion('🔐 Enter your master password (created during RDS setup): ');
  
  if (!password) {
    console.log('❌ Password is required to continue.');
    rl.close();
    return;
  }
  
  // Generate JWT secret
  const generateJwtSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  const jwtSecret = generateJwtSecret();
  
  // Create environment file with your specific endpoint
  const envContent = `# AWS RDS MySQL Configuration
NODE_ENV=production
DB_HOST=vision-fyp-mysql.cfagqgew27bl.ap-southeast-2.rds.amazonaws.com
DB_NAME=vision_fyp_management_system
DB_USER=admin
DB_PASSWORD=${password}
DB_PORT=3306
DB_SSL=true

# Security
JWT_SECRET=${jwtSecret}
PORT=3000

# Frontend URL (update when you deploy)
FRONTEND_URL=https://your-vision-fyp-app.vercel.app

# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
`;

  // Write environment file
  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Environment file created successfully!');
  console.log(`📄 File: ${envPath}`);
  
  // Test connection
  console.log('\n🧪 Testing database connection...');
  
  try {
    require('dotenv').config();
    const mysql = require('mysql2/promise');
    
    const connection = await mysql.createConnection({
      host: 'vision-fyp-mysql.cfagqgew27bl.ap-southeast-2.rds.amazonaws.com',
      port: 3306,
      user: 'admin',
      password: password,
      ssl: { require: true, rejectUnauthorized: false },
      connectTimeout: 15000
    });
    
    console.log('✅ Connection successful!');
    console.log('✅ Your AWS RDS MySQL is ready to use!');
    
    // Create database
    await connection.query('CREATE DATABASE IF NOT EXISTS `vision_fyp_management_system`');
    console.log('✅ Database created/verified');
    
    await connection.end();
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Start your app: npm run dev');
    console.log('2. Test your app locally');
    console.log('3. Deploy to production');
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Password might be incorrect. Please check your master password.');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 Connection timeout. This might be because:');
      console.log('   - RDS instance is still initializing');
      console.log('   - Security group needs configuration');
      console.log('   - Network connectivity issues');
    }
    
    console.log('\n🔧 You can still try:');
    console.log('   - Wait a few more minutes for RDS to be fully ready');
    console.log('   - Run: node test-aws-connection.js');
    console.log('   - Check AWS RDS console for instance status');
  }
  
  rl.close();
}

quickSetup().catch(console.error);
