"use client";
import { Edit3, Save, X, User } from "lucide-react";

interface ProHeaderProps {
  isEditMode: boolean;
  toggleEditMode: () => void;
}

export default function ProHeader({ isEditMode, toggleEditMode }: ProHeaderProps) {
  return (
    <>
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Student Profile
              </h1>
              <p className="text-blue-100">
                Manage your account information and settings
              </p>
            </div>
          </div>

          <button
            onClick={toggleEditMode}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isEditMode
                ? "bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30"
                : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
            } backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-105`}
          >
            {isEditMode ? (
              <>
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
