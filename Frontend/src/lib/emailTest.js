import emailjs from '@emailjs/browser';

// Direct EmailJS test function
export async function testEmailJS() {
  try {
    console.log('🧪 Testing EmailJS configuration...');
    
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_STUDENT_TEMPLATE;
    
    console.log('📧 EmailJS Config:', {
      serviceId: serviceId || 'NOT SET',
      publicKey: publicKey ? `${publicKey.substring(0, 5)}...` : 'NOT SET',
      templateId: templateId || 'NOT SET'
    });
    
    if (!serviceId || !publicKey || !templateId) {
      throw new Error('EmailJS environment variables not properly configured');
    }
    
    // Initialize EmailJS
    emailjs.init(publicKey);
    
    // Test email parameters
    const testParams = {
      to_email: 'test@example.com',
      to_name: 'Test User',
      user_role: 'Student',
      username: 'testuser',
      password: 'testpass123',
      id_number: 'STU001',
      department: 'Computer Science',
      university_name: 'Test University',
      login_url: 'https://example.com/login',
      contact_email: 'support@example.com',
      year: '2025',
      level: 'PSM-1'
    };
    
    console.log('📧 Sending test email with params:', testParams);
    
    const result = await emailjs.send(serviceId, templateId, testParams);
    
    console.log('✅ EmailJS test successful:', result);
    return { success: true, result };
    
  } catch (error) {
    console.error('❌ EmailJS test failed:', error);
    return { success: false, error: error.message };
  }
}

// Direct email sending function for registration
export async function sendRegistrationEmailDirect(userData, credentials) {
  try {
    console.log('📧 Sending registration email directly...');
    
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_STUDENT_TEMPLATE;
    
    if (!serviceId || !publicKey || !templateId) {
      throw new Error('EmailJS not configured properly');
    }
    
    // Initialize EmailJS
    emailjs.init(publicKey);
    
    // Prepare email parameters
    const emailParams = {
      to_email: userData.universityEmail || userData.contactEmail,
      to_name: userData.fullName,
      user_role: userData.role,
      username: credentials.username,
      password: credentials.password,
      id_number: userData.idNumber,
      department: userData.department,
      university_name: credentials.universityName || 'Your University',
      login_url: `${window.location.origin}/auth/signin`,
      contact_email: 'support@vision-fyp.com',
      year: new Date().getFullYear().toString()
    };
    
    // Add role-specific fields
    if (userData.role === 'Student') {
      emailParams.level = userData.level || 'PSM-1';
    } else if (userData.role === 'Supervisor') {
      emailParams.office_address = userData.officeAddress || 'Not specified';
    }
    
    console.log('📧 Email params:', {
      to: emailParams.to_email,
      name: emailParams.to_name,
      role: emailParams.user_role,
      template: templateId
    });
    
    const result = await emailjs.send(serviceId, templateId, emailParams);
    
    console.log('✅ Registration email sent successfully:', result);
    return { success: true, result };
    
  } catch (error) {
    console.error('❌ Failed to send registration email:', error);
    return { success: false, error: error.message };
  }
}
