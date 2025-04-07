"use client";
import React from "react";
import { useState } from "react";
import { BarChart, LineChart, PieChart } from "lucide-react";
import HeaderData from "./components/header";
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
    let color = "bg-[#2EB67D]"; // Slack Green
    if (value < 50) color = "bg-[#E01E5A]"; // Slack Red
    else if (value < 75) color = "bg-[#ECB22E]"; // Slack Yellow

    return (
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full mr-2 ${color}`}></div>
        <span>{value}%</span>
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
      completed: "bg-[#2EB67D]/20 text-[#2EB67D]", // Slack Green
      "in-progress": "bg-[#36C5F0]/20 text-[#36C5F0]", // Slack Blue
      overdue: "bg-[#E01E5A]/20 text-[#E01E5A]", // Slack Red
      "not-started": "bg-[#616061]/20 text-[#616061]", // Text Secondary
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
    <div className="min-h-screen bg-[#F6F6F6]">
      {" "}
      {/* Slack Light Gray */}
      {/* Header */}
      <HeaderData />
      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Tabs */}
          <div className="border-b border-[#DDDDDD] mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-4 px-1 ${
                  activeTab === "overview"
                    ? "border-b-2 border-[#36C5F0] text-[#1D1D1D]" // Slack Blue and Dark Gray
                    : "text-[#616061] hover:text-[#1D1D1D] hover:border-[#B8A1C7]" // Text Secondary and Light Purple
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`pb-4 px-1 ${
                  activeTab === "students"
                    ? "border-b-2 border-[#36C5F0] text-[#1D1D1D]"
                    : "text-[#616061] hover:text-[#1D1D1D] hover:border-[#B8A1C7]"
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab("assignments")}
                className={`pb-4 px-1 ${
                  activeTab === "assignments"
                    ? "border-b-2 border-[#36C5F0] text-[#1D1D1D]"
                    : "text-[#616061] hover:text-[#1D1D1D] hover:border-[#B8A1C7]"
                }`}
              >
                Assignments
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`pb-4 px-1 ${
                  activeTab === "reports"
                    ? "border-b-2 border-[#36C5F0] text-[#1D1D1D]"
                    : "text-[#616061] hover:text-[#1D1D1D] hover:border-[#B8A1C7]"
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
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-[#4A154B] rounded-md p-3">
                        {" "}
                        {/* Slack Purple */}
                        <svg
                          className="h-6 w-6 text-white"
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
                          <dt className="text-sm font-medium text-[#616061] truncate">
                            {" "}
                            {/* Text Secondary */}
                            Total Students
                          </dt>
                          <dd className="text-3xl font-semibold text-[#1D1D1D]">
                            {" "}
                            {/* Text Primary */}
                            {students.length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Progress Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-[#2EB67D] rounded-md p-3">
                        {" "}
                        {/* Slack Green */}
                        <svg
                          className="h-6 w-6 text-white"
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
                          <dt className="text-sm font-medium text-[#616061] truncate">
                            Average Progress
                          </dt>
                          <dd className="text-3xl font-semibold text-[#1D1D1D]">
                            {Math.round(overallProgress)}%
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Attendance Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-[#ECB22E] rounded-md p-3">
                        {" "}
                        {/* Slack Yellow */}
                        <svg
                          className="h-6 w-6 text-white"
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
                          <dt className="text-sm font-medium text-[#616061] truncate">
                            Average Attendance
                          </dt>
                          <dd className="text-3xl font-semibold text-[#1D1D1D]">
                            {Math.round(overallAttendance)}%
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completed Assignments Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-[#36C5F0] rounded-md p-3">
                        {" "}
                        {/* Slack Blue */}
                        <svg
                          className="h-6 w-6 text-white"
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
                          <dt className="text-sm font-medium text-[#616061] truncate">
                            Completed Assignments
                          </dt>
                          <dd className="text-3xl font-semibold text-[#1D1D1D]">
                            {completedAssignments}/{totalAssignments}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Progress Table */}
              <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-4 py-5 border-b border-[#DDDDDD] sm:px-6">
                  <h3 className="text-lg font-medium text-[#1D1D1D]">
                    Student Progress
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#DDDDDD]">
                    <thead className="bg-[#F6F6F6]">
                      {" "}
                      {/* Slack Light Gray */}
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                        >
                          Student
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                        >
                          Course
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                        >
                          Progress
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                        >
                          Attendance
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                        >
                          Last Active
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#DDDDDD]">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-[#F6F6F6] flex items-center justify-center">
                                  <span className="text-[#616061] font-medium">
                                    {student.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-[#1D1D1D]">
                                  {student.name}
                                </div>
                                <div className="text-sm text-[#616061]">
                                  {student.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#616061]">
                            {student.course}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusIndicator value={student.progress} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusIndicator value={student.attendance} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#616061]">
                            {student.lastActive}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => viewStudentDetails(student)}
                              className="text-[#36C5F0] hover:text-[#3BAFDA]"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 border-b border-[#DDDDDD] sm:px-6">
                  <h3 className="text-lg font-medium text-[#1D1D1D]">
                    Recent Activity
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="divide-y divide-[#DDDDDD]">
                    <li className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-[#36C5F0]/20 flex items-center justify-center">
                            {" "}
                            {/* Slack Blue with opacity */}
                            <svg
                              className="h-6 w-6 text-[#36C5F0]"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#1D1D1D]">
                            Taylor Wilson submitted Final Presentation
                          </p>
                          <p className="text-sm text-[#616061]">5 hours ago</p>
                        </div>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-[#E01E5A]/20 flex items-center justify-center">
                            {" "}
                            {/* Slack Red with opacity */}
                            <svg
                              className="h-6 w-6 text-[#E01E5A]"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#1D1D1D]">
                            Jamie Smith's Visualization Project is overdue
                          </p>
                          <p className="text-sm text-[#616061]">1 day ago</p>
                        </div>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-[#2EB67D]/20 flex items-center justify-center">
                            {" "}
                            {/* Slack Green with opacity */}
                            <svg
                              className="h-6 w-6 text-[#2EB67D]"
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
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#1D1D1D]">
                            Alex Johnson achieved 68% course progress
                          </p>
                          <p className="text-sm text-[#616061]">2 days ago</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-[#DDDDDD] sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-[#1D1D1D]">
                  All Students
                </h3>
                <div className="flex space-x-3">
                  <select className="border border-[#DDDDDD] rounded-md px-3 py-2">
                    <option>All Courses</option>
                    <option>Computer Science</option>
                    <option>Data Science</option>
                  </select>
                  <select className="border border-[#DDDDDD] rounded-md px-3 py-2">
                    <option>All Progress</option>
                    <option>High Progress (75%+)</option>
                    <option>Medium Progress (50-75%)</option>
                    <option>Low Progress (0-50%)</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#DDDDDD]">
                  <thead className="bg-[#F6F6F6]">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                      >
                        Student
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                      >
                        Course
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                      >
                        Progress
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                      >
                        Attendance
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                      >
                        Last Active
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-[#616061] uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#DDDDDD]">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-[#F6F6F6] flex items-center justify-center">
                                <span className="text-[#616061] font-medium">
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#1D1D1D]">
                                {student.name}
                              </div>
                              <div className="text-sm text-[#616061]">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#616061]">
                          {student.course}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-[#F6F6F6] rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                student.progress >= 75
                                  ? "bg-[#2EB67D]" // Slack Green
                                  : student.progress >= 50
                                  ? "bg-[#ECB22E]" // Slack Yellow
                                  : "bg-[#E01E5A]" // Slack Red
                              }`}
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs mt-1 text-[#616061]">
                            {student.progress}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusIndicator value={student.attendance} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#616061]">
                          {student.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => viewStudentDetails(student)}
                              className="text-[#36C5F0] hover:text-[#3BAFDA]"
                            >
                              View
                            </button>
                            <button className="text-[#616061] hover:text-[#1D1D1D]">
                              Edit
                            </button>
                            <button className="text-[#E01E5A] hover:text-[#E01E5A]/80">
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
          {activeTab === "assignments" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-[#DDDDDD] sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-[#1D1D1D]">
                  All Assignments
                </h3>
                <button className="bg-[#36C5F0] text-white px-4 py-2 rounded-md hover:bg-[#3BAFDA]">
                  Create Assignment
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    "Project Proposal",
                    "Mid-term Report",
                    "Final Presentation",
                    "Data Analysis",
                    "Visualization Project",
                  ].map((assignment, index) => (
                    <div
                      key={index}
                      className="border border-[#DDDDDD] rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium text-lg mb-2">{assignment}</h4>
                      <div className="text-sm text-[#616061] mb-4">
                        Due:{" "}
                        {
                          ["Apr 15", "Mar 30", "May 10", "Apr 20", "Apr 5"][
                            index
                          ]
                        }
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">
                          Completion Rate:
                        </span>
                        <span className="text-sm">
                          {[100, 100, 33, 33, 0][index]}%
                        </span>
                      </div>
                      <div className="w-full bg-[#F6F6F6] rounded-full h-2 mb-4">
                        <div
                          className="bg-[#36C5F0] h-2 rounded-full"
                          style={{ width: `${[100, 100, 33, 33, 0][index]}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-end">
                        <button className="text-[#36C5F0] hover:text-[#3BAFDA] text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 border-b border-[#DDDDDD] sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-[#1D1D1D]">
                    Overall Progress
                  </h3>
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 text-[#616061] mr-2" />
                    <span className="text-sm text-[#616061]">Last 30 Days</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-center justify-center bg-[#F6F6F6] rounded-md">
                    <div className="text-center">
                      <div className="text-[#616061] mb-2">
                        Visualization placeholder
                      </div>
                      <div className="text-sm text-[#B8A1C7]">
                        Course progress chart would appear here
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
