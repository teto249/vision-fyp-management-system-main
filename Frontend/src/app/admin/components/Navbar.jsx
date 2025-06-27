"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "../../../api/auth";
import { Bell, User, Settings, LogOut, Shield } from "lucide-react";

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  profileOpen,
  setProfileOpen,
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({});
  const router = useRouter();

  useEffect(() => {
    const storedAdminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    if (storedAdminInfo) {
      setAdminInfo(storedAdminInfo);
    }
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.push("/");
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "New University Registration",
      message: "UTM has submitted registration request",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "System Update",
      message: "System maintenance scheduled for tonight",
      time: "1 day ago",
      unread: false,
    },
    {
      id: 3,
      title: "Capacity Alert",
      message: "University ABC approaching capacity limit",
      time: "2 days ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Hamburger and Logo */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200 border border-gray-700/30"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <span
                  className={`block h-0.5 w-5 bg-gray-300 transition-transform duration-300 ${
                    sidebarOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-gray-300 transition-opacity duration-300 ${
                    sidebarOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-gray-300 transition-transform duration-300 ${
                    sidebarOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="VISION Logo"
                  width={40}
                  height={40}
                  className="rounded-lg shadow-sm"
                  priority
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
                  VISION
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                className="relative p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700/30 group"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-300 group-hover:text-teal-400 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-lg shadow-2xl rounded-xl border border-gray-700/50 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-200">Notifications</h3>
                      <span className="text-xs text-gray-400">{unreadCount} new</span>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-700/30 transition-colors cursor-pointer border-l-4 ${
                          notification.unread
                            ? "border-teal-500 bg-teal-500/5"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? "bg-teal-500" : "bg-gray-600"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-200 text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-gray-400 text-xs mt-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t border-gray-700/50 text-center">
                    <button className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700/30 group"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                aria-label="User menu"
              >
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="Admin Profile"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-200">
                    {adminInfo.username || "Admin"}
                  </p>
                  <p className="text-xs text-gray-400">Main Administrator</p>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-lg shadow-2xl rounded-xl border border-gray-700/50 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src="/logo.png"
                          alt="Admin Profile"
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-200">
                          {adminInfo.username || "Administrator"}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {adminInfo.email || "admin@vision.com"}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Shield className="w-3 h-3 text-teal-400" />
                          <span className="text-xs text-teal-400 font-medium">
                            Main Admin
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link href="/admin/account">
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-700/30 flex items-center space-x-3 text-gray-300 hover:text-teal-400 transition-colors group"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-4 h-4 group-hover:text-teal-400" />
                        <span>My Profile</span>
                      </button>
                    </Link>
                    
                    <Link href="/admin/settings">
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-700/30 flex items-center space-x-3 text-gray-300 hover:text-teal-400 transition-colors group"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 group-hover:text-teal-400" />
                        <span>Settings</span>
                      </button>
                    </Link>
                  </div>

                  <div className="border-t border-gray-700/50 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-400 hover:text-red-300 flex items-center space-x-3 transition-colors group"
                    >
                      <LogOut className="w-4 h-4 group-hover:text-red-300" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
