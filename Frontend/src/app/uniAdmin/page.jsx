"use client";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Move this import to the top
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
import {
  Users,
  GraduationCap,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Edit3,
  BarChart3,
  PieChart,
} from "lucide-react";
import PerformancePanel from "./components/Dashboard/PerformancePanel";
import SummaryCard from "./components/Dashboard/SummaryCard";
import { fetchUsersByUniversity } from "../../api/uniAdmin/FetchUsers";
import { fetchDashboardAnalytics } from "../../api/uniAdmin/DashboardAnalytics.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// Mock Data

// Enhanced Chart Data
const milestoneData = {
  labels: ["Requirements", "Design", "Implementation", "Testing", "Deployment"],
  datasets: [
    {
      label: "Completion %",
      data: [85, 60, 45, 30, 15],
      backgroundColor: [
        "rgba(20, 184, 166, 0.8)",
        "rgba(59, 130, 246, 0.8)",
        "rgba(139, 92, 246, 0.8)",
        "rgba(244, 63, 94, 0.8)",
        "rgba(245, 158, 11, 0.8)",
      ],
      borderColor: [
        "rgb(20, 184, 166)",
        "rgb(59, 130, 246)",
        "rgb(139, 92, 246)",
        "rgb(244, 63, 94)",
        "rgb(245, 158, 11)",
      ],
      borderWidth: 2,
      borderRadius: 8,
    },
  ],
};

const systemStatusData = {
  labels: ["Active Users", "Idle Users", "Offline"],
  datasets: [
    {
      data: [45, 30, 25],
      backgroundColor: [
        "rgba(20, 184, 166, 0.8)",
        "rgba(59, 130, 246, 0.8)",
        "rgba(100, 116, 139, 0.8)",
      ],
      borderColor: [
        "rgb(20, 184, 166)",
        "rgb(59, 130, 246)",
        "rgb(100, 116, 139)",
      ],
      borderWidth: 2,
    },
  ],
};

