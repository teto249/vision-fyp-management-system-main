# 🆓 FREE Database Setup: PlanetScale (Recommended)

## Why PlanetScale?
- ✅ **$0/month FOREVER**
- ✅ 5GB storage (enough for your app)
- ✅ MySQL compatible (no code changes)
- ✅ 1 billion reads/month
- ✅ 10 million writes/month
- ✅ No credit card required

## 🚀 Quick PlanetScale Setup (5 minutes)

### Step 1: Create Account
1. Go to https://planetscale.com
2. Click "Sign up"
3. Choose "Continue with GitHub"
4. Authorize PlanetScale

### Step 2: Create Database
1. Click "Create database"
2. Name: `vision-fyp-db`
3. Region: Choose closest to you
4. Click "Create database"

### Step 3: Get Connection String
1. Go to your database dashboard
2. Click "Connect"
3. Select "Node.js"
4. Copy the connection string

It will look like:
```
mysql://username:password@aws.connect.psdb.cloud/vision-fyp-db?ssl={"rejectUnauthorized":true}
```

### Step 4: Update Your .env File
Replace your current database config with:

```env
# PlanetScale Database (FREE)
NODE_ENV=production
DATABASE_URL=mysql://username:password@aws.connect.psdb.cloud/vision-fyp-db?ssl={"rejectUnauthorized":true}
DB_SSL=true

# Security
JWT_SECRET=your-64-character-random-string
PORT=3000

# Frontend
FRONTEND_URL=https://your-app.vercel.app

# Email
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### Step 5: Test Connection
```bash
cd Backend
node -e "
const { connectDB } = require('./config/database');
connectDB().then(() => {
  console.log('✅ PlanetScale connected successfully!');
  process.exit(0);
}).catch((err) => {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
});
"
```

## 🆚 **Free Tier Comparison**

| Service | Cost | Storage | MySQL Compatible | Setup Time |
|---------|------|---------|------------------|------------|
| **PlanetScale** | ✅ $0 forever | 5GB | ✅ Yes | 5 min |
| Supabase | ✅ $0 forever | 500MB | ❌ PostgreSQL | 5 min |
| AWS Aurora | ❌ Free 12mo only | 20GB | ✅ Yes | 15 min |
| Railway | ❌ $5/month | 1GB | ✅ Yes | 5 min |

## 💡 **Why Not AWS Aurora?**

While Aurora is powerful, it's **not truly free**:
- ❌ Only free for first 12 months
- ❌ Requires credit card
- ❌ Can be expensive after free tier
- ❌ More complex setup

**PlanetScale is actually better for your use case!**

## 🎯 **Next Steps**

1. **Sign up for PlanetScale** (takes 2 minutes)
2. **Create database** and get connection string
3. **Update your .env** with PlanetScale credentials
4. **Test locally** to make sure it works
5. **Deploy** your app with confidence

**PlanetScale will handle all your database needs for free, forever! 🎉**

Need help with the PlanetScale setup? I can walk you through each step!
