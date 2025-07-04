# 🛢️ AWS Aurora Setup Guide for Vision FYP Management System

## 🎯 **What You're Creating**

Based on your screenshot, you're setting up **Aurora (MySQL Compatible)** - perfect choice! This will give you:
- ✅ 3x faster performance than regular MySQL
- ✅ Auto-scaling capabilities  
- ✅ 99.99% availability
- ✅ Compatible with your existing code

## 📋 **Step-by-Step Aurora Setup**

### **Step 1: Database Creation Settings**

From your AWS RDS console:

1. **Engine Type**: ✅ **Aurora (MySQL Compatible)** (already selected)
2. **Edition**: Choose **Amazon Aurora MySQL-Compatible Edition**
3. **Version**: Select **Aurora MySQL 3.04.0 (compatible with MySQL 8.0.32)**
4. **Templates**: Select **Dev/Test** (for free tier) or **Production** (for live use)

### **Step 2: Capacity Settings**

**For Development/Testing:**
```
Capacity Type: Serverless v2
Minimum ACUs: 0.5
Maximum ACUs: 16
Automatic pause: After 1 hour of inactivity
```

**For Production:**
```
Capacity Type: Provisioned
Instance Class: db.t3.medium (free tier) or db.r6g.large
Multi-AZ: Yes (for high availability)
```

### **Step 3: Database Credentials**

```
DB cluster identifier: vision-fyp-cluster
Master username: admin
Master password: [Generate secure password - save this!]
```

### **Step 4: Connectivity Settings**

```
VPC: Default VPC
Subnet group: Default
Public access: YES (important for external access)
VPC security group: Create new
  - Name: vision-fyp-db-sg
  - Allow inbound: MySQL/Aurora (3306) from anywhere (0.0.0.0/0)
Database port: 3306
```

### **Step 5: Additional Configuration**

```
Initial database name: vision_fyp_management_system
DB parameter group: default.aurora-mysql8.0
Backup retention: 7 days
Monitoring: Enable Performance Insights
Encryption: Enable (recommended)
```

## ⏱️ **After Creation (5-10 minutes)**

### **Step 6: Get Connection Details**

1. **Go to RDS Dashboard** → Databases → Your cluster
2. **Copy the Endpoint**: 
   - Writer endpoint: `vision-fyp-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com`
3. **Note Region**: (e.g., us-east-1, us-west-2)

### **Step 7: Update Your Environment Variables**

Copy `.env.aws-aurora` to `.env` and update:

```env
# AWS Aurora Configuration
NODE_ENV=production
DB_HOST=vision-fyp-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com
DB_NAME=vision_fyp_management_system
DB_USER=admin
DB_PASSWORD=your-master-password-here
DB_PORT=3306
DB_SSL=true

# Generate this: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
JWT_SECRET=your-64-character-random-string-here
```

### **Step 8: Test Connection**

```bash
cd Backend
node test-aurora-connection.js
```

Expected output:
```
🧪 Testing AWS Aurora Database Connection...
✅ Successfully connected to Aurora!
✅ Database created/verified
✅ Aurora MySQL Version: 8.0.32
🎉 Aurora connection test PASSED!
```

## 🚀 **Deploy Your App**

### **Option A: Railway**
1. Connect GitHub repository
2. Add environment variables from your `.env`
3. Deploy automatically

### **Option B: Heroku**
```bash
heroku create vision-fyp-backend
heroku config:set DB_HOST=your-cluster-endpoint
heroku config:set DB_PASSWORD=your-password
# ... add all other variables
git push heroku main
```

### **Option C: AWS Elastic Beanstalk**
1. Create new application
2. Upload your code
3. Configure environment variables
4. Deploy

## 💰 **Cost Optimization**

### **Free Tier Limits (12 months):**
- 750 hours of Aurora usage per month
- Single-AZ deployment
- Up to 20GB of storage

### **Development Tips:**
- Use Serverless v2 with auto-pause
- Start with minimum ACUs (0.5)
- Single-AZ for development

### **Production Tips:**
- Enable Multi-AZ for redundancy
- Use appropriate ACU limits based on traffic
- Enable automated backups

## 🔐 **Security Best Practices**

1. **Security Group**: Only allow necessary IPs
2. **VPC**: Use private subnets in production
3. **Encryption**: Enable at rest and in transit
4. **IAM**: Use least privilege access
5. **Monitoring**: Enable CloudWatch and Performance Insights

## 🐛 **Troubleshooting**

### **Connection Issues:**
- ✅ Check security group allows port 3306
- ✅ Verify public access is enabled
- ✅ Ensure cluster is in "Available" state
- ✅ Test with `test-aurora-connection.js`

### **SSL Issues:**
- ✅ Set `DB_SSL=true` in environment
- ✅ Use `rejectUnauthorized: false` in config

### **Performance Issues:**
- ✅ Monitor ACU usage in CloudWatch
- ✅ Increase max ACUs if needed
- ✅ Check connection pooling settings

## 🎯 **Next Steps**

1. **Create Aurora cluster** with settings above
2. **Test connection** using the test script
3. **Update frontend** API URL to point to your deployed backend
4. **Deploy and test** end-to-end functionality

**Your Aurora database will be production-ready and scalable! 🎉**
