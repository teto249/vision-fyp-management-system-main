#!/usr/bin/env node

/**
 * AWS RDS MySQL Connection Test Script
 * Run this after setting up your RDS instance to verify connection
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testAwsMysqlConnection() {
  console.log('🧪 Testing AWS RDS MySQL Connection...\n');
  
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
    console.log('💡 Make sure to update your .env file with AWS RDS details');
    console.log('💡 Copy .env.aws-mysql to .env and fill in your values');
    process.exit(1);
  }

  if (process.env.DB_HOST.includes('xxxxx')) {
    console.error('❌ DB_HOST still contains placeholder values!');
    console.log('💡 Update DB_HOST with your actual RDS endpoint');
    process.exit(1);
  }

  try {
    console.log('🔌 Attempting connection to AWS RDS MySQL...');
    
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

    console.log('✅ Successfully connected to AWS RDS MySQL!');

    // Test creating database
    console.log('🔧 Creating database if not exists...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log('✅ Database created/verified');

    // Test selecting the database
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);
    console.log('✅ Database selected successfully');

    // Get server info
    const [rows] = await connection.query('SELECT VERSION() as version, @@hostname as hostname');
    console.log(`✅ MySQL Version: ${rows[0].version}`);
    console.log(`✅ RDS Hostname: ${rows[0].hostname}`);

    // Test creating a simple table
    console.log('🧪 Testing table creation...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS connection_test (
        id INT AUTO_INCREMENT PRIMARY KEY,
        test_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        message VARCHAR(100)
      )
    `);
    
    await connection.query(`
      INSERT INTO connection_test (message) VALUES ('AWS RDS Connection Test')
    `);
    
    const [testRows] = await connection.query('SELECT * FROM connection_test ORDER BY id DESC LIMIT 1');
    console.log(`✅ Test table created and data inserted: ${testRows[0].message}`);
    
    // Clean up test table
    await connection.query('DROP TABLE connection_test');
    console.log('✅ Test table cleaned up');

    await connection.end();
    console.log('\n🎉 AWS RDS MySQL connection test PASSED!');
    console.log('💡 Your database is ready for production deployment');

  } catch (error) {
    console.error('\n❌ AWS RDS MySQL connection test FAILED!');
    console.error('📍 Error details:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Troubleshooting DNS/Host issues:');
      console.log('   - Check if DB_HOST endpoint is correct');
      console.log('   - Verify the RDS instance is in "Available" status');
      console.log('   - Ensure the RDS instance exists in the correct region');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting authentication:');
      console.log('   - Verify DB_USER and DB_PASSWORD are correct');
      console.log('   - Check RDS master username/password');
      console.log('   - Ensure user has proper permissions');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting network/security:');
      console.log('   - Check RDS security group allows port 3306');
      console.log('   - Verify RDS has "Public accessibility" enabled');
      console.log('   - Check VPC and subnet group configuration');
      console.log('   - Ensure your IP is allowed in security group');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database name issue:');
      console.log('   - Database name might not exist yet');
      console.log('   - This is normal for fresh RDS instances');
      console.log('   - The app will create it automatically');
    }
    
    console.log('\n🔧 Quick fixes to try:');
    console.log('1. Check RDS instance status in AWS console');
    console.log('2. Verify security group inbound rules');
    console.log('3. Test from EC2 instance in same VPC');
    console.log('4. Check AWS CloudTrail for access logs');
    
    process.exit(1);
  }
}

console.log('🛢️ AWS RDS MySQL Connection Tester');
console.log('=====================================\n');
testAwsMysqlConnection();
