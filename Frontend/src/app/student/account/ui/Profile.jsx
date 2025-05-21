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
  return (
    <>
      <div className="mt-4 flex justify-center">
        <div className="relative w-[200px] h-[200px]">
          <img
            alt="Profile Photo"
            className="w-full h-full rounded-full object-cover"
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
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-2xl font-medium text-white"
              >
                Change Photo
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="grid gap-y-2">
          {/* Student Section */}
          <TextDivider>Student Details</TextDivider>
          <LabelInput
            id="studentName"
            type="text"
            value={formData.studentID}
            onChange={handleInputChange}
            disabled
            htmlFor="studentID"
          >
            Student ID
          </LabelInput>
          <LabelInput
            id="studentName"
            type="text"
            value={formData.studentName}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="studentName"
          >
            Student Full Name
          </LabelInput>
          <LabelInput
            id="primaryEmail"
            type="email"
            value={formData.primaryEmail}
            onChange={handleInputChange}
            disabled
            htmlFor="primaryEmail"
          >
            Primary Email
          </LabelInput>
          {/* Contact Section */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LabelInput
              id="secondaryEmail"
              type="email"
              value={formData.secondaryEmail}
              onChange={handleInputChange}
              disabled={!isEditMode}
              htmlFor="secondaryEmail"
            >
              Secondary Email
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
            id="studentAddress"
            type="text"
            value={formData.studentAddress}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="studentAddress"
          >
            Address
          </LabelInput>
          {/* Company Section */}
          <TextDivider>University Details</TextDivider>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LabelInput
              id="shortName"
              type="text"
              value={formData.shortName}
              onChange={handleInputChange}
              disabled
              htmlFor="shortName"
            >
              Short Name
            </LabelInput>
            <LabelInput
              id="universityName"
              type="text"
              value={formData.universityName}
              onChange={handleInputChange}
              disabled
              htmlFor="universityName"
            >
              Full Company Name
            </LabelInput>
          </div>
          <LabelInput
            htmlFor="universityAddress"
            id="universityAddress"
            type="text"
            value={formData.universityAddress}
            onChange={handleInputChange}
            disabled
          >
            Address
          </LabelInput>
          {isEditMode && <SubmitButtons toggleEditMode={toggleEditMode} />}
        </form>
      </div>
    </>
  );
}
