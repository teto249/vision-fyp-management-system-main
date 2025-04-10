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
    <div className="flex justify-center items-start min-h-screen bg-base-100 py-10">
      <div className="w-full max-w-7xl mx-4 bg-base-200 rounded-2xl shadow-lg overflow-hidden">
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

// {/* Profile Photo Section */}
// <div className="mt-4 flex justify-center ">
// <div className="relative w-full max-w-[400px] mx-auto">
//   <img
//     alt="Profile Photo"
//     className="w-full rounded-2xl object-cover"
//     src={formData.profilePhoto}
//   />
//   {isEditMode && (
//     <div className="absolute inset-0 hover:bg-black/40 transition-all duration-300 rounded-2xl">
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handlePhotoChange}
//         accept="image/*"
//         className="hidden"
//       />
//       <button
//         type="button"
//         onClick={triggerFileInput}
//         className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-2xl font-medium text-white"
//       >
//         Change Photo
//       </button>
//     </div>
//   )}
// </div>
// </div>
// <div className="p-6">
// <form onSubmit={handleSubmit} className="grid gap-y-2">
//   {/* Professional Details Section */}
//   <TextDivider>Professional Details</TextDivider>
//   <div>
//     <Label htmlFor="supervisorName">Full Name</Label>
//     <Input
//       id="supervisorName"
//       type="text"
//       value={formData.supervisorName}
//       onChange={handleInputChange}
//       disabled={!isEditMode}
//     />
//   </div>
//   <div>
//     <Label htmlFor="universityEmail">University Email</Label>
//     <Input
//       id="universityEmail"
//       type="email"
//       value={formData.universityEmail}
//       disabled
//     />
//   </div>

//   {/* Contact Information */}
//   <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//     <div>
//       <Label htmlFor="contactEmail">Contact Email</Label>
//       <Input
//         id="contactEmail"
//         type="email"
//         value={formData.contactEmail}
//         onChange={handleInputChange}
//         disabled={!isEditMode}
//       />
//     </div>
//     <div>
//       <Label htmlFor="phoneNumber">Phone Number</Label>
//       <Input
//         id="phoneNumber"
//         type="tel"
//         value={formData.phoneNumber}
//         onChange={handleInputChange}
//         disabled={!isEditMode}
//       />
//     </div>
//   </div>

//   <div>
//     <Label htmlFor="officeAddress">Office Address</Label>
//     <Input
//       id="officeAddress"
//       type="text"
//       value={formData.officeAddress}
//       onChange={handleInputChange}
//       disabled={!isEditMode}
//     />
//   </div>

//   {/* University Details (Always read-only) */}
//   <TextDivider>University Details</TextDivider>
//   <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//     <div>
//       <Label htmlFor="shortName">Short Name</Label>
//       <Input
//         id="shortName"
//         type="text"
//         value={formData.shortName}
//         disabled
//       />
//     </div>
//     <div>
//       <Label htmlFor="universityName">University Name</Label>
//       <Input
//         id="universityName"
//         type="text"
//         value={formData.universityName}
//         disabled
//       />
//     </div>
//   </div>

//   <div>
//     <Label htmlFor="universityAddress">University Address</Label>
//     <Input
//       id="universityAddress"
//       type="text"
//       value={formData.universityAddress}
//       disabled
//     />
//   </div>

//   {/* Submit Button */}
//   {isEditMode && (
//     <div className="justify-center flex gap-4 mt-6">
//       <button
//         type="submit"
//         variant="primary"
//         className=" border hover:bg-green-900 border-gray-500 rounded-md px-4 py-2"
//       >
//         Save Changes
//       </button>
//       <button
//         type="button"
//         variant="secondary"
//         className=" border hover:bg-red-900 border-gray-500 rounded-md px-4 py-2"
//         onClick={toggleEditMode}
//       >
//         Cancel
//       </button>
//     </div>
//   )}
// </form>
// </div>
