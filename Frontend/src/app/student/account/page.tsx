"use client";
import { useState, useEffect, useRef } from "react";
import Profile from "./ui/Profile";
import Divider from "./ui/Divider";
import ProHeader from "./ui/ProHeader";
import {
  fetchStudentAccount,
  updateStudentAccount,
} from "../../../api/StudentApi/account";


interface University {
  id: string;
  shortName: string;
  fullName: string;
  address: string;
  status: string;
}

interface FormData {
  userId: string;
  fullName: string;
  email: string;
  universityEmail: string;
  phoneNumber: string;
  address: string; // Changed from studentAddress
  department: string;
  level: string;
  role: string;
  profilePhoto: string | null;
  university: University;
}

export default function StudentProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<FormData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    fullName: "",
    email: "",
    universityEmail: "",
    phoneNumber: "",
    address: "",
    department: "",
    level: "",
    role: "Student",
    profilePhoto: null,
    university: {
      id: "",
      shortName: "",
      fullName: "",
      address: "",
      status: "",
    },
  });

     const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
  console.log("Student Info from localStorage:", studentInfo.universityId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const stored = localStorage.getItem("studentInfo");
        if (!stored) {
          setError("Please log in to view your profile.");
          setIsLoading(false);
          return;
        }

        const storedInfo = JSON.parse(stored);
        console.log("Parsed studentInfo:", storedInfo);

        const userId = storedInfo?.userId || storedInfo?.username;  // ✅ Use the correct key here
        if (!userId) {
          setError("Invalid user data. Please log in again.");
          setIsLoading(false);
          return;
        }

        const currentData = await fetchStudentAccount(userId);
        setFormData({
          userId: currentData.userId,
          fullName: currentData.fullName,
          email: currentData.email,
          universityEmail: currentData.universityEmail,
          phoneNumber: currentData.phoneNumber,
          address: currentData.address,
          department: currentData.department,
          level: currentData.level,
          role: currentData.role,
          profilePhoto: currentData.profilePhoto,
          university: {
            id: currentData.university?.id || "",
            shortName: currentData.university?.shortName || "",
            fullName: currentData.university?.fullName || "",
            address: currentData.university?.address || "",
            status: currentData.university?.status || "",
          },
        });
        setUserData(currentData);
      } catch (error: any) {
        setError(error.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log("Input change:", { field: id, value });

    if (id.startsWith("university.")) {
      const field = id.split(".")[1];
      console.log("Updating university field:", field);
      setFormData((prev) => ({
        ...prev,
        university: { ...prev.university, [field]: value },
      }));
    } else {
      console.log("Updating profile field:", id);
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("\n=== Photo Change Started ===");
    const file = e.target.files?.[0];
    console.log("Selected file:", {
      name: file?.name,
      type: file?.type,
      size: file?.size,
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log("Photo loaded successfully");
        setFormData((prev) => ({
          ...prev,
          profilePhoto: event.target?.result as string,
        }));
      };
      reader.onerror = (error) => {
        console.error("Photo load error:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("\n=== Profile Update Submission ===");

    setIsSubmitting(true);
    try {
      const dataToUpdate = {
        userId: formData.userId,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address, // Changed from studentAddress
        department: formData.department,
        level: formData.level,
      };
      console.log("Sending update request with data:", dataToUpdate);

      const response = await updateStudentAccount(dataToUpdate);
      console.log("Update response:", response);

      if (!response) {
        throw new Error("No response received from server");
      }

      setFormData((prev) => ({
        ...prev,
        ...response,
        university: response.university || prev.university,
      }));

      localStorage.setItem("studentInfo", JSON.stringify(response));
      setIsEditMode(false);
      alert("Profile updated successfully.");
    } catch (error: any) {
      console.error("Update failed:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-900 py-10">
      <div className="w-full max-w-7xl mx-4 rounded-2xl shadow-lg overflow-hidden bg-gray-800">
        <ProHeader
          isEditMode={isEditMode}
          toggleEditMode={() => setIsEditMode(!isEditMode)}
        />
        <Divider />
        <Profile
          formData={formData}
          fileInputRef={fileInputRef}
          handlePhotoChange={handlePhotoChange}
          triggerFileInput={() => fileInputRef.current?.click()}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          isEditMode={isEditMode}
          toggleEditMode={() => setIsEditMode(!isEditMode)}
          // isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
