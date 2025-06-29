'use client';
import { useState, useEffect } from "react";
import { 
  PlusIcon, 
  TrashIcon, 
  CalendarIcon, 
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  EyeIcon,
  XMarkIcon,
  PencilIcon
} from "@heroicons/react/24/outline";
import { addTask, updateTask, deleteTask } from "../../../../api/StudentApi/Projects";

export default function Task({ tasks = [], onTaskUpdate, milestoneId }) {
  const [newTask, setNewTask] = useState({ 
    title: "", 
    description: "", 
    dueDate: "" 
  });
  const [localTasks, setLocalTasks] = useState(tasks);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [viewingFeedback, setViewingFeedback] = useState({ isOpen: false, taskId: "", feedback: [] });
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", dueDate: "" });

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleAddTask = async () => {
    try {
      setError("");
      
      // Validation
      if (!newTask.title?.trim()) {
        setError("Task title is required");
        return;
      }
      if (newTask.title.trim().length < 3) {
        setError("Task title must be at least 3 characters long");
        return;
      }
      if (!newTask.dueDate) {
        setError("Task deadline is required");
        return;
      }

      // Validate due date is not in the past
      const selectedDate = new Date(newTask.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setError("Due date cannot be in the past");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const taskData = {
        title: newTask.title.trim(),
        description: newTask.description.trim() || '',
        dueDate: newTask.dueDate
      };

      const result = await addTask(milestoneId, taskData, token);

      if (result.success) {
        const updatedTasks = [...localTasks, result.task];
        setLocalTasks(updatedTasks);
        onTaskUpdate(updatedTasks);
        setNewTask({ title: "", description: "", dueDate: "" });
        setIsAdding(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const result = await updateTask(taskId, { status: newStatus }, token);

      if (result.success) {
        const updatedTasks = localTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
        setLocalTasks(updatedTasks);
        onTaskUpdate(updatedTasks);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update task status");
      // Revert the change if it failed
      setLocalTasks([...localTasks]);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const result = await deleteTask(milestoneId, taskId, token);

      if (result.success) {
        const updatedTasks = localTasks.filter((task) => task.id !== taskId);
        setLocalTasks(updatedTasks);
        onTaskUpdate(updatedTasks);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete task");
    }
  };

  const handleViewFeedback = (task) => {
    setViewingFeedback({
      isOpen: true,
      taskId: task.id,
      feedback: task.feedback || []
    });
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setEditForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : task.dueDate
    });
  };

  const handleUpdateTask = async () => {
    try {
      setError("");
      
      // Validation
      if (!editForm.title?.trim()) {
        setError("Task title is required");
        return;
      }
      if (editForm.title.trim().length < 3) {
        setError("Task title must be at least 3 characters long");
        return;
      }
      if (!editForm.dueDate) {
        setError("Task deadline is required");
        return;
      }

      // Validate due date is not in the past
      const selectedDate = new Date(editForm.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setError("Due date cannot be in the past");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const taskData = {
        title: editForm.title.trim(),
        description: editForm.description.trim() || '',
        dueDate: editForm.dueDate
      };

      const result = await updateTask(editingTask, taskData, token);

      if (result.success) {
        const updatedTasks = localTasks.map((task) =>
          task.id === editingTask ? { ...task, ...result.task } : task
        );
        setLocalTasks(updatedTasks);
        onTaskUpdate(updatedTasks);
        setEditingTask(null);
        setEditForm({ title: "", description: "", dueDate: "" });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditForm({ title: "", description: "", dueDate: "" });
    setError("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'In Progress': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'In Progress': return <ClockIcon className="h-4 w-4" />;
      default: return <ExclamationCircleIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <div>
            <h5 className="text-xl font-bold text-gray-100">Tasks</h5>
            <p className="text-sm text-gray-400">
              {localTasks.length === 0 ? 'No tasks yet' : `${localTasks.length} task${localTasks.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 
                     hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl
                     transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Add Task</span>
          </button>
        )}
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-6 
                      rounded-2xl border border-gray-700/50 shadow-2xl space-y-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <PlusIcon className="h-5 w-5 text-white" />
            </div>
            <h6 className="text-xl font-semibold text-gray-100">Create New Task</h6>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 
                          px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
              <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Task Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-3 border border-gray-600/50 bg-gray-700/50 
                         text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition-all duration-200 
                         placeholder-gray-400 shadow-inner"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe the task in detail..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-3 border border-gray-600/50 bg-gray-700/50 
                         text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition-all duration-200 
                         placeholder-gray-400 shadow-inner resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Due Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                    h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={newTask.dueDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setNewTask({ ...newTask, dueDate: e.target.value });
                    if (error && e.target.value) {
                      setError(""); // Clear error when date is selected
                    }
                  }}
                  className="w-full pl-10 p-3 border border-gray-600/50 bg-gray-700/50 
                           text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent transition-all duration-200 shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700/50">
            <button
              onClick={() => {
                setIsAdding(false);
                setError("");
                setNewTask({ title: "", description: "", dueDate: "" });
              }}
              className="px-6 py-2.5 text-gray-300 hover:text-white bg-gray-700/50 
                       hover:bg-gray-600/50 rounded-xl transition-all duration-200 
                       font-medium border border-gray-600/50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              disabled={loading || !newTask.title.trim() || newTask.title.trim().length < 3 || !newTask.dueDate}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 
                       hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 
                       disabled:to-gray-700 text-white px-6 py-2.5 rounded-xl 
                       transition-all duration-200 font-medium shadow-lg 
                       disabled:shadow-none transform hover:scale-105 disabled:scale-100"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" 
                          stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <PlusIcon className="h-5 w-5" />
              )}
              <span>{loading ? 'Creating...' : 'Create Task'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      <div className="space-y-4">
        {localTasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700/50">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationCircleIcon className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No tasks yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first task</p>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                         text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <PlusIcon className="h-4 w-4" />
                Create First Task
              </button>
            )}
          </div>
        ) : (
          localTasks.map((task, index) => (
            <div 
              key={task.id} 
              className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl 
                       rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 
                       transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {editingTask === task.id ? (
                /* Edit Form */
                <div className="space-y-4">
                  <h6 className="text-lg font-semibold text-gray-100 mb-4">Edit Task</h6>
                  
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 
                                  px-4 py-2 rounded-lg flex items-center gap-2">
                      <ExclamationCircleIcon className="h-5 w-5" />
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Title*</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full p-3 border border-gray-600 bg-gray-700/50 
                               text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 
                               focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full p-3 border border-gray-600 bg-gray-700/50 
                               text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 
                               focus:border-transparent transition-all duration-200"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Due Date*</label>
                    <input
                      type="date"
                      value={editForm.dueDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      className="w-full p-3 border border-gray-600 bg-gray-700/50 
                               text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 
                               focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateTask}
                      disabled={loading || !editForm.title.trim() || !editForm.dueDate}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                               disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg 
                               transition-colors duration-200"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" 
                                  stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <PencilIcon className="h-5 w-5" />
                      )}
                      Update Task
                    </button>
                  </div>
                </div>
              ) : (
                /* Task Display */
                <>
                  {/* Task Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h6 className="text-lg font-semibold text-gray-100 mb-1 truncate">{task.title}</h6>
                      <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Due: {new Date(task.endDate || task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span>{task.status}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={`text-xs font-medium border rounded-lg px-3 py-1.5 
                              transition-all duration-200 ${getStatusColor(task.status)}
                              cursor-pointer hover:opacity-80`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  
                  <div className="flex items-center gap-1 transition-opacity duration-200">
                    {task.feedback && task.feedback.length > 0 && (
                      <button
                        onClick={() => handleViewFeedback(task)}
                        className="flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600/40 
                                 text-blue-400 px-3 py-1.5 rounded-lg transition-all duration-200 
                                 hover:scale-105 text-xs font-medium"
                        title="View Feedback"
                      >
                        <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
                        <span>View ({task.feedback.length})</span>
                      </button>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="flex items-center gap-1 bg-yellow-600/20 hover:bg-yellow-600/40 
                                 text-yellow-400 px-3 py-1.5 rounded-lg transition-all duration-200 
                                 hover:scale-105 text-xs font-medium"
                        title="Edit Task"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="flex items-center gap-1 bg-red-600/20 hover:bg-red-600/40 
                                 text-red-400 px-3 py-1.5 rounded-lg transition-all duration-200 
                                 hover:scale-105 text-xs font-medium"
                        title="Delete Task"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Task Description */}
              {task.description && (
                <div className="mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed bg-gray-700/20 p-3 rounded-lg">
                    {task.description}
                  </p>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-400">Progress</span>
                  <span className="text-xs font-medium text-gray-300">
                    {task.status === 'Completed' ? '100%' : task.status === 'In Progress' ? '50%' : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      task.status === 'Completed' ? 'bg-green-500 w-full' : 
                      task.status === 'In Progress' ? 'bg-yellow-500 w-1/2' : 
                      'bg-gray-600 w-0'
                    }`}
                  ></div>
                </div>
              </div>

              {/* Feedback Section */}
              {task.feedback && task.feedback.length > 0 && (
                <div className="border-t border-gray-700/50 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">
                      Feedback ({task.feedback.length})
                    </span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {task.feedback.slice(0, 2).map((feedback, index) => (
                      <div key={feedback.id || index} className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <h6 className="text-sm font-medium text-blue-300">{feedback.title}</h6>
                          <span className="text-xs text-gray-500">
                            {new Date(feedback.date || feedback.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">{feedback.description}</p>
                      </div>
                    ))}
                    {task.feedback.length > 2 && (
                      <button
                        onClick={() => handleViewFeedback(task)}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View all {task.feedback.length} feedback items...
                      </button>
                    )}
                  </div>
                </div>
              )}
              </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Enhanced Feedback Viewing Modal */}
      {viewingFeedback.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl 
                        p-8 rounded-2xl border border-gray-700/50 max-w-2xl w-full shadow-2xl 
                        transform transition-all duration-300 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h6 className="text-xl font-semibold text-gray-100">Task Feedback</h6>
                <p className="text-sm text-gray-400">Supervisor feedback for this task</p>
              </div>
              <button
                onClick={() => setViewingFeedback({ isOpen: false, taskId: "", feedback: [] })}
                className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {viewingFeedback.feedback.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChatBubbleLeftEllipsisIcon className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No feedback yet</h3>
                <p className="text-gray-500">Your supervisor hasn't provided feedback for this task yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {viewingFeedback.feedback.map((feedback, index) => (
                  <div key={feedback.id || index} className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 
                                                           border border-blue-500/20 rounded-xl p-5 hover:border-blue-500/30 
                                                           transition-all duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-blue-300 text-lg">{feedback.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{new Date(feedback.date || feedback.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{feedback.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-700/50">
              <button
                onClick={() => setViewingFeedback({ isOpen: false, taskId: "", feedback: [] })}
                className="px-6 py-2.5 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl 
                         transition-all duration-200 font-medium border border-gray-600/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}