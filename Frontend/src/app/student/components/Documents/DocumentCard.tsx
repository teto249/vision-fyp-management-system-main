// components/Documents/DocumentCard.tsx
"use client";
import { useRouter } from "next/navigation";
import { FileText, Calendar, User } from "lucide-react";

interface DocumentCardProps {
  id: string;
  fileName: string;
  description: string;
  uploadDate: string;
  fileType: string;
  uploadedBy: string;
  onDelete?: () => void;
}

export function DocumentCard({
  id,
  fileName,
  description,
  uploadDate,
  fileType,
  uploadedBy,
  onDelete,
}: DocumentCardProps) {
  const router = useRouter();

  return (
    <div
      className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-200 
                 transform hover:scale-[1.02] cursor-pointer group"
      onClick={() => router.push(`/student/document/${id}`)}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gray-700 rounded-lg group-hover:bg-gray-600 transition-colors">
          <FileText className="h-8 w-8 text-teal-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{fileName}</h3>
          {description && (
            <p className="text-gray-400 mt-1 text-sm line-clamp-2">{description}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
              {fileType.toUpperCase()}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
              {uploadDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}