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
    <div className="mt-4 flex justify-center">
      <div className="relative w-[200px] h-[200px]">
        <img
          alt="Profile Photo"
          className="w-full h-full rounded-2xl object-cover border-2 border-gray-600"
          src={formData.profilePhoto}
        />
        {isEditMode && (
          <div className="absolute inset-0 hover:bg-black/40 transition-all duration-300 rounded-2xl">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              className="hidden"
              aria-label="Upload Profile Photo"
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-2xl font-medium text-white"
              aria-label="Change Profile Photo"
            >
              Change Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAdminDetails = () => (
    <>
      <TextDivider>Admin Details</TextDivider>
      <LabelInput
        id="name"
        type="text"
        value={formData.name}
        onChange={handleInputChange}
        disabled={!isEditMode}
        htmlFor="name"
      >
        Admin Full Name
      </LabelInput>
      <LabelInput
        id="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        disabled={!isEditMode}
        htmlFor="email"
      >
        Admin Email
      </LabelInput>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <LabelInput
          id="contactEmail"
          type="email"
          value={formData.contactEmail || "Not fetched"}
          onChange={handleInputChange}
          disabled={!isEditMode}
          htmlFor="contactEmail"
        >
          Contact Email
        </LabelInput>
        <LabelInput
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber || "Not fetched"}
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
        value={formData.address || "Not fetched"}
        onChange={handleInputChange}
        disabled={!isEditMode}
        htmlFor="address"
      >
        Address
      </LabelInput>
    </>
  );

  const renderInstitutionDetails = () => (
    <>
      <TextDivider>Institution Details</TextDivider>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <LabelInput
          id="institution.shortName"
          value={institution.shortName}
          onChange={handleInputChange}
          placeholder="Short Name"
          disabled={!isEditMode}
          htmlFor="institution.shortName"
        >
          Institution Short Name
        </LabelInput>
        <LabelInput
          id="institution.fullName"
          value={institution.fullName}
          onChange={handleInputChange}
          placeholder="Full Name"
          disabled={!isEditMode}
          htmlFor="institution.fullName"
        >
          Institution Full Name
        </LabelInput>
      </div>
      <LabelInput
        id="institution.address"
        value={institution.address || "Not fetched"}
        onChange={handleInputChange}
        placeholder="Address"
        disabled={!isEditMode}
        htmlFor="institution.address"
      >
        Institution Address
      </LabelInput>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <LabelInput
          id="institution.email"
          value={institution.email}
          onChange={handleInputChange}
          placeholder="Institution Email"
          disabled={!isEditMode}
          htmlFor="institution.email"
        >
          Institution Email
        </LabelInput>
        <LabelInput
          id="institution.phone"
          value={institution.phone}
          onChange={handleInputChange}
          placeholder="Institution Phone"
          disabled={!isEditMode}
          htmlFor="institution.phone"
        >
          Institution Phone
        </LabelInput>
      </div>
    </>
  );

  return (
    <>
      {renderProfilePhoto()}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="grid gap-y-4">
          {renderAdminDetails()}
          {renderInstitutionDetails()}
          {isEditMode && <SubmitButtons toggleEditMode={toggleEditMode} />}
        </form>
      </div>
    </>
  );
}
