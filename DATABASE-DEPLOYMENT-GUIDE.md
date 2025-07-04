# 🗄️ Database Setup for Deployment

## Current Issue
Your app is configured for XAMPP (localhost MySQL), but for deployment you need a cloud database service.

## ☁️ Recommended AWS RDS Database Options

### **🎯 RECOMMENDED: Aurora (MySQL Compatible)**
- ✅ 3x faster than standard MySQL
- ✅ Auto-scaling serverless option
- ✅ Compatible with your existing code
- ✅ AWS Free Tier: 750 hours/month for 12 months
- ✅ Built-in backups and monitoring

### Alternative Options:
- **MySQL** - Standard MySQL (simpler, but less features)
- **PostgreSQL** - Would require code changes (not recommended)

## 🚀 AWS RDS Aurora Setup Guide

### Step 1: Create Aurora Database
1. **Engine**: Select "Aurora (MySQL Compatible)"
2. **Version**: Choose latest MySQL 8.0 compatible
3. **Templates**: Select "Dev/Test" (for free tier)
4. **Capacity**: Choose "Serverless v2" 
5. **Scaling**: Set min 0.5 ACU, max 16 ACU

### Step 2: Database Configuration
- **DB name**: `vision_fyp_management_system`
- **Master username**: `admin` 
- **Master password**: Generate secure password
- **VPC**: Default VPC
- **Security group**: Create new (allow port 3306)

### Step 3: Important Settings
- ✅ **Public access**: YES (for external app access)
- ✅ **VPC security group**: Create new
- ✅ **Database port**: 3306
- ✅ **Parameter group**: default.aurora-mysql8.0
- ✅ **Backup retention**: 7 days
- ✅ **Encryption**: Enable

### Step 4: Get Connection Details
After database creation (5-10 minutes):

1. **Go to RDS Dashboard** → Your Aurora cluster
2. **Copy Endpoint**: `your-cluster.cluster-xxxxx.region.rds.amazonaws.com`
3. **Note the port**: 3306
4. **Save credentials**: Username and password from creation

### Step 5: Configure Security Group
1. **Go to EC2** → Security Groups
2. **Find your RDS security group**
3. **Add Inbound Rule**:
   - Type: MySQL/Aurora (3306)
   - Source: Anywhere (0.0.0.0/0) *for testing*
   - Source: Your deployment platform IPs (for production)

### Step 6: Update Environment Variables
```env
# AWS Aurora Database Configuration
NODE_ENV=production
DB_HOST=your-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com
DB_NAME=vision_fyp_management_system
DB_USER=admin
DB_PASSWORD=your-secure-password
DB_PORT=3306
DB_SSL=true

# Security
JWT_SECRET=your-64-character-random-string
PORT=3000

# Frontend URL
FRONTEND_URL=https://your-app.vercel.app
```

## 🛠️ Code Changes Needed

1. **Update database.js for SSL connections**
2. **Add environment-specific configs**
3. **Handle connection pooling for serverless**

## 📝 Alternative: Railway MySQL Setup

If deploying to Railway:

1. Add MySQL service in Railway dashboard
2. Railway auto-generates these variables:
   - `MYSQL_URL`
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USERNAME` 
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

## 🔧 Next Steps

1. Choose your preferred database service
2. I'll update the database.js configuration
3. Create production environment variables
4. Test the connection

**Which database service would you like to use?**
- A) PlanetScale (Free, easy setup)
- B) Railway MySQL (if using Railway for backend)
- C) AWS RDS (enterprise-grade)
- D) Other preference?

Let me know and I'll configure everything for you!
