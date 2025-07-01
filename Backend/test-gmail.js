const emailService = require('./utils/emailService');
require('dotenv').config();

async function testGmailConfiguration() {
  console.log('🧪 Testing Gmail SMTP Configuration...\n');
  
  // Check if Gmail credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ Gmail credentials not configured!');
    console.log('Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file');
    console.log('See GMAIL_SETUP.md for detailed instructions');
    return;
  }
  
  console.log('✅ Gmail credentials found in environment variables');
  console.log(`📧 Gmail User: ${process.env.GMAIL_USER}`);
  console.log(`🔑 App Password: ${'*'.repeat(process.env.GMAIL_APP_PASSWORD.length)}\n`);
  
  // Test admin credentials email
  console.log('📤 Testing admin credentials email...');
  try {
    const adminTestData = {
      email: process.env.GMAIL_USER, // Send to yourself for testing
      fullName: 'Test Admin',
      username: 'test_admin',
      password: 'temp_password_123',
      universityName: 'Test University'
    };
    
    const result = await emailService.sendAdminCredentials(adminTestData);
    
    if (result.success) {
      console.log('✅ Admin credentials email sent successfully!');
      console.log(`📧 Sent to: ${result.sentTo}`);
      console.log(`🆔 Message ID: ${result.messageId}`);
      if (result.mock) {
        console.log('⚠️  This was a mock email (no actual email sent)');
      }
    } else {
      console.error('❌ Failed to send admin credentials email');
      console.error('Error:', result.error);
      if (result.details) {
        console.error('Details:', result.details);
      }
    }
  } catch (error) {
    console.error('❌ Error testing admin credentials email:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test university registration email
  console.log('📤 Testing university registration email...');
  try {
    const universityTestData = {
      fullName: 'Test University of Technology',
      shortName: 'TUT',
      id: 'test-uni-001',
      address: '123 Education Street, Tech City, TC 12345',
      email: 'contact@testuni.edu',
      phone: '+1-555-0123',
      maxStudents: 500,
      maxSupervisors: 50
    };
    
    const adminTestData = {
      fullName: 'Dr. Jane Smith',
      username: 'jane.smith',
      temporaryPassword: 'TempPass123!',
      primaryEmail: process.env.GMAIL_USER // Send to yourself for testing
    };
    
    const result = await emailService.sendUniversityRegistrationEmail(universityTestData, adminTestData);
    
    if (result.success) {
      console.log('✅ University registration email sent successfully!');
      console.log(`📧 Sent to: ${result.sentTo}`);
      console.log(`🆔 Message ID: ${result.messageId}`);
      if (result.mock) {
        console.log('⚠️  This was a mock email (no actual email sent)');
      }
    } else {
      console.error('❌ Failed to send university registration email');
      console.error('Error:', result.error);
      if (result.details) {
        console.error('Details:', result.details);
      }
    }
  } catch (error) {
    console.error('❌ Error testing university registration email:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Gmail SMTP test completed!');
  console.log('\nIf emails were sent successfully, check your Gmail inbox.');
  console.log('If you see errors, check the GMAIL_SETUP.md file for troubleshooting tips.');
}

// Run the test
testGmailConfiguration().catch(console.error);
