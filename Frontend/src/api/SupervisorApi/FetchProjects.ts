const API_BASE_URL = "http://localhost:3000/api/supervisor";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  startDate: string;
  endDate: string;
  feedback?: {
    id: string;
    title: string;
    description: string;
    date: string;
  }[];
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
  university: {
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
}

interface SupervisedStudentsResponse {
  success: boolean;
  students?: Student[];
  message?: string;
}

// Fetch all students assigned to supervisor
export const getSupervisionStudents = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const supervisorInfo = JSON.parse(
      localStorage.getItem("supervisorInfo") || "{}"
    );    if (!token || !supervisorInfo?.userId) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.userId}/students`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch students");
    }

    return {
      success: true,
      students: data.students as Student[],
    };
  } catch (error) {
    console.error("Error fetching supervised students:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch students",
    };
  }
};

// Fetch project details for a specific student
export const getStudentProject = async (studentId: string) => {
  try {
    const token = localStorage.getItem("authToken");
    const supervisorInfo = JSON.parse(
      localStorage.getItem("supervisorInfo") || "{}"
    );    if (!token || !supervisorInfo?.userId) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.userId}/students/${studentId}/project`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch project details");
    }

    return {
      success: true,
      project: data.project as Project,
    };
  } catch (error) {
    console.error("Error fetching student project:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch project",
    };
  }
};

// Fetch all projects for supervised students
export const getAllSupervisedProjects = async () => {
  try {
    const studentsResult = await getSupervisionStudents();

    if (!studentsResult.success || !studentsResult.students) {
      throw new Error(studentsResult.message || "Failed to fetch students");
    }

    const projectPromises = studentsResult.students.map((student) =>
      getStudentProject(student.userId)
    );

    const projectResults = await Promise.all(projectPromises);

    const projectsWithDetails = studentsResult.students.map(
      (student, index) => {
        const projectResult = projectResults[index];
        return {
          student: {
            id: student.userId,
            name: student.fullName,
            email: student.email,
            level: student.level,
            department: student.department,
          },
          project: projectResult.success ? projectResult.project : null,
        };
      }
    );

    return {
      success: true,
      projects: projectsWithDetails.filter((p) => p.project !== null),
    };
  } catch (error) {
    console.error("Error fetching all supervised projects:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch projects",
    };
  }
};

// Fetch all projects supervised by the supervisor
export const getSupervisedProjects = async () => {
  try {
    const supervisorInfo = JSON.parse(
      localStorage.getItem("supervisorInfo") || "{}"
    );
    const token = localStorage.getItem("authToken");    if (!supervisorInfo?.userId) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.userId}/projects`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch projects");
    }

    // Transform response to match the format we need
    interface ApiStudent {
      userId: string;
      fullName: string;
      universityEmail: string;
      level: string;
      department: string;
    }

    interface ApiUniversity {
      id: string;
      shortName: string;
      fullName: string;
    }

    interface ApiTask {
      id: string;
      title: string;
      description: string;
      status: "Pending" | "In Progress" | "Completed";
      startDate: string;
      endDate: string;
      feedback?: {
        id: string;
        title: string;
        description: string;
        date: string;
      }[];
    }

    interface ApiMeeting {
      id: string;
      title: string;
      date: string;
      time?: string;
      link?: string;
      type: "Online" | "Physical";
    }

    interface ApiMilestone {
      id: string;
      title: string;
      description: string;
      status: string;
      startDate: string;
      endDate: string;
      tasks?: ApiTask[];
      meetings?: ApiMeeting[];
    }

    interface ApiProject {
      id: string;
      projectTitle: string;
      projectType: string;
      projectDescription: string;
      status: string;
      progress?: number;
      startDate: string;
      endDate: string;
      student: ApiStudent;
      university: ApiUniversity;
      milestones?: ApiMilestone[];
    }

    const transformTask = (task: ApiTask): Task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      startDate: task.startDate,
      endDate: task.endDate,
      feedback: task.feedback || [],
    });

    const transformMilestone = (milestone: ApiMilestone): Milestone => ({
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      status: milestone.status,
      startDate: milestone.startDate,
      endDate: milestone.endDate,
      tasks: milestone.tasks?.map(transformTask) || [],
      meetings: milestone.meetings || [],
    });

    const projects: Project[] = (data.projects as ApiProject[]).map(
      (project): Project => ({
        id: project.id,
        title: project.projectTitle,
        type: project.projectType,
        description: project.projectDescription,
        status: project.status,
        progress: project.progress || 0,
        startDate: project.startDate,
        endDate: project.endDate,
        student: {
          id: project.student.userId,
          name: project.student.fullName,
          email: project.student.universityEmail,
          level: project.student.level,
          department: project.student.department,
        },
        university: {
          id: project.university.id,
          shortName: project.university.shortName,
          fullName: project.university.fullName,
        },
        milestones: project.milestones?.map(transformMilestone) || [],
      })
    );

    return {
      success: true,
      projects,
    };
  } catch (error) {
    console.error("Error fetching supervised projects:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch projects",
    };
  }
};

interface StudentWithProject extends Student {
  project?: Project;
}

export const getSupervisedStudents =
  async (): Promise<SupervisedStudentsResponse> => {
    try {
      const supervisorInfo = JSON.parse(
        localStorage.getItem("supervisorInfo") || "{}"
      );
      const token = localStorage.getItem("authToken");      if (!token || !supervisorInfo?.userId) {
        throw new Error("Authentication required");
      }

      // First fetch students
      const response = await fetch(
        `${API_BASE_URL}/${supervisorInfo.userId}/students-with-projects`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch students");
      }

      // Transform the data to include projects and related data
      const students: StudentWithProject[] = data.students.map(
        (student: any) => ({
          userId: student.userId,
          fullName: student.fullName,
          email: student.email,
          universityEmail: student.universityEmail,
          level: student.level,
          department: student.department,
          phoneNumber: student.phoneNumber,
          address: student.address,
          project: student.project
            ? {
                id: student.project.id,
                title: student.project.title,
                type: student.project.type,
                description: student.project.description,
                status: student.project.status,
                progress: student.project.progress || 0,
                startDate: student.project.startDate,
                endDate: student.project.endDate,
                student: {
                  id: student.userId,
                  name: student.fullName,
                  email: student.email,
                  level: student.level,
                  department: student.department,
                },
                university: student.project.university,
                milestones: (student.project.milestones || []).map(
                  (milestone: any) => ({
                    id: milestone.id || "",
                    title: milestone.title || "",
                    description: milestone.description || "",
                    status: milestone.status || "Pending",
                    startDate: milestone.startDate || "",
                    endDate: milestone.endDate || "",
                    tasks: Array.isArray(milestone?.tasks)
                      ? milestone.tasks.map((task: any) => ({
                          id: task?.id || "",
                          title: task?.title || "",
                          description: task?.description || "",
                          status: task?.status || "Pending",
                          startDate: task?.startDate || "",
                          endDate: task?.endDate || "",
                          feedback: task?.feedback || [],
                        }))
                      : [],
                    meetings: Array.isArray(milestone?.meetings)
                      ? milestone.meetings.map((meeting: any) => ({
                          id: meeting?.id || "",
                          title: meeting?.title || "",
                          date: meeting?.date || "",
                          time: meeting?.time || "",
                          link: meeting?.link || "",
                          type: meeting?.type || "Online",
                        }))
                      : [],
                  })
                ),
              }
            : undefined,
        })
      );

      return {
        success: true,
        students,
      };
    } catch (error) {
      console.error("Error fetching supervised students:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch students",
      };
    }
  };

// Add Feedback API Function
export const addFeedback = async (
  taskId: string,
  feedbackData: {
    title: string;
    description: string;
  }
) => {
  try {
    const token = localStorage.getItem("authToken");
    const supervisorInfo = JSON.parse(
      localStorage.getItem("supervisorInfo") || "{}"
    );

    if (!token || !supervisorInfo?.userId) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.userId}/tasks/${taskId}/feedback`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add feedback");
    }

    return {
      success: true,
      feedback: data.feedback,
    };
  } catch (error) {
    console.error("Error adding feedback:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add feedback",
    };
  }
};

