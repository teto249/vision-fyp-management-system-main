"use client";
import { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Profile from "./ui/Profile";
import Divider from "./ui/Divider";
import ProHeader from "./ui/ProHeader";
import {
  fetchSupervisorAccount,
  updateSupervisorAccount,
} from "../../../api/SupervisorApi/account";

interface University {
  id: string;
  shortName: string;
  fullName: string;
  address: string;
  status: string;
}

interface FormData {
  userId: string;
  fullName: string;
  email: string;
  universityEmail: string;
  phoneNumber: string;
  address: string;
  contactEmail: string;
  officeAddress: string;
  department: string;
  role: string;
  profilePhoto: string | null;
  university: University;
}

export default function SupervisorProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userData, setUserData] = useState<FormData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    fullName: "",
    email: "",
    universityEmail: "",
    phoneNumber: "",
    address: "",
    contactEmail: "",
    officeAddress: "",
    department: "",
    role: "Supervisor",
    profilePhoto: null,
    university: {
      id: "",
      shortName: "",
      fullName: "",
      address: "",
      status: "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const stored = localStorage.getItem("supervisorInfo");
        if (!stored) {
          setError("Please log in to view your profile.");
          setIsLoading(false);
          return;
        }

        const storedInfo = JSON.parse(stored);
        

        const userId = storedInfo?.userId || storedInfo?.username;
        if (!userId) {
          setError("Invalid user data. Please log in again.");
          setIsLoading(false);
          return;
        }

        const currentData = await fetchSupervisorAccount(userId);
        setFormData({
          userId: currentData.userId,
          fullName: currentData.fullName,
          email: currentData.email,
          universityEmail: currentData.universityEmail,
          phoneNumber: currentData.phoneNumber,
          address: currentData.address,
          contactEmail: currentData.contactEmail,
          officeAddress: currentData.officeAddress,
          department: currentData.department,
          role: currentData.role,
          profilePhoto: null, // Will be handled separately if needed
          university: {
            id: currentData.university?.id || "",
            shortName: currentData.university?.shortName || "",
            fullName: currentData.university?.fullName || "",
            address: currentData.university?.address || "",
            status: currentData.university?.status || "",
          },
        });
        setUserData({
          userId: currentData.userId,
          fullName: currentData.fullName,
          email: currentData.email,
          universityEmail: currentData.universityEmail,
          phoneNumber: currentData.phoneNumber,
          address: currentData.address,
          contactEmail: currentData.contactEmail,
          officeAddress: currentData.officeAddress,
          department: currentData.department,
          role: currentData.role,
          profilePhoto: null,
          university: {
            id: currentData.university?.id || "",
            shortName: currentData.university?.shortName || "",
            fullName: currentData.university?.fullName || "",
            address: currentData.university?.address || "",
            status: currentData.university?.status || "",
          },
        });
      } catch (error: any) {
        setError(error.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id.startsWith("university.")) {
      const field = id.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        university: { ...prev.university, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Profile photo must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: event.target?.result as string,
        }));
      };
      reader.onerror = () => {
        setError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const dataToUpdate = {
        userId: formData.userId,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        contactEmail: formData.contactEmail,
        officeAddress: formData.officeAddress,
        department: formData.department,
      };

      const response = await updateSupervisorAccount(dataToUpdate);

      if (!response) {
        throw new Error("No response received from server");
      }

      setFormData((prev) => ({
        ...prev,
        ...response,
        university: response.university || prev.university,
      }));

      localStorage.setItem("supervisorInfo", JSON.stringify(response));
      setIsEditMode(false);
      setSuccessMessage("Profile updated successfully!");
    } catch (error: any) {
      console.error("Update failed:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.userId) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center p-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg font-medium">{error}</p>
          <button
            onClick={() => (window.location.href = "/supervisor/login")}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success/Error Messages */}
        {(successMessage || error) && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              successMessage
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            } backdrop-blur-xl`}
          >
            <div className="flex items-center space-x-3">
              {successMessage ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p className="font-medium">{successMessage || error}</p>
            </div>
          </div>
        )}

        {/* Main Profile Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <ProHeader
            isEditMode={isEditMode}
            toggleEditMode={() => setIsEditMode(!isEditMode)}
          />
          <Divider />
          <Profile
            formData={formData}
            fileInputRef={fileInputRef}
            handlePhotoChange={handlePhotoChange}
            triggerFileInput={() => fileInputRef.current?.click()}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            toggleEditMode={() => setIsEditMode(!isEditMode)}
          />
        </div>
      </div>
    </div>
  );
}
