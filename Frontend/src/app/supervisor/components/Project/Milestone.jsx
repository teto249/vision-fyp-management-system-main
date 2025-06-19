"use client";
import { useState, useEffect } from "react";
import Task from "./Task";
import Meeting from "./Meeting";
import {
  addMilestone,
  updateMilestone,
  deleteMilestone,
} from "../../../../api/StudentApi/Projects";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function Milestone({
  projectData,
  projectId,
  onMilestoneUpdate,
  userRole,
}) {
  // Initialize with empty arrays if undefined
  const [milestones, setMilestones] = useState(
    projectData?.milestones?.map((milestone) => ({
      id: milestone.id || '',
      title: milestone.title || '',
      description: milestone.description || '',
      status: milestone.status || 'Pending',
      startDate: milestone.startDate || new Date().toISOString(),
      endDate: milestone.endDate || milestone.dueDate || '', // Fallback to dueDate if available
      tasks: Array.isArray(milestone.tasks) ? milestone.tasks.map(task => ({
        id: task.id || '',
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        dueDate: task.dueDate || ''
      })) : [],
      meetings: Array.isArray(milestone.meetings) ? milestone.meetings : []
    })) || []
  );
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedMilestoneId, setExpandedMilestoneId] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "pending", "completed"
  const [isAdding, setIsAdding] = useState(false);
  const [showMilestones, setShowMilestones] = useState(true);
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  const canEdit = userRole === "Supervisor";

  useEffect(() => {
    if (JSON.stringify(projectData.milestones) !== JSON.stringify(milestones)) {
      setMilestones(projectData.milestones || []);
    }
  }, [projectData.milestones]);

  useEffect(() => {
    console.log('Current milestones state:', milestones);
    console.log('Project data milestones:', projectData?.milestones);
  }, [milestones, projectData]);

  const handleAddMilestone = async () => {
    try {
      // Validate required fields
      if (!newMilestone.title?.trim()) {
        alert("Title is required");
        return;
      }
      if (!newMilestone.description?.trim()) {
        alert("Description is required");
        return;
      }
      if (!newMilestone.dueDate) {
        alert("Due date is required");
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Format the milestone data
      const milestoneData = {
        title: newMilestone.title.trim(),
        description: newMilestone.description.trim(),
        startDate: new Date().toISOString(), // Add start date
        endDate: new Date(newMilestone.dueDate).toISOString(), // Convert dueDate to endDate
        status: "Pending",
      };

      const result = await addMilestone(projectId, milestoneData, token);

      if (result.success && result.milestone) {
        // Ensure proper data structure
        const newMilestoneData = {
          ...result.milestone,
          id: result.milestone.id,
          title: result.milestone.title,
          description: result.milestone.description,
          status: result.milestone.status || "Pending",
          startDate: result.milestone.startDate,
          endDate: result.milestone.endDate,
          tasks: [],
          meetings: []
        };

        const updatedMilestones = [...milestones, newMilestoneData];
        setMilestones(updatedMilestones);
        setNewMilestone({ title: "", description: "", dueDate: "" });
        onMilestoneUpdate(updatedMilestones);
      }
    } catch (error) {
      console.error("Error adding milestone:", error);
      alert(error.message || "Failed to add milestone");
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    try {
      if (!confirm("Are you sure you want to delete this milestone?")) {
        return;
      }

      const token = localStorage.getItem("authToken");
      const result = await deleteMilestone(projectId, milestoneId, token);

      if (result.success) {
        const updatedMilestones = milestones.filter(
          (m) => m.id !== milestoneId
        );
        setMilestones(updatedMilestones);
        onMilestoneUpdate(updatedMilestones);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error deleting milestone:", error);
      alert(error.message || "Failed to delete milestone");
    }
  };

  const handleMilestoneUpdate = (milestoneId, updateData) => {
    const currentMilestones = JSON.parse(JSON.stringify(milestones));

    try {
      // Update local state first
      const updatedMilestones = milestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, ...updateData }
          : milestone
      );

      setMilestones(updatedMilestones);

      // Notify parent with debounce to avoid race conditions
      if (onMilestoneUpdate) {
        setTimeout(() => {
          onMilestoneUpdate(updatedMilestones);
        }, 0);
      }
    } catch (error) {
      // Revert on error
      setMilestones(currentMilestones);
      console.error("Error updating milestone:", error);
      alert(error.message);
    }
  };

  // Update the meeting handler
  const handleMeetingUpdate = (milestoneId, updatedMeetings) => {
    const currentMilestones = JSON.parse(JSON.stringify(milestones));

    try {
      const updatedMilestones = milestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, meetings: updatedMeetings }
          : milestone
      );

      setMilestones(updatedMilestones);
      onMilestoneUpdate(updatedMilestones);
    } catch (error) {
      setMilestones(currentMilestones);
      console.error("Error updating meetings:", error);
      alert(error.message);
    }
  };

  // Update the task handler similarly
  const handleTaskUpdate = (milestoneId, updatedTasks) => {
    const currentMilestones = JSON.parse(JSON.stringify(milestones));

    try {
      const updatedMilestones = milestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, tasks: updatedTasks }
          : milestone
      );

      setMilestones(updatedMilestones);
      onMilestoneUpdate(updatedMilestones);
    } catch (error) {
      setMilestones(currentMilestones);
      console.error("Error updating tasks:", error);
      alert(error.message);
    }
  };

  const handleEditMilestone = (milestone) => {
    setEditingMilestone(milestone.id);
    setEditForm({
      title: milestone.title,
      description: milestone.description,
      dueDate: milestone.dueDate.split("T")[0],
    });
  };

  const handleUpdateMilestone = async (id) => {
    try {
      const token = localStorage.getItem("authToken");

      const updateData = {
        ...editForm,
        startDate: new Date().toISOString(),
        endDate: new Date(editForm.dueDate).toISOString(),
      };

      const result = await updateMilestone(projectId, id, updateData, token);

      if (result.success) {
        const updatedMilestones = milestones.map((milestone) =>
          milestone.id === id
            ? { ...milestone, ...result.milestone }
            : milestone
        );
        setMilestones(updatedMilestones);
        onMilestoneUpdate(updatedMilestones);
        setEditingMilestone(null);
        setEditForm({ title: "", description: "", dueDate: "" });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
      alert(error.message || "Failed to update milestone");
    }
  };

  const handleCancelEdit = () => {
    setEditingMilestone(null);
    setEditForm({ title: "", description: "", dueDate: "" });
  };

  const handleAddTask = async (milestoneId, taskData) => {
    try {
      const token = localStorage.getItem("authToken");
      const result = await addTask(milestoneId, taskData, token);

      if (result.success) {
        const updatedMilestones = milestones.map((milestone) =>
          milestone.id === milestoneId
            ? { ...milestone, tasks: [...milestone.tasks, result.task] }
            : milestone
        );
        setMilestones(updatedMilestones);
        onMilestoneUpdate(updatedMilestones);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  function toggleShowAddMilestone() {
    setShowAddMilestone((prev) => !prev);
  }

  // const handleAddMeeting = async (milestoneId, meetingData) => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const result = await addMeeting(milestoneId, meetingData, token);

  //     if (result.success) {
  //       const updatedMilestones = milestones.map((milestone) =>
  //         milestone.id === milestoneId
  //           ? { ...milestone, meetings: [...milestone.meetings, result.meeting] }
  //           : milestone
  //       );
  //       setMilestones(updatedMilestones);
  //       onMilestoneUpdate(updatedMilestones);
  //     } else {
  //       throw new Error(result.message);
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  const getMilestoneProgress = (milestone) => {
    const totalTasks = milestone.tasks.length;
    if (totalTasks === 0) return 0;

    const completedTasks = milestone.tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    return Math.round((completedTasks / totalTasks) * 100);
  };

  const getMilestoneStatus = (milestone) => {
    const progress = getMilestoneProgress(milestone);
    if (progress === 100) return "Completed";
    if (progress === 0) return "Not Started";
    return "In Progress";
  };

  const getFilteredMilestones = () => {
    if (filter === "all") return milestones;

    return milestones.filter((milestone) => {
      const status = getMilestoneStatus(milestone);
      if (filter === "completed") return status === "Completed";
      if (filter === "pending") return status !== "Completed";
      return true;
    });
  };

  // Add these new styles and animations
  const styles = {
    container: `max-w-7xl mx-auto`,
    header: `sticky top-0 z-10 backdrop-blur-md bg-gray-900/80 p-4 rounded-lg mb-6`,
    milestoneCard: `
    group hover:shadow-lg hover:shadow-blue-500/10 
    transform transition-all duration-300 ease-in-out
    hover:-translate-y-1
  `,
    progressBar: `
    h-2 rounded-full bg-gray-700 overflow-hidden 
    transition-all duration-500 ease-out
  `,
    addButton: `
    group relative inline-flex items-center gap-2 
    bg-gradient-to-r from-blue-600 to-blue-700
    hover:from-blue-500 hover:to-blue-600
    text-white px-6 py-2.5 rounded-lg
    transition-all duration-300 ease-in-out
    shadow-lg hover:shadow-blue-500/25
  `,
  };

  return (
    <section className={styles.container}>
      {/* Enhanced Header */}
      <div className={styles.header}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Project Milestones
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="px-3 py-1 rounded-full bg-gray-800">
                {milestones.length} Total
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-800">
                {
                  milestones.filter(
                    (m) => getMilestoneStatus(m) === "Completed"
                  ).length
                }{" "}
                Completed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg border border-gray-700
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
            >
              <option value="all">All Milestones</option>
              <option value="pending">In Progress</option>
              <option value="completed">Completed</option>
            </select>

          
              <button
                onClick={toggleShowAddMilestone}
                className={styles.addButton}
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Milestone</span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 
                           scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>
           
          </div>
        </div>
      </div>

      {/* Add this form section after your header controls */}
      {showAddMilestone && (
        <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 mb-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-white">Create New Milestone</h4>
            <button
              onClick={() => setShowAddMilestone(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Title*</label>
              <input
                type="text"
                placeholder="Milestone Title"
                value={newMilestone.title}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, title: e.target.value })
                }
                className="w-full p-2 bg-gray-700/50 border border-gray-600 
                         text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Due Date*</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) =>
                    setNewMilestone({ ...newMilestone, dueDate: e.target.value })
                  }
                  className="w-full pl-10 p-2 bg-gray-700/50 border border-gray-600 
                           text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm text-gray-400">Description*</label>
              <textarea
                placeholder="Milestone Description"
                value={newMilestone.description}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, description: e.target.value })
                }
                rows="3"
                className="w-full p-2 bg-gray-700/50 border border-gray-600 
                         text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setShowAddMilestone(false);
                setNewMilestone({ title: "", description: "", dueDate: "" });
              }}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMilestone}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                       disabled:bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <PlusIcon className="h-5 w-5" />
              )}
              Create Milestone
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Milestone Cards */}
      <div className="space-y-6">
        {getFilteredMilestones().map((milestone) => (
          <div
            key={milestone.id}
            className={`${styles.milestoneCard} bg-gray-800/50 backdrop-blur rounded-xl p-6 
                    border border-gray-700`}
          >
            {/* Progress Bar */}
            <div className={styles.progressBar}>
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${getMilestoneProgress(milestone)}%` }}
              />
            </div>

            {/* Rest of the milestone card content */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-100">
                  {milestone.title}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      Due: {milestone.endDate 
                        ? new Date(milestone.endDate).toLocaleDateString()
                        : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    <span>Status: {milestone.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    <span>Progress: {getMilestoneProgress(milestone)}%</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  setExpandedMilestoneId(
                    expandedMilestoneId === milestone.id ? null : milestone.id
                  )
                }
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                {expandedMilestoneId === milestone.id ? (
                  <ChevronUpIcon className="h-6 w-6" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6" />
                )}
              </button>
            </div>

            <div
              className={
                expandedMilestoneId === milestone.id ? "block" : "hidden"
              }
            >
              <p className="text-gray-400 mb-6">{milestone.description}</p>

              <div className="space-y-6">
                <Task
                  tasks={milestone.tasks}
                  milestoneId={milestone.id}
                  onTaskUpdate={(updatedTasks) =>
                    handleTaskUpdate(milestone.id, updatedTasks)
                  }
                />
                <Meeting
                  meetings={milestone.meetings}
                  milestoneId={milestone.id}
                  onMeetingUpdate={(updatedMeetings) =>
                    handleMeetingUpdate(milestone.id, updatedMeetings)
                  }
                />
              </div>

              {canEdit && (
                <div className="flex gap-2 mt-6 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleEditMilestone(milestone)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white 
                               px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMilestone(milestone.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white 
                               px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {getFilteredMilestones().length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <ExclamationCircleIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg">No milestones found</p>
            <p className="text-sm mt-1">
              {filter !== "all"
                ? "Try changing the filter to see more milestones"
                : "Create your first milestone to get started"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
