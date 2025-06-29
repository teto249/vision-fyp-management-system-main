"use client";
import { Camera, Save, Loader2, User, Mail, Phone, MapPin, Building, Hash, Briefcase } from "lucide-react";
import Image from "next/image";

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

interface ProfileProps {
  formData: FormData;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditMode: boolean;
  isSubmitting: boolean;
  toggleEditMode: () => void;
}

export default function Profile({
  formData,
  fileInputRef,
  handlePhotoChange,
  triggerFileInput,
  handleSubmit,
  handleInputChange,
  isEditMode,
  isSubmitting,
  toggleEditMode,
}: ProfileProps) {
  const inputFields = [
    { id: "fullName", label: "Full Name", icon: User, type: "text", required: true },
    { id: "email", label: "Email Address", icon: Mail, type: "email", required: true },
    { id: "universityEmail", label: "University Email", icon: Mail, type: "email", disabled: true },
    { id: "phoneNumber", label: "Phone Number", icon: Phone, type: "tel", required: true },
    { id: "address", label: "Address", icon: MapPin, type: "text", required: true },
    { id: "contactEmail", label: "Contact Email", icon: Mail, type: "email", required: true },
    { id: "officeAddress", label: "Office Address", icon: MapPin, type: "text", required: true },
    { id: "department", label: "Department", icon: Building, type: "text", required: true },
  ];

  const universityFields = [
    { id: "university.shortName", label: "University Code", icon: Hash, disabled: true },
    { id: "university.fullName", label: "University Name", icon: Building, disabled: true },
    { id: "university.address", label: "University Address", icon: MapPin, disabled: true },
  ];

  // Generate initials from full name
  const getInitials = (fullName: string) => {
    if (!fullName) return "SU";
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-slate-700 group-hover:ring-blue-500/50 transition-all duration-300 shadow-2xl">
              {formData.profilePhoto ? (
                <Image
                  src={formData.profilePhoto}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {getInitials(formData.fullName)}
                  </span>
                </div>
              )}

              {/* Camera overlay when in edit mode */}
              {isEditMode && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer rounded-2xl">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {isEditMode && (
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-800 transition-all duration-200 hover:scale-110"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-100 mb-1">
              {formData.fullName || "Supervisor"}
            </h2>
            <p className="text-slate-400 flex items-center justify-center gap-2">
              <Briefcase className="w-4 h-4" />
              {formData.role} • {formData.department}
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-6">
          <div className="border-b border-slate-700 pb-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputFields.map(({ id, label, icon: Icon, type, required, disabled }) => (
              <div key={id} className="space-y-2">
                <label 
                  htmlFor={id} 
                  className="flex text-sm font-medium text-slate-300 items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  {label} {required && <span className="text-red-400">*</span>}
                </label>
                <input
                  id={id}
                  type={type}
                  value={typeof formData[id as keyof FormData] === 'string' ? formData[id as keyof FormData] as string : ''}
                  onChange={handleInputChange}
                  disabled={!isEditMode || disabled}
                  required={required}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    !isEditMode || disabled
                      ? "bg-slate-800/50 border-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-slate-800/80 border-slate-600 text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-500"
                  } backdrop-blur-sm`}
                  placeholder={!isEditMode ? "" : `Enter your ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* University Information */}
        <div className="space-y-6">
          <div className="border-b border-slate-700 pb-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-400" />
              University Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {universityFields.map(({ id, label, icon: Icon, disabled }) => (
              <div key={id} className="space-y-2">
                <label 
                  htmlFor={id} 
                  className="flex text-sm font-medium text-slate-300 items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-purple-400" />
                  {label}
                </label>
                <input
                  id={id}
                  type="text"
                  value={
                    id === "university.shortName" ? formData.university?.shortName || "" :
                    id === "university.fullName" ? formData.university?.fullName || "" :
                    id === "university.address" ? formData.university?.address || "" : ""
                  }
                  onChange={handleInputChange}
                  disabled={disabled}
                  className="w-full px-4 py-3 rounded-xl border bg-slate-800/50 border-slate-700 text-slate-400 cursor-not-allowed backdrop-blur-sm"
                  placeholder="Not specified"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditMode && (
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={toggleEditMode}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:text-slate-200 hover:border-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
