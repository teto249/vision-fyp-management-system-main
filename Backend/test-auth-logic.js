const { sequelize } = require('./config/database');
const MainAdmin = require('./models/MainAdmin');
const bcrypt = require('bcryptjs');

async function testAuthLogin() {
  try {
    console.log('🧪 Testing auth login logic locally...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Test finding admin user
    console.log('🔍 Searching for green-admin...');
    const user = await MainAdmin.findOne({
      where: { username: 'green-admin' }
    });
    
    if (!user) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:', {
      username: user.username,
      email: user.email,
      name: user.name,
      hasPassword: !!user.password
    });
    
    // Test password comparison
    console.log('🔐 Testing password comparison...');
    const isValidPassword = await bcrypt.compare('admin123', user.password);
    console.log('✅ Password comparison result:', isValidPassword);
    
    if (isValidPassword) {
      console.log('🎉 Login test successful - all components working!');
    } else {
      console.log('❌ Password comparison failed');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.error('📋 Error stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testAuthLogin();
