'use client';
import { useState, useEffect } from "react";
import Task from "./Task";
import Meeting from "./Meeting";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Milestone({ projectData, onMilestoneUpdate, userRole }) {
  const [milestones, setMilestones] = useState(projectData.milestones || []);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const canEdit = userRole === "Supervisor";

  useEffect(() => {
    setMilestones(projectData.milestones || []);
  }, [projectData]);

  const handleAddMilestone = () => {
    if (!newMilestone.title.trim()) {
      alert("Milestone title is required.");
      return;
    }
    const updatedMilestones = [
      ...milestones,
      {
        id: Date.now(),
        ...newMilestone,
        tasks: [],
        meetings: [],
      },
    ];
    setMilestones(updatedMilestones);
    onMilestoneUpdate(updatedMilestones);
    setNewMilestone({ title: "", description: "", dueDate: "" });
  };

  const handleTaskUpdate = (milestoneId, updatedTasks) => {
    const updatedMilestones = milestones.map((milestone) =>
      milestone.id === milestoneId ? { ...milestone, tasks: updatedTasks } : milestone
    );
    setMilestones(updatedMilestones);
    onMilestoneUpdate(updatedMilestones);
  };

  const handleMeetingUpdate = (milestoneId, updatedMeetings) => {
    const updatedMilestones = milestones.map((milestone) =>
      milestone.id === milestoneId ? { ...milestone, meetings: updatedMeetings } : milestone
    );
    setMilestones(updatedMilestones);
    onMilestoneUpdate(updatedMilestones);
  };

  return (
    <section className="mb-8">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
        <h4 className="text-lg font-medium text-white mb-2">Create New Milestone</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <input
            type="text"
            placeholder="Milestone Title"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newMilestone.description}
            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={newMilestone.dueDate}
            onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handleAddMilestone}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <PlusIcon className="h-4 w-4" />
          Add Milestone
        </button>
      </div>

      <div className="space-y-6">
        {milestones.map((milestone) => {
          const earliestDeadline = milestone.tasks
            .filter((task) => task.dueDate)
            .map((task) => new Date(task.dueDate))
            .sort((a, b) => a - b)[0];

          return (
            <div key={milestone.id} className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-gray-100">{milestone.title}</h3>
              <p className="text-gray-400 mt-1">{milestone.description}</p>
              {earliestDeadline && (
                <p className="text-gray-400">
                  Earliest Deadline: {earliestDeadline.toLocaleDateString()}
                </p>
              )}
              <Task
                tasks={milestone.tasks}
                onTaskUpdate={(updatedTasks) => handleTaskUpdate(milestone.id, updatedTasks)}
              />
              <Meeting
                meetings={milestone.meetings}
                onMeetingUpdate={(updatedMeetings) => handleMeetingUpdate(milestone.id, updatedMeetings)}
              />
              {canEdit && (
                <button onClick={() => handleAddTask(milestone.id)}>Add Task</button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}