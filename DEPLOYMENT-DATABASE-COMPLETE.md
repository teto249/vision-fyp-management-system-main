# 🚀 Complete Deployment Guide: From XAMPP to Cloud

## 🎯 **Your Current Situation**
- ✅ App works locally with XAMPP
- ❌ Need cloud database for deployment
- ❌ Environment variables need updating

## 📋 **Step-by-Step Deployment Process**

### **Phase 1: Choose & Setup Cloud Database (5-10 minutes)**

#### **Option A: PlanetScale (Recommended - FREE)**
1. **Sign up**: Go to https://planetscale.com → Sign up with GitHub
2. **Create database**: 
   - Name: `vision-fyp-db`
   - Region: Choose closest to your users
3. **Get connection string**:
   - Dashboard → Connect → Node.js
   - Copy the connection URL

#### **Option B: Railway MySQL (If using Railway for backend)**
1. **Add MySQL service** in Railway dashboard
2. **Copy environment variables** (auto-generated)

---

### **Phase 2: Update Environment Variables**

#### **For PlanetScale:**
Create/update your `.env` file:
```env
# Production Database
NODE_ENV=production
DATABASE_URL=mysql://username:password@hostname:3306/database?ssl={"rejectUnauthorized":true}
DB_SSL=true

# Security
JWT_SECRET=your-64-character-random-string-here
PORT=3000

# Frontend (update when you deploy to Vercel)
FRONTEND_URL=https://your-app.vercel.app

# Email
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

#### **For Railway:**
```env
NODE_ENV=production
DATABASE_URL=${MYSQL_URL}
DB_HOST=${MYSQL_HOST}
DB_NAME=${MYSQL_DATABASE}
DB_USER=${MYSQL_USERNAME}
DB_PASSWORD=${MYSQL_PASSWORD}
DB_PORT=${MYSQL_PORT}
DB_SSL=true
JWT_SECRET=your-secret
FRONTEND_URL=https://your-app.vercel.app
```

---

### **Phase 3: Test Locally with Cloud Database**

1. **Update your local .env** with cloud database credentials
2. **Test connection**:
```bash
cd Backend
node -e "require('./config/database').connectDB().then(() => console.log('✅ Connected!')).catch(console.error)"
```
3. **Start your app**:
```bash
npm run dev
```
4. **Verify it works**: Visit http://localhost:3000/health

---

### **Phase 4: Deploy Backend**

#### **Option A: Railway**
1. **Connect GitHub**: Link your repository
2. **Environment variables**: Add all from Phase 2
3. **Deploy**: Railway auto-deploys from GitHub

#### **Option B: Heroku**
1. **Create app**: `heroku create your-app-name`
2. **Set variables**: 
```bash
heroku config:set DATABASE_URL=your-db-url
heroku config:set JWT_SECRET=your-secret
# ... add all other variables
```
3. **Deploy**: `git push heroku main`

---

### **Phase 5: Deploy Frontend**

1. **Update API URL** in frontend:
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
# OR
NEXT_PUBLIC_API_URL=https://your-app.herokuapp.com
```

2. **Deploy to Vercel**:
```bash
cd Frontend
npm run build
vercel --prod
```

---

### **Phase 6: Final Configuration**

1. **Update CORS**: Add your Vercel URL to backend CORS settings
2. **Update environment variables**: Set production Frontend URL
3. **Test end-to-end**: Register, login, upload documents

---

## 🛠️ **Quick Setup Scripts**

### **Run Database Setup Wizard:**
```bash
cd Backend
node setup-database.js
```

### **Test Current Configuration:**
```bash
cd Backend
npm run dev
```

## 💡 **Troubleshooting**

### **Database Connection Issues:**
- ✅ Check SSL settings (`DB_SSL=true` for cloud)
- ✅ Verify connection string format
- ✅ Ensure database exists
- ✅ Check firewall/network settings

### **Environment Variables:**
- ✅ Use production values in deployment platform
- ✅ Never commit real credentials to git
- ✅ Test locally first

## 🎯 **What to Do Right Now**

1. **Choose database**: PlanetScale (free) or Railway (paid)
2. **Run setup**: `node setup-database.js`
3. **Test locally**: Update .env and test connection
4. **Deploy**: Follow Phase 4 & 5 above

**Need help with any step? Let me know which database you want to use and I'll provide detailed instructions!**
