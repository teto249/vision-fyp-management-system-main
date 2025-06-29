"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Search,
  Activity,
} from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

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

  const notifications = [
    {
      id: 1,
      title: "New Project Submission",
      message: "John Doe submitted a new project milestone",
      time: "2 minutes ago",
      type: "project",
      unread: true,
    },
    {
      id: 2,
      title: "Meeting Reminder",
      message: "Project review meeting in 30 minutes",
      time: "25 minutes ago",
      type: "meeting",
      unread: true,
    },
    {
      id: 3,
      title: "Document Updated",
      message: "Project requirements document was updated",
      time: "1 hour ago",
      type: "document",
      unread: false,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-xl">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-200 group"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              ) : (
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  VISION
                </h1>
                <p className="text-xs text-slate-400">Supervisor Portal</p>
              </div>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="relative p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-200 group"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-700/50 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      <span className="text-xs text-slate-400">
                        {notifications.filter((n) => n.unread).length} unread
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-slate-700/30 transition-colors cursor-pointer border-l-2 ${
                          notification.unread
                            ? "border-teal-500 bg-teal-500/5"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              notification.unread ? "bg-teal-500" : "bg-slate-600"
                            }`}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-medium ${
                                notification.unread ? "text-white" : "text-slate-300"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            <p className="text-sm text-slate-400 truncate">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-700/50 text-center">
                    <button className="text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" data-menu>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center space-x-3 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 group"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-slate-700 group-hover:ring-teal-500/50 transition-all duration-200">
                  <Image
                    src={supervisorInfo.profilePhoto || "/logo.png"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white truncate max-w-24">
                    {supervisorInfo.fullName || "Loading..."}
                  </p>
                  <p className="text-xs text-slate-400">Supervisor</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-700/50 z-[60] opacity-100 scale-100 transform transition-all duration-200">
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-slate-700">
                        <Image
                          src={supervisorInfo.profilePhoto || "/logo.png"}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">
                          {supervisorInfo.fullName || "Loading..."}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {supervisorInfo.email || "supervisor@university.edu"}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                          <span className="text-xs text-emerald-400">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/supervisor/account"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Profile Settings</span>
                    </Link>

                    <Link
                      href="/supervisor/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Preferences</span>
                    </Link>
                  </div>

                  <div className="p-2 border-t border-slate-700/50">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
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
