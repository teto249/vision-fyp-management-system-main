// components/Documents/DocumentCard.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";

interface DocumentCardProps {
  id: string;
  fileName: string;
  description: string;
  uploadDate: string;
  status: "Opened" | "Not Open yet";
}

export function DocumentCard({
  id,
  fileName,
  description,
  uploadDate,
  status,
}: DocumentCardProps) {
  const router = useRouter();
  const statusColor = status === "Opened" ? "bg-green-600" : "bg-gray-500";
  const path  = usePathname();

  const handleViewDocument = () => {
    if (status === "Opened") {
      router.push(`${path}/${id}`);
    }
  };

  return (
    <div className="w-full bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white truncate max-w-[70%]">
            {fileName}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
            {status}
          </span>
        </div>

        <p className="text-gray-300 mb-4 line-clamp-2">{description}</p>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Uploaded:</span>
          <span className="text-gray-200">
            {new Date(uploadDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={handleViewDocument}
            disabled={status !== "Opened"}
            className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 ${
              status === "Opened"
                ? "bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {status === "Opened" ? "View Document" : "Preview Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}