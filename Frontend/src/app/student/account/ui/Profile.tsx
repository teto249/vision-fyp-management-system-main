"use client";
import { Camera, Save, Loader2, User, Mail, Phone, MapPin, Building, GraduationCap, Hash } from "lucide-react";
import Image from "next/image";

interface University {
  id: string;
  shortName: string;
  fullName: string;
  address: string;
  status: string;
}

interface Supervisor {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  officeAddress: string;
}

interface FormData {
  userId: string;
  fullName: string;
  email: string;
  universityEmail: string;
  phoneNumber: string;
  address: string;
  department: string;
  level: string;
  role: string;
  profilePhoto: string | null;
  university: University;
  supervisor: Supervisor | null;
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
    { id: "department", label: "Department", icon: Building, type: "text", required: true },
    { id: "level", label: "Level", icon: GraduationCap, type: "text", required: true },
  ];

  const universityFields = [
    { id: "university.shortName", label: "University Code", icon: Hash, disabled: true },
    { id: "university.fullName", label: "University Name", icon: Building, disabled: true },
    { id: "university.address", label: "University Address", icon: MapPin, disabled: true },
  ];

  // Generate initials from full name
  const getInitials = (fullName: string) => {
    if (!fullName) return "ST";
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
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {getInitials(formData.fullName)}
                  </span>
                </div>
              )}
            </div>
            {isEditMode && (
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-1">{formData.fullName || "Student Name"}</h2>
            <p className="text-slate-400">{formData.role} • {formData.department}</p>
            <p className="text-sm text-slate-500 mt-1">ID: {formData.userId}</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-400" />
              <span>Personal Information</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inputFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.id} className={field.id === 'address' ? 'sm:col-span-2' : ''}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-slate-300 mb-2">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id={field.id}
                        type={field.type}
                        value={formData[field.id as keyof FormData] as string}
                        onChange={handleInputChange}
                        disabled={!isEditMode || field.disabled}
                        required={field.required}
                        className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 transition-all duration-200 ${
                          isEditMode && !field.disabled
                            ? 'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-slate-600'
                            : 'cursor-not-allowed opacity-75'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* University Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-400" />
              <span>University Information</span>
            </h3>
            
            <div className="space-y-4">
              {universityFields.map((field) => {
                const Icon = field.icon;
                const value = field.id === "university.shortName" 
                  ? formData.university.shortName
                  : field.id === "university.fullName"
                  ? formData.university.fullName
                  : formData.university.address;

                return (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-slate-300 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id={field.id}
                        type="text"
                        value={value}
                        onChange={handleInputChange}
                        disabled={true}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/30 border border-slate-700/30 rounded-xl text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300">
                  <strong>Status:</strong> {formData.university.status || "Active"}
                </p>
              </div>
            </div>
          </div>

          {/* Supervisor Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-400" />
              <span>Supervisor Information</span>
            </h3>
            
            {formData.supervisor ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Supervisor Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.supervisor.fullName}
                        disabled={true}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/30 border border-slate-700/30 rounded-xl text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={formData.supervisor.email}
                        disabled={true}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/30 border border-slate-700/30 rounded-xl text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.supervisor.phoneNumber}
                        disabled={true}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/30 border border-slate-700/30 rounded-xl text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Department
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.supervisor.department}
                        disabled={true}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/30 border border-slate-700/30 rounded-xl text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Office Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.supervisor.officeAddress || 'Not provided'}
                      disabled={true}
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/30 border border-slate-700/30 rounded-xl text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-800/30 border border-slate-700/30 rounded-xl text-center">
                <User className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No Supervisor Assigned</p>
                <p className="text-slate-500 text-sm mt-1">
                  You will be assigned a supervisor when you register for a project
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditMode && (
          <div className="flex justify-end pt-6 border-t border-slate-700/50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
