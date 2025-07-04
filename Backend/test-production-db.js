/**
 * Production Database Test - AWS RDS Only
 * Tests the cleaned up database configuration that only supports AWS RDS
 */

const { connectDB, sequelize } = require('./config/database');

async function testProductionDatabase() {
  console.log('🚀 Testing Production Database Configuration (AWS RDS Only)');
  console.log('=' .repeat(60));
  
  try {
    // Test connection
    console.log('1️⃣ Testing database connection...');
    await connectDB();
    
    // Test a simple query
    console.log('2️⃣ Testing database query...');
    const [results] = await sequelize.query('SELECT VERSION() as mysql_version');
    console.log(`   MySQL Version: ${results[0].mysql_version}`);
    
    // Test table count
    console.log('3️⃣ Checking table structure...');
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log(`   Total tables: ${tables.length}`);
    
    if (tables.length > 0) {
      console.log('   Tables found:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`     ${index + 1}. ${tableName}`);
      });
    }
    
    console.log('');
    console.log('✅ Production database test completed successfully!');
    console.log('🎉 Your backend is ready for production deployment');
    
  } catch (error) {
    console.error('❌ Production database test failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('Missing required database environment variables')) {
      console.error('');
      console.error('💡 Fix: Run the quick setup script first:');
      console.error('   node quick-setup.js');
    } else if (error.name === 'SequelizeConnectionRefusedError') {
      console.error('');
      console.error('💡 Fix: Check your AWS RDS configuration:');
      console.error('   1. Verify RDS instance is running');
      console.error('   2. Check security group settings');
      console.error('   3. Ensure public access is enabled');
    }
    
    process.exit(1);
  } finally {
    if (sequelize) {
      await sequelize.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the test
testProductionDatabase();
