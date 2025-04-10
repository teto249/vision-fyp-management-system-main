export default function UniversityRegistrationForm() {
  return (
    <div className="flex justify-center items-start min-h-screen py-10 ">
      <div className="w-full max-w-5xl mx-4 bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="c p-6">
          <h2 className="text-2xl font-bold text-teal-400 text-center">
            University Registration
          </h2>
        </div>

        <div className="p-8">
          <form className="space-y-8">
            {/* University Details */}
            <div className="space-y-6">
              <div className="border-l-4 border-teal-400 pl-4 bg-gray-700 rounded-tr-3xl rounded-br-3xl py-3">
                <h3 className="text-xl font-semibold text-gray-100">University Details</h3>
                <p className="text-sm text-gray-400 mt-1">Basic information about the institution</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Short Name</label>
                  <input
                    type="text"
                    placeholder="UTM"
                    className="input w-full bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    type="text"
                    placeholder="University Technology Malaysia"
                    className="input w-full bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Address</label>
                <input
                  type="text"
                  placeholder="Full physical address"
                  className="input w-full bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="border-l-4 border-teal-400 pl-4 bg-gray-700 rounded-tr-3xl rounded-br-3xl py-3">
                <h3 className="text-xl font-semibold text-gray-100">Contact Information</h3>
                <p className="text-sm text-gray-400 mt-1">Official communication channels</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    placeholder="contact@university.edu"
                    className="input w-full bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Phone</label>
                  <input
                    type="tel"
                    placeholder="+60 12 345 6789"
                    className="input w-full bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Capacity Section */}
            <div className="space-y-6">
              <div className="border-l-4 border-teal-400 pl-4 bg-gray-700 rounded-tr-3xl rounded-br-3xl py-3">
                <h3 className="text-xl font-semibold text-gray-100">System Capacity</h3>
                <p className="text-sm text-gray-400 mt-1">User limits for the platform</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Max Students
                    <span className="ml-1 text-gray-400">(recommended: 1000-5000)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input w-full bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Max Supervisors
                    <span className="ml-1 text-gray-400">(recommended: 50-200)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input w-full bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <div className="border-l-4 border-teal-400 pl-4 bg-gray-700 rounded-tr-3xl rounded-br-3xl py-3">
                <h3 className="text-xl font-semibold text-gray-100">Additional Details</h3>
                <p className="text-sm text-gray-400 mt-1">Institutional branding and information</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">University Logo</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center px-4 py-6 bg-gray-700 text-teal-400 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer hover:border-teal-400 transition-colors">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                    <span className="text-sm">Click to upload logo</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  rows={4}
                  className="textarea w-full bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  placeholder="Brief description about the university..."
                ></textarea>
              </div>
            </div>

            {/* Admin Details */}
            <div className="space-y-6">
              <div className="border-l-4 border-teal-400 pl-4 bg-gray-700 rounded-tr-3xl rounded-br-3xl py-3">
                <h3 className="text-xl font-semibold text-gray-100">Administrator Details</h3>
                <p className="text-sm text-gray-400 mt-1">Primary contact information</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    type="text"
                    className="input w-full bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      className="input w-full bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Phone</label>
                    <input
                      type="tel"
                      className="input w-full bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Submission */}
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary mt-1 bg-gray-700 border-gray-600 checked:border-teal-400 checked:bg-teal-400 focus:ring-teal-400"
                  required
                />
                <label className="text-sm text-gray-300">
                  I agree to the{' '}
                  <a href="#" className="text-teal-400 hover:underline">
                    terms and conditions
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full btn btn-lg bg-teal-400 hover:bg-teal-500 text-gray-900 font-semibold transition-colors"
              >
                Register University
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}