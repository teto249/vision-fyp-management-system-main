# EmailJS University Registration Template

## 📧 Copy this template content to your EmailJS dashboard

### Template 1: University Admin Registration
**Template ID to use:** `template_unireg_admin`

**Subject:**
```
Welcome to VISION FYP System - University Admin Account Created
```

**Email Content:**
```html
Dear {{to_name}},

🎉 Welcome to the VISION FYP Management System!

Your university administrator account has been successfully created for {{university_name}}.

📋 **Login Details:**
• Username: {{username}}
• Password: {{password}}
• University: {{university_name}} ({{university_code}})
• Email: {{admin_email}}

🌐 **Access your dashboard:** {{login_url}}

🔒 **Important Security Notice:**
Please change your password immediately after your first login for security purposes.

📞 **University Details:**
• Full Name: {{university_full_name}}
• Address: {{university_address}}
• Contact: {{university_phone}}
• Email: {{university_email}}

👥 **System Capacity:**
• Maximum Students: {{max_students}}
• Maximum Supervisors: {{max_supervisors}}

🚀 **Next Steps:**
1. Login to your admin dashboard
2. Change your default password
3. Complete your profile setup
4. Start registering students and supervisors

Need help? Contact our support team or refer to the admin documentation.

Best regards,
VISION FYP Management System Team

---
This is an automated email. Please do not reply to this address.
```

## 🔧 Variables Used in Template:

When sending emails via EmailJS, make sure to pass these variables:

```javascript
const templateParams = {
  to_name: adminFullName,
  to_email: adminEmail,
  username: response.admin.username,
  password: formData.adminPassword,
  university_name: response.university.shortName,
  university_code: response.university.shortName,
  admin_email: adminEmail,
  login_url: `${window.location.origin}/auth/signin`,
  university_full_name: response.university.fullName,
  university_address: formData.address,
  university_phone: formData.phone,
  university_email: formData.email,
  max_students: formData.maxStudents,
  max_supervisors: formData.maxSupervisors
};
```

## 📝 How to Set Up in EmailJS:

1. Go to https://www.emailjs.com/
2. Navigate to "Email Templates"
3. Click "Create New Template"
4. Copy the **Subject** and **Email Content** above
5. Copy the **Template ID**: `template_unireg_admin`
6. Save the template

## 🔄 Update Your .env.local:

```env
NEXT_PUBLIC_EMAILJS_USER_TEMPLATE=template_unireg_admin
```

## ✅ Test Template:

In EmailJS dashboard, click "Test it" and fill in sample data to verify the template works correctly.
