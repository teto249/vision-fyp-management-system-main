const API_BASE_URL = "http://localhost:3000/api/admin/account";

interface Institution {
  id: string;
  shortName: string;
  fullName: string;
  address: string;
  email: string;
  phone: string;
  logoPath: string;
}

interface AdminData {
  username: string; // Changed from id
  name: string;
  email: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  profilePhoto: string | null;
  role: string;
  institution: Institution;
}

interface UpdateAdminData {
  username: string; // Changed from adminId
  adminName: string;
  adminEmail: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  profilePhoto: string | null;
  institutionData: {
    shortName: string;
    fullName: string;
    address: string;
    email: string;
    phone: string;
  };
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const authToken = localStorage.getItem("authToken") || "";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchAdminAccount(username: string): Promise<AdminData> {
  try {
    if (!username) {
      throw new Error("Username is required");
    }
    const url = `${API_BASE_URL}?username=${username}`;
    const adminData = await fetchWithAuth(url);

    if (!adminData.institution) {
      adminData.institution = {
        id: "",
        shortName: "",
        fullName: "",
        address: "",
        email: "",
        phone: "",
        logoPath: "",
      };
    }

    localStorage.setItem("adminInfo", JSON.stringify(adminData));
    return adminData;
  } catch (error) {
    console.error("Error fetching admin account:", error);
    throw error;
  }
}

export async function updateAdminAccount(updatedData: UpdateAdminData): Promise<AdminData> {
  try {
    const data = await fetchWithAuth(API_BASE_URL, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });

    localStorage.removeItem("adminInfo");
    localStorage.setItem("adminInfo", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error updating admin account:", error);
    throw error;
  }
}

export interface LoginResponse {
  token: string;
  role: string;
  message?: string;
}

export async function login(id: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      } else {
        throw new Error(`Unexpected response from the server: ${response.statusText}`);
      }
    }

    const data = await response.json();

    if (!data.token || !data.user?.role) {
      throw new Error("Invalid response from the server");
    }

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("adminInfo", JSON.stringify(data.user));

    return data;
  } catch (error: any) {
    console.error("Login error:", error.message || error);
    throw error;
  }
}

export function logout(): void {
  localStorage.removeItem("authToken");
  localStorage.removeItem("adminInfo");
  window.location.href = "/auth";
}