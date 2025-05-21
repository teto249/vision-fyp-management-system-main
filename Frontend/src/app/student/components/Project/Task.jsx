'use client';
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon } from "@heroicons/react/24/outline";

export default function Task({ tasks, onTaskUpdate }) {
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      alert("Task title is required.");
      return;
    }
    if (!newTask.dueDate) {
      alert("Task deadline is required.");
      return;
    }
    const updatedTasks = [
      ...tasks,
      { id: uuidv4(), ...newTask, status: "Pending" },
    ];
    onTaskUpdate(updatedTasks);
    setNewTask({ title: "", description: "", dueDate: "" });
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    onTaskUpdate(updatedTasks);
  };

  return (
    <div className="mt-4">
      <h5 className="font-medium text-gray-300 mb-3">Tasks</h5>
      {tasks.map((task) => (
        <div key={task.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-2">
          <h5 className="font-medium text-gray-100">{task.title}</h5>
          <p className="text-gray-400">{task.description}</p>
          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Deadline: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task.id, e.target.value)}
            className="text-xs border border-gray-600 bg-gray-800 text-gray-100 rounded px-2 py-1"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      ))}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full p-2 border border-gray-600 bg-gray-800 text-gray-100 rounded mb-2"
        />
        <textarea
          placeholder="Task description (optional)"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full p-2 border border-gray-600 bg-gray-800 text-gray-100 rounded mb-2"
          rows="2"
        />
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="p-2 border border-gray-600 bg-gray-800 text-gray-100 rounded"
          />
        </div>
        <button
          onClick={handleAddTask}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
        >
          <PlusIcon className="h-4 w-4" />
          Add Task
        </button>
      </div>
    </div>
  );
}