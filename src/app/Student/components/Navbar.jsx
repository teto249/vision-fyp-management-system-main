"use client";
import { useState } from "react";
import Image from "next/image";
import Divider from "../account/ui/Divider";

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  profileOpen,
  setProfileOpen,
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 navbar rounded-br-2xl rounded-bl-2xl bg-base-200 border-b border-base-200 px-4 sm:px-6">
      <button
        className="btn btn-soft  btn-square mr-3"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Logo */}
      <div className="flex-1 flex items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <h1 className="text-xl font-bold text-gray-300 hidden sm:block">
            VISION
          </h1>
        </div>
      </div>
      <Divider/>

      {/* Navigation controls */}
      <div className="navbar-end gap-2">
        {/* Notifications dropdown */}
        <div className="relative">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
          >
            <div className="indicator">
              <span className="indicator-item badge badge-error badge-xs"></span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-base-100 shadow-xl rounded-lg z-50 divide-y divide-base-200">
              <div className="p-4">
                <h3 className="font-bold text-lg">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="p-3 hover:bg-base-200 transition-colors cursor-pointer"
                  >
                    <div className="flex gap-3 items-start">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <Image
                            src={`https://cdn.flyonui.com/fy-assets/avatar/avatar-${item}.png`}
                            alt={`Notification ${item}`}
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Notification {item}</h4>
                        <p className="text-sm text-gray-500">
                          Description of notification
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center">
                <button className="btn btn-ghost btn-sm">View all</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            className="btn btn-ghost btn-circle avatar"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            aria-label="User menu"
          >
            <div className="w-8 rounded-full">
              <Image src="/logo.png" alt="User profile" width={32} height={32} />
            </div>
          </button>

          {profileOpen && (
            <ul className="absolute right-0 mt-2 w-56 bg-base-100 shadow-xl rounded-lg z-50 divide-y divide-base-200">
              <li className="p-4">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <Image src="/logo.png" alt="User profile" width={40} height={40} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold">John Doe</h4>
                    <p className="text-sm text-gray-500">Admin</p>
                  </div>
                </div>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 hover:bg-base-200 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 hover:bg-base-200 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 hover:bg-base-200 text-error flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
