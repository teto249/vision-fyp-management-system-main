"use client";
import { useState, useRef } from "react";
import Profile from "./ui/Profile";
import Divider from "./ui/Divider";
import ProHeader from "./ui/ProHeader";

const PLACEHOLDERS = {
  STUDENT_ID: "A21EC9115",
  STUDENT_NAME: "Altayeb Mustafa Ibrahim Abdelrasoul",
  STUDENT_EMAIL: "student@graduate.utm.my",
  CONTACT_EMAIL: "info@utm.my",
  PHONE: "0123456789",
  STUDENT_ADDRESS: "43, Jalan Utama 38, Johor Bahru",
  UNIVERSITY_ADDRESS: "47, Jalan Utama 38, Johor Bahru",
  UNIVERSITY_NAME: "University Technology Malaysia",
};

export default function UniAdminProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    studentID: PLACEHOLDERS.STUDENT_ID,
    studentName: PLACEHOLDERS.STUDENT_NAME,
    studentEmail: PLACEHOLDERS.STUDENT_EMAIL,
    contactEmail: PLACEHOLDERS.CONTACT_EMAIL,
    phoneNumber: PLACEHOLDERS.PHONE,
    studentAddress: PLACEHOLDERS.STUDENT_ADDRESS,
    shortName: "UTM",
    universityName: PLACEHOLDERS.UNIVERSITY_NAME,
    universityAddress: PLACEHOLDERS.UNIVERSITY_ADDRESS,
    profilePhoto:
      "https://img.freepik.com/free-photo/portrait-woman-holding-device-taking-photos-world-photography-day_23-2151704499.jpg",
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
