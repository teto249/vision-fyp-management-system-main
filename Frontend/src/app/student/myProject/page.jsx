'use client';
import { useState } from "react";
import Project from "../components/Project/Project";
import Milestone from "../components/Project/Milestone";

// Simulated backend response
const initialProjectData = {
  title: "AI-Based Student Performance Predictor",
  description:
    "A machine learning system to predict student outcomes based on academic records.",
  startDate: "2025-03-01",
  endDate: "2025-07-30",
  supervisor: "Dr. Sophia Rizwan",
  milestones: [
    {
      id: 1,
      title: "Research & Planning",
      description: "Understand the domain and set up research objectives.",
      tasks: [
        { id: 1, title: "Literature Review", status: "Completed" },
        { id: 2, title: "Problem Statement", status: "Completed" },
        { id: 3, title: "Proposal Draft", status: "In Progress" },
      ],
      meetings: [
        {
          id: 1,
          date: "2025-03-10",
          time: "10:00 AM",
          link: "https://example.com/meeting1",
          purpose: "Discuss research objectives",
        },
      ],
    },
    {
      id: 2,
      title: "Development",
      description: "Build and train the machine learning models.",
      tasks: [
        { id: 4, title: "Data Collection", status: "Pending" },
        { id: 5, title: "Model Training", status: "Pending" },
      ],
      meetings: [
        {
          id: 2,
          date: "2025-04-15",
          time: "2:00 PM",
          link: "https://example.com/meeting2",
          purpose: "Review data collection progress",
        },
      ],
    },
  ],
};

export default function MyProject() {
  const [projectData, setProjectData] = useState(initialProjectData);

  const handleMilestoneUpdate = (updatedMilestones) => {
    setProjectData((prevData) => ({
      ...prevData,
      milestones: updatedMilestones,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center">My Project</h1>

      <Project projectData={projectData} />

      <Milestone
        projectData={projectData}
        onMilestoneUpdate={handleMilestoneUpdate}
        userRole="Supervisor" // Pass user role for permissions
      />
    </div>
  );
}
