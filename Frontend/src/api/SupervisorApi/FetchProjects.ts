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
    );

    if (!token || !supervisorInfo?.username) {
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
    );

    if (!token || !supervisorInfo?.username) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.username}/students/${studentId}/project`,
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
    const token = localStorage.getItem("authToken");

    if (!supervisorInfo?.username) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.username}/projects`,
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
        milestones:
          project.milestones?.map(
            (milestone): Milestone => ({
              id: milestone.id,
              title: milestone.title,
              description: milestone.description,
              status: milestone.status,
              startDate: milestone.startDate,
              endDate: milestone.endDate,
              tasks: milestone.tasks || [],
              meetings: milestone.meetings || [],
            })
          ) || [],
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

export const getSupervisedStudents = async (): Promise<SupervisedStudentsResponse> => {
  try {
    const supervisorInfo = JSON.parse(localStorage.getItem('supervisorInfo') || '{}');
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Authentication required');
    }

    // First fetch students
    const response = await fetch(
      `${API_BASE_URL}/${supervisorInfo.username}/students-with-projects`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch students');
    }

    // Transform the data to include projects and related data
    const students: StudentWithProject[] = data.students.map((student: any) => ({
      userId: student.userId,
      fullName: student.fullName,
      email: student.email,
      universityEmail: student.universityEmail,
      level: student.level,
      department: student.department,
      phoneNumber: student.phoneNumber,
      address: student.address,
      project: student.project ? {
        id: student.project.id,
        title: student.project.title, // fixed field name
        type: student.project.type,   // fixed field name
        description: student.project.description, // fixed field name
        status: student.project.status,
        progress: student.project.progress || 0,
        startDate: student.project.startDate,
        endDate: student.project.endDate,
        university: student.project.university,
        milestones: (student.project.milestones || []).map((milestone: any) => ({
          id: milestone.id || '',
          title: milestone.title || '',
          description: milestone.description || '',
          status: milestone.status || 'Pending',
          startDate: milestone.startDate || '',
          endDate: milestone.endDate || '',
          tasks: [],  // Initialize as empty array since no task data in source
          meetings: [] // Initialize as empty array since no meeting data in source
        }))
      } : undefined
    }));


    return {
      success: true,
      students
    };

  } catch (error) {
    console.error('Error fetching supervised students:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch students'
    };
  }
};
