interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  feedback: any[];
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  link?: string;
  type: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
  meetings: Meeting[];
}

interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  student: {
    id: string;
    name: string;
    email: string;
    level: string;
    department: string;
  };
  university: any;
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
  project?: Project;
}

export type { Student, Project, Milestone, Task, Meeting };