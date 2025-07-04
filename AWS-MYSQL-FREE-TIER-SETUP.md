# 🛢️ AWS MySQL Free Tier Setup Guide

## 🎯 **Smart Strategy: Use Free MySQL Now, Migrate Later**

You're using the **perfect approach**:
- ✅ Use AWS MySQL **free tier** for 12 months
- ✅ Build and deploy your app
- ✅ Migrate to PlanetScale (free forever) when ready
- ✅ No interruption to your users

## 📋 **AWS RDS MySQL Setup (Step-by-Step)**

### **Step 1: Create RDS MySQL Instance**

1. **Go to AWS Console** → RDS → Create Database
2. **Engine**: Select **MySQL** ✅ (as in your screenshot)
3. **Templates**: Choose **Free tier**
4. **Settings**:
   ```
   DB instance identifier: vision-fyp-mysql
   Master username: admin
   Master password: [Create secure password - SAVE THIS!]
   ```

### **Step 2: Configuration Settings**

**Instance Configuration:**
```
DB instance class: db.t3.micro (free tier eligible)
Storage type: General Purpose SSD (gp2)
Allocated storage: 20 GB (free tier max)
```

**Connectivity:**
```
VPC: Default VPC
Subnet group: default
Public access: YES (important!)
VPC security group: Create new
Security group name: vision-fyp-mysql-sg
```

**Database Options:**
```
Initial database name: vision_fyp_management_system
Port: 3306
Parameter group: default.mysql8.0
Option group: default:mysql-8-0
```

### **Step 3: Security Group Configuration**

After creation, configure security group:

1. **Go to EC2** → Security Groups
2. **Find**: `vision-fyp-mysql-sg`
3. **Edit Inbound Rules** → Add Rule:
   ```
   Type: MySQL/Aurora
   Protocol: TCP
   Port: 3306
   Source: Anywhere (0.0.0.0/0) - for testing
   ```
   *Note: In production, restrict to your app's IP*

### **Step 4: Get Connection Details**

After creation (5-10 minutes):

1. **Go to RDS** → Databases → `vision-fyp-mysql`
2. **Copy Endpoint**: `vision-fyp-mysql.xxxxx.us-east-1.rds.amazonaws.com`
3. **Note Port**: 3306
4. **Save Master Password**: The one you created

### **Step 5: Update Environment Variables**

Create/update your `.env` file:

```env
# AWS MySQL Database Configuration
NODE_ENV=production
DB_HOST=vision-fyp-mysql.xxxxx.us-east-1.rds.amazonaws.com
DB_NAME=vision_fyp_management_system
DB_USER=admin
DB_PASSWORD=your-master-password-here
DB_PORT=3306
DB_SSL=true

# Security
JWT_SECRET=your-64-character-random-string-here
PORT=3000

# Frontend URL (update when you deploy)
FRONTEND_URL=https://your-app.vercel.app

# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

### **Step 6: Test Connection**

```bash
cd Backend
node -e "
require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    });
    console.log('✅ AWS MySQL connected successfully!');
    await connection.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}
test();
"
```

## 🚀 **Deploy Your App**

### **Backend Deployment (Railway/Heroku)**

**Railway:**
1. Connect GitHub repository
2. Add environment variables from your `.env`
3. Deploy automatically

**Heroku:**
```bash
heroku create vision-fyp-backend
heroku config:set DB_HOST=your-rds-endpoint
heroku config:set DB_PASSWORD=your-password
heroku config:set DB_NAME=vision_fyp_management_system
heroku config:set DB_USER=admin
heroku config:set DB_SSL=true
heroku config:set JWT_SECRET=your-jwt-secret
git push heroku main
```

### **Frontend Deployment (Vercel)**

```bash
cd Frontend
# Update API URL to your deployed backend
echo "NEXT_PUBLIC_API_URL=https://your-backend.railway.app" > .env.production
vercel --prod
```

## 💰 **Free Tier Monitoring**

### **What's Included (12 months):**
- ✅ **750 hours/month** of db.t3.micro instance
- ✅ **20GB storage**
- ✅ **20GB backup storage**
- ✅ **10 million I/O requests**

### **Monitor Usage:**
1. **AWS Billing Dashboard** → Free Tier
2. **CloudWatch** → RDS metrics
3. **Set up billing alerts** at $5 threshold

## 📅 **Migration Plan (Month 10-11)**

When approaching free tier expiration:

### **Option 1: Migrate to PlanetScale (Recommended)**
1. **Export data** from AWS MySQL
2. **Create PlanetScale database**
3. **Import data** to PlanetScale
4. **Update connection string**
5. **Test thoroughly**
6. **Switch production**
7. **Delete AWS RDS**

### **Option 2: Continue with AWS (Paid)**
- Expect **$15-50/month** costs
- Monitor and optimize usage

## 🔧 **Troubleshooting**

### **Connection Issues:**
```bash
# Test connectivity
telnet your-rds-endpoint.amazonaws.com 3306

# Check security group
# Ensure port 3306 is open from 0.0.0.0/0
```

### **SSL Issues:**
```javascript
// Use this connection config
ssl: {
  require: true,
  rejectUnauthorized: false
}
```

### **Performance Issues:**
- Monitor RDS Performance Insights
- Check connection pooling settings
- Optimize queries

## 🎯 **Quick Checklist**

- [ ] Create AWS RDS MySQL instance
- [ ] Configure security group (port 3306)
- [ ] Get connection endpoint
- [ ] Update `.env` with AWS credentials
- [ ] Test connection locally
- [ ] Deploy backend with AWS variables
- [ ] Deploy frontend with backend URL
- [ ] Set up billing alerts
- [ ] Plan migration strategy for month 10

## 📞 **Need Help?**

If you encounter issues:
1. **Check security group** allows port 3306
2. **Verify RDS is publicly accessible**
3. **Ensure correct endpoint/credentials**
4. **Test with the connection script above**

**Your AWS MySQL setup will be ready for production! 🚀**
