'use client';
import { useState, useEffect } from "react";
import { 
  PlusIcon, 
  TrashIcon, 
  CalendarIcon, 
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon 
} from "@heroicons/react/24/outline";
import { addTask } from "../../../../api/StudentApi/Projects";

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
      if (!newTask.dueDate) {
        setError("Task deadline is required");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const taskData = {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        startDate: new Date().toISOString(),
        endDate: newTask.dueDate
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
      console.error("Error adding task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = localTasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setLocalTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
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
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h5 className="text-lg font-semibold text-gray-200">Tasks</h5>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                     text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Task
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700 space-y-4">
          <h6 className="text-gray-200 font-medium mb-4">New Task Details</h6>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 
                          px-4 py-2 rounded-lg flex items-center gap-2">
              <ExclamationCircleIcon className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title*</label>
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-2 border border-gray-600 bg-gray-700/50 
                         text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                placeholder="Task description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-2 border border-gray-600 bg-gray-700/50 
                         text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition-all duration-200"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Due Date*</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                    h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full pl-10 p-2 border border-gray-600 bg-gray-700/50 
                           text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setIsAdding(false);
                setError("");
                setNewTask({ title: "", description: "", dueDate: "" });
              }}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                       disabled:bg-gray-600 text-white px-6 py-2 rounded-lg 
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
                <PlusIcon className="h-5 w-5" />
              )}
              Add Task
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {localTasks.map((task) => (
          <div 
            key={task.id} 
            className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border 
                     border-gray-700 hover:border-gray-600 transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <h6 className="text-gray-100 font-medium flex-1">{task.title}</h6>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className={`ml-4 text-sm border rounded-full px-3 py-1 
                          transition-colors duration-200 ${getStatusColor(task.status)}`}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            {task.description && (
              <p className="text-gray-400 text-sm mb-3">{task.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <CalendarIcon className="h-4 w-4" />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              
              <div className={`flex items-center gap-2 ${getStatusColor(task.status)}`}>
                {getStatusIcon(task.status)}
                <span>{task.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {localTasks.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-400">
          <CheckCircleIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No tasks created yet</p>
        </div>
      )}
    </div>
  );
}