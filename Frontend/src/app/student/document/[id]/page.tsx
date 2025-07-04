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

  const renderDocumentPreview = () => {
    if (!doc?.fileUrl) return null;

    // Ensure we have valid PDF data
    const isValidPdfUrl = doc.fileUrl.startsWith('data:application/pdf;base64,');

    if (!isValidPdfUrl) {
      return (
        <div className="mt-6 p-8 bg-gray-700 rounded-lg flex flex-col items-center justify-center">
          <FileText size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-400">Preview not available</p>
        </div>
      );
    }

    return (
      <div className="w-full h-[600px] rounded-lg mt-6 overflow-hidden bg-white">
        <object
          data={doc.fileUrl}
          type="application/pdf"
          className="w-full h-full"
        >
          <div className="flex flex-col items-center justify-center h-full bg-gray-700 rounded-lg">
            <p className="text-white mb-4">Unable to display PDF</p>
            <button
              onClick={handleDownload}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Download size={20} />
              Download Instead
            </button>
          </div>
        </object>
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
              disabled={isDownloading}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all shadow-lg hover:shadow-xl ${
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

        {renderDocumentPreview()}

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => router.push('/student/document')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Documents
          </button>
        </div>

      </div>
    </div>
  );
}
