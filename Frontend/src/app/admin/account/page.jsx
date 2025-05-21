"use client";

import { useState, useEffect, useRef } from "react";
import Profile from "./ui/Profile";
import ProHeader from "./ui/ProHeader";
import {
  fetchAdminAccount,
  updateAdminAccount,
} from "../../../api/admin/account";

export default function AdminProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({
    username: "", // Changed from id
    name: "",
    email: "",
    contactEmail: "",
    phoneNumber: "",
    address: "",
    profilePhoto: null,
    role: "",
    institution: {
      id: "",
      shortName: "",
      fullName: "",
      address: "",
      email: "",
      phone: "",
      logoPath: "",
    },
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedAdminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    if (storedAdminInfo) {
      console.log("Loaded from localStorage:", storedAdminInfo);
      setUserData(storedAdminInfo);
      setFormData((prev) => ({ ...prev, ...storedAdminInfo }));
    } else {
      setError("Please log in to view your profile.");
      setIsLoading(false);
    }
  }, []);

  const fetchProfileData = async (username) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAdminAccount(username);
      console.log("Fetched data:", JSON.stringify(data, null, 2));
      setFormData((prev) => ({
        ...prev,
        ...data,
        institution: { ...prev.institution, ...data.institution },
      }));
      setUserData(data);
      localStorage.setItem("adminInfo", JSON.stringify(data));
    } catch (error) {
      setError("Failed to load profile. Please try again.");
      console.error("Failed to fetch admin account details:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData.username) { // Changed from userData.id
      console.log("Fetching profile for username:", userData.username);
      fetchProfileData(userData.username);
    }
  }, [userData.username]); // Changed dependency

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith("institution.")) {
      const field = id.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        institution: { ...prev.institution, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, profilePhoto: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.name) return "Name and email are required.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToUpdate = {
        username: userData.username, // Changed from adminId
        adminName: formData.name,
        adminEmail: formData.email,
        contactEmail: formData.contactEmail,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        profilePhoto: formData.profilePhoto,
        institutionData: formData.institution
          ? {
              shortName: formData.institution.shortName || "",
              fullName: formData.institution.fullName || "",
              address: formData.institution.address || "",
              email: formData.institution.email || "",
              phone: formData.institution.phone || "",
            }
          : null,
      };

      const response = await updateAdminAccount(dataToUpdate);
      
      if (!response || typeof response !== "object") {
        throw new Error("Update failed: Invalid response");
      }

      await fetchProfileData(userData.username); // Changed from userData.id
      setIsEditMode(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update admin account details:", error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800" aria-live="polite">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800" aria-live="polite">
        <p className="text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 py-10">
      <div className="w-full max-w-7xl mx-4 rounded-3xl shadow-lg overflow-hidden border border-gray-600">
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