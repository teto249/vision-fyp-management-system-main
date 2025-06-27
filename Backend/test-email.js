require('dotenv').config();
const { Resend } = require('resend');

async function testEmailService() {
  console.log('🔍 Testing Email Service Configuration...\n');
  
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY not found in environment variables');
    return;
  }
  
  console.log('✅ API Key found:', process.env.RESEND_API_KEY.substring(0, 10) + '...');
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    // Test sending a simple email
    console.log('\n📧 Attempting to send test email...');
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Using Resend's default domain for testing
      to: 'test@example.com', // This won't actually send, just tests the API
      subject: 'Test Email from FYP Management System',
      html: '<h1>Test Email</h1><p>This is a test email from your FYP Management System.</p>'
    });

    if (error) {
      console.log('❌ Email sending failed:', error);
    } else {
      console.log('✅ Email service is working! Email ID:', data?.id);
    }
    
  } catch (error) {
    console.log('❌ Error testing email service:', error.message);
  }
}

// Run the test
testEmailService();
