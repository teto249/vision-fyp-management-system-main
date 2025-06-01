"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "../../../../api/auth";

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  profileOpen,
  setProfileOpen,
}) {
  const [supervisorInfo, setSupervisorInfo] = useState({});
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const storedInfo = localStorage.getItem("supervisorInfo");
    if (storedInfo) {
      setSupervisorInfo(JSON.parse(storedInfo));
    }
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.push("/");
  };
  return (
    <nav className="sticky top-0 z-40 navbar rounded-br-2xl rounded-bl-2xl bg-teal-700 border-b border-gray-700 px-4 sm:px-6 text-gray-300">
      <button
        className="btn btn-soft bg-gray-700 hover:bg-gray-600 btn-square mr-3"
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
          <h1 className="text-xl font-bold text-gray-200 hidden sm:block">
            VISION
          </h1>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="navbar-end gap-2">
        {/* Notifications dropdown */}
        <div className="relative">
          <button
            className="btn btn-ghost btn-circle hover:bg-gray-700"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
          >
            <div className="indicator">
              <span className="indicator-item badge badge-xs bg-status-critical"></span>
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
            <div className="absolute right-0 mt-2 w-72 bg-gray-800 shadow-xl rounded-lg z-50 divide-y divide-gray-700 border border-gray-700">
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-200">
                  Notifications
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="p-3 hover:bg-gray-700 transition-colors cursor-pointer"
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
                        <h4 className="font-medium text-gray-200">
                          Notification {item}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Description of notification
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center">
                <button className="btn btn-ghost btn-sm text-primary-500 hover:text-primary-400">
                  View all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            className="btn btn-ghost btn-circle avatar hover:bg-gray-700"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            aria-label="User menu"
          >
            <div className="w-8 rounded-full">
              <Image
                src="/logo.png"
                alt="User profile"
                width={32}
                height={32}
              />
            </div>
          </button>

          {profileOpen && (
            <ul className="absolute right-0 mt-2 w-56 bg-gray-800 shadow-xl rounded-lg z-50 divide-y divide-gray-700 border border-gray-700">
              <li className="p-4">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <Image
                        src={supervisorInfo.profilePhoto || "/logo.png"}
                        alt="User profile"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-200">
                      {supervisorInfo.fullName || "Loading..."}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {supervisorInfo.role || "Supervisor"}
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <Link
                  href="/supervisor/account"
                  onClick={() => setProfileOpen(false)}
                >
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 text-gray-300">
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
                </Link>
              </li>

              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-status-critical flex items-center gap-2"
                  onClick={handleLogout}
                >
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
