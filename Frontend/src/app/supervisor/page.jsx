"use client";
import React from "react";
import { useState } from "react";
import { BarChart } from "lucide-react";
import Assignments from "./components/Dashboard/Assignments";
import StudentProgressTable from "./components/Dashboard/StudentProgressTable";
import ResentActivity from "./components/Dashboard/ResentActivity";
import Report from "./components/Dashboard/Report";

import { studentList } from "./data/Studentlist";

export default function Supervisor() {
  const [students, setStudents] = useState(studentList);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Calculate overall statistics
  const overallProgress =
    students.reduce((sum, student) => sum + student.progress, 0) /
    students.length;
  const overallAttendance =
    students.reduce((sum, student) => sum + student.attendance, 0) /
    students.length;
  const completedAssignments = students.reduce(
    (sum, student) =>
      sum + student.assignments.filter((a) => a.status === "completed").length,
    0
  );
  const totalAssignments = students.reduce(
    (sum, student) => sum + student.assignments.length,
    0
  );

  // Status indicator component
  const StatusIndicator = ({ value }) => {
    let color = "bg-teal-400"; // Teal
    if (value < 50) color = "bg-red-500"; // Red
    else if (value < 75) color = "bg-yellow-400"; // Yellow

    return (
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full mr-2 ${color}`}></div>
        <span className="text-gray-300">{value}%</span>
      </div>
    );
  };

  // Function to view student details
  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setActiveTab("student-detail");
  };

  // Return to overview
  const backToOverview = () => {
    setSelectedStudent(null);
    setActiveTab("overview");
  };

  // Assignment status badge
  const AssignmentStatusBadge = ({ status }) => {
    const statusStyles = {
      completed: "bg-teal-400/20 text-teal-400", // Teal
      "in-progress": "bg-blue-400/20 text-blue-400", // Blue
      overdue: "bg-red-500/20 text-red-500", // Red
      "not-started": "bg-gray-600/20 text-gray-400", // Gray
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${statusStyles[status]}`}
      >
        {status.replace("-", " ")}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Header */}

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-4 px-1 ${
                  activeTab === "overview"
                    ? "border-b-2 border-teal-400 text-teal-400"
                    : "text-gray-400 hover:text-gray-300 hover:border-gray-500"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`pb-4 px-1 ${
                  activeTab === "students"
                    ? "border-b-2 border-teal-400 text-teal-400"
                    : "text-gray-400 hover:text-gray-300 hover:border-gray-500"
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab("assignments")}
                className={`pb-4 px-1 ${
                  activeTab === "assignments"
                    ? "border-b-2 border-teal-400 text-teal-400"
                    : "text-gray-400 hover:text-gray-300 hover:border-gray-500"
                }`}
              >
                Assignments
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`pb-4 px-1 ${
                  activeTab === "reports"
                    ? "border-b-2 border-teal-400 text-teal-400"
                    : "text-gray-400 hover:text-gray-300 hover:border-gray-500"
                }`}
              >
                Reports
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {/* Total Students Card */}
                <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-teal-400 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            Total Students
                          </dt>
                          <dd className="text-3xl font-semibold text-gray-100">
                            {students.length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Progress Card */}
                <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-teal-400 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            Average Progress
                          </dt>
                          <dd className="text-3xl font-semibold text-gray-100">
                            {Math.round(overallProgress)}%
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Attendance Card */}
                <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-400 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            Average Response Time
                          </dt>
                          <dd className="text-3xl font-semibold text-gray-100">
                            {Math.round(overallAttendance)}%
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completed Assignments Card */}
                <div className="bg-gray-700 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-400 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            Completed Tasks
                          </dt>
                          <dd className="text-3xl font-semibold text-gray-100">
                            {completedAssignments}/{totalAssignments}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Progress Table */}
              <StudentProgressTable
                students={students}
                StatusIndicator={StatusIndicator}
              />

              {/* Recent Activity */}
              <ResentActivity />
            </div>
          )}
          {activeTab === "students" && (
            <div className="bg-gray-700 shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-600 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-100">
                  All Students
                </h3>
                <div className="flex space-x-3">
                  <select className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400">
                    <option>All Courses</option>
                    <option>Computer Science</option>
                    <option>Data Science</option>
                  </select>
                  <select className="border border-gray-600 bg-gray-800 text-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:border-teal-400">
                    <option>All Progress</option>
                    <option>High Progress (75%+)</option>
                    <option>Medium Progress (50-75%)</option>
                    <option>Low Progress (0-50%)</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Student
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Course
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Progress
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Attendance
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Last Active
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-700 divide-y divide-gray-600">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-600">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                                <span className="text-gray-400 font-medium">
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-100">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {student.course}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                student.progress >= 75
                                  ? "bg-teal-400"
                                  : student.progress >= 50
                                  ? "bg-yellow-400"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs mt-1 text-gray-400">
                            {student.progress}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusIndicator value={student.attendance} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {student.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => viewStudentDetails(student)}
                              className="text-teal-400 hover:text-teal-300"
                            >
                              View
                            </button>
                            <button className="text-gray-400 hover:text-gray-300">
                              Edit
                            </button>
                            <button className="text-red-500 hover:text-red-400">
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && <Assignments />}

          {/* Reports Tab */}
          {activeTab === "reports" && <Report />}
        </div>
      </main>
    </div>
  );
}
