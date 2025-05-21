"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import UniversityRegistrationFormContent from "../components/uniregistration/UniversityRegistrationFormContent";
import { registerUniversity } from "../../../api/admin/registerUniversity";
import TextDivider from "../account/ui/TextDivider";

export default function UniversityRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      // Basic required fields check
      const requiredFields = [
        "shortName",
        "fullName",
        "email",
        "adminFullName",
        "adminEmail",
        "adminPassword",
      ];
      for (const field of requiredFields) {
        if (!formData.get(field)) {
          throw new Error(
            `${field.replace(/([A-Z])/g, " $1").trim()} is required`
          );
        }
      }

      const data = await registerUniversity(formData);
      toast.success("University registered successfully!");
      router.push("/admin");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen py-10 bg-gray-800">
      <div className="w-full max-w-5xl mx-4 bg-gray-700 rounded-xl shadow-lg overflow-hidden border border-gray-600">
        <div className="my-5 mx-3 flex justify-center items-center text-center">
          <TextDivider>University Registration Form</TextDivider>
        </div>

        {error && (
          <div className="mx-4 mb-4 p-4 bg-red-500 text-white rounded-md">
            {error}
          </div>
        )}

        <UniversityRegistrationFormContent
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
