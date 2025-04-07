export default function UniversityRegistrationForm() {
  return (
    <div className="flex justify-center items-start min-h-screen bg-base-100 py-10">
      <div className="w-full max-w-4xl mx-4 bg-base-200 rounded-2xl shadow-lg overflow-hidden">
        <h5 className=" text-center  bg-base-300/10 p-4 px-2 text-xl font-bold">
          University Registration
        </h5>
        <div class="divider divider-neutral mx-auto mb-4 mt-2 max-w-50"></div>

        <div className="p-6  ">
          <form className="grid gap-y-2 ">
            {/* Basic Information */}

            <div class="m-2 divider  text-xl ">University Details</div>

            {/* University Name */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="label-text" htmlFor="shortName">
                  Short Name
                </label>
                <input
                  id="shortName"
                  type="text"
                  placeholder="UTM"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="label-text" htmlFor="universityName">
                  Full University Name
                </label>
                <input
                  id="universityName"
                  type="text"
                  placeholder="University Technology Malaysia"
                  className="input w-full"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="label-text" htmlFor="universityAddress">
                Address
              </label>
              <input
                id="universityAddress"
                type="text"
                placeholder="47, Jalan Utama 38, Muttara Rini, Johor Bahru Skudai"
                className="input w-full"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="label-text" htmlFor="contactEmail">
                  Contact Email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  placeholder="info@utm.my"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="label-text" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="0123456789"
                  className="input w-full"
                  required
                />
              </div>
            </div>
            {/* User Capacity */}

            <div class="m-2 divider text-xl">User Capacity</div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="label-text" htmlFor="maxStudents">
                  Maximum Students Allowed
                </label>
                <input
                  id="maxStudents"
                  type="number"
                  placeholder="1000"
                  min="1"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="label-text" htmlFor="maxSupervisors">
                  Maximum Supervisors Allowed
                </label>
                <input
                  id="maxSupervisors"
                  type="number"
                  placeholder="200"
                  min="1"
                  className="input w-full"
                  required
                />
              </div>
            </div>

            {/* Additional Fields */}
            <div class="m-2 divider text-xl">Additional Information</div>

            <div>
              <label className="label-text" htmlFor="universityLogo">
                University Logo
              </label>
              <input
                id="universityLogo"
                type="file"
                accept="image/*"
                className="input w-full"
              />
            </div>

            <div>
              <label className="label-text" htmlFor="description">
                University Description
              </label>
              <textarea
                id="description"
                className="textarea w-full min-h-32"
                placeholder="Brief description about the university..."
              ></textarea>
            </div>

            {/* Admin Information */}
            <div class="m-2 divider text-xl">Admin Details</div>

            <div>
              <label className="label-text" htmlFor="adminName">
                Admin Full Name
              </label>
              <input
                id="adminName"
                type="text"
                placeholder="Altayeb Mustafa Ibrahim Abdelrasoul"
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="label-text" htmlFor="adminEmail">
                Admin Email
              </label>
              <input
                id="adminEmail"
                type="email"
                placeholder="admin@graduate.utm.my"
                className="input w-full"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="label-text" htmlFor="contactEmail">
                  Contact Email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  placeholder="info@utm.my"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="label-text" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="0123456789"
                  className="input w-full"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label-text" htmlFor="adminAddress">
                Address
              </label>
              <input
                id="adminAddress"
                type="text"
                placeholder="43, Jalan Utama 38, Muttara Rini, Johor Bahru Skudai"
                className="input w-full"
                required
              />
            </div>

            {/* Terms and Submission */}
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="termsAgreement"
                  className="checkbox checkbox-primary"
                  required
                />
                <label
                  className="label-text text-base"
                  htmlFor="termsAgreement"
                >
                  I agree to the terms and conditions
                </label>
              </div>
            </div>

            <div className="mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Register University
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
