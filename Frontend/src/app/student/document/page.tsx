"use client";
import { useState, useEffect } from "react";
import { DocumentCard } from "../components/Documents/DocumentCard";
import { Document } from "../../types/document";
import {
  Loader2,
  AlertCircle,
  RefreshCcw,
  FileText,
  Search,
} from "lucide-react";
import { getDocuments } from "../../../api/StudentApi/Document";
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

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      const studentInfoStr = localStorage.getItem("studentInfo");

      if (!token || !studentInfoStr) {
        setError({
          message: "Authentication required",
          code: "AUTH_ERROR",
          retry: false,
        });
        return;
      }

      const studentInfo = JSON.parse(studentInfoStr);
      console.log("student Info from the document component :", studentInfo);
      const supervisorId = studentInfo.supervisorId;

      if (!supervisorId) {
        throw new Error("Invalid supervisor information");
      }

      const fetchedDocuments = await getDocuments(token, supervisorId);
      setDocuments(fetchedDocuments);
    } catch (error) {
      logger.error("Failed to fetch documents", error);
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
      errorCode = error.message.includes("401")
        ? "AUTH_ERROR"
        : error.message.includes("network")
        ? "NETWORK_ERROR"
        : error.message.includes("404")
        ? "NOT_FOUND"
        : "UNKNOWN_ERROR";
      canRetry = !error.message.includes("401");
    } else {
      errorMessage = "An unexpected error occurred";
      errorCode = "UNKNOWN_ERROR";
    }

    setError({ message: errorMessage, code: errorCode, retry: canRetry });
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 max-w-md w-full shadow-xl">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white text-center mb-2">
            Error Loading Documents
          </h2>
          <p className="text-gray-400 text-center mb-6">{error.message}</p>
          {error.retry ? (
            <button
              onClick={fetchDocuments}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCcw className="h-5 w-5" />
              Try Again
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl transition-all"
            >
              Go to Login
            </button>
          )}
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
                {...doc}
                id={String(doc.id)}
                fileName={doc.title}
                uploadDate={doc.createdAt}
                description={doc.description ?? ""}
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
    </div>
  );
}
