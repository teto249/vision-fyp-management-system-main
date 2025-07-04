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
  const response = await fetch(`${BASE_URL}/student/documents/supervisor/${supervisorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new DocumentError(
      errorData.message || `Failed to fetch documents: ${response.status}`,
      response.status
    );
  }

  const data = await response.json();
  return data.documents || [];
};

export const getDocumentById = async (id: string, token: string): Promise<Document> => {
  const response = await fetch(`${BASE_URL}/student/documents/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new DocumentError(
      errorData.message || `Failed to fetch document: ${response.status}`,
      response.status
    );
  }

  const data = await response.json();
  if (!data.success || !data.document) {
    throw new DocumentError('Document not found');
  }

  // Handle base64 PDF content properly
  const doc = data.document;
  return {
    ...doc,
    fileUrl: doc.fileContent ? 
      `data:application/pdf;base64,${doc.fileContent}` : 
      undefined
  };
};

// Download document directly
export const downloadDocument = async (id: string, fileName: string, token: string): Promise<void> => {
  try {
    // Use the PDF endpoint for proper download
    const downloadUrl = `${BASE_URL}/student/documents/${id}/pdf`;
    
    // Create download link
    const link = window.document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.target = "_blank";
    
    // Add authorization header by creating a fetch request instead
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new DocumentError(`Failed to download document: ${response.status}`);
    }

    // Get the blob and create object URL
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    
    // Create download link with blob URL
    link.href = objectUrl;
    
    // Trigger download
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    
    // Clean up object URL
    window.URL.revokeObjectURL(objectUrl);
  } catch (error) {
    throw new DocumentError(
      error instanceof DocumentError ? error.message : 'Failed to download document'
    );
  }
};


// Error type for better error handling
export class DocumentError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'DocumentError';
  }
}



