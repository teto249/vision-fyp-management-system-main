// components/uniregistration/LogoUpload.jsx
"use client";

import { useState } from "react";

export default function LogoUpload({ onLogoChange }) {
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        if (onLogoChange) {
          onLogoChange(file); // Pass the file object to parent
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        University Logo
      </label>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center px-4 py-6 bg-gray-800 text-primary-400 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer hover:border-primary-400 transition-colors">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="University logo preview"
              className="w-32 h-32 object-contain mb-2 rounded"
            />
          ) : (
            <>
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span className="text-sm">Click to upload logo</span>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
            
          />
        </label>
      </div>
    </div>
  );
}
