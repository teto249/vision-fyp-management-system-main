const API_BASE_URL = "http://localhost:3000/api/supervisor/account";

interface University {
  id: string;
  shortName: string;
  fullName: string;
  address: string;
  email: string;
  phone: string;
  logoPath: string;
  status: string;
}

interface SupervisorData {
  userId: string;
  fullName: string;
  email: string;
  universityEmail: string;
  phoneNumber: string;
  address: string;
  contactEmail: string;
  officeAddress: string;
  department: string;
  role: string;
  profilePhoto: string | null;
  university: University;
}

interface UpdateSupervisorData {
  userId: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  contactEmail?: string;
  officeAddress?: string;
  department?: string;
  profilePhoto?: string;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
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

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : "Network error");
  }
}

export async function fetchSupervisorAccount(userId: string): Promise<SupervisorData> {
  try {
    if (!userId) {
      throw new ApiError("User ID is required");
    }

    const url = `${API_BASE_URL}?userid=${encodeURIComponent(userId)}`;
    const supervisorData = await fetchWithAuth(url);
    localStorage.setItem("supervisorInfo", JSON.stringify(supervisorData));
    return supervisorData;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Failed to fetch supervisor account");
  }
}

export async function updateSupervisorAccount(
  updatedData: UpdateSupervisorData
): Promise<SupervisorData> {
  try {
    if (!updatedData.userId) {
      throw new ApiError("User ID is required");
    }

    const response = await fetchWithAuth(API_BASE_URL, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });

    localStorage.setItem("supervisorInfo", JSON.stringify(response));
    return response;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Failed to update supervisor account");
  }
}