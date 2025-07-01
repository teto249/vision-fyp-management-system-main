# Gmail SMTP Setup Guide

This guide will help you configure Gmail SMTP for the FYP Management System email service.

## Prerequisites

1. A Gmail account (personal or Google Workspace)
2. 2-Factor Authentication enabled on your Gmail account

## Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click on "2-Step Verification"
3. Follow the setup process to enable 2FA

## Step 2: Generate App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click on "App passwords"
3. You might need to sign in again
4. Select "Mail" as the app and "Other (custom name)" as the device
5. Enter "FYP Management System" as the custom name
6. Click "Generate"
7. **Copy the 16-character password** (spaces will be ignored)

## Step 3: Update Environment Variables

Update your `.env` file in the Backend directory:

```env
# Email Configuration (Gmail SMTP)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password from Step 2

## Step 4: Test Email Configuration

You can test the email service by running:

```bash
cd Backend
node test-email.js
```

## Gmail SMTP Limits (Free Account)

- **500 emails per day** for personal Gmail accounts
- **2,000 emails per day** for Google Workspace accounts
- **100 emails per hour** rate limit
- **25 MB** maximum email size (including attachments)
- **500 recipients** maximum per email

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**
   - Ensure 2FA is enabled
   - Double-check your app password
   - Make sure you're using the app password, not your regular Gmail password

2. **"Authentication failed" error**
   - Verify your Gmail address is correct
   - Try generating a new app password

3. **"Daily sending limit exceeded"**
   - You've hit the 500 emails/day limit
   - Wait 24 hours or upgrade to Google Workspace

4. **"Rate limit exceeded"**
   - You've sent too many emails in a short time
   - Wait an hour before sending more emails

### Security Tips:

1. **Never commit your app password to version control**
2. **Use different app passwords for different applications**
3. **Revoke unused app passwords regularly**
4. **Monitor your Gmail account for suspicious activity**

## For Production

For production environments, consider:

1. **Google Workspace** for higher sending limits
2. **Dedicated email services** like SendGrid, Mailgun, or AWS SES
3. **Domain-based email** (e.g., noreply@yourdomain.com)
4. **Email authentication** (SPF, DKIM, DMARC)

## Alternative Email Services

If Gmail limits are too restrictive:

1. **SendGrid** - 100 emails/day free
2. **Mailgun** - 5,000 emails/month free for 3 months
3. **AWS SES** - 62,000 emails/month free (with EC2)
4. **Postmark** - 100 emails/month free

## Support

If you encounter issues:
1. Check the error logs in the console
2. Verify your Gmail account settings
3. Try sending a test email manually through Gmail
4. Contact the development team for assistance
