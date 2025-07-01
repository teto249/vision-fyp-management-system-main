const admin = require('firebase-admin');

class FirebaseService {
  constructor() {
    this.isConfigured = false;
    this.admin = null;
    
    try {
      // Initialize Firebase Admin SDK
      if (process.env.FIREBASE_ADMIN_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
        
        this.admin = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
        
        this.db = admin.firestore();
        this.auth = admin.auth();
        this.storage = admin.storage();
        this.messaging = admin.messaging();
        
        this.isConfigured = true;
        console.log('✅ Firebase Admin SDK initialized successfully');
      } else {
        console.warn('⚠️ Firebase Admin SDK not configured - missing FIREBASE_ADMIN_KEY');
      }
    } catch (error) {
      console.error('❌ Firebase Admin SDK initialization failed:', error.message);
    }
  }

  // Authentication methods
  async createUser(userData) {
    if (!this.isConfigured) {
      throw new Error('Firebase Admin SDK not configured');
    }
    
    try {
      const userRecord = await this.auth.createUser(userData);
      return { success: true, user: userRecord };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async verifyIdToken(idToken) {
    if (!this.isConfigured) {
      throw new Error('Firebase Admin SDK not configured');
    }
    
    try {
      const decodedToken = await this.auth.verifyIdToken(idToken);
      return { success: true, token: decodedToken };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Firestore methods
  async addDocument(collection, data) {
    if (!this.isConfigured) {
      throw new Error('Firebase Admin SDK not configured');
    }
    
    try {
      const docRef = await this.db.collection(collection).add(data);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getDocument(collection, docId) {
    if (!this.isConfigured) {
      throw new Error('Firebase Admin SDK not configured');
    }
    
    try {
      const doc = await this.db.collection(collection).doc(docId).get();
      if (doc.exists) {
        return { success: true, data: { id: doc.id, ...doc.data() } };
      } else {
        return { success: false, error: 'Document not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateDocument(collection, docId, data) {
    if (!this.isConfigured) {
      throw new Error('Firebase Admin SDK not configured');
    }
    
    try {
      await this.db.collection(collection).doc(docId).update(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteDocument(collection, docId) {
    if (!this.isConfigured) {
      throw new Error('Firebase Admin SDK not configured');
    }
    
    try {
      await this.db.collection(collection).doc(docId).delete();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Storage methods
  async uploadFile(fileName, fileBuffer, metadata = {}) {
    if (!this.isConfigured) {
      throw new Error('Firebase Admin SDK not configured');
    }
    
    try {
      const bucket = this.storage.bucket();
      const file = bucket.file(fileName);
      
      await file.save(fileBuffer, {
        metadata: metadata,
        public: true
      });
      
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      return { success: true, url: publicUrl };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteFile(fileName) {
    if (!this.isConfigured) {
      throw new Error('Firebase Admin SDK not configured');
    }
    
    try {
      const bucket = this.storage.bucket();
      await bucket.file(fileName).delete();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Push notification methods
  async sendNotification(token, notification, data = {}) {
    if (!this.isConfigured) {
      throw new Error('Firebase Admin SDK not configured');
    }
    
    try {
      const message = {
        notification: notification,
        data: data,
        token: token
      };
      
      const response = await this.messaging.send(message);
      return { success: true, messageId: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendMulticastNotification(tokens, notification, data = {}) {
    if (!this.isConfigured) {
      throw new Error('Firebase Admin SDK not configured');
    }
    
    try {
      const message = {
        notification: notification,
        data: data,
        tokens: tokens
      };
      
      const response = await this.messaging.sendMulticast(message);
      return { 
        success: true, 
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Utility methods
  isInitialized() {
    return this.isConfigured;
  }

  getServices() {
    if (!this.isConfigured) {
      return null;
    }
    
    return {
      db: this.db,
      auth: this.auth,
      storage: this.storage,
      messaging: this.messaging
    };
  }
}

module.exports = new FirebaseService();
