# Firebase Setup Guide for FYP Management System

This guide will help you set up Firebase services for your FYP Management System.

## 🔥 Firebase Services Available

1. **Firebase Authentication** - User login/signup
2. **Cloud Firestore** - NoSQL database
3. **Firebase Storage** - File storage for documents/images
4. **Cloud Messaging** - Push notifications
5. **Firebase Hosting** - Deploy your frontend
6. **Cloud Functions** - Serverless backend functions

## 📝 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `fyp-management-system`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 🌐 Step 2: Set Up Web App

1. In your Firebase project, click "Add app" → Web (</> icon)
2. Enter app nickname: `FYP Frontend`
3. Check "Also set up Firebase Hosting"
4. Click "Register app"
5. **Copy the Firebase configuration** (you'll need this)

## 🔧 Step 3: Configure Frontend Environment

Update `Frontend/.env.local` with your Firebase config:

```env
# Firebase Configuration (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🛡️ Step 4: Set Up Admin SDK (Backend)

1. In Firebase Console, go to "Project settings" → "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. **Copy the entire JSON content**
5. Update `Backend/.env` with the service account key:

```env
# Firebase Configuration (Backend)
FIREBASE_ADMIN_KEY={"type":"service_account","project_id":"your-project",...}
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

## 🔐 Step 5: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable these providers:
   - ✅ **Email/Password**
   - ✅ **Google** (optional)
   - ✅ **Anonymous** (for guest access)

## 📊 Step 6: Set Up Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to your users

### Firestore Security Rules (Basic):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow admins to read/write university data
    match /universities/{universityId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📁 Step 7: Configure Storage

1. Go to "Storage"
2. Click "Get started"
3. Start in test mode
4. Choose same location as Firestore

### Storage Security Rules (Basic):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload files
    match /documents/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to upload profile photos
    match /profiles/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔔 Step 8: Enable Cloud Messaging (Optional)

1. Go to "Cloud Messaging"
2. Generate a new key pair for Web push certificates
3. Copy the key pair ID

## 🚀 Step 9: Test Firebase Integration

### Backend Test:
```bash
cd Backend
node -e "const firebase = require('./utils/firebaseService'); console.log('Firebase configured:', firebase.isInitialized());"
```

### Frontend Test:
```bash
cd Frontend
npm run dev
# Check browser console for Firebase initialization logs
```

## 📱 Step 10: Deploy to Firebase Hosting (Optional)

```bash
cd Frontend
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🔧 Firebase Integration Examples

### Backend - Add Document:
```javascript
const firebaseService = require('./utils/firebaseService');

// Add university to Firestore
const result = await firebaseService.addDocument('universities', {
  name: 'Test University',
  students: 500,
  createdAt: new Date()
});
```

### Frontend - Authentication:
```javascript
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Login user
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### Frontend - Upload File:
```javascript
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload document
const uploadDocument = async (file) => {
  const storageRef = ref(storage, `documents/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
```

## 🎯 Recommended Firebase Features for Your Project

1. **Authentication** - Replace JWT with Firebase Auth
2. **Storage** - Store university logos and student documents
3. **Firestore** - Store real-time project updates and chat
4. **Cloud Messaging** - Notify users of project updates
5. **Analytics** - Track user engagement and system usage

## 🔒 Security Best Practices

1. **Never commit service account keys** to version control
2. **Use environment variables** for all Firebase config
3. **Set up proper Firestore security rules**
4. **Enable Firebase Security Rules**
5. **Use Firebase App Check** for production

## 🆘 Troubleshooting

### Common Issues:

1. **"Firebase not configured"**
   - Check environment variables are set
   - Verify Firebase config is valid JSON

2. **"Permission denied"**
   - Check Firestore security rules
   - Verify user is authenticated

3. **"Storage upload failed"**
   - Check storage security rules
   - Verify file size limits

## 📚 Next Steps

1. Configure Firebase as shown above
2. Test basic connectivity
3. Choose which features to implement:
   - 🔐 Replace JWT auth with Firebase Auth
   - 📁 Use Firebase Storage for file uploads
   - 📊 Add real-time features with Firestore
   - 🔔 Implement push notifications

Would you like me to help implement any specific Firebase features?
