"use client";
import { useState, useEffect, useCallback } from "react";
import { DocumentCard } from "../components/Documents/DocumentCard";
import { Document } from "../../types/document";
import {
  Loader2,
  AlertCircle,
  RefreshCcw,
  FileText,
  Search,
  CheckCircle,
  X,
} from "lucide-react";
import { getDocuments, downloadDocument } from "../../../api/StudentApi/Document";
import { logger } from "../../../utils/logger";

// Skeleton loader component
const DocumentSkeleton = () => (
  <div className="animate-pulse bg-gray-800/50 rounded-xl p-6 h-48 flex flex-col gap-4 backdrop-blur-sm">
    <div className="h-6 bg-gray-700/50 rounded-lg w-2/3 mb-2" />
    <div className="h-4 bg-gray-700/50 rounded-lg w-1/2 mb-2" />
    <div className="h-3 bg-gray-700/50 rounded-lg w-full" />
    <div className="h-3 bg-gray-700/50 rounded-lg w-5/6" />
  </div>
);

interface ErrorState {
  message: string;
  code?: string;
  retry?: boolean;
}

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      const studentInfoStr = localStorage.getItem("studentInfo");

      console.log("=== DEBUG STUDENT DOCUMENT FETCH ===");
      console.log("Token:", token ? "Present" : "Missing");
      console.log("Student Info String:", studentInfoStr);

      if (!token || !studentInfoStr) {
        setError({
          message: "Authentication required. Please log in again.",
          code: "AUTH_ERROR",
          retry: false,
        });
        return;
      }

      let studentInfo;
      try {
        studentInfo = JSON.parse(studentInfoStr);
      } catch (parseError) {
        console.error("Failed to parse student info:", parseError);
        setError({
          message: "Invalid session data. Please log in again.",
          code: "INVALID_SESSION",
          retry: false,
        });
        return;
      }

      console.log("Parsed Student Info:", studentInfo);

      const supervisorId = studentInfo.supervisorId || studentInfo.supervisor?.userId;
      console.log("Supervisor ID:", supervisorId);

      if (!supervisorId || supervisorId === null || supervisorId === undefined) {
        console.error("No supervisorId found in student info");
        setError({
          message: "No supervisor assigned. Please contact your administrator to assign a supervisor before accessing documents.",
          code: "NO_SUPERVISOR",
          retry: false,
        });
        return;
      }

      console.log("Fetching documents for supervisor:", supervisorId);
      const fetchedDocuments = await getDocuments(token, supervisorId);
      console.log("Fetched documents:", fetchedDocuments);
      setDocuments(fetchedDocuments);
      
      // Show success message if documents are found
      if (fetchedDocuments.length > 0) {
        addToast({
          type: 'success',
          message: `Found ${fetchedDocuments.length} document${fetchedDocuments.length > 1 ? 's' : ''}`,
          duration: 2000,
        });
      }
    } catch (error) {
      logger.error("Failed to fetch documents", error);
      handleError(error);
      
      // Add toast notification for errors
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to load documents',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array to prevent infinite loop

  const handleError = (error: unknown) => {
    let errorMessage: string;
    let errorCode: string;
    let canRetry = true;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Better error categorization
      if (error.message.includes("401") || error.message.includes("unauthorized")) {
        errorCode = "AUTH_ERROR";
        errorMessage = "Session expired. Please log in again.";
        canRetry = false;
      } else if (error.message.includes("403") || error.message.includes("forbidden")) {
        errorCode = "PERMISSION_ERROR";
        errorMessage = "You don't have permission to access these documents.";
        canRetry = false;
      } else if (error.message.includes("404") || error.message.includes("not found")) {
        errorCode = "NOT_FOUND";
        errorMessage = "Documents not found. Please check with your supervisor.";
        canRetry = true;
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorCode = "NETWORK_ERROR";
        errorMessage = "Network connection failed. Please check your internet connection.";
        canRetry = true;
      } else if (error.message.includes("supervisor")) {
        errorCode = "NO_SUPERVISOR";
        errorMessage = "No supervisor assigned. Please contact your administrator.";
        canRetry = false;
      } else {
        errorCode = "UNKNOWN_ERROR";
        errorMessage = error.message || "An unexpected error occurred";
        canRetry = true;
      }
    } else {
      errorMessage = "An unexpected error occurred. Please try again.";
      errorCode = "UNKNOWN_ERROR";
      canRetry = true;
    }

    setError({ message: errorMessage, code: errorCode, retry: canRetry });
  };

  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        addToast({
          type: 'error',
          message: 'Please log in to download documents',
        });
        return;
      }

      // Check if document exists before attempting download
      const document = documents.find(doc => String(doc.id) === documentId);
      if (!document) {
        addToast({
          type: 'error',
          message: 'Document not found',
        });
        return;
      }

      addToast({
        type: 'info',
        message: `Preparing download for ${fileName}...`,
        duration: 2000,
      });

      console.log("Downloading document:", documentId, fileName);
      await downloadDocument(documentId, fileName, token);
      
      addToast({
        type: 'success',
        message: `${fileName} downloaded successfully!`,
        duration: 4000,
      });
      
      logger.info("Document downloaded successfully:", fileName);
    } catch (error) {
      logger.error("Failed to download document:", error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'You don\'t have permission to download this document.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Document not found on server.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      addToast({
        type: 'error',
        message: `Failed to download ${fileName}: ${errorMessage}`,
        duration: 6000,
      });
    }
  };

  const filteredDocuments = documents
    .filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return a.title.localeCompare(b.title);
    });

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DocumentSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    const getErrorTitle = () => {
      switch (error.code) {
        case "NO_SUPERVISOR":
          return "No Supervisor Assigned";
        case "AUTH_ERROR":
          return "Authentication Required";
        case "PERMISSION_ERROR":
          return "Access Denied";
        case "NOT_FOUND":
          return "Documents Not Found";
        case "NETWORK_ERROR":
          return "Connection Problem";
        case "INVALID_SESSION":
          return "Invalid Session";
        default:
          return "Error Loading Documents";
      }
    };

    const getErrorAction = () => {
      switch (error.code) {
        case "NO_SUPERVISOR":
          return (
            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl transition-all"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.href = "/student"}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          );
        case "AUTH_ERROR":
        case "INVALID_SESSION":
          return (
            <button
              onClick={() => window.location.href = "/login"}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl transition-all"
            >
              Go to Login
            </button>
          );
        default:
          return error.retry ? (
            <div className="space-y-3">
              <button
                onClick={fetchDocuments}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCcw className="h-5 w-5" />
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl transition-all"
              >
                Go Back
              </button>
            </div>
          ) : (
            <button
              onClick={() => window.location.href = "/student"}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl transition-all"
            >
              Go to Dashboard
            </button>
          );
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 max-w-md w-full shadow-xl border border-gray-700">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white text-center mb-2">
            {getErrorTitle()}
          </h2>
          <p className="text-gray-400 text-center mb-6 leading-relaxed">{error.message}</p>
          {getErrorAction()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Course Documents
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p className="text-gray-400">Access your course materials</p>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "title")}
                className="bg-gray-800/50 backdrop-blur-sm text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>
        </header>

        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={String(doc.id)}
                fileName={doc.title}
                description={doc.description ?? ""}
                uploadDate={doc.createdAt}
                fileType={doc.fileType}
                uploadedBy={doc.uploadedBy}
                onDownload={() => handleDownload(String(doc.id), doc.title)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-xl">
            <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              No documents found
            </h3>
            <p className="text-gray-400">
              {searchQuery
                ? "Try adjusting your search"
                : "No documents have been shared yet"}
            </p>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className={`rounded-xl p-4 text-white shadow-2xl backdrop-blur-sm transform transition-all duration-500 ease-out ${
              toast.type === 'success'
                ? 'bg-gradient-to-r from-green-600/90 to-green-700/90 border border-green-500/50'
                : toast.type === 'error'
                ? 'bg-gradient-to-r from-red-600/90 to-red-700/90 border border-red-500/50'
                : 'bg-gradient-to-r from-blue-600/90 to-blue-700/90 border border-blue-500/50'
            } animate-in slide-in-from-right-full fade-in duration-300`}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' ? (
                  <CheckCircle size={20} className="text-green-200" />
                ) : toast.type === 'error' ? (
                  <AlertCircle size={20} className="text-red-200" />
                ) : (
                  <FileText size={20} className="text-blue-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-relaxed break-words">{toast.message}</p>
                {toast.type === 'info' && (
                  <div className="mt-2 w-full bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-white h-1 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: '0%', animation: `progress ${toast.duration || 3000}ms linear forwards` }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 ml-2 text-white/70 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
