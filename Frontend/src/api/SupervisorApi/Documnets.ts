const BASE_URL ='http://localhost:3000/api';

export interface Document {
  id: number;
  title: string;
  description?: string;
  fileType: string;
  fileContent?: string;
  fileUrl?: string;
  uploadedBy: string;
  supervisorId: string;
  studentId?: string;
  createdAt: string;
}

// Get all documents (metadata only)
export const getDocuments = async (token: string, supervisorId: string): Promise<Document[]> => {
  const url = `${BASE_URL}/supervisor/documents/${supervisorId}/list`;
  console.log("🌐 Full API URL:", url);
  console.log("🔑 Token (first 20 chars):", token.substring(0, 20) + "...");
  console.log("👤 Supervisor ID:", supervisorId);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response ok:", response.ok);
    console.log("📡 Response status text:", response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error Response:", errorText);
      
      // Handle 404 as empty documents (supervisor has no documents)
      if (response.status === 404) {
        console.log("📭 No documents found for supervisor (404):", supervisorId);
        return [];
      }
      
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("📋 API Response data:", data);
    
    // Handle different response formats
    if (data.success === false) {
      console.log("⚠️ API returned success: false, treating as empty:", data.message);
      return [];
    }
    
    // Handle empty documents array gracefully
    if (!data.documents) {
      console.log("📭 No documents property in response, returning empty array");
      return [];
    }
    
    if (!Array.isArray(data.documents)) {
      console.log("⚠️ Documents is not an array, returning empty array");
      return [];
    }
    
    console.log(`✅ Successfully fetched ${data.documents.length} documents`);
    return data.documents;
    
  } catch (error) {
    console.error("💥 Error in getDocuments:", error);
    console.error("💥 Error type:", typeof error);
  
    
    // If it's a network error or fetch fails, don't return empty array
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Network error - please check your connection");
    }
    
    // Re-throw other errors
    throw error;
  }
};

// Upload document
export const uploadDocument = async (
  formData: FormData,
  token: string
): Promise<Document> => {
  const response = await fetch(`${BASE_URL}/supervisor/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Upload failed');
  }

  return data.document;
};

// Get documents for specific student
export const getStudentDocuments = async (
  studentId: string,
  token: string
): Promise<Document[]> => {
  const response = await fetch(
    `${BASE_URL}/supervisor/students/${studentId}/documents`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.documents;
};
 
// Delete document
export const deleteDocument = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/supervisor/documents/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete document with status: ${response.status}`);
  }
};

// Get single document with full content
export const getDocumentById = async (id: string, token: string): Promise<Document> => {
  const response = await fetch(`${BASE_URL}/supervisor/documents/${id}/content`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch document with status: ${response.status}`);
  }

  const data = await response.json();
  const doc = data.document;

  if (!doc) {
    throw new Error('Document not found');
  }

  return {
    ...doc,
    fileUrl: doc.fileContent ? 
      `data:application/${doc.fileType.replace('.', '')};base64,${doc.fileContent}` : 
      undefined
  };
};
