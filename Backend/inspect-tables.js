#!/usr/bin/env node

/**
 * 🔍 DATABASE TABLE INSPECTOR
 * 
 * Quick script to see what tables exist in the AWS RDS database
 */

const { sequelize } = require('./config/database');

async function inspectTables() {
  try {
    console.log('📊 Connecting to AWS RDS...');
    await sequelize.authenticate();
    console.log('✅ Connected successfully');
    
    console.log('\n🔍 Inspecting database tables...');
    const tables = await sequelize.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = '${process.env.DB_NAME}' 
       ORDER BY table_name`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log(`\n📋 Found ${tables.length} tables:`);
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name || table.TABLE_NAME}`);
    });
    
    if (tables.length > 0) {
      // Test a query on the first table
      const firstTable = tables[0].table_name || tables[0].TABLE_NAME;
      console.log(`\n🧪 Testing query on '${firstTable}'...`);
      const [count] = await sequelize.query(
        `SELECT COUNT(*) as count FROM \`${firstTable}\``,
        { type: sequelize.QueryTypes.SELECT }
      );
      console.log(`✅ Query successful: ${count.count} records found`);
    }
    
    await sequelize.close();
    console.log('\n✅ Inspection completed successfully');
    
  } catch (error) {
    console.error('❌ Inspection failed:', error.message);
    if (sequelize) {
      await sequelize.close();
    }
    process.exit(1);
  }
}

inspectTables();
