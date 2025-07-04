#!/usr/bin/env node

/**
 * AWS Aurora Connection Test Script
 * Run this after setting up your Aurora database to verify connection
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testAuroraConnection() {
  console.log('🧪 Testing AWS Aurora Database Connection...\n');
  
  // Check environment variables
  console.log('📋 Configuration Check:');
  console.log(`   DB_HOST: ${process.env.DB_HOST || 'NOT SET'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || 'NOT SET'}`);
  console.log(`   DB_USER: ${process.env.DB_USER || 'NOT SET'}`);
  console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***SET***' : 'NOT SET'}`);
  console.log(`   DB_SSL: ${process.env.DB_SSL || 'false'}`);
  console.log('');

  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.error('❌ Missing required environment variables!');
    console.log('💡 Make sure to set DB_HOST, DB_USER, and DB_PASSWORD in your .env file');
    process.exit(1);
  }

  try {
    console.log('🔌 Attempting connection to Aurora...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false,
      connectTimeout: 10000
    });

    console.log('✅ Successfully connected to Aurora!');

    // Test creating database
    console.log('🔧 Creating database if not exists...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log('✅ Database created/verified');

    // Test selecting the database
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);
    console.log('✅ Database selected successfully');

    // Get server info
    const [rows] = await connection.query('SELECT VERSION() as version');
    console.log(`✅ Aurora MySQL Version: ${rows[0].version}`);

    await connection.end();
    console.log('\n🎉 Aurora connection test PASSED!');
    console.log('💡 Your database is ready for deployment');

  } catch (error) {
    console.error('\n❌ Aurora connection test FAILED!');
    console.error('📍 Error details:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check if DB_HOST is correct');
      console.log('   - Verify the Aurora cluster is running');
      console.log('   - Ensure the endpoint is publicly accessible');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Verify DB_USER and DB_PASSWORD are correct');
      console.log('   - Check Aurora cluster master credentials');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check security group allows port 3306');
      console.log('   - Verify Aurora has public access enabled');
      console.log('   - Check VPC and subnet configuration');
    }
    
    process.exit(1);
  }
}

testAuroraConnection();
