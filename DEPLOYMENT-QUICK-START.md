# 🚀 Vision FYP Management System - Complete Deployment Guide

## Quick Start Deployment Steps

### 1. Prerequisites Setup
```bash
# Ensure you have these installed:
- Node.js 18+ 
- Git
- GitHub account
- Vercel account (vercel.com)
```

### 🔧 Backend Fix Applied
✅ **Important**: Backend deployment issues have been fixed:
- Fixed case-sensitivity error in module imports
- Added missing start script to package.json
- Created Procfile for deployment
- All modules now load correctly

See `BACKEND-FIX-APPLIED.md` for details.

### 2. Initialize Git Repository
```bash
cd "C:\Users\User\Desktop\SEM-7\PSM-2\Coding\vision-fyp-management-system-main"

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit for deployment"
```

### 3. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `vision-fyp-management-system`
3. Set to Public or Private
4. Don't initialize with README
5. Click "Create repository"

### 4. Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vision-fyp-management-system.git
git push -u origin main
```

### 5. Backend Deployment (Railway - Recommended)

#### Option A: Railway
1. Visit https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set Root Directory to: `Backend`
6. Add these environment variables in Railway dashboard:
   ```
   NODE_ENV=production
   PORT=3000
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   JWT_SECRET=your-jwt-secret-key
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   ```
7. Deploy and note your backend URL (e.g., `https://vision-fyp-backend.railway.app`)

#### Option B: Heroku
```bash
# Install Heroku CLI first
cd Backend
heroku create vision-fyp-backend
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=your-database-host
# ... add other env vars
git subtree push --prefix Backend heroku main
```

### 6. Frontend Deployment (Vercel)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "New Project"

2. **Import from GitHub**
   - Select your repository
   - Click "Import"

3. **Configure Project Settings**
   - Framework Preset: **Next.js**
   - Root Directory: **Frontend**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Set Environment Variables**
   In Vercel Project Settings → Environment Variables, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_tp785so
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=QVaGr3nMszMQF6-eC
   NEXT_PUBLIC_EMAILJS_USER_TEMPLATE=template_7h01cln
   NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE=template_7h01cln
   NEXT_PUBLIC_EMAILJS_UNIVERSITY_TEMPLATE=template_ebbzvbb
   NEXT_PUBLIC_EMAILJS_STUDENT_TEMPLATE=template_7h01cln
   NEXT_PUBLIC_EMAILJS_SUPERVISOR_TEMPLATE=template_7h01cln
   NEXT_PUBLIC_EMAILJS_BULK_SUMMARY_TEMPLATE=template_7h01cln
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Note your frontend URL (e.g., `https://vision-fyp.vercel.app`)

### 7. Post-Deployment Configuration

1. **Update Backend CORS**
   Add your Vercel domain to CORS settings in `Backend/app.js`:
   ```javascript
   const cors = require('cors');
   
   app.use(cors({
     origin: [
       'http://localhost:3001',
       'https://vision-fyp.vercel.app',  // Add your Vercel URL
       'https://your-custom-domain.com'  // Add custom domain if any
     ],
     credentials: true
   }));
   ```

2. **Database Setup**
   - Use a cloud database (PlanetScale, AWS RDS, MongoDB Atlas)
   - Update connection strings in backend environment variables
   - Run database migrations if needed

3. **Test the Deployment**
   - Visit your Vercel URL
   - Test user registration and login
   - Test document upload/download
   - Test email notifications

### 8. Custom Domain (Optional)

1. In Vercel dashboard: Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### 9. Monitoring and Maintenance

- **Vercel Analytics**: Enable in project settings
- **Error Tracking**: Consider Sentry integration
- **Database Monitoring**: Set up alerts for your database
- **Backup Strategy**: Regular database backups

## Troubleshooting Common Issues

### Build Failures
```bash
# Check logs in Vercel dashboard
# Common fixes:
1. Ensure all dependencies are in package.json
2. Fix TypeScript errors
3. Check environment variables
```

### API Connection Issues
```bash
# Verify environment variables
1. NEXT_PUBLIC_API_URL is set correctly
2. Backend is accessible from browser
3. CORS is configured properly
```

### Database Connection
```bash
# Check backend logs
1. Database credentials are correct
2. Database is accessible from hosting platform
3. Connection string format is correct
```

### Email Not Working
```bash
# Verify EmailJS configuration
1. Service ID is correct
2. Template IDs exist in EmailJS dashboard
3. Public key is valid
```

## Quick Commands

```bash
# Local development
npm run dev

# Production build test
npm run build

# Deploy to Vercel (using CLI)
npx vercel --prod

# View deployment logs
npx vercel logs
```

## Environment Variables Checklist

### Frontend (Vercel)
- [ ] NEXT_PUBLIC_API_URL
- [ ] NEXT_PUBLIC_EMAILJS_SERVICE_ID
- [ ] NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
- [ ] All other NEXT_PUBLIC_EMAILJS_* variables
- [ ] All NEXT_PUBLIC_FIREBASE_* variables

### Backend (Railway/Heroku)
- [ ] NODE_ENV=production
- [ ] PORT (automatically set by platform)
- [ ] Database connection variables
- [ ] JWT_SECRET
- [ ] Email service variables

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Next.js Docs**: https://nextjs.org/docs

For project-specific issues, check the deployment logs in your hosting platform's dashboard.
