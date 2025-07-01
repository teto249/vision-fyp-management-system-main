"use client";
import Image from "next/image";
import { User, Mail, Phone, Building, Upload } from "lucide-react";
import SubmitButtons from "./SubmitButtons";
import LabelInput from "./LabelInput";
import { getInitials } from "../../../../utils/getInitials";

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
  username: string;
  fullName: string;
  primaryEmail: string;
  phoneNumber: string;
  role: string;
  profilePhoto: string | null;
  university: University;
}

interface ProfileProps {
  formData: FormData;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  isSubmitting: boolean;
  saveStatus?: "saving" | "success" | "error" | null;
}

export default function Profile({
  formData,
  fileInputRef,
  handlePhotoChange,
  triggerFileInput,
  handleSubmit,
  handleInputChange,
  isEditMode,
  toggleEditMode,
  isSubmitting,
  saveStatus,
}: ProfileProps) {
  return (
    <div className="relative p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative w-32 h-32 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full 
                           flex items-center justify-center overflow-hidden ring-4 ring-slate-700/50 
                           group-hover:ring-teal-500/50 transition-all duration-300">
              {formData.profilePhoto ? (
                <Image
                  src={formData.profilePhoto}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}

              {isEditMode && (
                <div
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                               transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <Upload className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {isEditMode && (
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 
                          rounded-full flex items-center justify-center shadow-lg hover:scale-110 
                          transition-transform duration-200"
              >
                <Upload className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-1">
              {formData.fullName || "University Admin"}
            </h2>
            <p className="text-slate-400 mb-2">
              {formData.role || "University Administrator"}
            </p>
            <p className="text-sm text-slate-500">@{formData.username}</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        {/* Personal Information Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-teal-400" />
            <h3 className="text-xl font-semibold text-white">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <LabelInput
              id="fullName"
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditMode}
              icon={<User className="w-5 h-5" />}
              placeholder="Enter your full name"
            />

            <LabelInput
              id="username"
              label="Username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              disabled={true}
              icon={<User className="w-5 h-5" />}
              placeholder="Username"
            />

            <LabelInput
              id="primaryEmail"
              label="Primary Email"
              type="email"
              value={formData.primaryEmail}
              onChange={handleInputChange}
              disabled={!isEditMode}
              icon={<Mail className="w-5 h-5" />}
              placeholder="Enter your email address"
            />

            <LabelInput
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditMode}
              icon={<Phone className="w-5 h-5" />}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* University Information Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building className="w-5 h-5 text-teal-400" />
            <h3 className="text-xl font-semibold text-white">University Information</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <LabelInput
              id="university.shortName"
              label="University Short Name"
              type="text"
              value={formData.university?.shortName || ""}
              onChange={handleInputChange}
              disabled={!isEditMode}
              icon={<Building className="w-5 h-5" />}
              placeholder="e.g., MIT"
            />

            <LabelInput
              id="university.fullName"
              label="University Full Name"
              type="text"
              value={formData.university?.fullName || ""}
              onChange={handleInputChange}
              disabled={!isEditMode}
              icon={<Building className="w-5 h-5" />}
              placeholder="Full university name"
            />

            <LabelInput
              id="university.email"
              label="University Email"
              type="email"
              value={formData.university?.email || ""}
              onChange={handleInputChange}
              disabled={!isEditMode}
              icon={<Mail className="w-5 h-5" />}
              placeholder="University contact email"
            />

            <LabelInput
              id="university.phone"
              label="University Phone"
              type="tel"
              value={formData.university?.phone || ""}
              onChange={handleInputChange}
              disabled={!isEditMode}
              icon={<Phone className="w-5 h-5" />}
              placeholder="University contact number"
            />

            <div className="lg:col-span-2">
              <LabelInput
                id="university.address"
                label="University Address"
                type="text"
                value={formData.university?.address || ""}
                onChange={handleInputChange}
                disabled={!isEditMode}
                icon={<Building className="w-5 h-5" />}
                placeholder="Full university address"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        {isEditMode && (
          <SubmitButtons
            toggleEditMode={toggleEditMode}
            disabled={isSubmitting}
          />
        )}
      </form>
    </div>
  );
}