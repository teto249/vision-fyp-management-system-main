"use client";
import { Edit3, Save, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ProHeaderProps {
  isEditMode: boolean;
  toggleEditMode: () => void;
  saveStatus?: 'saving' | 'success' | 'error' | null;
  isSubmitting?: boolean;
}

export default function ProHeader({ 
  isEditMode, 
  toggleEditMode, 
  saveStatus,
  isSubmitting 
}: ProHeaderProps) {
  const getSaveStatusContent = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center space-x-2 text-blue-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Saving changes...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center space-x-2 text-emerald-400 animate-in slide-in-from-left-2 duration-300">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Changes saved successfully!</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center space-x-2 text-red-400 animate-in slide-in-from-left-2 duration-300">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Failed to save changes</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl 
                   border-b border-slate-700/50 p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)]" />
      </div>
      
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 
                        bg-clip-text text-transparent mb-2">
            Profile Management
          </h1>
          <p className="text-slate-400 text-lg">
            {isEditMode ? "Make changes to your profile information" : "View and manage your account details"}
          </p>
          
          {/* Save Status */}
          <div className="mt-3 h-6">
            {getSaveStatusContent()}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isEditMode ? (
            <button
              onClick={toggleEditMode}
              disabled={isSubmitting}
              className="group flex items-center space-x-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 
                        border border-slate-600/50 hover:border-slate-500/50 rounded-xl 
                        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
                Cancel
              </span>
            </button>
          ) : (
            <button
              onClick={toggleEditMode}
              className="group flex items-center space-x-2 px-6 py-3 
                        bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 
                        text-white rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/25
                        hover:scale-105 transform"
            >
              <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Edit Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
