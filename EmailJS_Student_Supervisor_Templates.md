# EmailJS Templates for Student & Supervisor Registration

## 📧 Template 1: Student Registration

### Template ID: `template_student_reg`

**Subject:**
```
Welcome to VISION FYP System - Student Account Created
```

**Email Content:**
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

🏫 **University Information:**
• University: {{university_name}}
• Contact Email: {{university_email}}

🌐 **Access your dashboard:** {{login_url}}

🔒 **Important Security Notice:**
Please change your password immediately after your first login for security purposes.

📚 **Next Steps:**
1. Login to your student dashboard
2. Change your default password
3. Complete your profile setup
4. View available projects and supervisors
5. Submit your project proposal

📞 **Need Help?**
Contact your university administrator or refer to the student documentation.

Best regards,
VISION FYP Management System Team

---
This is an automated email. Please do not reply to this address.
```

---

## 📧 Template 2: Supervisor Registration

### Template ID: `template_supervisor_reg`

**Subject:**
```
Welcome to VISION FYP System - Supervisor Account Created
```

**Email Content:**
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

🏫 **University Information:**
• University: {{university_name}}
• Contact Email: {{contact_email}}

🌐 **Access your dashboard:** {{login_url}}

🔒 **Important Security Notice:**
Please change your password immediately after your first login for security purposes.

📚 **Next Steps:**
1. Login to your supervisor dashboard
2. Change your default password
3. Complete your profile setup
4. Create project proposals
5. Manage student assignments

📞 **Need Help?**
Contact your university administrator or refer to the supervisor documentation.

Best regards,
VISION FYP Management System Team

---
This is an automated email. Please do not reply to this address.
```

---

## 📧 Template 3: Bulk Registration Summary (For Admins)

### Template ID: `template_bulk_summary`

**Subject:**
```
Bulk Registration Summary - {{registration_date}}
```

**Email Content:**
```html
Dear {{to_name}},

📊 **Bulk Registration Completed**

Registration Date: {{registration_date}}
University: {{university_name}}

✅ **Successfully Registered:** {{total_registered}} users
❌ **Failed Registrations:** {{total_failed}} users

📋 **Successful Registrations:**
{{success_list}}

❌ **Failed Registrations:**
{{failed_list}}

📧 **Email Notifications:**
All successful users have been automatically sent their login credentials via email.

🔗 **View Dashboard:** {{admin_dashboard_url}}

Best regards,
VISION FYP Management System Team

---
This is an automated email. Please do not reply to this address.
```

---

## 🔧 Template Variables Reference

### Student Template Variables:
```javascript
{
  to_name: studentFullName,
  to_email: studentEmail,
  username: credentials.username,
  password: credentials.password,
  id_number: studentIdNumber,
  department: studentDepartment,
  level: studentLevel, // "PSM-1" or "PSM-2"
  university_name: universityName,
  university_email: universityEmail,
  login_url: loginPageUrl
}
```

### Supervisor Template Variables:
```javascript
{
  to_name: supervisorFullName,
  to_email: supervisorEmail,
  username: credentials.username,
  password: credentials.password,
  id_number: supervisorIdNumber,
  department: supervisorDepartment,
  office_address: officeAddress,
  university_name: universityName,
  contact_email: supervisorContactEmail,
  login_url: loginPageUrl
}
```

### Bulk Summary Template Variables:
```javascript
{
  to_name: adminName,
  to_email: adminEmail,
  registration_date: new Date().toLocaleDateString(),
  university_name: universityName,
  total_registered: successCount,
  total_failed: failedCount,
  success_list: successList.join(', '),
  failed_list: failedList.join(', '),
  admin_dashboard_url: dashboardUrl
}
```

## 📝 Setup Instructions

1. **Create Templates in EmailJS:**
   - Go to https://www.emailjs.com/
   - Create 3 new templates with the content above
   - Note down the template IDs

2. **Update .env.local:**
```env
NEXT_PUBLIC_EMAILJS_STUDENT_TEMPLATE=template_student_reg
NEXT_PUBLIC_EMAILJS_SUPERVISOR_TEMPLATE=template_supervisor_reg
NEXT_PUBLIC_EMAILJS_BULK_SUMMARY_TEMPLATE=template_bulk_summary
```

3. **Test Templates:**
   - Use EmailJS dashboard "Test" feature
   - Verify all variables render correctly
