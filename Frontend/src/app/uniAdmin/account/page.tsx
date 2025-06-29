"use client";
import { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, CheckCircle2, User, Shield, Building } from "lucide-react";
import Profile from "./ui/Profile";
import ProHeader from "./ui/ProHeader";
import { fetchUniAdminAccount, updateUniAdminAccount } from "../../../api/uniAdmin/account";

interface University {
  id: string;
  shortName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

interface FormData {
  username: string;
  fullName: string;
  primaryEmail: string;
  phoneNumber: string;
  role: string;
  profilePhoto: string | null;
  university: University;
}

export default function UniAdminProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<FormData | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'success' | 'error' | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    fullName: "",
    primaryEmail: "",
    phoneNumber: "",
    role: "",
    profilePhoto: null,
    university: {
      id: "",
      shortName: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      status: "",
    },
  });

  // Show notification function
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Load initial data from localStorage and fetch current data
  useEffect(() => {
    const initializeProfile = async () => {
      
      try {
        const storedInfo = localStorage.getItem("adminInfo");

        if (!storedInfo) {
          setError("Your session has expired. Please log in to view your profile.");
          showNotification('error', 'Session expired. Please log in again.');
          setIsLoading(false);
          return;
        }

        let parsedInfo;
        try {
          parsedInfo = JSON.parse(storedInfo);
        } catch (parseError) {
          setError("Invalid session data. Please log in again.");
          showNotification('error', 'Session data corrupted. Please log in again.');
          localStorage.removeItem("adminInfo");
          setIsLoading(false);
          return;
        }

        setUserData(parsedInfo);

        if (!parsedInfo.username) {
          setError("Invalid user data found. Please log in again.");
          showNotification('error', 'User data is incomplete. Please log in again.');
          localStorage.removeItem("adminInfo");
          setIsLoading(false);
          return;
        }

        showNotification('info', 'Loading your profile information...');
        const currentData = await fetchUniAdminAccount(parsedInfo.username);

        if (!currentData || !currentData.username) {
          throw new Error("Unable to fetch current profile data from server");
        }

        setFormData({
          username: currentData.username,
          fullName: currentData.fullName,
          primaryEmail: currentData.primaryEmail,
          phoneNumber: currentData.phoneNumber,
          role: currentData.role,
          profilePhoto: currentData.profilePhoto,
          university: {
            id: currentData.university?.id || "",
            shortName: currentData.university?.shortName || "",
            fullName: currentData.university?.fullName || "",
            email: currentData.university?.email || "",
            phone: currentData.university?.phone || "",
            address: currentData.university?.address || "",
            status: currentData.university?.status || "",
          },
        });
        
        showNotification('success', 'Profile loaded successfully!');
      } catch (error: any) {
        const errorMessage = error.message || "Failed to load profile";
        setError(errorMessage);
        showNotification('error', `Unable to load profile: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, []);

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

    if (!file) {
      showNotification('info', 'No file selected');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Image size must be less than 5MB. Please choose a smaller image.');
      e.target.value = ''; // Clear the input
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('error', 'Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      e.target.value = ''; // Clear the input
      return;
    }

    showNotification('info', 'Processing image...');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, profilePhoto: event.target?.result as string }));
      showNotification('success', 'Profile photo updated successfully! Remember to save your changes.');
    };
    reader.onerror = () => {
      showNotification('error', 'Failed to process the image. Please try again with a different file.');
      e.target.value = ''; // Clear the input
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.username) {
      errors.push("Username is missing. Please log in again.");
    }
    if (!formData.fullName.trim()) {
      errors.push("Full name is required.");
    }
    if (!formData.primaryEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryEmail)) {
      errors.push("A valid email address is required.");
    }
    if (!formData.phoneNumber || !/^\+?[\d\s-()]{10,}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.push("A valid phone number is required (minimum 10 digits).");
    }
    
    if (errors.length > 0) {
      return errors.join(" ");
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading state immediately
    setSaveStatus('saving');
    showNotification('info', 'Validating profile information...');
    
    const validationError = validateForm();
    if (validationError) {
      setSaveStatus('error');
      showNotification('error', validationError);
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    setIsSubmitting(true);
    showNotification('info', 'Updating your profile...');
    
    try {
      const dataToUpdate = {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.primaryEmail,
        phoneNumber: formData.phoneNumber,
        profilePhoto: formData.profilePhoto,
        universityData: {
          shortName: formData.university?.shortName,
          fullName: formData.university?.fullName,
          email: formData.university?.email,
          phone: formData.university?.phone,
          address: formData.university?.address,
        },
      };

      const response = await updateUniAdminAccount(dataToUpdate);

      if (!response || !response.username) {
        throw new Error("Server returned invalid data. Please try again.");
      }

      setFormData((prev) => ({
        ...prev,
        ...response,
        university: { ...prev.university, ...(response.university || {}) },
      }));
      
      // Update userData with proper type conversion
      if (response.university) {
        setUserData({
          ...response,
          university: response.university
        } as FormData);
      }
      
      localStorage.setItem("adminInfo", JSON.stringify(response));

      setIsEditMode(false);
      setSaveStatus('success');
      showNotification('success', 'Your profile has been successfully updated!');
      
      // Store the update timestamp
      localStorage.setItem("profileLastUpdated", new Date().toISOString());
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      setSaveStatus('error');
      showNotification('error', `Failed to update profile: ${errorMessage}`);
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-900/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-red-300 mb-4">Access Error</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                     text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-red-500/25"
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
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <Loader2 className="relative w-16 h-16 text-teal-400 animate-spin mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Loading Your Profile</h2>
          <p className="text-slate-400">Please wait while we fetch your data...</p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl mb-6 shadow-2xl shadow-teal-500/25">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4">
              University Admin Profile
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full mb-6" />
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Manage your account settings and university information
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with Save Status */}
            <ProHeader
              isEditMode={isEditMode}
              toggleEditMode={() => setIsEditMode(!isEditMode)}
              saveStatus={saveStatus}
              isSubmitting={isSubmitting}
            />

            {/* Profile Content */}
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

          {/* Quick Actions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl 
                           border border-slate-700/50 rounded-2xl p-6 text-center group hover:scale-105 
                           transition-all duration-300 cursor-pointer shadow-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl 
                             flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Account Security</h3>
              <p className="text-slate-400 text-sm">Manage passwords and security settings</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl 
                           border border-slate-700/50 rounded-2xl p-6 text-center group hover:scale-105 
                           transition-all duration-300 cursor-pointer shadow-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl 
                             flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Privacy Settings</h3>
              <p className="text-slate-400 text-sm">Control your privacy and data sharing</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl 
                           border border-slate-700/50 rounded-2xl p-6 text-center group hover:scale-105 
                           transition-all duration-300 cursor-pointer shadow-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl 
                             flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">University Settings</h3>
              <p className="text-slate-400 text-sm">Configure university-wide preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}