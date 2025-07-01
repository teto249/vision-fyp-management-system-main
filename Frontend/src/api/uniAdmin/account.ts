const API_BASE_URL = "http://localhost:3000/api/uniAdmin/account";

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

interface UniAdminData {
  username: string;
  fullName: string;
  primaryEmail: string;
  phoneNumber: string;
  profilePhoto: string | null;
  role: string;
  university: University | null;
  universityId: string; // Added to match backend model
}

interface UpdateUniAdminData {
  username: string;
  fullName?: string;
  email?: string; // This maps to primaryEmail in backend
  phoneNumber?: string;
  profilePhoto?: string | null;
  universityData?: {
    shortName?: string;
    fullName?: string;
    address?: string;
    email?: string;
    phone?: string;
    status?: string; // Added to match backend model
  };
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

// Helper function to validate University data
function isUniversity(data: any): data is University {
  return (
    data &&
    typeof data === "object" &&
    typeof data.id === "string" &&
    typeof data.shortName === "string" &&
    typeof data.fullName === "string"
  );
}

// Helper function to validate UniAdmin data
function isUniAdminData(data: any): data is UniAdminData {
  return (
    data &&
    typeof data === "object" &&
    typeof data.username === "string" &&
    typeof data.fullName === "string" &&
    typeof data.primaryEmail === "string" &&
    typeof data.role === "string" &&
    (data.university === null || isUniversity(data.university))
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

  try {
    const response = await fetch(url, { ...options, headers });
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      const errorMessage = isJson
        ? (await response.json()).message
        : response.statusText;
      throw new ApiError(errorMessage, response.status);
    }

    const data = await response.json();

    if (!isUniAdminData(data)) {
      throw new ApiError("Invalid response format");
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Network error"
    );
  }
}

export async function fetchUniAdminAccount(
  username: string
): Promise<UniAdminData> {
  try {
    if (!username) {
      throw new ApiError("Username is required");
    }

    const url = `${API_BASE_URL}?username=${encodeURIComponent(username)}`;
    const uniAdminData = await fetchWithAuth(url);
    localStorage.setItem("adminInfo", JSON.stringify(uniAdminData));
    return uniAdminData;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Failed to fetch UniAdmin account");
  }
}

export async function updateUniAdminAccount(
  updatedData: UpdateUniAdminData
): Promise<UniAdminData> {
  try {
    if (!updatedData.username) {
      throw new ApiError("Username is required");
    }

    const data = await fetchWithAuth(API_BASE_URL, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });

    localStorage.setItem("adminInfo", JSON.stringify(data));
    return data;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Failed to update UniAdmin account");
  }
}
