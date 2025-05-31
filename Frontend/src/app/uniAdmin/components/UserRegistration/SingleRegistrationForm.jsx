export default function SingleRegistrationForm({ role, formData, handleChange }) {
  return (
    <div className="space-y-6">
      <div className="border-l-4 border-teal-400 pl-4 bg-gray-700 rounded-tr-3xl rounded-br-3xl py-3">
        <h3 className="text-xl font-semibold text-gray-100">Personal Information</h3>
        <p className="text-sm text-gray-400 mt-1">Basic details about the user</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Full Name</label>
          <input
            id="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">University Email</label>
          <input
            id="universityEmail"
            placeholder="University Email"
            type="email"
            value={formData.universityEmail}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Phone Number</label>
          <input
            id="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">ID Number</label>
          <input
            id="idNumber"
            placeholder="ID Number"
            value={formData.idNumber}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Department</label>
          <input
            id="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          />
        </div>
        {role === "Student" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Level</label>
            <select
              id="level"
              value={formData.level}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
            >
              <option value="PSM-1">PSM-1</option>
              <option value="PSM-2">PSM-2</option>
            </select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Address</label>
        <textarea
          id="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
        />
      </div>

      {role === "Supervisor" && (
        <div className="space-y-6">
          <div className="border-l-4 border-teal-400 pl-4 bg-gray-700 rounded-tr-3xl rounded-br-3xl py-3">
            <h3 className="text-xl font-semibold text-gray-100">Supervisor Details</h3>
            <p className="text-sm text-gray-400 mt-1">Additional information for supervisors</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Contact Email</label>
              <input
                id="contactEmail"
                placeholder="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Office Address</label>
              <input
                id="officeAddress"
                placeholder="Office Address"
                value={formData.officeAddress}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}