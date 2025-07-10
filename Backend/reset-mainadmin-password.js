const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function resetMainAdminPassword() {
  try {
    console.log('🔧 Resetting MainAdmin password...');
    
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

    // Set a known password for testing
    const newPassword = 'admin123';
    console.log('🔐 Setting password to:', newPassword);

    // Check if MainAdmin model has password hashing hook
    console.log('🔍 Checking if MainAdmin model has beforeSave hook...');
    
    // Let's try to update directly with raw password first (let the model handle hashing)
    try {
      await admin.update({ password: newPassword });
      console.log('✅ Password updated using model (with hooks)');
    } catch (error) {
      console.log('❌ Model update failed:', error.message);
      
      // If that fails, hash manually
      console.log('🔧 Trying manual hash...');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Use direct SQL update to bypass hooks
      await sequelize.query(
        'UPDATE MainAdmins SET password = ?, updatedAt = NOW() WHERE username = ?',
        {
          replacements: [hashedPassword, 'green-admin'],
          type: sequelize.QueryTypes.UPDATE
        }
      );
      console.log('✅ Password updated using direct SQL');
    }

    // Verify the password works
    const updatedAdmin = await MainAdmin.findOne({
      where: { username: 'green-admin' }
    });
    
    const isMatch = await bcrypt.compare(newPassword, updatedAdmin.password);
    console.log('🧪 Password verification:', isMatch ? '✅ Success' : '❌ Failed');

    if (isMatch) {
      console.log('\n📋 MainAdmin Login Credentials:');
      console.log(`   Username: green-admin`);
      console.log(`   Password: ${newPassword}`);
      console.log('\n🎯 You can now login to the admin panel!');
    } else {
      console.log('\n❌ Password verification failed. There might be an issue with the MainAdmin model.');
    }

    await sequelize.close();

  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    console.error('Full error:', error);
  }
}

resetMainAdminPassword();
