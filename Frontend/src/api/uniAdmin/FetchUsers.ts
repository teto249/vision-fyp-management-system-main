const API_BASE_URL = "http://localhost:3000/api/uniAdmin/users";

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
  role?: "Student";
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

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
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
