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

      
        const document = await getDocumentById(unwrappedParams.id, token);
       

        setDoc(document);
      } catch (err) {
    
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

    const fileSize = doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown size';
    const fileExtension = doc.fileType.toUpperCase().replace('.', '');

    return (
      <div className="mt-8 space-y-6">
        {/* Enhanced Document Preview Card */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-teal-600 rounded-xl p-3">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Document Preview</h3>
                <p className="text-gray-400 text-sm">View document details and metadata</p>
              </div>
            </div>
            <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium">
              {fileExtension}
            </div>
          </div>

          {/* Document Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-teal-400" />
                <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Upload Date</span>
              </div>
              <p className="text-white font-medium">
                {doc.createdAt ? formatDate(doc.createdAt) : 'Unknown'}
              </p>
            </div>
            
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-teal-400" />
                <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">File Type</span>
              </div>
              <p className="text-white font-medium">{fileExtension} Document</p>
            </div>

            <div className="bg-gray-600 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-teal-400" />
                <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Document ID</span>
              </div>
              <p className="text-white font-medium text-sm font-mono">#{doc.id}</p>
            </div>
          </div>

          {/* Document Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={handleDownload}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
            >
              <Download size={18} />
              Download Document
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
            >
              <Trash2 size={18} />
              Delete Document
            </button>
          </div>
          
          {/* Information Banner */}
          <div className="bg-blue-900/30 border border-blue-800/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 rounded-full p-1">
                <AlertTriangle size={14} className="text-white" />
              </div>
              <div>
                <h4 className="text-blue-300 font-medium text-sm mb-1">Viewing Instructions</h4>
                <p className="text-blue-200 text-sm leading-relaxed">
                  To view this document, please download it and open with your preferred PDF viewer. 
                  The document will open in a new tab for easy access.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-4">Document Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">1</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">{fileExtension}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Format</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">{fileSize}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Active</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Status</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className=" py-12 px-4">
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
    <div className=" py-12 px-4 sm:px-6 lg:px-8">
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
