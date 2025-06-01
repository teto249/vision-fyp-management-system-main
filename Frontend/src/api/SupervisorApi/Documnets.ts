const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
  const response = await fetch(`${BASE_URL}/supervisor/documents/${supervisorId}/list`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.documents || [];
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
