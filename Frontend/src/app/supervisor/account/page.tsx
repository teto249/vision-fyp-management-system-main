"use client";
import { useState, useEffect, useRef } from "react";

import Profile from "./ui/Profile";

import Divider from "./ui/Divider";

import ProHeader from "./ui/ProHeader";

import {
  fetchSupervisorAccount,
  updateSupervisorAccount,
} from "../../../api/SupervisorApi/account";

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
  address: string;
  contactEmail: string;
  officeAddress: string;
  department: string;
  role: string;
  profilePhoto: string | null;
  university: University;
}

export default function SupervisorProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    fullName: "",
    email: "",
    universityEmail: "",
    phoneNumber: "",
    address: "",
    contactEmail: "",
    officeAddress: "",
    department: "",
    role: "Supervisor",
    profilePhoto: null,
    university: {
      id: "",
      shortName: "",
      fullName: "",
      address: "",
      status: "",
    },
  });

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const stored = localStorage.getItem("supervisorInfo");
        console.log("Storage Check:", stored);

        if (!stored) {
          setError("Please log in to view your profile.");
          return;
        }

        const storedInfo = JSON.parse(stored);
        const userId = storedInfo?.userId || storedInfo?.username;
        if (!userId) {
          setError("Invalid user data. Please log in again.");
          return;
        }

        const currentData = await fetchSupervisorAccount(userId);
        setFormData(currentData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateSupervisorAccount({
        userId: formData.userId,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        contactEmail: formData.contactEmail,
        officeAddress: formData.officeAddress,
        department: formData.department,
        profilePhoto: formData.profilePhoto,
      });

      setFormData(response);
      setIsEditMode(false);
      alert("Profile updated successfully");
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-900 py-10">
      <div className="w-full max-w-7xl mx-4 rounded-2xl shadow-lg overflow-hidden bg-gray-800">
        {/* Header Section */}
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
        />
      </div>
    </div>
  );
}
