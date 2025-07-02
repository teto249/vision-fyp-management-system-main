import emailjs from '@emailjs/browser';

// EmailJS configuration with better error handling
const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_tp785so',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'QVaGr3nMszMQF6-eC',
  templates: {
    userRegistration: 'template_7h01cln', // Use the unified template directly
  }
};

class EmailJSService {
  constructor() {
    if (EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== 'your_public_key') {
      try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        this.isConfigured = true;
      } catch (error) {
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
    }
  }

  async sendUserRegistrationEmail(userData, credentials) {
    if (!this.isConfigured) {
      throw new Error('EmailJS is not properly configured');
    }

    try {
      // Create simplified template parameters that work with EmailJS
      const templateParams = {
        // Basic recipient info
        to_email: userData.universityEmail || userData.contactEmail,
        to_name: userData.fullName,
        
        // Authentication details
        username: credentials.username,
        password: credentials.password,
        
        // User information
        user_role: userData.role,
        id_number: userData.idNumber,
        department: userData.department,
        university_name: credentials.universityName || 'Vision University',
        
        // System information
        login_url: `${window.location.origin}/auth/signin`,
        contact_email: 'support@vision-fyp.com',
        year: new Date().getFullYear().toString(),
        
        // Role-specific fields (will be empty string if not applicable)
        level: userData.role === 'Student' ? (userData.level || 'PSM-1') : '',
        office_address: userData.role === 'Supervisor' ? (userData.officeAddress || 'To be assigned') : '',
        
        // Additional conditional text for role-specific content
        role_specific_info: userData.role === 'Student' 
          ? 'You can now browse available FYP projects and contact supervisors.'
          : 'You can now create project proposals and manage student applications.',
        
        // Next steps based on role
        next_steps: userData.role === 'Student'
          ? 'Browse available FYP projects → Contact supervisors → Submit project proposal'
          : 'Create project proposals → Review applications → Manage supervision'
      };



      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templates.userRegistration,
        templateParams
      );


      return {
        success: true,
        messageId: result.text,
        message: `Registration email sent successfully to ${userData.fullName}`
      };

    } catch (error) {
      console.error('❌ Email sending failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to send registration email';
      if (error.text) {
        errorMessage += `: ${error.text}`;
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      throw new Error(errorMessage);
    }
  }

  // Test function to verify EmailJS is working
  async testEmailJS() {
    if (!this.isConfigured) {
      return { success: false, error: 'EmailJS not configured' };
    }

    try {
      const testParams = {
        to_email: 'test@example.com',
        to_name: 'Test User',
        username: 'testuser',
        password: 'testpass123',
        user_role: 'Student',
        id_number: 'TEST001',
        department: 'Computer Science',
        university_name: 'Test University',
        login_url: 'https://test.com/login',
        contact_email: 'support@test.com',
        year: '2025',
        level: 'PSM-1',
        office_address: '',
        role_specific_info: 'This is a test email.',
        next_steps: 'Test → Login → Complete profile'
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templates.userRegistration,
        testParams
      );

      return { success: true, result: result.text };
    } catch (error) {
      return { success: false, error: error.message || error.text || 'Unknown error' };
    }
  }
}

// Export singleton instance
export const emailService = new EmailJSService();
export default emailService;
