"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Project from "../components/Project/Project";
import Milestone from "../components/Project/Milestone";
import {
  getProjectById,
  updateProjectMilestones,
  checkAuth,
} from "../../../api/StudentApi/Projects"; // Explicitly use .ts extension
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  PlusCircle,
  ChevronRight,
  BarChart2,
} from "lucide-react";

// Debug utility function (keep existing implementation)
const debugLog = (context, data, error = null) => {
  if (process.env.NODE_ENV === "development") {

    if (error) {
      console.error("Error:", error);
      console.error("Stack:", error.stack);
    }
    console.groupEnd();
  }
};

const LoadingState = () => (
  <div className="min-h-screen  text-white flex items-center justify-center">
    <div
      className="bg-gray-800/50 backdrop-blur p-8 rounded-xl shadow-lg border border-gray-700 
                  flex items-center gap-4 animate-pulse"
    >
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <span className="text-xl font-semibold">Loading project details...</span>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen  text-white flex items-center justify-center">
    <div
      className="bg-gray-800/50 backdrop-blur p-8 rounded-xl shadow-lg border border-gray-700 
                  flex flex-col items-center gap-6"
    >
      <AlertCircle className="h-12 w-12 text-red-400" />
      <div className="text-xl text-red-400 font-semibold text-center">
        {error}
      </div>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 
                 shadow-lg hover:shadow-blue-500/20 font-medium flex items-center gap-2"
      >
        <RefreshCw className="h-5 w-5" />
        Try Again
      </button>
    </div>
  </div>
);

const EmptyState = ({ onRegister }) => (
  <div className="min-h-screen  text-white flex items-center justify-center">
    <div
      className="bg-gray-800/50 backdrop-blur p-8 rounded-xl shadow-lg border border-gray-700 
                  flex flex-col items-center gap-6"
    >
      <BarChart2 className="h-12 w-12 text-gray-400" />
      <div className="text-center">
        <div className="text-xl font-semibold">No project found</div>
        <p className="text-gray-400 mt-2">
          Get started by registering your project
        </p>
      </div>
      <button
        onClick={onRegister}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 
                 shadow-lg hover:shadow-green-500/20 font-medium flex items-center gap-2"
      >
        <PlusCircle className="h-5 w-5" />
        Register New Project
      </button>
    </div>
  </div>
);

export default function MyProject() {
  const router = useRouter();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test if checkAuth function exists
      if (typeof checkAuth !== "function") {
        throw new Error("checkAuth function is not available");
      }

      const { token, userInfo } = checkAuth();
      setUser(userInfo);
    

      const result = await getProjectById(
        userInfo.username || userInfo.userId,
        token
      );

      if (result.success) {
        setProjectData(result.project);
      } else if (result.noProject) {
        // Student has no project assigned - this is normal
        setProjectData(null);
        setError(null);
      } else {
        throw new Error(result.message || "Failed to fetch project");
      }
    } catch (err) {
      console.error("Fetch project error:", err);
      setError(err.message);
      if (err.message.includes("Authentication")) {
        router.push("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [router]);

  // Enhanced handleMilestoneUpdate function
  const handleMilestoneUpdate = async (updatedMilestones) => {
    debugLog("handleMilestoneUpdate Started", { updatedMilestones });

    try {
      // Validate inputs
      const { token } = checkAuth();
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      if (!projectData?.id) {
        throw new Error("Project ID is required");
      }

      if (!Array.isArray(updatedMilestones)) {
        throw new Error("Invalid milestones format");
      }

      // Deep clone current state with validation
      let currentMilestones;
      try {
        currentMilestones = JSON.parse(JSON.stringify(projectData.milestones));
      } catch (cloneError) {
        debugLog("State Clone Error", { projectData }, cloneError);
        throw new Error("Failed to process current milestone state");
      }

      // Log state before update
      debugLog("Pre-Update State", {
        currentMilestones,
        updatedMilestones,
        projectId: projectData.id,
      });

      // Update local state with validation
      setProjectData((prev) => {
        if (!prev) {
          throw new Error("Previous state is null");
        }
        return {
          ...prev,
          milestones: updatedMilestones,
        };
      });

      // Make API call
      const result = await updateProjectMilestones(
        projectData.id,
        updatedMilestones,
        token
      );

      debugLog("API Response", { result });

      if (!result?.success) {
        throw new Error(
          result?.message || "Update failed with no error message"
        );
      }

      // Calculate progress with validation
      const completedMilestones = updatedMilestones.filter(
        (m) => m?.status === "Completed"
      ).length;

      const totalMilestones = updatedMilestones.length;
      const progress =
        totalMilestones > 0
          ? Math.round((completedMilestones / totalMilestones) * 100)
          : 0;

      debugLog("Progress Calculation", {
        completedMilestones,
        totalMilestones,
        progress,
      });

      // Final state update with validation
      setProjectData((prev) => {
        if (!prev) {
          throw new Error("Previous state is null during final update");
        }
        return {
          ...prev,
          progress,
          milestones: updatedMilestones,
        };
      });

      debugLog("Update Completed Successfully", {
        progress,
        milestonesCount: updatedMilestones.length,
      });
    } catch (error) {
      // Enhanced error handling
      debugLog(
        "Milestone Update Error",
        {
          projectData,
          updatedMilestones,
          errorType: error.constructor.name,
        },
        error
      );

      // Revert state on error with validation
      setProjectData((prev) => {
        if (!prev) {
          console.error("Cannot revert state: previous state is null");
          return null;
        }
        return {
          ...prev,
          milestones: currentMilestones,
        };
      });

      // User feedback with specific error messages
      const errorMessage = error.message || "An unknown error occurred";
      alert(`Failed to update milestone: ${errorMessage}`);

      // Rethrow in development
      if (process.env.NODE_ENV === "development") {
        throw error;
      }
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchProject} />;
  if (!projectData)
    return (
      <EmptyState onRegister={() => router.push("/student/registerproject")} />
    );

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <header className="relative">
          <div className="text-center space-y-4">
            <h1
              className="text-3xl font-bold text-transparent bg-clip-text 
                         bg-gradient-to-r from-blue-500 to-purple-500"
            >
              {projectData.title}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <ChevronRight className="h-4 w-4" />
                <span>Progress: {projectData.progress || 0}%</span>
              </div>
              <div className="h-1 w-32 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${projectData.progress || 0}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <ChevronRight className="h-4 w-4" />
                <span>Status: {projectData.status || "In Progress"}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-8">
          <div>
            <Project
              projectData={projectData}
              onProjectUpdate={setProjectData}
            />
          </div>

          <div
            className="bg-gray-800/50 backdrop-blur rounded-xl shadow-lg p-6 
                       border border-gray-700 hover:border-gray-600 transition-all duration-200"
          >
            <Milestone
              projectData={projectData}
              projectId={projectData.id}
              onMilestoneUpdate={handleMilestoneUpdate}
              userRole={
                projectData?.supervisor?.id === user?.username
                  ? "Supervisor"
                  : "Student"
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
