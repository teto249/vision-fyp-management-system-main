"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerProject } from "../../../api/StudentApi/Projects"; // This will now use the .ts file
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Calendar,
  FileText,
  User,
  Briefcase,
  Target,
} from "lucide-react";
import { useSupervisors } from "../../../api/StudentApi/FetchSupervisors";

export default function RegisterProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [mounted, setMounted] = useState(false);
  const [existingProject, setExistingProject] = useState(null);
  const [hasExistingProject, setHasExistingProject] = useState(false);

  const [formData, setFormData] = useState({
    projectType: "",
    projectTitle: "",
    projectDescription: "",
    startDate: "",
    endDate: "",
    supervisorId: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const showStatus = (type, message) => {
    setStatus({ type, message });
    if (type === "success") {
      setTimeout(() => router.push("/student"), 2000);
    }
  };

  useEffect(() => {
    if (!mounted) return;

    const loadSupervisorsAndCheckProject = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("authToken");
        const studentInfo = localStorage.getItem("studentInfo");

        if (!token || !studentInfo) {
          showStatus("error", "Please log in to register a project");
          setTimeout(() => router.push("/auth"), 1500);
          return;
        }

        const parsedStudentInfo = JSON.parse(studentInfo);

        // Try to get university ID from multiple possible sources
        const universityId = parsedStudentInfo?.universityId || 
                           parsedStudentInfo?.university?.id || 
                           parsedStudentInfo?.university?.shortName;

   

        if (!universityId) {
          console.error("Missing universityId in student info:", parsedStudentInfo);
          throw new Error(
            "University information not found. Please re-login and try again."
          );
        }

        // Check for existing project first
        try {
          const { getProjectById } = await import("../../../api/StudentApi/Projects");
          const projectResult = await getProjectById(
            parsedStudentInfo.username || parsedStudentInfo.userId,
            token
          );

          if (projectResult.success && projectResult.project) {
            setExistingProject(projectResult.project);
            setHasExistingProject(true);
            return; // Exit early if project exists
          }
        } catch (projectError) {
          // If no project found, continue with supervisor loading
          alert("No existing project found, continuing with registration");
        }

        const data = await useSupervisors();

        if (data.success) {
          const formattedSupervisors = data.supervisors.map((supervisor) => ({
            userId: supervisor.userId,
            fullName: supervisor.fullName,
            department: supervisor.department,
          }));

          setSupervisors(formattedSupervisors);

          if (formattedSupervisors.length === 0) {
            showStatus("warning", "No supervisors found for your university");
          }
        }
      } catch (error) {
        console.error("Error loading supervisors:", error);
        setStatus({ type: "error", message: error.message });

        if (
          error.message.includes("Authentication") ||
          error.message.includes("not found")
        ) {
          setTimeout(() => router.push("/auth"), 1500);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSupervisorsAndCheckProject();
  }, [mounted, router]);

  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = "Project title is required";
    } else if (
      formData.projectTitle.length < 10 ||
      formData.projectTitle.length > 255
    ) {
      newErrors.projectTitle =
        "Project title must be between 10 and 255 characters";
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = "Project description is required";
    } else if (
      formData.projectDescription.length < 50 ||
      formData.projectDescription.length > 5000
    ) {
      newErrors.projectDescription =
        "Description must be between 50 and 5000 characters";
    }

    if (!formData.projectType) {
      newErrors.projectType = "Please select a project type";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    } else if (startDate < currentDate) {
      newErrors.startDate = "Start date cannot be in the past";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (startDate >= endDate) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!formData.supervisorId) {
      newErrors.supervisorId = "Please select a supervisor";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showStatus("error", "Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const studentInfo = JSON.parse(localStorage.getItem("studentInfo") || "{}");

      if (!token || !studentInfo?.userId) {
        showStatus("error", "Authentication required");
        router.push("/auth");
        return;
      }

      const selectedSupervisor = supervisors.find((sup) => sup.userId === formData.supervisorId);
      if (!selectedSupervisor) {
        throw new Error("Invalid supervisor selected");
      }

      // Format data to match backend expectations
      const projectData = {
        projectTitle: formData.projectTitle,           // Backend expects projectTitle
        projectType: formData.projectType,             // Backend expects projectType  
        projectDescription: formData.projectDescription, // Backend expects projectDescription
        startDate: formData.startDate,
        endDate: formData.endDate,
        supervisorId: selectedSupervisor.userId,
        studentId: studentInfo.username || studentInfo.userId, // Backend expects studentId
        universityId: studentInfo.universityId,        // Optional but good to include
      };

      
      const response = await registerProject(projectData, token);


      if (response.success) {
        showStatus("success", response.message || "Project registered successfully!");
      } else {
        throw new Error(response.message || "Failed to register project");
      }
    } catch (error) {
      console.error("Project registration error:", error);
      showStatus("error", error.message || "Failed to register project");
    } finally {
      setLoading(false);
    }
  };

  const renderError = (fieldName) => {
    if (!errors[fieldName]) return null;
    return (
      <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        {errors[fieldName]}
      </p>
    );
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
              Register New Project
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Start your academic journey by registering a new project with your
              chosen supervisor
            </p>
          </div>

          {/* Status Messages */}
          {status.message && (
            <div
              className={`mb-8 p-4 rounded-2xl border backdrop-blur-xl ${
                status.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : status.type === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-300"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                {status.type === "success" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : status.type === "error" ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <p className="font-medium">{status.message}</p>
              </div>
            </div>
          )}

          {/* Existing Project Alert */}
          {hasExistingProject && existingProject && (
            <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-300">
                      You Already Have a Project!
                    </h2>
                    <p className="text-blue-400/80 mt-1">
                      You can only register one project at a time
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Project Title
                      </label>
                      <p className="text-white font-medium">
                        {existingProject.title || existingProject.projectTitle}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Project Type
                      </label>
                      <p className="text-white font-medium">
                        {existingProject.type || existingProject.projectType || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Start Date
                      </label>
                      <p className="text-white font-medium">
                        {existingProject.startDate 
                          ? new Date(existingProject.startDate).toLocaleDateString()
                          : "N/A"
                        }
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        End Date
                      </label>
                      <p className="text-white font-medium">
                        {existingProject.endDate 
                          ? new Date(existingProject.endDate).toLocaleDateString()
                          : "N/A"
                        }
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Status
                      </label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        existingProject.status === "Completed" 
                          ? "bg-green-500/20 text-green-400"
                          : existingProject.status === "In Progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {existingProject.status || "In Progress"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Progress
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                            style={{ width: `${existingProject.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-white font-medium text-sm">
                          {existingProject.progress || 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {existingProject.description && (
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Description
                      </label>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {existingProject.description || existingProject.projectDescription}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    onClick={() => router.push("/student/myProject")}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Target className="h-5 w-5" />
                    View My Project
                  </button>
                  
                  <button
                    onClick={() => router.push("/student")}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-200"
                  >
                    <Calendar className="h-5 w-5" />
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Form - Only show if no existing project */}
          {!hasExistingProject && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Project Type & Title */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="projectType"
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3"
                  >
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    Project Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="projectType"
                    id="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className={`w-full p-4 bg-slate-800/50 border ${
                      errors.projectType
                        ? "border-red-500/50"
                        : "border-slate-700/50"
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200`}
                    required
                  >
                    <option value="">Select Project Type</option>
                    <option value="System Development">System Development</option>
                    <option value="Research-Based">Research-Based</option>
                  </select>
                  {renderError("projectType")}
                </div>

                <div>
                  <label
                    htmlFor="supervisorId"
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3"
                  >
                    <User className="w-4 h-4 text-blue-400" />
                    Supervisor <span className="text-red-400">*</span>
                    {loading && (
                      <span className="text-slate-500 text-xs">(Loading...)</span>
                    )}
                  </label>
                  <select
                    name="supervisorId"
                    id="supervisorId"
                    value={formData.supervisorId}
                    onChange={handleChange}
                    className={`w-full p-4 bg-slate-800/50 border ${
                      errors.supervisorId
                        ? "border-red-500/50"
                        : "border-slate-700/50"
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200`}
                    required
                    disabled={loading}
                  >
                    <option value="">
                      {loading
                        ? "Loading supervisors..."
                        : supervisors.length === 0
                        ? "No supervisors available"
                        : "Select Supervisor"}
                    </option>
                    {supervisors.map((supervisor) => (
                      <option key={supervisor.userId} value={supervisor.userId}>
                        {supervisor.fullName} - {supervisor.department}
                      </option>
                    ))}
                  </select>
                  {supervisors.length === 0 && !loading && (
                    <p className="text-yellow-400 text-sm mt-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      No supervisors found for your university
                    </p>
                  )}
                  {renderError("supervisorId")}
                </div>
              </div>

              {/* Project Title */}
              <div>
                <label
                  htmlFor="projectTitle"
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3"
                >
                  <Target className="w-4 h-4 text-blue-400" />
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  id="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  placeholder="Enter a descriptive title for your project"
                  className={`w-full p-4 bg-slate-800/50 border ${
                    errors.projectTitle
                      ? "border-red-500/50"
                      : "border-slate-700/50"
                  } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200`}
                  required
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Minimum 10 characters</span>
                  <span>{formData.projectTitle.length}/255</span>
                </div>
                {renderError("projectTitle")}
              </div>

              {/* Project Description */}
              <div>
                <label
                  htmlFor="projectDescription"
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  Project Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="projectDescription"
                  id="projectDescription"
                  rows="6"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  placeholder="Describe your project goals, methodology, and expected outcomes..."
                  className={`w-full p-4 bg-slate-800/50 border ${
                    errors.projectDescription
                      ? "border-red-500/50"
                      : "border-slate-700/50"
                  } rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200`}
                  required
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Minimum 50 characters</span>
                  <span>{formData.projectDescription.length}/5000</span>
                </div>
                {renderError("projectDescription")}
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="startDate"
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3"
                  >
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Start Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full p-4 bg-slate-800/50 border ${
                      errors.startDate
                        ? "border-red-500/50"
                        : "border-slate-700/50"
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200`}
                    required
                  />
                  {renderError("startDate")}
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3"
                  >
                    <Calendar className="w-4 h-4 text-blue-400" />
                    End Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full p-4 bg-slate-800/50 border ${
                      errors.endDate
                        ? "border-red-500/50"
                        : "border-slate-700/50"
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200`}
                    required
                  />
                  {renderError("endDate")}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Registering Project...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>Register Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
