import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_gmail',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key',
  templates: {
    userRegistration: process.env.NEXT_PUBLIC_EMAILJS_USER_TEMPLATE || 'template_user_reg',
    notification: process.env.NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE || 'template_notification',
    university: process.env.NEXT_PUBLIC_EMAILJS_UNIVERSITY_TEMPLATE || 'template_university',
    student: process.env.NEXT_PUBLIC_EMAILJS_STUDENT_TEMPLATE || 'template_student_reg',
    supervisor: process.env.NEXT_PUBLIC_EMAILJS_SUPERVISOR_TEMPLATE || 'template_supervisor_reg',
    bulkSummary: process.env.NEXT_PUBLIC_EMAILJS_BULK_SUMMARY_TEMPLATE || 'template_bulk_summary'
  }
};

class EmailJSService {
  constructor() {
    console.log('🔧 Initializing EmailJS service...');
    console.log('🔧 Config check:', {
      serviceId: EMAILJS_CONFIG.serviceId,
      publicKey: EMAILJS_CONFIG.publicKey ? `${EMAILJS_CONFIG.publicKey.substring(0, 5)}...` : 'NOT SET',
      hasServiceId: !!EMAILJS_CONFIG.serviceId,
      hasPublicKey: !!EMAILJS_CONFIG.publicKey,
      studentTemplate: EMAILJS_CONFIG.templates.student
    });
    
    // Initialize EmailJS with public key
    if (EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== 'your_public_key') {
      try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        this.isConfigured = true;
        console.log('✅ EmailJS configured successfully');
      } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
      console.warn('⚠️ EmailJS not configured - will use mock mode');
      console.warn('⚠️ Check environment variables: NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');
    }
  }

  async sendUserRegistrationEmail(userData, credentials) {
    console.log(`📧 EmailJS Service - isConfigured: ${this.isConfigured}`);
    
    if (!this.isConfigured) {
      console.log('📧 EmailJS not configured - using mock mode');
      return this.mockEmailSend('User Registration', { userData, credentials });
    }

    try {
      console.log(`📧 Sending ${userData.role} registration email with unified template...`);
      
      // Use unified template for both students and supervisors
      const templateId = EMAILJS_CONFIG.templates.student; // Both use same template now (template_7h01cln)
      
      console.log(`📧 Using template ID: ${templateId}`);
      console.log(`📧 Service ID: ${EMAILJS_CONFIG.serviceId}`);
      
      // Common template parameters for unified template
      const baseParams = {
        to_email: userData.universityEmail || userData.contactEmail,
        to_name: userData.fullName,
        user_role: userData.role, // Important: Add user_role for unified template
        username: credentials.username,
        password: credentials.password,
        id_number: userData.idNumber,
        department: userData.department,
        university_name: credentials.universityName || 'Your University',
        login_url: `${window.location.origin}/auth/signin`,
        contact_email: 'support@vision-fyp.com',
        year: new Date().getFullYear().toString()
      };

      // Role-specific parameters (conditional fields for unified template)
      let templateParams = { ...baseParams };
      
      if (userData.role === 'Student') {
        templateParams.level = userData.level || 'Not specified';
        // office_address will be undefined/null for students (template will hide it)
      } else if (userData.role === 'Supervisor') {
        templateParams.office_address = userData.officeAddress || 'Not specified';
        // level will be undefined/null for supervisors (template will hide it)
      }

      console.log('📧 Full template parameters:', templateParams);

      console.log('📧 Attempting to send email...');
      console.log('📧 Service ID:', EMAILJS_CONFIG.serviceId);
      console.log('📧 Template ID:', templateId);
      console.log('📧 Recipient:', templateParams.to_email);

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        templateId,
        templateParams
      );

      console.log('✅ User registration email sent successfully:', result);
      return {
        success: true,
        messageId: result.text,
        message: 'Registration email sent successfully'
      };
    } catch (error) {
      console.error('❌ Failed to send user registration email:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        text: error.text,
        serviceId: EMAILJS_CONFIG.serviceId,
        templateId: EMAILJS_CONFIG.templates.student,
        userEmail: userData.universityEmail || userData.contactEmail
      });
      
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
      
      throw new Error(`Failed to send registration email: ${error.message || error.text || 'Unknown error'}`);
    }
  }

  async sendBulkNotificationEmail(summary) {
    if (!this.isConfigured) {
      return this.mockEmailSend('Bulk Registration Summary', summary);
    }

    try {
      console.log('📧 Sending bulk registration summary email...');
      
      // Get admin email from localStorage or use default
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      const adminEmail = adminInfo.email || adminInfo.primaryEmail || 'admin@university.edu';
      const universityInfo = JSON.parse(localStorage.getItem('universityInfo') || '{}');

      const templateParams = {
        to_email: adminEmail,
        to_name: adminInfo.fullName || 'Administrator',
        university_name: universityInfo.shortName || 'Your University',
        total_registered: summary.successCount,
        total_failed: summary.failedCount,
        success_list: Array.isArray(summary.successList) ? summary.successList.join(', ') : 'None',
        failed_list: Array.isArray(summary.failedList) ? summary.failedList.join(', ') : 'None',
        registration_date: new Date().toLocaleDateString(),
        admin_dashboard_url: `${window.location.origin}/uniAdmin/dashboard`,
        contact_email: 'support@vision-fyp.com',
        year: new Date().getFullYear()
      };

      console.log('📧 Bulk summary template params:', {
        to: templateParams.to_email,
        university: templateParams.university_name,
        success: templateParams.total_registered,
        failed: templateParams.total_failed
      });

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templates.bulkSummary,
        templateParams
      );

      console.log('✅ Bulk registration summary email sent:', result);
      return {
        success: true,
        messageId: result.text,
        message: 'Summary email sent successfully'
      };
    } catch (error) {
      console.error('❌ Failed to send bulk registration summary:', error);
      // Don't throw error for summary email failure
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generic email sending function
  async sendEmail({ templateParams, templateId }) {
    if (!this.isConfigured) {
      return this.mockEmailSend('Generic Email', { templateParams, templateId });
    }

    try {
      console.log(`📧 Sending email with template: ${templateId}`);
      console.log('📧 Template params:', templateParams);

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        templateId,
        templateParams
      );

      console.log('✅ Email sent successfully:', result);
      return {
        success: true,
        messageId: result.text,
        message: 'Email sent successfully'
      };
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  mockEmailSend(type, data) {
    console.log(`📧 [MOCK EMAIL] ${type}:`, {
      type,
      timestamp: new Date().toISOString(),
      data
    });
    return {
      success: true,
      messageId: 'mock_' + Date.now(),
      message: `Mock ${type} email logged to console`
    };
  }
}

// Export singleton instance
export const emailService = new EmailJSService();
export default emailService;

// Export commonly used functions
export const sendEmail = (params) => emailService.sendEmail(params);
export const sendUserRegistrationEmail = (userData, credentials) => emailService.sendUserRegistrationEmail(userData, credentials);
export const sendBulkRegistrationSummary = (summaryData) => emailService.sendBulkRegistrationSummary(summaryData);
