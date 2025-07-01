# 🎓 Complete EmailJS Setup for Student & Supervisor Registration

## 📋 Quick Setup Checklist

### ✅ Step 1: Update Environment Variables
Your `.env.local` should have:
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_tp785so
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=QVaGr3nMszMQF6-eC
NEXT_PUBLIC_EMAILJS_STUDENT_TEMPLATE=template_student_001
NEXT_PUBLIC_EMAILJS_SUPERVISOR_TEMPLATE=template_supervisor_001
NEXT_PUBLIC_EMAILJS_BULK_SUMMARY_TEMPLATE=template_bulk_summary_001
```

### ✅ Step 2: Create EmailJS Templates

Go to https://www.emailjs.com/ and create these 3 templates:

#### 🎓 Template 1: Student Registration
**Template ID:** `template_student_001`
**Subject:** `Welcome to VISION FYP System - Student Account Created`

**Content:**
```html
Dear {{to_name}},

🎓 Welcome to the VISION FYP Management System!

Your student account has been successfully created.

📋 **Login Details:**
• Username: {{username}}
• Password: {{password}}
• Student ID: {{id_number}}
• Department: {{department}}
• Level: {{level}}

🏫 **University:** {{university_name}}

🌐 **Login:** {{login_url}}

🔒 **Security:** Please change your password after first login.

📚 **Next Steps:**
1. Login to your dashboard
2. Change your password
3. Complete your profile
4. Browse available projects

Best regards,
VISION FYP Management Team
```

#### 👨‍🏫 Template 2: Supervisor Registration
**Template ID:** `template_supervisor_001`
**Subject:** `Welcome to VISION FYP System - Supervisor Account Created`

**Content:**
```html
Dear {{to_name}},

👨‍🏫 Welcome to the VISION FYP Management System!

Your supervisor account has been successfully created.

📋 **Login Details:**
• Username: {{username}}
• Password: {{password}}
• Staff ID: {{id_number}}
• Department: {{department}}
• Office: {{office_address}}

🏫 **University:** {{university_name}}
📧 **Contact:** {{contact_email}}

🌐 **Login:** {{login_url}}

🔒 **Security:** Please change your password after first login.

📚 **Next Steps:**
1. Login to your dashboard
2. Change your password
3. Complete your profile
4. Create project proposals

Best regards,
VISION FYP Management Team
```

#### 📊 Template 3: Bulk Summary
**Template ID:** `template_bulk_summary_001`
**Subject:** `Bulk Registration Summary - {{registration_date}}`

**Content:**
```html
Dear {{to_name}},

📊 **Bulk Registration Summary**

University: {{university_name}}
Date: {{registration_date}}

✅ **Successful:** {{total_registered}} users
❌ **Failed:** {{total_failed}} users

**Successful Users:**
{{success_list}}

**Failed Users:**
{{failed_list}}

📧 All successful users have been emailed their credentials.

🔗 **Dashboard:** {{admin_dashboard_url}}

Best regards,
VISION FYP Management Team
```

### ✅ Step 3: Test Your Setup

1. **Test Single Student Registration:**
   ```javascript
   // In browser console
   import('./api/uniAdmin/testRegistration.js').then(m => m.testStudentRegistration())
   ```

2. **Test Single Supervisor Registration:**
   ```javascript
   // In browser console
   import('./api/uniAdmin/testRegistration.js').then(m => m.testSupervisorRegistration())
   ```

3. **Test Bulk Registration:**
   ```javascript
   // In browser console
   import('./api/uniAdmin/testRegistration.js').then(m => m.testBulkRegistration())
   ```

### ✅ Step 4: Verify Email Delivery

1. Check the recipient's inbox
2. Verify all template variables are populated
3. Test login with provided credentials

## 🔧 Troubleshooting

### Email Not Sending?
1. Check console for EmailJS errors
2. Verify template IDs in `.env.local`
3. Confirm EmailJS service is connected to Gmail
4. Check EmailJS quota limits

### Template Variables Not Showing?
1. Ensure variable names match exactly (case-sensitive)
2. Check EmailJS template preview
3. Verify data is being passed correctly

### Console Errors?
1. Check network tab for API failures
2. Verify localStorage has required admin info
3. Check EmailJS public key configuration

## 📊 Email Flow Summary

1. **Single Registration:**
   - User fills registration form
   - Backend creates account & returns credentials
   - Frontend sends welcome email via EmailJS
   - User receives login details

2. **Bulk Registration:**
   - Admin uploads CSV/enters multiple users
   - Backend processes all registrations
   - Frontend sends individual emails to each user
   - Admin receives summary email

3. **Error Handling:**
   - Registration success even if email fails
   - Detailed logging for debugging
   - Graceful fallbacks for missing data

## 🎯 Success Indicators

✅ Students receive welcome emails with login details
✅ Supervisors receive welcome emails with office info
✅ Admins receive bulk registration summaries
✅ All template variables populate correctly
✅ Console shows successful email sending logs
✅ No EmailJS quota exceeded errors

Your EmailJS integration for student and supervisor registration is now complete! 🚀
