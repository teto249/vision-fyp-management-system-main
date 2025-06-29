"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Bell,
  FolderOpen,
  Presentation,
  FileText,
  BarChart3,
  Users,
  Calendar,
  Settings,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, text: "Dashboard", href: "", badge: null },
    { icon: User, text: "Profile", href: "account", badge: null },

    { icon: FolderOpen, text: "Projects", href: "project", badge: null },

    { icon: FileText, text: "Documents", href: "document", badge: null },

  ];

  const isActive = (href) => {
    if (href === "") {
      return pathname === "/supervisor" || pathname === "/supervisor/";
    }
    return pathname.includes(`/supervisor/${href}`);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-slate-900/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-in-out z-40 border-r border-slate-700/50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Navigation Header */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-2">
              Navigation
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.text}
                  href={`/supervisor/${item.href}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-white border border-teal-500/30 shadow-lg shadow-teal-500/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg"
                          : "bg-slate-800/50 group-hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>

                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}

                  {active && (
                    <div className="w-1 h-8 bg-gradient-to-b from-teal-400 to-blue-400 rounded-full absolute right-0"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl border border-teal-500/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Need Help?
                  </h3>
                  <p className="text-xs text-slate-400">Contact support</p>
                </div>
              </div>
              <button className="w-full py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors duration-200">
                Get Support
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
