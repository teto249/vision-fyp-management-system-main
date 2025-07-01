# Unified Student & Supervisor Registration Email Template

## 📧 Template ID: `template_7h01cln`

### Subject Line:
```
🎓 Welcome to VISION FYP System - {{user_role}} Account Created
```

### Complete HTML Email Content:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Created - VISION FYP System</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f8f9fa; 
        }
        .email-container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
        }
        .header { 
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); 
            color: white; 
            padding: 35px 25px; 
            text-align: center; 
        }
        .header h1 { 
            font-size: 26px; 
            margin-bottom: 8px; 
            font-weight: 600; 
        }
        .header .role-badge { 
            background: rgba(255,255,255,0.2); 
            padding: 8px 20px; 
            border-radius: 20px; 
            font-size: 14px; 
            font-weight: 500; 
            display: inline-block; 
            margin-top: 10px; 
        }
        .content { 
            padding: 35px 25px; 
        }
        .greeting { 
            font-size: 18px; 
            margin-bottom: 20px; 
            color: #2d3748; 
        }
        .welcome-section { 
            background: #f7fafc; 
            padding: 25px; 
            border-radius: 10px; 
            margin: 25px 0; 
            border-left: 4px solid #4f46e5; 
        }
        .welcome-section h3 { 
            color: #2d3748; 
            margin-bottom: 15px; 
            font-size: 18px; 
        }
        .welcome-section p { 
            color: #4a5568; 
            margin-bottom: 10px; 
        }
        .credentials-box { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 25px; 
            border-radius: 10px; 
            margin: 30px 0; 
        }
        .credentials-box h3 { 
            margin-bottom: 20px; 
            font-size: 20px; 
            text-align: center; 
        }
        .credential-row { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            background: rgba(255,255,255,0.1); 
            padding: 12px 20px; 
            margin: 12px 0; 
            border-radius: 8px; 
            border-left: 3px solid rgba(255,255,255,0.3); 
        }
        .credential-label { 
            font-weight: 600; 
            font-size: 14px; 
            opacity: 0.9; 
        }
        .credential-value { 
            font-family: 'Courier New', monospace; 
            font-size: 15px; 
            font-weight: 600; 
            background: rgba(255,255,255,0.2); 
            padding: 4px 12px; 
            border-radius: 4px; 
        }
        .user-details { 
            background: #e6fffa; 
            padding: 25px; 
            border-radius: 10px; 
            margin: 25px 0; 
            border-left: 4px solid #38b2ac; 
        }
        .user-details h3 { 
            color: #234e52; 
            margin-bottom: 15px; 
        }
        .detail-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
            margin-top: 15px; 
        }
        .detail-item { 
            background: white; 
            padding: 15px; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
        }
        .detail-label { 
            font-weight: 600; 
            color: #4a5568; 
            font-size: 12px; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
            margin-bottom: 5px; 
        }
        .detail-value { 
            color: #2d3748; 
            font-size: 14px; 
            font-weight: 500; 
        }
        .login-section { 
            text-align: center; 
            margin: 35px 0; 
        }
        .login-button { 
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); 
            color: white; 
            padding: 15px 35px; 
            text-decoration: none; 
            border-radius: 25px; 
            font-weight: 600; 
            font-size: 16px; 
            display: inline-block; 
            transition: transform 0.3s ease; 
        }
        .login-button:hover { 
            transform: translateY(-2px); 
        }
        .security-alert { 
            background: #fef5e7; 
            border: 1px solid #f6e05e; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 25px 0; 
        }
        .security-alert h3 { 
            color: #744210; 
            margin-bottom: 12px; 
            font-size: 16px; 
        }
        .security-list { 
            color: #744210; 
            margin-left: 18px; 
        }
        .security-list li { 
            margin: 6px 0; 
            font-size: 14px; 
        }
        .next-steps { 
            background: #e6f3ff; 
            border: 1px solid #bee3f8; 
            padding: 25px; 
            border-radius: 10px; 
            margin: 25px 0; 
        }
        .next-steps h3 { 
            color: #1a365d; 
            margin-bottom: 15px; 
        }
        .steps-list { 
            color: #2a4365; 
            margin-left: 18px; 
        }
        .steps-list li { 
            margin: 8px 0; 
            font-weight: 500; 
            font-size: 14px; 
        }
        .divider { 
            height: 1px; 
            background: #e2e8f0; 
            margin: 30px 0; 
        }
        .support-section { 
            text-align: center; 
            background: #f7fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 25px 0; 
        }
        .support-section h4 { 
            color: #2d3748; 
            margin-bottom: 10px; 
        }
        .support-section p { 
            color: #4a5568; 
            font-size: 14px; 
        }
        .footer { 
            background: #2d3748; 
            color: white; 
            padding: 25px; 
            text-align: center; 
        }
        .footer p { 
            margin: 5px 0; 
            opacity: 0.8; 
            font-size: 13px; 
        }
        
        /* Role-specific styling */
        .student-accent { border-left-color: #48bb78 !important; }
        .supervisor-accent { border-left-color: #ed8936 !important; }
        
        @media (max-width: 600px) {
            .email-container { margin: 10px; }
            .content { padding: 25px 20px; }
            .header { padding: 25px 15px; }
            .detail-grid { grid-template-columns: 1fr; }
            .credential-row { flex-direction: column; text-align: center; }
            .credential-row .credential-value { margin-top: 8px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>🎓 Welcome to VISION FYP System</h1>
            <div class="role-badge">{{user_role}} Account</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="greeting">
                Dear {{to_name}},
            </div>
            
            <div class="welcome-section">
                <h3>🎉 Account Successfully Created!</h3>
                <p>Your {{user_role}} account has been successfully created in the VISION FYP Management System at <strong>{{university_name}}</strong>.</p>
                <p>You now have access to all the tools and resources needed for your FYP journey.</p>
            </div>
            
            <!-- Login Credentials -->
            <div class="credentials-box">
                <h3>🔐 Your Login Credentials</h3>
                
                <div class="credential-row">
                    <span class="credential-label">Username:</span>
                    <span class="credential-value">{{username}}</span>
                </div>
                
                <div class="credential-row">
                    <span class="credential-label">Password:</span>
                    <span class="credential-value">{{password}}</span>
                </div>
                
                <div class="credential-row">
                    <span class="credential-label">Role:</span>
                    <span class="credential-value">{{user_role}}</span>
                </div>
            </div>
            
            <!-- User Details -->
            <div class="user-details">
                <h3>👤 Your Account Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">ID Number</div>
                        <div class="detail-value">{{id_number}}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Department</div>
                        <div class="detail-value">{{department}}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">University</div>
                        <div class="detail-value">{{university_name}}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Email</div>
                        <div class="detail-value">{{to_email}}</div>
                    </div>
                    <!-- Conditional fields based on role -->
                    {{#if level}}
                    <div class="detail-item">
                        <div class="detail-label">Level</div>
                        <div class="detail-value">{{level}}</div>
                    </div>
                    {{/if}}
                    {{#if office_address}}
                    <div class="detail-item">
                        <div class="detail-label">Office</div>
                        <div class="detail-value">{{office_address}}</div>
                    </div>
                    {{/if}}
                </div>
            </div>
            
            <!-- Login Button -->
            <div class="login-section">
                <a href="{{login_url}}" class="login-button">🚀 Access Your Dashboard</a>
            </div>
            
            <!-- Security Notice -->
            <div class="security-alert">
                <h3>🔒 Important Security Guidelines</h3>
                <ul class="security-list">
                    <li><strong>Change your password</strong> immediately after first login</li>
                    <li>Use a strong password with letters, numbers, and symbols</li>
                    <li>Never share your login credentials with anyone</li>
                    <li>Always log out when finished using the system</li>
                </ul>
            </div>
            
            <!-- Next Steps -->
            <div class="next-steps">
                <h3>📋 Your Next Steps</h3>
                <ol class="steps-list">
                    <li>Click "Access Your Dashboard" to login</li>
                    <li>Change your default password</li>
                    <li>Complete your profile information</li>
                    {{#if (eq user_role "Student")}}
                    <li>Browse available FYP projects</li>
                    <li>Contact supervisors for project discussions</li>
                    <li>Submit your project proposal when ready</li>
                    {{else}}
                    <li>Create and publish FYP project proposals</li>
                    <li>Review student applications</li>
                    <li>Manage your supervision capacity</li>
                    {{/if}}
                </ol>
            </div>
            
            <div class="divider"></div>
            
            <!-- Support -->
            <div class="support-section">
                <h4>📞 Need Help?</h4>
                <p><strong>Support Email:</strong> {{contact_email}}</p>
                <p><strong>University Admin:</strong> Contact your university administrator</p>
                <p><strong>Documentation:</strong> Check the help section in your dashboard</p>
            </div>
            
            <div class="divider"></div>
            
            <div style="text-align: center; color: #4a5568;">
                <p>Welcome to the VISION FYP Management System family!</p>
                <p><strong>Best regards,<br>The VISION FYP Team</strong></p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>© {{year}} VISION FYP Management System. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this address.</p>
            <p>{{university_name}} | {{user_role}}: {{to_name}}</p>
        </div>
    </div>
</body>
</html>
```

## 🔧 Template Variables for Both Students & Supervisors:

```javascript
// Common variables for both roles
{
  to_name: "User Full Name",
  to_email: "user@university.edu",
  username: "generated_username",
  password: "temporary_password",
  user_role: "Student" or "Supervisor",
  id_number: "STU001" or "SUP001",
  department: "Computer Science",
  university_name: "University Name",
  login_url: "https://yoursite.com/auth/signin",
  contact_email: "support@vision-fyp.com",
  year: "2025",
  
  // Student-specific (optional)
  level: "PSM-1" or "PSM-2",
  
  // Supervisor-specific (optional)
  office_address: "Room 101, Faculty Building"
}
```

## ✨ Key Features of This Unified Template:

✅ **Role Detection** - Automatically adapts content based on user_role
✅ **Conditional Fields** - Shows level for students, office for supervisors
✅ **Professional Design** - Clean, modern, mobile-responsive layout
✅ **Security Focus** - Prominent security guidelines
✅ **Role-Specific Next Steps** - Different guidance for students vs supervisors
✅ **University Branding** - Customizable with university information
✅ **Comprehensive Support** - Multiple contact options

This single template will work perfectly for both students and supervisors, automatically adapting the content based on the user role! 🚀
