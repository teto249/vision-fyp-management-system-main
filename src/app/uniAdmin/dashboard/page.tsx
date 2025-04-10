"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { PencilIcon } from "@heroicons/react/24/outline";
import PerformancePanel from "../components/Dashboard/PerformancePanel";
import SummaryCard from "../components/Dashboard/SummaryCard";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// Mock Data
const users = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Supervisor",
    department: "Computer Science",
  },
  {
    id: 2,
    name: "Ahmed Mahmoud",
    role: "Student",
    project: "AI Security Framework",
  },
  {
    id: 3,
    name: "University of Tech",
    role: "University Admin",
    department: "Administration",
  },
];

const projects = [
  { id: 1, name: "Cloud Security System", progress: 65, milestones: 3 },
  { id: 2, name: "AI Learning Platform", progress: 42, milestones: 2 },
];

// Chart Data
const milestoneData = {
  labels: ["Requirements", "Design", "Implementation"],
  datasets: [
    {
      label: "Completion %",
      data: [85, 60, 45],
      backgroundColor: ["#1ABC9C", "#0f766e", "#145c4a"],
    },
  ],
};

const systemStatusData = {
  labels: ["Active Users", "Idle"],
  datasets: [
    {
      data: [73, 27],
      backgroundColor: ["#1ABC9C", "#2d3748"],
    },
  ],
};

const UserManagementTable = () => (
  <div className="bg-gray-800 rounded-xl shadow-lg mt-8 overflow-hidden border border-gray-600">
    <table className="w-full">
      <thead className="bg-gray-900">
        <tr>
          <th className="p-4 text-left text-gray-200">User</th>
          <th className="p-4 text-left text-gray-200">Role</th>
          <th className="p-4 text-left text-gray-200">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-600">
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-gray-700 transition-colors">
            <td className="p-4 text-gray-200">{user.name}</td>
            <td className="p-4">
              <span className="bg-green-600 text-gray-100 px-3 py-1 rounded-full text-sm">
                {user.role}
              </span>
            </td>
            <td className="p-4">
              <button className="text-gray-400 hover:text-green-400 transition-colors">
                <PencilIcon className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProjectAnalytics = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-600">
      <h3 className="text-gray-200 font-bold mb-4">Milestone Progress</h3>
      <Bar
        data={milestoneData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              labels: { color: "#e2e8f0" },
            },
          },
          scales: {
            y: {
              ticks: { color: "#e2e8f0" },
              grid: { color: "#2d3748" },
            },
            x: {
              ticks: { color: "#e2e8f0" },
              grid: { color: "#2d3748" },
            },
          },
        }}
      />
    </div>

    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-600">
      <h3 className="text-gray-200 font-bold mb-4">Active Projects</h3>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between">
            <span className="text-gray-300">{project.name}</span>
            <span className="text-green-400 font-bold">
              {project.progress}%
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-600">
      <h3 className="text-gray-200 font-bold mb-4">System Status</h3>
      <div className="h-48">
        <Pie
          data={systemStatusData}
          options={{
            plugins: {
              legend: {
                labels: { color: "#e2e8f0" },
              },
            },
          }}
        />
      </div>
    </div>
  </div>
);

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

          <PerformancePanel />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <SummaryCard title="Total Users" value={850} change={12} />
            <SummaryCard title="Total Universities" value={23} />
            <SummaryCard title="Capacity Usage" value="850/1,000" />
            <SummaryCard title="Active Projects" value={427} change={-2} />
          </div>
          <UserManagementTable />
          <ProjectAnalytics />
        </main>
      </div>
    </div>
  );
}
