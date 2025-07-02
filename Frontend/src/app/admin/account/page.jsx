"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Profile from "./ui/Profile";
import ProHeader from "./ui/ProHeader";
import {
  fetchAdminAccount,
  updateAdminAccount,
} from "../../../api/admin/account";

export default function AdminProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    contactEmail: "",
    phoneNumber: "",
    address: "",
    profilePhoto: null,
    role: "",
    institution: {
      id: "",
      shortName: "",
      fullName: "",
      address: "",
      email: "",
      phone: "",
      logoPath: "",
    },
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedAdminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    if (storedAdminInfo) {

      setUserData(storedAdminInfo);
      setFormData((prev) => ({ ...prev, ...storedAdminInfo }));
    } else {
      setError("Please log in to view your profile.");
      setIsLoading(false);
    }
  }, []);

  const fetchProfileData = async (username) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAdminAccount(username);

      setFormData((prev) => ({
        ...prev,
        ...data,
        institution: { ...prev.institution, ...data.institution },
      }));
      setUserData(data);
      localStorage.setItem("adminInfo", JSON.stringify(data));
    } catch (error) {
      setError("Failed to load profile. Please try again.");
      console.error("Failed to fetch admin account details:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData.username) { // Changed from userData.id

      fetchProfileData(userData.username);
    }
  }, [userData.username]); // Changed dependency

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith("institution.")) {
      const field = id.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        institution: { ...prev.institution, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, profilePhoto: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.name) {
      toast.error("Name and email are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSaveStatus('saving');
    
    try {
      const dataToUpdate = {
        username: userData.username,
        adminName: formData.name,
        adminEmail: formData.email,
        contactEmail: formData.contactEmail,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        profilePhoto: formData.profilePhoto,
        institutionData: formData.institution
          ? {
              shortName: formData.institution.shortName || "",
              fullName: formData.institution.fullName || "",
              address: formData.institution.address || "",
              email: formData.institution.email || "",
              phone: formData.institution.phone || "",
            }
          : null,
      };

      const response = await updateAdminAccount(dataToUpdate);
      
      if (!response || typeof response !== "object") {
        throw new Error("Update failed: Invalid response");
      }

      await fetchProfileData(userData.username);
      setIsEditMode(false);
      setSaveStatus('success');
      toast.success("Profile updated successfully!", {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      });
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Failed to update admin account details:", error);
      setSaveStatus('error');
      toast.error(`Failed to update profile: ${error.message}`);
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading Profile</h2>
          <p className="text-slate-400">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Profile</h1>
          <p className="text-slate-400">Manage your account information and settings</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <ProHeader
            isEditMode={isEditMode}
            toggleEditMode={() => setIsEditMode(!isEditMode)}
            saveStatus={saveStatus}
          />
          <Profile
            formData={formData}
            fileInputRef={fileInputRef}
            handlePhotoChange={handlePhotoChange}
            triggerFileInput={() => fileInputRef.current?.click()}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            isEditMode={isEditMode}
            toggleEditMode={() => setIsEditMode(!isEditMode)}
            isSubmitting={isSubmitting}
            saveStatus={saveStatus}
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-white font-medium mb-1">Profile Complete</h3>
            <p className="text-slate-400 text-sm">Your profile is up to date</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-medium mb-1">Security</h3>
            <p className="text-slate-400 text-sm">Account is secure</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Loader2 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-medium mb-1">Activity</h3>
            <p className="text-slate-400 text-sm">Last login today</p>
          </div>
        </div>
      </div>
    </div>
  );
}
