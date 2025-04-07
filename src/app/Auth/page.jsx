"use client";

import Image from "next/image";
import Link from "next/link";

export default function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Login Data:", data);
    // Add your login logic here
  };

  const handleGoogleLogin = () => {
    console.log("Google login initiated");
    // Add Google OAuth logic here
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-[#4A154B]">
        {/* Upper Part */}
        <div className="flex items-center   ">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={70}
              height={70}
              className="rounded-full"
            />
            <span className="text-4xl font-serif font-bold text-white ">
              VISION
            </span>
          </Link>
        </div>

        {/* Lower Part */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#cccccc] w-full max-w-md rounded-xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-[#4A154B] mb-8 text-center">
            Welcome Back
          </h2>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-[#1D1D1D] text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#36C5F0] transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-[#1D1D1D] text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] focus:outline-none focus:ring-2 focus:ring-[#36C5F0] transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2EB67D] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#33C373] transition-colors mb-4"
          >
            Sign In
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[#DDDDDD]"></div>
            <span className="px-4 text-[#616061] text-sm">OR</span>
            <div className="flex-1 border-t border-[#DDDDDD]"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-[#DDDDDD] text-[#1D1D1D] py-3 px-6 rounded-lg font-medium hover:bg-[#F6F6F6] transition-colors"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="#EA4335"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <a
              href="#forgot-password"
              className="text-sm text-[#36C5F0] hover:text-[#3BAFDA] transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <Link href="/">
            <button
              type="button"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-white border border-[#DDDDDD] text-[#1D1D1D] py-3 px-6 rounded-lg font-medium hover:bg-[#F6F6F6] transition-colors"
            >
              Back
            </button>
          </Link>
        </form>
      </div>
    </>
  );
}