// Enhanced Capacity Usage Card Component
const CapacityUsageCard = ({ currentUsers, maxCapacity }) => {
  const percentage = Math.floor((currentUsers / maxCapacity) * 100);
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage > 95;

  let statusColor = "text-emerald-400";
  let bgColor = "bg-emerald-500/20";
  let borderColor = "border-emerald-500/30";

  if (isAtLimit) {
    statusColor = "text-red-400";
    bgColor = "bg-red-500/20";
    borderColor = "border-red-500/30";
  } else if (isNearLimit) {
    statusColor = "text-amber-400";
    bgColor = "bg-amber-500/20";
    borderColor = "border-amber-500/30";
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 group">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wider">
            Capacity Usage
          </h3>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${statusColor} ${borderColor} border`}
          >
            {percentage}%
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent group-hover:from-teal-300 group-hover:to-blue-300 transition-all duration-300">
            {currentUsers.toLocaleString('en-US')}/{maxCapacity.toLocaleString('en-US')}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isAtLimit
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : isNearLimit
                  ? "bg-gradient-to-r from-amber-500 to-amber-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          <p className={`text-xs ${statusColor}`}>
            {maxCapacity - currentUsers} users remaining
          </p>
        </div>
      </div>
    </div>
  );
};

// Enhanced Active Sessions Card Component
const ActiveSessionsCard = ({ activeSessions, totalUsers, change }) => {
  const activePercentage =
    totalUsers > 0 ? Math.floor((activeSessions / totalUsers) * 100) : 0;
  const isHighActivity = activePercentage > 70;
  const isLowActivity = activePercentage < 30;

  let statusColor = "text-blue-400";
  let bgColor = "bg-blue-500/20";
  let dotColor = "bg-blue-500";

  if (isHighActivity) {
    statusColor = "text-emerald-400";
    bgColor = "bg-emerald-500/20";
    dotColor = "bg-emerald-500";
  } else if (isLowActivity) {
    statusColor = "text-amber-400";
    bgColor = "bg-amber-500/20";
    dotColor = "bg-amber-500";
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 group">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wider">
            Active Sessions
          </h3>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`}
            ></div>
            {change !== undefined && (
              <div
                className={`flex items-center space-x-1 text-sm font-medium ${
                  change > 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {change > 0 ? "+" : ""}
                  {change}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent group-hover:from-teal-300 group-hover:to-blue-300 transition-all duration-300">
            {activeSessions.toLocaleString('en-US')}
          </p>

          <div className="flex items-center space-x-2">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${statusColor}`}
            >
              {activePercentage}% active
            </div>
            <span className="text-xs text-slate-400">
              of {totalUsers} total users
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagementTable = ({ users }) => (
  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">User Management</h3>
          <p className="text-sm text-slate-400">
            Manage students and supervisors
          </p>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-800/50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
              User
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
              Role
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
              Status
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {users.length > 0 ? (
            users.slice(0, 10).map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-800/30 transition-all duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-slate-400 text-sm">
                        User ID: {user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "Student"
                        ? "bg-blue-900/30 text-blue-300 border border-blue-500/30"
                        : "bg-purple-900/30 text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {user.role === "Student" ? (
                      <GraduationCap className="w-4 h-4 mr-1" />
                    ) : (
                      <UserCheck className="w-4 h-4 mr-1" />
                    )}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-900/30 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-800/50 rounded-lg transition-all duration-200">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <Users className="w-12 h-12 text-slate-600" />
                  <p className="text-slate-400">No users found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {users.length > 10 && (
      <div className="p-4 border-t border-slate-700/50 text-center">
        <button className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
          View all {users.length} users
        </button>
      </div>
    )}
  </div>
);

UserManagementTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      role: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usersData, setUsersData] = useState({ supervisors: [], students: [] });
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get admin info from localStorage
        const adminInfoString = localStorage.getItem("adminInfo");

        if (!adminInfoString) {
          throw new Error(
            "University admin information not found. Please log in again."
          );
        }

        const adminInfo = JSON.parse(adminInfoString);
        const universityId = adminInfo?.universityId || adminInfo?.university?.id;

        if (!universityId) {
          console.error(
            "Full admin info structure:",
            JSON.stringify(adminInfo, null, 2)
          );
          throw new Error(
            `University ID not found. Please ensure you are logged in as a university admin.`
          );
        }

        // Fetch both users data and analytics in parallel
        const [usersResponse, analyticsResponse] = await Promise.all([
          fetchUsersByUniversity(universityId),
          fetchDashboardAnalytics(universityId)
        ]);

        setUsersData(usersResponse);
        setAnalytics(analyticsResponse);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get data from analytics or use defaults
  const metrics = analytics?.metrics || {
    totalStudents: 0,
    totalSupervisors: 0,
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    completionRate: 0,
    averageProgress: 0
  };

  const milestoneProgress = analytics?.milestoneProgress || [0, 0, 0, 0, 0];
  const systemStatus = analytics?.systemStatus || { active: 0, idle: 0, offline: 0 };
  const projects = analytics?.projects || [];
  const activeSessions = systemStatus.active;

  // Update chart data based on real analytics data
  const milestoneData = {
    labels: [
      "Requirements",
      "Design",
      "Implementation",
      "Testing",
      "Deployment",
    ],
    datasets: [
      {
        label: "Completion %",
        data: milestoneProgress,
        backgroundColor: [
          "rgba(20, 184, 166, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(244, 63, 94, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderColor: [
          "rgb(20, 184, 166)",
          "rgb(59, 130, 246)",
          "rgb(139, 92, 246)",
          "rgb(244, 63, 94)",
          "rgb(245, 158, 11)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const systemStatusData = {
    labels: ["Active Users", "Idle Users", "Offline"],
    datasets: [
      {
        data: [
          systemStatus.active,
          systemStatus.idle,
          systemStatus.offline,
        ],
        backgroundColor: [
          "rgba(20, 184, 166, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(100, 116, 139, 0.8)",
        ],
        borderColor: [
          "rgb(20, 184, 166)",
          "rgb(59, 130, 246)",
          "rgb(100, 116, 139)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Update ProjectAnalytics to use real data
  const ProjectAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {/* Milestone Progress Chart */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Milestone Progress
            </h3>
            <p className="text-sm text-slate-400">Project completion stages</p>
          </div>
        </div>
        <div className="h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            </div>
          ) : (
            <Bar
              data={milestoneData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { color: "#94a3b8", font: { size: 12 } },
                    grid: {
                      color: "rgba(148, 163, 184, 0.1)",
                      drawBorder: false,
                    },
                  },
                  x: {
                    ticks: { color: "#94a3b8", font: { size: 12 } },
                    grid: { display: false },
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Active Projects
            </h3>
            <p className="text-sm text-slate-400">Current project status</p>
          </div>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-teal-400 animate-spin" />
            </div>
          ) : projects.length > 0 ? (
            projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      {project.title}
                    </h4>
                    <p className="text-slate-400 text-xs">
                      {project.studentName}
                    </p>
                  </div>
                  <span className="text-teal-400 font-bold text-sm">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {project.milestoneCount} milestones
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      project.status === "In Progress"
                        ? "bg-emerald-900/30 text-emerald-300"
                        : project.status === "Completed"
                        ? "bg-blue-900/30 text-blue-300"
                        : "bg-slate-700/50 text-slate-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">No active projects</p>
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">System Status</h3>
            <p className="text-sm text-slate-400">User activity overview</p>
          </div>
        </div>
        <div className="h-48">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            </div>
          ) : metrics.totalUsers > 0 ? (
            <Pie
              data={systemStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "#94a3b8",
                      font: { size: 12 },
                      padding: 15,
                    },
                  },
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No user data available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const allUsers = [
    ...(usersData.students?.map((student) => ({
      id: student.userId,
      name: student.fullName,
      role: "Student",
    })) || []),
    ...(usersData.supervisors?.map((supervisor) => ({
      id: supervisor.userId,
      name: supervisor.fullName,
      role: "Supervisor",
    })) || []),
  ];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    isLoading,
    error,
    change,
  }) => (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div
              className={`w-10 h-10 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">{title}</h3>
          </div>

          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
              <span className="text-slate-400">Loading...</span>
            </div>
          ) : error ? (
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">Error loading data</span>
            </div>
          ) : (
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {value}
              </p>
              {change && (
                <span
                  className={`text-sm font-medium ${
                    change > 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {change > 0 ? "+" : ""}
                  {change}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Prevent hydration mismatch by waiting for client-side mounting
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-slate-400 text-lg">
                  Monitor your university's performance and analytics
                </p>
              </div>
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-red-300 font-medium">Data Loading Error</p>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              title="Total Students"
              value={metrics.totalStudents}
              icon={GraduationCap}
              color="from-blue-500 to-blue-600"
              isLoading={isLoading}
              error={error}
              change={metrics.recentActivity?.newStudents || 0}
            />
            <StatCard
              title="Total Supervisors"
              value={metrics.totalSupervisors}
              icon={UserCheck}
              color="from-purple-500 to-purple-600"
              isLoading={isLoading}
              error={error}
              change={metrics.recentActivity?.newSupervisors || 0}
            />
            <StatCard
              title="Active Projects"
              value={metrics.activeProjects}
              icon={Target}
              color="from-emerald-500 to-emerald-600"
              isLoading={isLoading}
              error={error}
              change={Math.round((metrics.activeProjects / Math.max(metrics.totalProjects, 1)) * 100)}
            />
            <StatCard
              title="Completion Rate"
              value={`${metrics.completionRate}%`}
              icon={TrendingUp}
              color="from-amber-500 to-orange-500"
              isLoading={isLoading}
              error={error}
              change={metrics.completionRate}
            />
          </div>

          {/* Performance Panel */}
          <PerformancePanel />

          {/* Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <SummaryCard title="Total Users" value={metrics.totalUsers} change={12} />
            <CapacityUsageCard currentUsers={metrics.totalUsers} maxCapacity={1000} />
            <ActiveSessionsCard
              activeSessions={activeSessions}
              totalUsers={metrics.totalUsers}
              change={5} // Fixed value to prevent hydration issues
            />
          </div>

          {/* User Management Table */}
          <UserManagementTable users={allUsers} />

          {/* Project Analytics */}
          <ProjectAnalytics />
        </div>
      </div>
    </div>
  );
}
