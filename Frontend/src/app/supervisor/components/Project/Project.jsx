import { useState, useEffect } from "react";
import {
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  DocumentTextIcon,
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
    <section className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl shadow-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
      <div className="space-y-8">
        {/* Project Header with Status Badge */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-colors">
                {currentData?.projectTitle || "Untitled Project"}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <p className="text-gray-300">
                  By{" "}
                  <span className="font-medium text-white hover:text-blue-400 transition-colors">
                    {projectData?.student?.fullName || "Not assigned"}
                  </span>
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentData?.progress >= 100
                  ? "bg-green-500/20 text-green-400"
                  : currentData?.progress >= 50
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {currentData?.progress >= 100 ? "Completed" : "In Progress"}
            </span>
          </div>

          {/* Project Description with Icon */}
          <div className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-xl">
            <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-1" />
            <p className="text-gray-300 leading-relaxed">
              {currentData?.projectDescription || "No description available"}
            </p>
          </div>
        </div>

        {/* Project Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <CalendarIcon className="h-6 w-6 text-blue-400" />,
              label: "Start Date",
              value: formatDate(currentData?.startDate),
              bgColor: "hover:bg-blue-400/10",
            },
            {
              icon: <ClockIcon className="h-6 w-6 text-purple-400" />,
              label: "End Date",
              value: formatDate(currentData?.endDate),
              bgColor: "hover:bg-purple-400/10",
            },
            {
              icon: <AcademicCapIcon className="h-6 w-6 text-yellow-400" />,
              label: "Department",
              value: projectData?.student?.department || "Not assigned",
              bgColor: "hover:bg-yellow-400/10",
            },
            {
              icon: <ChartBarIcon className="h-6 w-6 text-green-400" />,
              label: "Time Remaining",
              value: timeRemaining,
              bgColor: "hover:bg-green-400/10",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`bg-gray-700/30 p-5 rounded-xl flex items-start gap-4 transform hover:-translate-y-1 transition-all duration-300 ${item.bgColor}`}
            >
              {item.icon}
              <div>
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="text-white font-medium mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Section with Improved Visual Feedback */}
        <div className="bg-gray-700/30 p-6 rounded-xl space-y-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <ChartBarIcon className="h-6 w-6 text-blue-400" />
            Project Progress
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <ClipboardDocumentListIcon className="h-8 w-8 text-blue-400" />,
                label: "Total Tasks",
                value: totalTasks,
                color: "text-blue-400",
              },
              {
                icon: <CheckCircleIcon className="h-8 w-8 text-green-400" />,
                label: "Completed",
                value: completedTasks,
                color: "text-green-400",
              },
              {
                icon: <ChartBarIcon className="h-8 w-8 text-purple-400" />,
                label: "Progress",
                value: `${currentData?.progress || 0}%`,
                color: getProgressColor(currentData?.progress || 0),
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-4 rounded-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  {stat.icon}
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-6">
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-in-out"
                style={{
                  width: `${currentData?.progress || 0}%`,
                  boxShadow: "0 0 10px rgba(147, 51, 234, 0.3)",
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>0%</span>
              <span>{currentData?.progress || 0}% Complete</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
