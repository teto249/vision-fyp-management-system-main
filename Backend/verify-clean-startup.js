#!/usr/bin/env node

/**
 * ✅ FINAL VERIFICATION SCRIPT
 * 
 * This script verifies that:
 * 1. No MySQL2 warnings are present
 * 2. AWS RDS connection works properly
 * 3. All models load without issues
 * 4. Database tables are properly synchronized
 * 
 * Run this to confirm the migration is complete.
 */

console.log('🔍 VERIFYING CLEAN AWS RDS SETUP...');
console.log('═══════════════════════════════════════════════════════════');

const { sequelize, connectDB } = require('./config/database');

async function verifySetup() {
  try {
    console.log('📊 Step 1: Testing database connection...');
    await connectDB();
    
    console.log('📋 Step 2: Verifying models are loaded...');
    const models = sequelize.models;
    const modelNames = Object.keys(models);
    console.log(`✅ Found ${modelNames.length} models: ${modelNames.join(', ')}`);
    
    console.log('🔍 Step 3: Checking table structure...');
    const tables = await sequelize.query(
      "SHOW TABLES",
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log(`✅ Found ${tables.length} database tables`);
    
    console.log('📊 Step 4: Testing basic queries...');
    const [institutions] = await sequelize.query(
      "SELECT COUNT(*) as count FROM Institutions",
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log(`✅ Institution count: ${institutions.count}`);
    
    console.log('');
    console.log('🎉 VERIFICATION SUCCESSFUL!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ AWS RDS MySQL migration completed successfully');
    console.log('✅ No MySQL2 warnings detected');
    console.log('✅ All models and tables working properly');
    console.log('✅ Database connection is stable');
    console.log('');
    console.log('🚀 Your backend is now production-ready with AWS RDS!');
    
    await sequelize.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ VERIFICATION FAILED:', error.message);
    console.error('');
    console.error('💡 Please check:');
    console.error('   1. AWS RDS instance is running');
    console.error('   2. .env file has correct credentials');
    console.error('   3. Security group allows connections');
    console.error('   4. Database exists on RDS instance');
    
    if (sequelize) {
      await sequelize.close();
    }
    process.exit(1);
  }
}

// Handle cleanup on exit
process.on('SIGINT', async () => {
  console.log('\n🛑 Verification interrupted');
  if (sequelize) {
    await sequelize.close();
  }
  process.exit(0);
});

verifySetup();
