"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerProject } from "../../../api/StudentApi/Projects";
import { Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useSupervisors } from "../../../api/StudentApi/FetchSupervisors";

export default function RegisterProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    projectType: "",
    projectTitle: "",
    projectDescription: "",
    startDate: "",
    endDate: "",
    supervisorId: "",
  });
    const token = localStorage.getItem("authToken");
    console.log("Auth Token:", token);

  // Replace showNotification with setStatus
  const showStatus = (type, message) => {
    setStatus({ type, message });
    if (type === "success") {
      setTimeout(() => router.push("/student"), 2000);
    }
  };

  // Update error handling in useEffect
  useEffect(() => {
    const loadSupervisors = async () => {
      try {
        setLoading(true);
        const studentInfo = JSON.parse(
          localStorage.getItem("studentInfo") || "{}"
        );
console.log("Student Info:", studentInfo);
        if (!studentInfo?.universityId) {
          throw new Error("University information not found");
        }

        const data = await useSupervisors();

        if (data.success) {
          // Ensure each supervisor has the required fields
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
        setStatus({ type: "error", message: error.message });
        if (
          error.message.includes("Authentication") ||
          error.message.includes("not found")
        ) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadSupervisors();
  }, [router]);

  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    // Title validation
    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = "Project title is required";
    } else if (
      formData.projectTitle.length < 10 ||
      formData.projectTitle.length > 255
    ) {
      newErrors.projectTitle =
        "Project title must be between 10 and 255 characters";
    }

    // Description validation
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = "Project description is required";
    } else if (
      formData.projectDescription.length < 50 ||
      formData.projectDescription.length > 5000
    ) {
      newErrors.projectDescription =
        "Description must be between 50 and 5000 characters";
    }

    // Project type validation
    if (!formData.projectType) {
      newErrors.projectType = "Please select a project type";
    } else if (
      !["System Development", "Research-Based"].includes(formData.projectType)
    ) {
      newErrors.projectType = "Invalid project type";
    }

    // Date validations
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

    // Supervisor validation
    if (!formData.supervisorId) {
      newErrors.supervisorId = "Please select a supervisor";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
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
      const studentInfo = JSON.parse(
        localStorage.getItem("studentInfo") || "{}"
      );

      if (!token || !studentInfo?.userId) {
        showStatus("error", "Authentication required");
        router.push("/login");
        return;
      }

      // Find the selected supervisor to confirm we have the correct ID
      const selectedSupervisor = supervisors.find(
        (sup) => sup.userId === formData.supervisorId
      );

      if (!selectedSupervisor) {
        throw new Error("Invalid supervisor selected");
      }

      const projectData = {
        ...formData,
        supervisorId: selectedSupervisor.userId,
        studentId: studentInfo.username,
        universityId: studentInfo.universityId,
      };

      // Move console.log after projectData is defined
      console.log("Submitting project with data:", projectData);

      const response = await registerProject(projectData, token);

      if (response.success) {
        showStatus("success", "Project registered successfully!");
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
      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {errors[fieldName]}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-10 text-white relative">
      <div className="flex justify-center items-center pb-20">
        <form
          className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-[600px] space-y-6"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-bold text-center pt-4">
            Register Project
          </h1>
          <div className="divider border-gray-700 my-6 mx-auto w-1/2" />

          {/* Project Type */}
          <div>
            <label className="block mb-2" htmlFor="projectType">
              Project Type
            </label>
            <select
              name="projectType"
              id="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-700 border ${
                errors.projectType ? "border-red-500" : "border-gray-600"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="">Select Project Type</option>
              <option value="System Development">System Development</option>
              <option value="Research-Based">Research-Based</option>
            </select>
            {renderError("projectType")}
          </div>

          <div>
            <label className="block mb-2" htmlFor="projectTitle">
              Project Title
            </label>
            <input
              type="text"
              name="projectTitle"
              id="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-700 border ${
                errors.projectTitle ? "border-red-500" : "border-gray-600"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {renderError("projectTitle")}
          </div>

          <div>
            <label className="block mb-2" htmlFor="projectDescription">
              Project Description
            </label>
            <textarea
              name="projectDescription"
              id="projectDescription"
              rows="5"
              value={formData.projectDescription}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-700 border ${
                errors.projectDescription ? "border-red-500" : "border-gray-600"
              } rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            ></textarea>
            {renderError("projectDescription")}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-2" htmlFor="startDate">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-700 border ${
                  errors.startDate ? "border-red-500" : "border-gray-600"
                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {renderError("startDate")}
            </div>
            <div className="w-1/2">
              <label className="block mb-2" htmlFor="endDate">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-700 border ${
                  errors.endDate ? "border-red-500" : "border-gray-600"
                } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {renderError("endDate")}
            </div>
          </div>

          {/* Supervisor Selection */}
          <div>
            <label className="block mb-2" htmlFor="supervisorId">
              Supervisor{" "}
              {loading && <span className="text-gray-400">(Loading...)</span>}
            </label>
            <select
              name="supervisorId"
              id="supervisorId"
              value={formData.supervisorId}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-700 border ${
                errors.supervisorId ? "border-red-500" : "border-gray-600"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              <p className="text-yellow-400 text-sm mt-1">
                No supervisors found for your university
              </p>
            )}
            {renderError("supervisorId")}
          </div>

          {/* Add status message before button */}
          {status.message && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                status.type === "success"
                  ? "bg-green-500/10 text-green-500"
                  : status.type === "error"
                  ? "bg-red-500/10 text-red-500"
                  : "bg-blue-500/10 text-blue-500"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : status.type === "error" ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <p>{status.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 rounded-3xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Project"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
