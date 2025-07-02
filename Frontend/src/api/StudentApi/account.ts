const API_BASE_URL = "http://localhost:5000/api/student/account";

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

interface Supervisor {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  officeAddress: string;
}

interface StudentData {
  userId: string;
  fullName: string;
  email: string;
  universityEmail: string;
  password?: string;
  phoneNumber: string;
  address: string;
  role: string;
  level: string;
  department: string;
  universityId: string;
  supervisorId?: string | null;
  createdAt?: string;
  university?: University;
  supervisor?: Supervisor | null;
}

interface UpdateStudentData {
  userId: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  department?: string;
  level?: string;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const authToken = localStorage.getItem("authToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
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
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Network error"
    );
  }
}

export async function fetchStudentAccount(
  userId: string
): Promise<StudentData> {
  try {
  
    
    if (!userId) {
      throw new ApiError("User ID is required");
    }

    const url = `${API_BASE_URL}?userid=${encodeURIComponent(userId)}`;
    const studentData = await fetchWithAuth(url);
    
    localStorage.setItem("studentInfo", JSON.stringify(studentData));
    return studentData;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Failed to fetch student account");
  }
}

export async function updateStudentAccount(
  updatedData: UpdateStudentData
): Promise<StudentData> {
  try {
    if (!updatedData.userId) {
      throw new ApiError("User ID is required");
    }

    const url = `${API_BASE_URL}/${encodeURIComponent(updatedData.userId)}`;
    const data = await fetchWithAuth(url, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });

    localStorage.setItem("studentInfo", JSON.stringify(data));
    return data;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Failed to update student account");
  }
}
