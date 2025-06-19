const { Resend } = require('resend');

class EmailService {
  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured in environment variables');
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendAdminCredentials(adminData) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: "onboarding@resend.dev",
        to: adminData.email,
        subject: "Your FYP Management System Credentials",
        html: this.getAdminEmailTemplate(adminData)
      });

      if (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        messageId: data?.id,
        sentTo: adminData.email 
      };
    } catch (error) {
      console.error('Email service error:', error);
      return { 
        success: false, 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      };
    }
  }

  getAdminEmailTemplate(adminData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2C3E50;">Welcome to FYP Management System!</h2>
        <p>Dear ${adminData.fullName},</p>
        <p>Your university admin account has been created successfully.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Username:</strong> ${adminData.username}</p>
          <p><strong>Password:</strong> ${adminData.password}</p>
          <p><strong>University:</strong> ${adminData.universityName}</p>
        </div>
        
        <p style="color: #E74C3C;"><strong>Important:</strong> Please change your password after your first login.</p>
        <p>Best regards,<br>FYP Management System Team</p>
      </div>
    `;
  }
}

module.exports = new EmailService();
