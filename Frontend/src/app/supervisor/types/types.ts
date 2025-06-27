interface Feedback {
  id: string;
  title: string;
  description: string;
  date: string;
  userId?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  startDate: string;
  endDate: string;
  feedback?: Feedback[];
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time?: string;
  link?: string;
  type: "Online" | "Physical";
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  startDate: string;
  endDate: string;
  tasks: Task[];
  meetings: Meeting[];
}

interface University {
  id: string;
  shortName: string;
  fullName: string;
}

interface StudentInfo {
  id: string;
  name: string;
  email: string;
  level: "PSM-1" | "PSM-2";
  department: string;
}

interface Project {
  id: string;
  projectTitle: string;
  projectType: string;
  projectDescription: string;
  status: "Pending" | "In Progress" | "Completed";
  progress: number;
  startDate: string;
  endDate: string;
  student: {
    id: string;
    name: string;
    fullName: string; // Add this
    email: string;
    level: string;
    department: string;
  };
  university?: {
    id: string;
    shortName: string;
    fullName: string;
  };
  milestones: Milestone[];
}

interface Student {
  userId: string;
  fullName: string;
  email: string;
  universityEmail: string;
  level: "PSM-1" | "PSM-2";
  department: string;
  phoneNumber?: string;
  address?: string;
  project?: Project | null; // Allow project to be null if not assigned
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export type {
  Student,
  Project,
  Milestone,
  Task,
  Meeting,
  Feedback,
  University,
  StudentInfo,
  ApiResponse,
};

export interface ProjectUpdate {
  projectTitle?: string;
  projectType?: string;
  projectDescription?: string;
  status?: "Pending" | "In Progress" | "Completed";
  progress?: number;
  startDate?: string;
  endDate?: string;
}
