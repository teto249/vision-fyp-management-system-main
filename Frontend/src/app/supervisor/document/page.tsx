import { DocumentCard } from "../components/Dcumnets/DocumentCard";
const documents = [
  {
    id: "1",
    fileName: "Project Proposal Template",
    description:
      "Standard template for all new project proposals with guidelines",
    uploadDate: "2023-10-15",
    status: "Opened" as const,
  },
  {
    id: "2",
    fileName: "Budget Planning Q4 2023",
    description: "Detailed budget breakdown for fourth quarter projects",
    uploadDate: "2023-10-16",
    status: "Opened" as const,
  },
  {
    id: "3",
    fileName: "Market Research Report - Tech Sector",
    description: "Comprehensive analysis of current tech market trends",
    uploadDate: "2023-10-17",
    status: "Opened" as const,
  },
];

export default function Documents() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Documents
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              fileName={doc.fileName}
              description={doc.description}
              uploadDate={doc.uploadDate}
              status={doc.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
