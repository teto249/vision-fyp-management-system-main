"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { login, logout, AuthError } from "../../api/auth";

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      const data = await login(username, password);
      console.log("Login successful:", data);
      const role = data.user.role;

      // Show success message before redirect
      const successMessage = document.getElementById("success-message");
      if (successMessage) {
        successMessage.classList.remove("hidden");
      }

      // Redirect based on role with delay
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
            setError("Invalid user role");
            router.push("/");
        }
      }, 1000);
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login Error:", err);
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
            priority
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

        <div
          id="success-message"
          className="hidden mb-4 p-3 bg-green-900 text-green-100 rounded-lg text-sm"
        >
          Login successful! Redirecting...
        </div>

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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
            placeholder="Enter your ID or email"
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
          <Link
            href="/forgot-password"
            className="text-sm text-green-400 hover:text-green-500 transition-colors"
          >
            Forgot password?
          </Link>
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
