const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function setKnownPasswords() {
  try {
    console.log('🔧 Setting Known Passwords for Testing...\n');
    
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

    // Load models
    const MainAdmin = require('./models/MainAdmin');
    const Student = require('./models/Student');

    const testPassword = 'TestPass123!';

    // Set MainAdmin password
    console.log('1️⃣ Setting MainAdmin password...');
    const admin = await MainAdmin.findOne({ where: { username: 'green-admin' } });
    if (admin) {
      await admin.update({ password: testPassword });
      
      // Verify
      const adminReload = await MainAdmin.findOne({ where: { username: 'green-admin' } });
      const isValid = await bcrypt.compare(testPassword, adminReload.password);
      console.log(`   ✅ MainAdmin password set and verified: ${isValid ? 'Success' : 'Failed'}`);
    } else {
      console.log('   ❌ MainAdmin not found');
    }

    // Find any student to set password
    console.log('\n2️⃣ Setting Student password...');
    const students = await Student.findAll({ limit: 1 });
    if (students.length > 0) {
      const student = students[0];
      console.log(`   Found student: ${student.userId} - ${student.fullName}`);
      
      await student.update({ password: testPassword });
      
      // Verify
      const studentReload = await Student.findOne({ where: { userId: student.userId } });
      const isValid = await bcrypt.compare(testPassword, studentReload.password);
      console.log(`   ✅ Student password set and verified: ${isValid ? 'Success' : 'Failed'}`);
      
      console.log(`\n📋 Student Test Credentials:`);
      console.log(`   Username: ${student.userId}`);
      console.log(`   Password: ${testPassword}`);
    } else {
      console.log('   ❌ No students found');
    }

    await sequelize.close();
    
    console.log('\n🎉 Passwords set successfully!');
    console.log('\n📋 Login Credentials:');
    console.log(`   MainAdmin - Username: green-admin, Password: ${testPassword}`);
    if (students.length > 0) {
      console.log(`   Student - Username: ${students[0].userId}, Password: ${testPassword}`);
    }

  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

setKnownPasswords();
