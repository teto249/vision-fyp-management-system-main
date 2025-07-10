// components/Documents/DocumentCard.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { FileText, Calendar, User, Download, Eye, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface DocumentCardProps {
  id: string;
  fileName: string;
  description: string;
  uploadDate: string;
  fileType: string;
  uploadedBy: string;
  fileSize?: number;
  onDelete?: () => void;
  onDownload?: () => void;
}


export function DocumentCard({
  id,
  fileName,
  description,
  uploadDate,
  fileType,
  uploadedBy,
  fileSize,
  onDelete,
  onDownload,
}: DocumentCardProps) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(1)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  const getFileTypeColor = (type: string): string => {
    const fileType = type.toLowerCase();
    if (fileType.includes('pdf')) return 'bg-red-500 text-white';
    if (fileType.includes('doc')) return 'bg-blue-500 text-white';
    if (fileType.includes('xls')) return 'bg-green-500 text-white';
    if (fileType.includes('ppt')) return 'bg-orange-500 text-white';
    if (fileType.includes('txt')) return 'bg-gray-500 text-white';
    if (fileType.includes('image')) return 'bg-purple-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const handleCardClick = useCallback(async () => {
    if (isDownloading || isNavigating) return;
    
    try {
      setIsNavigating(true);
      router.push(`/student/document/${id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  }, [id, router, isDownloading, isNavigating]);

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleDownloadClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDownload || isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadError(null);
      setDownloadSuccess(false);
      
      await onDownload();
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      setDownloadError(errorMessage);
      setTimeout(() => setDownloadError(null), 5000);
    } finally {
      setIsDownloading(false);
    }
  }, [onDownload, isDownloading]);

  const handleViewClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isNavigating) return;
    
    try {
      setIsNavigating(true);
      router.push(`/student/document/${id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  }, [id, router, isNavigating]);

  return (
    <div 
      className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 
                 transition-all duration-300 transform border border-gray-700 
                 ${isNavigating || isDownloading 
                   ? 'cursor-wait opacity-75' 
                   : 'hover:from-gray-700 hover:to-gray-800 hover:scale-[1.02] hover:shadow-2xl cursor-pointer hover:border-teal-500/50'
                 } 
                 group focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isNavigating && !isDownloading) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Document: ${fileName}. ${description ? description + '. ' : ''}Uploaded by ${uploadedBy} on ${formatDate(uploadDate)}. Click to view details.`}
    >
      
      {/* Header with file icon and actions */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl group-hover:from-teal-400 group-hover:to-teal-500 transition-all duration-300 shadow-lg flex-shrink-0">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-teal-300 transition-colors" title={fileName}>
              {fileName}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getFileTypeColor(fileType)}`}>
                {fileType.toUpperCase().replace('.', '')}
              </span>
              {fileSize && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-200">
                  {formatFileSize(fileSize)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
          <button
            onClick={handleViewClick}
            disabled={isNavigating}
            className={`p-2 rounded-lg text-white transition-all shadow-lg hover:shadow-xl ${
              isNavigating 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-teal-600 hover:bg-teal-700'
            }`}
            title="View Document"
            aria-label={`View ${fileName}`}
          >
            {isNavigating ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Eye size={16} />
            )}
          </button>
          {onDownload && (
            <button
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className={`p-2 rounded-lg text-white transition-all shadow-lg hover:shadow-xl relative ${
                downloadSuccess 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : downloadError 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : isDownloading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
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
              aria-label={`Download ${fileName}`}
            >
              {isDownloading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : downloadSuccess ? (
                <CheckCircle size={16} />
              ) : downloadError ? (
                <AlertCircle size={16} />
              ) : (
                <Download size={16} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="mb-4 overflow-hidden">
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-colors break-words" title={description}>
            {description}
          </p>
        </div>
      )}

      {/* Metadata footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700 group-hover:border-gray-600 transition-colors gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs text-gray-400 flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-shrink-0">
            <Calendar size={14} className="text-teal-400" />
            <span className="truncate" title={formatDate(uploadDate)}>{formatDate(uploadDate)}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <User size={14} className="text-teal-400" />
            <span className="truncate" title={uploadedBy}>{uploadedBy}</span>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isDownloading ? (
            <>
              <Clock size={12} className="text-blue-400 animate-pulse" />
              <span className="text-xs text-blue-400 font-medium">Processing</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle size={12} className="text-green-400" />
              <span className="text-xs text-green-400 font-medium">Downloaded</span>
            </>
          ) : downloadError ? (
            <>
              <AlertCircle size={12} className="text-red-400" />
              <span className="text-xs text-red-400 font-medium">Error</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Available</span>
            </>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {(isDownloading || isNavigating) && (
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <div className="flex items-center gap-3 bg-gray-800 bg-opacity-90 rounded-lg px-4 py-2">
            <div className="animate-spin h-5 w-5 border-2 border-teal-400 border-t-transparent rounded-full" />
            <span className="text-sm text-white font-medium">
              {isDownloading ? 'Downloading...' : 'Loading...'}
            </span>
          </div>
        </div>
      )}

      {/* Error tooltip */}
      {downloadError && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-lg shadow-lg z-10 max-w-48">
          <div className="flex items-center gap-1">
            <AlertCircle size={12} />
            <span className="truncate">{downloadError}</span>
          </div>
        </div>
      )}
    </div>
  );
}