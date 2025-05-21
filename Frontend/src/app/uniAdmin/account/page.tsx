"use client";
import { useState, useEffect, useRef } from "react";
import Profile from "./ui/Profile";
import ProHeader from "./ui/ProHeader";
import { fetchUniAdminAccount, updateUniAdminAccount } from "../../../api/uniAdmin/account";

interface University {
  id: string;
  shortName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

interface FormData {
  username: string; // Changed from id
  fullName: string;
  primaryEmail: string;
  phoneNumber: string;
  role: string;
  profilePhoto: string | null;
  university: University;
}

export default function UniAdminProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<FormData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    username: "", // Changed from id
    fullName: "",
    primaryEmail: "",
    phoneNumber: "",
    role: "",
    profilePhoto: null,
    university: {
      id: "",
      shortName: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      status: "",
    },
  });

  // Load initial data from localStorage and fetch current data
  useEffect(() => {
    const initializeProfile = async () => {
      console.log("\n=== Initializing Profile ===");
      try {
        const storedInfo = localStorage.getItem("adminInfo");

        console.log("Storage Check:", {
          storedInfo: storedInfo ? "exists" : "missing",
        });

        if (!storedInfo) {
          console.error("Missing adminInfo in localStorage");
          setError("Please log in to view your profile.");
          setIsLoading(false);
          return;
        }

        // Set initial data from storage
        const parsedInfo = JSON.parse(storedInfo);
        console.log("Parsed stored info:", parsedInfo);
        setUserData(parsedInfo);

        if (!parsedInfo.username) { // Changed from id
          console.error("No username found in stored info");
          setError("Invalid user data. Please log in again.");
          setIsLoading(false);
          return;
        }

        // Fetch current data
        console.log("Fetching current profile data for username:", parsedInfo.username);
        const currentData = await fetchUniAdminAccount(parsedInfo.username);
        console.log("Received profile data:", currentData);

        if (!currentData || !currentData.username) { // Changed from id
          console.error("Invalid server response:", currentData);
          throw new Error("Invalid response from server");
        }

        console.log("Updating form data with received data");
        setFormData({
          username: currentData.username, // Changed from id
          fullName: currentData.fullName,
          primaryEmail: currentData.primaryEmail,
          phoneNumber: currentData.phoneNumber,
          role: currentData.role,
          profilePhoto: currentData.profilePhoto,
          university: {
            id: currentData.university?.id || "",
            shortName: currentData.university?.shortName || "",
            fullName: currentData.university?.fullName || "",
            email: currentData.university?.email || "",
            phone: currentData.university?.phone || "",
            address: currentData.university?.address || "",
            status: currentData.university?.status || "",
          },
        });
        console.log("Profile initialization complete");
      } catch (error: any) {
        console.error("Profile initialization error:", error);
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
        setFormData((prev) => ({ ...prev, profilePhoto: event.target?.result as string }));
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
    console.log("Current form data:", formData);

    // Validate required fields and formats
    if (!formData.username) { // Changed from id
      console.error("Validation failed: Missing username");
      alert("Username is missing. Please log in again.");
      return;
    }
    if (!formData.fullName) {
      console.error("Validation failed: Missing fullName");
      alert("Full name is required.");
      return;
    }
    if (!formData.primaryEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryEmail)) {
      console.error("Validation failed: Invalid primaryEmail");
      alert("A valid email is required.");
      return;
    }
    if (!formData.phoneNumber || !/^\+?[\d\s-]+$/.test(formData.phoneNumber)) {
      console.error("Validation failed: Invalid phoneNumber");
      alert("A valid phone number is required (e.g., +1234567890).");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToUpdate = {
        username: formData.username, // Changed from id
        fullName: formData.fullName,
        email: formData.primaryEmail,
        phoneNumber: formData.phoneNumber,
        profilePhoto: formData.profilePhoto,
        universityData: {
          shortName: formData.university?.shortName,
          fullName: formData.university?.fullName,
          email: formData.university?.email,
          phone: formData.university?.phone,
          address: formData.university?.address,
        },
      };
      console.log("Sending update request with data:", dataToUpdate);

      const response = await updateUniAdminAccount(dataToUpdate);
      console.log("Update response:", response);

      if (!response || !response.username) { // Changed from id
        console.error("Invalid server response:", response);
        throw new Error("Invalid response from server");
      }

      console.log("Updating local state with response");
      setFormData((prev) => ({
        ...prev,
        ...response,
        university: { ...prev.university, ...(response.university || {}) },
      }));
      setUserData(response);

      console.log("Updating localStorage");
      localStorage.setItem("adminInfo", JSON.stringify(response));

      setIsEditMode(false);
      alert("Profile updated successfully.");
    } catch (error: any) {
      console.error("Update failed:", {
        message: error.message,
        stack: error.stack,
      });
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900" aria-live="polite">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
        <Profile
          formData={formData}
          fileInputRef={fileInputRef}
          handlePhotoChange={handlePhotoChange}
          triggerFileInput={() => fileInputRef.current?.click()}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          isEditMode={isEditMode}
          toggleEditMode={() => setIsEditMode(!isEditMode)}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}