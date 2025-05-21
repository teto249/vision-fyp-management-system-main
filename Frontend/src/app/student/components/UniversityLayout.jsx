"use client";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function UniversityLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div>
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="bg-gray-900">{children}</main>
    </div>
  );
}
