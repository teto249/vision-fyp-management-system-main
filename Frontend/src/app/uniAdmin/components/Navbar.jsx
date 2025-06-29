"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, User, LogOut, Menu, X } from "lucide-react";
import { logout } from "../../../api/auth";

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

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 
                    backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-blue-600/10 pointer-events-none" />
      
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Menu Button & Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="group relative p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 
                        border border-slate-700/50 hover:border-slate-600/50 
                        transition-all duration-300 ease-out"
              aria-label="Toggle sidebar"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-blue-600/20 
                             rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                )}
              </div>
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full blur-md opacity-50" />
                <Image
                  src="/logo.png"
                  alt="University Logo"
                  width={40}
                  height={40}
                  className="relative rounded-full ring-2 ring-slate-700/50"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  VISION
                </h1>
                <p className="text-xs text-slate-400 -mt-1">University Admin</p>
              </div>
            </div>
          </div>

          {/* Right Section - Notifications & Profile */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="group relative p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 
                          border border-slate-700/50 hover:border-slate-600/50 
                          transition-all duration-300 ease-out"
                aria-label="Notifications"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-blue-600/20 
                               rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <Bell className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 
                                  rounded-full border-2 border-slate-900 animate-pulse" />
                </div>
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-xl 
                               border border-slate-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden
                               animate-in slide-in-from-top-2 duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-blue-600/5" />
                  
                  <div className="relative p-4 border-b border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                    <p className="text-sm text-slate-400">You have 3 new notifications</p>
                  </div>

                  <div className="relative max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-800/50 last:border-b-0">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full 
                                           flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white">New User Registration</h4>
                            <p className="text-xs text-slate-400 mt-1">John Doe has registered for your university</p>
                            <p className="text-xs text-slate-500 mt-1">2 minutes ago</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative p-3 text-center border-t border-slate-700/50">
                    <button className="text-sm text-teal-400 hover:text-teal-300 transition-colors font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="group flex items-center space-x-3 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 
                          border border-slate-700/50 hover:border-slate-600/50 
                          transition-all duration-300 ease-out"
                aria-label="User menu"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-blue-600/20 
                               rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full 
                                 flex items-center justify-center ring-2 ring-slate-700/50">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">{adminInfo.username || "Uni Admin"}</p>
                    <p className="text-xs text-slate-400">{adminInfo.role || "University Admin"}</p>
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl 
                               border border-slate-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden
                               animate-in slide-in-from-top-2 duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-blue-600/5" />
                  
                  <div className="relative p-4 border-b border-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full 
                                     flex items-center justify-center ring-2 ring-slate-700/50">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{adminInfo.username || "Uni Admin"}</h4>
                        <p className="text-xs text-slate-400">{adminInfo.role || "University Admin"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative p-2">
                    <Link href="/uniAdmin/account" onClick={() => setProfileOpen(false)}>
                      <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800/50 
                                     transition-colors cursor-pointer group">
                        <div className="w-8 h-8 bg-slate-800/50 rounded-lg flex items-center justify-center 
                                       group-hover:bg-slate-700/50 transition-colors">
                          <User className="w-4 h-4 text-slate-400 group-hover:text-white" />
                        </div>
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Profile Settings</span>
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-900/20 
                                transition-colors group"
                    >
                      <div className="w-8 h-8 bg-red-900/20 rounded-lg flex items-center justify-center 
                                     group-hover:bg-red-900/30 transition-colors">
                        <LogOut className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-sm text-red-400 group-hover:text-red-300 transition-colors">Logout</span>
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
