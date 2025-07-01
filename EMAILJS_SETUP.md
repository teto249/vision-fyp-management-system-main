# EmailJS Setup Guide for FYP Management System

## 📧 Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month)
3. Verify your email address

## 🔧 Step 2: Add Email Service

1. In EmailJS Dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **Gmail** (or your preferred provider)
4. Configure with your Gmail credentials:
   - **Email:** altayebnuba@gmail.com (your Gmail)
   - **App Password:** Use the same 16-character password from Gmail setup
5. Test the connection
6. **Copy the Service ID** (e.g., `service_gmail123`)

## 📝 Step 3: Create Email Templates

### Template 1: User Registration
**Template ID:** `template_user_reg`

**Subject:** `FYP System Account Created - {{user_role}} Registration`

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Account Created</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .credentials { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #4CAF50; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Welcome to FYP Management System</h1>
            <p>Your {{user_role}} account has been created</p>
        </div>
        
        <div class="content">
            <h2>Dear {{to_name}},</h2>
            
            <p>Your account has been successfully created in the FYP Management System at <strong>{{university_name}}</strong>.</p>
            
            <div class="credentials">
                <h3>🔐 Your Login Credentials</h3>
                <p><strong>Username:</strong> {{username}}</p>
                <p><strong>Password:</strong> {{password}}</p>
                <p><strong>ID Number:</strong> {{id_number}}</p>
                <p><strong>Department:</strong> {{department}}</p>
                {{#if level}}<p><strong>Level:</strong> {{level}}</p>{{/if}}
                {{#if office_address}}<p><strong>Office:</strong> {{office_address}}</p>{{/if}}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{login_url}}" class="button">🚀 Login to Your Account</a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>⚠️ Important Security Information</h3>
                <ul>
                    <li><strong>Change your password</strong> after first login</li>
                    <li>Keep your credentials secure and confidential</li>
                    <li>Contact support if you experience any issues</li>
                </ul>
            </div>
            
            <p>If you have any questions, please contact support at {{contact_email}}</p>
            
            <p>Best regards,<br>
            <strong>FYP Management System Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© {{year}} FYP Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### Template 2: Bulk Registration Summary
**Template ID:** `template_notification`

**Subject:** `Bulk Registration Summary - {{registration_date}}`

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bulk Registration Summary</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .summary { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .success { border-left: 4px solid #4CAF50; }
        .failed { border-left: 4px solid #f44336; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Bulk Registration Summary</h1>
            <p>Registration completed on {{registration_date}}</p>
        </div>
        
        <div class="content">
            <h2>Dear {{to_name}},</h2>
            
            <p>The bulk user registration process has been completed. Here's a summary:</p>
            
            <div class="summary success">
                <h3>✅ Successfully Registered: {{total_registered}}</h3>
                {{#if success_list}}<p><strong>Users:</strong> {{success_list}}</p>{{/if}}
            </div>
            
            {{#if total_failed}}
            <div class="summary failed">
                <h3>❌ Failed Registrations: {{total_failed}}</h3>
                {{#if failed_list}}<p><strong>Users:</strong> {{failed_list}}</p>{{/if}}
            </div>
            {{/if}}
            
            <p>All successfully registered users have been sent their login credentials via email.</p>
            
            <p>For support, contact {{contact_email}}</p>
            
            <p>Best regards,<br>
            <strong>FYP Management System</strong></p>
        </div>
        
        <div class="footer">
            <p>© {{year}} FYP Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

## 🔑 Step 4: Get Your Public Key

1. Go to **"Account"** → **"General"**
2. Copy your **Public Key** (starts with user_)

## 🔧 Step 5: Update Environment Variables

Update your `Frontend/.env.local` file:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_your_actual_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=user_your_actual_key
NEXT_PUBLIC_EMAILJS_USER_TEMPLATE=template_user_reg
NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE=template_notification
```

## 🧪 Step 6: Test EmailJS

1. **Test in EmailJS Dashboard:**
   - Go to your template
   - Click "Test it"
   - Fill in sample data
   - Send test email

2. **Test in Your App:**
   - Register a new user
   - Check console for EmailJS logs
   - Verify email is received

## 🎯 EmailJS Benefits:

✅ **200 emails/month FREE**  
✅ **No backend required**  
✅ **Real-time delivery**  
✅ **Rich HTML templates**  
✅ **Easy integration**  
✅ **Reliable delivery**  

## 🔧 Troubleshooting:

1. **"EmailJS not configured"**
   - Check environment variables
   - Verify public key is correct

2. **"Service not found"**
   - Verify Service ID matches your EmailJS dashboard
   - Ensure service is active

3. **"Template not found"**
   - Check template IDs match your dashboard
   - Ensure templates are published

4. **"Invalid email"**
   - Verify recipient email format
   - Check for required template variables

## 📈 Upgrade Options:

- **Basic:** $15/month → 1,000 emails
- **Essential:** $35/month → 5,000 emails
- **Professional:** $70/month → 15,000 emails

Your current setup with 200 emails/month should be sufficient for testing and small deployments!
