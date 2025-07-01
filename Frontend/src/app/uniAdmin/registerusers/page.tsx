"use client";
import { useState, useCallback } from "react";
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
  level?: "PSM-1" | "PSM-2";
  contactEmail?: string;
  officeAddress?: string;
}

interface Notification {
  type: "success" | "error" | "info";
  message: string;
}

type Role = "Student" | "Supervisor";

export default function RegistrationForm() {
  const [role, setRole] = useState<Role>("Student");
  const [formData, setFormData] = useState<FormData>(() => getDefaultFormData("Student"));
  const [bulkUploadData, setBulkUploadData] = useState<FormData[]>([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>(""); // Added missing state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}); // Added missing state

  const showNotification = useCallback((type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleRoleChange = useCallback((newRole: Role) => {
    setRole(newRole);
    setFormData(getDefaultFormData(newRole));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submittedData = prepareSubmittedData(formData, role);
      await registerSingleUser(submittedData);
      showNotification("success", `${submittedData.fullName} registered successfully!`);
      setFormData(getDefaultFormData(role));
    } catch (error: any) {
      handleError(error, setNotification);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (bulkUploadData.length === 0) {
      showNotification("error", "No data to upload");
      setIsSubmitting(false);
      return;
    }

    try {
      const submittedBulkData = bulkUploadData.map((item) => prepareSubmittedData(item, role));
      await registerBulkUsers(submittedBulkData);
      showNotification("success", `Successfully registered ${submittedBulkData.length} users`);
      setBulkUploadData([]);
    } catch (error: any) {
      handleError(error, setNotification);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet);

        const formattedData = jsonData.map((row) => formatRowData(row, role));
        setBulkUploadData(formattedData);
        showNotification("info", `Loaded ${formattedData.length} users from file`);
      } catch {
        showNotification("error", "Failed to parse Excel file. Please check format.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Notification */}
      {notification && <NotificationBanner notification={notification} />}

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <Header />
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <form onSubmit={showBulkUpload ? handleBulkSubmit : handleSubmit} className="space-y-8">
                <RegistrationToggle showBulkUpload={showBulkUpload} setShowBulkUpload={setShowBulkUpload} />
                {showBulkUpload ? (
                  <BulkRegistrationForm
                    role={role}
                    handleRoleChange={handleRoleChange}
                    handleFileUpload={handleFileUpload}
                    bulkUploadData={bulkUploadData}
                    uploadStatus={uploadStatus} // Added missing prop
                  />
                ) : (
                  <>
                    <RoleSelector role={role} handleRoleChange={handleRoleChange} />
                    <SingleRegistrationForm
                      role={role}
                      formData={formData}
                      handleChange={handleChange}
                      fieldErrors={fieldErrors} // Added missing prop
                    />
                  </>
                )}
                <SubmitButton
                  showBulkUpload={showBulkUpload} // Added missing prop
                  bulkUploadData={bulkUploadData} // Added missing prop
                  role={role} // Added missing prop
                  isSubmitting={isSubmitting}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getDefaultFormData(role: Role): FormData {
  return role === "Student"
    ? { fullName: "", universityEmail: "", phoneNumber: "", address: "", idNumber: "", department: "", level: "PSM-1" }
    : { fullName: "", universityEmail: "", phoneNumber: "", address: "", idNumber: "", department: "", contactEmail: "", officeAddress: "" };
}

function prepareSubmittedData(data: FormData, role: Role) {
  return {
    ...data,
    role,
    password: `${data.department}${data.idNumber}`,
  };
}

function formatRowData(row: any, role: Role): FormData {
  return {
    fullName: row["Full Name"] || "",
    universityEmail: row["University Email"] || "",
    phoneNumber: row["Phone Number"] || "",
    address: row["Address"] || "",
    idNumber: row["ID Number"] || "",
    department: row["Department"] || "",
    ...(role === "Student" ? { level: row["Level"] || "PSM-1" } : {}),
    ...(role === "Supervisor" ? { contactEmail: row["Contact Email"] || "", officeAddress: row["Office Address"] || "" } : {}),
  };
}

function handleError(error: any, setNotification: (notification: Notification) => void) {
  console.error("Error:", error);
  const errorMessage = error.response?.data?.message || error.message || "An error occurred";
  setNotification({ type: "error", message: errorMessage }); // Ensure `setNotification` is used correctly
}

function NotificationBanner({ notification }: { notification: Notification }) {
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-xl border max-w-sm ${
      notification.type === "success"
        ? "bg-emerald-900/20 border-emerald-500/30 text-emerald-300"
        : notification.type === "error"
        ? "bg-red-900/20 border-red-500/30 text-red-300"
        : "bg-blue-900/20 border-blue-500/30 text-blue-300"
    }`}>
      <div className="flex items-center space-x-3">
        {notification.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        {notification.type === "error" && <AlertCircle className="w-5 h-5 text-red-400" />}
        {notification.type === "info" && <AlertCircle className="w-5 h-5 text-blue-400" />}
        <p className="text-sm font-medium">{notification.message}</p>
      </div>
    </div>
  );
}
