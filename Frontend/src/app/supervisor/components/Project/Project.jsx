import { useState, useEffect } from "react";
import Milestone from "./Milestone";
import {
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Project({ projectData }) {
  const [currentData, setCurrentData] = useState(projectData);
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    setCurrentData(projectData);
    calculateTimeRemaining();
  }, [projectData]);

  const calculateTimeRemaining = () => {
    if (!projectData?.endDate) return;

    const end = new Date(projectData.endDate);
    const now = new Date();
    const diff = end - now;

    if (diff < 0) {
      setTimeRemaining("Project ended");
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    setTimeRemaining(`${days} days remaining`);
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return "text-green-400";
    if (progress >= 50) return "text-yellow-400";
    if (progress >= 25) return "text-orange-400";
    return "text-red-400";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Safe access to supervisor data with proper null checking
  const supervisorName = projectData?.supervisor?.name || "Not assigned";
  const supervisorDepartment = projectData?.supervisor?.department || "Not set";

  // Debug logging to verify data structure
  useEffect(() => {
    console.log("Project Data Structure:", {
      supervisor: projectData?.supervisor,
      milestones: projectData?.milestones,
      projectData: projectData,
    });
  }, [projectData]);

  // Safe access to milestones
  const milestones = projectData?.milestones || [];

  const totalTasks = milestones.reduce(
    (sum, milestone) => sum + (milestone?.tasks?.length || 0),
    0
  );

  const completedTasks = milestones.reduce(
    (sum, milestone) =>
      sum +
      ((milestone?.tasks || []).filter((task) => task?.status === "Completed")
        .length || 0),
    0
  );

  return (
    <section className="bg-gray-800/50 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-700">
      <div className="space-y-6">
        {/* Project Header */}
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {currentData?.projectTitle || "Untitled Project"}
          </h2>
          <p className="text-gray-300 mt-2">
            {currentData?.projectDescription || "No description available"}
          </p>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Start Date</p>
              <p className="text-white font-medium">
                {formatDate(currentData?.startDate)}
              </p>
            </div>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
            <ClockIcon className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">End Date</p>
              <p className="text-white font-medium">
                {formatDate(currentData?.endDate)}
              </p>
            </div>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
            <UserIcon className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Supervisor</p>
              <p className="text-white font-medium">{supervisorName}</p>
            </div>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
            <AcademicCapIcon className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Department</p>
              <p className="text-white font-medium">{supervisorDepartment}</p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-gray-700/50 p-6 rounded-lg space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            Project Progress
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <ClipboardDocumentListIcon className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total Tasks</p>
                <p className="text-xl font-semibold text-white">{totalTasks}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-xl font-semibold text-white">
                  {completedTasks}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ChartBarIcon className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Overall Progress</p>
                <p
                  className={`text-xl font-semibold ${getProgressColor(
                    currentData?.progress || 0
                  )}`}
                >
                  {currentData?.progress || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500"
                style={{ width: `${currentData?.progress || 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">
              {timeRemaining}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
