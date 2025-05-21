"use client";
import React, { useState } from "react";





export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen px-10 bg-gray-900 ">
      <div className="flex">
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-8">
            {" "}
            Dashboard Overview
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-lg border border-gray-600">
              <h3 className="text-lg font-bold">Total Users</h3>
              <p className="text-3xl mt-2 text-green-400">1,243</p>
            </div>
            <div className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-lg border border-gray-600">
              <h3 className="text-lg font-bold">Active Projects</h3>
              <p className="text-3xl mt-2 text-green-400">89</p>
            </div>
            <div className="bg-gray-800 text-gray-200 p-6 rounded-xl shadow-lg border border-gray-600">
              <h3 className="text-lg font-bold">Completion Rate</h3>
              <p className="text-3xl mt-2 text-green-400">68%</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
