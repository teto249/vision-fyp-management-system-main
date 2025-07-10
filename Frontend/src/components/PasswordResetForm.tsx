"use client";
import { useState } from "react";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { changePassword } from "../api/passwordReset";

interface PasswordResetFormProps {
  userType: "student" | "supervisor" | "admin" | "uniAdmin";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PasswordResetForm({ userType, onSuccess, onCancel }: PasswordResetFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(". "));
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      await changePassword(currentPassword, newPassword, token);
      
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.();
      }, 1500);

    } catch (error) {
      console.error("Password change error:", error);
      setError(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeColors = () => {
    switch (userType) {
      case "student":
        return {
          primary: "bg-teal-600 hover:bg-teal-700",
          accent: "text-teal-400",
          focus: "focus:ring-teal-500/50 focus:border-teal-500/50"
        };
      case "supervisor":
        return {
          primary: "bg-blue-600 hover:bg-blue-700",
          accent: "text-blue-400",
          focus: "focus:ring-blue-500/50 focus:border-blue-500/50"
        };
      case "admin":
        return {
          primary: "bg-red-600 hover:bg-red-700",
          accent: "text-red-400",
          focus: "focus:ring-red-500/50 focus:border-red-500/50"
        };
      case "uniAdmin":
        return {
          primary: "bg-purple-600 hover:bg-purple-700",
          accent: "text-purple-400",
          focus: "focus:ring-purple-500/50 focus:border-purple-500/50"
        };
      default:
        return {
          primary: "bg-gray-600 hover:bg-gray-700",
          accent: "text-gray-400",
          focus: "focus:ring-gray-500/50 focus:border-gray-500/50"
        };
    }
  };

  const theme = getThemeColors();

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-600/50 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${theme.primary}`}>
          <Lock size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Change Password</h3>
          <p className="text-gray-400">Update your account password</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-red-300 font-medium">Error</h4>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-800/50 rounded-xl flex items-start gap-3">
          <CheckCircle2 size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-green-300 font-medium">Success</h4>
            <p className="text-green-200 text-sm">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${theme.focus} transition-all duration-200`}
              placeholder="Enter your current password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${theme.focus} transition-all duration-200`}
              placeholder="Enter your new password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {newPassword && (
            <div className="mt-2 space-y-1">
              {validatePassword(newPassword).map((error, index) => (
                <p key={index} className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${theme.focus} transition-all duration-200`}
              placeholder="Confirm your new password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} />
              Passwords do not match
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className={`flex-1 px-6 py-3 ${theme.primary} text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <Lock size={20} />
                Change Password
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Password Requirements */}
      <div className="mt-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Password Requirements:</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• At least 6 characters long</li>
          <li>• Contains at least one lowercase letter</li>
          <li>• Contains at least one uppercase letter</li>
          <li>• Contains at least one number</li>
        </ul>
      </div>
    </div>
  );
}
