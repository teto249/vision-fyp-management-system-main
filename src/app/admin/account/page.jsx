"use client";
import { useState, useRef } from "react";
import Profile from "./ui/Profile";
import Divider from "./ui/Divider";
import ProHeader from "./ui/ProHeader";

const PLACEHOLDERS = {
  ADMIN_NAME: "Altayeb Mustafa Ibrahim Abdelrasoul",
  ADMIN_EMAIL: "admin@graduate.utm.my",
  CONTACT_EMAIL: "info@utm.my",
  PHONE: "0123456789",
  ADMIN_ADDRESS: "43, Jalan Utama 38, Johor Bahru",
  UNIVERSITY_ADDRESS: "47, Jalan Utama 38, Johor Bahru",
  UNIVERSITY_NAME: "University Technology Malaysia",
};

export default function AdminProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    adminName: PLACEHOLDERS.ADMIN_NAME,
    adminEmail: PLACEHOLDERS.ADMIN_EMAIL,
    contactEmail: PLACEHOLDERS.CONTACT_EMAIL,
    phoneNumber: PLACEHOLDERS.PHONE,
    adminAddress: PLACEHOLDERS.ADMIN_ADDRESS,
    shortName: "UTM",
    universityName: PLACEHOLDERS.UNIVERSITY_NAME,
    universityAddress: PLACEHOLDERS.UNIVERSITY_ADDRESS,
    profilePhoto:
      "https://th.bing.com/th/id/OIP.ajgivL7ZDLyAl1l-9Y0MIgHaHa?rs=1&pid=ImgDetMain",
  });
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
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

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-base-100 py-10">
      <div className="w-full max-w-7xl mx-4 bg-base-200 rounded-3xl shadow-lg  overflow-hidden">
        <ProHeader isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
        <Divider />
        <Profile
          formData={formData}
          fileInputRef={fileInputRef}
          handlePhotoChange={handlePhotoChange}
          triggerFileInput={triggerFileInput}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          isEditMode={isEditMode}
          toggleEditMode={toggleEditMode}
        />
      </div>
    </div>
  );
}
