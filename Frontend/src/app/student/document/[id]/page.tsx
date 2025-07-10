// app/documents/view/page.tsx
"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Document as DocumentType } from "../../../types/document";
import {
  Loader2,
  FileText,
  Download,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  AlertTriangle,
} from "lucide-react";
import {
  getDocumentById,
  downloadDocument,
} from "../../../../api/StudentApi/Document";
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
  const router = useRouter();
  const [doc, setDoc] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

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

  const handleDownload = async () => {
    if (!doc || isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadError(null);
      setDownloadSuccess(false);
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        setDownloadError("Authentication required");
        return;
      }

      logger.info("Downloading document:", doc.id, doc.title);
      await downloadDocument(String(doc.id), doc.title, token);
      logger.info("Document downloaded successfully:", doc.title);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      logger.error("Failed to download document:", err);
      setDownloadError(err instanceof Error ? err.message : "Failed to download document");
      setTimeout(() => setDownloadError(null), 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderDocumentInfo = () => {
    if (!doc?.id) return null;

    const fileSize = doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown size';
    const fileExtension = doc.fileType ? doc.fileType.toUpperCase().replace('.', '') : 'PDF';

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
              disabled={isDownloading}
              className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-medium shadow-lg hover:shadow-xl ${
                downloadSuccess 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : downloadError 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : isDownloading 
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
              title={
                downloadSuccess 
                  ? 'Downloaded successfully!' 
                  : downloadError 
                  ? `Error: ${downloadError}` 
                  : isDownloading 
                  ? 'Downloading...' 
                  : 'Download Document'
              }
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Downloading...
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle size={18} />
                  Downloaded!
                </>
              ) : downloadError ? (
                <>
                  <AlertCircle size={18} />
                  Retry Download
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download Document
                </>
              )}
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
                  The document will be downloaded to your default download folder.
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4">
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
    <div className="min-h-screen bg-gradient-to-br  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{doc.title}</h1>
            <p className="text-gray-400 text-lg mb-3">{doc.description}</p>
            <p className="text-sm text-gray-500">
              {doc.createdAt ? (
                <>Uploaded on {formatDate(doc.createdAt)}</>
              ) : (
                "Upload date not available"
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all shadow-lg hover:shadow-xl ${
                downloadSuccess 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : downloadError 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : isDownloading 
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
              title={
                downloadSuccess 
                  ? 'Downloaded successfully!' 
                  : downloadError 
                  ? `Error: ${downloadError}` 
                  : isDownloading 
                  ? 'Downloading...' 
                  : 'Download Document'
              }
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Downloading...
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle size={20} />
                  Downloaded!
                </>
              ) : downloadError ? (
                <>
                  <AlertCircle size={20} />
                  Retry Download
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download
                </>
              )}
            </button>
          </div>
        </div>

        {renderDocumentInfo()}

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => router.push('/student/document')}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={20} />
            Back to Documents
          </button>
        </div>
      </div>
    </div>
  );
}
