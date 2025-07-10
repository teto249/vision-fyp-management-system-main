export interface LoginCredentials {
  username: string;
  password: string;
}

const BASE_URL =  'http://localhost:3000';

// Base interface with common fields
export interface BaseUserInfo {
  username?: string;
  email?: string;
  role: "MainAdmin" | "UniAdmin" | "Supervisor" | "Student";
  universityId?: string;
  fullName?: string;
}

// Student-specific interface
export interface StudentUserInfo extends BaseUserInfo {
  role: "Student";
  userId: string;
  universityEmail: string;
  phoneNumber: string;
  address: string;
  level: string;
  department: string;
  supervisorId: string;
  requirePasswordChange: boolean;
  createdAt: string;
  updatedAt: string;
  university: {
    id: string;
    shortName: string;
    fullName: string;
  };
}

// Admin and Supervisor interface
export interface AdminSupervisorUserInfo extends BaseUserInfo {
  role: "MainAdmin" | "UniAdmin" | "Supervisor";
  email?: string;
  primaryEmail?: string;
  universityEmail?: string;
}

// Discriminated union type
export type UserInfo = StudentUserInfo | AdminSupervisorUserInfo;

// Update the login response type
export interface LoginResponse {
  token: string;
  message: string;
  user: UserInfo;
}

export class AuthError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Sends a login request to the backend API and handles the entire process.
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  if (!username || !password) {
    throw new AuthError("Username and password are required");
  }

  try {
    const credentials: LoginCredentials = {
      username,
      password,
    };

    const response = await fetch(
      `${BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Include cookies if using session-based auth
      }
    );

    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      if (isJson) {
        const errorData = await response.json();
        throw new AuthError(
          errorData.message || "Login failed",
          response.status,
          errorData.code
        );
      }
      throw new AuthError(
        `Login failed: ${response.statusText || "Network error"}`,
        response.status
      );
    }

    if (!isJson) {
      throw new AuthError("Invalid response format from server");
    }

    const data: LoginResponse = await response.json();

    if (!data.token || !data.user) {
      throw new AuthError("Invalid response format from server");
    }

    // Store auth data securely
    try {
      localStorage.setItem("authToken", data.token);

      if (data.user.role === "Student") {
        // Store complete student data
        const studentData = {
          ...data.user,
          lastLogin: new Date().toISOString(),
        };
        localStorage.setItem("studentInfo", JSON.stringify(studentData));
      } else {
        // Store other user types as before
        const storageKey = getStorageKeyByRole(data.user.role);
        localStorage.setItem(storageKey, JSON.stringify(data.user));
      }

      if (!verifyStoredData(data.token, getStorageKeyByRole(data.user.role))) {
        throw new Error("Failed to verify stored authentication data");
      }
    } catch (storageError) {
      console.error("Storage error:", storageError);
      throw new AuthError("Failed to save login information");
    }

    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}

// Helper functions
function getStorageKeyByRole(role: UserInfo["role"]): string {
  switch (role) {
    case "Student":
      return "studentInfo";
    case "Supervisor":
      return "supervisorInfo";
    case "MainAdmin":
    case "UniAdmin":
      return "adminInfo";
    default:
      throw new AuthError("Invalid user role");
  }
}

function verifyStoredData(token: string, storageKey: string): boolean {
  const storedToken = localStorage.getItem("authToken");
  const storedInfo = localStorage.getItem(storageKey);

  return !!(
    storedToken && storedInfo && storedToken === token
  );
}

/**
 * Logs out the user by clearing authentication data
 */
export async function logout(): Promise<void> {
  try {
    // Clear all possible auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminInfo");
    localStorage.removeItem("studentInfo");
    localStorage.removeItem("supervisorInfo");

    // Verify cleanup
    if (isAuthenticated()) {
      throw new Error("Failed to clear authentication data");
    }

    // Redirect to auth page
    window.location.href = "/auth";
  } catch (error) {
    console.error("Logout error:", error);
    window.location.href = "/auth";
  }
}

/**
 * Checks if the user is currently authenticated
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem("authToken");
  const userInfo = getCurrentUser();
  return !!(token && userInfo);
}

export interface StudentInfo extends StudentUserInfo {}

export function getStudentInfo(): StudentInfo | null {
  const studentData = localStorage.getItem("studentInfo");
  if (!studentData) return null;

  try {
    return JSON.parse(studentData) as StudentInfo;
  } catch {
    return null;
  }
}

// Type guard to check if user is student
export function isStudentUser(user: UserInfo): user is StudentUserInfo {
  return user.role === "Student";
}

// Helper function to get typed user info
export function getCurrentUser(): UserInfo | null {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  const studentInfo = localStorage.getItem("studentInfo");
  if (studentInfo) {
    const parsed = JSON.parse(studentInfo);
    if (parsed.role === "Student") {
      return parsed as StudentUserInfo;
    }
  }

  const adminInfo = localStorage.getItem("adminInfo");
  if (adminInfo) {
    return JSON.parse(adminInfo) as AdminSupervisorUserInfo;
  }

  const supervisorInfo = localStorage.getItem("supervisorInfo");
  if (supervisorInfo) {
    return JSON.parse(supervisorInfo) as AdminSupervisorUserInfo;
  }

  return null;
}
