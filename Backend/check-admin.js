const { sequelize } = require('./config/database');
const bcrypt = require('bcryptjs');

// Import models
const MainAdmin = require('./models/MainAdmin');
const Institution = require('./models/Institution');

async function checkAndCreateAdmin() {
  try {
    console.log('🔍 Checking for main admin user...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Check if institution exists
    let institution = await Institution.findOne({
      where: { shortName: 'GreenTel Agriculture' }
    });
    
    if (!institution) {
      console.log('🏢 Creating default institution...');
      institution = await Institution.create({
        shortName: "GreenTel Agriculture",
        fullName: "GreenTel For Agriculture and Technology",
        address: "Khartoum City, Sudan",
        email: "greentel@sudan.su",
        phone: "+1234567890",
        logoPath: "https://ui-avatars.com/api/?name=GA&size=256&background=random",
      });
      console.log('✅ Institution created successfully');
    } else {
      console.log('✅ Institution already exists');
    }
    
    // Check if admin exists
    let admin = await MainAdmin.findOne({
      where: { username: 'green-admin' }
    });
    
    if (!admin) {
      console.log('👤 Creating default main admin...');
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      admin = await MainAdmin.create({
        username: "green-admin",
        name: "Altayeb Mustafa Ibrahim Abdelrasoul",
        email: "altayebnuba@gmail.com",
        password: hashedPassword,
        contactEmail: "info@utm.my",
        phoneNumber: "0123456789",
        address: "43, Jalan Utama 38, Johor Bahru",
        role: "MainAdmin",
        profilePhoto: "https://ui-avatars.com/api/?name=AM&size=256&background=random",
        institutionId: institution.id,
      });
      console.log('✅ Main admin created successfully');
    } else {
      console.log('✅ Main admin already exists');
    }
    
    console.log('\n🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('Username: green-admin');
    console.log('Password: admin123');
    console.log('Email: altayebnuba@gmail.com');
    console.log('\n🎯 You can now login to your application!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkAndCreateAdmin();
