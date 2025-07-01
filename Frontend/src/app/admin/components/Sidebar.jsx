"use client";

import Link from "next/link";
import { Home, User, Building, ShoppingBag, FileText, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const navigationItems = [
    { icon: <Home size={20} />, text: "Dashboard", href: "" },
    { icon: <User size={20} />, text: "Account", href: "account" },
    {
      icon: <Building size={20} />,
      text: "Universities",
      href: "universities",
    },
    {
      icon: <ShoppingBag size={20} />,
      text: "Register University",
      href: "uniregistration",
    },
    {
      icon: <FileText size={20} />,
      text: "System Reports",
      href: "reports",
    },
  ];

  const isActiveRoute = (href) => {
    if (href === "") return pathname === "/admin";
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-blue-600/10 pointer-events-none" />
        
        {/* Header */}
        <div className="relative p-6 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white mb-1">Admin Panel</h2>
          <p className="text-sm text-slate-400">Management Dashboard</p>
        </div>

        {/* Navigation */}
        <div className="relative p-4 h-full overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
          <nav className="space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = isActiveRoute(item.href);
              
              return (
                <div key={item.text} className="relative group">
                  <Link
                    href={`/admin/${item.href}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      relative flex items-center gap-3 py-3 px-4 rounded-xl 
                      transition-all duration-300 ease-out overflow-hidden
                      ${isActive 
                        ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/25 scale-[1.02]" 
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:scale-[1.01]"
                      }
                      group-hover:shadow-lg
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                    )}
                    
                    {/* Icon container */}
                    <div className={`
                      flex-shrink-0 p-1 rounded-lg transition-all duration-300
                      ${isActive 
                        ? "bg-white/20 text-white" 
                        : "bg-slate-700/50 group-hover:bg-slate-600/50"
                      }
                    `}>
                      {item.icon}
                    </div>
                    
                    {/* Text */}
                    <span className="font-medium text-sm flex-1 truncate">
                      {item.text}
                    </span>
                    
                    {/* Arrow indicator */}
                    <ChevronRight 
                      size={16} 
                      className={`
                        transition-all duration-300 flex-shrink-0
                        ${isActive 
                          ? "text-white/80 translate-x-1" 
                          : "text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1"
                        }
                      `}
                    />
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  </Link>
                </div>
              );
            })}
          </nav>
          
          {/* Bottom section */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30">
              <h3 className="text-sm font-medium text-white mb-2">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-teal-400">12</div>
                  <div className="text-xs text-slate-400">Universities</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">48</div>
                  <div className="text-xs text-slate-400">Active Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Enhanced Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 backdrop-blur-md transition-all duration-500 ease-out"
          onClick={() => setSidebarOpen(false)}
        >
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-blue-900/20" />
        </div>
      )}
    </>
  );
}
