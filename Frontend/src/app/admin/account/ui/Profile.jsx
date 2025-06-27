import { Camera, User, Building2, Mail, Phone, MapPin, Upload } from "lucide-react";
import LabelInput from "./LabelInput";
import SubmitButtons from "./SubmitButtons";
import TextDivider from "./TextDivider";

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
}) {
  const institution = formData.institution || {
    id: "",
    shortName: "",
    fullName: "",
    address: "",
    email: "",
    phone: "",
    logoPath: "",
  };

  const renderProfilePhoto = () => (
    <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-blue-600/10" />
      
      <div className="relative flex flex-col items-center">
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl">
            <img
              alt="Profile Photo"
              className="w-full h-full object-cover"
              src={formData.profilePhoto || "/api/placeholder/160/160"}
            />
          </div>
          
          {isEditMode && (
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                 onClick={triggerFileInput}>
              <div className="text-center">
                <Camera className="w-8 h-8 text-white mx-auto mb-2" />
                <span className="text-white text-sm font-medium">Change Photo</span>
              </div>
            </div>
          )}
          
          {isEditMode && (
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            >
              <Upload className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-1">
            {formData.name || "Admin User"}
          </h2>
          <p className="text-slate-400 flex items-center justify-center gap-1">
            <User className="w-4 h-4" />
            {formData.role || "System Administrator"}
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoChange}
          accept="image/*"
          className="hidden"
          aria-label="Upload Profile Photo"
        />
      </div>
    </div>
  );

  const renderAdminDetails = () => (
    <div className="space-y-6">
      <TextDivider icon={<User className="w-5 h-5" />}>
        Personal Information
      </TextDivider>
      
      <div className="grid gap-6">
        <LabelInput
          id="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          disabled={!isEditMode}
          htmlFor="name"
          icon={<User className="w-4 h-4" />}
          placeholder="Enter your full name"
        >
          Full Name
        </LabelInput>
        
        <LabelInput
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={!isEditMode}
          htmlFor="email"
          icon={<Mail className="w-4 h-4" />}
          placeholder="Enter your email address"
        >
          Primary Email
        </LabelInput>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <LabelInput
            id="contactEmail"
            type="email"
            value={formData.contactEmail || ""}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="contactEmail"
            icon={<Mail className="w-4 h-4" />}
            placeholder="Enter contact email"
          >
            Contact Email
          </LabelInput>
          
          <LabelInput
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber || ""}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="phoneNumber"
            icon={<Phone className="w-4 h-4" />}
            placeholder="Enter phone number"
          >
            Phone Number
          </LabelInput>
        </div>
        
        <LabelInput
          id="address"
          type="text"
          value={formData.address || ""}
          onChange={handleInputChange}
          disabled={!isEditMode}
          htmlFor="address"
          icon={<MapPin className="w-4 h-4" />}
          placeholder="Enter your address"
        >
          Address
        </LabelInput>
      </div>
    </div>
  );

  const renderInstitutionDetails = () => (
    <div className="space-y-6">
      <TextDivider icon={<Building2 className="w-5 h-5" />}>
        Institution Information
      </TextDivider>
      
      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <LabelInput
            id="institution.shortName"
            value={institution.shortName}
            onChange={handleInputChange}
            placeholder="e.g., MIT"
            disabled={!isEditMode}
            htmlFor="institution.shortName"
            icon={<Building2 className="w-4 h-4" />}
          >
            Short Name
          </LabelInput>
          
          <LabelInput
            id="institution.fullName"
            value={institution.fullName}
            onChange={handleInputChange}
            placeholder="Full institution name"
            disabled={!isEditMode}
            htmlFor="institution.fullName"
            icon={<Building2 className="w-4 h-4" />}
          >
            Full Name
          </LabelInput>
        </div>
        
        <LabelInput
          id="institution.address"
          value={institution.address || ""}
          onChange={handleInputChange}
          placeholder="Institution address"
          disabled={!isEditMode}
          htmlFor="institution.address"
          icon={<MapPin className="w-4 h-4" />}
        >
          Address
        </LabelInput>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <LabelInput
            id="institution.email"
            value={institution.email}
            onChange={handleInputChange}
            placeholder="institution@example.com"
            disabled={!isEditMode}
            htmlFor="institution.email"
            icon={<Mail className="w-4 h-4" />}
          >
            Email
          </LabelInput>
          
          <LabelInput
            id="institution.phone"
            value={institution.phone}
            onChange={handleInputChange}
            placeholder="Institution phone"
            disabled={!isEditMode}
            htmlFor="institution.phone"
            icon={<Phone className="w-4 h-4" />}
          >
            Phone
          </LabelInput>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {renderProfilePhoto()}
      
      <div className="p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {renderAdminDetails()}
          {renderInstitutionDetails()}
          
          {isEditMode && (
            <SubmitButtons 
              toggleEditMode={toggleEditMode} 
              isSubmitting={isSubmitting}
              saveStatus={saveStatus}
            />
          )}
        </form>
      </div>
    </div>
  );
}
