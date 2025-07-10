"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { initiatePasswordReset, resetPassword } from "../../api/passwordReset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [step, setStep] = useState<'email' | 'reset'>(token ? 'reset' : 'email');
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState(token || "");

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await initiatePasswordReset(email);
      setSuccess("Password reset instructions have been sent to your email");
      
      // In a real application, the user would receive an email with a link
      // For demonstration, we'll use the returned token
      if (response.resetToken) {
        setResetToken(response.resetToken);
        setTimeout(() => {
          setStep('reset');
        }, 2000);
      }
    } catch (error) {
      console.error("Password reset initiation error:", error);
      setError(error instanceof Error ? error.message : "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(". "));
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(resetToken, newPassword);
      setSuccess("Password reset successfully! You can now log in with your new password.");
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      setError(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-600/50 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {step === 'email' ? (
                <Mail size={32} className="text-white" />
              ) : (
                <Eye size={32} className="text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 'email' ? 'Reset Password' : 'Set New Password'}
            </h1>
            <p className="text-gray-400">
              {step === 'email' 
                ? 'Enter your email address and we\'ll send you a reset link'
                : 'Enter your new password below'
              }
            </p>
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

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
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

              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* Navigation */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} />
              Back to Login
            </button>
          </div>

          {/* Password Requirements (only show in reset step) */}
          {step === 'reset' && (
            <div className="mt-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• At least 6 characters long</li>
                <li>• Contains at least one lowercase letter</li>
                <li>• Contains at least one uppercase letter</li>
                <li>• Contains at least one number</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
