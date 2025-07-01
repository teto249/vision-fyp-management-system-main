import emailjs from '@emailjs/browser';

// Test EmailJS configuration and template
const testEmailJSConfig = async () => {
  console.log('🧪 Testing EmailJS Configuration...');
  
  // Check environment variables
  const config = {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    studentTemplate: process.env.NEXT_PUBLIC_EMAILJS_STUDENT_TEMPLATE,
  };
  
  console.log('📋 Current EmailJS Config:', {
    serviceId: config.serviceId,
    publicKey: config.publicKey ? `${config.publicKey.substring(0, 5)}...` : 'NOT SET',
    studentTemplate: config.studentTemplate,
    hasService: !!config.serviceId,
    hasKey: !!config.publicKey,
    hasTemplate: !!config.studentTemplate
  });
  
  // Initialize EmailJS
  try {
    emailjs.init(config.publicKey);
    console.log('✅ EmailJS initialized successfully');
  } catch (error) {
    console.error('❌ EmailJS initialization failed:', error);
    return;
  }
  
  // Test template parameters (matching the unified template)
  const testParams = {
    to_email: 'utmaltayeb@gmail.com', // Using the email from console
    to_name: 'Altayeb Mustafa Ibrahim Abdelrasoul',
    user_role: 'Student',
    username: 'A21EC9115',
    password: 'SECJH42LEC9115',
    id_number: 'A21EC9115',
    department: 'SECJ',
    university_name: 'Test University',
    login_url: 'http://localhost:3001/auth/signin',
    contact_email: 'support@vision-fyp.com',
    year: '2025',
    level: 'PSM-1' // Student specific
  };
  
  console.log('📧 Test email parameters:', testParams);
  
  // Send test email
  try {
    console.log('📤 Sending test email...');
    const result = await emailjs.send(
      config.serviceId,
      config.studentTemplate,
      testParams
    );
    
    console.log('✅ Test email sent successfully!', result);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Test email failed:', error);
    
    // Detailed error analysis
    if (error.status === 400) {
      console.error('🔍 Bad Request (400) - Check template variables or template ID');
    } else if (error.status === 401) {
      console.error('🔍 Unauthorized (401) - Check public key and service ID');
    } else if (error.status === 404) {
      console.error('🔍 Not Found (404) - Check template ID and service ID');
    } else if (error.status === 422) {
      console.error('🔍 Unprocessable Entity (422) - Check template variables');
    }
    
    return { success: false, error };
  }
};

// Export for testing
export default testEmailJSConfig;

// If running directly in browser console
if (typeof window !== 'undefined') {
  window.testEmailJS = testEmailJSConfig;
  console.log('💡 Run window.testEmailJS() in browser console to test');
}
