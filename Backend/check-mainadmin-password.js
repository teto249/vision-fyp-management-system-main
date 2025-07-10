const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function checkMainAdminPassword() {
  try {
    console.log('🔍 Checking MainAdmin password...');
    
    // Initialize Sequelize
    const sequelize = new Sequelize(
      process.env.DB_NAME || 'vision-fyp-management-system',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
      }
    );

    // Get the MainAdmin model
    const MainAdmin = require('./models/MainAdmin');
    
    // Find the admin
    const admin = await MainAdmin.findOne({
      where: { username: 'green-admin' }
    });

    if (!admin) {
      console.log('❌ MainAdmin not found');
      return;
    }

    console.log('✅ MainAdmin found:', admin.name);
    console.log('📧 Email:', admin.email);
    console.log('🔐 Password hash:', admin.password.substring(0, 20) + '...');

    // Test various passwords
    const passwordsToTry = [
      'admin123',
      'Admin123',
      'password123',
      'green-admin',
      'greenadmin',
      'GreenAdmin123',
      'Altayeb123',
      'altayeb123',
      'vision123',
      'Vision123'
    ];

    console.log('\n🧪 Testing password combinations...');
    
    for (const password of passwordsToTry) {
      try {
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log(`   ${password}: ${isMatch ? '✅ MATCH!' : '❌ No match'}`);
        
        if (isMatch) {
          console.log(`\n🎉 Found correct password: ${password}`);
          break;
        }
      } catch (error) {
        console.log(`   ${password}: ❌ Error - ${error.message}`);
      }
    }

    // Also check if the password was recently changed
    console.log('\n📅 MainAdmin last updated:', admin.updatedAt);

    await sequelize.close();

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

checkMainAdminPassword();
