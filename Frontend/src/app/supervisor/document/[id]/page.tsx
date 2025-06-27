// app/documents/view/page.tsx
"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Document as DocumentType } from "../../../types/document";
import {
  Loader2,
  FileText,
  Download,
  Trash2,
  AlertTriangle,
  Calendar,
  User,
} from "lucide-react";
import {
  getDocumentById,
  deleteDocument,
} from "../../../../api/SupervisorApi/Documnets";
import { logger } from "../../../../utils/logger";

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Date not available";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    logger.error("Date formatting error:", error);
    return "Date not available";
  }
};

export default function DocumentViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();  const [doc, setDoc] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Unwrap params using React.use()
  const unwrappedParams = use(params);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        logger.info("Fetching document:", unwrappedParams.id);
        const document = await getDocumentById(unwrappedParams.id, token);
        logger.info("Document fetched successfully");

        setDoc(document);
      } catch (err) {
        logger.error("Failed to fetch document:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load document"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [unwrappedParams.id, router]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("authToken");

      if (!token || !doc) {
        throw new Error("Unable to delete document");
      }

      await deleteDocument(unwrappedParams.id, token);
      router.push("/supervisor/document");
    } catch (err) {
      logger.error("Failed to delete document:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete document"
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  const handleDownload = () => {
    if (!doc?.id) return;

    // Create direct PDF download link
    const downloadUrl = `http://localhost:3000/api/supervisor/documents/${doc.id}/pdf`;
    const fileName = `${doc.title}${doc.fileType}`;

    // Create an anchor element and trigger download
    const a = window.document.createElement("a");
    a.href = downloadUrl;
    a.download = fileName;
    a.target = "_blank";
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };  const renderDocumentInfo = () => {
    if (!doc?.id) return null;

    return (
      <div className="mt-6 space-y-4">
        {/* Document Info Card */}
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Document Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <FileText size={16} />
              <span>Type: {doc.fileType.toUpperCase().replace('.', '')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar size={16} />
              <span>Uploaded: {doc.createdAt ? formatDate(doc.createdAt) : 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <User size={16} />
              <span>Document ID: {doc.id}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-600 rounded-lg">
            <p className="text-gray-300 text-sm">
              <strong>Note:</strong> To view this document, please download it and open with your preferred PDF viewer.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-gray-400 mt-2">{error || "Document not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">{doc.title}</h1>
            <p className="text-gray-400 mt-2">{doc.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {doc.createdAt ? (
                <>Uploaded on {formatDate(doc.createdAt)}</>
              ) : (
                "Upload date not available"
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Download size={20} />
              Download
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Trash2 size={20} />
              Delete
            </button>
          </div>
        </div>

        {renderDocumentInfo()}

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <AlertTriangle size={24} />
                <h2 className="text-xl font-semibold">Delete Document</h2>
              </div>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete &quot;{doc.title}&quot;? This
                action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={20} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
