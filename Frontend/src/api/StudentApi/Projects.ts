const API_BASE_URL = "http://localhost:3000/api/student";

// Keep only relevant interfaces
export interface Project {
  universityId: string;
  projectId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  supervisorId: string;
  studentId: string;
}

export enum ProjectStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

// Simplified Milestone interface without tasks and meetings
export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface ProjectDetails {
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
  };
  supervisor: {
    id: string;
    name: string;
    department: string;
  };
  university: {
    id: string;
    shortName: string;
    fullName: string;
  };
  milestones: Milestone[];
}

export interface ProjectResponse {
  success: boolean;
  project: ProjectDetails;
}

export interface MilestoneData {
  title: string;
  description: string;
  dueDate: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface MilestoneResponse {
  success: boolean;
  milestone?: {
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

// Transform project data from API response
const transformProjectData = (projectData) => ({
  id: projectData?.id,
  projectTitle: projectData?.title,
  projectDescription: projectData?.description,
  projectType: projectData?.type,
  status: projectData?.status,
  progress: projectData?.progress || 0,
  startDate: projectData?.startDate,
  endDate: projectData?.endDate,
  supervisor: {
    id: projectData?.supervisor?.id || '',
    name: projectData?.supervisor?.name || 'Not assigned',
    department: projectData?.supervisor?.department || 'Not set'
  },
  university: {
    id: projectData?.university?.id || '',
    shortName: projectData?.university?.shortName || '',
    fullName: projectData?.university?.fullName || ''
  },
  milestones: Array.isArray(projectData?.milestones) ? projectData.milestones.map(milestone => ({
    ...milestone,
    id: milestone?.id || '',
    title: milestone?.title || '',
    description: milestone?.description || '',
    status: milestone?.status || 'Pending',
    tasks: Array.isArray(milestone?.tasks) ? milestone.tasks.map(task => ({
      id: task?.id || '',
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate || '',
      status: task?.status || 'Pending'
    })) : [],
    meetings: Array.isArray(milestone?.meetings) ? milestone.meetings.map(meeting => ({
      id: meeting?.id || '',
      purpose: meeting?.purpose || '',
      date: meeting?.date || '',
      time: meeting?.time || '',
      link: meeting?.link || ''
    })) : []
  })) : []
});

// Get project by student ID
export const getProjectById = async (studentId: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/project/${studentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch project details");
    }

    return {
      success: true,
      project: transformProjectData(data.project),
    };
  } catch (error) {
    console.error("Project fetch error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch project",
    };
  }
};

// Add milestone
export const addMilestone = async (
  projectId: string, 
  milestoneData: MilestoneData, 
  token: string
): Promise<MilestoneResponse> => {
  try {
    if (!milestoneData.title?.trim()) {
      throw new Error("Title is required");
    }
    if (!milestoneData.description?.trim()) {
      throw new Error("Description is required");
    }
    if (!milestoneData.dueDate) {
      throw new Error("Due date is required");
    }

    const payload = {
      title: milestoneData.title.trim(),
      description: milestoneData.description.trim(),
      startDate: new Date().toISOString().split('T')[0],
      endDate: milestoneData.dueDate,
      status: 'Pending'
    };

    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/milestones`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add milestone');
    }

    return {
      success: true,
      milestone: {
        id: data.milestone.id,
        title: data.milestone.title,
        description: data.milestone.description,
        status: data.milestone.status,
        startDate: data.milestone.startDate,
        endDate: data.milestone.endDate,
        createdAt: data.milestone.createdAt,
        updatedAt: data.milestone.updatedAt
      }
    };

  } catch (error) {
    console.error('Error in addMilestone:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add milestone'
    };
  }
};

// Update project milestones
export const updateProjectMilestones = async (projectId: string, milestones: Milestone[], token: string) => {
  try {
    if (!Array.isArray(milestones)) {
      throw new Error("Invalid milestones format");
    }

    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/milestones`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ milestones }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update milestones");
    }

    return {
      success: true,
      project: transformProjectData(data.project),
    };
  } catch (error) {
    console.error("Milestone update error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update milestones",
    };
  }
};

// Add task to milestone
export const addTask = async (
  milestoneId: string,
  taskData: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  },
  token: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/milestones/${milestoneId}/tasks`, // Changed from milestone to milestones
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add task');
    }

    return {
      success: true,
      task: data.task
    };
  } catch (error) {
    console.error('Error in addTask:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add task'
    };
  }
};

// Add meeting to milestone
export const addMeeting = async (
  milestoneId: string,
  meetingData: {
    title: string;
    date: string;
    time: string;
    link?: string;
    type?: 'Online' | 'Physical';
  },
  token: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/milestones/${milestoneId}/meetings`, // Changed from milestone to milestones
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(meetingData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add meeting');
    }

    return {
      success: true,
      meeting: data.meeting
    };
  } catch (error) {
    console.error('Error in addMeeting:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add meeting'
    };
  }
};

// Check authentication status
export const checkAuth = () => {
  const token = localStorage.getItem("authToken");
  const userInfo = JSON.parse(localStorage.getItem("studentInfo") || "{}");

  if (!token || !userInfo?.userId) {
    throw new Error("Authentication required");
  }

  return { token, userInfo };
};

