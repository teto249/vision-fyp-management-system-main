"use client";

import Link from "next/link";
import { Home, User, Users, UserPlus, FileText, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const navigationItems = [
    { icon: <Home size={20} />, text: "Dashboard", href: "" },
    { icon: <User size={20} />, text: "Account", href: "account" },
    { icon: <Users size={20} />, text: "Users", href: "users" },
    { icon: <UserPlus size={20} />, text: "Register Users", href: "registerusers" },
    { icon: <FileText size={20} />, text: "System Reports", href: "reports" },
  ];

  const isActiveRoute = (href) => {
    if (href === "") return pathname === "/uniAdmin";
    return pathname?.includes(href);
  };

  return (
    <>
      {/* Modern Floating Sidebar */}
      <aside
        className={`fixed top-[70px] left-0 h-[calc(100vh-80px)] w-[280px] max-w-xs 
          bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
          backdrop-blur-xl border border-slate-700/50 
          shadow-2xl transition-all duration-500 ease-out z-40 
          rounded-r-2xl mx-4 my-2 overflow-hidden
          ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
          sm:w-72`}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-blue-600/10 pointer-events-none" />
        
        {/* Header Section */}
        <div className="relative p-6 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white mb-1">University Panel</h2>
          <p className="text-sm text-slate-400">Management Dashboard</p>
        </div>

        {/* Navigation */}
        <div className="relative p-4 h-full overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
          <nav className="space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.text}
                  href={`/uniAdmin/${item.href}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center justify-between p-4 rounded-xl 
                            transition-all duration-300 ease-out hover:scale-[1.02] 
                            transform-gpu will-change-transform
                            ${isActive 
                              ? 'bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-teal-500/30 shadow-lg shadow-teal-500/10' 
                              : 'hover:bg-slate-800/50 border border-transparent hover:border-slate-700/30'
                            }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-teal-500 to-blue-500 rounded-r-full" />
                  )}

                  {/* Content Container */}
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Icon Container */}
                    <div className={`p-2 rounded-lg transition-all duration-300 
                                   ${isActive 
                                     ? 'bg-gradient-to-r from-teal-600/30 to-blue-600/30 shadow-lg' 
                                     : 'bg-slate-800/50 group-hover:bg-slate-700/50'
                                   }`}>
                      <div className={`transition-colors duration-300 
                                     ${isActive 
                                       ? 'text-teal-300' 
                                       : 'text-slate-400 group-hover:text-white'
                                     }`}>
                        {item.icon}
                      </div>
                    </div>

                    {/* Text */}
                    <span className={`font-medium transition-colors duration-300 
                                    ${isActive 
                                      ? 'text-white' 
                                      : 'text-slate-300 group-hover:text-white'
                                    }`}>
                      {item.text}
                    </span>
                  </div>

                  {/* Arrow Indicator */}
                  <ChevronRight 
                    className={`w-4 h-4 transition-all duration-300 
                               ${isActive 
                                 ? 'text-teal-300 opacity-100' 
                                 : 'text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-slate-300 group-hover:translate-x-1'
                               }`} 
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 to-blue-600/5 
                                 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Link>
              );
            })}
          </nav>
          
          {/* Quick Stats Section */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30">
              <h3 className="text-sm font-medium text-white mb-2">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-teal-400">156</div>
                  <div className="text-xs text-slate-400">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">24</div>
                  <div className="text-xs text-slate-400">Active Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Enhanced Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 backdrop-blur-md transition-all duration-500 ease-out"
          onClick={() => setSidebarOpen(false)}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-blue-900/20" />
        </div>
      )}
    </>
  );
}
