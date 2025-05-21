const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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

export async function fetchUniversities(): Promise<University[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/universities`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/universities/${id}`, {
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
