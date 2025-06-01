"use client";
import { useState, useEffect } from "react";
import { DocumentCard } from "../components/Documents/DocumentCard";
import { Document } from "../../types/document";
import { Loader2 } from "lucide-react";
import { getDocuments } from "../../../api/SupervisorApi/Documnets";

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
console.log("Documents component mounted");


  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log("Fetching documents with token:", token);
        
        if (!token) throw new Error("Authentication required");
        
        const fetchedDocuments = await getDocuments(token);
        setDocuments(fetchedDocuments);
        console.log("Fetched documents:", fetchedDocuments);

      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDownloadAll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication required");

      documents.forEach((doc) => {
        const link = document.createElement("a");
        link.href = `${process.env.NEXT_PUBLIC_API_URL}/${doc.filePath}`;
        link.download = doc.title;
        link.click();
      });
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Documents</h1>
          {documents.length > 0 && (
            <button 
              onClick={handleDownloadAll}
              className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white"
            >
              Download All
            </button>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No documents available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id.toString()}
                fileName={doc.title}
                description={doc.description || ''}
                uploadDate={new Date(doc.createdAt).toISOString()}
                status="Opened"
                downloadLink={`${process.env.NEXT_PUBLIC_API_URL}/${doc.filePath}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