// Update Task Status API Function
export const updateTaskStatus = async (
  taskId: string,
  status: "Pending" | "In Progress" | "Completed"
) => {
  try {
    const token = localStorage.getItem("authToken");
    const supervisorInfo = JSON.parse(
      localStorage.getItem("supervisorInfo") || "{}"
    );

    if (!token || !supervisorInfo?.userId) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.userId}/tasks/${taskId}/status`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update task status");
    }

    return {
      success: true,
      task: data.task,
    };
  } catch (error) {
    console.error("Error updating task status:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update task status",
    };
  }
};

// Add Task API Function (for supervisors to add tasks to milestones)
export const addTask = async (
  milestoneId: string,
  taskData: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }
) => {
  try {
    const token = localStorage.getItem("authToken");
    const supervisorInfo = JSON.parse(
      localStorage.getItem("supervisorInfo") || "{}"
    );

    if (!token || !supervisorInfo?.userId) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.userId}/milestones/${milestoneId}/tasks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add task");
    }

    return {
      success: true,
      task: data.task,
    };
  } catch (error) {
    console.error("Error adding task:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add task",
    };
  }
};

// Delete a task
export const deleteTask = async (taskId: string, token: string) => {
  try {
    const supervisorInfo = JSON.parse(
      localStorage.getItem("supervisorInfo") || "{}"
    );

    if (!token || !supervisorInfo?.userId) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.userId}/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete task");
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete task",
    };
  }
};

// Delete a meeting
export const deleteMeeting = async (meetingId: string, token: string) => {
  try {
    const supervisorInfo = JSON.parse(
      localStorage.getItem("supervisorInfo") || "{}"
    );

    if (!token || !supervisorInfo?.userId) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.userId}/meetings/${meetingId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete meeting");
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete meeting",
    };
  }
};

// Delete a milestone
export const deleteMilestone = async (projectId: string, milestoneId: string, token: string) => {
  try {
    const supervisorInfo = JSON.parse(
      localStorage.getItem("supervisorInfo") || "{}"
    );

    if (!token || !supervisorInfo?.userId) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.userId}/milestones/${milestoneId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete milestone");
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete milestone",
    };
  }
};

// Update a milestone
export const updateMilestone = async (projectId: string, milestoneId: string, milestoneData: any, token: string) => {
  try {
    const supervisorInfo = JSON.parse(
      localStorage.getItem("supervisorInfo") || "{}"
    );

    if (!token || !supervisorInfo?.userId) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.userId}/milestones/${milestoneId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(milestoneData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update milestone");
    }

    return {
      success: true,
      milestone: data.milestone,
      message: data.message,
    };
  } catch (error) {
    console.error("Error updating milestone:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update milestone",
    };
  }
};
