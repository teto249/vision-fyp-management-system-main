const API_BASE_URL = "http://localhost:3001/api/uniAdmin/users";

export interface Supervisor {
  userId: string;
  fullName: string;
  universityEmail: string;
  department: string;
  contactEmail: string;
  officeAddress: string;
  role?: "Supervisor";
}

export interface Student {
  userId: string;
  fullName: string;
  universityEmail: string;
  department: string;
  level: string;
  supervisorId?: string;
  role?: "Student";
  hasProject?: boolean;
  projectStatus?: string | null;
  projectTitle?: string | null;
  projectProgress?: number;
  project?: {
    id: string;
    projectTitle: string;
    projectType: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
  } | null;
}

export interface UsersResponse {
  supervisors: Supervisor[];
  students: Student[];
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

function isUsersResponse(data: any): data is UsersResponse {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.supervisors) &&
    Array.isArray(data.students)
  );
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const authToken = localStorage.getItem("authToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers["authorization"] = `Bearer ${authToken}`;
  } else {
    throw new ApiError("No authentication token found");
  }

  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    const errorMessage = isJson
      ? (await response.json()).message
      : response.statusText;
    throw new ApiError(errorMessage, response.status);
  }

  return isJson ? response.json() : null;
}

export async function fetchUsersByUniversity(universityId: string): Promise<UsersResponse> {
  try {
    if (!universityId) {
      throw new ApiError("University ID is required");
    }

    const url = `${API_BASE_URL}/${encodeURIComponent(universityId)}`;
    const data = await fetchWithAuth(url);

    if (!isUsersResponse(data)) {
      throw new ApiError("Invalid users response format");
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Failed to fetch users"
    );
  }
}

export async function deleteUser(userId: string, userType: 'student' | 'supervisor'): Promise<{ success: boolean; message: string }> {
  try {
    if (!userId || !userType) {
      throw new ApiError("User ID and user type are required");
    }

    const url = `http://localhost:3001/api/uniAdmin/users/${encodeURIComponent(userType)}/${encodeURIComponent(userId)}`;
    const data = await fetchWithAuth(url, {
      method: 'DELETE'
    });

    return {
      success: true,
      message: data?.message || `${userType.charAt(0).toUpperCase() + userType.slice(1)} deleted successfully`
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Failed to delete user"
    );
  }
}

export async function bulkDeleteUsers(users: Array<{ userId: string; userType: 'student' | 'supervisor' }>): Promise<{
  success: boolean;
  message: string;
  results: Array<{
    success: boolean;
    userId: string;
    userType?: string;
    fullName?: string;
    message?: string;
    error?: string;
  }>;
}> {
  try {
    if (!Array.isArray(users) || users.length === 0) {
      throw new ApiError("Users array is required and cannot be empty");
    }

    const url = `http://localhost:3001/api/uniAdmin/users/bulk`;
    const data = await fetchWithAuth(url, {
      method: 'DELETE',
      body: JSON.stringify({ users })
    });

    return {
      success: data?.success || false,
      message: data?.message || "Bulk deletion completed",
      results: data?.results || []
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Failed to delete users"
    );
  }
}
