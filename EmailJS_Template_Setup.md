# EmailJS Template Setup Instructions

## 🎯 Quick Setup for FYP Management System

### Step 1: Login to EmailJS
- Go to https://www.emailjs.com/
- Login with your account

### Step 2: Create Template 1 - User Registration

1. Go to "Email Templates" → "Create New Template"
2. **Copy the Template ID** (e.g., template_abc123)
3. Set up the template:

**Template Name:** User Registration
**Subject:** Welcome to FYP System - {{user_role}} Account Created

**Email Content (Simple Version):**
```
Dear {{to_name}},

Your {{user_role}} account has been created successfully!

Login Details:
- Username: {{username}}
- Password: {{password}}
- Department: {{department}}
- ID Number: {{id_number}}

Login at: {{login_url}}

Important: Please change your password after first login.

Best regards,
FYP Management System Team
```

### Step 3: Create Template 2 - Bulk Summary

1. Create another template
2. **Copy the Template ID** (e.g., template_xyz789)
3. Set up the template:

**Template Name:** Bulk Registration Summary
**Subject:** Registration Summary - {{registration_date}}

**Email Content:**
```
Dear {{to_name}},

Bulk registration completed:

✅ Successfully registered: {{total_registered}} users
❌ Failed registrations: {{total_failed}} users

Successful users: {{success_list}}
Failed users: {{failed_list}}

All successful users have been emailed their credentials.

Best regards,
FYP Management System
```

### Step 4: Update Your .env.local

Replace the template IDs in your .env.local file:

```
NEXT_PUBLIC_EMAILJS_USER_TEMPLATE=your_actual_template_id_1
NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE=your_actual_template_id_2
```

### Step 5: Test Your Templates

1. In EmailJS dashboard, click "Test it" on each template
2. Fill in sample data
3. Send test email to verify it works

## 🔧 Alternative: Use One Template for Both

If you want to keep it simple, you can use the same template ID for both:

```
NEXT_PUBLIC_EMAILJS_USER_TEMPLATE=template_ebbzvbb
NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE=template_ebbzvbb
```

The code will automatically adjust the content based on what type of email is being sent.

## 📍 Where to Find Template IDs

Template IDs are shown in your EmailJS dashboard:
1. Go to "Email Templates"
2. You'll see a list of your templates
3. Each template shows its ID (like "template_ebbzvbb")
4. Click on a template to see/edit its ID

The ID format is always: `template_` followed by random characters.
