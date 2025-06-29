"use client";
import { useState, useEffect } from "react";
import { DocumentCard } from "../components/Dcumnets/DocumentCard";
import { Document } from "../../types/document";
import { Loader2, AlertCircle, RefreshCcw, Upload, X, FileText } from "lucide-react";
import {
  getDocuments,
  uploadDocument,
} from "../../../api/SupervisorApi/Documnets";

// import { DocumentSkeleton } from "../../components/ui/Skeleton";
import { logger } from '../../../utils/logger';

// Temporary fallback for missing Skeleton component
const DocumentSkeleton = () => (
  <div className="animate-pulse bg-gray-800 rounded-lg p-6 h-48 flex flex-col gap-4">
    <div className="h-6 bg-gray-700 rounded w-2/3 mb-2" />
    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2" />
    <div className="h-3 bg-gray-700 rounded w-full" />
    <div className="h-3 bg-gray-700 rounded w-5/6" />
  </div>
);


interface ErrorState {
  message: string;
  code?: string;
  retry?: boolean;
}

interface UploadData {
  title: string;
  description: string;
  supervisorId?: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState<UploadData>({
    title: "",
    description: "",
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      const supervisorInfoStr = localStorage.getItem("supervisorInfo");


      if (!token || !supervisorInfoStr) {
        setError({
          message: "Authentication required",
          code: "AUTH_ERROR",
          retry: false,
        });
        return;
      }

      const supervisorInfo = JSON.parse(supervisorInfoStr);
      const supervisorId = supervisorInfo.userId || supervisorInfo.username;

      if (!supervisorId) {
        throw new Error("Invalid supervisor information");
      }

      const fetchedDocuments = await getDocuments(token, supervisorId);
      setDocuments(fetchedDocuments);
    } catch (error) {
      logger.error('Failed to fetch documents', error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    let errorMessage: string;
    let errorCode: string;
    let canRetry = true;

    if (error instanceof Error) {
      errorMessage = error.message;

      switch (true) {
        case error.message.includes("network"):
          errorCode = "NETWORK_ERROR";
          break;
        case error.message.includes("401"):
          errorCode = "AUTH_ERROR";
          canRetry = false;
          break;
        case error.message.includes("403"):
          errorCode = "PERMISSION_ERROR";
          canRetry = false;
          break;
        case error.message.includes("404"):
          errorCode = "NOT_FOUND";
          errorMessage = "Documents not found";
          break;
        default:
          errorCode = "UNKNOWN_ERROR";
      }
    } else {
      errorMessage = "An unexpected error occurred";
      errorCode = "UNKNOWN_ERROR";
    }

    setError({
      message: errorMessage,
      code: errorCode,
      retry: canRetry,
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadData((prev) => ({ ...prev, title: file.name }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedFile) {
        throw new Error("Please select a file to upload");
      }

      validateFileUpload(selectedFile);
      setUploadLoading(true);

      const { token, supervisorId } = await getSupervisorCredentials();
      const formData = createFormData(selectedFile, uploadData, supervisorId);
      const result = await uploadDocument(formData, token);

      if (result?.id) {
        await fetchDocuments();
        resetUploadState();
      }
    } catch (error) {
      logger.error('Upload failed', error);
      handleError(error);
    } finally {
      setUploadLoading(false);
    }
  };
  // Helper functions
  const validateFileUpload = (file: File) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (fileExt !== '.pdf') {
      throw new Error("Only PDF files are allowed");
    }

    if (file.size > maxSize) {
      throw new Error("File size must be less than 50MB");
    }
  };

  const getSupervisorCredentials = async () => {
    const token = localStorage.getItem("authToken");
    const supervisorInfoStr = localStorage.getItem("supervisorInfo");

    if (!token || !supervisorInfoStr) {
      throw new Error("Authentication required");
    }

    const supervisorInfo = JSON.parse(supervisorInfoStr);
    const supervisorId = supervisorInfo.userId || supervisorInfo.username;

    if (!supervisorId) {
      throw new Error("Invalid supervisor information");
    }

    return { token, supervisorId };
  };

  const createFormData = (file: File, data: UploadData, supervisorId: string) => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("supervisorId", supervisorId);
    return formData;
  };

  const resetUploadState = () => {
    setIsUploadOpen(false);
    setSelectedFile(null);
    setUploadData({ title: "", description: "" });
    setError(null);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className=" flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-semibold text-white text-center mb-2">
            Error Loading Documents
          </h2>
          <p className="text-gray-400 text-center mb-4">{error.message}</p>
          {error.code && (
            <p className="text-sm text-gray-500 text-center mb-4">
              Error Code: {error.code}
            </p>
          )}
          {error.retry && (
            <button
              onClick={fetchDocuments}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <RefreshCcw size={20} />
              Try Again
            </button>
          )}
          {!error.retry && error.code === "AUTH_ERROR" && (
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Documents</h1>
            <p className="mt-2 text-gray-400">Manage and view your uploaded documents</p>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg 
                     flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl"
          >
            <Upload size={20} />
            Upload Document
          </button>
        </header>

        {/* Document Grid with Loading States */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <DocumentSkeleton key={i} />
            ))
          ) : documents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No documents yet</h3>
              <p className="text-gray-400">Upload your first document to get started</p>
            </div>
          ) : (
            documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                {...doc}
                id={String(doc.id)}
                fileName={doc.title}
                uploadDate={doc.createdAt}
                description={doc.description ?? ""}
              />
            ))
          )}
        </div>

        {/* Upload Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full relative">
              <button
                onClick={resetUploadState}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-semibold text-white mb-4">Upload Document</h2>
              {error && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
                  <p className="text-red-500 text-sm">{error.message}</p>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-4">                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    File (Max 50MB)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf"
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
                    required
                  />
                  {selectedFile && (
                    <p className="text-xs text-gray-400 mt-1">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Description
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  {uploadLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Upload size={20} />
                      Upload
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
