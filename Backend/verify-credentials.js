#!/usr/bin/env node

/**
 * RDS Credential Verification Helper
 * Helps verify your RDS credentials are correct
 */

const readline = require('readline');
const mysql = require('mysql2/promise');

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



async function verifyCredentials() {
  console.log('🔍 AWS RDS Credential Verification');
  console.log('=================================\n');
  
  console.log('Current endpoint: vision-fyp-mysql.cfagqgew27bl.ap-southeast-2.rds.amazonaws.com\n');
  
  console.log('Let\'s verify your credentials step by step:\n');
  
  // Get master username
  const username = await askQuestion('👤 What master username did you set during RDS creation? (usually "admin" or "root"): ');
  
  // Get master password  
  const password = await askQuestion('🔐 What master password did you set during RDS creation? ');
  
  if (!username || !password) {
    console.log('❌ Both username and password are required.');
    rl.close();
    return;
  }

  console.log('\n🧪 Testing connection with these credentials...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'vision-fyp-mysql.cfagqgew27bl.ap-southeast-2.rds.amazonaws.com',
      port: 3306,
      user: username.trim(),
      password: password,
      ssl: { require: true, rejectUnauthorized: false },
      connectTimeout: 15000
    });
    
    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log(`✅ Username "${username}" and password are correct!`);
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Database query test passed!');
    
    await connection.end();
    
    console.log('\n🎉 Great! Your credentials work. Updating .env file...');
    
    // Update .env file with correct credentials
    const fs = require('fs');
    const path = require('path');
    
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update username and password
    envContent = envContent.replace(/DB_USER=.*/, `DB_USER=${username}`);
    envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${password}`);
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ .env file updated with correct credentials!');
    console.log('\n🚀 You can now run: npm run dev');
    
  } catch (error) {
    console.log('❌ Connection still failed:');
    console.log(`   Error: ${error.message}`);
    
    if (error.message.includes('Access denied')) {
      console.log('\n💡 The username or password might still be incorrect.');
      console.log('💡 Double-check what you entered during RDS setup.');
      console.log('💡 You can reset the master password in AWS RDS console if needed.');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 DNS resolution failed. Check the endpoint in AWS console.');
    } else {
      console.log('\n💡 Unexpected error. Check AWS RDS console for instance status.');
    }
  }
  
  rl.close();
}

verifyCredentials().catch(console.error);
