export interface Document {
  id: number;
  title: string;
  description?: string;
  fileType: string;
  uploadedBy: string;
  supervisorId: string;
  studentId?: string;
  createdAt: string;
   fileSize?: number;
  // Full document data (only populated when viewing)
  fileUrl?: string;
  fileContent?: string;
}

