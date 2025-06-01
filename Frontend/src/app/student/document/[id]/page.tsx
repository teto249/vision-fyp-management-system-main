"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Document } from "../../../types/document";
import { Loader2, ArrowLeft } from "lucide-react";
import { getDocuments } from "../../../../api/SupervisorApi/Documnets";

export default function DocumentViewPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");

        const documents = await getDocuments(token);
        const foundDocument = documents.find(
          (doc) => doc.id.toString() === id
        );

        if (!foundDocument) {
          throw new Error("Document not found");
        }

        setDocument(foundDocument);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load document"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white">
            {error || "Document Not Found"}
          </h1>
          <button
            onClick={handleGoBack}
            // variant="outline"
            className="mt-4 bg-teal-600 hover:bg-teal-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{document?.title}</h1>
          <button
            onClick={handleGoBack}
            className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-400">{document?.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Uploaded on:{" "}
              {document?.createdAt &&
                new Date(document.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_API_URL}/${document?.filePath}`,
                "_blank"
              )
            }
            className="w-full bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white"
          >
            Download Document
          </button>
        </div>
      </div>
    </div>
  );
}
