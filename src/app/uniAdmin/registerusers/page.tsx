"use client";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function RegistrationForm() {
  const [role, setRole] = useState("Student");
  const [formData, setFormData] = useState({
    fullName: "",
    universityEmail: "",
    contactEmail: "",
    phoneNumber: "",
    address: "",
    idNumber: "",
    officeAddress: "",
  });
  const [bulkUploadData, setBulkUploadData] = useState([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", { ...formData, role });
    // Reset form after submission
    setFormData({
      fullName: "",
      universityEmail: "",
      contactEmail: "",
      phoneNumber: "",
      address: "",
      idNumber: "",
      officeAddress: "",
    });
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (bulkUploadData.length === 0) {
      setUploadStatus("No data to upload");
      return;
    }

    console.log(
      "Bulk submitted data:",
      bulkUploadData.map((item) => ({ ...item, role }))
    );
    setUploadStatus(`Successfully registered ${bulkUploadData.length} users`);
    setBulkUploadData([]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // Map the Excel data to our expected format
      const formattedData = jsonData.map((row) => ({
        fullName: row["Full Name"] || row["fullName"] || "",
        universityEmail:
          row["University Email"] || row["universityEmail"] || "",
        contactEmail: row["Contact Email"] || row["contactEmail"] || "",
        phoneNumber: row["Phone Number"] || row["phoneNumber"] || "",
        address: row["Address"] || row["address"] || "",
        idNumber: row["ID Number"] || row["idNumber"] || "",
        officeAddress: row["Office Address"] || row["officeAddress"] || "",
      }));

      setBulkUploadData(formattedData);
      setUploadStatus(`Loaded ${formattedData.length} users from file`);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-10">
      <div className="w-full max-w-5xl mx-4 bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-teal-400 text-center">
            User Registration
          </h2>
        </div>

        <div className="p-8">
          <form onSubmit={showBulkUpload ? handleBulkSubmit : handleSubmit} className="space-y-8">
            {/* Toggle between single and bulk registration */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-full transition-colors ${
                  !showBulkUpload
                    ? "bg-teal-400 text-gray-900 font-semibold"
                    : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => setShowBulkUpload(false)}
              >
                Single Registration
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full transition-colors ${
                  showBulkUpload
                    ? "bg-teal-400 text-gray-900 font-semibold"
                    : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => setShowBulkUpload(true)}
              >
                Bulk Registration
              </button>
            </div>

            {!showBulkUpload ? (
              <>
                {/* Role */}
                <div className="space-y-6">
                  <div className="border-l-4 border-teal-400 pl-4 bg-gray-700 rounded-tr-3xl rounded-br-3xl py-3">
                    <h3 className="text-xl font-semibold text-gray-100">User Role</h3>
                    <p className="text-sm text-gray-400 mt-1">Select the type of user to register</p>
                  </div>

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

                {/* Basic Fields */}
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

                  {/* Supervisor Extra Fields */}
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
              </>
            ) : (
              <div className="space-y-6">
                <div className="border-l-4 border-teal-400 pl-4 bg-gray-700 rounded-tr-3xl rounded-br-3xl py-3">
                  <h3 className="text-xl font-semibold text-gray-100">Bulk User Registration</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Upload an Excel or CSV file with user data. The file should include columns for:
                    Full Name, University Email, Phone Number, ID Number, Address
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
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-600">
                            {bulkUploadData.slice(0, 10).map((user, index) => (
                              <tr key={index} className="hover:bg-gray-600">
                                <td className="p-3 text-sm text-gray-300">{user.fullName}</td>
                                <td className="p-3 text-sm text-gray-300">{user.universityEmail}</td>
                                <td className="p-3 text-sm text-gray-300">{user.phoneNumber}</td>
                              </tr>
                            ))}
                            {bulkUploadData.length > 10 && (
                              <tr>
                                <td colSpan={3} className="p-3 text-center text-sm text-gray-400">
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
            )}

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-teal-400 hover:bg-teal-500 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                {showBulkUpload
                  ? `Register ${bulkUploadData.length} Users`
                  : `Register ${role}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}