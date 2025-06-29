import { Upload, FileText, Users, GraduationCap, UserCheck, AlertCircle } from "lucide-react";

export default function BulkRegistrationForm({
  role,
  handleRoleChange,
  handleFileUpload,
  bulkUploadData,
  uploadStatus,
}) {
  return (
    <div className="space-y-8">
      {/* Instructions Section */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Bulk User Registration</h3>
            <p className="text-sm text-slate-400">Upload an Excel or CSV file with user data</p>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-blue-300 font-medium mb-2">Required Columns:</h4>
              <p className="text-blue-200 text-sm leading-relaxed">
                Full Name, University Email, Phone Number, ID Number, Address, Department
                {role === "Student" && ", Level (PSM-1 or PSM-2)"}
                {role === "Supervisor" && ", Contact Email, Office Address"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Select Role for All Users</label>
            <div className="flex justify-center">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2 inline-flex">
                <button
                  type="button"
                  className={`group flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    role === "Student"
                      ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/25"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                  onClick={() => handleRoleChange("Student")}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-medium">Student</span>
                </button>
                <button
                  type="button"
                  className={`group flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    role === "Supervisor"
                      ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/25"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                  onClick={() => handleRoleChange("Supervisor")}
                >
                  <UserCheck className="w-5 h-5" />
                  <span className="font-medium">Supervisor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">Upload File</label>
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center px-6 py-12 border-2 border-dashed border-slate-600/50 rounded-xl bg-slate-800/30 hover:border-teal-500/50 hover:bg-slate-700/30 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload Your File</h3>
              <p className="text-slate-400 text-center max-w-md">
                Drag and drop your Excel or CSV file here, or click to browse
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Supported formats: .xlsx, .xls, .csv
              </p>
            </div>
          </div>

          {uploadStatus && (
            <div className={`p-4 rounded-xl border ${
              uploadStatus.includes("Success") || uploadStatus.includes("Loaded")
                ? "bg-emerald-900/20 border-emerald-500/30 text-emerald-300"
                : "bg-blue-900/20 border-blue-500/30 text-blue-300"
            }`}>
              <p className="font-medium">{uploadStatus}</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Table */}
      {bulkUploadData.length > 0 && (
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Preview ({bulkUploadData.length} users)</h4>
              <p className="text-sm text-slate-400">Review the data before registration</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-700/50">
            <div className="overflow-x-auto max-h-80">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Department</th>
                    {role === "Student" && (
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Level</th>
                    )}
                    {role === "Supervisor" && (
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Contact Email</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {bulkUploadData.slice(0, 10).map((user, index) => (
                    <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-300">{user.fullName}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{user.universityEmail}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{user.phoneNumber}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{user.department}</td>
                      {role === "Student" && (
                        <td className="px-4 py-3 text-sm text-slate-300">{user.level}</td>
                      )}
                      {role === "Supervisor" && (
                        <td className="px-4 py-3 text-sm text-slate-300">{user.contactEmail}</td>
                      )}
                    </tr>
                  ))}
                  {bulkUploadData.length > 10 && (
                    <tr>
                      <td colSpan={role === "Student" || role === "Supervisor" ? 5 : 4} className="px-4 py-3 text-center text-sm text-slate-400">
                        + {bulkUploadData.length - 10} more users
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}