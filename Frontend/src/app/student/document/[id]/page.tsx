'use client';
import { useRouter, useParams } from "next/navigation";

const documents = [
  {
    id: "1",
    fileName: "Project Proposal Template",
    description: "Standard template for all new project proposals with guidelines",
    content: "This is the content of the Project Proposal Template.",
  },
  {
    id: "2",
    fileName: "Budget Planning Q4 2023",
    description: "Detailed budget breakdown for fourth quarter projects",
    content: "This is the content of the Budget Planning Q4 2023 document.",
  },
  {
    id: "3",
    fileName: "Market Research Report - Tech Sector",
    description: "Comprehensive analysis of current tech market trends",
    content: "This is the content of the Market Research Report - Tech Sector.",
  },
];

export default function DocumentViewPage() {
  const router = useRouter();
  const params = useParams(); 
  const { id } = params;

  const document = documents.find((doc) => doc.id === id);

  const handleGoBack = () => {
    router.back();
  };

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white">Document Not Found</h1>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
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
        <h1 className="text-2xl font-bold text-white">{document.fileName}</h1>
        <p className="text-gray-400 mt-2">{document.description}</p>

        <div className="mt-6 bg-gray-700 p-6 rounded-lg">
          <div className="whitespace-pre-wrap text-gray-200">{document.content}</div>
        </div>
        <button
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
