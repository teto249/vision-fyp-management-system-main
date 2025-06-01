"use client";
import { useState, useEffect } from "react";
import LabelInput from "./LabelInput";
import SubmitButtons from "./SubmitButtons";
import TextDivider from "./TextDivider";
import { getInitials } from "../../../../utils/getInitials";

export default function Profile({
  formData,
  fileInputRef,
  handlePhotoChange,
  triggerFileInput,
  handleSubmit,
  handleInputChange,
  isEditMode,
  toggleEditMode,
}) {
  console.log("Profile formData:", formData);
  const [studentInfo, setStudentInfo] = useState({});

  useEffect(() => {
    const storedInfo = JSON.parse(localStorage.getItem("studentInfo"));
    if (storedInfo) {
      setStudentInfo(storedInfo);
    }
  }, []);

  return (
    <>
      <div className="mt-4 flex justify-center">
        <div className="relative">
          {formData.profilePhoto ? (
            <Image
              src={formData.profilePhoto}
              alt={`${formData.fullName}'s profile`}
              width={128}
              height={128}
              className="rounded-full object-cover"
              priority
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center">
              <span className="text-3xl font-semibold text-white">
                {getInitials(formData.fullName)}
              </span>
            </div>
          )}
          {isEditMode && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
                aria-label="Upload profile photo"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
                aria-label="Change profile photo"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="grid gap-y-2">
          {/* Student Section */}
          <TextDivider>Student Details</TextDivider>
          <LabelInput
            id="userId"
            type="text"
            value={formData.userId} // Changed from studentInfo.userId
            onChange={handleInputChange}
            disabled
            htmlFor="userId"
          >
            Student ID
          </LabelInput>
          <LabelInput
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="fullName"
          >
            Student Full Name
          </LabelInput>
          <LabelInput
            id="universityEmail"
            type="email"
            value={formData.universityEmail}
            onChange={handleInputChange}
            disabled
            htmlFor="universityEmail"
          >
            University Email
          </LabelInput>
          <LabelInput
            id="level"
            type="text"
            value={formData.level}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="level"
          >
            Level
          </LabelInput>
          <LabelInput
            id="department"
            type="text"
            value={formData.department}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="department"
          >
            Department
          </LabelInput>

          {/* Contact Section */}
          <TextDivider>Contact Details</TextDivider>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LabelInput
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditMode}
              htmlFor="email"
            >
              Personal Email
            </LabelInput>
            <LabelInput
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditMode}
              htmlFor="phoneNumber"
            >
              Phone Number
            </LabelInput>
          </div>
          <LabelInput
            id="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="address"
          >
            Address
          </LabelInput>

          {/* University Section */}
          <TextDivider>University Details</TextDivider>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LabelInput
              id="university.shortName"
              type="text"
              value={formData.university?.shortName}
              onChange={handleInputChange}
              disabled
              htmlFor="university.shortName"
            >
              Short Name
            </LabelInput>
            <LabelInput
              id="university.fullName"
              type="text"
              value={formData.university?.fullName}
              onChange={handleInputChange}
              disabled
              htmlFor="university.fullName"
            >
              University Name
            </LabelInput>
          </div>
          <LabelInput
            id="university.address"
            type="text"
            value={formData.university?.address}
            onChange={handleInputChange}
            disabled
            htmlFor="university.address"
          >
            University Address
          </LabelInput>

          {isEditMode && <SubmitButtons toggleEditMode={toggleEditMode} />}
        </form>
      </div>
    </>
  );
}
