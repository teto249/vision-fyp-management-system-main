# Vision FYP Management System - Deployment Guide

## Vercel Deployment Steps

### Prerequisites
1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. Node.js 18+ installed locally

### Step 1: Prepare Your Repository

1. **Initialize Git repository** (if not already done):
   ```bash
   cd "C:\Users\User\Desktop\SEM-7\PSM-2\Coding\vision-fyp-management-system-main"
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to https://github.com
   - Click "New repository"
   - Name it "vision-fyp-management-system"
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/vision-fyp-management-system.git
   git push -u origin main
   ```

### Step 2: Backend Deployment (Heroku/Railway)

Since Vercel is primarily for frontend, you'll need to deploy your backend separately:

#### Option A: Railway (Recommended)
1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add a `Procfile` in your Backend directory:
   ```
   web: node app.js
   ```
6. Set environment variables in Railway dashboard
7. Deploy

#### Option B: Heroku
1. Install Heroku CLI
2. Create Heroku app:
   ```bash
   cd Backend
   heroku create vision-fyp-backend
   ```
3. Set config vars in Heroku dashboard
4. Deploy:
   ```bash
   git subtree push --prefix Backend heroku main
   ```

### Step 3: Frontend Deployment on Vercel

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Click "New Project"

2. **Import from GitHub**:
   - Select your GitHub repository
   - Click "Import"

3. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Root Directory: `Frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Set Environment Variables**:
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add all variables from your `.env.example` file:
     ```
     NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_tp785so
     NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=QVaGr3nMszMQF6-eC
     NEXT_PUBLIC_EMAILJS_USER_TEMPLATE=template_7h01cln
     NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE=template_7h01cln
     NEXT_PUBLIC_EMAILJS_UNIVERSITY_TEMPLATE=template_ebbzvbb
     NEXT_PUBLIC_EMAILJS_STUDENT_TEMPLATE=template_7h01cln
     NEXT_PUBLIC_EMAILJS_SUPERVISOR_TEMPLATE=template_7h01cln
     NEXT_PUBLIC_EMAILJS_BULK_SUMMARY_TEMPLATE=template_7h01cln
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

### Step 4: Update API URLs

After backend deployment, update the frontend API calls:

1. **Update the base URL** in API files:
   - `Frontend/src/api/StudentApi/Document.ts`
   - `Frontend/src/api/SupervisorApi/Documnets.ts`
   - All other API files

   Change:
   ```typescript
   const BASE_URL = 'http://localhost:3000/api';
   ```
   
   To:
   ```typescript
   const BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/api';
   ```

2. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Update API URLs for production"
   git push
   ```

### Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Step 6: Set Up Database

1. **For Production Database**:
   - Use managed MySQL service (PlanetScale, AWS RDS, etc.)
   - Update database credentials in backend environment variables
   - Run database migrations

### Troubleshooting

1. **Build Errors**:
   - Check Vercel function logs
   - Ensure all dependencies are in package.json
   - Check TypeScript errors

2. **Environment Variables**:
   - Ensure all NEXT_PUBLIC_ variables are set
   - Variables starting with NEXT_PUBLIC_ are exposed to the browser

3. **CORS Issues**:
   - Update CORS settings in backend to allow your Vercel domain
   - Add your domain to allowed origins

4. **Database Connection**:
   - Ensure database is accessible from your backend hosting platform
   - Check connection strings and credentials

### Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API is accessible
- [ ] User authentication works
- [ ] Document upload/download works
- [ ] Email notifications work
- [ ] All environment variables are set
- [ ] Database connections are working
- [ ] CORS is properly configured

### Monitoring

- Use Vercel Analytics for frontend monitoring
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor backend logs on your chosen platform

For support, check the deployment logs in Vercel dashboard or contact support.
