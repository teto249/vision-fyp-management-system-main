"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Loader2, AlertCircle, CheckCircle2, Upload, Users, UserPlus } from "lucide-react";
import Header from "../components/UserRegistration/Header";
import RegistrationToggle from "../components/UserRegistration/RegistrationToggle";
import RoleSelector from "../components/UserRegistration/RoleSelector";
import SingleRegistrationForm from "../components/UserRegistration/SingleRegistrationForm";
import BulkRegistrationForm from "../components/UserRegistration/BulkRegistrationForm";
import SubmitButton from "../components/UserRegistration/SubmitButton";
import {
  registerSingleUser,
  registerBulkUsers,
} from "../../../api/uniAdmin/RegisterUniUsers";

// Type definitions
interface FormData {
  fullName: string;
  universityEmail: string;
  phoneNumber: string;
  address: string;
  idNumber: string;
  department: string;
  level?: string;
  contactEmail?: string;
  officeAddress?: string;
}

interface BulkUploadData extends FormData {
  role?: string;
  password?: string;
}

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface FieldErrors {
  [key: string]: string;
}

type Role = "Student" | "Supervisor";

export default function RegistrationForm() {
  const [role, setRole] = useState<Role>("Student");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    universityEmail: "",
    phoneNumber: "",
    address: "",
    idNumber: "",
    department: "",
    ...(role === "Student" ? { level: "PSM-1" } : {}),
    ...(role === "Supervisor" ? { contactEmail: "", officeAddress: "" } : {}),
  });
  const [bulkUploadData, setBulkUploadData] = useState<BulkUploadData[]>([]);
  const [showBulkUpload, setShowBulkUpload] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string): void => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setFieldErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleRoleChange = (newRole: Role): void => {
    setFormData((prev) => ({
      ...prev,
      ...(newRole === "Student" ? { level: "PSM-1" } : {}),
      ...(newRole === "Supervisor"
        ? {
            contactEmail: prev.contactEmail || "",
            officeAddress: prev.officeAddress || "",
          }
        : {}),
    }));
    setRole(newRole);
    setError("");
    setFieldErrors({});
    setUploadStatus("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const password = `${formData.department}${formData.idNumber}`;
      const submittedData = {
        ...formData,
        role: role,
        password,
        ...(role === "Student" ? { level: formData.level } : {}),
        ...(role === "Supervisor"
          ? {
              contactEmail: formData.contactEmail,
              officeAddress: formData.officeAddress,
            }
          : {}),
      };

      const result = await registerSingleUser(submittedData);
      console.log("Registration successful:", result);
      
      // Reset form
      setFormData({
        fullName: "",
        universityEmail: "",
        phoneNumber: "",
        address: "",
        idNumber: "",
        department: "",
        ...(role === "Student" ? { level: "PSM-1" } : {}),
        ...(role === "Supervisor"
          ? { contactEmail: "", officeAddress: "" }
          : {}),
      });
      
      showNotification("success", "User registered successfully!");
      setUploadStatus("User registered successfully!");
    } catch (error: any) {
      console.error("Registration failed:", error);
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
        setError("Validation failed. Please correct the highlighted fields.");
      } else {
        const errorMessage = error.message || "Registration failed";
        setError(errorMessage);
        showNotification("error", errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (bulkUploadData.length === 0) {
      setUploadStatus("No data to upload");
      setIsSubmitting(false);
      showNotification("error", "No data to upload");
      return;
    }

    try {
      const submittedBulkData = bulkUploadData.map((item) => ({
        ...item,
        role,
        password: `${item.department}${item.idNumber}`,
        ...(role === "Student" ? { level: item.level } : {}),
        ...(role === "Supervisor"
          ? {
              contactEmail: item.contactEmail,
              officeAddress: item.officeAddress,
            }
          : {}),
      }));

      const result = await registerBulkUsers(submittedBulkData);
      console.log("Bulk registration successful:", result);
      setBulkUploadData([]);
      const successMessage = `Successfully registered ${submittedBulkData.length} users`;
      setUploadStatus(successMessage);
      showNotification("success", successMessage);
    } catch (error: any) {
      console.error("Bulk registration failed:", error);
      if (error.response?.data?.failed?.length > 0) {
        const failed = error.response.data.failed;
        const failedEmails = failed
          .map((u: any) => u?.data?.universityEmail || "unknown")
          .join(", ");
        const errorMessage = `Bulk registration failed for: ${failedEmails}`;
        setError(errorMessage);
        showNotification("error", errorMessage);
      } else {
        const errorMessage = error.message || "Bulk registration failed";
        setError(errorMessage);
        showNotification("error", errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        if (!(event.target?.result instanceof ArrayBuffer)) {
          throw new Error("File reading failed: result is not an ArrayBuffer");
        }
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet);

        const formattedData: BulkUploadData[] = jsonData.map((row: any) => ({
          fullName: row["Full Name"] || row["fullName"] || "",
          universityEmail:
            row["University Email"] || row["universityEmail"] || "",
          phoneNumber: row["Phone Number"] || row["phoneNumber"] || "",
          address: row["Address"] || row["address"] || "",
          idNumber: row["ID Number"] || row["idNumber"] || "",
          department: row["Department"] || row["department"] || "",
          ...(role === "Student"
            ? { level: row["Level"] || row["level"] || "PSM-1" }
            : {}),
          ...(role === "Supervisor"
            ? {
                contactEmail: row["Contact Email"] || row["contactEmail"] || "",
                officeAddress:
                  row["Office Address"] || row["officeAddress"] || "",
              }
            : {}),
        }));

        setBulkUploadData(formattedData);
        const successMessage = `Loaded ${formattedData.length} users from file`;
        setUploadStatus(successMessage);
        showNotification("info", successMessage);
      } catch (err: any) {
        console.error("File upload error:", err);
        const errorMessage = "Failed to parse Excel file. Please check format.";
        setError(errorMessage);
        showNotification("error", errorMessage);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className={`p-4 rounded-xl shadow-2xl backdrop-blur-xl border max-w-sm
            ${notification.type === 'success' 
              ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300' 
              : notification.type === 'error'
              ? 'bg-red-900/20 border-red-500/30 text-red-300'
              : 'bg-blue-900/20 border-blue-500/30 text-blue-300'
            }`}>
            <div className="flex items-center space-x-3">
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              {notification.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-400" />}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl mb-6 shadow-2xl shadow-teal-500/25">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
              User Registration
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full mb-6" />
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Register new students and supervisors to the university system
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
            <Header />
            
            <div className="p-8">
              <form
                onSubmit={showBulkUpload ? handleBulkSubmit : handleSubmit}
                className="space-y-8"
              >
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
                      fieldErrors={fieldErrors}
                    />
                  </>
                )}
                
                <SubmitButton
                  showBulkUpload={showBulkUpload}
                  bulkUploadData={bulkUploadData}
                  role={role}
                  isSubmitting={isSubmitting}
                />
                
                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <p className="text-red-300 font-medium">{error}</p>
                    </div>
                  </div>
                )}
                
                {uploadStatus && !error && (
                  <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <p className="text-emerald-300 font-medium">{uploadStatus}</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
