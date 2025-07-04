#!/usr/bin/env node

/**
 * AWS RDS Post-Creation Setup Script
 * Run this after your RDS instance is created to configure everything
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

async function setupAwsRds() {
  console.log('🛢️ AWS RDS MySQL Post-Creation Setup');
  console.log('====================================\n');
  
  console.log('This script will help you configure your environment after creating the RDS instance.\n');
  
  // Get RDS details
  console.log('📋 Please provide your RDS instance details:\n');
  
  const endpoint = await askQuestion('🔗 RDS Endpoint (from AWS console): ');
  const password = await askQuestion('🔐 Master password (that you created): ');
  
  // Validate inputs
  if (!endpoint || endpoint.includes('xxxxx')) {
    console.log('❌ Invalid endpoint. Please provide the actual RDS endpoint.');
    rl.close();
    return;
  }
  
  if (!password) {
    console.log('❌ Password is required.');
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
  
  // Create environment file
  const envContent = `# AWS RDS MySQL Configuration
NODE_ENV=production
DB_HOST=${endpoint}
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
      host: endpoint,
      port: 3306,
      user: 'admin',
      password: password,
      ssl: { require: true, rejectUnauthorized: false },
      connectTimeout: 10000
    });
    
    console.log('✅ Connection successful!');
    await connection.end();
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\n💡 This might be because:');
    console.log('   - Security group not configured yet');
    console.log('   - RDS still initializing');
    console.log('   - Network connectivity issues');
    console.log('\n🔧 Next steps:');
    console.log('   1. Configure RDS security group');
    console.log('   2. Run: node test-aws-connection.js');
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Configure RDS security group (allow port 3306)');
  console.log('2. Test connection: node test-aws-connection.js');
  console.log('3. Start your app: npm run dev');
  console.log('4. Deploy to production');
  
  console.log('\n📖 Security Group Configuration:');
  console.log('   - Go to EC2 → Security Groups');
  console.log('   - Find: vision-fyp-mysql-sg');
  console.log('   - Add inbound rule: MySQL/Aurora (3306) from 0.0.0.0/0');
  
  rl.close();
}

setupAwsRds().catch(console.error);
