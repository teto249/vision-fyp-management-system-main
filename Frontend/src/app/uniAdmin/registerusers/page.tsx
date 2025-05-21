"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import Header from "../components/UserRegistration/Header";
import RegistrationToggle from "../components/UserRegistration/RegistrationToggle";
import RoleSelector from "../components/UserRegistration/RoleSelector";
import SingleRegistrationForm from "../components/UserRegistration/SingleRegistrationForm";
import BulkRegistrationForm from "../components/UserRegistration/BulkRegistrationForm";
import SubmitButton from "../components/UserRegistration/SubmitButton";

export default function RegistrationForm() {
  const [role, setRole] = useState("Student");
  const [formData, setFormData] = useState({
    fullName: "",
    universityEmail: "",
    phoneNumber: "",
    address: "",
    idNumber: "",
    ...(role === "Supervisor" ? { contactEmail: "", officeAddress: "" } : {}),
  });
  const [bulkUploadData, setBulkUploadData] = useState([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (newRole) => {
    // Update formData to include/exclude supervisor-specific fields based on new role
    setFormData((prev) => ({
      ...prev,
      ...(newRole === "Supervisor"
        ? { contactEmail: prev.contactEmail || "", officeAddress: prev.officeAddress || "" }
        : {}),
    }));
    setRole(newRole);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare submitted data, excluding supervisor fields for Student role
    const submittedData = {
      ...formData,
      role,
      ...(role === "Supervisor" ? { contactEmail: formData.contactEmail, officeAddress: formData.officeAddress } : {}),
    };
    console.log("Submitted data:", submittedData);
    // Reset form based on current role
    setFormData({
      fullName: "",
      universityEmail: "",
      phoneNumber: "",
      address: "",
      idNumber: "",
      ...(role === "Supervisor" ? { contactEmail: "", officeAddress: "" } : {}),
    });
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (bulkUploadData.length === 0) {
      setUploadStatus("No data to upload");
      return;
    }

    // Prepare bulk data, excluding supervisor fields for Student role
    const submittedBulkData = bulkUploadData.map((item) => ({
      ...item,
      role,
      ...(role === "Supervisor" ? { contactEmail: item.contactEmail, officeAddress: item.officeAddress } : {}),
    }));
    console.log("Bulk submitted data:", submittedBulkData);
    setUploadStatus(`Successfully registered ${submittedBulkData.length} users`);
    setBulkUploadData([]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const formattedData = jsonData.map((row) => ({
        fullName: row["Full Name"] || row["fullName"] || "",
        universityEmail: row["University Email"] || row["universityEmail"] || "",
        phoneNumber: row["Phone Number"] || row["phoneNumber"] || "",
        address: row["Address"] || row["address"] || "",
        idNumber: row["ID Number"] || row["idNumber"] || "",
        ...(role === "Supervisor"
          ? {
              contactEmail: row["Contact Email"] || row["contactEmail"] || "",
              officeAddress: row["Office Address"] || row["officeAddress"] || "",
            }
          : {}),
      }));

      setBulkUploadData(formattedData);
      setUploadStatus(`Loaded ${formattedData.length} users from file`);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-10">
      <div className="w-full max-w-5xl mx-4 bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <Header />
        <div className="p-8">
          <form onSubmit={showBulkUpload ? handleBulkSubmit : handleSubmit} className="space-y-8">
            <RegistrationToggle
              showBulkUpload={showBulkUpload}
              setShowBulkUpload={setShowBulkUpload}
            />
            {showBulkUpload ? (
              <BulkRegistrationForm
                role={role}
                handleRoleChange={handleRoleChange}
                handleFileUpload={handleFileUpload}
                bulkUploadData={bulkUploadData}
                uploadStatus={uploadStatus}
              />
            ) : (
              <>
                <RoleSelector role={role} handleRoleChange={handleRoleChange} />
                <SingleRegistrationForm
                  role={role}
                  formData={formData}
                  handleChange={handleChange}
                />
              </>
            )}
            <SubmitButton
              showBulkUpload={showBulkUpload}
              bulkUploadData={bulkUploadData}
              role={role}
            />
          </form>
        </div>
      </div>
    </div>
  );
}