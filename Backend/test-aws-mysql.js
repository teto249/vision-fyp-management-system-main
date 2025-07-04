#!/usr/bin/env node

/**
 * AWS MySQL Connection Test Script
 * Run this after setting up your AWS MySQL RDS instance
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testAWSMySQLConnection() {
  console.log('🧪 Testing AWS MySQL RDS Connection...\n');
  
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
    console.log('💡 Copy your RDS endpoint to DB_HOST');
    process.exit(1);
  }

  // Check if this looks like an AWS RDS endpoint
  if (!process.env.DB_HOST.includes('.rds.amazonaws.com')) {
    console.warn('⚠️  DB_HOST doesn\'t look like AWS RDS endpoint');
    console.log('💡 AWS RDS endpoints look like: instance-name.xxxxx.region.rds.amazonaws.com');
  }

  try {
    console.log('🔌 Attempting connection to AWS MySQL RDS...');
    
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

    console.log('✅ Successfully connected to AWS MySQL RDS!');

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
    console.log(`✅ AWS Hostname: ${rows[0].hostname}`);

    // Test free tier instance type
    const [variables] = await connection.query("SHOW VARIABLES LIKE 'innodb_buffer_pool_size'");
    const bufferPoolMB = parseInt(variables[0].Value) / 1024 / 1024;
    console.log(`✅ Buffer Pool Size: ${bufferPoolMB.toFixed(0)}MB`);
    
    if (bufferPoolMB < 200) {
      console.log('✅ Looks like db.t3.micro (free tier instance) ✅');
    } else {
      console.warn('⚠️  This might not be a free tier instance (check your AWS console)');
    }

    await connection.end();
    console.log('\n🎉 AWS MySQL RDS connection test PASSED!');
    console.log('💡 Your database is ready for deployment');
    console.log('💡 Remember: You have 12 months free, then consider migrating to PlanetScale');

  } catch (error) {
    console.error('\n❌ AWS MySQL RDS connection test FAILED!');
    console.error('📍 Error details:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check if DB_HOST is the correct RDS endpoint');
      console.log('   - Verify the RDS instance is running (status: Available)');
      console.log('   - Ensure the instance has public access enabled');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Verify DB_USER and DB_PASSWORD are correct');
      console.log('   - Check RDS master username and password');
      console.log('   - Ensure you\'re using the master credentials');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check security group allows inbound port 3306');
      console.log('   - Verify RDS instance has public accessibility enabled');
      console.log('   - Check VPC and subnet configuration');
      console.log('   - Try from an EC2 instance in the same VPC');
    }
    
    console.log('\n🔗 AWS Resources:');
    console.log('   - RDS Console: https://console.aws.amazon.com/rds/');
    console.log('   - Security Groups: https://console.aws.amazon.com/ec2/v2/home#SecurityGroups');
    console.log('   - VPC Console: https://console.aws.amazon.com/vpc/');
    
    process.exit(1);
  }
}

testAWSMySQLConnection();
