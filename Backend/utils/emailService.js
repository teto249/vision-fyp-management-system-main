const { Resend } = require('resend');

class EmailService {
  constructor() {
    this.isConfigured = !!process.env.RESEND_API_KEY;
    
    if (this.isConfigured) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    } else {
      console.warn('RESEND_API_KEY is not configured. Email service will run in mock mode.');
    }
  }

  async sendAdminCredentials(adminData) {
    if (!this.isConfigured) {
      console.log('Mock email - Admin credentials would be sent to:', adminData.email);
      return { 
        success: true, 
        messageId: 'mock-id',
        sentTo: adminData.email,
        mock: true
      };
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: "FYP Admin <onboarding@resend.dev>", // Use Resend's default domain
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

  async sendUniversityRegistrationEmail(universityData, adminData) {
    if (!this.isConfigured) {
      console.log('Mock email - University registration email would be sent to:', adminData.primaryEmail);
      console.log('University:', universityData.fullName);
      console.log('Admin Username:', adminData.username);
      console.log('Temporary Password:', adminData.temporaryPassword);
      return { 
        success: true, 
        messageId: 'mock-registration-id',
        sentTo: adminData.primaryEmail,
        mock: true
      };
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: "onboarding@resend.dev", // Use Resend's verified domain for now
        to: adminData.primaryEmail,
        subject: `Welcome to FYP Management System - ${universityData.fullName} Registration Confirmed`,
        html: this.getUniversityRegistrationTemplate(universityData, adminData)
      });

      if (error) {
        console.error('University registration email failed:', error);
        return { success: false, error: error.message };
      }

      console.log(`University registration email sent to ${adminData.primaryEmail}`);
      return { 
        success: true, 
        messageId: data?.id,
        sentTo: adminData.primaryEmail 
      };
    } catch (error) {
      console.error('University registration email service error:', error);
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

  getUniversityRegistrationTemplate(universityData, adminData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>University Registration Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials-box { background: #fff; border-left: 4px solid #4CAF50; padding: 20px; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .university-details { background: #fff; padding: 20px; margin: 20px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .important { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          h1 { margin: 0; font-size: 28px; }
          h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #555; }
          .detail-value { color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Welcome to FYP Management System</h1>
            <p>University Registration Successful</p>
          </div>
          
          <div class="content">
            <h2>Dear ${adminData.fullName},</h2>
            
            <p>Congratulations! Your university <strong>${universityData.fullName}</strong> has been successfully registered with our FYP Management System.</p>
            
            <div class="university-details">
              <h3>🏛️ University Information</h3>
              <div class="detail-row">
                <span class="detail-label">University Name:</span>
                <span class="detail-value">${universityData.fullName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Short Name:</span>
                <span class="detail-value">${universityData.shortName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">University ID:</span>
                <span class="detail-value">${universityData.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${universityData.address}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Contact Email:</span>
                <span class="detail-value">${universityData.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${universityData.phone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Max Students:</span>
                <span class="detail-value">${universityData.maxStudents}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Max Supervisors:</span>
                <span class="detail-value">${universityData.maxSupervisors}</span>
              </div>
            </div>

            <div class="credentials-box">
              <h3>🔐 Your Administrator Login Credentials</h3>
              <div class="detail-row">
                <span class="detail-label">Username:</span>
                <span class="detail-value"><strong>${adminData.username}</strong></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Temporary Password:</span>
                <span class="detail-value"><strong>${adminData.temporaryPassword}</strong></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Login URL:</span>
                <span class="detail-value">${process.env.FRONTEND_URL || 'http://localhost:3001'}/auth/login</span>
              </div>
            </div>

            <div class="important">
              <h3>⚠️ Important Security Information</h3>
              <ul>
                <li><strong>Change your password immediately</strong> after your first login</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>You can manage students, supervisors, and projects through your dashboard</li>
                <li>For technical support, contact our admin team</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/auth/login" class="button">
                🚀 Login to Your Dashboard
              </a>
            </div>

            <p>As a university administrator, you can now:</p>
            <ul>
              <li>Register and manage students and supervisors</li>
              <li>Oversee FYP projects and milestones</li>
              <li>Generate reports and analytics</li>
              <li>Manage university-specific settings</li>
            </ul>

            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>FYP Management System Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2025 FYP Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
