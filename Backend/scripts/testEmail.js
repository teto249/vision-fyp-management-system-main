require('dotenv').config();
const emailService = require('../utils/emailService');

async function testEmail() {
  console.log('🔧 Environment check:');
  console.log('API Key configured:', !!process.env.RESEND_API_KEY);
  console.log('API Key (first 10 chars):', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
  
  console.log('\n🧪 Testing University Registration Email...\n');
  
  const testUniversityData = {
    id: 'TEST-UNI',
    shortName: 'TEST',
    fullName: 'Test University',
    address: '123 Test Street, Test City',
    email: 'contact@test.edu',
    phone: '+1-234-567-8900',
    maxStudents: 1000,
    maxSupervisors: 100
  };
  
  const testAdminData = {
    username: 'TEST-ADMIN',
    fullName: 'Test Administrator',
    primaryEmail: 'test@example.com', // Change this to your actual email
    temporaryPassword: 'tempPass123'
  };
  
  try {
    const result = await emailService.sendUniversityRegistrationEmail(testUniversityData, testAdminData);
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Sent to:', result.sentTo);
      if (result.mock) {
        console.log('📧 This was a mock email (no actual email sent)');
      }
    } else {
      console.log('❌ Email failed to send');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEmail();
