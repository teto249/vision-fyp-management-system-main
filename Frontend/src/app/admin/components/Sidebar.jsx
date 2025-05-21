"use client";

import Link from "next/link";
import { Home, User, Building, ShoppingBag } from "lucide-react"; // Importing icons from lucide-react

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Floating Sidebar */}
      <aside
        className={`fixed top-[70px] left-0 h-[90vh] w-[90vw] max-w-xs bg-teal-700 shadow-2xl transition-all duration-300 ease-in-out z-40 rounded-r-xl mx-6 my-2 border border-gray-700
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:w-64`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <ul className="menu space-y-2 bg-transparent">
            {[
              { icon: <Home size={20} />, text: "Home", href: "" },
              { icon: <User size={20} />, text: "Account", href: "account" },
              {
                icon: <Building size={20} />,
                text: "List of Universities",
                href: "universities",
              },
              {
                icon: <ShoppingBag size={20} />,
                text: "Register University",
                href: "uniregistration",
              },
              { icon: <User size={20} />, text: "Users", href: "users" },
            ].map((item) => (
              <li key={item.text}>
                <Link
                  href={`/admin/${item.href}`}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center bg-gray-700 hover:bg-gray-600 gap-3 py-3 px-4 rounded-lg text-gray-300 hover:text-primary-400 transition-colors"
                >
                  {item.icon} {/* Directly rendering the icon here */}
                  <span className="my-2 text-sm font-medium">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
