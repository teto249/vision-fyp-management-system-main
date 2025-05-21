"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { login, logout } from "../../api/auth"; // Import the login and logout functions

export default function LoginForm() {
  const [error, setError] = useState<string>(""); // State for error messages
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const router = useRouter();

  // Inactivity timer
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  let inactivityTimer: NodeJS.Timeout;

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      handleLogout(); // Automatically log out the user
    }, INACTIVITY_TIMEOUT);
  };

  const handleLogout = () => {
    logout(); // Clear localStorage
    router.push("/"); // Redirect to login page
  };

  useEffect(() => {
    // Set up event listeners for user activity
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    // Start the inactivity timer
    resetInactivityTimer();

    // Clean up event listeners on component unmount
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const data = await login(username, password);
      const storedAdminInfo = localStorage.getItem("adminInfo");

      if (!storedAdminInfo) {
        throw new Error("User information not found");
      }

      const userInfo = JSON.parse(storedAdminInfo);
      const role = userInfo.role;

      // Redirect based on user role with delay for better UX
      setTimeout(() => {
        switch (role) {
          case "MainAdmin":
            router.push("/admin");
            break;
          case "UniAdmin":
            router.push("/uniAdmin");
            break;
          case "Supervisor":
            router.push("/supervisor");
            break;
          case "Student":
            router.push("/student");
            break;
          default:
            router.push("/");
            break;
        }
      }, 500);
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-gray-900 text-gray-200">
      {/* Upper Part */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={70}
            className="rounded-full"
          />
          <span className="text-4xl font-serif font-bold text-green-400">
            VISION
          </span>
        </Link>
      </div>

      {/* Lower Part */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 w-full max-w-md rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold text-green-400 mb-8 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-gray-300 text-sm font-medium mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-300 text-sm font-medium mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="remember-me"
            name="remember-me"
            className="h-4 w-4 text-green-400 focus:ring-green-400 border-gray-600 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-400 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-green-500 transition-colors ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="mt-6 text-center">
          <a
            href="#forgot-password"
            className="text-sm text-green-400 hover:text-green-500 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <Link href="/">
          <button
            type="button"
            className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-700 border border-gray-600 text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </button>
        </Link>
      </form>
    </div>
  );
}
