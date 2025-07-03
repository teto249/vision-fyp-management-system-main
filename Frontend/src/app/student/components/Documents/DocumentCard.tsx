// components/Documents/DocumentCard.tsx
"use client";
import { useRouter } from "next/navigation";
import { FileText, Calendar, User, Download, Eye } from "lucide-react";

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

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getFileTypeColor = (type: string): string => {
    const fileType = type.toLowerCase();
    if (fileType.includes('pdf')) return 'bg-red-500 text-white';
    if (fileType.includes('doc')) return 'bg-blue-500 text-white';
    if (fileType.includes('xls')) return 'bg-green-500 text-white';
    if (fileType.includes('ppt')) return 'bg-orange-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const handleCardClick = () => {
    router.push(`/student/document/${id}`);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 hover:from-gray-700 hover:to-gray-800 
                 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl 
                 cursor-pointer group border border-gray-700 hover:border-teal-500/50"
      onClick={handleCardClick}
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
            <div className="flex items-center gap-2 mt-1">
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
            onClick={(e) => handleActionClick(e, () => router.push(`/student/document/${id}`))}
            className="p-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors"
            title="View Document"
          >
            <Eye size={16} />
          </button>
          {onDownload && (
            <button
              onClick={(e) => handleActionClick(e, onDownload)}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              title="Download Document"
            >
              <Download size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="mb-4 overflow-hidden">
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-200 transition-colors break-words">
            {description}
          </p>
        </div>
      )}

      {/* Metadata footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700 group-hover:border-gray-600 transition-colors gap-4">
        <div className="flex items-center gap-4 text-xs text-gray-400 flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-shrink-0">
            <Calendar size={14} className="text-teal-400" />
            <span className="truncate">{uploadDate}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <User size={14} className="text-teal-400" />
            <span className="truncate">{uploadedBy}</span>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">Available</span>
        </div>
      </div>
    </div>
  );
}