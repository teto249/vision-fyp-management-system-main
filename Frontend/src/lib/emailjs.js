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
    // Initialize EmailJS with public key
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
      return this.mockEmailSend('User Registration', { userData, credentials });
    }

    try {
      // Use unified template for both students and supervisors
      const templateId = EMAILJS_CONFIG.templates.student;
      
      // Common template parameters for unified template
      const baseParams = {
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

      // Role-specific parameters
      let templateParams = { ...baseParams };
      
      if (userData.role === 'Student') {
        templateParams.level = userData.level || 'Not specified';
      } else if (userData.role === 'Supervisor') {
        templateParams.office_address = userData.officeAddress || 'Not specified';
      }

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        templateId,
        templateParams
      );

      return {
        success: true,
        messageId: result.text,
        message: 'Registration email sent successfully'
      };
    } catch (error) {
      throw new Error(`Failed to send registration email: ${error.message || error.text || 'Unknown error'}`);
    }
  }

  async sendBulkNotificationEmail(summary) {
    if (!this.isConfigured) {
      return this.mockEmailSend('Bulk Registration Summary', summary);
    }

    try {
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

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templates.bulkSummary,
        templateParams
      );

      return {
        success: true,
        messageId: result.text,
        message: 'Summary email sent successfully'
      };
    } catch (error) {
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
      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        templateId,
        templateParams
      );

      return {
        success: true,
        messageId: result.text,
        message: 'Email sent successfully'
      };
    } catch (error) {
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  mockEmailSend(type, data) {
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
export const sendBulkRegistrationSummary = (summaryData) => emailService.sendBulkNotificationEmail(summaryData);