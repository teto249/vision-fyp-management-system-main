"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import Header from "../components/UserRegistration/Header";
import RegistrationToggle from "../components/UserRegistration/RegistrationToggle";
import RoleSelector from "../components/UserRegistration/RoleSelector";
import SingleRegistrationForm from "../components/UserRegistration/SingleRegistrationForm";
import BulkRegistrationForm from "../components/UserRegistration/BulkRegistrationForm";
import SubmitButton from "../components/UserRegistration/SubmitButton";
import { registerSingleUser, registerBulkUsers } from "../../../api/uniAdmin/RegisterUniUsers";

export default function RegistrationForm() {
  const [role, setRole] = useState("Student");
  const [formData, setFormData] = useState({
    fullName: "",
    universityEmail: "",
    phoneNumber: "",
    address: "",
    idNumber: "",
    department: "", // Added department field
    ...(role === "Student" ? { level: "PSM-1" } : {}), // Default level for Student
    ...(role === "Supervisor" ? { contactEmail: "", officeAddress: "" } : {}),
  });
  const [bulkUploadData, setBulkUploadData] = useState([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (newRole) => {
    setFormData((prev) => ({
      ...prev,
      ...(newRole === "Student" ? { level: "PSM-1" } : {}), // Add level for Student
      ...(newRole === "Supervisor"
        ? { contactEmail: prev.contactEmail || "", officeAddress: prev.officeAddress || "" }
        : {}),
    }));
    setRole(newRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const password = `${formData.department}${formData.idNumber}`; // Compute password
      const submittedData = {
        ...formData,
        role: role as "Student" | "Supervisor",
        password,
        ...(role === "Student" ? { level: formData.level } : {}), // Include level for Student
        ...(role === "Supervisor"
          ? { contactEmail: formData.contactEmail, officeAddress: formData.officeAddress }
          : {}),
      };

      const result = await registerSingleUser(submittedData);
      console.log("Registration successful:", result);
      setFormData({
        fullName: "",
        universityEmail: "",
        phoneNumber: "",
        address: "",
        idNumber: "",
        department: "",
        ...(role === "Student" ? { level: "PSM-1" } : {}),
        ...(role === "Supervisor" ? { contactEmail: "", officeAddress: "" } : {}),
      });
      setUploadStatus("User registered successfully!");
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (bulkUploadData.length === 0) {
      setUploadStatus("No data to upload");
      return;
    }

    try {
      const submittedBulkData = bulkUploadData.map((item) => ({
        ...item,
        role,
        password: `${item.department}${item.idNumber}`, // Compute password
        ...(role === "Student" ? { level: item.level } : {}), // Include level for Student
        ...(role === "Supervisor"
          ? { contactEmail: item.contactEmail, officeAddress: item.officeAddress }
          : {}),
      }));

      const result = await registerBulkUsers(submittedBulkData);
      console.log("Bulk registration successful:", result);
      setBulkUploadData([]);
      setUploadStatus(`Successfully registered ${submittedBulkData.length} users`);
    } catch (error) {
      console.error("Bulk registration failed:", error);
      setError(error.message || "Bulk registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target.result instanceof ArrayBuffer) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        const formattedData = jsonData.map((row) => ({
          fullName: row["Full Name"] || row["fullName"] || "",
          universityEmail: row["University Email"] || row["universityEmail"] || "",
          phoneNumber: row["Phone Number"] || row["phoneNumber"] || "",
          address: row["Address"] || row["address"] || "",
          idNumber: row["ID Number"] || row["idNumber"] || "",
          department: row["Department"] || row["department"] || "",
          ...(role === "Student"
            ? { level: row["Level"] || row["level"] || "PSM-1" } // Default to PSM-1 if missing
            : {}),
          ...(role === "Supervisor"
            ? {
                contactEmail: row["Contact Email"] || row["contactEmail"] || "",
                officeAddress: row["Office Address"] || row["officeAddress"] || "",
              }
            : {}),
        }));

        setBulkUploadData(formattedData);
        setUploadStatus(`Loaded ${formattedData.length} users from file`);
      } else {
        setUploadStatus("File reading failed: result is not an ArrayBuffer");
      }
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