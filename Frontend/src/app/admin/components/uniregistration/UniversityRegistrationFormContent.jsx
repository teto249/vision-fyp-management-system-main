import LabelInput from "./LabelInput";
import TextArea from "./TextArea";

export default function UniversityRegistrationFormContent({
  onSubmit,
  isSubmitting,
}) {
  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      {/* University Details */}
      <div className="space-y-6 m-5">
        <TextArea description="Basic information about the institution">
          University Details
        </TextArea>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <LabelInput name="shortName" type="text" placeholder="UTM" required>
            Short Name
          </LabelInput>

          <LabelInput
            name="fullName"
            type="text"
            placeholder="University Technology Malaysia"
            required
          >
            Full Name
          </LabelInput>
        </div>

        <LabelInput
          type="text"
          name="address"
          placeholder="Full physical address"
        >
          Address
        </LabelInput>
      </div>

      {/* Contact Information */}
      <div className="space-y-6 m-5">
        <TextArea description="Official communication channels">
          Contact Information
        </TextArea>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <LabelInput
            type="email"
            placeholder="contact@university.edu"
            name="email"
            required
          >
            Email
          </LabelInput>

          <LabelInput
            type="tel"
            placeholder="+60 12 345 6789"
            name="phone"
          >
            Phone
          </LabelInput>
        </div>
      </div>

      {/* Capacity Section */}
      <div className="space-y-6 m-5">
        <TextArea description="User limits for the platform">
          System Capacity
        </TextArea>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Max Students
              <span className="ml-1 text-gray-400">
                (recommended: 1000-5000)
              </span>
            </label>
            <input
              name="maxStudents"
              type="number"
              min="1"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Max Supervisors
              <span className="ml-1 text-gray-400">(recommended: 50-200)</span>
            </label>
            <input
              name="maxSupervisors"
              type="number"
              min="1"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              required
            />
          </div>
        </div>
      </div>

      {/* Admin Details */}
      <div className="space-y-6 m-5">
        <TextArea description="Primary contact information">
          Administrator Details
        </TextArea>

        <div className="space-y-4">
          <LabelInput type="text" name="adminFullName">
            Full Name
          </LabelInput>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LabelInput type="email" name="adminEmail" required>
              Email
            </LabelInput>
            <LabelInput type="tel" name="adminPhone">
              Phone
            </LabelInput>
          </div>
          <LabelInput type="password" name="adminPassword" required>
            Password
          </LabelInput>
        </div>
      </div>

      {/* Terms and Submission */}
      <div className="space-y-6 m-5">
        <div className="flex items-start space-x-3">
          <input
            name="termsAccepted"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500"
            required
          />
          <label className="text-sm text-gray-300">
            I agree to the{" "}
            <a href="#" className="text-primary-400 hover:underline">
              terms and conditions
            </a>
          </label>
        </div>
        <div className="flex justify-center items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 flex justify-center items-center ${
              isSubmitting
                ? "bg-gray-500 cursor-not-allowed text-gray-300"
                : "bg-teal-500 hover:bg-gray-600 hover:text-gray-50 text-gray-900"
            } font-semibold rounded-md transition-colors`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Register University"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
