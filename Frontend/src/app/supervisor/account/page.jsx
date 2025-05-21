"use client";
import { useState, useRef } from "react";

import Profile from "./ui/Profile";

import ProHeader from "./ui/ProHeader";

import Divider from "./ui/Divider";

const PLACEHOLDERS = {
  SUPERVISOR_NAME: "Dr. John Doe",
  UNIVERSITY_EMAIL: "supervisor@utm.my",
  CONTACT_EMAIL: "contact.supervisor@utm.my",
  PHONE: "0123456789",
  OFFICE_ADDRESS: "Faculty Building, Room 305, Johor Bahru",
  UNIVERSITY_ADDRESS: "47, Jalan Utama 38, Johor Bahru",
  UNIVERSITY_NAME: "University Technology Malaysia",
};

export default function SupervisorProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    supervisorName: PLACEHOLDERS.SUPERVISOR_NAME,
    universityEmail: PLACEHOLDERS.UNIVERSITY_EMAIL,
    contactEmail: PLACEHOLDERS.CONTACT_EMAIL,
    phoneNumber: PLACEHOLDERS.PHONE,
    officeAddress: PLACEHOLDERS.OFFICE_ADDRESS,
    shortName: "UTM",
    universityName: PLACEHOLDERS.UNIVERSITY_NAME,
    universityAddress: PLACEHOLDERS.UNIVERSITY_ADDRESS,
    profilePhoto:
      "https://img.freepik.com/free-photo/portrait-confident-male-professor-standing-classroom_1098-19361.jpg",
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
    <div className="flex justify-center items-start min-h-screen bg-gray-900 py-10">
      <div className="w-full max-w-7xl mx-4  rounded-2xl shadow-lg overflow-hidden bg-gray-800">
        {/* Header Section */}
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

