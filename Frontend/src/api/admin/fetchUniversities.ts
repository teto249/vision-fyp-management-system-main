const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface UniversityAdmin {
  username: string; // Added username field
  name: string;
  email: string;
  phone: string;
}

export interface UniversityDetail {
  id: string;
  shortName: string;
  name: string;
  address: string;
  contactEmail: string;
  phone: string;
  maxStudents: number;
  maxSupervisors: number;
  description: string | null;
  status: string; // Added status field
  logoPath: string | null; // Added logoPath field
  adminDetails: UniversityAdmin;
}

// For the list view, we can use a simpler interface
export interface University {
  id: string;
  shortName: string;
  name: string;
  description: string | null;
  address: string;
  contactEmail: string;
  phone: string;
  maxStudents: number;
  maxSupervisors: number;
  status: string; // Added status field
  logoPath: string | null; // Added logoPath field
  adminDetails: UniversityAdmin;
}

export interface UniversityStatistics {
  totalStudents: number;
  totalSupervisors: number;
  totalAdmins: number;
  activeProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  pendingProjects: number;
  totalProjects: number;
  utilizationRate: number;
  studentUtilization: number;
  supervisorUtilization: number;
  capacity: {
    maxStudents: number;
    maxSupervisors: number;
    remainingStudentSlots: number;
    remainingSupervisorSlots: number;
  };
}

export interface UniversityMember {
  id: string;
  name: string;
  email: string;
  universityEmail?: string;
  phone?: string;
  department?: string;
  level?: string; // For students
  officeAddress?: string; // For supervisors
  profilePhoto?: string;
  joinedAt: string;
  role: 'Student' | 'Supervisor' | 'University Admin';
}

export interface UniversityMembers {
  students?: {
    data: UniversityMember[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  supervisors?: {
    data: UniversityMember[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  admins?: {
    data: UniversityMember[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchUniversities(): Promise<University[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/universities`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch universities");
    }

    const data = await response.json();
    return data.map((university: any) => ({
      ...university,
      adminDetails: university.adminDetails || {
        username: "",
        name: "",
        email: "",
        phone: "",
      },
    }));
  } catch (error) {
    console.error("Error fetching universities:", error);
    throw error;
  }
}

export async function fetchUniversityById(
  id: string
): Promise<UniversityDetail> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/universities/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch university details");
    }

    const data = await response.json();
    
    return {
      ...data,
      adminDetails: data.adminDetails || {
        username: "",
        name: "",
        email: "",
        phone: "",
      },
    };
  } catch (error) {
    console.error("Error fetching university details:", error);
    throw error;
  }
}

export async function fetchUniversityStatistics(id: string): Promise<UniversityStatistics> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/universities/${id}/statistics`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch university statistics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching university statistics:", error);
    throw error;
  }
}

export async function fetchUniversityMembers(
  id: string, 
  type: 'all' | 'students' | 'supervisors' | 'admins' = 'all',
  page: number = 1,
  limit: number = 10
): Promise<UniversityMembers> {
  try {
    const params = new URLSearchParams({
      type,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/universities/${id}/members?${params}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch university members: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching university members:", error);
    throw error;
  }
}

export interface DeleteUniversityResponse {
  success: boolean;
  message: string;
  deletedUniversity?: {
    id: string;
    name: string;
  };
  deletedData?: {
    university: string;
    students: number;
    supervisors: number;
    administrators: number;
    projects: number;
  };
  details?: {
    students: number;
    supervisors: number;
    administrators: number;
  };
  error?: string;
}

export async function deleteUniversity(universityId: string): Promise<DeleteUniversityResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/universities/${universityId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to delete university: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error("Error deleting university:", error);
    throw error;
  }
}

export async function forceDeleteUniversity(universityId: string, confirmForce: boolean = true): Promise<DeleteUniversityResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/universities/${universityId}/force`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ confirmForce }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to force delete university: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error("Error force deleting university:", error);
    throw error;
  }
}
