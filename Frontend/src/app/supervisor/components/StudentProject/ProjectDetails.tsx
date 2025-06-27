"use client";

import {
  ClipboardDocumentListIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import type { Project } from "../../types/types";

interface ProjectDetailsProps {
  project?: Project;
}

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ElementType;
  color: "blue" | "green" | "purple" | "yellow";
};

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const bgColorClass = `bg-${color}-500/10`;
  const textColorClass = `text-${color}-500`;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50">
      <div className={`p-2 rounded-lg ${bgColorClass}`}>
        <Icon className={`h-5 w-5 ${textColorClass}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {

  if (!project) {
    return (
      <div className="text-center py-4 text-gray-400">
        <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No project assigned yet</p>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    tasks: {
      total: project.milestones?.reduce((sum, m) => sum + (m.tasks?.length || 0), 0) || 0,
      completed: project.milestones?.reduce(
        (sum, m) => sum + (m.tasks?.filter(t => t.status === "Completed").length || 0), 0
      ) || 0
    },
    meetings: project.milestones?.reduce(
      (sum, m) => sum + (m.meetings?.length || 0), 0
    ) || 0,
    milestones: project.milestones?.length || 0
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Progress"
          value={`${project.progress}%`}
          icon={ChartBarIcon}
          color="blue"
        />
        <StatCard
          label="Tasks"
          value={`${stats.tasks.completed}/${stats.tasks.total}`}
          icon={ClipboardDocumentListIcon}
          color="green"
        />
        <StatCard
          label="Milestones"
          value={stats.milestones.toString()}
          icon={CheckCircleIcon}
          color="purple"
        />
        <StatCard
          label="Meetings"
          value={stats.meetings.toString()}
          icon={CalendarIcon}
          color="yellow"
        />
      </div>

      <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-3 min-w-0">
         
          <h3 className="text-sm font-medium text-gray-300 truncate">
            {project.projectTitle}
          </h3>
        </div>
        <span className="text-sm text-gray-400 shrink-0">
          Due: {new Date(project.endDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}