import Image from "next/image";
import SubmitButtons from "./SubmitButtons";
import TextDivider from "./TextDivider";
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
  username: string; // Changed from id
  fullName: string;
  primaryEmail: string;
  phoneNumber: string;
  profilePhoto: string | null;
  role: string;
  university: University;
}

interface ProfileProps {
  formData: FormData;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  isSubmitting: boolean;
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
}: ProfileProps) {
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
          {/* Admin Section */}
          <TextDivider>Admin Details</TextDivider>
          <LabelInput
            id="username"
            type="text"
            value={formData.username}
            disabled={true} // Username should never be editable
            htmlFor="username"
            placeholder="Username"
            onChange={handleInputChange}
          >
            Username
          </LabelInput>
          <LabelInput
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="fullName"
            placeholder="Enter your full name"
            required
          >
            Full Name
          </LabelInput>
          <LabelInput
            id="primaryEmail"
            type="email"
            value={formData.primaryEmail}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="primaryEmail"
            placeholder="Enter your email address"
          >
            Email
          </LabelInput>
          <LabelInput
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="phoneNumber"
            placeholder="Enter your phone number"
          >
            Phone Number
          </LabelInput>

          {/* University Section */}
          <TextDivider>University Details</TextDivider>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LabelInput
              id="uniShortName"
              type="text"
              value={formData.university.shortName}
              onChange={handleInputChange}
              disabled={!isEditMode}
              htmlFor="uniShortName"
              placeholder="Enter university short name"
            >
              Short Name
            </LabelInput>
            <LabelInput
              id="uniFullName"
              type="text"
              value={formData.university.fullName}
              onChange={handleInputChange}
              disabled={!isEditMode}
              htmlFor="uniFullName"
              placeholder="Enter full university name"
            >
              Full University Name
            </LabelInput>
          </div>
          <LabelInput
            id="uniAddress"
            type="text"
            value={formData.university.address}
            onChange={handleInputChange}
            disabled={!isEditMode}
            htmlFor="uniAddress"
            placeholder="Enter university address"
          >
            Address
          </LabelInput>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LabelInput
              id="uniEmail"
              type="email"
              value={formData.university.email}
              onChange={handleInputChange}
              disabled={!isEditMode}
              htmlFor="uniEmail"
              placeholder="Enter university email"
            >
              University Email
            </LabelInput>
            <LabelInput
              id="uniPhone"
              type="tel"
              value={formData.university.phone}
              onChange={handleInputChange}
              disabled={!isEditMode}
              htmlFor="uniPhone"
              placeholder="Enter university phone number"
            >
              University Phone
            </LabelInput>
          </div>

          {isEditMode && (
            <SubmitButtons
              toggleEditMode={toggleEditMode}
              disabled={isSubmitting}
            />
          )}
        </form>
      </div>
    </>
  );
}