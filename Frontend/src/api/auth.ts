export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserInfo {
  username: string; // This will be userId for students and supervisors
  email?: string; // For MainAdmin
  primaryEmail?: string; // For UniAdmin
  universityEmail?: string; // For Students and Supervisors
  role: "MainAdmin" | "UniAdmin" | "Supervisor" | "Student";
  universityId?: string;
  level?: string; // For Students only
  fullName?: string;
  phoneNumber?: string;
  profilePhoto?: string;
}

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
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/login`,
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
      // Store token
      localStorage.setItem("authToken", data.token);

      // Determine storage key based on user role
      const storageKey = getStorageKeyByRole(data.user.role);

      // Store user info
      localStorage.setItem(storageKey, JSON.stringify(data.user));

      // Verify storage
      if (!verifyStoredData(data.token, storageKey)) {
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
 * Gets the current user's information based on role
 */
export function getCurrentUser(): UserInfo | null {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  // Try to get user info from different storage keys
  const storageKeys = ["adminInfo", "studentInfo", "supervisorInfo"];
  for (const key of storageKeys) {
    const userInfo = localStorage.getItem(key);
    if (userInfo) {
      try {
        return JSON.parse(userInfo) as UserInfo;
      } catch {
        continue;
      }
    }
  }
  return null;
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
