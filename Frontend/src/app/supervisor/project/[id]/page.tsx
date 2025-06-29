"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Project from "../../components/Project/Project";
import Milestone from "../../components/Project/Milestone";
import { getSupervisedStudents } from "../../../../api/SupervisorApi/FetchProjects";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  BarChart2,
  ArrowLeft
} from "lucide-react";

// Debug utility function
const debugLog = (context: string, data: any, error: Error | null = null) => {
  if (process.env.NODE_ENV === "development") {
 
    if (error) {
      console.error("Error:", error);
      console.error("Stack:", error.stack);
    }
   
  }
};

const LoadingState = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="bg-gray-800/50 backdrop-blur p-8 rounded-xl shadow-lg border border-gray-700 flex items-center gap-4 animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <span className="text-xl font-semibold">Loading project details...</span>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="bg-gray-800/50 backdrop-blur p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center gap-6">
      <AlertCircle className="h-12 w-12 text-red-400" />
      <div className="text-xl text-red-400 font-semibold text-center">{error}</div>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/20 font-medium flex items-center gap-2"
      >
        <RefreshCw className="h-5 w-5" />
        Try Again
      </button>
    </div>
  </div>
);

interface ProjectData {
  id: string;
  projectTitle: string;
  projectDescription: string;
  projectType: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  milestones: MilestoneType[];
  student: {
    fullName: string;
    department: string;
    email: string;
  };
}

interface MilestoneType {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  tasks?: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    feedback?: Array<{
      id: string;
      title: string;
      description: string;
      date: string;
    }>;
  }>;
  meetings?: Array<{
    id: string;
    title: string;
    purpose: string;
    date: string;
    time: string;
    link: string;
    type: string;
  }>;
}

interface StudentWithProject {
  userId: string;
  fullName: string;
  email: string;
  universityEmail: string;
  level: string;
  department: string;
  phoneNumber?: string;
  address?: string;
  project?: {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    milestones: any[];
  };
}

export default function StudentProject() {
  const params = useParams();
  const router = useRouter();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const result = await getSupervisedStudents();
      
      if (result.success && result.students) {
        const foundStudent = result.students.find(s => s.userId === params.id) as StudentWithProject;
        
        if (foundStudent?.project) {
          const transformedProject = {
            id: foundStudent.project.id,
            projectTitle: foundStudent.project.title || "",
            projectDescription: foundStudent.project.description || "",
            projectType: foundStudent.project.type || "",
            startDate: foundStudent.project.startDate || "",
            endDate: foundStudent.project.endDate || "",
            status: foundStudent.project.status || "Pending",
            progress: foundStudent.project.progress || 0,
            milestones: (foundStudent.project.milestones || []).map((milestone: any) => ({
              id: milestone.id || "",
              title: milestone.title || "",
              description: milestone.description || "",
              status: milestone.status || "Pending",
              startDate: milestone.startDate || "",
              endDate: milestone.endDate || "",
              tasks: (milestone.tasks || []).map((task: any) => ({
                id: task.id || "",
                title: task.title || "",
                description: task.description || "",
                status: task.status || "Pending",
                startDate: task.startDate || "",
                endDate: task.endDate || "",
                feedback: task.feedback || [],
              })),
              meetings: (milestone.meetings || []).map((meeting: any) => ({
                id: meeting.id || "",
                title: meeting.title || "",
                purpose: meeting.title || "", // Map title to purpose for Meeting component
                date: meeting.date || "",
                time: meeting.time || "",
                link: meeting.link || "",
                type: meeting.type || "Online",
              })),
            })),
            student: {
              fullName: foundStudent.fullName,
              department: foundStudent.department,
              email: foundStudent.email
            }
          };
          
          setProjectData(transformedProject);
        } else {
          throw new Error("No project found for this student");
        }
      } else {
        throw new Error(result.message || "Failed to fetch student data");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      debugLog("Fetch Error", { params }, err instanceof Error ? err : null);
      
      if (errorMessage.includes("Authentication")) {
        router.push("/auth");
      }
    } finally {
      setLoading(false);
    }
  }, [params, router]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleMilestoneUpdate = async (updatedMilestones: MilestoneType[]) => {
    try {
      debugLog("Milestone Update", { updatedMilestones });
      
      setProjectData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          milestones: updatedMilestones,
          progress: calculateProgress(updatedMilestones)
        };
      });
    } catch (error) {
      debugLog("Milestone Update Error", { updatedMilestones }, error instanceof Error ? error : null);
      alert("Failed to update milestone");
    }
  };

  const calculateProgress = (milestones: MilestoneType[]): number => {
    if (!milestones?.length) return 0;
    
    const completedTasks = milestones.reduce(
      (sum, milestone) => sum + (milestone.tasks?.filter(task => task.status === "Completed").length || 0),
      0
    );

    const totalTasks = milestones.reduce(
      (sum, milestone) => sum + (milestone.tasks?.length || 0),
      0
    );

    return totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchProject} />;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <header className="relative">
          <Link
            href="/supervisor/project"
            className="absolute left-0 top-0 inline-flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Projects
          </Link>

          {projectData && (
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                {projectData.projectTitle}
              </h1>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <ChevronRight className="h-4 w-4" />
                  <span>Progress: {projectData.progress}%</span>
                </div>
                <div className="h-1 w-32 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${projectData.progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <ChevronRight className="h-4 w-4" />
                  <span>Status: {projectData.status}</span>
                </div>
              </div>
            </div>
          )}
        </header>

        <div className="grid gap-8">
          {projectData ? (
            <>
              <Project projectData={projectData} />
              <div className="bg-gray-800/50 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
                <Milestone
                  projectData={projectData}
                  projectId={projectData.id}
                  onMilestoneUpdate={handleMilestoneUpdate}
                  userRole="Supervisor"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
              <BarChart2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-300">No Project Found</h2>
              <p className="text-gray-400 mt-2">This student has not been assigned a project yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

