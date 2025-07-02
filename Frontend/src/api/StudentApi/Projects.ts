const API_BASE_URL = "http://localhost:5000/api/student";

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

// Feedback interface for tasks
export interface Feedback {
  id: string;
  title: string;
  description: string;
  date: string;
}

// Task interface with feedback
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  endDate: string; // Keep for compatibility
  status: string;
  feedback?: Feedback[];
}

// Meeting interface
export interface Meeting {
  id: string;
  title: string;
  purpose: string; // For backward compatibility
  date: string;
  time: string;
  link?: string;
  type: 'Online' | 'Physical';
}

// Complete Milestone interface with tasks and meetings
export interface MilestoneWithTasks {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
  meetings: Meeting[];
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
  milestones: MilestoneWithTasks[];
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
const transformProjectData = (projectData: any) => ({
  id: projectData?.id,
  title: projectData?.title, // Changed from projectTitle to title to match interface
  description: projectData?.description, // Changed from projectDescription to description
  type: projectData?.type, // Changed from projectType to type
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
  milestones: Array.isArray(projectData?.milestones) ? projectData.milestones.map((milestone: any) => ({
    ...milestone,
    id: milestone?.id || '',
    title: milestone?.title || '',
    description: milestone?.description || '',
    status: milestone?.status || 'Pending',
    tasks: Array.isArray(milestone?.tasks) ? milestone.tasks.map((task: any) => ({
      id: task?.id || '',
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.endDate || task?.dueDate || '', // Handle both endDate and dueDate
      endDate: task?.endDate || task?.dueDate || '', // Keep endDate for compatibility
      status: task?.status || 'Pending',
      feedback: Array.isArray(task?.feedback) ? task.feedback.map((feedback: any) => ({
        id: feedback?.id || '',
        title: feedback?.title || '',
        description: feedback?.description || '',
        date: feedback?.date || feedback?.createdAt || ''
      })) : []
    })) : [],
    meetings: Array.isArray(milestone?.meetings) ? milestone.meetings.map((meeting: any) => ({
      id: meeting?.id || '',
      title: meeting?.title || '',
      purpose: meeting?.title || meeting?.purpose || '', // Map title to purpose for backward compatibility
      date: meeting?.date || '',
      time: meeting?.time || '',
      link: meeting?.link || '',
      type: meeting?.type || 'Online'
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

// Add milestone - Make sure this is properly exported
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
      dueDate: milestoneData.dueDate, // Send as dueDate for backend compatibility
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
    description?: string;
    dueDate: string;
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

// Add this function to handle task updates
export const updateTask = async (taskId: string, taskData: {
  status: "Pending" | "In Progress" | "Completed";
}, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update task');
    }

    return {
      success: true,
      task: data.task
    };
  } catch (error) {
    console.error('Error updating task:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update task'
    };
  }
};

// Check authentication status - Add proper typing
export const checkAuth = (): { token: string; userInfo: any } => {
  try {
    const token = localStorage.getItem("authToken");
    const userInfoString = localStorage.getItem("studentInfo");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    if (!userInfoString) {
      throw new Error("No user information found");
    }
    
    const userInfo = JSON.parse(userInfoString);
    
    if (!userInfo?.userId && !userInfo?.username) {
      throw new Error("Invalid user information");
    }

    return { token, userInfo };
  } catch (error) {
    console.error("Authentication check failed:", error);
    throw new Error("Authentication required");
  }
};

// Add registerProject function
export const registerProject = async (projectData: any, token: string) => {
  try {

    
    
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error("This function can only be called from the browser");
    }

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

   
    
    // Handle different response scenarios
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse response as JSON:", jsonError);
      throw new Error(`Server returned invalid JSON. Status: ${response.status}`);
    }

 
    
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: data,
      message: data.message || "Project registered successfully"
    };
  } catch (error) {
    console.error("Project registration error:", error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: "Request timed out. Please check if the server is running and try again."
        };
      }
      
      if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        return {
          success: false,
          message: `Unable to connect to server at ${API_BASE_URL}. Please ensure the backend server is running on port 3000.`
        };
      }
      
      if (error.message.includes('CORS')) {
        return {
          success: false,
          message: "Server configuration error. Please contact support."
        };
      }

      return {
        success: false,
        message: error.message || "Failed to register project"
      };
    }

    return {
      success: false,
      message: "Failed to register project"
    };
  }
};

// Update milestone
export const updateMilestone = async (
  projectId: string,
  milestoneId: string,
  milestoneData: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status?: string;
  },
  token: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/milestones/${milestoneId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(milestoneData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update milestone');
    }

    return {
      success: true,
      milestone: data.milestone
    };
  } catch (error) {
    console.error('Error in updateMilestone:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update milestone'
    };
  }
};

// Delete milestone
export const deleteMilestone = async (
  projectId: string,
  milestoneId: string,
  token: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/project/${projectId}/milestones/${milestoneId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete milestone');
    }

    return {
      success: true,
      message: data.message
    };
  } catch (error) {
    console.error('Error in deleteMilestone:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete milestone'
    };
  }
};

// Delete task
export const deleteTask = async (
  milestoneId: string,
  taskId: string,
  token: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/milestones/${milestoneId}/tasks/${taskId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete task');
    }

    return {
      success: true,
      message: data.message
    };
  } catch (error) {
    console.error('Error in deleteTask:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete task'
    };
  }
};

// Update meeting
export const updateMeeting = async (
  milestoneId: string,
  meetingId: string,
  meetingData: {
    title: string;
    date: string;
    link?: string;
    type?: 'Online' | 'Physical';
  },
  token: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/milestones/${milestoneId}/meetings/${meetingId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(meetingData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update meeting');
    }

    return {
      success: true,
      meeting: data.meeting
    };
  } catch (error) {
    console.error('Error in updateMeeting:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update meeting'
    };
  }
};

// Delete meeting
export const deleteMeeting = async (
  milestoneId: string,
  meetingId: string,
  token: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/milestones/${milestoneId}/meetings/${meetingId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete meeting');
    }

    return {
      success: true,
      message: data.message
    };
  } catch (error) {
    console.error('Error in deleteMeeting:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete meeting'
    };
  }
};

// Keep default export for compatibility
const studentProjectsAPI = {
  getProjectById,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  updateProjectMilestones,
  addTask,
  updateTask,
  deleteTask,
  addMeeting,
  updateMeeting,
  deleteMeeting,
  checkAuth,
  registerProject
};

export default studentProjectsAPI;

