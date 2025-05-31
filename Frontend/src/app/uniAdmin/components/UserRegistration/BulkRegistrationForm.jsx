export default function BulkRegistrationForm({
  role,
  handleRoleChange,
  handleFileUpload,
  bulkUploadData,
  uploadStatus,
}) {
  return (
    <div className="space-y-6">
      <div className="border-l-4 border-teal-400 pl-4 bg-gray-700 rounded-tr-3xl rounded-br-3xl py-3">
        <h3 className="text-xl font-semibold text-gray-100">Bulk User Registration</h3>
        <p className="text-sm text-gray-400 mt-1">
          Upload an Excel or CSV file with user data. The file should include columns for:
          Full Name, University Email, Phone Number, ID Number, Address, Department
          {role === "Student" ? ", Level (PSM-1 or PSM-2)" : ""}
          {role === "Supervisor" ? ", Contact Email, Office Address" : ""}.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Select Role for all users</label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-full transition-colors ${
                role === "Student"
                  ? "bg-teal-400 text-gray-900 font-semibold"
                  : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => handleRoleChange("Student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-full transition-colors ${
                role === "Supervisor"
                  ? "bg-teal-400 text-gray-900 font-semibold"
                  : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => handleRoleChange("Supervisor")}
            >
              Supervisor
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Upload File</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center px-4 py-6 bg-gray-700 text-teal-400 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer hover:border-teal-400 transition-colors w-full">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              <span className="text-sm">Click to upload file (Excel/CSV)</span>
              <input 
                type="file" 
                accept=".xlsx,.xls,.csv" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          </div>
        </div>

        {uploadStatus && (
          <div
            className={`p-3 rounded ${
              uploadStatus.includes("Success")
                ? "bg-green-800 text-green-100"
                : "bg-blue-800 text-blue-100"
            }`}
          >
            {uploadStatus}
          </div>
        )}

        {bulkUploadData.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-300">Users to be registered ({bulkUploadData.length} total):</h4>
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-gray-300">Name</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-300">Email</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-300">Phone</th>
                    {role === "Student" && (
                      <th className="p-3 text-left text-sm font-medium text-gray-300">Level</th>
                    )}
                    {role === "Supervisor" && (
                      <th className="p-3 text-left text-sm font-medium text-gray-300">Contact Email</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {bulkUploadData.slice(0, 10).map((user, index) => (
                    <tr key={index} className="hover:bg-gray-600">
                      <td className="p-3 text-sm text-gray-300">{user.fullName}</td>
                      <td className="p-3 text-sm text-gray-300">{user.universityEmail}</td>
                      <td className="p-3 text-sm text-gray-300">{user.phoneNumber}</td>
                      {role === "Student" && (
                        <td className="p-3 text-sm text-gray-300">{user.level}</td>
                      )}
                      {role === "Supervisor" && (
                        <td className="p-3 text-sm text-gray-300">{user.contactEmail}</td>
                      )}
                    </tr>
                  ))}
                  {bulkUploadData.length > 10 && (
                    <tr>
                      <td colSpan={role === "Student" || role === "Supervisor" ? 4 : 3} className="p-3 text-center text-sm text-gray-400">
                        + {bulkUploadData.length - 10} more users
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}