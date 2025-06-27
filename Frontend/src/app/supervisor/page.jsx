"use client";
import React from "react";
import { useState, useEffect } from "react";
import { BarChart } from "lucide-react";
import StudentProgressTable from "./components/Dashboard/StudentProgressTable";
import RecentActivity from "./components/Dashboard/RecentActivity";
import Report from "./components/Dashboard/Report";

// Import real API functions
import { getSupervisedStudents } from "../../api/SupervisorApi/FetchProjects";

export default function Supervisor() {
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);  // Calculate overall statistics
  const overallProgress =
    students.length > 0
      ? students.reduce((sum, student) => sum + student.progress, 0) /
        students.length
      : 0;
  const overallAttendance =
    students.length > 0
      ? students.reduce((sum, student) => sum + student.attendance, 0) /
        students.length
      : 0;
  const completedTasks = students.reduce(
    (sum, student) =>
      sum + student.assignments.filter((a) => a.status === "completed").length,
    0
  );
  const totalTasks = students.reduce(
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
  // Task status badge
  const TaskStatusBadge = ({ status }) => {
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
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the single endpoint that returns students with their projects
        const studentsResponse = await getSupervisedStudents();

        if (studentsResponse.success && studentsResponse.students) {
          // Transform student data to match dashboard expectations
          const transformedStudents = studentsResponse.students.map(
            (student) => {
              let progress = 0;
              let assignments = [];
              let attendance = 85; // Default value

              // Calculate progress and assignments from project data
              if (student.project && student.project.milestones) {
                // Calculate progress from milestones
                const totalMilestones = student.project.milestones.length;
                const completedMilestones = student.project.milestones.filter(
                  (milestone) => milestone.status === "Completed"
                ).length;

                progress =
                  totalMilestones > 0
                    ? Math.round((completedMilestones / totalMilestones) * 100)
                    : 0;

                // Get tasks as assignments
                assignments = student.project.milestones.flatMap(
                  (milestone) =>
                    milestone.tasks?.map((task) => ({
                      id: task.id,
                      title: task.title,
                      status: task.status.toLowerCase().replace(/\s+/g, "-"),
                      dueDate: task.endDate,
                      milestone: milestone.title,
                      score: null, // Can be added later if needed
                    })) || []
                );

                // Calculate attendance based on meetings (optional)
                const totalMeetings = student.project.milestones.reduce(
                  (sum, milestone) => sum + (milestone.meetings?.length || 0),
                  0
                );
                if (totalMeetings > 0) {
                  // This is a simple calculation - you can enhance it based on actual attendance data
                  attendance = Math.min(95, 75 + Math.floor(totalMeetings * 5));
                }
              }

              return {
                id: student.userId,
                name: student.fullName,
                email: student.email || student.universityEmail,
                course: student.department,
                level: student.level,
                progress,
                assignments,
                attendance,
                lastActive: "Today", // You can calculate this from recent project activity
                project: student.project,
              };
            }
          );

          setStudents(transformedStudents);
        } else {
          // Handle case where no students are found
          setStudents([]);
          if (!studentsResponse.success) {
            setError(studentsResponse.message || "Failed to load student data");
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message || "Failed to fetch data");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ...existing code...
  return (
    <div className="min-h-screen bg-gray-800">
      {/* Header */}

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
              <span className="ml-3 text-gray-300">
                Loading dashboard data...
              </span>
            </div>
          )}
          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-400">
                    Error loading dashboard data
                  </h3>
                  <div className="mt-2 text-sm text-red-300">{error}</div>
                  <div className="mt-4">
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}{" "}
          {/* Navigation Tabs and Content - Only show when not loading */}
          {!loading && (
            <>              {/* Navigation Tabs */}
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
                    onClick={() => setActiveTab("reports")}
                    className={`pb-4 px-1 ${
                      activeTab === "reports"
                        ? "border-b-2 border-teal-400 text-teal-400"
                        : "text-gray-400 hover:text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    AI Reports
                  </button>
                </nav>
              </div>{" "}
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  {students.length === 0 && !error ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <h3 className="mt-2 text-sm font-medium text-gray-100">
                        No students assigned
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">
                        You don't have any students assigned to supervise yet.
                      </p>
                    </div>
                  ) : (
                    <>
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
                                  </dt>                          <dd className="text-3xl font-semibold text-gray-100">
                            {completedTasks}/{totalTasks}
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      {/* Student Progress Table */}
                      <StudentProgressTable
                        students={students}
                        StatusIndicator={StatusIndicator}
                      />              {/* Recent Activity */}
              <RecentActivity students={students} />
                    </>
                  )}
                </div>
              )}{" "}
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

                  {students.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <h3 className="mt-2 text-sm font-medium text-gray-100">
                        No students found
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">
                        You don't have any students assigned to supervise yet.
                      </p>
                    </div>
                  ) : (
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
                          ))}{" "}
                        </tbody>
                      </table>
                    </div>
                  )}                </div>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && <Report students={students} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
