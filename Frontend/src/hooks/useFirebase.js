import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// Firebase Authentication Hook
export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout
  };
};

// Firebase Firestore Hook
export const useFirestore = () => {
  // Add document
  const addDocument = async (collectionName, data) => {
    try {
      const docRef = doc(collection(db, collectionName));
      await setDoc(docRef, { ...data, createdAt: new Date() });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Get document
  const getDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Document not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update document
  const updateDocument = async (collectionName, docId, data) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, { ...data, updatedAt: new Date() });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Delete document
  const deleteDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Query documents
  const queryDocuments = async (collectionName, field, operator, value) => {
    try {
      const q = query(collection(db, collectionName), where(field, operator, value));
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: documents };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Real-time listener
  const subscribeToCollection = (collectionName, callback, queryConfig = null) => {
    let q = collection(db, collectionName);
    
    if (queryConfig) {
      q = query(q, where(queryConfig.field, queryConfig.operator, queryConfig.value));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      callback(documents);
    });
    
    return unsubscribe;
  };

  return {
    addDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    queryDocuments,
    subscribeToCollection
  };
};

// Firebase Storage Hook
export const useFirebaseStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file, path) => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setUploading(false);
      setUploadProgress(100);
      
      return { success: true, url: downloadURL };
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      return { success: false, error: error.message };
    }
  };

  const deleteFile = async (path) => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    uploadProgress
  };
};

// Real-time University Data Hook
export const useUniversityData = (universityId) => {
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!universityId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'universities', universityId),
      (doc) => {
        if (doc.exists()) {
          setUniversity({ id: doc.id, ...doc.data() });
        } else {
          setError('University not found');
        }
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [universityId]);

  return { university, loading, error };
};

// Example usage components
export const FirebaseExample = () => {
  const { user, login, logout } = useFirebaseAuth();
  const { addDocument, queryDocuments } = useFirestore();
  const { uploadFile, uploading } = useFirebaseStorage();

  const handleAddUniversity = async () => {
    const result = await addDocument('universities', {
      name: 'Test University',
      students: 500,
      status: 'active'
    });
    
    if (result.success) {
      // University added
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const path = `documents/${Date.now()}-${file.name}`;
    const result = await uploadFile(file, path);
    
    if (result.success) {
      // File uploaded
    }
  };

  return (
    <div>
      <h2>Firebase Integration Example</h2>
      
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>
          <button onClick={handleAddUniversity}>Add Test University</button>
          <input type="file" onChange={handleFileUpload} disabled={uploading} />
        </div>
      ) : (
        <div>
          <p>Please login to use Firebase features</p>
        </div>
      )}
    </div>
  );
};
