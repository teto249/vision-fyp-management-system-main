const { Sequelize } = require("sequelize");
require("dotenv").config();

async function fixMainAdminPassword() {
  try {
    console.log('🔧 Fixing MainAdmin password (removing double hashing)...');
    
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

    // Import MainAdmin model
    const MainAdmin = require('./models/MainAdmin');
    
    // Find the admin
    const admin = await MainAdmin.findOne({ where: { username: 'green-admin' } });
    
    if (!admin) {
      console.log('❌ MainAdmin not found');
      return;
    }
    
    console.log('✅ Found MainAdmin:', admin.name);
    console.log('🔐 Current password hash:', admin.password.substring(0, 30) + '...');

    // Delete the admin and recreate with correct password
    console.log('🗑️ Removing existing admin with double-hashed password...');
    await admin.destroy();
    
    console.log('➕ Creating new admin with correct password...');
    const newAdmin = await MainAdmin.create({
      username: "green-admin",
      name: "Altayeb Mustafa Ibrahim Abdelrasoul",
      email: "altayebnuba@gmail.com",
      password: "admin123", // This will be properly hashed by the beforeSave hook
      contactEmail: "info@utm.my",
      phoneNumber: "0123456789",
      address: "43, Jalan Utama 38, Johor Bahru",
      role: "MainAdmin",
      profilePhoto: "https://ui-avatars.com/api/?name=AM&size=256&background=random",
      institutionId: admin.institutionId, // Use the same institution ID
    });

    console.log('✅ New admin created with correct password hash');
    console.log('🔐 New password hash:', newAdmin.password.substring(0, 30) + '...');

    // Test the password
    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare('admin123', newAdmin.password);
    console.log('🧪 Password test:', isMatch ? '✅ SUCCESS' : '❌ FAILED');

    await sequelize.close();

    if (isMatch) {
      console.log('\n🎉 MainAdmin password fixed successfully!');
      console.log('🔑 Login credentials:');
      console.log('   Username: green-admin');
      console.log('   Password: admin123');
    } else {
      console.log('\n❌ Password fix failed - there may be another issue');
    }

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

fixMainAdminPassword();
