// app/documents/view/page.tsx
"use client";
import { useRouter } from "next/navigation";

export default function DocumentViewPage({ params }) {
  const router = useRouter();

  const handelGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white">fileName</h1>
        <p className="text-gray-400 mt-2">description</p>

        <div className="mt-6 bg-gray-700 p-6 rounded-lg">
          <div className="whitespace-pre-wrap text-gray-200">content</div>
        </div>
        <button
          onClick={handelGoBack}
          className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
        >
          Go Back{" "}
        </button>
      </div>
    </div>
  );
}
